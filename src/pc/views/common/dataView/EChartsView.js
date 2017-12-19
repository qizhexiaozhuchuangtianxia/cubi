var React = require('react');
var ECharts = require('echarts');
var $ = require('jquery');
var App = require('app');
//var getStackedOption = require('../getStackedOption');
var EChartManagerTable = require('../echarts/EChartManagerTable');
var ReportStore = require('../../../stores/ReportStore');
var CompareStore = require('../../../stores/CompareStore');
var ChartZhibiaoSort=require('../ChartZhibiaoSort');
var ChartZhibiaoFilterMinMax=require('../ChartZhibiaoFilterMinMax');
var ChartZhibiaoFilterTop=require('../ChartZhibiaoFilterTop');
var preMultiAxisLineSetting = {};
var ChartViewFixData = require('../ChartViewFixData');

module.exports = React.createClass({

	displayName: 'EChartsView',

	propTypes: {
		//chartConfig: React.PropTypes.object.isRequired, //ECharts配置
		reportData: React.PropTypes.object.isRequired, //报表数据
		reportType: React.PropTypes.string,
		chartDisplaySchema: React.PropTypes.string, //Chart显示方案，可以不传，使用默认的方案（不同地方，chart显示需要调整）
		width: React.PropTypes.number, //ChartView 宽
		height: React.PropTypes.number, //ChartView 高
	},

	getInitialState: function() {
		// var sortFields=[];
		// var topParameters=false;
		// var maxMin=false;
		// var sortTopParam={};
		// if(ReportStore.sortTopParam){
		// 	sortTopParam=ReportStore.sortTopParam;
		// }else if(this.props.sortTopParam){
		// 	sortTopParam=this.props.sortTopParam;
		// }
		// maxMin=sortTopParam.maxMin;
		// sortFields=sortTopParam.sortFields;
		// topParameters=sortTopParam.topParameters;
		var isClickCompareObj=CompareStore.isClickCompare(this.props.compareData,this.props.compare,false,false);
		var indexFields=this.props.indexFields;
		if(this.props.compare){
			indexFields=CompareStore.setChartCompareIndex(isClickCompareObj.selectedCompare,indexFields);
		}

		return {
			sortOpen:false,
			maxOpen:false,
			topOpen:false,
			indexFields:indexFields,
			dataObjectIndex:this.props.indexFields||[],
			//sortTopParam:sortTopParam,
			sortFields:this.props.sortFields,
			topParameters:this.props.topParameters,
			maxMin:this.props.maxMin,
			drilDownFilter:this.props.drilDownFilter,
			selectedCompare:isClickCompareObj.selectedCompare,
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
		$(window).on('resize', this._resizeChart);
		if (this.echartManager) {
			this._renderEChartsV2();
		}
		//App.on('APP-ZHIBIAO-SORT-DIALOG',this._setSortDialogState);
		// App.on('APP-ZHIBIAO-MAX-DIALOG',this._setMaxDialogState);
		// App.on('APP-ZHIBIAO-TOP-DIALOG',this._setTopDialogState);
		App.on('APP-ZHIBIAO-EMPTY-TOP-FILTER',this._setEmptyFilter);
		///App.on('APP-REPORT-SET-FILTER', this._setSortFilter);
	},

	componentWillReceiveProps: function(nextProps) {
		var props = this.props;
		this.setState({
			sortFields:nextProps.sortFields,
			topParameters:nextProps.topParameters,
			maxMin:nextProps.maxMin,
		},function(){
			if (nextProps.reportType != props.reportType || nextProps.chartDisplaySchema != props.chartDisplaySchema ) {
				this.echartManager = EChartManagerTable.getEchartManager(nextProps.reportType, nextProps.chartDisplaySchema);
			}
		})
		

	},

	shouldComponentUpdate: function(nextProps,nextState) {

		var props = this.props;
		var changed = false;
		if (nextProps.reportData != props.reportData) {
			changed = true;
		}
		if (nextProps.width != props.width || nextProps.height != props.height) {
			changed = true;
		}

		if(JSON.stringify(nextProps.drilDownFilter)!=JSON.stringify(props.drilDownFilter)){
			changed = true;
		}
		if(nextState.changed){
			changed = true;
		}
		
		// let preStringMultiAxisLineSetting = JSON.stringify(preMultiAxisLineSetting);
		// let stringMultiAxisLineSetting    = JSON.stringify(nextProps.multiAxisLineSetting);
		// if (preStringMultiAxisLineSetting != stringMultiAxisLineSetting) {
		// 	preMultiAxisLineSetting = JSON.parse(stringMultiAxisLineSetting);
		// 	changed = true;
		// }
		return changed;
	},

	// componentDidUpdate: function(prevProps, prevState) {
	// 	if (this.echartManager) {
	// 		this._renderEChartsV2();
	// 	}
	// },

	componentWillUnmount: function() {
		if (this._chart) {
			this._chart.dispose();
			this._chart = null;
		}
		$(window).off('resize', this._resizeChart);
	},
	render: function() {
		var zhibiaoSort=null;
		if(this.props.reportType=='ScrollColumn2D'){
			zhibiaoSort=<div>
					<ChartZhibiaoSort 
					open={this.state.sortOpen} 
					indexFields={this.state.indexFields}
					
					sortFields={this.state.sortFields} 
					handleClose={this._handleClose}
					compare={this.props.compare}
					row={this.props.row}
					col={this.props.col}/>

					<ChartZhibiaoFilterMinMax 
					open={this.state.maxOpen} 
					indexFields={this.state.indexFields}
					handleClose={this._handleClose}
					maxMin={this.state.maxMin}
					compare={this.props.compare}
					row={this.props.row}
					col={this.props.col}/>

					<ChartZhibiaoFilterTop 
					open={this.state.topOpen} 
					indexFields={this.state.indexFields}
					topParameters={this.state.topParameters} 
					handleClose={this._handleClose}
					compare={this.props.compare}
					row={this.props.row}
					col={this.props.col}/>
				</div>
		}
		return (
			<div className="chartPanel">
				<div className="chart-container" ref="chartPanel"></div>
				{zhibiaoSort}
			</div>
		)
	},

	_renderEChartsV2: function() {
		var chartData = this.props.reportData.chartInfo.jsonData;
		var echartManager = this.echartManager;
		var chart = this._chart = echarts.init(this.refs['chartPanel']);
		var reportType = this.props.reportType;
		var reportId=this.props.reportData.id;
		var indexParam=false;
		var weiduList=this.props.weiduList||[];
		var drilDownFilter=this.props.drilDownFilter||[];
		this.echartManager.row=this.props.row;
		this.echartManager.col=this.props.col;
		if(this.props.reportInfo){
			chartData.indexFields=this.props.reportInfo.indexFields;
		}

		chartData['isDashboard'] = true;

		// 日期维度格式化
		chartData = ChartViewFixData.fixDataTreeValue(chartData, reportType, weiduList);

		var _this=this;
		chartData.indexFields=this.state.dataObjectIndex;
		if(reportType=='PercentColumn2D'){
			//ReportStore.getAreaInfo(reportId).then(function(result) {
				//chartData.indexFields=result.dataObject.indexFields;
				echartManager.init(chart).setData(chartData).layout(_this.props.width, _this.props.height).setOption(weiduList, drilDownFilter);
			//});
		}else if(reportType=='StackedColumn2D'){
			//ReportStore.getAreaInfo(reportId).then(function(result) {
				// chartData.indexFields=result.dataObject.indexFields;
			 	echartManager.init(chart).setData(chartData).layout(_this.props.width, _this.props.height).setOption(weiduList, drilDownFilter);
			//});
		}
		else if ("MultiAxisLine" === reportType) {
			//ReportStore.getAreaInfo(reportId).then(function(result) {
				// chartData.indexFields = result.dataObject.indexFields;
				chartData["multiAxisLineSetting"] = _this.props.multiAxisLineSetting;
				echartManager.init(chart).setData(chartData).layout(_this.props.width, _this.props.height).setOption(weiduList, drilDownFilter);
			//});
		}
		else{
			if(reportType=='ScrollColumn2D'){
				var _this=this;
					chartData.indexFields = this.state.indexFields;
					this.echartManager.chartType = reportType;
					this.echartManager.selectedCompare=this.state.selectedCompare;
					this.echartManager.zhiBiaoList = this.state.indexFields;
					//this.echartManager.indexParam=this.state.sortTopParam;
					this.echartManager.indexParam={
						topParameters: this.props.topParameters,
						maxMin: this.props.maxMin,
						sortFields:this.props.sortFields
					}
					
					echartManager.init(chart).setData(chartData).layout(_this.props.width, _this.props.height).setOption(weiduList, drilDownFilter).setTool();
			}else{

				echartManager.init(chart).setData(chartData).layout(this.props.width, this.props.height).setOption(weiduList, drilDownFilter);
			}

		}
	},

	_resizeChart: function() {

		if (this._chart) {
			this._chart.resize();
		}
	},
	_setSortDialogState:function(arg){
		if (!this.isMounted()) return;
		if(this.props.row==arg.row && this.props.col==arg.col){
			this.setState({
				sortOpen:arg.open,
				maxOpen:false,
				topOpen:false,
				indexFields:arg.indexFields,
				changed:true
			});
		}

	},
	// _setSortState:function(arg){
 //        var param={
 //        	isSort:true,
 //        	sortIndexFields:arg.selIndexFields,
 //        }
 //        arg.selIndexFields.method=arg.method;
 //        this.setState({
 //        	sortOpen:false,
	// 		sortFields:[arg.selIndexFields],
	// 		changed:false
	// 	});
 //        this.echartManager.SetZhibiaoOption.myToolClick(param,arg.sortWay);
	// },
	_setMaxDialogState:function(arg){
		if (!this.isMounted()) return;
		if(this.props.row==arg.row && this.props.col==arg.col){
			this.setState({
				maxOpen:arg.open,
				sortOpen:false,
				topOpen:false,
				indexFields:arg.indexFields,
				change:true
			});
		}
	},
	// _setMaxState:function(arg){
	// 	var param={
 //        	isSort:false,
 //        	topOpen:false,
 //        	indexFields:arg.selIndexFields
 //        }
 //        var maxMin=[
 //        	{
 //        		value:[arg.min],
 //        		name:arg.selIndexFields.name
 //        	},
 //        	{
 //        		value:[arg.max],
 //        		name:arg.selIndexFields.name
 //        	}
 //        ]
 //        this.setState({
 //        	maxOpen:false,
 //        	topParameters:false,
	// 		maxMin:maxMin,
	// 		changed:false
	// 	});
 //        this.echartManager.SetZhibiaoOption.myToolClick(param,arg.sortWay,arg.min,arg.max);
	// },
	_setTopDialogState:function(arg){
		if (!this.isMounted()) return;
		if(this.props.row==arg.row && this.props.col==arg.col){
			this.setState({
				topOpen:arg.open,
				sortOpen:false,
				maxOpen:false,
				indexFields:arg.indexFields,
				changed:true
			});
		}
	},
	// _setTopState:function(arg){
	// 	var param={
 //        	isSort:false,
 //        	topOpen:false,
 //        	topN:true,
 //        	top:arg.topn,
 //        	indexFields:arg.selIndexFields,
 //        	sortWay:arg.sortWay,
 //        }
 //        var topParameters=[{
 //        	field:arg.selIndexFields.name,
 //        	method:arg.method,
 //        	topn:arg.topn
 //        }];
 //        this.setState({
 //        	topOpen:false,
	// 		topParameters:topParameters,
	// 		maxMin:false,
	// 		changed:false
	// 	});
 //        this.echartManager.SetZhibiaoOption.myToolClick(param,arg.sortWay);
	// },
	_handleClose:function(){
		if (!this.isMounted()) return;
		this.setState({
			topOpen:false,
			sortOpen:false,
			maxOpen:false,
		});
	},
	_setEmptyFilter:function(){
		if (!this.isMounted()) return;
		this.setState({
			maxMin:false,
			topParameters:false,
			sortFields:false
		});
	},

	// _setSortFilter:function(obj){
	// 	if (!this.isMounted()) return;
	// 	ReportStore.sortTopParam=obj;
	// 	this.setState({
	// 		maxMin:obj.maxMin,
	// 		topParameters:obj.topParameters,
	// 		sortFields:obj.sortFields,
	// 		sortTopParam:obj,
	// 	});
	// }
});
