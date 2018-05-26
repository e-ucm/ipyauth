
import os
import json

from copy import deepcopy as copy

from ._load import load_dotenv


class Params:
    """
    Generic auth provider params
    """

    def __init__(self,
                 dotenv_folder='.',
                 dotenv_file=None,
                 prefix=None):
        """
        """

        self.dotenv_folder = dotenv_folder
        self.dotenv_file = dotenv_file
        self.prefix = prefix

        self.load_dotenv()

        # for k, v in self.__dict__.items():
        #     print(k, v)

    def load_dotenv(self):
        """
        """
        dic = load_dotenv(self.dotenv_folder,
                          self.dotenv_file,
                          prefix=self.prefix)

        for k, v in dic.items():
            setattr(self, k, v)

    def to_dict(self):
        d = copy(self.__dict__)
        d = {k: v for k, v in d.items() if v is not None}
        return d

    def pprint(self, indent=2):
        d = json.dumps(self.to_dict(), sort_keys=True, indent=indent)
        print(d)

    def __repr__(self):
        return str(self.to_dict())
