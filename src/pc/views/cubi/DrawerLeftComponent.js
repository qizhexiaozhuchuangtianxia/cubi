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
			component: <DrawerLeftView/>
		};
	},
	componentDidMount: function() {
		this.app['APP-DRAWER-LEFT'] = App.on('APP-DRAWER-LEFT', this._drawerLeft);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
		return (
			<div className="page-drawer-left">
				<LeftNav className="left-nav" ref="drawerswitch" docked={false} width={256} open={this.state.open} onRequestChange={open=>this.setState({open})} >
					{this.state.component}
				</LeftNav>
			</div>
		)
	},
	_drawerLeft: function() {
		this.setState({
			open: !this.state.open
		});
	}
})