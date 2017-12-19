/**
 * 框架页顶部
 */

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var App = require('app');
var MenuAndBackBtn = require('../common/MenuAndBackBtn');
var HeaderNavComponent = require('../common/HeaderNavComponent');

import DownLoadNewsButton from '../common/DownLoadNewsButton';

var {
	FlatButton,
	FontIcon,
	LeftNav,
	MenuItem,
	IconButton,
	RaisedButton
} = require('material-ui');
var {
	Router
} = require('react-router');
module.exports = React.createClass({
	app:{},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			commands: [],
			headerNavDatas:[]
		}
	},
	componentWillMount: function() {
		this.app['APP-COMMANDS-SHOW'] = App.on('APP-COMMANDS-SHOW', this._showAppCommands);
		this.app['APP-COMMANDS-REMOVE'] = App.on('APP-COMMANDS-REMOVE', this._removeAppCommands);
		//订阅一个修改头部面包屑导航的事件
		this.app['APP-HEADER-NAV-HANDLE'] = App.on('APP-HEADER-NAV-HANDLE', this._setHeaderNavDataHandle);
		//删除面包屑导航数组的对应的dirid的对象，HeaderNavComponent引用了当前事件
		this.app['APP-HEADER-MODIFY-NAV-HANDLE'] = App.on('APP-HEADER-MODIFY-NAV-HANDLE', this._modifyHeaderNav);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	componentDidMount: function() {
		// var _this = this;console.log('drawerswitch',this.refs['drawerswitch'])
		// $(this.refs['drawerswitch'].getDOMNode()).on('click',function() {
		// 	//_this.refs.leftNavChildren.toggle();
		// 	App.emit('APP-DRAWER-LEFT');
		// });
	},
	componentWillReceiveProps: function(nextProps) {

		/**
		 * nextProps.receivedMessage : 接收到的新消息
		 */
		this.setState({
			receivedMessage: nextProps.receivedMessage
		});
	},
	render: function() {
		if(this.state.headerNavDatas.length>0){
			return (
				<div className="page-top-nav">
					<header>
					    <div className="top-bar"></div>
					    <div className="nav">
					    	<div className="page-container">
					    		<MenuAndBackBtn />
						        <a className="logo"><img src="themes/default/images/logo_small.png" /></a>    
						        <div className="headerLineClassName"></div>
						        <div className="headerNavClassName">
						        	<HeaderNavComponent headerNavData={this.state.headerNavDatas} />
						        </div>
						        <div className="commands right">
							        <div key='DownLoadNewsButton' className="commandBox">
								        <DownLoadNewsButton
									        receivedMessage = {this.state.receivedMessage}
								        />
							        </div>
							    	{this.state.commands.map(this._renderCommand)}
							    </div>
							</div>
					    </div>
					</header>
				</div>
			)
		}else{
			return (
				<div className="page-top-nav">
					<header>
					    <div className="top-bar"></div>
					    <div className="nav">
					    	<div className="page-container">
					    		<MenuAndBackBtn />
						        <a className="logo"><img src="themes/default/images/logo_small.png" /></a>
						        <div className="commands right">
							        <div key='DownLoadNewsButton' className="commandBox">
								        <DownLoadNewsButton
									        receivedMessage = {this.state.receivedMessage}
								        />
							        </div>
							    	{this.state.commands.map(this._renderCommand)}
							    </div>
							</div>
					    </div>
					</header>
				</div>
			)
		}
		
	},
	_goBackIndexHandle:function(evt){//点击logo返回首页的方法
		evt.stopPropagation();
		this.context.router.push({pathname:'/',query:{}});
		App.emit('APP-SET-LEFT-NAV-MENU-HANDLE');
	},
	_setHeaderNavDataHandle:function(obj){//设置头部面包屑导航数据的方法
		if(this.isMounted()){
			this.setState(function(previousState,currentProps){
				previousState.headerNavDatas = obj;
				return {previousState};
			});
		}
	},
	_renderCommand: function(command, index) {
		return <div key={index} className="commandBox">{command}</div>

	},
	_showAppCommands: function(commands) {
		if (commands == null) return;
		var arr = [];
		if (Array.isArray(commands)) {
			arr = commands;
		} else {
			arr.push(commands);
		}
		this.setState({
			commands: arr
		});
	},

	_removeAppCommands: function() {
		this.setState({
			commands: [],
			headerNavDatas:[]
		});
	},

	_closeOverlay: function() {
		var overlay = ReactDOM.findDOMNode(this.refs['overlay']);
		var drawer = ReactDOM.findDOMNode(this.refs['drawer']);
		$(drawer).removeClass("show");
		$(overlay).fadeOut();
	}
});

// <a className="waves-effect waves-light btn-flat">修改</a>
// 						    	<a className="waves-effect waves-light btn-flat">保存</a>