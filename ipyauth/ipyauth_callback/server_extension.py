
import os
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join


def load_jupyter_server_extension(nb_app):
    web_app = nb_app.web_app

    web_app.settings['jinja2_env'].loader.searchpath += [
        os.path.join(os.path.dirname(__file__), 'templates'),
        os.path.join(os.path.dirname(__file__), 'templates', 'assets'),
    ]

    class OAuthServerExtensionHandler(IPythonHandler):
        """
        """

        def get(self, path):
            """
            """
            nb_app.log.info("in OAuthServerExtensionHandler with path={}".format(path))
            self.write(self.render_template('index.html'))

    class OAuthAssetsServerExtensionHandler(IPythonHandler):
        """
        """

        def get(self, path):
            """
            """
            nb_app.log.info("in OAuthAssetsServerExtensionHandler with path={}".format(path))
            self.write(self.render_template(path))

    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    web_app.add_handlers(
        host_pattern,
        [(url_path_join(base_url, '/callback/assets/(.*)'), OAuthAssetsServerExtensionHandler),
         (url_path_join(base_url, '/callback(.*)'), OAuthServerExtensionHandler)])

    nb_app.log.info("ipyauth callback server extension enabled")
