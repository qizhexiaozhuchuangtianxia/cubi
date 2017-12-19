var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var LoginComponent = require('./loginComponent');
var Header = require('./views/cubi/Header');
var DrawerLeftComponent = require('./views/cubi/DrawerLeftComponent');
var DrawerRightComponent = require('./views/cubi/DrawerRightComponent');
var SetDrawer = require('./views/cubi/SetDrawer');
var Dialog = require('./views/common/Dialog');
import DownLoadNewsDialogComponent from './views/common/DownLoadNewsDialogComponent';
var TimeoutDialog = require('./views/common/TimeoutDialog');
var Message = require('./views/common/Message');
var cubiTheme = require('./material-ui-cubi-theme');

var SMSStore = require('./stores/SMSStore');

var {
	// RaisedButton,
	// FlatButton,
	CircularProgress
} = require('material-ui');

var {
	Router,
	hashHistory,
	browserHistory,
	IndexRoute,
	Route,
	Link,
} = require('react-router');

var CuBIApp = React.createClass({
	app: {},
	childContextTypes: {
		muiTheme: React.PropTypes.object,
	},

	getChildContext: function() {
		return {
			muiTheme: cubiTheme
		};
	},

	getInitialState: function() {
		return {
			loaded: false,
			drawerRightComponent: null,
			sid: null,
			loginedState: 0,
			timeoutText: '系统超时，请重新登录',
			openProps: false //是否弹出时间超时弹出框 默认是false 不弹出，true弹出
		};
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentWillMount: function() {
		// || this.props.location.pathname=="/dashboardRead"
		if (this.props.location.query.SessionID) { //判断当前页面是否是只读的单页面
			this.setState({
				loginedState: 1
			})
		} else {
			if (sessionStorage.getItem("LED") == 1) {
				App.sid = sessionStorage.getItem("SID");
				App.userId = sessionStorage.getItem("USERID");
				this.setState({
					loginedState: 1
				})
			}
		}

	},
	componentWillReceiveProps: function(nextProps) { //点击本页面进入本页面的时候触发
		App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
			toggle: false
		});
		// App.emit('APP-HEADER-NAV-HANDLE')
	},
	componentDidMount: function() {
		//设置是否登录的状态 方法
		this.app['APP-SET-LOGINED-STATE-HANDLE'] = App.on('APP-SET-LOGINED-STATE-HANDLE', this._modifyLoginedStateHandle); //设置是否登录的状态 方法
		//点击退出按钮执行的方法
		this.app['APP-SET-QUIT-LOGINED-STATE-HANDLE'] = App.on('APP-SET-QUIT-LOGINED-STATE-HANDLE', this._QuitodifyLoginedStateHandle);
		//设置关闭超时弹出框登录状态 方法
		this.app['APP-CLOSE-DIALOG-LOGIN-STATE-HANDLE'] = App.on('APP-CLOSE-DIALOG-LOGIN-STATE-HANDLE', this._closeDialogLoginStateHandle);
		//设置打开超时弹出框登录状态 方法
		this.app['APP-OPEN-DIALOG-LOGIN-STATE-HANDLE'] = App.on('APP-OPEN-DIALOG-LOGIN-STATE-HANDLE', this._openDialogLoginStateHandle);
		var _this = this;
		this._formSubmit();
		this._formSubmitByAreaInfo();
		/*Store.login('瑞雪:test','abc.1234').then(function(data){
			if(data.success){
				if(window.localStorage){
					localStorage.setItem("loginedState", true);
				}
				App.emit('APP-SET-LOGINED-STATE-HANDLE');//设置cubi.js里的加载组件的状态值
			}
		})*/

		// 登录成功后，注册消息服务器
		SMSStore.registSMS();
		SMSStore.handleReceiveCallback("downloadMessage", this._receivedMessageForDownload);
	},
	render: function() {
		if (this.state.loginedState == 1) {
			if (this.props.location.pathname == '/dashboardRead') {
				return this._renderDashboardRead();
			} else {
				return this._renderMain();
			}

		} else {
			return <LoginComponent />
		}
		/*if (this.state.loaded && this.state.sid) {
			return this._renderMain();
		} else {
			return this._renderLoading();
		}*/
	},
	_QuitodifyLoginedStateHandle: function(obj) {
		this.setState({
			loginedState: 0
		});
		App.emit('APP-MESSAGE-OPEN', {
			content: '登录超时，请重新登录'
		});
		sessionStorage.clear();
		SMSStore.unregistSMS();
	},
	_modifyLoginedStateHandle: function(obj) {
		this.setState({
			loginedState: 1
		});

		// 登录成功后，注册消息服务器
		SMSStore.registSMS();
		SMSStore.handleReceiveCallback("downloadMessage", this._receivedMessageForDownload);
	},
	_closeDialogLoginStateHandle: function(obj) {
		this.setState({
			openProps: false
		});
	},
	_openDialogLoginStateHandle: function(obj) { //如果接口请求超时就打开超时登录弹出框的方法
		this.setState({
			openProps: true
		});
	},
	_loadedHandler: function() {
		this.setState({
			loaded: true
		});
	},

	/**
	 * 消息服务器推送接收处理
	 * @param data
	 * @private
	 * @author XuWenyue
	 */
	_receivedMessageForDownload(data) {
		this.setState({
			receivedMessage: data
		});
	},

	_renderMain: function() {
		return (
			<div className="bodyer">
				<Header
					receivedMessage = {this.state.receivedMessage} />
				<DrawerLeftComponent/>
				<DrawerRightComponent/>
				<div className="page-main-frame">
					{this.props.children}
				</div>
				<SetDrawer/>
				<Dialog/>
				<DownLoadNewsDialogComponent/>
				<Message/>
				<TimeoutDialog openProps={this.state.openProps} timeoutText={this.state.timeoutText}/>
				<div className="drag-panel"></div>
			</div>
		)
	},
	_renderDashboardRead: function() {
		return (
			<div className="bodyer">
				<div className="page-main-frame">
					{this.props.children}
				</div>
				<Message/>
				
			</div>
		)
	},
	_renderLoading: function() {
		return (

			<div className="app-loading-container">
				<div  className="loading-box">
					<CircularProgress mode="indeterminate"/>
				</div>
			</div>
		)
	},
	_formSubmit: function() { //初始化页面form ifrem input等 结构
        var $form = $("<form></form>");
        var $ifrem = $("<iframe></iframe>");
        var $areaParameters = $("<input type='hidden'/>");
        var $idInput = $("<input type='hidden' />");
        var parameters = " ";
        $form.attr("method", "POST");
        $form.attr("id", "formSubmit");
        $form.attr("target", "myIfremId");
        $form.css('position', 'absolute');
        $form.css('top', '-1200px');
        $form.css('left', '-1200px');
        $form.appendTo('body');

        $ifrem.attr("name", "myIfremId");
        $ifrem.css("display", "none");
        $ifrem.appendTo('body');

        $idInput.attr('name', 'id');
        $idInput.attr('value', '1325456789');
        $idInput.appendTo($form);

        $areaParameters.attr('name', 'areaParameters');
        $areaParameters.attr('value', parameters);
        $areaParameters.appendTo($form);
    },
	_formSubmitByAreaInfo: function() { //初始化页面form ifrem input等 结构
		var $form           = $("<form></form>");
		var $ifrem          = $("<iframe></iframe>");
		var $areaInfo       = $("<input type='hidden'/>");
		var $areaParameters = $("<input type='hidden'/>");
		var parameters      = " ";

		$form.attr("method", "POST");
		$form.attr("id", "formSubmitByAreaInfo");
		$form.attr("target", "myIfremId");
		$form.css('position', 'absolute');
		$form.css('top', '-1200px');
		$form.css('left', '-1200px');
		$form.appendTo('body');

		$ifrem.attr("name", "myIfremId");
		$ifrem.css("display", "none");
		$ifrem.appendTo('body');

		$areaInfo.attr('name',  'areaInfo');
		$areaInfo.attr('value', " ");
		$areaInfo.appendTo($form);

		$areaParameters.attr('name',  'areaParameters');
		$areaParameters.attr('value', parameters);
		$areaParameters.appendTo($form);
	},
});

const rootRoute = {
	childRoutes: [{
		path: '/',
		component: CuBIApp,
		childRoutes: [
			require('./routes/WelcomePage'),
			require('./routes/ReportList'),
			require('./routes/Report'),
			require('./routes/DashboardList'),
			require('./routes/Dashboard'),
			require('./routes/DashboardRead'),
			require('./routes/DimensionList'),
			require('./routes/DimensionDetails'),
			//require('./routes/Test'),
		]
	}]
}


var ReactApp = (<Router history={hashHistory} routes={rootRoute}></Router>);

// <Route path="/report/list" component={ReportList}/>
// <Route path="/report(/:action)" component={Report}/>
// <Route path="/dashboard/list" component={DashboardList}/>
// <Route path="/dashboard(/:action)" component={Dashboard}/>
// <Route path="/dashboardRead(/:action)" component={DashboardRead}/>
// <Route path="/testpage" component={TestPage}/>
// <Route path="/dialogReportList" component={DialogReportList}/>

ReactDOM.render(
	ReactApp,
	document.getElementById('app')
);