/**
 * 用户信息相关Store
 * @author: XuWenyue
 */

var App = require('app');

module.exports = {

	events: {
	},

	/**
	 * 通过用户ID获取用户姓名
	 * @param userId
	 * @returns {Promise}
	 */
	getUserName: function (userId) {
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/usm/getUserName',
				type: "POST",
				contentType: 'application/json',
				param: '&id=' + userId,
				callback: function (result) {
					resolve(result.dataObject);
				},
				errorCallback: function() {
					reject();
				}
			});
		});
	}
};
