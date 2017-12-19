/**
 * 保存-查看驾驶舱按钮
 * 
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
	FloatingActionButton
} = require('material-ui');

module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentDidMount:function(){
		
	},
	render: function() {
		if(this.props.operation=='edit'){
			return (
				<div className="save-btn">
					<FloatingActionButton  
						className="btn" 
						ref="drawer-switch" 
						iconClassName="iconfont icon-baocun matadata-btn" 
						onTouchTap={this._save} />
				</div>
			)
		}else{
			return (
				<div className="save-btn">
					<FloatingActionButton  
						className="btn" 
						ref="drawer-switch" 
						iconClassName="iconfont icon-icbianji24px matadata-btn" 
						onTouchTap={this._goSave} />
				</div>
			)
		}
	},
    _save:function(){
        App.emit('APP-DASHBOARD-SAVE');
    },
    _goSave:function(){
        App.emit('APP-DASHBOARD-GO-SAVE');
    }
});