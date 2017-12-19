var _             = require('lodash');
var EChartManager = require('../EChartManager');
var SetOption     = require('./setOption');
var ReportUtil    = require('../../../../utils/ReportUtil');

var {
	createScrollbarLabelFormatter,
	tooltipFormattedValueForChart,
	tooltipFormattedValueForPercentStackItem,
} = require('../helpers');

function PercentStackChartManager() {
	EChartManager.call(this);
}

PercentStackChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function () {
		return {
			legend: {
				show: true,
				bottom: 16,
				textStyle: {
					color: '#A9A9A9'
				},
				selected: {}
			},

			backgroundColor: 'transparent',

			color: this.CHART_COLORS,

			tooltip: {
				trigger: 'axis',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				formatter: this._tooltipFormatter.bind(this),
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			grid: {
				bottom: 120,
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
						fontSize: 14,
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
				textStyle: {
					color: '#787878',
					fontSize: 8,
				}
			},

		};
	},

	setData: function (data) {

		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		this.indexFields = data.indexFields;
		this.xAxisName   = data.xAxisName;

		this._baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);
		this.option.dataZoom.labelFormatter      = createScrollbarLabelFormatter(data.categories);

		var series = this.option.series = [];
		this.option.xAxis.data = data.categories;
		this.option.legend.data = [];

		if (data.datasetArray.length > 10) this.option.color = this.CHART_COLORS_2;

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];
			this.option.legend.data.push(dataSet.seriesName);
			this.option.legend.selected[dataSet.seriesName] = true;

			var series_1 = {
				name: dataSet.seriesName,
				type: 'bar',
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				label: {
					normal: {
						show: false,
					},
					emphasis: {
						show: false,
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

			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = 0;

					if (dataSet.setArray[j].value != undefined && dataSet.setArray[j].value!='') {
						value = parseFloat(dataSet.setArray[j].value) || 0;
					}

					var totalObj = {
						formatValue: this._baseDataArrayForChartTooltipFormat[i][j],
						xAxisName: data.xAxisName,
						value: value,
						realValue: value,
						pattern: dataSet.setArray[j].pattern,
						pageFormater : dataSet.pageFormater,
						label: {},
					};

					series_1.data.push(totalObj); //totalVal ? parseFloat(totalVal || 0) : null);
				}
			}

			series.push(series_1);
		}

		this.option.legend.show = series.length <= 7;
		var options = new SetOption(this.option, this.indexFields);
		this.option = options.getOption();
		return this;
	},

	layout: function (width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},

	handleLegendChanged: function (param) {

		var {
			echart,
			option,
		} = this;
		var name = param.name;

		option.legend.selected[name] = !option.legend.selected[name];

		option.dataZoom.start = this.curDataZoom.start;
		option.dataZoom.end   = this.curDataZoom.end;

		var options   = new SetOption(this.option, this.indexFields);
		var newOption = options.getOption();

		echart.setOption(newOption);

		return this;
	},

	/**
	 * Tooltip自定义格式化函数，通过ticket区分axis、item
	 * @param params 图形节点数据信息
	 * @param ticket tooltip点类型坐标
	 * @param callback
	 * @returns 格式化标签
	 * @private
	 */
	_tooltipFormatter: function (params, ticket, callback) {

		const AXIS = "axis";
		const ITEM = "item";

        if (AXIS === this.option.tooltip.trigger) {
			if (1 > params.length) {
				return "";
			}
			return tooltipFormattedValueForChart(params, params[0].data.xAxisName);
		}
        else if (ITEM === this.option.tooltip.trigger) {
			return tooltipFormattedValueForPercentStackItem(params, params.data.xAxisName);
		}
		else {
		}
	},

	_baseDataArrayForChartTooltipFormat: [],
});

module.exports = PercentStackChartManager;