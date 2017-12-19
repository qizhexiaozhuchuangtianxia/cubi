/**
 * 登录Store
 */
 var App = require('app');
 var { WEB_API } = require('../../constants/api');

module.exports = {
    events: {},
    doLogin:function(userName,passWord){
        return new Promise((resolve,reject)=>{
            App.ajax({
                url: '/services/usm/login',
                httpUrl: WEB_API.LOGIN_URL,
                type: 'POST',
                // param: '&userName=' +encodeURIComponent(userName)+'&password='+passWord,
                data:{'userName':userName,'password':passWord},
                callback: function (result) {
                   resolve(result);
                   if(result.success){
                        sessionStorage.setItem("LED",1);
                        /* XuWenyue: 修改左侧菜单显示用户名 */
                        // sessionStorage.setItem("userName",result.dataObject.loginAccount);
                        sessionStorage.setItem("userName",result.dataObject.userName);
                   }
                },
                errorCallback:function(){
                        reject();
                }
            })
        })
    },
    quitLogin:function(userName,passWord){
        return new Promise((resolve,reject)=>{
            App.ajax({
                url: '/services/usm/logout',
                httpUrl: WEB_API.LOGOUT_URL,
                type: 'POST',
                callback: function (result) {
                   resolve(result);
                },
                errorCallback:function(){
                        reject();
                }
            })
        })
    },

    /**
     * 获取菜单使用权限
     */
    getFunctionTree : function() {
        return new Promise((resolve, reject) => {
            App.ajax({
                url  : '/services/usm/getFunctionTree',
                httpUrl:WEB_API.GET_FUNCTION_TREE,
                type : 'POST',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            });
        });
    },
};


