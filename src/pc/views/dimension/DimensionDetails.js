var React = require('react');
var Loading = require('../common/Loading');
var App = require('app');
var DimensionDetailsItem = require('./DimensionDetailsItem');
var {
	
    FlatButton,

	} = require('material-ui');
var {
	Router
	} = require('react-router');
	
module.exports = React.createClass({
	displayName: 'dimensionDetails',
	app:{},
	contextTypes: {
		
	},
	componentWillUnmount: function() {
		// for(var i in this.app){
  //           this.app[i].remove();
  //       }
	},
	getDefaultProps: function() {
		return {
           
		}
	},
	getInitialState: function() {
		return {
			dimensionId:this.props.location.query.dimensionId,
			dimensionName:this.props.location.query.dimensionName,
			data:null,
			loading:false,
		}
	},
	componentWillMount:function(){
		
		//this.props.location.query.action;
		//this._getDimensionData(this.props.location.query.dimensionId);
	},
	componentWillReceiveProps:function(nextProps){
	
	},
	componentDidMount: function() {
		App.on('APP-DIMENSION-LOADING',this._setLoading);
	},
	componentDidUpdate: function() {
		
	},
	componentWillUnmount: function () {
       
    },
	render: function() {
		
		// if(this.state.loading){
		// 	return <Loading/>
		// }else{
			return (
				<div className="page-report-view">
					<div className="main-view">
						<DimensionDetailsItem dimensionId={this.state.dimensionId} dimensionName={this.state.dimensionName}/>
					</div>
				</div>
			)
		//}
		
	},
	_setLoading:function(arg){
		this.setState({
			loading:arg.loading
		});
	}
})