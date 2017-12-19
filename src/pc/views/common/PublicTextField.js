/**
 * 公共的TextField
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
  TextField
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	getInitialState: function() {
      return {
        textOnblur:false
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
  var color="rgba(255,255,255,0.54)";
  var inputStyle={
       color:"rgba(255,255,255,255)"
  }

   var flabelStyle={
        fontSize:"14px",
        color:color,
    };
    var lineStyle={
          borderColor:"rgba(255,255,255,0.25)"
    };
    if(!this.props.floatingLabelStyle){
        floatingLabelStyle={}
    }
    if(this.props.lineStyle){
      lineStyle=this.props.lineStyle;
    }
    if(this.props.inputStyle){
      inputStyle=this.props.inputStyle;
    }
    var floatingLabelStyle ={
        fontSize:"12px",
        color:"rgba(0,229,255,255)",
    };
    var errorLabelStyle={
        fontSize:"12px",
        color:"#f44336"
    }


    if(!this.state.textOnblur){
      floatingLabelStyle=flabelStyle;
    }
    var className="textField"
    if(this.props.className){
      className=this.props.className
    }
    if(this.props.errorText){
      floatingLabelStyle=errorLabelStyle
    }


    return(
       <TextField
          style={this.props.style}
          type={this.props.type}
          className={className}
          id={this.props.id}
          defaultValue={this.props.defaultValue}
          underlineStyle={lineStyle}
          hintText={this.props.hintText}
          fullWidth={this.props.fullWidth}
          underlineFocusStyle={this.props.underlineFocusStyle}
          hintStyle={this.props.hintStyle}
          inputStyle={inputStyle}
          floatingLabelText={this.props.floatingLabelText}
          disabled={this.props.disabled}
          errorText={this.props.errorText}
          onChange={this.props.onChange}
          onBlur={(evt)=>this._onBlur(evt)}
          onClick={(evt)=>this._onClick(evt)}
          onEnterKeyDown={this.props.onEnterKeyDown}/>

     )

	},
  _onBlur:function(){
     this.setState({
      textOnblur:false
     })
  },
  _onClick:function(evt){
     this.setState({
      textOnblur:true
     })
  },


})
