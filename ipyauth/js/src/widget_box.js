
import { extend } from 'lodash';
import * as widgets from '@jupyter-widgets/controls';

import auth from './widget_auth';
import { version } from '../package.json';

import callback from './widget_callback';


const semver_range = '~' + version;

let temp;

const AuthModel = widgets.VBoxModel.extend({

	defaults: function () {
		return extend(AuthModel.__super__.defaults.call(this), {
			_model_name: 'AuthModel',
			_view_name: 'AuthView',
			_model_module: 'ipyauth',
			_view_module: 'ipyauth',
			_model_module_version: semver_range,
			_view_module_version: semver_range,

			_type: '',
			_id: '',
			_signout_text: '',

			params: {},

			logged: '',
			access_token: '',
			scope: '',
			logged_as: '',
			time_to_exp: '',
			expires_at: '',

			_click_signout: 0,

		});

	},

	initialize: function () {
		console.log('ipyauth start initialize');

		// Use apply() on parent initialize
		AuthModel.__super__.initialize.apply(this, arguments);
		console.log('after super initialize');


		let _id_in_url = callback.handle();

		console.log('_id_in_url');
		console.log(_id_in_url);

		if (_id_in_url) {
			temp = _id_in_url;
		}

		console.log('ipyauth end initialize');
	}

});

const AuthView = widgets.VBoxView.extend({

	render: function () {
		console.log('ipyauth start render');

		// Use call() on parent render
		AuthView.__super__.render.call(this);

		// explicit
		let that = this;

		console.log('_id');
		console.log(that.model.get('_id'));

		if (temp) {
			let _id = temp;
			that.model.set({ '_id': _id });
		}
		console.log(that.model.get('_id'));



		let resolved = {};
		let promise1 = this.children_views.views;

		Promise.all(promise1).then(views1 => {
			console.log('views1 callback start');

			let promise2 = [
				views1[0].children_views.views[1],
				views1[0].children_views.views[2],
				views1[0].children_views.views[3],
				views1[0].children_views.views[4],
				views1[0].children_views.views[5],
				views1[1].children_views.views[0],
			];

			Promise.all(promise2).then(views2 => {
				console.log('views2 callback start');


				resolved.btn_main = views2[0];
				resolved.logged_as = views2[1];
				resolved.time_to_exp = views2[2];
				resolved.expires_at = views2[3];
				resolved.btn_inspect = views2[4];
				resolved.scope = views2[5];


				const btn_main_clicked = function () {
					console.log('btn_main clicked');
					if (auth.isLogged(that)){
						auth.logout(that);
					} else {
						auth.login(that);
					}
				};
				resolved.btn_main.el.addEventListener('click', btn_main_clicked);
				
				const btn_inspect_clicked = function () {
					console.log('btn_inspect clicked');
					auth.inspect(that);
				};
				resolved.btn_inspect.el.addEventListener('click', btn_inspect_clicked);
				
				that.form = resolved;
				auth.updateDisplay(that);

				// debug
				console.log('resolved');
				console.log(resolved);
				window.resolved = resolved;
				window.that = that;
				window.auth = auth;

				console.log('views2 callback end');
			});
			console.log('views1 callback end');
		});

		that.model.on('change:_click_signout', that.click_signout_changed, that);
		console.log('ipyauth end render');
	},

	click_signout_changed: function () {
		console.log('start click_signout_changed');
		auth.clearWidget(that);
	}
});


export {
	AuthModel,
	AuthView
};
