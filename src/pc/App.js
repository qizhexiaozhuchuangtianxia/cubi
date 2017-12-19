/**
 * 全局App，提供常用功能接口
 */

'use strict';

var EventEmitter = require('fbemitter').EventEmitter;
var $ = require('jquery');
var emitter = new EventEmitter();
module.exports = {
    //订阅事件
    on: function(eventType, callback) {
        return emitter.addListener(eventType, callback);
    },

    //触发事件
    emit: function(eventType, ...args) {
        emitter.emit.apply(emitter, arguments);
    },

	// 取消事件订阅
	removeAllListeners: function(eventType) {
    	emitter.removeAllListeners(eventType);
	},
    //#region ajax
    /*
    ajax,example:
    Uni2uni.ajax({
    action:'Json',
    controller:'Test',
    callback:function(d){ alert(d.Name); }
    })
    */

	/**
	 * 扩展Ajax请求
	 * @param params
	 * {
	 *     url: {String} 请求API路径
	 *     loading: {Boolean} 是否显示加载状态（菊花屏）
	 *     data: {JSON} 请求数据
	 *     type: {String} 请求类型，POST或GET等，默认GET
	 *     async: {Boolean} 是否异步，默认true
	 *     dataType: {String} text或json，默认
	 *     callback: {Function} 成功后的回调函数
	 *     completeCallback: {Function} 请求结束后的回调函数
	 * }
	 */
	ajax: function(params) {

        var _this = this;
        var tip = null;
        if (params.loading) {
            //("正在加载数据…");
        }

        //检测网络链接
        if (!navigator.onLine) {
            this.emit('APP-MESSAGE-OPEN', {
                content: '网络链接失败，请重试！'
            });
        }

        function completeCallback(result) {
            if (params.completeCallback) {
                params.completeCallback(result);
            }
        }

        function successCallback(result) {
            try {
                if (!result.success) {
                    if (result.messageCode == 'ERROR_UNLOGIN') {
                        _this.emit('APP-SET-QUIT-LOGINED-STATE-HANDLE');
                        sessionStorage.setItem("LED", 0);
                        return;
                    }
                } else {
                	// 每一次成功的Ajax请求后，都需要交换SessionID
	                _this.sid = result.sessionId;
                    sessionStorage.setItem("SID", result.sessionId);
                }
                params.callback(result);
            } catch (error) {
                console.error(error);
            }
        }

        function errorCallback(xhr, textStatus, errorThrown) {
            if (params.errorCallback) {
                params.errorCallback(xhr, textStatus, errorThrown);
            }
        }
        var options = {};
        var sessionId = '';
	    if (!params.notsid) {
	    	// params.notsid true: 不需要拼装SessionID，Login的场合
		    if (params.strictSsionId) {
		    	// 指定特殊的SessionID，例：驾驶舱分享后，使用特殊的SessionID进行初次验证登录
			    sessionId = '&sessionId=' + encodeURIComponent(params.strictSsionId);
		    }
		    else {
		    	// 正常访问API时，需要使用前一次交换回来的SessionID
			    sessionId = '&sessionId=' + encodeURIComponent(sessionStorage.getItem("SID"));
		    }
	    }

        var pam = params.param || '&1=1';
        options.data = JSON.stringify(params.data);
        options.success = successCallback;
        options.error = errorCallback;
        options.complete = completeCallback;
        options.url = this.host + params.url + '?terminalType=PC' + sessionId + pam;
        options.type = params.type || 'POST';
        options.async = params.async || true;
        options.dataType = params.dataType || 'json';
        //添加ajax options的contentType属性(默认使用表单提交的contentType)
        if (params.contentType) {
            options.contentType = params.contentType; // || 'application/json';
        }
        //如果传人node端url 替换options.url 添加headers属性
        if(params.httpUrl){
            options.url = `${params.httpUrl}?${pam}`;
            options.headers={
                "terminalType": "PC",
                "sessionid": sessionStorage.getItem("SID") || '',
                "content-type": params.contentType || "application/json",
            }
        }
        try {
            $.ajax(options);
        } catch (e) {
            this.emit('APP-MESSAGE-OPEN', {
                content: e
            });
        }
    },
    deepClone:function (obj){  
        var cloneObject,arg = arguments;  
        var _this = this;
        if(typeof(obj)!="object" || obj===null)return obj;  
        if(obj instanceof(Array)){  
            cloneObject=[];   
            obj.map(function(item,index){
                if(typeof item=='object' && item!=null){
                    cloneObject[index] = _this.deepClone(item); 
                }else{
                    cloneObject[index] = item;
                }
            }) 
        }else{  
            cloneObject={};  
            for(var i in obj){  
                if(typeof(obj[i])=="object" && obj[i]!=null){  
                    cloneObject[i]= _this.deepClone(obj[i]);  
                }else{  
                    cloneObject[i]=obj[i];  
                }  
            }  
        }  
        return cloneObject;  
    }, 
    //#endregion
    // host: 'http://172.16.38.119:8080/bi'
    //host: 'http://demo.bi.ruixuesoft.com:8081/bi'
    // host: 'http://api.dell.cube.ruixuesoft.com/v3'
    host: 'http://api.test.cube.ruixuesoft.com/v3',
    // host:'http://www.cubicube.net/v3'

	/**
	 * 消息服务器Hosts : <host:port>
	 */
	smshost: 'api.test.cube.ruixuesoft.com/v3'
}