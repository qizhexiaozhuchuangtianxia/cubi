/**
 * 词云图
 * @author NatasX 2017-08-03
 */

let _             = require('lodash');
let EChartManager = require('../EChartManager');
let ReportUtil    = require('../../../../utils/ReportUtil');

function WordCloudChartManager() {
	EChartManager.call(this);
}

/**
 * 词云图
 * @type {EChartManager}
 */
WordCloudChartManager.prototype = _.create(EChartManager.prototype, {

	/**
	 * 初始化词云基础配置信息
	 */
	getInitialOption : function () {
		return {
            backgroundColor : 'transparent',
            color           : this.CHART_COLORS,
            tooltip         : {
                textStyle       : {color: 'rgba(0,0,0,0.87)',},
                backgroundColor : 'rgba(255,255,255,0.9)',
                extraCssText    : 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);padding:16px;line-height:25px;',
                formatter       : this._tooltipFormatter
            },
            grid: {
                bottom: 120,
            },
            animation: false,
		};
	},

	/**
	 * 根据数据成图
	 * @param data
	 * @returns {WordCloudChartManager}
	 */
	setData : function (data) {

        if (!data.datasetArray) {
            throw new Error('unexpected');
        }

        let series = this.option.series = [];

        /* 无数据 */
        if (1 > data.datasetArray.length) {
            return this;
        }

        /* ECharts加载maskImage有延迟，需要等待图片加载结束后，重新渲染图形 */
        /* 暂时使用默认形状 */
        // let _this     = this;
        // let maskImage = new Image();
        //
        // maskImage.src    = this._getMaskImagePath();
        // maskImage.onload = function () {
        //     _this.echart.setOption(_this.option);
        // };

        let dataSet    = data.datasetArray[0];
        let seriesItem = {
            type          : 'wordCloud',
            gridSize      : 10,
            sizeRange     : [15, 150],
            rotationRange : [-90, 90],
            rotationStep  : 90,
            left          : '20px',
            right         : '20px',
            top           : '20px',
            bottom        : '20px',
            width         : '95%',
            height        : '95%',
            textStyle     : {
                normal : {
                    color : this._getWordColor.bind(this)
                },
                emphasis : {
                    shadowBlur  : 2,
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
                xName         : data.xAxisName,
                seriesName    : dataSet.seriesName,
                name          : dataSet.setArray[setItem].label,
                value         : dataSet.setArray[setItem].value,
                pageFormatter : dataSet.pageFormater,
            });
        }

        series.push(seriesItem);

        return this;
	},

	/**
	 * 配置成图格局
	 * @param width
	 * @param height
	 * @returns {WordCloudChartManager}
	 */
	layout : function (width, height) {
		return this;
	},

    /**
     * Tooltip格式化函数
     * @private
     */
    _tooltipFormatter : function (params, ticket, callback) {

        let formattedValue = ReportUtil.getFormattedValue(params.data.value, params.data.pageFormatter);

        let row = (
            `<tr>` +
                `<td style="color:${params.color}">${params.data.seriesName} ：</td>` +
                `<td>&nbsp;${formattedValue}</td>` +
            `</tr>`
        );

        return (
            `<table className="echarts-tooltip">` +
                `<tr className="head">` +
                    `<td>${params.data.xName} ：</td>` +
                    `<td>&nbsp;${params.data.name}</td>` +
                `</tr>` +
                `${row}` +
            `</table>`
        );
    },

    _getMaskImagePath : function () {

        let imageFile = 'circle.png'; // 'cloud2.png' 'cloud.png' 'circle.png' 'whale.png';
        let url       = document.location.toString();
        let arrUrl    = url.split("//");
        let start     = arrUrl[1].indexOf("/");
        let relUrl    = arrUrl[1].substring(0, start);
        let path      = 'http://' + relUrl + '/themes/default/images/wordcloudshape/' + imageFile;

        if (-1 !== relUrl.indexOf('localhost')) {
            path = 'http://' + relUrl + '/Cube/build/pc/themes/default/images/wordcloudshape/' + imageFile;
        }

        this.iconPath = path;

        return path;
    },

    /**
     * 获取词颜色，最后一个颜色只有50%几率命中
     * @param item
     * @returns {*}
     * @private
     */
    _getWordColor: function (item) {

        let dataIndex   = item.dataIndex;
        let colorLength = this.WORD_COLORS.length;
        let colorIndex  = dataIndex % colorLength;

        if ((colorIndex === (colorLength - 1)) && (0 === (dataIndex + 1) / colorLength % 2)) {
            colorIndex = Math.round(colorLength - 2);
        }

        return this.WORD_COLORS[colorIndex];
    },
});

module.exports = WordCloudChartManager;