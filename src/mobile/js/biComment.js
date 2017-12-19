/**
 * Created by Administrator on 2015-12-16.
 */
(function(win,$){
    var defaultUrl = {
        urlLogin : "http://www.cubicube.net/bi/services/usm/login",//登录接口方法
        urlDirector : "http://www.cubicube.net/bi/services/dashboard/runtime/getDashbardDirectories",//情景库列表方法
        urlAllDashboard : "http://agent.h5plus.net/forward/http://www.cubicube.net/bi/services/dashboard/runtime/getDashboards",//所有驾驶舱列表方法
        quitUrl : "http://agent.h5plus.net/forward/http://www.cubicube.net/bi/services/usm/logout",//退出方法
        detailUrl : "http://agent.h5plus.net/forward/http://www.cubicube.net/bi/services/dashboard/runtime/getDashboard",//获取驾驶舱的基本信息
        detailReportUrl : "http://agent.h5plus.net/forward/http://www.cubicube.net/bi/services/report/runtime/getArea",//驾驶舱详情页获取报表列表接口
        shareUrl : "http://www.cubicube.net/bi/services/dashboard/runtime/getDashboardURL" //
    };
    commentMethod.prototype.requestUrl = defaultUrl;
    function commentMethod(){
        //start公用的ajax请求方法
        this.ajaxComment = function(reqUrl,dataObj,callback){//公用的ajax请求方法
            //var reqUrls = encodeURI(reqUrl);
            $.ajax({
                type: 'post',
                url: reqUrl,
                data:dataObj,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    if(data.success){
                        callback(data);
                    }else{
                        if(data.messageCode == "100001"){
                            localStorage.removeItem("key");
                            location.href = "login.html";
                        }else{
                            callback(data);
                        }
                    }
                }
            })
        };
        //end公用的ajax请求方法
        //start 获取url中"?"符后的字串
        this.GetRequest = function(url){
            var url = url||location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            var strs='';
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for ( var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = strs[i].substr(strs[i].indexOf('=')+1);
                }

            }
            return theRequest;
        };
        //end 获取url中"?"符后的字串
        this.filteOs = function(){//区分安卓或者ios
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        };
        //start 返回上一页js
        this.backMethod = function(Ele){
            Ele.on("click",function(){
                history.go(-1);
            });
        };
        //end 返回上一页js
        //start 左侧导航js
        this.sliderNav = function(){
            $('.menuIcon > a').sideNav({
                    menuWidth: $(window).width() *0.85, // Default is 240*/
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
                }
            );
        }
        //end 左侧导航js
    }
    win.commentMethodObj = new commentMethod();
})(window,jQuery);