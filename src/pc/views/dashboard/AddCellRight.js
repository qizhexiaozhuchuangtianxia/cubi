/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');

module.exports = React.createClass({
    displayName:'AddCellRight',
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        
    },
    render:function(){
        if(this.props.operation=='edit'&&this.props.colLength!=4){
             return (
                <div className="add-cell-right-btn" onClick={this._addCell}></div>
            );
        }else{
            return null;
        }
    },
    _addCell:function(){
        App.emit('APP-DASHBOARD-ADD-REPORT',{
            row:this.props.row,
            col:'right',
            cell:this.props.col
        });
    }
});