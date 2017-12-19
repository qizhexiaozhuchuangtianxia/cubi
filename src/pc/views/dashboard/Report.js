/**
 * Created by Administrator on 2016-2-25.
 */
var React = require('react');
var App = require('app');
var ChartViewConfig = require('../common/ChartViewConfig');
var ReportFilterComponent = require('./ReportFilterComponent');
var DataViewOfReport = require('../common/dataView/DataViewOfReport');

module.exports = React.createClass({
    app: {},
    oldFilterFields: null,
    getInitialState: function() {
        var reportType = '';
        var typeState = '';
        if (this.props.report.category == "CHART") {
            reportType = ChartViewConfig.getConfig(this.props.report.type);
            typeState = this.props.report.type;
        }
        var filterFields = JSON.stringify({
            fields: this.props.report.filterFields
        });
        filterFields = JSON.parse(filterFields);
        this.oldFilterFields = JSON.stringify({
            value: this.props.report.filterFields
        });
        return {
            report: JSON.parse(JSON.stringify(this.props.report)) || null,
            reportIdState: this.props.report.id,
            typeState: typeState,
            filterFields: filterFields.fields
        }
    },
    componentWillUnmount: function() {
        for (var i in this.app) {
            this.app[i].remove();
        }
    },
    componentWillReceiveProps: function(nextProps) { //点击本页面进入本页面的时候触发
        console.log('nextProps',nextProps)
        this.setState(function(previousState, currentProps) {
            var oldFields = JSON.stringify({
                fields: previousState.filterFields
            });
            oldFields = JSON.parse(oldFields).fields;
            var filterFields = JSON.stringify({
                fields: nextProps.report.filterFields
            });
            filterFields = JSON.parse(filterFields).fields;
            for (var i = 0; i < filterFields.length; i++) {
                for (var j = 0; j < oldFields.length; j++) {
                    if (oldFields[j].dbField == filterFields[i].dbField) {
                        filterFields[i].items = oldFields[j].items;
                        filterFields[i].value = oldFields[j].value;
                    }
                }
            }
            previousState.filterFields = filterFields;
            return {previousState}
        })
    },
    componentDidMount: function() {
        //当前报表切换图形类型 刷新当前报表
        this.app['APP-DASHBOARD-TOGGLE-CHAR-TYPE-REFRESH-HANDLE'] = App.on('APP-DASHBOARD-TOGGLE-CHAR-TYPE-REFRESH-HANDLE', this._toggleCharTypeRefreshHandle);
        //驾驶舱 点击当前分析的刷新按钮之后 执行的方法 刷新当前分析
      this.app['APP-DASHBOARD-CLEAR-REPORT-REFRESH-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-CLEAR-REPORT-REFRESH-BUTTON-HANDLE', this._clickReportRefreshButtonHandle);
        //驾驶舱  如果关闭了图形切换按钮之后重置报表展示效果
        this.app['APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE'] = App.on('APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE', this._resetReportHandle);
        this.app['APP-DASHBOARD-SELECT-REPORT-FILTER-VALUE-HANDLE'] = App.on('APP-DASHBOARD-SELECT-REPORT-FILTER-VALUE-HANDLE', this._setFilterValueReportHandle);
        //组件加载完成之后给返回按钮绑定一个返回时间 点击返回按钮 返回上一级页面
        this.app['APP-DASHBOARD-SET-REPORT-FILTER-VALUES'] = App.on('APP-DASHBOARD-SET-REPORT-FILTER-VALUES', this._setFilterValues);
        //组件加载完成之后给返回按钮绑定一个返回时间 点击返回按钮 返回上一级页面
    },
    render: function() {
        var filterFieldsLength = this.props.report.filterFields ? this.props.report.filterFields.length : 0;
        var colContentClassName = 'dashboardView_col_content';
        var charViewClassName = 'reportShowBox';
        if (this.props.canShowProps) {
            if (filterFieldsLength == 0) {
                if ((this.props.report.showCharIcon == false) || (this.props.report.showCharIcon == undefined)) {
                    colContentClassName = "dashboardView_col_content dashboardView_col_content_no_padding";
                }
            } else {
                if ((this.props.report.showCharIcon == false) || (this.props.report.showCharIcon == undefined)) {
                    colContentClassName = "dashboardView_col_content dashboardView_col_content_no_padding";
                }
            }

        }
        var strFilterFields = JSON.stringify(this.state.filterFields || []);
        var customCellWidthArr = JSON.stringify(this.props.report.columnAttributes || []);
        var pageSize = parseInt((this.props.height - 106) / 48);
        var reportShowBoxHei=this.props.height;
        reportShowBoxHei=pageSize*49+56*2+1;
        if(this.props.report.category == "INDEX"){
            colContentClassName+=' dashboardView_col_content_table';
            //reportShowBoxHei=pageSize*49+56*2+1;
        }else if(this.props.report.category == "CHART"){
           reportShowBoxHei-=24;
        }

        return (
            <div className={colContentClassName}>
                {this._filterFieldsLenHandle()}
                <div className={charViewClassName} style={{height:reportShowBoxHei}}>
                    <DataViewOfReport
                        reportInfo={this.props.reportInfo}
                        filterFields={strFilterFields}
                        customCellWidthArr={customCellWidthArr}
                        reportId={this.props.report.id}
                        width={this.props.width-48}
                        height={reportShowBoxHei}
                        showPager={true}
                        pageSize={pageSize}
                        reportType={this.state.typeState}
                        row={this.props.row} />
                </div>
            </div>
        );

    },
    _resetReportHandle: function(obj) { //驾驶舱  如果关闭了图形切换按钮之后重置报表展示效果
        if (obj.row == this.props.row && obj.col == this.props.col) {
            this.setState({
                typeState: this.props.report.type
            })
        }
    },
    _clickReportRefreshButtonHandle: function(itemObj) { //点击驾驶舱头部刷新按钮执行的方法
        var _this = this;
        setTimeout(function() {
          console.log(itemObj.row,_this.props.row,itemObj.col,_this.props.col)

            if (itemObj.row == _this.props.row && itemObj.col == _this.props.col) {
                _this.setState(function(previousState, currentProps) {
                    previousState.reportIdState = itemObj.reportAreaId;
                    return {
                        previousState
                    };
                });
            }
        }, 500)
    },
    _toggleCharTypeRefreshHandle: function(obj) { //当前报表切换图形类型 刷新当前报表
        if (obj.row == this.props.row && obj.col == this.props.col) {
            this.setState({
                typeState: obj.charType
            })
        }
    },
    _filterFieldsLenHandle: function() { //当前报表筛选列表是否存在 长度大于零存在 否则不存在
        if (this.state.filterFields != undefined) {
            if (this.state.filterFields.length > 0) {
                return <ReportFilterComponent
                    row={this.props.row}
                    col={this.props.col}
                    reportId={this.state.report.id}
                    filterFields={this.state.filterFields}/>
            }
        }
    },
    _setFilterValues: function(arg) {
        var _this = this;
        if (arg.row == this.props.row && arg.col == this.props.col) {
            this.setState(function(previousState) {
                if (!arg.clear) {
                    if (arg.value) {
                        previousState.filterFields[arg.index].value = arg.value;
                        previousState.filterFields[arg.index].valueType = arg.dateType;
                    } else {
                        var values = [];
                        var items = [];
                        for (var i = 0; i < arg.items.length; i++) {
                            if(arg.items[i].selectedRow == this.props.row && arg.items[i].selectedCol == this.props.col){
                                // values.push(arg.items[i].name);
                                var value = arg.items[i].id||arg.items[i].value;
                                values.push(value);
                                items.push(arg.items[i]);
                            }
                        }
                        previousState.filterFields[arg.index].items = items;
                        previousState.filterFields[arg.index].value = values;
                    }
                    previousState.filterFields = previousState.filterFields;
                } else {
                    var fields = previousState.filterFields;
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i].valueType == 'DATE_CYCLE' || fields[i].valueType == 'DATE_RANGE') {
                            fields[i].valueType = 'DATE';
                        }
                        fields[i].items = [];
                        fields[i].value = [];
                    }
                }
                App.emit(
                    'APP-DASHBOARD-REPORT-HEADER-SET-FILTER', {
                        row:this.props.row,
                        col:this.props.col,
                        filterFields: previousState.filterFields
                    });
                return previousState;
            })
        } else {
            return;
        }
    },
    _setFilterValueReportHandle: function(obj) { //设置筛选条件里值的方法,刷新当前报表3
        this.setState(function(oldState) {
            var value = [];
            for (var i = 0; i < obj.filterFields.length; i++) {
                if (obj.filterFields[i].selectBool) {
                    value.push(obj.filterFields[i].name);
                }
            }
            oldState.rows[obj.row].cells[obj.col].report.filterFields[obj.filterNum].items = obj.filterFields;
            oldState.rows[obj.row].cells[obj.col].report.filterFields[obj.filterNum].value = value;
            return oldState;
        })
    }
});
