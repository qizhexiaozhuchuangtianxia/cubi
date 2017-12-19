/**
 * ECharts配置
 * 返回值：
 * {
 * 		renderer:string 渲染器（ECharts、FusionCharts...）
 * 		...（渲染器要求的配置数据等）
 * }
 */

var _ = require('lodash');
var App = require('app');

/* end */

/*
	Chart显示方案
 */
const CHART_DISPLAY_SCHEMA = {
	THUMBNAIL: 'THUMBNAIL',
}

var config = {
	ScrollLine2D: {
		typeName: '折线图',
		configer: createLineChartConfigOfECharts,
		surportLooked: true,
		surportEdited: true,
	},
	ScrollColumn2D: {
		typeName: '柱状图',
		configer: createBarChartConfigOfECharts,
		surportLooked: true,
		surportEdited: true,
	},
	PercentColumn2D: {
		typeName: '百分比堆积柱状图',
		configer: createPercentageStackedChartConfigOfECharts,
		surportLooked: true,
		surportEdited: true,
	},
	StackedColumn2D: {
		typeName: '堆积柱状图',
		configer: createStackedChartConfigOfECharts,
		surportLooked: true,
		surportEdited: true,
	},
	Pie2D: {
		typeName: '饼图',
		configer: createPieChartConfigOfECharts,
		surportLooked: true,
		surportEdited: true,
	},
	EchartsMap: { 
		typeName: '地图',
		configer: createChartConfigOfEChartsMap,
		surportLooked: true,
		surportEdited: true,
	},
	MultiAxisLine: {
		typeName: '复合图',
		configer: createMultiAxisLineConfigOfEChartsMap,
		surportLooked: true,
		surportEdited: true,
	},
    WordCloud : {
        typeName: '词云图',
        configer: createWordCloudConfigOfEChartsMap,
        surportLooked: true,
        surportEdited: true,
    },
	BASE: {
		typeName: '明细表',
		configer: null,
		surportLooked: true,
		surportEdited: true,
	},
	CROSS: {
		typeName: '交叉表',
		configer: null,
		surportLooked: true,
		surportEdited: true,
	},

	TREE: {
		typeName: '树形表',
		configer: null,
		surportLooked: true,
		surportEdited: true,
	},
	CATEGORY: {
		typeName: '汇总表',
		configer: null,
		surportLooked: true,
		surportEdited: true,
	},
	KPI:{
		typeName: 'KPI汇总表',
		configer: null,
		surportLooked: true,
		surportEdited: true,
	}
}

//颜色方案(数据少)
var CHART_COLORS = ['#3C87C8', '#10AD93', '#F9CA06', '#D3405C', '#F385B7', '#B596BC', '#AF54A4', '#30A6C1', '#72BF49', '#F08421'];

//颜色方案(数据多)
var CHART_COLORS_2 = ['#3C87C8', '#30A6C1', '#75CFD3', '#10AD93', '#72BF49', '#F9CA06', '#F5EF5B', '#F08421', '#F5A52A', '#D3405C', '#E25079', '#E05FA0', '#F385B7', '#D3A585', '#D3B9B6', '#B596BC', '#C0A7C6', '#9942A0', '#AF54A4', '#3572BC'];

module.exports = {
	getTypeConfig: function(configType) {
		if (config[configType] != undefined) {
			return config[configType].typeName;
		} else {
			return 'Can not find configType for ' + configType
		}
	},
	getSuportLookConfig: function(configType) { //是否支持查看功能
		if (config[configType] != undefined) {
			return config[configType].surportLooked;
		} else {
			return 'Can not find configType for ' + configType
		}
	},
	getSuportEditConfig: function(configType) { //是否支持编辑功能
		if (config[configType] != undefined) {
			return config[configType].surportEdited;
		} else {
			return 'Can not find configType for ' + configType
		}
	},
	getConfig: function(configName) {
		if (config[configName] != null) {
			return config[configName].configer();
		} else {
			return 'Can not find ChartViewConfig for ' + configName
		}
	}
}

/** ----------- ECharts Configrations begin ---------------------*/

//EChartsMap
function createChartConfigOfEChartsMap() {

	return {

		name: 'echart-line',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	//text: '折线图',
			// 	left: 'center',
			// },
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

			color: CHART_COLORS,

			visualMap: {
				left: 22,
				top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				inRange: {
					color: ['#80deea', '#006064'],
				}
			},

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
			},
			grid: {
				top: 0,
				bottom: 0,
				//containLabel: true,
			},
			series: []
		},

		setData: function(data) {

			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			this.option.tooltip.formatter = '{b}<br />{a}：{c}';

			// this.option.tooltip.formatter = function(params, ticket) {
			// 	return `<table><tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;(${params.percent}%)</td></tr></table>`
			// };
			this.option.tooltip.formatter = function(params, ticket) {
				var value = params.value;
				if(isNaN(value)) {value = '无数据'}
				return params.seriesName+':'+value;
			};

			//this.option.title.text = dataSet.seriesName;
			var series = this.option.series = [];

			this.option.legend.data = [];

			var min, max;

			for (var i = 0; i < data.datasetArray.length; i++) {

				var dataSet = data.datasetArray[i];

				this.option.legend.data.push(dataSet.seriesName);

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
							areaColor: 'rgb(0,229,255)',
						},
					},
					data: []
				};

				if (dataSet.setArray && dataSet.setArray.length > 0) {
					for (var j = 0; j < dataSet.setArray.length; j++) {
						var value = dataSet.setArray[j].value;
						value = parseFloat(value || 0);
						series_1.data.push({
							'name': dataSet.setArray[j].name,
							'value': value,
						});
						if (!min || value < min) min = value;
						if (!max || value > max) max = value;
					}
				}

				series.push(series_1);

			};

			this.option.visualMap.min = min;
			this.option.visualMap.max = max;

			if (series.length > 10) this.option.color = CHART_COLORS_2;

			this.option.legend.show = series.length <= 7;
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.legend.show = false;
				option.visualMap.show = false;
				option.tooltip.show = false;

				// option.legend.formatter = function(item) {
				// 	return (item.length > 5) ? item.substring(0, 4) + '…' : item;
				// }

			}
		}
	}
}

//ECharts折线图
function createLineChartConfigOfECharts() {

	return {

		name: 'echart-line',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	//text: '折线图',
			// 	left: 'center',
			// },
			legend: [{
				show: true,
				bottom: 16,
				//right: 5,
				//orient: 'vertical',
				textStyle: {
					color: '#A9A9A9'
				}
			}],

			backgroundColor: 'transparent',

			color: CHART_COLORS,

			tooltip: {
				trigger: ['axis', 'item'],
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				// position: function(point, params, dom, rect) {
				// 	// 由于chartPanel有padding,导致point有误。
				// 	// padding-top:24px; padding-left:104px;
				// 	return [point[0] + 35, point[1]];
				// },
			},
			grid: {
				bottom: 120,
				//containLabel: true,
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLine: {
					show: false,
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					//show:false,
					interval: 0,
					inside: true,
					lineStyle: {
						color: '#787878',
						width: 3,
					}
				},
				axisLabel: {
					//show:false,
					//interval: 0,
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
				handleSize: 8,
				showDetail: true,
				showDataShadow: true,
				filterMode: 'empty',
				textStyle: {
					color: '#787878',
					fontSize: 8,
				},
				//labelFormatter: scrollbarLabelFormatter,
			},
			series: []
		},

		setData: function(data) {

			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
			this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

			//this.option.title.text = dataSet.seriesName;
			var series = this.option.series = [];
			this.option.xAxis.data = data.categories;

			this.option.legend.data = [];

			for (var i = 0; i < data.datasetArray.length; i++) {

				var dataSet = data.datasetArray[i];

				this.option.legend.data.push(dataSet.seriesName);

				var series_1 = {
					name: dataSet.seriesName,
					type: 'line',
					smooth: true,
					showSymbol: false,
					hoverAnimation: false,
					animationEasing: 'elasticInOut',
					symbol: 'circle',
					data: []
				};

				if (dataSet.setArray && dataSet.setArray.length > 0) {
					for (var j = 0; j < dataSet.setArray.length; j++) {
						var value = dataSet.setArray[j].value;
						series_1.data.push(parseFloat(value || 0));
					}
				}

				series.push(series_1);

			};

			if (series.length > 10) this.option.color = CHART_COLORS_2;

			this.option.legend.show = series.length <= 7;
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.dataZoom.show = false;

				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 50;

				if (option.legend.data.length > 10) {
					var arr = [];
					arr.push(option.legend.data[0]);
					arr.push(option.legend.data[5]);
					arr.push(option.legend.data[10]);
					option.legend.data = arr;
				} else {
					option.legend.data = _.slice(option.legend.data, 0, 3);
				}

				option.xAxis.axisLabel.show = true;
				option.xAxis.axisTick.show = false;
				//option.xAxis.interval = 3;
				option.xAxis.splitLine.show = true;

				option.xAxis.axisLabel.textStyle.fontSize = 8;

				//option.xAxis.boundaryGap = true;
				option.yAxis.axisLabel.show = true;
				//option.yAxis.axisLabel.inside = true;
				option.yAxis.splitLine.show = true;
				option.yAxis.splitNumber = 3;
				option.yAxis.axisLabel.textStyle.fontSize = 8;
				option.tooltip.show = false;

				option.grid = {
					left: 45,
					top: 15,
					right: 15,
					bottom: 35
				};

				for (var i = 0; i < option.series.length; i++) {
					option.series[i].symbol = 'none';
				}
			}
		}
	}
}

//ECharts柱状图
function createBarChartConfigOfECharts() {

	return {

		name: 'echart-bar',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	text: '柱状图'
			// },
			legend: {
				show: true,
				bottom: 16,
				//right: 5,
				//orient: 'vertical',
				textStyle: {
					color: '#A9A9A9'
				}
			},

			backgroundColor: 'transparent',

			color: CHART_COLORS,

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				// axisPointer: {
				// 	type: 'shadow'
				// },
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				// position: function(point, params, dom, rect) {

				// 	// 由于chartPanel有padding,导致point有误。
				// 	// padding-top:24px; padding-left:104px;
				// 	return [point[0] + 35, point[1]];
				// },
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
					//show:false,
					//interval: 0,
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
				handleSize: 8,
				showDetail: true,
				showDataShadow: true,
				textStyle: {
					color: '#787878',
					fontSize: 8,
				}
			},
		},

		setData: function(data) {

			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
			this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

			var series = this.option.series = [];

			this.option.xAxis.data = data.categories;

			this.option.legend.data = [];

			//this.option.title.text = dataSet.seriesName;

			if (data.datasetArray.length > 10) this.option.color = CHART_COLORS_2;

			for (var i = 0; i < data.datasetArray.length; i++) {

				var dataSet = data.datasetArray[i];

				this.option.legend.data.push(dataSet.seriesName);

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
					// itemStyle: {
					// 	normal: {
					// 		barBorderWidth: 3,
					// 		barBorderColor: this.option.color[(i % this.option.color.length)],
					// 	},
					// 	emphasis: {
					// 		barBorderWidth: 3,
					// 		barBorderColor: this.option.color[(i % this.option.color.length)],
					// 	}
					// },
					data: []
				};


				if (dataSet.setArray && dataSet.setArray.length > 0) {
					for (var j = 0; j < dataSet.setArray.length; j++) {
						var value = dataSet.setArray[j].value;
						series_1.data.push(value ? parseFloat(value || 0) : null);
					}
				}

				series.push(series_1);
			}



			this.option.legend.show = series.length <= 7;
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.dataZoom.show = false;

				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 50;

				if (option.legend.data.length > 10) {
					var arr = [];
					arr.push(option.legend.data[0]);
					arr.push(option.legend.data[5]);
					arr.push(option.legend.data[10]);
					option.legend.data = arr;
				} else {
					option.legend.data = _.slice(option.legend.data, 0, 3);
				}


				option.xAxis.axisLabel.show = true;
				option.xAxis.axisTick.show = false;
				option.xAxis.splitLine.show = true;
				option.xAxis.axisLabel.textStyle.fontSize = 8;
				//option.xAxis.boundaryGap = true;
				option.yAxis.axisLabel.show = true;
				//option.yAxis.axisLabel.inside = true;
				option.yAxis.splitLine.show = true;
				option.yAxis.splitNumber = 3;
				option.yAxis.axisLabel.textStyle.fontSize = 8;

				option.tooltip.show = false;
				option.grid = {
					left: 45,
					top: 15,
					right: 15,
					bottom: 35
				};

				for (var i = 0; i < option.series.length; i++) {
					option.series[i].label = null;
					option.series[i].itemStyle = null;
					option.series[i].hoverAnimation = false;
				};
			}
		},
	}
}

//ECharts饼图
function createPieChartConfigOfECharts() {

	return {

		name: 'echart-pie',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	text: '饼图'
			// },

			legend: {
				show: true,
				bottom: 16,
				//right: 5,
				//orient: 'vertical',
				textStyle: {
					color: '#A9A9A9'
				},
				data: [],
			},

			color: CHART_COLORS,

			backgroundColor: 'transparent',

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',

			},

			series: []
		},

		setData: function(data) {

			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			//this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);

			this.option.legend.data = data.categories;

			if (this.option.legend.data.length > 7) this.option.color = CHART_COLORS_2;

			this.option.legend.show = this.option.legend.data.length <= 7;

			this.option.tooltip.formatter = function(params, ticket) {
				return `<table><tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;(${params.percent}%)</td></tr></table>`
			};

			var series = this.option.series = [];

			var dataSet = data.datasetArray[0];

			//this.option.title.text = dataSet.seriesName;

			var series_1 = {
				name: dataSet.seriesName,
				avoidLabelOverlap: false,
				animationEasing: 'elasticInOut',
				type: 'pie',
				radius: '55%',
				center: ['50%', '45%'],
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
								//formatter: '{b}：{c} ({d}%)',
								textStyle: {
									fontSize: 12,
								}
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: 12,
								}
							}
						},
						labelLine: {
							normal: {
								show: false,
								//length: 1,
								//length2: 1,
								//smooth: true,

							},
							emphasis: {
								show: true,

							}
						}
					})

				};

			}

			var items = _.sortBy(series_1.data, (item) => parseFloat(item.value));

			//最多显示7个label
			for (var i = items.length - 1; i >= Math.max(items.length - 7, 0); i--) {
				if (items[i].value == 0) continue;
				items[i].label.normal.show = true;
				items[i].label.emphasis.show = true;
				items[i].labelLine.normal.show = true;
				items[i].labelLine.emphasis.show = true;
			};
			series.push(series_1);
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 20;
				option.legend.data = [];
				// option.legend.data = _.slice(option.legend.data, 0, 4);

				option.legend.formatter = function(item) {
					return (item.length > 5) ? item.substring(0, 4) + '…' : item;
				}

				option.tooltip.show = false;

				for (var i = 0; i < option.series.length; i++) {
					var series = option.series[i];
					//option.series[i].label = null;
					series.hoverAnimation = false;
					series.center = ['50%', '55%'];
					series.radius = '50%';


					for (var j = 0; j < series.data.length; j++) {
						var item = series.data[j];
						if (item.value == 0) continue;
						item.label.normal.textStyle.fontSize = 1;
						item.label.normal.formatter = function(item) {
							var name = (item.name.length > 4) ? item.name.substring(0, 4) + '…' : item.name;
							var percent = '(' + item.percent + '%)';
							return name + '\n' + percent;
						};
						//item.label.normal.position = 'inside';
						item.label.normal.show = false;
						item.label.emphasis.show = false;
						item.labelLine.normal.show = false;
						item.labelLine.emphasis.show = false;

						item.labelLine.normal.length = 5;
						item.labelLine.normal.length2 = 5;
					};

					var items = _.sortBy(series.data, (item) => parseFloat(item.value));

					//最多显示3个label
					for (var k = items.length - 1; k >= Math.max(items.length - 3, 0); k--) {
						if (items[k].value == 0) continue;
						option.legend.data.push(items[k].name);
						items[k].label.normal.show = true;
						items[k].label.emphasis.show = true;
						items[k].labelLine.normal.show = true;
						items[k].labelLine.emphasis.show = true;

					};

				};
			}
		}
	}
}

//ECharts 100%堆积柱状图
function createPercentageStackedChartConfigOfECharts() {
	return {

		name: 'echart-bar',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	text: '柱状图'
			// },
			legend: {
				show: true,
				bottom: 16,
				//right: 5,
				//orient: 'vertical',
				textStyle: {
					color: '#A9A9A9'
				}
			},

			backgroundColor: 'transparent',

			color: CHART_COLORS,

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				// axisPointer: {
				// 	type: 'shadow'
				// },
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				// position: function(point, params, dom, rect) {

				// 	// 由于chartPanel有padding,导致point有误。
				// 	// padding-top:24px; padding-left:104px;
				// 	return [point[0] + 35, point[1]];
				// },
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
					//show:false,
					//interval: 0,
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
				//backgroundColor: 'rgba(47,69,84,0.25)',
				dataBackgroundColor: '#E1E4E5',
				fillerColor: 'rgba(55,71,79,0.15)',
				handleColor: '#BEC3C8',
				handleSize: 8,
				showDetail: true,
				showDataShadow: true,
				textStyle: {
					color: '#787878',
					fontSize: 8,
				}
			},
		},


		setData: function(data) {
			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
			this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

			var series = this.option.series = [];

			this.option.xAxis.data = data.categories;

			this.option.legend.data = [];

			//this.option.title.text = dataSet.seriesName;

			if (data.datasetArray.length > 10) this.option.color = CHART_COLORS_2;

			this.option.tooltip.formatter = function(params, ticket) {
				var val=params.data.value.toString();
				if (val.indexOf(".") != -1) {
					val = val.substring(0, val.indexOf(".") + 3);
				}
				val='('+val+'%)';

				return `<table>
					<tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}&nbsp;&nbsp;${val}</td></tr>
					<tr><td>${params.data.fieldsName}</td><td>&nbsp;${params.data.totalValue}</td></tr>
				</table>`
			};

			for (var i = 0; i < data.datasetArray.length; i++) {

				var dataSet = data.datasetArray[i];
				//var stackName = data.datasetArray[0].seriesName;
				this.option.legend.data.push(dataSet.seriesName);

				var series_1 = {
					name: dataSet.seriesName,
					type: 'bar',
					showSymbol: false,
					hoverAnimation: false,
					animationEasing: 'elasticInOut',
					//stack:stackName ,//stackName, //data.datasetArray[i+2].seriesName,
					label: {
						normal: {
							show: false,
							// position: 'top',
							// textStyle: {
							// 	color: '#000'
							// }
						},
						emphasis: {
							show: true,
							position: 'inside',
							formatter: '{c} %',
							textStyle: {
								color: '#000'
							}
						}
					},

					barMinHeight: 3,
					data: []
				};
				//this.option.series.formatter
				if (dataSet.setArray && dataSet.setArray.length > 0) {
					for (var j = 0; j < dataSet.setArray.length; j++) {
						var value = 0;
						if (dataSet.setArray[j].value != undefined) {
							value = parseFloat(dataSet.setArray[j].value);
						}

						var totalObj = {
							value: value,
							realValue: value,
							label: {

							},

						};

						series_1.data.push(totalObj); //totalVal ? parseFloat(totalVal || 0) : null);
					}
				}

				series.push(series_1);
			}

			this.option.legend.show = series.length <= 7;
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.dataZoom.show = false;

				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 50;

				if (option.legend.data.length > 10) {
					var arr = [];
					arr.push(option.legend.data[0]);
					arr.push(option.legend.data[5]);
					arr.push(option.legend.data[10]);
					option.legend.data = arr;
				} else {
					option.legend.data = _.slice(option.legend.data, 0, 3);
				}


				option.xAxis.axisLabel.show = true;
				option.xAxis.axisTick.show = false;
				option.xAxis.splitLine.show = true;
				option.xAxis.axisLabel.textStyle.fontSize = 8;
				//option.xAxis.boundaryGap = true;
				option.yAxis.axisLabel.show = true;
				//option.yAxis.axisLabel.inside = true;
				option.yAxis.splitLine.show = true;
				option.yAxis.splitNumber = 3;
				option.yAxis.axisLabel.textStyle.fontSize = 8;

				option.tooltip.show = false;
				option.grid = {
					left: 45,
					top: 15,
					right: 15,
					bottom: 35
				};

				for (var i = 0; i < option.series.length; i++) {
					option.series[i].label = null;
					option.series[i].itemStyle = null;
					option.series[i].hoverAnimation = false;
				};
			}
		},
	}
}

//ECharts 堆积柱状图
function createStackedChartConfigOfECharts() {
	return {

		name: 'echart-bar',

		renderer: 'ECharts',

		option: {

			// title: {
			// 	text: '柱状图'
			// },
			legend: {
				show: true,
				bottom: 16,
				//right: 5,
				//orient: 'vertical',
				textStyle: {
					color: '#A9A9A9'
				}
			},

			backgroundColor: 'transparent',

			color: CHART_COLORS,

			tooltip: {
				trigger: 'item',
				textStyle: {
					color: 'rgba(0,0,0,0.87)',
				},
				// axisPointer: {
				// 	type: 'shadow'
				// },
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				// position: function(point, params, dom, rect) {

				// 	// 由于chartPanel有padding,导致point有误。
				// 	// padding-top:24px; padding-left:104px;
				// 	return [point[0] + 35, point[1]];
				// },
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
					//show:false,
					//interval: 0,
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
					//formatter: '{value}%',
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
				handleSize: 8,
				showDetail: true,
				showDataShadow: true,
				textStyle: {
					color: '#787878',
					fontSize: 8,
				}
			},
		},


		setData: function(data) {
			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			this.option.tooltip.formatter = createTooltipFormatter(data.xAxisName);
			this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);

			var series = this.option.series = [];

			this.option.xAxis.data = data.categories;

			this.option.legend.data = [];

			//this.option.title.text = dataSet.seriesName;

			if (data.datasetArray.length > 10) this.option.color = CHART_COLORS_2;

			this.option.tooltip.formatter = function(params, ticket) {
				return `<table>
							<tr><td>${data.xAxisName}：</td><td>&nbsp;${params.name}</td></tr><tr><td>${params.seriesName}：</td><td>&nbsp;${params.data.realValue}</td></tr>
							<tr><td>${params.data.fieldsName}</td><td>&nbsp;${params.data.totalValue}</td></tr>
						</table>`
			};

			for (var i = 0; i < data.datasetArray.length; i++) {

				var dataSet = data.datasetArray[i];
				//var stackName = data.datasetArray[0].seriesName;
				this.option.legend.data.push(dataSet.seriesName);

				var series_1 = {
					name: dataSet.seriesName,
					type: 'bar',
					showSymbol: false,
					hoverAnimation: false,
					animationEasing: 'elasticInOut',
					//stack:stackName ,
					label: {
						normal: {
							show: false,
							// position: 'top',
							// textStyle: {
							// 	color: '#000'
							// }
						},
						emphasis: {
							show: true,
							position: 'inside',
							///formatter: '{c} %',
							textStyle: {
								color: '#000'
							}
						}
					},

					//barMinHeight: 8,
					data: []
				};
				//this.option.series.formatter
				if (dataSet.setArray && dataSet.setArray.length > 0) {
					for (var j = 0; j < dataSet.setArray.length; j++) {
						var value = 0;
						if (dataSet.setArray[j].value != undefined) {
							value = parseFloat(dataSet.setArray[j].value);
						}

						var totalObj = {
							value: value,
							realValue: value,
							label: {
							},

						};

						series_1.data.push(totalObj); //totalVal ? parseFloat(totalVal || 0) : null);
					}
				}

				series.push(series_1);
			}

			this.option.legend.show = series.length <= 7;
		},

		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.dataZoom.show = false;

				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 50;

				if (option.legend.data.length > 10) {
					var arr = [];
					arr.push(option.legend.data[0]);
					arr.push(option.legend.data[5]);
					arr.push(option.legend.data[10]);
					option.legend.data = arr;
				} else {
					option.legend.data = _.slice(option.legend.data, 0, 3);
				}


				option.xAxis.axisLabel.show = true;
				option.xAxis.axisTick.show = false;
				option.xAxis.splitLine.show = true;
				option.xAxis.axisLabel.textStyle.fontSize = 8;
				//option.xAxis.boundaryGap = true;
				option.yAxis.axisLabel.show = true;
				//option.yAxis.axisLabel.inside = true;
				option.yAxis.splitLine.show = true;
				option.yAxis.splitNumber = 3;
				option.yAxis.axisLabel.textStyle.fontSize = 8;

				option.tooltip.show = false;
				option.grid = {
					left: 45,
					top: 15,
					right: 15,
					bottom: 35
				};

				for (var i = 0; i < option.series.length; i++) {
					option.series[i].label = null;
					option.series[i].itemStyle = null;
					option.series[i].hoverAnimation = false;
				};
			}
		},
	}
}

/**
 * 高级复合图
 */
function createMultiAxisLineConfigOfEChartsMap() {
	return {
		name: 'echart-bar',
		renderer: 'ECharts',
		option: {
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
				trigger: ['axis', 'item'],
				textStyle: {color: 'rgba(0,0,0,0.87)',},
				backgroundColor: 'rgba(255,255,255,0.9)',
				extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
				formatter: this._tooltipFormatter
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
					show: false,
				},
				axisTick: {
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
		},
		setData: function (data) {
			if (!data.datasetArray) {
				throw new Error('unexpected');
			}

			let series = this.option.series = [];

			let baseDataArrayForChartTooltipFormat = ReportUtil.getBaseDataArrayForChartFormat(data.datasetArray);

			this.option.tooltip.formatter       = createTooltipFormatterForChart(baseDataArrayForChartTooltipFormat, data.xAxisName);
			this.option.dataZoom.labelFormatter = createScrollbarLabelFormatter(data.categories);
			this.option.xAxis.data              = data.categories;
			this.option.legend.data             = [];

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
					series_1["itemStyle"] = { normal: { color: this.getChartAreaColor(i).item } };
					series_1["areaStyle"] = { normal: { color: this.getChartAreaColor(i).area } };
				}
				else {
					series_1["type"] = indexField.chartType ? indexField.chartType : 'line';
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

				series.push(series_1);
			}

			return this;
		},
		useDisplaySchema: function(schema) {

			var option = this.option;

			if (CHART_DISPLAY_SCHEMA.THUMBNAIL === schema) {
				option.dataZoom.show = false;

				option.legend.show = true;
				option.legend.orient = 'vertical';
				option.legend.top = 20;
				option.legend.left = 50;

				if (option.legend.data.length > 10) {
					var arr = [];
					arr.push(option.legend.data[0]);
					arr.push(option.legend.data[5]);
					arr.push(option.legend.data[10]);
					option.legend.data = arr;
				} else {
					option.legend.data = _.slice(option.legend.data, 0, 3);
				}


				option.xAxis.axisLabel.show = true;
				option.xAxis.axisTick.show = false;
				option.xAxis.splitLine.show = true;
				option.xAxis.axisLabel.textStyle.fontSize = 8;
				//option.xAxis.boundaryGap = true;
				option.yAxis.axisLabel.show = true;
				//option.yAxis.axisLabel.inside = true;
				option.yAxis.splitLine.show = true;
				option.yAxis.splitNumber = 3;
				option.yAxis.axisLabel.textStyle.fontSize = 8;

				option.tooltip.show = false;
				option.grid = {
					left: 45,
					top: 15,
					right: 15,
					bottom: 35
				};

				for (var i = 0; i < option.series.length; i++) {
					option.series[i].label = null;
					option.series[i].itemStyle = null;
					option.series[i].hoverAnimation = false;
				};
			}
		},
	};
}

/**
 * 词云图配置内容
 * @returns {{}}
 */
function createWordCloudConfigOfEChartsMap() {

    return {

        name     : 'echart-wordcloud',
        renderer : 'ECharts',
        option   : {
            backgroundColor : 'transparent',
            color           : this.CHART_COLORS,
            tooltip         : {
                trigger         : ['axis', 'item'],
                textStyle       : {color: 'rgba(0,0,0,0.87)',},
                backgroundColor : 'rgba(255,255,255,0.9)',
                extraCssText    : 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
                formatter       : this._tooltipFormatter
            },
            grid: {
                bottom: 120,
            },
        },

        setData: function (data) {

            if (!data.datasetArray) {
                throw new Error('unexpected');
            }

            let series = this.option.series = [];

            /* 无数据 */
            if (1 > data.datasetArray.length) {
                return this;
            }

            let dataSet    = data.datasetArray[0];
            let seriesItem = {
                type          : 'wordCloud',
                gridSize      : 10,
                sizeRange     : [12, 50],
                rotationRange : [0, 0],
                shape         : 'circle',
                textStyle     : {
                    normal : {
                        color : function() {
                            return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                        }
                    },
                    emphasis : {
                        shadowBlur  : 10,
                        shadowColor : '#333'
                    }
                },
                data : [],
            };

            if (1 > dataSet.setArray.length) {
                series.push(seriesItem);
                return this;
            }

            for (let setItem in dataSet.setArray) {

                if (!dataSet.setArray.hasOwnProperty(setItem)) continue;

                seriesItem.data.push({
                    name  : dataSet.setArray[setItem].label,
                    value : dataSet.setArray[setItem].value,
                })
            }

            series.push(seriesItem);

            return this;
        },

    };
}

/** ------------ECharts Configrations end   ---------------------*/

function createTooltipFormatter(xAxisName) {

	return function(series, ticket, callback) {

		if (series == null) return;

		if (!series.length) series = [series];
		if(series){
			var title = series[0].name;
		}else{
			var title=''
		}
		var rows = '';

		for (var i = 0; i < series.length; i++) {
			var item = series[i];
			rows += `<tr><td style="color:${item.color}">${item.seriesName} ：</td><td>&nbsp;${item.value}</td></tr>`;
		};

		var html = `<table className="echarts-tooltip">
					 	<tr className="head">
					 		<td>${xAxisName} ：</td>
					 		<td>&nbsp;${title}</td>
					 	</tr>
					 	${rows}
					</table>`

		return html;
	}
}

function createScrollbarLabelFormatter(xAxisLabelArr) {
	//console.log(arguments);
	return function(index) {
		var value = xAxisLabelArr[index];
		if (value.length > 11)
			return value.substring(0, 10) + '...';
		else
			return value;
	}


}