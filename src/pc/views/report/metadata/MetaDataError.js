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
	componentDidUpdate: function (oldProps) {
		
	},
	render: function () {
		return (
			 <div className="metadata-error">
				 <div className="metadata-error-bg">
					<div className="metadata-error-text">{this.props.message}</div>
				</div>
			 </div>
		           
		            
		)
	}
});