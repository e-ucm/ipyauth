
import os
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join


def load_jupyter_server_extension(nb_app):
    web_app = nb_app.web_app

    web_app.settings['jinja2_env'].loader.searchpath += [
        os.path.join(os.path.dirname(__file__), 'templates'),
        # os.path.join(os.path.dirname(__file__), 'templates', 'dist'),
        # os.path.join(os.path.dirname(__file__), 'templates', 'dist', 'assets'),
    ]

    class OAuthCallbackServerExtensionHandler(IPythonHandler):
        """
        """

        def get(self, path):
            """
            """
            self.write(self.render_template(path))
            nb_app.log.info("in OAuthCallbackServerExtensionHandler with path={}".format(path))

    # class OAuthCallbackServerExtensionHandler(IPythonHandler):
    #     """
    #     """

    #     def get(self, path):
    #         """
    #         """
    #         # self.write(self.render_template('index.html', **self.application.settings))
    #         self.write(self.render_template('index.html'))
    #         nb_app.log.info("in OAuthCallbackServerExtensionHandler with path={}".format(path))

    # class OAuthCallbackAssetsServerExtensionHandler(IPythonHandler):
    #     """
    #     """
    #     def get(self, path):
    #         """
    #         """
    #         if path =='ipyauth-Auth0-creds.js':
    #             self.set_header('Cache-Control', 'no-cache')
    #         nb_app.log.info("in OAuthCallbackAssetsServerExtensionHandler with path={}".format(path))
    #         self.write(self.render_template(path))

    host_pattern = '.*$'

    # route_pattern = url_path_join(web_app.settings['base_url'], '/callback(.*)')
    # web_app.add_handlers(host_pattern, [(route_pattern, OAuthCallbackServerExtensionHandler)])

    # route_pattern = url_path_join(web_app.settings['base_url'], '/assets-callback/(.*)')
    # web_app.add_handlers(host_pattern, [(route_pattern, OAuthCallbackAssetsServerExtensionHandler)])

    route_pattern = url_path_join(web_app.settings['base_url'], '/(.*)')
    web_app.add_handlers(host_pattern, [(route_pattern, OAuthCallbackServerExtensionHandler)])

    nb_app.log.info("ipyauth callback server extension enabled")
