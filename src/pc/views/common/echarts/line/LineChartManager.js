var _ = require('lodash');
var EChartManager = require('../EChartManager');

var {
	createScrollbarLabelFormatter,
	createTooltipFormatterForChart,
} = require('../helpers');
var ReportUtil = require('../../../../utils/ReportUtil');
function LineChartManager() {
	EChartManager.call(this);

}

LineChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function () {

		return {

			legend: {
				show: true,
				bottom: 16,
				textStyle: {
					color: '#A9A9A9'
				}
			},

			backgroundColor: 'transparent',

			color: this.CHART_COLORS,

			tooltip: {
				trigger: 'axis',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			grid: {
				bottom: 120
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
					interval: 0,
					inside: true,
					lineStyle: {
						color: '#787878',
						width: 3,
					}
				},
				axisLabel: {
					textStyle: {
						color: '#A9A9A9',
						fontSize: 14,
					},
				},
				data: [],
			},
			yAxis: {
				type: 'value',
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
						fontSize: 14,
					}
				},
				axisTick: {
					show: false,
					interval: 0,
					inside: true,
					lineStyle: {
						color: '#fff',
						width: 5,
					}
				},
			},
			dataZoom: {
				type: 'slider',
				start: 0,
				end: 100,
				left: 120,
				right: 120,
				bottom: 50,
				dataBackgroundColor: '#E1E4E5',
				fillerColor: 'rgba(55,71,79,0.15)',
				handleColor: '#BEC3C8',
				handleSize: 30,
				showDetail: true,
				showDataShadow: true,
				filterMode: 'empty',
				textStyle: {
					color: '#787878',
					fontSize: 8,
				},
			},
			series: []
		};
	},

	setData: function (data) {
		var option = this.option;
		this.xAxisName = data.xAxisName;
		this._baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);

		option.tooltip.formatter = createTooltipFormatterForChart(this._baseDataArrayForChartTooltipFormat, data.xAxisName);
		option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

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
				showSymbol: true,
				showAllSymbol: true,
				hoverAnimation: true,
				animationEasing: 'elasticInOut',
				symbol: 'circle',
				data: []
			};

			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = dataSet.setArray[j].value;
					series_1.data.push(parseFloat(value || 0));
				}
			}

			series.push(series_1);

		}
		if (series.length > 10) option.color = this.CHART_COLORS_2;

		option.legend.show = series.length <= 7;

		return this;
	},

	layout: function (width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},

	_baseDataArrayForChartTooltipFormat: [],
});

module.exports = LineChartManager;
