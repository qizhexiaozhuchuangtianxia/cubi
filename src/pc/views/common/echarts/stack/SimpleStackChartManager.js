var _ = require('lodash');
var EChartManager = require('../EChartManager');
var SetOption=require('./setOption');
function SimpleStackChartManager() {
	EChartManager.call(this);
}

SimpleStackChartManager.prototype = _.create(EChartManager.prototype, {

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
				left: 55,
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
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#e6e6e6',
						width: 1.5,
					}
				},
				axisLabel: {
					interval: 'auto',
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
			}
		}
	},

	setData: function(data) {
		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		// this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
		// this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);
		this.indexFields=data.indexFields;
		var series = this.option.series = [];

		this.option.xAxis.data = data.categories;

		this.option.legend.data = [];

		//this.option.title.text = dataSet.seriesName;

		if (data.datasetArray.length > 10) this.option.color = this.CHART_COLORS_2;

		this.option.tooltip.formatter = function(params, ticket) {
			return `<table>
						<tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}</td></tr>
						<tr><td>${params.data.fieldsName}</td><td>&nbsp;${params.data.totalValue}</td></tr>
					</table>`
		};

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];
			//var stackName = data.datasetArray[0].seriesName;
			this.option.legend.data.push(dataSet.seriesName);
			//this.option.legend.selected[dataSet.seriesName] = true;
			var series_1 = {
				name: dataSet.seriesName,
				type: 'bar',
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				//stack:stackName ,
				label: {
					normal: {
						show: false,
						// position: 'top',
						// textStyle: {
						// 	color: '#000'
						// }
					},
					emphasis: {
						show: true,
						position: 'inside',
						///formatter: '{c} %',
						textStyle: {
							color: '#000'
						}
					}
				},

				//barMinHeight: 1,
				data: []
			};
			//this.option.series.formatter
			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = 0;
					if (dataSet.setArray[j].value != undefined) {
						value = parseFloat(dataSet.setArray[j].value);
					}

					var totalObj = {
						value: value,
						realValue: value,
						label: {},

					};

					series_1.data.push(totalObj); //totalVal ? parseFloat(totalVal || 0) : null);
				}
			}

			series.push(series_1);
		}

		this.option.legend.show = false; // series.length <= 7;
		var options=new SetOption(this.option,this.indexFields);
		this.option=options.getOption();
		return this;
	},
	layout: function(width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},


});

module.exports = SimpleStackChartManager;