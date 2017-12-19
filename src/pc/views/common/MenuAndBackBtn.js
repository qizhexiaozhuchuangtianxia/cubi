var React = require('react');
var App = require('app');
var {
	IconMenu,
	IconButton
	} = require('material-ui');
module.exports = React.createClass({
	app:{},
	getInitialState:function(){//设置了默认的state的值
		return {
			menuToggleBack:false
		}
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	componentWillMount:function(){//组件将要加载的时候执行的方法
	},
	componentDidMount:function(){//组件加载完成之后执行的方法
		this.app['APP-MENU-TOGGLE-BACK-HANDLE'] = App.on('APP-MENU-TOGGLE-BACK-HANDLE', this._menuToggleBackHandle);
	},
  	_touchHadle:function(){//点击返回按钮执行的方法

  		if(this.state.backHandle){
				App.emit('APP-DRAWER-RIGHT-CLOSE');
  			App.emit(this.state.backHandle,this.state.arg);
  		}
  	},
	_menuToggleBackHandle:function(obj){
		this.setState(function(previousState,currentProps){
			previousState.menuToggleBack=obj.toggle;
			if(obj.func){previousState.backHandle=obj.func};
			previousState.arg = obj.arg;
			return {previousState};
		});
	},
	_handleToggle: function() {
		App.emit('APP-DRAWER-LEFT');
	},
	render:function(){//组件挂在的到dom上去
		if(this.state.menuToggleBack){
			return <IconMenu className="iconMenuClassName" onTouchTap={this._touchHadle} open={false} iconButtonElement = {<IconButton iconClassName = "iconiPad iconfont icon-icarrowback24px" />}></IconMenu>
		}else{
			return <IconButton className="menu-btn" iconClassName="iconiPad iconfont icon-icmenu24px" ref="drawerswitch" onTouchTap={this._handleToggle} />
		}
	}
})
