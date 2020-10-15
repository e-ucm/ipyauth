
import json
import requests as rq

from authlib.jose import JsonWebToken
from authlib.jose import JsonWebSignature
from authlib.jose import JsonWebKey

from .config import JWTKS_URL


class JWTKS:
    """
    """

    def __init__(self,
                 verbose=False):
        """
        """
        r = rq.get(JWTKS_URL)
        try:
            self.keySet = JsonWebKey.import_key_set(r.content.decode('utf-8'))
        except:
            raise Exception('Cannot download JWT key set from {}'.format(JWTKS_URL))
        if verbose:
            print('>> JWTKS loaded from {}'.format(JWTKS_URL))

    def decode_token_rs256(self,
                           token,
                           audience,
                           verbose=False):
        """
        See https://auth0.com/docs/jwks
        """

        jwt = JsonWebToken(['RS256'])
        claims_options = {
            "aud" : {
                "essential": True,
                "values": [audience]
            }
        }
        token_info = jwt.decode(token, self.keySet, claims_options=claims_options)
        print('>> token_info:')
        print(token_info)
        token_info.validate()

        if verbose:
            print('>> token_info:')
            print(token_info)
        return token_info
