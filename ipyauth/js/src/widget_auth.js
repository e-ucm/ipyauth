import store from './widget_store';
import util from './widget_util';

import authAuth0 from './widget_auth_Auth0';
import authGoogle from './widget_auth_Google';

const isLogged = function(that) {
    let logged_as = that.model.get('logged_as');

    if (util.isEmptyObject(logged_as)) {
        return false;
    }
    return true;
};

const clearWidget = function(that) {
    console.log('clearWidget');

    clearInterval(that.timer);
    let _id = that.model.get('_id');
    store.clear(_id);

    that.model.set({
        // _id: '',
        access_token: '',
        logged_as: '',
        time_to_exp: '',
        expires_at: '',
        scope: '',
    });
    that.form.btn_main.model.set_state({ description: 'Sign In' });
    that.form.logged_as.model.set({ value: '' });
    that.form.time_to_exp.model.set({ value: '' });
    that.form.expires_at.model.set({ value: '' });
    that.form.btn_inspect.model.set_state({ disabled: true });
    that.form.scope.model.set({ value: '' });
    that.model.save_changes();
};

const startCountdown = function(that, creds, login) {
    console.log('startCountdown');

    let expires_at = creds.expires_at;
    let nbSec = Math.floor((expires_at - new Date()) / 1000);
    // nbSec = 20;
    if (that.timer) {
        clearInterval(that.timer);
    }
    that.timer = setInterval(() => {
        nbSec--;
        if (nbSec >= 0) {
            let time_to_exp = util.humanTime(nbSec);
            that.model.set({ time_to_exp: time_to_exp });
            that.form.time_to_exp.model.set({ value: to_html(time_to_exp, 'time-to-exp') });
            that.model.save_changes();
        }
        if (nbSec === 0) {
            clearWidget(that);
            login(that, { renew: true, updateDisplay: updateDisplay });
        }
    }, 1000);
};

const get_idP = function(that) {
    let _type = that.model.get('_type');
    let idP;
    if (_type == 'Auth0') {
        idP = authAuth0;
    } else if (_type == 'Google') {
        idP = authGoogle;
    }
    return idP;
};

const to_html = function(str, className) {
    let css = {
        'ipyauth-text': `
			.ipyauth-text {
				background-color: white;
				text-align: center;
				line-height: 20px;
			}`,
        'ipyauth-time-to-exp': `
			.ipyauth-time-to-exp {
				background-color: white;
				padding-left: 4px;
				padding-right: 4px;
				line-height: 20px;
			}`,
        'ipyauth-scope': `
			.ipyauth-scope {
				background-color: white;
				line-height: 20px;
				padding-left: 15px;
				margin: 3px 0 3px 0;
			}`,
    };
    let new_str = str;
    if (className == 'scope') {
        let scopes = str.split(' ').filter(e => e.length > 0);
        new_str = `
		<p style='color: gray;'># ${scopes.length} Scopes Granted (scroll down)</p>`;
        for (let [k, v] of scopes.entries()) {
            new_str += `${1 + k} ${v} <br/>`;
        }
    }
    let myCSS = 'ipyauth-' + className;
    let html = `<style>${css[myCSS]}</style>
				<div class="${myCSS}">${new_str}</div>`;
    return html;
};

let updateDisplay = function(that) {
    console.log('updateDisplay');

    let idP = get_idP(that);
    let creds = idP.loadCreds(that);

    if (!util.isEmptyObject(creds)) {
        console.log('creds not empty');

        that.model.set({
            logged_as: creds.logged_as,
            expires_at: creds.expires_at.toString(),
            scope: creds.scope,
            access_token: creds.access_token,
        });
        let _signout_text = that.model.get('_signout_text');
        let expires_at = creds.expires_at.toString();

        that.form.btn_main.model.set_state({ description: _signout_text });
        that.form.logged_as.model.set({ value: to_html(creds.logged_as, 'text') });
        that.form.expires_at.model.set({ value: to_html(expires_at, 'text') });
        that.form.btn_inspect.model.set_state({ disabled: false });
        that.form.scope.model.set({ value: to_html(creds.scope, 'scope') });

        // countdonw to renew
        startCountdown(that, creds, idP.login);
    } else {
        console.log('creds is empty');

        that.form.btn_main.model.set_state({ description: 'Sign In' });
        that.form.logged_as.model.set({ value: '' });
        that.form.expires_at.model.set({ value: '' });
        that.form.time_to_exp.model.set({ value: '' });
        that.form.btn_inspect.model.set_state({ disabled: true });
        that.form.scope.model.set({ value: '' });
    }
    that.model.save_changes();
};

const login = function(that, { renew = false } = {}) {
    console.log('auth login');
    let attrs = arguments[1];

    clearWidget(that);

    let idP = get_idP(that);
    idP.login(that, { renew: renew, updateDisplay: updateDisplay });
};

const logout = function(that) {
    let idP = get_idP(that);
    idP.logout(that);
    clearWidget(that);
};

const inspect = function(that) {
    let idP = get_idP(that);
    idP.inspectToken(that);
};

export default {
    login,
    logout,
    updateDisplay,
    isLogged,
    inspect,
    clearWidget,
};
