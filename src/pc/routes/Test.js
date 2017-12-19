module.exports = {

	path: 'test',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/Test'], function(require) {
			callback(null, {
				component: require('../views/Test')
			});
		},'test');
	}
}
