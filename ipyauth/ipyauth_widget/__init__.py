
from ..__meta__ import __version__, version_info

from ._widget_box import Auth

from ._params_Auth0 import ParamsAuth0
from ._params_Google import ParamsGoogle


def _jupyter_nbextension_paths():
    return [{
        # fixed syntax
        'section': 'notebook',
        # path relative to module directory - here: ipyauth_widget
        'src': 'static',
        # directory in the `nbextension/` namespace
        'dest': 'ipyauth',
        # path in the `nbextension/` namespace
        'require': 'ipyauth/extension'
    }]
