var React = require('react');
var ReportStore = require('../../../stores/ReportStore');
var MetaDataStore = require('../../../stores/MetaDataStore');
var ChartTypeStore = require('../../../stores/ChartTypeStore');
var FilterFieldsStore = require('../../../stores/FilterFieldsStore');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');
var EChartsView = require('./EChartsView');
//var FusionChartsView = require('./FusionChartsView');
var TableView = require('./TableView');
var KPIView = require('./KPIView');
//var ChartViewConfig = require('../ChartViewConfig');
var Loading = require('../Loading');
var PagerView = require('../PagerView');
var App = require('app');
/**
 * 指定Report的数据视图
 */

var preMultiAxisLineSetting = {};

module.exports = React.createClass({

	displayName: 'DataViewOfReport',

	propTypes: {
		reportId: React.PropTypes.string.isRequired,
		reportType: React.PropTypes.string,
		chartDisplaySchema: React.PropTypes.string, //Chart显示方案，可以不传，使用默认的方案（不同地方，chart显示需要调整）
		width: React.PropTypes.number, //ChartView 宽
		height: React.PropTypes.number, //ChartView 高
		pageSize: React.PropTypes.number,
		showPager: React.PropTypes.bool,
		filterFields: React.PropTypes.string,


	},

	getDefaultProps: function() {

		return {
			pageSize: 15,
			showPager: false,
			filterFields: '[]',
		}
	},

	getInitialState: function() {
		var tableConfig = [];
		if (this.props.customCellWidthArr) {
			tableConfig = JSON.parse(this.props.customCellWidthArr);
		}
		
		var reportInfo=null;
		var sortName=null;
		// var maxMin=false;
		// var sortFields=false;
		// var topParameters=false;
		var zhibaioFilter=ReportStore.initZhibiaoFilters(this.props.reportInfo);
		if(this.props.reportInfo){
			reportInfo=JSON.parse(JSON.stringify(this.props.reportInfo));
			if(reportInfo.category=="INDEX"&& zhibaioFilter.sortFields && zhibaioFilter.sortFields.length>0){
				sortName=reportInfo.sortFields[0].field;
			}
		}
		var weiduList=this.props.weiduList||[];
		if(weiduList.length>0){
			weiduList=JSON.parse(JSON.stringify(weiduList))
		}
		// if( reportInfo ){
		// 	if( reportInfo.sortFields && reportInfo.sortFields.length>0){
		// 		sortFields = reportInfo.sortFields;
		// 	}
		// 	if(reportInfo.topParameters && reportInfo.topParameters.length>0){
		// 		topParameters=reportInfo.topParameters;
		// 	}
		// 	maxMin=ReportStore.getIndexFieldsMaxMinArr(reportInfo.filterFields);
		// }
		return {
			loading: true,
			error: null, //错误信息，为空表示没有错误
			renderType: null, //渲染方式[ECHARTS,FUSIONCHARTS,TABLE]
			reportType: this.props.reportType,
			reportInfoType: null,
			reportInfo:reportInfo,
			filterFields: JSON.parse(this.props.filterFields),
			reportData: null, //报表数据
			totalRow: 1,
			currentPage: 1,
			startNo:1,
			tableConfig: tableConfig,
			
			sortIndex:-1,
			preFilterFields:[],
			kpiConfig:{},
			multiAxisLineSetting: { yAxis: [], indexs: [] },
			sortFields: zhibaioFilter.sortFields,
			topParameters:zhibaioFilter.topParameters,
			sortName:sortName,
			maxMin:zhibaioFilter.maxMin,
			Refresh:this.props.Refresh,
			weiduList:weiduList,
			columnTitleFields:[],
			rowTitleFields:[],
			sortDmType:-1,
			sortFieldsIndex:-1,
			backRow:-1,
			backCol:-1,
		}
	},

	componentWillMount: function() {
		var _t=this;
		ReportStore.getKPIOptionReport({
    		"resourceId": this.props.reportId,
			"key": "KPISetting"
    	}).then(function(kpiData){
        	_t._loadData(true);
        	if (kpiData && kpiData.dataObject && kpiData.dataObject.extend) {
        		var _obj;
        		_obj=JSON.parse(kpiData.dataObject.extend);
    			_t.setState({
	            	kpiConfig:_obj
	            });
        	}

    	});
		ReportStore.getExtends({
			"resourceId": this.props.reportId,
			"key": "MultiAxisLineSetting"
		}).then(function (setting) {
			_t._loadData(true);
			if (setting && setting.dataObject && setting.dataObject.extend) {
				var _obj;
				_obj = JSON.parse(setting.dataObject.extend);
				_t.setState({
					multiAxisLineSetting: _obj
				});
			}

		});
	},
	componentDidMount: function() {
		//指标排序 
        App.on('APP-REPORT-SET-ZHIBIAO-SORT', this._setSortFields);
        // 最大最小值 
        App.on('APP-REPORT-SET-ZHIBIAO-MAXMIN', this._setSortMaxMin);
        // topn 
        App.on('APP-REPORT-SET-ZHIBIAO-TOPN', this._setSortTopn);
        // 图形 清空筛选 
        App.on('APP-EMPTY-ZHIBIAO-FILTER', this._emptyZhibaioFilter);

		//App.on('APP-REPORT-SET-NOPAIXU',this._setSortParams);

		//表格清空筛选 不包括排序
		App.on('APP-REPORT-SET-NOPFILTER',this._setNoFilter);

		App.on('APP-REPORT-SET-FILTER-LOADING',this._setLoading);
	},
	componentWillReceiveProps: function(nextProps) {
		var state = {};
		var changed = false;
		if(nextProps.Refresh){
			changed = true
		}
		if (("" == this.state.reportInfo) || (undefined == this.state.reportInfo)) {
			changed = true;
		}
		if (("" != state.reportInfo) && (undefined != state.reportInfo)) {
			state.reportInfoType = nextProps.reportInfo.type;
		}

        if (this.props.defaultFilterFileds) {
        	changed = true;
        }

		if (nextProps.filterFields != this.props.filterFields) {
			state.filterFields = JSON.parse(nextProps.filterFields || '[]');
			changed = true;
		}
		if (JSON.stringify(nextProps.rowTitleFields) != JSON.stringify(this.props.rowTitleFields)) {
			changed = true;
		}

		//全局筛选
		if(nextProps.globalFilterSign){
			if (nextProps.filterFields != this.props.filterFields) {
				state.filterFields = JSON.parse(nextProps.filterFields || '[]');
				changed = true;
			}

		}
		if (nextProps.reportType !== this.props.reportType) {
			state.reportType = nextProps.reportType;
			changed = true;
		}
		if (nextProps.customCellWidthArr != this.props.customCellWidthArr) {
			var tableConfig = [];
			if (nextProps.customCellWidthArr) {
				tableConfig = JSON.parse(nextProps.customCellWidthArr);
			}
			state.tableConfig = tableConfig;
			changed = true;
		}
		if(nextProps.width!=this.props.width||nextProps.height!=this.props.height){
			changed = true;
		}

		if(!nextProps.globalFilterSign && nextProps.weiduList && JSON.stringify(nextProps.weiduList)!=JSON.stringify(this.state.weiduList)){
			changed = true;
		}
		if(nextProps.reportInfo&&nextProps.reportInfo.compare){
			if(JSON.stringify(nextProps.reportInfo.compareInfo)!=JSON.stringify(this.state.reportInfo.compareInfo)){
				state.reportInfo = nextProps.reportInfo;
				changed = true;
			}
		}
		if (changed){
			state.weiduList=nextProps.weiduList ? JSON.parse(JSON.stringify(nextProps.weiduList)) : [];
			this.setState(state, this._loadData);
		}
	},

	render: function() {
		if (this.state.loading) {
			return <div className="loadingBox"><Loading/></div>
		}
		if (this.state.error) {
			return this._renderError();
		}
		if (this.state.renderType == 'ECHARTS') {
			//var config = ChartViewConfig.getConfig(this.state.reportType);
			return <EChartsView
						reportType={this.state.reportType}
						reportData={this.state.reportData}
						chartDisplaySchema={this.props.chartDisplaySchema}
						width={this.props.width}
						height={this.props.height}
						globalFilterFields={this.props.globalFilterFields}
						multiAxisLineSetting = {this.state.multiAxisLineSetting}
						reportInfo={this.state.reportInfo}
						row={this.props.row}
                      	col={this.props.col}
                      	sortTopParam={this.state.sortTopParam}
						indexFields={this.state.indexFields}
						weiduList={this.state.weiduList}
						columnTitleFields={this.state.columnTitleFields}
						rowTitleFields={this.state.rowTitleFields}
						drilDownFilter={this.props.drilDownFilter}
						compare={this.state.compare}
						compareData={this.state.compareData}
						sortFields={this.state.sortFields}
						topParameters={this.state.topParameters}
						maxMin={this.state.maxMin}/>

		} else if (this.state.renderType == 'TABLE') {
			var compare=false;
			if(this.state.reportInfo && this.state.reportInfo.compare!=null){
				compare=this.state.reportInfo.compare;
			}
			return (
				<div className="table-view">
					<TableView
					tableConfig={this.state.tableConfig}
					reportData={this.state.reportData}
					totalRow={this.state.totalRow}
					currentPage={this.state.currentPage}
					startNo={this.state.startNo}
					tables={this.props.tables}
					sortIndex={this.state.sortIndex}
					pathname={this.props.pathname}
					row={this.props.row}
					col={this.props.col}
					setSortParams={this._setSortParams}
					listRightNoSort={this.props.listRightNoSort}
					globalFilterFields={this.props.globalFilterFields}
					topParameters={this.state.topParameters}
					maxMin={this.state.maxMin}
					setzhibiaoTop={this._setSortTopn}
					setZhibiaoState={this._setSortMaxMin}
					sortName={this.state.sortName}
					weiduList={this.state.weiduList}
					columnTitleFields={this.state.columnTitleFields}
					rowTitleFields={this.state.rowTitleFields}
					drilDownFilter={this.props.drilDownFilter}
					height={this.props.height}
					sortFieldsIndex={this.state.sortFieldsIndex}
					compare={compare}/>

					{this._renderPagerView()}
				</div>
			)
		}else if (this.state.renderType =='KPI') {

			 return (
					<div className="table-view">
						<KPIView
							width={this.props.width}
							reportData={this.state.reportData}
							kpiConfig={this.state.kpiConfig}
						/>
					</div>
				)

		};
		return null;

	},

	_renderPagerView: function() { //显示分页与否的方法
		if (this.props.showPager) {
			return (
				<div className="table-page">
					<PagerView totalRow={this.state.totalRow}
					 width={this.props.width+48}
					  currentPage={this.state.currentPage} pageSize={this.props.pageSize} onPageTo={this._onPageToHandler} ></PagerView>
                </div>
			)
		}
	},

	_renderError: function() {
		return <div className="cubi-error noGetReportError">{this.state.error}</div>
	},

	_handleError(err) {

		if (!this.isMounted()) return;

		this.setState({
			error: err,
			loading: false,
		});
	},

	_loadData: function(start) {
		this.setState({
			loading: true,
			error: null
		});
		this._getReportType(start)
			.then(this._loadReportData)
			.then(this._compelete)
			.then(this._handleError)
	},

	_getReportType: function(start) {

		var reportId = this.props.reportId;
		var reportType = this.state.reportType;
		var reportInfoType = this.state.reportInfoType;
		var _this=this;
		if ((null == reportType) || ("" == reportType)) {
			if (null != this.state.reportInfo) {
				reportType = this.state.reportInfo.type;
			}
		}
		if ((null == reportInfoType) || ("" == reportInfoType)) {
			if (null != this.state.reportInfo) {
				reportInfoType = this.state.reportInfo.type;
			}
		}

		return new Promise(function(resolve, reject) {

			ReportStore.getAreaInfo(reportId).then(function(result) {
				if (result.success) {
					var weiduList=_this.state.weiduList;
					//var filterObj=FilterFieldsStore.setReportFilterToDashboard(_this.props.drilDownFilter,result.dataObject.filterFields,_this.state.filterFields);
					var dashboardFilter=_this.state.filterFields// filterObj.filterFields;
		            var sortTopParam=ReportStore.initZhibiaoFilters(result.dataObject);
					
					// var indexFields=result.dataObject.indexFields;
					//分析右侧缩略图 和交叉表 需要获取立方信息用来格式化日期
					//if(_this.props.listRightNoSort || reportType=="CROSS"){
						MetaDataStore.getMetaData(result.dataObject.metadataId).then(function(metadata) {
		                    result.dataObject.metadataColumns = metadata;
		                    var state=ReportStore.setReportState(result);
		                    var stateObj={
								type:result.dataObject.type,
								weiduList:weiduList,
								columnTitleFields:state.columnTitleFieldsList,
								rowTitleFields:state.rowTitleFieldsList,
								filterFields:dashboardFilter,
								sortTopParam:sortTopParam,
								indexFields:state.zhiBiaoList,
								start:start,
								compare:result.dataObject.compare,
								compareData:result.dataObject.compareInfo ? result.dataObject.compareInfo.compareDimension : [],
							}
		                    if(_this.props.listRightNoSort){
		                    	stateObj.weiduList=state.weiduList;
		                    	
		                    }
							return resolve(stateObj);
			            })
		     //        }else{
		     //        	console.log(3456)
		     //        	return resolve({
							// 	type:reportType,
							// 	weiduList:weiduList,
							// 	filterFields:dashboardFilter,
							// 	sortTopParam:sortTopParam,
							// 	indexFields:indexFields,
							// 	start:start,
							// 	compare:result.dataObject.compare,
							// 	compareData:result.dataObject.compareInfo.compareDimension,
							// });
		     //        }

				} else {
					return reject(result.message);
				}
			}, function(error) {
				return reject(error);
			});

		})
	},

	_loadReportData: function(report) {
		if (!this.isMounted()) return;
		var reportType=report.type;
		var weiduList=report.weiduList;
		var rowTitleFields=report.rowTitleFields;
		var columnTitleFields=report.columnTitleFields;
		this.setState({
			reportType: reportType,
		});
		if (true == ChartTypeStore.isChartType(reportType)) {
			return this._loadEChartData(report);
		}
		else if (true == ChartTypeStore.isIndexType(reportType)) {
			return this._loadTableData(report);
		}
		else if (true == ChartTypeStore.isKPIType(reportType)) {
			return this._loadKPIData();
		}
		else {
			console.warn('不支持报表类型：', reportType);
			return Promise.reject('不支持报表类型：' + reportType);
		}
	},

	_loadEChartData: function(report) {

		var parameters = {
			"areaParameters": {
				"actionType": null,
				"preview": false,
				"width": "100%",
				"height": "100%",
				"changeChartAllowed": true,
				"timeAxisUsed": true,
				"filterFields": this.state.filterFields,
				"chartType": null,

			}
		};
		if (("" != this.state.reportInfo) && (undefined != this.state.reportInfo) && (this.state.reportInfo.type != this.state.reportType)) {
			// 驾驶舱图形切换特殊处理
			return this._loadEChartDataByAreaInfo(parameters);
		}

		if(this.state.reportInfo){
			parameters.areaInfo = this.state.reportInfo;
			parameters = ReportStore.delTopParameters(parameters);
			if(this.props.rowTitleFields){
				parameters.areaInfo.categoryFields=this.props.rowTitleFields;
			}
			//设置指标筛选
			//parameters=ReportStore.setZhiBiaoFilterFields(parameters,this.state.sortFields,this.state.topParameters,this.state.maxMin,true);

			return ReportStore.getAreaByAreaInfo(parameters).then(
				function(result) {
					if (result.success) {
						return {
							renderType: 'ECHARTS',
							reportData: result.dataObject,
							weiduList:report.weiduList,
							rowTitleFields:report.rowTitleFields,
							columnTitleFields:report.columnTitleFields,
							//sortTopParam:report.sortTopParam,
							indexFields:report.indexFields,
							compare:report.compare,
							compareData:report.compareData,
						};
						return true;
					}
					else {
						return Promise.reject(result.message);
					}
				}
			);
		}
		return ReportStore.getArea(this.props.reportId, parameters).then(function(result) {
			if (result.success) {
				// if(result.dataObject.type=="ScrollColumn2D"){
				// 	return ReportStore.getAreaInfo(result.dataObject.id).then(function(data) {

				// 			var sortTopParam=ReportStore.setIndexParam2(data);
				// 			var indexFields=data.dataObject.indexFields;
				// 			return {
				// 				renderType: 'ECHARTS',
				// 				reportData: result.dataObject,
				// 				sortTopParam:sortTopParam,
				// 				indexFields:indexFields,
				// 				weiduList:weiduList,
				// 				rowTitleFields:rowTitleFields,
				// 				columnTitleFields:  columnTitleFields
				// 			};
				// 		});
				// }
				return {
					renderType: 'ECHARTS',
					reportData: result.dataObject,
					//weiduList:weiduList,
					sortTopParam:report.sortTopParam,
					indexFields:report.indexFields,
					weiduList:report.weiduList,
					rowTitleFields:report.rowTitleFields,
					columnTitleFields:report.columnTitleFields,
					compare:report.compare,
					compareData:report.compareData,

				};
				return true;
			} else {
				return Promise.reject(result.message);
			}
		});

	},

	/**
	 * 驾驶舱图形切换时，判断是否满足维度数、指标数限制，如果超过舍弃多余维度、指标
	 */
	_loadEChartDataByAreaInfo: function(param) {

		var reportInfo  = JSON.parse(JSON.stringify(this.state.reportInfo));
		var paramLength = ChartTypeStore.getLength(this.state.reportType);

		if (("" != paramLength.weiduLen) && (paramLength.weiduLen < reportInfo.categoryFields.length)) {
			var categoryFields = reportInfo.categoryFields.slice(0, paramLength.weiduLen);
			reportInfo.categoryFields = categoryFields;
		}
		if (("" != paramLength.zhibiaoLen) && (paramLength.zhibiaoLen < reportInfo.indexFields.length)) {
			var indexFields = reportInfo.indexFields.slice(0, paramLength.zhibiaoLen);
			reportInfo.indexFields = indexFields;
		}

		param.areaInfo = reportInfo;
		return ReportStore.getAreaByAreaInfo(param).then(
			function(result) {
				if (result.success) {
					return {
						renderType: 'ECHARTS',
						reportData: result.dataObject
					};
					return true;
				}
				else {
					return Promise.reject(result.message);
				}
			}
		);
	},
	_loadTableData: function(report) {
		var tableConfig = this.state.tableConfig;
		var reportInfo = this.state.reportInfo;
		function getColumnAttributes() {
			var attrs = [];

			var indexNames = {};
			if (reportInfo) {
				// 整理指标列信息
				for (var counter = 0; counter < reportInfo.indexFields.length; counter++) {
					indexNames[reportInfo.indexFields[counter].name] = true;
				}
			}

			for (var i = 0; i < tableConfig.length; i++) {
				var item = tableConfig[i];
				if (indexNames[item.name]) {
					// XuWenyue： 驾驶舱隐藏列时，指标列改由前端隐藏
					continue;
				}
				if (item.defaultValue == 0) {
					attrs.push({
						'name': item.name,
						'hide': true,
					})
				}
			};
			return attrs;
		}

		// var filterFields=report.filterFields;
	 // 	filterFields=FilterFieldsStore.setMaxMinFilter(filterFields,this.state.maxMin);
		// var sortFields = this.state.sortFields
		// if(!this.state.sortFields){
		// 	sortFields = []
		// }
		var parameters = {
			"areaParameters": {
				"actionType": null,
				"preview": false,
				"width": "100%",
				"height": "100%",
				"changeChartAllowed": true,
				"timeAxisUsed": true,
				"filterFields": this.state.filterFields||[],
				"chartType": null,
				'columnAttributes': getColumnAttributes(),
				"pageParameter": {
					"pageRowCount": this.props.pageSize,
					"currentPageNo": this.state.currentPage,
				},
				"sortParameters":[],
			}
		};

		if(this.state.reportInfo){
			parameters.areaInfo = this.state.reportInfo;
			// //topn 参数
			// if(this.state.topParameters){
			// 	parameters.areaInfo.topParameters=this.state.topParameters;
			// }else{
			// 	if(parameters.areaInfo.topParameters){
			// 		delete parameters.areaInfo.topParameters
			// 	}
			// }
			// //排序
			// if(this.state.sortFields){
			// 	parameters.areaInfo.sortFields=this.state.sortFields;
			// }
			//设置指标筛选
			parameters=ReportStore.setZhiBiaoFilterFields(parameters,this.state.sortFields,this.state.topParameters,this.state.maxMin,true);

			if(this.props.rowTitleFields){
				parameters.areaInfo.rowTitleFields=this.props.rowTitleFields;
			}
			//指标排序筛选改变 Type
			var maxMin = this.state.maxMin;
			var topParameters = this.state.topParameters;
			var indexFields = this.state.reportInfo.indexFields;
			var sortFields = this.state.sortFields;
			var reportType = this.state.reportType;
			var newtype = ReportStore.setNewtype( reportType, indexFields, sortFields,topParameters,maxMin,true)
			// 指标时修改显示汇总
			if((newtype.isZhibiao && this.state.reportType=="TREE") || sortFields || maxMin || topParameters){
				ReportStore.zhibiaoSortSetFormulas(parameters.areaInfo.formulas,this.state.sortFields);
			}
			var _this = this;
		 	parameters.areaInfo.type=newtype.type;
			return ReportStore.getAreaByAreaInfo(parameters).then(
				function(result) {
					if (result.success) {
						var FieldsIndex =ReportStore.setsortFieldsIndex(result.dataObject.fields);
						_this.setState({
							sortFieldsIndex:FieldsIndex
						})
						return {
							renderType: 'TABLE',
							reportData: result.dataObject,
							totalRow: result.dataObject.pageParameter.totalRowCount,
							currentPage: result.dataObject.pageParameter.currentPageNo,
							startNo:result.dataObject.startNo,
							weiduList:report.weiduList,
							rowTitleFields:report.rowTitleFields,
							columnTitleFields:report.columnTitleFields,
						};
					}
					else {
						return Promise.reject(result.message);
					}
				}
			);
		}

		return ReportStore.getArea(this.props.reportId, parameters).then(function(result) {
			if (result.success) {
				return {
					renderType: 'TABLE',
					reportData: result.dataObject,
					totalRow: result.dataObject.pageParameter.totalRowCount,
					currentPage: result.dataObject.pageParameter.currentPageNo,
					startNo:result.dataObject.startNo,
					weiduList:report.weiduList,
					rowTitleFields:report.rowTitleFields,
					columnTitleFields:report.columnTitleFields
				};

			} else {
				return Promise.reject(result.message);
			}
		});

	},
	_loadKPIData: function() {

		var tableConfig = this.state.tableConfig;
		var reportInfo = this.state.reportInfo;

		function getColumnAttributes() {
			var attrs = [];

			var indexNames = {};
			if (reportInfo) {
				// 整理指标列信息
				for (var counter = 0; counter < reportInfo.indexFields.length; counter++) {
					indexNames[reportInfo.indexFields[counter].name] = true;
				}
			}

			for (var i = 0; i < tableConfig.length; i++) {
				var item = tableConfig[i];
				if (indexNames[item.name]) {
					// XuWenyue： 驾驶舱隐藏列时，指标列改由前端隐藏
					continue;
				}
				if (item.defaultValue == 0) {
					attrs.push({
						'name': item.name,
						'hide': true,
					})
				}
			};
			return attrs;
		}

		var filterFields=this.state.filterFields;

		var parameters = {
			"areaParameters": {
				"actionType": null,
				"preview": false,
				"width": "100%",
				"height": "100%",
				"changeChartAllowed": true,
				"timeAxisUsed": true,
				"filterFields": filterFields,
				"chartType": null,
				'columnAttributes': getColumnAttributes(),
				"pageParameter": {
					"pageRowCount": this.props.pageSize,
					"currentPageNo": this.state.currentPage,
				},
			}
		};
		if(this.state.reportInfo){
			parameters.areaInfo = this.state.reportInfo;
			return ReportStore.getAreaByAreaInfo(parameters).then(
				function(result) {
					if (result.success) {
						return {
							renderType: 'KPI',
							reportData: result.dataObject,
						};
					}
					else {
						return Promise.reject(result.message);
					}
				}
			);
		}

		return ReportStore.getArea(this.props.reportId, parameters).then(function(result) {
			if (result.success) {
				return {
					renderType: 'KPI',
					reportData: result.dataObject,
				};

			} else {
				return Promise.reject(result.message);
			}
		});

	},
	_compelete: function(state) {
		if (!this.isMounted()) return;
		state.loading = false;
		//右侧缩略图初始化指标筛选信息
		if(this.props.listRightNoSort && state.sortTopParam){
			state.sortFields=state.sortTopParam.sortFields;
	    	state.topParameters=state.sortTopParam.topParameters;
	    	state.maxMin=state.sortTopParam.maxMin;
		}
		this.setState(state);
	},

	_onPageToHandler: function(page) {
		this.setState({
			currentPage: page,
		}, this._loadData);
	},
	// _setSortParams:function(params){
	// 	var sortFields = params.sortFields
	// 	if(params.sortName == null ){
	// 		sortFields = params.sortParam.sortFields
	// 	}
	// 	if (!this.isMounted()) return;
	// 	if(params.row ==  this.props.row && params.col == this.props.col){
	// 		this.setState({
	// 			currentPage: 1,
	// 			sortFields:sortFields,
	// 			sortDmType:params.dmType,
	// 			sortIndex:params.index,
	// 			sortName:params.sortName,
	// 			backRow:params.row,
	//             backCol:params.col
	// 		}, this._loadData);
	// 	}
	//},
	// _setzhibiaoTop:function(params){
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		currentPage: 1,
	// 		topParameters:params.topParameters,
	// 		maxMin:false,
	// 		// zhibiaoMax:false,
	// 		// zhibiaoMin:false,
	// 		//maxMinName:'',
	// 	}, this._loadData);
	// },
	// _setZhibiaoState:function(params){
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		currentPage: 1,
	// 		topParameters:false,
	// 		// zhibiaoMax:maxMin.max,
	// 		// zhibiaoMin:maxMin.min,
	// 		// maxMinName:maxMin.name,
	// 		maxMin:params.maxMin
	// 	}, this._loadData);

	// },
	// _getMaxMin:function(filterFields){
	// 	var o={};
	// 	for(var i=0;i<filterFields.length;i++){
	// 		if(filterFields[i].type=="INDEX_FIELD"){
	// 			if(filterFields[i].operator[0]=="GE"){
	// 				o.min=filterFields[i].value[0];
	// 				o.name=filterFields[i].name;
	// 			}else{
	// 				o.max=filterFields[i].value[0];
	// 			}
	// 		}
	// 	}
	// 	return o;
	// },
	// _getMaxMin:function(reportInfo){
	// 	var maxMin=[];
	// 	if(reportInfo){
	// 		var filterFields=reportInfo.filterFields;
	// 		for(var i=0;i<filterFields.length;i++){
	// 			if(filterFields[i].type=="INDEX_FIELD"){
	// 				maxMin.push(filterFields[i])
	// 			}
	// 		}
	// 	}

	// 	return maxMin;
	// },
	// _setMaxMinFilter:function(filterFields){
	// 	for(var i=0;i<filterFields.length;){
	// 			if(filterFields[i].type=="INDEX_FIELD"){
	// 				filterFields.splice(i,1);
	// 			}else{
	// 				i++
	// 			}
	// 		}
	// 		var maxMin = this.state.maxMin
	// 		if(!this.state.maxMin){
	// 			 maxMin = []
	// 		}
	// 		var filterFields=filterFields.concat(maxMin);
	// 		return filterFields;
	// },
	_setNoFilter:function(arg){
		if (!this.isMounted()) return;
		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
				currentPage: 1,
				topParameters:false,
				// zhibiaoMax:false,
				// zhibiaoMin:false,
				//maxMinName:'',
				maxMin:false
			}, this._loadData);
		}

	},
	_setLoading:function(arg){
		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
				loading:arg.loading
			});
		}
	},
	//指标排序 图形 表格
	_setSortFields:function(arg){
		if (!this.isMounted()) return;
		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
			   currentPage: 1,
	           sortFields:arg.sortFields,
	           sortDmType:arg.dmType,
				sortIndex:arg.index,
				sortName:arg.sortName,
				backRow:arg.row,
	            backCol:arg.col
	        }, this._loadData);
		}
   },
   // 最大最小值 图形 表格
   _setSortMaxMin:function(arg){
   		if (!this.isMounted()) return;
   		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
			   currentPage: 1,
	           maxMin:arg.maxMin,
	           topParameters:false
	        }, this._loadData);
		}
   },
   //topn 图形 表格
   _setSortTopn:function(arg){
   		if (!this.isMounted()) return;
	   	if(arg.row==this.props.row && arg.col==this.props.col){
	        this.setState({
	        currentPage: 1,
	           topParameters:arg.topParameters,
	           maxMin:false
	        }, this._loadData);
	    }
   },
   // 清空指标筛选 图形
   _emptyZhibaioFilter:function(arg){
   		if (!this.isMounted()) return;
	   	if(arg.row==this.props.row && arg.col==this.props.col){
	   		this.setState({
	   		currentPage: 1,
	           topParameters:false,
	           sortFields:false,
	           maxMin:false,
	        }, this._loadData);
	   	}
        
    },
});
