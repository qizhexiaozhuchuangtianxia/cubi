var $     = require('jquery');
var React = require('react');

var {
    PropTypes
} = React;

var ReactDOM = require('react-dom');
var App = require('app');
var Tabs = require('./common/Tabs');

var BottomButton = require('./report/BottomButton');
var ScenesView = require('./report/ScenesView');

var SaveBotton = require('./report/SaveBotton');
var SaveAsBotton = require('./report/SaveAsBotton');
var ChartTypeStore = require('../stores/ChartTypeStore');
var ReportStore = require('../stores/ReportStore');
var FilterFieldsStore = require('../stores/FilterFieldsStore');
var CompareStore = require('../stores/CompareStore');
var metaDataStore = require('../stores/MetaDataStore');
var FusionChartConfig = require('./report/FusionChartConfig');
var ChartViewConfig = require('./common/ChartViewConfig');

var Loading = require('./common/Loading');
var SetReportNameView = require('./report/SetReportNameView');
var ArrowDropRight = require('material-ui/svg-icons/navigation-arrow-drop-right');
var MatadataBotton = require('./report/MatadataBotton');
var ReportTableView = require('./report/ReportTableView');
var ReportChartView = require('./report/ReportChartView');
var CompareHeader = require('./report/CompareHeader');
//Table View 最低显示的行数
const TABLE_VIEW_ROW_NUMBER_MIN = 1;

var {
    FloatingActionButton,
    IconMenu,
    IconButton,
    MenuItem,
    Popover
} = require('material-ui');

var {
    Router
} = require('react-router');

module.exports = React.createClass({
    displayName: 'report',
    propTypes: {
        params: React.PropTypes.object.isRequired
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        return {}
    },
    getInitialState: function() {
        var action = this.props.params.action;
        action = action.toUpperCase();
        var chartType = ChartTypeStore.getDefaultChartType();
        this.parameters={};
        return {
            reportId: this.props.location.query.reportId || null,
            error: null, //不为NULL,则发生错误
            currentName: null, //点击创建报表进来的时候头部显示为空，如果添加了了名字就设置它 从而显示创建的名字
            action: action, //用户动作：CREATE:创建 / EDIT:编辑
            loaded: false,
            hasInitial: false, //是否已经初始化？
            metadataId: null,
            chartType: chartType.type, //当前图表类型
            dragWeiduList: [],
            weiduList: [], //当前维度列表
            zhiBiaoList: [], //当前指标列表
            columnTitleFieldsList: [], //交叉表 行维度
            rowTitleFieldsList: [], //交叉表 列维度
            dragZhibiaoList: [],
            dragHejiList: [],
            dragPingjunList: [],
            dragMaxList: [],
            dragMinList: [],
            dragJishuList: [],
            dragJisuanlieList:[],
            filterData: [],
            filterFields: [], //当前用户筛选
            filterLoaded: false,
            modelId: 0, //表格ID
            reportType: 'BASE',
            reportCategory: 'INDEX',
            tableType: false,
            tableName: '',
            parentId: this.props.location.query.dirId || null,
            saveAsTableName: '',
            submitFun: this._handleSetReportNameOK,
            reportDirectoryId: this.props.location.query.dirId,
            tableViewRowNumber: TABLE_VIEW_ROW_NUMBER_MIN, //Table View 显示的行数
            canEdited: this.props.location.query.canEdited, //编辑权限 默认是不可以编辑的
            showSetReportNameDialog: false, //显示设置报表名称对话框
            saveDisabled: true, //保存是否可以点击 如果是真 则不能点击 反之则能点击
            saveAsDisabled: true, //另存按钮是否可以点击 如果是真 则不能点击 反之则能点击
            // formulas:{},
            formulas:false,
            nextlevelOpen: false,
            laststageOpen: false,
            curPage:1,
            openDialog:false,
            kpiConfig:{},
            multiAxisLineSetting: { yAxis: [], indexs: [] },
            sortTopParam:null,
            drilDownFilter:[],
            rowTitleFields:[],
            maxMin:false,
            topParameters:false,
            sortFields: false,
            exportData:this.props.location.query.exportData,
            exportDataModel:this.props.location.query.exportDataModel
            //topParameters:[],
        }
    },
    app: {},
    componentDidMount: function() {
        localStorage.removeItem('selectValue')
        this._addSaveAndSaveAsBtnHandle();
        this._btnCanClickHandle(this.state.action,this.state.canEdited);
            //订阅用户选择的立方事件
        this.app['APP-REPORT-USER-CHOOSED-META-DATA'] = App.on('APP-REPORT-USER-CHOOSED-META-DATA', this._userChoosedMetaDataHandler);
        //订阅维度、指标改变事件
        this.app['APP-REPORT-WEIDU-ZHIBIAO-CHANGED'] = App.on('APP-REPORT-WEIDU-ZHIBIAO-CHANGED', this._weiduZhiBiaoChangedHandler);
        //订阅图表类型改变事件
        this.app['APP-REPORT-TYPE-CHANGED'] = App.on('APP-REPORT-TYPE-CHANGED', this._chartTypeChangedHandler);
        //订阅图表类型改变事件
        this.app['APP-REPORT-SAVE'] = App.on('APP-REPORT-SAVE', this._saveReport);
        //另存为方法
        this.app['APP-REPORT-SAVE-AS'] = App.on('APP-REPORT-SAVE-AS', this._saveAsReport);
        this.app['APP-REPORT-OPEN-SET-REPORT-NAME-HANDLE'] = App.on('APP-REPORT-OPEN-SET-REPORT-NAME-HANDLE', this._openSetReportNameHandle);
        //重新加载图形数据
        this.app['APP-SET-RELOAD-DATA'] = App.on('APP-SET-RELOAD-DATA', this._reloadData);
        //进入从分析列表点击添加创建分析进到创建页面 点击返回按钮的方法
        this.app['APP-CREATE-REPORT-GO-BACK-HANDLE'] = App.on('APP-CREATE-REPORT-GO-BACK-HANDLE', this._createBackHandle); //进入从分析列表点击添加创建分析进到创建页面 点击返回按钮的方法
        this.app['APP-REPORT-FILTERDATA-CHANGED'] = App.on('APP-REPORT-FILTERDATA-CHANGED', this._changeFilterData);
        this.app['APP-GET-TABLE-NAME'] = App.on('APP-GET-TABLE-NAME', this._changeTableName);
        //设置报表排序的方法
        this.app['APP-REPORT-SET-SORT-HANDLE'] = App.on('APP-REPORT-SET-SORT-HANDLE', this._setSortHandle);
        this.app['APP-REPORT-FILTER-FILEDDATA-LOADED'] = App.on('APP-REPORT-FILTER-FILEDDATA-LOADED', this._filterFieldsLoaded)
        this.app['APP-REPORT-SET-FORMULAS'] = App.on('APP-REPORT-SET-FORMULAS', this._setFormulas);
        //kpi
        this.app['APP-REPORT-SET-KPI'] = App.on('APP-REPORT-SET-KPI', this._setKPIConfig);

        // 高级复合图设定
        this.app['APP-REPORT-SET-MULTIAXISLINE-SETTING'] = App.on('APP-REPORT-SET-MULTIAXISLINE-SETTING', this._setMultiAxisLineSetting);

        //this.app['APP-REPORT-CLOSE-FORMULAS'] = App.on('APP-REPORT-CLOSE-FORMULAS', this._setHuizongClose);
        this.app['APP-REPORT-SET-TABLE-FIELDS'] = App.on('APP-REPORT-SET-TABLE-FIELDS',this._setTableFields);
        App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
            toggle: true,
            func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
        });

        App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
            toggle: true,
            func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
        });
        //add for update table custom arr
        this.app['APP-UPDATE-TABLE-CUSTOM-ARR'] = App.on('APP-UPDATE-TABLE-CUSTOM-ARR', this._updateTableCustomArr);

        //this.app['APP-REPORT-SET-FILTER'] = App.on('APP-REPORT-SET-FILTER', this._setSortFilter);
        //图形钻取
        this.app['APP-REPORT-SET-DRILL-CHART'] = App.on('APP-REPORT-SET-DRILL-CHART', this._setDrillChart);
        //表格钻取
        this.app['APP-REPORT-SET-DRILL-FILTER'] = App.on('APP-REPORT-SET-DRILL-FILTER', this._setDrillFilter);
        // 面包屑
         this.app['APP-UPDATE-DRILL-BREADCRUMBTOP'] = App.on('APP-UPDATE-DRILL-BREADCRUMBTOP', this._updatadrilDate);
        // 日期钻取
        this.app['APP-REPORT-SET-DRILL-DATE-FILTER'] = App.on('APP-REPORT-SET-DRILL-DATE-FILTER', this._setDrillDateFilter);
        //this.app['APP-REPORT-SET-BREAD-DATA'] = App.on('APP-REPORT-SET-BREAD-DATA', this._updataBreadData);
        //面包屑 日期返回
        this.app['APP-UPDATE-DRILL-DATE-BREADCRUMBTOP'] = App.on('APP-UPDATE-DRILL-DATE-BREADCRUMBTOP',this._setBackDrillDateFilter);
        //错误数据处理
        this.app['APP-REPORT-SET-DRILL-ERROR-FILTER'] = App.on('APP-REPORT-SET-DRILL-ERROR-FILTER', this._setDrillErrorFilter);
        // 筛选图形类型切换
       this.app['APP-OPDATA-SET-REPORT-TYPE'] = App.on('APP-OPDATA-SET-REPORT-TYPE', this._updataNewtype);
        //  对比时更改指标重命名
        this.app['APP-REPORT-SET-COMPAREINFO'] = App.on('APP-REPORT-SET-COMPAREINFO', this._updataZhibiaoCustomName);
        //指标排序
        this.app['APP-REPORT-SET-ZHIBIAO-SORT'] = App.on('APP-REPORT-SET-ZHIBIAO-SORT', this._setSortFields);
        //指标数据范围
        this.app['APP-REPORT-SET-ZHIBIAO-MAXMIN'] = App.on('APP-REPORT-SET-ZHIBIAO-MAXMIN', this._setSortMaxMin);
        // 指标topn
        this.app['APP-REPORT-SET-ZHIBIAO-TOPN'] = App.on('APP-REPORT-SET-ZHIBIAO-TOPN', this._setSortTopn);
        //图形清空筛选
        this.app['APP-EMPTY-ZHIBIAO-FILTER'] = App.on('APP-EMPTY-ZHIBIAO-FILTER', this._emptyZhibiaoFilter);

        //表格清空筛选 不包括排序
        this.app['APP-REPORT-SET-NOPFILTER'] = App.on('APP-REPORT-SET-NOPFILTER', this._setNoFilter);
    },
    _updataNewtype: function(param){
         this.setState({
            reportType:param.reportType
        })
    },
    componentDidUpdate: function() {
        this._addSaveAndSaveAsBtnHandle();
    },
    //初始化面包屑数据
    _initDrilDownParams:function(state){
        var rowTitleFields=state.rowTitleFields;
        if(state.reportCategory=='CHART'){
            rowTitleFields=state.categoryFields;
        }
        var drilDownFilter=FilterFieldsStore.initDrilDownParams(state.weiduList,state.filterFields,rowTitleFields,[],true)
        return FilterFieldsStore.setAllDataToLevel(state.weiduList,state.filterFields,drilDownFilter).then(function(result){
            state.drilDownFilter=result;
            return state;
        });
    },
    //校验计算列
    _validateExpression:function(state){
        var areaInfo = ReportStore.setAreaInfo(state);
        return ReportStore.validataExpressionAll(areaInfo.dataObject,state.zhiBiaoList).then(function(result){
            return state;
        });
    },
    _updataGetextends:function(state){
         var _t=this;
         return ReportStore.getExtends({
                "resourceId": _t.props.location.query.reportId,
                "key": "MultiAxisLineSetting"
            }).then(function (setting) {
                if (setting && setting.dataObject && setting.dataObject.extend) {
                    var _obj=JSON.parse(setting.dataObject.extend);
                    // ChartTypeStore.updateMultiAxis(_obj)
                    _t.setState({
                        multiAxisLineSetting:_obj
                    });
                }
            });
            return state
    },
    componentWillMount: function() {
        var _t=this;
        if (!_t.props.location.query.reportId) {
            _t.setState({
                loaded: true
            })
        } else {
            _t._loadData(_t.props.location.query.reportId)
            .then(_t._initDrilDownParams)
            .then(_t._validateExpression)
            .then(_t._updataGetextends)
            .then(function(state){
                _t.setState(state);
            });

            ReportStore.getKPIOptionReport({
                "resourceId": _t.props.location.query.reportId,
                "key": "KPISetting"
            }).then(function(kpiData){
                if (kpiData && kpiData.dataObject && kpiData.dataObject.extend) {
                    var _obj=JSON.parse(kpiData.dataObject.extend);
                    _t.setState({
                        kpiConfig:_obj
                    });
                }
            });
           
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            reportId:nextProps.location.query.reportId
        })
         App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
            toggle: true,
            func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
        });
    },
    componentWillUnmount: function() {
        App.emit('APP-COMMANDS-REMOVE');
        //取消订阅
        for (var i in this.app) {
            this.app[i].remove()
        }
        //$(window).off('resize', this._calcTableViewRows);
    },
    fields:null,
    render: function() {
        if (!this.state.loaded) {
            return (
                <Loading/>
            );
        }
        if (this.state.error) {
            return (
                <div className="reportBoxPanel">
                    <div className="reportBoxPanelMin">
                        <div className="cubi-error noGetReportError">{this.state.error}</div>
                    </div>
                </div>
            );
        }
        var areaInfo = ReportStore.setAreaInfo(this.state,this.state.sortTopParam);
        var mainView = null;
        var footerBtn = null;
        var drilFilters = this.state.drilDownFilter;
        // 基本表 汇总表 交叉表 KPI 不能钻取
        if(this.state.reportType=='BASE' || this.state.reportType=="CROSS" || this.state.reportType=="KPI" || this.state.reportType=="EchartsMap"){
            drilFilters=[];
        }
        if (this.state.hasInitial) {
            footerBtn = <BottomButton
            reportId={this.props.location.query.reportId}
            reportType={this.state.reportType}
            reportCategory={this.state.reportCategory}
            tableType={this.state.tableType}
            tableName={this.state.tableName}
            rowTitleFieldsList={this.state.rowTitleFieldsList}
            columnTitleFieldsList={this.state.columnTitleFieldsList}
            weiduList={this.state.weiduList}
            zhiBiaoList={this.state.zhiBiaoList}
            dragWeiduList={this.state.dragWeiduList}
            dragZhibiaoList={this.state.dragZhibiaoList}
            dragHejiList={this.state.dragHejiList}
            dragJisuanlieList={this.state.dragJisuanlieList}
            dragPingjunList={this.state.dragPingjunList}
            dragMaxList={this.state.dragMaxList}
            dragMinList={this.state.dragMinList}
            dragJishuList={this.state.dragJishuList}
            dragWeiduJishuList={this.state.dragWeiduJishuList}
            filterData={this.state.filterData}
            filterFields={this.state.filterFields}
            metaDataId={this.state.metadataId}
            filterLoaded={this.state.filterLoaded}
            currentCanEdited={this.props.location.query.currentCanEdited}
            areaInfo={areaInfo.dataObject}
            drilDownFilter={drilFilters}
            compareInfo={this.state.compareInfo}
            rowTitleFields={this.state.rowTitleFields}
            compareData={this.state.compareData}
            compare={this.state.compare}/>;
            if (this.state.reportCategory == 'INDEX') {
                mainView = <ReportTableView reportId={this.props.location.query.reportId}
                            currentCanEdited={this.props.location.query.currentCanEdited}
                            filterFields={this.state.filterFields}
                            data={areaInfo.dataObject}
                            changeed={areaInfo.changeed}
                            showPager={this.state.tableType}
                            tableName={this.state.tableName}
                            metadataName={this.state.metadataName}
                            reportType={this.state.reportType}
                            weiduList={this.state.weiduList}
                            columnTitleFields={this.state.columnTitleFieldsList}
                            rowTitleFields={this.state.rowTitleFieldsList}
                            filterData={this.state.filterData}
                            formulas={this.state.formulas}
                            kpiConfig={this.state.kpiConfig}
                            isReportTable={true}
                            sortTopParam={this.state.sortTopParam}
                            type={areaInfo.dataObject.areaInfo.type}
                            showSetReportNameDialog={this.state.showSetReportNameDialog}
                            drilDownFilter={drilFilters}
                            compare={this.state.compare}
                            compareData={this.state.compareData}
                            compareInfo={this.state.compareInfo}
                            zhiBiaoindexFields={this.state.zhiBiaoList}
                            sortFields={this.state.sortFields}
                            maxMin={this.state.maxMin}
                            topParameters={this.state.topParameters}
                            exportData={this.state.exportData}
                            exportDataModel={this.state.exportDataModel}/>
            } else {
                console.log(this.state.multiAxisLineSetting,'render')
                mainView =
                    <ReportChartView
                        reportId = {this.props.location.query.reportId}
                        data = {areaInfo.dataObject}
                        reportType={this.state.reportType}
                        config={ChartViewConfig.getConfig(this.state.reportType) }
                        params={JSON.stringify(areaInfo.dataObject)}
                        changeed={areaInfo.changeed}
                        tableName={this.state.tableName}
                        metadataName={this.state.metadataName}
                        multiAxisLineSetting = {this.state.multiAxisLineSetting}
                        zhiBiaoList={this.state.zhiBiaoList}
                        weiduList={this.state.weiduList}
                        sortTopParam={this.state.sortTopParam}
                        showSetReportNameDialog={this.state.showSetReportNameDialog}
                        drilDownFilter={drilFilters}
                        compareInfo={this.state.compareInfo}
                        compare={this.state.compare}
                        compareData={this.state.compareData}
                        sortFields={this.state.sortFields}
                        maxMin={this.state.maxMin}
                        topParameters={this.state.topParameters}
                    />
            }
        }
        // <MatadataBotton currentCanEdited={this.props.location.query.currentCanEdited} />
        return (
            <div className="page-report-view">

                <CompareHeader compareData={this.state.compareData} compare={this.state.compare}
                updateCompareDate={this._updateCompareDate}
                addScenes={this._addScenes}
                delScene={this._delScene}
                reportType={this.state.reportType}
                zhiBiaoList={this.state.zhiBiaoList}/>
                <MatadataBotton />

                <div className="main-view">
                    {mainView}
                </div>

                {footerBtn}

                <SetReportNameView
                    reportName={this.state.tableName}
                    open={this.state.showSetReportNameDialog}
                    onOK={this.state.submitFun}
                    onCancel={this._handleSetReportNameCancel}/>
            </div>
        )
    },
    _setTableFields:function(fields,name){
        if(fields){
            this.fields = fields;
        }
        if(name){
            var fields = this.fields||[];
            for(var i=0;i<fields.length;i++){
                if(fields[i].name==name){
                    fields[i].customName = '';
                }
            }
        }
    },
    /*start 插入保存按钮和另存为按钮的方法**/
    _addSaveAndSaveAsBtnHandle:function(){
       var model = ReportStore.setSaveModel(this.state,this.fields);
       var name = model.report.name;

        App.emit('APP-COMMANDS-SHOW', [
            <SaveBotton disabled={this.state.saveDisabled} reportId={this.props.location.query.reportId} name={name}/>,
            <SaveAsBotton disabled={this.state.saveAsDisabled}/>,

        ]);
    },
    /*end 插入保存按钮和另存为按钮的方法**/
    /**start 按钮是否能点击的方法*/
    _btnCanClickHandle:function(action,canEdited){
        if(action == 'EDIT'){
            if(canEdited == 'true'){
                 this.setState({
                     saveDisabled:false,
                     saveAsDisabled:false,
                 })
            }else{
                this.setState({
                    saveDisabled:true,
                    saveAsDisabled:false,
                })
            }
        }
        if(this.props.location.query.dsCurrentCanEdited){
            this.setState({
                saveAsDisabled:false,
            })
        }
    },
    /**end 按钮是否能点击的方法*/

    /*
     * 获取数据
     */
    _loadData: function(reportId) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            ReportStore.getAreaInfo(reportId).then(function(data) {
                var sortTopParam=ReportStore.setIndexSortTopParam(data);
                ReportStore.parameters=_this.parameters;
                _this.parameters.topParameters=sortTopParam.topParameters;
                _this.parameters.sortFields=sortTopParam.sortFields;
                _this.parameters.maxMin=sortTopParam.maxMin;
                metaDataStore.getMetaData(data.dataObject.metadataId).then(function(metadata) {
                    if(!metadata.success){
                        _this.setState({
                            error: metadata.message,
                            loaded: true,
                        })
                    }else{
                        data.dataObject.metadataColumns = metadata;
                        var state=ReportStore.setReportState(data);
                        state.sortFields=sortTopParam.sortFields;
                        state.maxMin=sortTopParam.maxMin;
                        state.topParameters=sortTopParam.topParameters;
                        state.sortTopParam=sortTopParam;
                        state.compare=data.dataObject.compare || false;
                        if(data.dataObject.compareInfo && data.dataObject.compareInfo.compareDimension.length>0){
                            state.compareInfo = data.dataObject.compareInfo;
                        }else{
                            var ceatCompareInfo = ReportStore.ceatCompareInfo(state.filterData);
                            state.compareInfo=CompareStore.setCompareInfo(ceatCompareInfo.compareDimension,state.zhiBiaoList,false,state.reportCategory);
                        }
                        state.compareData = ReportStore.initCompareData(state.compareInfo,state.filterData,state.weiduList,state.metadataId);
                    }
                    return resolve(state);
                })
            }).catch(_this._loadReportError);
        })
    },
    _loadReportError: function(err) {
        this.setState({
            error: err,
            loaded: true,
        })
    },
    _reloadData: function() {

    },
    _filterFieldsLoaded: function() {
        this.setState({
            filterLoaded: true
        })
    },
    /*返回按钮操作*/
    _createBackHandle: function() {
        if (this.props.location.query.sourceTarget == undefined) {
            this.context.router.push({
                pathname: '/report/list',
                query: {
                    'dirId': this.state.reportDirectoryId,
                    dirName: this.props.location.query.dirName,
                    currentCanEdited:this.props.location.query.currentCanEdited
                }
            });
        } else if (this.props.location.query.sourceTarget = "dashboard") {
            this.context.router.push({
                pathname: '/dashboard',
                query: {
                    'action': this.props.location.query.doshboarId,
                    'dirId': this.props.location.query.dsDirId,
                    'actionName': this.props.location.query.dsActionName,
                    'dirName': this.props.location.query.dsDirName,
                    'authority':this.props.location.query.dsAuthority,
                    'authorityDelete':this.props.location.query.dsAuthorityDelete,
                    'authorityView':this.props.location.query.dsAuthorityView,
                    'authorityEdit':this.props.location.query.dsCurrentCanEdited
                }
            });
        }
    },
    /**
     ***设置排序的参数方法
     **
     */
    _setSortHandle: function(sortData) {
        this.setState({
            sortFields: sortData.sortFields
        });
        if (this.state.reportCategory == 'INDEX') {
            this.setState({
                tableData: model,
                areaInfo_model: model.areaInfo, //表格对象
            })
        } else {
            this.setState({
                tableData: model,
                areaInfo_model: model.areaInfo, //表格对象
            })
        }
    },
    _changeFilterData: function(obj) {
        this.setState({
            filterData: obj.filterWeiDuData,
            filterFields: ReportStore.setFilterFields(obj.filterWeiDuData),
            drilDownFilter:obj.drilDownFilter ?  obj.drilDownFilter : this.state.drilDownFilter
        })
    },
    _changeTableName: function(tableName) {
        this.setState({
            tableName: tableName
        })
        App.emit('APP-REPORT-SAVE-MODEL', ReportStore.setAreaInfo(this.state));
        App.emit('APP-REPORT-SAVE-AS-MODEL', ReportStore.setAreaInfo(this.state));
    },

    _calcTableViewRows: function() {
        var windowHeight = $(document.body).height();
        var tableViewHeight = windowHeight - 450;
        var rows = Math.floor(tableViewHeight / 48);
        if (rows < TABLE_VIEW_ROW_NUMBER_MIN) rows = TABLE_VIEW_ROW_NUMBER_MIN;
        this.setState({
            tableViewRowNumber: rows
        })
    },

    //用户选择立方了立方的处理程序
    _userChoosedMetaDataHandler: function(arg) {
        this.parameters={};
        this.setState(function(previousState, currentProps) {
            previousState.reportCategory = 'INDEX';
            previousState.reportType = 'BASE';
            previousState.hasInitial=true;
            previousState.dragWeiduList=arg.weidu;
            previousState.dragZhibiaoList=arg.zhibiao;
            previousState.dragHejiList=arg.heji;
            previousState.dragPingjunList=arg.pingjun;
            previousState.dragMaxList=arg.max;
            previousState.dragMinList=arg.min;
            previousState.dragJishuList=arg.jishu;
            previousState.directoryId=arg.did;
            previousState.metadataId=arg.mid;
            previousState.metadataName=arg.mdname;
            previousState.dragJisuanlieList=arg.jisuanlie;
            previousState.dragWeiduJishuList = arg.weidujishu;
            previousState.weiduList=[];
            previousState.zhiBiaoList=[];
            previousState.rowTitleFieldsList=[];
            previousState.columnTitleFieldsList=[];
            previousState.filterData=arg.filterData;
            previousState.filterFields=[];
            previousState.filterLoaded=false;
            previousState.saveDisabled = false;
            previousState.saveAsDisabled=false;
            previousState.formulas = ReportStore.setFormulasList('BASE',false,[]);
            previousState.sortTopParam=null;
            previousState.drilDownFilter=[];
            previousState.rowTitleFields=[];
            previousState.topParameters=false;
            previousState.maxMin=false;
            previousState.sortFields=false;
            previousState.compareData=ReportStore.createCompareList(arg.weidu,arg.mid);
            previousState.compare=false;
            var compareInfo=CompareStore.setCompareInfo(previousState.compareData,previousState.zhiBiaoList,false,this.state.reportCategory);
            previousState.compareInfo = compareInfo;
            //ReportStore.setCompareWeidulist(previousState)
            return {previousState}
        });

    },
    //指标维度改变事件处理程序
    _weiduZhiBiaoChangedHandler: function(data) {
        //更新对比
        //ReportStore.setCompareWeidulist(data)
        //拖拽错误的计算列，不绘制
        var curDragZhiBiao=data.zhiBiaoList[data.dragIndex];
        if(curDragZhiBiao && curDragZhiBiao.type==8){
            if(curDragZhiBiao.fxSign==false){
                return;
            }
        }
        //删除错误的计算列，不绘制
        if(data.fxSign==false){
            App.emit('APP-REPORT-DEL-ERROR-FX', {fxSign:data.fxIndex});
            return;
        }
        var filterFields=this.state.filterFields
        //var filterFields=FilterFieldsStore.delfilterFields(this.state.filterFields,data.weiduList);
        //var filterData=FilterFieldsStore.setFilterData(filterFields,this.state.filterData);
        //删除钻取filter
        var drilDownFilter=FilterFieldsStore.delDrilDownFilter(data.weiduList,this.state.drilDownFilter);
        var _this=this;
        var zlen = data.zhiBiaoList.length;
        var wlen = this.state.reportType == 'CROSS' ? {
            row: data.rowTitleFieldsList.length,
            col: data.columnTitleFieldsList.length
        } : data.weiduList.length;
        let multiAxisLineSetting = this.state.multiAxisLineSetting

        if ("MultiAxisLine" === this.state.reportType) {
        console.log(multiAxisLineSetting,'multiAxisLineSetting------')

            multiAxisLineSetting = this._mergeMultiAxisSetting(data.zhiBiaoList,data.weiduList);
        }
        var param={
            sortFields:this.state.sortFields,
            topParameters:this.state.topParameters,
            maxMin:this.state.maxMin,
        }
        var sortTopParam=ReportStore.delIndexSortTopParam(param,data.zhiBiaoList);
        sortTopParam=ReportStore.changeSortTopParam(param);
        var state={};
        state.weiduList = data.weiduList;
        state.zhiBiaoList = data.zhiBiaoList;
        state.columnTitleFieldsList = data.columnTitleFieldsList;
        state.rowTitleFieldsList = data.rowTitleFieldsList;
        state.dragWeiduList = data.dragWeiduList;
        state.dragZhibiaoList = data.dragZhibiaoList;
        state.dragHejiList = data.dragHejiList;
        state.dragJisuanlieList = data.dragJisuanlieList;
        state.dragPingjunList = data.dragPingjunList;
        state.dragMaxList = data.dragMaxList;
        state.dragMinList = data.dragMinList;
        state.dragJishuList = data.dragJishuList;
        state.dragWeiduJishuList = data.dragWeiduJishuList;
        state.disabledState = !ChartTypeStore.onChange(this.state.reportType, zlen, wlen);
        state.formulas = ReportStore.setFormulasList(this.state.reportType,this.state.formulas,data.weiduList);
        state.dragIndex=data.dragIndex;
        state.multiAxisLineSetting = multiAxisLineSetting;
        state.sortTopParam=sortTopParam;
        state.rowTitleFields=ReportStore.setRowTitleFields(data.weiduList,this.state.rowTitleFields);
        state.filterFields=filterFields;
        state.sortFields=sortTopParam.sortFields;
        state.topParameters=sortTopParam.topParameters;
        state.maxMin=sortTopParam.maxMin;
        //state.filterData=filterData;
        if(zlen==0){
            state.sortTopParam=null;
        }
        //更新对比
        var changeZhicompareData=CompareStore.changeZhibiaoUpdateCompareData(this.state.compareData,data.zhiBiaoList,this.state.compare);
        //var compare=changeZhicompareData.compare;
        var compareData=CompareStore.changeWeiduUpdateCompare(changeZhicompareData,data.weiduList,this.state.reportType);
        compareData=CompareStore.addPageFormater(compareData,data.zhiBiaoList);
        var compareInfo=CompareStore.setCompareInfo(compareData,data.zhiBiaoList,false,this.state.reportCategory);
        state.compareData = compareData;
        state.compareInfo = compareInfo;
        state.compare=CompareStore.updateCompare(compareInfo,data.zhiBiaoList);

        var drilDownFilter=FilterFieldsStore.initDrilDownParams(state.weiduList,filterFields,data.rowTitleFields,this.state.drilDownFilter,false)
        //初始化面包屑数据
        FilterFieldsStore.setAllDataToLevel(data.weiduList,filterFields,drilDownFilter).then(function(result){
            state.drilDownFilter=result;
            _this.setState(state);
        });


    },

    _mergeMultiAxisSetting: function(indexFields,weiduList) {

        if (1 > indexFields.length) {

            return this.state.multiAxisLineSetting;
        }

        let  indexcont= ChartTypeStore.updateMultiAxisZhibiaoList(indexFields,weiduList);
        let indexFieldsLength = indexcont.length;
        let multiAxisLineSetting =ChartTypeStore.updateMultiAxis( this.state.multiAxisLineSetting,indexFields,weiduList);
        let indexSettingNameObj  = this._array2Object(multiAxisLineSetting.indexs, "name");
        let yAxisSettingKeyObj   = this._array2Object(multiAxisLineSetting.yAxis, "key");
        let newIndexSettingList  = [];
        let newYAxisSettingList  = [];
        let yAxisSettingKeyList  = [];

        for (let counter = 0; counter < indexFieldsLength; counter++) {
            let indexField = indexcont[counter];
            if (indexSettingNameObj[indexField.name]) {
                newIndexSettingList.push(indexSettingNameObj[indexField.name]);
            }
            else {
                newIndexSettingList.push({
                    name      : indexField.name,
                    chartType : 'line',
                    yAxisKey  : ''
                });
            }
        }

        if (indexFieldsLength > multiAxisLineSetting.indexs.length) {
            let newLength = indexFieldsLength - multiAxisLineSetting.indexs.length;
            newYAxisSettingList = this._createNewYAxis(multiAxisLineSetting.yAxis, newLength);
        }
        else {
            newYAxisSettingList = multiAxisLineSetting.yAxis.slice(0, indexFieldsLength);
        }

        for (let counter = 0; counter < indexFieldsLength; counter++) {
            yAxisSettingKeyList.push(newYAxisSettingList[counter].key);
        }

        yAxisSettingKeyList.sort(function(item1, item2) {
            let v1 = parseInt(item1.replace("yAxis", ""));
            let v2 = parseInt(item2.replace("yAxis", ""));
            return v1 - v2;
        });

        // Index  个数OK， 关联Y轴未整理
        // Y轴整理完成

        let noYaxisKeyIndexList = [];
        for (let counter = 0; counter < indexFieldsLength; counter++) {
            let indexSetting = newIndexSettingList[counter];
            if (yAxisSettingKeyObj[indexSetting.yAxisKey]) {
                this._removeByValue(yAxisSettingKeyList, indexSetting.yAxisKey);
            }
            else {
                noYaxisKeyIndexList.push(counter);
            }
        }

        for (let counter = 0; counter < noYaxisKeyIndexList.length; counter++) {
            newIndexSettingList[noYaxisKeyIndexList[counter]].chartType = "line";
            newIndexSettingList[noYaxisKeyIndexList[counter]].yAxisKey  = yAxisSettingKeyList[0];
            this._removeByValue(yAxisSettingKeyList, yAxisSettingKeyList[0]);
        }

        multiAxisLineSetting.indexs = newIndexSettingList;
        multiAxisLineSetting.yAxis  = newYAxisSettingList;

        return multiAxisLineSetting;
    },

    _array2Object: function(array, key) {
        let object = {};

        if (!array) return object;

        for (let counter = 0; counter < array.length; counter++) {

            if (!array[counter][key]) {
                continue;
            }

            object[array[counter][key]] = array[counter];
        }

        return object;
    },

    _createNewYAxis: function(yAxisList, n) {

        let names = {};
        let keys  = {};
        for (let counter = 0; counter < yAxisList.length; counter++) {
            let yAxis = yAxisList[counter];
            names[yAxis.name] = yAxis;
            keys[yAxis.key]   = yAxis;
        }

        for (let counter = 0; counter < n; counter++) {

            let nameIndex = 1;
            let keyIndex  = 1;
            let name      = "";
            let key       = "";

            while (names["Y轴 #" + nameIndex]) {
                nameIndex++;
            }
            name = "Y轴 #" + nameIndex;
            while (keys["yAxis" + keyIndex]) {
                keyIndex++;
            }
            key = "yAxis" + keyIndex;

            let newYAxis = {
                key  : key,
                name : name
            };
            names[name] = newYAxis;
            keys[key]   = newYAxis;

            yAxisList.push(newYAxis);
        }

        return yAxisList;
    },

    _removeByValue: function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },

    //图标类型改变事件处理程序
    _chartTypeChangedHandler: function(type, category, old) {
        this.parameters={};
        var state = ReportStore.changeReportType(this.state, {
            oldType: old,
            newType: {
                type: type,
                category: category
            },
            zhiBiaoList: this.state.zhiBiaoList,
            weiduList: this.state.weiduList
        });
        var _this=this;
        App.emit('APP-SET-STATE-ITEMS', state);

        let mulitAxisLineSetting = { yAxis: [], indexs: [] };
        if ("MultiAxisLine" === type) {
        console.log(multiAxisLineSetting,'multiAxisLineSetting++++')

            mulitAxisLineSetting = this._mergeMultiAxisSetting(this.state.zhiBiaoList,data.weiduList);
        }

        var previousState={};
        previousState.reportType = type;
        previousState.reportCategory = category;
        previousState.weiduList = state.weiduList;
        previousState.zhiBiaoList = state.zhiBiaoList;
        previousState.columnTitleFieldsList = state.columnTitleFieldsList;
        previousState.rowTitleFieldsList = state.rowTitleFieldsList;
        previousState.dragWeiduList = state.dragWeiduList;
        previousState.dragZhibiaoList = state.dragZhibiaoList;
        previousState.dragHejiList = state.dragHejiList;
        previousState.dragJisuanlieList = state.dragJisuanlieList;
        previousState.dragPingjunList = state.dragPingjunList;
        previousState.dragMaxList = state.dragMaxList;
        previousState.dragMinList = state.dragMinList;
        previousState.dragJishuList = state.dragJishuList;
        previousState.formulas = ReportStore.setFormulasList(type,false,state.weiduList);
        previousState.mulitAxisLineSetting = mulitAxisLineSetting;
        previousState.sortTopParam=null;
        previousState.topParameters=false;
        previousState.maxMin=false;
        previousState.sortFields=false;
        if(type=='EchartsMap'){
            previousState.drilDownFilter=[];
        }
        //this.setState(previousState);

        var drilDownFilter=FilterFieldsStore.initDrilDownParams(state.weiduList,this.state.filterFields,this.state.rowTitleFields,this.state.drilDownFilter,false)
        //初始化面包屑数据
        FilterFieldsStore.setAllDataToLevel(state.weiduList,this.state.filterFields,drilDownFilter).then(function(result){
           previousState.drilDownFilter=result;
            _this.setState(previousState);
        });
        previousState.compareInfo = CompareStore.setCompareInfo(this.state.compareData,this.state.zhiBiaoList,false,category);
    },
    _setFormulas:function(formulas){
        this.parameters=ReportStore.setFormulasUpdateZhibiaoFilter(this.state,ReportStore.editReportType,{
            sortFields:this.state.sortFields,
            maxMin:this.state.maxMin,
            topParameters:this.state.topParameters
        });
        this.setState({
            formulas:formulas,
            sortTopParam:this.parameters,
            sortFields:this.parameters.sortFields,
            maxMin:this.parameters.maxMin,
            topParameters:this.parameters.topParameters
        });
    },
    _setKPIConfig:function(kpiConfig){
        this.setState({
            kpiConfig:kpiConfig
        });

    },

    /**
     * 高级复合图设定
     * @param data
     * @private
     */
    _setMultiAxisLineSetting: function (data) {
        this.setState({
            multiAxisLineSetting : data.multiAxisLineSetting
        });
    },

	_saveMultiAxisLineExtInfo: function (data) {

		if ("MultiAxisLine" !== this.state.reportType) {
			return;
		}

		if (!data.dataObject.id) {
			return;
		}

		let extendObject = {
			resourceId : data.dataObject.id,
			key        : "MultiAxisLineSetting",
			extend     : JSON.stringify(this.state.multiAxisLineSetting)
		};

		ReportStore.saveExtends(extendObject).then(function (data) {
		});
	},

	_saveKPIExtInfo: function (data) {

		if ("KPI" !== this.state.reportType) {
			return;
		}

		if (!data.dataObject.id) {
			return;
		}

		var _resourceObject = {};
		var _temp           = this.state.kpiConfig;

		_resourceObject.resourceId = data.dataObject.id;
		_resourceObject.key        = this.state.kpiConfig.key;
		_resourceObject.extend     = JSON.stringify(_temp);

		ReportStore.saveKPIOptionReport(_resourceObject).then(function(kpiData){
		});
	},

	/*
	 * 另存为数据,false,
	 */
    _saveAsReport: function(reportName) {
        // var state = JSON.parse(JSON.stringify(this.state));
        var state = this.state;

        state.tableName = reportName;
        var model = ReportStore.setSaveModel(state);
        //model=ReportStore.setSaveIndexParam(model,this.parameters);
        model=ReportStore.setSaveIndexParam2(model,this.state.sortFields,this.state.topParameters,this.state.maxMin);
        model.report.id = null;
        var _this = this;
        ReportStore.saveReport(model).then(function(data) {
            if (data.success) {
                _this.state.closeTck();
                App.emit('APP-MESSAGE-OPEN', {
                    content: '另存为成功'
                });

	            // 保存复合图的扩展配置信息
	            _this._saveMultiAxisLineExtInfo(data);

	            // 保存KPI的扩展配置信息
	            _this._saveKPIExtInfo(data);

                var sortTopParam=_this._setSortTopParam();
                _this.setState({
                    showSetReportNameDialog: false,
                    sortTopParam:sortTopParam
                })
                if(_this.props.location.query.sourceTarget == 'dashboard'){
                    _this.context.router.push({
                        pathname: '/report/edit',
                        query: {
                            reportId: data.dataObject.id,
                            dirId: _this.state.parentId,
                            actionName: reportName,
                            canEdited: true,
                            sourceTarget:'dashboard',
                            doshboarId:_this.props.location.query.doshboarId,
                            dsActionName:_this.props.location.query.dsActionName,
                            dsDirId:_this.props.location.query.dsDirId,
                            dsAuthority:_this.props.location.query.dsAuthority,
                            dsAuthorityDelete:_this.props.location.query.dsAuthorityDelete,
                            dsAuthorityView:_this.props.location.query.dsAuthorityView,
                            dsCurrentCanEdited:_this.props.location.query.dsCurrentCanEdited
                        }
                    });
                }else{
                   _this.context.router.push({
                        pathname: '/report/edit',
                        query: {
                            reportId: data.dataObject.id,
                            dirId: _this.state.parentId,
                            actionName: reportName,
                            canEdited: true
                        }
                    });
                }
            }else{
                App.emit('APP-MESSAGE-OPEN', {
                    content: data.message
                });
            }
        })
    },
    _openSetReportNameHandle: function(obj) {
        this.setState({
            showSetReportNameDialog: true,
            submitFun: this._saveAsReport,
            parentId: obj.directoryId,
            closeTck: obj.closeTck,

        })
        $('.saveAsDialogBox').parent().parent().css('z-index', 1499);
    },
   _setSortFilter:function(param){
     if(param.noSort){
        this.parameters.sortFields=false;
      }
      if(param.noFilter){
        this.parameters.topParameters=false;
        this.parameters.maxMin=false;
      }

      if(param.sortFields){
          this.parameters.sortFields=param.sortFields;
      }
      if(param.topParameters){
          this.parameters.topParameters=param.topParameters;
          this.parameters.maxMin=false;

      }
      if(param.maxMin){
          this.parameters.maxMin=param.maxMin;
          this.parameters.topParameters=false;
      }
      //////App.emit('APP-ZHIBIAO-FILTER',this.parameters);
      //ReportStore.parameters=this.parameters;
    },
    /*
     * 保存表格数据
     */
    parameters:{},
    _saveReport: function() {

        var model = ReportStore.setSaveModel(this.state,this.fields);
        var _this = this;
        if (this.props.location.query.sourceTarget == 'dashboard') {
            // model.id = null;
            model.report.id = '';
        }
        if (model.report.name == '') {
            this.setState({
                showSetReportNameDialog: true
            })

            return false;
        }
        //model=ReportStore.setSaveIndexParam(model,this.parameters);
        model=ReportStore.setSaveIndexParam2(model,this.state.sortFields,this.state.topParameters,this.state.maxMin);

        var drillDown = this.state.drillDown;
        if (model.report.category=="CHART") {
             model.report.categoryFields=FilterFieldsStore.setSaveChartDrillLevel( model.report,this.state.drilDownFilter,drillDown);
         }
         else {
             model.report.rowTitleFields=FilterFieldsStore.setSaveDrillLevel( model.report,this.state.drilDownFilter,drillDown);
         }
        ReportStore.saveReport(model).then(function(data) {
            if (data.success) {
                App.emit('APP-MESSAGE-OPEN', {
                    content: '保存成功'
                });

	            // 保存复合图的扩展配置信息
	            _this._saveMultiAxisLineExtInfo(data);

	            // 保存KPI的扩展配置信息
	            _this._saveKPIExtInfo(data);

                var sortTopParam=_this._setSortTopParam();
                if(_this.state.showSetReportNameDialog==true){
                    _this.setState({
                        showSetReportNameDialog: false,
                        sortTopParam:sortTopParam
                    })
                }else{
                  _this.setState({
                      sortTopParam:sortTopParam
                  })
                }
                if(_this.props.params.action=='create'){
                    _this.context.router.push({
                        pathname: '/report/edit',
                        query: {
                            reportId: data.dataObject.id,
                            dirId: _this.state.parentId,
                            actionName: _this.state.tableName,
                            canEdited: true,
                        }
                    });
                }
            } else {
                App.emit('APP-MESSAGE-OPEN', {
                    content: data.message
                });
            }
        })
    },
    _handleSetReportNameOK: function(reportName) {
        this.setState({
            tableName: reportName
        }, this._saveReport);
    },
    _handleSetReportNameCancel: function() {
        this.setState({
            showSetReportNameDialog: false,
        });
    },
    _updateTableCustomArr: function(updateItem, updateType){
        if(updateType === "del"){
            ReportStore.deleteTableCustomName(updateItem);
        }else if(updateType === "add"){
            //TODO
        }else{
            //TODO
        }
    },
    _setSortTopParam:function(){
      var sortTopParam={
          topParameters:this.parameters.topParameters,
          sortFields:this.parameters.sortFields,
          maxMin:this.parameters.maxMin,
        }
      return sortTopParam;

    },
    _emptyZhibiaoFilter:function(){
        if (!this.isMounted()) return;
        if(this.parameters.topParameters) {
            this.parameters.topParameters=false;
        }
        if(this.parameters.maxMin) {
            this.parameters.maxMin=false;
        }
        if(this.parameters.sortFields) {
            this.parameters.sortFields=false;
        }
        var sortTopParam={};
        sortTopParam.topParameters=false;
        sortTopParam.maxMin=false;
        sortTopParam.sortFields=false;
        this.setState({
           sortTopParam:sortTopParam,
           topParameters:false,
           sortFields:false,
           maxMin:false,
        });
    },
    _updatadrilDate:function(param){
        var weidu = this.state.weiduList;
        var drilDownFilter = this.state.drilDownFilter;
        var rowTitleFields = this.state.rowTitleFields;
        var filterFields = this.state.filterFields;

        var dataFilter = FilterFieldsStore.setstateData(weidu,drilDownFilter,rowTitleFields,filterFields,param);
        
        this.setState({
            drilDownFilter:dataFilter.drilDown,
            weiduList: dataFilter.weiduList,
            filterFields:dataFilter.setDrillFilters,
            rowTitleFields:dataFilter.rowTitlefils,
            sortTopParam:this.parameters,
        });

   },
   _setDrillChart:function(drillDownArr){
        var drilDownFilter = drillDownArr;//FilterFieldsStore.concatFilter(this.state.drilDownFilter,drillDownArr);
        var filterFields = this.state.filterFields;
        var rowTitleFields = this.state.rowTitleFields;
        var weiduList = this.state.weiduList;
        var newWeiduList=[];
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].type==='GROUP_TITLE_FIELD'){
                filterFields=ReportStore.setDrillFilter(drilDownFilter,drilDownFilter[i],filterFields,drilDownFilter[i].weiduList);
                rowTitleFields=FilterFieldsStore.setSaveDrillLevel(rowTitleFields,drilDownFilter);
                
            }else if(drilDownFilter[i].type==='GROUP_DATE_TITLE_FIELD'){
                //drilDownFilter[i].weiduList
                filterFields=FilterFieldsStore.setDrillDateFilter(weiduList,drilDownFilter[i],filterFields);
                rowTitleFields=FilterFieldsStore.setSaveDateDrillLevel( rowTitleFields,drilDownFilter);
                
            }
            var matchedWeidu=FilterFieldsStore.matchWeiduList(drilDownFilter[i]);
            if(matchedWeidu){
                newWeiduList.push(matchedWeidu);
            }
        };
        
        //filterFields=FilterFieldsStore.removeExtrafilter(newWeiduList,filterFields);
        newWeiduList=FilterFieldsStore.replaceWeiduList(weiduList,newWeiduList);
        this.setState({
           drilDownFilter:drilDownFilter,
           weiduList:newWeiduList,
           filterFields:filterFields,
           rowTitleFields:rowTitleFields,
           sortTopParam:this.parameters,
        });
    },
    _setDrillFilter:function(arg){
        var newDrilDownFilter={
            dimensionId:arg.dimensionId,
            drillFilter:arg.drillFilter,
            groupLevels:arg.groupLevels,
            level:arg.level,
            levelItem:arg.levelItem,
            levelItemArr:arg.levelItemArr,
            breadData:arg.breadData,
            goBackData:arg.goBackData,
            drillDown:arg.drillDown,
            drillLevel:arg.drillLevel,
            fieldName:arg.fieldName
        };
        var drilDownFilter=FilterFieldsStore.concatFilter(this.state.drilDownFilter,[newDrilDownFilter]);
        var newFilterFields=ReportStore.setDrillFilter(drilDownFilter,newDrilDownFilter,this.state.filterFields,arg.weiduList);
        var rowTitleFields=FilterFieldsStore.setSaveDrillLevel( this.state.rowTitleFields,drilDownFilter);
        this.setState({
           drilDownFilter:drilDownFilter,
           weiduList:arg.weiduList,
           filterFields:newFilterFields,
           rowTitleFields:rowTitleFields,
           sortTopParam:this.parameters,
        });
    },
    _setDrillDateFilter:function(arg){
        var newDrilDownFilter={
            dimensionId:arg.dimensionId,
            drillFilter:arg.drillFilter,
            groupLevels:arg.groupLevels,
            level:arg.level,
            levelItem:arg.levelItem,
            levelItemArr:arg.levelItemArr,
            breadData:arg.breadData,
            type:arg.type,
            drillDown:arg.drillDown,
            drillLevel:arg.drillLevel,
            fieldName:arg.fieldName
        };
        var drilDownFilter=FilterFieldsStore.concatDateFilter(this.state.drilDownFilter,newDrilDownFilter);
        var newFilterFields=FilterFieldsStore.setDrillDateFilter(arg.weiduList,newDrilDownFilter,this.state.filterFields);
        var rowTitleFields=FilterFieldsStore.setSaveDateDrillLevel( this.state.rowTitleFields,drilDownFilter);

        this.setState({
           drilDownFilter:drilDownFilter,
           weiduList:arg.weiduList,
           filterFields:newFilterFields,
           rowTitleFields:rowTitleFields,
        //    sortFields:this.parameters.sortFields,
           sortTopParam:this.parameters,
        });
    },
    _setBackDrillDateFilter:function(arg){
        var drilDownFilter=this.state.drilDownFilter;
        var weiduList=this.state.weiduList;
        //var filterFields=this.state.filterFields;
        var rowTitleFields=this.state.rowTitleFields;
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].type=="GROUP_DATE_TITLE_FIELD" && drilDownFilter[i].dimensionId==arg.drilDownFilter.dimensionId){
                drilDownFilter[i]=arg.drilDownFilter;
            }
        }
        /*for(var h=0;h<filterFields.length;h++){
            if(filterFields[h].name==arg.drilDownFilter.fieldName){
                if(!arg.drilDownFilter.drillFilter){
                    filterFields.splice(h,1);
                }else{
                    filterFields[h].value=arg.drilDownFilter.drillFilter;
                }

            }
        }*/
        for(var j=0;j<weiduList.length;j++){
            if(weiduList[j].name==arg.drilDownFilter.dimensionId){
                weiduList[j].level = arg.drilDownFilter.level;
            }
        }
        this.setState({
           drilDownFilter:drilDownFilter,
           weiduList:weiduList,
           //filterFields:filterFields,
           rowTitleFields:rowTitleFields,

        });
    },
    _setDrillErrorFilter:function(obj){
        var newDrilDown=FilterFieldsStore.setDrillErrorFilter(obj,this.state.weiduList,this.state.drilDownFilter);
        var newFilterFields=ReportStore.setDrillFilter(newDrilDown.drilDownFilter,newDrilDown.newDrilDownFilter,this.state.filterFields,this.state.weiduList);
        var rowTitleFields=FilterFieldsStore.setSaveDrillLevel( this.state.rowTitleFields,newDrilDown.drilDownFilter);//

        this.setState({
           drilDownFilter:newDrilDown.drilDownFilter,
           weiduList:newDrilDown.weiduList,
           filterFields:newFilterFields,
           rowTitleFields:rowTitleFields,
           sortFields:this.parameters.sortFields,
           sortTopParam:this.parameters,
        });
    },
    _updateCompareDate:function(item,sign){
        var filter=CompareStore.delCompareFilterFields(item,this.state.filterFields,this.state.filterData);
        var compareData=ReportStore.updateCompareDate(item,this.state.compareData,sign);
        var compareInfo=CompareStore.setCompareInfo(compareData.compareData,this.state.zhiBiaoList);
        var compare=CompareStore.updateCompare(compareInfo,this.state.zhiBiaoList,
            false,this.state.reportCategory);
        var isUpdataparameters=ReportStore.updataCompareSortTopParam(this.state.weiduList,this.parameters.sortFields);
        var sortFields=this.state.sortFields;
        if(isUpdataparameters){
            this.parameters.sortFields=false;
            sortFields=false;
        }
        this.parameters.topParameters=false;
        this.parameters.maxMin=false;
        this.setState({
            compareInfo:compareInfo,
            compareData:compareData.compareData,
            compare:compare,
            sortTopParam:this.parameters,
            filterFields:filter.filterFields,
            filterData:filter.filterData,
            maxMin:false,
            topParameters:false,
            sortFields:sortFields,
        });
    },
   _addScenes:function(selectedCompare,isAdd){
        var compareData=CompareStore.addScenesUpdateCompare(selectedCompare,this.state.compareData,this.state.zhiBiaoList,isAdd);
        var compareInfo=CompareStore.setCompareInfo(compareData,this.state.zhiBiaoList,false,this.state.reportCategory);
        var compare=CompareStore.updateCompare(compareInfo,this.state.zhiBiaoList);
        // var isUpdataparameters=ReportStore.updataCompareSortTopParam(this.state.weiduList,this.parameters.sortFields);
        //   if(isUpdataparameters){
        //       this.parameters.sortFields=false;
        //   }
        this.setState({
            compareData:compareData,
            compareInfo:compareInfo,
            compare:compare,
        });
   },
   _delScene:function(delScene){
        var compareObj=CompareStore.delSceneUpdateCompare(delScene,this.state.compareData,this.state.compare);
        var compareInfo=CompareStore.setCompareInfo(compareObj.compareData,this.state.zhiBiaoList,false,this.state.reportCategory);
        var compare=CompareStore.updateCompare(compareInfo,this.state.zhiBiaoList);
        // var isUpdataparameters=ReportStore.updataCompareSortTopParam(this.state.weiduList,this.parameters.sortFields);
        //     if(isUpdataparameters){
        //         this.parameters.sortFields=false;
        //     }
        this.setState({
            compareData:compareObj.compareData,
            compare:compare,
            compareInfo:compareInfo
        })
   },
   _updataZhibiaoCustomName:function(CompareNewcustName){
     var maxMin = this.parameters.maxMin;
           var compareData=CompareStore.updataZhibiaoCustomName(this.state.compareData,CompareNewcustName);
           var compareInfo=CompareStore.setCompareInfo(compareData,this.state.zhiBiaoList,false,this.state.reportCategory);
           var compare=CompareStore.updateCompare(compareInfo,this.state.zhiBiaoList);
           var NewCustomName=ReportStore.updataSortTopParam(CompareNewcustName,maxMin);
           this.parameters.maxMin=NewCustomName
           this.setState({
               compareData:compareData,
               compareInfo:compareInfo,
               compare:compare,
               sortTopParam:this.parameters
           });
   },
   _setSortFields:function(arg){
        if (!this.isMounted()) return;
        this.setState({
           sortFields:arg.sortFields
        });
   },
   _setSortMaxMin:function(arg){
        if (!this.isMounted()) return;
        this.setState({
           maxMin:arg.maxMin,
           topParameters:false
        });
   },
   _setSortTopn:function(arg){
        if (!this.isMounted()) return;
        this.setState({
           topParameters:arg.topParameters,
           maxMin:false,
        });
   },
   _setNoFilter:function(arg){
        if (!this.isMounted()) return;
        this.setState({
            topParameters:false,
            maxMin:false
        });
    },

});
