/**
 * Created by Administrator on 2016-2-26.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var AddReportText =  require('./AddReportText');
var PublicButton = require('../common/PublicButton');

var {
    Dialog
} = require('material-ui');

module.exports = React.createClass({
    app:{},
    getInitialState: function() {
        return {
            open:false,
            row:0,
            col:0,
            cell:0,
            name:'',
            content:''
        }
    },
    componentWillUnmount:function(){
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentDidMount: function() {
        this.app['APP-DASHBOARD-REPORT-TEXT-OPEN'] = App.on('APP-DASHBOARD-REPORT-TEXT-OPEN',this._openRepotText);
        this.app['APP-DASHBOARD-REPORT-EDITOR-CLOSE'] = App.on('APP-DASHBOARD-REPORT-EDITOR-CLOSE',this._closeDialog);
    },
    render:function(){
        var actions = [
             <PublicButton
                style={{ color:"rgba(254,255,255,0.87)"}}
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
                <AddReportText row={this.state.row} col={this.state.col} cell={this.state.cell} name={this.state.name} content={this.state.content}/>
            </Dialog>
        );
    },
    _openRepotText:function(arg){
        this.setState(function(previousState,currentProps){
            previousState.open = true;
            previousState.row = arg.row;
            previousState.cell = arg.cell;
            previousState.col = arg.col;
            previousState.name = arg.name;
            previousState.content = arg.content;
            return {previousState};
        });
    },
    _closeDialog:function(){
        this.setState({open: false});
    },
    _submitData:function(){
        App.emit('APP-DASHBOARD-SET-TEXT-REPORT');
    }
});
