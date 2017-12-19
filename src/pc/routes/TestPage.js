module.exports = {
	
	path: 'testpage',

	getChildRoutes(partialNextState, callback) {
		require.ensure([], function(require) {
			callback(null, [
				require('./routes/Announcements'),
				require('./routes/Assignments'),
				require('./routes/Grades'),
			])
		})
	},


	getIndexRoute(partialNextState, callback) {
		require.ensure([], function(require) {
			callback(null, {
				component: require('./components/Index'),
			})
		})
	},

	getComponents(nextState, callback) {
		require.ensure([], function(require) {
			callback(null, require('./components/Course'))
		})
	}
}