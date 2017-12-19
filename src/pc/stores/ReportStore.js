/**
 * 报表Store
 */
var App = require('app');
var ChartTypeStore = require('./ChartTypeStore');
var CompareStore = require('./CompareStore');
var { WEB_API } = require('../../constants/api');
module.exports = {
    events: {},
    /**
     * 根据areaInfo获取报表数据
     * @return Promise
     */
    getAreaByAreaInfo: function(areaInfo) {
    	// 拦截错误计算列请求数据
		let indexList = [];
		for (let counter = 0; counter < areaInfo.areaInfo.indexFields.length; counter++) {
			let indexField = areaInfo.areaInfo.indexFields[counter];
			if (false == indexField.fxSign) {continue;}
			indexList.push(indexField);
		}
		areaInfo.areaInfo.indexFields = indexList;

        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getAreaByAreaInfo',
                type: 'POST',
                data: areaInfo,
                contentType: 'application/json',
                httpUrl:WEB_API.GET_AREA_BY_AREAINFO_URL,
                callback: function(result) {resolve(result);},
                errorCallback: function() {reject('网络异常');}
            })
        })
    },
    /**
     * 根据ID获取报表数据
     * @return Promise
     */
    getAreaInfo: function(id) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getAreaInfo',
                //type: 'POST',
                httpUrl: WEB_API.DASHBOARD_GET_AREA_URL.replace(":id", id),
                type: "GET",
                contentType: 'application/json',
                param: '&id=' + id,
                callback: function(result) { resolve(result);},
                errorCallback: function() {reject();}
            })
        })
    },
    /**
     * 取得报表展示数据
     * @return Promise
     */
    getArea: function(id, data) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/runtime/getArea',
                httpUrl: `${ WEB_API.GETAREA_URL }/${ id } `,
                type: 'POST',
                contentType: 'application/json',
                param: '&id=' + id,
                data: data,
                callback: function(result) {resolve(result);},
                errorCallback: function() {reject('暂时无法获取预览信息');}
            })
        })
    },
    /**
     * 保存报表信息
     * @return Promise
     */
    saveReport: function(data) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/saveReport',
                httpUrl: WEB_API.SAVE_REPORT_URL,
                type: 'POST',
                data: data,
                contentType: 'application/json',
                callback: function(result) {resolve(result);},
                errorCallback: function() {reject();}
            })
        })
    },
    /**
     * 保存KPI展现条件信息
     * @return Promise
     */
    saveKPIOptionReport: function(data) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/resource/saveExtend',
                type: 'POST',
                data: data,
                contentType: 'application/json',
                callback: function(result) {resolve(result);},
                errorCallback: function() {reject();}
            })
        })
    },
      /**
     * 获取KPI展现条件信息
     * @return Promise
     */
    getKPIOptionReport: function(data) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/resource/getExtends',
                type: 'POST',
                data: data,
                contentType: 'application/json',
                httpUrl:WEB_API.GET_EXTENDS,
                callback: function(result) {resolve(result);},
                errorCallback: function() {reject();}
            })
        })
    },
    /**
     * 根据id和key保存相应的配置信息
     * @param data
     * @returns {Promise}
     */
    saveExtends: function (data) {
        return new Promise((resolve, reject) => {
            App.ajax(
                {
                    url: '/services/resource/saveExtend',
                    type: 'POST',
                    data: data,
                    httpUrl:WEB_API.SAVE_EXTEND,
                    contentType: 'application/json',
                    callback: function (result) {resolve(result);},
                    errorCallback: function () {reject();}
                });
        });
    },
    /**
     * 根据id和key获取相应的配置信息
     * @param data
     */
    getExtends: function (data) {
        return new Promise((resolve, reject) => {
            App.ajax(
                {
                    url: '/services/resource/getExtends',
                    type: 'POST',
                    data: data,
                    httpUrl:WEB_API.GET_EXTENDS,
                    contentType: 'application/json',
                    callback: function (result) {resolve(result);},
                    errorCallback: function () {reject();}
                }
            );
        });
    },
    /**
     * 获取筛选参数
     * @return Promise : true or false
     */
    getDirectoriesList: function(datas) { //获取报表情景库列表的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getDirectories',
                type: "POST",
                contentType: 'application/json',
                httpUrl:WEB_API.REPORT_GET_DIRECTORIES,
                callback: function(result) {
                    result = result.dataObject;
                    for (var i = 0; i < result.length; i++) {
                        result[i].index = i;
                        result[i].typeName = '文件夹';
                        result[i].listType = 'dir';
                        result[i].listCheckBoxBool = false;
                    }
                    resolve(result);
                }
            })
        })
    },
    newCreateReportDir: function(dataObj) { //创建情景库的ajax方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/saveResource',
                httpUrl:  WEB_API.SAVE_REPORT_RESOURCE_URL,   
                type: "POST",
                param: '&resourceObject=' + encodeURIComponent(JSON.stringify(dataObj)),
                data:{ 'resourceObject': dataObj },
                contentType: 'application/json',
                callback: function(result) {resolve(result);}
            })
        })
    },
    reNameReportList: function(reNameId,reNameName) { //重命名情景库的ajax方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/renameResource',
                httpUrl: `${ WEB_API.RENAME_REPORT_RESOURCE_URL}/${ reNameId }`, 
                type: "PATCH",
                param: '&name=' + reNameName,
                contentType: 'application/json',
                callback: function(result) {resolve(result);}
            })
        })
    },
    deleteReportList: function(id) { //删除报表列表的公用方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/deleteResource',
                type: "POST",
                httpUrl:WEB_API.REPORT_DELETE_RESOURCES.replace(':id',id),
                //param: '&id=' + id,
                contentType: 'application/json',
                callback: function(result) {resolve(result);}
            })
        })
    },
    /**
     * 获取立方指定字段的真实数据
     * @return Promise
     */
    getFieldData: function(id, fieldName) {
        //return new Promise();
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getFieldData',
                type: 'POST',
                contentType: 'application/json',
                param: '&id=' + id + '&fieldName=' + fieldName,
                callback: function(result) {resolve(result.dataObject);},
                errorCallback: function() {reject();}
            })


        });
    },
    getReportsList: function(data) { //获取指定报表情景库下面的所有报表列表的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getReports',
                type: "POST",
                data: data,
                contentType: 'application/json',
                callback: function(result) {
                    result = result.dataObject.rows;
                    for (var i = 0; i < result.length; i++) {
                        result[i].index = i;
                        result[i].typeName = '文件';
                        result[i].listType = 'files';
                        result[i].listCheckBoxBool = false;
                    }
                    resolve(result);
                }
            })
        })
    },
    /**
    *
    *获取我的分析列表页面的数据
    *
    **/
    getReportListDatas:function(data){
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getResources',
                httpUrl:  WEB_API.GET_REPORT_RESOURCES_URL ,
                type: "POST",
                data:data,
                contentType: 'application/json',
                callback: function(result) {
                    result = result.dataObject;
                    if(result.length>0){
                        for (var i = 0; i < result.length; i++) {
                            result[i].index = i;
                            result[i].listCheckBoxBool = false;
                        }
                    }
                    resolve(result);
                }
            })
        })
    },
    /**
    *
    *获取我的分析的数据信息
    *
    **/
    getReportData:function(reportId){
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getResource',
                httpUrl: `${ WEB_API.GRT_RESOURCE_URL }/${reportId}`,
                type: "GET",
                param: '&id=' + reportId,
                contentType: 'application/json',
                callback: function(result) {resolve(result);}
            })
        })
    },
    /**
     *驾驶舱报表导出的接口方法
     *
     **/
    outPutReport: function(id, areaParameters) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/runtime/exportExcel',
                type: "POST",
                contentType: 'application/json',
                param: '&id=' + id + '&areaParameters=' + areaParameters,
                callback: function(result) {resolve(result);}
            })
        })
    },
    getFilterValueHandle: function(id, dbField, inputValue) { //报表编辑和创建时候通过搜索获取筛选值得方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getSearchFieldData',
                type: "POST",
                contentType: 'application/json',
                param: '&id=' + id + '&fieldName=' + dbField + '&fieldValue=' + inputValue,
                callback: function(result) {resolve(result);}
            })
        })
    },
    getPageFieldData: function(id,param) { //报表编辑和创建时候通过搜索获取筛选值得方法
        var data = {
            "fieldName":param.fieldName, // 筛选字段（必选）
            "sortParameters":{ // 排序属性（可选）
                "field":param.fieldName, // 排序字段
                "method":"ASC"
            },
            "filterParameters":[{ // 筛选条件（可选）
                "field":param.fieldName, // 筛选字段
                "value":param.value // 筛选值
            }],
            "pageParameter":{ // 可选
                "pageRowCount":param.pageRowCount?param.pageRowCount:20, //一页的数据行数
                "currentPageNo":param.currentPageNo?param.currentPageNo:1 //一页的数据行数
            }
        }
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getPageFieldData',
                httpUrl: `${WEB_API.GET_PAGE_FIELD_DATA_URL}/${ id }`, 
                type: "POST",
                contentType: 'application/json',
                data:data,
                param: '&id=' + id,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getFilterItems:function(reportId,dbField,keyword,page){
        var _this = this;
        var keyword = keyword?keyword:'';
        var loadPage = true;
        return new Promise((resolve, reject) => {
            _this.getAreaInfo(reportId).then(function (data) {
                if(data.success){
                    var suc = false,items = [];
                    for(var i=0;i<data.dataObject.filterFields.length;i++){
                        if(data.dataObject.filterFields[i].dbField==dbField&&data.dataObject.filterFields[i].items.length>0){
                              suc = true;
                              items = data.dataObject.filterFields[i].items;
                              loadPage = false;
                        }
                    }
                    if(!suc){
                        _this.getPageFieldData(data.dataObject.metadataId,{fieldName:dbField,value:keyword,pageRowCount:50,currentPageNo:page}).then(function(result){
                             if(result.success){
                                resolve({data:result.dataObject.dataArray,page:loadPage});
                             }else{
                                App.emit('APP-MESSAGE-OPEN',{
                                    content:'获取筛选：'+result.message
                                });
                             }
                        })
                    }else{
                        if(keyword){
                            var keywordItems = [];
                            for(var i=0;i<items.length;i++){
                                if(items[i].name.indexOf(keyword)>=0){
                                    keywordItems.push(items[i])
                                }
                            }
                            resolve({data:keywordItems,page:loadPage});
                        }else{
                            resolve({data:items,page:loadPage});
                        }
                    }
                }else{
                    console.log(data.message);
                }
            })
        })
    },
    getReportUser: function(userId) { //通过用户id获取用户名字
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/usm/getUserName',
                httpUrl:`${WEB_API.GET_USERNAME_URL}/${userId}`,
                type: "POST",
                contentType: 'application/json',
                param: '&id=' + userId,
                callback: function(result) {resolve(result);}
            })
        })
    },
    getPathDataHandle: function(resourceId) { //通过当前资源id获取头部面包屑导航方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getPath',
                httpUrl: `${WEB_API.GET_REPORT_PATH_URL}/${resourceId}`,
                type: "GET",
                contentType: 'application/json',
                param: '&id=' + resourceId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getRootDataHandle: function(modelStr) { //获取当前用户对当前模块的权限方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/usm/getPageFunction',
                //type: "POST",
                type: "GET",
                httpUrl: WEB_API.COMMON_GET_FUNCTIONS_URL,
                contentType: 'application/json',
                param: '&pageSsid=' + modelStr,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    removeTargetHandle: function(targetId,data) { //用户操作当前文件夹移动接口方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/moveResources',
                httpUrl: `${WEB_API.MOVE_REPORT_RESOURCES_URL}/${targetId}`,
                type: "POST",
                contentType: 'application/json',
                data:data,
                //param: '&targetId=' + targetId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    copyTargetHandle: function(targetId,data) { //用户操作当前文件夹复制接口方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/copyResources',
                type: "POST",
                httpUrl:WEB_API.REPORT_COPY_RESOURCES.replace(':id',targetId),
                contentType: 'application/json',
                data:data,
                param: '&targetId=' + targetId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    setIndexFields:function(zhibiaolist,type,category){
        var indexFields = [];
        for(var i=0;i<zhibiaolist.length;i++){
            var statistical = zhibiaolist[i].statistical||"",
                customName = zhibiaolist[i].customName||"";
            if(category=='INDEX'){
                var params={"name":zhibiaolist[i].name,"customName":customName,"statistical":statistical};
                if(zhibiaolist[i].distinct){
                    params={"name":zhibiaolist[i].name,"customName":customName,"statistical":statistical,distinct:zhibiaolist[i].distinct};
                }
                if(zhibiaolist[i].type==8){
                    params["expression"]  = zhibiaolist[i].expression;
                    params["cexpression"] = zhibiaolist[i].cexpression;
					params["errMessage"]  = zhibiaolist[i].errMessage;
					params["fxSign"]      = zhibiaolist[i].fxSign;
                }
                if(zhibiaolist[i].pageFormater){
                    params.pageFormater = zhibiaolist[i].pageFormater;
                }
                indexFields.push(params);
            }else{
                var params={"name":zhibiaolist[i].name,"customName":customName,"statistical":statistical,'renderas':type};

                if(zhibiaolist[i].type==8){
                    params["expression"]  = zhibiaolist[i].expression;
                    params["cexpression"] = zhibiaolist[i].cexpression;
					params["errMessage"]  = zhibiaolist[i].errMessage;
					params["fxSign"]      = zhibiaolist[i].fxSign;
                }
                if(zhibiaolist[i].pageFormater){
                    params.pageFormater = zhibiaolist[i].pageFormater;
                }
                indexFields.push(params);
            }
        }
        return indexFields;
    },
    setTitleFields:function(weiduList){
        var titleFields = [];
        for(var i=0;i<weiduList.length;i++){
            var fieldsObj={name:weiduList[i].name,customName:weiduList[i].customName}
            //复合维度
            if ((weiduList[i].groupType=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == weiduList[i].groupType)) {
                fieldsObj.level = weiduList[i].level;
                fieldsObj.type = weiduList[i].groupType;
            }
            titleFields.push(fieldsObj);
        }
        return titleFields;
    },
    setCategoryFields:function(weiduList){
        var categoryFields = [];
        for(var i=0;i<weiduList.length;i++){
            var categoryFieldsObj={name: weiduList[i].name,customName : ''};
            var type=weiduList[i].groupType;
            if ((type=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == type)) {
                categoryFieldsObj.type=type;
                categoryFieldsObj.level=weiduList[i].level;
            }
            categoryFields.push(categoryFieldsObj);
        }
        return categoryFields;
    },
    setFilterFields: function(filterData) {
        var filterFields = [];
        for (var i = 0; i < filterData.length; i++) {
            if (filterData[i].nameInfoOpen) {
                var filterField = {
                    "name": filterData[i].nameInfoType,
                    "valueType": "STRING",
                    "dbField": filterData[i].groupType == "GROUP_TITLE_FIELD"?"":filterData[i].fieldName,
                    "value": [],
                    "selected": true,
                    "items": [],
                    "groupType":filterData[i].groupType,
                    "dimensionId":filterData[i].groupType == "GROUP_TITLE_FIELD"?filterData[i].dimensionId:'',
                    "pattern": ""
                }
                var items = [],value = [];
                if (filterData[i].dataType == 'DATE') {
                    if (filterData[i].valueType) {
                        if (filterData[i].valueType == 'CUSTOM') {
                            filterField.valueType = 'DATE_RANGE';
                        } else {
                            filterField.valueType = 'DATE_CYCLE';
                        }
                        value = filterData[i].popData;
                    }
                } else {
                    if(!filterData[i].checkedInfos){
                        if(filterData[i].groupType == "GROUP_TITLE_FIELD"){
                            value = filterData[i].popData;
                        }else{
                            var popDataInfo = filterData[i].popData;
                            for (var j = 0; j < popDataInfo.length; j++) {
                                var id = popDataInfo[j].id||popDataInfo[j].value;
                                items.push({"value":id,"name": popDataInfo[j].name})
                                value.push(id);
                            }
                        }
                    }else{
                        var popDataInfo = filterData[i].checkedInfos;
                        for (var j = 0; j < popDataInfo.length; j++) {
                            items.push({"value":id, "name": popDataInfo[j].name })
                            value.push(id);
                        }
                    }
                }
                filterField.items = items;
                filterField.value = value;
                filterFields.push(filterField);
            }
        }
        return filterFields;
    },
    setFilterFieldsPopData: function(filterData) {
        var filterFields = [];
        for (var i = 0; i < filterData.length; i++) {
            if (filterData[i].popData.length>0) {
                var filterField = {
                    "name": filterData[i].fieldName,
                    "valueType": "STRING",
                    "dbField": filterData[i].groupType == "GROUP_TITLE_FIELD"?"":filterData[i].fieldName ,
                    "value": [],
                    "selected": true,
                    "items": [],
                    "groupType":filterData[i].groupType||"",
                    "dimensionId":filterData[i].groupType == "GROUP_TITLE_FIELD"?filterData[i].dimensionId:'',
                    "pattern": ""
                }
                var items = [],value = [];
                if (filterData[i].dataType == 'DATE') {
                    if (filterData[i].valueType) {
                        if (filterData[i].valueType == 'CUSTOM' || filterData[i].valueType == 'DATE') {
                            filterField.valueType = 'DATE_RANGE';
                        } else {
                            filterField.valueType = 'DATE_CYCLE';
                        }
                        value = filterData[i].popData;
                    }
                } else {
                    if(!filterData[i].checkedInfos){
                        if(filterData[i].groupType == "GROUP_TITLE_FIELD"){
                            value = filterData[i].popData;
                        }else{
                            var popDataInfo = filterData[i].popData;
                            for (var j = 0; j < popDataInfo.length; j++) {
                                var id = popDataInfo[j].id||popDataInfo[j].value;
                                items.push({"value":id,"name": popDataInfo[j].name})
                                value.push(id);
                            }
                        }
                    }else{
                        var popDataInfo = filterData[i].checkedInfos;
                        for (var j = 0; j < popDataInfo.length; j++) {
                            items.push({"value":id,"name": popDataInfo[j].name})
                            value.push(id);
                        }
                    }
                }
                filterField.items = items;
                filterField.value = value;
                filterFields.push(filterField);
            }
        }
        return filterFields;
    },
    replaceFunc:function(regStr,regConfig,isIndexBase){
        var value = "";
        for (var key in regConfig) {
            if(regStr==regConfig[key]){
                var v = key=='SUM1'?'SUM':key;
                value = isIndexBase ? '' : ':' + v;
            }
        }
        if(regStr=='\\'){
            value = '';
        }
        return value;
    },
    replaceIndexField: function (indexField, isIndexBase, type) {
        var _this = this;
        var regConfig = {SUM: "\(求和\)",SUM1: "\(合计\)",AVG: "\(平均\)",MAX: "\(最大值\)",MIN: "\(最小值\)", COUNT: "\(计数\)"};
        var reg = /(?:(?:\(求和\))|(?:\(合计\))|(?:\(平均\))|(?:\(最大值\))|(?:\(最小值\))|(?:\(计数\)))|(?:\\)/g;
        if (type != 'str') {
            indexField.cexpression = indexField.expression;
            indexField.expression = indexField.expression.replace(reg,function(regStr){
                return _this.replaceFunc(regStr,regConfig,isIndexBase);
            });
        } else {
            indexField = indexField.replace(reg,function(regStr){
                return _this.replaceFunc(regStr,regConfig,isIndexBase);
            });
        }
        return indexField;
    },
    setAreaInfo:function(state){
        var type = state.reportType;
        var rowTitleFields = this.setTitleFields(state.weiduList);
        var zbListData = [];
        state.zhiBiaoList.map(function(indexField,index){
            if(indexField.checked||indexField.checked===undefined){
                zbListData.push(indexField);
            }
        })
        var indexFields = this.setIndexFields(zbListData,type,state.reportCategory);
        var categoryFields = this.setCategoryFields(state.weiduList);
        var columnTitleFields = this.setTitleFields(state.columnTitleFieldsList);
        var wlen = categoryFields.length;
        if(type=='CROSS'){
            rowTitleFields = this.setTitleFields(state.rowTitleFieldsList);
            wlen = {row:rowTitleFields.length,col:columnTitleFields.length};
        }
        var changeed = ChartTypeStore.onChange(type,indexFields.length,wlen);
        var weiduLength = ChartTypeStore.getLength(type).weiduLen;
        var zhibiaoLength = ChartTypeStore.getLength(type).zhibiaoLen;
        var getIndexFields = [];
        if(weiduLength!=''){
            categoryFields = categoryFields.slice(0,weiduLength);
        }

        let isIndexBase = false;
        if (("INDEX" === state.reportCategory) && ("BASE"  === state.reportType)) {
            isIndexBase = true;
        }
        for(let i=0;i<indexFields.length;i++){
            if(indexFields[i].expression&&!indexFields[i].cexpression){
                indexFields[i] = this.replaceIndexField(indexFields[i], isIndexBase);
            }
        }
        var model = {
            dataObject:{
                "areaInfo":{
                    "name":state.tableName,  // 修改名称
                    "category":state.reportCategory,
                    "type":state.reportType,
                    "parentId":state.parentId,
                    "metadataId":state.metadataId,
                    "indexFields":indexFields,
                    "filterFields":state.filterFields
                },
                "areaParameters":{
                    "actionType":"VIEW",
                    "preview":"false",
                    "width":"100%",
                    "height":"100%",
                    "changeChartAllowed":"true",
                    "timeAxisUsed":"true",
                    "pageParameter":null,
                    "filterFields":[],
                    "chartType":null
                }
            },
            changeed:changeed
        }
        if(state.reportCategory=='INDEX'){
            if(state.reportType=='CROSS'){
                rowTitleFields = this.setTitleFields(state.rowTitleFieldsList);
                model.dataObject.areaInfo.columnTitleFields = columnTitleFields;
            }
            model.dataObject.areaInfo.rowTitleFields = rowTitleFields;
            model.dataObject.areaInfo.formulas = this.setFormulas(state.reportType,state.formulas);
        }else{
            model.dataObject.areaInfo.categoryFields = categoryFields;
        }
        return model;
    },
    changeReportType:function(state,arg){
        var newState = {};
        for(var i in state){
            newState[i] = state[i];
        }
        var state = newState;
        if(arg.oldType.type=='BASE'){
            for(var i=0;i<state.zhiBiaoList.length;i++){
                for(var j=0;j<state.dragHejiList.length;j++){
                    if(state.dragHejiList[j].fieldName==state.zhiBiaoList[i].fieldName){
                        state.dragHejiList.splice(j,1);
                        state.dragZhibiaoList.push(state.zhiBiaoList[i]);
                        break;
                    }
                }
                //不是计算列
                if(state.zhiBiaoList[i].type!=8 && state.zhiBiaoList[i].type!=9){
                    state.zhiBiaoList[i].type = 3;
                    state.zhiBiaoList[i].statistical = 'SUM';
                    state.zhiBiaoList[i].typeName = '求和';
                    state.zhiBiaoList[i].name = state.zhiBiaoList[i].name+'(求和)';
                }

            }
        }
        if(arg.oldType.type=='CROSS'){
            state.weiduList = state.rowTitleFieldsList.concat(state.columnTitleFieldsList);
        }
        if (arg.oldType.type=='KPI') {

        }
        if (arg.newType.type =='KPI') {
            for(var t=0;t<state.weiduList.length;t++){
                state.dragWeiduList[state.dragWeiduList.length]=state.weiduList[t];
            }
            state.weiduList =[];
        }
        if(arg.newType.type=='BASE'){
            state = this.getBaseIndexFields(state);
            state = this.fixDimensions(state);
        }
        if(arg.newType.type=='CROSS'){
            var len = state.weiduList.length;
            var n = parseInt(len/2);
            var r=len%2;
            if(r>0){n+=1}
            var rowTitleFieldsList = [];
            var columnTitleFieldsList = [];
            for(var i=0;i<len;i++){
                if(i<n){
                    rowTitleFieldsList.push(state.weiduList[i]);
                }else{
                    columnTitleFieldsList.push(state.weiduList[i]);
                }
            }
            state.weiduList = [];
            state.rowTitleFieldsList = rowTitleFieldsList;
            state.columnTitleFieldsList = columnTitleFieldsList;
        }
        if(arg.newType.type=='EchartsMap'){
           var weiduList = [];
           for(var i=0;i<state.weiduList.length;i++){
                if(state.weiduList[i].dimensionDataType=='REGION'){
                    weiduList.push(state.weiduList[i]);
                }else{
                    state.dragWeiduList.push(state.weiduList[i]);
                }
           }
           state.weiduList = weiduList;
        }
        var data = {
            weiduList:state.weiduList,
            zhiBiaoList:state.zhiBiaoList,
            columnTitleFieldsList:state.columnTitleFieldsList,
            rowTitleFieldsList:state.rowTitleFieldsList,
            dragWeiduList:state.dragWeiduList,
            dragZhibiaoList:state.dragZhibiaoList,
            dragHejiList:state.dragHejiList,
            dragPingjunList:state.dragPingjunList,
            dragMaxList:state.dragMaxList,
            dragMinList:state.dragMinList,
            dragJishuList:state.dragJishuList,
            dragJisuanlieList:state.dragJisuanlieList,
            dragWeiduJishuList:state.dragWeiduJishuList,
        }
        return data;
    },
    getBaseIndexFields:function(state){
        var type;
        for(var i=0;i<state.zhiBiaoList.length;i++){
            var zhibiao = {
                customName:state.zhiBiaoList[i].customName,
                dataType:state.zhiBiaoList[i].dataType,
                dimensionDataType:state.zhiBiaoList[i].dimensionDataType,
                dimensionId:state.zhiBiaoList[i].dimensionId,
                dmType:state.zhiBiaoList[i].dmType,
                fieldName:state.zhiBiaoList[i].fieldName,
                fieldType:state.zhiBiaoList[i].fieldType,
                itemName:state.zhiBiaoList[i].itemName,
                jdbcType:state.zhiBiaoList[i].jdbcType,
                name:state.zhiBiaoList[i].name,
                show:state.zhiBiaoList[i].show,
                statistical:state.zhiBiaoList[i].statistical,
                type:state.zhiBiaoList[i].type,
                typeName:state.zhiBiaoList[i].typeName,
                distinct:state.zhiBiaoList[i].distinct
            }
            switch (state.zhiBiaoList[i].statistical) {
                case 'SUM':
                    state.dragHejiList.push(zhibiao);
                    break;
                case 'AVG':
                    state.dragPingjunList.push(zhibiao);
                    break;
                case 'MAX':
                    state.dragMaxList.push(zhibiao);
                    break;
                case 'MIN':
                    state.dragMinList.push(zhibiao);
                    break;
                case 'COUNT':
                    if(state.zhiBiaoList[i].distinct=='distinct'){
                        state.dragWeiduJishuList.push(zhibiao);
                    }else{
                        state.dragJishuList.push(zhibiao);
                    }
                    break;
                default:
                    type = 2;
            }
            //不是计算列
            if(!state.zhiBiaoList[i].expression&&state.zhiBiaoList[i].fieldName!='countIndex'){
                state.zhiBiaoList[i].statistical = '';
                state.zhiBiaoList[i].type = 2;
                state.zhiBiaoList[i].name = state.zhiBiaoList[i].itemName;
            }
        }
        var newZhiBiaoList = this.unique(state.zhiBiaoList);
        for(var x=0;x<newZhiBiaoList.length;x++){
            for(var j=0;j<state.dragZhibiaoList.length;j++){
                if(state.dragZhibiaoList[j].fieldName==newZhiBiaoList[x].fieldName){
                    state.dragZhibiaoList.splice(j,1);
                    break;
                }
            }
            if(newZhiBiaoList[x].fieldName=='countIndex'||newZhiBiaoList[x].distinct=='distinct'){
                newZhiBiaoList.splice(x,1);
            }
        }
        state.zhiBiaoList = newZhiBiaoList;
        return state;
    },
    /**
     * 图形切换至基本表后的处理
     * @param state
     * @returns {*}
     */
    fixDimensions : function(state) {
        state = this.fixDimesionsForTreeLevel(state);
        return state;
    },
    /**
     * 图形切换至基本表后的处理,树型纬度改为最细层
     * @param state
     * @returns {*}
     */
    fixDimesionsForTreeLevel : function(state) {
        let weiduList = [];
        for (var index in state.weiduList) {
            let weidu = state.weiduList[index];
            if (("GROUP_DATE_TITLE_FIELD" === weidu.groupType) || ("GROUP_TITLE_FIELD"      === weidu.groupType)) {
                weidu.level = weidu.groupLevels[weidu.groupLevels.length - 1];
            }
            weiduList.push(weidu);
        }
        state.weiduList = weiduList;
        return state;
    },
    unique: function(arr) {
        var r = new Array();
        label: for (var i = 0, n = arr.length; i < n; i++) {
            for (var x = 0, y = r.length; x < y; x++) {
                if (r[x].name == arr[i].name) {
                    continue label;
                }
            }
            r[r.length] = arr[i];
        }
        return r;
    },
    setReportState:function(data){
        var loadData = data.dataObject;
        var metadataColumns = loadData.metadataColumns;
        var indexFields = loadData.indexFields;
        var categoryFields = loadData.categoryFields||[];
        var rowTitleFields = loadData.rowTitleFields||[];
        var columnTitleFields = loadData.columnTitleFields||[];
        var zhiBiaoList = [];
        var dragWeiduList = [];
        var columnTitleFieldsList = [];
        var rowTitleFieldsList = [];
        var sortFields=loadData.sortFields || [];
        var topParameters=loadData.topParameters || [];
        for(var i=0;i<indexFields.length;i++){
            var z= null;
            var zbList,fieldName,itemName,name,statistical,type,typeName,customName,expression,cexpression,dataType,distinct;
            var reg = /合计/g;
            indexFields[i].name = indexFields[i].name.replace(reg,'求和');
            switch (indexFields[i].statistical) {
                case 'SUM':
                    zbList = 'zhibiao_hj_list';
                    break;
                case 'AVG':
                    zbList = 'zhibiao_pj_list';
                    break;
                case 'MAX':
                    zbList = 'zhibiao_max_list';
                    break;
                case 'MIN':
                    zbList = 'zhibiao_min_list';
                    break;
                case 'COUNT':
                    zbList = (indexFields[i].distinct=='distinct')?'zhibiao_weidujishu_list':'zhibiao_jishu_list';
                    break;
                default:
                    zbList = 'zhibiaoList';
            }
            var expression=indexFields[i].expression;
            if(expression){
                zbList = 'zhibiao_jisuanlie_list';
            }
            //计算列
            if(zbList=="zhibiao_jisuanlie_list"){
                fieldName = indexFields[i].fieldName;
                name = indexFields[i].name;
                expression = indexFields[i].expression;
                statistical = "";
                type = 8;
                customName = indexFields[i].customName||'';
                itemName=indexFields[i].name;
                distinct=indexFields[i].distinct;
            }else{
                for(var j=0;j<metadataColumns[zbList].length;j++){
                    if(indexFields[i].name==metadataColumns[zbList][j].name){
                        fieldName = metadataColumns[zbList][j].fieldName;
                        name = metadataColumns[zbList][j].name;
                        typeName = metadataColumns[zbList][j].typeName;
                        itemName = metadataColumns[zbList][j].itemName;
                        statistical = metadataColumns[zbList][j].statistical;
                        type = metadataColumns[zbList][j].type;
                        customName = indexFields[i].customName||'';
                        dataType=metadataColumns[zbList][j].dataType;
                        distinct=metadataColumns[zbList][j].distinct;
                        z = j;
                    }
                }
            }
            if(z!==null)
            metadataColumns[zbList].splice(z,1);
            var zhiBiaoFileds={
                    fieldName:fieldName,
                    itemName:itemName,
                    name:name,
                    statistical:statistical,
                    type:type,
                    typeName:typeName,
                    customName:customName||'',
                    dataType:dataType,
                    distinct:distinct
                }
            if(zbList=="zhibiao_jisuanlie_list"){
                zhiBiaoFileds.expression  = expression;
                zhiBiaoFileds.cexpression = indexFields[i].cexpression;
				zhiBiaoFileds.fxSign      = indexFields[i].fxSign;
				zhiBiaoFileds.errMessage  = indexFields[i].errMessage;
            }
            if(indexFields[i].pageFormater){
                zhiBiaoFileds.pageFormater=indexFields[i].pageFormater;
            }
            zhiBiaoList.push(zhiBiaoFileds);
        }
        var weiduList = [];
        if(loadData.category=='INDEX'){
            for(var i=0;i<rowTitleFields.length;i++){
                var w = null;
                for(var j=0;j<metadataColumns.weiduList.length;j++){
                    if(rowTitleFields[i].name==metadataColumns.weiduList[j].name){
                        weiduList.push({
                            fieldName:metadataColumns.weiduList[j].fieldName,
                            name:metadataColumns.weiduList[j].name,
                            type:1,
                            customName:rowTitleFields[i].customName||'',
                            level: rowTitleFields[i].level,
                            groupType:metadataColumns.weiduList[j].groupType||'',
                            groupLevels:metadataColumns.weiduList[j].groupLevels||[],
                            dimensionId:metadataColumns.weiduList[j].dimensionId||'',
                        });
                        w = j;
                    }
                }
                if(w!==null)
                metadataColumns.weiduList.splice(w,1);
            }
            if(loadData.type=='CROSS'){
                for(var i=0;i<columnTitleFields.length;i++){
                    var w = null;
                    for(var j=0;j<metadataColumns.weiduList.length;j++){
                        if(columnTitleFields[i].name==metadataColumns.weiduList[j].name){
                            columnTitleFieldsList.push({
                                fieldName:metadataColumns.weiduList[j].fieldName,
                                name:metadataColumns.weiduList[j].name,
                                type:1,
                                customName:columnTitleFields[i].customName||'',
                                level: columnTitleFields[i].level||metadataColumns.weiduList[j].name,
                                groupType:metadataColumns.weiduList[j].groupType||'',
                                groupLevels:metadataColumns.weiduList[j].groupLevels||[],
                            });
                            w = j;
                        }
                    }
                    if(w!==null)
                    metadataColumns.weiduList.splice(w,1);
                }
                rowTitleFieldsList = weiduList;
            }
        }else{
            for(var i=0;i<categoryFields.length;i++){
                var w = null;
                for(var j=0;j<metadataColumns.weiduList.length;j++){
                    if(categoryFields[i].name==metadataColumns.weiduList[j].name){
                        var obj={
                                fieldName:metadataColumns.weiduList[j].fieldName,
                                name:metadataColumns.weiduList[j].name,
                                type:1,
                                customName:categoryFields[i].customName||'',
                                level: categoryFields[i].level||metadataColumns.weiduList[j].name,
                                groupType:metadataColumns.weiduList[j].groupType||'',
                                groupLevels:metadataColumns.weiduList[j].groupLevels||[],
                                dimensionId:metadataColumns.weiduList[j].dimensionId||'',
                            }
                        var dimensionDataType=metadataColumns.weiduList[j].dimensionDataType;
                        if(dimensionDataType && dimensionDataType=="REGION"){
                            obj.dimensionDataType=dimensionDataType;
                        }
                        weiduList.push(obj);
                        w = j;
                    }
                }
                if(w!==null)
                metadataColumns.weiduList.splice(w,1);
            }
        }
        zhiBiaoList = ChartTypeStore.checkIndexFields(zhiBiaoList,ChartTypeStore.getLength(loadData.type).zhibiaoLen,weiduList);
        var state = {
            loaded: true,
            hasInitial: true,
            metadataId: loadData.metadataId,
            weiduList:weiduList,
            zhiBiaoList:zhiBiaoList,
            columnTitleFieldsList:columnTitleFieldsList,
            rowTitleFieldsList: rowTitleFieldsList,
            filterData:metadataColumns.filterData,
            filterFields:loadData.filterFields,
            reportType:loadData.type,
            reportCategory:loadData.category,
            tableName: loadData.name,
            ///sortFields: [],
            dragWeiduList:metadataColumns.weiduList,
            dragZhibiaoList:metadataColumns.zhibiaoList,
            dragHejiList:metadataColumns.zhibiao_hj_list,
            dragPingjunList:metadataColumns.zhibiao_pj_list,
            dragMaxList:metadataColumns.zhibiao_max_list,
            dragMinList:metadataColumns.zhibiao_min_list,
            dragJishuList:metadataColumns.zhibiao_jishu_list,
            dragJisuanlieList:metadataColumns.zhibiao_jisuanlie_list,
            dragWeiduJishuList:metadataColumns.zhibiao_weidujishu_list,
            disabledState:false,
            metadataName:metadataColumns.name,
            sortFields:sortFields,
            rowTitleFields:rowTitleFields,
            categoryFields:categoryFields
        }
        if(state.reportCategory=='INDEX'){
            state.formulas = this.getFormulas(loadData.formulas||[],state.reportType);
        }
        return state;
    },
     setSaveModel:function(state,fields){
        if(state.reportCategory=='INDEX')
            state = this.setFieldsCustomName(state,fields);
        var model = {
            "report": {
                "id": state.reportId||'',
                "name": state.tableName,
                "category":state.reportCategory,
                "type":state.reportType,
                "parentId":state.parentId,
                "metadataId": state.metadataId,
                "sortFields":state.sortFields,
                "filterFields":state.filterFields
            }
        };
        if (!model.report.sortFields) {
        	model.report.sortFields = [];
		}
        var indexFields = [],categoryFields = [],rowTitleFields = [],columnTitleFields = [];
        var fieldLen = ChartTypeStore.getLength(state.reportType);
        if (state.reportCategory == 'INDEX') {
            if(state.reportType=='CROSS'){
                for(let i=0;i<state.rowTitleFieldsList.length;i++){
                    let rowTitleObj={name:state.rowTitleFieldsList[i].name,customName:state.rowTitleFieldsList[i].customName||''}
                    let type=state.rowTitleFieldsList[i].groupType;
                    if ((type=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == type)) {
                        rowTitleObj.type=type;
                        rowTitleObj.level=state.rowTitleFieldsList[i].level;
                    }
                    rowTitleFields.push(rowTitleObj);
                }
            }else{
                for(let i=0;i<state.weiduList.length;i++){
                    let rowTitleObj={name:state.weiduList[i].name,customName:state.weiduList[i].customName||''}
                    let type=state.weiduList[i].groupType;
                    if ((type=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == type)) {
                        rowTitleObj.type=type;
                        rowTitleObj.level=state.weiduList[i].level;
                    }
                    rowTitleFields.push(rowTitleObj);
                }
            }
            for(var i=0;i<state.columnTitleFieldsList.length;i++){
                var columnFieldsObj={
                    name:state.columnTitleFieldsList[i].name,
                    customName:state.columnTitleFieldsList[i].customName||''
                }
                var type=state.columnTitleFieldsList[i].groupType;
                if ((type=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == type)) {
                    columnFieldsObj.type=type;
                    columnFieldsObj.level=state.columnTitleFieldsList[i].level;
                }
                columnTitleFields.push(columnFieldsObj)
            }
            model.report.columnTitleFields = columnTitleFields;
            model.report.rowTitleFields = rowTitleFields;
            model.report.formulas = this.setFormulas(state.reportType,state.formulas);
            for(var i=0;i<state.zhiBiaoList.length;i++){
                var zhiBiaoIndex={name:state.zhiBiaoList[i].name,statistical:state.zhiBiaoList[i].statistical,customName:state.zhiBiaoList[i].customName||''};
                if(state.zhiBiaoList[i].distinct){
                    zhiBiaoIndex.distinct = state.zhiBiaoList[i].distinct;
                }
                if(state.zhiBiaoList[i].type==8){
                    zhiBiaoIndex.expression  = state.zhiBiaoList[i].expression;
                    zhiBiaoIndex.cexpression = state.zhiBiaoList[i].cexpression;
					zhiBiaoIndex.errMessage  = state.zhiBiaoList[i].errMessage;
					zhiBiaoIndex.fxSign      = state.zhiBiaoList[i].fxSign;
                }
                if(state.zhiBiaoList[i].pageFormater){
                    zhiBiaoIndex.pageFormater=state.zhiBiaoList[i].pageFormater;
                }
                indexFields.push(zhiBiaoIndex);
            }
            //kpi 指标超过2个删除
            if(state.reportType=='KPI' && state.zhiBiaoList.length>fieldLen.zhibiaoLen){
                indexFields.splice(fieldLen.zhibiaoLen);
            }
        } else {
            var weiduLen = state.weiduList.length>fieldLen.weiduLen?fieldLen.weiduLen:state.weiduList.length;
            if(fieldLen.weiduLen==''){
                weiduLen = state.weiduList.length;
            }
            for(var i=0;i<weiduLen;i++){
                var categoryFieldsObj={name: state.weiduList[i].name,customName : state.weiduList[i].customName}
                var type=state.weiduList[i].groupType;
                if ((type=="GROUP_TITLE_FIELD") || ("GROUP_DATE_TITLE_FIELD" == type)) {
                    categoryFieldsObj.type=type;
                    categoryFieldsObj.level=state.weiduList[i].level;
                }
                categoryFields.push(categoryFieldsObj);
            }
            model.report.categoryFields = categoryFields;
            var zhibiaoLen = state.zhiBiaoList.length>fieldLen.zhibiaoLen?fieldLen.zhibiaoLen:state.zhiBiaoList.length;
            if(fieldLen.zhibiaoLen==''){
                zhibiaoLen = state.zhiBiaoList.length;
            }
            for(var i=0;i<zhibiaoLen;i++){
                var zhiBiaoIndex={name:state.zhiBiaoList[i].name,statistical:state.zhiBiaoList[i].statistical,renderas:state.reportType,customName:state.zhiBiaoList[i].customName}
                if(state.zhiBiaoList[i].distinct){
                    zhiBiaoIndex.distinct = state.zhiBiaoList[i].distinct;
                }
                if(state.zhiBiaoList[i].type==8){
                    zhiBiaoIndex.expression  = state.zhiBiaoList[i].expression;
                    zhiBiaoIndex.cexpression = state.zhiBiaoList[i].cexpression;
					zhiBiaoIndex.fxSign      = state.zhiBiaoList[i].fxSign;
					zhiBiaoIndex.errMessage  = state.zhiBiaoList[i].errMessage;
                }
	            if (state.zhiBiaoList[i].pageFormater) {
		            zhiBiaoIndex.pageFormater = state.zhiBiaoList[i].pageFormater;
	            }
                indexFields.push(zhiBiaoIndex);
            }
        }
        if(state.reportType=="ScrollColumn2D" || state.reportType=='ScrollLine2D' || state.reportType=='TREE' || state.reportType=='CATEGORY'){
            var compareInfo=CompareStore.setCompareInfo(state.compareData,state.zhiBiaoList,true,state.reportCategory);
            model.report.compareInfo=compareInfo;
            model.report.compare=state.compare;
        }
        model.report.indexFields = indexFields;
        return model;
    },
    setFieldsCustomName:function(state,fields){
        if(!fields){
            return state;
        }
        for(var n=0;n<fields.length;n++){
            var field = fields[n];
            if(field.dmType=='dimension'){
                var weiduList = state.weiduList;
                for(var i=0;i<weiduList.length;i++){
                    if(field.name==weiduList[i].name || field.groupName==weiduList[i].name){
                        weiduList[i].customName = field.customName;
                    }
                }
            }else{
                var zhiBiaoList = state.zhiBiaoList;
                for(var i=0;i<zhiBiaoList.length;i++){
                    if(field.name==zhiBiaoList[i].name){
                        zhiBiaoList[i].customName = field.customName;
                    }
                }
            }
        }
        return state;
    },
    getFormulas:function(formulasData,reportType){
        var formulas;
        if(reportType=='CROSS'){
            /* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理，增加crossTable标记 */
            formulas = {
                SUM:[{name:'全表横向',customName:'all',selected:false,crossTable:true},{name:'全表纵向',customName:'all',selected:false,crossTable:true}],
                AVG:[{name:'全表横向',customName:'all',selected:false,crossTable:true},{name:'全表纵向',customName:'all',selected:false,crossTable:true}],
                MAX:[{name:'全表横向',customName:'all',selected:false,crossTable:true},{name:'全表纵向',customName:'all',selected:false,crossTable:true}],
                MIN:[{name:'全表横向',customName:'all',selected:false,crossTable:true},{name:'全表纵向',customName:'all',selected:false,crossTable:true}],
                COUNT:[{name:'全表横向',customName:'all',selected:false,crossTable:true},{name:'全表纵向',customName:'all',selected:false,crossTable:true}]
            }
        }else{
            formulas = {
                'SUM':[{ name: '全部', fieldName: 'all', selected: false }],
                'AVG':[{ name: '全部', fieldName: 'all', selected: false }],
                'MAX':[{ name: '全部', fieldName: 'all', selected: false }],
                'MIN':[{ name: '全部', fieldName: 'all', selected: false }],
                'COUNT':[{ name: '全部', fieldName: 'all', selected: false }]
            }
        }
        for(let i=0;i<formulasData.length;i++){
            if(formulasData[i].type=='Stat'){
                formulas[formulasData[i].statMode][0].selected = true;
            }
            if(formulasData[i].type=='TreeStat'){
                for(let j=0;j<formulasData[i].fields.length;j++){
                  formulas[formulasData[i].statMode].push({
                    name:formulasData[i].fields[j].name,
                    customName:formulasData[i].fields[j].customName,
                    selected:true
                  })
                }
            }
            if(formulasData[i].type=='VStat'){
                formulas[formulasData[i].statMode][1].selected = true;
            }
        }
        return formulas;
    },
    setFormulas:function(type,formulas){
        var formulasData = [];
        for(var n in formulas){
            if(formulas[n][0].selected){
                formulasData.push({
                    "type": "Stat",
                    "statMode":n
                })
            }
            if(type=='TREE'){
                var item = {"statMode":n,"type": "TreeStat","fields": [] };
                for(var i=1;i<formulas[n].length;i++){
                    if(formulas[n][i].selected){
                       item.fields.push({name:formulas[n][i].name,customName:formulas[n][i].customName});
                    }
                }
                if(item.fields.length>0){
                   formulasData.push(item);
                }
            }
            if(type=='CROSS'){
               if(formulas[n][1]&&formulas[n][1].selected){
                    formulasData.push({
                        "type": "VStat",
                        "statMode":n
                    })
                }
            }
        }
        return formulasData;
    },
    setFormulasList:function(type,formulas,weiduList){
        var data = {
            SUM:[{name:'全表',customName:'all',selected:formulas?formulas.SUM[0].selected:false}],
            AVG:[{name:'全表',customName:'all',selected:formulas?formulas.AVG[0].selected:false}],
            MAX:[{name:'全表',customName:'all',selected:formulas?formulas.MAX[0].selected:false}],
            MIN:[{name:'全表',customName:'all',selected:formulas?formulas.MIN[0].selected:false}],
            COUNT:[{name:'全表',customName:'all',selected:formulas?formulas.COUNT[0].selected:false}]
        }
        
        if(type=='CROSS'){
            data = {
                SUM:[{
                    name:'全表横向',customName:'all',selected:formulas?formulas.SUM[0].selected:false,crossTable:true
                },{
                    name:'全表纵向',customName:'all',selected:formulas?formulas.SUM[1].selected:false,crossTable:true
                }],
                AVG:[{
                    name:'全表横向',customName:'all',selected:formulas?formulas.AVG[0].selected:false,crossTable:true
                },{
                    name:'全表纵向',customName:'all',selected:formulas?formulas.AVG[1].selected:false,crossTable:true
                }],
                MAX:[{
                    name:'全表横向',customName:'all',selected:formulas?formulas.MAX[0].selected:false,crossTable:true
                },{
                    name:'全表纵向',customName:'all',selected:formulas?formulas.MAX[1].selected:false,crossTable:true
                }],
                MIN:[{
                    name:'全表横向',customName:'all',selected:formulas?formulas.MIN[0].selected:false,crossTable:true
                },{
                    name:'全表纵向',customName:'all',selected:formulas?formulas.MIN[1].selected:false,crossTable:true
                }],
                COUNT:[{
                    name:'全表横向',customName:'all',selected:formulas?formulas.COUNT[0].selected:false,crossTable:true
                },{
                    name:'全表纵向',customName:'all',selected:formulas?formulas.COUNT[1].selected:false,crossTable:true
                }]
            }
        }
        if(type=='TREE'){
            for(var i=0;i<weiduList.length;i++){
                data.SUM.push({name:weiduList[i].name,customName:weiduList[i].customName,selected:false});
                data.AVG.push({name:weiduList[i].name,customName:weiduList[i].customName,selected:false});
                data.MAX.push({name:weiduList[i].name,customName:weiduList[i].customName,selected:false});
                data.MIN.push({name:weiduList[i].name,customName:weiduList[i].customName,selected:false});
                data.COUNT.push({name:weiduList[i].name,customName:weiduList[i].customName,selected:false});
                if(formulas){
                    for(var j=0;j<formulas.SUM.length;j++){
                        if(weiduList[i].name==formulas.SUM[j].name){
                            data.SUM[(i+1)].selected = formulas.SUM[j].selected;
                        }
                    }
                    for(var j=0;j<formulas.AVG.length;j++){
                        if(weiduList[i].name==formulas.AVG[j].name){
                            data.AVG[(i+1)].selected = formulas.AVG[j].selected;
                        }
                    }
                    for(var j=0;j<formulas.MAX.length;j++){
                        if(weiduList[i].name==formulas.MAX[j].name){
                            data.MAX[(i+1)].selected = formulas.MAX[j].selected;
                        }
                    }
                    for(var j=0;j<formulas.MIN.length;j++){
                        if(weiduList[i].name==formulas.MIN[j].name){
                            data.MIN[(i+1)].selected = formulas.MIN[j].selected;
                        }
                    }
                    for(var j=0;j<formulas.COUNT.length;j++){
                        if(weiduList[i].name==formulas.COUNT[j].name){
                            data.COUNT[(i+1)].selected = formulas.COUNT[j].selected;
                        }
                    }
                }
            }
        }
        return data;
    },
    getTableViewData:function(state,rows,reportData){
        var rowsData = rows.slice(0,state.sliceIndex*state.sliceSize);
        reportData.pages[0].rows = rowsData;
        return reportData;
    },
    setReportViewData:function(dataObject){
        var reportData = [];
        if(!dataObject){
            return null;
        }
        for(var i=0;i<dataObject.pages.length;i++){
            reportData = reportData.concat(dataObject.pages[i].rows);
        }
        return reportData;
    },
    //返回引用的驾驶舱名称
    getUsedDashboards: function(id) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dashboard/design/getUsedDashboards',
                type: 'POST',
                contentType: 'application/json',
                httpUrl:WEB_API.GET_USED_DASHBOARDS.replace(':id',id),
                //param: '&reportId=' + id,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    getDownLoadListHandle:function(){//获取用户下载了哪些报表的消息列表的接口
        return new Promise((resolve,reject)=>{
            App.ajax({
                url: '/services/report/runtime/getExportExcels',
                type: 'POST',
                contentType: 'application/json',
                callback: function(result) {
                    if(result.dataObject.length>0){
                        for (let i = 0; i < result.dataObject.length; i++) {
                            if(result.dataObject[i].status == 'success'){
                                if(result.dataObject[i].deleteDays == 0){
                                    result.dataObject[i].fileState = '此文件已删除'
                                    result.dataObject[i].disabled = true;
                                    if(result.dataObject[i].type == 'excel'){
                                        result.dataObject[i].type = 'icexcel24px';
                                    }
                                    if(result.dataObject[i].type == 'csv'){
                                        result.dataObject[i].type = 'iccsv24px';
                                    }
                                    if(result.dataObject[i].type == 'png'){
                                        result.dataObject[i].type = 'icpng24px';
                                    }
                                }else{
                                    result.dataObject[i].fileState = '此文件将在'+result.dataObject[i].deleteDays+'天后删除'
                                    result.dataObject[i].disabled = false;
                                    if(result.dataObject[i].type == 'excel'){
                                        result.dataObject[i].type = 'icexcel24px';
                                    }
                                    if(result.dataObject[i].type == 'csv'){
                                        result.dataObject[i].type = 'iccsv24px';
                                    }
                                    if(result.dataObject[i].type == 'png'){
                                        result.dataObject[i].type = 'icpng24px';
                                    }
                                }
                            } else if ((result.dataObject[i].status == 'start') ||
                                       (result.dataObject[i].status == 'wait')) {
                                result.dataObject[i].fileState = '文件下载中...';
                                result.dataObject[i].disabled = true;
                                if(result.dataObject[i].type == 'excel'){
                                    result.dataObject[i].type = 'icexcel24px';
                                }
                                if(result.dataObject[i].type == 'csv'){
                                    result.dataObject[i].type = 'iccsv24px';
                                }
                                if(result.dataObject[i].type == 'png'){
                                    result.dataObject[i].type = 'icpng24px';
                                }
                            }
                        }
                    }
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    validateExpression:function(areaInfo) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/validateExpression',
                httpUrl: WEB_API.VALIDATE_EXPRESSION_URL,
                type: 'POST',
                data: areaInfo,
                contentType: 'application/json',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject('网络异常');
                }
            })
        })
    },
    validataExpressionAll:function(areaInfo,zhibiaoList){
        var promiseList = [];
        var indexFields=App.deepClone(areaInfo.areaInfo.indexFields);
        var indexFiedls2=App.deepClone(indexFields);
        for(var i=0;i<indexFields.length;i++){
            var selectedIndexFields=[];
            if(indexFields[i].type==8){
                promiseList.push(this.validateExpression(areaInfo));
            }else{
                selectedIndexFields.push(indexFields[i]);
            }
        }
        return new Promise((resolve, reject) => {
            Promise.all(promiseList).then(function(arr) {
                resolve(arr);
            });
        });
    },
    tableCustomArr:[],
    huizongTableCustomName:function(custonName){
        this.tableCustomArr=custonName;
        return this.tableCustomArr
    },
    getReportInfoHandle:function (reportId) {//获取得到报表数据的参数的方法
        var _this = this;
        var reportInfoObj={};
        return new Promise((resolve, reject)=>{
            this.getAreaInfo(reportId).then(function(result){
                if(result.success){
                    reportInfoObj.getAreaInfo = result.dataObject;
                    resolve(reportInfoObj);
                }else{
                    resolve(result);
                }
            }).catch(function(error){
                console.log(error);
            })
        })
    },
    deleteTableCustomName:function(delItem){
        let newCustomCols = [];
        let customCols = this.tableCustomArr;
        for(let i=0; i<customCols.length; i++){
            if(customCols[i].name != delItem.name){
                newCustomCols.push(customCols[i]);
            }
        }
        this.tableCustomArr=newCustomCols;
    },
    setIndexSortTopParam:function(data){
      var sortTopParam={
           sortFields:data.dataObject.sortFields || [],
           maxMin:[],
           topParameters:false,
       };
       var filterFields=data.dataObject.filterFields;
       for(var i=0;i<filterFields.length;i++){
           if(filterFields[i].type=="INDEX_FIELD" ||filterFields[i].type=="COMPARE_INDEX_FIELD"){
               sortTopParam.maxMin.push(filterFields[i])
           }
       }
       if(data.dataObject.topParameters){
            if(data.dataObject.topParameters.length>0){
                sortTopParam.topParameters=data.dataObject.topParameters;
            }
       }
       if(sortTopParam.maxMin.length==0){
           sortTopParam.maxMin=false;
       }
       if(sortTopParam.sortFields.length==0){
           sortTopParam.sortFields=false;
       }
       return sortTopParam;
    },
    delTopParameters:function(model){
        delete model.areaInfo.topParameters;
        model.areaInfo.sortFields=[];
        var filterFields= model.areaInfo.filterFields;
        for(var i=0;i<filterFields.length;){
            if(filterFields[i].type=="INDEX_FIELD"){
                filterFields.splice(i,1);
            }else{
                i++;
            }
        }
        return model;
    },
    setSaveIndexParam:function(model,parameters){
      if(model.report.category=="INDEX"){
            if(model.report.indexFields.length==0 || !parameters || JSON.stringify(parameters)=="{}"){
               model.report.sortFields=[];
               delete model.report.topParameters;
            }
            if(parameters.sortFields){
                model.report.sortFields=parameters.sortFields;
            }else{
                model.report.sortFields=[];
            }
            if(parameters.topParameters){
                model.report.topParameters=parameters.topParameters;
            }
            if(parameters.maxMin){
                this.emptyZhibiaoFilterFields(model.report.filterFields);
                if(model.report.filterFields.length==0){
                    model.report.filterFields=parameters.maxMin;
                }else{
                    model.report.filterFields=model.report.filterFields.concat(parameters.maxMin);
                }

            }
        }
        return model;
    },
    setSaveIndexParam2:function(model,sortFields,topParameters,maxMin){
      if(model.report.category=="INDEX" || model.report.type=="ScrollColumn2D"){
            if(sortFields){
                model.report.sortFields=sortFields;
            }else{
                model.report.sortFields=[];
            }
            if(topParameters){
                model.report.topParameters=topParameters;
            }else{
                 delete model.report.topParameters;
            }
            if(maxMin){
                 model.report.filterFields=this.emptyZhibiaoFilterFields(model.report.filterFields);
                 
                if(model.report.filterFields.length==0){
                    model.report.filterFields=maxMin;
                }else{
                  //分析指标筛选后，筛选条件保存不上
                    model.report.filterFields=model.report.filterFields.concat(maxMin);
                }
            }else{
                var maxMinFilterField = this.emptyZhibiaoFilterFields(model.report.filterFields);
                    model.report.filterFields=maxMinFilterField;
            }
        }
        return model;
    },
    initZhibiaoFilters:function(model){ //获取图形指标排序数据 驾驶舱
        if(!model){
           return {
                maxMin:false,
                sortFields:false,
                topParameters:false
            } 
        }
        var sortFields=model.sortFields||[];
        var topParameters=model.topParameters||[];
        var filterFields= model.filterFields||[];
        var maxMin=[];
        for(var i=0;i<filterFields.length;i++){
            if(filterFields[i].type=="INDEX_FIELD"){
                maxMin.push(filterFields[i]);
            }
        }
        if(maxMin.length==0){maxMin=false;}
        if(sortFields.length==0){sortFields=false;}
        if(topParameters.length==0){topParameters=false;}
        var param={
            maxMin:maxMin,
            sortFields:sortFields,
            topParameters:topParameters
        }
        return param;
    },
    delIndexSortTopParam:function(param,zhibiao){
        var top=true,sort=true,max=true;
        for(var i=0;i<zhibiao.length;i++){
            var name=zhibiao[i].name;
            if(param.topParameters){
              var n=param.topParameters[0].name||param.topParameters[0].field;
                if(name==n){
                    top=false;
                }
            }
            if(param.maxMin){
                if(name==param.maxMin[0].name){
                    max=false;
                }
            }
            if(param.sortFields){
                var n=param.sortFields[0].name||param.sortFields[0].field;
                if(name==n){
                    sort=false;
                }
            }
        }
        if(top){ param.topParameters=false;}
        if(sort){param.sortFields=false;}
        if(max){ param.maxMin=false;}
        return param;
    },
    changeSortTopParam:function(parameters){
        var sortTopParam={};
        if(parameters.topParameters){
            sortTopParam.topParameters=parameters.topParameters;
            sortTopParam.maxMin=false;
        }
        if(parameters.sortFields){
            sortTopParam.sortFields=parameters.sortFields;
        }
        if(parameters.maxMin){
            sortTopParam.maxMin=parameters.maxMin;
            sortTopParam.topParameters=false;
        }
        return sortTopParam;
    },
    getIndexFieldsMaxMinArr:function(filterFields){
        var maxMin=[];
        for(var i=0;i<filterFields.length;i++){
            if(filterFields[i].type=="INDEX_FIELD" || filterFields[i].type=="COMPARE_INDEX_FIELD"){
                maxMin.push(filterFields[i]);
            }
        }
        if(maxMin.length==0){
            maxMin=false;
        }
        return maxMin;
    },
    setSaveReportType:function(model,parameters){
        var changeType=false;
        if(parameters.sortFields ||　parameters.topParameters　|| parameters. minMaxParameters){
          changeType=true;
        }
        if(model.report.type=="TREE" && changeType){
            model.report.type="CATEGORY";
        }
        return model;
    },
    zhibiaosetAreaFilter:function(jsonData){
      var filter = jsonData.areaInfo.filterFields;
      for(var i=0;i<filter.length;){
         if(filter[i].type=='INDEX_FIELD'){
           filter.splice(i,1);
         }else{
           i++;
         }
      }
      return jsonData;
    },
    setDrillFilter:function(drilDownFilter,newDrilDownFilter,filterFields,weiduList){
        var dimensionId=newDrilDownFilter.dimensionId;
        var sign=false;
        var filterField = {
            "name": "",
            "valueType": "STRING",
            "dbField": "",
            "value": newDrilDownFilter.drillFilter,
            "selected": true,
            "items": [],
            "groupType":"GROUP_TITLE_FIELD",
            "dimensionId":dimensionId,
            "pattern": ""
        };
        for(var i=0;i<weiduList.length;i++){
            if(dimensionId==weiduList[i].dimensionId){
                filterField.name=weiduList[i].fieldName;
                break;
            }
        }
        for(var i=0;i<filterFields.length;i++){
            var filter=filterFields[i];
            if(filter.groupType=="GROUP_TITLE_FIELD"){
                if(dimensionId==filter.dimensionId){
                    if(newDrilDownFilter.drillFilter.length==0){
                        filterFields.splice(i,1);
                    }
                    filter.value=newDrilDownFilter.drillFilter;
                    sign=true;
                    break;
                }
            }
        }
        if(!sign ){
            if(newDrilDownFilter.drillFilter.length>0){
                if(filterFields.length==0 && newDrilDownFilter.back){
                    return filterFields;
                }
                filterFields.push(filterField);
            }
        }
        return filterFields;
    },
    setRowTitleFields:function(weiduList,rowTitle){
        var rowTitleFields=[];
        for(var i=0;i<weiduList.length;i++){
            for(var j=0;j<rowTitle.length;j++){
                if(weiduList[i].name==rowTitle[j].name){
                    rowTitleFields.push(rowTitle[j]);
                }
            }
        }
        return rowTitleFields;
    },
    setWeiduList:function(weidulist,rowTitleFields){
        var weiList=[];
        if(!weidulist){
            return weiList;
        }
        for(var i=0;i<rowTitleFields.length;i++){
            for(var j=0;j<weidulist.length;j++){
                if(rowTitleFields[i].name==weidulist[j].name){
                    weidulist[j].level=rowTitleFields[i].level;
                    weiList.push(weidulist[j]);
                }
            }
        }
        return weiList;
    },
    zhibiaoSortSetFormulas:function(formulas){
        // 修改切换表格类型时汇总表显示的值
        if(formulas){
            for(var i=0;i<formulas.length;){
                if(formulas[i].fields){
                    formulas.splice(i,1);
                }else{
                    i++
                }
            }
        }
        return formulas;
    },
    sortSetFormulasList:function(formulasList,sortParameters){
        if(sortParameters){
            var sum=formulasList.SUM;
            for(var i=0;i<sum.length;i++){
                if(sum[i].customName!='all'){
                    sum[i].selected=false;
                }
            }
        }
        return formulasList;
    },
    isWeiSort:function(rowTitleFields,sortFields){
        var sortFields=sortFields||[];
        for(var i=0;i<rowTitleFields.length;i++){
            for(var j=0;j<sortFields.length;j++){
                if(rowTitleFields[i].name==sortFields[j].field){
                    return true;
                }
            }
        }
        return false;
    },
    setTableType:function(jsonData,reportType,topParameters,zhibiaoMinMax,switchScenes){
        var rowTitleFields=jsonData.areaInfo.rowTitleFields;
        var sortFields=jsonData.areaInfo.sortFields;
        var type=reportType;
        if(reportType == "TREE" ){
            if(  sortFields &&  sortFields.length>0){
                var iswei=this.isWeiSort(rowTitleFields,sortFields);
                if(!iswei){
                    type="CATEGORY";
                }
            }
            if( topParameters ||  zhibiaoMinMax){
                type="CATEGORY";
            }
        }
        if(switchScenes){
            type=reportType;
        }
        jsonData.areaInfo.type=type;
        return jsonData;
    },
    setNewtype:function( reportType, indexFields, sortFields,topParameters,zhibiaoMinMax,dashboardStep){
         var type = reportType;
         var zhibiaoMinMax= zhibiaoMinMax
         if(reportType != "BASE" && reportType == "TREE"){
           for( var i=0;i<indexFields.length;i++){
             if(  sortFields ){
               if(indexFields[i].name==sortFields[0].field &&  sortFields[0].method != "NORMAL"){
                  return {type:"CATEGORY",isZhibiao:true}
               }
             }
             if(topParameters ||  zhibiaoMinMax ){
                return {type:"CATEGORY",isZhibiao:true}
             }
           }
           if(dashboardStep){
                if(zhibiaoMinMax.length==0){
                 zhibiaoMinMax =false
                }
           }
        }
          return {type:type,isZhibiao:false}
     },
    setsortFieldsIndex:function(fields){
        var sortFieldsIndex;
        for(var i=0;i<fields.length;i++){
            if(fields[i].sortMethod=="ASC" || fields[i].sortMethod=="DESC"){
                sortFieldsIndex = i;
                return sortFieldsIndex;
            }
        }
    },
    ceatCompareInfo:function(allWeiduList){
        var compareList=[];
        for(var i=0;i<allWeiduList.length;i++){
            compareList.push({
                "dimensionName": allWeiduList[i].name,
                "selected": false,
                "selectedCompare": false,
                "selectedScenes":[],
                "scenes":[],
                "compareIndexFields":[],
            });
        }
        return {
            compareDimension:compareList
        }
    },
    createCompareList:function(allWeiduList,metadataId){
        var compareList=[];
        var selectedNoCompare=true;
        for(var i=0;i<allWeiduList.length;i++){
            allWeiduList[i].popData=[];
            allWeiduList[i].metadataId=metadataId;
            compareList.push({
                "dimensionName": allWeiduList[i].name,
                "selected": false,
                "selectedCompare": false,
                "selectedScenes":[],
                "scenes":[],
                "compareIndexFields":[],
                "weiItem":allWeiduList[i]
            });
        }
        compareList=this.concatNoCompare(compareList);
        compareList=this.pushAllCompareScene(compareList);
        return compareList;
    },
    concatNoCompare:function(compareList){
        var selectedNoCompare=true;
        for(var i=0;i<compareList.length;i++){
            if(compareList[i].selected){
                selectedNoCompare=false;
                break;
            }
        }
        compareList.unshift({
            "dimensionName": "无对比",
            "sceneName":"无对比",
            "scenes":[],
            "type":"nocompare",
            "selected": selectedNoCompare,
            "selectedScenes":[],
            "compareIndexFields":[],
            "selectedCompare": !selectedNoCompare,
        });
        return compareList;
    },
    initCompareData:function(compareInfo,allWeiduList,weiduList,metadataId){
        var compareInfo=App.deepClone(compareInfo);
        var compareDimension=compareInfo.compareDimension;
        compareDimension=this.concatNoCompare(compareDimension);
        compareDimension = this.weiItemJoinCompareList(allWeiduList,compareDimension,metadataId);
        compareDimension=this.pushAllCompareScene(compareDimension);
        compareDimension=this.setCompareDisableds(compareDimension,weiduList);
        return compareDimension;
    },
    setCompareDisableds:function(compareData,weiduList){
        var weiduList=App.deepClone(weiduList);
        for(var i=0; i<compareData.length;i++ ){
            compareData[i].disableds = false;
            for(var j=0;j<weiduList.length;j++){
                if(compareData[i].dimensionName == weiduList[j].name){
                    compareData[i].disableds = true;
                }
            }
        }
        return compareData
    },
    setCompareWeidulist:function(data){
        var data=App.deepClone(data);
        var metadataColumns=data.dataObject.metadataColumns;
        var compareInfo=data.dataObject.compareInfo;
        var metadataId=data.dataObject.metadataId;
        var compare =  data.dataObject.compare || false;
        var weiduList=metadataColumns.filterData;
        var compareDimension=compareInfo ? compareInfo.compareDimension : [];
        if(!compareInfo || compareDimension.length==0){
            compareDimension=this.createCompareList(weiduList,metadataId)
        }
        return {
            compareDimension:compareDimension,
            compare:compare
        };
    },
    pushAllCompareScene:function(compareDimension){ //添加场景 '对比'
        for(var i=0;i<compareDimension.length;i++){
            var scenes=compareDimension[i].scenes;
            var selectedCompare=false;
            var selectedScenes=compareDimension[i].selectedScenes;
            for(var j=0;j<scenes.length;j++){
                if(compareDimension[i].selectedCompare){
                    selectedCompare=true;
                    scenes[j].selected=false;
                }else{
                    for(var h=0;h<selectedScenes.length;h++){
                        scenes[j].selected=false;
                        if(scenes[j].sceneName==selectedScenes[h].name){
                            scenes[j].selected=true;
                        }
                    }
                }
            }
            scenes.unshift({
                "sceneName":"对比",
                "type":"isCompare",
                "displayInCompare":true,
                "selected":selectedCompare,
                "filterFields":[]
            })
        }
        return compareDimension;
    },
    weiItemJoinCompareList:function(allWeiduList,compareDimension,metadataId){
        var weiduList=App.deepClone(allWeiduList);
        for(var j=0; j<compareDimension.length;j++){
            for(var i=0; i<weiduList.length;i++){
                if(weiduList[i].name == compareDimension[j].dimensionName){
                    compareDimension[j].weiItem = weiduList[i];
                    compareDimension[j].weiItem.metadataId = metadataId;
                }
            }
        }
        return compareDimension;
    },
    getSelectedCompareWei:function(compareDimension,compare){
        if(!compareDimension && !compare){return [];}
        for(var i=0;i<compareDimension.length;i++){
            if(compareDimension[i].selected){
                return compareDimension[i];
            }
        }
    },
    getSelectedScene:function(selectedCompare){
        if(!selectedCompare){return false;}
        var scenes=selectedCompare.scenes ||[],
            selectedScenes=selectedCompare.selectedScenes;
            for(var i=0;i<scenes.length;i++){
                for(var j=0;j<selectedScenes.length;j++){
                    if(scenes[i].sceneName == selectedScenes[j].name){
                        scenes[i].selected=true;
                        return selectedCompare;
                    }
                }
            }
        return selectedCompare;
    },
    updateCompareDate:function(item,compareData,sign){
        var compareData=JSON.parse(JSON.stringify(compareData));
        for(var i=0;i<compareData.length;i++){
            compareData[i].selected=false;
            if(item.type=="nocompare"){
                compareData[0].selected=true;
            }else{
                if(compareData[i].dimensionName==item.dimensionName){
                    compareData[i].selected=true;
                    var scenes=compareData[i].scenes;
                    var selectedScenes=[];
                    for(var h=0;h<scenes.length;h++){
                        if(scenes[0].selected &&  scenes[0].type=='isCompare'){
                            if(h>0){
                                selectedScenes.push({
                                    name:scenes[h].sceneName
                                });
                            }
                        }else if(scenes[h].selected){
                            selectedScenes.push({
                                name:scenes[h].sceneName
                            });
                        }
                    }
                    compareData[i].selectedScenes=selectedScenes;
                    //点击列表 切换成 对比页签
                    if(sign=='clickCompare'){
                        compareData[i]=this.changeWeiduSelectedDuibi(compareData[i]);
                    }
                }
            }
        }
        return {compareData:compareData}
    },
    changeWeiduSelectedDuibi:function(selectedCompare){
        var scenes=selectedCompare.scenes;
        var selectedScenes=[];
        for(var i=0;i<scenes.length;i++){
            scenes[i].selected=false;
            if(i==0){
                scenes[0].selected=true;
            }else{
                selectedScenes.push({
                    name:scenes[i].sceneName
                });
            }
        }
        selectedCompare.selectedScenes=selectedScenes;
        return selectedCompare;
    },
    selectedNoCompare:function(selectedCompare){
        if(selectedCompare.type=="nocompare"){
            return true;
        }
        return false;
    },
    updatareportFilter:function(filterFields,zhibiaoMinMax){
        if(!zhibiaoMinMax){
            if(filterFields){
                for(var j=0;j<filterFields.length;){
                    if(filterFields[j].type == "INDEX_FIELD"){
                        filterFields.splice(j,1);
                    }else{
                        j++
                    }
                }
            }
        }
        return filterFields;
    },
    setFilterCompareScenesName:function(compareDimension){
        for(var i=0;i<compareDimension.length;i++){
            if(compareDimension[i].selected){
                return compareDimension[i].selectedScenes
            }
        }
    },
    updateSortParameters:function(rowTitleFields,thisSortParameters){
        var thisSortParameters = thisSortParameters;
        for(var i=0;i<rowTitleFields.length;i++){
            if(thisSortParameters && thisSortParameters.length>0){
                 if(rowTitleFields[i].name == thisSortParameters[0].field ){
                    return thisSortParameters;
                 }
            }
        }
        return false;
    },
    compareFilterdbFiels:function(indexFields,selectedScenes,thisdbName){
        var thisdbName = thisdbName;
         for(var i=0;i<indexFields.length;i++){
              for(var j=0;j<selectedScenes.length;j++){
                    var compareIndexFields = indexFields[i].name+':'+selectedScenes[j].name;
                 if(compareIndexFields == thisdbName ){
                    return  thisdbName=indexFields[i].itemName
                 }
              }
         }
         return thisdbName
      },
    emptyZhibiaofilter:function(jsonData,switchScenes,sortParameters,zhibiaoMinMax){
        //切换场景
        var filterFields=jsonData.areaInfo.filterFields;
        if(switchScenes){
            if(!this.isWeiSort(jsonData.areaInfo.rowTitleFields,sortParameters)){
                delete jsonData.areaInfo.sortFields;
            }
            delete jsonData.areaInfo.topParameters;
            filterFields=this.emptyZhibiaoFilterFields(jsonData.areaInfo.filterFields);
        }else{
            if(!zhibiaoMinMax){
                filterFields=this.emptyZhibiaoFilterFields(jsonData.areaInfo.filterFields);
            }
        }
        jsonData.areaInfo.filterFields=filterFields;
        return jsonData;
    },
    emptyZhibiaoFilterFields:function(filterFields){
        for(var j=0;j<filterFields.length;){
            if(filterFields[j].type == "INDEX_FIELD" || filterFields[j].type=="COMPARE_INDEX_FIELD" ){
                filterFields.splice(j,1);
            }else{
                j++
            }
        }
        return filterFields;
    },
    setCompareInfoToAreainfo:function(jsonData,compareInfo,compare){
        var type=jsonData.areaInfo.type;
        if(type=="ScrollColumn2D" || type=='ScrollLine2D' || type=='TREE' || type=='CATEGORY'){
            jsonData.areaInfo.compareInfo=compareInfo;
            jsonData.areaInfo.compare=compare;
        }
        return jsonData;
    },
    updataCompareSortTopParam:function(weiduList,parameters){
        var isWeidiSort = this.isWeiSort(weiduList,parameters)
        if(!isWeidiSort){
            return true
        }
    },
    updataSortTopParam:function(CompareNewcustName,maxMin){
       for(var i=0;i<CompareNewcustName.length;i++){
           if(maxMin){
               for(var j=0;j<maxMin.length;j++){
                   if(CompareNewcustName[i].index){
                       maxMin[j].dbField=CompareNewcustName[i].customName;
                       maxMin[j].name=CompareNewcustName[i].customName;
                   }
               }
           }
       }
       return maxMin
   },
   setFormulasUpdateZhibiaoFilter:function(state,editReportType,parameters){
        var rowTitleFields=state.rowTitleFields;
        var sortFields=parameters.sortFields;
        var isWeiSort=this.isWeiSort(rowTitleFields,sortFields);
        var parameters=parameters;
        if(editReportType=="TREE"){
            if(!isWeiSort){
                parameters.sortFields=false;
            }
            parameters.maxMin=false;
            parameters.topParameters=false;
        }
        return parameters;
   },
    setZhibiaoFilter:function(filterFields,newMax){
        var filter=filterFields;
        var newMax=newMax;
        for(var i=0;i<filter.length;){
            if(filter[i].type == "INDEX_FIELD"||filter[i].type == "COMPARE_INDEX_FIELD"){
                filter.splice(i,1);
            }else{
                i++
            }
        }
        filter=filter.concat(newMax);
        return filter;
    },
    creatZhiBiaoFilterFields:function(type,data){ 
        return this['set'+type](data);
    },
    setSortFields:function(data){
        return [{
                "field": data.selIndexFields.name,
                "method": data.method
            }];
    },
    setMaxMin:function(data){
        return [{
            "valueType": data.selIndexFields.dataType,
            "name": data.selIndexFields.name,
            "pattern": "",
            "dbField": data.selIndexFields.fieldName,
            "type": data.indexType,
            "operator": ["GE"],
            "value": [ data.min],
            "items": [],
            "selected": true
        },{
            "valueType": data.selIndexFields.dataType,
            "name": data.selIndexFields.name,
            "pattern": "",
            "dbField": data.selIndexFields.fieldName,
            "type": data.indexType,
            "operator": ["LE"],
            "value": [data.max],
            "items": [],
            "selected": true
        }];
    },
    setTopParameters:function(data){
        return [{
            "field":data.selIndexFields.name,
            "method": data.method,   
            "topn": data.topn
        }]
    },
    setZhiBiaoFilterFields:function(model,sortFields,topParameters,maxMin,dashboard){
        if(topParameters){
            model.areaInfo.topParameters=topParameters;
        }else{
            delete model.areaInfo.topParameters;
        }
        if(sortFields){
            model.areaInfo.sortFields=sortFields;
        }else{
            model.areaInfo.sortFields=[];
        }
        if(maxMin){
            if(dashboard){
                model.areaParameters.filterFields=this.setZhibiaoFilter(model.areaParameters.filterFields,maxMin);
            }else{
                model.areaInfo.filterFields=this.setZhibiaoFilter(model.areaInfo.filterFields,maxMin);
            }
        }else{
            if(dashboard){
                model.areaParameters.filterFields=this.emptyZhibiaoFilterFields(model.areaParameters.filterFields,maxMin);
            }else{
                model.areaInfo.filterFields=this.emptyZhibiaoFilterFields(model.areaInfo.filterFields);
            }
        }
        return model;
    },
    setSelIndexFields:function(name,indexFields){
        for(var i=0;i<indexFields.length;i++){
            if(name==indexFields[i].name){
                return indexFields[i];
            }
        }
    },
    pageFormaterIsNum:function(digit){
        //是数组
        if(!isNaN(digit)){
            if(digit>-1 && digit<10){
                return true;
            }
            return false;
        }else{
            return false;
        }
    }
}
