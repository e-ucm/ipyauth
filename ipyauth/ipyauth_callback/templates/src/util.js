
import queryString from 'query-string';

let redirect = (originUrl, credentials) => {
	let url = originUrl + '?' + queryString.stringify(credentials);
	window.location.replace(url);
};

let parseHash = () => {
	let hash = window.location.hash.substring(1);
	let params = {}
	hash.split('&').map(hk => {
		let temp = hk.split('=');
		params[temp[0]] = temp[1]
	});
	return params;
};

export {
	redirect,
	parseHash
};

