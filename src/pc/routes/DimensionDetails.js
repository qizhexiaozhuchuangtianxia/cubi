module.exports = {

	path: 'dimension/details',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/dimension/DimensionDetails'], function(require) {
			callback(null, {
				component: require('../views/dimension/DimensionDetails')
			});
		}, 'dimension-details');
	}
}