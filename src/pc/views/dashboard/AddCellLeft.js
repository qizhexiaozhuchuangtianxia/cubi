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
        if(this.props.operation=='edit'&&this.props.colLength!=4){
             return (
                <div onClick={this._addCell} className="add-cell-left-btn"></div>
            );
        }else{
            return null;
        }
    },
    _addCell:function(){
        App.emit('APP-DASHBOARD-ADD-REPORT',{
            row:this.props.row,
            col:'left',
            cell:this.props.col
        });
    }
});
