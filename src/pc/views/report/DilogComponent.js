var React = require('react');
var App = require('app');
var $ = require('jquery');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Dialog
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
			disabledState:this.props.disabledState,
			errorTextState:''
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
	componentDidMount: function() {},
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
  		]
		return (
			<Dialog
				title="创建文件夹"
				actions={actions}
				modal={false}
				open={this.props.open}
				contentClassName="dialogAddClassName"
				bodyClassName="dialogAddClassNameBody"
				titleClassName="dialogAddClassNameTitle"
				actionsContainerClassName="dialogAddClassNameBottom">
				<PublicTextField
	           		className="textInputClassName"
	            	onChange={(evt)=>this._getInputVal(evt)}
	            	onKeyUp={(evt)=>this._onKeyUpSubmit(evt)}
	            	errorText={this.state.errorTextState}
	            	style={{width:302}}
	            	floatingLabelText="文件夹名称" />
	        </Dialog>
		)
	},
	_cancleDilogHandle:function(evt){
		evt.stopPropagation();
		App.emit('APP-REPORT-CANCEL-DILOG-HANDLE',{
			inputText:'取消'
		})
	},
	_onKeyUpSubmit:function(evt){//点击回车执行提交方法
		if(evt.keyCode == 13){
			this._submitDilogHandle(evt);
		}else{
			return;
		}
	},
	_submitDilogHandle:function(){//点击创建弹出层里面的创建按钮的时候执行的方法
		var flag = false;
		var errorText = '文件夹名字重复！';
		if(this.props.listData.length>0){
			for(var i=0;i<this.props.listData.length;i++){
				if(this.props.listData[i].name == this.state.thisVal){
					this.setState({
						disabledState:true,
						errorTextState:errorText,
					})
					flag = true;
				}
			}
			if(!flag){
				App.emit('APP-REPORT-SUBMIT-CALLBACK-DILOG-HANDLE',{
					createType:this.props.dilogType,
					createName:this.state.thisVal,
					parentId:this.props.dirId||''
				})
			}
		}else{
			App.emit('APP-REPORT-SUBMIT-CALLBACK-DILOG-HANDLE',{
				createType:this.props.dilogType,
				createName:this.state.thisVal,
				parentId:this.props.dirId||''
			})
		}
	},
	_getInputVal:function(evt){
		evt.stopPropagation();
		var thisVal = $(evt.target).val();
		thisVal = thisVal.trim()
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
	}
});
