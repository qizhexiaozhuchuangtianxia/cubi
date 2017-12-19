var App = require('app');

function loadUserInfo() {
	console.log('app-preload:start loadUserInfo');
	return new Promise((resolve, reject) => {

		setTimeout(function(){
			console.log('app-preload:end loadUserInfo');
			resolve();
		},1500);

	});
}

function loadAppConstant() {
	console.log('app-preload:start loadAppConstant');
	return new Promise((resolve, reject) => {
		setTimeout(function(){
			console.log('app-preload:end loadAppConstant');
			resolve();
		},800);

	});
}

function loadChartData() {
	console.log('app-preload:start loadChartData');
	return new Promise((resolve, reject) => {

		setTimeout(function(){
			console.log('app-preload:end loadChartData');
			resolve();
		},1000);

	});
}


module.exports = {

	initStore: function() {
		var tasks = [];
		tasks.push(loadUserInfo());
		tasks.push(loadAppConstant());
		tasks.push(loadChartData());
		return Promise.all(tasks);
	}
}