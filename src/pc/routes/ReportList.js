module.exports = {

	path: 'report/list',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/reportList'], function(require) {
			callback(null, {
				component: require('../views/reportList')
			});
		},'report-list');
	}
}
