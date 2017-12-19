/**
 * ECharts地图Option Manager
 */

var _ = require('lodash');
var EChartManager = require('../EChartManager');
var {
	MAX_COLORS,
	MIN_COLORS,
	HIGHTLIGHT_COLORS,
	PROVINCES,
} = require('./map');
var ReportUtil = require('../../../../utils/ReportUtil');

function ChinaMapManager() {
	EChartManager.call(this);
}

ChinaMapManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {

		return {

			legend: {
				show: true,
				selectedMode: 'single',
				//right: 5,
				orient: 'vertical',
				left: 22,
				top: 22,
				textStyle: {
					color: '#A9A9A9'
				}
			},

			backgroundColor: 'transparent',

			color: MAX_COLORS,

			visualMap: {
				left: 22,
				bottom: 15,
				//top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				inRange: {
					color: [MIN_COLORS[0], MAX_COLORS[0]],
				},
				formatter: function(value) {
					return isNaN(value) ? '' : value;
				}
			},

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				transitionDuration: 0,
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			grid: {
				top: 0,
				bottom: 0,
				//containLabel: true,
			},
			series: []
		}
	},

	setData: function(data) {

		var option = this.option;

		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		//option.tooltip.formatter = '{b}<br />{a}：{c}';

		// option.tooltip.formatter = function(params, ticket) {
		// 	return `<table><tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;(${params.percent}%)</td></tr></table>`
		// };
		option.tooltip.formatter = function(params, ticket) {
			var formatValue = ReportUtil.getFormattedValueForMap(params);
			//console.log(value)
			if (isNaN(formatValue)) {
				formatValue = '无数据'
			}
			return params.seriesName + '：' + formatValue;
		};

		//option.title.text = dataSet.seriesName;
		var series = option.series = [];

		option.legend.data = [];



		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];

			option.legend.data.push(dataSet.seriesName);

			var series_1 = {
				name: dataSet.seriesName,
				type: 'map',
				mapType: 'china',
				//selectedMode: 'single',
				showLegendSymbol: false,
				itemStyle: {
					normal: {
						borderColor: '#c8c8c8',
					},
					emphasis: {
						areaColor: HIGHTLIGHT_COLORS[0],
						//borderColor: 'rgba(0,0,0,0.54)',
						//borderWidth: 2,
					},
				},
				label: {
					emphasis: {
						textStyle: {
							color: 'rgba(0,0,0,0.87)',
							fontSize: 14,
						}
					},
				},
				data: []
			};



			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var name = PROVINCES[dataSet.setArray[j].name];
					if (name == null) continue;
					var value = dataSet.setArray[j].value;
					value = parseFloat(value || 0);
					var type = dataSet.setArray[j].type;
					var pattern = dataSet.setArray[j].pattern;
					series_1.data.push({
						'name': name,
						'value': value,
						'type': type,
						'pattern': pattern,
					});
				}
			}
			series.push(series_1);
		};

		var {
			min,
			max
		} = calcSeriesValueRange(series[0]);

		option.visualMap.min = min;
		option.visualMap.max = max;

		//calcTextColor(option.series[0], min, max);

		//if (series.length > 10) option.color = CHART_COLORS_2;

		option.legend.show = series.length <= 7;

		return this;
	},

	handleLegendChanged: function(params) {

		var {
			echart,
			option,
		} = this;

		var selectedIndex = _.findIndex(option.series, {
			'name': params.name
		});

		var {
			rangeColors,
			areaColor
		} = this.getColorSchema(selectedIndex);

		option.visualMap.inRange.color = rangeColors;

		var {
			min,
			max
		} = calcSeriesValueRange(option.series[selectedIndex]);

		option.visualMap.min = min;
		option.visualMap.max = max;
		option.visualMap.range = [min, max];

		//calcTextColor(option.series[selectedIndex], min, max);

		option.series[selectedIndex].itemStyle.emphasis.areaColor = areaColor;

		echart.setOption(option);

		return this;
	},

	getColorSchema: function(colorIndex) {
		//colorIndex += 1;
		var index = colorIndex % MAX_COLORS.length;
		return {
			rangeColors: [MIN_COLORS[index], MAX_COLORS[index]],
			areaColor: HIGHTLIGHT_COLORS[index],
		};
	},
});

/**
 * 根据数据不同，文字颜色不一样的计算公式
 * 
function calcTextColor(series, min, max) {

	var data = series.data;

	var len = max - min;

	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		var color = '#000';
		if ((item.value - min) / len > 0.54) {
			color = '#fff';
		}

		item.label = {
			normal: {
				textStyle: {
					color: color
				}
			}
		}
	}
}
*/

function calcSeriesValueRange(series) {
	var min, max;
	for (var j = 0; j < series.data.length; j++) {
		var value = series.data[j].value;
		if (!min || value < min) min = value;
		if (!max || value > max) max = value;
	}

	max = Math.ceil(max);
	min = Math.floor(min);

	if (min == max) min = max - 1;

	return {
		min,
		max
	};
}

module.exports = ChinaMapManager;