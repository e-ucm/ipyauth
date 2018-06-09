
import os


def _build_dics():
    """
    """
    dic_filename = {
        'auth0': {'logo': 'auth0-logo.png'},
        'google': {'logo': 'google-logo.png'}}
    dic_logo = {k: os.path.join(os.path.dirname(__file__), 'img', v['logo'])
                for k, v in dic_filename.items()}
    return dic_logo


VALID_ID_PROVIDERS = ['auth0', 'google']
DIC_LOGO = _build_dics()
