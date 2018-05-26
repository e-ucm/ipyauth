
import os
import json

from copy import deepcopy as copy

from ._load import load_dotenv
from ._params import Params


class ParamsGoogle(Params):
    """
    See Google doc
    https://developers.google.com/api-client-library/javascript/reference/referencedocs
    https://developers.google.com/identity/sign-in/web/reference
    """

    def __init__(self,
                 api_key=None,
                 client_id=None,
                 discovery_docs=None,
                 scope='',
                 fetch_basic_profile=True,
                 hosted_domain=None,
                 openid_realm=None,

                 dotenv_folder='.',
                 dotenv_file=None,
                 ):
        """
        """

        self._type = 'Google'

        super().__init__(dotenv_folder=dotenv_folder,
                         dotenv_file=dotenv_file,
                         prefix=self._type)

        # overrides
        if api_key:
            self.api_key = api_key
        if client_id:
            self.client_id = client_id
        if discovery_docs:
            self.discovery_docs = discovery_docs
        if scope:
            self.scope = scope
        if fetch_basic_profile:
            self.fetch_basic_profile = fetch_basic_profile
        if hosted_domain:
            self.hosted_domain = hosted_domain
        if openid_realm:
            self.openid_realm = openid_realm

        if hasattr(self, 'discovery_docs'):
            self.discovery_docs = [e.strip()
                                   for e in self.discovery_docs.split(' ') if e != '']

        self.check()

    def check(self):
        """
        """
        if hasattr(self, 'api_key'):
            url = 'https://developers.google.com/maps/documentation/javascript/get-api-key'
            msg = 'api_key must be a string, a Google API key - See {}'.format(url)
            is_api_key = isinstance(self.api_key, str)
            assert is_api_key, msg

        url = 'https://cloud.google.com/endpoints/docs/frameworks/java/creating-client-ids'
        msg = 'client_id must be a string, a client aka application id - See {}'.format(url)
        is_client_id = isinstance(self.client_id, str)
        assert is_client_id, msg

        if hasattr(self, 'discovery_docs'):
            url = 'https://developers.google.com/discovery/'
            msg = 'discovery_docs must be a string, a uri to to docs - See {}'.format(url)
            is_discovery_docs = isinstance(self.discovery_docs, list)
            assert is_discovery_docs, msg
            for e in self.discovery_docs:
                msg = 'element {} of discovery_docs must be a string - See {}'.format(e, url)
                is_discovery_docs = isinstance(e, str)
                assert is_discovery_docs, msg

        url = 'https://developers.google.com/apis-explorer'
        msg = 'scope must be a string of space separated scopes - See {}'.format(url)
        is_scope = isinstance(self.scope, str)
        assert is_scope, msg

        url = 'https://developers.google.com/identity/sign-in/web/reference'
        msg = 'fetch_basic_profile must be a boolean, True to get openid profile email - See {}'.format(
            url)
        is_fetch_basic_profile = isinstance(self.fetch_basic_profile, bool)
        assert is_fetch_basic_profile, msg

        if hasattr(self, 'hosted_domain'):
            url = 'https://developers.google.com/identity/sign-in/web/reference'
            msg = 'hosted_domain must be a string - See {}'.format(url)
            is_hosted_domain = isinstance(self.hosted_domain, str)
            assert is_hosted_domain, msg

        if hasattr(self, 'openid_realm'):
            url = 'https://developers.google.com/identity/sign-in/web/reference'
            msg = 'openid_realm must be a string - See {}'.format(url)
            is_openid_realm = isinstance(self.openid_realm, str)
            assert is_openid_realm, msg

        return True
