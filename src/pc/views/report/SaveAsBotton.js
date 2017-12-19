var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var SaveAsDialogListComponent = require('./SaveAsDialogListComponent');
var PublicButton = require('../common/PublicButton');

var {
	Dialog,
	IconButton
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	displayName: '另存为组件',
	getInitialState: function() {
		return {
			openDialog:false,
			disabled:true,
			loaded:false,
			saveAsIdNameArr:[{dirId:null,dirName:'我的分析',authorityEdit:true}]//每次点击之后存储当前文件夹的信息 用于放回
		}
	},
	componentWillMount:function(){
		this.setState({
			disabled:this.props.disabled
		})
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			disabled:nextProps.disabled
		})
	},
	componentDidMount: function() {
		//点击一层 就存储当前层的数据,id和名字
		this.app['APP-REPORT-SAVE-AS-LIST-HANDLE'] = App.on('APP-REPORT-SAVE-AS-LIST-HANDLE', this._modifyDirIdAndDirName);
		this.app['APP-REPORT-SAVE-AS-MODEL'] = App.on('APP-REPORT-SAVE-AS-MODEL', this._changeSaveAs);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render: function() {
		return (
			<div>
				<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="另存为..."
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				disabled={this.state.disabled}
				className="waves-effect waves-light btn-flat rightMargin"
				onClick={(evt)=>this._saveAsHandClick(evt)}/>

				{this._saveAsDialogHandle()}
			</div>
		)
	},
	_modifyDirIdAndDirName:function(obj){//订阅 更新dirid和dirname
		this.setState(function(previousState,currentProps){
		    previousState.saveAsIdNameArr.push(obj);
		    return {previousState};
		});
	},
	_saveAsDialogHandle:function(){//另存为按钮提示框的方法
		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				onClick={(evt)=>this._cancelDialogHandle(evt)}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="保存"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				onClick={(evt)=>this._yesDialogHandle(evt)}/>

	    ];
	    if(this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirId == null){
	    	return  <Dialog
	    	            contentClassName="saveAsDialogBox"
	    	            titleClassName="saveAsDialogTitleBox"
	    	            bodyClassName="saveAsDialogBodyBox"
	    	            actionsContainerClassName="saveAsDialogBottmBox"
	    	            title={this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirName}
	    	            actions={actions}
	    	            modal={false}
	    	            open={this.state.openDialog}
	    	            onRequestClose={this._cancelDialogHandle}>
	    	            	<SaveAsDialogListComponent
	    	            		dirId={this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirId}
	    	            		loaded={this.state.loaded}/>
	    	        </Dialog>
	    }else{
	    	return  <Dialog
	    	            contentClassName="saveAsDialogBox"
	    	            titleClassName="saveAsDialogTitleBox addGoBack"
	    	            bodyClassName="saveAsDialogBodyBox"
	    	            actionsContainerClassName="saveAsDialogBottmBox"
	    	            title={this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirName}
	    	            actions={actions}
	    	            modal={false}
	    	            open={this.state.openDialog}
	    	            onRequestClose={this._cancelDialogHandle}>
	    	            	<SaveAsDialogListComponent
	    	            		dirId={this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirId}
	    	            		loaded={this.state.loaded}/>
	    	            	<div className="goBackDirList">
	    	            		<IconButton
	    	            			iconClassName="iconfont icon-icarrowback24px"
	    	            			onTouchTap={this._handleToggle} />
	    	            	</div>
	    	        </Dialog>
	    }

	},
	_cancelDialogHandle:function(){//弹出层 取消按钮的方法
		this.setState({
			openDialog:false
		})
	},
	_yesDialogHandle:function(evt){//弹出层 确定按钮的方法
		evt.stopPropagation();
		if(this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1]){
		    if(this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].authorityEdit){
		        App.emit('APP-REPORT-OPEN-SET-REPORT-NAME-HANDLE',{
					directoryId:this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirId,
					closeTck:this._cancelDialogHandle,
				});
		    }else{
		        App.emit('APP-MESSAGE-OPEN',{
		            content:"您暂时没有权限编辑当前文件夹"
		        });
		    }
		}else{
		    App.emit('APP-REPORT-OPEN-SET-REPORT-NAME-HANDLE',{
				directoryId:this.state.saveAsIdNameArr[this.state.saveAsIdNameArr.length-1].dirId,
				closeTck:this._cancelDialogHandle,
			});
		}
	},
	_saveAsHandClick: function(evt) {//点击另存为按钮执行的方法
		evt.stopPropagation();
		this.setState({
			openDialog:true
		})
	},
	_handleToggle:function(){//点击返回按钮的方法
		var _this = this;
		this.setState(function(previousState,currentProps){
		    previousState.saveAsIdNameArr.pop();
		    return {previousState};
		});
	},
	_changeSaveAs: function(model) {//控制另存为按钮是否可以点击 方法
		this.setState({
			disabled:!model.changeed
		});
	}
});
