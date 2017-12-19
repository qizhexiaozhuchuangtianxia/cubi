var ChartType = {
	'Pyramid' : {
		type : 'Pyramid',
		name : '锥形图',
		changedTypes : [],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Pyramid.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pyramid-heading"
	},
	'Funnel' : {
		type : 'Funnel',
		name : '漏斗图',
		changedTypes : [],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Funnel.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-funnel-heading"
	},
	'Area2D' : {
		type : 'Area2D',
		name : '2D面积图',
		changedTypes : ['Bar2D','Line'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			if (chartInfo.multipleSeries) {
				return "FusionCharts/charts/3.3.1/MSArea.swf";
			} else {
				return "FusionCharts/charts/3.3.1/Area2D.swf";
			}
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-area-heading"
	},
	'StackedArea2D' : {
		type : 'StackedArea2D',
		name : '面积堆积图',
		changedTypes : ['StackedBar3D','StackedColumn2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/StackedArea2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-stackedarea-heading"
	},
	'Bar2D' : {
		type : 'Bar2D',
		name : '2D条形图',
		changedTypes : ['Area2D','Column2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			if (chartInfo.multipleSeries) {
				return "FusionCharts/charts/3.3.1/MSBar2D.swf";
			} else {
				return "FusionCharts/charts/3.3.1/Bar2D.swf";
			}
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-bar-heading"
	},
	'Bar3D' : {
		type : 'Bar3D',
		name : '3D条形图',
		changedTypes : ['Area2D','Column3D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/MSBar3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-bar-heading"
	},
	'StackedBar2D' : {
		type : 'StackedBar2D',
		name : '2D条形堆积图',
		changedTypes : ['StackedColumn2D','StackedArea2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/StackedBar2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-stackedbar-heading"
	},
	'StackedBar3D' : {
		type : 'StackedBar3D',
		name : '3D条形堆积图',
		changedTypes : ['StackedColumn3D','StackedArea2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/StackedBar3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-stackedbar-heading"
	},
	'Pie2D' : {
		type : 'Pie2D',
		name : '2D饼图',
		changedTypes : ['Column2D','Doughnut2D'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Pie2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pie-heading"
	},
	'Pie3D' : {
		type : 'Pie3D',
		name : '3D饼图',
		changedTypes : ['Column3D','Doughnut3D'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Pie3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pie-heading"
	},
	'Doughnut2D' : {
		type : 'Doughnut2D',
		name : '2D圆环图',
		changedTypes : ['Area2D','Column3D'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Doughnut2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-doughnut-heading"
	},
	'Doughnut3D' : {
		type : 'Doughnut3D',
		name : '3D圆环图',
		changedTypes : ['Area2D','Column3D'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Doughnut3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-doughnut-heading"
	},
	'Pareto2D' : {
		type : 'Pareto2D',
		name : '2D帕累托图',
		changedTypes : ['Pie2D','Line'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Pareto2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pareto-heading"
	},
	'Pareto3D' : {
		type : 'Pareto3D',
		name : '3D帕累托图',
		changedTypes : ['Pie3D','Line'],
		multipleSeries : false,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Pareto3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pareto-heading"
	},
	'Line' : {
		type : 'Line',
		name : '折线图',
		changedTypes : ['Area2D','Column2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			if (chartInfo.multipleSeries) {
				return "FusionCharts/charts/3.3.1/MSLine.swf";
			} else {
				return "FusionCharts/charts/3.3.1/Line.swf";
			}
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-line-heading"
	},
	'Column2D' : {
		type : 'Column2D',
		name : '2D柱形图',
		changedTypes : ['Line','Area2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			if (chartInfo.multipleSeries) {
				return "FusionCharts/charts/3.3.1/MSColumn2D.swf";
			} else {
				return "FusionCharts/charts/3.3.1/Column2D.swf";
			}
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-column-heading"
	},
	'Column3D' : {
		type : 'Column3D',
		name : '3D柱形图',
		changedTypes : ['Line','Area2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			if (chartInfo.multipleSeries) {
				return "FusionCharts/charts/3.3.1/MSColumn3D.swf";
			} else {
				return "FusionCharts/charts/3.3.1/Column3D.swf";
			}
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-column-heading"
	},
	'StackedColumn2D' : {
		type : 'StackedColumn2D',
		name : '柱形堆积图2D',
		changedTypes : ['StackedBar2D','StackedArea2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/StackedColumn2D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-stackedcolumn-heading"
	},
	'StackedColumn3D' : {
		type : 'StackedColumn3D',
		name : '柱形堆积图3D',
		changedTypes : ['StackedBar3D','StackedArea2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/StackedColumn3D.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-stackedcolumn-heading"
	},
	'Marimekko' : {
		type : 'Marimekko',
		name : '矩阵图',
		changedTypes : ['StackedColumn2D'],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Marimekko.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-marimekko-heading"
	},
	'Scatter' : {
		type : 'Scatter',
		name : '散点图',
		changedTypes : [],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Scatter.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pyramid-heading"
	},
	'Bubble' : {
		type : 'Bubble',
		name : '气泡图',
		changedTypes : [],
		multipleSeries : true,
		getSwfUrl : function(chartInfo) {
			return "FusionCharts/charts/3.3.1/Bubble.swf";
		},
		panelStyle : ["styleNone", "styleBottom", "styleRight"],
		typeStyle:"icon-pyramid-heading"
	}
};

var ChartPanelStyle = function(o) {
	var instance = this;
	var chartStyleValue = "styleNone";
	var $container = o.$container;
	var changed = o.changed;
	var type = o.type;
	//var $chartStyle = $("a[name='chartStyle']");//版式	
	
	this.getStyle = function() {
		return chartStyleValue;
	}
	
	this.loadStyle = function(newStyle) {
		chartStyleValue = newStyle;
		$("a[name='chartStyle']").each(function(index,obj){
			if($(obj).attr("value") == chartStyleValue){
				$("a[name='chartStyle']").removeClass("active");
				$(obj).addClass("active");
			}
		});
	}
	
	var initial = function() {
		var styles = ChartType[type]["panelStyle"];
		var length = styles.length;
		for (var i = 0; i < length; i++) {
			var style = styles[i];
			var $a = $("<a></a>");
			$a.attr("name","chartStyle");
			$a.attr("value",style);
			var $span = $("<span></span>");
			$span[0].id = "chartStyleSpan";
			$span.addClass("icon-charts icon-" + type + (i+1));
			$span.appendTo($a);
			$a.html($span);
			$a.appendTo($container);
			if($a.attr("value") == chartStyleValue){
				$("a[name='chartStyle']").removeClass("active");
				$a.addClass("active");
			}
			$a.bind('click',function(){
				$("a[name='chartStyle']").removeClass("active");
				$(this).addClass("active");
				if($(this).attr("value")!=chartStyleValue){
					chartStyleValue = $(this).attr("value");
					if (changed) {
						changed();
					}
				}
			})
		}
		/*$("span[name='chartStyleSpan']").each(function(index,obj){
			$(obj).addClass("icon-charts icon-" + type + index);
		});*/
	}
	
	initial();
}

var ChartThemeColor = {
	themeColors : {
		// blue =
		// ["2D469B","2364B9","3C87C8","0FAAAF","8CC83C","D7DC23","FAB914","F48120","DC235F","A52378"];
		"blue" : [ "2D469B", "A52378", "FAB914", "F48120", "3C87C8", "D7DC23",
				"DC235F", "0FAAAF", "8CC83C", "2364B9" ],
		// "red" :
		// ["8E1C3D","AA2942",BA4961","CBA2A2","D7BCAF","DDCECE","CD9496","AA8384","A0656C","9B435C"];
		"red" : [ "8E1C3D", "CBA2A2", "CD9496", "9B435C", "BA4961", "DDCECE",
				"A0656C", "AA2942", "D7BCAF", "AA8384" ],
		// "pink" :
		// ["B487B4","E563BD","C65CAF","FF9A00","FFCF00","9CCF31","CECF31","5FD3D2","57EAE3","D2B4D2"]
		"pink" : [ "B487B4", "FF9A00", "CECF31", "D2B4D2", "C65CAF", "9CCF31",
				"57EAE3", "E563BD", "FFCF00", "5FD3D2" ]
	},

	getThemeColors : function(theme, dataSize) {
		if (!theme) {
			theme = 'blue';
		}
		var colors = ChartThemeColor.themeColors[theme];
		if (!colors) {
			colors = ChartThemeColor.themeColors['blue'];
		}

		var colorText = null;
		if (dataSize <= 5) {
			var newColors = [];
			for (var i = 0; i < colors.length; i += 2) {
				newColors.push(colors[i]);
			}
			colorText = newColors.join(',');
		} else {
			colorText = colors.join(',');
		}

		return colorText;
	}
}