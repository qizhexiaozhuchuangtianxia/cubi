/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');
var ColComponent = require('./ColComponent');
var AddBoxBtn = require('./AddBoxBtn');
var FilterList = require('./globalFilter/FilterList');
var DragRow = require('./DragRow');
var AddRowPrev = require('./AddRowPrev');
var AddRowNext = require('./AddRowNext');
var Searchs = require('./globalFilter/Searchs');
var GlobalFilterStore = require('../../stores/GlobalFilterStore');
module.exports = React.createClass({
    displayName:'RowComponent',
    getInitialState: function() {
        this.props
        return {
            cells: this.props.cells,
            cLen: this.props.cells.length
        }
    },
    reportNum:0,
    componentWillMount: function() {

    },
    componentDidMount: function() {

    },
    render:function(){
        var addNextBtn = '';
        if(this.props.row==this.props.len-1){
            var addNextBtn = <AddRowNext row={this.props.row} operation={this.props.operation}/>;
        }
         return (
            <div className="dashboardView_list">
                <AddRowPrev row={this.props.row} operation={this.props.operation}/>
                <div className="dashboardView_row">
                    {this.props.cells.map(this._getCells)}
                </div>
                <DragRow row={this.props.row} operation={this.props.operation}/>
                {addNextBtn}
                <div className="clear-both"></div>
            </div>
        );
    },
    _getCells:function(item,index){
        if(item.type=='REPORT'){
            this.reportNum++;
        }
        if(item.report.id||item.report.content||item.report.url){
            return (
                <ColComponent
                    directoryId={this.props.directoryId}
                    doshboarId={this.props.doshboarId}
                    clen={this.props.cells.length}
                    canShowState = {this.props.canShowState}
                    key={item.report.id+'_'+this.props.row+'_'+this.props.cell+'_'+index}
                    rowData={this.props.rowData}
                    row={this.props.row}
                    data={item}
                    col={index}
                    actionName={this.props.actionName}
                    dirName={this.props.dirName}
                    operation={this.props.operation}
                    dashBoardRead={this.props.dashBoardRead}
                    location={this.props.location}
                    globalFilterFields={this.props.globalFilterFields}
                    globalFilterSign={this.props.globalFilterSign}
                    canShow={this.props.canShow}
                    exportData={ this.props.exportData}
                    exportDataModel={ this.props.exportDataModel}
                />
            );
        }else if(item.type=='DOWN_FILTER' || item.type=='SEARCH_FILTER' || item.type=='DATE_FILTER' || item.type=='FILTER'){
            return <FilterList
            key={index}
            data={item}
            row={this.props.row}
            rowData={this.props.rowData}
            col={index}
            clen={this.props.cells.length}
            colLength={this.props.cells.length}
            operation={this.props.operation}
            dashBoardRead={this.props.dashBoardRead}
            globalFilterFields={this.props.globalFilterFields}
            filterSign={this.props.filterSign}
            reportNum={this.reportNum}/>
        }else{
            return (
                <AddBoxBtn
                    key={index}
                    row={this.props.row}
                    data={item}
                    rowData={this.props.rowData}
                    rows={this.props.rows}
                    rowIndex={index}
                    col={index}
                    colLength={this.props.cells.length}
                    width={item.width}
                    operation={this.props.operation}
                />
            );
        }
    }
});
