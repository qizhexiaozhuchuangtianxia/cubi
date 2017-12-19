module.exports = {

	path: 'dashboardRead(/:action)',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dashboardRead'], function(require) {
			callback(null, {
				component: require('../views/dashboardRead')
			});
		}, 'dashboard-read');
	}
}