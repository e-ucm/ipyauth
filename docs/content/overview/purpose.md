
# Purpose

### Why ?

The goal of this [ipywidget](https://ipywidgets.readthedocs.io/en/latest/) is to allow a notebook user to authenticate with third party ID providers without storing secrets, like a regular SPA, so as to be able to tap protected APIs.  

Indeed Jupyter notebooks are the ideal platform to tap APIs when flexibility is required, as they combine 2 useful capacities:
+ Web page for OAuth2 authentication
+ Python scripting for data manipulation, HTTP requests, postprocessing and visualization

For a more developed case for the **Jupyter notebook as the ultimate "API for Humans" tookit**, read this [article](TBD).

### How ?

This library contains a [custom ipywidget](https://blog.jupyter.org/authoring-custom-jupyter-widgets-2884a462e724) and a [notebook server extention](https://jupyter-notebook.readthedocs.io/en/stable/extending/handlers.html#writing-a-notebook-server-extension).

The ipywidget has 2 parts:
+ The Python part: It validates user input and exposes the access token and its characteristics (scopes, expiry date)
+ The Javascript part: It performs the authentication as an SPA does. The credentials obtained are synchronized to the Python part via the [ipywidget standard mechanism](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Low%20Level.html#Synchronized-state).

The server extension is a new endpoint `/callback` that is used to receive the redirection from the authentication server. In essence it reads the query string which contains the credentials minted by the authentication server, extracts from the initial notebook url (sent within the [OAuth2 state](https://auth0.com/docs/protocols/oauth2/oauth-state) variable), makes sure this url is of the same domain as the notebook server and redirect to the notebook url.

However, even though the canonical OAuth2 implicit flow involves a 3-redirection mechanism:
+ away from the initial url to the authorisation server, upon the sign-in click
+ back to the callback url, after typing login/password and granting requested scopes
+ back to the initial url, automatically

some ID providers provide SDKs that perform the flow in a popup and/of hidden iframes. In this case the server extension is not necessary.

This library is designed to be quite generic and easy to extend to various ID providers, whether they require a redirection or work in popups/iframes.  
It is essentially a wrapper on third party authentication Javascript SDKs as it is simpler and probably safer to re-use what trustworthy parties have engineered. However it is possible to write the flow manually too. The main benefit of SDKs is the token refresh which they typically handle under the hood.


### Comparison

Certainly ID providers already propose their SDKs. **This library does not intend to be a substitute but a wrapper**. Its goal to the leverage them but free the notebook user from their interface once authentication is performed.

Some Python packages also exist to perform OAuth2 authentication and they usually work by starting a web server to capture the callback containing the credentials. But they are often hacky and seldom handle silent token refresh.  
Anyway the [OAuth2 implicit flow was designed for SPAs](https://auth0.com/docs/api-auth/which-oauth-flow-to-use), so it seems more robust and safer to use it in the intented context, and then pass the result to the Python kernel via the ipywidget mechanism.

