var _ = require('lodash');
var EChartManager = require('../EChartManager');

var {
	createTooltipFormatterForChart,
	createScrollbarLabelFormatter,
} = require('../helpers');
var ReportUtil = require('../../../../utils/ReportUtil');

function MultiAxisLineChartManager() {
	EChartManager.call(this);
}

MultiAxisLineChartManager.prototype = _.create(EChartManager.prototype, {

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
				trigger         : ['axis', 'item'],
				textStyle       : { color: 'rgba(0,0,0,0.87)', },
				backgroundColor : 'rgba(255,255,255,0.9)',
				extraCssText    : 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				formatter       : this._tooltipFormatter
			},
			grid: {
				bottom: 120,
				top:100

			},
			xAxis: {
				type: 'category',
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
			yAxis: [
				{
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
					}
				}
			],

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
				textStyle: {
					color: '#787878',
					fontSize: 8,
				}
			},
		};
	},
	setChartColor:function(index){
		var color=['#3c87cb','#af54ad', '#f9ca06', '#10ad93', '#72bf49', '#f08421'];
		return color[index];
	},
	setData: function (data) {
		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		let series = this.option.series = [];

		let baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);

		this.option.tooltip.formatter       = createTooltipFormatterForChart(baseDataArrayForChartTooltipFormat, data.xAxisName);
		this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);
		this.option.xAxis.data              = data.categories;
		this.option.legend.data             = [];

		if (data.datasetArray.length > 10) this.option.color = CHART_COLORS_2;

		// 设定Y轴信息 START
		let yAxises = [];
		if(data.multiAxisLineSetting.yAxis.length>0){
			for (let yAxisIndex = 0; yAxisIndex < data.multiAxisLineSetting.yAxis.length; yAxisIndex++) {
				let yAxis = data.multiAxisLineSetting.yAxis[yAxisIndex];
				for (let indexsIndex = 0; indexsIndex < data.multiAxisLineSetting.indexs.length; indexsIndex++) {
					if (data.multiAxisLineSetting.indexs[indexsIndex].yAxisKey != yAxis.key) {
						continue;
					}
					yAxises.push(yAxis);
					break;
				}
			}

			var gridRight = (yAxises.length) * 60;
			this.option.grid.right = gridRight;
			let yAxisOptions = [];
			for (let yAxisIndex = 0; yAxisIndex < yAxises.length; yAxisIndex++) {
				let yAxisOption = {
					name          : yAxises[yAxisIndex].name,
					nameTextStyle : { color:'#A9A9A9', fontSize: 14 },
					type          : 'value',
					axisLine      : { show: true },
					splitLine     : { show: true, lineStyle: { color: '#e6e6e6', width: 1.5, } },
					axisLabel     : { textStyle: { color: '#A9A9A9', fontSize: 14, } },
					nameRotate    : 90
				};

				if (yAxises[yAxisIndex].min) yAxisOption["min"]    = yAxises[yAxisIndex].min;
				if (yAxises[yAxisIndex].min) yAxisOption["max"]    = yAxises[yAxisIndex].max;
				if (0 < yAxisIndex)          yAxisOption["offset"] = (yAxisIndex - 1) * 60;

				//

				yAxisOptions.push(yAxisOption);
			}

			this.option.yAxis = yAxisOptions;
		}




		// 设定Y轴信息 END

		let series_all = [];
		for (let i = 0; i < data.datasetArray.length; i++) {
			let indexField = data.multiAxisLineSetting.indexs[i];

			let dataSet    = data.datasetArray[i];
			let yAxisIndex = 0;

			this.option.legend.data.push(dataSet.seriesName);

			for (let yAxisCounter = 0; yAxisCounter < yAxises.length; yAxisCounter++) {
				if(data.multiAxisLineSetting.indexs.length>0){
					if (indexField.yAxisKey != yAxises[yAxisCounter].key) {
						continue;
					}
				}

				yAxisIndex 	= yAxisCounter;
				break;
			}

			let series_1 = {
				name            : dataSet.seriesName,
				type            : 'line',
				symbol          : 'circle',
				smooth          : true,
				showSymbol      : true,
				showAllSymbol   : true,
				hoverAnimation  : true,
				yAxisIndex      : yAxisIndex,
				animationEasing : 'elasticInOut',

				data: []
			};

			if(data.multiAxisLineSetting.indexs.length>0 || data.multiAxisLineSetting.indexs.length>0) {
				if ("area" === indexField.chartType) {
					series_1["sampling"]  = 'average';
					// series_1["itemStyle"] = { normal: { color: this.getChartAreaColor(i).item } };
					// series_1["areaStyle"] = { normal: { color: this.getChartAreaColor(i).area} };
				}else {
					series_1["type"] = indexField.chartType ? indexField.chartType : 'line';
				}

				if(data.datasetArray.length<=6){
					if("area" === indexField.chartType){
						series_1["areaStyle"] = { normal: { color: this.setChartColor(i),opacity:0.5} };
						series_1['zlevel'] = 1;

						}

						series_1["itemStyle"] = { normal: { color: this.setChartColor(i) } };
					}else{

						if("area" === indexField.chartType){
							series_1["areaStyle"] = { normal: { color: this.getChartAreaColor(i).area,opacity:0.5} };
							series_1['zlevel'] = 1;

						}
						series_1["itemStyle"] = { normal: { color: this.getChartAreaColor(i).area } };
					}
			}



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

					series_1.data.push(totalObj);
				}
			}
			series_all.push(series_1);

		}  

			this.option.series = series_all;

		return this;
	},

	layout: function (width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},
});

module.exports = MultiAxisLineChartManager;
