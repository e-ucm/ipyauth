
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
                 name='google',
                 response_type=None,
                 client_id=None,
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
        if 'response_type' not in dic:
            self.response_type = response_type
        if 'client_id' not in dic:
            self.client_id = client_id
        if 'redirect_uri' not in dic:
            self.redirect_uri = redirect_uri
        if 'scope' not in dic:
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

    @validate('scope')
    def _valid_scope(self, proposal):
        """
        """
        elmts = proposal['value'].split(' ')
        if not ('profile' in elmts) and not ('openid' in elmts):
            raise TraitError('scope must contain "profile" and "openid"')
        return proposal['value']


    def build_data(self):
        """
        """
        props_params = ['name',
                        'authorize_endpoint',
                        'tokeninfo_endpoint',
                        'token_endpoint',
                        ]
        props_url_params = ['response_type',
                            'client_id',
                            'client_secret',
                            'redirect_uri',
                            'scope',
                            'state',
                            ]

        data = {}
        for k in props_params:
            v = getattr(self, k)
            if v != '':
                data[k] = v

        data_url = {}
        for k in props_url_params:
            v = getattr(self, k)
            if v != '':
                data_url[k] = v

        data['url_params'] = data_url

        return data
