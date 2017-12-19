var React = require('react');
var App = require('app');
var TableView = require('../common/TableView');
// var ReportFilterEditeListComponent = require('./ReportFilterEditeListComponent');
var ReportFilterListComponent = require('./ReportFilterListComponent');
var DataViewOfReport = require('../common/dataView/DataViewOfReport');
/*import DataViewOfReport from '../common/dataView/DataViewOfReport';
import ReportDefaultFilterComponent from './rightEdit/ReportDefaultFilterComponent';*/
var {
	Toggle
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	render: function() {
		return (
			<div>
				<ReportFilterListComponent
					marginTopClass={true}
					filterListData={this.props.filterData}
					row={this.props.row}
					col={this.props.col}/>
			</div>
		)
	},
	_showHideTableDomHandle: function() { //是否显示table的展示和隐藏

		if (this.props.reportFilterSet) {
			return <div className="dashboardReportEdit-bar-toggle-box">
		                <div className="tableReportShowBox">
		                	<div className="tableReportShowBox-scroll">
			                	<DataViewOfReport
			                	     filterFields={this.props.defaultFilterFields}
			                	     reportId={this.props.report.id}
			                	     reportType={this.props.typeState}/>
		                	</div>
		                </div>
		                <ReportDefaultFilterComponent
		                	row={this.props.row}
							col={this.props.col}
		                	reportId={this.props.reportId}
		                	defaultFilterData={this.props.defaultFilterFields}/>
		            </div>
		} else {
			return null;
		}
	},
	_setReportShowHandle: function(evt) { //设置整个驾驶舱的状态时候同事设置本省自己的状态
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-REPORT-TOGGLE-SHOW-REPORT-HANDLE', { //执行EditReprotComponent.js里面的方法
			reportFilterSet: this.props.reportFilterSet
		})
	}
})
