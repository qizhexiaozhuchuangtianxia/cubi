var React = require('react');
var App = require('app');
var classnames=require('classnames');
var DilogComponent = require('./DilogComponent');
var ReportStore = require('../../stores/ReportStore');
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
	componentWillReceiveProps:function(){
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
		this.app['APP-REPORT-CANCEL-DILOG-HANDLE'] = App.on('APP-REPORT-CANCEL-DILOG-HANDLE', this._cancelHandle);
		//订阅用户选择的立方事件
		this.app['APP-REPORT-SUBMIT-CALLBACK-DILOG-HANDLE'] = App.on('APP-REPORT-SUBMIT-CALLBACK-DILOG-HANDLE', this._submitHandle);
		//订阅用户选择的立方事件
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
		var directoryObj = {
				"id": '',
				"name": obj.createName,
				"parentId": obj.parentId,
				"type": obj.dilogType
			}
		ReportStore.newCreateReportDir(directoryObj).then(function(data){
			_this.setState(function(previousState,currentProps){//点击确定按钮异步请求成功后关闭弹出框层
				previousState.open=false;
				previousState.disabledState=true;
				App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
				return {previousState};
			})
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
	_createDirHandle:function(){//创建情景库方法
		this.setState(function(previousState,currentProps){
			previousState.showAdd='none'
			previousState.open=true;
			previousState.names= 'DIRECTORY';
			return {previousState};
		})
		/*if(this.props.currentCanEdited){
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
	_createFileHandle:function(){//创建报表方法
		this.context.router.push({pathname:'/report/create',query:{
			dirId:this.props.dirId,
			dirName:this.props.dirName,
			canEdited: true
		}});
		/*if(this.props.currentCanEdited){
			this.context.router.push({pathname:'/report/create',query:{
				dirId:this.props.dirId,
				dirName:this.props.dirName,
				canEdited: true
			}});
		}else{
			App.emit('APP-MESSAGE-OPEN',{
            	content:"您暂时没有权限在当前文件夹下新建分析"
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
		if(!this.props.userRoot.sceneCreate && !this.props.userRoot.reportCreate){
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
			if(this.props.userRoot.reportCreate){//当前用户在当前模块下是否可以创建我的分析
				createReportBtn = <FloatingActionButton 
									style={{display:this.state.showAdd}} 
									mini={true} 
									className="addListButton" 
									iconClassName="iconfont icon-ictianjiafenxi24px colorIconWhite" 
									onClick={this._createFileHandle} />
			}
			return (
				<div className="addClassName">
					<DilogComponent 
						dirId={this.props.dirId} 
						dirName={this.props.dirName} 
						disabledState={this.state.disabledState}
						open={this.state.open} 
						dilogType={this.state.names}
						listData={this.props.listData}/>
					<FloatingActionButton 
						style={{marginBottom:'16px'}} 
						className="addListButton" 
						iconClassName={openClassName} 
						onClick={this._onTouchHandle} />
						{createDirBtn}
						{createReportBtn}
				</div>
			)
		}
	},
});