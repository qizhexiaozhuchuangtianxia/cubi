/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var DashboardStore = require('../../stores/DashboardStore'); 
var App = require('app');

module.exports = React.createClass({
    getInitialState: function() {
        this.app = {};
        this.start = 0;
        return {
            left:0,
            display:'none'
        }
    },
    displayName:'LineCol',
    componentDidMount: function() {
        this.app['APP-DASHBOARD-SET-LINE-LEFT'] = App.on('APP-DASHBOARD-SET-LINE-LEFT', this._setLeft);
    },
    componentWillUnmount: function() {
        for (var i in this.app) {
            this.app[i].remove();
        }
    },
    render:function(){
        return (
            <div className="col-line" style={{left:this.state.left,display:this.state.display}}></div>
        );
    },
    _x:0,
    _w:0,
    _setLeft:function(width,display,start,row,cell,col){
        var rows = this.props.rows;
        rows = JSON.stringify(rows);
        rows = JSON.parse(rows);
        var left = 0;
        if(display=='none'){
            this.setState({
                display:display
            })
            this.start = false;
            this._x = 0;
            this._w = 0;
            return;
        }
        if(start){
            this.start = start;
            left = this.start;
        }else{
            left = this.start-width;
        }
       var aa = DashboardStore.setCellWidth(rows,width,row,cell,col,true);
        if(aa===true){
            if(this._x===0){
                this._x = width;
                this._x++;
            }else{
                left = this.start - this._x;
            }
        }else{
            left = this.start-width;
            this._x = 0;
        }
        this.setState({
            left:left,
            display:display
        })
    }
});
