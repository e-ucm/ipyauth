import util from './widget_util';
import provider from './widget_id_providers';

const ipyauthHistory = [];

const startAuthFlowInIframe = (authUrl, readMessage) => {
    window.addEventListener('message', readMessage);
    document.getElementById('auth').src = authUrl;
};

const startAuthFlowInPopup = (authUrl, name, readMessage, windowProps = null) => {
    window.addEventListener('message', readMessage);

    let props = windowProps;
    if (!props) {
        props = {
            menubar: 'yes',
            location: 'no',
            resizable: 'yes',
            scrollbars: 'yes',
            status: 'yes',
            width: '660',
            height: '790',
        };
    }
    props = util.buildWindowProps(props);
    const ref = window.open(authUrl, name, props);
    return ref;
};

function startAuthFlow(that, mode, prompt) {
    console.log('start startAuthFlow');
    const isIframeMode = mode === 'iframe';
    const paramsModel = that.model.get('params');
    const IdProviderName = paramsModel.name;

    console.log(`name=${IdProviderName}, isIframeMode=${isIframeMode}`);

    // build params
    window.provider = provider;
    window.IdProviderName = IdProviderName;

    const paramsFull = Object.assign({}, provider[IdProviderName], paramsModel);
    util.debug('paramsFull', paramsFull);

    const params = util.buildParams(paramsFull, IdProviderName, isIframeMode, prompt);
    util.debug('params', params);

    // build authorize url
    const authUrl = util.buildAuthorizeUrl(params);
    util.debug('authUrl', authUrl);

    // build readmessage function
    that.params = params;
    const readMessage = buidReadMessage(that);
    // util.debug('readMessage', readMessage);

    util.logAuthFlow(ipyauthHistory, IdProviderName, mode, prompt);

    if (isIframeMode) {
        startAuthFlowInIframe(authUrl, readMessage);
    } else {
        const popupWindowRef = startAuthFlowInPopup(authUrl, IdProviderName, readMessage);
        window.popupWindowRef = popupWindowRef;
    }
}

const buidReadMessage = that => {
    // triggered upon receiving message from callback page
    console.log('start buidReadMessage');

    const { params } = that;

    const readMessage = event => {
        console.log('msg received');

        window.removeEventListener('message', readMessage);
        util.debug('event.data', event.data);

        // extract data from message
        const { data } = event;
        window.data = data;

        if (util.isPopup(data.state)) {
            popupWindowRef.close();
        }

        if (data.statusAuth === 'ok') {
            // no error in callback page
            params.isValid(params, data).then(([isValid, creds]) => {
                console.log('in callback');
                util.debug('creds', creds);
                if (isValid) {
                    that.creds = creds;
                    const objCreds = util.buildObjCreds(params, creds);

                    updateDisplay(that, objCreds);

                    // display('You are authenticated.', 'authStatus', true);
                    // display(`Timestamp: ${new Date().toJSON()}`, 'authStatus');
                    // display(JSON.stringify(objCreds), 'authStatus');

                    // debug
                    // window.creds = creds;
                    // window.params = params;
                    // window.objCreds = objCreds;

                    // util.debug('objCreds.isExpired()', objCreds.isExpired());
                    // util.debug('objCreds.getSecondsToExp()', objCreds.getSecondsToExp());
                    // util.debug(
                    //     'objCreds.getSecondsToExp(HMS=true)',
                    //     objCreds.getSecondsToExp(true)
                    // );
                    // util.debug('objCreds.getUsername()', objCreds.getUsername());
                    // util.debug('objCreds.getExpiry()', objCreds.getExpiry());
                } else {
                    console.log('Error in authentication');
                    alert('Error in authentication');

                    // display('Error in authentication', 'authStatus', true);
                    // display(`Timestamp: ${new Date().toJSON()}`, 'authStatus');
                    // display(JSON.stringify(data), 'authStatus');
                }
            });
        }

        if (data.statusAuth === 'error') {
            // error in callback page
            console.log('in error');
            const lastLog = getLastLog(ipyauthHistory, IdProviderName);
            util.debug('lastLog', lastLog);
            if (lastLog) {
                const lastLogWasIframe = lastLog.mode === 'iframe' && lastLog.prompt === 'none';
                util.debug('lastLogWasIframe', lastLogWasIframe);
                if (lastLogWasIframe) {
                    console.log('Start new auth flow from stage1');
                    newAuthFlow = [lastLog.name, 'popup', 'consent'];
                    startAuthFlow(...newAuthFlow);
                    return;
                }
            }
        }
    };

    return readMessage;
};

const login = that => startAuthFlow(that, 'iframe', 'none');

const updateDisplay = (that, objCreds) => {
    // window.creds = objCreds;
    console.log('start updateDisplay');

    that.model.set({
        logged_as: objCreds.username,
        expires_at: objCreds.expiry.toString(),
        scope: objCreds.scope,
        access_token: objCreds.access_token,
    });

    that.form.btn_main.model.set_state({ description: 'Clear' });
    that.form.logged_as.model.set({ value: util.toHtml(objCreds.username, 'text') });
    that.form.expires_at.model.set({ value: util.toHtml(objCreds.expiry.toString(), 'text') });
    that.form.btn_inspect.model.set_state({ disabled: false });
    that.form.scope.model.set({
        value: util.toHtml(objCreds.scope, 'scope', objCreds.scope_separator),
    });

    // save state
    that.model.save_changes();

    // countdonw to renew
    startCountdown(that, objCreds);
};

const startCountdown = (that, objCreds) => {
    console.log('start startCountdown');

    // const { expires_at } = objCreds;
    // let nbSec = Math.floor((expires_at - new Date()) / 1000);
    let nbSec = objCreds.getSecondsToExp();
    if (that.timer) {
        clearInterval(that.timer);
    }
    that.timer = setInterval(() => {
        nbSec -= 1;
        if (nbSec >= 0) {
            const time_to_exp = util.toHMS(nbSec);
            that.model.set({ time_to_exp });
            that.form.time_to_exp.model.set({ value: util.toHtml(time_to_exp, 'time-to-exp') });
            // save state
            that.model.save_changes();
        }
        if (nbSec === 0) {
            clear(that);
            login(that);
        }
    }, 1000);
};

const clear = that => {
    console.log('stat clear');

    clearInterval(that.timer);

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

    // save state
    that.model.save_changes();
};

const { isLogged } = util;

const inspectJwt = token => {
    const url = `https://jwt.io/?token=${token}`;
    util.openInNewTab(url);
};

const inspect = that => {
    const creds = Object.assign({}, that.creds);
    if (creds.id_token) {
        // exception: breaks url encoding
        delete creds.id_token.picture;
    }
    if (that.params.isJWT) {
        inspectJwt(creds.access_token);
        creds.access_token = util.parseJwt(creds.access_token);
    }
    const json = encodeURI(JSON.stringify(creds));
    const url = `https://jsoneditoronline.org/?json=${json}`;
    util.openInNewTab(url);
};

export default {
    login,
    clear,
    isLogged,
    inspect,
};
