module.exports = {

	path: 'report(/:action)',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/report'], function(require) {
			callback(null, {
				component: require('../views/report')
			});
		}, 'report');
	}
}