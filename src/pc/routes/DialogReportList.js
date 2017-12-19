module.exports = {

	path: 'dialogReportList',

	getIndexRoute(nextState, callback) {
		require.ensure(['../views/DialogReportList'], function(require) {
			callback(null, {
				component: require('../views/DialogReportList')
			});
		},'dialog-report-list');
	}
}