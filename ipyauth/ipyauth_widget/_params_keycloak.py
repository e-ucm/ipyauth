
import json

from copy import deepcopy as copy
from traitlets import HasTraits, Unicode, validate, TraitError

from ._util import Util


class ParamsKeycloak(HasTraits):
    """
    See Keycloak doc https://www.keycloak.org/docs/latest/securing_apps/
    """

    name = Unicode()
    base_url = Unicode()
    realm = Unicode()
    response_type = Unicode()
    authorize_endpoint = Unicode()
    client_id = Unicode()
    redirect_uri = Unicode()
    scope = Unicode()
    access_type = Unicode()

    def __init__(self,
                 name='keycloak',
                 base_url=None,
                 realm=None,
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
        if base_url:
            self.base_url = base_url
        if realm:
            self.realm = realm
        if response_type:
            self.response_type = response_type
        if client_id:
            self.client_id = client_id
        if redirect_uri:
            self.redirect_uri = redirect_uri
        if scope:
            self.scope = scope

        self.authorize_endpoint = self.build_authorize_endpoint()

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
        if not proposal['value'] == 'id_token token':
            raise TraitError('response_type must be "id_token token"')
        return proposal['value']

    @validate('base_url')
    def _valid_base_url(self, proposal):
        """
        """
        if not Util.is_url(proposal['value']):
            raise TraitError('redirect_uri must be an url')
        return proposal['value']

    @validate('redirect_uri')
    def _valid_redirect_uri(self, proposal):
        """
        """
        if not Util.is_url(proposal['value']):
            raise TraitError('redirect_uri must be an url')
        return proposal['value']

    @validate('scope')
    def _valid_scope(self, proposal):
        """
        """
        elmts = proposal['value'].split(' ')
        if not ('profile' in elmts) and not ('openid' in elmts):
            raise TraitError('scope must contain "profile" and "openid"')
        return proposal['value']

    def build_authorize_endpoint(self):
        """
        """
        return self.base_url+'/auth/realms/'+self.realm+'/protocol/openid-connect/auth'

    def build_data(self):
        """
        """
        props_params = ['name',
                        'authorize_endpoint',
                        ]
        props_url_params = ['response_type',
                            'client_id',
                            'redirect_uri',
                            'scope',
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
