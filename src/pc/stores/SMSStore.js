/**
 * 消息Store
 * @author XuWenyue
 * @date 2016-11-04
 */

var App             = require('app');
var smsController   = null;
var receiveCallback = {};
var businessKey     = "cube";
var userId          = null;
var receivedMsgs    = [];

module.exports = {

	events: {

	},

	/**
	 * 注册消息中心
	 */
	registSMS: function() {
		var uid = sessionStorage.getItem("USERID");
		if ((!uid) || (null == uid)) {
			return;
		}
		if (uid == userId) {
			return;
		}

		receivedMsgs  = [];
		userId        = uid;
		smsController = new SmsSdkController(App.smshost, businessKey, userId,encodeURIComponent(App.sid), this._revieveMessage.bind(this));
	},

	unregistSMS: function() {
		userId          = null;
		receiveCallback = {};
		receivedMsgs    = [];
		smsController.closeWebsocket();
	},

	/**
	 * 绑定消息接收处理方法
	 * @param key
	 * @param callback
	 */
	handleReceiveCallback: function(key, callback) {
		if (!receiveCallback[key]) {
			receiveCallback[key] = {};
		}
		receiveCallback[key][callback] = callback;
	},

	/**
	 * 取消绑定的消息接收处理方法
	 * @param key
	 * @param callback
	 */
	unhandleReceiveCallback: function(key, callback) {
		if (!receiveCallback[key]) {
			return;
		}
		receiveCallback[key][callback] = null;
	},

	/**
	 * 内部处理函数：消息中心推送信息接收
	 * @param data
	 * @private
	 */
	_revieveMessage: function(data) {

		data = eval(data);

		var length = data.length;
		var msgs   = [];

		if (0 > length) {
			return;
		}

		receivedMsgs = this._mergeArray(receivedMsgs, data);
		length       = receivedMsgs.length;
		// 整理消息分类已经是否有新消息
		for (var counter = 0; counter < length; counter++) {

			var msg  = receivedMsgs[counter];

			var type = msg.type;
			if (!msgs[type]) {
				msgs[type] = {
					hasNewMsg: false,
					contents: []
				};
			}

			if ("0" == msg.sendStatus) {
				msgs[type].hasNewMsg = true;
			}

			msgs[type].contents.push(msg);
		}

		// 循环消息分析，针对不同的消息消费者回调消息内容
		for (var key in msgs) {

			if (!msgs.hasOwnProperty(key)) {
				continue;
			}
			if (!receiveCallback[key]) {
				continue;
			}

			for (var item in receiveCallback[key]) {

				if (!receiveCallback[key].hasOwnProperty(item)) {
					continue;
				}
				if ((!item) || (null == item)) {
					continue;
				}
				var callback = receiveCallback[key][item];
				if ((!callback) || (null == callback)) {
					continue;
				}

				callback(msgs[key]);
			}
		}

	},

	readMessage() {
		for (var counter = 0; counter < receivedMsgs.length; counter++) {
			receivedMsgs[counter].sendStatus = "1";
		}
	},

	_mergeArray(mergeTo, mergeFrom) {

		var onlyJSON = {};

		for (let counter = 0; counter < mergeTo.length; counter++) {
			onlyJSON[mergeTo[counter].id] = 1;
		}

		for (let counter = 0; counter < mergeFrom.length; counter++) {
			if (onlyJSON[mergeFrom[counter].id]) {
				continue;
			}

			mergeTo.push(mergeFrom[counter]);
		}

		return mergeTo;

	}

};