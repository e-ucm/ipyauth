

import * as base from '@jupyter-widgets/base';

import * as myWidget from './widget';
import { version } from './index';

let id = 'ipyauth';
let requires = [base.IJupyterWidgetRegistry];
let autoStart = true;

let activate = (app, widgets) => {
	console.log('JupyterLab extension ipyauth is activated!');

	widgets.registerWidget({
		name: 'ipyauth',
		version: version,
		exports: myWidget
	});
};

export default {
	id,
	requires,
	activate,
	autoStart
};
