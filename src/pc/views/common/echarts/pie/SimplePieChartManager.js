var _ = require('lodash');
var EChartManager = require('../EChartManager');

function PieChartManager() {
	EChartManager.call(this);
}

PieChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {
		return {
			legend: {
				show: false,
				data: [],
			},

			color: this.CHART_COLORS,

			backgroundColor: 'transparent',

			tooltip: {
				show: false,
			},

			series: []
		};
	},

	setData: function(data) {

		var option = this.option;

		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		//this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);

		option.legend.data = data.categories;

		if (option.legend.data.length > 7) option.color = this.CHART_COLORS_2;

		option.tooltip.formatter = function(params, ticket) {
			return `<table><tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;(${params.percent}%)</td></tr></table>`
		};

		var series = option.series = [];

		var dataSet = data.datasetArray[0];

		//this.option.title.text = dataSet.seriesName;

		var series_1 = {
			name: dataSet.seriesName,
			avoidLabelOverlap: false,
			hoverAnimation: false,
			animationEasing: 'elasticInOut',
			type: 'pie',
			radius: '50%',
			center: ['50%', '50%'],
			silent: true,
			data: [],
		};

		if (dataSet.setArray && dataSet.setArray.length > 0) {
			for (var i = 0; i < dataSet.setArray.length; i++) {
				var item = dataSet.setArray[i];
				var value = parseFloat(item.value || 0);
				series_1.data.push({
					value: Math.abs(value),
					realValue: value,
					name: item.label,
					label: {
						normal: {
							show: false,
							formatter: labelFormatter,
							textStyle: {
								fontSize: 8,
							}
						},
					},
					labelLine: {
						normal: {
							show: false,
							length: 5,
							length2: 5,
							//smooth: true,

						},
					}
				})

			};

		}

		var items = _.sortBy(series_1.data, (item) => parseFloat(item.value));

		//最多显示7个label
		for (var i = items.length - 1; i >= Math.max(items.length - 3, 0); i--) {
			if (items[i].value == 0) continue;
			items[i].label.normal.show = true;
			items[i].labelLine.normal.show = true;
		};
		series.push(series_1);

		return this;
	},

});

function labelFormatter(item) {
	var name = (item.name.length > 4) ? item.name.substring(0, 4) + '…' : item.name;
	var percent = '(' + item.percent + '%)';
	return name + '\n' + percent;
};

module.exports = PieChartManager;