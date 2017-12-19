module.exports = {

	path: 'dashboard/list',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dashboardList'], function(require) {
			callback(null, {
				component: require('../views/dashboardList')
			});
		}, 'dashboard-list');
	}
}