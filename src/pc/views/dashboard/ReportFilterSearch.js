/**
 * Created by Administrator on 2016-2-29.
 */
var React = require('react');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');

module.exports = React.createClass({
    app:{},
    displayName:"筛选搜索组件",
    getInitialState: function() {
        return {
            openSearchComponent:false, 
        }
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    render: function(){
        if(this.state.openSearchComponent){
            return  (
                <div className="searchBox searchBoxWidth">
                    <div className="searchInputBox">
                        <i className="iconfont icon-icsousuo24px"></i>
                        <input type="text" ref="searchRef" onChange={(evt)=>this._onKeyUpHandle(evt)} name="search" placeholder="搜索维度值" />
                    </div>
                    <span href="javascript" className="iconfont icon-icquxiao24px" onClick={(evt)=>this._onKeyUpHandle(evt,'')}></span>
                </div>
            )
        }else{
            return  (
                <div className="searchBox">
                    <a href="javascript:;" onClick={(evt)=>this._openInputBoxHandle(evt)} className="iconfont icon-icsousuo24px"></a>
                </div>
            )
        }
    },
    _onKeyUpHandle:function(event,keyword){//onKeyUp搜索执行的方法
        var _this = this;
        if(this.timeOutId){
            clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(function(){//输入完成之后才执行的方法
            var input = _this.refs.searchRef;
            var inputValue = $.trim(input.value);
            if(keyword||keyword==''){
                inputValue = keyword;
                _this.setState({
                    openSearchComponent:!_this.state.openSearchComponent
                })
            }
            App.emit('APP-DASHBOARD-SET-REPORT-FILTER-LOADING',true);
             App.emit('APP-DASHBOARD-REPORT-GET-FILTER-ITEMS',null,inputValue,{
                row:_this.props.row,
                col:_this.props.col,
                index:_this.props.index
             });
        },200)
    },
    _openInputBoxHandle:function(evt){//点击搜索按钮显示输入框
        evt.stopPropagation();
        this.setState({
            openSearchComponent:!this.state.openSearchComponent
        })
    }
});
