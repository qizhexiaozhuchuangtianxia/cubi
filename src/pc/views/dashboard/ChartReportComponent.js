var React = require('react');
var App = require('app');
var ChartView = require('../common/ChartView');
var ReportFilterListComponent = require('./ReportFilterListComponent');
var {
    Toggle
} = require('material-ui');
module.exports = React.createClass({
	getInitialState:function(){
        return {}
	},
	render:function(){
        var thumbStyles={
            backgroundColor:"rgb(0, 188, 212)"
        }
        if(!this.props.showCharIcon){
            thumbStyles={
                backgroundColor:"#dbdbdb"
            }
        }
        
        return (
            <div>
                <div className="dashboardReportEdit-bar-toggle">
                    <Toggle 
                        thumbStyle={thumbStyles}
                        onToggle={(evt)=>this._charIconToggleHandle(evt)} 
                        defaultToggled={this.props.showCharIcon} 
                        label="允许使用此分析时更换图形" />
                </div>
                <ReportFilterListComponent 
                    marginTopClass={true} 
                    filterListData={this.props.filterData} 
                    row={this.props.row} 
                    col={this.props.col}/>
            </div>
        )
	},
    _charIconToggleHandle:function(evt){//显示是否控制分析里面的图形按钮是否显示
        evt.stopPropagation();
        App.emit('APP-DASHBOARD-REPORT-TOGGLE-BUTTON-HANDLE',{//执行EditReprotComponent.js里面的方法
            showCharIcon:this.props.showCharIcon
        })
    },
})