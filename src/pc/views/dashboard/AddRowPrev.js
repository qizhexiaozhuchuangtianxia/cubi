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
                <div className="add-row-prev-btn" onClick={this._addRow}></div>
            );
        }else{
            return null;
        }
    },
    _addRow:function(){
        App.emit('APP-DASHBOARD-ADD-REPORT',{row:(this.props.row),cell:this.props.cell});    
    }
});
