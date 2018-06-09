const debug = (name, variable) => {
    console.log(name);
    console.log(JSON.stringify(variable));
};

const isLogged = that => {
    const logged_as = that.model.get('logged_as');

    if (isEmptyObject(logged_as)) {
        return false;
    }
    return true;
};

const isEmptyObject = obj => {
    if (obj == null) {
        return true;
    }
    if (obj === undefined) {
        return true;
    }
    if (obj === '') {
        return true;
    }
    return obj instanceof Object && Object.keys(obj).length === 0;
};

const createNonce = () => {
    const letters = [...Array(26)].map((q, w) => String.fromCharCode(w + 97));
    const N = 10;

    let nonce = [];
    let rand;
    for (let i = 0; i < N; i += 1) {
        rand = letters[Math.floor(Math.random() * letters.length)];
        nonce.push(rand);
    }
    nonce = nonce.join('');
    return nonce;
};

const toHMS = n_sec => {
    let hours = Math.floor(n_sec / 3600);
    let minutes = Math.floor((n_sec - hours * 3600) / 60);
    let seconds = n_sec - hours * 3600 - minutes * 60;

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
};

const serialize = obj => {
    const elmts = Object.entries(obj).map(i => [i[0], encodeURIComponent(i[1])].join('='));
    return elmts.join('&');
};

const isPopup = state => {
    const data = state.split(',');
    return data.includes('popup');
};

const buildObjCreds = (params, creds) => {
    const obj = Object.assign({}, creds);

    obj.name = params.name;
    obj.scope_separator = params.scope_separator;

    obj.getSecondsToExp = function(HMS = false) {
        try {
            const exp = this.expiry;
            const now = new Date();
            const n_sec = parseInt((exp - now) / 1000, 10);
            return HMS ? toHMS(n_sec) : n_sec;
        } catch (e) {
            return -1;
        }
    };

    obj.isExpired = function() {
        const secondsToExp = this.getSecondsToExp();
        return secondsToExp <= 0;
    };
    return obj;
};

const buildWindowProps = objProps => {
    const strProps = Object.entries(objProps)
        .map(e => `${e[0]} = ${e[1]}`)
        .join(',');
    return strProps;
};

const buildUrlParams = (paramsFull, isIframeMode, prompt, randomNonce = true) => {
    const url_params = Object.assign({}, paramsFull.url_params);

    if (randomNonce && url_params.nonce) {
        url_params.nonce = createNonce();
    }

    url_params.state = [paramsFull.name, isIframeMode ? 'iframe' : 'popup'].join(',');

    if (prompt) {
        url_params.prompt = prompt;
    }
    if (isIframeMode) {
        url_params.prompt = 'none';
    }

    return url_params;
};

const buildAuthorizeUrl = paramsFull => {
    const url_params = Object.assign({}, paramsFull.url_params);

    const paramsEncoded = serialize(url_params);
    const authUrl = `${paramsFull.authorize_endpoint}?${paramsEncoded}`;
    return authUrl;
};

const getIdProviderFromState = state => {
    if (!state) return null;
    return state.split(',')[0];
};

const logAuthFlow = (history, IdProviderName, mode, prompt) => {
    const now = new Date();
    const log = {
        date: now,
        name: IdProviderName,
        mode,
        prompt,
    };
    history.push(log);
};

const getLastLog = (history, IdProviderName) => {
    // nb of seconds beyond which assumed not same flow
    const MAX_DELAY_LAST_AUTH = 6;

    const arr = history.filter(e => e.name === IdProviderName);
    const date = getLatestDate(arr.map(e => e.date));

    const now = new Date();
    const delay = (now - date) / 1000;
    if (delay > MAX_DELAY_LAST_AUTH) {
        return null;
    }
    return arr.filter(e => e.date === date)[0];
};

const getLatestDate = arrDates => {
    if (arrDates.length) {
        return arrDates.reduce((m, v, i) => (v > m && i ? v : m));
    }
    return arrDates[0];
};

const toHtml = (str, className, scope_separator = ' ') => {
    const css = {
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
    if (className === 'scope') {
        const scopes = str.split(scope_separator).filter(e => e.length > 0);
        new_str = `<p style='color: gray;'>
            # ${scopes.length} Scopes Granted (scroll down)
            </p>`;
        new_str += Object.entries(scopes)
            .map(([k, v]) => {
                const i = 1 + parseInt(k, 10);
                return `${i} ${v}`;
            })
            .join('<br/>');
    }
    const myCSS = `ipyauth-${className}`;
    const html = `<style>${css[myCSS]}</style><div class="${myCSS}">${new_str}</div>`;
    return html;
};

const openInNewTab = function(url) {
    window.open(url, '_blank').focus();
};

const parseJwt = id_token => {
    const base64Url = id_token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export default {
    debug,

    isLogged,
    isPopup,

    buildWindowProps,
    buildAuthorizeUrl,
    buildUrlParams,
    buildObjCreds,

    getIdProviderFromState,
    logAuthFlow,
    getLastLog,

    toHMS,
    toHtml,

    parseJwt,
    openInNewTab,
};
