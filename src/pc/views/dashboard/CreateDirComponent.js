var $ = require('jquery');
var React = require('react');
var App = require('app');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var DashboardStore = require('../../stores/DashboardStore');//存储数据的js
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Dialog
	} = require('material-ui');

module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {
			disabledState:true,
			errorTextState:'',
			open:false,
			parentId:this.props.parentId,
			typeList:'COPY'
		}
	},
	componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
		this.setState({
			parentId:nextProps.parentId
		})
	},
	componentDidMount: function() {
		//关闭弹出层新建文件夹弹出方法
		//this.app['APP-CLOSE-CREATE-DIRECTIVE-DIALOG-HANDLE'] = App.on('APP-CLOSE-CREATE-DIRECTIVE-DIALOG-HANDLE', this._cancleDilogHandle);
		//打开弹出层新建文件夹弹出方法
		this.app['APP-DASHBOARD-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE'] = App.on('APP-DASHBOARD-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE', this._openCreateDialogHandle);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	_openCreateDialogHandle:function(obj){
		this.setState({
			open:true,
			thisVal:'',
			errorTextState:'',
			disabledState:true,
			typeList:obj.target,
		})
	},
	_cancleDilogHandle:function(){
		this.setState({
			open:false,
			thisVal:'',
			errorTextState:'',
			disabledState:true,
			typeList:'COPY',
		})
	},
	_submitDilogHandle:function(){//点击弹出框确定按钮的方法
		var _this = this;
	  	var emitFun = '';
		var saveReNameObj = {
		   "id": null,
		   "name": this.state.thisVal,
		   "parentId": this.state.parentId||'',
		   "type": 'DIRECTORY', //目录：DIRECTORY
	  	}
	  	if(this.state.typeList == 'COPY'){
	  		emitFun = 'APP-DASHBOARD-COPY-REFRESH-LIST-HANDLE';
	  	}else if(this.state.typeList == 'REMOVE'){
	  		emitFun = 'APP-DASHBOARD-REMOVE-REFRESH-LIST-HANDLE';
	  	}
		DashboardStore.newCreateDashboardDir(saveReNameObj).then(function(data){
			if(data.success){
				App.emit('APP-MESSAGE-OPEN',{
	            	content:data.message
	            });
				App.emit(emitFun,_this.state.parentId);
				// App.emit('APP-DASHBOARD-REFRESH-LIST-HANDLE')
				_this._cancleDilogHandle();
			}else{
				App.emit('APP-MESSAGE-OPEN',{
	            	content:data.message
	            });
			}
		});
	},
	_getInputVal:function(evt){//检查输入的名字的合法性方法
		evt.stopPropagation();
		var thisVal = $(evt.target).val();
		thisVal = thisVal.trim()
		if(thisVal!==undefined && thisVal!== null && thisVal !== ""){
			if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)){
				this.setState({
					errorTextState:"当前输入的名字格式错误",
					disabledState:true
				})
			}else{
				if(CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16){
					this.setState({
						errorTextState:CheckEntryTextComponent.checkAllNameLengthHandle(thisVal)+" / 16",
						disabledState:true
					})
				}else{
					this.setState({
						disabledState:false,
						errorTextState:'',
						thisVal:thisVal
					})
				}
			}

		}else{
			this.setState({
				disabledState:true,
				errorTextState:"名字不能为空",
			})
		}
	},
	render: function() {
		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				onClick={(evt)=>this._cancleDilogHandle(evt)}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="创建"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				disabled={this.state.disabledState}
				onClick={(evt)=>this._submitDilogHandle(evt)}/>

	    ];
		return (
			<Dialog
				title="新建文件夹"
				actions={actions}
				modal={false}
				open={this.state.open}
				contentClassName="dialogAddClassName"
				bodyClassName="dialogAddClassNameBody"
				titleClassName="dialogAddClassNameTitle"
				actionsContainerClassName="dialogAddClassNameBottom">
	        	<PublicTextField
								style={{width:"100%"}}
		        		floatingLabelText="文件夹名称"
		        		errorText={this.state.errorTextState}
								onChange={(evt)=>this._getInputVal(evt)}/>
	        </Dialog>
		)
	}
});
