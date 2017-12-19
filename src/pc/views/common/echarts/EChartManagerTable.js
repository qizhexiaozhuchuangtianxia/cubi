/**
 * ECharts option manager table
 */

var ChinaMapManager = require('./map/ChinaMapManager');
var SimpleChinaMapManager = require('./map/SimpleChinaMapManager');
var LineChartManager = require('./line/LineChartManager');
var SimpleLineChartManager = require('./line/SimpleLineChartManager');
var BarChartManager = require('./bar/BarChartManager');
var SimpleBarChartManager = require('./bar/SimpleBarChartManager');
var PieChartManager = require('./pie/PieChartManager');
var SimplePieChartManager = require('./pie/SimplePieChartManager');
var PercentStackChartManager = require('./percentStack/PercentStackChartManager');
var PercentSimpleStackChartManager = require('./percentStack/PercentSimpleStackChartManager');
var StackChartManager = require('./stack/StackChartManager');
var SimpleStackChartManager = require('./stack/SimpleStackChartManager');
var MultiAxisLineChartManager = require('./multiaxisline/MultiAxisLineChartManager');
var SimpleMultiAxisLineChartManager = require('./multiaxisline/SimpleMultiAxisLineChartManager');

/* 词云图管理器 */
let WordCloudChartManager       = require('./wordcloud/WordCloudChartManager');
let SimpleWordCloudChartManager = require('./wordcloud/SimpleWordCloudChartManager');

const CHART_DISPLAY_SCHEMA = {
	THUMBNAIL: 'THUMBNAIL', //缩列图
}

module.exports = {

	getEchartManager: function(chartType, displaySchema) {
		if (chartType == 'EchartsMap') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new SimpleChinaMapManager();
			else
				return new ChinaMapManager();
		} else if (chartType == 'ScrollLine2D') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new SimpleLineChartManager();
			else
				return new LineChartManager();
		} else if (chartType == 'ScrollColumn2D') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new SimpleBarChartManager();
			else
				return new BarChartManager();
		} else if (chartType == 'Pie2D') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new SimplePieChartManager();
			else
				return new PieChartManager();
		} else if (chartType == 'PercentColumn2D') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new PercentSimpleStackChartManager();
			else
				return new PercentStackChartManager();
		} else if (chartType == 'StackedColumn2D') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL)
				return new SimpleStackChartManager();
			else
				return new StackChartManager();
		}
		else if (chartType == 'MultiAxisLine') {
			if (displaySchema == CHART_DISPLAY_SCHEMA.THUMBNAIL) {
				return new SimpleMultiAxisLineChartManager();
			}
			else {
				return new MultiAxisLineChartManager();
			}
		}
        else if ('WordCloud' === chartType) {
            if (displaySchema === CHART_DISPLAY_SCHEMA.THUMBNAIL) {
                return new SimpleWordCloudChartManager();
            }
            else {
                return new WordCloudChartManager();
            }
        }
	}
};
