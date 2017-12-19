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
var AddCellLeft = require('./AddCellLeft');
var AddCellRight = require('./AddCellRight');
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
            moreOpen:false,
            view:(this.props.data.width<600)?'s':'b'
        }
    },
    componentWillUnmount:function(){
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillReceiveProps: function(nextProps) { //点击本页面进入本页面的时候触发
        this.setState({
            view:(nextProps.data.width<600)?'s':'b'
        })
    },
    componentDidMount: function() {
        this.app['APP-DIALIG-CLOSE-HANDLE'] = App.on('APP-DIALIG-CLOSE-HANDLE',this._close);
        this.app['APP-DIALIG-MOREBTN-CLOSE'] = App.on('APP-DIALIG-MOREBTN-CLOSE',this._closeMoreDialog);
    },
    render:function(){
        var delBtnBox = <DelBtn row={this.props.row} col={this.props.col} cell={this.props.cell} operation={this.props.operation}/>;
        var DragColPanel = null;
        var rowData = this.props.rowData;
        var colLen = 0;
        if(rowData){
            colLen = rowData.cells.length
        }

        var DragColComponent = <DragCol
            operation={this.props.operation}
            row={this.props.row}
            cell={this.props.cell}
            left={this.props.data.width-8}
            col={this.props.col}
            clen={this.props.clen}
            colLen={colLen}
        />;
        if(colLen<4){
            if(this.props.col!=colLen-1){
                DragColPanel = DragColComponent;
            }
        }
        if(this.props.first){
            delBtnBox = '';
        }
        var btnCls = '',Cls = '',addBack='  ';

        var reportShowBoxHei=this.props.data.height-24;
        var pageSize = parseInt((reportShowBoxHei - 106) / 48);
        reportShowBoxHei=pageSize*49+56*2+1;
        var view = (this.state.view=='b'&&this.props.data.width<600);
        var width = view?1184:this.props.data.width-16;
        /*if(this.props.width < 608 && pageSize>3){
            btnCls = ' centenr';
            addBack = ' addBack'

        }else if(pageSize<=3 && this.props.width < 608){
            btnCls = ' line-center ';
            Cls = ' panelCls ';
            addBack = ' addBack'

        }*/
        var left = 0;
        if(view){
            if(this.props.col==1){
                left = this.props.rows[this.props.row].cells[0].width;
            }
            if(this.props.col==2){
                left = this.props.rows[this.props.row].cells[0].width+
                    this.props.rows[this.props.row].cells[1].width;
            }
            if(this.props.col==3){
                left = this.props.rows[this.props.row].cells[0].width+
                    this.props.rows[this.props.row].cells[1].width+
                    this.props.rows[this.props.row].cells[2].width;
            }
        }
        var panelStyle = view?{
            width:width,
            position:'relative',
            left:-left
        }:{
            width:width,
            left:-left
        }
        if(this.props.rows.length==1&&this.props.rows[0].cells.length==1&&this.props.rows[0].cells[0].report.addData=='no'){
            delBtnBox = null;
        }
        var AddCellLeftBtn = <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>;
        var AddCellRightBtn = <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>;
        if(view){
            AddCellLeftBtn = null;
            AddCellRightBtn = null;
            delBtnBox = null;
        }
        if(this.props.operation=='edit'){
             return (
                <div className="dashboardView_col" style={{width:this.props.data.width}}>
                    {AddCellLeftBtn}
                    {AddCellRightBtn}
                    <div className="dashboardView_col_box" style={{zIndex:view?999:''}}>
                        {delBtnBox}
                        <div className="dashboardView_add_panel" style={panelStyle}>
                            <div className="add_dashboard">
                                {DragColPanel}
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
                </div>
            );
        }else{
            return (
                <div className="dashboardView_col" style={{width:this.props.data.width}}>
                    <div className="dashboardView_col_box">
                        <div className="add_dashboard">
                            <div className="add_dashboard_panel" style={{height:reportShowBoxHei}}>
                                <div className="no_view_report">此处无分析</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },
    _addButton:function(){
        var html = (
            <div className="add_btn">
                <div className={"add_text_btn"}><a href="javascript:void(0)" onClick={this._openRepotText}>添加富文本</a></div>
                <div className={"add_report_btn"}><a href="javascript:void(0)" onClick={this._openReportList}>添加分析</a></div>
                <div className={"add_filter_btn"}><a href="javascript:void(0)" onClick={this._openFilterTypeList}>添加筛选器</a></div>
                <div className={"add_web_btn"}><a href="javascript:void(0)" onClick={this._openWeb}>添加网页</a></div>
            </div>
        );
        if(this.state.view=='b'&&this.props.data.width<600){
            var html = (
                <div className="add_btn">
                    <div className={"add_text_btn and_more"}><a href="javascript:void(0)" onClick={this._openRepotText}>添加富文本</a></div>
                    <div className={"add_report_btn and_more"}><a href="javascript:void(0)" onClick={this._openReportList}>添加分析</a></div>
                    <div className={"add_filter_btn and_more"}><a href="javascript:void(0)" onClick={this._openFilterTypeList}>添加筛选器</a></div>
                    <div className={"add_web_btn and_more"}><a href="javascript:void(0)" onClick={this._openWeb}>添加网页</a></div>
                    <div className={"add_close_btn and_more"}><a href="javascript:void(0)" onClick={this._closeMore}>返回</a></div>
                </div>
            );
        }
        if(this.state.view=='b'){
            return html;
        }else{
            return (
                <div className="add_btn">
                    <div className={"add_more_btn"}><a href="javascript:void(0)" onClick={this._openMore}>添加内容</a></div>
                </div>
            )
        }
    },
    _close:function(){
        App.emit('APP-DIALIG-CLOSE');
        App.emit('APP-DIALIG-CLOSE-SET-HEADER-HANDLE');
    },
    _openMore:function(){
        this.setState({
            view:'b'
        })
    },
    _closeMore:function(){
        this.setState({
            view:'s'
        })
    },
    _openReportList:function(){
        App.emit('APP-DIALIG-OPEN',<DialogReportList row={this.props.row} col={this.props.col} openType="dialog"/>)
        App.emit('APP-MENU-TOGGLE-BACK-HANDLE',{toggle:true,func:'APP-DIALIG-CLOSE-HANDLE'});
    },
    _openRepotText:function(){
        App.emit('APP-DASHBOARD-REPORT-TEXT-OPEN',{row:this.props.row,col:this.props.col,name:'',content:''});
    },
    _openFilterTypeList:function(){
        $(ReactDOM.findDOMNode(this)).find('.add_btn_box').addClass('add_btn_box_anim');
    },
    _openWeb:function(){
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
        App.emit('APP-DASHBOARD-ADD-REPORT',{
            row:this.props.row,
            col:this.props.col,
            type:item.filterType,
            name:item.name,
        });
    },

});
