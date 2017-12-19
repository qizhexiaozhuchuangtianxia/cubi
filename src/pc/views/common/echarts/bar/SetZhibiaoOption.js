var _ = require('lodash');
var App = require('app');
var EChartManager = require('../EChartManager');
var {
	createTooltipFormatterForChart,
	createTooltipFormatterForSortChart,
	createBarLabelFormatter,
	createBarLabelFormatterForSort,
} = require('../helpers');
var ReportUtil = require('../../../../utils/ReportUtil');

function SetZhibiaoOption(param) {
	this.indexParam      = param.indexParam;
	this.data            = param.data;
	this.chartType       = param.chartType;
	this.echart          = param.echart;
	this.option          = param.option;
	this.compareIndex    = param.compareIndex;
	this.selectedCompare = param.selectedCompare;
	this.zhiBiaoList     = param.zhiBiaoList;
	this.weiduList       = param.weiduList;
}

SetZhibiaoOption.prototype = {

	initIndexFilter: function () {
		if ('ScrollColumn2D' != this.chartType) {
			return this;
		}
		if (!this.iconPath) {
			this.setImgPath();
		}
		if (this.indexParam) {
			this.emptyData();
			
			//最大最小值
			if (this.indexParam.maxMin) {
				let maxMin      = this.indexParam.maxMin;
				let min         = maxMin[0].value[0];
				let max         = maxMin[1].value[0];
				let indexFields = {name: maxMin[0].name};
				for (let i = 0; i < maxMin.length; i++) {
					if (maxMin[i].value[0] < min) {
						min = maxMin[i].value[0];
					}
				}
				let param = {
					indexFields : indexFields
				};
				//数据范围
				//if ((min >= 0 || max >= 0) && (min !== false || max !== false) && (min !== null || max !== null)) {
				this.min         = min;
				this.max         = max;
				this.topN        = false;
				this.topNsortWay = false;
				this.sortIndexFields = false;
				this.zhiSortWay      = false;
				this.indexFields = param.indexFields;
				this.handleIndexFields(param);
			}
			//topN
			if (this.indexParam.topParameters) {
				let indexFields = {
					name: this.indexParam.topParameters[0].field
				};
				let topNsortWay = 1;
				if (this.indexParam.topParameters[0].method == "ASC") {
					topNsortWay = -1;
				}
				let param = {
					indexFields : indexFields,
					sortWay     : topNsortWay,
					top         : this.indexParam.topParameters[0].topn
				};
				this.top         = param.top;
				this.topN        = true;
				this.topNsortWay = topNsortWay;
				this.min         = false;
				this.max         = false;
				this.indexFields = indexFields;
				this.handleIndexFields(param);
			}
			//排序
			if (this.indexParam.sortFields && this.indexParam.sortFields[0].method != "NORMAL") {
				var param = {
					sortIndexFields: {
						name: this.indexParam.sortFields[0].field || this.indexParam.sortFields[0].name
					}
				};
				var zhiSortWay = 1;
				if (this.indexParam.sortFields[0].method == "ASC") {
					zhiSortWay = -1;
				}
				this.sortIndexFields = param.sortIndexFields;
				this.zhiSortWay      = zhiSortWay;
				this.handleIndexFields(param);
			}
		}
		return this;
	},

	emptyData: function () {
		this.top             = false;
		this.topN            = false;
		this.topNsortWay     = false;
		this.min             = false;
		this.max             = false;
		this.indexFields     = false;
		this.sortIndexFields = false;
		this.zhiSortWay      = false;
		this.newSeries       = false;
	},

	arrSort: function (prop, sortWay) {
		return function (obj1, obj2) {
			var v1 = obj1[prop];
			var v2 = obj2[prop];

			if (!isNaN(Number(v1)) && !isNaN(Number(v2))) {
				v1 = Number(v1);
				v2 = Number(v2);
			}

			if (v1 < v2) {
				return sortWay;
			}
			else if (v1 > v2) {
				return -sortWay;
			}
			else {
				return 0;
			}
		}
	},

	setOneDimension: function () {

		let option      = App.deepClone(this.option);
		let compare     = this.compare;
		let series      = option.series;
		let indexFields = this.data.indexFields;
		let xAxisData   = option.xAxis.data;
		let sortSeries  = [];
		let newSeries   = [];
		let oneName     = false;

		if (indexFields.length == 1) {
			oneName = indexFields[0].name;
		}

		for (let i = 0; i < series.length; i++) {
			let name          = series[i].name;
			let data          = series[i].data;
			let pageFormatter = series[i].pageFormatter;

			for (let j = 0; j < data.length; j++) {
				let v = data[j];

				if (v == '' || v == null) {
					continue;
				}

				if (Object.prototype.toString.call(v) === "[object Object]") {
					if (v.value == '' || v.value == null) {
						continue;
					}
				}

				if (data[j].value) {
					v = data[j].value
				}

				let weiName = data[j].weiName;

				// 一个维度的情况 后端返回数据只有一个指标名 name:'kpi1(求和)'
				// 多个维度的情况 后端返回的数据维度名+指标名 name:'巴士小熊系列-kpi1(求和)'
				// 这里weiName是把维度名和指标名组合,添加到data里,用于X轴的名称显示
				if (this.weiduList.length>1) {
					var sName = name.split('-');
					weiName = xAxisData[j] + ' - ' + sName[0];
				}

				// 格式化结果值
				let formattedValue = v;
				if (pageFormatter) {
					formattedValue = ReportUtil.getFormattedValueWithFormatter(v, pageFormatter);
				}

				var curData = {
					value          : v,
					formattedValue : formattedValue,
					name           : name,
					weiName        : weiName,
					xAxisName      : xAxisData[j],
				};

				sortSeries.push(curData);
			}
		}

		let obj = {};
		for (let i = 0; i < indexFields.length; i++) {
			if (!obj[indexFields[i].name]) {
				obj[indexFields[i].name] = [];
			}
		}

		for (let i = 0; i < sortSeries.length; i++) {
			for (let o in obj) {
				let name = sortSeries[i].name;
				if (oneName) {
					name = oneName;
				}
				if (name.indexOf(o) != -1) {
					obj[o].push(sortSeries[i]);
				}
			}
		}

		//obj 指标长度 对象
		for (let o in obj) {
			let data = obj[o];
			let series_1 = {
				name            : o,
				type            : 'bar',
				showSymbol      : false,
				hoverAnimation  : false,
				animationEasing : 'elasticInOut',

				label : {
					normal: {
						show: false,
						position: 'top',
						textStyle: {
							color: '#A9A9A9'
						}
					},
					emphasis: {
						show: true,
					}
				},
				barMinHeight: 3,
				data: data
			};

			newSeries.push(series_1);
		}
		return newSeries;
	},

	handleIndexFields: function (param) {
		var {
			echart,
		} = this;
		var indexFields = this.data.indexFields;
		var newSeries   = [];
		var option = App.deepClone(this.option);
		if (!this.newSeries) {
			// 这里是把维度
			this.newSeries = this.setOneDimension();
		}
		var newSerie = App.deepClone(this.newSeries);
		// 添加索引,如果是多个指标,然后对其中一个指标排序,另外的指标需要符在排序后的指标上,
		//也就是排序之前指标的组合,要保证排序后还要和对应的指标组合
		newSerie = this.addIndex(newSerie);

		if ((this.min >= 0 || this.max >= 0) && (this.min !== false || this.max !== false)) {
			newSerie = this.setScopeSeries(newSerie);
		}

		if (this.topN) {
			newSerie = this.setTopSeries(newSerie, param);
		}
		if (this.sortIndexFields) {
			newSerie = this.sortIndexFieldsSeries(newSerie, this.sortIndexFields, this.zhiSortWay);
		}

		if (!this.indexFields && !this.sortIndexFields && !this.min) {
			newSerie = option.series;
			let baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(this.data.datasetArray);
			option.tooltip.formatter = createTooltipFormatterForChart(baseDataArrayForChartTooltipFormat, this.data.xAxisName);

			// 重新设置Label格式化函数
			for (let counter = 0; counter < newSerie.length; counter++) {
				if (!newSerie[counter].label) {
					continue;
				}

				let serieLabelFormattedValue = ReportUtil.getBaseDataArrayForChartFormat([this.data.datasetArray[counter]]);
				newSerie[counter].label.emphasis.formatter = createBarLabelFormatter(serieLabelFormattedValue);
			}
		}
		else {
			option.legend.data = [];
			option = this.setxAxisData(option, newSerie);
			option.tooltip.formatter = createTooltipFormatterForSortChart(newSerie, this.data.xAxisName);

			// 重新设置Label格式化函数
			for (let counter = 0; counter < newSerie.length; counter++) {
				if (!newSerie[counter].label) {
					continue;
				}
				newSerie[counter].label.emphasis.formatter = createBarLabelFormatterForSort();
			}
		}

		option.series = newSerie;
		this.setIconPath(option);
		echart.setOption(option, true);
	},
	setImgPath: function () {
		let url    = document.location.toString();
		let arrUrl = url.split("//");
		let start  = arrUrl[1].indexOf("/");
		let relUrl = arrUrl[1].substring(0, start);
		let path   = 'image://http://' + relUrl + '/themes/default/images/';

		if (relUrl.indexOf('localhost') != -1) {
			path = 'image://http://' + relUrl + '/build/pc/themes/default/images/';
		}

		this.iconPath = path;

		return path;
	},

	setIconPath: function (option) {

		if (!option.toolbox) {
			return;
		}

		let feature   = option.toolbox.feature;
		let hasSort   = 'hasSort.png', sortNo   = 'sortNo.png';
		let hasFilter = 'filter.png',  filterNo = 'filterNo.png';
		let hasTop    = 'top.png',     topNo    = 'topNo.png';
		let hasMax    = 'range.png',   maxNo    = 'rangeNo.png';

		/* 排序 */ feature.myTool1.icon = this.iconPath + ((this.zhiSortWay) ? hasSort : sortNo);
		/* 筛选 */ feature.myTool2.icon = this.iconPath + ((this.indexFields || this.zhiSortWay) ? filterNo : hasFilter);
		/* 排行 */ feature.myTool3.icon = this.iconPath + ((this.topN) ? hasTop : topNo);
		/* 范围 */ feature.myTool4.icon = this.iconPath + (((this.min >= 0 || this.max >= 0) && (this.min !== false || this.max !== false)) ? hasMax : maxNo);
	},

	setTopSeries: function (series, param) {

		var series = this.sortIndexFieldsSeries(series, this.indexFields, this.topNsortWay);

		for (let i = 0; i < series.length; i++) {
			series[i].data = series[i].data.splice(0, this.top);

			if (series[i].name != this.indexFields.name) {
				continue;
			}

			if (!this.sortIndexFields) {
				series[i].data.sort(this.arrSort('index', -1))
			}
			else if (this.sortIndexFields) {
				if (this.sortIndexFields.name != this.indexFields.name) {
					series[i].data.sort(this.arrSort('index', -1))
				}
			}
		}

		series = this.combinationBar(series);

		return series;
	},

	sortIndexFieldsSeries: function (series, indexFields, sortWay) {
		
		for (let i = 0; i < series.length; i++) {
			if (series[i].name != indexFields.name) {
				continue;
			}

			series[i].data.sort(this.arrSort('value', sortWay));
		}

		series = this.combinationBar(series);
		return series;
	},

	setScopeSeries: function (series) {
		var newData     = [];
		var index       = null;
		var oneName     = false;
		var indexFields = this.data.indexFields;

		// if (indexFields.length == 1) {
		// 	oneName = indexFields[0].name;
		// }

		for (let i = 0; i < series.length; i++) {
			let data = series[i].data;
			let name = data[0].name;
			// if (oneName) {
			// 	name = oneName;
			// }
			// 当指标只有一个的时候不需要匹配当前筛选的指标
			if (indexFields.length === 1 || name.lastIndexOf(this.indexFields.name) != -1) {
				for (var j = 0; j < data.length; j++) {
					if (data[j].value >= this.min && data[j].value <= this.max) {
						newData.push(data[j]);
					}
				}
				index = i;
				series[i].data = newData;
				break;
			}
		}

		series = this.combinationBar(series);
		//截取其他 series 长度
		for (let i = 0; i < series.length; i++) {
			if (i != index && index != null) {
				series[i].data = series[i].data.splice(0, newData.length);
			}
		}

		return series;
	},

	matchScenesName: function (seriesName) {

		if (!this.selectedCompare) {
			return false;
		}

		let selectedCompare = this.selectedCompare;
		let selectedScenes  = selectedCompare.selectedScenes;
		let zhiBiaoList     = this.zhiBiaoList;

		for (var i = 0; i < selectedScenes.length; i++) {
			for (var j = 0; j < zhiBiaoList.length; j++) {
				var sName = zhiBiaoList[j].name + ':' + selectedScenes[i].name;
				if (sName == seriesName) {
					return zhiBiaoList[j];
				}
			}
		}
		return false;
	},

	setxAxisData: function (option, newSerie) {

		option.xAxis.data = [];
		for (var j = 0; j < newSerie.length; j++) {

			let name = '';
			if (this.sortIndexFields) {
				name = this.sortIndexFields.name;
			}
			else {
				name = this.indexFields.name;
			}

			if (name == newSerie[j].name) {
				let d       = newSerie[j].data;
				let zhibiao = this.matchScenesName(name);
				for (let i = 0; i < d.length; i++) {
					if (zhibiao) {
						let strN = d[i].xAxisName + '-' + zhibiao.name;
						option.xAxis.data.push(strN);
					}
					else {
						option.xAxis.data.push(d[i].weiName);
					}
				}
			}
		}
		return option;
	},
	
	combinationBar: function (series) {
		let indexFields     = this.indexFields;
		if (this.sortIndexFields) {
			indexFields = this.sortIndexFields;
		}

		var curData = false;
		for (let i = 0; i < series.length; i++) {
			if (series[i].name == indexFields.name) {
				curData = series[i].data;
				break;
			}
		}
		if (!curData) {
			return series;
		}

		for (let i = 0; i < series.length; i++) {
			let data    = series[i].data;
			let newData = [];

			for (var t = 0; t < curData.length; t++) {
				if (series[i].name != indexFields.name) {
					for (var j = 0; j < data.length; j++) {
						if (curData[t].index == data[j].index) {
							newData.push(data[j]);
						}
					}
				} else {
					newData = data;
				}
			}

			series[i].data = newData;
		}
		return series;
	},

	addIndex: function (series) {

		for (var i = 0; i < series.length; i++) {
			var d = series[i].data;
			for (var j = 0; j < d.length; j++) {
				d[j].index = j;
			}
		}
		return series;
	}
};

module.exports = SetZhibiaoOption;