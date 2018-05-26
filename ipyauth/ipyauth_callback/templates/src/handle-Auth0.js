
import auth0 from 'auth0-js';
import { redirect } from './util';

let buildCredentials = (authResult) => {

	// delete authResult.idTokenPayload.picture;

	let res = {
		accessToken: authResult.accessToken,
		expiresIn: authResult.expiresIn,
		idToken: encodeURIComponent(JSON.stringify(authResult.idTokenPayload)),
		scope: authResult.scope,
		state: authResult.state,
	};

	if (authResult.idTokenPayload.name !== undefined) {
		res.name = authResult.idTokenPayload.name;
	}

	return res;
};


let handleCallback = function (originUrl) {

	console.log('variables from creds-Auth0.js');
	console.log('Auth0_domain =' + Auth0_domain);
	console.log('Auth0_client_id =' + Auth0_client_id);

	const webAuth = new auth0.WebAuth({
		domain: Auth0_domain,
		clientID: Auth0_client_id,
	});

	webAuth.parseHash({}, function (err, authResult) {

		if (authResult && authResult.accessToken && authResult.idToken) {
			const creds = buildCredentials(authResult);
			redirect(originUrl, creds);

		}
		else if (err) {
			alert('Error:\nCheck the console for further details.');
			console.log('Authentication error');
			console.log(err);
		}
	});

};

export default handleCallback;
