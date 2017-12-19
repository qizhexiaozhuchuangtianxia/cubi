/**
 * 右侧数据立方
 */
 var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {
			clsName: "",
			component: null
		};
	},
	componentDidMount: function() {
		/*setTimeout(function(){
			$(_this.refs.setDrawer).addClass('show');
		},100);*/
		this.app['APP-DRAWER-BOTTOM'] = App.on('APP-DRAWER-BOTTOM', this._show);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
		return (
			<div>
				<div className='set-drawer hide' ref="setDrawer">
					<div className="drawer-bg"></div>
					{this.state.component}
				</div>
				<div className="set-drawer-layer" ref="layer" onClick={this._close}></div>
			</div>
		);
	},
	_show:function(component,className){
		var state = this.state;
		state.clsName = className;
		state.component = component;
		this.setState(state);
		var _this = this;
		$(this.refs.setDrawer).addClass(this.state.clsName);
		$(this.refs.layer).addClass('show');
		setTimeout(function(){
			$(_this.refs.setDrawer).addClass('show');
		},100);
		setTimeout(function(){
			$(_this.refs.setDrawer).removeClass('hide');
		},600);
	},
	_close:function(arg){
		var _this = this;
		$(this.refs.setDrawer).removeClass('show');
		$(this.refs.setDrawer).addClass('hide');
		$(this.refs.layer).removeClass('show');
		setTimeout(function(){
			$(_this.refs.setDrawer).removeClass(_this.state.clsName);
			$('.sbtn-panel').show();
			$('.gbtn-panel').show();
			$('.ibtn-panel').show();
			_this.setState(function(previousState,currentProps) {
				return {
					clsName: "",
					component: null
				};
			});
		},500);
	}
})
