var React = require('react');

module.exports = React.createClass({

	displayName: 'BodyView',

	getDefaultProps: function() {

	},

	render: function() {
		return <div className="body-view">{this.props.children}</div>;
	}
})