/**
 * 图形整理数据
 * @author: XuWenyue
 */

var ReportUtil = require('../../utils/ReportUtil');

module.exports = {

	/**
	 * 根据不同图形，对日期进行格式化
	 * @param chartData
	 * @param reportType
	 * @param weiduList
	 * @returns {*}
	 */
	fixDataTreeValue : function(chartData, reportType, weiduList) {

		if (("Pie2D"         === reportType) ||
			("MultiAxisLine" === reportType) ||
			("WordCloud"     === reportType)) {
			// 饼状图、高级复合图
			if ("GROUP_DATE_TITLE_FIELD" != weiduList[0].groupType) {
				return chartData;
			}

			chartData.categories               = this._fixDataTreeCategoriesValue(chartData.categories, weiduList[0].level);
			chartData.datasetArray[0].setArray = this._fixDataTreeSetArrayValue(chartData.datasetArray[0].setArray, weiduList[0].level);
		}
		else if (("ScrollColumn2D"  === reportType) ||
			     ("ScrollLine2D"    === reportType) ||
			     ("PercentColumn2D" === reportType) ||
			     ("StackedColumn2D" === reportType)) {
			// 柱状图、折线图、百分比堆积柱状图、堆积柱状图
			if ("GROUP_DATE_TITLE_FIELD" === weiduList[0].groupType) {
				chartData.categories               = this._fixDataTreeCategoriesValue(chartData.categories, weiduList[0].level);
				if(chartData.datasetArray.length>0){
					chartData.datasetArray[0].setArray = this._fixDataTreeSetArrayValue(chartData.datasetArray[0].setArray, weiduList[0].level);

				}
			}
			else if ((1 < weiduList.length) && ("GROUP_DATE_TITLE_FIELD" === weiduList[1].groupType)) {
				chartData.datasetArray = this._fixDataTreeDataSetArrayValue(chartData.datasetArray, weiduList[1].level);
			}
			else {
				// 没有日期维度，无需处理
			}
		}
		else {
		}

		return chartData;
	},

	_fixDataTreeCategoriesValue : function(categories, level) {

		let length = categories.length;
		for (let counter = 0; counter < length; counter++) {
			categories[counter] = ReportUtil.getFormattedDataTree(categories[counter], level);
		}

		return categories;
	},

	_fixDataTreeSetArrayValue : function(setArray, level) {

		let length = setArray.length;
		for (let counter = 0; counter < length; counter++) {
			setArray[counter].label = ReportUtil.getFormattedDataTree(setArray[counter].label, level);
		}

		return setArray;
	},

	_fixDataTreeDataSetArrayValue : function(datasetArray, level) {

		let length = datasetArray.length;
		for (let counter = 0; counter < length; counter++) {

			let seriesName = datasetArray[counter].seriesName;
			let matchs     = seriesName.match(/^\d{4}\-\d{1,2}/);

			if ((!matchs) || (1 > matchs.length)) continue;

			let date       = matchs[0];
			seriesName     = seriesName.substring(date.length);

			if (0 < seriesName.length) seriesName = " " + seriesName;

			datasetArray[counter].seriesName = ReportUtil.getFormattedDataTree(date, level) + seriesName;
		}

		return datasetArray;
	}
};
