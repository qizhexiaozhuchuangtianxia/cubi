/**
 * Created by Administrator on 2016-2-29.
 */
var React = require('react');
var App = require('app');
var $ = require('jQuery');
var TabsConmponent = require('./TabsConmponent');
var ReportDateRangeSelector = require('../common/ReportDateRangeSelector');
var ReportFilterSearch = require('./ReportFilterSearch');
var ReportStore = require('../../stores/ReportStore');
var PublicButton = require('../common/PublicButton');

var {
    Dialog,
    DatePicker
    } = require('material-ui');

module.exports = React.createClass({
    app:{},
    displayName:"筛选维度的组件",
    loadItems:false,
    getInitialState: function() {
        return {
            open : false,
            selectedValues:[],
            filterValues:[],
            dateRangeType:'CUSTOM',
            startDate:'',
            endDate:'',
            loading:true,
            showPage:true,
            pageNum:1
        }
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillMount:function(){//组件将要挂在的时候加载筛选值
        //this._getFilterItems(this.props.item.dbField);
    },
    componentWillReceiveProps:function(nextProps){
        if(this.state.open)
        this._getFilterItems(nextProps.item.dbField);
    },
    componentDidMount: function() {
        //获取筛选值列表
        this.app['APP-DASHBOARD-REPORT-GET-FILTER-ITEMS'] = App.on('APP-DASHBOARD-REPORT-GET-FILTER-ITEMS',this._getFilterItems);
        this.app['APP-DASHBOARD-REPORT-SET-FILTER-SELECTED-ITEMS'] = App.on('APP-DASHBOARD-REPORT-SET-FILTER-SELECTED-ITEMS',this._setSelectedValues);
    },
    render: function(){
        var actions,
            DialogPanel,
            DialogContentPanel,
            DialogSearchPanel,
            contentClassName,
            titleClassName,
            bodyClassName,
            actionsContainerClassName;
        if(this.props.item.valueType == 'STRING'||this.props.item.valueType == 'LONG'){
            actions = [
              <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
  							labelText="取消"
  							rippleColor="rgba(255,255,255,0.25)"
  							hoverColor="rgba(255,255,255,0.15)"
  							secondary={true}
  							onClick={this._handleClose}/>,

  						<PublicButton
                style={{color:"rgba(0,229,255,255)"}}
  							labelText="确定"
  							rippleColor="rgba(0,229,255,0.25)"
  							hoverColor="rgba(0,229,255,0.15)"
  							primary={true}
  							keyboardFocused={false}
  							onClick={this._handleSubmitHandle}/>

            ];
            contentClassName="contentClassNameDialog",
            titleClassName="titleClassNameDialog",
            bodyClassName="bodyClassNameDialog",
            actionsContainerClassName="actionsContainerClassNameDialog";
            DialogContentPanel = (
                <TabsConmponent
                    filterValues={JSON.stringify({values:this.state.filterValues})}
                    selectedValues = {this.state.selectedValues}
                    reportId={this.props.reportId}
                    index={this.props.index}
                    row={this.props.row}
                    col={this.props.col}
                    dbField={this.props.item.dbField}
                    onChange={this._onChangeHandle}
                    loading = {this.state.loading}
                    showPage = {this.state.showPage}
                    pageNum = {this.state.pageNum}
                />
            )
            DialogSearchPanel = (
                <ReportFilterSearch row={this.props.row} col={this.props.col} index={this.props.index}/>
            )
        }else if(this.props.item.valueType == 'DATE_CYCLE' || this.props.item.valueType == 'DATE_RANGE' || this.props.item.valueType == 'DATE'){
            actions = '';
            contentClassName="contentClassNameDialog contentClassNameDialogDate",
            titleClassName="titleClassNameDialog" ,
            bodyClassName="bodyClassNameDialog dashboardDateClass" ,
            actionsContainerClassName="actionsContainerClassNameDialog" ;
            DialogContentPanel = (
                <ReportDateRangeSelector
                    dateRangeType={this.state.dateRangeType}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onCancel={this._handleClose} onOK={this._handleSubmitHandle}
                />
            )
            DialogSearchPanel = null;
        }
        DialogPanel = <Dialog
            contentClassName={contentClassName}
            titleClassName={titleClassName}
            bodyClassName={bodyClassName}
            actionsContainerClassName={actionsContainerClassName}
            title={this.props.item.name.toUpperCase()}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this._handleClose}>
            {DialogSearchPanel}
            {DialogContentPanel}
        </Dialog>
        var cls = "filterItem";
        if(this.props.item.value.length>0){
            cls = "filterItem checked"
        }
        return (
            <div className={cls}>
                <FlatButton
                    label={this.props.item.name}
                    onClick={()=>this._handleOpen(this.props.item)}
                    labelStyle={{color:'#455a64',fontWeight:'bold',fontSize:'14px'}}
                    hoverColor='#eceeef'
                />
                {DialogPanel}
            </div>
        )
    },
    _getFilterItems:function(dbField,keyword,args,page){
        var _this=this;
        if(!dbField){
            dbField = this.props.item.dbField;
        }
        var changeed = false;
        if(!args){
            changeed = true;
        }else{
            if(args.row==this.props.row&&args.col==this.props.col&&args.index==this.props.index){
                changeed = true
            }
        }
        if(changeed){
            if(!this.loadItems){
                ReportStore.getFilterItems(this.props.reportId,dbField,keyword,page?page:1).then(function (jsonData) {
                     _this.setState(function(p){
                        var defItemsString = JSON.stringify({items:_this.props.item.items});
                        var defItemsObject = JSON.parse(defItemsString);
                        var defItems = defItemsObject.items;
                        var newItems = [];
                        var data = jsonData.data;
                        for(var j=0;j<data.length;j++){
                            newItems.push(data[j]);
                            newItems[j].selectBool = false;
                            for(var i=0;i<defItems.length;i++){
                                if(defItems[i].name==data[j].name&&defItems[i].selectedRow == this.props.row&&defItems[i].selectedCol == this.props.col){
                                    newItems[j].selectBool = defItems[i].selectBool;
                                }
                            }
                        }
                        p.showPage = jsonData.page;
                        if(page){
                            p.filterValues = p.filterValues.concat(newItems);
                            p.pageNum = page;
                        }else{
                            p.filterValues = newItems;
                        }
                        p.loading = false;
                        return p;
                    })
                    //_this.loadItems = data;
                })
            }else{
                /*_this.setState(function(p){
                    var data = _this.loadItems;
                    var defItemsString = JSON.stringify({items:_this.props.item.items});
                    var defItemsObject = JSON.parse(defItemsString);
                    var defItems = defItemsObject.items;
                    var newItems = [];
                    for(var j=0;j<data.length;j++){
                        newItems.push(data[j]);
                        newItems[j].selectBool = false;
                        for(var i=0;i<defItems.length;i++){
                            if(defItems[i].name==data[j].name){
                                newItems[j].selectBool = defItems[i].selectBool;
                            }
                        }
                    }
                    p.filterValues = newItems;
                    return p;
                })*/
            }
        }
    },
    _handleOpen : function(itemObj){//编辑状态下打开右侧的弹出的方法
        this._getFilterItems(itemObj.dbField);
        this.setState(function(previousState,currentProps){
            previousState.open = true;
            return {previousState};
        });
    },
    _handleClose : function(){//取消按钮方法
        this.setState({
            open: false
        });
    },
    _setSelectedValues:function(values,type,index){
        var _this = this;
        if(this.isMounted()){
            this.setState(function(previousState,currentProps){
                if(index==this.props.index){
                    if(type == 'date'){
                        previousState.dateRangeType=values.dateRangeType;
                        previousState.startDate=values.startDate;
                        previousState.endDate=values.endDate;
                    }else{
                        previousState.selectedValues=values;
                    }
                }else if(index=='clear'){
                    previousState.selectedValues=[];
                    previousState.dateRangeType='CUSTOM';
                    previousState.startDate='';
                    previousState.endDate='';
                }else{
                    return;
                }
                return {previousState};
            });
        }
        /*if(index==this.props.index){
            if(type == 'date'){
                if(this.isMounted()){
                    this.setState({
                        dateRangeType:values.dateRangeType,
                        startDate:values.startDate,
                        endDate:values.endDate
                    });
                }
            }else{
                if(this.isMounted()){
                    this.setState({
                        selectedValues:values
                    });
                }
            }
        }else if(index=='clear'){
            if(this.isMounted()){
                this.setState({
                    selectedValues:[],
                    dateRangeType:'CUSTOM',
                    startDate:'',
                    endDate:''
                });
            }

        }else{
            return;
        }*/
    },
    _handleSubmitHandle:function(result){
        if(result.type != 'mouseup'){
            var valueType = [result.type];
            var dateType = 'DATE_CYCLE';
            if(result.type == 'CUSTOM'){
                valueType = [result.startDate,result.endDate];
                dateType = 'DATE_RANGE';
                this._setSelectedValues({
                    dateRangeType:result.type,
                    startDate:result.startDate,
                    endDate:result.endDate
                },'date',this.props.index);
            }else{
                this._setSelectedValues({
                    dateRangeType:result.type,
                    startDate:null,
                    endDate:null
                },'date',this.props.index);
            }
            App.emit('APP-DASHBOARD-SET-REPORT-FILTER-VALUES',{
                items:[],
                value:valueType,
                dateType:dateType,
                index:this.props.index,
                row:this.props.row,
                col:this.props.col
            })
        }else{
            App.emit('APP-DASHBOARD-SET-REPORT-FILTER-VALUE');
        }
        this.setState({
            open:false
        })
    }
});
