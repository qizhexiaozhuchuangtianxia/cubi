/**
 **驾驶舱的右侧编辑-默认筛选器 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import ReportDefaultFilterValueComponent from './ReportDefaultFilterValueComponent';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class ReportDefaultFilterComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reportId:this.props.reportId,
			reportInfo: this.props.reportInfo,
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			reportId:nextProps.reportId,
			reportInfo: this.props.reportInfo,
		})
	}
	render() {
		var defaultFilterFiledsList = this.props.defaultFilterFiledsList;
		if(this.props.reportInfo.compare){
            defaultFilterFiledsList = FilterFieldsStore.getCompareFilterFields(defaultFilterFiledsList,this.props.reportInfo);
        }
		return (
			<ul className="defaultFilterList">
				{defaultFilterFiledsList.map((item,key)=>this._renderDefaultListHandle(item,key))}
			</ul>
		)
	}
	_renderDefaultListHandle(item,key){
		return <ReportDefaultFilterValueComponent 
				key={key} 
				item={item} 
				buttonIndex={key} 
				row={this.props.row} 
				col={this.props.col}
				reportInfo={this.props.reportInfo}
				reportId={this.state.reportId}/>
	}
}
export default ReportDefaultFilterComponent;