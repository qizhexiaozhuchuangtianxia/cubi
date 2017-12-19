/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');

module.exports = React.createClass({
    getInitialState: function() {
        return {}
    },
    displayName:'DragCol',
    componentDidMount: function() {
        var _this = this;
        var _startX = 0;
        var _endX = 0;
        if(!this.props.sdk)
        $(ReactDOM.findDOMNode(this)).draggable({
            revert: false ,
            onStartDrag:function(e){
               $(this).css('cursor','default');
               _startX = e.clientX;
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',-1,'block',e.clientX,_this.props.row,'',_this.props.col);
            },
            onStopDrag:function(e){
               $(this).css('cursor','default');
               App.emit('APP-SET-DASHBOARD-REPORT-WIDTH',_this.props.row,_this.props.col,_endX,'',_this.props.colLen,_this.props.clen);
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',0,'none',null,_this.props.row,'',_this.props.col);
            },
            onDrag:function(e){
               $(this).css('cursor','default');
                _endX = _startX - e.clientX;
                _endX = 16*parseInt(_endX / 16);
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',_endX,'block',null,_this.props.row,'',_this.props.col);
            }
        });
    },
    componentDidUpdate: function() {
        if(!this.props.sdk)
        $(ReactDOM.findDOMNode(this)).removeAttr('style');
        var _this = this;
        var _startX = 0;
        var _endX = 0;
        $(ReactDOM.findDOMNode(this)).draggable({
            revert: false ,
            onStartDrag:function(e){
               $(this).css('cursor','default');
               _startX = e.clientX;
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',-1,'block',e.clientX,_this.props.row,'',_this.props.col);
            },
            onStopDrag:function(e){
               $(this).css('cursor','default');
               App.emit('APP-SET-DASHBOARD-REPORT-WIDTH',_this.props.row,_this.props.col,_endX,'',_this.props.colLen,_this.props.clen);
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',0,'none',null,_this.props.row,'',_this.props.col);
            },
            onDrag:function(e){
               $(this).css('cursor','default');
                _endX = _startX - e.clientX;
                _endX = 16*parseInt(_endX / 16);
               App.emit('APP-DASHBOARD-SET-LINE-LEFT',_endX,'block',null,_this.props.row,'',_this.props.col);
            }
        });
    },
    render:function(){
        if(this.props.operation=='edit'){
             return (
                <div className="col-drag" style={{left:this.props.left}}></div>
            );
        }else{
            return (
                <div></div>
            );
        }
    }
});
