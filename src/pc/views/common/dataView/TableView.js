var React = require('react');
var $ = require('jquery');
var RenderTable=require('../table/RenderTable');
require('../jQueryTable');

// var {
// 	IndexArea
// } = require('../GetTable');


module.exports = React.createClass({

	displayName: 'TableViewV2',

	propTypes: {
		reportData: React.PropTypes.object.isRequired, //报表数据
	},

	getInitialState: function() {
		return {

			error: null,
		};
	},

	componentWillMount: function() {
		this._checkData(this.props.reportData);
	},

	componentWillReceiveProps: function(nextProps) {
		this._checkData(nextProps.reportData);
	},

	// shouldComponentUpdate: function(nextProps) {
	// 	return nextProps.reportData != this.props.reportData;

	// },

	render: function() {
		var content = null;
		var cls = 'table-context';
		if (this.state.error) {
			cls = 'table-context min-table-content';
			content = <div className="cubi-error getReportNullError">{this.state.error}</div>
		} else {
			content = <div className="table-gundong">
						<div ref="table-container" className="table-container">
							<RenderTable
								data={this.props.reportData}
								tableConfig={this.props.tableConfig}
								totalRow={this.props.totalRow}
								currentPage={this.props.currentPage}
								tables={this.props.tables}
								startNo={this.props.startNo}
								sortIndex={this.props.sortIndex}
								isDashboardTable={true}
								pathname={this.props.pathname}
								row={this.props.row}
								col={this.props.col}
								setSortParams={this.props.setSortParams}
								listRightNoSort={this.props.listRightNoSort}
								setZhibiaoState={this.props.setZhibiaoState}
								topParameters={this.props.topParameters}
								zhibiaoMinMax={this.props.maxMin}
								setzhibiaoTop={this.props.setzhibiaoTop}
								sortName={this.props.sortName}
								weiduList={this.props.weiduList}
								columnTitleFields={this.props.columnTitleFields}
								rowTitleFields={this.props.rowTitleFields}
								drilDownFilter={this.props.drilDownFilter}
								height={this.props.height}
								sortFieldsIndex={this.props.sortFieldsIndex}
								compare={this.props.compare}/>
						</div>
					</div>
		}
		return (
			<div className={cls} ref="table-context">
				{content}
			</div>
		)
	},

	_checkData: function(reportData) {
		if (reportData.pageParameter == null || reportData.pageParameter.totalRowCount==0) {
			this.setState({
				error: '未检索到数据'
			});
			return;
		}

		var pageIndex = reportData.pageParameter.currentPageNo - reportData.startNo;

		if (reportData.pages == null || reportData.pages.length == 0 || reportData.pages[0] == null) {
			//console.log(reportData.pages ,reportData.pages.length,reportData.pages[pageIndex],'0reportData.pages[pageIndex]')
			this.setState({
				error: '未检索到数据'
			});
		} else {
			this.setState({
				error: null
			});
		}
	},

});

var ScrollTable = React.createClass({

	displayName: 'ScrollTable',

	propTypes: {
		data: React.PropTypes.object.isRequired,
	},

	getInitialState: function() {
		return {
			data: this.props.data
		}
	},

	componentDidMount: function() {
		//this._setTable();
		this._scrollBar();
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			data: nextProps.data,
		}, this._setTable);
	},

	_setTable: function() {
		// var container = this.refs['table-container'];
		// $(container).dataTable(this.state.data,{tableConfig:this.props.tableConfig});
		// this._scrollBar();
	},

	_scrollBar: function() {
		if (!this.isMounted()) return;
		//滚动条方法
		$(ReactDOM.findDOMNode(this)).mCustomScrollbar({
			axis: "x",
			theme: "minimal-dark",
			autoExpandScrollbar: true,
			advanced: {
				autoExpandHorizontalScroll: true
			}
		})
	},

	render: function() {
		return (
			<div className="table-gundong">
				<div ref="table-container" className="table-container">
					<RenderTable
						data={this.state.data}
						totalRow={this.state.totalRow}
						currentPage={this.state.currentPage}
						pageSize={this.state.pageSize} />
				</div>
			</div>
		)
	}
});
