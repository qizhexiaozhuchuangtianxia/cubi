var React = require('react');
var $ = require('jquery');
var ReportHeader = require('./ReportHeader');
import ReportComponent from './ReportComponent';
var ReportBottom = require('./ReportBottom');
var ReportText = require('./ReportText');
var ReportWeb = require('./ReportWeb');
var DelBtn =  require('./DelBtn');
var DragCol =  require('./DragCol');
var AddCellLeft = require('./AddCellLeft');
var AddCellRight = require('./AddCellRight');
var classnames=require('classnames');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var MetaDataStore = require('../../stores/MetaDataStore');
var GlobalFilterStore = require('../../stores/GlobalFilterStore');
var Loading = require('../common/Loading');
import DrilDownStore from '../../stores/DrilDownStore';
import AboutReportDialog from './AboutReportDialogComponent';

module.exports = React.createClass({
    getInitialState: function() {
        return {
            reportInfo:'',
            filterFields:this.props.data.report.filterFields,
            errorMessage:'',
            weiduList:[],
            drilDownFilterFields:[],
            resetFielter:false
        }
    },
    app:{},
    componentWillMount: function(){
        var _this = this;
        if(this.props.data.type == 'TEXT') return;
        ReportStore.getReportInfoHandle(_this.props.data.report.id).then(function(data){//获取报表的信息和数据
            if(!data.getAreaInfo){
                _this.setState({
                    errorMessage:data.message
                })
            }else{
               //if(filterFields.length>0){
                   _this.reportData = data;
                   MetaDataStore.getMetaData(data.getAreaInfo.metadataId).then(function(metaData){
                        _this.metaData = metaData;
                        _this._willMount(_this.props.row,_this.props.col);
                   });
               //}
               // _this.setState({
               //     reportInfo:reportInfo
               // })
            }
        })
        this.app['APP-DASHBOARD-SET-REPORTINFO-DATA'] = App.on('APP-DASHBOARD-SET-REPORTINFO-DATA',this._setReportInfo);
        this.app['APP-DASHBOARD-RESET-REPORT-DATA'] = App.on('APP-DASHBOARD-RESET-REPORT-DATA',this._willMount);
    },
    componentWillUnmount: function () {
        for (var i in this.app) {
            this.app[i].remove();
        }
    },
    _willMount:function(row,col,resetFielter){
        var _this = this,
        data = this.reportData,
        metaData = this.metaData;
        if(row==this.props.row&&col==this.props.col){
            var reportInfo=data.getAreaInfo;
            var metadataId=reportInfo.metadataId;
            var filterFields=_this.props.data.report.filterFields;
            var type=_this.props.data.report.type;
            var rowTitleFields=data.getAreaInfo.rowTitleFields||data.getAreaInfo.categoryFields;
            //var drilDownFilterFields=[];
            if(filterFields.length>0){
                filterFields=MetaDataStore.setDashboardFilterData(filterFields,metaData.filterData,metadataId);
            }
            // if(type=='TREE' || type=='CATEGORY' || (data.getAreaInfo.category=='CHART' && type!="EchartsMap")){
            //     var weiduList=DrilDownStore.setWeiduList(metaData.weiduList,rowTitleFields);
            //     var filterData=DrilDownStore.setFilterFields(weiduList,data.getAreaInfo.filterFields);
            //     drilDownFilterFields=filterData.filterFields;
            // }
            var drilDownFilterFields=data.getAreaInfo.filterFields;
            if(reportInfo.compare){
                _this.compareDimension = App.deepClone(reportInfo.compareInfo.compareDimension);
                var compareIndexFields = [];
                reportInfo.compareInfo.compareDimension.map(function(item,index){
                    if(item.selected){
                        compareIndexFields = item.compareIndexFields;
                        metaData.weiduList.map(function(weiduItem,weiduIndex){
                                if(item.dimensionName==weiduItem.name){
                                    weiduItem.metadataId = metadataId;
                                    item.weiItem = weiduItem;
                                }
                        })
                    }
                });
                if(reportInfo.category=="INDEX"){
                    _this.columnAttributes = App.deepClone(reportInfo.rowTitleFields.concat(compareIndexFields));
                }
            }
           _this.setState({
               filterFields:filterFields,
               reportInfo:reportInfo,
               weiduList:metaData.weiduList,
               rowTitleFields:rowTitleFields,
               drilDownFilterFields:drilDownFilterFields,
               resetFielter:resetFielter,
               metadataId:metadataId
           });
       }
    },
    componentWillReceiveProps:function(nextProps){
        this.setState({
            filterFields:nextProps.data.report.filterFields,
            resetFielter:false
        })
    },
    render: function() {
        var colClassName = 'dashboardView_col';
        if(this.props.canShowState.canShow){
            var canShowCol = this.props.canShowState.canShowColId;
            if(this.props.canShowState.canShowRowId == this.props.row && canShowCol == this.props.col){
                if(this.props.data.report.category == 'CHART'){
                    colClassName = "dashboardView_col dashboardView_col_hide dashboardView_col_show_bottom";
                }else{
                    colClassName = "dashboardView_col dashboardView_col_hide";
                }

            }
        }
        var DragColPanel = null;
        var rowData = this.props.rowData;
        var colLen = rowData.cells.length;
        var DragColComponent = <DragCol
            operation={this.props.operation}
            row={this.props.row}
            left={this.props.data.width-8}
            col={this.props.col}
            clen={this.props.clen}
            colLen={colLen}
        />;
        if(rowData.cells.length<4){
           if(this.props.col!=rowData.cells.length-1)
           DragColPanel = DragColComponent;
        }
        var width = this.props.data.width;
        if(this.props.data.type == 'TEXT'){
            return (
                <div className={colClassName} style={{width:width}}>
                    <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                    <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                    {DragColPanel}
                    <div className="dashboardView_col_box">
                        <DelBtn row={this.props.row} col={this.props.col} operation={this.props.operation}/>
                        <div className="col_panel">
                            {this._reportHeaderRightIconMenuHandle()}
                            <ReportText
                                row={this.props.row}
                                col={this.props.col}
                                report={this.props.data.report}
                                height={this.props.data.height} />
                            {this._charReportIconListHandle()}
                        </div>
                    </div>
                </div>
            )
        }else if(this.props.data.type == 'WEB'){
            return (
                <div className={colClassName} style={{width:width}}>
                    <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                    <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                    {DragColPanel}
                    <div className="dashboardView_col_box">
                        <DelBtn row={this.props.row} col={this.props.col} operation={this.props.operation}/>
                        <div className="col_panel">
                            {this._reportHeaderRightIconMenuHandle()}
                            <ReportWeb
                                row={this.props.row}
                                col={this.props.col}
                                report={this.props.data.report}
                                height={this.props.data.height} />
                            {this._charReportIconListHandle()}
                        </div>
                    </div>
                </div>
            )
        }else{
            if(this.state.errorMessage !== ""){
                let colContentClassName = 'dashboardView_col_content';
                let charViewClassName = 'reportShowBox';
                let pageSize = parseInt((this.props.data.height - 106) / 48);
                let reportShowBoxHei = this.props.data.height;
                reportShowBoxHei = pageSize * 49 + 56 * 2 + 1;
                if (this.props.data.report.category == "INDEX") {
                    colContentClassName += ' dashboardView_col_content_table';
                } else if (this.props.data.report.category == "CHART") {
                    reportShowBoxHei -= 24;
                }
                return (
                    <div className={colClassName} style={{width:width}}>
                        <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                        <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                        {DragColPanel}
                        <div className="dashboardView_col_box">
                            <DelBtn row={this.props.row} col={this.props.col} cell={this.props.col} operation={this.props.operation}/>
                            <div className="col_panel">
                                <div className={colContentClassName}>
                                    <div className={charViewClassName} style={{height:reportShowBoxHei}}>
                                        <div className="dashboardErrorMessage">
                                            <div className="iconfont icon-ictanhaotishi224px"></div>
                                            <p>{this.state.errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }else{
                if(this.state.reportInfo == ""){
                    let colContentClassName = 'dashboardView_col_content';
                    let charViewClassName = 'reportShowBox';
                    let pageSize = parseInt((this.props.data.height - 106) / 48);
                    let reportShowBoxHei = this.props.data.height;
                    reportShowBoxHei = pageSize * 49 + 56 * 2 + 1;
                    if (this.props.data.report.category == "INDEX") {
                        colContentClassName += ' dashboardView_col_content_table';
                    } else if (this.props.data.report.category == "CHART") {
                        reportShowBoxHei -= 24;
                    }
                    return (
                        <div className={colClassName} style={{width:width}}>
                            <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                            <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                            {DragColPanel}
                            <div className="dashboardView_col_box">
                                <div className="col_panel">
                                    <div className={colContentClassName}>
                                        <div className={charViewClassName} style={{height:reportShowBoxHei}}>
                                           <Loading/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }else{
                    return (
                        <div className={colClassName} style={{width:width}}>
                            <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                            <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                            {DragColPanel}
                            <div className="dashboardView_col_box">
                                <DelBtn row={this.props.row} col={this.props.col} operation={this.props.operation}/>
                                <div className="col_panel">
                                    {this._reportHeaderRightIconMenuHandle()}
                                    {this._getReport()}
                                    {this._charReportIconListHandle()}
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        }
    },
    _charReportIconListHandle:function(){//判断是否显示图形切换的列表
        if(this.props.data.report.showCharIcon!==undefined){
            if(this.props.data.report.showCharIcon){
                return <ReportBottom
                    reportInfo={this.state.reportInfo}
                    bottomData={this.props.data.report}
                    row={this.props.row}
                    col={this.props.col}/>
            }
        }
    },
    _reportHeaderRightIconMenuHandle:function(){//判断头部由此按钮显示状态
        return (
            <div>
                <AboutReportDialog
                    areaInfo    = {this.state.reportInfo}
                    col   = {this.props.col}
                    row   = {this.props.row}
                    dashboardId = {this.props.doshboarId}
                />
                <ReportHeader
                    resetFielter={this.state.resetFielter}
                    reportInfo={this.state.reportInfo}
                    directoryId={this.props.directoryId}
                    doshboarId={this.props.doshboarId}
                    operation={this.props.operation}
                    reportHeader={this.props.data.report}
                    columnAttributes={this.columnAttributes}
                    row={this.props.row}
                    col={this.props.col}
                    headerName={this.props.data.report.name}
                    headerTime={this.props.data.report.updateTime}
                    type={this.props.data.type}
                    actionName={this.props.actionName}
                    dirName={this.props.dirName}
                    canShowProps={this.props.canShowState}
                    dashBoardRead={this.props.dashBoardRead}
                    location={this.props.location}
                    drilDownDatas={this.drilDownData}
                    metadataId={this.state.metadataId}
                    exportData={ this.props.exportData}
                    exportDataModel={ this.props.exportDataModel}
                />
            </div>
        )
    },
    drilDownData:[],
    _getReport:function(){
        var data=this.props.data.report;
        data.filterFields=this.state.filterFields;
        var report = <ReportComponent
                resetFielter={this.state.resetFielter}
                reportInfo={this.state.reportInfo}
                canShowProps={this.props.canShowState.canShow}
                canShowState={this.props.canShowState}
                row={this.props.row}
                col={this.props.col}
                report={data}
                height={this.props.data.height}
                width={this.props.data.width}
                dashBoardRead={this.props.dashBoardRead}
                globalFilterFields={this.props.globalFilterFields}
                globalFilterSign={this.props.globalFilterSign}
                clickHeader={this.props.clickHeader}
                Refresh={false}
                weiduList={this.state.weiduList}
                rowTitleFields={this.state.rowTitleFields}
                drilDownFilterFields={this.state.drilDownFilterFields}
                getdrilDownData={this._BackDrilDownData}
                reprotFilter={this.state.reprotFilter}/>;
        if(!this.props.data.report.id){
            report = null;
        }
        return report;
    },
    _BackDrilDownData:function(backData){
      this.drilDownData=backData;
    },
    _setReportInfo:function(arg){
        if(arg.row==this.props.row&&arg.col==this.props.col){
            var reportInfo = App.deepClone(this.state.reportInfo);
            var indexFields = reportInfo.indexFields;
            var compareIndexFields = [];
            var selectedScenes = [];
            if(arg.compareData&&reportInfo.compareInfo){
                var compareDimension = reportInfo.compareInfo.compareDimension;
                compareDimension.map(function(compareItem,compareIndex){
                    if(compareItem.selected){
                        /*if(arg.compareData.index>=0){
                            compareItem.scenes[arg.compareData.index].filterFields = arg.compareData.filterFields;
                            selectedScenes = [{name:arg.compareData.sceneName}];
                            indexFields.map(function(indexFieldsItem,indexFieldsIndex){
                                compareIndexFields.push({
                                    customName:indexFieldsItem.customName,
                                    name:indexFieldsItem.name+':'+arg.compareData.sceneName,
                                    sceneName:arg.compareData.sceneName,
                                    statistical:indexFieldsItem.statistical,
                                    type:"COMPARE_INDEX_FIELD"
                                })
                            })
                            compareItem.selectedCompare = true;
                            compareItem.selectedScenes = selectedScenes;
                            compareItem.compareIndexFields = compareIndexFields; 
                        }else{
                            indexFields.map(function(indexFieldsItem,indexFieldsIndex){
                                compareItem.scenes.map(function(scenesItem,scenesIndex){
                                    compareIndexFields.push({
                                        customName:indexFieldsItem.customName,
                                        name:indexFieldsItem.name+':'+scenesItem.sceneName,
                                        sceneName:scenesItem.sceneName,
                                        statistical:indexFieldsItem.statistical,
                                        type:"COMPARE_INDEX_FIELD"
                                    })
                                    selectedScenes.push({name:scenesItem.sceneName})
                                })
                            })
                            compareItem.selectedCompare = false;
                            compareItem.selectedScenes = selectedScenes;
                            compareItem.compareIndexFields = compareIndexFields; 
                        }*/

                        compareItem.scenes[arg.compareData.index].filterFields = arg.compareData.filterFields;
                        indexFields.map(function(indexFieldsItem,indexFieldsIndex){
                            if(!indexFieldsItem.expression){
                                compareItem.scenes.map(function(scenesItem,scenesIndex){
                                    compareIndexFields.push({
                                        customName:indexFieldsItem.customName,
                                        name:indexFieldsItem.name+':'+scenesItem.sceneName,
                                        sceneName:scenesItem.sceneName,
                                        statistical:indexFieldsItem.statistical,
                                        type:"COMPARE_INDEX_FIELD",
                                        pageFormater:indexFieldsItem.pageFormater
                                    })
                                    if(indexFieldsItem.distinct=='distinct'){
                                        compareIndexFields[compareIndexFields.length-1].distinct = 'distinct';
                                    }
                                    if(indexFieldsIndex==0)
                                    selectedScenes.push({name:scenesItem.sceneName});
                                })
                            }
                            
                        })
                        compareItem.selectedCompare = true;
                        compareItem.selectedScenes = selectedScenes;
                        compareItem.compareIndexFields = compareIndexFields; 
                    }
                })
                reportInfo.compareInfo.compareDimension = compareDimension;
            }
            this.setState({
               reportInfo:reportInfo,
               resetFielter:false
           });
        }
    }
});
