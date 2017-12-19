/**
 **驾驶舱的默认筛选器-模块
 **
 */
var $ = require('jquery');

import React                       from 'react';
import App                         from 'app';
import ReportStore                 from '../../../stores/ReportStore';
import MetaDataStore               from '../../../stores/MetaDataStore';
import FilterFieldsStore           from '../../../stores/FilterFieldsStore';
import AutoSetCellWidthComponet    from './AutoSetCellWidthComponet';
import DefaultFilterReportComponet from './DefaultFilterReportComponet';
import RightFilterListComponet     from './RightFilterListComponet';
import RightGlobalFilterCompoent   from './RightGlobalFilterCompoent';
import GlobalFilterStore           from '../../../stores/GlobalFilterStore';
import CheckEntryTextComponent     from '../../common/CheckEntryTextComponent';
import PublicTextField             from '../../common/PublicTextField';

var {
	Toggle,
} = require('material-ui');
class RightEditComponent extends React.Component {

	constructor(props) {
		super(props);

		this.app = {};
		this.mounted = false;
		var globalFilterFields = this.props.reprotData.globalFilterFields;// GlobalFilterStore.setDimensionDisabled(this.props.reprotData.globalFilterFields,list,this.props.row,this.props.col,this.props.reportInfo.metadataId);
		// var globalFilterFields = GlobalFilterStore.setFilterDisabled(this.props.reprotData.globalFilterFields, this.props.areaInfo.metadataId);
		var toggleShow = this._toggleShow(globalFilterFields);

		this.state = {
			reprotId : this.props.reprotData.id, //当前报表的id
			filterListData : [],	//右侧弹出之后 筛选器列表的数组
			defaultFilterFileds : [],	//驾驶舱默认筛选 用于渲染报表
			defaultFilterFiledsList : [], 	//驾驶舱默认筛选 用于选了默认筛选器
			errorTextState : '', 	//右侧拉出里面的报表名字
			showCharIcon : this.props.reprotData.showCharIcon || false, 		//切换图形的是否打开
			showDefaultFilter : this.props.reprotData.showDefaultFilter || false, //是否显示默认筛选和报表的模块
			customCellWidthArr : App.deepClone(this.props.reprotData.columnAttributes), 			//默认自定义列的数据是空的
			areaInfo : this.props.areaInfo,	//当前报表的信息
			toggleDisabled : toggleShow,
			globalFilterFields : globalFilterFields,
			reprotData : this.props.reprotData
			 
		};
	}

	componentWillMount() {
		this.mounted = false;
		//获取默认筛选器列表
		this._getDefaultFilterFieldsData();

		//获取筛选器的方法
		this._getFilterFieldsData();
	}

	componentWillReceiveProps(nextProps) {
		var globalFilterFields = nextProps.reprotData.globalFilterFields;// GlobalFilterStore.setDimensionDisabled(nextProps.reprotData.globalFilterFields,list,nextProps.row,nextProps.col,nextProps.reportInfo.metadataId);
		//var globalFilterFields = GlobalFilterStore.setFilterDisabled(nextProps.reprotData.globalFilterFields, nextProps.areaInfo.metadataId);
		var toggleShow = this._toggleShow(globalFilterFields);
		this.setState({
			toggleDisabled : toggleShow,
			globalFilterFields : globalFilterFields,
			reprotData : nextProps.reprotData
		 
		});
	}

	componentDidMount() {

		this.mounted = true;

		//点击编辑 修改筛选是否可见
		this.app['APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE'] = App.on('APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE', this._modifyFilterValueHandle.bind(this));

		//拖动筛选器 调整顺序的方法
		this.app['APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT'] = App.on('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT', this._filterSort.bind(this));

		//点击筛选器 点击事件
		this.app['APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT-CLICK'] = App.on('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT-CLICK', this._filterSortClick.bind(this));

		//点击右侧显示图形的按钮 执行的方法
		this.app['APP-DASHBOARD-REPORT-TOGGLE-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-REPORT-TOGGLE-BUTTON-HANDLE', this._togggleBtnCharIconHandle);

		//修改默认筛选值的方法 刷新默认报表展示执行的方法
		this.app['APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS'] = App.on('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS', this._modifyDefaultFilterHandle.bind(this));

		this.app['APP-DASHBOARD-CLEAR-DEFAULT-FILTER'] = App.on('APP-DASHBOARD-CLEAR-DEFAULT-FILTER', this._clearDefaultFilter.bind(this));

		this.app['APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER-RIGHT'] = App.on('APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER-RIGHT', this._openFilter.bind(this));

		this._scrollBrar();
	}

	componentWillUpdate() {
		this._scrollBrar();
	}

	componentWillUnmount() {
		for (var i in this.app) {
			if (!this.app.hasOwnProperty(i)) continue;
			this.app[i].remove();
		}
	}

	render() {

		var thumbStylesSet = {
			backgroundColor : "rgb(0, 188, 212)"
		};

		if (!this.state.showDefaultFilter) {
			thumbStylesSet = {
				backgroundColor : "#dbdbdb"
			}
		}
		return (
			<div className = "dashboardReportEdit">
				<div className = "dashboardReportEdit-bar-thr">
					<div className = "dashboardReportEdit-bar-thr-scroll" ref = "scrollBox">
						<div className = "dashboardReportEdit-bar-title">常规</div>

						{/* 分析名称 */}
						<div className = "dashboardReportEdit-bar-name">
							<PublicTextField
								style = {{ width : '100%' }}
								floatingLabelText = "分析名称"
								defaultValue = {this.props.reprotData.name}
								rippleColor = "rgba(0,229,255,0.25)"
								hoverColor = "rgba(7,151,239,239)"
								color = "rgba(254,255,255,0.87)"
								backgroundColor = "rgba(0,145,234,234)"
								errorText = {this.state.errorTextState}
								onChange = {(evt)=>this._textFieldChangeHandle(evt)}/>
						</div>

						{/* 自定义列宽 */}
						<AutoSetCellWidthComponet
							row = {this.props.rowNum}
							col = {this.props.colNum}
							category = {this.props.reprotData.category}
							type = {this.props.reprotData.type}
							columnAttributes={this.props.columnAttributes}
							customCellWidthArr = {App.deepClone(this.props.reprotData.columnAttributes)}
							reportInfo = {this.state.areaInfo}/>

						{/* 允许使用此分析时更换图形 */}
						{this._showToggleCharIconHandle()}

						{/* 默认筛选 —— 使用自定义的数据筛选覆盖分析中的设定 */}
						<div className = "table-toggle-button">
							<Toggle
								thumbStyle = {thumbStylesSet}
								onToggle = {(evt)=>this._setReportShowHandle(evt)}
								defaultToggled = {this.state.showDefaultFilter}
								label = "使用自定义的数据筛选覆盖分析中的设定"
								disabled = {this.state.toggleDisabled}/>
						</div>
						{/* 默认筛选 —— 展示 */}
						<DefaultFilterReportComponet
							row = {this.props.rowNum}
							col = {this.props.colNum}
							reportId = {this.state.reprotId}
							customCellWidthArr = {this.props.reprotData.columnAttributes}
							defaultFilterFileds = {this.state.defaultFilterFileds}
							defaultFilterFiledsList = {this.state.defaultFilterFiledsList}
							showDefaultFilter = {this.state.showDefaultFilter}
							reportType = {this.props.reprotData.type}
							reportInfo = {this.state.areaInfo}
							category = {this.props.reprotData.category}/>

						{/* 全局筛选 */}
						<RightGlobalFilterCompoent
							globalFilterFields = {this.state.globalFilterFields}
							reprotData = {this.state.reprotData}
							reportInfo = {this.state.areaInfo}
							row = {this.props.rowNum}
							col = {this.props.colNum}/>

						{/* 选择筛选对象 */}
						<RightFilterListComponet
							filterListData = {this.state.filterListData}
							row = {this.props.rowNum}
							col = {this.props.colNum}
							columnAttributes = {this.props.reprotData.columnAttributes}
							reportInfo = {this.state.areaInfo}/>
					</div>
				</div>
			</div>
		)
	}

	/**
	 * 修改默认筛选值 刷新默认报表展示效果 并且修改dashboard组件里面用于保存默认筛选的数组 用于保存
	 * @param obj
	 * @private
	 */
	_modifyDefaultFilterHandle(obj) {

		if ((obj.col != this.props.colNum) || (obj.row != this.props.rowNum)) {
			return;
		}

		this.setState(function (state) {

			for (let i = 0; i < state.defaultFilterFiledsList.length; i++) {

				if (state.defaultFilterFiledsList[i].fieldName != obj.dbField && obj.dbField) {
					continue;
				}

				if (obj.clear) {
					if (state.defaultFilterFiledsList[i].valueType == 'DATE_CYCLE' || state.defaultFilterFiledsList[i].valueType == 'DATE_RANGE') {
						state.defaultFilterFiledsList[i].valueType = 'DATE';
					}
					state.defaultFilterFiledsList[i].popData = [];
					state.defaultFilterFiledsList[i].nameInfoOpen = false;
				}
				else {
					if (obj.dataType) {
						//日期类型的赋值
						state.defaultFilterFiledsList[i].valueType = obj.dataType;
					}

					state.defaultFilterFiledsList[i].popData = obj.seletedArr;
					state.defaultFilterFiledsList[i].nameInfoOpen = state.defaultFilterFiledsList[i].popData.length > 0;
				}
			}

			state.defaultFilterFileds = ReportStore.setFilterFieldsPopData(state.defaultFilterFiledsList);
			App.emit('APP-DASHBOARD-SAVE-DEFAULT-FILTER-HANDLE', {
				row : this.props.rowNum,
				col : this.props.colNum,
				defaultFilterFileds : state.defaultFilterFileds
			});

			return { state }
		});
	}

	/**
	 * 获取默认筛选器的方法
	 * @private
	 */
	_getDefaultFilterFieldsData() {

		let _this = this;
		let defaultFilterFiledsArr = this.props.reprotData.defaultFilterFileds || [];

		FilterFieldsStore.getDashboardDefaultFilter(this.state.reprotId, defaultFilterFiledsArr).then(function (result) {
			let defaultFilterFileds = ReportStore.setFilterFields(result);
			_this.setState({
				defaultFilterFiledsList : result,
				defaultFilterFileds : defaultFilterFileds
			});
		});
	}

	/**
	 * 获取筛选器的方法
	 * @private
	 */
	_getFilterFieldsData() {

		var _this = this;
		var filterFields = JSON.parse(JSON.stringify({
			items : this.props.reprotData.filterFields
		})).items;

		let resDataObj = this.state.areaInfo;
		let rowTitleFields = resDataObj.rowTitleFields || resDataObj.categoryFields;
		let columnArr = rowTitleFields.concat(resDataObj.indexFields);

		MetaDataStore.getMetaData(resDataObj.metadataId).then(function (resultMetaData) {

			if (resultMetaData.weiduList.length > 0) {

				if (filterFields.length > 0) {
					for (var i = 0; i < filterFields.length; i++) {
						for (let j = 0; j < resultMetaData.weiduList.length; j++) {
							if (filterFields[i].dbField == resultMetaData.weiduList[j].fieldName) {
								resultMetaData.weiduList[j].selected = true;
							}
							resultMetaData.weiduList[j].metadataId = resDataObj.metadataId;
						}
					}
				}
				else {
					for (let j = 0; j < resultMetaData.weiduList.length; j++) {
						resultMetaData.weiduList[j].selected = false;
						resultMetaData.weiduList[j].metadataId = resDataObj.metadataId;
					}
				}
			}

			_this.setState(function (previousState, currentProps) {

				/*if (resDataObj.category === "INDEX") {

					App.emit('APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE', {
						customCellWidthArr : _this._getCustomCellWidthArrFunc(previousState.customCellWidthArr, columnArr),
						row : _this.props.rowNum,
						col : _this.props.colNum
					});
				}*/

				for (let i = 0; i < resultMetaData.weiduList.length; i++) {
					for (let j = 0; j < previousState.customCellWidthArr.length; j++) {
						if (resultMetaData.weiduList[i].name === previousState.customCellWidthArr[j].name) {
							resultMetaData.weiduList[i].customName = previousState.customCellWidthArr[j].customName;
							break;
						}
					}
				}
				previousState.filterListData = resultMetaData.weiduList;

				return {
					previousState
				};
			});
		});
	}

	/**
	 * 修改了报表的名字
	 * @param evt
	 * @private
	 */
	_textFieldChangeHandle(evt) {

		var thisVal = $(evt.target).val().trim();

		if (thisVal !== undefined && thisVal !== null && thisVal !== "") {
			if (CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)) {
				this.setState({
					errorTextState : '当前输入的名字格式错误'
				})
			} else {
				if (CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16) {
					this.setState({
						errorTextState : CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) + ' / 16'
					})
				} else {
					this.setState({
						errorTextState : ''
					});
					App.emit('APP-DASHBOARD-REPORT-EDIT-HANDLE', {
						reportName : thisVal,
						row : this.props.rowNum,
						col : this.props.colNum
					});
				}
			}
		}
		else {
			this.setState({
				errorTextState : ''
			});
			App.emit('APP-DASHBOARD-REPORT-EDIT-HANDLE', {
				reportName : this.__tempThisVal,
				row : this.props.rowNum,
				col : this.props.colNum
			});
		}
	}

	/**
	 * 是否显示图形切换图形的方法
	 * @returns {*}
	 * @private
	 */
	_showToggleCharIconHandle() {

		if (this.props.reprotData.category !== "CHART") {
			return null;
		}

		let thumbStyles = { backgroundColor : "rgb(0, 188, 212)" };
		if (!this.state.showCharIcon) {
			thumbStyles = {
				backgroundColor : "#dbdbdb"
			}
		}
		return (
			<div className = "dashboardReportEdit-bar-toggle">
				<Toggle
					thumbStyle = {thumbStyles}
					onToggle = {this._charIconToggleHandle.bind(this)}
					defaultToggled = {this.state.showCharIcon}
					label = "允许使用此分析时更换图形"/>
			</div>
		);
	}

	/**
	 * 显示是否控制分析里面的图形按钮是否显示
	 * @param evt
	 * @private
	 */
	_charIconToggleHandle(evt) {

		var _this = this;

		// 修改完成当前的状态
		this.setState(function (previousState, currentProps) {

			previousState.showCharIcon = !previousState.showCharIcon;

			// 修改完成当前的状态 去修改存储数据里面的状态 用于存储,位于dashboard.js
			App.emit('APP-DASHBOARD-REPORT-EDIT-CHAR-TOGGLE-HANDLE', {
				showCharIcon : !previousState.showCharIcon,
				row : _this.props.rowNum,
				col : _this.props.colNum
			});

			if (previousState.showCharIcon) {

				// 在报表底部显示 图形切换的按钮
				App.emit('APP-DASHBOARD-REPORT-RESET-CHAR-ICON-HANDLE', {
					row : _this.props.rowNum,
					col : _this.props.colNum
				});

				// 修改toggle按钮之后如果是关闭了 就重置页面图形icon
				App.emit('APP-DASHBOARD-RESET-REPORT-CHAR-HANDLE', {
					row : _this.props.rowNum,
					col : _this.props.colNum
				});
			}

			return { previousState };
		});
	}

	_scrollBrar() {
		$(this.refs.scrollBox).mCustomScrollbar({
			autoHideScrollbar : true,
			theme : "minimal-dark"
		});
	}

	/**
	 * 设置整个驾驶舱的状态时候同事设置本省自己的状态
	 * @param evt
	 * @private
	 */
	_setReportShowHandle(evt) {

		evt.stopPropagation();

		var _this = this;

		this.setState(function (state) {
				state.showDefaultFilter = !state.showDefaultFilter;

				// 修改完成当前的状态 去修改存储数据里面的状态 用于存储,位于dashboard.js
				App.emit('APP-DASHBOARD-REPORT-SHOW-REPORT-HANDLE', {
					showDefaultFilter : state.showDefaultFilter,
					row : this.props.rowNum,
					col : this.props.colNum
				});

				return { state };

			},
			function () {
				if (!_this.state.showDefaultFilter) {
					_this._modifyDefaultFilterHandle({
						col : _this.props.colNum,
						row : _this.props.rowNum,
						dbField : null, clear : true
					});
				}
			});
	}

	/**
	 * 点击筛选 修改筛选是否可见
	 * @param itemObj
	 * @private
	 */
	_modifyFilterValueHandle(itemObj) {
		this.setState(function (previousState, currentProps) {
			previousState.filterListData[itemObj.filterIndex].selected = !itemObj.selectedBool;
			return { previousState };
		});
	}

	/**
	 * 拖动筛选器 调整顺序的方法
	 * @param arg
	 * @private
	 */
	_filterSort(arg) {

		var _this = this;
		var next = arg.next;
		var prev = arg.prev;

		this.setState(function (previousState, currentProps) {

			var filterFields = [];
			var items = [];

			if (previousState.filterListData != undefined) {
				filterFields = previousState.filterListData;
			}

			for (var i = 0; i < filterFields.length; i++) {
				items.push(filterFields[i]);
			}

			var prevItem = items[prev];
			var nextItem = items[next];

			if (prev < next) {
				items.splice((next + 1), 0, prevItem);
				items.splice(prev, 1);
			}
			if (prev > next) {
				items.splice(prev, 1);
				items.splice((next), 0, prevItem);
			}

			previousState.filterListData = items;

			return previousState;
		});

		var fields = [];
		for (var i = 0; i < this.state.filterListData.length; i++) {
			if (this.state.filterListData[i].selected) {
				var field = {
					dbField : this.state.filterListData[i].fieldName,
					name : this.state.filterListData[i].name,
					valueType : this.state.filterListData[i].fieldType,
					selected : this.state.filterListData[i].selected,
					value : [],
					items : [],
					pattern : ""
				};
				fields.push(field);
			}
		}

		setTimeout(function () {
			App.emit('APP-DASHBOARD-REPORT-FILTER-SORT', {
				fields : fields,
				row : _this.props.rowNum,
				col : _this.props.colNum
			});

		}, 100);
	}

	_filterSortClick(arg) {

		var _this = this;
		var next = arg.next;
		var prev = arg.prev;

		this.setState(function (previousState, currentProps) {

			var filterFields = [];
			var items = [];

			if (previousState.filterListData != undefined) {
				filterFields = previousState.filterListData;
			}
			for (var i = 0; i < filterFields.length; i++) {
				items.push(filterFields[i]);
			}

			var prevItem = items[prev];
			var nextItem = items[next];
			items[prev] = nextItem;
			items[next] = prevItem;
			previousState.filterListData = items;

			return previousState;
		});

		var fields = [];
		for (var i = 0; i < this.state.filterListData.length; i++) {
			if (this.state.filterListData[i].selected) {
				var field = {
					dbField : this.state.filterListData[i].fieldName,
					name : this.state.filterListData[i].name,
					valueType : this.state.filterListData[i].fieldType,
					selected : this.state.filterListData[i].selected,
					value : [],
					items : [],
					pattern : ""
				};
				fields.push(field);
			}
		}

		setTimeout(function () {
			App.emit('APP-DASHBOARD-REPORT-FILTER-SORT', {
				fields : fields,
				row : _this.props.rowNum,
				col : _this.props.colNum
			});
		}, 100);
	}

	_getCustomCellWidthArrFunc(preColArr, colArr) {

		var newcolArr = colArr.map(function (currentVal, index) {

			let checkRes = preColArr.find(function (preCol) {
				return preCol.name === currentVal.name
			});

			var retItem = {};
			if (checkRes == undefined) {
				currentVal.defaultValue = 0.5;
				currentVal.labelVal = "适中";
				retItem = currentVal;
			}
			else {
				retItem = checkRes;
			}

			retItem.customName = currentVal.customName;

			return retItem;
		});

		return newcolArr;
	}

	_clearDefaultFilter(arg) {
		this._modifyDefaultFilterHandle({
			col : this.props.colNum,
			row : this.props.rowNum,
			dbField : null,
			clear : true
		});

		App.emit('APP-DASHBOARD-REPORT-SHOW-REPORT-HANDLE', {
			showDefaultFilter : arg.show,
			row : this.props.rowNum,
			col : this.props.colNum
		});

		this.setState(function (previousState, currentProps) {

			previousState.showDefaultFilter = arg.show;
			previousState.toggleDisabled = arg.disabled;

			return previousState;
		});

	}

	_toggleShow(globalFilter) {
		var toggleShow = false;
		for (var i = 0; i < globalFilter.length; i++) {
			if (globalFilter[i].open) {
				toggleShow = true;
				break;
			}
		}

		return toggleShow;
	}
	_openFilter(item) {
		this.setState(function(previousState, currentProps){
			var globalFilterFields = previousState.reprotData.globalFilterFields;
			globalFilterFields.map(function(globalFilter){
				if(item.type=='no'){
					globalFilter.open = false;	
					previousState.toggleDisabled = false;
				}
				if(globalFilter.fieldName==item.fieldName){
					globalFilter.open = item.open;
				}
			})

			return  previousState ;
		})
	}
}

export default RightEditComponent;
