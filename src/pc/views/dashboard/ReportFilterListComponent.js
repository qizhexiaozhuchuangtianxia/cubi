var React = require('react');
var App = require('app');
var classnames=require('classnames');
var FilterSort = require('./FilterSort');
module.exports = React.createClass({
	getInitialState:function(){
        return {
            filterListData:[]
        }
	},
    componentWillReceiveProps:function(nextProps){
        this.setState({
            filterListData:nextProps.filterListData
        })
    },
    componentDidMount: function() {
        App.on("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE",this._filterSortClickSign)
    },
   
    _filterSortClickSign:function(arg){

        App.emit("APP-DASHBOARD-REPORT-FILTER-GET-DRAG-STATE",{
            isClick:arg.isClick,
            sIndex:arg.sIndex
        });
        
    },
	render:function(){
       if(this.state.filterListData.length>0){
            return (
                <div className="dashboardReportEdit-bar-toggle-box">
                    <div className="dashboardReportEdit-bar-toggle-box-title">
                        <h1>筛选器</h1>
                        <p>打开维度筛选器可以在使用此分析时进行数据筛选：</p>
                    </div>
                    <ul>
                        {this.state.filterListData.map(this._filterLiHtmlHandle)}
                    </ul>
                </div>
            )
        }else{
            return (
                <div className="dashboardReportEdit-bar-toggle-box">
                    <div className="dashboardReportEdit-bar-toggle-box-title">
                        <h1>筛选器</h1>
                        <p>打开维度筛选器可以在使用此分析时进行数据筛选：</p>
                    </div>
                    <ul></ul>
                </div>
            )
        }
	},
    _selectHandle:function(evt,filterIndex,filterName,filterSelected,item){
        evt.stopPropagation();
        var fields = (this.state.filterListData);
        var itemObj = {
            dbField:item.fieldName,
            name:item.name,
            valueType:item.fieldType,
            selected:!item.selected,
            value:[],
            items:[],
            pattern:""
        }
        var items = [];
        for(var i=0;i<fields.length;i++){
            if(i==filterIndex){
                fields[i].selected = !filterSelected;
            }
            if(fields[i].selected){
               items.push({
                    dbField:fields[i].fieldName,
                    name:fields[i].name,
                    valueType:fields[i].fieldType,
                    selected:!fields[i].selected,
                    value:[],
                    items:[],
                    pattern:""
                }) 
            }
        }
        App.emit("APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE",{//点击编辑小笔 修改筛列表是否可见
            filterIndex:filterIndex,
            selectedBool:filterSelected
        });
        App.emit("APP-DASHBOARD-REPORT-EDIT-FILTER-TOGGLE-HANDLE",{//修改筛选是否可见之后，从新渲染页面 定义在dashboard.js里面
            row:this.props.row,
            col:this.props.col,
            itemObj:items
        });
    },
    _modifyFilterHandle:function(data){// 点击已选择或者选择的之后 返回函数 修改当前显示状态
        this.setState(function(previousState,currentProps){
            previousState.filterListData = data;
            return {previousState};
        });
    },
    _filterLiHtmlHandle:function(item,index){//输出右侧弹出筛选器列表的方法.
        var selectedClass=classnames({'filterBtnDefault':!item.selected,'deleteIconBtnOn':item.selected});//选择之后的样式
        var selectedHtml=classnames({'选择':!item.selected,'已选择':item.selected});//选择之后的名字
        return  <li key={item.name}>
                    <dl>
                        <dt>{item.name.toUpperCase()}</dt>
                        <dd>
                            <FilterSort name={item.name} index={index} row={this.props.row} col={this.props.col}/>
                            <a href="javascript:;" className={selectedClass} onClick={(evt)=>this._selectHandle(evt,index,item.name,item.selected,item)}>{selectedHtml}</a>
                        </dd>
                    </dl>
                    <dl className="shadow-dl"></dl>
                </li>
    },
})