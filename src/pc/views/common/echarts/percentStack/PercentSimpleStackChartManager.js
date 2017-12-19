var _ = require('lodash');
var EChartManager = require('../EChartManager');
var SetOption=require('./setOption');
function PercentSimpleStackChartManager() {
	EChartManager.call(this);
}

PercentSimpleStackChartManager.prototype = _.create(EChartManager.prototype, {

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
						fontSize: 8,
					},
				},
				data: [],
			},
			yAxis: {
				type: 'value',
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
					show: true,
					interval: 'auto',
					formatter: '{value}%',
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
		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		//this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
		//this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);
		this.indexFields=data.indexFields;
		var series = this.option.series = [];

		this.option.xAxis.data = data.categories;

		this.option.legend.data = [];

		//this.option.title.text = dataSet.seriesName;

		if (data.datasetArray.length > 10) this.option.color = this.CHART_COLORS_2;

		this.option.tooltip.formatter = function(params, ticket) {
			var val = params.data.value.toString();
			if (val.indexOf(".") != -1) {
				val = val.substring(0, val.indexOf(".") + 3);
			}
			val = '(' + val + '%)';

			return `<table>
				<tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;&nbsp;${val}</td></tr>
				<tr><td>${params.data.fieldsName}</td><td>&nbsp;${params.data.totalValue}</td></tr>
			</table>`
		};

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];
			//var stackName = data.datasetArray[0].seriesName;
			this.option.legend.data.push(dataSet.seriesName);

			var series_1 = {
				name: dataSet.seriesName,
				type: 'bar',
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				//stack:stackName ,//stackName, //data.datasetArray[i+2].seriesName,
				label: {
					normal: {
						show: false,
					},
					emphasis: {
						show: true,
						position: 'inside',
						formatter: '{c} %',
						textStyle: {
							color: '#000'
						}
					}
				},
				barMinHeight: 1,
				data: []
			};
			//this.option.series.formatter
			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = 0;

					if (dataSet.setArray[j].value != undefined && dataSet.setArray[j].value!='') {
						value = parseFloat(dataSet.setArray[j].value);
					}
					var totalObj = {
						value: value,
						realValue: value,
						label: {

						},

					};

					series_1.data.push(totalObj); //totalVal ? parseFloat(totalVal || 0) : null);
				}
			}

			series.push(series_1);
		}
		var options=new SetOption(this.option,this.indexFields);
		this.option=options.getOption();
		return this;
		//this.option.legend.show = series.length <= 7;
	},
	layout: function(width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},
	
});

module.exports = PercentSimpleStackChartManager;