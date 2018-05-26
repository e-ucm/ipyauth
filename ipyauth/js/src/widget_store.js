


const browserStorage = sessionStorage;

let storageName = function (_id, name) {
	return 'ipyauth-' + _id + '-' + name;
};

let storageGet = function (_id, name) {
	return browserStorage.getItem(storageName(_id, name));
};

let storagePut = function (_id, name, value) {
	browserStorage.setItem(storageName(_id, name), value);
};

let storageClear = function (_id, name) {
	browserStorage.removeItem(storageName(_id, name));
};

let put = function (_id, creds) {
	console.log('put');

	storagePut(_id, 'creds', JSON.stringify(creds));

	// for (let k in creds) {
	// 	// console.log(k);
	// 	let value;
	// 	if (creds[k] instanceof Date) {
	// 		// console.log('is  Date');
	// 		value = creds[k].toString();
	// 	}
	// 	else if (creds[k] instanceof Object) {
	// 		// console.log('is  Object');
	// 		value = JSON.stringify(creds[k]);
	// 	} else {
	// 		// console.log('is ok for direct storage');
	// 		value = creds[k];
	// 	}
	// 	storagePut(_id, k, value);
	// }
};



let clear = function (_id) {
	console.log('clear');

	// let arr = [
	// 	'access_token',
	// 	'expires_at',
	// 	'expiresIn',
	// 	'granted_scopes',
	// 	'idToken',
	// 	'name',
	// 	'scope',
	// 	'state'];
	// for (let k of arr) {
	// 	storageClear(_id, k);
	// }

	storageClear(_id, 'creds');
};


let load = function (_id) {
	console.log('load');

	// if (!isValidCredentials(_id)) {
	// 	clear(_id);
	// 	return {};
	// }
	let creds = JSON.parse(storageGet(_id, 'creds'));


	// let creds = {
	// 	access_token: storageGet(_id, 'access_token'),
	// 	granted_scopes: storageGet(_id, 'granted_scopes'),
	// 	expires_at: new Date(storageGet(_id, 'expires_at')),
	// 	idToken: JSON.parse(storageGet(_id, 'idToken')),
	// 	name: storageGet(_id, 'name'),
	// 	state: JSON.parse(storageGet(_id, 'state')),
	// };
	return creds;
};


export default {
	put,
	load,	
	clear,
};
