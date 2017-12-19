/**
 * 公共的button
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
	LeftNav,
  FlatButton
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	getInitialState: function() {
      return {
      }
	},
	componentDidMount: function() {

	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	render: function() {
    var style=this.props.style;
    if(this.props.disabled){
      style={
          color:'rgba(221,225,227,0.3)',
    	}
    }
    return(
        <FlatButton
				title={this.props.title}
				 icon={this.props.icon}
				 style={style}
				 className={this.props.className}
				 label={this.props.labelText}
				 disabled={this.props.disabled}
				 secondary={this.props.secondary}
				 primary={this.props.primary}
				 keyboardFocused={this.props.keyboardFocused}
				 rippleColor={this.props.rippleColor}
				 hoverColor={this.props.hoverColor}
				 labelStyle={this.props.labelStyle} 
				 backgroundColor={this.props.backgroundColor}
				 onTouchTap={this.props.onClick}/>
     )

	},


})
