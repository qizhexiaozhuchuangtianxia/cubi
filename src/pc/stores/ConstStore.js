//CUBE常量定义

//表类型
const indexType = {
    BASE: "BASE",
    CROSS: "CROSS",
    CATEGORY: "CATEGORY",
    TREE: "TREE",
}

//图类型
const chartType = {
    Pie2D: "Pie2D",
    ScrollColumn2D: "ScrollColumn2D",
    ScrollLine2D: "ScrollLine2D",
    StackedColumn2D: "StackedColumn2D",
    PercentColumn2D:"PercentColumn2D",
    MultiAxisLine:"MultiAxisLine",
    WordCloud:"WordCloud",
    EchartsMap:"EchartsMap",
    KPI:"KPI"
}

//分析表类型
const category = {
	CHART:"CHART",
	INDEX:"INDEX"
}

//维度类型
const groupType = {
	GROUP_TITLE_FIELD:"GROUP_TITLE_FIELD",
	GROUP_DATE_TITLE_FIELD:"GROUP_DATE_TITLE_FIELD",
}

//日期类型
const dateType = {
	DATE:"DATE",
	DATE_RANGE:"DATE_RANGE",//自定义时间
	CUSTOM:"CUSTOM",
	DATE_CYCLE:"DATE_CYCLE"//自然时间
}

//排序方式
const sortMethod = {
    NORMAL: "NORMAL",
    ASC: "ASC",
    DESC: "DESC"
}

//驾驶舱单元格类型
const cellType = {
	REPORT:"REPORT",
	TEXT:"TEXT",
	DOWN_FILTER:"DOWN_FILTER",
	SEARCH_FILTER:"SEARCH_FILTER",
	DATE_FILTER:"DATE_FILTER",
	WEB:"WEB"
}

//表格下载格式
const downloadType= {
	excel:"excel",
	csv:"csv"
}

//指标类型
const indexFieldType = {
	INDEX_FIELD:"INDEX_FIELD", //最大最小值
	COMPARE_INDEX_FIELD:"COMPARE_INDEX_FIELD" //场景
}

//指标统计类型
const statisticalType = {
	SUM:"SUM",
	AVG:"AVG",
	MAX:"MAX",
	MIN:"MIN",
	COUNT:"COUNT",
}

//提示信息
const meassage = {
	NO_DATA:"未检索到数据",
	NULL_DATA:"当前数据为空",
	END_DATA:"您已经看完了所有数据",
	LOAD:"加载中...",
	NO_REPORT_TYPE:"不支持报表类型：",
	TRPORT_TITLE:"数据立方：",
	DELETED_REPORT : "您暂时没有权限删除当前选中的分析",
	DELETED_REPORT_DIRECTORY : "您暂时没有权限删除当前选中的文件夹",
	RENAME_DIRECTORY:"您暂时没有权限重命名当前选中的文件夹",
	RENAME_REPORT:"您暂时没有权限重命名当前选中的分析",
}

//指标格式化类型列表
const indexFieldFormaterList = [
		{
			name:"标准",
			type:'standard',
			standard:0,
		},
		{
			name:"百分比",
			type:'percentage',
			standard:1,
		},
		{
			name:"货币(人民币)",
			type:'rmb',
			standard:2,
		},
		{
			name:"货币(美元)",
			type:'dollar',
			standard:3,
		},
		{
			name:"货币(欧元)",
			type:'euro',
			standard:4,
		}
	];

//指标格式化类型
const indexFieldFormater = {
		'STANDARD':'standard',
		'PERCENTAGE':'percentage',
		'RMB':'rmb',
		'DOLLAR':'dollar',
		"EURO":'euro'
	};

/**
 * 货币符号
 * @type {{RMB: string, DOLLAR: string, EURO: string}}
 */
const currencySymbol = {
	RMB : '¥',
	DOLLAR : '$',
	EURO : '€'
};

/**
 * 计算列错误信息
 * @type {{ERROR: string, ERR_NAME: string, ERR_DIV0: string, ERR_CARET: string, ERR_FORMAT: string}}
 */
const expressionError = {
	ERROR      : "#ERROR!",
	ERR_NAME   : "#NAME?",
	ERR_DIV0   : "#DIV/0!",
	ERR_CARET  : "#CARET^-1!",
	ERR_FORMAT : "#FORMAT_ERR"
};

module.exports = {
	indexType:indexType,
	chartType:chartType,
	category:category,
	groupType:groupType,
	dateType:dateType,
	sortMethod:sortMethod,
	cellType:cellType,
	downloadType:downloadType,
	indexFieldType:indexFieldType,
	statisticalType:statisticalType,
	meassage:meassage,
	indexFieldFormaterList:indexFieldFormaterList,
	indexFieldFormater:indexFieldFormater,
	expressionError : expressionError,
	currencySymbol : currencySymbol
}