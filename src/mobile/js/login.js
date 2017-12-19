/**
 * Created by Administrator on 2015-12-9.
 */
(function(win,$){
    function loginMethod(){
        this.init = function(){
            this.userName = $("#userName");
            this.password = $("#password");
            this.loginBtn = $("#loginBtn");
            this.loginMain = $("#login-main");
            this.loginLogoBox = $("#login-logoBox");
            this.lableText = $("#lableText");
            this.onFocusMethod();//输入框得到焦点的时候执行的方法
            this.formValidateMethod();//登录窗口的验证方法
        };
        //start 输入框得到焦点的时候执行的方法
        this.onFocusMethod = function(){
            var _self = this;
            $(".errorIcon").hide();
            $('input').on("focus",function(){
                _self.loginMain.css('padding-top',"0.4rem");
                _self.loginLogoBox.css('margin-bottom',"0.8rem");
            })
            $('input').on("blur",function(){
                _self.loginMain.css('padding-top',"0.74rem");
                _self.loginLogoBox.css('margin-bottom',"0.8rem");
                if(_self.password.hasClass("invalid")){
                    $(".errorIcon").show();
                }else{
                    $(".errorIcon").hide();
                }
            })
        }
        //end 输入框得到焦点的时候执行的方法
        //start 登录窗口的验证方法
        this.formValidateMethod = function(){
            var _self = this;
            var userNameVal = $.trim(this.userName.val());
            var passwordVal = $.trim(this.password.val());
            this.userName.keyup(function(){
                setTimeout(function(){
                    _self.buttonCanClick(_self.loginBtn)
                },400);
            });
            this.password.keyup(function(){
                setTimeout(function(){
                    _self.buttonCanClick(_self.loginBtn)
                },400);
            });
        };
        //end 登录窗口的验证方法
        //start 登录窗口的显示隐藏 点击登录按钮效果
        this.buttonCanClick = function(ele){
            var _self = this;
            var userNameVal = $.trim(this.userName.val());
            var passwordVal = $.trim(this.password.val());
            var loginUrl = encodeURI(commentMethodObj.requestUrl.urlLogin + '?terminalType=MOBILE&userName='+userNameVal+'&password='+passwordVal);
            if(userNameVal.length > 0 && passwordVal.length > 0){
                ele.attr("class","waves-effect waves-light btn-large logoButton btn-large-btn");
                ele.off("click");
                ele.on("click",function(){
                    $.ajax({
                        type: 'post',
                        url: loginUrl,
                        data: "",
                        crossDomain: true,
                        dataType: "json",
                        success: function (data) {
                            if(data.success){
                                localStorage.setItem("key",data.sessionId);
                                location.href = "cockpitList.html";
                            }else{
                                _self.password.addClass("invalid");
                                _self.lableText.attr("data-error",data.message);
                                $(".errorIcon").show();
                            }
                        }
                    });
                });
            }else{
                ele.attr("class","btn-large btn-large-btn disabled");
                ele.off("click");
            }
        };
        //end 登录窗口的显示隐藏 点击登录按钮效果
    }
    win.loginMethodObj = new loginMethod();
})(window,jQuery);
$(function(){
    loginMethodObj.init();
});