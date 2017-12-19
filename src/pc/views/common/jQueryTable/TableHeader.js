var $ = require('jquery');
var _ = require('lodash');

const SORT_NONE = 0,
	SORT_ASC = 1,
	SORT_DESC = 2;

function TableHeader(fields, canEditFieldName) {
	this.fields = fields;
	this.canEditFieldName = false;
	//this.canEditFieldName = canEditFieldName;
	//field changed event
	this.onFieldNameChanged = null;
	this.cols = [];
}

TableHeader.prototype.build = function() {
	var fields = this.fields;
	var $thead = $("<thead></thead>");
	var $tr = $("<tr></tr>");
	for (var i = 0; i < fields.length; i++) {
		var col = new HeaderCol(fields[i], this.canEditFieldName, this.handleRequestEdit.bind(this));
		col.onFieldNameChanged = this.handleFieldChanged.bind(this);
		this.cols.push(col);
		var $col = col.build();
		$tr.append($col);
	}
	$thead.append($tr);
	return $thead;
}


TableHeader.prototype.handleRequestEdit = function() {
	for (var i = 0; i < this.cols.length; i++) {
		var col = this.cols[i];
		if (col.mode == 'EDIT') {
			col.renderTextView();
		}
	}
}

TableHeader.prototype.handleFieldChanged = function(field) {
	console.log('field changed : ', field);
	if (this.onFieldNameChanged) {
		this.onFieldNameChanged(field);
	}
}


function HeaderCol(field, canEditFieldName, requestEdit) {
	this.mode = 'TEXT'; //TEXT|EDIT
	this.sort = SORT_NONE;
	this.field = field;
	this.canEditFieldName = canEditFieldName;
	this.requestEdit = requestEdit;
	this.fieldName = field.getName();
	this.title = field.getCustomName() || this.fieldName;
	this.onFieldNameChanged = null;
	this.$td = null;
}

HeaderCol.prototype.build = function() {
	var $td = this.$td = $("<td></td>");
	$td.addClass("tree_column_header_td");
	this.renderTextView();
	return this.$td;
}

HeaderCol.prototype.renderTextView = function() {
	this.mode = 'TEXT';
	var field = this.field;
	var $td = this.$td;
	//$td.addClass("tree_column_header_td");
	//$td.attr("colnum", i);
	var $div = $('<div class="theadDiv"></div>');
	//var $sort = $('<span class="sort"><i class="iconfont icon-icarrowback24px"></i></span>');
	var $span = $('<span class="title"></span>');

	$span.text(this.title);
	$span.attr("title", this.title);
	//$div.append($sort);
	$div.append($span);

	if (this.canEditFieldName) {
		var $edit = $('<i class="edit iconfont icon-icbianji24px"></i>');
		$edit.click(this.handleRequestEdit.bind(this));
		$div.append($edit);
	}

	//$div.append($sortIcon);
	$td.html($div);
	return $td;
}

HeaderCol.prototype.handleRequestEdit = function() {
	// if (this.requestEdit) {
	// 	this.requestEdit();
	// }
	this.renderEditView();
}

HeaderCol.prototype.renderEditView = function() {
	this.mode = 'EDIT';
	var $td = this.$td;
	//var width = $td.width();
	var $input = $(`<input class="table-header-col-edit" type="text" value="${this.title}"/>`);
	//$input.css('width', width * 0.8 + 'px');
	var handleEndEdit = this.handleEndEdit.bind(this);
	$td.html($input);

	$input.keyup(function(e) {
		//handle Enter key
		if (e.keyCode == 13) {
			handleEndEdit($input);
		}
	});

	$input.blur(function(e) {
		console.log('blur');
		handleEndEdit($input);
	});
	$input.focus();
}


HeaderCol.prototype.handleEndEdit = function($input) {
	var txt = _.trim($input.val() || '');
	this.updateTitle(txt);
	this.renderTextView();
}

HeaderCol.prototype.updateTitle = function(input) {
	if (input == '') input = null;
	var title = input;
	if (title != this.title) {
		this.title = title || this.fieldName;
		this.onFieldNameChanged({
			'name': this.field.getName(),
			'customName': title,
		});
	}
}

HeaderCol.prototype.changeSort = function(sort) {
	if (this.mode != 'TEXT') return;

}

// var $sortIcon = $("<span href='javascript:void(0)' class='head-sort iconfont icon-icarrowback24px'></span>");
// $sortIcon.attr("title", fields[i].getName());
// $sortIcon.attr("sorttype", fields[i].getSortMethod());

module.exports = TableHeader;