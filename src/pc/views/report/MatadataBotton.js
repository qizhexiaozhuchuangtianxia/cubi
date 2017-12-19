/**
 * 立方按钮
 * 
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var MetaDataSelectorView = require('./metadata/MetaDataSelectorView');
var {
    FloatingActionButton,
} = require('material-ui');

module.exports = React.createClass({

	displayName: 'SaveButton',

	getInitialState: function() {
		return {
		
		}
	},
	componentWillMount:function(){
		
	},
	componentDidMount: function() {
		
	},
	componentWillUnmount: function() {
		
	},
	render: function() {
		return (
				<div className="matadata-panel">
                    <div className="bi-btn">
                        <FloatingActionButton  className="btn" ref="drawer-switch" iconClassName="iconfont icon-icshujulifang24px matadata-btn" onTouchTap={this._handleToggle} />
                    </div>
                </div>
		)
	},
	/*选择立方按钮事件*/
    _handleToggle: function() {
        /*if(this.props.currentCanEdited=='false'){
            var message='您暂时没有权限编辑当前的分析';
            App.emit('APP-MESSAGE-OPEN',{
                content:message
            });
            return;
        }*/
        App.emit('APP-DRAWER-RIGHT', <MetaDataSelectorView />, 285);
    },

});