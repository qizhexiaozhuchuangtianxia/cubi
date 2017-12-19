var React = require('react');
var ReactDOM = require('react-dom');
module.exports = React.createClass({
	app: {},
	displayName: 'REPORT-KPI-view',
	getInitialState: function() {
		return {
			mainQuota:this.props.mainQuota,//主指标
			mainColor:this.props.mainColor,//主指标颜色
			mainUtil:this.props.mainUtil,//主指标单位
			mainCondition:this.props.mainCondition,//主指标条件
			mainConditionValue:this.props.mainConditionValue,//主指标阀值
			mainConditionColor:this.props.mainConditionColor,//主指标阀值颜色
			viceQuota:this.props.viceQuota,//副指标
			viceColor:this.props.viceColor,//副指标颜色
			viceUtil:this.props.viceUtil,//副指标单位
			viceCondition:this.props.viceCondition,//副指标条件
			viceConditionValue:this.props.viceConditionValue,//副指标阀值
			viceConditionColor:this.props.viceConditionColor//副指标阀值颜色			
		}

	},
	render: function() { 
		return (
			<div>				
				
			</div>
		)
	}
});
