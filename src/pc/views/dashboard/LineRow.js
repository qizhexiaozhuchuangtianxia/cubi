/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');

module.exports = React.createClass({
    getInitialState: function() {
        this.app = {};
        this.start = 112;
        return {
            top:0,
            display:'none'
        }
    },
    displayName:'LineRow',
    componentDidMount: function() {
        this.app['APP-DASHBOARD-SET-LINE-TOP'] = App.on('APP-DASHBOARD-SET-LINE-TOP', this._setTop);
    },
    componentWillUnmount: function() {
        for (var i in this.app) {
            this.app[i].remove();
        }
    },
    render:function(){
        return (
            <div className="row-line" style={{top:this.state.top,display:this.state.display}}></div>
        );
    },
    _setTop:function(top,disyplay,start){
        if(start){
            this.start = start;
            top = top;
        }else{
            top = this.start-top;
        }
        this.setState({
            top:top,
            display:disyplay
        })
    }
});
