/**
 * 演示用的Store demo，
 * 
 */

var App = require('app');

module.exports = {

	events: {
		DID_SOMETHING: 'DEMOSTORE_DEMO_STORE_DO_SOMETHING'
	},

	doSomeThing: function() {
		console.log(`App Event ：emit ${this.events.DID_SOMETHING}`);
		App.emit(this.events.DID_SOMETHING);
	},

	/**
	 * 获取数据
	 * @return Promise 
	 */
	getSomeData: function() {
		//Promise 异步处理
		return new Promise((resolve, reject) => {
			if (Math.random() > 0.5) {
				//成功
				resolve(this.data);
			} else {
				//失败
				reject();
			}
		})
	},

	/**
	 * 写入数据
	 * @return Promise 
	 */
	updateSomeData: function() {
		this.data = 'hello,React!';
		//Promise 异步处理
		return new Promise((resolve, reject) => {
			//成功
			resolve();

		})
	}
}