/**
 * 报表场景
 */

var React = require('react');
var App = require('app');
var classnames = require('classnames');

module.exports = React.createClass({

	displayName: '报表场景',
	app:{},
	propTypes: {
		scenes: React.PropTypes.array.isRequired,
		onChanged: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			scenes: this.props.scenes || [],
			active: 0
		};
	},

	componentWillMount: function() {
		this.app['REPORT-STATE-CHANGED'] = App.on('REPORT-STATE-CHANGED', this.reportStateChangedHandler);
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
		return (
			<div className="cubi-tabs-container">
				<div className="cubi-tabs">
					<div className="page-container">
						<ul>
					        {this.state.scenes.map(this._renderScene)}
					    </ul>
					</div>
				</div>
			</div>
		)
	},

	_renderScene: function(scene, index) {

		var linkClass = classnames({
			'active': this.state.active == index
		});

		return (
			<li key={index} onClick={()=>this._clickHandler(scene,index)} className="cubi-tab">
		        <a href="javascript:void(0)" className={linkClass}>{scene.name}</a>
		    </li>
		);

	},

	_clickHandler: function(scene, index) {

		this.setState({
			active: index
		});

		if (this.props.onChanged) {
			this.props.onChanged(scene);
		}
	}

});