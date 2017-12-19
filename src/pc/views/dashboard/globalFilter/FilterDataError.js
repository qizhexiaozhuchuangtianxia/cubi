/**
 * 错误提示
 */

var React = require('react');

module.exports = React.createClass({
	displayName: 'Error',
	propTypes: {
		message: React.PropTypes.string,

	},
	getInitialState: function () {
		return {

		};
	},
	componentDidMount: function () {

	},
	componentDidUpdate: function () {

	},
	render: function () {
		return (
			 <div className="filter-list-error">
				 <div className="filter-list-error-bg">
					<div className="filter-list-error-text">{this.props.message}</div>
				</div>
			 </div>


		)
	}
});
