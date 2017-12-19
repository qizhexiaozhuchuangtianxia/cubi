/**
 * 消息服务SDK
 * @type Object
 */

var smssdkController = null;

function SmsSdkController(hosts, businessKey, userId,sessionId,callback) {
	var instance = this;
	var websocketapi = null;

	var info = null;
	var data = null;
	var params = [];
	var connectionStatus = null;

	/*function loadScript(url){
	 var script = document.createElement ("script");
	 script.type = "text/javascript";
	 if (script.readyState){ //IE
	 script.onreadystatechange = function(){
	 if (script.readyState == "loaded" || script.readyState == "complete"){
	 script.onreadystatechange = null;
	 websocketapi = new WebSocketApi(hosts, businessKey, userId,sessionId, callback);
	 }
	 };
	 } else { //Others
	 script.onload = function(){
	 websocketapi = new WebSocketApi(hosts, businessKey, userId, sessionId,callback);
	 };
	 }
	 script.src = url;
	 script.async = false;
	 document.getElementsByTagName("head")[0].appendChild(script);
	 }

	 loadScript("http://" + hosts + "/sockjs/sockjs.min.js");*/

	websocketapi = new WebSocketApi(hosts, businessKey, userId, sessionId,callback);

	//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = function () {
		if (websocketapi != null) {
			websocketapi.closeWebSocket();
		}
	}

	//获取socket连接提示信息
	this.getInfo = function(){
		return info;
	}

	// 以拉的方式获取消息
	this.getMessages = function(businessKey, userId){
		var url = "http://" + hosts + "/sms/services/message/getMessages";
		params = [];
		addParam("businessKey", businessKey);
		addParam("userId", userId);
		var fullUrl = getUrl(url);
		asynPostForSubmit(fullUrl, params);
	}

	//获取服务器端返回数据
	this.getData = function(){
		return websocketapi.getReceivedata();
	}

	//设定服务器返回数据逻辑处理回调方法
	this.setCallback = function(v){
		callback = v;
	}

	// 关闭连接
	this.closeWebsocket = function(){
		if (websocketapi != null) {
			websocketapi.closeWebSocket();
		}
	}

	//获取websocket链接状态
	this.getConnectionStatus = function(){
		return  websocketapi.getConnectionStatus();
	}

	var asynPostForSubmit = function(url, params) {
		$.ajax({
			url : url,
			data : JSON.stringify(params),
			async : true,
			type : "POST",
			contentType:'application/json',
			success : function(responseObject) {
				data = responseObject;
			}
		});
	}

	var getUrl = function(url) {
		var fullUrl = url;
		if (fullUrl.indexOf("?") >= 0) {
			fullUrl += "&";
		} else {
			fullUrl += "?";
		}
		fullUrl += createPostUrlParams();

		return fullUrl;
	}

	var createPostUrlParams = function() {
		var data = "";
		var i = 0, length = params.length;
		for (i = 0; i < length; i++) {
			if (i != 0) {
				data += "&";
			}
			data += encodeURIComponent(params[i].name);
			data += "=";
			data += encodeURIComponent(params[i].value);
		}

		return data;
	};

	var addParam = function(pname, pvalue) {
		params.push(new RequestParam(pname, pvalue));
	}
};

function RequestParam(pname, pvalue) {
	this.name = pname;
	this.value = pvalue;
};

function WebSocketApi(hosts, businessKey, userId,sessionId, callback) {
	var instance = this;
	var websocket = null;
	var receivedata = null;
	var connectionStatus = null;

	var hostPre = "ws://";
	// var path = "/sms/services/";
	var path = "/services/";
	var requestUrl = hostPre + hosts + path;
	if ('WebSocket' in window) {
		websocket = new WebSocket(requestUrl + "ws?businessKey=" + businessKey + "&userId=" + userId+"&sessionId="+sessionId);
	} else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket(requestUrl + "ws?businessKey=" + businessKey + "&userId=" + userId+"&sessionId="+sessionId);
	} else {
		hostPre = "http://";
		requestUrl = hostPre + hosts + path;
		websocket = new SockJS(requestUrl + "ws/sockjs?businessKey=" + businessKey + "&userId=" + userId+"&sessionId="+sessionId);
	}

	//连接成功建立的回调方法
	websocket.onopen = function (event) {
		info = "WebSocket连接成功";
		connectionStatus = "success";

		console.log("WebSocket:已连接");
		console.log(event);
	}

	//接收到消息的回调方法
	websocket.onmessage = function (event) {
		receivedata = event.data;
		console.log("WebSocket:收到一条消息",receivedata);
		// 返回是否收到消息
		if (receivedata != null && receivedata !="" && receivedata != undefined) {

			if( typeof callback == "function"){
				callback(event.data);
			}
			websocket.send("ok");
		}
		else {
			websocket.send("no");
		}
	}

	//连接关闭的回调方法
	websocket.onclose = function (event) {
		info = "WebSocket连接关闭";
		connectionStatus = "close";
		console.log("WebSocket:已关闭");
		console.log(event);
		instance.closeWebSocket();
	}

	//连接发生错误的回调方法
	websocket.onerror = function (event) {
		info = "WebSocket连接发生错误";
		connectionStatus = "error";

		console.log("WebSocket:发生错误 ");
		console.log(event);
	};

	//关闭WebSocket连接
	this.closeWebSocket = function() {
		websocket.close();
	}

	this.getConnectionStatus = function() {
		return connectionStatus;
	}

	this.getReceivedata = function() {
		return receivedata;
	}
};
