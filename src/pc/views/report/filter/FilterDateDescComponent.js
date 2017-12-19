import {Component} from 'react';
var ReportDateRange = require('../../common/ReportDateRange');
class FilterDateDescComponent extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dateDesc:this.props.dateDesc
	  };
	}
	componentWillReceiveProps(nextProps){
 		this.setState({
 			dateDesc:nextProps.dateDesc,
 		})
 	}
	render(){
		let range,startTime,endTime;
		if ((this.state.dateDesc.valueType) && (this.state.dateDesc.infoOpen)) {
			if(this.state.dateDesc.valueType == 'CUSTOM'){
				if(this.state.dateDesc.popData[0] == null && this.state.dateDesc.popData[1] == null){
					startTime = '';
					endTime = '';
				}
				if(this.state.dateDesc.popData[0] != null && this.state.dateDesc.popData[1] == null){
					startTime = '从'+ moment(this.state.dateDesc.popData[0]).format('YYYY年MM月DD日');
					endTime = '开始';
				}
				if(this.state.dateDesc.popData[0] == null && this.state.dateDesc.popData[1] != null){
					startTime = '到' + moment(this.state.dateDesc.popData[1]).format('YYYY年MM月DD日');
					endTime = '结束';
				}
				if(this.state.dateDesc.popData[0] != null && this.state.dateDesc.popData[1] != null){
					startTime = '从'+ moment(this.state.dateDesc.popData[0]).format('YYYY年MM月DD日');
					endTime = '到' + moment(this.state.dateDesc.popData[1]).format('YYYY年MM月DD日');
				}
			}else{
				range = ReportDateRange.getDateRangeByType(this.state.dateDesc.popData[0]);
				startTime = '从'+ moment(range.start).format('YYYY年MM月DD日');
				endTime = '到' + moment(range.end).format('YYYY年MM月DD日');
			}
			return 	<div>
						<p><span>包含</span></p>
						<p><span>{startTime}</span></p>
						<p><span>{endTime}</span></p>
					</div>
		}else{
			return 	<div>
						<p>未筛选</p>
					</div>;
		}
	}
}
export default FilterDateDescComponent;