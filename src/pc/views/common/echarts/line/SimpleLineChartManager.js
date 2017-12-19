var _ = require('lodash');
var EChartManager = require('../EChartManager');

var {
	createTooltipFormatter,
} = require('../helpers');

function LineChartManager() {
	EChartManager.call(this);
}

LineChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {

		return {

			legend: {
				show: false,
			},

			backgroundColor: 'transparent',

			color: this.CHART_COLORS,

			tooltip: {
				show: false,
			},
			grid: {
				left: 45,
				top: 15,
				right: 15,
				bottom: 35,
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLine: {
					show: false,
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show:false,
				},
				axisLabel: {
					//show:false,
					//interval: 0,
					textStyle: {
						color: '#A9A9A9',
						fontSize: 8,
					},
				},
				data: [],
			},
			yAxis: {
				type: 'value',
				splitNumber: 3,
				axisLine: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#e6e6e6',
						width: 1.5,
					}
				},
				axisLabel: {
					textStyle: {
						color: '#A9A9A9',
						fontSize: 8,
					}
				},
				axisTick: {
					show: false,
				},
			},
			series: []
		};
	},

	setData: function(data) {

		var option = this.option;

		option.tooltip.formatter = createTooltipFormatter(data.xAxisName);

		//option.title.text = dataSet.seriesName;
		var series = option.series = [];
		option.xAxis.data = data.categories;

		option.legend.data = [];

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];

			option.legend.data.push(dataSet.seriesName);

			var series_1 = {
				name: dataSet.seriesName,
				type: 'line',
				smooth: true,
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				symbol: 'circle',
				silent: true,
				data: []
			};

			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = dataSet.setArray[j].value;
					series_1.data.push(parseFloat(value || 0));
				}
			}

			series.push(series_1);

		};

		if (series.length > 10) option.color = this.CHART_COLORS_2;

		return this;
	},
});

module.exports = LineChartManager;