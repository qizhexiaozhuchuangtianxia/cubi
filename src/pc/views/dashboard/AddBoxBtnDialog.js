/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');
var DialogReportList = require('../dialogReportList');
var DragCol =  require('./DragCol');
var DelBtn =  require('./DelBtn');
var AddBoxBtn =  require('./AddBoxBtn');
var {
    Dialog
} = require('material-ui');

module.exports = React.createClass({
    app:{},
    getInitialState: function() {
        return {
            addFilterBtnList:[
                {
                    name:'多选筛选器',
                    filterType:'DOWN_FILTER',
                },
                {
                    name:'搜索筛选器',
                    filterType:'SEARCH_FILTER',
                },
                {
                    name:'日历筛选器',
                    filterType:'DATE_FILTER',
                }
            ],
            open:false,
            moreOpen:false
        }
    },
    componentWillUnmount:function(){
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentDidMount: function() {
        this.app['APP-DIALIG-CLOSE-HANDLE'] = App.on('APP-DIALIG-CLOSE-HANDLE',this._close);
    },
    render:function(){
        var rowData = this.props.rowData;
        var btnCls = '',Cls = '',addBack='  ';
        var reportShowBoxHei=this.props.data.height-24;
        var pageSize = parseInt((reportShowBoxHei - 106) / 48);
        reportShowBoxHei=pageSize*49+56*2+1;
        return (
            <div className="dashboardView_col" style={{width:this.props.data.width}}>
                <div className="dashboardView_col_box">
                    <div className="add_dashboard">
                        <div className={"add_dashboard_panel"+Cls} style={{height:reportShowBoxHei}}>
                            <div className="add_btn_box">
                                {this._addButton()}
                                <div className="add_btn">
                                    {this.state.addFilterBtnList.map(this._renderAddBtn)}
                                    <div className={"add_close_btn"+addBack}><a href="javascript:void(0)" onClick={this._closeFilterTypeList}>返回</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    _addButton:function(){
        return (
            <div className="add_btn">
                <div className={"add_text_btn"}><a href="javascript:void(0)" onClick={this._openRepotText}>添加富文本</a></div>
                <div className={"add_report_btn"}><a href="javascript:void(0)" onClick={this._openReportList}>添加分析</a></div>
                <div className={"add_filter_btn"}><a href="javascript:void(0)" onClick={this._openFilterTypeList}>添加筛选器</a></div>
                <div className={"add_web_btn"}><a href="javascript:void(0)" onClick={this._openWeb}>添加网页</a></div>
            </div>
        )
    },
    _close:function(){
        App.emit('APP-DIALIG-CLOSE');
        App.emit('APP-DIALIG-CLOSE-SET-HEADER-HANDLE');
    },
    _openMore:function(){
        this.setState({
            moreOpen:true
        })
    },
    _closeMoreDialog:function(){
       App.emit('APP-DIALIG-MOREBTN-CLOSE');
    },
    _openReportList:function(){
        this._closeMoreDialog();
        App.emit('APP-DIALIG-OPEN',<DialogReportList row={this.props.row} col={this.props.col} openType="dialog"/>)
        App.emit('APP-MENU-TOGGLE-BACK-HANDLE',{toggle:true,func:'APP-DIALIG-CLOSE-HANDLE'});
        this._closeMoreDialog();
    },
    _openRepotText:function(){
        this._closeMoreDialog();
        App.emit('APP-DASHBOARD-REPORT-TEXT-OPEN',{row:this.props.row,col:this.props.col,name:'',content:''});
    },
    _openFilterTypeList:function(){
        $(ReactDOM.findDOMNode(this)).find('.add_btn_box').addClass('add_btn_box_anim');
    },
    _openWeb:function(){
        this._closeMoreDialog();
        App.emit('APP-DASHBOARD-WEB-OPEN',{row:this.props.row,col:this.props.col,name:'',url:''});
    },
    _closeFilterTypeList:function(){
        $(ReactDOM.findDOMNode(this)).find('.add_btn_box').removeClass('add_btn_box_anim');
    },
    _renderAddBtn:function(item,index){
      var reportShowBoxHei=this.props.data.height-24;
      var pageSize = parseInt((reportShowBoxHei - 106) / 48);
      //  console.log(this.props.width, reportShowBoxHei,pageSize,'this.props.width ')

      var className="add_down_btn",addStyle='';
      if( this.props.width < 600){
         addStyle = ' btn'+index
      }
      if(item.filterType=="SEARCH_FILTER"){
          className="add_search_btn";
      }
      if(item.filterType=="DATE_FILTER"){
          className="add_date_btn";
      }

      return  <div key={index} className={className+addStyle}>
                    <a href="javascript:void(0)" onClick={(evt)=>this._addFilter(item)}>{item.name}</a>
                </div>
    },
    _addFilter:function(item){
        this._closeMoreDialog();
        App.emit('APP-DASHBOARD-ADD-REPORT',{
            row:this.props.row,
            col:this.props.col,
            type:item.filterType,
            name:item.name,
        });
    },

});
