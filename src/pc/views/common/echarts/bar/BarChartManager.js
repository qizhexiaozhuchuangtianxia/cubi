var _ = require('lodash');
var EChartManager = require('../EChartManager');
var SetZhibiaoOption = require('./SetZhibiaoOption');
var App = require('app');
var {
	createTooltipFormatterForChart,
	createScrollbarLabelFormatter,
	createBarLabelFormatter
} = require('../helpers');
var ReportUtil = require('../../../../utils/ReportUtil');

function BarChartManager() {
	EChartManager.call(this);
	this.SetZhibiaoOption=new SetZhibiaoOption(this);
}

BarChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {
		var _this=this;
		var iconPath=this.SetZhibiaoOption.setImgPath();
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
				trigger: 'axis',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			toolbox: {
				itemSize:20,
				itemGap:20,
				right:30,
				top:15,
				iconStyle:{
					emphasis:{
						textPosition:'top'
					}
				},
		        feature: {
		            myTool1: {
		                show: true,
		                title: '排序',
		                icon: iconPath+'sortNo.png',
		                onclick: function (){
		                    App.emit('APP-ZHIBIAO-SORT-DIALOG', {
		                    	open:true,
		                    	indexFields:_this.data.indexFields,
		                    	row:_this.row,
		                    	col:_this.col
		                    });
		                }
		            },
		            myTool2: {
		                show: true,
		                title: '清空筛选',
		                icon: iconPath+'filter.png',
		                onclick: function (){
		                	App.emit('APP-EMPTY-ZHIBIAO-FILTER',{
		                		row:_this.row,
		                    	col:_this.col
		                	});
		                    var indexFields=_this.data.indexFields;
		                    var param={
		                    	isSort:false,
		                    	indexFields:indexFields[0],
		                    	noFilter:true
		                    }
		                    //_this.SetZhibiaoOption.myToolClick(param,_this.sortWay);

		                }
		            },
		            myTool3: {
		                show: true,
		                title: '排行榜',
		                icon: iconPath+'topNo.png',
		                onclick: function (){
		                	App.emit('APP-ZHIBIAO-TOP-DIALOG',{
		                		open:true,
		                    	indexFields:_this.data.indexFields,
		                    	row:_this.row,
		                    	col:_this.col
		                	});
		                }
		            },
		            myTool4: {
		                show: true,
		                title: '范围',
		                icon: iconPath+'rangeNo.png',
		                onclick: function (){
		                   App.emit('APP-ZHIBIAO-MAX-DIALOG',{
									     	open:true,
									     	indexFields:_this.data.indexFields,
									     	row:_this.row,
						                    col:_this.col
									     });
		                }
		            }
		        }
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
				//backgroundColor: 'rgba(47,69,84,0.25)',
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

	setData: function(data) {

		var option = this.option;

		if (!data.datasetArray) {
			throw new Error('unexpected');
		}

		this.data=data;
		var baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);
		//option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
		option.tooltip.formatter = createTooltipFormatterForChart(baseDataArrayForChartTooltipFormat, data.xAxisName);
		option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

		var series = option.series = [];

		option.xAxis.data = data.categories;

		option.legend.data = [];

		//option.title.text = dataSet.seriesName;

		if (data.datasetArray.length > 10) option.color = this.CHART_COLORS_2;

		for (var i = 0; i < data.datasetArray.length; i++) {

			var dataSet = data.datasetArray[i];

			option.legend.data.push(dataSet.seriesName);

			var series_1 = {
				name: dataSet.seriesName,
				type: 'bar',
				showSymbol: false,
				hoverAnimation: false,
				animationEasing: 'elasticInOut',
				label: {
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
				data: [],
				pageFormatter : dataSet.pageFormater,
			};

			let seriesLabelFormattedValue = ReportUtil.getBaseDataArrayForChartFormat([dataSet]);
			series_1.label.emphasis.formatter = createBarLabelFormatter(seriesLabelFormattedValue);

			if (dataSet.setArray && dataSet.setArray.length > 0) {
				for (var j = 0; j < dataSet.setArray.length; j++) {
					var value = dataSet.setArray[j].value;
					value = value ? parseFloat(value || 0) : null;
					var weiName=dataSet.setArray[j].label;
					series_1.data.push({
						value:value,
						weiName:weiName
					});
				}
			}

			series.push(series_1);
		}
		option.legend.show = series.length <= 7;

		return this;
	},
	layout: function(width, height) {
		var option = this.option;
		if (height) {
			option.legend.top = height - 25;
		}
		return this;
	},

});

module.exports = BarChartManager;