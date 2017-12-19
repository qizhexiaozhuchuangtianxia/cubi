/**
 * 全局筛选Store
 */
var App = require('app');
// var MetaDataStore = require('./MetaDataStore');
var FilterFieldsStore = require('./FilterFieldsStore');
var moment = require('moment');
var { WEB_API } = require('../../constants/api');

module.exports = {
    getMetaData: function(metaDataId) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getMetadata',
                httpUrl: `${  WEB_API. GET_METADATA_URL}/${ metaDataId }`,
                type: 'GET',
                param: '&id=' + metaDataId,
                contentType: 'application/json',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            });
        });

    },
    getFieldMaxMinData: function(id, fieldName){
        return new Promise((resolve, reject) => {
              App.ajax({
                url: '/services/metadata/runtime/getFieldMaxMinData',
                httpUrl: `${ WEB_API.GET_FIELD_MAX_MIN_DATA_URL }/${ id }/${ fieldName }`,
                type: 'GET',
                param: '&id='+ id +'&fieldName=' + fieldName,
                contentType: 'application/json',
                callback: function(result){
                    resolve(result);
                },
                errorCallback:function(){
                   reject();
                }
              });
        });
    },

    _filetrMoment:function(){
        return moment().format('YYYY年MM月DD日');
    },
    _dateFormaterChina:function(date) {
        return moment(date).format('YYYY年MM月DD日');
    },
    _formatTime: function(time) {
        if(!time){return}
        var t = time.replace(/[^0-9]/mg, '-');
        t = t.substring(0, t.length - 1);
        return t
    },
    //数组去重方法，接受一个要去重的字段id
    unique:function(arr,id){
        var ids='id';
        if(id){
            ids=id;
        }
        var res = [];
        var json = {};
        for(var i = 0; i < arr.length; i++){
            if(!json[arr[i][ids]]){
                res.push(arr[i]);
                json[arr[i][ids]] = 1;
            }
        }
        return res;
    },
    //设置每个表的 头部筛选按钮的 选中状态
    setBtnStyle:function(globalFilterSign,filterFieldsList,filterFields){
        var lists=filterFieldsList;
        if (!globalFilterSign) {return filterFieldsList};
        for(var i=0;i<lists.length;i++){
            lists[i].popData=[];
            for(var j=0;j<filterFields.length;j++){
                if(lists[i].groupType=="GROUP_TITLE_FIELD" && lists[i].dimensionId==filterFields[j].dimensionId){
                    lists[i].popData=filterFields[j].value;
                }
                if(lists[i].groupType=="" && lists[i].fieldName==filterFields[j].dbField){
                    lists[i].popData=filterFields[j].items;
                }
                if(lists[i].dataType=="DATE" && lists[i].fieldName==filterFields[j].dbField){
                    lists[i].popData=filterFields[j].value;
                }
            }
        }
        return lists;
    },
    //单个表筛选是，全局筛选条件和当前表的筛选条件合并
    concatReportFilter:function(newFilter,oldFilter){

        for(var i=0;i<oldFilter.length;i++){
            for(var j=0;j<newFilter.length;j++){
                if(oldFilter[i].name==newFilter[j].name){
                    oldFilter[i]=newFilter[j];
                }
            }
        }
        var alls=newFilter.concat(oldFilter);
        var all=this.unique(alls,'name');
        return newFilter;
    },

    setDownSelected: function(seletedArr) {
      var list = [];
      var seletedArr = seletedArr || [];
        for (var i = 0; i < seletedArr.length; i++) {
            tree(seletedArr[i])
        }
        function tree(child) {
            if (child.children && child.children.length > 0) {
                for (var i = 0; i < child.children.length; i++) {
                    tree(child.children[i]);
                }
            }else{
                list.push({
                    name:child.name
                })
            }
        }
        return list;

        // var list = [],
        //     seletedArr = seletedArr || [];
        //
        // for (var j = 0; j < seletedArr.length; j++) {
        //     if (seletedArr[j].name == "中国") {
        //         for (var h = 0; h < seletedArr[j].children.length; h++) {
        //             list.push({
        //                 name: seletedArr[j].children[h].name
        //             });
        //         }
        //     } else {
        //         list.push({
        //             name: seletedArr[j].name
        //         });
        //     }
        // }
        // return list;

    },
    globalSign: false,

    setGlobalSign: function(sign) {
        this.globalSign = sign;
    },
    globalSignArr:[],
    setGlobalSignArr:function(row,col,gSign){
        for(var i=0;i<this.globalSignArr.length;i++){
            if(this.globalSignArr[i].row==row && this.globalSignArr[i].col==col){

                this.globalSignArr[i].gSign=gSign;
            }
        }
    },
    getGlobalSign:function(row,col){

        for(var i=0;i<this.globalSignArr.length;i++){
            if(this.globalSignArr[i].row==row && this.globalSignArr[i].col==col){
                return this.globalSignArr[i].gSign;
            }
        }

        return false;
    },
    isEmptyObject: function(obj) {
        for (var t in obj) {
            return false;
        }
        return true
    },
    getTreeFilterData: function(dimensionId, metadataId) {
        var param={
              "areaParameters": {
                "actionType": "VIEW",
                "preview": "false",
                "width": "100%",
                "height": "100%",
                "changeChartAllowed": "true",
                "timeAxisUsed": "true",
                "pageParameter": {
                  "pageRowCount": 500,
                  "currentPageNo": 1
                },
                "filterFields":[],
                "chartType": null,
                "sortParameters": []
              }
        };
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/metadata/runtime/getFilterTreeDimensionData',
                httpUrl: `${WEB_API.GET_FILTER_TREE_DIMENSION_DATA_URL}/${ metadataId }/${ dimensionId }`, 
                type: 'POST',
                contentType: 'application/json',
                param: '&dimensionId=' + dimensionId + '&metadataId=' + metadataId,
                data: param,
                callback: function(result) {
                    if (result.success) {
                        resolve(result);
                    }
                },
                errorCallback: function() {
                    reject('网络异常');
                }
            })
        })
    },
    //搜索模糊匹配
    searchSetItem:function(allData,obj,name,item){
        var allDatas=allData;
        var seletedArr=[];
        if(!allData){return seletedArr;}
        //复合维度
        if(item.groupType=="GROUP_TITLE_FIELD"){
            var items=[];
            var alls=0;
            var calls=0;
            var objSign=null;
            for(var o in obj){
                var cur=obj[o];
                var cs=0;
                if(!objSign){
                    objSign=o;
                }
                for(var j=0;j<cur.length;j++){
                    if( cur[j].name.indexOf(name) !=-1){//匹配搜索名称
                        items.push(cur[j]);
                        //获取当前匹配名称的层级列表
                        var listData = FilterFieldsStore.getDashboardListData(obj,cur[j].levelId);
                        //设置选中状态
                        var listDatasArr = FilterFieldsStore.getTreeList(listData,cur[j].pid,obj,cur[j].levelId);
                        var param = {
                            item:cur[j],
                            listData:listDatasArr,
                            pid:cur[j].pid,
                            level:cur[j].levelLen
                        }
                        //改变所有数据的选中状态
                        allDatas = FilterFieldsStore.setTreeSeletedHandle(obj,param);
                    }else{
                        cs++
                    }
                }
                alls+=cur.length;
                calls+=cs;
            }
            //如果未匹配到，设置错误的id，这样可以返回 ‘未查询到数据’;
            if(alls==calls && alls!=0){
                var fristArr=obj[objSign][0];
                fristArr.checboxBool=true;
                fristArr.children=[]
                fristArr.name=name;
                fristArr.id=name;
                seletedArr.push(fristArr);
            }else{
                //否则设置选中的数组
                seletedArr=FilterFieldsStore.setTreeFilterFields(allDatas);
            }
        //普通维度
        }else{
            //匹配名称，添加到 seletedArr 数组
            var sign=0;
            for(var i=0;i<allData.length;i++){
                if(allData[i].name.indexOf(name)!=-1){
                    allData[i].checboxBool=true;
                    seletedArr.push(allData[i]);
                }else{
                    sign++;
                }
            }
            if(sign==allData.length && sign!=0){
                allData[0].checboxBool=true;
                allData[0].name=name;
                allData[0].id=name;
                seletedArr.push(allData[0]);
            }
        }
        return seletedArr;
    },
    getPageFieldDataWithFilters: function(metadataId, fieldName) {

        var data = {
            "fieldName": fieldName,
            "areaParameters": {
                "pageParameter": {
                    "pageRowCount": 50,
                    "currentPageNo": 1
                },
                "filterFields": [],
                "sortParameters": []
            }
        };

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
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }
            });
        });
    },
    //拼装全局筛选的item
    setGlobalFilters:function(arg){
        if(!arg.seletedArr || arg.seletedArr.length==0){
            return false;
        }
        var item = {
                "name": arg.fieldName,
                "dbField": arg.fieldName,
                "dimensionId": '',
                "groupType": arg.groupType,
                "items": [],
                "pattern": '',
                "value": arg.seletedArr,
                "valueType": "STRING",
                "selected": true,
            }
        if(arg.groupType==""){
            item.items=arg.seletedArr;
            item.value=[];
            for(var j=0;j<arg.seletedArr.length;j++){
                item.value.push(arg.seletedArr[j].id);
            }
        }else{
            if(arg.filterType!="DATE_FILTER"){
                item.dbField="";
            }
            item.dimensionId=arg.dimensionId;
        }

        if(arg.filterType=="DATE_FILTER"){
            item.value=arg.seletedArr;
            item.dimensionId='';
            item.groupType='';
            item.valueType="DATE_RANGE";
            item.items=[];
        }

        return item;
    },
    // 拼装所有(FilterFields)的筛选条件
    reportPushFilters:function(globalFilterFields,metadataId,filterFields,reportInfo,weiduList){
        var filter=[];
        if(!globalFilterFields){return filter;}
        for(var i=0;i<globalFilterFields.length;i++){
            var addField = false;
            var curGlobalFilter=globalFilterFields[i];
            var filterObj=this.setGlobalFilters(curGlobalFilter);
            if(metadataId==curGlobalFilter.metadataId && curGlobalFilter.open && curGlobalFilter.filterType!=='DATE_FILTER' && filterObj ){
                if(reportInfo.compare){
                    var compareDimension = reportInfo.compareInfo.compareDimension;
                    compareDimension.map(function(compareItem,compareIindex){
                        if(globalFilterFields[i].fieldName==compareItem.weiItem.fieldName&&compareItem.selected){
                            addField = true;
                        }
                    })
                }
                if(!addField){
                    filter.push(filterObj);
                }
            }
            if(curGlobalFilter.filterType === 'DATE_FILTER' && curGlobalFilter.open && filterObj ){
                for(var h=0;h<weiduList.length;h++){
                    if(weiduList[h].name===curGlobalFilter.name){
                        filter.push(filterObj);
                    }
                }
            }
        }
        if(filter.length==0 && filterFields && filterFields.length>0){
            return filterFields;
        }
        return filter;
    },
    setDimensionDisabled:function(globalFilter,weiduList,row,col,metadataId){
        var matchWeidu=[];
        for(var i=0;i<globalFilter.length;i++){
            for(var j=0;j<weiduList.length;j++){
                if(globalFilter[i].name === weiduList[j].name && globalFilter[i].open && weiduList[j].type!=='no'){
                    var cur=JSON.parse(JSON.stringify(weiduList[j]));
                    cur.sign=globalFilter[i].sign;
                    matchWeidu.push(cur);
                }
            }
        }
        for(var t=0;t<weiduList.length;t++){
            weiduList[t].disabled=true;
            if(matchWeidu.length>0 ){
                for(var h=0;h<matchWeidu.length;h++){
                    if(matchWeidu[h].filterType === 'DATE_FILTER' && matchWeidu[h].sign === weiduList[t].sign && matchWeidu[h].name === weiduList[t].name){
                        weiduList[0].disabled=false; 
                        weiduList[t].disabled=false;
                    }else if(matchWeidu[h].metadataId === metadataId){
                        weiduList[t].disabled=false;
                    }
                }
            }else{
                if(weiduList[t].filterType === 'DATE_FILTER'){
                    weiduList[t].disabled=false;
                    weiduList[0].disabled=false; 
                }else if(weiduList[t].metadataId === metadataId){
                    weiduList[t].disabled=false;
                    weiduList[0].disabled=false; 
                }
            }
        }
        return weiduList;
        
    },
    //设置每个报表筛选器 可选状态
    setFilterDisabled:function(globalFilter,metadataId){
        var globalFilter=JSON.parse(JSON.stringify(globalFilter))
        var obj={};
        var newGlobalFilter=[];
        if(!globalFilter){
            return newGlobalFilter;
        }
        //按照dimensionId 或者 日期类型 分组
        for(var i=0;i<globalFilter.length;i++){
            //修改全局筛选关联不上bug,dimensionId匹配换成name匹配，因为有些维度没有id
            if(!obj[globalFilter[i].name] && globalFilter[i].filterType!="DATE_FILTER"){
                obj[globalFilter[i].name]=[];
            }
            if(!obj[globalFilter[i].metadataId] && globalFilter[i].filterType=="DATE_FILTER"){
                obj[globalFilter[i].sign]=[];
            }

            if(globalFilter[i].filterType!="DATE_FILTER"){
                obj[globalFilter[i].name].push(globalFilter[i]);
            }else{
                globalFilter[i].disabled = false;
                obj[globalFilter[i].sign].push(globalFilter[i]);
            }
        }
        // 相同的维度里只要有一个open=true,其他都disabled设置为true,不可点击状态;
        var dateSelectedSign=false;
        for(var o in obj){
            var c=obj[o];
            var selectedSign=false;
            var index=null;
            var disabled=false;
            //第一次循环 确定这个数组里是否含有open=true的选项，即已经选择的状态
            for(var i=0;i<c.length;i++){
                if(o=="undefined"){
                    break;
                }
                if(c[i].open && (c[i].metadataId==metadataId || c[i].filterType==="DATE_FILTER") ){
                    selectedSign=true;
                    index=i;
                    if(c[i].filterType==="DATE_FILTER"){
                        dateSelectedSign=true;
                    }
                    break;
                }
            }
            //根据第一次循环得出的 selectedSign 设置 disabled状态
            for(var i=0;i<c.length;i++){
                if(selectedSign || dateSelectedSign){
                    if(c[i].open && i==index){
                        c[i].disabled=false;
                    }else{
                        c[i].disabled=true;
                    }
                }else{
                    if(c[i].filterType==="DATE_FILTER" && !dateSelectedSign){
                        c[i].disabled=false;
                    }else{
                        if(c[i].metadataId==metadataId){
                            c[i].disabled=false;
                        }else{
                            c[i].disabled=true;
                        }
                    }
                    
                }
                if(o=="undefined"){
                    c[i].disabled=true;
                }
            }
            newGlobalFilter=newGlobalFilter.concat(c);
        }

        return newGlobalFilter;
    },
    //驾驶舱分享页 筛选条件设置
    setDashboardReadFilters:function(globalFilterFields,metadataId,filterFields){
        var filter=[];
        var filterList=JSON.stringify(globalFilterFields);
        filterList=JSON.parse(filterList);
        for(var i=0;i<filterList.length;i++){
            if(filterList[i].metadataId==metadataId){
                delete filterList[i].metadataId;
                filter.push(filterList[i]);
            }
        }
        if(filter.length==0&&filterFields.length>0){
            return filterFields;
        }
        return filter;
    },
    setfilterFieldsValueType:function(filterFields){

        for(var i=0;i<filterFields.length;i++){
            var valueType=filterFields[i].valueType;
            if(valueType=="DATE_RANGE" || valueType=="DATE" || valueType=="DATE_CYCLE" || valueType=="CUSTOM"){
                filterFields[i].valueType="DATE_RANGE";
            }
        }
        return filterFields;
    }
}
