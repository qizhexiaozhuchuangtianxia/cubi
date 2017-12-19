
/*var React = require('react');
var App = require('app');
var TabsConmponent = require('./TabsConmponent');
var DateConmponent = require('./DateConmponent');
var {
    IconButton,
    FlatButton,
    Dialog
} = require('material-ui');
module.exports = React.createClass({
	getInitialState:function(){
        return {
            dialogName:'',//弹出层的名字 比如当前点击的是地域筛选
            dialogOpen:false,//弹出层的状态 默认是关闭 看不到的
            dialogDbField:'',//点击筛选条件的dbField值
            dialogFilterFieldsArr:[],//当前已选择的筛选,用于刷新当前的图形的数据
            dialogFilterAllValueAllArr:null,//当前筛选的全部值，数组格式
            dialogCurrentFilter:{},//当前点击的item的数据格式,用于拼接处提交刷新的数据
            dialogLoadComponentType:'',//判断当前点击的是日期类换是其他类型
            filterData:this.props.filterListData
        }
	},
	render:function(){
		return (
                <ul>
                    {this.state.filterData.map(this._filterLiHtmlHandle)}
                    {this._dialogHandle()}
                </ul>
			)
	},
    _filterLiHtmlHandle:function(item,index){//输出右侧弹出筛选器列表的方法.
        var selectedClass=classnames({//选择之后的样式
            'filterBtnDefault':!item.selected,
            'deleteIconBtnOn':item.selected === true
        });
        var selectedHtml=classnames({//选择之后的名字
            '筛选':!item.selected,
            '已筛选':item.selected
        });
        return  <li key={index}>
                    <dl>
                        <dt>{item.name}</dt>
                        <dd>
                            <IconButton className="deleteIconBtn" iconClassName='iconfont icon-icshanchu24px'></IconButton>
                            <a href="javascript:;" onClick={(evt)=>this._onClickFilterListHandle(evt,item)} className={selectedClass}>{selectedHtml}</a>
                        </dd>
                    </dl>
                </li>
    },
    _dialogHandle:function(){//默认生成一个弹出插件
        var actions = [
            <FlatButton label="取消" secondary={true} onTouchTap={this._closeDialogHandle}/>,
            <FlatButton label="确定" primary={true} keyboardFocused={false} onTouchTap={this._submitDialogHandle}/>
        ];
         return  <Dialog 
                        contentClassName="contentClassNameDialog" 
                        titleClassName="titleClassNameDialog" 
                        bodyClassName="bodyClassNameDialog" 
                        actionsContainerClassName="actionsContainerClassNameDialog" 
                        title={this.state.dialogName} 
                        open={this.state.dialogOpen} 
                        actions={actions} 
                        modal={false} 
                        onRequestClose={this._closeDialogHandle}>
                        {this._searchCompoentHandle()}
                        <TabsConmponent filterValueArr={this.state.dialogFilterAllValueAllArr} filteData={this.state.dialogCurrentFilter} reportId={this.props.reportId} dbField={this.state.dialogDbField} />
                    </Dialog>
    },
    _closeDialogHandle:function(){//关闭右侧点击筛选弹出的弹出层
        this.setState({open: false});
    },
    _submitDialogHandle:function(){//点击右侧点击筛选弹出的弹出层当中的确定按钮 提交
    },
    _searchCompoentHandle:function(){//加载搜索输入框        
        if(this.state.openSearchComponent){
            return  <div className="searchBox searchBoxWidth">
                        <div className="searchInputBox">
                            <i className="iconfont icon-icsousuo24px"></i>
                            <input type="text" ref="searchRef" onKeyUp={(evt)=>this._onKeyUpHandle(evt)} name="search" placeholder="请输入立方名称" />
                            <span href="javascript" className="iconfont icon-icquxiao24px" onClick={(evt)=>this._openInputBoxHandle(evt)}></span>
                        </div>
                    </div>
        }else{
            return  <div className="searchBox">
                        <a href="javascript:;" onClick={(evt)=>this._openInputBoxHandle(evt)} className="iconfont icon-icsousuo24px"></a>
                    </div>
        }
    },
    _onClickFilterListHandle:function(evt,itemObj){//点击右侧弹出的已筛选和筛选之后执行的方法
        evt.stopPropagation();
        this.setState(function(previousState,currentProps){
            previousState.dialogName = itemObj.name;
            previousState.dialogOpen = true;
            previousState.dialogDbField = itemObj.dbField;
            previousState.dialogCurrentFilter = itemObj;
            previousState.dialogLoadComponentType = itemObj.valueType;
            return {previousState};
        });
    }
})*/