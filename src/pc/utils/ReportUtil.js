import ConstStore from '../stores/ConstStore';

/**
 * 报表工具
 **/
const FORMAT_PIE_LINE_COLUMN = [
	"ScrollLine2D",
	"ScrollColumn2D",
	"PercentColumn2D",
	"StackedColumn2D",
	"MultiAxisLine",
	"WordCloud",
	"Pie2D",
];
const FORMAT_DATA_TYPE = {
	NUMBER: "NUMBER",
	DOUBLE: "DOUBLE",
	LONG: "LONG",
	INTEGER: "INTEGER",
	DATE: "DATE",
	CURRENCY: "CURRENCY",
	STRING: "STRING",
	PERCENT: "PERCENT",
};
const NUMBER_DATA_FORMAT = [
	"0",
	"0.00",
	",###,##0",
	",###,##0.00",
	",###,##0.00%"
];
const DATE_DATA_FORMAT = {
	SPACE: "",
	DATE: "yyyy-MM-dd",
	DATE_TIME: "yyyy-MM-dd HH:mm:ss",
	TIME: "HH:mm:ss",
	DATE_CN: "yyyy年MM月dd日",
	DATE_TIME_CN: "yyyy年MM月dd日 HH时mm分ss秒",
	TIME_CN: "HH时mm分ss秒",
};




function random() {
	return parseInt(Math.random() * 10000);
}

Date.prototype.format = function (pattern) {

	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i
	}

	var dateObj = this;

	var year = dateObj.getFullYear();
	var month = checkTime(dateObj.getMonth() + 1);
	var date = checkTime(dateObj.getDate());
	var hours = checkTime(dateObj.getHours());
	var minutes = checkTime(dateObj.getMinutes());
	var seconds = checkTime(dateObj.getSeconds());
	var ret = "";
	switch (pattern) {
		case DATE_DATA_FORMAT.SPACE:
		case DATE_DATA_FORMAT.DATE:
			ret = year + "-" + month + "-" + date;
			break;
		case DATE_DATA_FORMAT.DATE_TIME:
			ret = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
			break;
		case DATE_DATA_FORMAT.TIME:
			ret = hours + ":" + minutes + ":" + seconds;
			break;
		case DATE_DATA_FORMAT.DATE_CN:
			ret = year + "年" + month + "月" + date + "日";
			break;
		case DATE_DATA_FORMAT.DATE_TIME_CN:
			ret = year + "年" + month + "月" + date + "日 " + hours + "时" + minutes + "分" + seconds + "秒";
			break;
		case DATE_DATA_FORMAT.TIME_CN:
			ret = hours + "时" + minutes + "分" + seconds + "秒";
			break;
		default:
			ret = year + "-" + month + "-" + date;
			//console.log("_formatDateObject: error date type.");
			break;
	}
	return ret;
};

module.exports = {

	/**
	 * 根据areaInfo获取报表数据
	 * @param dataArr
	 * @returns {Array}
	 */
	getBaseDataArrayForChartFormat: function (dataArr) {

		var retBaseArr = [];
		for (let i = 0; i < dataArr.length; i++) {
			var tempArr = [];
			for (let j = 0; j < dataArr[i].setArray.length; j++) {
				tempArr.push(this._formatSet(dataArr[i].setArray[j], dataArr[i].pageFormater));
			}
			retBaseArr[i] = tempArr;
		}
		return retBaseArr;
	},

	_formatSet: function (setObj, pageFormater) {
		var retVal = "";
		switch (setObj.type) {
			case FORMAT_DATA_TYPE.NUMBER:
			case FORMAT_DATA_TYPE.DOUBLE:
			case FORMAT_DATA_TYPE.LONG:
			case FORMAT_DATA_TYPE.INTEGER:

			    let errDisplay = this._ErrDisplay(setObj.value);
                if (null != errDisplay) {
                    retVal = errDisplay;
                }
                else {
                    retVal = this._formatNumberTypeCellValue(setObj.value, setObj.pattern, pageFormater);
                }
				break;
			case FORMAT_DATA_TYPE.DATE:
				// XuWenyue : Fix the information of dimession DateTree
				if ("GROUP_DATE_TITLE_FIELD" === item.groupType) {
					retVal = this._formatDateTypeCellValueForWeekQuarter(setObj);
				}
				else {
					retVal = this._formatDateTypeCellValue(setObj.value, setObj.pattern);
				}
				break;
			case FORMAT_DATA_TYPE.CURRENCY:
			//TODO
			//break;
			case FORMAT_DATA_TYPE.STRING:
			//TODO
			//break;
			case FORMAT_DATA_TYPE.PERCENT:
			//TODO
			//break;
			default:
				retVal = setObj.value;
				break;
		}

		return retVal || 0;
	},

    _ErrDisplay : function (value) {

	    let retVal = null;

	    switch (value) {
			case ConstStore.expressionError.ERROR :
            case ConstStore.expressionError.ERR_NAME :
            case ConstStore.expressionError.ERR_DIV0 :
            case ConstStore.expressionError.ERR_FORMAT :
            case ConstStore.expressionError.ERR_CARET :
            {
                retVal = "---";
                break;
            }
            default :
            {
                retVal = null;
                break;
            }
        }

        return retVal;

    },

	_toThousands: function (num) {
		var result = "";
		var count = 0;
		for (let i = num.length - 1; i >= 0; i--) {
			count++;
			result = num.charAt(i) + result;
			if (count % 3 === 0 && i !== 0) {
				result = "," + result;
			}
		}

		return result;
	},

	/**
	 * get Formatted CellValue
	 * @param item
	 * @returns {string}
	 */
	getFormattedCellValue: function (item) {
		var formattedVal = "";
		switch (item.dataType) {
			case FORMAT_DATA_TYPE.NUMBER:
			case FORMAT_DATA_TYPE.DOUBLE:
			case FORMAT_DATA_TYPE.LONG:
			case FORMAT_DATA_TYPE.INTEGER:

                let errDisplay = this._ErrDisplay(item.value);
                if (null != errDisplay) {
                    formattedVal = errDisplay;
                }
                else {
                    formattedVal = this._formatNumberTypeCellValue(item.value, item.pattern, item.pageFormater);
                }
				break;
			case FORMAT_DATA_TYPE.DATE:
				// XuWenyue : Fix the information of dimession DateTree
				if ("GROUP_DATE_TITLE_FIELD" === item.groupType) {
					formattedVal = this._formatDateTypeCellValueForWeekQuarter(item);
				}
				else {
					formattedVal = this._formatDateTypeCellValue(item.value, item.pattern);
				}
				break;
			case FORMAT_DATA_TYPE.CURRENCY:
			//TODO
			case FORMAT_DATA_TYPE.STRING:
			//TODO
			case FORMAT_DATA_TYPE.PERCENT:
			//TODO
			default:
				formattedVal = item.formatValue;
				break;
		}

		return formattedVal;
	},

	getFormattedCrossCellValue: function (item) {
		var formattedVal = "";
		if (item.rowType === "TITLE") {
			if (item.pattern && Object.values(DATE_DATA_FORMAT).includes(item.pattern)) {
				// XuWenyue : Fix the information of dimession DateTree
				if ("GROUP_DATE_TITLE_FIELD" === item.groupType) {
					formattedVal = this._formatDateTypeCellValueForWeekQuarter(item);
				}
				else {
					formattedVal = this._formatDateTypeCellValue(item.value, item.pattern);
				}
			} else {
				formattedVal = item.value;
			}
		} else {
			switch (item.dataType) {
				case FORMAT_DATA_TYPE.NUMBER:
				case FORMAT_DATA_TYPE.DOUBLE:
				case FORMAT_DATA_TYPE.LONG:
				case FORMAT_DATA_TYPE.INTEGER:
                    let errDisplay = this._ErrDisplay(item.value);
                    if (null != errDisplay) {
                        formattedVal = errDisplay;
                    }
                    else {
                        formattedVal = this._formatNumberTypeCellValue(item.value, item.pattern, item.pageFormater);
                    }
					break;
				case FORMAT_DATA_TYPE.DATE:
					// XuWenyue : Fix the information of dimession DateTree
					if ("GROUP_DATE_TITLE_FIELD" === item.groupType) {
						formattedVal = this._formatDateTypeCellValueForWeekQuarter(item);
					}
					else {
						formattedVal = this._formatDateTypeCellValue(item.value, item.pattern);
					}
					break;
				case FORMAT_DATA_TYPE.CURRENCY:
				//TODO
				case FORMAT_DATA_TYPE.STRING:
				//TODO
				case FORMAT_DATA_TYPE.PERCENT:
				//TODO
				default:
					formattedVal = item.formatValue;
					break;
			}
		}

		return formattedVal;
	},

	/**
	 * 根据层级，返回树形日期格式化值
	 * @param value
	 * @param level 年、季度、月、周、日
	 * @returns 2017 第2季度、 2017 第3周
	 */
	getFormattedDataTree(value, level) {

		let item = {
			value: value,
			level: level
		};

		return this._formatDateTypeCellValueForWeekQuarter(item);

	},

	_formatDateTypeCellValue: function (value, pattern) {

		if ((!value) || (value === "")) {
			return "";
		}

		// TODO: TOFIX: 日期树形维度表示时，年、季、月、周不需要日期格式化
		var regexp = new RegExp(/^\d{4}(\-\d{1,2}){0,1}$/);
		if (regexp.test(value)) {
			return value;
		}

		return new Date(value).format(pattern);
	},

	/**
	 * 格式化树形日期，季度、月
	 * @param item
	 * @returns 2017 第2季度、 2017 第3周
	 * @private
	 */
	_formatDateTypeCellValueForWeekQuarter: function (item) {
		let value   = item.value;
		let level   = item.level;
		let pattern = item.pattern;

		if ((!value) || (value === "")) {
			return "";
		}

		var regexp = new RegExp(/^\d{4}(\-\d{1,2})$/);

		if (!regexp.test(value)) {
			if ("日" === level){
				return new Date(value).format(pattern);
			}
			return value;
		}

		let year = value.substring(0, 4);
		let val  = value.substring(5);

		if (("季度" === level) || ("周" === level)) {
			return year + " 第" + val + level;
		}
		else {

			return value;
		}
	},

	_formatNumberTypeCellValue: function (value, pattern, pageFormater) {

		if (pageFormater) {
			switch (pageFormater.type) {
				case ConstStore.indexFieldFormater.STANDARD :
				case ConstStore.indexFieldFormater.PERCENTAGE :
				case ConstStore.indexFieldFormater.RMB :
				case ConstStore.indexFieldFormater.DOLLAR :
				case ConstStore.indexFieldFormater.EURO :
					break;
				default :
					pageFormater = null;
			}
		}
		else {
			pageFormater = null;
		}

		if (null === pageFormater) {
			if (null !== pattern) {
                return this._formatNumberTypeCellValuePattern(value, pattern);
            }
            else {
				return value;
			}
		}
		else {
			return this._formatNumberTypeCellValueFormater(value, pageFormater);
		}
	},

	getFormattedValueWithFormatter : function (value, pageFormatter) {
		return this._formatNumberTypeCellValue(value, "0.00", pageFormatter);
	},

	getFormattedValue : function (value, pageFormatter) {
		if (!pageFormatter) {
			return value;
		}

		return this._formatNumberTypeCellValue(value, null, pageFormatter);
    },

	/**
	 * 前端设定指标格式化, 对指标值进行格式化
	 * @param value 指标值
	 * @param pageFormater 格式化设定
	 * @returns {*} 格式化后字符串
	 * @private
	 */
	_formatNumberTypeCellValueFormater : function (value, pageFormater) {

		let preSymbol     = '';
		let extSymbol     = '';
		let formatedValue = value;
		let toThousands   = false;

		if (((!formatedValue) || ("" == formatedValue)) && (0 !== formatedValue)) {
			return formatedValue;
		}

		switch (pageFormater.type) {
			// 指标格式化 : 标准
			case ConstStore.indexFieldFormater.STANDARD :
				break;

			// 指标格式化 : 百分比
			case ConstStore.indexFieldFormater.PERCENTAGE :
				formatedValue = Number(value * 100);
				extSymbol = '%';
				break;

			// 指标格式化 : 人民币
			case ConstStore.indexFieldFormater.RMB :
				preSymbol   = ConstStore.currencySymbol.RMB;
				toThousands = true;
				break;

			// 指标格式化 : 美元
			case ConstStore.indexFieldFormater.DOLLAR :
				preSymbol   = ConstStore.currencySymbol.DOLLAR;
				toThousands = true;
				break;

			// 指标格式化 : 欧元
			case ConstStore.indexFieldFormater.EURO :
				preSymbol   = ConstStore.currencySymbol.EURO;
				toThousands = true;
				break;
			default :
				return formatedValue;
		}

		if ((-1 < pageFormater.digit) && (pageFormater.digit < 20)) {
			// 设置了小数位数
			formatedValue = Number(formatedValue).toFixed(pageFormater.digit);
		}
		/* xuwenyue 当没有设置小数位的时候，无默认 */
		/* DEL START
		else {
			// 未指定小数位数时，显示两位小数
			let values = (formatedValue || 0).toString().split(".");
			if ((1 < values.length) && (2 < values[1].length)) {
				formatedValue = Number(formatedValue).toFixed(2);
			}
		}
		DEL END */

		// 处理千分位分隔符
		if (true == toThousands) {
			let values = (formatedValue || 0).toString().split(".");
			if (0 < values.length) {
				values[0] = this._toThousands(values[0]);

				if (1 < values.length) {
					formatedValue = values[0] + '.' + values[1];
				}
				else {
					formatedValue = values[0];
				}
			}
		}

		return preSymbol + formatedValue + extSymbol;
	},


	_formatNumberTypeCellValuePattern : function (value, pattern) {

		var formattedVal = 0;
		pattern = pattern || "";
		var patterns = pattern.split(".");

		if (patterns.length > 1) {
			if (pattern.endsWith("%")) {
				let fixedLen = patterns[1].length - 1;
				let floatVal = Number(value * 100).toFixed(fixedLen);
				let source = (floatVal || 0).toString().split(".");
				source[0] = this._toThousands(source[0]);
				if (patterns[0].includes(",###")) {
					source[0] = this._toThousands(source[0]);
				} else {
					source[0] = source[0];
				}
				formattedVal = source[0] + "." + (source[1]) + "%";
			} else {
				let fixedLen = patterns[1].length;
				let floatVal = Number(value).toFixed(fixedLen);
				let source = (floatVal || 0).toString().split(".");
				if (patterns[0].includes(",###")) {
					source[0] = this._toThousands(source[0]);
				} else {
					source[0] = source[0];
				}
				formattedVal = source[0] + "." + source[1];
			}
		} else {
			value = Number(value).toFixed(0);
			if (patterns[0].includes(",###")) {
				formattedVal = this._toThousands(value.toString());
			} else {
				formattedVal = value;
			}
		}

		return formattedVal || 0;
	},

	/**
	 * get Formatted Total Value For Stack
	 * @param value
	 * @param pattern
	 * @Param pageFormater
	 * @returns Formatted Value
	 */
	getFormattedTotalValueForStack: function (value, pattern, pageFormater) {
		return this._formatNumberTypeCellValue(value, pattern, pageFormater);
	},

	getFormattedValueForPie: function (value, pattern) {
		return this._formatNumberTypeCellValue(value, pattern);
	},

	getFormattedValueForMap: function (param) {
		var item = {
			dataType: param.data.type || "NUMBER",
			value: param.data.value || 0,
			pattern: param.data.pattern || "",
		};
		return this.getFormattedCellValue(item);
	}
};
