/**
 * 框架页左侧抽屉
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
	Snackbar

} = require('material-ui');
module.exports = React.createClass({
	app: {},
	getInitialState: function() {
		return {
			open: false,
			time: 3000,
			content: '',
			paenl:false
		};
	},
	componentDidMount: function() {
		this.app['APP-MESSAGE-OPEN'] = App.on('APP-MESSAGE-OPEN', this._openMessage);
		this.app['APP-MESSAGE-CLOSE'] = App.on('APP-MESSAGE-CLOSE', this._closeMessage);
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentDidUpdate: function() {

	},
	render: function() {
		var title = this.state.title ? <div className="message-title">{this.state.title}</div> : <div></div>;
		var button = this.state.buttons ? <div className="message-button">{this.state.button}</div> : <div></div>;
		if(this.state.paenl){
			return (
				<div className="message-panel">
					<div className="message-component">
						{title}
						<div className="message-content">
							{this.state.content}
						</div>
						{button}
					</div>
				</div>
			)
		}else{
			return (
				<div className="message-panel">
					<Snackbar className="snackBarBox" open={this.state.open} message={this.state.content} autoHideDuration={this.state.time} onRequestClose={this._closeMessage}/>
				</div>
			)
		} 
	},
	_openMessage: function(arg) {
		var time = arg.time ? arg.time : 3000;
		this.setState({
			open: true,
			content: arg.content,
			time: time,
			paenl:arg.paenl
		});
	},
	_closeMessage: function() {
		this.setState({
			open: false,
			content: '',
			time: 3000,
			paenl:false
		});
	}
})