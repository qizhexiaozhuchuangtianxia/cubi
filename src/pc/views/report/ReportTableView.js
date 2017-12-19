/**
 * 报表表格
 *
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var TableView = require('../common/TableView');
var ReportRightMenu = require('../common/reportRightMenu');
var KPIRightMenu = require('../common/KPIRightMenu');
var ReportStore = require('../../stores/ReportStore');
var ShowHuiZong = require('./ShowHuiZong');
var ShowKPI = require('./showKPI');
var Loading = require('../common/Loading');
var BreadcrumbTop = require('../common/BreadcrumbTop');

import AboutReportDialog from './AboutReportDialogComponent';

module.exports = React.createClass({

	displayName: 'ReportTableView',

	getInitialState: function() {
		var loading = true,topParameters=false,

		// zhibiaoMin=null,zhibiaoMax=null,
		// maxMinName=null,
		//sortParameters=false,

		sortName=-1,sortFieldsIndex=-1
		if(!this.props.changeed){
			var loading = false;
		}
		//var zhibiaoMinMax=false;
		var selectedScenesName=ReportStore.setFilterCompareScenesName(this.props.compareInfo.compareDimension);
		if(this.props.sortTopParam){
			if(this.props.sortTopParam.topParameters ){
				topParameters=this.props.sortTopParam.topParameters
			}
			// if( this.props.sortTopParam.maxMin){
			// 	zhibiaoMinMax=this.props.sortTopParam.maxMin
			// }

			if( this.props.sortFields){//sortTopParam.
				sortName=this.props.sortFields[0].field;//sortTopParam.
				//sortParameters=this.props.sortFields;//.sortTopParam

			}
		}

		return {
			pageSize:500,
			sliceSize:20,
			loading:loading,
			currentPage:0,
			totalRowCount:1,
			sliceIndex:1,
			error:false,
			pageLoading:false,
			pageLastText:false,
			sortName:sortName,
			//sortParameters:sortParameters,
			zhibiaoFilter:[],
			sortTopParam:this.props.sortTopParam,
			topParameters:topParameters,

			//zhibiaoMinMax:zhibiaoMinMax,
			drilDownFilter:this.props.drilDownFilter,
			formulas:this.props.formulas,
			sortDmType:null,
			sortFieldsIndex:sortFieldsIndex,
			switchScenes:false,
			selectedScenesName:selectedScenesName,
			compareData:JSON.parse(JSON.stringify(this.props.compareData)),
			sortFields:this.props.sortFields,
			maxMin:this.props.maxMin,
			editReportType:this.props.reportType,
			jsonData:this.props.data
		}
	},
	componentWillMount:function(){
		var data=this.props.data;


		if(this.props.changeed){
		this._loadTableDataFromServer(data,true,this.state.sortFields);
		}
	},
	localFilterParam:[],
	componentDidMount: function() {

		 App.on('APP-REPORT-SET-NOPAIXU', this._setSortParams);
		 App.on('APP-REPORT-SET-NOPFILTER', this._setSortFilterzhibiao);
		this._setScrollbar();

	},

	componentDidUpdate: function() {
	},
	componentWillReceiveProps: function(nextProps) {
		if(nextProps.showSetReportNameDialog){
			return;
		}
		var loading = true,topParameters=false,
		//zhibiaoMin=null,zhibiaoMax=null,maxMinName=null,
		//sortParameters=false,
		sortName=-1,zhibiaoMinMax=false;

		if(nextProps.sortTopParam){
			if(nextProps.sortTopParam.topParameters){
				topParameters=nextProps.sortTopParam.topParameters;
			}
			if( nextProps.sortTopParam.maxMin){
				// zhibiaoMin=nextProps.sortTopParam.maxMin[0].value[0];
				// zhibiaoMax=nextProps.sortTopParam.maxMin[1].value[0];
				// maxMinName=nextProps.sortTopParam.maxMin[0].name;
				zhibiaoMinMax=nextProps.sortTopParam.maxMin;//ReportStore.getIndexFieldsMaxMinArr(nextProps.filterFields);
			}
			if( nextProps.sortFields){
				sortName=nextProps.sortFields[0].field;//sortTopParam.
				//sortParameters=nextProps.sortTopParam.sortFields;

			}
			// else{
			// 	sortParameters=[];
			// }
		}
		var oldSelectedCompare = ReportStore.getSelectedCompareWei(this.state.compareData,this.props.compare);
		var selectedCompare = ReportStore.getSelectedCompareWei(nextProps.compareData,nextProps.compare);

		var selectedScenesName=ReportStore.setFilterCompareScenesName(nextProps.compareInfo.compareDimension);
		var switchScenes=false;
		if(JSON.stringify(oldSelectedCompare.selectedScenes)!=JSON.stringify(selectedCompare.selectedScenes)){
			switchScenes=true;
		}
		if(switchScenes && !selectedCompare.type ){
		   var sortFields =ReportStore.updateSortParameters(nextProps.weiduList,this.state.sortFields);
		}
		this.setState({
			loading:true,
			reportData: nextProps.data,
			sortTopParam:nextProps.sortTopParam,
			topParameters:nextProps.topParameters,
			//sortParameters:sortParameters,
			sortName:sortName,
			zhibiaoMinMax:zhibiaoMinMax,
	  		drilDownFilter:nextProps.drilDownFilter,
	  		formulas:nextProps.formulas,
			switchScenes:switchScenes,
	  		selectedScenesName:selectedScenesName,
	  		compareData:JSON.parse(JSON.stringify(nextProps.compareData)),
	  		sortFields:nextProps.sortFields,
	  		maxMin:nextProps.maxMin
		},function(){
			if(nextProps.changeed){
				var data=nextProps.data;
				this._loadTableDataFromServer(data,true);
			}else{
				this.setState({
					loading:false
				})
			}
		})

	},
	render: function() {
		var tableView,reportViewData = null,contClass = 'report-panel reportViewPanel';
		var rightMenu,showDialog,aboutReportDialog;
		if(this.props.reportType=='TREE' ||  this.props.reportType=='CATEGORY'){
						contClass = 'report-panel reportViewPanel report-height'
		}
		if(this.dataObject&&this.dataObject.pages.length>0){
			reportViewData = ReportStore.getTableViewData(this.state,this._reportData,this.dataObject);
		}

		if(this.state.loading){
			tableView = <Loading/>;
		}else{
			if(this.props.changeed){
				tableView=<TableView
					openBread={this.state.openBread}
					arr={this.state.arr}
	                data={this.props.data}
	                pageSize={this.state.pageSize}
	                sliceSize={this.state.sliceSize}
	                showPager={this.props.showPager}
	                onFieldNameChanged={this.props.onFieldNameChanged}
	                setScrollbar={this._setScrollbar}
					sortParameters={this.state.sortFields}
	                isReportTable={true}
					tables={false}
	                reportData={reportViewData}
	                sortName={this.state.sortName}
	                setSortParams={this._setSortParams}
	                kpiConfig={this.props.kpiConfig}
					setZhibiaoState={this._setZhibiaoState}
					setzhibiaoTop={this._setzhibiaoTop}
			  		topParameters={this.state.topParameters}

					zhibiaoMinMax={this.state.maxMin}
					weiduList={this.props.weiduList}
					columnTitleFields={this.props.columnTitleFields}
				    rowTitleFields={this.props.rowTitleFields}
					filterData={this.props.filterData}
					drilDownFilter={this.props.drilDownFilter}
					sortFieldsIndex={this.state.sortFieldsIndex}
					compare={this.props.compare}
				  selectedScenesName={this.props.selectedScenesName}
				  zhiBiaoindexFields={this.props.zhiBiaoindexFields}/>

				if(this.state.error){
					tableView = <div className="tableShowScroll">
						<div className="table-view">
							<div className="table-context  min-table-content" ref="table-context">
								<div className="cubi-error noGetReportError">
									{this.state.error}
								</div>
							</div>
						</div>
			        </div>;
				}

			}else{
				tableView = null;
			}
		}

		if (this.props.reportType =='KPI') {

			rightMenu = <KPIRightMenu
						reportId={this.props.reportId}
						filterFields={this.props.filterFields} />

			showDialog = <ShowKPI reportId={this.props.reportId} kpiConfig={this.props.kpiConfig}/>
		}else{
			rightMenu = <ReportRightMenu
			      		reportType={ReportStore.editReportType}
						reportId={this.props.reportId}
						formulas={this.state.formulas}
						filterFields={this.props.filterFields}
						reportData = {this.props.data}
						topParameters= {this.state.topParameters}
						sortFields= {this.state.sortFields}
						maxMin= {this.state.maxMin}
						reportInfo= {this.props.data.areaInfo}
						drilDownFilter= {this.props.drilDownFilter}
						jsonData={this.state.jsonData}
						exportData={this.props.exportData}
						exportDataModel={this.props.exportDataModel}/> // 导出当前数据
		
			showDialog = <ShowHuiZong
						  reportType={ReportStore.editReportType}
						  weiduList={this.props.weiduList}
						  formulas={this.state.formulas}/>
		}

		aboutReportDialog =
			<AboutReportDialog
				reportId   = {this.props.reportId}
				reportData = {this.props.data}
			    reportName = {this.props.tableName}/>;

		return (
			<div className={contClass}>
                <div className="tableView">
                	<div className="tableViews">
                    	<div className="table-context" ref="table-context">

												{showDialog}
		                    {aboutReportDialog}
	                        <div className="reportHeaderClassName">
	                       		 {rightMenu}
	                            <div className="titleZhuBox">{this.props.tableName}</div>
	                            <div className="titleFuBox">数据立方： {this.props.metadataName}</div>
	                            <div className='breads'>{this.props.drilDownFilter.map(this._breadlHandle)}</div>
	                        </div>
	                        {tableView}
	                        {this._lastRowCountPage()}
		                    {this._loadingMeassage()}
		                </div>
	                </div>
                </div>
            </div>
		)

	},
	_breadlHandle:function(item,key){
		return <BreadcrumbTop
		key={item.fieldName}
		item={item}
		metadataId = {this.props.data.areaInfo.metadataId}
		/>

	},
    _setScrollbar:function(){
        var _this=this;
        $('.report-panel').mCustomScrollbar({
            axis: "y",
            theme: "minimal-dark",
            scrollInertia: 500,
            autoExpandScrollbar: true,
            advanced: {
                autoExpandHorizontalScroll: false
            },
            callbacks: {
                onTotalScroll: function() {
                	_this._scrollOnPageTo();
                }
            }
        });
    },
    _scrollOnPageTo: function() {
		this.setState({
			pageLastText:false,
			pageLoading:true
		});
    	if(this.state.sliceIndex<this.state.totalRowCount/this.state.sliceSize){
	    	//$('.loading-text-box').show();
	    	var pageSize = this.state.pageSize,
	    		totalRowCount = this.state.totalRowCount,
	    		sliceIndex = this.state.sliceIndex,
	    		sliceSize = this.state.sliceSize;
			if((pageSize<totalRowCount)&&(sliceIndex*sliceSize<totalRowCount)&&(sliceIndex*sliceSize>=this._reportData.length)){
				this._loadTableDataFromServer(this.props.data);
				//		this._zhibiaoFilterParams(this.props.data);

			}else{
				this._setReoprtPageData();
			}
    	}else{
    		this.setState({
    			pageLastText:true,
				pageLoading:false
    		})
    	}



    },
    dataObject:null,
    _loadingMeassage:function(){
    	var loadingClassName = 'loading-text-box';
    	var pageLastClassName = 'loading-last-text';
    	if(!this.state.pageLoading){
    		loadingClassName = 'loading-text-box hide';
    	}
    	if(!this.state.pageLastText){
    		pageLastClassName = 'loading-last-text hide';
    	}
		return  (
			<div className='report-loading-box'>
				<div className={loadingClassName}>
					<div className="loading-icon">
						<Loading/>
					</div>
					<div className="loading-text">加载中...</div>
				</div>
				<div className={pageLastClassName}>您已经看完了所有数据</div>
			</div>
		)
	},
	_reportData:[],
	_setReoprtFirstData:function(){
		var error = false;
		if(this.dataObject && (this.dataObject.pages.length==0||this.dataObject.fields.length==0)){
				error = '未检索到数据';
		}

		this.setState({
			loading:false,
			currentPage:0,
			totalRowCount:this.dataObject.pageParameter.totalRowCount,
			sliceIndex:1,//截取下标
			error:error,
			pageLoading:false,
			pageLastText:false
		});

	},
	_setReoprtPageData:function(currentPage){
		var _this=this;
		setTimeout(function(){
			_this.setState(function(prevState){
				prevState.sliceIndex=prevState.sliceIndex+1;
				if(currentPage){
					prevState.currentPage=prevState.currentPage+1;
				}
				prevState.pageLastText = false;
				prevState.pageLoading = false;
				//prevState.loading=false;
				return prevState;
			});
		},300)
	},

	_loadTableDataFromServer: function(params,start,isSort) {
		var _this=this;
		var jsonData = JSON.parse(JSON.stringify(params));
		var currentPageNo = this.state.currentPage+1;
		jsonData.areaParameters.pageParameter = {
			pageRowCount: _this.state.pageSize,
			currentPageNo:currentPageNo,
		}
		//设置指标筛选
		jsonData=ReportStore.setZhiBiaoFilterFields(jsonData,this.state.sortFields,this.state.topParameters,this.state.maxMin);
		// 指标排序筛选改变 Type
		jsonData=ReportStore.setTableType(jsonData,this.props.reportType,this.state.topParameters,this.state.maxMin,this.state.switchScenes)
		// 显示汇总
		if(  (this.state.sortFields ||  this.state.topParameters ||  this.state.maxMin) && jsonData.areaInfo.type=="CATEGORY"){
			//修改bug 判断错误
			ReportStore.zhibiaoSortSetFormulas(jsonData.areaInfo.formulas);
		}
		// 修改之后的type
		ReportStore.editReportType=jsonData.areaInfo.type;

		_this.setState({
			pageLastText:false,
		});

		

		// 清空指标筛选值
		jsonData=ReportStore.emptyZhibiaofilter(jsonData,this.state.switchScenes,this.state.sortFields,this.state.maxMin);
		// 设置 当前表是否支持对比信息compareInfo
		jsonData=ReportStore.setCompareInfoToAreainfo(jsonData,this.props.compareInfo,this.props.compare);
		// console.log(JSON.stringify(jsonData),'000')
		ReportStore.getAreaByAreaInfo(jsonData).then(function(data) {
			if (data.success) {
				_this.dataObject = data.dataObject;
				_this._reportData = ReportStore.setReportViewData(data.dataObject);
				var FieldsIndex =ReportStore.setsortFieldsIndex(data.dataObject.fields)

				if(start){
					_this._setReoprtFirstData();
				}else{
					_this._setReoprtPageData(_this.state.currentPage);
				}
				_this.setState({
					sortFieldsIndex:FieldsIndex,
					jsonData:jsonData
				})
			}else{
				_this.setState({
					error:data.message,
					loading:false,
					formulas:ReportStore.getFormulas(jsonData.areaInfo.formulas,_this.props.reportType),
					jsonData:jsonData
				})
			}
		});
	},
	_setSortParams:function(params){
		var sortFields = params.sortFields;
		ReportStore.isSort=true;
		if(params.sortName == null ){
			sortFields = params.sortParam.sortFields
		}
		this.setState({
			currentPage:0,
			totalRowCount:1,
			sliceIndex:1,
			sortDmType:params.dmType,
			sortFields:sortFields,
			sortName:params.sortName,
			loading:true,
			switchScenes:false

		},function(){
			if(params.dmType =='dimension') {
				this.props.data.areaInfo.type=this.props.type
			}
			this._loadTableDataFromServer(this.props.data,true,true);
		 	//this._zhibiaoFilterParams(this.props.data)
		});

	},
	_lastRowCountPage:function(){
		if(this.state.pageLastText){
			var text='共'+this.state.totalRowCount+'行';
			return <div className="lastCountPage">
		        	<span className="countPageNum">{text}</span>
		        </div>
		}
		return null;
	},
	_setZhibiaoState:function(zhibiaoFilter){
		if (!this.isMounted()) return;
		this.setState({
			currentPage:0,
			totalRowCount:1,
			sliceIndex:1,
			loading:true,
			zhibiaoMinMax:zhibiaoFilter.maxMin,
			topParameters:false,
			switchScenes:false
		},function(){
			this._loadTableDataFromServer(this.props.data,true);
		});

	},
	_setzhibiaoTop:function(zhibiaoTopn){
		if (!this.isMounted()) return;
		this.setState({
			currentPage:0,
			totalRowCount:1,
			sliceIndex:1,
			topParameters:zhibiaoTopn.topParameters,
			loading:true,
			zhibiaoMinMax:null,
			zhibiaoMin:null,
			zhibiaoMax:null,
			maxMinName:null,
			switchScenes:false
		},function(){
			this._loadTableDataFromServer(this.props.data,true);
		});
	},
	_setZhibiaoFilter:function(filterFields,newMax){
		var filter=filterFields;
		for(var i=0;i<filter.length;){
			if(filter[i].type == "INDEX_FIELD"||filter[i].type == "COMPARE_INDEX_FIELD"){
				filter.splice(i,1);
			}else{
				i++
			}
		}
		filter=filter.concat(newMax);
		return filter;
	},
	_setSortFilterzhibiao:function(){
		if (!this.isMounted()) return;
			this.setState({
				currentPage:0,
				totalRowCount:1,
				sliceIndex:1,
				zhibiaoMinMax:null,
				zhibiaoMin:null,
				zhibiaoMax:null,
				maxMinName:null,
				topParameters:false,
				loading:true,
				zhibiaoFilter:false
			},function(){
				this._loadTableDataFromServer(this.props.data,true);
			});
	}
});
