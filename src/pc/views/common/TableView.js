/**
 * 我的分析－table
 */

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var PagerView = require('./PagerView');
var Loading = require('./Loading');
var RenderTable=require('./table/RenderTable');
var RenderKPI=require('./table/RenderKPI');

require('./jQueryTable');
//var ScrollTable = require('./jQueryTable/ScrollTable');

module.exports = React.createClass({
	displayName: '我的分析－table',
	propTypes: {
		data: React.PropTypes.object,
		pageSize: React.PropTypes.number,
		showPager: React.PropTypes.bool, //是否显示分页，取反义。。。蛋疼
		info: React.PropTypes.bool,
		onFieldNameChanged: React.PropTypes.func,
	},
	getDefaultProps: function() {
		return {
			pageSize: 15,
			showPager: false,
		}
	},
	getInitialState: function() {
		var pageSize = this.props.pageSize;
		return {
			pageSize: pageSize,
			totalRow: 1,
			currentPage: 1,
			error: null,
			reportData: this.props.reportData,
			loaded: false,
			sortFields: [],
			prePageNo: null,
		};
	},
	componentWillMount: function() {

		for (var i in this.app) {
			this.app[i].remove()
		}
	},
	app: {},
	componentDidMount: function() {

		this._loadTableData();

	},

	componentWillReceiveProps: function(nextProps) {
		var state = {
				pageSize: nextProps.pageSize
			}
		if(nextProps.isReportTable || nextProps.dimesion){
			state.reportData=nextProps.reportData
		}

		this.setState(state, this._loadTableData);
	},
	componentWillUnmount: function() {},
	render: function() {
		var tableContextClass = "table-context";
		if (!this.state.loaded && !this.props.isReportTable && !this.props.dimesion) {
			return (
				<div className="tableShowScroll">
					<div className="table-view">
						<div className="table-context" ref="table-context">
							<Loading/>
						</div>
					</div>
	            </div>
			)

		}

		if(this.props.dimesion){
			return (
				<div id="tableview" className="tableShowScroll">
					<div className="table-view">
						<div className="table-context" ref="table-context">
							<RenderTable
							  tables={this.props.tables}
								data={this.state.reportData}
								totalRow={this.state.totalRow}
								currentPage={this.state.currentPage}
								pageSize={this.state.pageSize}
								dimesion={this.props.dimesion}
								setZhibiaoState={this.props.setZhibiaoState}
								setzhibiaoTop={this.props.setzhibiaoTop}
								topParameters={this.props.topParameters}
								zhibiaoMinMax={this.props.zhibiaoMinMax}
								weiduList={this.props.weiduList}
								columnTitleFields={this.props.columnTitleFields}
								rowTitleFields={this.props.rowTitleFields}
								filterData={this.props.filterData}
								drilDownFilter={this.props.drilDownFilter}
								sortFieldsIndex={this.props.sortFieldsIndex}
								compare={this.props.compare}/>

						</div>

					</div>
	            </div>
			)
		}
		if (this.state.error) {

			return (
				<div className="tableShowScroll">
					<div className="table-view">
						<div className="table-context" ref="table-context">
							<div className="cubi-error noGetReportError">
								{this.state.error}
							</div>
						</div>
					</div>
	            </div>
			)
		} else if (this.state.reportData) {
			if(this.state.reportData.pageParameter.totalRowCount<5){
				tableContextClass = "table-context min-table-content";
			}

			var _rendController= <RenderTable data={this.state.reportData}
								onFieldNameChanged={this.props.onFieldNameChanged}
								totalRow={this.state.totalRow}
								currentPage={this.state.currentPage}
								pageSize={this.state.pageSize}
								prePageNo={this.state.prePageNo}
								setScrollbar={this.props.setScrollbar}
								sortName={this.props.sortName}
								sortParameters={this.props.sortParameters}
								setSortParams={this.props.setSortParams}
								setZhibiaoState={this.props.setZhibiaoState}
								setzhibiaoTop={this.props.setzhibiaoTop}
								topParameters={this.props.topParameters}
								zhibiaoMinMax={this.props.zhibiaoMinMax}
								weiduList={this.props.weiduList}
								columnTitleFields={this.props.columnTitleFields}
								rowTitleFields={this.props.rowTitleFields}
								filterData={this.props.filterData}
								drilDownFilter={this.props.drilDownFilter}
								sortFieldsIndex={this.props.sortFieldsIndex}
								compare={this.props.compare}
								selectedScenesName={this.props.selectedScenesName}
								zhiBiaoindexFields={this.props.zhiBiaoindexFields}/>;

			var _pagerView =this._renderPagerView();


			if (this.props.reportData.type =="KPI") {
				_rendController = <RenderKPI data={this.state.reportData} kpiConfig={this.props.kpiConfig} />
				_pagerView ='';
			}

			return (
				<div id="tableview" className="tableShowScroll">
					<div className="table-view" ref="tableViewStyle">
						<div className={tableContextClass} ref="table-context">
							{_rendController}
						</div>
						{_pagerView}
					</div>

	            </div>
			)
		}else {
			return null;
		}

	},

	_renderPagerView: function() { //显示分页与否的方法
		if (!this.props.showPager && !this.props.isReportTable && !this.props.dimesion) {
			return (
				<div className="table-page">
					<PagerView totalRow={this.state.totalRow} currentPage={this.state.currentPage} pageSize={this.state.pageSize} onPageTo={this._onPageToHandler} ></PagerView>
                </div>
			)
		}
	},
	_loadTableData: function() {
		//默认从props取值
		if(this.props.isReportTable || this.props.dimesion){
			return;
		}
		var _this=this;
		var data = JSON.parse(JSON.stringify(this.props.data));
		if (data.areaInfo)
			data.areaInfo.sortFields = this.state.sortFields;
		if (data == null) {
			return;
		}
		if (!this.props.info) {
			if (data.areaParameters != null) {
				var pageRowCount = this.state.pageSize;
				data.areaParameters.pageParameter = {
					pageRowCount: pageRowCount,
					currentPageNo: this.state.currentPage,
				}
			}
			if (data.areaInfo.rowTitleFields.length == 0 && data.areaInfo.indexFields.length == 0) {
				return;
			}

			this._loadTableDataFromServer(data).then(this._updateTable, this._handleError);

		} else {
			if (data.data.areaParameters != null) {
				data.data.areaParameters.pageParameter = {
					pageRowCount: this.state.pageSize,
					currentPageNo: this.state.currentPage,
				}
			}

			this._loadTableDataFromServer(data).then(this._updateTable, this._handleError);
		}
	},

	_loadTableDataFromServer: function(params) {
		var _this=this;
		return ReportStore.getAreaByAreaInfo(params).then(function(data) {
			if (data.success) {
				return Promise.resolve(data.dataObject);
			} else {
				return Promise.reject(data.message);
			}
		});
	},

	_handleError: function(message) {

		if (!this.isMounted()) return;
		console.log('message', message)
		this.setState({
			error: message,
			reportData: null,
			loaded: true
		});
	},
	_onPageToHandler: function(page) {
		if (!this.isMounted()) return;

		this.setState({
			currentPage: page,
			loaded: false
		}, this._loadTableData);

	},

	_onSortToHandler: function(sortFields) {
		this.setState({
			sortFields: sortFields
		}, this._loadTableData);
	},

	_updateTable: function(data) {
		if (!this.isMounted()) return;
		if (!this._checkData(data)) return;
		var data=data;
		var state={
			error: null,
			reportData: data,
			loaded: true,
		}
		//设置当前页

		var curPage=data.pageParameter.currentPageNo;
		var pageRowCount=data.pageParameter.pageRowCount;
		var totalRowCount=data.pageParameter.totalRowCount;
		if (data.pageParameter) {
			state.totalRow = totalRowCount;
			state.currentPage = curPage;
		}

		this.setState(state);
	},

	_checkData: function(reportData) {
		if (reportData.pageParameter == null) {
			this.setState({
				error: '未检索到数据',
				loaded: true
			});
			return false;
		}

		var pageIndex = reportData.pageParameter.currentPageNo - reportData.startNo;

		if (reportData.pages == null || reportData.pages.length == 0 || reportData.pages[pageIndex] == null) {

			this.setState({
				error: '未检索到数据',
				loaded: true
			});
			return false;
		} else {
			this.setState({
				error: null
			});
			return true;
		}
	},

})
