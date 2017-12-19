var React = require('react');
var App = require('app');
var classnames=require('classnames');
var DilogComponent = require('./DilogComponent');
var DashboardStore = require('../../stores/DashboardStore');
var {
	FloatingActionButton
	} = require('material-ui');
var {
	Router,
	Route,
	Link,
	IndexRoute,
} = require('react-router');
module.exports = React.createClass({
	app:{},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			showAdd:'none',
			open:false,
			directoryId:null,
			disabledState:true
		}
	},
	componentWillReceiveProps:function(nextProps){
		this.setState(function(previousState,currentProps){
			previousState.showAdd='none';
			return {previousState};
		})
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
        
	},
	componentDidMount: function() {
		//订阅用户选择的立方事件
		this.app['APP-DASHBOARD-CANCEL-DILOG-HANDLE'] = App.on('APP-DASHBOARD-CANCEL-DILOG-HANDLE', this._cancelHandle);
		
		this.app['APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE'] = App.on('APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE', this._submitHandle);
		
		this.app['APP-REPORT-GET-DIRECTORY-ID-HANDLE'] = App.on('APP-REPORT-GET-DIRECTORY-ID-HANDLE', this._getDirectoryId);
	},
	_cancelHandle:function(obj){
		this.setState(function(previousState,currentProps){//点击取消按钮关闭弹出框层
			previousState.open=false;
			previousState.disabledState=true;
			return {previousState};
		})
	},
	_submitHandle:function(obj){//点击确定按钮异步请求成功后关闭弹出框层
		var _this = this;
		var saveReNameObj = {
		   "id": null,
		   "name": obj.createName,
		   "parentId": obj.parentId||'',
		   "type": obj.createType, //目录：DIRECTORY，驾驶舱：DASHBOARD
	  	}
		DashboardStore.newCreateDashboardDir(saveReNameObj).then(function(data){
			if(data.success){
				if(obj.createType == 'DIRECTORY'){
					_this.setState(function(previousState,currentProps){//点击确定按钮异步请求成功后关闭弹出框层
						previousState.open=false;
						previousState.disabledState=true;
						App.emit('APP-DASHBOARD-REFRESH-LIST-HANDLE');
						return {previousState};
					})
				}else{
					_this.context.router.push({
						pathname:'/dashboard',
						query:{
							'action':data.dataObject.id,
							'parentId':data.dataObject.parentId,
							'actionName':data.dataObject.name,
							'authorityEdit':true,
							'operation':'edit'
						}
					});
				}
			}else{
				console.log(data.message);
			}
		});
	},
	_onTouchHandle:function(){
		this.setState(function(previousState,currentProps){
			if(previousState.showAdd==='inline-block'){
				previousState.showAdd='none';
			}else{
				previousState.showAdd='inline-block';
			}
			return {previousState};
		})
	},
	_createDirHandle:function(){
		this.setState(function(previousState,currentProps){
			previousState.showAdd='none'
			previousState.open=true;
			previousState.names= 'DIRECTORY';
			return {previousState};
		})
		/*if(this.props.authorityEdit){
			this.setState(function(previousState,currentProps){
				previousState.showAdd='none'
				previousState.open=true;
				previousState.names= 'DIRECTORY';
				return {previousState};
			})
		}else{
			App.emit('APP-MESSAGE-OPEN',{
            	content:"您暂时没有权限在当前文件夹下新建文件夹"
            });
		}*/
	},
	_createFileHandle:function(){
		this.setState(function(previousState,currentProps){//最后设置传过去的是文件换是文件
			previousState.showAdd='none'
			previousState.open=true;
			previousState.names= 'DASHBOARD';
			return {previousState};
		})
		/*if(this.props.authorityEdit){
			this.setState(function(previousState,currentProps){//最后设置传过去的是文件换是文件
				previousState.showAdd='none'
				previousState.open=true;
				previousState.names= 'DASHBOARD';
				return {previousState};
			})
		}else{
			App.emit('APP-MESSAGE-OPEN',{
            	content:"您暂时没有权限在当前文件夹下新建驾驶舱"
            });
		}*/
	},
	_getDirectoryId:function(directoryId){
		this.setState(function(previousState,currentProps){
			previousState.directoryId= directoryId;
			previousState.showAdd= "none";
			return {previousState};
		})
	},
	render: function() {
		var openClassName=classnames('iconfont icon-ictianjia24px colorIconWhite',{
			'iconfont icon-icshouqi24px colorIconWhite':this.state.showAdd == 'inline-block'
		});
		var createDirBtn = '',
			createReportBtn = '';
		if(!this.props.userRoot.sceneCreate && !this.props.userRoot.dashboardCreate){
			return null;
		}else{
			if(this.props.userRoot.sceneCreate){//当前用户在当前模块下是否可以创建情景库文件夹
				createDirBtn = <FloatingActionButton
									style={{marginBottom:'16px',display:this.state.showAdd}} 
									mini={true} 
									className="addListButton" 
									iconClassName="iconfont icon-icwenjianjia24px colorIconWhite" 
									onClick={this._createDirHandle} />
			}
			if(this.props.userRoot.dashboardCreate){//当前用户在当前模块下是否可以创建我的分析
				createReportBtn = <FloatingActionButton 
									style={{display:this.state.showAdd}} 
									mini={true} 
									className="dashboardIcon"
									onClick={this._createFileHandle} />
			}
			return (
				<div className="addClassName">
					<DilogComponent 
						disabledState={this.state.disabledState}
						dirId={this.props.dirId}
						open={this.state.open} 
						dilogType={this.state.names}
						listData={this.props.listData}/>
					<FloatingActionButton 
						style={{marginBottom:'16px'}} 
						className="addListButton" 
						iconClassName={openClassName}
						onClick={this._onTouchHandle}/>
						{createDirBtn}
						{createReportBtn}
				</div>
			)
		}
	},
});
