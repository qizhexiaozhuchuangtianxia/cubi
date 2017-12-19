var $ = require('jquery');
var React          = require('react');
var App            = require('app');
var Loading        = require('../common/Loading');
var TableView      = require('../common/TableView');
var DimensionStore = require('../../stores/DimensionStore');
var ReportStore    = require('../../stores/ReportStore');

module.exports = React.createClass({
	displayName: 'DimensionDetailsItem',
	app: {},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getDefaultProps: function () {
		return {}
	},

	getInitialState: function () {
		return {
			data: null,
			dataLength: 0,
			pageSize: 40,
			sliceSize: 20,
			currentPage: 0,
			totalRowCount: 1,
			sliceIndex: 1,
			loading: true,
		}
	},

	componentWillMount: function () {
		$('.loading-text-box').hide();
		$('.loading-last-text').hide();
		this.app['APP-CREATE-REPORT-GO-BACK-HANDLE'] = App.on('APP-CREATE-REPORT-GO-BACK-HANDLE', this._goBackHandle);
		//移除头部
		App.emit('APP-COMMANDS-REMOVE');
		var currentName = [{name: '查看维度', id: null,}];
		App.emit('APP-HEADER-NAV-HANDLE', currentName);//设置头部
		//显示返回按钮
		App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
			toggle: true,
			func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
		});

		this._init();
		var _this = this;
		DimensionStore._init();

		this._getDimensionObject(this.props.dimensionId).then(function (data) {
			_this._fields = data['fileds'];
			_this._getDimensionData2(_this.props.dimensionId, true);
		});
	},

	componentWillReceiveProps: function () {
		$('.loading-text-box').hide();
		$('.loading-last-text').hide();
		var _this = this;
		this._getDimensionObject(this.props.dimensionId).then(function (data) {
			_this._fields = data['fileds'];
			_this._getDimensionData2(_this.props.dimensionId, true);
		});

		this._scrollBar();
	},

	_fields: [],

	componentDidMount: function () {
		this._scrollBar();
	},

	componentDidUpdate: function () {
		this._scrollBar();
		//显示返回按钮
		App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
			toggle: true,
			func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
		});

	},

	componentWillUnmount: function () {
	},

	render: function () {

		if (this.state.error) {
			return (
				<div className="tableShowScroll">
					<div className="table-view">
						<div className="table-context  min-table-content" ref="table-context">
							<div className="cubi-error noGetReportError">
								{this.state.error}
							</div>
						</div>
					</div>
				</div>
			);
		}

		var reportViewData = null;
		if (this.dataObject && this.dataObject.pages.length > 0) {
			reportViewData = DimensionStore.getTableViewData(this.state, this._reportData, this.dataObject);
		}

		if (reportViewData) {
			return (
				<div className="detailsBox">
					<div className="detailsScroll">
						<div className="detailsView">
							<div className="details">
								<div className="dimensionText">
									<div className="dimensionName">
										{this.props.dimensionName}
									</div>
								</div>
								<TableView
									pageSize={this.state.pageSize}
									sliceSize={this.state.sliceSize}
									showPager={false}
									reportData={reportViewData}
									dimesion={true}/>
								{this._loadingMeassage()}
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="detailsBox">
					<div className="detailsScroll">
						<div className="detailsView">
							<div className="details">
								<Loading/>
							</div>
						</div>
					</div>
				</div>
			)
		}
	},

	_init: function () {
		this._rows = [];
		this._cells = [];
		this.dataObject = null;
	},

	_getDimensionObject: function (id) {
		return DimensionStore.getDimensionObject(id).then(function (data) {
			if (data.success) {
				return Promise.resolve(DimensionStore.setDimensionObject(data.dataObject));
			} else {
				return Promise.reject(data.message);
			}
		});
	},

	_getDimensionData2: function (id, start) {
		var _this = this;
		DimensionStore.getDimensionData(id).then(function (result) {
			var dataLength = 0;
			if (result.success) {

				_this.dataObject = DimensionStore.loopTree(result.dataObject, _this._fields);
				dataLength = _this.dataObject.pages[0].rows.length;
				_this._reportData = DimensionStore.setReportViewData(_this.dataObject);
				if (start) {
					_this._setReoprtFirstData();
				} else {
					_this._setReoprtPageData(currentPage);
				}
			}
			else {
				_this.setState({
					error: result.message
				});
				return;
			}
			_this.setState({
				data: _this.dataObject,
				dataLength: dataLength
			});
		})
	},

	_loadingMeassage: function () {
		return <div className="report-loading-box">
			<div className="loading-text-box">
				<div className="loading-icon">
					<Loading/>
				</div>
				<div className="loading-text">加载中...</div>
			</div>
			<div className="loading-last-text">您已经看完了所有数据</div>
		</div>

	},

	_goBackHandle: function () {
		this.context.router.push({
			pathname: '/dimension/list',
		});
	},

	_scrollBar: function () {//滚动条方法
		var _this = this;
		if (_this.state.dataLength > 0) {
			$(".detailsScroll").mCustomScrollbar({
				axis: "y",
				theme: "minimal-dark",
				scrollInertia: 500,
				autoExpandScrollbar: true,
				advanced: {
					autoExpandHorizontalScroll: false
				},
				callbacks: {
					onTotalScroll: function () {
						_this._scrollOnPageTo();
					}
				}
			});
		}
	},

	_scrollOnPageTo: function () {
		if (this.state.sliceIndex < this.state.totalRowCount / this.state.sliceSize) {
			$('.loading-text-box').show();
			var pageSize = this.state.pageSize,
				totalRowCount = this.state.totalRowCount,
				sliceIndex = this.state.sliceIndex,
				sliceSize = this.state.sliceSize;
			if ((pageSize < totalRowCount) && (sliceIndex * sliceSize < totalRowCount) && (sliceIndex * sliceSize >= this._reportData.length)) {
				this._getDimensionData2(this.props.dimensionId);

			} else {
				this._setReoprtPageData();
			}
		} else {
			$('.loading-text-box').hide();
			$('.loading-last-text').show();
		}
	},

	dataObject: null,
	_reportData: [],

	_setReoprtFirstData: function () {
		var error = false;
		if ((this.dataObject) && (0 == this.dataObject.pages.length)) {
			error = '未检索到数据';
		}
		this.setState({
			loading: false,
			currentPage: 1,
			totalRowCount: this.dataObject.pageParameter.totalRowCount,
			sliceIndex: 1,
			error: error
		});
		$('.loading-text-box').hide();
		$('.loading-last-text').hide();
	},

	_setReoprtPageData: function (currentPage) {
		var _this = this;

		setTimeout(function () {
			_this.setState(function (prevState) {
				prevState.sliceIndex = prevState.sliceIndex + 1;
				if (currentPage) {
					prevState.currentPage = prevState.currentPage + 1;
				}
				return prevState;
			});
			$('.loading-text-box').hide();
		}, 300);
	},
});