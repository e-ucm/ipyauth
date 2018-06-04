
import os


def _build_dics():
    """
    """
    dic_filename = {
        'Auth0':
        {'logo': 'auth0-logo.png',
         'signout_text': 'Clear',
         },
        'Google':
        {'logo': 'google-logo.png',
         'signout_text': 'Sign Out'
         }}
    dic_logo = {k: os.path.join(os.path.dirname(__file__), 'img', v['logo'])
                for k, v in dic_filename.items()}
    dic_signout_text = {k: v['signout_text']
                        for k, v in dic_filename.items()}
    return dic_logo, dic_signout_text


VALID_ID_PROVIDERS = ['Auth0', 'Google']
DIC_LOGO, DIC_SIGNOUT_TEXT = _build_dics()
