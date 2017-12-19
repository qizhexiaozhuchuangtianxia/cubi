/**
 * 报表维度列表
 *
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var LinksDashboards=require('./LinksDashboards');
var PublicButton = require('../common/PublicButton');


module.exports = React.createClass({

	displayName: 'SaveButton',

	getInitialState: function() {
		return {
			name: '',
			id: '',
			disabled: true
		}
	},
	componentWillMount:function(){
		this.setState({
			disabled:this.props.disabled
		})
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			disabled:nextProps.disabled
		})
	},
	componentDidMount: function() {
		this._token1 = App.on('APP-REPORT-SAVE-MODEL', this._changeSave)
	},
	componentWillUnmount: function() {
		if (this._token1) this._token1.remove();
	},
	render: function() {
		return (
			<div>
				<PublicButton
					style={{color:"rgba(0,229,255,255)"}}
					disabled={this.state.disabled}
					rippleColor="rgba(0,229,255,0.25)"
					hoverColor="rgba(0,229,255,0.15)"
					className="waves-effect waves-light btn-flat rightMargin"
					labelText="保存"
					onClick={this._handClick} />
				<LinksDashboards reportId={this.props.reportId} name={this.props.name}/>
			</div>
		)
	},
	_handClick: function() {
		App.emit('APP-REPORT-LINKS-DASHBOARDS');
		// App.emit('APP-REPORT-SAVE');
	},
	_changeSave: function(model) {
		this.setState({
			disabled:!model.changeed
		});
	}
});
