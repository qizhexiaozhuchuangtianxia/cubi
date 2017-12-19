/**
 * 加载中
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
	CircularProgress
} = require('material-ui');
module.exports = React.createClass({
	displayName: 'loading',
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
			<div  className="loading-box">
                <CircularProgress mode="indeterminate"/>
            </div>
		)
	}
});