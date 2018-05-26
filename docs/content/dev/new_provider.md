
# New provider

## Procedure

To add a new provider:
+ Pick a name for the new provider say [Name].
+ Add a new `widget_auth_[Name].js` file in the `js/src/` folder that implements the following functions, based on the Auth0 and Google examples:
    + `login()`
    + `logout()`
    + `inspect()`
+ Update the function `get_idP()` to add the new provider.
+ Add a `_param_[Name].py` to capture and validate the params required for the new provider based on the other 2 examples.
+ If the provider requires instance info for the callback add the new source `/assets-callback/creds-[Name].js` in the `ipyauth_callback/template/top.html` file and add the relevant property `callback_info` in `_param_[Name].py`.
+ If the provider uses a callback, add a `handle_[Name].js` in `ipyauth_callback/templates/src/` folder to unpack the query string returned by the authorization server, based on the Auth0.
+ Add a demo notebook in the `notebooks/` folder.

Then test and [publish](../dev/publish.html) the package.

## Candidates

+ [Github](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow)
+ [Gitlab](https://docs.gitlab.com/ee/api/oauth2.html)
+ [Facebook](https://developers.facebook.com/docs/facebook-login/web)
+ Corporate ID providers

