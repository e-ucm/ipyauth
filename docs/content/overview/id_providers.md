
# Providers

The following ID providers are available in **ipyauth**.

## Auth0

[Auth0](https://github.com/oschuett/appmode) is a powerful [IDaaS](https://www.webopedia.com/TERM/I/idaas-identity-as-a-service.html), extremely well documented, developer friendly, easy to customize, with an interesting free plan.

In the context of **ipyauth** it is an example of the OAuth2 3-step dance:
+ Redirect away from the notebook to the authorisation server
+ From there redirect to the OAuth2 redirect uri
+ Finally back to the origin notebook url.

_Note_: Token refresh is handled inside an iframe so no redirects need be managed by **ipyauth**.

In all steps the library uses the [Auth0 Javascript library](https://www.npmjs.com/package/auth0-js).


See the User Guide [Auth0](../guide/Auth0.html) section.

## Google

Google APIs are **very** well documented and organised and easily discoverable.  
See the [Google API Explorer](https://developers.google.com/apis-explorer).

In particular [Google Drive](https://developers.google.com/drive/api/v3/reference/) (containing [Sheets](https://developers.google.com/sheets/api/reference/rest/), [Slides](https://developers.google.com/slides/reference/rest/), etc) is a convenient - free -  data facility with manageable access rights so many people may find this resource useful.

Google [sign-in Javascript client](https://developers.google.com/api-client-library/javascript/start/start-js) can work entirely in popup & iframe. So in the context of **ipyauth** the redirect away from the notebook is not necessary and the user experience all the better.

See the User Guide [Google](../guide/Google.html) section.

