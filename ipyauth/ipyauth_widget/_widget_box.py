
import os
import json
import string
import site

import random as rd
import ipywidgets as wg

from dotenv.main import dotenv_values

from IPython.display import display
from traitlets import observe, Unicode, Dict, Int, Bool

from ..__meta__ import __version_js__
from ._config import DIC_LOGO, DIC_SIGNOUT_TEXT
from ._params import Params

semver_range_frontend = '~' + __version_js__


class Auth(wg.VBox):
    """
    Auth widget made of ipywidgets
    """
    _model_name = Unicode('AuthModel').tag(sync=True)
    _view_name = Unicode('AuthView').tag(sync=True)
    _model_module = Unicode('ipyauth').tag(sync=True)
    _view_module = Unicode('ipyauth').tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    _view_module_version = Unicode(semver_range_frontend).tag(sync=True)

    _type = Unicode('').tag(sync=True)
    _id = Unicode('').tag(sync=True)
    _signout_text = Unicode('').tag(sync=True)

    params = Dict({}).tag(sync=True)

    # logged = Bool(False).tag(sync=True)
    access_token = Unicode('').tag(sync=True)
    scope = Unicode('').tag(sync=True)
    logged_as = Unicode('').tag(sync=True)
    time_to_exp = Unicode('').tag(sync=True)
    expires_at = Unicode('').tag(sync=True)

    _click_signout = Int(0).tag(sync=True)

    def __init__(self,
                 params=None,
                 verbose=False):
        """
        """
        msg = 'params must be a Params object'
        assert isinstance(params, Params), msg

        dic = {}
        uuid = ''.join([rd.choice(string.ascii_lowercase) for n in range(6)])

        self.params = params.to_dict()
        self._type = self.params['_type']
        self._id = self._type + '-' + uuid
        self._signout_text = DIC_SIGNOUT_TEXT[self._type]

        wg_logo = self.build_widget_logo()
        wg_button_main = self.build_widget_button_main()
        wg_logged_as = self.build_widget_logged_as()
        wg_time_to_exp = self.build_widget_time_to_exp()
        wg_expire_at = self.build_widget_expire_at()
        wg_button_inspect = self.build_widget_button_inspect()
        wg_scope = self.build_widget_scope()

        b1 = wg.HBox([wg_logo,
                      wg_button_main,
                      wg_logged_as,
                      wg_time_to_exp,
                      wg_expire_at,
                      wg_button_inspect,
                      ]
                     )
        b2 = wg.HBox([wg_scope])

        super().__init__([b1, b2])

        if 'callback_info' in self.params:
            self.create_callback_creds_file(self.params['callback_info'])


    def build_widget_logo(self):
        """
        """
        path_img = DIC_LOGO[self._type]
        with open(path_img, 'rb') as f:
            image = f.read()

        widget = wg.Image(
            value=image,
            format='png',
            layout=wg.Layout(
                max_height='26px',
                margin='3px',
                align_self='center'),
        )
        return widget

    def build_widget_button_main(self):
        """
        """
        widget = wg.Button(
            description='Sign In',
            button_style='info',
            layout=wg.Layout(width='90px',
                             margin='0 5px 0 5px',
                             align_self='center'),
        )
        widget.style.button_color = '#4885ed'
        return widget

    def build_widget_button_inspect(self):
        """
        """
        widget = wg.Button(
            description='Inspect',
            button_style='',
            layout=wg.Layout(width='90px',
                             margin='0 0 0 5px',
                             align_self='center'),
        )
        return widget

    def build_widget_logged_as(self):
        """
        """
        widget = wg.HTML(
            layout=wg.Layout(
                width='275px',
                border='1px lightgray solid',
                padding='3px',
                overflow_x='auto')
        )
        return widget

    def build_widget_time_to_exp(self):
        """
        """
        widget = wg.HTML(
            layout=wg.Layout(
                width='70px',
                border='1px lightgray solid',
                padding='5px 3px 3px 5px')
        )
        return widget

    def build_widget_expire_at(self):
        """
        """
        widget = wg.HTML(
            layout=wg.Layout(
                width='300px',
                # max_height='28px',
                border='1px lightgray solid',
                padding='5px 3px 3px 5px')
        )
        return widget

    def build_widget_scope(self):
        """
        """
        widget = wg.HTML(
            layout=wg.Layout(
                overflow_y='scroll',
                border='1px lightgray solid ',
                width='827px',
                height='47px',
                margin='5px 0 0 5px'
            )
        )
        return widget

    def show(self):
        """
        """
        for attr in ['_type',
                     '_id',
                     'params',
                     'logged_as',
                     'time_to_exp',
                     'expires_at',
                     'scope',
                     'access_token',
                     ]:
            print('{} = {}'.format(attr, getattr(self, attr)))

    def clear(self):
        """
        """
        self._click_signout += 1


    def create_callback_creds_file(self, dic_attr):
        """
        method called to create file creds-IdProvider.js
        under ipyauth_callback/templates/dist/assets
        to allow callbackk page access to credentials
        listed in li_attr
        """
        id_provider = dic_attr['id_provider']
        li_param = dic_attr['params']


        path_site_packages = site.getsitepackages()[0]
        path_package = os.path.join(path_site_packages, 'ipyauth')
        path_package_link = os.path.join(path_site_packages, 'ipyauth.egg-link')

        if os.path.exists(path_package):
            # installed package
            path_file_creds = os.path.join(path_package,
                                           'ipyauth_callback',
                                           'templates',
                                           'dist',
                                           'assets',
                                           'creds-{}.js'.format(id_provider))
        elif os.path.exists(path_package_link):
            # dev install i.e. linked
            with open(path_package_link, 'r') as f:
                content = f.read()
            path_package_read = content.split('\n')[0].strip()
            path_file_creds = os.path.join(path_package_read,
                                           'ipyauth',
                                           'ipyauth_callback',
                                           'templates',
                                           'dist',
                                           'assets',
                                           'creds-{}.js'.format(id_provider))
        else:
            raise Exception('Cannot find package path')

        with open(path_file_creds, 'w') as f:
            lines = ["const {}_{}='{}';".format(id_provider, p, self.params[p])
                     for p in li_param]
            content = '\n'.join(lines)
            f.write(content)
