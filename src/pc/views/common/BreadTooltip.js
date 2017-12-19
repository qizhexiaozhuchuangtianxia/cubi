 /**
 * tooltip
 *
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');


module.exports = React.createClass({

	displayName: 'breadtooltip',
	getInitialState: function() {

		return {
			data:this.props.breadData,
			index:this.props.key,
			open:this.props.open
		}
	},
	componentWillMount:function(){

	},
	componentDidMount: function() {

	},

	componentDidUpdate: function() {

	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
            open:nextProps.open,

		})

	},
	render: function() {
		var block = 'block';
		if(this.state.open){
			 block = "none"
		}

		return (

			<div className="tooltipBox" style={{display:block,left:this.props.leftX,top:this.props.topY  }} >
				<span>{this.state.data}</span>
    		</div>
		)



	}
});
