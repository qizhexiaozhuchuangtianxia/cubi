var $ = require('jquery');
import {
	Component
} from 'react';
import App from 'app';
import FilterDateDescComponent from './FilterDateDescComponent';
import FilterDescComponent from './FilterDescComponent';
import FilterDateValueComponent from './FilterDateValueComponent';
import FilterValueComponent from './FilterValueComponent';
import TreeFilterValueComponent from './TreeFilterValueComponent';
var ReportDateRange = require('../../common/ReportDateRange');
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
class FilterRowsComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		var _this = this;
		let selectedData=FilterFiledsStore.getSelectedData(this.props.rowItem);
		let newDrillFilter=FilterFiledsStore.drillReplaceFilter(true,selectedData,this.props.drilDownFilter,this.props.rowItem);
		let compareCheck = false;
		let compareData = this.props.compareData;
		compareData.map(function(item,index){
			if(item.selected&&(_this.props.rowItem.fieldName==(item.weiItem?item.weiItem.fieldName:''))){
				compareCheck = true;
			}
		})
		this.state = {
			metadataId: this.props.metadataId,
			rowItem: this.props.rowItem,
			col: this.props.col,
			row: this.props.row,
			openTck: false,
			goBackShow:newDrillFilter.goBackShow,
			selectedData:newDrillFilter.selectedData,
			levelId:newDrillFilter.levelId,
			pid:newDrillFilter.pid,
			goBackData:newDrillFilter.goBackData,
			compareData:this.props.compareData,
			compareCheck:compareCheck
		};
	}
	componentWillReceiveProps(nextProps) {
		let selectedData=FilterFiledsStore.getSelectedData(nextProps.rowItem);
		let newDrillFilter=FilterFiledsStore.drillReplaceFilter(false,selectedData,nextProps.drilDownFilter,nextProps.rowItem);
		let compareCheck = false;
		let compareData = nextProps.compareData;
		compareData.map(function(item,index){
			if(item.selected&&(nextProps.rowItem.fieldName==(item.weiItem?item.weiItem.fieldName:''))){
				compareCheck = true;
			}
		})
		this.setState({
			metadataId: nextProps.metadataId,
			rowItem: nextProps.rowItem,
			col: nextProps.col,
			row: nextProps.row,
			selectedData:newDrillFilter.selectedData,
			levelId:newDrillFilter.levelId,
			pid:newDrillFilter.pid,
			goBackShow:newDrillFilter.goBackShow,
			goBackData:newDrillFilter.goBackData,
			compareData:nextProps.compareData,
			compareCheck:compareCheck
		})
	}
	componentDidMount() {
		//关闭所有弹出层的方法方法
		this.app['APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE'] = App.on('APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE',this._closeTckHandle.bind(this));
		this._refreshSliderHnadle();
	}
	componentWillUnmount() {
 		for (let i in this.app) {
 			this.app[i].remove();
 		}
 	}
	render() {
		let stopClickBox,openClassName,domTck,decTck;
		stopClickBox = classnames('stopClickBox', {
			'stopClickBoxShow': this.state.openTck
		});
		openClassName = classnames('floatDivBox', {
			'floatDivBoxOpen': this.state.rowItem.nameInfoOpen
		});
		if (this.state.rowItem.dataType == 'DATE') { //日期的筛选维度
			decTck = <FilterDateDescComponent dateDesc={this.state.rowItem} />;
			domTck = <FilterDateValueComponent 
							col={this.state.col}
							row={this.state.row}
							openTckBox={this.state.openTck}
							itemObj={this.state.rowItem}/>
		}else{
			decTck = <FilterDescComponent filterField={this.state.rowItem}/>;
			if(this.state.rowItem.groupType && this.state.rowItem.groupType == "GROUP_TITLE_FIELD"){
				domTck = <TreeFilterValueComponent 
								col={this.state.col}
								row={this.state.row}
								nameInfoType={this.state.rowItem.nameInfoType}
								selectedData={this.state.selectedData}
								dimensionId={this.state.rowItem.dimensionId}
								groupLevels={this.state.rowItem.groupLevels}
								openTckBox={this.state.openTck}
								drilDownFilter={this.props.drilDownFilter}
								levelId={this.state.levelId}
								pid={this.state.pid}
								goBackShow={this.state.goBackShow}
								goBackData={this.state.goBackData}
								weiduList={this.props.weiduList}
								reportCategory={this.props.reportCategory}
								rowTitleFields={this.props.rowTitleFields}
								filterData={this.props.filterData}/>
			}else{
				domTck = <FilterValueComponent 
								col={this.state.col}
								row={this.state.row}
								fieldName={this.state.rowItem.fieldName}
								selectedData={this.state.selectedData}
								metadataId={this.state.metadataId}
								openTckBox={this.state.openTck}/>
			}
		}
		return (<div className={openClassName} onClick={(e)=>this._openFilterValueListHandle(e)}>
					<div className="listBox-top">
						<h3>{this.state.rowItem.nameInfoName}</h3>
						{decTck}
					</div>
					<div className="listBox-down">
						<span>{this.state.rowItem.nameInfoType}</span><a href="javascript:;" onClick={(e)=>this._openFilterWeiDuHandle(e)} className="shaixuan iconfont icon-icshaixuan24px"></a>
					</div>
					{domTck}
					<div className={stopClickBox}></div>
				</div>)
	}
	_openFilterValueListHandle(evt) {//打开筛选值的方法
		evt.stopPropagation();
		if(!this.state.compareCheck){
			if($(evt.target).hasClass('listBox-top')||$(evt.target).hasClass('listBox-down')||$(evt.target).parents('.listBox-top').length==1||$(evt.target).parents('.listBox-down').length==1){
				this.setState({
					openTck: true
				})
			}
		}
	}
	_refreshSliderHnadle(){//组件加载完成之后或者更新之后刷新父组件左右滚动效果方法
		App.emit('APP-REPORT-SLIDER-LIST-HANDLE');
	}
	_closeTckHandle(){//关闭弹出层的方法
		this.setState({
			openTck: false
		})
	}
	_openFilterWeiDuHandle(evt){//点击右下角的开启图标执行的方法
		evt.stopPropagation();
		var _this = this;
		if(this.state.selectedData.length>0&&!this.state.compareCheck){
			var dimensionId=this.state.rowItem.dimensionId;
			if(this.state.rowItem.groupType=="GROUP_DATE_TITLE_FIELD"){
				dimensionId=this.state.rowItem.fieldName;
			}
			var drilDownFilter=FilterFiledsStore.closeBeadData(this.props.drilDownFilter,dimensionId,!this.state.rowItem.nameInfoOpen)
			App.emit('APP-REPORT-OPEN-FILTER-WEI-DU-HANDLE',{col:this.state.col,row:this.state.row,nameInfoOpen:!this.state.rowItem.nameInfoOpen,drilDownFilter:drilDownFilter})
		}
	}

}
export default FilterRowsComponent;