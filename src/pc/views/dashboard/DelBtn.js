/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');

module.exports = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        
    },
    render:function(){
        if(this.props.operation=='edit'){
             return (
                <div className="delReportBtn" onClick={(evt)=>this._removeCell(evt)}></div>
            );
        }else{
            return null;
        }
    },
    _removeCell:function(evt){
        evt.stopPropagation();
        App.emit('APP-DASHBOARD-ADD-REPORT',{row:this.props.row,col:this.props.col,useType:'del'});
    }
});
