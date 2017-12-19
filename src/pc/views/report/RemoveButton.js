var React = require('react');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var RemoveListComponent = require('./RemoveListComponent');
var CreateDirComponent=require('./CreateDirComponent');
var CreateDirComponent=require('./CreateDirComponent');
var PublicButton = require('../common/PublicButton');
var {
	Dialog,
	IconButton,
	FontIcon
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	displayName: '我的分析页面移动组件',
	__dirId:'',
	__dirName:'',
	getInitialState: function() {
		return {
			openDialog:false,
			tipsTitle:'我的分析',
			dirId:null,
			dirName:'我的分析',
			loaded:false,
			canEdited:true,//默认不可以点击保存按钮
			canRemoveArr:[],
			seletedArr:[],//当前选中的数组
			edit:[],
		}
	},
	componentDidMount: function() {
		//订阅 更新dirid和dirname
		this.app['APP-REPORT-REMOVE-HANDLE'] = App.on('APP-REPORT-REMOVE-HANDLE', this._modifyDirIdAndDirName);
		//弹出层设置顶部的返回方法
		this.app['APP-REPORT-SET-DIRID-DIRNAME-REMOVE'] = App.on('APP-REPORT-SET-DIRID-DIRNAME-REMOVE', this._setIdNameHandle);
		//每次点击设置一个存储用户id的数组
		this.app['APP-REPORT-SET-CAN-REMOVE-ARR-HANDLE'] = App.on('APP-REPORT-SET-CAN-REMOVE-ARR-HANDLE', this._setCanRemoveArrHandle);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render: function() {
		var disableBool = this.props.checkLenProps>0?false:true
		return (
			<div>
				<IconButton
					disabled={disableBool}
					className="deleteIconBtn"
					onClick={this._handClick}
					iconClassName='iconfont icon-icyidongdao24px'></IconButton>
					{this._removeDialogHandle()}
			</div>
		)
	},
	_setCanRemoveArrHandle:function(obj){
		this.setState(function(previousState,currentProps){
			previousState.canRemoveArr.push(obj.authorityEdit);
			return {previousState};
		});
	},
	_handClick: function() {//点击移动按钮执行的方法

		var arr = [];
		//if(this.props.currentCanEdited){
		for(var i=0,j=this.props.listData.length;i<j;i++){
			if(this.props.listData[i].listCheckBoxBool){
				arr.push(this.props.listData[i].id);
			}
		}
		this.setState({
			openDialog:true,
			seletedArr:arr
		});
		//}
		// else{
		// 	App.emit('APP-MESSAGE-OPEN',{
  //           	content:"您暂时没有权限移动当前文件夹下的文件夹和分析"
  //           });
		// }
	},
	_modifyDirIdAndDirName:function(obj){//订阅 更新dirid和dirname
		this.setState({
			dirId:obj.dirId,
			tipsTitle:obj.dirName,
			canEdited:!obj.canEdited,
		})
	},
	_authorityAddHandle:function(edit){
		var moveArr=this.state.edit;
		moveArr.push(edit);
		this.setState({
			edit:moveArr
		});
	},
	_authorityPopHandle:function(){
		var moveArr=this.state.edit;
		moveArr.pop();
		this.setState({
			edit:moveArr
		});
	},
	_removeDialogHandle:function(){//另存为按钮提示框的方法
		//移动权限
		var move=true;
		var moveArr=this.state.edit;
		var stateEdit=true;
		if(moveArr.length>0){
			stateEdit=moveArr[moveArr.length-1];
		}
        if((this.props.canRemoveId != this.state.dirId)  && stateEdit){
            move=false;
        }
        //新建权限
        var sceneCreate=true;
        if(this.props.sceneCreate && stateEdit){
        	sceneCreate=false;
        }
		var actions = [
						<PublicButton
								style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                onClick={this._cancelDialogHandle}/>,
            <PublicButton
								style={{color:"rgba(0,229,255,255)"}}
                labelText="移动"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
								disabled={move}
                title={(this.props.canRemoveId == this.state.dirId)?'请选择一个文件夹':''}
								  onClick={this._yesDialogHandle}/>,
            <PublicButton
								style={{color:"rgba(0,229,255,255)"}}
                className="createDir"
                labelText="新建目录"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
								disabled={sceneCreate}
								icon={<FontIcon className="iconfont icon-ictianjia24px"/>}
                onClick={this._createDirHandle} />

	    ];
	    if(this.state.dirId == null){
	    	return  <Dialog
	    	            contentClassName="saveAsDialogBox"
	    	            titleClassName="saveAsDialogTitleBox"
	    	            bodyClassName="saveAsDialogBodyBox"
	    	            actionsContainerClassName="saveAsDialogBottmBox"
	    	            title={this.state.tipsTitle}
	    	            actions={actions}
	    	            modal={false}
	    	            open={this.state.openDialog}
	    	            onRequestClose={this._cancelDialogHandle}>
	    	            	<CreateDirComponent parentId={this.state.dirId}/>
	    	            	<RemoveListComponent
	    	            		seletedArr={this.state.seletedArr}
	    	            		dirId={this.state.dirId}
	    	            		loaded={this.state.loaded}
	    	            		authorityAddHandle={this._authorityAddHandle}/>
	    	        </Dialog>
	    }else{
	    	return  <Dialog
	    	            contentClassName="saveAsDialogBox"
	    	            titleClassName="saveAsDialogTitleBox addGoBack"
	    	            bodyClassName="saveAsDialogBodyBox"
	    	            actionsContainerClassName="saveAsDialogBottmBox"
	    	            title={this.state.tipsTitle}
	    	            actions={actions}
	    	            modal={false}
	    	            open={this.state.openDialog}
	    	            onRequestClose={this._cancelDialogHandle}>
	    	            	<CreateDirComponent parentId={this.state.dirId}/>
	    	            	<RemoveListComponent
	    	            		seletedArr={this.state.seletedArr}
	    	            		dirId={this.state.dirId}
	    	            		loaded={this.state.loaded}
	    	            		authorityAddHandle={this._authorityAddHandle}/>
	    	            	<div className="goBackDirList">
	    	            		<IconButton
	    	            			iconClassName="iconfont icon-icarrowback24px"
	    	            			onTouchTap={this._handleToggle} />
	    	            	</div>
	    	        </Dialog>
	    }

	},
	_createDirHandle:function(){//弹出层新建目录的方法
		 if(this.state.canRemoveArr[this.state.canRemoveArr.length-1]){
            if(this.state.canRemoveArr[this.state.canRemoveArr.length-1]){
                App.emit('APP-REPORT-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE',{target:'REMOVE'});
            }else{
                App.emit('APP-MESSAGE-OPEN',{
                    content:'您暂时没有权限编辑当前文件夹'
                });
            }
        }else{
            App.emit('APP-REPORT-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE',{target:'REMOVE'});
        }
	},
	_cancelDialogHandle:function(){//弹出层 取消按钮的方法
		this.setState({
			openDialog:false
		},function(){
			App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
		})
	},
	_yesDialogHandle:function(){//弹出层 确定按钮的方法v
		var _this = this;
		var targetId = this.state.dirId==null?'':this.state.dirId;
		var dataObj = {
			resources:[]
		}
		for(var i=0,j=this.props.listData.length;i<j;i++){
			if(this.props.listData[i].listCheckBoxBool){
				dataObj.resources.push(this.props.listData[i].id);
			}
		}
		if(this.state.canRemoveArr[this.state.canRemoveArr.length-1]){
			if(this.state.canRemoveArr[this.state.canRemoveArr.length-1]){
				ReportStore.removeTargetHandle(targetId,dataObj).then(function(data){
					if(data.success){
						App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
						App.emit('APP-MESSAGE-OPEN',{
			            	content:data.message
			            })
						_this._cancelDialogHandle();
					}else{
						App.emit('APP-MESSAGE-OPEN',{
			            	content:data.message
			            });
					};
				});
			}else{
				App.emit('APP-MESSAGE-OPEN',{
	            	content:"您暂时没有权限编辑当前文件夹"
	            });
			}
		}else{
			ReportStore.removeTargetHandle(targetId,dataObj).then(function(data){
				if(data.success){
					App.emit('APP-MESSAGE-OPEN',{
		            	content:data.message
		            });
					App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
					_this._cancelDialogHandle();
				}else{
					App.emit('APP-MESSAGE-OPEN',{
		            	content:data.message
		            });
				};
			});
		}
	},
	_handleToggle:function(){//点击返回按钮的方法
		var _this = this;
		this._authorityPopHandle();
		this.setState(function(previousState,currentProps){
			previousState.canRemoveArr.pop();
			previousState.dirId= _this.__dirId;
			previousState.tipsTitle= _this.__dirName;
			return {previousState};
		});
	},
	_setIdNameHandle:function(obj){
		this.__dirId = obj.id;
		this.__dirName = obj.name;
	},
});
