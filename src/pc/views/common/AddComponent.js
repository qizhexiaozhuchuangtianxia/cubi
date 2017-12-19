var React = require('react');
var App = require('app');
var DilogComponent = require('./dilogComponent');
var classnames=require('classnames');
var DashboardStore = require('../../stores/DashboardStore');
var {
	FloatingActionButton
	} = require('material-ui');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			showAdd:'none',
			open:false
		}
	},
	componentWillUnmount: function() {
		//取消订阅
		if (this._cancelHandle) this._cancelHandle.remove();
		if (this._submitHandle) this._submitHandle.remove();
	},
	componentDidMount: function() {
		//订阅用户选择的立方事件
		this._cancelHandle = App.on('APP-DASHBOARD-CANCEL-DILOG-HANDLE', this._cancelHandle);
		//订阅用户选择的立方事件
		this._submitHandle = App.on('APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE', this._submitHandle);
	},
	_cancelHandle:function(obj){
		this.setState(function(previousState,currentProps){//点击取消按钮关闭弹出框层
			previousState.open=false;
			return {previousState};
		})
	},
	_submitHandle:function(obj){//点击确定按钮异步请求成功后关闭弹出框层
		var _this = this;
		var directoryObject = {
			'id':'',
			'name':obj.createName
		}

		DashboardStore.newCreateDashboardDir('',directoryObject).then(function(data){
			_this.setState(function(previousState,currentProps){//点击确定按钮异步请求成功后关闭弹出框层
				previousState.open=false;
				return {previousState};
			})
			App.emit('APP-DASHBOARD-REFRESH-DASHBOARD-LIST-HANDLE',{
	        });
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
		this.setState(function(previousState,currentProps){//最后设置传过去的是文件换是文件夹
			previousState.showAdd='none'
			previousState.open=true;
			return {previousState};
		})
	},
	_createFileHandle:function(){
		this.setState(function(previousState,currentProps){//最后设置传过去的是文件换是文件夹
			previousState.showAdd='none'
			previousState.open=true;
			return {previousState};
		})
	},
	render: function() {
		var openClassName=classnames('iconfont icon-ictianjia24px colorIconWhite',{
			'iconfont icon-icshouqi24px colorIconWhite':this.state.showAdd==='inline-block'
		});
		return (
			<div className="addClassName">
			<DilogComponent open={this.state.open} />
			<FloatingActionButton style={{marginBottom:'16px'}} className="addListButton" iconClassName={openClassName} onMouseUp={this._onTouchHandle} />
			<FloatingActionButton style={{marginBottom:'16px',display:this.state.showAdd}} mini={true} className="addListButton" iconClassName="iconfont icon-icwenjianjia24px colorIconWhite" onMouseUp={this._createDirHandle} />
			<FloatingActionButton style={{display:this.state.showAdd}} mini={true} className="addListButton" iconClassName="iconfont icon-ictianjiafenxi24px colorIconWhite" onMouseUp={this._createFileHandle} />
			</div>
		)
	}
});
