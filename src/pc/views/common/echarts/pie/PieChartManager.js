var _             = require('lodash');
var EChartManager = require('../EChartManager');
var ReportUtil    = require('../../../../utils/ReportUtil');
var {
	createPieTooltipFormatter
} = require('../helpers');

function PieChartManager() {
	EChartManager.call(this);
}

/**
 * 饼图
 * @type {EChartManager}
 */
PieChartManager.prototype = _.create(EChartManager.prototype, {

	/**
	 * 初始化饼图基础配置信息
	 */
	getInitialOption : function () {
		return {
			legend : {
				show : true,
				bottom : 16,
				textStyle : {
					color : '#A9A9A9'
				},
				data : [],
			},
			color : this.CHART_COLORS,
			backgroundColor : 'transparent',
			tooltip : {
				trigger : 'item',
				textStyle : {
					color : 'rgba(0,0,0,0.87)',
				},
				backgroundColor : 'rgba(255,255,255,0.9)',
				extraCssText : 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			series : []
		};
	},

	/**
	 * 根据数据成图
	 * @param data
	 * @returns {PieChartManager}
	 */
	setData : function (data) {

		var option = this.option;

		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		// 设置Tooltip格式化
		let baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);
		option.tooltip.formatter = createPieTooltipFormatter(baseDataArrayForChartTooltipFormat, data.xAxisName);

		var series   = option.series = [];
		var dataSet  = data.datasetArray[0];
		var series_1 = {
			name              : dataSet.seriesName,
			avoidLabelOverlap : false,
			animationEasing   : 'elasticInOut',
			type              : 'pie',
			radius            : '55%',
			center            : ['50%', '45%'],
			data              : [],
		};

		if (dataSet.setArray && dataSet.setArray.length > 0) {
			for (var i = 0; i < dataSet.setArray.length; i++) {

				var item  = dataSet.setArray[i];
				var value = parseFloat(item.value || 0);

				series_1.data.push({
					value : Math.abs(value),
					realValue : value,
					name : item.label,
					pattern : item.pattern || "",
					label : {
						normal : {
							show : false,
							formatter : '{b} ({d}%)',
							textStyle : {
								fontSize : 12,
							}
						},
						emphasis : {
							show : true,
							textStyle : {
								fontSize : 12,
							}
						}
					},
					labelLine : {
						normal : {
							show : false,
						},
						emphasis : {
							show : true,

						}
					}
				});
			}
		}

		var items = _.sortBy(series_1.data, (item) => parseFloat(item.value));

		//最多显示7个label
		for (let i = items.length - 1; i >= Math.max(items.length - 7, 0); i--) {
			if (items[i].value == 0) continue;

			items[i].label.normal.show       = true;
			items[i].label.emphasis.show     = true;
			items[i].labelLine.normal.show   = true;
			items[i].labelLine.emphasis.show = true;

			option.legend.data.push(items[i].name);
		}

		option.legend.show = items.length <= 7;

		if (items.length > 10) option.color = this.CHART_COLORS_2;

		series.push(series_1);

		return this;
	},

	/**
	 * 配置成图格局
	 * @param width
	 * @param height
	 * @returns {PieChartManager}
	 */
	layout : function (width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}

		if (width) {
			for (var i = 0; i < this.option.series.length; i++) {
				var item = this.option.series[i];
				item.label = {
					normal : {
						formatter : createLabelFormatter(width)
					}
				}
			}

			if (width < 350)
				this.option.legend.show = false;
		}

		return this;
	},
});

/**
 * 图形标签格式化
 * @param width
 * @returns {Function}
 */
function createLabelFormatter(width) {

	var radius   = 0.55;
	var	line_len = 35;
	var max_len  = width * radius / 2 - line_len;
	var word_len = Math.max(Math.floor(max_len / 12), 1);

	return function (series) {
		var name = series.name || '';
		if (name.length > word_len)
			name = name.substring(0, word_len) + '…';
		return name;
	};
}

module.exports = PieChartManager;