
import json

from copy import deepcopy as copy
from traitlets import HasTraits, Unicode, validate, TraitError

from ._util import Util


class ParamsGoogle(HasTraits):
    """
    See Google doc https://developers.google.com/identity/protocols/OAuth2
    """

    name = Unicode()
    response_type = Unicode()
    authorize_endpoint = Unicode('https://accounts.google.com/o/oauth2/v2/auth')
    token_endpoint = Unicode('https://www.googleapis.com/oauth2/v4/token')
    tokeninfo_endpoint = Unicode('https://www.googleapis.com/oauth2/v3/tokeninfo')
    client_id = Unicode()
    client_secret = Unicode()
    redirect_uri = Unicode()
    scope = Unicode()
    state = Unicode()
    include_granted_scopes = Unicode('false')
    access_type = Unicode('online')
    scope_separator = Unicode(' ')

    def __init__(self,
                 name='Google',
                 response_type=None,
                 client_id=None,
                 client_secret=None,
                 redirect_uri=None,
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
        if client_id:
            self.client_id = client_id
        if client_secret:
            self.client_secret = client_secret
        if redirect_uri:
            self.redirect_uri = redirect_uri
        if scope:
            self.scope = scope

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
        print(proposal['value'])
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

    def build_data(self):
        """
        """
        data = {}
        for k in ['name',
                  'response_type',
                  'authorize_endpoint',
                  'tokeninfo_endpoint',
                  'token_endpoint',
                  'client_id',
                  'client_secret',
                  'redirect_uri',
                  'scope',
                  'state',
                  ]:
            v = getattr(self, k)
            if v != '':
                data[k] = v
        return data
