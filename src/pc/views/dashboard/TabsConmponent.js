var $ = require('jquery');
var React = require('react');
var ReportStore = require('../../stores/ReportStore');
var Loading = require('../common/Loading');
var App = require('app');
var { 
    Tabs,
    Tab
} = require('material-ui');
module.exports = React.createClass({
    app:{},
    displayName:"弹出的筛选的值",
    getInitialState: function() {
        var filterValues = JSON.parse(this.props.filterValues).values;
        var selectedValues = JSON.stringify({values:this.props.selectedValues});
        selectedValues = JSON.parse(selectedValues).values;
        return {
            filterValues:filterValues,
            selectedValues:selectedValues,
            tabValue:'selectAll',
            loading:this.props.loading,
            showPage:this.props.showPage
        }
    },
    componentWillMount:function(){
        
    },
    componentDidMount: function() {
        //关闭搜索框之后重置里面的内容
        this.app['APP-DASHBOARD-SET-REPORT-FILTER-VALUE'] = App.on('APP-DASHBOARD-SET-REPORT-FILTER-VALUE', this._getFilterValue);
        this.app['APP-DASHBOARD-SET-REPORT-FILTER-LOADING'] = App.on('APP-DASHBOARD-SET-REPORT-FILTER-LOADING', this._setLoading);
        this._scrollBrar();
    },
    componentDidUpdate: function() {
        //this._scrollBrar();
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
        this.setState(function(previousState,currentProps){
            previousState.filterValues = JSON.parse(nextProps.filterValues).values;
            var filterValues = previousState.filterValues;
            var oldFilterValues = JSON.parse(JSON.stringify({values:this.state.selectedValues})).values;
            for(var i=0;i<filterValues.length;i++){
                for(var j=0;j<oldFilterValues.length;j++){
                    if(oldFilterValues[j].name==filterValues[i].name&&oldFilterValues[j].selectedRow == this.props.row&&oldFilterValues[j].selectedCol == this.props.col){
                        filterValues[i].selectBool = oldFilterValues[j].selectBool;
                    }
                }
            }
            previousState.loading = nextProps.loading;
            previousState.showPage = nextProps.showPage;
            return previousState;
        })
        if(!nextProps.loading){
            $(".loadingPage").hide();
        }
    },
    render:function(){
        var filterValuesConmponent,filterSelectedConmponent;
        if(this.state.loading){
            filterValuesConmponent = (
                <ul className="nullClassNameUl">
                    <li className="loading"><Loading/></li>
                </ul>
            )
        }else{
            if(this.state.filterValues.length>0){
                filterValuesConmponent = (
                    <ul>
                        {this.state.filterValues.map(this._selectAllFileterValHandle)}    
                    </ul>
                )  
            }else{
                filterValuesConmponent = (
                    <ul className="nullClassNameUl">
                        <li className="nullClassName">暂无筛选值数据</li>
                    </ul>
                )   
            }
        }
        if(this.state.selectedValues.length>0){
            filterSelectedConmponent = (
                <ul>
                    {this.state.selectedValues.map(this._selectedFileterValHandle)}    
                </ul>
            )
        }else{
            filterSelectedConmponent = <div className="nullClassName">暂无筛选值数据</div>  
        }

        return (
                <Tabs value={this.state.tabValue} onChange={this._tabChangeHandle} inkBarStyle={{backgroundColor:"#00e5ff"}}>
                    <Tab label="全部" value="selectAll" className="tabsClassName">
                        <div className="listComponentSelect listComponentSelectALL"><div>{filterValuesConmponent}</div></div>
                        <div className="loadingPage">加载中...</div>
                    </Tab>
                    <Tab label="已选" value="selected" className="tabsClassName">
                        <div className="listComponentSelect listComponentSelectCHECKED"><div>{filterSelectedConmponent}</div></div>
                    </Tab>
                </Tabs>
            )
    },
    _getFilterValue:function(){
        var _this = this;
        setTimeout(function(){
            App.emit('APP-DASHBOARD-SET-REPORT-FILTER-VALUES',{
                items:_this._getValues(_this.state.selectedValues),
                index:_this.props.index,
                row:_this.props.row,
                col:_this.props.col
            })
            App.emit('APP-DASHBOARD-REPORT-SET-FILTER-SELECTED-ITEMS',_this.state.selectedValues,null,_this.props.index);
        },100)
    },
    _getValues:function(values){
        var newValues = JSON.stringify({values:values});
        newValues = JSON.parse(newValues).values;
        return newValues;
    },
    _scrollBrar:function(){//滚动条方法
        var _this = this;
        //if(!this.props.loading)
        $(".listComponentSelectALL").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark",
            callbacks:{
                onTotalScroll:function(){
                    if(_this.state.showPage){
                        $('.loadingPage').show();
                        _this._onPageData();
                    }
                }
            }
        });
        $(".listComponentSelectCHECKED").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark"
        });
    },
    _onPageData:function(event,keyword){//onKeyUp搜索执行的方法
        var _this = this;
        var inputValue = '';
        var pageNum = _this.props.pageNum+1;
        if(keyword||keyword==''){
            inputValue = keyword;
        }
        //this._setLoading(true);
         App.emit('APP-DASHBOARD-REPORT-GET-FILTER-ITEMS',null,inputValue,{
            row:_this.props.row,
            col:_this.props.col,
            index:_this.props.index
         },pageNum);
    },
    _selectAllFileterValHandle:function(item,index){
        //输出筛选值的列表的dom结构方法
        var selectedClass=classnames({'':!item.selectBool,'selectedOn':item.selectBool == true});//选择之后的样式
        var selectedHtml=classnames({'选择':!item.selectBool,'已选择':item.selectBool});//选择之后的名字
        return  <li key={index}>
            <dl>
                <dt title={item.name}>{item.name}</dt>
                <dd>
                    <a href="javascript:;" onClick={(evt)=>this._selectValHandle(evt,index,item.selectBool,1)} className={selectedClass}>{selectedHtml}</a>
                </dd>
            </dl>
        </li> 
    },
    _selectedFileterValHandle:function(item,index){//输出筛选值的列表的dom结构方法
        var selectedClass=classnames({'':!item.selectBool,'selectedOn':item.selectBool == true});//选择之后的样式
        var selectedHtml=classnames({'选择':!item.selectBool,'已选择':item.selectBool});//选择之后的名字
        if(item.selectBool && item.selectedRow==this.props.row && item.selectedCol == this.props.col)
        return  <li key={index}>
            <dl>
                <dt>{item.name}</dt>
                <dd>
                    <a href="javascript:;" onClick={(evt)=>this._selectValHandle(evt,index,item.selectBool,0)} className={selectedClass}>{selectedHtml}</a>
                </dd>
            </dl>
        </li> 
    },
    _selectValHandle:function(evt,index,selectBool,type){
        //点击筛选值右侧的选择或者已选择执行的方法
        evt.stopPropagation();
        var _this = this;
        this.setState(function(p){
            var selectedValues = p.selectedValues;
            var filterValues = p.filterValues;
            // var selectedItems = [];
            if(type==1){
                filterValues[index].selectBool = !selectBool;
                filterValues[index].selectedRow = this.props.row;
                filterValues[index].selectedCol = this.props.col;
                if(!selectBool){
                    selectedValues.push(filterValues[index]);
                }else{
                    for(var i=0;i<selectedValues.length;i++){
                        if(selectedValues[i].name==filterValues[index].name&&selectedValues[i].selectedRow == this.props.row&&selectedValues[i].selectedCol == this.props.col){
                            selectedValues.splice(i,1);
                        }
                    }
                }
            }else{
                for(var i=0;i<filterValues.length;i++){
                    if(filterValues[i].name==selectedValues[index].name&&selectedValues[index].selectedRow == this.props.row&&selectedValues[index].selectedCol == this.props.col){
                        filterValues[i].selectBool = false;
                    }
                }
                for(var i=0;i<selectedValues.length;i++){
                    if(selectedValues[i].name==selectedValues[index].name&&selectedValues[index].selectedRow == selectedValues[i].selectedRow&&selectedValues[index].selectedCol ==  selectedValues[i].selectedCol){
                        selectedValues.splice(i,1);
                    }
                }
            }
            p.selectedValues = selectedValues;
            p.filterValues = filterValues;
            return p;
        })
    },
    _tabChangeHandle:function(value){//tab 切换的效果方法
        this.setState(function(previousState,currentProps){
            previousState.tabValue = value;//设置切换到什么上的值
            return {previousState};
        });
    },
    _setLoading:function(arg){
        this.setState(function(previousState,currentProps){
            previousState.loading = arg;
            return {previousState};
        });
    }
});