module.exports = {

	path: 'dashboard(/:action)',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dashboard'], function(require) {
			callback(null, {
				component: require('../views/dashboard')
			});
		},'dashboard');
	}
}