module.exports = {

	getConfig: function(chartType) {
		switch (chartType) {
			case 'Line':
				return LineChartConfig;
			case 'Column':
				return ColumnChartConfig;
			case 'Pie':
				return PieChartConfig;
			case 'Area':
				return AreaChartConfig;
			case 'StackedArea':
				return StackedAreaChartConfig;
			case 'Pareto':
				return ParetoChartConfig;
			case 'Matrix':
				return MatrixChartConfig;
			case 'Pyramid':
				return ColumnChartConfig;
			case 'Funnel':
				return ColumnChartConfig;
			default:
				return LineChartConfig;
		}
	}
}

var PieChartConfig = {
	"type": "pie2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var AreaChartConfig = {
	"type": "area2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var LineChartConfig = {
	"type": "scrollline2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var ColumnChartConfig = {
	"type": "mscombidy2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var StackedAreaChartConfig = {
	"type": "stackedarea2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var ParetoChartConfig = {
	"type": "pareto2d",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};

var MatrixChartConfig = {
	"type": "marimekko",
	"width": "100%",
	"height": "100%",
	"dataFormat": "json",
	"dataSource": {
		"chart": {
			"caption": "2015年销量",
			"bgcolor": "455A64",
			"bgalpha": "100",
			"basefontcolor": "edeeef",
			"canvasbgalpha": "0",
			"canvasbordercolor": "edeeef",
			"divlinecolor": "edeeef",
			"xAxisLineColor": "#999",
			"divlineColor": "#999",
			"legendItemFontSize": "14",
			"legendItemFontColor": "#eee",
			"divLineIsDashed": "0",
			"showValues": "0",
			"labelpadding": "10",
			"numberScaleValue": '10000',
			"numberscaleunit": "万",
			"formatNumber": 0,
			"theme": "fint",
			"paletteColors": "#1aaf5d,#00C5CD,#FFA54F",
		},
	},
	"loadMessage": '',
	"containerBackgroundColor": "transparent",
};
