/**
 * FusionCharts View
 * 
 * 暂时不用
 */


var React = require('react');
var ReactDOM = require('react-dom');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');

module.exports = React.createClass({

	propTypes: {
		style: React.PropTypes.object
	},

	componentDidMount: function() {
		setTimeout(this.loadChart, 500);
	},

	render: function() {
		var props = this.props;
		console.log('FusionChart render');
		return (
			<div ref="chart-container" className="chart-container" style={props.style}>
				<div className="loadding">
					数据加载中 ...
				</div>
			</div>
		)
	},


	componentWillUnmount: function() {
		if (this._chart) {
			this._chart.dispose();
		}
	},

	loadChart: function() {
		ReportStore.getChartData().then(this.loadChartCallback);
	},

	loadChartCallback: function(chartData) {
		var chartConfig = this.getChartConfig();
		chartConfig.dataSource.categories = chartData.categories;
		chartConfig.dataSource.dataset = chartData.dataset;
		chartConfig.dataSource.trendlines = chartData.trendlines;
		var chart = this._chart = new FusionCharts(chartConfig);
		chart.render();
	},

	getChartConfig: function() {

		var chartContainer = ReactDOM.findDOMNode(this.refs['chart-container']);

		//var minWidth = 800;

		//var width = Math.max(chartContainer.offsetWidth - 0, minWidth);
		//var width = minWidth;

		//var height = document.body.clientHeight - 136;

		//var height = 4 / 7 * width;


		// 		   font: 'font',
		//         fontFamily: 'font-family',
		//         'font-family': 'font-family',
		//         fontWeight: 'font-weight',
		//         'font-weight': 'font-weight',
		//         fontSize: 'font-size',
		//         'font-size': 'font-size',
		//         lineHeight: 'line-height',
		//         'line-height': 'line-height',
		//         textDecoration: 'text-decoration',
		//         'text-decoration': 'text-decoration',
		//         color: 'color',
		//         whiteSpace: 'white-space',
		//         'white-space'
		//         : 'white-space',
		//         padding: 'padding',
		//         margin: 'margin',
		//         background: 'background',
		//         backgroundColor: 'background-color',
		//         'background-color': 'background-color',
		//         backgroundImage: 'background-image',
		//         'background-image': 'background-image',
		//         backgroundPosition: 'background-position',
		//         'background-position': 'background-position',
		//         backgroundPositionLeft: 'background-position-left',
		//         'background-position-left': 'background-position-left',
		//         backgroundPositionTop: 'background-position-top',
		//         'background-position-top': 'background-position-top',
		//         backgroundRepeat: 'background-repeat',
		//         'background-repeat': 'background-repeat',
		//         border: 'border',
		//         borderColor: 'border-color',
		//         'border-color': 'border-color',
		//         borderStyle: 'border-style',
		//         'border-style': 'border-style',
		//         borderThickness: 'border-thickness',
		//         'border-thickness': 'border-thickness',
		//         borderTop: 'border-top',
		//         'border-top': 'border-top',
		//         borderTopColor: 'border-top-color',
		//         'border-top-color': 'border-top-color',
		//         borderTopStyle: 'border-top-style',
		//         'border-top-style': 'border-top-style',
		//         borderTopThickness: 'border-top-thickness',
		//         'border-top-thickness': 'border-top-thickness',
		//         borderRight: 'border-right',
		//         'border-right': 'border-right',
		//         borderRightColor: 'border-right-color',
		//         'border-right-color': 'border-right-color',
		//         borderRightStyle: 'border-right-style',
		//         'border-right-style': 'border-right-style',
		//         borderRightThickness: 'border-right-thickness',
		//         'border-right-thickness': 'border-right-thickness',
		//         borderBottom: 'border-bottom',
		//         'border-bottom': 'border-bottom',
		//         borderBottomColor: 'border-bottom-color',
		//         'border-bottom-color': 'border-bottom-color',
		//         borderBottomStyle: 'border-bottom-style',
		//         'border-bottom-style': 'border-bottom-style',
		//         borderBottomThickness: 'border-bottom-thickness',
		//         'border-bottom-thickness': 'border-bottom-thickness',
		//         borderLeft: 'border-left',
		//         'border-left': 'border-left',
		//         borderLeftColor: 'border-left-color',
		//         'border-left-color': 'border-left-color',
		//         borderLeftStyle: 'border-left-style',
		//         'border-left-Style': 'border-left-style',
		//         borderLeftThickness: 'border-left-thickness',
		//         'border-left-thickness': 'border-left-thickness'

		return {

			"type": "mscombidy2d",
			"renderAt": chartContainer,
			"width": "100%",
			"height": "100%",
			"dataFormat": "json",
			"dataSource": {
				"chart": {
					"caption": "2015年销量",
					"bgcolor": "455A64",
					"bgalpha": "100",
					"basefontcolor": "edeeef",
					"canvasbgalpha": "0",
					"canvasbordercolor": "edeeef",
					"divlinecolor": "edeeef",
					"xAxisLineColor": "#999",
					"divlineColor": "#999",
					"legendItemFontSize": "14",
					"legendItemFontColor": "#eee",
					"divLineIsDashed": "0",
					"showValues": "0",
					"labelpadding": "10",
					"numberScaleValue": '10000',
					"numberscaleunit": "万",
					"formatNumber": 0,
					"theme": "fint",
					"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
				},
			},
			"loadMessage": '',
			"containerBackgroundColor": "transparent",
		};
	}
})