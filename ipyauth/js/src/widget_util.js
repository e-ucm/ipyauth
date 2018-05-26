

const isEmptyObject = function (obj) {
	if (obj == null) {
		return true;
	}
	if (obj == undefined) {
		return true;
	}
	if (obj == '') {
		return true;
	}
	return (obj instanceof Object) && (Object.keys(obj).length === 0);
};


const isValid = function (obj) {
	if (obj == null) {
		return false;
	}
	if (obj == undefined) {
		return false;
	}
	if (obj == '') {
		return false;
	}
	return true;
};

const loadScriptAsync = function(uri) {
	return new Promise((resolve, reject) => {
	  var tag = document.createElement("script");
	  tag.src = uri;
	  tag.async = true;
	  tag.onload = () => {
		resolve();
	  };
	  var firstScriptTag = document.getElementsByTagName("script")[0];
	  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	});
  };

  
const humanTime = function (nbSec) {
	let hours = Math.floor(nbSec / 3600);
	let minutes = Math.floor((nbSec - hours * 3600) / 60);
	let seconds = nbSec - minutes * 60;
	if (hours < 10) hours = '0' + hours;
	if (minutes < 10) minutes = '0' + minutes;
	if (seconds < 10) seconds = '0' + seconds;
	return hours + ':' + minutes + ':' + seconds;
};


const show = function (variable) {
	console.log(variable.toString());
	console.log(variable);
};


const openInNewTab = function (url) {
	window.open(url, '_blank').focus();
};


export default{
	isValid,
	isEmptyObject,
	loadScriptAsync,
	humanTime,
	show,
	openInNewTab,
};
