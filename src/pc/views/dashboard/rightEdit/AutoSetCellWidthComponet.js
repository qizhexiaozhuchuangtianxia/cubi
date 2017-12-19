/**
 * 自定义列宽, 设定组件
 */

import React from 'react';
import App   from 'app';
var {
	Slider
} = require('material-ui');

class AutoSetCellWidthComponet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			category           : this.props.category,
			type               : this.props.type,
			customCellWidthArr : this.props.customCellWidthArr,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			category           : nextProps.category,
			customCellWidthArr : nextProps.customCellWidthArr,
		})
	}

	render() {
		var customCellWidthArr = this._setColumnAttributes(this,this.state.customCellWidthArr);
		if (this.state.category == "INDEX" && this.state.type != 'CROSS' && this.state.type != 'KPI') { //如果是表格就显示自定义列宽的模块
			return <div className = "autoSetCellWidth">
				<h2>自定义列宽</h2>
				<div className = "autoSetCellWidthContent">
					{customCellWidthArr.map((item, key)=>this._sliderDomHtmlHandle(item, key))}
				</div>
			</div>
		} else {
			return null;
		}
	}
    _setColumnAttributes(_this,customCellWidthArr){
        var columnAttributes = App.deepClone(customCellWidthArr);
        if(_this.props.columnAttributes){
            var newColumnAttributes = App.deepClone(_this.props.columnAttributes);
            var edited = true;
            newColumnAttributes.map(function(item,index){
                if(columnAttributes[index]){
                    if(item.name!=columnAttributes[index].name){
                        edited = false;
                    }
                }
                item.labelVal = '适中';
                item.defaultValue = 0.5;
            })
            if(!edited){
                columnAttributes = newColumnAttributes;
            }
        }
        return columnAttributes;
    }
	/**
	 * 输出自定义列的html结构
	 * @param item
	 * @param key
	 * @returns {XML}
	 * @private
	 */
	_sliderDomHtmlHandle(item, key) {
		var itemName = this._getItemNameByReportInfo(item, this.props.reportInfo);

		return (
			<dl key = {key}>
				<dt>{itemName}</dt>
				<dd>
					<div className = "dashboardEditSliderBox">
						<Slider
							className    = "sliderClassName"
							onChange     = {(evt, value)=>this._onChangeHandle(evt, value, item.name)}
							step         = {0.50}
							min          = {0}
							max          = {1}
							value        = {item.defaultValue}
							defaultValue = {item.defaultValue}/>
					</div>
					<label>{item.labelVal}</label>
				</dd>
			</dl>
		);
	}

	/**
	 * 当slider发生改变的时候执行的方法
	 * @param _
	 * @param value
	 * @param name
	 * @private
	 */
	_onChangeHandle(_, value, name) {

		var _this = this;

		// 修改完成当前的状态
		this.setState(function (previousState, currentProps) {
			var customCellWidthArr = _this._setColumnAttributes(_this,previousState.customCellWidthArr);
			for (var i = 0; i < customCellWidthArr.length; i++) {

				if (customCellWidthArr[i].name == name) {

					customCellWidthArr[i].defaultValue = value;
					if (value == 1) {
						customCellWidthArr[i].labelVal = '完整';
					}
					else if (value == 0) {
						customCellWidthArr[i].labelVal = '隐藏';
					}
					else if (value == 0.5) {
						customCellWidthArr[i].labelVal = '适中';
					}
				}
			}

			// 位于dashboard.js
			App.emit('APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE', {
				customCellWidthArr : customCellWidthArr,
				row                : _this.props.row,
				col                : _this.props.col
			});
			previousState.customCellWidthArr = customCellWidthArr;
			return previousState;
		});
	}

	_getItemNameByReportInfo(item, reportInfo) {

		let nameTemp  = item.name;
		let columnArr = this._getColumnArrByReportInfo(reportInfo);

		for (let i = 0; i < columnArr.length; i++) {

			if (item.name === columnArr[i].name) {
				if ((columnArr[i].customName) && ("" !== columnArr[i].customName)) {
					nameTemp = columnArr[i].customName;
				}
				else if (columnArr[i].level && columnArr[i].type) {
					nameTemp = columnArr[i].name + "_" + columnArr[i].level;
				}
				else {
					nameTemp = columnArr[i].name;
				}

				break;
			}
		}
		return nameTemp;
	}

	_getColumnArrByReportInfo(reportInfo) {

		var columnArrTmp = [];
		if (reportInfo.category === "CHART") {
			columnArrTmp = reportInfo.categoryFields.concat(reportInfo.indexFields);
		}
		else if (reportInfo.category === "INDEX") {
			columnArrTmp = reportInfo.rowTitleFields.concat(reportInfo.indexFields);
		}
		else {
			// TODO
		}

		return columnArrTmp;
	}
}

export default AutoSetCellWidthComponet;
