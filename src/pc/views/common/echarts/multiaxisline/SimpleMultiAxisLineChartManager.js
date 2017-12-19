var _ = require('lodash');
var EChartManager = require('../EChartManager');

function MultiAxisLineChartManager() {
	EChartManager.call(this);
}

MultiAxisLineChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function () {
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
				width:300,
				// left: 45,
				top: 15,
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
					},
				}
			],
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

		this.option.xAxis.data  = data.categories;
		this.option.legend.data = [];

		if (data.datasetArray.length > 10) this.option.color = CHART_COLORS_2;

		// 设定Y轴信息 START
		let yAxises = [];
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
		let yAxisOptions = [];
		for (let yAxisIndex = 0; yAxisIndex < yAxises.length; yAxisIndex++) {
			let yAxisOption = {
				name          : yAxises[yAxisIndex].name,
				nameTextStyle : { color:'#A9A9A9', fontSize: 14 },
				type          : 'value',
				axisLine      : { show: true },
				splitLine     : { show: true, lineStyle: { color: '#e6e6e6', width: 1.5, } },
				axisLabel     : { textStyle: { color: '#A9A9A9', fontSize: 14, } },
			};

			if (yAxises[yAxisIndex].min) yAxisOption["min"]    = yAxises[yAxisIndex].min;
			if (yAxises[yAxisIndex].min) yAxisOption["max"]    = yAxises[yAxisIndex].max;
		 	if (0 < yAxisIndex)          yAxisOption["offset"] = (yAxisIndex - 1) * 60;

			yAxisOptions.push(yAxisOption);
		}
		this.option.yAxis = yAxisOptions;
		// 设定Y轴信息 END

		let series_all = [];
		for (let i = 0; i < data.datasetArray.length; i++) {

			let indexField = data.multiAxisLineSetting.indexs[i];
			let dataSet    = data.datasetArray[i];
			let yAxisIndex = 0;

			this.option.legend.data.push(dataSet.seriesName);

			for (let yAxisCounter = 0; yAxisCounter < yAxises.length; yAxisCounter++) {
				if (indexField.yAxisKey != yAxises[yAxisCounter].key) {
					continue;
				}
				yAxisIndex = yAxisCounter;
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

			if ("area" === indexField.chartType) {
				series_1["sampling"]  = 'average';
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

});

module.exports = MultiAxisLineChartManager;
