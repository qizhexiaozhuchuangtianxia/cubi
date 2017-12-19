/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var AddWeb =  require('./AddWeb');
var PublicButton = require('../common/PublicButton');

var {
    FlatButton,
    Dialog
} = require('material-ui');

module.exports = React.createClass({
    app:{},
    displayName:'WebComponent',
    getInitialState: function() {
        return {
            open:false,
            row:0,
            col:0,
            cell:0,
            name:'',
            url:''
        }
    },
    componentWillUnmount:function(){
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentDidMount: function() {
        this.app['APP-DASHBOARD-WEB-OPEN'] = App.on('APP-DASHBOARD-WEB-OPEN',this._openWeb);
        this.app['APP-DASHBOARD-WEB-CLOSE'] = App.on('APP-DASHBOARD-WEB-CLOSE',this._closeDialog);
    },
    render:function(){
        var actions = [
            <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                secondary={true}
                onClick={this._closeDialog}/>,

            <PublicButton
                style={{color:"rgba(0,229,255,255)"}}
                labelText="确定"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                primary={true}
                keyboardFocused={false}
                onClick={this._submitData}/>
        ];
         return (
            <Dialog
                contentClassName="defaultDialogPanel"
                titleClassName="defaultDialogTitle"
                actionsContainerClassName="defaultDialogactions"
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                open={this.state.open}
                onRequestClose={this._closeDialog}
            >
                <AddWeb row={this.state.row} col={this.state.col} cell={this.state.cell} name={this.state.name} url={this.state.url}/>
            </Dialog>
        );
    },
    _openWeb:function(arg){
        this.setState(function(previousState,currentProps){
            previousState.open = true;
            previousState.row = arg.row;
            previousState.cell = arg.cell;
            previousState.col = arg.col;
            previousState.name = arg.name;
            previousState.url = arg.url;
            return {previousState};
        });
    },
    _closeDialog:function(){
        this.setState({open: false});
    },
    _submitData:function(){
        App.emit('APP-DASHBOARD-SET-WEB-URL');
    }
});
