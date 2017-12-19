module.exports = {

	path: 'dashboardTest(/:action)',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dashboardTest'], function(require) {
			callback(null, {
				component: require('../views/dashboardTest')
			});
		},'dashboardTest');
	}
}