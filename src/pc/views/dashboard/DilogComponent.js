var React = require('react');
var App = require('app');
var $ = require('jquery');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var DashboardStore = require('../../stores/DashboardStore');//存储数据的js
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Dialog,
	} = require('material-ui');
var {
	Router,
	Route,
	Link,
	IndexRoute,
} = require('react-router');
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			showAdd:'none',
			disabledState:this.props.disabledState,
			errorTextState:'',
			thisVal:''
		}
	},
	componentWillReceiveProps:function(){
		var _this = this;
		this.setState(function(previousState,currentProps){//设置新建的名字
			previousState.thisVal=null;
			previousState.errorTextState='';
			previousState.disabledState = _this.props.disabledState;
			return {previousState};
		})
	},
	componentDidMount: function() {
	},
	_cancleDilogHandle:function(evt){
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-CANCEL-DILOG-HANDLE',{
			inputText:'取消'
		})
	},
	_submitDilogHandle:function(){//点击弹出框确定按钮的方法
		var flag = false;
		var errorText = '文件夹名字重复！';
		if(this.props.dilogType == "DASHBOARD"){
			errorText="驾驶舱名字重复！"
		}

		if(this.props.listData.length>0){
			for(var i=0;i<this.props.listData.length;i++){
				if(this.props.listData[i].name == this.state.thisVal && this.props.listData[i].type == this.props.dilogType){
					this.setState({
						disabledState:true,
						errorTextState:errorText,
					})
					flag = true;
				}
			}
			if(!flag){
				if(this.state.errorTextState == ''  ){
					App.emit('APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE',{
						createType:this.props.dilogType,
						createName:this.state.thisVal,
						parentId:this.props.dirId
					})
				}else{
					return
				}

			}
		}else{
			if(this.state.errorTextState == ''){
				App.emit('APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE',{
					createType:this.props.dilogType,
					createName:this.state.thisVal,
					parentId:this.props.dirId
				})
			}else{
				return false
			}

		}
	},
	_getInputVal:function(evt){
		evt.stopPropagation();
		var thisVal = $(evt.target).val();
		thisVal = thisVal.trim()
		this.setState({
			thisVal: thisVal
		})
		if(thisVal!==undefined && thisVal!== null && thisVal !== ""){
			if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)){
				this.setState({
					errorTextState:'当前输入的名字格式错误',
					disabledState:true
				})
			}else{
				if(CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16){
					this.setState({
						errorTextState:CheckEntryTextComponent.checkAllNameLengthHandle(thisVal)+' / 16',
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
				errorTextState:'名字不能为空',
			})
		}
	},
	_dashboardDisplayName:function(){//弹出框标题
		if(this.props.dilogType == "DIRECTORY"){
			return '新建文件夹';
		}
		if(this.props.dilogType == "DASHBOARD"){
			return '新建驾驶舱';
		}
	},
	_dashboardTextName:function(){//弹出框输入框提示文字
		if(this.props.dilogType == "DIRECTORY"){
			return '文件夹名称';
		}
		if(this.props.dilogType == "DASHBOARD"){
			return '驾驶舱名称';
		}
	},
	_onKeyDownHandle:function(evt){
		if(evt.keyCode == 13){
			this._submitDilogHandle();
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
				title={this._dashboardDisplayName()}
				actions={actions}
				modal={false}
				open={this.props.open}
				contentClassName="dialogAddClassName"
				bodyClassName="dialogAddClassNameBody"
				titleClassName="dialogAddClassNameTitle"
				actionsContainerClassName="dialogAddClassNameBottom">
	        	<PublicTextField
							style={{width:'100%'}}
							floatingLabelText={this._dashboardTextName()}
	        		onChange={(evt)=>this._getInputVal(evt)}
		      		onKeyDown={(evt)=>this._onKeyDownHandle(evt)}
	        		errorText={this.state.errorTextState}/>
	        </Dialog>
		)
	}
});
