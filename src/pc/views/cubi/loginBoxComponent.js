var React = require('react');
var App = require('app');
var $ = require('jquery');
var LoginStore = require('../../stores/LoginStore');
var Loading = require('../common/Loading');
var {
	TextField,
	RaisedButton
} = require('material-ui');
module.exports = React.createClass({
	app:{},
	getInitialState:function(){
		return {
			userNameValue:'',
			passWordValue:'',
			inputTextLen:false,//请在发布的时候 修改成false
			inputPassWordLen:true,//请在发布的时候 修改成false
			errorTextString:'',
			disabled:true,
			loaded:true
		}
	},
	componentDidMount:function(){
		// window.localStorage.clear();
		var _this = this;
		//点击登录的方法
		this.app['APP-DIALOG-CLICK-LOGIN-HANDLE'] = App.on('APP-DIALOG-CLICK-LOGIN-HANDLE', this._timeoutDialogLoginHandl);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
        if(this.timeOutId){
		    clearTimeout(this.timeOutId);
		}
	},
	render:function(){
		var loaded = null;
		if(!this.state.loaded){
			loaded = (
				<div className="loginLoadingBox">
					<Loading/>
				</div>
			);
		}
		return	(
			<div className="loginBoxCompoent">
				{this._loginLogoDomHandl()}
				<div className="loginInputBox">
					<div className="loginBoxInputSection">
						<div className="inputSectionBox">
							<TextField
								type='text'
								defaultValue={this.state.userNameValue}
								onChange={(evt)=>this._getUserNameValue(evt)}
								onFocus={this._inputFocusHandle}
								onBlur={this._inputBlurHandle}
								onKeyUp={(evt)=>this._keyUpHandle(evt)}
								className="inputBoxClassName"
								//autocomplete="off"
								placeholder="请输入您的用户名"/>
						</div>
						<div className="inputSectionBox">
							<TextField 
								type='password'
								defaultValue={this.state.passWordValue}
								onChange={(evt)=>this._getUserPassWordValue(evt)}
								onFocus={this._inputFocusHandle}
								onBlur={this._inputBlurHandle}
								onKeyUp={(evt)=>this._keyUpHandle(evt)}
								className="inputBoxClassName"
								//autocomplete="off"
								placeholder="请输入您的密码"/>
						</div>
						{this._errorMessageTextBoxHandle()}
					</div>
					{this._loginBtnDomHandl()}
				</div>
				{loaded}
			</div>
		)
	},
	_keyUpHandle:function(evt){
		if(evt.keyCode == 13){
			this._loginBtnClickHandle(evt);
		}
	},
	_inputFocusHandle:function(evt){
		$(evt.target).parent('div.inputBoxClassName').find("hr").eq(1).addClass("hr");
	},
	_inputBlurHandle:function(evt){
		$(evt.target).parent('div.inputBoxClassName').find("hr").eq(1).removeClass("hr");
		if($(evt.target).attr('type') == 'text'){
			if($.trim($(evt.target).val()).length > 0){
				$(evt.target).addClass('text');
				$(evt.target).parent('div.inputBoxClassName').find("hr").eq(0).addClass("hrDefault");
			}else{
				$(evt.target).removeClass('text');
				$(evt.target).parent('div.inputBoxClassName').find("hr").eq(0).removeClass("hrDefault");
			}
		}else if($(evt.target).attr('type') == 'password'){
			if($.trim($(evt.target).val()).length > 0){
				$(evt.target).addClass('password');
				$(evt.target).parent('div.inputBoxClassName').find("hr").eq(0).addClass("hrDefault");
			}else{
				$(evt.target).removeClass('password');
				$(evt.target).parent('div.inputBoxClassName').find("hr").eq(0).removeClass("hrDefault");
			}
		}
	},
	_errorMessageTextBoxHandle:function(){
		if(this.state.errorTextString.length>0){
			return <div className="errorMessageTextBox">{this.state.errorTextString}</div>
		}else{
			return null
		}
	},
	_loginBtnDomHandl:function(){//判断登录组件是否显示登录按钮
		if(this.props.showAndHideLoginBtn){
			var loginBtnBoxClassName = 'loginBtnBoxClassName';
			// if(!this.state.disabled){
			// 	loginBtnBoxClassName = 'loginBtnBoxClassName';
			// }
			return 	<div className="loginBoxLoginBtnSection">
						<div className="loginBtnBox">
							<RaisedButton 
								className={loginBtnBoxClassName}
								label="登录"
								disabled={false}
								onClick={(evt)=>this._loginBtnClickHandle(evt)}
								secondary={true} />
						</div>
					</div>
		}else{
			return null
		}
	},
	_loginLogoDomHandl:function(){//判断登录组件是否显示登录按钮
		if(this.props.showAndHideLoginBtn){
			return 	<div className="loginBoxLogoSection">
						<img src="themes/default/images/logo.png" />
					</div>
		}else{
			return null
		}
	},
	_getUserNameValue:function(evt){//当用户名输入框失去焦点的时候，获取用户名的方法 设置当前组件里面的用户名状态值
		var _this = this;
		var userNameValue = evt.target.value||null;
		if(this.timeOutId){
		    clearTimeout(this.timeOutId);
		}
		var inputValue = $.trim(userNameValue);
	    if(inputValue != ''){
			_this.setState({
				userNameValue:inputValue,
				errorTextString:'',
				inputTextLen:true,
				disabled:false
			})
		}else{
			_this.setState({
				userNameValue:null,
				errorTextString:'',
				inputTextLen:false,
				disabled:true
			})
		}
	},
	_getUserPassWordValue:function(evt){//当用户名输入框失去焦点的时候，获取输入密码的方法 设置当前组件里面的密码状态值
		var _this = this;
		var passWordValue = evt.target.value||null;
		if(this.timeOutId){
		    clearTimeout(this.timeOutId);
		}
		this.timeOutId = setTimeout(function(){//输入完成之后才执行的方法
		    var inputValue = $.trim(passWordValue);
		    if(inputValue != ''){
				_this.setState({
					passWordValue:inputValue,
					errorTextString:'',
					inputPassWordLen:true,
					//disabled:!_this.state.inputTextLen
				})
			}else{
				_this.setState({
					passWordValue:null,
					errorTextString:'',
					inputPassWordLen:true,
					//disabled:true
				})
			}
		},200)
	},
	_timeoutDialogLoginHandl:function(obj){//超时弹出框登录的方法
		if(this.state.userNameValue != null && this.state.passWordValue != null){
			LoginStore.doLogin(this.state.userNameValue,this.state.passWordValue).then(function(data){
				if(data.success){
					App.emit('APP-CLOSE-DIALOG-LOGIN-STATE-HANDLE');//如果登录成功就关闭超时登录弹出框
				}else{
					_this.setState({
						errorTextString:resultData.message,
					})
				}
			})
		}else{
			this.setState({
				errorTextString:"用户名和密码不能为空",
			})
		}
	},
	_loginBtnClickHandle:function(evt){//点击登录按钮执行的方法
		evt.stopPropagation();//阻止事件冒泡
		this.setState({
			loaded:false
		})
		var userName = this.state.userNameValue;
		var password = encodeURIComponent(this.state.passWordValue);
		if(password==""&&$(".loginBoxInputSection input:password").val()!=""){
			password = $(".loginBoxInputSection input:password").val();
			this.setState({
				passWordValue:password
			},function(){
				if(userName){
					this._loginSubmitHandle(userName,password);
				}
			})
		}else{
			if(userName != null && password != null){
				this._loginSubmitHandle(userName,password);
			}else{
				this.setState({
					errorTextString:"用户名和密码不能为空",
					loaded:true
				})
			}
		}
	},
	_loginSubmitHandle:function(userName,password){//如果用户名和密码都不为空就开始提交后台登录
		var _this = this;
		LoginStore.doLogin(userName,password).then(function(data){
			if(data.success){
				_this.setState({
					loaded:true
				})
				App.userId = data.dataObject.userId;
                sessionStorage.setItem("USERID",data.dataObject.userId);
				App.emit('APP-SET-LOGINED-STATE-HANDLE');//设置cubi.js里的加载组件的状态值
				App.emit('APP-DIALOG-SET-USER-INFO-HANDLE',{userName:data.dataObject.userName});//设置左侧弹出的模块里面的登录用户名字
			}else{
				_this.setState({
					errorTextString:data.message,
					loaded:true
				})
			}
		})
	}
})