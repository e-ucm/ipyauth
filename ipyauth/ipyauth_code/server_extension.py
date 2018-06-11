
import json
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join


def load_jupyter_server_extension(nb_app):

    class NewSecretHandler(IPythonHandler):
        """
        """

        def post(self):
            """
            """
            nb_app.log.info("in NewSecretHandler POST")

            args = self.request.arguments
            print(args)

            self.write(json.dumps({'toto': 22}))
            self.flush()

        def get(self):
            """
            """
            # nb_app.log.info("in NewSecretHandler with path={}".format(path))
            nb_app.log.info("in NewSecretHandler GET")
            self.write('Bonjour')
            self.flush()

    class CodeForTokenHandler(IPythonHandler):
        """
        """

        def post(self):
            """
            """
            nb_app.log.info("in CodeForTokenHandler POST")
            self.write('Bonjour2')

    web_app = nb_app.web_app
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    web_app.add_handlers(
        host_pattern,
        [(url_path_join(base_url, r'/oauth/token'), CodeForTokenHandler),
         (url_path_join(base_url, r'/oauth/secret'), NewSecretHandler),
         ])

    nb_app.log.info("ipyauth code server extension enabled")
