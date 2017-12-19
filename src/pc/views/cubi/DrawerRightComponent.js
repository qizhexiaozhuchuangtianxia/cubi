/**
 * 框架页左侧抽屉
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var DrawerLeftView = require('./Drawer');
var {
	LeftNav,
	MenuItem
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {
			open: false,
			component: null,
			width:256,
			top:0
		};
	},
	componentDidMount: function() {
		this.app['APP-DRAWER-RIGHT'] = App.on('APP-DRAWER-RIGHT', this._drawerRight);
		this.app['APP-DRAWER-RIGHT-CLOSE'] = App.on('APP-DRAWER-RIGHT-CLOSE', this._closeDrawer);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
		var dheight = document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;
		var dStyle = {},overlayStyle ={};
		if(this.state.top!=0){
			var dStyle = {top:this.state.top,height:dheight-this.state.top,zIndex:998};
			var overlayStyle = {top:this.state.top,height:dheight-this.state.top,zIndex:997};
		}
		return (
			<div className="page-drawer-right">
				<LeftNav openRight={true} className="right-drawer" style={dStyle} overlayStyle={overlayStyle} ref="drawerswitch" docked={false} width={this.state.width} open={this.state.open} onRequestChange={this._closeDrawer} >
					{this.state.component}
				</LeftNav>
			</div>
		)
	},
	_drawerRight: function(component,width,top) {
		this.setState({
			open: !this.state.open,
			component: component,
			width:width?width:256,
			top:top?top:0
		});

	},
	_closeDrawer: function() {
		this.setState({
			open: false,
			component: null
		});
	}
})
