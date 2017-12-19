/**
 * 
 */

var _ = require('lodash');
var EChartManager = require('../EChartManager');
var {
	MAX_COLORS,
	MIN_COLORS,
	HIGHTLIGHT_COLORS,
	PROVINCES,
} = require('./map');

function ChinaMapManager() {
	EChartManager.call(this);
}

ChinaMapManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {

		return {

			legend: {
				show: false,
				selectedMode: 'single',
			},

			backgroundColor: 'transparent',

			color: MAX_COLORS,

			visualMap: {
				show: false,
				left: 22,
				top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				inRange: {
					color: [MIN_COLORS[0], MAX_COLORS[0]],
				}
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
				silent: true,
				showLegendSymbol: false,
				itemStyle: {
					normal: {
						borderColor: '#c8c8c8',
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
					series_1.data.push({
						'name': name,
						'value': value,
					});
				}
			}
			series.push(series_1);
		};

		var {
			min,
			max
		} = calcSeriesValueRange(option.series[0]);

		option.visualMap.min = min;
		option.visualMap.max = max;

		//option.legend.show = series.length <= 3;
		return this;
	},

	handleLegendChanged: function(params) {
		return this;
	},
});

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