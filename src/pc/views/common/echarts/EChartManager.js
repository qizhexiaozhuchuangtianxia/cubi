/**
 * echart manager，对象接口是EChartManager，子类应该继承此接口
 * 我们想对echarts管理，能够响应echarts的事件
 */
let SetZhibiaoOption       = require('./bar/SetZhibiaoOption');
let DrillDownTransformDate = require('../DrillDownTransformDate');

function EChartManager() {
    this.option    = null;
    this.xAxisName = null;
}

var FilterFieldsStore = require('../../../stores/FilterFieldsStore');
var App = require('app');

EChartManager.prototype = {

    curDataZoom : {
        start : 0,
        end   :100,
    },

    //颜色方案(数据少)
    CHART_COLORS: ['#3C87C8', '#10AD93', '#F9CA06', '#D3405C', '#F385B7', '#B596BC', '#AF54A4', '#30A6C1', '#72BF49', '#F08421'],

    //颜色方案(数据多)
    CHART_COLORS_2: ['#3C87C8', '#30A6C1', '#75CFD3', '#10AD93', '#72BF49', '#F9CA06', '#F5EF5B', '#F08421', '#F5A52A', '#D3405C', '#E25079', '#E05FA0', '#F385B7', '#D3A585', '#D3B9B6', '#B596BC', '#C0A7C6', '#9942A0', '#AF54A4', '#3572BC'],

    // 面积图配色方案
    CHART_AREA_COLORS: [{
        area: '#3C87C8',
        item: '#2873B4'
    }, {
        area: '#30A6C1',
        item: '#1C92AD'
    }, {
        area: '#75CFD3',
        item: '#61BBBF'
    }, {
        area: '#10AD93',
        item: '#00997F'
    }, {
        area: '#72BF49',
        item: '#5EAB35'
    }, {
        area: '#F9CA06',
        item: '#E5B600'
    }, {
        area: '#F5EF5B',
        item: '#E1DB47'
    }, {
        area: '#F08421',
        item: '#DC700D'
    }, {
        area: '#F5A52A',
        item: '#E19116'
    }, {
        area: '#D3405C',
        item: '#BF2C48'
    }, {
        area: '#E25079',
        item: '#CE3C65'
    }, {
        area: '#E05FA0',
        item: '#CC4B8C'
    }, {
        area: '#F385B7',
        item: '#DF71A3'
    }, {
        area: '#D3A585',
        item: '#BF9171'
    }, {
        area: '#D3B9B6',
        item: '#BFA5A2'
    }, {
        area: '#B596BC',
        item: '#A182A8'
    }, {
        area: '#C0A7C6',
        item: '#AC93B2'
    }, {
        area: '#9942A0',
        item: '#852E8C'
    }, {
        area: '#AF54A4',
        item: '#9B4090'
    }, {
        area: '#3572BC',
        item: '#215EA8'
    }],

    /* 词云图配色方案 */
    WORD_COLORS: [
        'rgb(10, 10, 10)',
        'rgb(157, 1, 66)',
        'rgb(212, 62, 79)',
        'rgb(244, 110, 67)',
        'rgb(253, 174, 97)',
        'rgb(254, 224, 138)',
    ],

    //用echart初始化
    init: function (echart) {
        let manager = this;
        this.echart = echart;

        this.curDataZoom.start = 0;
        this.curDataZoom.end   = 100;

        if (this.getInitialOption) {
            this.option = this.getInitialOption();
        }
        else {
            throw new Error('Child OptionManager must implement getInitialOption method');
        }

        echart.on('legendselectchanged', function (params) {
            manager.handleLegendChanged(params);
        });

        echart.on('mouseover', function (params) {
            if (params.componentType === 'series') {
                if (params.seriesType === 'line' || params.seriesType === 'bar') {
                    manager.handleMouseOverItem(params);
                }
            }
        });

        echart.on('mouseout', function (params) {
            if (params.componentType === 'series') {
                if (params.seriesType === 'line' || params.seriesType === 'bar') {
                    manager.handleMouseOutItem(params);
                }
            }
        });

        echart.on('datazoom', function (params) {
            manager.handleDataZoom(params);
        });

        echart.on('click', function (params) {
            manager.handleClickitem(params)
        });

        return this;
    },

    /**
     * 为option设置数据，然后返回当前实例
     * @param data
     * @returns {EChartManager}
     */
    setData: function (data) {
        return this;
    },

    layout: function (width, height) {
        return this;
    },

    drilDownFilter: [],

    setOption: function (weiduList, drilDownFilter) {

        this.echart.setOption(this.option);

        if (weiduList && drilDownFilter) {
            this.weiduList      = weiduList;
            this.drilDownFilter = drilDownFilter;
        }

        return this;
    },

    setTool: function () {

        this.SetZhibiaoOption = new SetZhibiaoOption({
            indexParam      : this.indexParam,
            data            : this.data,
            chartType       : this.chartType,
            echart          : this.echart,
            option          : this.option,
            compareIndex    : this.compareIndex,
            selectedCompare : this.selectedCompare,
            zhiBiaoList     : this.zhiBiaoList,
            weiduList       : this.weiduList
        });

        this.SetZhibiaoOption.initIndexFilter();
    },

    getOption: function () {
        return this.option;
    },

    getChartAreaColor: function (index) {
        index = parseInt((index + 7) % this.CHART_AREA_COLORS.length);
        return this.CHART_AREA_COLORS[index];
    },

    handleClickitem: function (params) {
        this.drillDown(params);
    },

    /**
     * 图例改变处理程序,如果处理，请返回option
     * 手动设置当前的DataZoom
     * @param params
     */
    handleLegendChanged: function (params) {
        let option = this.option;

        option.dataZoom.start = this.curDataZoom.start;
        option.dataZoom.end   = this.curDataZoom.end;

        this.echart.setOption(option);
    },

    /**
     * 鼠标悬浮到图形单元时，切换tooltip的trigger为item
     * 手动设置当前的DataZoom
     * @param params
     */
    handleMouseOverItem: function (params) {

        /* 只有柱状图，并且进行了“范围”、“排序”或“TopN”筛选后进行特殊更新Option */
        if (('ScrollColumn2D' === this.chartType) &&
            (this.SetZhibiaoOption.indexParam) &&
            (this.SetZhibiaoOption.indexParam.maxMin ||
             this.SetZhibiaoOption.indexParam.sortFields ||
             this.SetZhibiaoOption.indexParam.topParameters)) {

            this.SetZhibiaoOption.option.tooltip.trigger = 'item';
            this.SetZhibiaoOption.option.dataZoom.start  = this.curDataZoom.start;
            this.SetZhibiaoOption.option.dataZoom.end    = this.curDataZoom.end;
            this.SetZhibiaoOption.initIndexFilter();

            return;
        }

        let option = this.option;

        option.tooltip.trigger = 'item';
        option.dataZoom.start  = this.curDataZoom.start;
        option.dataZoom.end    = this.curDataZoom.end;

        this.echart.setOption(option);
    },

    /**
     * 鼠标离开图形单元时，切换tooltip的trigger为axis
     * 手动设置当前的DataZoom
     * @param params
     */
    handleMouseOutItem: function (params) {

        /* 只有柱状图，并且进行了“范围”、“排序”或“TopN”筛选后进行特殊更新Option */
        if (('ScrollColumn2D' === this.chartType) &&
            (this.SetZhibiaoOption.indexParam) &&
            (this.SetZhibiaoOption.indexParam.maxMin ||
             this.SetZhibiaoOption.indexParam.sortFields ||
             this.SetZhibiaoOption.indexParam.topParameters)) {

            this.SetZhibiaoOption.option.tooltip.trigger = 'axis';
            this.SetZhibiaoOption.option.dataZoom.start  = this.curDataZoom.start;
            this.SetZhibiaoOption.option.dataZoom.end    = this.curDataZoom.end;
            this.SetZhibiaoOption.initIndexFilter();

            return;
        }

        let option = this.option;

        option.tooltip.trigger = 'axis';
        option.dataZoom.start  = this.curDataZoom.start;
        option.dataZoom.end    = this.curDataZoom.end;

        this.echart.setOption(option);
    },

    /**
     * 记录图形筛选组件的当前筛选值，就是图形下方的长条
     * @param params
     */
    handleDataZoom: function (params) {

        this.curDataZoom.start = params.start;
        this.curDataZoom.end   = params.end;
    },

    getWeidu: function (weiduListParam) {
        let weiduList = weiduListParam;
        let wei;
        let weiLen = false;
        let onewei = false;
        if (1 === weiduList.length) {
            wei    = weiduList[0];
            weiLen = true;
        }
        if (weiduList.length > 1) {
            wei = weiduList[1];
        }

        if (("Pie2D" === this.chartType) || ("MultiAxisLine" === this.chartType) || ('WordCloud' === this.chartType) || weiLen) {
            wei    = weiduList[0];
            onewei = true;
        }

        return {
            wei    : wei,
            weiLen : weiLen,
            onewei : onewei,
        }
    },

    drillDown: function (item) {

        let weiduList   = JSON.parse(JSON.stringify(this.weiduList));
        let promiseList = [];

        if ((this.chartType === "Pie2D" || this.chartType === "MultiAxisLine" || 'WordCloud' === this.chartType) && weiduList.length > 1) {
            weiduList.splice(1);
        }

        for (let i = 0; i < weiduList.length; i++) {
            if (weiduList[i].groupType === "GROUP_TITLE_FIELD" || weiduList[i].groupType === "GROUP_DATE_TITLE_FIELD") {
                if (weiduList.length === 1 && FilterFieldsStore.drillDownAuthChart(weiduList[i], this.drilDownFilter)) {
                    return false;
                }
                promiseList.push(this.drillDownSetType(weiduList[i], item, i))
            }
        }

        return new Promise((resolve, reject) => {

            Promise.all(promiseList).then(function (result) {

                for (let j = 0; j < result.length; j++) {
                    if (result[j] === null) {
                        return;
                    }
                    if (!result[j]) {
                        result.splice(j, 1);
                    }
                }

                App.emit('APP-REPORT-SET-DRILL-CHART', result);

                resolve(result);
            });
        });
    },

    drillDownSetType: function (dimensionItem, item, index) {
        let _this     = this;
        let weiduList = JSON.parse(JSON.stringify(this.weiduList));

        if (dimensionItem.groupType === "") {
            return false;
        }

        if ((this.chartType === "Pie2D" || this.chartType === "MultiAxisLine" || 'WordCloud' === this.chartType) && weiduList.length > 1) {
            weiduList.splice(1);
        }

        if (this.chartType === "ScrollColumn2D") {

            if (this.SetZhibiaoOption.min || this.SetZhibiaoOption.topN || this.SetZhibiaoOption.indexFields || this.SetZhibiaoOption.sortIndexFields) {

                if (weiduList.length === 1) {
                    item.name = item.data.weiName;
                }
                else if (weiduList.length === 2) {
                    item.name       = item.data.xAxisName;
                    item.seriesName = item.data.name;
                }
            }
        }

        if (FilterFieldsStore.drillDownAuthChart(dimensionItem, this.drilDownFilter)) {
            return FilterFieldsStore.getDrilDownFilterItem(dimensionItem, this.drilDownFilter);
        }

        if (dimensionItem.groupType === "GROUP_DATE_TITLE_FIELD") {
            return this.drillDownDateFilter(dimensionItem, item, index, weiduList);
        }

        return this.drillDownFilter(dimensionItem, item, index, weiduList);
    },

    drillDownFilter: function (dimensionItem, item, index, weiduList) {

        let dimensionId = dimensionItem.dimensionId;
        let _this       = this;
        let chart       = true;

        item.onewei = true;

        return FilterFieldsStore.getTreeFilterFiledsHandle(dimensionId, []).then(function (data) {

            if (weiduList.length > 1) {
                item.onewei = false;
            }

            if ((_this.zhiBiaoList) && _this.zhiBiaoList.length > 1) {
                item.seriesName = FilterFieldsStore.splitDirlName(item.seriesName, _this.zhiBiaoList);
            }

            let levelItem = FilterFieldsStore.drillDownMatchLevel(data, item, chart, index);

            //错误数据处理
            if (!levelItem.item.id && dimensionItem.groupType === "GROUP_TITLE_FIELD") {
                return null;
            }

            if (FilterFieldsStore[dimensionId]) {
                FilterFieldsStore[dimensionId].clickNext = false;
            }

            //设置树结构选中状态
            let selectData = FilterFieldsStore.setTreeSeletedHandle(data, levelItem);

            //转换成后台树形结构参数
            let treeData    = FilterFieldsStore.setTreeFilterFields(selectData);
            let updateWeidu = FilterFieldsStore.updateWeidu(dimensionItem.level, weiduList, dimensionId, dimensionItem.groupLevels);
            let curWei      = FilterFieldsStore.matchDimension(dimensionItem, updateWeidu);

            //转换返回  面包导航数据格式
            let backAndBreadData = FilterFieldsStore.setBackAndBreadData(treeData, updateWeidu, dimensionId, _this.drilDownFilter, chart, false);
            let filterObj        = FilterFieldsStore.treeToOneDimen(treeData);
            let max              = FilterFieldsStore.setObjLen(filterObj);
            let levelItemArr     = FilterFieldsStore.initSetLevelItemArr(filterObj);

            return {
                drillFilter  : treeData,
                dimensionId  : dimensionId,
                groupLevels  : curWei.groupLevels,
                level        : curWei.level,
                levelItem    : levelItemArr.length > 0 ? levelItemArr[levelItemArr.length - 1] : [],
                weiduList    : updateWeidu,
                breadData    : backAndBreadData.breadData,
                goBackData   : backAndBreadData.goBackData,
                levelItemArr : levelItemArr,
                drillDown    : true,
                drillLevel   : max >= curWei.groupLevels.length ? max : curWei.groupLevels.indexOf(curWei.level),
                fieldName    : curWei.fieldName,
                row          : _this.row,
                col          : _this.col,
                type         : 'GROUP_TITLE_FIELD',
                sortTopParam : {
                    topParameters : _this.SetZhibiaoOption ? _this.SetZhibiaoOption.topFilter : false,
                    sortFields    : _this.SetZhibiaoOption ? _this.SetZhibiaoOption.sortFilter : false,
                    maxMin        : _this.SetZhibiaoOption ? _this.SetZhibiaoOption.maxFilter : false,
                }
            };
        });
    },

    drillDownDateFilter: function (dimensionItem, item, index, weiduList) {

        return new Promise((resolve, reject) => {

            let date     = [];
            let levelLen = dimensionItem.groupLevels.indexOf(dimensionItem.level);
            let name     = item.name;

            dimensionItem.level = dimensionItem.groupLevels[levelLen];

            if (weiduList.length > 1 && index === 1) {
                name = item.seriesName;
            }

            name = DrillDownTransformDate.removeSpace(name);
            name = DrillDownTransformDate.isChineseToLine(name);

            if (levelLen === 0) {
                date = DrillDownTransformDate.year(name);
            }
            if (levelLen === 1) {
                date = DrillDownTransformDate.quarter(name);
            }
            if (levelLen === 2) {
                date = DrillDownTransformDate.month(name);
            }
            if (levelLen === 3) {
                date = DrillDownTransformDate.week(name);
            }

            let breadData    = FilterFieldsStore.setDateBreadData(date[0], dimensionItem, levelLen + 1);
            let levelItemArr = FilterFieldsStore.setDatelevelItemArr(breadData);
            let updateWeidu  = FilterFieldsStore.updateWeidu(dimensionItem.level, weiduList, dimensionItem.name, dimensionItem.groupLevels);
            let curWei       = FilterFieldsStore.matchDimension(dimensionItem, updateWeidu);

            resolve({
                drillFilter  : date,
                dimensionId  : curWei.name,
                groupLevels  : curWei.groupLevels,
                level        : curWei.level,
                levelItem    : [],
                levelItemArr : levelItemArr,
                drillDown    : true,
                drillLevel   : levelLen + 1,
                weiduList    : updateWeidu,
                breadData    : breadData,
                type         : 'GROUP_DATE_TITLE_FIELD',
                fieldName    : curWei.fieldName,
                row          : this.row,
                col          : this.col,
            })
        })
    }
};

module.exports = EChartManager;
