var React = require('react');
var App = require('app');
var Loading = require('../common/Loading');
var AddGroupListComponent = require('./AddGroupListComponent');
var SetAuthorityListComponent = require('./SetAuthorityListComponent');
var AuthorityStore = require('../../stores/AuthorityStore');
var {
	AppBar,
	IconButton,
	FlatButton,
	FontIcon,
	List,
	ListItem
} = require('material-ui');
module.exports = React.createClass({
	app:{},
	displayName:'权限父的组件',
	getInitialState:function(){
		return {
			addGroupComponent:false,
		}
	},
	componentWillMount:function(){
	},
	componentDidMount:function(){
		//订阅 保存设置权限的方法
		this.app['APP-DASHBOARD-REFRESH-SAVE-AUTHORITY-HANDLE'] = App.on('APP-DASHBOARD-REFRESH-SAVE-AUTHORITY-HANDLE', this._saveAuthorityHandle);
		//订阅打开添加组的列表方法
		this.app['APP-DASHBOARD-REFRESH-OPEN-ADD-GROUP-HANDLE'] = App.on('APP-DASHBOARD-REFRESH-OPEN-ADD-GROUP-HANDLE', this._addGroupHandle);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render:function(){
		// iconElementRight={<FlatButton className="rightIconClassName" disabled={true} label="重置权限" />} //不要删除重要
		var appBarBtn = '',
			domHtml='';
		if(this.state.addGroupComponent){
			appBarBtn=	<AppBar
						    title='添加分组'
					     	className="appBarClassName"
						    iconElementLeft={<IconButton 
							    		onClick={(evt)=>this._addGroupGoBackHandle(evt)} 
							    		iconClassName='iconfont icon-icarrowback24px'>
						    		</IconButton>}/>
		  	domHtml = 	<div className="setAuthorityClass">
			  				<AddGroupListComponent dashboardId={this.props.dashboardId}/>
			  			</div>
		}else{
			appBarBtn=	<AppBar
						    title='分配权限'
					     	className="appBarClassName"
						    iconElementLeft={<IconButton disabled={true} iconClassName="iconfont icon-renqun setAuthorityIcon"></IconButton>}
						    
						  />;
			domHtml = 	<div className="setAuthorityClass">
							<SetAuthorityListComponent dashboardId={this.props.dashboardId}/>
						</div>
		}
		return (
			<div className="reportRightShowBox">
				<div className="top-bar"></div>
				{appBarBtn}
				{domHtml}
			</div>
		)
	},
	_addGroupHandle:function(){//点击添加分组按钮执行的方法
		this.setState({
			addGroupComponent:true
		})
	},
	_addGroupGoBackHandle:function(){//添加分组状态下的点击返回按钮执行的方法
		this.setState({
			addGroupComponent:false
		})
	},
	_saveAuthorityHandle:function(obj){//执行保存的方法
		var _this = this;
		AuthorityStore.saveAuthorityHandle(obj.saveDataObj).then(function(resultData){
			if(resultData.success){
				_this.setState({
					addGroupComponent:false,
				})
			}else{
				console.log(resultData.message);
			}
		})
	}
})