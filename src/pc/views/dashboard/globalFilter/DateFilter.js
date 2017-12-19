var React = require('react');
var App = require('app');
var FilterHeader =  require('./FilterHeader');
var SliderDate = require('../../common/SliderDate');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');
var {
	List,
	ListItem,
	FontIcon
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选日历筛选',
	getInitialState:function(){
        var day=GlobalFilterStore._filetrMoment();
		return {
			data:this.props.data,
			minValue:this.props.data.report.minValue||false,
    		maxValue:this.props.data.report.maxValue||false,
    		startValue:this.props.data.report.startValue||false,
    		endValue:this.props.data.report.endValue||false,
            change:true
		}
	},
	componentWillMount:function(){
	},
	componentWillReceiveProps:function(nextProps){
        //var today=GlobalFilterStore._filetrMoment();
        var change=false;
        if(this.props.data.startValue!=nextProps.data.report.startValue || this.props.data.endValue!=nextProps.data.report.endValue){
            change=true;
        }
		this.setState({
            minValue:nextProps.data.report.minValue,
            maxValue:nextProps.data.report.maxValue,
            startValue:nextProps.data.report.startValue,
            endValue:nextProps.data.report.endValue,
            change:change,
        });
	},
	componentDidMount: function() {

	},

	render:function(){
        
        var sliderDate;
        if(!this.state.minValue || !this.state.startValue){
            sliderDate=null;
        }else{
            
            sliderDate=<SliderDate
                minValue={this.state.minValue}
                maxValue={this.state.maxValue}
                startValue={this.state.startValue}
                endValue={this.state.endValue}
                onChange={this._getValue}
                onMouseUp={this._onMouseUp}
                onSureUp={this._onSureUp}
                width={this.props.data.width-16}
                change={this.state.change}/>
        }
        var style={
            paddingTop:this.props.padding+'px'
        }
        return (
            <div className="date_filter">
            	<FilterHeader
            	tit={this.props.item.name}
            	item={this.props.item}
                operation={this.props.operation}
            	data={this.props.data}
            	filterType={this.props.filterType}
            	row={this.props.row}
            	col={this.props.col}
				reportTitle={this.props.reportTitle}
                minValue={this.state.minValue}
                maxValue={this.state.maxValue}
            	startValue={this.state.startValue}
        		endValue={this.state.endValue}/>
                <div style={style} className="filterCount">
                    <div className="silderCount">
                        {sliderDate}
                    </div>
                    
                </div>
        		
            </div>
        );

	},
	_getValue:function(value){
	},
	_onMouseUp:function(value){
		GlobalFilterStore.setGlobalSign(true);
        var startTime=GlobalFilterStore._formatTime(value.start);
        var endTime=GlobalFilterStore._formatTime(value.end);
        var obj=Object.assign(this.props.item,{
            startValue:value.start,
            endValue:value.end,
            minValue:this.state.minValue,
            maxValue:this.state.maxValue,
            globalFilterSign:true,
            seletedArr:[startTime,endTime],
            row:this.props.row,
            col:this.props.col,
            sign:this.props.data.report.sign,
            filterType:'DATE_FILTER',
        });
        App.emit('APP-DRIL-SET-DRILDOWN');
        setTimeout(function(){
            App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER',obj);
        },20)
	},

})
