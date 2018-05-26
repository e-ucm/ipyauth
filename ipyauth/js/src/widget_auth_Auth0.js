
import auth0 from 'auth0-js';

import store from './widget_store';
import util from './widget_util';



const isExpiredToken = function (expires_at) {
	console.log('isExpiredToken');

	if (new Date().getTime() > expires_at) {
		return true;
	}
	return false;
};


const addAttrsToCreds = function (creds) {

	let iat = creds.idToken.iat;
	let expiresIn = creds.expiresIn;
	let expires_at = new Date(iat * 1000 + expiresIn * 1000);
	if (isExpiredToken(expires_at)) {
		return {};
	}
	creds.expires_at = expires_at;

	let accessToken = creds.accessToken;
	if (accessToken) {
		creds.access_token = accessToken;
	}

	let name = creds.idToken.name;
	if (util.isValid(name)) {
		creds.logged_as = name;
	}

	let nickname = creds.idToken.nickname;
	if (util.isValid(nickname)) {
		creds.logged_as = nickname;
	}

	let email = creds.idToken.email;
	if (util.isValid(email)) {
		creds.logged_as = email;
	}

	if (creds.state.scope == 'null') {
		creds.state.scope = null;
	}
	let requested_scopes = creds.state.scope;
	// Auth0 returns empty string if requested scopes are granted
	creds.scope = (creds.scope !== null) ? creds.scope : requested_scopes;

	return creds;
};


const loadCreds = function (that) {
	let _id = that.model.get('_id');
	let creds = store.load(_id);

	console.log('creds');
	console.log(creds);

	if (util.isEmptyObject(creds)) {
		return {};
	}

	creds = addAttrsToCreds(creds);

	return creds;
};


const buildCredsFromIframe = function (authResult) {
	console.log('buildCredentialsFromIframe');

	let creds = {};

	creds.idToken = authResult.idTokenPayload;
	creds.access_token = authResult.accessToken;
	creds.expiresIn = authResult.expiresIn;
	creds.scope = authResult.scope;
	creds.state = JSON.parse(authResult.state);

	creds = addAttrsToCreds(creds);

	return creds;
};


const login = function (that, { renew = false, updateDisplay = null } = {}) {

	console.log('login');

	const params = that.model.get('params');
	console.log('params');
	console.log(params);


	let authData = {
		domain: params.domain,
		clientID: params.client_id,
		redirectUri: params.redirect_uri,
		audience: params.audience,
		scope: 'openid profile email ' + params.scope,
		responseType: 'token id_token',
		leeway: 15,
	};
	authData.state = JSON.stringify({
		redirectUri: authData.redirectUri,
		audience: authData.audience,
		scope: authData.scope,
		originUrl: location.href,
		originType: 'Auth0',
		_id: that.model.get('_id'),
	});

	console.log('_id in login')
	console.log(that.model.get('_id'))

	if (renew) {
		console.log('starting checkSession');
		let webAuth = new auth0.WebAuth(authData);

		// IMPORTANT 
		// notebook server url e.g. http://localhost:8888 
		// must be an Auth0 client 'Allowed Web Origin'
		// if not checkSession will timeout
		webAuth.checkSession({}, function (err, authResult) {
			if (err) {
				console.log(err);
			}
			else {
				console.log('token renewed');
				let creds = buildCredsFromIframe(authResult);
				let _id = that.model.get('_id');
				store.put(_id, creds);
				updateDisplay(that);

				// debug
				window.credsIF = creds;
			}
		});
	}
	else {
		console.log('before redirect');
		console.log(authData);

		// save notebook to find widget after callback
		if (window.Jupyter && window.Jupyter.notebook){
			window.Jupyter.notebook.save_checkpoint();
		}

		// redirect
		let webAuth = new auth0.WebAuth(authData);
		webAuth.authorize();

	}

};

const logout = function (that) {
	// this is not logout as a JWT is valid until exp
};

const inspectToken = function (that) {
	let access_token = that.model.get('access_token');
	let url = 'https://jwt.io/?token=' + access_token;
	util.openInNewTab(url);
};


export default {
	loadCreds,
	login,
	logout,
	inspectToken,
};
