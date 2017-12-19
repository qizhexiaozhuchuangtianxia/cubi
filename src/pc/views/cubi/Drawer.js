/**
 * 框架页左侧抽屉
 */

var React = require('react');
var LoginStore = require('../../stores/LoginStore');
var {
	Menu,
	MenuItem,
	Divider
} =
require('material-ui');

var classnames = require('classnames');
var App = require('app');

module.exports = React.createClass({
	app:{},
	propTypes: {
		onNavigation: React.PropTypes.func
	},

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

    componentWillMount : function() {

        let _this = this;

	    LoginStore.getFunctionTree().then(function(result) {

	        let menus = [];

	        if (result.success) {
	            for (let index in result.dataObject) {
	                let menu = result.dataObject[index];

                    if ("/dimension/html/dimension.html" === menu.src) {
                        menus.push({
                            itemId        : "2",
                            linkTo        : "/dimension/list",
                            primaryText   : "维度",
                            iconClassName : "iconfont icon-weiduiconsvg24"
                        });
                    }
                    else if ("/report/html/configure.html" === menu.src) {
                    	sessionStorage.setItem('VIEWREPORT',1);
                        menus.push({
                            itemId        : "3",
                            linkTo        : "/report/list",
                            primaryText   : "我的分析",
                            iconClassName : "iconfont icon-icbaobiao24px"
                        });
                    }
                    else if ("/dashboard/html/dashboard.html" === menu.src) {
                        menus.push({
                            itemId        : "4",
                            linkTo        : "/dashboard/list",
                            primaryText   : "驾驶舱",
                            iconClassName : "iconfont icon-icjiashicang24px"
                        });
                    }
                }

                _this.setState( { menus: menus } );
            }
            else {
                App.emit('APP-MESSAGE-OPEN', {
                    content: "菜单权限获取失败"
                });
            }
        });
    },

    componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	getDefaultProps: function() {
		return {
			onNavigation: () => {}
		}
	},

	getInitialState: function() {
		return {
			selected: null,
			loginUserLogo:'themes/default/images/left_menu_logo.png',
			loginUserName:sessionStorage.getItem("userName"),
			loginUserInfo:'',//heyfromjonathan@gmail.com,
            menus:[]
		}
	},
	componentDidMount:function(){
		//点击登录设置左侧用户信息方法的方法
		this.app['APP-DIALOG-SET-USER-INFO-HANDLE'] = App.on('APP-DIALOG-SET-USER-INFO-HANDLE', this._setUserInfoHandle);
		//点击返回首页 重置左侧当行的方法
		this.app['APP-SET-LEFT-NAV-MENU-HANDLE'] = App.on('APP-SET-LEFT-NAV-MENU-HANDLE', this._setLeftNavMenuHandle);
	},
	render: function() {
		// <dd>{this.state.loginUserInfo}</dd>登入用户的邮箱地址 以后回家上不必删除
		return (
			<div>
				<div className="top">
					<dl>
						<dt><img src={this.state.loginUserLogo}/></dt>
						<dd>{this.state.loginUserName}</dd>
						
					</dl>
				</div>
				<div className="menu">
					{/*<ListItem itemId="1" selected={this.state.selected} onSelected={this._selectedHandler} primaryText="店铺分析" iconClassName="iconfont icon-icdianpufenxi24px"/>*/}
					{/*<ListItem itemId="2" selected={this.state.selected} onSelected={this._selectedHandler} primaryText="数据立方" iconClassName="iconfont icon-icshujulifang24px"/>*/}

                    {this.state.menus.map(this._createMenus)}
                    
					
					{/*<ListItem itemId="6" selected={this.state.selected} onSelected={this._selectedHandler} primaryText="账户设定" iconClassName="iconfont icon-icshezhi24px"/>*/}
					<Divider className="divider"/>
					<ListItem itemId="5" selected={this.state.selected} onSelected={this._selectedHandler} primaryText="帮助" iconClassName="iconfont icon-icbangzhu24px"/>
					<ListItem 
						itemId="7" linkTo="/" 
						selected={this.state.selected} 
						onSelected={this._selectedHandler} 
						primaryText="退出登录" 
						iconClassName="iconfont icon-ictuichu24px"/>
				</div>
			</div>
		)
	},

    _createMenus(item, index) {
	    return (
            <ListItem
                key           = {index}
                itemId        = {item.itemId}
                linkTo        = {item.linkTo}
                selected      = {this.state.selected}
                onSelected    = {this._selectedHandler}
                primaryText   = {item.primaryText}
                iconClassName = {item.iconClassName}
            />
        );
    },

	_setUserInfoHandle:function(obj){//点击登录设置左侧用户信息方法的方法
		this.setState({
			loginUserName: obj.userName
		})
	},
	_setLeftNavMenuHandle:function(obj){//点击返回首页 重置左侧当行的方法
		this.setState({
			selected: null
		})
	},
	_selectedHandler: function(itemId, url) {
		if(itemId == 5){
			window.open('/guide/index.html');
		}
		if (url == null) return;
		if(url == '/'){
			if(itemId == 7){
				LoginStore.quitLogin().then(function(data){});
				sessionStorage.setItem('VIEWREPORT',0);
			}
			App.emit('APP-SET-QUIT-LOGINED-STATE-HANDLE');
		}

		this.setState({
			selected: itemId
		});
		this.context.router.push(url);
		App.emit('APP-DRAWER-LEFT');
	},
})

var ListItem = function(props) {
	var icon = <i className={props.iconClassName}/>;
	var className = classnames('leftMenu', {
		'checked': props.selected == props.itemId
	});
	var url = props.linkTo;

	function touchTapHandler() {
		if (props.onSelected) {
			props.onSelected(props.itemId, url);
		}
	}

	return <MenuItem className={className} primaryText={props.primaryText} leftIcon={icon} onTouchTap={touchTapHandler}/>
}