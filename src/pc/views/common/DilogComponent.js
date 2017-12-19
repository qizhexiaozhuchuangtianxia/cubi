var React = require('react');
var App = require('app');
var $ = require('jquery');
var {
	Dialog,
	TextField,
	FlatButton 
	} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			showAdd:'none',
			open:false
		}
	},
	componentDidMount: function() {
	},
	_cancleDilogHandle:function(evt){
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-CANCEL-DILOG-HANDLE',{
			inputText:'取消'
		})
	},
	_submitDilogHandle:function(evt){
		evt.stopPropagation();
		if(this.state.thisVal!==undefined && this.state.thisVal !== ''){
			App.emit('APP-DASHBOARD-SUBMIT-CALLBACK-DILOG-HANDLE',{
				inputText:'确定',
				createName:this.state.thisVal
			})
		}else{
			alert('名字不能为空');
			return false;
		}
	},
	_getInputVal:function(evt){
		evt.stopPropagation();
		var thisVal = $(evt.target).val();
		this.setState(function(previousState,currentProps){//设置新建的名字
			previousState.thisVal=thisVal.trim();
			return {previousState};
		})
	},
	render: function() {
		var actions = [
			<FlatButton label="取消" style={{color:'#fff',fontSize:'14px'}} hoverColor="#00e5ff" rippleColor="#00e5ff" onTouchTap={(evt)=>this._cancleDilogHandle(evt)} />,
	      	<FlatButton label="创建" style={{color:'#fff',fontSize:'14px'}} hoverColor="#00e5ff" onTouchTap={(evt)=>this._submitDilogHandle(evt)}/>,
	    ];
		var openClassName=classnames('iconfont icon-ictianjia24px colorIconWhite',{
			'iconfont icon-icshouqi24px colorIconWhite':this.state.showAdd==='inline-block'
		});
		return (
			<Dialog title="创建文件夹" actions={actions} modal={false} open={this.props.open} contentClassName="dialogAddClassName" bodyClassName="dialogAddClassNameBody" titleClassName="dialogAddClassNameTitle" actionsContainerClassName="dialogAddClassNameBottom">
	        	<TextField defaultValue="" onBlur={(evt)=>this._getInputVal(evt)} hintText="文件夹名称" hintStyle={{color:'#fff',fontSize:'14px'}} floatingLabelStyle={{fontSize:'14px'}} floatingLabelText="文件夹名称1" className="textInputClassName" />
	        </Dialog>
		)
	}
});