/**
 * 点击我的分析编辑页面的中间按钮执行的模块
 */
import {
	Component
} from 'react';
import App from 'app';
import SliderComponent from './SliderComponent';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class SetGDrawer extends Component {
	constructor(props) {
		super(props);
		this.app = {};
		let filterWeiDuData=[];
		FilterFieldsStore.updateFilterRow(this.props.filterFields,this.props.filterData);
		//如果是钻取后进入筛选器，钻取的filter添加到筛选的filter
		if(this.props.drilDownFilter.length>0){
			filterWeiDuData=FilterFieldsStore.drillDownFilterInFilter(this.props.drilDownFilter,this.props.filterData);
		}

		filterWeiDuData=FilterFieldsStore.setFilterFieldsState(this.props.filterData,this.props.filterFields);
		this.state = {
			metadataId: this.props.metadataId,
			filterWeiDuData:filterWeiDuData
		};
	}
	componentDidMount() {
		//点击右下角的开启图标是否开启的方法
		this.app['APP-REPORT-OPEN-FILTER-WEI-DU-HANDLE'] = App.on('APP-REPORT-OPEN-FILTER-WEI-DU-HANDLE', this._openFilterWeiDuHandle.bind(this));
		//点击筛选值修改筛选值是否选中的效果方法
		this.app['APP-REPORT-CLICK-FILTER-VALUE-HANDLE'] = App.on('APP-REPORT-CLICK-FILTER-VALUE-HANDLE', this._clickFilterValueHandle.bind(this));
	}
	componentWillReceiveProps(nextProps) {

 		// this.setState({
 		// 	metadataId: nextProps.metadataId,
 		// 	listData: nextProps.listData
 		// })
 	}
	componentWillUnmount() {
		for (let i in this.app) {
			this.app[i].remove();
		}
	}
	render() {

		if (this.state.filterWeiDuData.length > 0) {
			return (
				<div className="selectBox">
	 				<SliderComponent
	 					metadataId={this.state.metadataId}
	 					listData={this.state.filterWeiDuData}
	 					drilDownFilter={this.props.drilDownFilter}
	 					weiduList={this.props.weiduList}
	 					reportCategory={this.props.reportCategory}
	 					rowTitleFields={this.props.rowTitleFields}
	 					compareData={this.props.compareData}
	 					filterData={this.props.filterData}/>
	 			</div>
			)
		} else {
			return (
				<div>
					<div  className="iconfont icon-ictanhaotishi24px filter-empty-bg"></div>
					<div className="noDataMessageText">当前分析没有筛选维度的值</div>
				</div>
			)
		}
	}
	_openFilterWeiDuHandle(obj) { //点击右下角的开启图标是否开启的方法
		let _this = this;
		this.setState(function(prevState) {
			prevState.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = obj.nameInfoOpen;
			prevState.filterWeiDuData[obj.col].cells[obj.row].rows.infoOpen = obj.nameInfoOpen;
			return prevState;
		},function(){
			_this._setReportFilterFields(obj);
		})
	}
	_clickFilterValueHandle(obj) { //点击筛选值 修改筛选值是否选中的效果
		let _this = this;
		this.setState(function(prevState) {
			if(obj.selectedData.length==0){
				prevState.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = false;
			}else{
				prevState.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = true;
			}
			if (prevState.filterWeiDuData[obj.col].cells[obj.row].rows.dataType == 'DATE') {
				prevState.filterWeiDuData[obj.col].cells[obj.row].rows.popData = obj.selectedData;
				prevState.filterWeiDuData[obj.col].cells[obj.row].rows.valueType = obj.valueType;
			} else {
				prevState.filterWeiDuData[obj.col].cells[obj.row].rows.popData = obj.selectedData;
				return prevState;
			}
			return prevState;
		},function(){
			_this._setReportFilterFields(obj);
		})
	}
	_setReportFilterFields(obj){
		var drilDownFilter=this.props.drilDownFilter;
		if(obj && obj.drilDownFilter){
			drilDownFilter=obj.drilDownFilter;
		}

		App.emit('APP-REPORT-FILTERDATA-CHANGED',{
			filterWeiDuData:FilterFieldsStore.setFilterDataState(this.state.filterWeiDuData),
			drilDownFilter:drilDownFilter
		});
	}
}
export default SetGDrawer;
