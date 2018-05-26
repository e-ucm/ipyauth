
import queryString from 'query-string';

import store from './widget_store';



const clearUrl = function () {
	console.log('clearUrl');

	let loc = window.location;
	var newUrl = loc.protocol + '//' + loc.host + loc.pathname;
	window.history.replaceState({ path: newUrl }, '', newUrl);
};


const readCredentialsFromUrl = function (locationSearchString) {
	console.log('readCredentialsFromUrl');

	let data = queryString.parse(locationSearchString);
	window.data = data;
	console.log('data')
	console.log(data)

	let c = {};
	for (let k in data) {
		if (['idToken', 'state'].includes(k)) {
			c[k] = JSON.parse(decodeURIComponent(data[k]));
		} else {
			c[k] = data[k];
		}
	}

	return c;
};


const handle = function () {
	console.log('handleCallback start');

	console.log('location.search');
	console.log(location.search);

	let _id;
	let _type;

	if (location.search.length > 0) {
		console.log('creds in url');

		const creds = readCredentialsFromUrl(location.search);
		_id = creds.state._id;
		store.put(_id, creds);
		clearUrl();

		// debug
		window.creds = creds;
	}
	else {
		console.log('no creds in url');
	}

	console.log('handleCallback end');

	return _id;
};

export default {
	handle
};
