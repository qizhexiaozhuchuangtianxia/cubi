/**
 * Created by Administrator on 2016-2-29.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var FusionChartConfig = require('./FusionChartConfig');
module.exports = React.createClass({
    getInitialState: function() {
        return {
        	isValid:true
        }
    },
	componentWillMount: function() {
		//App.on('REPORT-STATE-CHANGED', this.reportStateChangedHandler);
		//this._setStateFromProps(this.props);
	},
    componentDidMount: function() {
    	this._loadChartData();
    },
    componentDidUpdate: function(oldProps) {
    	console.log('ff',oldProps.data)
    	console.log('cc',this.props.data!=oldProps.data)
		if(this.props.data!=oldProps.data){
			this._loadChartData();
		}
	},
    render: function(){
        return (
        	<div className="reportShowBox" ref="reportShowBox">
        		
        	</div>
        )
    },
	_loadChartData: function() {
		console.log('aa',this.props.data)
		if(this.props.data){
			this._loadChartDataCallback(this.props.data)
		}
	},
    _loadChartDataCallback: function(chartData) {
		var chartConfig = this.props.config;
		chartConfig.renderAt = ReactDOM.findDOMNode(this.refs['reportShowBox']);
		chartConfig.dataSource.categories = chartData.categories;
		chartConfig.dataSource.dataset = chartData.dataset;
		chartConfig.dataSource.trendlines = chartData.trendlines;
		var chart = this._chart = new FusionCharts(chartConfig);
		chart.render();
	}
});
