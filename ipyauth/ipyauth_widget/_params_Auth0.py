
import json

from copy import deepcopy as copy

from ._load import load_dotenv
from ._params import Params


class ParamsAuth0(Params):
    """
    See Auth0 doc https://auth0.com/docs/quickstart/spa/vanillajs 
    """

    def __init__(self,
                 domain=None,
                 client_id=None,
                 redirect_uri=None,
                 audience=None,
                 scope=None,
                 #  login_modal=True,
                 #  sso=True,
                 dotenv_folder='.',
                 dotenv_file=None,
                 ):
        """
        """

        self._type = 'Auth0'

        super().__init__(dotenv_folder=dotenv_folder,
                         dotenv_file=dotenv_file,
                         prefix=self._type)

        # overrides
        if domain:
            self.domain = domain
        if client_id:
            self.client_id = client_id
        if redirect_uri:
            self.redirect_uri = redirect_uri
        if audience:
            self.audience = audience
        if scope:
            self.scope = scope

        self.callback_info = {
            'id_provider': 'Auth0',
            'params': ['domain', 'client_id']
        }

        self.check()

    def check(self):
        """
        """
        url = 'https://auth0.com/docs/dashboard/dashboard-tenant-settings'
        msg = 'domain must be a string, an Auth0 domain or tenant - See {}'.format(url)
        is_domain = isinstance(self.domain, str)
        assert is_domain, msg

        url = 'https://auth0.com/docs/applications'
        msg = 'client_id must be a string, a client aka application id - See {}'.format(url)
        is_client_id = isinstance(self.client_id, str)
        assert is_client_id, msg

        url = 'https://auth0.com/docs/users/redirecting-users'
        msg = 'redirect_uri must be a string, a redirect uri - See {}'.format(url)
        is_redirect_uri = isinstance(self.redirect_uri, str)
        assert is_redirect_uri, msg

        url = 'https://auth0.com/docs/tokens/access-token'
        msg = 'redirect_uri must be a string, a redirect uri - See {}'.format(url)
        is_audience = isinstance(self.audience, str)
        assert is_audience, msg

        url = 'https://auth0.com/docs/scopes/current'
        msg = 'scope must be a string of space separated scopes - See {}'.format(url)
        is_scope = isinstance(self.scope, str)
        assert is_scope, msg

        return True
