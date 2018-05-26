

import { parseHash } from './util';
import handleCallbackAuth0 from './handle-Auth0';


console.log('callback ipyauth');

const validOriginTypes = ['Auth0', 'Google'];

let handleAuthentication = () => {

	let hashParams = parseHash();
	console.log('hashParams');
	console.log(hashParams);

	let state = JSON.parse(decodeURIComponent(hashParams.state));
	let originUrl = state.originUrl;
	let originType = state.originType;
	window.state = state;

	if (!(originUrl.startsWith(window.origin))) {
		console.log('Wrong originUrl');
		alert('Error:\nCheck the console for further details.');
	}


	if (validOriginTypes.includes(originType)) {

		if (originType == 'Auth0') {
			handleCallbackAuth0(originUrl);
		}
		else if (originType == 'Google') {
			// not implemented as gapi does it all in the gapi.js
		}
	}
	else {
		console.log(`Invalid type: ${originType} not in ${validOriginTypes}`);
		alert('Error:\nCheck the console for further details.');
	}

};

handleAuthentication();


