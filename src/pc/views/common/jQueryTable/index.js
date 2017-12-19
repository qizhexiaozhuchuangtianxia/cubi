/**
 * 我们将显示数据table的功能封装到JQ插件中，因为插件基于JQ绘制显示的。
 */

var $ = require('jquery');
var IndexArea = require('./IndexArea');


(function($) {
	/**
	 * options:
	 * canEditFieldName:修改字段
	 * onFieldNameChanged:修改字段event
	 * tableConfig:控制自定义列宽的参数 是一个数组
	 */
	$.fn.dataTable = function(data, options) {

		options = options || {};
		options.canEditFieldName = options.canEditFieldName || false;
		var indexArea = new IndexArea(data, options);
		var $table = indexArea.getTable();
		this.html($table);
		
		if (data.type != 'CROSS') {
			fixedTable($table);
		}

		return this;
	};

}($));

function fixedTable($table) {

	window.$table = $table;
	var tdList = $('thead > tr:first > td', $table);
	var colList = $('colgroup > col', $table);

	if (tdList.length != colList.length) {
		throw new Error('what is wrong?');
	}
	for (var i = 0; i < tdList.length; i++) {
		var td = tdList[i];
		var col = colList[i];
		$(col).css('width', $(td).width());
	};
}


module.exports = $;