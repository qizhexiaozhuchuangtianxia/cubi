var _ = require('lodash');
var EChartManager = require('../EChartManager');
var SetZhibiaoOption = require('./SetZhibiaoOption');

function BarChartManager() {
	EChartManager.call(this);
	this.SetZhibiaoOption=new SetZhibiaoOption(this);
}

BarChartManager.prototype = _.create(EChartManager.prototype, {

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
				bottom: 35
			},
			xAxis: {
				type: 'category',
				axisLine: {
					show: false,
				},
				splitLine: {
					show: true,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
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
					interval: 0,
					inside: true,
					lineStyle: {
						color: '#fff',
						width: 5,
					}
				},
			},
		};
	},

	setData: function(data) {

		var option = this.option;
		
		if (!data.datasetArray) {
			throw new Error('unexpected');
		}
		this.data=data;
		var series = option.series = [];

		option.xAxis.data = data.categories;

		option.legend.data = [];

		//option.title.text = dataSet.seriesName;

		if (data.datasetArray.length > 10) option.color = this.CHART_COLORS_2;

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];

			option.legend.data.push(dataSet.seriesName);

			var series_1 = {
				name: dataSet.seriesName,
				type: 'bar',
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				barMinHeight: 3,
				silent: true,
				data: []
			};


			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = dataSet.setArray[j].value;
					series_1.data.push(value ? parseFloat(value || 0) : null);
				}
			}

			series.push(series_1);
		}

		return this;
	},

});

module.exports = BarChartManager;