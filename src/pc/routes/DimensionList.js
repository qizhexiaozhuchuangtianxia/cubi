module.exports = {

	path: 'dimension/list',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dimensionList'], function(require) {
			callback(null, {
				component: require('../views/dimensionList')
			});
		}, 'dimension-list');
	}
}