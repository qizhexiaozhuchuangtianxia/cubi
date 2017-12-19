module.exports = {

	getIndexRoute(nextState, callback) {
		callback(null, {
			component: require('../views/WelcomePage')
		});
	}
}