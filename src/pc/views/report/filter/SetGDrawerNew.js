/**
 * 点击我的分析编辑页面的中间按钮执行的模块
 */
import {
	Component
} from 'react';
import App from 'app';
import SliderComponent from './SliderComponent';
class SetGDrawer extends Component {
	constructor(props) {
		super(props);
		this.app = {};
		this.state = {
			metadataId: this.props.metadataId,
			seletedFilterData: this.props.filterFields || [],
			filterWeiDuData: [{
				"cells": [{
					"rows": {
						"fieldName": "brand",
						"nameInfoOpen": false,
						"nameInfoType": "品牌",
						"dataType": "STRING",
						"nameInfoDesc": [],
						"popData": {
							"popDataInfo": [{
								"checboxBool": true,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}, {
					"rows": {
						"fieldName": "brand",
						"nameInfoOpen": false,
						"nameInfoType": "品牌",
						"dataType": "STRING",
						"nameInfoDesc": ["巴士小熊系列", "巴士小熊系列", "巴士小熊系列"],
						"popData": {
							"popDataInfo": [{
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}]
			}, {
				"cells": [{
					"rows": {
						"fieldName": "日期",
						"nameInfoOpen": false,
						"nameInfoType": "销售日期",
						"dataType": "DATE",
						"nameInfoDesc": [],
						"popData": {
							"popDataInfo": [{
								"checboxBool": true,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}, {
					"rows": {
						"fieldName": "brand",
						"nameInfoOpen": false,
						"nameInfoType": "品牌",
						"dataType": "STRING",
						"nameInfoDesc": ["巴士小熊系列", "巴士小熊系列", "巴士小熊系列"],
						"popData": {
							"popDataInfo": [{
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}]
			}, {
				"cells": [{
					"rows": {
						"fieldName": "日期",
						"nameInfoOpen": false,
						"nameInfoType": "销售日期",
						"dataType": "DATE",
						"nameInfoDesc": [],
						"popData": {
							"popDataInfo": [{
								"checboxBool": true,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}, {
					"rows": {
						"fieldName": "brand",
						"nameInfoOpen": false,
						"nameInfoType": "品牌",
						"dataType": "STRING",
						"nameInfoDesc": ["巴士小熊系列", "巴士小熊系列", "巴士小熊系列"],
						"popData": {
							"popDataInfo": [{
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}, {
								"checboxBool": false,
								"id": "B001",
								"name": "巴士小熊系列"
							}]
						}
					}
				}]
			}]
		};
	}
	componentDidMount() {
		//点击右下角的开启图标是否开启的方法
		this.app['APP-REPORT-OPEN-FILTER-WEI-DU-HANDLE'] = App.on('APP-REPORT-OPEN-FILTER-WEI-DU-HANDLE', this._openFilterWeiDuHandle.bind(this));
		//点击筛选值修改筛选值是否选中的效果方法
		this.app['APP-REPORT-CLICK-FILTER-VALUE-HANDLE'] = App.on('APP-REPORT-CLICK-FILTER-VALUE-HANDLE', this._clickFilterValueHandle.bind(this));
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
	 					seletedFilterData={this.state.seletedFilterData} 
	 					listData={this.state.filterWeiDuData}/>	 				
	 			</div>
			)
		} else {
			return (
				<div className="noDataMessageText">当前分析没有筛选维度的值</div>
			)
		}
	}
	_openFilterWeiDuHandle(obj) { //点击右下角的开启图标是否开启的方法
		let _this = this;
		this.setState(function(state) {
			state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = obj.nameInfoOpen;
			return {
				state
			}
		})
	}
	_clickFilterValueHandle(obj) { //点击筛选值 修改筛选值是否选中的效果
		let _this = this;
		console.log('obj',obj);
		this.setState(function(state) {
			/*if (state.filterWeiDuData[obj.col].cells[obj.row].rows.dataType == 'DATE') {
				state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoDesc = obj.dateFilterValueArr;
				state.filterWeiDuData[obj.col].cells[obj.row].rows.valueType = obj.valueType;
				state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = true;
			} else {
				state.filterWeiDuData[obj.col].cells[obj.row].rows.popData.popDataInfo[obj.index].checboxBool = obj.checboxBool;
				for (var i = 0; i < state.filterWeiDuData[obj.col].cells[obj.row].rows.popData.popDataInfo.length; i++) {
					if (state.filterWeiDuData[obj.col].cells[obj.row].rows.popData.popDataInfo[i].checboxBool) {
						state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoDesc.push(state.filterWeiDuData[obj.col].cells[obj.row].rows.popData.popDataInfo[i].name);
					}
				}
				state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoOpen = state.filterWeiDuData[obj.col].cells[obj.row].rows.nameInfoDesc.length > 0 ? true : false;
			}*/
			return {
				state
			}
		})
	}
}
export default SetGDrawer;