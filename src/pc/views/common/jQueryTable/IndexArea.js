var $ = require('jquery');
var TableHeader = require('./TableHeader');
var ColGroup = require('./ColGroup');

/**
 * @enum 报表类型常量
 * @type {{BASE: string, CROSS: string, CATEGORY: string, TREE: string}}
 */
var IndexType = {
    /** 基本表 */
    BASE: "BASE",
    /** 交叉表 */
    CROSS: "CROSS",
    /** 分类表 */
    CATEGORY: "CATEGORY",
    /** 树形表 */
    TREE: "TREE",
    /** 竖基本表 */
    //VBASE: "VBASE"
}


/**
 * @class AreaPage 在area中的分页对象
 * @param {Object} o 分页对象数据
 * @constructor 创建area中的分页对象
 */
var AreaPage = function(o) {
    var instance = this;
    var rows = [];

    /**
     * @method 获取row对象数组
     *
     * @return {AreaRow[]} v row对象数组
     */
    this.getRows = function() {
        return rows;
    }

    var initial = function() {
        if (o) {
            for (var i = 0; i < o.rows.length; i++) {
                var obj = new AreaRow(o.rows[i]);
                rows.push(obj);
            }
        }
    }

    initial();
}

/**
 * @class AreaRow 在area中的行对象
 * @param {Object} o 行对象数据
 * @constructor 创建area中的行对象
 */
var AreaRow = function(o) {
    var instance = this;
    var cells = [];

    /**
     * @method 获取cell对象数组
     *
     * @return {AreaCell[]} v cell对象数组
     */
    this.getCells = function() {
        return cells;
    }

    var initial = function() {
        if (o) {
            for (var i = 0; i < o.cells.length; i++) {
                var obj = new AreaCell(o.cells[i]);
                cells.push(obj);
            }
        }
    }

    initial();
}

/**
 * @class AreaField 在area中的行中的field对象
 *
 * @param {Object} o 包含field对象数据
 * @constructor 创建area中的行中的field对象
 */
var AreaField = function(o) {
    var instance = this;
    var name = null;
    var dbName = null;
    var dataType = null;
    var dmType = null;
    var dimensionId = null;
    var sortMethod = null;
    var filter = false;
    var customName = null;

    /**
     * @method getName 获取字段别名
     *
     * @return {string} 字段别名
     */
    this.getName = function() {
        return name;
    }

    /**
     * @method getDbName 获取DB字段别名
     *
     * @return {string} DB字段别名
     */
    this.getDbName = function() {
        return dbName;
    }

    this.getCustomName = function() {
        return customName;
    }

    /**
     * @method isFilter 获取是否是筛选列的标记
     *
     * @return {boolean} 是否是筛选列的标记
     */
    this.isFilter = function() {
        return filter;
    }

    /**
     * @method getDataType 获取数据类型
     *
     * @return {DataType} 数据类型
     */
    this.getDataType = function() {
        return dataType;
    }

    /**
     * @method getDmType 获取字段的维度类型
     *
     * @return {DmType} 字段的维度类型
     */
    this.getDmType = function() {
        return dmType;
    }

    /**
     * @method getDimensionId 获取字段关联的维度ID
     *
     * @return {string} 字段关联的维度ID
     */
    this.getDimensionId = function() {
        return dimensionId;
    }

    /**
     * @method getSortMethod 获取字段的排序方式
     *
     * @return {SortMethod} 字段的排序方式
     */
    this.getSortMethod = function() {
        return sortMethod;
    }

    var initial = function() {
        if (o) {
            name = o.name;
            dbName = o.dbName;
            dataType = o.dataType;
            dmType = o.dmType;
            dimensionId = o.dimensionId;
            sortMethod = o.sortMethod;
            filter = o.filter;
            customName = o.customName;
        }
    }

    initial();
}

/**
 * @class 创建area中的行中的cell对象
 * @param {Object} o
 * @constructor 创建area中的行中的cell对象
 */
var AreaCell = function(o) {
    var instance = this;
    var rowNo = null;
    var columnNo = 1;
    var clazz = null;
    var rowspan = null;
    var colspan = null;
    var visible = null;
    var valid = null;
    var dataType = null;
    var formatValue = null;
    var value = null;
    var valueId = null;
    var rowType = null;
    var colType = null;
    var colURL = null;

    /**
     * @method 获取Cell的链接
     *
     * @return {number} Cell的链接
     */
    this.getColURL = function() {
        return colURL;
    };

    /**
     * @method 获取Cell的行号
     *
     * @return {number} Cell的行号
     */
    this.getRowNo = function() {
        return rowNo;
    };

    /**
     * @method 获取Cell的列号
     *
     * @return {number} Cell的列号
     */
    this.getColumnNo = function() {
        return columnNo;
    };

    /**
     * @method 获取Cell的class属性名
     *
     * @return {number} Cell的class属性名
     */
    this.getClazz = function() {
        return clazz;
    };

    /**
     * @method 获取Cell的跨行数
     *
     * @return {number} Cell的跨行数
     */
    this.getRowspan = function() {
        return rowspan;
    };

    /**
     * @method 获取Cell的跨列数
     *
     * @return {number} Cell的跨列数
     */
    this.getColspan = function() {
        return colspan;
    };

    /**
     * @method 获取Cell的可见性
     *
     * @return {boolean} Cell的可见性
     */
    this.isVisible = function() {
        return visible;
    };

    /**
     * @method 获取Cell的有效性
     *
     * @return {boolean} Cell的有效性
     */
    this.isValid = function() {
        return valid;
    };

    /**
     * @method 获取Cell的数据类型
     *
     * @return {DataType} Cell的数据类型
     */
    this.getDataType = function() {
        return dataType;
    };

    /**
     * @method 获取Cell的格式化后的值
     *
     * @return {string} Cell的格式化后的值
     */
    this.getFormatValue = function() {
        return formatValue;
    };

    /**
     * @method 获取Cell的值
     *
     * @return {string} Cell的值
     */
    this.getValue = function() {
        return value;
    };

    /**
     * @method 获取Cell的值Id
     *
     * @return {string} Cell的值
     */
    this.getValueId = function() {
        return valueId;
    };

    /**
     * @method 获取Cell的行类型
     *
     * @return {string} Cell的行类型
     */
    this.getRowType = function() {
        return rowType;
    };

    /**
     * @method 获取Cell的行类型
     *
     * @return {string} Cell的行类型
     */
    this.getColType = function() {
        return colType;
    };

    var initial = function() {
        if (o) {
            rowNo = o.rowNo;
            columnNo = o.columnNo;
            clazz = o.clazz;
            rowspan = o.rowspan;
            colspan = o.colspan;
            visible = o.visible;
            valid = o.valid;
            dataType = o.dataType;
            formatValue = o.formatValue;
            value = o.value;
            valueId = o.valueId;
            rowType = o.rowType;
            colType = o.colType;
            colURL = o.URL;
        }
    }

    initial();
}


/**
 * @class IndexArea 对象
 * @param {Object} o
 * @constructor 创建IndexArea 对象
 */
var IndexArea = function(o, options) {
    var instance = this;
    var id = null;
    var name = null;
    var uuid = null;
    var category = null;
    var type = null;
    //var rows = [];
    var pages = [];
    var fields = [];
    var pageParameter = null;
    var filterFields = [];

    var metadataId = null;

    var startPageNo = 1;

    /**
     * @method getId 获取id
     *
     * @return {string} id
     */
    this.getId = function() {
        return id;
    };

    /**
     * @method getName 获取名字
     *
     * @return {string} name
     */
    this.getName = function() {
        return name;
    };

    this.getCurrentPage = function() {
        var pageIndex = 0;
        if (pageParameter) {
            pageIndex = pageParameter.currentPageNo - startPageNo;
        }
        return pages[pageIndex];
    };

    this.sortFun = function(evt) {
            evt.stopPropagation();
            /*App.emit('APP-REPORT-SET-SORT-HANDLE',{
                sortFields:[{
                    field:evt.target.title,
                    method:$(evt.target).attr('sorttype')
                }]
            })*/
            console.log(fn)
            fn.call(this, [{
                field: evt.target.title,
                method: 'DESC' //$(evt.target).attr('sorttype')
            }]);
            //$(evt.target).removeClass('downIcon');
            /*if($(evt.target).hasClass('downIcon')){
                App.emit('APP-REPORT-SET-SORT-HANDLE',{
                    sortFields:[{
                        field:evt.target.title,
                        method:'ASC'
                    }]
                })
                $(evt.target).removeClass('downIcon');
            }else{
                App.emit('APP-REPORT-SET-SORT-HANDLE',{
                    sortFields:[{
                        field:evt.target.title,
                        method:'DESC'
                    }]
                })
                $(evt.target).addClass('downIcon');
            }*/
        }
        /**
         * @method getTable 获取表格对应的table的jquery对象
         *
         * @return {Object} 表格对应的table的jquery对象
         */
    this.getTable = function() {
        var $table = $("<table cellpadding='0' cellspacing='0' border='0'></table>");

        $table.attr("id", id + "_Table");
        $table.addClass("table-report");
        $table.addClass("table-bordered");

        //输出thead
        //if (type != IndexType.CROSS && type != IndexType.VBASE) {
        if (type != IndexType.CROSS && fields.length > 0) {
            var colGroup = new ColGroup(fields, options.tableConfig);
            var $colGroup = colGroup.build();
            $table.append($colGroup);

            var header = new TableHeader(fields, options.canEditFieldName);
            if (options.onFieldNameChanged) {
                header.onFieldNameChanged = options.onFieldNameChanged;
            }
            var $header = header.build();
            $table.append($header);
        }
        //}

        // 输出tbody
        var $tbody = $("<tbody></tbody>");
        var pageIndex = 0;

        var page = this.getCurrentPage();

        if (page) {
            var rows = page.getRows();
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];

                var $tr = $("<tr></tr>");
                // if (type == IndexType.VBASE) {
                //     var $td = $("<td></td>");
                //     $td.addClass("tree_column_header_td");
                //     $td.attr("style", "background:#cde7f5;color:#626263;");
                //     $td.attr("colnum", 0);

                //     var $span = $("<span></span>");
                //     $span.text(fields[i].getName());
                //     $span.attr("title", fields[i].getName());
                //     $td.append($span);

                //     $tr.append($td);
                // }
                var cells = row.getCells();
                for (var j = 0; j < cells.length; j++) {
                    var cell = cells[j];

                    if (cell.isValid()) {
                        var $td = $("<td></td>");
                        $td.attr(id + "_" + cell.getRowNo() + "_" + cell.getColumnNo());
                        if (cell.isVisible()) {
                            var dataType = cell.getDataType();
                            if (dataType == 'DOUBLE' || dataType == 'INTEGER') {
                                // $td.attr("style", "text-align:right;");
                            } else {
                                // $td.attr("style", "text-align:center;");
                            }
                        } else {
                            $td.attr("style", "display:none;");
                        }

                        var rowspan = cell.getRowspan();
                        if (rowspan > 1) {
                            $td.attr("rowspan", rowspan);
                        }
                        var colspan = cell.getColspan();
                        if (colspan > 1) {
                            $td.attr("colspan", colspan);
                        }
                        var clazz = cell.getClazz();
                        if (clazz != null) {
                            $td.addClass(clazz);
                        }

                        var url = cell.getColURL();
                        var formatValue = cell.getFormatValue();
                        if (url) {
                            url = url.replace("$key$", formatValue);
                        }
                        if (StringUtils.isUrl(url)) {
                            var $a = $("<a></a>");
                            $a.text(formatValue);
                            $a.attr("href", url);
                            $a.attr("title", formatValue);
                            $a.attr("target", "_blank");
                            var $span = $("<span></span>");
                            $span.append($a);
                            $td.append($span);
                        } else {
                            var $span = $("<span></span>");
                            $span.text(formatValue);
                            $span.attr("title", formatValue);
                            $td.append($span);
                        }

                        $tr.append($td);
                    }
                }

                $tbody.append($tr);
            }
            $table.append($tbody);
        } else {
            throw new Error('未检索到数据');
        }
        return $table;
    }

    var initial = function() {
        if (o) {
            id = o.id;
            uuid = o.uuid;
            name = o.name;
            category = o.category;
            type = o.type;
            metadataId = o.metadataId;

            if (o.fields) {
                for (var i = 0; i < o.fields.length; i++) {
                    var obj = new AreaField(o.fields[i]);
                    fields.push(obj);
                }
            }

            if (o.pages) {
                for (var i = 0; i < o.pages.length; i++) {
                    var obj = new AreaPage(o.pages[i]);
                    pages.push(obj);
                }
            }

            pageParameter = o.pageParameter;

            if (o.startNo) {
                startPageNo = o.startNo;
            }

        }
    }

    initial();
}


/**
 * 字符串工具类
 */
var StringUtils = {
    isEmpty: function(str) {
        return !str || $.trim(str) == "";
    },

    isNotEmpty: function(str) {
        return !StringUtils.isEmpty(str);
    },

    isUrl: function(str) {
        if (!str) {
            return false;
        }
        var urlValidater = StringUtils["urlValidater"];
        if (!urlValidater) {
            //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
            //下面的代码中应用了转义字符"\"输出一个字符"/"
            urlValidater = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
            StringUtils["urlValidater"] = urlValidater;
        }
        return urlValidater.test(str);
    }
};



/**
 * 排序方式
 */
var SortMethod = {
    NORMAL: "NORMAL",
    ASC: "ASC",
    DESC: "DESC"
}


/** @class 时间筛选过滤类型 */
var DataType = {
    STRING: "STRING",
    DATE: "DATE",
    INTEGER: "INTEGER",
    DOUBLE: "DOUBLE"
}


module.exports = IndexArea;