/**
 * 框架页左侧抽屉
 */
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
	LeftNav,
	MenuItem
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {
			open: false,
			component: null
		};
	},
	componentDidMount: function() {
		this.app['APP-DIALIG-OPEN'] = App.on('APP-DIALIG-OPEN', this._openDialog);
		this.app['APP-DIALIG-CLOSE'] = App.on('APP-DIALIG-CLOSE', this._closeDialog);
		$(ReactDOM.findDOMNode(this)).height(document.body.clientHeight-80);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
		var className = this.state.open ? 'dialog-panel show':'dialog-panel';
		return (
			<div className={className}>
				{this.state.component}
			</div>
		)
	},
	_openDialog: function(component) {
		this.setState({
			open:true,
			component: component
		},function(){
			$(ReactDOM.findDOMNode(this)).height(document.body.clientHeight-80);
		});
	},
	_closeDialog: function() {
		this.setState({
			open: false,
			component: null
		});
	}
})
