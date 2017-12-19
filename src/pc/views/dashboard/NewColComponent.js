var React = require('react');
var $ = require('jQuery');
var ReportHeader = require('./ReportHeader');
// var Report = require('./Report');
import Report from './ReportComponent';
var ReportBottom = require('./ReportBottom');
var ReportText = require('./ReportText');
var DelBtn =  require('./DelBtn');
var DragCol =  require('./DragCol');
var classnames=require('classnames');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var MetaDataStore = require('../../stores/MetaDataStore');
module.exports = React.createClass({
    getInitialState: function() {
        return {
            reportInfo:'',
            filterFields:this.props.data.report.filterFields,
        }
    },
    componentDidMount: function() {},
    componentWillMount: function() {
        var _this = this;
        ReportStore.getReportInfoHandle(this.props.data.report.id).then(function(data){//获取报表的信息和数据
            
            var reportInfo=data.getAreaInfo;
            var metadataId=reportInfo.metadataId;
            var filterFields=_this.props.data.report.filterFields;
            if(filterFields.length>0){
                MetaDataStore.getMetaData(metadataId).then(function(metaData){
                    var newFilterFields=MetaDataStore.setDashboardFilterData(filterFields,metaData.filterData,metadataId);
                    // for(var i=0;i<filterFields.length;i++){ 
                    //     for(var j=0;j<metaData.filterData.length;j++){
                    //         if(filterFields[i].name==metaData.filterData.name){
                    //             filterFields[i].groupType=metaData.filterData[j].groupType;
                    //             filterFields[i].dimensionId=metaData.filterData[j].dimensionId;
                    //             filterFields[i].groupLevels=metaData.filterData[j].groupLevels;
                    //         }
                    //     }
                        
                    // }
                    _this.setState({
                        filterFields:newFilterFields
                    });
                });
            }
            
            _this.setState({
                reportInfo:reportInfo
            })
        })
    },
    componentWillReceiveProps:function(nextProps){
        this.setState({
            filterFields:nextProps.data.report.filterFields,
        })
    },
    _charReportIconListHandle:function(){//判断是否显示图形切换的列表
        if(this.props.data.report.showCharIcon!==undefined){
            if(this.props.data.report.showCharIcon){
                return <ReportBottom 
                    reportInfo={this.state.reportInfo}
                    bottomData={this.props.data.report} 
                    reportRow={this.props.row} 
                    reportCol={this.props.col}/>
            }
        }
    },
    _reportHeaderRightIconMenuHandle:function(){//判断头部由此按钮显示状态
        return  <ReportHeader 
                reportInfo={this.state.reportInfo}
                directoryId={this.props.directoryId} 
                doshboarId={this.props.doshboarId} 
                operation={this.props.operation} 
                reportHeader={this.props.data.report} 
                reportRow={this.props.row} 
                reportCol={this.props.col} 
                headerName={this.props.data.report.name} 
                headerTime={this.props.data.report.updateTime}
                type={this.props.data.type} 
                actionName={this.props.actionName}
                dirName={this.props.dirName}
                canShowProps={this.props.canShowState}
                dashBoardRead={this.props.dashBoardRead}
                location={this.props.location}/>
    },
    _getReport:function(){
        var data=this.props.data.report;
        data.filterFields=this.state.filterFields;
        var report = <Report 
                reportInfo={this.state.reportInfo}
                canShowProps={this.props.canShowState.canShow} 
                row={this.props.row} 
                col={this.props.col} 
                report={data} 
                height={this.props.data.height}
                width={this.props.data.width}/>;
        if(!this.props.data.report.id){
            report = null;
        }
        if(this.props.data.type=='TEXT'){
            report = <ReportText row={this.props.row} col={this.props.col} report={this.props.data.report} height={this.props.data.height} />;
        }
        return report;
    },
    render: function() {
        var colClassName = 'dashboardView_col';
        if(this.props.canShowState.canShow){
            if(this.props.canShowState.canShowRowId == this.props.row && this.props.canShowState.canShowColId == this.props.col){
                if(this.props.data.report.category == 'CHART'){
                    colClassName = "dashboardView_col dashboardView_col_hide dashboardView_col_show_bottom";
                }else{
                    colClassName = "dashboardView_col dashboardView_col_hide";
                }
                
            }
        }
        var DragColPanel = null;
        if(this.props.col==0&&this.props.clen==2){
            DragColPanel = <DragCol operation={this.props.operation} row={this.props.row} left={this.props.data.width-8} col={this.props.col}/>
        }
        var width = this.props.data.width;
        return (
            <div className={colClassName} style={{width:width}}>
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
});