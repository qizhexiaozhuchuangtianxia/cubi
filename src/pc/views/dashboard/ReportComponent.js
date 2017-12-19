/**
 * Created by Administrator on 2016-2-25.
 */
import {
    Component
} from 'react';
import $ from 'jquery';
import App from 'app';
import FilterFieldsComponent from './filter/FilterFieldsComponent';
import CompareComponent from './compare/CompareComponent';
import DataViewOfReport from '../common/dataView/DataViewOfReport';
import FilterFiledsStore from '../../stores/FilterFieldsStore';
import ReportStore from '../../stores/ReportStore';
import GlobalFilterStore from '../../stores/GlobalFilterStore';
import DrilDownStore from '../../stores/DrilDownStore';
import Loading from '../common/Loading';
class ReportComponent extends Component {
    displayName:'ReportComponent'
    constructor(props) {
        super(props);
        this.app = {}
        this._filterFieldsList=[]
        if(!this.reportInfo){
            this.reportInfo=JSON.parse(JSON.stringify(props.reportInfo))
        }
        this.state = {
            filterFields: [], //用于渲染报表数据的筛选
            filterFieldsList: [], //用于展示报表设置了哪些筛选器
            filterFieldsListLength: 0, //报表筛选器的长度
            typeState: '', //渲染报表需要的类型
            reportInfo: this.reportInfo,
            globalFilterSign:this.props.globalFilterSign,
            //filterSign:this.props.filterSign,
            clickHeader:this.props.clickHeader,
            gSign:false,
            reportId:this.props.report.id,
            Refresh:this.props.Refresh,
            drilDownData:[],
            goBackShow:false,
        };
    }
    componentWillReceiveProps(nextProps) {
        //reprotFilter
        /*start 上一次执行过的this.filterFieldsList*/
        let oldFilterFieldsList = JSON.stringify({
            fields: this.state.filterFieldsList
        });
        let oldFilterFieldsListPopData = JSON.parse(oldFilterFieldsList).fields;
        /*end 上一次执行过的this.filterFieldsList*/
        /*starte 修改了props之后从新遍历输出筛选器*/
        let filterFields = JSON.stringify({
            fields: nextProps.report.filterFields || []
        });
        let filterFieldsArr = JSON.parse(filterFields).fields;

        let filterFieldsPopData = FilterFiledsStore.setSelectedFilterFields(filterFieldsArr);

        /*end 修改了props之后从新遍历输出筛选器**/
        //start 初始化的时候 报表渲染用的默认筛选的值
        let defaultFilterFields = JSON.stringify({
            fields: nextProps.report.defaultFilterFileds || []
        });
        let defaultFilterFieldsArr = JSON.parse(defaultFilterFields).fields;
        let defaultFilterFieldsPopData = FilterFiledsStore.setSelectedFilterFields(defaultFilterFieldsArr);
        //start 初始化 如果有，默认筛选条件 并且在筛选器里面有相同名字的筛选器的时候
        let defaultFilterFieldsList = ReportStore.setFilterFields(defaultFilterFieldsPopData);

        let filterFieldsPopDataList = FilterFiledsStore.setFilterFields(filterFieldsPopData, defaultFilterFieldsArr);

        let newFilterFieldsPopDataList = FilterFiledsStore.setOldFitlerFieldsAndNowFilterFields(filterFieldsPopDataList, oldFilterFieldsListPopData);
        let newFilterFields=this.state.filterFields;
        if(nextProps.resetFielter){
            newFilterFields = App.deepClone(nextProps.report.filterFields);
            if(nextProps.report.defaultFilterFileds){
                newFilterFields = App.deepClone(nextProps.report.defaultFilterFileds);
            }
        }
        //全局筛选
        if(nextProps.globalFilterSign && GlobalFilterStore.globalSign){
            //驾驶舱分享页
            if(nextProps.globalFilterFields.globalFilterRead){
                newFilterFields=GlobalFilterStore.setDashboardReadFilters(nextProps.globalFilterFields.filterFields,nextProps.reportInfo.metadataId,newFilterFields);
            //驾驶舱
            }else{
                newFilterFields=GlobalFilterStore.reportPushFilters(nextProps.report.globalFilterFields,nextProps.reportInfo.metadataId,newFilterFields,nextProps.reportInfo,nextProps.weiduList);
            }
        }
        let newfilterFieldsList=GlobalFilterStore.setBtnStyle(nextProps.globalFilterSign,newFilterFieldsPopDataList,newFilterFields);
        if(nextProps.canShowState.canShowRowId==nextProps.row&&nextProps.canShowState.canShowColId==nextProps.col&&nextProps.canShowProps){
            App.emit('APP-DASHBOARD-REPORT-HEADER-SET-FILTER'+'_'+nextProps.row+'_'+nextProps.col, {
                row:nextProps.row,
                col:nextProps.col,
                filterFields: newFilterFields
            });
        }
        let weiduList=this.state.weiduList;
        let type=nextProps.reportInfo.type;
        let category=nextProps.report.category;
        let getCurDimension=FilterFiledsStore.getCurDimension(nextProps.report.globalFilterFields);
        //钻取 this.state.drilDown && 
        if(getCurDimension && getCurDimension.groupType!='' && ( type=='TREE' || type=='CATEGORY' || (category=='CHART' && type!="EchartsMap"))){
            let _this=this;
            let drilFilter=this.state.filterFields;
            
            let rowTitleFields=this.state.rowTitleFields;
            if(nextProps.globalFilterSign && GlobalFilterStore.globalSign){
                drilFilter=DrilDownStore.drilFilterInFilterFields(drilFilter,newFilterFields,this.state.drilDown);
                //全局筛选更新对应的维度 和 rowTitleFields
                let o=FilterFiledsStore.updateCloneWeiAndRowTitle(this.state.weiduList,this.state.cloneWeiduList,this.state.rowTitleFields,this.state.cloneRowTitleFields,
                    this.state.cloneDrilDownData,nextProps.report.globalFilterFields);
                rowTitleFields=o.rowTitleFields;
                weiduList=o.weiduList;
            }
            let drillLevelFilter=DrilDownStore.addDrillLevel(weiduList,drilFilter);
            let filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,newfilterFieldsList);
             _this.setState({
                    filterFields:drilFilter,
                    filterFieldsList: filterFieldsList,
                    filterFieldsListLength: filterFieldsList.length,
                    reportInfo: nextProps.reportInfo,
                    globalFilterSign:nextProps.globalFilterSign,
                    filterSign:nextProps.filterSign,
                    clickHeader:nextProps.clickHeader,
                    Refresh:nextProps.Refresh,
                    rowTitleFields:rowTitleFields,
                    weiduList:weiduList,
                    //drilDown:true
                });

            let drilDownData=FilterFiledsStore.initDrilDownParams(weiduList, drilFilter, rowTitleFields, [], true);
            
            FilterFiledsStore.setAllDataToLevel(weiduList,drilFilter,drilDownData).then(function(result){
                _this.setState({
                    drilDownData:result,
                });
                App.emit('APP-SET-BREAD-DRILDOWNDATA',result,_this.props.row,_this.props.col)
            });

        }else{
            this.setState({
                filterFields:newFilterFields,
                filterFieldsList: newfilterFieldsList,
                filterFieldsListLength: newfilterFieldsList.length,
                reportInfo:nextProps.reportInfo,
                globalFilterSign:nextProps.globalFilterSign,
                filterSign:nextProps.filterSign,
                clickHeader:nextProps.clickHeader,
                Refresh:nextProps.Refresh,
                weiduList:weiduList
            });
            if(nextProps.resetFielter){
                let _this=this;
                let drilFilter = newFilterFields;
                let weiduList = DrilDownStore.setWeiduList(App.deepClone(nextProps.weiduList),this.props.rowTitleFields)
                let getCurDimension=FilterFiledsStore.getCurDimension(nextProps.report.globalFilterFields);
                if((type=='TREE' || type=='CATEGORY' || (category=='CHART' && type!="EchartsMap")) && !this.props.globalFilterSign && !GlobalFilterStore.globalSign){                    
                    let rowTitleFields=this.props.rowTitleFields;
                    if(nextProps.globalFilterSign && GlobalFilterStore.globalSign){
                        drilFilter=DrilDownStore.drilFilterInFilterFields(drilFilter,newFilterFields,this.state.drilDown);
                        //全局筛选更新对应的维度 和 rowTitleFields
                        let o=FilterFiledsStore.updateCloneWeiAndRowTitle(this.props.weiduList,this.state.cloneWeiduList,rowTitleFields,this.state.cloneRowTitleFields,
                            this.state.cloneDrilDownData,nextProps.report.globalFilterFields);
                        rowTitleFields=o.rowTitleFields;
                        weiduList=o.weiduList;
                    }
                    let drillLevelFilter=DrilDownStore.addDrillLevel(weiduList,drilFilter);
                    let filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,newfilterFieldsList);
                    _this.setState({
                        filterFields:drilFilter,
                        filterFieldsList: filterFieldsList,
                        filterFieldsListLength: filterFieldsList.length,
                        reportInfo: nextProps.reportInfo,
                        globalFilterSign:nextProps.globalFilterSign,
                        filterSign:nextProps.filterSign,
                        clickHeader:nextProps.clickHeader,
                        Refresh:nextProps.Refresh,
                        rowTitleFields:rowTitleFields,
                        weiduList:weiduList,
                        //drilDown:true
                    });
                    let drilDownData=FilterFiledsStore.initDrilDownParams(weiduList, drilFilter, this.props.rowTitleFields, [], true);
                    FilterFiledsStore.setAllDataToLevel(weiduList,drilFilter,drilDownData).then(function(result){
                        _this.setState({
                            drilDownData:result,
                        });
                        App.emit('APP-SET-BREAD-DRILDOWNDATA',result,_this.props.row,_this.props.col)
                    });
                }
            }
        }
        //end 初始化 如果有，默认筛选条件 并且在筛选器里面有相同名字的筛选器的时候

    }
    componentWillMount() {
        /*starte 修改了props之后从新遍历输出筛选器*/
        let filterFields = App.deepClone(this.props.report.filterFields);
        let filterFieldsArr = filterFields;
        let filterFieldsPopData = FilterFiledsStore.setSelectedFilterFields(filterFieldsArr);
        /*end 修改了props之后从新遍历输出筛选器**/
        //start 初始化的时候 报表渲染用的默认筛选的值
        let defaultFilterFields = App.deepClone(this.props.report.defaultFilterFileds);
        let defaultFilterFieldsArr = defaultFilterFields;
        let defaultFilterFieldsPopData = FilterFiledsStore.setSelectedFilterFields(defaultFilterFieldsArr);
        let defaultFilterFieldsList = ReportStore.setFilterFields(defaultFilterFieldsPopData); //变成了驾驶舱渲染报表的数据结构
        //end 初始化的时候 报表渲染用的默认筛选的值
        //start 初始化 如果有，默认筛选条件 并且在筛选器里面有相同名字的筛选器的时候
        let filterFieldsPopDataList = FilterFiledsStore.setFilterFields(filterFieldsPopData, defaultFilterFieldsArr);
        //end 初始化 如果有，默认筛选条件 并且在筛选器里面有相同名字的筛选器的时候
        //start 判断当前报表的类型 用于输出去报表
        let typeState = "";
        let category=this.props.report.category;
        if (category == "CHART") {
            typeState = this.props.reportInfo.type;
        }

        //全局筛选
        if(this.props.globalFilterSign && GlobalFilterStore.globalSign){
            //驾驶舱分享页
            if(this.props.globalFilterFields.globalFilterRead){
                defaultFilterFieldsList=GlobalFilterStore.setDashboardReadFilters(this.props.globalFilterFields.filterFields,this.props.reportInfo.metadataId);
            //驾驶舱
            }else{
                defaultFilterFieldsList=GlobalFilterStore.reportPushFilters(this.props.report.globalFilterFields,this.props.reportInfo.metadataId,null,this.props.reportInfo,this.props.weiduList);
            }
        }
        let type=this.props.reportInfo.type;
        let weiduList=DrilDownStore.setWeiduList(App.deepClone(this.props.weiduList),this.props.rowTitleFields);
        let filters=this.props.drilDownFilterFields;
        defaultFilterFieldsList=DrilDownStore.drilDownFilterCoverDefaultFilter(defaultFilterFieldsList,filters,this.props.rowTitleFields);
        if(!this.reprotFilter){
            this.reprotFilter=JSON.parse(JSON.stringify(filters));
        }
        if(this.props.report.defaultFilterFileds){
            filters = App.deepClone(this.props.report.defaultFilterFileds);
        }
        if((type=='TREE' || type=='CATEGORY' || (category=='CHART' && type!="EchartsMap")) && !this.props.globalFilterSign && !GlobalFilterStore.globalSign){
            let _this=this;
            
            _this.setState({
                filterFields: defaultFilterFieldsList,
                filterFieldsList: filterFieldsPopDataList,
                filterFieldsListLength: filterFieldsPopDataList.length,
                typeState: '',
                weiduList:weiduList,
                cloneWeiduList:JSON.parse(JSON.stringify(weiduList)),
                rowTitleFields:this.props.rowTitleFields,
                cloneRowTitleFields:JSON.parse(JSON.stringify(this.props.rowTitleFields)),
                drilDown:false//filters.length>0 ? true : false
            });
            let drilDownData=FilterFiledsStore.initDrilDownParams(weiduList, filters, this.props.rowTitleFields, [], true);
            FilterFiledsStore.setAllDataToLevel(weiduList,filters,drilDownData).then(function(result){
                _this.setState({
                    drilDownData:result,
                    cloneDrilDownData:JSON.parse(JSON.stringify(result))
                });
                App.emit('APP-SET-BREAD-DRILDOWNDATA',result,_this.props.row,_this.props.col)

            });
        }else{
            this.setState({
                filterFields: defaultFilterFieldsList,
                filterFieldsList: filterFieldsPopDataList,
                filterFieldsListLength: filterFieldsPopDataList.length,
                typeState: '',
                weiduList:weiduList,
                cloneWeiduList:JSON.parse(JSON.stringify(weiduList)),
                cloneRowTitleFields:JSON.parse(JSON.stringify(this.props.rowTitleFields)),
                rowTitleFields:this.props.rowTitleFields,
            });
        }
    }
    componentDidMount() {
        this.app['APP-DASHBOARD-CLEAR-REPORT-REFRESH-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-CLEAR-REPORT-REFRESH-BUTTON-HANDLE', this._clickReportRefreshButtonHandle.bind(this));
        //关闭驾驶舱报表筛选条件的弹出框的方法
        this.app['APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS'] = App.on('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS', this._modifyFilterFieldsHandle.bind(this));
        //当前报表切换图形类型 刷新当前报表
        this.app['APP-DASHBOARD-TOGGLE-CHAR-TYPE-REFRESH-HANDLE'] = App.on('APP-DASHBOARD-TOGGLE-CHAR-TYPE-REFRESH-HANDLE', this._toggleCharTypeRefreshHandle.bind(this));
        //驾驶舱  如果关闭了图形切换按钮之后重置报表展示效果
        this.app['APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE'] = App.on('APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE', this._resetReportHandle.bind(this));
        //组件加载完成之后给返回按钮绑定一个返回时间 点击返回按钮 返回上一级页面
        //this.app['APP-DASHBOARD-SET-REPORT-FILTER-VALUES'] = App.on('APP-DASHBOARD-SET-REPORT-FILTER-VALUES', this._setFilterValues.bind(this));
       //图形钻取
        this.app['APP-REPORT-SET-DRILL-CHART'] = App.on('APP-REPORT-SET-DRILL-CHART', this._setDrillChart.bind(this));
        //修改钻取参数
        this.app['APP-REPORT-SET-DRILL-FILTER'] = App.on('APP-REPORT-SET-DRILL-FILTER', this._setDrillFilter.bind(this));
        // 日期钻取
        this.app['APP-REPORT-SET-DRILL-DATE-FILTER'] = App.on('APP-REPORT-SET-DRILL-DATE-FILTER', this._setDrillFilter.bind(this));

        //错误数据处理
        this.app['APP-REPORT-SET-DRILL-ERROR-FILTER'] = App.on('APP-REPORT-SET-DRILL-ERROR-FILTER', this._setDrillErrorFilter.bind(this));
        //全局筛选日期时，重置drilDown
        this.app['APP-DRIL-SET-DRILDOWN'] = App.on('APP-DRIL-SET-DRILDOWN',this._setDrilDown.bind(this));

        //面包屑返回更新drilDownFilter
         this.app['APP-UPDATE-DRILL-BREADCRUMBTOP-DASHBOARD'] = App.on('APP-UPDATE-DRILL-BREADCRUMBTOP-DASHBOARD', this._updatadrilDate.bind(this));
          //面包屑 日期返回
        this.app['APP-UPDATE-DRILL-DATE-BREADCRUMBTOP'] = App.on('APP-UPDATE-DRILL-DATE-BREADCRUMBTOP',this._setBackDrillDateFilter.bind(this));
    }
    componentWillUnmount() {
        for (let i in this.app) {
            this.app[i].remove();
        }
    }
    breadDirDownLen(dirDownLen){
        var breadLen = dirDownLen;
        var allHeight = breadLen*29+95;
        if(breadLen>0){
            allHeight = breadLen*29+75;
        }
        return allHeight;
    }
    render() {

        let colContentClassName = 'dashboardView_col_content';
        let charViewClassName = 'reportShowBox';
        let _this = $(this);
        let style={};
        let strFilterFields = JSON.stringify(this.state.filterFields);
        let pageSize = parseInt((this.props.height - 106) / 48);
        let customCellWidthArr = JSON.stringify(this.props.report.columnAttributes || []);
        let reportShowBoxHei = this.props.height;
        let contentpadding = ' 24';
        let reportInfo = App.deepClone(this.state.reportInfo);
        reportShowBoxHei = pageSize * 49 + 56 * 2 + 1;
        if (this.props.report.category == "INDEX") {
            colContentClassName += ' dashboardView_col_content_table';
            contentpadding = ' 0';
        } else if (this.props.report.category == "CHART") {
            reportShowBoxHei -= 24;
        }
        if (this.props.canShowProps) {
            if (this.props.canShowState.canShowColId == this.props.col && this.props.canShowState.canShowRowId== this.props.row) {
                if (this.state.filterFieldsListLength == 0) {
                    if ((this.props.report.showCharIcon == false) || (this.props.report.showCharIcon == undefined)) {
                        // 点击header计算表格/图形的 padding
                        var allHeight = this.breadDirDownLen(this.props.canShowState.dirDownDatasLen)
                        colContentClassName = "dashboardView_col_content";

                        style={
                            padding:allHeight+'px 0px '+ contentpadding+'px 0px'
                        }
                    }

                } else {
                    if ((this.props.report.showCharIcon == false) || (this.props.report.showCharIcon == undefined)) {
                        // 点击header计算表格/图形的 padding
                        var allHeight = this.breadDirDownLen(this.props.canShowState.dirDownDatasLen)
                        colContentClassName = "dashboardView_col_content";
                        style={
                            padding:allHeight+'px 0px '+contentpadding+'px 0px'
                        }

                    }

                }
            }
        }
        if(reportInfo.compare){
            reportInfo.compareInfo.compareDimension.map(function(item){
                delete item.weiItem;
            })
        }
        return (
            <div className={colContentClassName} style={style}>
                {this._filterFieldsHandle()}
                <CompareComponent
                    reportInfo={this.state.reportInfo}
                    reportType={this.state.typeState}
                    row={this.props.row}
                    col={this.props.col}
                />
                <div className={charViewClassName} style={{height:reportShowBoxHei}}>
                    <DataViewOfReport
                      reportInfo={reportInfo}
                      filterFields={strFilterFields}
                      customCellWidthArr={customCellWidthArr}
                      reportId={this.state.reportId}
                      tables={true}
                      width={this.props.width-48}
                      height={reportShowBoxHei}
                      showPager={true}
                      pageSize={pageSize}
                      reportType={this.state.typeState}
                      row={this.props.row}
                      col={this.props.col}
                      globalFilterFields={this.props.globalFilterFields}
                      globalFilterSign={this.state.globalFilterSign}
                      clickHeader={this.state.clickHeader}
                      Refresh={this.state.Refresh}
                      weiduList={this.state.weiduList}
                      drilDownFilter={this.state.drilDownData}
                      rowTitleFields={this.state.rowTitleFields}/>
                </div>
            </div>
        )
    }
    _filterFieldsHandle() { //输出筛选器的方法
        if (this.state.filterFields != undefined) {
            if (this.state.filterFieldsListLength > 0) {
                return <FilterFieldsComponent
                            reportInfo={this.state.reportInfo}
                            col={this.props.col}
                            row={this.props.row}
                            reportId={this.props.report.id}
                            filterFields={this.state.filterFieldsList}
                            globalFilterFields={this.props.globalFilterFields}
                            clickHeader={this.state.clickHeader}
                            report={this.props.report}
                            drilDownData={this.state.drilDownData}
                            drilDown={this.state.drilDown}/>
            }
        }
    }
    _clickReportRefreshButtonHandle(itemObj) { //点击驾驶舱头部刷新按钮执行的方法
        var _this = this;
        setTimeout(function() {
            if (itemObj.row == _this.props.row && itemObj.col == _this.props.col) {
                _this.setState(function(previousState, currentProps) {
                    previousState.reportId = itemObj.reportAreaId;
                    previousState.Refresh = true;
                    return {
                        previousState
                    };
                });
            }
        }, 500)
    }
    _modifyFilterFieldsHandle(obj) { //点击了筛选值之后修改report组件的筛选器的状态
        //全局筛选
        if(GlobalFilterStore.globalSign && !obj.clear){
            this.setState({
                drilDown:false
            });
            App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER',obj);
            return;
        }
        //非全局筛选
        if (obj.col == this.props.col && obj.row == this.props.row && !obj.globalFilterSign) {
            let defaultFilterFields = JSON.stringify({
                fields: this.props.report.defaultFilterFileds || []
            });
            let defaultFilterFieldsArr = JSON.parse(defaultFilterFields).fields;
            let defaultFilterFieldsPopData = FilterFiledsStore.setSelectedFilterFields(defaultFilterFieldsArr);
            var filterFieldsList=this.state.filterFieldsList;
            var filterFields=this.state.filterFields;
            if (obj.clear) {
                filterFields=[];
            }

            if (obj.clear) {
                for (let i = 0; i < filterFieldsList.length; i++) {
                    if (filterFieldsList[i].valueType == 'DATE_CYCLE' || filterFieldsList[i].valueType == 'DATE_RANGE') {
                        filterFieldsList[i].valueType = 'DATE';
                    }
                    filterFieldsList[i].popData = [];
                }
            } else {
                for (let i = 0; i < filterFieldsList.length; i++) {
                    if (filterFieldsList[i].fieldName == obj.dbField || filterFieldsList[i].name===obj.name) {
                        if (filterFieldsList[i].dataType==="DATE") { //日期类型的赋值
                            filterFieldsList[i].valueType = obj.dateType;
                        }
                        filterFieldsList[i].popData = obj.seletedArr;
                    }
                }
            }

            let filterFieldsData = [];
            if (obj.clear) {
                filterFieldsData = FilterFiledsStore.filterFiledsAndDefaultFilterFileds(filterFieldsList, []);
            } else {
                filterFieldsData = FilterFiledsStore.filterFiledsAndDefaultFilterFileds(filterFieldsList, defaultFilterFieldsPopData);
            }

            filterFields=GlobalFilterStore.concatReportFilter(filterFieldsData,filterFields);
            
            var _this=this;
            var drilDownData=this.state.drilDownData;
            if(obj.clear){
                drilDownData=FilterFiledsStore.initDrilDownParams(this.state.weiduList,filterFields,this.state.rowTitleFields,[],true)
            }

            FilterFiledsStore.setAllDataToLevel(this.state.weiduList,filterFields,drilDownData).then(function(result){
                //var filter=GlobalFilterStore.setfilterFieldsValueType(filterFields);
                var newDrilDownData = DrilDownStore.setDrillFilter(filterFields,result);
                 App.emit('APP-SET-BREAD-DRILDOWNDATA',newDrilDownData,obj.row,obj.col);

                _this.setState({
                    drilDownData:newDrilDownData,
                    filterFieldsList:filterFieldsList,
                    filterFields:filterFields,
                    clickHeader:false,
                    drilDown:false
                });
                if(_this.props.row==obj.row&&_this.props.col==obj.col&&_this.props.canShowProps){
                     App.emit('APP-DASHBOARD-REPORT-HEADER-SET-FILTER'+'_'+obj.row+'_'+obj.col, {
                        row:obj.row,
                        col:obj.col,
                        filterFields: filterFields
                    });
                 }
            });
        }
    }
    _toggleCharTypeRefreshHandle(obj) { //点击驾驶舱底部切换图形的方法
        if (obj.row == this.props.row && obj.col == this.props.col) {
            this.setState({
                typeState: obj.charType
            })
        }
    }
    _resetReportHandle(obj) { //当在编辑状态 关闭了显示图形的按钮之后 舒心报表图形类型 是默认的
        if (obj.row == this.props.row && obj.col == this.props.col) {
            this.setState({
                typeState: this.props.reportInfo.type
            })
        }
    }
    _getReportInfo(reportId) {
        return new Promise(function(resolve, reject) {
            ReportStore.getAreaInfo(reportId).then(function(result) {
                if (result.success) {
                    return resolve(result.dataObject);
                } else {
                    return reject(result.message);
                }
            });
        })
    }
    _setDrillChart(drillDownArr){
        if (drillDownArr[0].row != this.props.row || drillDownArr[0].col != this.props.col) {
            return;
        }
        GlobalFilterStore.globalSign=false;
        // var drilDownFilter=this.state.drilDownData;
        var  drilDownFilter=drillDownArr;//FilterFiledsStore.concatFilter(this.state.drilDownData,drillDownArr);
        var newFilterFields=this.state.filterFields;
        var rowTitleFields=this.state.rowTitleFields;
        var newWeiduList=[];
        for(var i=0;i<drillDownArr.length;i++){
            if(drillDownArr[i].type=='GROUP_DATE_TITLE_FIELD'){
                newFilterFields=FilterFiledsStore.setDrillDateFilter(drillDownArr[i].weiduList,drillDownArr[i],newFilterFields);
                // drilDownFilter=FilterFiledsStore.concatDateFilter(drilDownFilter,drillDownArr[i]);
                //当钻取的筛选条件 少于 分析中保存的筛选时 选择分析
                var filterObj=FilterFiledsStore.setReportFilterToDashboard(this.reprotFilter,newFilterFields,drillDownArr[i].dimensionId);
                newFilterFields=filterObj.filterFields;
            }else if(drillDownArr[i].type==='GROUP_TITLE_FIELD'){
                newFilterFields=ReportStore.setDrillFilter(drilDownFilter,drillDownArr[i],newFilterFields,drillDownArr[i].weiduList);
                
            }
            
            var filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,this.state.filterFieldsList);
            var matchedWeidu=FilterFiledsStore.matchWeiduList(drillDownArr[i]);
            if(matchedWeidu){
                newWeiduList.push(matchedWeidu);
            }
            rowTitleFields=DrilDownStore.setRowTitleFieldsLevel(rowTitleFields,newWeiduList);
            
            var drillLevelFilter=DrilDownStore.addDrillLevel(newWeiduList,newFilterFields);
            rowTitleFields=FilterFiledsStore.setSaveDrillLevel(rowTitleFields,drilDownFilter);
        }
        this.setState({ 
            drilDownData: drilDownFilter,
            weiduList:newWeiduList,
            filterFields:newFilterFields,
            rowTitleFields:rowTitleFields,
            filterFieldsList:filterFieldsList,
            drilDown:true,
            reportInfo:this.reportInfo
        });
        App.emit('APP-SET-BREAD-DRILDOWNDATA',drilDownFilter,drilDownFilter[0].row,drilDownFilter[0].col);
    }
    //树形维度钻取和日期钻取
    _setDrillFilter(obj){
        if (obj.row != this.props.row || obj.col != this.props.col) {
            return;
        }
        GlobalFilterStore.globalSign=false;
        var drilDownFilter=this.state.drilDownData;
        var newFilterFields=this.state.filterFields;
        if(obj.type=='GROUP_DATE_TITLE_FIELD'){
            newFilterFields=FilterFiledsStore.setDrillDateFilter(obj.weiduList,obj,this.state.filterFields);
            drilDownFilter=FilterFiledsStore.concatDateFilter(this.state.drilDownData,obj);
        }else{
            drilDownFilter=FilterFiledsStore.concatFilter(this.state.drilDownData,[obj]);
            newFilterFields=ReportStore.setDrillFilter(drilDownFilter,obj,this.state.filterFields,obj.weiduList);
        }
        //当钻取的筛选条件 少于 分析中保存的筛选时 选择分析
        var filterObj=FilterFiledsStore.setReportFilterToDashboard(this.reprotFilter,newFilterFields,obj.dimensionId);
        newFilterFields=filterObj.filterFields;
        var rowTitleFields=DrilDownStore.setRowTitleFieldsLevel(this.state.rowTitleFields,obj.weiduList);
        rowTitleFields=FilterFiledsStore.setSaveDrillLevel(rowTitleFields,drilDownFilter);
        var drillLevelFilter=DrilDownStore.addDrillLevel(obj.weiduList,newFilterFields);
        var filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,this.state.filterFieldsList);
        this.setState({
            drilDownData: drilDownFilter,
            weiduList:obj.weiduList,
            filterFields:newFilterFields,
            rowTitleFields:rowTitleFields,
            filterFieldsList:filterFieldsList,
            drilDown:true,
            reportInfo:this.reportInfo
        });
        App.emit('APP-SET-BREAD-DRILDOWNDATA',drilDownFilter,obj.row,obj.col);
    }
   
    //错误数据钻取 
    _setDrillErrorFilter(obj){
        if (obj.row != this.props.row || obj.col != this.props.col) {
            return;
        }
        GlobalFilterStore.globalSign=false;
        var newDrilDown=FilterFiledsStore.setDrillErrorFilter(obj,this.state.weiduList,this.state.drilDownData);
        var newFilterFields=ReportStore.setDrillFilter(newDrilDown.drilDownFilter,newDrilDown.newDrilDownFilter,this.state.filterFields,this.state.weiduList);
        var rowTitleFields=FilterFiledsStore.setSaveDateDrillLevel( this.state.rowTitleFields,newDrilDown.drilDownFilter);
        this.setState({
           drilDownData:newDrilDown.drilDownFilter,
           weiduList:newDrilDown.weiduList,
           filterFields:newFilterFields,
           rowTitleFields:rowTitleFields,
           drilDown:true
        });
        App.emit('APP-SET-BREAD-DRILDOWNDATA',newDrilDown.drilDownFilter,obj.row,obj.col);
    }
    _setDrilDown(){
        this.setState({
           drilDown:false
        });
    }
     _updatadrilDate(param,row,col){
        if (row != this.props.row || col != this.props.col) {
           return;
        }
        var weiduList = this.state.weiduList;
        var dimensionId = param.dimensionId;
        var rowTitleFields = this.state.rowTitleFields;
        var drilDownFilter=this.state.drilDownData;
        var newFilterFields=this.state.filterFields;
        var  newweiduList = FilterFiledsStore.resetweiduList(this.state.weiduList,param);
        drilDownFilter=FilterFiledsStore.concatFilter(this.state.drilDownData,[param]);
        param.back=true;
        newFilterFields=ReportStore.setDrillFilter(drilDownFilter,param,this.state.filterFields,newweiduList);
        var rowTitleFields=DrilDownStore.setRowTitleFieldsLevel(this.state.rowTitleFields,newweiduList);
        rowTitleFields=FilterFiledsStore.setSaveDrillLevel(rowTitleFields,drilDownFilter);
        var drillLevelFilter=DrilDownStore.addDrillLevel(newweiduList,newFilterFields);
        var filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,this.state.filterFieldsList,true);
        this.setState({
            drilDownData: drilDownFilter,
            weiduList:newweiduList,
            filterFields:newFilterFields,
            rowTitleFields:rowTitleFields,
            filterFieldsList:filterFieldsList,
        });
         App.emit('APP-SET-BREAD-DRILDOWNDATA',drilDownFilter,row,col)
    }
    _setBackDrillDateFilter(arg){
        if (arg.row != this.props.row || arg.col != this.props.col) {
           return;
        }
        var weiduList = this.state.weiduList;
        var dimensionId = arg.drilDownFilter.dimensionId;
        var rowTitleFields = this.state.rowTitleFields;
        var filterFields = this.state.filterFields;
        var drilDownFilter=this.state.drilDownData;
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].type=='GROUP_DATE_TITLE_FIELD' && drilDownFilter[i].dimensionId==arg.dimensionId){
                drilDownFilter[i]=arg.drilDownFilter;
            }
        }
        for(var h=0;h<filterFields.length;h++){
            if(filterFields[h].name==arg.drilDownFilter.fieldName){
                if(!arg.drilDownFilter.drillFilter){
                    filterFields.splice(h,1);
                }else{
                    filterFields[h].value=arg.drilDownFilter.drillFilter;
                }
                
            }
        }
        for(var j=0;j<weiduList.length;j++){
            if(weiduList[j].name==arg.drilDownFilter.dimensionId){
                weiduList[j].level = arg.drilDownFilter.level;
                 weiduList[j].change=true;
            }
        }

        var  newweiduList = FilterFiledsStore.resetweiduList(this.state.weiduList,arg.drilDownFilter);
        drilDownFilter=FilterFiledsStore.concatFilter(this.state.drilDownData,[arg.drilDownFilter]);
        var rowTitleFields=DrilDownStore.setRowTitleFieldsLevel(this.state.rowTitleFields,newweiduList);
        rowTitleFields=FilterFiledsStore.setSaveDrillLevel(rowTitleFields,drilDownFilter);
        var drillLevelFilter=DrilDownStore.addDrillLevel(newweiduList,filterFields);
        var filterFieldsList=DrilDownStore.setFilterFieldsList(drillLevelFilter,this.state.filterFieldsList,true);
        this.setState({
            drilDownData: drilDownFilter,
            weiduList:weiduList,
            filterFields:filterFields,
            rowTitleFields:rowTitleFields,
            filterFieldsList:filterFieldsList,
        })

        App.emit('APP-SET-BREAD-DRILDOWNDATA',drilDownFilter,arg.row,arg.col)
        
    }
}
export default ReportComponent;
