var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var Dashboard = require('./views/dashboard');
var Message = require('./views/common/Message');
var cubiTheme = require('./material-ui-cubi-theme');

var {
	// RaisedButton,
	// FlatButton,
	CircularProgress
} = require('material-ui');

var CuBIApp = React.createClass({
	app: {},
	childContextTypes: {
		muiTheme: React.PropTypes.object,
	},
	getChildContext: function() {
		return {
			muiTheme: cubiTheme
		};
	},
	getInitialState: function() {
		return {};
	},
	componentWillUnmount: function() {
	},
	componentWillMount: function() {
	},
	componentWillReceiveProps: function(nextProps) {
	},
	componentDidMount: function() {
	},
	render: function() {
		return this._renderDashboardRead();
	},
	_renderDashboardRead: function() {
		var query = this.props.query;
		var backgroundColor = this.props.bgColor?this.props.bgColor:'#455a64';
		return (
			<div className="bodyer">
				<div className="page-main-frame" style={{paddingTop:0,backgroundColor:backgroundColor}}>
					<Dashboard operation="view" sdk={true} query={query}/>
				</div>
				<Message/>
				
			</div>
		)
	}
});

window.dashboardInit = function(dom){
	this.dom = dom;
	this.props = {};
	this.setProps = function(props){
		if(props)
		for(var key in props){
			this.props[key] = props[key];
		}
		return  this.props;
	}
	this.render = function(dom){
		if(dom){
			this.dom = dom;
		}
		ReactDOM.render(<CuBIApp query={this.props}/>,this.dom);
	}
}