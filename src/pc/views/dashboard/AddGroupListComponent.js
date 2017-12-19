var $ = require('jquery');
var React = require('react');
var App = require('app');
var Loading = require('../common/Loading');
var AuthorityStore = require('../../stores/AuthorityStore');
var {
	List,
	ListItem,
	FontIcon
} = require('material-ui');
module.exports = React.createClass({
	displayName:'添加分组按钮的组件',
	getInitialState:function(){
		return {
			addGroupListData:[],
			authorityMessage:'暂时没有分组',
			loading:true,
			saveDataObj:{
			    "resourceObj": [
			        {
			            "resourceId": this.props.dashboardId, // 资源ID
			            "resourceType": "dashboard" // 资源类型
			        }
			    ],
			    "authorities": []
			}
		}
	},
	componentWillMount:function(){
		this._getAddGroupListHandle(this.props.dashboardId);//获取页面需要的数据和拼接保存data的数据	
	},
	componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
		this._getAddGroupListHandle(nextProps.dashboardId);		
	},
	componentDidMount: function() {
		this._scrollBrar();
	},
	componentDidUpdate: function() {
		this._scrollBrar();
	},
	render:function(){
		if(!this.state.loading){
			if(this.state.addGroupListData.length>0){
				return (
					<div className="addGroupListBox">
						<div className="scrollBox">
							<List>
								{this.state.addGroupListData.map(this._mapListHandle)}
						    </List>
					    </div>
					</div>
				)
			}else{
				return (
					<div className="addGroupListBox">
						<div className="nullMessageBox">{this.state.authorityMessage}</div>
					</div>
				)
			}
		}else{
			return (
				<div className="addGroupListBox">
					<Loading/>
				</div>
			)
		}
	},
	_getAddGroupListHandle:function(dashboardId){//获取添加分组的所有列表数据的方法
		var _this = this;
		var parentId = this.state.parentId||'';//以后有树形结构可以修改这个state
		AuthorityStore.getAuthorityTreeHandle(dashboardId,parentId).then(function(resultData){
			if(_this.isMounted()){
				_this.setState({
					addGroupListData:resultData,
					loading:false
				})
			}
		})
	},
	_mapListHandle:function(item,key){//遍历添加分组数据输出列表
		return <ListItem 
				key={key} 
				className='listItemClass'
				disabled={item.checked}
				onTouchTap={(evt)=>this._addTeamHandle(evt,item)}
				primaryText={item.name} 
				leftIcon={<FontIcon className="iconfont icon-renqun addIconButton" />}/>
	},
	_addTeamHandle:function(evt,item){//添加分组的方法
		var _this = this;
		AuthorityStore.getAuthorListData(this.props.dashboardId).then(function(data){//获取页面渲染需要的数据
			_this._setSaveDataObj(data,item);			
		})
	},
	_setSaveDataObj:function(data,item){
		var _this = this;
		var arrData=[];
		var itemObj = {
			"id": item.id, // 团队ID
			"view": false, // 读权限
			"edit": false, // 写权限
			"delete": false, // 删权限
			"authorize": false, // 授权权限，暂时需求不支持
			"everyTeam": false // 是否为“所有人”权限
		}
		for (var i = 0; i < data.length; i++) {
			var objData = {};
			objData.id = data[i].teamId||''; // 团队ID
			objData.view = data[i].view; // 读权限
			objData.edit = data[i].edit; // 写权限
			objData.delete = data[i].delete; // 删权限
			objData.authorize = 'false'; // 授权权限，暂时需求不支持
			objData.everyTeam = data[i].everyTeam; // 是否为“所有人”权限
	        arrData.push(objData);
		}
		arrData.push(itemObj);
		this.setState(function(state){
			state.saveDataObj.authorities = arrData;
			App.emit('APP-DASHBOARD-REFRESH-SAVE-AUTHORITY-HANDLE',{saveDataObj:state.saveDataObj});
			return {state};
		})
	},
	_scrollBrar:function(){
		$(".scrollBox").height(document.body.clientHeight - 98);
		$(".scrollBox").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
	}
})