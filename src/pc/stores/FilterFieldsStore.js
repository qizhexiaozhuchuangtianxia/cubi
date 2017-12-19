var App = require('app');
var MetaDataStore = require('./MetaDataStore');
var ReportStore = require('./ReportStore');
var DrillDownTransformDate=require('../views/common/DrillDownTransformDate');
var ReportDateRange=require('../views/common/ReportDateRange');
var { WEB_API } = require('../../constants/api');
module.exports = {
    events: {},
    setFilterFieldsState: function(filterData, filterFields) {
        var data = [];
        for (var i = 0; i < filterData.length; i++) {
            for (var j = 0; j < filterFields.length; j++) {
                if (filterData[i].fieldName == filterFields[j].dbField || filterData[i].fieldName == filterFields[j].name) {
                    filterData[i].nameInfoOpen = true;
                    filterData[i].valueType = filterFields[j].valueType;
                    if (filterData[i].dataType == 'DATE') {
                        if (filterFields[j].valueType == 'DATE_RANGE') {
                            filterData[i].valueType = 'CUSTOM';
                        }
                        filterData[i].popData = filterFields[j].value;
                    } else {
                        if (filterFields[j].groupType == "GROUP_TITLE_FIELD") {
                            filterData[i].popData = filterFields[j].value;
                        } else {
                            filterData[i].popData = filterFields[j].items;
                        }
                    }
                }
            }
            var rows = {
                fieldName: filterData[i].fieldName,
                nameInfoOpen: filterData[i].nameInfoOpen,
                nameInfoType: filterData[i].nameInfoType,
                dataType: filterData[i].dataType,
                dateSize: filterData[i].dateSize,
                valueType: filterData[i].valueType,
                popData: filterData[i].popData,
                groupType: filterData[i].groupType,
                dimensionId: filterData[i].dimensionId,
                groupLevels: filterData[i].groupLevels,
                metadataId: filterData[i].metadataId,
            };
            if (i % 2 == 0) {
                data.push({
                    cells: [{rows: rows}]
                })
            } else {
                data[data.length - 1].cells.push({rows: rows})
            }
        }
        return data;
    },
    setFilterFields: function(filterData, filterFields) {
        var data = [];
        for (var i = 0; i < filterData.length; i++) {
            if (filterFields && filterFields.length > 0) {
                for (var j = 0; j < filterFields.length; j++) {
                    if (filterData[i].fieldName == filterFields[j].dbField || filterData[i].fieldName == filterFields[j].name) {
                        filterData[i].nameInfoOpen = true;
                        filterData[i].valueType = filterFields[j].valueType;
                        if (filterData[i].dataType == 'DATE') {
                            if (filterFields[j].valueType == 'DATE_RANGE') {
                                filterData[i].valueType = 'CUSTOM';
                            }
                            filterData[i].popData = filterFields[j].value;
                        } else {
                            if (filterFields[j].groupType == "GROUP_TITLE_FIELD") {
                                filterData[i].popData = filterFields[j].value;
                            } else {
                                for (var h = 0; h < filterFields[j].items.length; h++) {
                                    filterData[i].popData.push({
                                        id: filterFields[j].items[h].value,
                                        name: filterFields[j].items[h].name,
                                        checboxBool: true
                                    })
                                }
                            }
                        }
                    }
                }
                var rows = {
                    fieldName: filterData[i].fieldName,
                    name: filterData[i].name,
                    nameInfoOpen: filterData[i].nameInfoOpen,
                    nameInfoType: filterData[i].nameInfoType,
                    dataType: filterData[i].dataType,
                    dateSize: filterData[i].dateSize,
                    valueType: filterData[i].valueType,
                    popData: filterData[i].popData,
                    dimensionId: filterData[i].dimensionId,
                    groupLevels: filterData[i].groupLevels,
                    type: filterData[i].type,
                    groupType: filterData[i].groupType,
                    metadataId: filterData[i].metadataId,
                };
                data.push(rows);
            } else {
                data = filterData;
            }
        }
        return data;
    },
    setFilterDataState: function(fields) {
        var filterData = [];
        for (var i = 0; i < fields.length; i++) {
            for (var j = 0; j < fields[i].cells.length; j++) {
                filterData.push(fields[i].cells[j].rows);
            }
        }
        return filterData;
    },
    getNameInfoDesc: function(fileterField) {
        var popData = fileterField.popData;
        var nameInfoDesc = [];
        for (var i = 0; i < popData.length; i++) {
            nameInfoDesc.push(popData[i].name);
        }
        return nameInfoDesc;
    },
    getFieldData: function(fieldData, selectedData) {
        for (var i = 0; i < fieldData.length; i++) {
            fieldData[i].checboxBool = false;
            for (var j = 0; j < selectedData.length; j++) {
                if (fieldData[i].id == selectedData[j].id) {
                    fieldData[i].checboxBool = true;
                }
            }
        }
        return fieldData;
    },
    /**
     * 获取驾驶舱筛选内容，可以通过filter参数进行过滤
     * filters格式： （此信息可从AreaInfo中获取）
            {
                "valueType": "STRING",
                "name": "品牌",
                "pattern": "",
                "dbField": "brand",       ← ※ 必要信息
                "value": ["B001","B002"], ← ※ 必要信息
                "items": [
                    { "name": "巴士小熊系列","value": "B001"},
                    {"name": "金龟子系列","value": "B002"}
                ],
                "selected": true
            }
     */
    getPageFieldDataWithFilter: function(metadataId, param, filters, other) {
        let _this = this;
        var data = {
            "fieldName": param.fieldName,
            "areaParameters": {
                "pageParameter": {
                    "pageRowCount": 50,
                    "currentPageNo": param.currentPageNo
                },
                "filterFields": filters,
                "sortParameters": []
            }
        };
        if ((param.value) && ("" != param.value)) {
            data["filterParameters"] = [];
            data["filterParameters"].push({ // 筛选条件（可选）
                "field": param.fieldName, // 筛选字段
                "value": param.value // 筛选值
            });
        }
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getPageFieldDataWithFilters',
                httpUrl: `${ WEB_API.GET_PAGE_FIELD_DATA_WIDTH_FILTERS_URL }/${ metadataId }`,
                type: "POST",
                contentType: 'application/json',
                data: data,
                param: '&id=' + metadataId,
                callback: function(result) {
                    if (result.success) {
                        var data = _this.getFieldData(result.dataObject.dataArray, param.selectedData);
                        var jsonData = {
                            data: data,
                            totalRows: result.dataObject.totalRows
                        }
                        if (other) {
                            resolve(jsonData);
                        } else {
                            resolve(jsonData.data);
                        }
                    } else {
                        reject(result);
                    }
                }
            });
        });
    },
    getPageFieldData: function(id, param) {
        var _this = this;
        var data = {
            "fieldName": param.fieldName, // 筛选字段（必选）
            "sortParameters": { // 排序属性（可选）
                "field": param.fieldName, // 排序字段
                "method": "ASC"
            },
            "filterParameters": [{ // 筛选条件（可选）
                "field": param.fieldName, // 筛选字段
                "value": param.value // 筛选值
            }],
            "pageParameter": { // 可选
                "pageRowCount": param.pageRowCount ? param.pageRowCount : 50, //一页的数据行数
                "currentPageNo": param.currentPageNo ? param.currentPageNo : 1 //一页的数据行数
            }
        };
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getPageFieldData',
                httpUrl: `${WEB_API.GET_PAGE_FIELD_DATA_URL}/${ id }`, 
                type: "POST",
                contentType: 'application/json',
                data: data,
                param: '&id=' + id,
                callback: function(result) {
                    if (result.success) {
                        var data = _this.getFieldData(result.dataObject.dataArray, param.selectedData);
                        var jsonData = {
                            data: data,
                            totalRows: result.dataObject.totalRows
                        }
                        resolve(jsonData);
                    } else {
                        reject(result);
                    }
                }
            })
        })
    },
    getSelectedData: function(field) {
        var selectedData = [];
        var popData = field.popData;
        if (field.groupType == "GROUP_TITLE_FIELD") {
            selectedData = popData;
        } else {
            for (var i = 0; i < popData.length; i++) {
                if (field.dataType == 'DATE') {
                    selectedData.push(popData[i])
                } else {
                    selectedData.push({
                        name: popData[i].name,
                        id: popData[i].id || popData[i].value,
                        checboxBool: true,
                    })
                }
            }
        }
        return selectedData;
    },
    getDashboardFilterValue: function(reportId, param) { //驾驶舱通过 报表id获取数据立方id然后通过数据立方id获取筛选值方法.
        let _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getAreaInfo',
                httpUrl: WEB_API.DASHBOARD_GET_AREA_URL.replace(":id", reportId),
                type: "GET",
                contentType: 'application/json',
                param: '&id=' + reportId,
                callback: function(result) {
                    if (result.success) {
                        _this.getPageFieldData(result.dataObject.metadataId, param).then(function(filterValue) {
                            resolve(filterValue.data);
                        })
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    getDashboardDefaultFilter: function(reportId, filterFileds) {
        let _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getAreaInfo',
                httpUrl: WEB_API.DASHBOARD_GET_AREA_URL.replace(":id", reportId),
                type: "GET",
                contentType: 'application/json',
                param: '&id=' + reportId,
                callback: function(result) {
                    if (result.success) {
                        var metadataId = result.dataObject.metadataId;
                        MetaDataStore.getMetaData(metadataId).then(function(data) {
                            //添加 metadataId
                            for (var i = 0; i < data.filterData.length; i++) {
                                data.filterData[i].metadataId = metadataId;
                            }
                            let result = _this.setFilterFields(data.filterData, filterFileds);
                            resolve(result);
                        })
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    setSelectedFilterFields: function(filterFields) { //驾驶舱初始化筛选维度
        var data = [];
        var filterFields = filterFields || [];
        for (var j = 0; j < filterFields.length; j++) {
            filterFields[j].nameInfoOpen = true;
            var popData = [];
            if (filterFields[j].groupType == "GROUP_TITLE_FIELD") {
                popData = filterFields[j].value;
            } else {
                if (filterFields[j].dataType == 'DATE' || filterFields[j].valueType == 'DATE_RANGE' || filterFields[j].valueType == 'DATE_CYCLE') {
                    if (filterFields[j].valueType == 'DATE_RANGE') {
                        filterFields[j].valueType = 'CUSTOM';
                    }
                    popData = filterFields[j].value;
                } else {
                    for (var h = 0; h < filterFields[j].items.length; h++) {
                        popData.push({
                            id: filterFields[j].items[h].value,
                            name: filterFields[j].items[h].name,
                            checboxBool: true
                        })
                    }
                }
            }
            var rows = {
                // fix bug by lbx
                // avoid filterFields[j].dbField is "", set fieldName is filterFields[j].name, start 20161017
                // fieldName: filterFields[j].dbField || filterFields[j].name,
                fieldName: filterFields[j].dbField || filterFields[j].name,
                // end 20161017
                name: filterFields[j].name,
                nameInfoOpen: true,
                nameInfoType: filterFields[j].name,
                dataType: filterFields[j].dataType || (filterFields[j].valueType != 'STRING' ? "DATE" : filterFields[j].valueType),
                dateSize: filterFields[j].dateSize,
                valueType: filterFields[j].valueType,
                popData: popData,
                type: filterFields[j].type, 
                groupType: filterFields[j].groupType,
                dimensionId: filterFields[j].dimensionId,
                groupLevels: filterFields[j].groupLevels,
                metadataId: filterFields[j].metadataId,
            };
            data.push(rows);
        }
        return data;
    },
    filterFiledsAndDefaultFilterFileds: function(filterFields, defaultFilterFields) {
        var filterArr = [];
        var filterFieldsArr = filterFields;
        var defaultFilterFieldsArr = defaultFilterFields;
        for (var i = 0; i < filterFieldsArr.length; i++) {
            // fix bug by lbx
            // for default filter fields length bigger than 2, start
            var flag = true;
            // for default filter fields length bigger than 2, end
            for (var j = 0; j < defaultFilterFieldsArr.length; j++) {
                if (filterFieldsArr[i].fieldName == defaultFilterFieldsArr[j].fieldName) {
                    filterArr.push(filterFieldsArr[i]);
                    defaultFilterFieldsArr.splice(j, 1);
                    flag = false;
                }
            }
            if (flag) {
                filterArr.push(filterFieldsArr[i]);
            }
        }
        let filterNewArr = filterArr.concat(defaultFilterFieldsArr);
        let filterFieldsData = ReportStore.setFilterFieldsPopData(filterNewArr);
        return filterFieldsData;
    },
    setOldFitlerFieldsAndNowFilterFields: function(filterFields, oldFields) {
        for (var i = 0; i < filterFields.length; i++) {
            for (var j = 0; j < oldFields.length; j++) {
                if (oldFields[j].fieldName == filterFields[i].fieldName) {
                    filterFields[i].popData = oldFields[j].popData;
                    filterFields[i].valueType = oldFields[j].valueType;
                }
            }
        }
        return filterFields;
    },
    getTreeFilterFiledsHandle: function(filedsId, selectedDataTree) { //获取树形维度值的方法
        var _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dimension/runtime/getDimensionData',
                httpUrl:`${WEB_API.GET_DIMENSION_DATA_URL}/${filedsId}`,
                type: 'GET',
                contentType: 'application/json',
                param: '&id=' + filedsId,
                callback: function(result) {
                    if (result.success) {
                        // _this.setBreadFilter(result.dataObject)
                        _this.modifyDimensionDataHandle(result.dataObject).then(function(listData) {
                            //start 拉平的数据和已选的数据做一个匹配 返回匹配完的数据
                            _this.matchDataHandle(listData, selectedDataTree).then(function(resultData) {
                                resolve(resultData);
                            });
                            //end 拉平的数据和已选的数据做一个匹配 返回匹配完的数据
                        })
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    getTreeNameInfoDesc: function(selectedDataTree) { //拉平的数据和已选的数据做一个匹配 返回匹配完的数据
        var nameInfo = [];
        setListData(selectedDataTree);
        function setListData(data) {
            for (var j = 0; j < data.length; j++) {
                nameInfo.push(data[j].name);
                if (data[j].children && data[j].children.length > 0) {
                    setListData(data[j].children);
                }
            }
        }
        return nameInfo;
    },
    matchDataHandle: function(listData, selectedDataTree) { //拉平的数据和已选的数据做一个匹配 返回匹配完的数据
        return new Promise((resolve, reject) => {
            setListData(selectedDataTree);
            function setListData(data) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].levelLen != 0 && !data[j].levelLen) {
                        continue
                    }
                    for (var i = 0; i < listData['level_' + data[j].levelLen].length; i++) {
                        if (listData['level_' + data[j].levelLen][i].id == data[j].id) {
                            listData['level_' + data[j].levelLen][i].checboxBool = true;
                        }
                    }
                    if (data[j].children && data[j].children.length > 0) {
                        setListData(data[j].children);
                    }
                }
            }
            resolve(listData);
        })
    },
    modifyDimensionDataHandle: function(dataArr) { //获取树形值之后 转化成具有层级的数据
        return new Promise((resolve, reject) => {
            var listObj = {};
            var levelLen = 0;
            if (!dataArr) {
                return
            }
            setDimensionData(dataArr, 0);
            function setDimensionData(data, pid) {
                for (var j = 0; j < data.length; j++) {
                    if (!listObj['level_' + levelLen]) {
                        listObj['level_' + levelLen] = [];
                    }
                    var checboxBool = false;
                    if (data[j].checboxBool) {
                        checboxBool = true;
                    }
                    listObj['level_' + levelLen].push({
                        id: data[j].id,
                        name: data[j].name,
                        checboxBool: checboxBool,
                        pid: pid,
                        levelLen: levelLen,
                        child: (data[j].children && data[j].children.length > 0)
                    });
                    if (data[j].children && data[j].children.length > 0) {
                        levelLen++;
                        setDimensionData(data[j].children, data[j].id);
                    }
                    if (j == data.length - 1) {
                        levelLen--;
                    }
                }
            }
            resolve(listObj);
        })
    },
    getTreeFieldData: function(fieldDataTree, selectedDataTree) { //通过已选的树形维度数据 返回需要显示的树形维度数据
        for (var i = 0; i < fieldDataTree.length; i++) {
            fieldDataTree[i].checboxBool = false;
            for (var j = 0; j < selectedDataTree.length; j++) {
                if (fieldDataTree[i].id == selectedDataTree[j].id) {
                    fieldDataTree[i].checboxBool = true;
                }
            }
        }
        return fieldDataTree;
    },
    setTreeSeletedHandle(allData, obj) {
        if (typeof obj.item.id == 'object') { //设置全选
            var jsonHash = {};
            if (!obj.item.checboxBool) {
                for (var i = 1; i < obj.listData.length; i++) {
                    if (!jsonHash['p_' + obj.listData[i].pid]) {
                        obj.listData[i].checboxBool = false;
                        setCurrentCheckBool(obj.listData[i]);
                        jsonHash['p_' + obj.listData[i].pid] = true;
                    } else {
                        obj.listData[i].checboxBool = true;
                    }
                }
            } else {
                for (var i = 0; i < obj.listData.length; i++) {
                    obj.listData[i].checboxBool = true;
                    setCurrentCheckBool(obj.listData[i]);
                }
            }
        } else {
            setCurrentCheckBool(obj.item); //设置单个选择
        }
        function setCurrentCheckBool(item) { //设置当前的是否选中
            var data = allData['level_' + item.levelLen];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == item.id) {
                    data[i].checboxBool = !data[i].checboxBool;
                    if (data[i].checboxBool) {
                        setParentCheckBool(item.levelLen - 1, item.pid); //当前勾选中执行的方法
                    } else {
                        setChildCheckBool(item.levelLen + 1, item.id); //当前取消勾选执行的方法
                    }
                    break;
                }
            }
        }
        function setParentCheckBool(levelLen, pid) { //当前勾选中执行的方法
            var dataArr = [];
            dataArr = allData['level_' + levelLen];
            if (!dataArr) return;
            for (var j = 0; j < dataArr.length; j++) {
                if (dataArr[j].id == pid) {
                    dataArr[j].checboxBool = true;
                    setParentCheckBool(dataArr[j].levelLen - 1, dataArr[j].pid);
                }
            }
        }
        function setChildCheckBool(levelLen, id) { //当前取消勾选执行的方法
            var dataArr = [];
            dataArr = allData['level_' + levelLen];
            if (!dataArr) return;
            for (var j = 0; j < dataArr.length; j++) {
                if (dataArr[j].pid == id) {
                    dataArr[j].checboxBool = false;
                    setChildCheckBool(dataArr[j].levelLen + 1, dataArr[j].id);
                }
            }
        }
        return allData;
    },
    setTreeFilterFields: function(data) {
        var treeData = [];
        for (var key in data) {
            if (key == 'level_0') {
                for (var i = 0; i < data[key].length; i++) {
                    data[key][i].children = [];
                    if (data[key][i].checboxBool && data[key][i].id != "selectAll")
                        treeData.push(data[key][i]);
                }
            } else {
                for (var i = 0; i < data[key].length; i++) {
                    setDimensionData(treeData, data[key][i]);
                }
            }
        }
        function setDimensionData(treeData, obj) {
            for (var j = 0; j < treeData.length; j++) {
                if (obj.pid == treeData[j].id) {
                    if (obj.checboxBool && obj.id != "selectAll") {
                        obj.children = [];
                        treeData[j].children.push(obj);
                    }
                }
                if (treeData[j].children) {
                    setDimensionData(treeData[j].children, obj);
                }
            }
        }
        return treeData;
    },
    getListData: function(allData, levelId, keyWord, pid, currentPageNo, pageSize, type) {
        var datas = allData['level_' + levelId];
        var data = datas;
        var reg = new RegExp(keyWord, "gim");
        var pushArr = [];
        if (keyWord != "") {
            for (var i = 0; i < datas.length; i++) {
                if (reg.test(datas[i].name)) {
                    pushArr.push(datas[i]);
                }
            }
            data = pushArr;
        }
        if (!type) {
            return data;
        } else {
            return this.getTreeList(data || [], pid, allData, levelId, currentPageNo, pageSize, type);
        }
    },
    getDashboardListData: function(allData, levelId, keyWord) {
        var datas = allData['level_' + levelId] || [];
        var data = datas;
        var reg = new RegExp(keyWord, "gim");
        var pushArr = [];
        if (keyWord != "") {
            for (var i = 0; i < datas.length; i++) {
                if (reg.test(datas[i].name)) {
                    pushArr.push(datas[i]);
                }
            }
            data = pushArr;
        }
        return data;
    },
    getTreeList: function(data, pid, allData, levelId, currentPageNo, pageSize, type) {
        var listData = [];
        var listIds = [];
        var dataLength = data.length;
        if (dataLength > 0) {
            var selectAll = true;
            var child = allData['level_' + (levelId + 1)] ? true : false;
            var selectAllObject = [{id: 'selectAll',name: "全选",checboxBool: false,pid: pid,levelLen: data[0].levelLen,child: child}]
            if (typeof pid == 'object') {
                for (var x = 0; x < pid.length; x++) {
                    for (var i = 0; i < dataLength; i++) {
                        if (data[i].pid == pid[x]) {
                            if (data[i].checboxBool == false) {
                                selectAll = false;
                            }
                            if (data[i].child && !getChieldAllChecked(data[i].levelLen, data[i].id)) {
                                data[i].checboxBool = 2;
                            }
                            listData.push(data[i]);
                            listIds.push(data[i].id);
                        }
                    }
                }
            } else {
                for (var i = 0; i < dataLength; i++) {
                    if (data[i].pid == pid) {
                        if (data[i].checboxBool == false) {
                            selectAll = false;
                        }
                        if (data[i].checboxBool && !getChieldAllChecked(data[i].levelLen, data[i].id)) {
                            data[i].checboxBool = 2;
                        }

                        listData.push(data[i]);
                        listIds.push(data[i].id);
                    }
                }
            }
            selectAllObject[0].checboxBool = selectAll;
            selectAllObject[0].id = listIds;
            listData = selectAllObject.concat(listData);
        }
        if (!type) {
            return listData;
        } else {
            return {
                listData: listData,
                totalPage: data.length
            }
        }
        function getChieldAllChecked(levelId, id) {
            var allCheck = true;
            var checked = false;
            var data = allData['level_' + (levelId + 1)];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == id) {
                        if (!data[i].checboxBool) {
                            allCheck = false;
                        } else {
                            checked = true;
                        }
                    }
                }
            }
            if (checked) {
                return allCheck;
            } else {
                return true;
            }
        }
    },
    getTreeFilterData: function(dimensionId, metadataId, data, selectedDataTree) { //驾驶舱点击树形筛选获取筛选值的方法
        var _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getFilterTreeDimensionData',
                httpUrl: `${WEB_API.GET_FILTER_TREE_DIMENSION_DATA_URL}/${ metadataId }/${ dimensionId }`, 
                type: 'POST',
                contentType: 'application/json',
                param: '&dimensionId=' + dimensionId + '&metadataId=' + metadataId,
                data: data,
                callback: function(result) {
                    if (result.success) {
                        _this.modifyDimensionDataHandle(result.dataObject).then(function(listData) {
                            //start 拉平的数据和已选的数据做一个匹配 返回匹配完的数据
                            _this.matchDataHandle(listData, selectedDataTree).then(function(resultData) {
                                resolve(resultData);
                            });
                            //end 拉平的数据和已选的数据做一个匹配 返回匹配完的数据
                        })
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    //全局筛选 匹配立方id 维度id,设置弹框选中状态
    matchIdSetSlectedData: function(seletedArr, gSign, globalFilterFields, dimensionId, metadataId, data) {//全局筛选
        if (gSign) {
            var filterFields = [];
            var newFilterFields = [];
            if (globalFilterFields) {
                filterFields = globalFilterFields.filterFields
            }
            for (var i = 0; i < filterFields.length; i++) {
                //树形维度 匹配维度id
                if (filterFields[i].groupType == "GROUP_TITLE_FIELD" && filterFields[i].dimensionId == dimensionId) {
                    var val = seletedArr; //filterFields[i].seletedArr;
                    this.modifyDimensionDataHandle(val).then(function(listData) {

                        for (var obj in listData) {
                            for (var h = 0; h < listData[obj].length; h++) {
                                var gName = listData[obj][h].name;
                                for (var z = 0; z < data[obj].length; z++) {
                                    if (gName == data[obj][z].name) {
                                        data[obj][z].checboxBool = listData[obj][h].checboxBool;
                                        //data[obj][z].child=listData[obj][h].child;
                                    }
                                }
                            }
                        }
                    });
                } else { //普通维度
                }
            }
        }
        return data;
    },
    //判断表格是否可以钻取
    drillDownAuth: function(item, weiduList, drilDownFilter, type, isDashboard) {
        return this.reportTableDrillDown(item, weiduList, drilDownFilter, type);
    },
    reportTableDrillDown:function(item, weiduList, drilDownFilter, type){
        var wei = weiduList;
        if (!wei) {
            return false;
        }
        if (type != "TREE" && type != "CATEGORY") {
            return false;
        }
        for (var i = 0; i < wei.length; i++) {
            if (wei[i].groupType == "GROUP_TITLE_FIELD" && i == item.columnNo) {
                for (var h = 0; h < drilDownFilter.length; h++) {
                    if (drilDownFilter[h].dimensionId == wei[i].dimensionId) {
                        var levelLen = drilDownFilter[h].groupLevels.indexOf(drilDownFilter[h].level);//drilDownFilter[h].drillLevel//
                        if (levelLen >= drilDownFilter[h].groupLevels.length-1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                return true;
            }else if(wei[i].groupType == "GROUP_DATE_TITLE_FIELD" && i == item.columnNo){
                for (var h = 0; h < drilDownFilter.length; h++) {
                    if (drilDownFilter[h].dimensionId == wei[i].name) {
                        var levelLen = drilDownFilter[h].groupLevels.indexOf(drilDownFilter[h].level);
                        if (levelLen >= drilDownFilter[h].groupLevels.length-1 || drilDownFilter[h].drillLevel==drilDownFilter[h].groupLevels.length-1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                return true;
            }
        }
        return false;
    },
    dashboardTableDrillDown:function(item, weiduList, drilDownFilter, type){
        //console.log(item, weiduList, drilDownFilter, type);
        if (type != "TREE" && type != "CATEGORY") {
            return false;
        }
        return false;
    },
    //图形是否可以钻取
    drillDownAuthChart: function(curwei, drilDownFilter) {
        for (var i = 0; i < drilDownFilter.length; i++) {
            var dimensionId=curwei.dimensionId;
            //修改判断错误 导致日期钻取卡死
            if(curwei.groupType === "GROUP_DATE_TITLE_FIELD" && curwei.name === drilDownFilter[i].dimensionId ){
                var levelLen = drilDownFilter[i].groupLevels.indexOf(drilDownFilter[i].level);
                if (levelLen >= drilDownFilter[i].groupLevels.length-1) {
                    return true;
                }
            }else{
                if (dimensionId == drilDownFilter[i].dimensionId) {
                    if (drilDownFilter[i].drillLevel >= curwei.groupLevels.length-1) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    getValue:function(item,chart,index){
        var value = item.name||item.value;
        if (chart) {
            if(!item.onewei && index ===1){
                value = item.seriesName;
            }
        };
        return value;
    },
    //点击表格td 匹配对应的levelItem
    drillDownMatchLevel: function(allData, tdItem, chart, index) {
        if (!tdItem) {
            return {
                item: {
                    id: 0,
                    levelLen: -1,
                },
                level: -1,
            };
        }
        var curItem = [];
        var value=this.getValue(tdItem, chart, index);
        for (var o in allData) {
            var data = allData[o];
            for (var j = 0; j < data.length; j++) {
                if (data[j].name == value) {
                    curItem = data[j];
                    break;
                }
            }
        }
        curItem.children = [];
        var obj = {
            item: curItem,
            level: curItem.levelLen,
        }
        return obj;
    },
    //钻取后合并新的filter
    concatFilter: function(drilDownFilter, newDrilDownFilter) {
        var sign = true;
        for (var i = 0; i < drilDownFilter.length; i++) {
            for(var j=0; j<newDrilDownFilter.length;j++){
                if (drilDownFilter[i].dimensionId == newDrilDownFilter[j].dimensionId) {
                    drilDownFilter[i] = newDrilDownFilter[j];
                    sign=false;
                }
            }
        }
        if (sign) {// == drilDownFilter.length
            drilDownFilter=drilDownFilter.concat(newDrilDownFilter);
        }
        return drilDownFilter;
    },
    drillDownFilterInFilter: function(drilDownFilter, filterData) {
        for (var i = 0; i < filterData.length; i++) {
            var filter = filterData[i];
            for (var j = 0; j < drilDownFilter.length; j++) {
                if (drilDownFilter[j].drillDown && filter.groupType == "GROUP_TITLE_FIELD" && filter.dimensionId == drilDownFilter[j].dimensionId) {
                    var driFilter = drilDownFilter[j].drillFilter;
                    filter.popData = driFilter || [];
                }
            }
        }
        return filterData;
    },
    //替换筛选器的selectedData
    drillReplaceFilter: function(first, selectedData, drilDownFilter, item) {
        var levelId = 0,
            pid = 0,
            click = false,
            goBackShow = false,
            goBackData = {},
            selectedData = selectedData || [];
        if (this[item.dimensionId] && selectedData.length>0) { //clickNextObj
            if (this[item.dimensionId].clickNext) {
                levelId = this[item.dimensionId].level;
                pid = this[item.dimensionId].pid;
                click = true;
            }
            if (this[item.dimensionId].goBackShow) {
                goBackShow = true;
                pid = this[item.dimensionId].pid;
                levelId = this[item.dimensionId].level;
                goBackData = this[item.dimensionId].goBackData;
            }

        }
        if (item.groupType == "GROUP_TITLE_FIELD" && selectedData.length > 0) {
            for (var i = 0; i < drilDownFilter.length; i++) {
                if (first&& drilDownFilter[i].dimensionId == item.dimensionId && !drilDownFilter[i].drillDown) {
                    return {
                        selectedData: selectedData,
                        levelId: 0,
                        pid: 0,
                        goBackShow: false,
                        goBackData: {}
                    };
                }
                if (drilDownFilter[i].dimensionId == item.dimensionId && drilDownFilter[i].drillDown) {
                    var level = drilDownFilter[i].levelItem.levelLen + 1,
                        p = drilDownFilter[i].levelItem.id,
                        drillLevel=drilDownFilter[i].drillLevel;
                    goBackData = drilDownFilter[i].goBackData;
                    if(drillLevel==level-1){
                        // level-=1;
                        // p=drilDownFilter[i].levelItem.pid
                    }
                    if (item.groupLevels.length == level) {
                        level = level - 1,
                       p = drilDownFilter[i].goBackData['level_' + level];
                    }
                    if (click) {
                        level = levelId;
                        p = pid;
                        this[item.dimensionId].clickNext = false;
                    }
                    return {
                        selectedData: selectedData,
                        levelId: level,
                        pid: p,
                        goBackShow: true,
                        goBackData: drilDownFilter[i].goBackData
                    }
                }
            }
        }
        return {
            selectedData: selectedData,
            levelId: levelId,
            pid: pid,
            goBackShow: goBackShow,
            goBackData: goBackData
        };
    },
    //更新分析拖拽按钮
    updateWeidu: function(level, weidu, dimensionId, groupLevels, init) {
        var weidu=JSON.parse(JSON.stringify(weidu));
        for (var i = 0; i < weidu.length; i++) {
            if (weidu[i].dimensionId == dimensionId || weidu[i].name == dimensionId) {
                var index = groupLevels.indexOf(level);
                var levelIndex = index;
                if (!init) {
                    levelIndex += 1;
                }
                if (levelIndex == groupLevels.length) {
                    levelIndex = index;
                }
                weidu[i].level = groupLevels[levelIndex];
                weidu[i].drillLevel =levelIndex;
                return weidu;
            }
        }
        return weidu;
    },
    treeToOneDimen: function(treeData) {
        var levelObj = {};
        for (var i = 0; i < treeData.length; i++) {
            tree(treeData[i])
        }

        function tree(child) {
            if (!levelObj['level_' + child.levelLen]) {
                levelObj['level_' + child.levelLen] = [];
            }
            levelObj['level_' + child.levelLen].push(child);
            if (child.children && child.children.length > 0) {
                for (var i = 0; i < child.children.length; i++) {
                    tree(child.children[i]);
                }
            }
        }
        return levelObj;
    },
    //设置面包屑数据格式和筛选器返回数据格式
    setBackAndBreadData: function(treeData, weiduList, dimensionId, drilDownFilter) { ///, chart, clickFilter,allSelected
        var weidu = [];
        var goBackData = {};
        var breadData = [];
        var levelObj = this.treeToOneDimen(treeData);
        for (var i = 0; i < weiduList.length; i++) {
            if (weiduList[i].dimensionId == dimensionId) {
                weidu = weiduList[i];
                break;
            }
        }
        var levelLen = weidu.groupLevels.indexOf(weidu.level);
        var groupLevels = weidu.groupLevels;
        breadData.push(weidu.name);
        var olen=this.setObjLen(levelObj);
        var osing=0;
        for (var o in levelObj) {
            var cur = levelObj[o];
            var cName = '';
            osing++;
            goBackData['level_' + cur[0].levelLen] = cur[0].pid;
            if(osing==olen){
                goBackData['level_' + (cur[0].levelLen+1)] = cur[0].id;
            }
            cName += cur[0].name;
            if (cName != '') {
                breadData.push(cName);
            }
        }
        var levelObjLen = this.setObjLen(levelObj);
        if (levelObjLen <= levelLen) {
            breadData.push('全部' + groupLevels[levelLen])
        }
        return {
            goBackData: goBackData,
            breadData: breadData,
        };

    },
    initFilterDisable:function(drilDownFilter,pid,dimensionId){
        if(!drilDownFilter){return null;}
        for (var i = 0; i < drilDownFilter.length; i++) {
            if (drilDownFilter[i].dimensionId == dimensionId) {
                if (drilDownFilter[i].levelItemArr.length>0) {
                    var drillLevel=drilDownFilter[i].drillLevel-1;
                    drillLevel = drillLevel>=0 ? drillLevel : 0;
                    var id=drilDownFilter[i].levelItemArr[drillLevel].id//drilDownFilter[i].levelItem.id;
                    if(pid==id){
                        return 1;
                    }
                    break;
                }
            }
        }
    },
    setDashboradFilterDisable: function(drilDownFilter, item, dimensionId,disableNum) {
        var drillLevel = -1;
        var id=0;
        if (!drilDownFilter) {
            return -1;
        }
        if(disableNum>0){
            return disableNum++;
        }
        for (var i = 0; i < drilDownFilter.length; i++) {
            if (drilDownFilter[i].drillLevel>-1 && drilDownFilter[i].dimensionId == dimensionId) {
                drillLevel=drilDownFilter[i].drillLevel-1;
                drillLevel = drillLevel>=0 ? drillLevel : 0;
                id=drilDownFilter[i].levelItemArr[drillLevel].id
                //var items=drilDownFilter[i].levelItem;
                //驾驶舱筛选 超出分析筛选时
                if(drilDownFilter[i].levelItem2){
                    drillLevel=drilDownFilter[i].levelItem2.levelLen;
                    id=drilDownFilter[i].levelItem2.id;
                }
                break;

            }
        }
        if(item.id==id){
            return 1;
        }
        if (drillLevel == -1) {
            return -1;
        }
        if (item.levelLen < drillLevel) {
            return 0;
        }
        return 0;
    },
    //设置筛选器列表可读状态
    setFilterDisable: function(drilDownFilter, item, dimensionId,disableNum) {
        var drillLevel = -1;
        var id=0;
        if (!drilDownFilter) {
            return -1;
        }
        if(disableNum>0){
            return disableNum++;
        }
        for (var i = 0; i < drilDownFilter.length; i++) {
            if (drilDownFilter[i].dimensionId == dimensionId) {
                var items=drilDownFilter[i].levelItem;
                if(drilDownFilter[i].levelItem2){
                    items=drilDownFilter[i].levelItem2
                }
                if (items) {
                    drillLevel = items.levelLen;
                    id=items.id;
                    break;
                }
            }
        }
        if(item.id==id){
            return 1;
        }
        if (drillLevel == -1) {
            return -1;
        }
        if (item.levelLen < drillLevel) {
            return 0;
        }
        return 0;
    },
    getTreeLastLevel: function(treeData, levelLen) {
        var last = {};
        var treeData = JSON.parse(JSON.stringify(treeData));
        for (var i = 0; i < treeData.length; i++) {
            tree(treeData[i])
        }
        function tree(child) {
            if (child.children.length > 0) {
                if (child.levelLen >= levelLen) {
                    child.children = [];
                }
                for (var i = 0; i < child.children.length; i++) {
                    tree(child.children[i]);
                }
            }
        }
        return treeData;
    },
    delDrilDownFilter: function(weiduList, drilDownFilter) {
        var newDrilDownFilter = [];
        for (var i = 0; i < weiduList.length; i++) {
            for (var j = 0; j < drilDownFilter.length; j++) {
                if (weiduList[i].dimensionId == drilDownFilter[j].dimensionId) {
                    //drilDownFilter.splice(i,1);
                    newDrilDownFilter.push(drilDownFilter[j])
                }
            }
        }
        return newDrilDownFilter;
    },
    delfilterFields: function(filterFields, weiduList) {
        var newFilter = [];
        for (var i = 0; i < weiduList.length; i++) {
            for (var j = 0; j < filterFields.length; j++) {
                if (weiduList[i].name == filterFields[j].name) {
                    newFilter.push(filterFields[j]);
                }
            }
        }
        return newFilter;
    },
    updateFilterRow: function(filterFields, filterWeiDuData) {
        var newrWeiDuData = [];
        for (var i = 0; i < filterFields.length; i++) {
            for (var j = 0; j < filterWeiDuData.length; j++) {
                if (filterFields[i].name != filterWeiDuData[j].name) {
                    filterWeiDuData[j].popData = [];
                }
            }
        }
    },
    initSetLevelItemArr: function(filterObj) {
        var itemArr = [];
        for (var o in filterObj) {
            var cur = filterObj[o];
            itemArr.push(cur[0]);
        }
        return itemArr;
    },
    //点击选中筛选是 更新levelItemArr
    setLevelItemArrFilter: function(filter) {
        var obj = this.treeToOneDimen(filter);
        var levelItemArr = [];
        for (var o in obj) {
            var cur = obj[o];
            for (var j = 0; j < cur.length; j++) {

            }
        }
    },
    changeWeiConcatDrilFilter: function(drilDownFilter, newDrilDownFilter, reportCategory) {
        var concatSign = true;
        if (!newDrilDownFilter) {
            return drilDownFilter;
        }
        if (drilDownFilter.length == 0 && (!newDrilDownFilter || newDrilDownFilter.length == 0)) {
            return [];
        }
        if (newDrilDownFilter.length == 0) {
            return drilDownFilter;
        }
        for (var i = 0; i < drilDownFilter.length; i++) {
            if (drilDownFilter[i].dimensionId == newDrilDownFilter[0].dimensionId) {
                drilDownFilter[i] = newDrilDownFilter[0];
                concatSign = false;
            }
        }
        if (concatSign) {
            drilDownFilter = drilDownFilter.concat(newDrilDownFilter[0]);
        }
        return drilDownFilter;
    },
    setSaveDrillLevel: function(rowTitleFields, drilDownFilter,drillDown) {
        var rowFields =  rowTitleFields;
        if(rowTitleFields.rowTitleFields){
           rowFields = rowTitleFields.rowTitleFields;
        }
        for (var i = 0; i < drilDownFilter.length; i++) {
            for (var j = 0; j < rowFields.length; j++) {
                if(drilDownFilter[i].type=='GROUP_DATE_TITLE_FIELD'){
                    if(drillDown){report.sortFields=[];}

                    if (drilDownFilter[i].dimensionId == rowFields[j].name && drilDownFilter[i].drillLevel > 0) {
                        rowFields[j].drillLevel = drilDownFilter[i].drillLevel;
                    }
                }else{

                    if (drilDownFilter[i].breadData[0] == rowFields[j].name && drilDownFilter[i].drillLevel > 0) {
                         if(drillDown){report.sortFields=[];}

                        rowFields[j].drillLevel = drilDownFilter[i].drillLevel;
                    }
                }
            }
        }
        return rowFields;
    },
    setSaveChartDrillLevel: function(modelCategoryFields, drilDownFilter,drillDown) {
        var categoryFields = modelCategoryFields.categoryFields;
        for (var i = 0; i < drilDownFilter.length; i++) {
            for (var j = 0; j < categoryFields.length; j++) {
                if(drilDownFilter[i].type=='GROUP_DATE_TITLE_FIELD'){
                    if(drillDown){modelCategoryFields.sortFields=[];}
                    if (drilDownFilter[i].dimensionId == categoryFields[j].name && drilDownFilter[i].drillLevel > 0) {
                        categoryFields[j].drillLevel = drilDownFilter[i].drillLevel;
                    }
                }else{
                    if(drillDown){modelCategoryFields.sortFields=[];}
                    if (drilDownFilter[i].breadData[0] == categoryFields[j].name && drilDownFilter[i].drillLevel > 0) {
                        categoryFields[j].drillLevel = drilDownFilter[i].drillLevel;
                    }
                }

            }
        }
        return categoryFields;
    },
    initItem: function(filterObj, drillLevel, dimensionId) {
        if (!drillLevel || drillLevel <= 0) {
            return false;
        }
        for (var o in filterObj) {
            if (filterObj[o][0].levelLen == drillLevel - 1) {
                return {
                    value: filterObj[o][0].name
                }
            }
        }
        return false;
    },
    setObjLen: function(obj) {
        var s = 0;
        for (var o in obj) {
            s++;
        }
        return s;
    },
    closeBeadData: function(drilDownFilter, dimensionId, nameInfoOpen) {
        var drilFilter = drilDownFilter;
        for (var i = 0; i < drilFilter.length; i++) {
            if (drilFilter[i].dimensionId == dimensionId || drilFilter[i].fieldName == dimensionId) {
                if (!nameInfoOpen) {
                    var bread = drilFilter[i].breadData.slice(0);
                    bread.splice(1);
                    bread.push('全部' + drilFilter[i].groupLevels[0]);
                    drilFilter[i].closeBeadData = bread;

                }
                if (nameInfoOpen) {
                    delete drilFilter[i].closeBeadData;
                }

                break;
            }
        }
        return drilFilter;
    },



    setFilterToLevel: function(treeData, groupLevels) {
        var levelObj = {};
        for (var i = 0; i < treeData.length; i++) {
            tree(treeData[i])
        }
        function tree(child) {
            if (!levelObj[child.pid + '_' + child.levelLen]) {
                levelObj[child.pid + '_' + child.levelLen] = [];
            }
            levelObj[child.pid + '_' + child.levelLen].push(child.name);
            if (child.children && child.children.length > 0) {
                for (var i = 0; i < child.children.length; i++) {
                    tree(child.children[i]);
                }
            }
        }
        return levelObj;
    },
    getTreeDimensionData: function(id, levels, drilDownFilter, weiduList, change) { //获取树形维度值的方法
        var _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dimension/runtime/getDimensionData',
                httpUrl:`${WEB_API.GET_DIMENSION_DATA_URL}/${id}`,
                type: 'GET',
                contentType: 'application/json',
                param: '&id=' + id,
                callback: function(result) {
                    if (result.success) {
                        _this.modifyDimensionDataHandle(result.dataObject).then(function(resultData) {
                            var contrastLevel = _this.contrastLevel(id, levels, resultData, drilDownFilter, weiduList, change);
                            resolve(contrastLevel);
                        })
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    setAllDataToLevel: function(weiduList, filterFields, drilDownFilter, change) {
        //拉平filterFields
        var levels = {};
        var promiseList = [];
        //判断是否有筛选条件  拉平filterFields
        var weidu = JSON.parse(JSON.stringify(weiduList));
        for (var i = 0; i < weidu.length; i++) {
            for (var j = 0; j < filterFields.length; j++) {
                if (filterFields[j].groupType == "GROUP_TITLE_FIELD") {
                    if (weidu[i].dimensionId == filterFields[j].dimensionId) {
                        weidu[i]['hasFilter'] = true;
                        if (!levels[filterFields[j].dimensionId]) {
                            levels[filterFields[j].dimensionId] = {};
                        }
                        levels[filterFields[j].dimensionId] = this.setFilterToLevel(filterFields[j].value, weidu[i].groupLevels);
                    }
                }
            }
        }
        for (var i = 0; i < weidu.length; i++) {
            if (weidu[i].groupType == "GROUP_TITLE_FIELD") {
                if (weidu[i].hasFilter) {
                    promiseList.push(this.getTreeDimensionData(weidu[i].dimensionId, levels, drilDownFilter, weiduList, change));
                } else {
                    promiseList.push(this.getNoFilterDrilDownParams(weidu[i]));
                }
            }else if(weidu[i].groupType == "GROUP_DATE_TITLE_FIELD"){
                promiseList.push(this.initDateFilterDrilDownParams(weidu[i],drilDownFilter));
            }
        }
        return new Promise((resolve, reject) => {
            Promise.all(promiseList).then(function(arr) {
                var concatArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i]&&arr[i][0]){
                        concatArr.push(arr[i][0])
                    }

                }
                resolve(concatArr);
            });
        });
    },
    getNoFilterDrilDownParams: function(weidu) {
        return new Promise((resolve, reject) => {
            var drilDownFilter = [];
            var drillLevel = -1;
            var initFilterItem = this.initFilterItem('', drillLevel);
            var itemArr = initFilterItem.itemArr;
            var breadData = [weidu.name];
            for (var i = 0; i < weidu.groupLevels.length; i++) {
                if(i<=weidu.groupLevels.indexOf(weidu.level)){
                    breadData.push('全部' + weidu.groupLevels[i]);
                }
            }
            var drilFilter = {
                dimensionId: weidu.dimensionId,
                drillFilter: [],
                groupLevels: weidu.groupLevels,
                level: weidu.level,
                levelItem: itemArr.length > 0 ? itemArr[itemArr.length - 1] : [],
                levelItemArr: itemArr,
                breadData: breadData,
                goBackData: initFilterItem.goBackData,
                drillDown: drillLevel >= 0 ? true : false,
                drillLevel: drillLevel,
                toolTipData: breadData,
                noFilter: true,
                disabledIndex:weidu.disabledIndex,
                fieldName: weidu.name,

            };
            drilDownFilter.push(drilFilter);
            resolve(drilDownFilter);
        });
    },
    contrastLevel: function(id, levels, allData, drilDownFilter, weiduList, change) {
        var allLevels = {};

        for (var data in allData) {
            for (var i = 0; i < allData[data].length; i++) {
                var level = levels[id];
                for (var lev in level) {
                    var levNum = lev.split('_')[0];
                    if (allData[data][i].pid == levNum) {
                        if (!allLevels[levNum + '_' + allData[data][i].levelLen]) {
                            allLevels[levNum + '_' + allData[data][i].levelLen] = [];
                        }
                        allLevels[levNum + '_' + allData[data][i].levelLen].push(allData[data][i].name)
                    }
                }
            }
        }
        var level = levels[id];
        for (var le in level) {
            if (level[le].length == allLevels[le].length) {
                var name = le;
                var newLe = level[le];
                level[name + '_' + 'all'] = newLe;
                delete level[le];
            }
        }
        var breadLevel = {}
        var levelArr = [];
        for (var l in level) {
            var levelNum = l.split('_');
            if (!levelArr[levelNum[1]]) {
                levelArr[levelNum[1]] = [];
            }
            var obj = {};
            obj[l] = level[l];
            levelArr[levelNum[1]].push(obj);
        }


        breadLevel[id] = levelArr;
        var drilDown = [];
        for (var i = 0; i < drilDownFilter.length; i++) {
            if (drilDownFilter[i].dimensionId == id) {
                drilDown = this.breadAndToolTipInDrilFilter(breadLevel, [drilDownFilter[i]], weiduList, change);
                break;
            }

        }
        var newDrilDown = this.setLevelLessGroupLevel(drilDown, weiduList);
        return drilDown;
    },
    initDrilDownParams: function(weiduList, filterFields, rowTitleFields, drilDownFilters, start) {
        var drilDownFilter = [];
        var weiduList=JSON.parse(JSON.stringify(weiduList));
        for (var i = 0; i < weiduList.length; i++) {
            if (weiduList[i].groupType == "GROUP_TITLE_FIELD") {
                var value = [];
                for (var j = 0; j < filterFields.length; j++) {
                    if (weiduList[i].dimensionId == filterFields[j].dimensionId) {
                        value = filterFields[j].value;
                        break;
                    }
                }
                var drillLevel = this.hasDrillLevel(weiduList[i].name, weiduList[i].dimensionId, rowTitleFields, drilDownFilter, start);
                var initFilterItem = this.initFilterItem(value, drillLevel);

                var itemArr = initFilterItem.itemArr;
                var drilFilter = {
                    dimensionId: weiduList[i].dimensionId,
                    drillFilter: value,
                    groupLevels: weiduList[i].groupLevels,
                    level: weiduList[i].level,
                    levelItem: itemArr.length > 0 ? itemArr[itemArr.length - 1] : [],
                    levelItemArr: itemArr,
                    breadData: [],
                    goBackData: initFilterItem.goBackData,
                    drillDown: drillLevel >= 0 ? true : false,
                    drillLevel: drillLevel,
                    fieldName:weiduList[i].fieldName,
                    disabledIndex:weiduList[i].disabledIndex,
                };
                drilDownFilter.push(drilFilter);
            }else if(weiduList[i].groupType == "GROUP_DATE_TITLE_FIELD"){
                var value = [];
                for (var j = 0; j < filterFields.length; j++) {
                    if (weiduList[i].name == filterFields[j].name) {
                        value = filterFields[j].value;
                        break;
                    }
                }

                var drillLevel=this.dateHasDrillLevel(weiduList[i],drilDownFilters,rowTitleFields,start);
                var levelLen=weiduList[i].groupLevels.indexOf(weiduList[i].level)
                var breadData=this.setDateBreadData(value[0],weiduList[i],levelLen);
                var levelItemArr=[];
                if(value!='' || value.length>0){
                    levelItemArr=this.setDatelevelItemArr(breadData);
                }
                var drilFilter = {
                    dimensionId: weiduList[i].name,
                    drillFilter: value,
                    type:"GROUP_DATE_TITLE_FIELD",
                    groupLevels: weiduList[i].groupLevels,
                    level: weiduList[i].level,
                    levelItem: value,
                    levelItemArr: levelItemArr,
                    breadData: breadData,
                    //goBackData: initFilterItem.goBackData,
                    drillDown: drillLevel >= 0 ? true : false,
                    drillLevel: drillLevel,
                    fieldName:weiduList[i].fieldName,
                    disabledIndex:weiduList[i].disabledIndex,
                };
                drilDownFilter.push(drilFilter);
            }
        }
        return drilDownFilter;
    },
    //判断是否钻取过 weiduList[i].name,weiduList[i].dimensionId,rowTitleFields,drilDownFilter,start
    hasDrillLevel: function(name, dimensionId, rowTitleFields, drilDownFilter, start) {
        var drillLevel = -1;
        if (start) {
            for (var h = 0; h < rowTitleFields.length; h++) {
                if (name == rowTitleFields[h].name) {
                    if (rowTitleFields[h].drillLevel && rowTitleFields[h].drillLevel >= 0) {
                        return rowTitleFields[h].drillLevel;
                    }
                }
            }
        } else {
            for (var j = 0; j < drilDownFilter.length; j++) {
                if (dimensionId == drilDownFilter[j].dimensionId) {
                    return drilDownFilter[j].drillLevel;
                }
            }
        }

        return drillLevel;
    },
    initFilterItem: function(value, drillLevel) {
        if (drillLevel == -1) {
            return {
                itemArr: [{
                    id: 0,
                    levelLen: -1,
                }],
                goBackData: false
            };
        }
        var oneDimenObj = this.treeToOneDimen(value);
        //var item={};
        var goBackData = {};
        var itemArr = [];
        for (var o in oneDimenObj) {
            if(oneDimenObj[o][0].levelLen<=drillLevel){
                goBackData['level_' + oneDimenObj[o][0].levelLen] = oneDimenObj[o][0].pid;
                if(drillLevel-1==oneDimenObj[o][0].levelLen){
                    goBackData['level_' + (oneDimenObj[o][0].levelLen+1)] = oneDimenObj[o][0].id;
                }
                itemArr.push(oneDimenObj[o][0]);
            }
        }
        return {
            itemArr: itemArr,
            goBackData: goBackData
        };
    },
    //转换面包屑数据结构
    transformBreadData: function(breadData, groupLevels,wei) {
        var newBreadData = [];
        var toolTipData = [];
        var levelLen=wei.groupLevels.indexOf(wei.level);
        for (var i = 0; i < breadData.length; i++) {
            var curbread = breadData[i];
            var name = '';
            var name2 = '';
            for (var j = 0; j < curbread.length; j++) {
                var levelObj = curbread[j];
                for (var o in levelObj) {
                    var oArr = levelObj[o];
                    var strArr = o.split('_');
                    if(strArr[1]>levelLen){

                    }else{
                        if (strArr.length == 3 && strArr[2] == 'all' && oArr.length>1) {
                            name += '全部' + groupLevels[i];
                        } else {
                            name += oArr.join('、');
                        }
                        name2 += oArr.join('、');
                    }
                }
                if (strArr[1]<=levelLen &&curbread.length > 1 && j < curbread.length - 1) {
                    name += '、';
                    name2 += '、';
                }
            }
            if(name!=''){
                newBreadData.push(name);
                toolTipData.push(name2);
            }

        }
        return {
            breadData: newBreadData,
            toolTipData: toolTipData
        };
    },
    //初始化或者改变维度时替换当前维度drilDownFilter
    replactDrilDownFilter: function(drilDownFilter, newDrilDownFilter) {
        for (var i = 0; i < drilDownFilter.length; i++) {
            for (var j = 0; j < newDrilDownFilter.length; j++) {
                if (drilDownFilter[i].dimensionId == newDrilDownFilter[j].dimensionId) {
                    drilDownFilter[i] = newDrilDownFilter[j];
                }
            }
        }
        return drilDownFilter;
    },
    //bread和tool数据 加入到对应维度的drilDownFilter
    breadAndToolTipInDrilFilter: function(result, drilDownFilter, weiduList, change) {
        var curResult = result;
        for (var o in curResult) {
            for (var j = 0; j < drilDownFilter.length; j++) {
                if (o == drilDownFilter[j].dimensionId) {
                    var first = false;
                    var wei={};
                    for (var h = 0; h < weiduList.length; h++) {
                        if (weiduList[h].dimensionId == drilDownFilter[j].dimensionId) {
                            first = weiduList[h].name;
                            wei=weiduList[h];
                            break;
                        }
                    }
                    if (!change) {
                        var bread = this.transformBreadData(curResult[o], drilDownFilter[j].groupLevels,wei);
                        bread.breadData.splice(0, 0, first);
                        bread.toolTipData.splice(0, 0, first);
                        drilDownFilter[j].breadData = bread.breadData;
                        drilDownFilter[j].toolTipData = bread.toolTipData;
                    } else {
                        var bread = drilDownFilter[j].breadData;
                        bread.splice(0, 0, first);
                        drilDownFilter[j].toolTipData.splice(0, 0, first);
                        drilDownFilter[j].breadData = bread;
                        drilDownFilter[j].toolTipData = bread;
                    }

                }
            }
        }
        return drilDownFilter;
    },
    setLevelLessGroupLevel: function(drilDown, weiduList) {
        for (var j = 0; j < drilDown.length; j++) {
            for (var i = 0; i < weiduList.length; i++) {
                if (weiduList[i].dimensionId == drilDown[j].dimensionId) {
                    var bread = drilDown[j].breadData;
                    var groupLevels = weiduList[i].groupLevels;
                    var bl = bread.length - 1;
                    var gl = groupLevels.length;
                    var level=groupLevels.indexOf(weiduList[i].level);
                    //var drillLevel=weiduList[j].level;
                    if (bl <= level+1) {
                        for (var h = 0; h < level-bl+1; h++) {
                            bread.push('全部' + groupLevels[bl + h]);
                        }
                    }
                }
            }

        }
        return drilDown;

    },

    concatDateFilter:function(drilDownFilter,newDrilDownFilter){
        var pushSign=false;
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].type=="GROUP_DATE_TITLE_FIELD"){
                if(drilDownFilter[i].dimensionId==newDrilDownFilter.dimensionId){
                    drilDownFilter[i]=newDrilDownFilter;
                    pushSign=true;
                    break;
                }
            }
        }
        if(!pushSign){
            drilDownFilter.push(newDrilDownFilter);
        }
        return drilDownFilter;
    },
    setDrillDateFilter:function(weiduList,newDrilDownFilter,filterFields){
        var dimensionId=newDrilDownFilter.dimensionId;
        var sign=false;
        var fieldName='';
        var filterField = {
            "name": "",
            "valueType": "DATE_RANGE",
            "dbField": "",
            "value": newDrilDownFilter.drillFilter,
            "selected": true,
            "items": [],
            "groupType":"GROUP_DATE_TITLE_FIELD",
            "dimensionId":"",
            "pattern": ""
        };
        for(var i=0;i<weiduList.length;i++){
            if(dimensionId==weiduList[i].name){
                filterField.name=weiduList[i].fieldName;
                fieldName=weiduList[i].fieldName;
                filterField.dbField=weiduList[i].fieldName;
                break;
            }
        }
        for(var i=0;i<filterFields.length;i++){
            var filter=filterFields[i];
            if(filter.groupType=="GROUP_DATE_TITLE_FIELD"){
                if(fieldName==filter.name){
                    filterFields.splice(i,1,filterField);
                    sign=true;
                    break;
                }
            }
        }
        if(!sign){
           filterFields.push(filterField);
        }
        return filterFields;
    },
    dateHasDrillLevel:function(weidu,drilDownFilter,rowTitleFields,start){
        var drillLevel = -1;
        if(start){
            if(weidu.groupType == "GROUP_DATE_TITLE_FIELD"){
                for(var j=0;j<rowTitleFields.length;j++){
                    if(weidu.name==rowTitleFields[j].name && rowTitleFields[j].drillLevel){
                        return rowTitleFields[j].drillLevel;
                    }
                }
            }

        }else{
            if(weidu.groupType == "GROUP_DATE_TITLE_FIELD"){
                for (var j = 0; j < drilDownFilter.length; j++) {
                    if (weidu.name==drilDownFilter[j].dimensionId) {
                        return drilDownFilter[j].drillLevel;
                    }
                }
            }
        }

        return drillLevel;
    },
    setSaveDateDrillLevel: function(rowTitleFields, drilDownFilter) {

        for (var i = 0; i < drilDownFilter.length; i++) {
            for (var j = 0; j < rowTitleFields.length; j++) {
                if (drilDownFilter[i].dimensionId == rowTitleFields[j].name && drilDownFilter[i].drillLevel > 0) {
                    rowTitleFields[j].drillLevel = drilDownFilter[i].drillLevel;
                }
            }
        }
        return rowTitleFields;
    },
    formatDateRange:function(dateTime){
        return ReportDateRange.formatDateRange(dateTime);
    },
    setDateBreadData:function(value,weidu,drillLevel){
        var breadData=[weidu.name];
        if(value){
            let isValue = value.split('-');
            var re = /^[0-9]+.?[0-9]*$/;
            if (!re.test(isValue[0])){
                value = this.formatDateRange(value).start;
            }
        }
        if(!value && drillLevel>=0){
            for(var i=0;i<=drillLevel;i++){
                breadData.push('全部'+weidu.groupLevels[i]);
            }
            return breadData;
        };
        if(value && drillLevel==0){
            breadData.push('全部'+weidu.groupLevels[0]);
            return breadData;
        }
        for(var i=0;i<drillLevel;i++){
            if(i==0){
                breadData.push(DrillDownTransformDate.dateToYear(value));
            }
            if(i==1){
                breadData.push(DrillDownTransformDate.dateToQuarter(value));
            }
            if(i==2){
                breadData.push(DrillDownTransformDate.dateToMonth(value));
            }
            if(i==3){
                breadData.push(DrillDownTransformDate.dateToWeek(value));
            }
            if(i==4){
                breadData.push(DrillDownTransformDate.dateToDate(value));
            }

            if(i==drillLevel-1){
                breadData.push('全部'+weidu.groupLevels[drillLevel]);
            }
        }
        return breadData;
    },
    setDatelevelItemArr:function(breadData){
        var levelItemArr=[];
        for(var i=0;i<breadData.length-1;i++){
            if(i==1){
                levelItemArr.push(DrillDownTransformDate.year(breadData[i]));
            }
            if(i==2){
                levelItemArr.push(DrillDownTransformDate.quarter(breadData[i]));
            }
            if(i==3){
                levelItemArr.push(DrillDownTransformDate.month(breadData[i]));
            }
            if(i==4){
                levelItemArr.push(DrillDownTransformDate.week(breadData[i]));
            }
            // if(i==5){
            //     levelItemArr.push(DrillDownTransformDate.week(breadData[i]));
            // }
        }
        return levelItemArr;
    },
    initDateFilterDrilDownParams:function(weidu,drilDownFilter){
        return new Promise((resolve, reject) => {
            for(var i=0;i<drilDownFilter.length;i++){
                if(weidu.groupType == "GROUP_DATE_TITLE_FIELD"){
                    if(weidu.name==drilDownFilter[i].dimensionId){
                        //return [drilDownFilter[i]];
                        resolve([drilDownFilter[i]]);
                    }
                }
            }
           resolve(false);
        });
    },
    setFilterData:function(filterFields,filterData){
        for(var i=0;i<filterFields.length;i++){
            for(var j=0;j<filterData.length;j++){
                if(filterFields[i].name==filterData[j].fieldName){
                    filterData[j].popData=filterFields[i].value;
                }else{
                    filterData[j].popData=[];
                    filterData[j].nameInfoOpen=false;
                }
            }

        }
        return filterData;
    },

    setDrillErrorFilter:function(obj,weiduList,drilDownFilter){
        var dimensionId=obj.dimensionId;
        var newDril=false;
        var drilErrorData={};
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].dimensionId==dimensionId){
                drilErrorData=this.setDrillErrorBreadData(obj,weiduList,drilDownFilter[i],dimensionId);
                drilDownFilter[i]=drilErrorData.drilDownFilter;
                break;
            }
        }
        return {
            drilDownFilter:drilDownFilter,
            weiduList:drilErrorData.weiduList,
            newDrilDownFilter:drilErrorData.drilDownFilter
        }

    },
    setDrillErrorBreadData:function(obj,weiduList,drilDownFilter,dimensionId){
        var groupLevels=drilDownFilter.groupLevels;
        var levelLen=groupLevels.indexOf(drilDownFilter.level);
        var levelIndex=levelLen+1;
        var drillFilter=drilDownFilter.drillFilter;
        if(levelLen==groupLevels.length-1){
            levelIndex-=1;
        }
        drilDownFilter.breadData.pop();
        drilDownFilter.breadData.push(obj.value);
        drilDownFilter.breadData.push('全部'+groupLevels[levelIndex]);
        drilDownFilter.level=groupLevels[levelIndex];
        drilDownFilter.drillLevel+=1;
        var updateWeidu = this.updateWeidu(drilDownFilter.level, weiduList, dimensionId, groupLevels);
        drilDownFilter.levelItemArr.push({
            id:0,
            levelLen:-1
        });

        if(drillFilter.length==0){
            drilDownFilter.drillFilter=[{
                    checboxBool:true,
                    child:true,
                    children:[],
                    id:0,
                    levelLen:levelLen,
                    name:obj.value,
                    pid:0,
                }]
        }else{
            for(var i=0;i<drillFilter.length;i++){
                tree(drillFilter[i])
            }
        }
        function tree(child) {
            if (child.children && child.children.length > 0) {
                for (var i = 0; i < child.children.length; i++) {
                    tree(child.children[i]);
                }
            }else{
                child.children=[{
                    checboxBool:true,
                    child:true,
                    children:[],
                    id:0,
                    levelLen:levelLen,
                    name:obj.value,
                    pid:0,
                }]
            }
        }
        return {
            drilDownFilter:drilDownFilter,
            weiduList:updateWeidu
        };
    },
    updataDrillFilter:function(DrilDownFilter,filterFields){

        for(var i=0;i<DrilDownFilter.length;i++){
            for(var j=0;j<filterFields.length;j++){
                var filter=filterFields[j];
                if(filter.groupType=="GROUP_TITLE_FIELD"){
                    // if(delItem){
                    //     if(filter.dimensionId==delItem.dimensionId){
                    //         filterFields.splice(j,1);
                    //     }
                    // }else{
                        if(DrilDownFilter[i].dimensionId==filter.dimensionId){
                            if(DrilDownFilter[i].drillFilter.length==0){
                                filterFields.splice(j,1);
                            }else{
                                filterFields[j].value=DrilDownFilter[i].drillFilter;
                            }

                        }
                    //}

                }
            }
        }
        return filterFields;

    },
     setstateData:function(weidu,drilDownFilter,rowTitleFields,filterFields,param){
        var drilDownFilter = drilDownFilter;
        var setDrillFilter = '';
        var rowTitleFields = '';
        var drilDownLens = drilDownFilter.slice(0);
        var drillDown = false;
        for(var i =0; i<weidu.length;i++){
            if(param.dimensionId==weidu[i].dimensionId){
                weidu[i].level = param.level;
                for(var i =0; i<drilDownFilter.length;i++){
                    if(param.dimensionId==drilDownFilter[i].dimensionId){
                        drilDownFilter[i]  = param;
                    }
                }
            }
            rowTitleFields=this.setSaveDrillLevel(rowTitleFields,drilDownFilter,drillDown);
            setDrillFilter = this.updataDrillFilter(drilDownFilter,filterFields)
            
        }
        var filters={
            'drilDown':drilDownFilter,
            'setDrillFilters':setDrillFilter,
            'rowTitlefils':rowTitleFields,
            'weiduList' :weidu
        }
      return filters
    },

    filterHandle:function(item,index){
            var drillFilterLen = item.drillFilter.length;
            var drillFilter =  item.drillFilter;
            if(item.disabledIndex == -1){
                drillFilter=item.drillFilter
            }else{
                for(var i=0;i<drillFilterLen;i++){
                    if(index-2==0){
                        drillFilter[i].children=[];
                    }else{

                        if(drillFilter[i].children[i].child){
                            var levelIndex = index-2;

                            if(drillFilter[i].children[i].levelLen == levelIndex){
                                drillFilter[i].children[i].children=[];
                            }else{
                                if(levelIndex==1)return
                                this.filterHandle(drillFilter,levelIndex)
                            }
                        }
                    }
                }
            }

            return drillFilter
    },
    setdrilDatasFun:function(evt,index,item,names,delLen,breadDataLen,breadData){//step,
        var item = item;
        if(index==1 && item.levelItemArr.length>0){
                // 还原初始化状态 levelItem,levelItemArr,item.goBackData
                item.levelItemArr=[];
                item.levelItem={
                    id:0,
                    levelLen:-1
                }
                //item.levelItem.level=-1;
                item.goBackData={};
                item.drillFilter=[];
                item.drillDown = false;
                item.drillLevel = -1;
                breadData.splice(index,delLen,'全部'+ item.groupLevels[index-1]);
                item.level = item.groupLevels[index-1];
                var data = {
                    'items':item
                }
        }else{
                 // 更新 breadData
                breadData.splice(index,delLen,'全部'+ item.groupLevels[index-1]);
                item.level = item.groupLevels[index-1];

                // 更新 goBackData
                for(var name in item.goBackData){
                   names.push(name)
                }
                if(names.length>0){
                    var backIndex = names[0].substring(6);
                    for(var i=index;i<names.length;i++){
                        delete item.goBackData['level_'+i]
                    }

                }
                     // 更新 drillLevel
                    if(item.drillLevel>0){

                        item.drillLevel = index-1;

                    }

                // 更新 levelItemArr,levelItem
                var delArrLen = item.levelItemArr.length;
                var delLength = delArrLen-index+2;
                item.levelItemArr.splice(index-1);
                var updateItemArr = item.levelItemArr[item.levelItemArr.length-1];
                item.levelItem = updateItemArr;

                // 更新 drillFilter
                item.drillFilter = this.filterHandle(item,index);
                var data = {
                    'items':item
                }
        }

        return data
    },
    resetweiduList:function(weidulist,newDrildata){
               for(var i =0; i<weidulist.length;i++){
                   if(weidulist[i].dimensionId == newDrildata.dimensionId || weidulist[i].name==newDrildata.fieldName){
                            weidulist[i].level=newDrildata.level;
                            weidulist[i].drillLevel = newDrildata.drillLevel;
                        }
               }

            return weidulist

    },
    splitDirlName:function(name,zhiBiaoList){
        for(var i=0;i<zhiBiaoList.length;i++){
            var strIndex=name.lastIndexOf('-'+zhiBiaoList[i].name);
            if( strIndex != -1){
                var newName=name.substr(0 ,strIndex) 
                return newName;
            }
        }
        return name;
    },
    splitTreeChild:function(tree,tree2,index){
        var newTree=[];
        for (var i = 0; i < tree.length; i++) {
           for (var j = 0; j < tree2.length; j++) {
                if(tree[i].name==tree2[j].name){
                    newTree=[tree2[j]];
                    break;
                }
            }
        }
        for (var i = 0; i < newTree.length; i++) {
            trees(newTree[i])
        }
        function trees(child) {
            if (child.children && child.children.length > 0 ) {
                if(child.levelLen==index){
                    child.children=[];
                }else{
                    for (var i = 0; i < child.children.length; i++) {
                        trees(child.children[i]);
                    }
                }

            }
        }
        return newTree;
    },
    dateToTime:function(date){
        var dateArr=date.split('-');
        var d=new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
        var time=d.getTime();
        return time;
    },
    //根据分析设置驾驶舱时间范围
    setDateVal:function(reportDate,dirlDate){
        var reportStart=reportDate[0],
            reportEnd=reportDate[1],
            dirlStart=dirlDate[0],
            dirlEnd=dirlDate[1];
            if(!reportEnd){
               reportStart = ReportDateRange.formatDateRange(reportDate[0]).start; 
               reportEnd = ReportDateRange.formatDateRange(reportDate[0]).end; 
            }
            if(!dirlEnd){
               dirlStart = ReportDateRange.formatDateRange(dirlDate[0]).start; 
               dirlEnd = ReportDateRange.formatDateRange(dirlDate[0]).end; 
            }
        var dirlStartTime=this.dateToTime(dirlStart),
            dirlEndTime=this.dateToTime(dirlEnd),
            reportStartTime=this.dateToTime(reportStart),
            reportEndTime=this.dateToTime(reportEnd);

        if(dirlStartTime==reportStartTime && dirlEndTime==reportEndTime){
            return dirlDate;
        }
        var newDate=[];
        newDate[0]=dirlStart;
        newDate[1]=dirlEnd;
        if(dirlStartTime<reportStartTime){
            newDate[0]=reportStart;
        }
        if(dirlStartTime>reportEndTime){
            newDate[0]=reportStart;
        }
        if(dirlEndTime>reportEndTime){
            newDate[1]=reportEnd;
        }
        if(dirlEndTime<reportStartTime){
            newDate[1]=reportEnd;
        }
        return newDate;

    },
    setReportFilterToDashboard:function(reportFilter,drilFilter,dimensionId){
        var reportFilter=JSON.parse(JSON.stringify(reportFilter));
        var drilFilter=JSON.parse(JSON.stringify(drilFilter));
        if(reportFilter.length==0){
            return {
                filterFields:drilFilter
            }
        }
        for(var i=0;i<drilFilter.length;i++){
            for(var j=0;j<reportFilter.length;j++){
                if(drilFilter[i].groupType=="GROUP_TITLE_FIELD" && drilFilter[i].dimensionId==reportFilter[j].dimensionId && reportFilter[j].dimensionId==dimensionId){
                    var dileFilterObj=this.treeToOneDimen(drilFilter[i].value);
                    var olen=this.setObjLen(dileFilterObj);
                    var val=this.splitTreeChild(reportFilter[j].value,drilFilter[i].value,olen);
                    drilFilter[i].value=val;
                    break;
                }else if(drilFilter[i].groupType=="GROUP_DATE_TITLE_FIELD" && drilFilter[i].name==reportFilter[j].name){
                    drilFilter[i].value=this.setDateVal(reportFilter[j].value,drilFilter[i].value)
                }
            }
        }
        return {
            filterFields:drilFilter
        }
    },
    reportFilterMatchGlobalFilter:function(datas,levelId,pid,goBackData){
        var levelArr=datas['level_'+(levelId)];
        var matched=false;
        var goBackData=goBackData;
        if(levelArr){
            for(var i=0;i<levelArr.length;i++){
                if(levelArr[i].pid==pid){
                    matched=true;
                    break;
                }
            }
        }
        var levelId=levelId,pid=pid;
        if(!matched && levelArr){
            for(var o in datas){
                goBackData[o] = datas[o][0].pid;
            }
            levelId=levelId;
            pid=levelArr[0].pid;
        }
        return {
            levelId:levelId,
            pid:pid,
            goBackData:goBackData,
            matched:matched
        }
    },
    setReortFilterToDrilDownData:function(allData,drilDownData,dimensionId,levleIdObj){
        var drilDownData=drilDownData||[];

        for(var i=0;i<drilDownData.length;i++){
            if(drilDownData[i].dimensionId==dimensionId && !levleIdObj.matched){
                for(var o in allData){
                    var oArr=o.split('_');
                    if(oArr[1]==drilDownData[i].drillLevel-1){
                        drilDownData[i].levelItem2=allData[o][0];
                        break;
                    }
                }
            }
        }
        return drilDownData;
    },
    getCompareFilterFields:function(filterFields,reportInfo){
        if(!reportInfo.compareInfo){
            reportInfo.compareInfo = {compareDimension:[]};
        }
        filterFields = App.deepClone(filterFields);
        var compareDimension = reportInfo.compareInfo.compareDimension
        filterFields.map(function(item,index){
            var addField = false;
            compareDimension.map(function(compareItem,compareIindex){
                if(item.fieldName==(compareItem.weiItem?compareItem.weiItem.fieldName:'')&&compareItem.selected){
                    addField = true;
                }
            })
            if(addField){
                item.compare = true;
            }
        })
        return filterFields;
    },
    getCurDimensionIdName:function(globalFilterFields){
        var sign=false;
        var name='';

        // Xuwenyue: 驾驶舱旧版配置信息不兼容
        if (!globalFilterFields) {
            return {
                sign:sign,
                name:name
            };
        }

        for(var i=0;i<globalFilterFields.length;i++){
            if(globalFilterFields[i].hasOwnProperty("curDimensionId")){
                sign=true;
                name=globalFilterFields[i].name;
            }
        }
        return {
            sign:sign,
            name:name
        };
    },
    getCurDimension:function(globalFilterFields){

        // Xuwenyue: 驾驶舱旧版配置信息不兼容
        if (!globalFilterFields) {
            return false;
        }

        for(var i=0;i<globalFilterFields.length;i++){
            if(globalFilterFields[i].hasOwnProperty("curDimensionId")){
               return globalFilterFields[i];
            }
        }
        return false;
    },
    updateCloneWeiAndRowTitle:function(weiduList,cloneWeiduList,rowTitleFields,cloneRowTitleFields,cloneDrilDownData,globalFilterFields){
        var obj=this.getCurDimensionIdName(globalFilterFields);
        if(obj.sign){
            for(var i=0;i<cloneWeiduList.length;i++){
                for(var j=0;j<weiduList.length;j++){
                    if(weiduList[j].name == cloneWeiduList[i].name && cloneWeiduList[i].name==obj.name){
                        weiduList[j]=cloneWeiduList[i];
                    }
                }
            }
            for(var i=0;i<cloneRowTitleFields.length;i++){
                for(var j=0;j<rowTitleFields.length;j++){
                    if(rowTitleFields[j].name == cloneRowTitleFields[i].name && cloneRowTitleFields[i].name==obj.name){
                        rowTitleFields[j]=cloneRowTitleFields[i];
                    }
                }
            }
        }
        return {
            weiduList:weiduList,
            rowTitleFields:rowTitleFields
        }
    },
    sceneUpdataSortTopParam:function(sortTopParam,zhibiiaoList){
        if(sortTopParam){
            if(sortTopParam.maxMin){
                    sortTopParam.maxMin=false;
            }
            if(sortTopParam.sortFields.length>0){
                for(var i=0; i<zhibiiaoList.length; i++){
                    if(sortTopParam.sortFields){
                        if(zhibiiaoList[i].name == sortTopParam.sortFields[0].field){
                          sortTopParam.sortFields=false;
                        }
                    }
                }
            }
            if(sortTopParam.topParameters){
                 sortTopParam.topParameters=false
            }
        }
        return sortTopParam
    },
    setCellsData:function(filterData,compareData){
        var filterFields = App.deepClone(filterData);
        var compare = false;
        var dimensionName = '';
        compareData.map(function(item,index){
            if(item.selected&&item.type!='nocompare'){
                compare = true;
                dimensionName = item.weiItem?item.weiItem.fieldName:'';
            }
        })
        filterFields.map(function(fields,index){
            if(!fields.rows.infoOpen){
                fields.rows.infoOpen = fields.rows.nameInfoOpen;
            }
            if(compare){
                if(fields.rows.fieldName==dimensionName){
                    fields.rows.nameInfoOpen = false;
                }
            }else{
                fields.rows.nameInfoOpen = fields.rows.infoOpen;
            }
        })
        return filterFields;
    },
    getMaxMin:function(zhibiaoMinMax){
        var o={
            min:null,
            max:null,
        };
        if(zhibiaoMinMax && zhibiaoMinMax.length>0){
            for(var i=0;i<zhibiaoMinMax.length;i++){
                if(zhibiaoMinMax[i].type=="INDEX_FIELD"|| zhibiaoMinMax[i].type=="COMPARE_INDEX_FIELD"){
                    if(zhibiaoMinMax[i].operator[0]=="GE"){
                        o.min=zhibiaoMinMax[i].value[0];
                        o.name=zhibiaoMinMax[i].name;
                    }
                    if(zhibiaoMinMax[i].operator[0]=="LE"){
                        o.max=zhibiaoMinMax[i].value[0];
                    }
                }
            }
        }
        return o;
    },
    setMaxMinFilter:function(filterFields,zhibiaoMinMax){
        for(var i=0;i<filterFields.length;){
            if(filterFields[i].type=="INDEX_FIELD" || filterFields[i].type=="COMPARE_INDEX_FIELD"){
                filterFields.splice(i,1);
            }else{
                i++
            }
        }
        if(!zhibiaoMinMax){
             zhibiaoMinMax = [];
        }
        var filterFields=filterFields.concat(zhibiaoMinMax);
        return filterFields;
    },
    dwonloadUpdateAreaInfo: function (areaInfo, drilDownDatas, curFilterFields) {

		if (!areaInfo || !areaInfo.rowTitleFields) {
			return false;
		}
        let areaInfoTmp    = App.deepClone(areaInfo);
        let rowTitleFields = areaInfoTmp.rowTitleFields;
        let filterFields   = areaInfoTmp.filterFields;
		let filterFieldMap = {};
		
		for (let counter = 0; counter < filterFields.length; counter++) {
			filterFieldMap[filterFields[counter].name] = filterFields[counter];
		}

		for (let i = 0; i < drilDownDatas.length; i++) {

			let drillDownData = drilDownDatas[i];
			if (1 > drillDownData.drillFilter.length) {
				// 此维度没有设置钻取
				continue;
			}

			let filterField = {
				dbField     : "",
				dimensionId : drillDownData.dimensionId,
				name        : drillDownData.fieldName,
				value       : drillDownData.drillFilter
			};
 
			// 设置钻取层级
			for (let j = 0; j < rowTitleFields.length; j++) {
				if (drilDownDatas[i].fieldName === rowTitleFields[j].name) {
					rowTitleFields[j].level = drilDownDatas[i].level;
				}
			}

			// 替换钻取用的筛选条件
			if (filterFieldMap[filterField.name]) {
                filterFieldMap[filterField.name].value = filterField.value;
			}
			else {
                filterFields.push(filterField);
			}

		}
        areaInfoTmp.filterFields = filterFields;

		return areaInfoTmp;
	},
    dwonloadSetZhibiaoFilter:function(areaInfo,sortFields,maxMin,topParameters){
        var areaInfo = App.deepClone(areaInfo);
		if(sortFields){
			areaInfo.sortFields=sortFields;
		}
		if(maxMin){
			areaInfo.filterFields=this.setMaxMinFilter(areaInfo.filterFields,maxMin);
			delete areaInfo.topParameters;
		}
		if(topParameters){
			areaInfo.topParameters=topParameters;
            delete areaInfo.maxMin;
			areaInfo.filterFields=ReportStore.emptyZhibiaoFilterFields(areaInfo.filterFields);
		}
        //修改基本表下载类型参数错误bug
        if(( sortFields || maxMin || topParameters) && areaInfo.type === 'TREE'){
            areaInfo.type = 'CATEGORY';
        }
		return areaInfo;
	},
    matchDimension:function(item,list){
        for(var i=0; i<list.length; i++){
            if(item.name===list[i].name){
                return list[i];
            }
        }
    },
    getDrilDownFilterItem:function(dimensionItem, drilDownFilter){
        for(var i=0;i<drilDownFilter.length;i++){
            if(drilDownFilter[i].dimensionId === dimensionItem.dimensionId || drilDownFilter[i].dimensionId === dimensionItem.name){
                return drilDownFilter[i];
            }
        }
    },
    matchWeiduList:function(drilDownFilterItem){
        var weiduList=drilDownFilterItem.weiduList;
        if(!weiduList){
            return false;
        }
        for(var i=0;i<weiduList.length;i++){
            if(weiduList[i].name === drilDownFilterItem.dimensionId || weiduList[i].dimensionId === drilDownFilterItem.dimensionId ){
                return weiduList[i];
            }
        }
    },
    replaceWeiduList:function(olds,news){
        for(var i=0;i<olds.length;i++){
            for(var j=0;j<news.length;j++){
                if(olds[i].name === news[j].name && news[j].drillLevel && news[j].drillLevel>0){
                    olds[i]=news[j];
                }
            }
        }
        return olds;
    },
    removeExtrafilter(weidulist,filterFields){
        var newFilter=[];
        var weidulist=JSON.parse(JSON.stringify(weidulist));
        for(var i=0;i<weidulist.length;i++){
            for(var j=0;j<filterFields.length;j++){
                if(weidulist[i].name === filterFields[j].name){
                    newFilter.push(filterFields[j]);
                }
            }
        }
        return newFilter;
    }
}
