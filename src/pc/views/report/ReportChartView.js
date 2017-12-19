/**
 * 报表图形
 *
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ChartView = require('../common/ChartView');

import ChartRightMenu           from './ChartRightMenu';
import AboutReportDialog        from './AboutReportDialogComponent';
import MultiAxisLineRightMenu   from '../common/MultiAxisLineRightMenu';
import ShowMultiAxisLineSetting from './ShowMultiAxisLineSetting';
import BreadcrumbTop            from '../common/BreadcrumbTop';


module.exports = React.createClass({

	displayName: 'ReportChartView',

	getInitialState: function() {
		//var drilFilters = this._updateDrilDownFilter(this.props.reportType,this.props.drilDownFilter);
		return {

		drilDownFilter:this.props.drilDownFilter,

		}
	},
	componentWillMount:function(){

	},
	componentWillReceiveProps: function(nextProps) {
		var drilDownFilter = this._updateDrilDownFilter(nextProps.reportType,nextProps.weiduList,nextProps.drilDownFilter);
		if(nextProps.showSetReportNameDialog){
			return;
		}
		this.setState({
	  		drilDownFilter:drilDownFilter,
		})
	},
	componentDidMount: function() {

	},
	componentWillUnmount: function() {

	},
	render: function() {
		var chartView=null,chartViewClass='chart-view';
		if(this.props.changeed){
			chartView=<ChartView
              reportType={this.props.reportType}
              zhiBiaoList={this.props.zhiBiaoList}
              config={this.props.config}
              params={this.props.params}
              multiAxisLineSetting = {this.props.multiAxisLineSetting}
              sortTopParam={this.props.sortTopParam}
              weiduList={this.props.weiduList}
              drilDownFilter={this.state.drilDownFilter}
              compareInfo={this.props.compareInfo}
              compare={this.props.compare}
              compareData={this.props.compareData}
              sortFields={this.props.sortFields}
              maxMin={this.props.maxMin}
              topParameters={this.props.topParameters}/>
		}
		if(this.props.reportType=='ScrollColumn2D' || this.props.reportType=='ScrollLine2D'){
			chartViewClass='chart-view chart-height'
		}

		if ("MultiAxisLine" === this.props.reportType) {

			return (
				<div className={chartViewClass}>
                    <span className="chart-box-container">
                        <div className="reportHeaderClassName">
	                        <MultiAxisLineRightMenu />
	                        <ShowMultiAxisLineSetting
		                        reportId   = {this.props.reportId}
		                        reportData = {this.props.data}
		                        multiAxisLineSetting = {this.props.multiAxisLineSetting}
	                        />
	                        <AboutReportDialog
		                        reportId   = {this.props.reportId}
		                        reportData = {this.props.data}
		                        reportName = {this.props.tableName} />
                            <div className="titleZhuBox">{this.props.tableName}</div>
                            <div className="titleFuBox">数据立方：{this.props.metadataName}</div>
													  <div className='breads'>{this.state.drilDownFilter.map(this._breadlHandle)}</div>

                        </div>
	                    {chartView}
                    </span>
				</div>
			);
		}

		return (
				<div className={chartViewClass}>
                    <span className="chart-box-container">
                        <div className="reportHeaderClassName">
	                        <ChartRightMenu />
	                        <AboutReportDialog
		                        reportId   = {this.props.reportId}
		                        reportData = {this.props.data}
		                        reportName = {this.props.tableName} />
                            <div className="titleZhuBox">{this.props.tableName}</div>
                            <div className="titleFuBox">数据立方：{this.props.metadataName}</div>
							<div className='breads'>{this.state.drilDownFilter.map(this._breadlHandle)}</div>

							</div>
                        {chartView}
                    </span>
                </div>
			)
	},
	_updateDrilDownFilter:function(reportType,weiduList,drilDownFilters){
		var weidu = weiduList;
		var weiduLen =  weidu.length;
		var cloneDrilDownFilters = App.deepClone(drilDownFilters);
		var drilDownFilter= [];

		if(reportType=='Pie2D' || reportType=='MultiAxisLine' || 'WordCloud' === reportType){
			for(var i=0;i<cloneDrilDownFilters.length;i++){
				if(weiduLen>0 && (cloneDrilDownFilters[i].dimensionId == weidu[0].dimensionId || cloneDrilDownFilters[i].dimensionId == weidu[0].name)){
					drilDownFilter.push(cloneDrilDownFilters[i])
				}
			}
		}else{
			for(var i=0;i<cloneDrilDownFilters.length;i++){
				if(weiduLen==1){
					var name=weidu[0].dimensionId;
					if(weidu[0].groupType=="GROUP_DATE_TITLE_FIELD"){
						name=weidu[0].name;
					}
					if(cloneDrilDownFilters[i].dimensionId == name){
						drilDownFilter.push(cloneDrilDownFilters[i]);
					}
				}else{
					for(var j=0;j<2;j++){
						var name=weidu[j].dimensionId;
						if(weidu[j].groupType=="GROUP_DATE_TITLE_FIELD"){
							name=weidu[j].name;
						}
						if(cloneDrilDownFilters[i].dimensionId == name){
							drilDownFilter.push(cloneDrilDownFilters[i]);
						}
					}

				}

			}

		}
		return drilDownFilter;
	},
	_breadlHandle:function(item,key){
		return <BreadcrumbTop
		item={item}
		metadataId = {this.props.data.areaInfo.metadataId}
		key={item.fieldName}/>

	},

});
