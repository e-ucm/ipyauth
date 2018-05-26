
import store from './widget_store';
import util from './widget_util';

import { cloneDeep } from 'lodash';

const isExpiredToken = function (expires_at) {
	console.log('isExpiredToken');

	if (new Date().getTime() > expires_at) {
		return true;
	}
	return false;
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

const parseJwt = function (id_token) {
	console.log('parseJwt');
	console.log(id_token);

	let base64Url = id_token.split('.')[1];
	let base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.parse(window.atob(base64));
};

const addAttrsToCreds = function (creds) {
	console.log('addAttrsToCreds');

	console.log('a');
	let expires_at = new Date(creds.expires_at);
	if (isExpiredToken(expires_at)) {
		console.log('isExpiredToken is true');
		return {};
	}
	creds.expires_at = expires_at;

	console.log('b');
	let id_token = creds.id_token;
	if (id_token && typeof id_token == 'string') {
		creds.id_token = parseJwt(creds.id_token);
	}

	console.log('c');
	let email = creds.id_token.email;
	if (util.isValid(email)) {
		creds.logged_as = email;
	}

	console.log('d');
	let name = creds.id_token.name;
	if (util.isValid(name)) {
		creds.logged_as = name;
	}

	console.log('e');
	return creds;
};

const buildCredsFromToken = function (token) {
	console.log('buildCredsFromToken');

	let creds = {};
	creds.access_token = token.access_token;
	creds.expires_at = token.expires_at;
	creds.expires_in = token.expires_in;
	creds.first_issued_at = token.first_issued_at;
	creds.id_token = token.id_token;
	creds.scope = token.scope;

	console.log(creds);
	console.log('before addAttrsToCreds');

	creds = addAttrsToCreds(creds);

	return creds;
};

const gapiLoaded = util.loadScriptAsync('https://apis.google.com/js/api.js');

const login = function (that, { renew = false, updateDisplay = null } = {}) {
	console.log('login');

	const updateDisplayLocal = updateDisplay;

	const params = that.model.get('params');
	console.log('params');
	console.log(params);

	const updateSigninStatus = function (isSignedIn) {
		console.log('start updateSigninStatus');

		if (isSignedIn) {
			console.log('creds');
			let token = gapi.auth.getToken();
			that.token = token;


			window.token = token;
			console.log(token);

			let creds = buildCredsFromToken(token);

			let _id = that.model.get('_id');
			console.log(_id);
			store.put(_id, creds);

			updateDisplayLocal(that);
		} else {
			console.log('No creds');
			logout(that);
		}
	};

	const initClient = function () {
		console.log('start initClient');
		let authData = {
			api_key: params.api_key,
			client_id: params.client_id,
			discovery_docs: params.discovery_docs,
			scope: params.scope,
			response_type: 'permission',
			prompt: 'consent',
			ux_mode: 'popup',
			fetch_basic_profile: params.fetch_basic_profile,
			hosted_domain: params.hosted_domain,
			openid_realm: params.openid_realm,
		};
		window.authData = authData;
		console.log(authData);

		if (renew) {
			let gauth = gapi.auth2.getAuthInstance();
			let isSignedIn = gauth.isSignedIn.get();
			updateSigninStatus(isSignedIn);
		}
		else {
			gapi.auth2
				.init(authData)
				.then(function () {
					console.log('callback gapi.auth2.init');
					//console.log('token');
					let gauth = gapi.auth2.getAuthInstance();
					that.gauth = gauth;
					if (gauth.isSignedIn.get()) {
						logout(that);
					}
					gauth.isSignedIn.listen(updateSigninStatus);

					window.gauth = gauth;
					console.log('gauth');

					console.log('before signIn');
					gauth.signIn();
				})
				.catch(function () {
					console.log('error in gapi.auth2.init');
				});
		}
	};

	if (renew) {
		console.log('renew = true');
		initClient();
	} else {
		console.log('renew = false');
		gapiLoaded.then(function () {
			console.log('gapi loaded');
			gapi.load('client:auth2', initClient);
		});
	}
};

const logout = function (that) {
	that.gauth.signOut();
	if (that.timer) {
		clearInterval(that.timer);
		delete that.timer;
	}
	//   that.gauth.disconnect();
};

const inspectToken = function (that) {
	let creds = cloneDeep(that.token);
	creds.id_token = parseJwt(creds.id_token);
	let json = encodeURI(JSON.stringify(creds));
	let url = `https://jsoneditoronline.org/?json=${json}`;
	util.openInNewTab(url);
};

export default {
	loadCreds,
	login,
	logout,
	inspectToken
};
