/**
 * ChartView报表图形
 */
var $ = require('jquery');
var React = require('react');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var CompareStore = require('../../stores/CompareStore');
var Loading = require('./Loading');
var ECharts = require('echarts');
var ChartZhibiaoSort = require('../common/ChartZhibiaoSort');
var ChartZhibiaoFilterMinMax = require('../common/ChartZhibiaoFilterMinMax');
var ChartZhibiaoFilterTop = require('../common/ChartZhibiaoFilterTop');
var ChartViewFixData= require('./ChartViewFixData');
var EChartManagerTable = require('./echarts/EChartManagerTable');

var preMultiAxisLineSetting = {};

module.exports = React.createClass({

	displayName: 'ChartView',

	propTypes: {
		config: React.PropTypes.object, //FusionCharts配置
		reportType: React.PropTypes.string,
		params: React.PropTypes.string, //FusionCharts数据
		chartDisplaySchema: React.PropTypes.string, //Chart显示方案，可以不传，使用默认的方案（不同地方，chart显示需要调整）
		width: React.PropTypes.number, //ChartView 宽
		height: React.PropTypes.number, //ChartView 高
	},
	app: {},
	getInitialState: function() {

		// var sortFields = false;
		//var topParameters = false;
		//var maxMin = false;
		var topNumber = '84'
		if (this.props.reportType == 'ScrollColumn2D' || this.props.drilDownFilter.length>1 ) {
			topNumber = (this.props.drilDownFilter.length*21)+84
		}else if(this.props.drilDownFilter.length == 1 ){
			topNumber ='105'
		}

		//if (this.props.sortTopParam) {
			//maxMin = this.props.sortTopParam.maxMin;
			//sortFields = this.props.sortTopParam.sortFields;
			//topParameters = this.props.sortTopParam.topParameters;
		//}
		var isClickCompareObj=CompareStore.isClickCompare(this.props.compareData,this.props.compare,false,false);
		var indexFields=this.props.zhiBiaoList;
		if(this.props.compare){
			indexFields=CompareStore.setChartCompareIndex(isClickCompareObj.selectedCompare,this.props.zhiBiaoList);
		}
		return {
			error: null,
			loaded: false,
			showChar: false,
			sortOpen: false,
			maxOpen: false,
			topOpen: false,
			indexFields: indexFields,
			minMaxIndexFields: [],
			topIndexFields: [],
			sortIndexFields: [],
			sortFields: this.props.sortFields,
			topParameters: this.props.topParameters,
			maxMin: this.props.maxMin,
			sortTopParam:this.props.sortTopParam,
			topNumber:topNumber,
			compareData:App.deepClone(this.props.compareData),
			compare:this.props.compare,
			selectedCompare:isClickCompareObj.selectedCompare,
			isClickCompare:isClickCompareObj.isClickCompare,
			zhiBiaoList:this.props.zhiBiaoList,
			maxMinFilter:[]
		};
	},

	getDefaultProps: function() {
		return {}
	},

	componentWillMount: function() {

		if (this.props.reportType) {
			this.echartManager = EChartManagerTable.getEchartManager(this.props.reportType, this.props.chartDisplaySchema);
		}

	},

	componentDidMount: function() {
		var _this = this;
		this._loadData(this.props);
		$(window).on('resize', this._resizeChart);
		// this.app['APP-ZHIBIAO-SORT-DIALOG'] = App.on('APP-ZHIBIAO-SORT-DIALOG', this._setSortDialogState);
		// this.app['APP-ZHIBIAO-MAX-DIALOG'] = App.on('APP-ZHIBIAO-MAX-DIALOG', this._setMaxDialogState);
		// this.app['APP-ZHIBIAO-TOP-DIALOG'] = App.on('APP-ZHIBIAO-TOP-DIALOG', this._setTopDialogState);
		// this.app['APP-ZHIBIAO-EMPTY-TOP-FILTER'] = App.on('APP-ZHIBIAO-EMPTY-TOP-FILTER',this._setEmptyFilter);
		this.app['APP-REPORT-SET-FILTER-LOADING'] = App.on('APP-REPORT-SET-FILTER-LOADING',this._setLoading);
	},

	componentWillReceiveProps: function(nextProps) {

		var props = this.props;
		var changed = false;
		if (nextProps.config.name != props.config.name) {
			changed = true;
		}
		if (nextProps.width != props.width || nextProps.height != props.height) {
			changed = true;
		}

		if (nextProps.reportType != props.reportType || nextProps.chartDisplaySchema != props.chartDisplaySchema) {
			this.echartManager = EChartManagerTable.getEchartManager(nextProps.reportType, nextProps.chartDisplaySchema);
			changed = true;
		}

		let stringPreMultiAxisLineSetting = JSON.stringify(preMultiAxisLineSetting);
		let stringMultiAxisLineSetting = JSON.stringify(nextProps.multiAxisLineSetting);
		if (stringPreMultiAxisLineSetting != stringMultiAxisLineSetting) {
			preMultiAxisLineSetting = JSON.parse(stringMultiAxisLineSetting);
			changed = true;
		}
		var topNumber = '84'
		if (nextProps.reportType == 'ScrollColumn2D' && nextProps.drilDownFilter.length>1) {
			topNumber = (nextProps.drilDownFilter.length*21)+84
		}else if(nextProps.drilDownFilter.length == 1 ){
			topNumber ='105'
		}
		this.setState({
			topNumber:topNumber,
		});
		if(JSON.stringify(this.props.sortFields)!=JSON.stringify(nextProps.sortFields)){
			changed=true;
		}
		if(JSON.stringify(this.props.maxMin)!=JSON.stringify(nextProps.maxMin)){
			changed=true;
		}
		if(JSON.stringify(this.props.topParameters)!=JSON.stringify(nextProps.topParameters)){
			changed=true;
		}
		if (changed || this.props.params != nextProps.params || JSON.stringify(this.props.compareInfo) !=JSON.stringify(nextProps.compareInfo)) {
			//var sortFields = false;
			//var topParameters = false;
			//var maxMin = false;
			//if (nextProps.sortTopParam) {
				//sortFields = nextProps.sortTopParam.sortFields;
				//topParameters = nextProps.sortTopParam.topParameters;
				//maxMin = nextProps.sortTopParam.maxMin;
			//}
			var topNumber = '84';
			var isClickCompareObj=CompareStore.isClickCompare(nextProps.compareData,nextProps.compare,this.state.compareData,this.state.compare)
			var indexFields=nextProps.zhiBiaoList;
			if(nextProps.compare){
				indexFields=CompareStore.setChartCompareIndex(isClickCompareObj.selectedCompare,nextProps.zhiBiaoList);
			}
			this.setState({
				topParameters: nextProps.topParameters,
				maxMin: nextProps.maxMin,
				sortTopParam:nextProps.sortTopParam,
				compareData:App.deepClone(nextProps.compareData),
				compare:nextProps.compare,
				isClickCompare:isClickCompareObj.isClickCompare,
				selectedCompare:isClickCompareObj.selectedCompare,
				indexFields:indexFields,
				zhiBiaoList:nextProps.zhiBiaoList,
				sortFields: nextProps.sortFields,

			},function(){
				this._loadData(nextProps);
			});


		}
	},

	componentWillUnmount: function() {
		//取消订阅
		for (var i in this.app) {
			this.app[i].remove()
		}
		this._disposeChart();
	},

	render: function() {
		if (!this.state.loaded) {
			return (
				<div className="chart-loading-panel">
					<Loading/>
				</div>
			);
		}
		if (this.state.error) {
			return (
				<div className="chartPanel">
					<div className="cubi-error getReportNullError">{this.state.error}</div>
				</div>
			);

		}

		var zhibiaoSort = null;
		if (this.props.reportType == 'ScrollColumn2D') {
			var indexFields=this.state.indexFields;
			zhibiaoSort = <div>
					<ChartZhibiaoSort open={this.state.sortOpen} 
					indexFields={indexFields}
					sortFields={this.state.sortFields} 
					handleClose={this._handleClose}
					compare={this.props.compare}/>

					<ChartZhibiaoFilterMinMax 
					open={this.state.maxOpen} 
					indexFields={this.state.indexFields}
					compare={this.props.compare}
					maxMin={this.state.maxMin} 
					handleClose={this._handleClose}/>

					<ChartZhibiaoFilterTop 
					open={this.state.topOpen} 
					indexFields={this.state.indexFields}
					topParameters={this.state.topParameters} 
					handleClose={this._handleClose}
					compare={this.props.compare}/>

				</div>
		}
		return (
			<div className="chartPanel" style={{'paddingTop':this.state.topNumber}} >
				<div className="chart-container" ref="chartPanel"></div>
				{zhibiaoSort}
			</div>
		)
	},


	_loadData: function(props) {
		this._dragZhibiaoWeiduSetState();
		var _this = this;
		if (props.reportId) {
			ReportStore.getAreaInfo(props.reportId).then(function(data) {
				ReportStore.getArea(props.reportId, JSON.parse(props.params)).then(function(chartData) {
					if (chartData.success) {
						_this._renderChart(chartData.dataObject.chartInfo.jsonData, props.reportType, props.weiduList);
					} else {
						_this._handleError(chartData.message);
					}
				});
			})

		} else {

			var model = JSON.parse(props.params); //参数缺少topn
			if (model.areaInfo.categoryFields.length <= 0 || model.areaInfo.indexFields.length <= 0) {
				return;
			}
			//删除topn参数
			model = ReportStore.delTopParameters(model); 
			//如果有对比 清空指标的customName
			//model.areaInfo.indexFields=CompareStore.updateZhibiaocustomName(this.state.compareData,model.areaInfo.indexFields);
			//是否支持对比
			model=ReportStore.setCompareInfoToAreainfo(model,props.compareInfo,props.compare);
			//设置指标筛选
			//model=ReportStore.setZhiBiaoFilterFields(model,this.state.sortFields,this.state.topParameters,this.state.maxMin);
			ReportStore.getAreaByAreaInfo(model).then(function(chartData) {
				if (chartData.success) {
					_this._renderChart(chartData.dataObject.chartInfo.jsonData, props.reportType, props.weiduList);

				} else {
					_this._handleError(chartData.message);
				}
			});
		}
	},

	_renderChart: function(chartData, reportType, weiduList) {
		if (!this.isMounted()) return;

		chartData = ChartViewFixData.fixDataTreeValue(chartData, reportType, weiduList);

		var s = JSON.parse(JSON.stringify(this.state.sortTopParam));
		this.setState({
			error: null,
			loaded: true,
			sortTopParam:s
		}, function() {
			this._renderChartAfterViewReady(chartData, reportType);
		});

	},

	_renderChartAfterViewReady: function(chartData, reportType) {

		if (this.echartManager) {
			this._renderEChartsV2(chartData, reportType);
		}

	},

	_renderEChartsV2: function(chartData, reportType) {
		var chartData = chartData;
		var params = JSON.parse(this.props.params);
		chartData.indexFields = this.state.indexFields;//params.areaInfo.indexFields;
		this.echartManager.chartType = reportType;
		if (reportType == 'ScrollLine2D') {
			if (chartData.datasetArray.length >= 20) {
				if (!this.state.showChar) {
					var divBox = '<div class="showCharBoxClass">' +
						'<dl>' +
						'<dt><span class="iconfont icon-icbangzhu24px"></span>系统需要绘制' + chartData.datasetArray.length + '条折线，数据量过大，可能导致浏览器变慢，是否显示？</dt>' +
						'<dd><div class="showCharButtonClass">显示图形</div></dd>' +
						'</dl>' +
						'</div>'
					$(this.refs['chartPanel']).append(divBox);
					$('.showCharButtonClass').off('click');
					$('.showCharButtonClass').on('click', this._onclickShowHandle);
				} else {
					var chart = this._chart = echarts.init(this.refs['chartPanel']);
					var reportType = this.props.reportType;
					this.echartManager.init(chart).setData(chartData).layout(this.props.width, this.props.height).setOption(this.props.weiduList, this.props.drilDownFilter);
				}
			} else {
				var chart = this._chart = echarts.init(this.refs['chartPanel']);
				var reportType = this.props.reportType;
				this.echartManager.init(chart).setData(chartData).layout(this.props.width, this.props.height).setOption(this.props.weiduList, this.props.drilDownFilter);
			}
		} else if ("MultiAxisLine" == reportType) {
			let chart = this._chart = echarts.init(this.refs['chartPanel']);
			chartData["multiAxisLineSetting"] = this.props.multiAxisLineSetting;
			this.echartManager.init(chart).setData(chartData).layout(this.props.width, this.props.height).setOption(this.props.weiduList, this.props.drilDownFilter);
		} else {
			var chart = this._chart = echarts.init(this.refs['chartPanel']);
			// this.echartManager.chartType = reportType;
			this.echartManager.selectedCompare=this.state.selectedCompare;
			this.echartManager.indexParam={
				topParameters: this.state.topParameters,
				maxMin: this.state.maxMin,
				sortFields:this.state.sortFields
			}
			this.echartManager.zhiBiaoList = this.state.zhiBiaoList;
			
			this.echartManager.init(chart).setData(chartData).layout(this.props.width, this.props.height).setOption(this.props.weiduList, this.props.drilDownFilter).setTool();
		}

	},

	_handleError: function(err) {

		if (!this.isMounted()) return;

		this.setState({
			error: err,
			loaded: true
		})
	},
	_onclickShowHandle: function(evt) {
		evt.stopPropagation();
		this._loadData(this.props);
		this.setState({
			showChar: true
		}, function() {
			$('.showCharBoxClass').remove();
		})
	},
	_resizeChart: function() {

		var chartConfig = this.props.config;

		if (this._chart && chartConfig.renderer && chartConfig.renderer === 'ECharts') {
			this._chart.resize();
		}
	},

	_disposeChart: function() {
		if (this._chart) {
			this._chart.dispose();
			this._chart = null;
		}
	},

	_dragZhibiaoWeiduSetState: function() {
		this.setState({
			loaded: false
		});
	},

	// _setSortDialogState: function(arg) {
	// 	if (!this.isMounted()) return;

	// 	this.setState({
	// 		sortOpen: arg.open,
	// 		maxOpen: false,
	// 		topOpen: false,
	// 		indexFields: arg.indexFields
	// 	});
	// },
	// _setSortState: function(arg) {
	// 	var param = {
	// 		isSort: true,
	// 		sortIndexFields: arg.selIndexFields,
	// 	}
	// 	arg.selIndexFields.method = arg.method;
		
	// 	var sortTopParam=this.state.sortTopParam;
	// 	sortTopParam.sortFields=[arg.selIndexFields];
	// 	this.setState({
	// 		sortOpen: false,
	// 		sortFields: [arg.selIndexFields],
	// 		sortTopParam:sortTopParam
	// 	},function(){
	// 		this._loadData(this.props);
	// 		//this.echartManager.SetZhibiaoOption.myToolClick(param, arg.sortWay,null,null);
	// 	});
	// },
	// _setMaxDialogState: function(arg) {
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		maxOpen: arg.open,
	// 		sortOpen: false,
	// 		topOpen: false,
	// 		indexFields: arg.indexFields
	// 	});
	// },
	// _setMaxState: function(arg) {
	// 	var param = {
	// 		isSort: false,
	// 		topOpen: false,
	// 		indexFields: arg.selIndexFields
	// 	}
	// 	var maxMin = [{
	// 		value: [arg.min],
	// 		name: arg.selIndexFields.name
	// 	}, {
	// 		value: [arg.max],
	// 		name: arg.selIndexFields.name
	// 	}];
	// 	var sortTopParam=this.state.sortTopParam;
	// 	var indexFields=this.state.indexFields;
	// 	var curIndexFields={};
	// 	for(var i=0;i<indexFields.length;i++){
	// 		if(indexFields[i].name==arg.selIndexFields.name){
	// 			curIndexFields=indexFields[i];
	// 		}
	// 	}
	// 	var maxMinFilter=[
	// 			{
 //                      "valueType": curIndexFields.dataType,
 //                      "name": curIndexFields.name,
 //                      "pattern": "",
 //                      "dbField": curIndexFields.fieldName,
 //                      "type": "INDEX_FIELD",
 //                      "operator": [
 //                          "GE"
 //                      ],
 //                      "value": [
 //                          arg.min
 //                      ],
 //                      "items": [],
 //                      "selected": true
 //                  },
                  
	// 			{
 //                      "valueType": curIndexFields.dataType,
 //                      "name": curIndexFields.name,
 //                      "pattern": "",
 //                      "dbField": curIndexFields.fieldName,
 //                      "type": "INDEX_FIELD",
 //                      "operator": [ 
 //                          "LE"
 //                      ],
 //                      "value": [
 //                          arg.max
 //                      ],
 //                      "items": [],
 //                      "selected": true

	// 			}
	// 		];
	// 	sortTopParam.maxMin=maxMin;
	// 	sortTopParam.topParameters=false;
	// 	this.setState({
	// 		maxOpen: false,
	// 		topParameters:false,
	// 		maxMin: maxMin,
	// 		maxMinFilter:maxMinFilter,
	// 		sortTopParam:sortTopParam,
	// 	},function(){
	// 		this._loadData(this.props);
	// 	});
	// 	//this.echartManager.SetZhibiaoOption.myToolClick(param, arg.sortWay, arg.min, arg.max);
	// },
	// _setTopDialogState: function(arg) {
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		topOpen: arg.open,
	// 		sortOpen: false,
	// 		maxOpen: false,
	// 		indexFields: arg.indexFields
	// 	});
	// },
	// _setTopState: function(arg) {
	// 	var param = {
	// 		isSort: false,
	// 		topOpen: false,
	// 		topN: true,
	// 		top: arg.topn,
	// 		indexFields: arg.selIndexFields,
	// 		sortWay: arg.sortWay,
	// 	}
	// 	var topParameters = [{
	// 		field: arg.selIndexFields.name,
	// 		method: arg.method,
	// 		topn: arg.topn
	// 	}];
	
	// 	var sortTopParam=this.state.sortTopParam;
	// 	sortTopParam.topParameters=topParameters;
	// 	this.setState({
	// 		topOpen: false,
	// 		topParameters: topParameters,
	// 		maxMin:false,
	// 		sortTopParam:sortTopParam
	// 	},function(){
	// 		this._loadData(this.props);
	// 	});
	// 	//this.echartManager.SetZhibiaoOption.myToolClick(param, arg.sortWay,null);
	// },
	// _handleClose: function() {
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		topOpen: false,
	// 		sortOpen: false,
	// 		maxOpen: false,
	// 	});
	// },
	// _setEmptyFilter:function(){
	// 	if (!this.isMounted()) return;
	// 	this.setState({
	// 		maxMin:false,
	// 		topParameters:false,
	// 		sortFields:false,
	// 		maxMinFilter:[],
	// 		sortTopParam:{}
	// 	},function(){
	// 		this._loadData(this.props);
	// 	});
	// },
	_setLoading:function(arg){
		if (!this.isMounted()) return;
		this.setState({
			loaded:!arg.loading
		});
	},
	
});
