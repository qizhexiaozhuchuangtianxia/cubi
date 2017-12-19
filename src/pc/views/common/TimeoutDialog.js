var React = require('react');
var App = require('app');
var LoginBoxComponent = require('../cubi/loginBoxComponent');
var {
	Dialog,
	FlatButton,
	TextField
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentDidMount: function() {
	},
	render: function() {
		var actions = [
			<FlatButton 
				label="取消"
				style={{color:'#fff',fontSize:'14px'}} 
				hoverColor="#00e5ff"
				onClick={(evt)=>this._closeTimeoutDialogHandle(evt)} />,
	      	<FlatButton 
		      	label="登录" 
		      	style={{color:'#fff',fontSize:'14px'}} 
		      	hoverColor="#00e5ff"
		      	onClick={(evt)=>this._loginTimeoutDialogHandle(evt)} />,
	    ];
		return (
			<Dialog 
				title={this.props.timeoutText} 
				actions={actions} 
				modal={false} 
				open={this.props.openProps}
				contentClassName="timeoutDialogClass" 
				titleClassName="timeoutDialogTitleClass" 
				bodyClassName="timeoutDialogBodyClass" 
				actionsContainerClassName="timeoutDialogBottomClass">
					<LoginBoxComponent showAndHideLoginBtn={false}/>
	        </Dialog>
		)
	},
	_closeTimeoutDialogHandle:function(evt){//关闭超时弹出框方法
		evt.stopPropagation();//阻止事件冒泡
		App.emit('APP-CLOSE-DIALOG-LOGIN-STATE-HANDLE');
	},
	_loginTimeoutDialogHandle:function(evt){//点击登录超时弹出框方法
		evt.stopPropagation();//阻止事件冒泡
		App.emit('APP-DIALOG-CLICK-LOGIN-HANDLE');
	}
})