var React = require('react');
var App = require('app');
var EditConditionComponent = require('./EditConditionComponent');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');

var {
	FontIcon,
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选头部组件',
	getInitialState:function(){
		return {


		}
	},
	componentWillMount:function(){
		//this._getFieldMaxMinData();

	},
	componentWillReceiveProps:function(nextProps){

	},
	componentDidMount: function() {

	},

	render:function(){
		//operation={}
		var filterName=this.props.data.report.filterAliasName;//this.props.data.report.filterName;
		var edit=<div className="tit_icon">
        			<FontIcon className="iconfont icon-icbianji24px filter_edit_btn" onTouchTap={(evt)=>this._setFilter(evt)}/>
				</div>
		if(this.props.operation=='view'){
			edit=null;
		}
        return (

            	<div className="filter_tit">
            		<div className="tit_name">{filterName}</div>
            		{edit}
            	</div>

        );

	},
	_setFilter:function(evt,dimensionId){
			evt.stopPropagation();
	   	App.emit('APP-DRAWER-RIGHT', <EditConditionComponent 	startValue={this.props.startValue}
			endValue={this.props.endValue}
			minValue={this.props.minValue}
            maxValue={this.props.maxValue}
			reportTitle={this.props.reportTitle}
			row={this.props.row}
			col={this.props.col} 
			item={this.props.item}
			data={this.props.data}
			filterType={this.props.filterType} />,285, 80 );
	}
})
