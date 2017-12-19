var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({

	displayName: 'FusionChartsView',

	propTypes: {
		chartConfig: React.PropTypes.object.isRequired, //ECharts配置
		reportData: React.PropTypes.object.isRequired, //报表数据
	},

	getInitialState: function() {
		return {};
	},

	getDefaultProps: function() {
		return {}
	},

	componentWillMount: function() {

	},

	componentDidMount: function() {
		this._renderChart();
	},

	componentWillReceiveProps: function(nextProps) {

	},

	shouldComponentUpdate: function(nextProps) {

		var props = this.props;
		var changed = false;
		if (nextProps.reportData != props.reportData) {
			changed = true;
		}
		return changed;
	},

	componentDidUpdate: function(prevProps, prevState) {
		this._renderChart();

	},

	componentWillUnmount: function() {
		if (this._chart) {
			this._chart.dispose();
			this._chart = null;
		}
		$(window).off('resize', this._resizeChart);
	},

	render: function() {
		return (
			<div className="chartPanel">
				<div className="chart-container" ref="chartPanel"></div>
			</div>
		)
	},

	_renderChart: function() {
		var chartConfig = this.props.chartConfig;
		chartConfig.renderAt = this.refs['chartPanel'];
		this._chart = new FusionCharts(chartConfig);
		this._chart.setDataXML(this.props.reportData.chartInfo.xmlData);
		this._chart.render();
	},
});