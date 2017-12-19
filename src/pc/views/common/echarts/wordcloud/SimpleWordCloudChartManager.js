var _ = require('lodash');
var EChartManager = require('../EChartManager');

function WordCloudChartManager() {
	EChartManager.call(this);
}

WordCloudChartManager.prototype = _.create(EChartManager.prototype, {

	getInitialOption: function() {
		return {
            backgroundColor : 'transparent',
            color           : this.CHART_COLORS,
            grid: {
                bottom: 120,
            },
		};
	},

	setData: function(data) {

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
            sizeRange     : [10, 60],
            rotationRange : [-90, 90],
            rotationStep  : 90,
            width         : '90%',
            height        : '90%',
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
                name  : dataSet.setArray[setItem].label,
                value : dataSet.setArray[setItem].value,
            })
        }

        series.push(seriesItem);

        return this;
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