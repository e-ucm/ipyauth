
import json

from copy import deepcopy as copy
from traitlets import HasTraits, Unicode, validate, TraitError

from ._util import Util


class ParamsAuth0(HasTraits):
    """
    See Auth0 doc https://auth0.com/docs/api/authentication#authorize-application
    """

    name = Unicode()
    response_type = Unicode()
    domain = Unicode()
    client_id = Unicode()
    client_secret = Unicode()
    redirect_uri = Unicode()
    audience = Unicode()
    scope = Unicode()
    nonce = Unicode()
    state = Unicode()
    authorize_endpoint = Unicode()
    token_endpoint = Unicode()
    acr_values = Unicode('L1')
    scope_separator = Unicode(' ')

    def __init__(self,
                 name='Auth0',
                 response_type=None,
                 domain=None,
                 client_id=None,
                 client_secret=None,
                 redirect_uri=None,
                 audience=None,
                 scope=None,

                 dotenv_folder='.',
                 dotenv_file=None,
                 ):
        """
        """
        dic = Util.load_dotenv(dotenv_folder,
                               dotenv_file,
                               name)

        for k, v in dic.items():
            setattr(self, k, v)

        self.name = name

        # overrides
        if response_type:
            self.response_type = response_type
        if domain:
            self.domain = domain
        if client_id:
            self.client_id = client_id
        if client_secret:
            self.client_secret = client_secret
        if redirect_uri:
            self.redirect_uri = redirect_uri
        if audience:
            self.audience = audience
        if scope:
            self.scope = scope

        self.authorize_endpoint = self.build_authorize_endpoint()
        self.token_endpoint = self.build_token_endpoint()

        self.data = self.build_data()

    def to_dict(self):
        """
        """
        d = copy(self.__dict__)
        d = {k: v for k, v in d.items() if v is not None}
        return d

    def __repr__(self):
        """
        """
        return json.dumps(self.data, sort_keys=False, indent=2)

    @validate('response_type')
    def _valid_response_type(self, proposal):
        """
        """
        if not proposal['value'] in ['token', 'code']:
            raise TraitError('response_type must be "token" or "code"')
        return proposal['value']

    @validate('redirect_uri')
    def _valid_redirect_uri(self, proposal):
        """
        """
        if not Util.is_url(proposal['value']):
            raise TraitError('redirect_uri must be an https url')
        return proposal['value']

    def build_authorize_endpoint(self):
        """
        """
        return 'https://'+self.domain+'/authorize'

    def build_token_endpoint(self):
        """
        """
        return 'https://'+self.domain+'/token'

    def build_data(self):
        """
        """
        data = {}
        for k in ['name',
                  'response_type',
                  'authorize_endpoint',
                  'client_id',
                  'client_secret',
                  'redirect_uri',
                  'audience',
                  'scope',
                  'nonce',
                  'state',
                  ]:
            v = getattr(self, k)
            if v != '':
                data[k] = v
        return data
