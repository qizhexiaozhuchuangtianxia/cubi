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
    componentDidMount: function() {
        var _this = this;
        var _startY = 0;
        var _endY = 0;
        if(!this.props.sdk)
        $(ReactDOM.findDOMNode(this)).draggable({
            revert: false ,
            onStartDrag:function(e){
               $(this).css('cursor','default');
               _startY = e.clientY;
               App.emit('APP-DASHBOARD-SET-LINE-TOP',e.clientY,'block',e.clientY);
            },
            onStopDrag:function(e){
               $(this).css('cursor','default');
               App.emit('APP-SET-DASHBOARD-REPORT-HEIGHT',_this.props.row,_endY);
               App.emit('APP-DASHBOARD-SET-LINE-TOP',0,'none');
            },
            onDrag:function(e){
               $(this).css('cursor','default');
                _endY = _startY - e.clientY;
                if(_endY > 0){
                    _endY = 48*Math.floor(_endY / 48);
                }else{
                    _endY = 48*parseInt(_endY / 48);
                }
               App.emit('APP-DASHBOARD-SET-LINE-TOP',e.clientY,'block');
            }
        });
    },
    componentDidUpdate: function() {
        $(ReactDOM.findDOMNode(this)).removeAttr('style');
        var _this = this;
        var _startY = 0;
        var _endY = 0;
        if(!this.props.sdk)
        $(ReactDOM.findDOMNode(this)).draggable({
            revert: false ,
            onStartDrag:function(e){
               $(this).css('cursor','default');
               _startY = e.clientY;
               App.emit('APP-DASHBOARD-SET-LINE-TOP',e.clientY,'block',e.clientY);
            },
            onStopDrag:function(e){
               $(this).css('cursor','default');
               App.emit('APP-SET-DASHBOARD-REPORT-HEIGHT',_this.props.row,_endY);
               App.emit('APP-DASHBOARD-SET-LINE-TOP',0,'none');
            },
            onDrag:function(e){
               $(this).css('cursor','default');
                _endY = _startY - e.clientY;
                if(_endY > 0){
                    _endY = 48*Math.floor(_endY / 48);
                }else{
                    _endY = 48*parseInt(_endY / 48);
                }
               App.emit('APP-DASHBOARD-SET-LINE-TOP',_endY,'block');
            }
        });
    },
    render:function(){
        if(this.props.operation=='edit'){
             return (
                <div className="row-drag"></div>
            );
        }else{
            return (
                <div></div>
            )
        }
    }
});
