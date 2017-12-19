var React = require('react');
var App = require('app');
var $ = require('jquery');
var ChartReportComponent = require('./ChartReportComponent');
var TableReportComponent = require('./TableReportComponent');
var ReportStore = require('../../stores/ReportStore');
var MetaDataStore = require('../../stores/MetaDataStore');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var PublicTextField = require('../common/PublicTextField');
var {
    Slider
} = require('material-ui');
module.exports = React.createClass({
    app:{},
    __tempThisVal:'',
	getInitialState: function() {
        return {
            reprotId:this.props.reprotData.id,
            defaultFilterFileds:this.props.reprotData.defaultFilterFileds||[],
            dataArrState:[],
            errorTextState:'',
            showCharIcon:this.props.reprotData.showCharIcon || false,
            showDefaultFilter:this.props.reprotData.showDefaultFilter || false,
            customCellWidthArr:this.props.reprotData.columnAttributes,//默认自定义列的数据是空的
        }
    },
    componentWillMount:function(){
        var _this = this;
        this.__tempThisVal = this.props.reprotData.name;
        var filterFields = JSON.parse(JSON.stringify({items:this.props.reprotData.filterFields})).items;
        ReportStore.getAreaInfo(_this.props.reprotData.id).then(function(resultData){
            if(resultData.success){
                MetaDataStore.getMetaData(resultData.dataObject.metadataId).then(function(resultMetaData){
                    if(resultMetaData.weiduList.length > 0){
                        if(filterFields.length > 0){
                            for(var i=0;i<filterFields.length;i++){
                                for(var j=0;j<resultMetaData.weiduList.length;j++){
                                    if(filterFields[i].dbField == resultMetaData.weiduList[j].fieldName){
                                        resultMetaData.weiduList[j].selected = true;
                                    }
                                }
                            }
                        }else{
                            for(var j=0;j<resultMetaData.weiduList.length;j++){
                                resultMetaData.weiduList[j].selected = false;
                            }
                        }
                    }
                    _this.setState(function(previousState,currentProps){
                        previousState.dataArrState = resultMetaData.weiduList;
                        return {previousState};
                    });
                })
            }else{
                console.log(resultData.message);
            }
        })
    },
    componentDidMount: function() {
        //点击编辑 修改筛选是否可见
        this.app['APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE'] = App.on('APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE', this._modifyFilterValueHandle);
        this.app['APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT'] = App.on('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT', this._filterSort);
        this.app['APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT-CLICK'] = App.on('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT-CLICK', this._filterSortClick);
        //点击右侧显示图形的按钮 执行的方法
        this.app['APP-DASHBOARD-REPORT-TOGGLE-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-REPORT-TOGGLE-BUTTON-HANDLE', this._togggleBtnCharIconHandle);
        //点击右侧显示报表展示模块的按钮 执行的方法
        this.app['APP-DASHBOARD-REPORT-TOGGLE-SHOW-REPORT-HANDLE'] = App.on('APP-DASHBOARD-REPORT-TOGGLE-SHOW-REPORT-HANDLE', this._togggleShowReportHandle);
        this._scrollBrar();
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillUpdate : function(){
        this._scrollBrar();
    },
    render: function() {
        return (
            <div className="dashboardReportEdit">
                <div className="dashboardReportEdit-bar"></div>
                <div className="dashboardReportEdit-bar-two"></div>
                <div className="dashboardReportEdit-bar-thr">
                    <div className="dashboardReportEdit-bar-thr-scroll" ref="scrollBox">
                        <div className="dashboardReportEdit-bar-title">常规</div>
                        <div className="dashboardReportEdit-bar-name">
                            <PublicTextField
                                className="textInputClassName textFieldClass"
                                floatingLabelText="分析名称"
                                defaultValue={this.props.reprotData.name}
                                errorText={this.state.errorTextState}
                                onChange={(evt)=>this._textFieldChangeHandle(evt)}/>
                        </div>
                        {this._autoSetCellWidthHand()}
                        {this._mountCompoent()}
                    </div>
                </div>
            </div>
        )
    },
    _autoSetCellWidthHand:function(){//自定义列宽模块是否显示的方法
        if(this.props.reprotData.category == "INDEX" && this.props.reprotData.type!='CROSS'){ //如果是表格就显示自定义列宽的模块
            return  <div className="autoSetCellWidth">
                        <h2>自定义列宽</h2>
                        <div className="autoSetCellWidthContent">
                            {this.state.customCellWidthArr.map(this._sliderDomHtmlHandle)}
                        </div>
                    </div>
        }else{
            return null;
        }
    },
    _sliderDomHtmlHandle:function(item,key){//输出自定义列的html结构
        return <dl key={key}>
                    <dt>{item.name}</dt>
                    <dd>
                        <div className="dashboardEditSliderBox">
                            <Slider
                                className="sliderClassName"
                                onChange={(evt,value)=>this._onChangeHandle(evt,value,item.name)}
                                step={0.50}
                                min={0}
                                max={1}
                                value={item.defaultValue}
                                defaultValue={item.defaultValue}/>
                        </div>
                        <label>{item.labelVal}</label>
                    </dd>
                </dl>
    },
    _onChangeHandle:function(_,value,name){//当slider发生改变的时候执行的方法
        var _this = this;
        this.setState(function(previousState,currentProps){//修改完成当前的状态
            for(var i=0;i<previousState.customCellWidthArr.length;i++){
                if(previousState.customCellWidthArr[i].name == name){
                    previousState.customCellWidthArr[i].defaultValue = value;
                    if(value==1){
                        previousState.customCellWidthArr[i].labelVal = '完整';
                    }else if(value==0){
                        previousState.customCellWidthArr[i].labelVal = '隐藏';
                    }else if(value==0.5){
                        previousState.customCellWidthArr[i].labelVal = '适中';
                    }
                }
            }
            App.emit('APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE',{//位于dashboard.js
                customCellWidthArr:previousState.customCellWidthArr,
                row:_this.props.rowNum,
                col:_this.props.colNum
            })
            return {previousState}
        })
    },
    _togggleBtnCharIconHandle:function(obj){//点击右侧显示图形的按钮 执行的方法
        this.setState(function(previousState,currentProps){//修改完成当前的状态
            previousState.showCharIcon = !obj.showCharIcon;
            return {previousState}
        })
        App.emit('APP-DASHBOARD-REPORT-EDIT-CHAR-TOGGLE-HANDLE',{//修改完成当前的状态 去修改存储数据里面的状态 用于存储,位于dashboard.js
            showCharIcon:obj.showCharIcon,
            row:this.props.rowNum,
            col:this.props.colNum
        })
        if(obj.showCharIcon){
            App.emit('APP-DASHBOARD-REPORT-RESET-CHAR-ICON-HANDLE',{//修改toggle按钮之后如果是关闭了 就重置页面图形icon
                row:this.props.rowNum,
                col:this.props.colNum
            })
            App.emit('APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE',{//修改toggle按钮之后如果是关闭了 就重置页面图形icon
                row:this.props.rowNum,
                col:this.props.colNum
            })
        }
    },
    _togggleShowReportHandle:function(obj){//点击右侧显示报表的按钮 执行的方法
        this.setState(function(previousState,currentProps){//修改完成当前的状态
            previousState.reportFilterSet = !obj.reportFilterSet;
            return {previousState}
        })
        App.emit('APP-DASHBOARD-REPORT-SHOW-REPORT-HANDLE',{//修改完成当前的状态 去修改存储数据里面的状态 用于存储,位于dashboard.js
            reportFilterSet:!obj.reportFilterSet,
            row:this.props.rowNum,
            col:this.props.colNum
        })
    },
    _modifyFilterValueHandle:function(itemObj){//点击筛选 修改筛选是否尅见
        this.setState(function(previousState,currentProps){
            previousState.dataArrState[itemObj.filterIndex].selected = !itemObj.selectedBool;
            return {previousState}
        });
    },
    _scrollBrar:function(){
        $(this.refs.scrollBox).mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark"
        });
    },
    _textFieldChangeHandle:function(evt){//修改了报表的名字
        var thisVal = $(evt.target).val();
        thisVal = thisVal.trim()
        if(thisVal!==undefined && thisVal!== null && thisVal !== ""){
            if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)){
                this.setState({
                    errorTextState:'当前输入的名字格式错误'
                })
            }else{
                if(CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16){
                    this.setState({
                        errorTextState:CheckEntryTextComponent.checkAllNameLengthHandle(thisVal)+' / 16'
                    })
                }else{
                    this.setState({
                        errorTextState:''
                    })
                    App.emit('APP-DASHBOARD-REPORT-EDIT-HANDLE',{
                        reportName:thisVal,
                        row:this.props.rowNum,
                        col:this.props.colNum
                    });
                }
            }
        }else{
            this.setState({
                errorTextState:''
            })
            App.emit('APP-DASHBOARD-REPORT-EDIT-HANDLE',{
                reportName:this.__tempThisVal,
                row:this.props.rowNum,
                col:this.props.colNum
            });
        }
    },
    _mountCompoent:function(){//加载右侧上部的方法
        if(this.props.reprotData.category==="CHART"){
            return <ChartReportComponent
                        filterData={this.state.dataArrState}
                        reportId={this.state.reprotId}
                        showCharIcon={this.state.showCharIcon}
                        showDefaultFilter={this.state.showDefaultFilter}
                        defaultFilterFields={this.state.defaultFilterFields}
                        typeState={this.state.typeState}
                        row={this.props.rowNum}
                        col={this.props.colNum} />
        }else if(this.props.reprotData.category==="INDEX"){
            return <TableReportComponent
                    filterData={this.state.dataArrState}
                    reportId={this.state.reprotId}
                    showDefaultFilter={this.state.showDefaultFilter}
                    defaultFilterFields={this.state.defaultFilterFields}
                    typeState={this.state.typeState}
                    row={this.props.rowNum}
                    col={this.props.colNum} />
        }
    },
    _filterSort:function(arg){
        var _this = this;
        var next = arg.next,prev = arg.prev;
        this.setState(function(previousState,currentProps){
            var filterFields = [];
            var items = [];
            if(previousState.dataArrState != undefined){
                filterFields = previousState.dataArrState;
            }
            for(var i=0;i<filterFields.length;i++){
                items.push(filterFields[i]);
            }
            var prevItem = items[prev];
            var nextItem = items[next];
            if (prev < next) {
                items.splice((next + 1), 0, prevItem);
                items.splice(prev, 1);
            }
            if (prev > next) {
                items.splice(prev, 1);
                items.splice((next), 0, prevItem);
            }

            previousState.dataArrState = items;
            return previousState;
        })
        var fields = [];
        for(var i=0;i<this.state.dataArrState.length;i++){
            if(this.state.dataArrState[i].selected){
                var field =  {
                    dbField:this.state.dataArrState[i].fieldName,
                    name:this.state.dataArrState[i].name,
                    valueType:this.state.dataArrState[i].fieldType,
                    selected:this.state.dataArrState[i].selected,
                    value:[],
                    items:[],
                    pattern:""
                };
                fields.push(field);
            }
        }
        setTimeout(function(){
            App.emit('APP-DASHBOARD-REPORT-FILTER-SORT',{
                fields:fields,
                row:_this.props.rowNum,
                col:_this.props.colNum
            });

        },100)
    },
    _filterSortClick:function(arg){
        var _this = this;
        var next = arg.next,prev = arg.prev;
        this.setState(function(previousState,currentProps){
            var filterFields = [];
            var items = [];
            if(previousState.dataArrState != undefined){
                filterFields = previousState.dataArrState;
            }
            for(var i=0;i<filterFields.length;i++){
                items.push(filterFields[i]);
            }
            var prevItem = items[prev];
            var nextItem = items[next];
            items[prev]=nextItem;
            items[next]=prevItem;
            previousState.dataArrState = items;
            return previousState;
        })
        var fields = [];
        for(var i=0;i<this.state.dataArrState.length;i++){
            if(this.state.dataArrState[i].selected){
                var field =  {
                    dbField:this.state.dataArrState[i].fieldName,
                    name:this.state.dataArrState[i].name,
                    valueType:this.state.dataArrState[i].fieldType,
                    selected:this.state.dataArrState[i].selected,
                    value:[],
                    items:[],
                    pattern:""
                };
                fields.push(field);
            }
        }
        setTimeout(function(){
            App.emit('APP-DASHBOARD-REPORT-FILTER-SORT',{
                fields:fields,
                row:_this.props.rowNum,
                col:_this.props.colNum
            });
        },100)
    }
})
