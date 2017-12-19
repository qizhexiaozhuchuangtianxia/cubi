/**
 * 驾驶舱钻取Store
 */
var FilterFieldsStore = require('./FilterFieldsStore');
module.exports = {
    setWeiduList:function(weiduList,rowTitleFields){
        var weiList=[];
        if(!weiduList){
            return weiList;
        }
        for(var i=0;i<rowTitleFields.length;i++){
            for(var j=0;j<weiduList.length;j++){
                if(rowTitleFields[i].name==weiduList[j].name){
                    weiduList[j].level=rowTitleFields[i].level;
                    var drillLevel=weiduList[j].groupLevels.indexOf(weiduList[j].level);
                    if(!rowTitleFields[i].drillLevel || drillLevel==0){
                        drillLevel=-1;
                    }
                    weiduList[j].drillLevel=drillLevel;
                    weiduList[j].disabledIndex=drillLevel;
                    weiList.push(weiduList[j]);
                }
            }
        }
        return weiList;
    },
    addDrillLevel:function(weiduList,filterFields){
        var filterFields=JSON.parse(JSON.stringify(filterFields));
        for(var i=0;i<weiduList.length;i++){
            if (weiduList[i].groupType == "GROUP_TITLE_FIELD") {
                for(var j=0;j<filterFields.length;j++){
                    if(filterFields[j].dimensionId==weiduList[i].dimensionId){
                        filterFields[j].drillLevel=weiduList[i].drillLevel;
                    }
                }
            }else if(weiduList[i].groupType == "GROUP_DATE_TITLE_FIELD"){
                for(var j=0;j<filterFields.length;j++){
                    if(filterFields[j].name==weiduList[i].name){
                        filterFields[j].drillLevel=weiduList[i].drillLevel;
                    }
                }
            }
        }
        return filterFields;
    },
    setFilterFields:function(weiduList,filterFields){
        var filterFields=this.addDrillLevel(weiduList,filterFields);
        var hasLevelFilter=JSON.parse(JSON.stringify(filterFields));
        var sign=false;
        for(var j=0;j<hasLevelFilter.length;j++){
            if(filterFields[j].drillLevel>-1){
                var filterField = {
                    "name": filterFields[j].name,
                    "valueType": "STRING",
                    "dbField": "",
                    "value": filterFields[j].value,
                    "selected": true,
                    "items": [],
                    "groupType":"GROUP_TITLE_FIELD",
                    "dimensionId":filterFields[j].dimensionId,
                    "pattern": ""
                };
                if(filterFields[j].groupType=="GROUP_DATE_TITLE_FIELD"){
                    filterField.valueType="DATE_RANGE";
                    filterField.dbField=filterFields[j].dbField;
                    filterField.groupType='GROUP_DATE_TITLE_FIELD';
                }
                sign=true;
            }
            delete filterFields[j].drillLevel;
        }
        if(!sign){
            filterFields=[];
        }
        return {
            filterFields:filterFields,
            hasLevelFilter:hasLevelFilter
        };
    },
    setDrilDownData:function(weiduList,filterFields){
        var drilDownData=[];
        for(var i=0;i<weiduList.length;i++){
            var obj={}
            if (weiduList[i].groupType == "GROUP_TITLE_FIELD") {
                obj.drillLevel=weiduList[i].drillLevel;
                obj.dimensionId=weiduList[i].dimensionId;
                obj.groupLevels=weiduList[i].groupLevels;
            }else if(weiduList[i].groupType == "GROUP_DATE_TITLE_FIELD"){
                obj.drillLevel=weiduList[i].drillLevel;
                obj.dimensionId=weiduList[i].name;
                obj.groupLevels=weiduList[i].groupLevels;
            }
            for(var j=0;j<filterFields.length;j++){
                if(weiduList[i].name==filterFields[j].name){
                    obj.seletedArr=filterFields[j].value;
                    if(weiduList[i].groupType == "GROUP_DATE_TITLE_FIELD"){
                        var breadData=FilterFieldsStore.setDateBreadData(filterFields[j].value[0],weiduList[i],weiduList[i].drillLevel);
                        obj.breadData=breadData;
                    }
                    
                }
            }
            drilDownData.push(obj);
        }
        
        return new Promise((resolve, reject) => {
            FilterFieldsStore.setAllDataToLevel(weiduList,filterFields,drilDownData).then(function(result){
                return resolve({
                    drilDownData:result,
                });
            });
        });
        
    },
    setBreadData:function(wei,value){

    },
    setPidGobackData:function(drillLevel,treeArr){
        var treeObj=FilterFieldsStore.treeToOneDimen(treeArr);
        var goBackData={};
        for(var o in treeObj){
            goBackData['level_' + treeObj[o][0].levelLen] = treeObj[o][0].pid;
            if(drillLevel-1==treeObj[o][0].levelLen){
                goBackData['level_' + (treeObj[o][0].levelLen+1)] = treeObj[o][0].id;
                return {
                    pid:treeObj[o][0].id,
                    goBackData:goBackData
                };
            }
        }
        return 0;
    },
    setSeletedData:function(drilDownData,dimensionId,seletedArr){
        for(var i=0;i<drilDownData.length;i++){
            if(drilDownData[i].dimensionId==dimensionId && drilDownData[i].drillLevel>-1){
                var pidGobackData=this.setPidGobackData(drilDownData[i].drillLevel,drilDownData[i].seletedArr)
                return {
                    seletedArr:drilDownData[i].seletedArr,
                    levelId:drilDownData[i].drillLevel,
                    pid:pidGobackData.pid,
                    goBackData:pidGobackData.goBackData,
                    goBackShow:true
                }
            }
        }
        return false;
    },
    setTreeListDisabled:function(drilDownData,levelId,dimensionId){
        for(var i=0;i<drilDownData.length;i++){
            if(drilDownData[i].dimensionId==dimensionId){
                if(levelId<drilDownData[i].drillLevel){
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    setFilterFieldsList:function(filterFields,filterFieldsList,back){

        for(var j=0;j<filterFieldsList.length;j++){
            if (!filterFields || 0 === filterFields.length){
                filterFieldsList[j].popData=[];
            }else{
                var sign=false;
                for(var i=0;i<filterFields.length;i++){
                    if(filterFields[i].name==filterFieldsList[j].name || filterFields[i].name==filterFieldsList[j].fieldName){//filterFields[i].drillLevel>-1 && 
                        filterFieldsList[j].popData=filterFields[i].value;
                        i=filterFields.length;
                        sign=true;
                    }
                }
                if(!sign){
                    filterFieldsList[j].popData=[];
                }
            }
            
        }
        return filterFieldsList;
    },
    setSeletedDatas:function(drilDownData,dimensionId){
        if(!drilDownData){return false}
        for(var i=0;i<drilDownData.length;i++){
            if(drilDownData[i].dimensionId==dimensionId && drilDownData[i].drillLevel>-1){
                return drilDownData[i];
            }
        }
        return false;
    },
    setRowTitleFieldsLevel:function(rowTitleFields,weiduList){
        var rowTitleFields=JSON.parse(JSON.stringify(rowTitleFields));
        for(var i=0;i<rowTitleFields.length;i++){
            for(var j=0;j<weiduList.length;j++){
                if(rowTitleFields[i].name==weiduList[j].name){
                    rowTitleFields[i].level=weiduList[j].level;
                    // break;
                }
            }
        }
        return rowTitleFields;
    },
    setDrillFilter:function(filterFields,drilDownData){
        for(var i=0;i<drilDownData.length;i++){
            for(var j=0;j<filterFields.length;j++){
                if(filterFields[j].dimensionId==drilDownData[i].dimensionId){
                    drilDownData[i].drillFilter=filterFields[j].value;
                }
            }
        }
        return drilDownData;
    },
    globalFilterInDrilFilter:function(globalFilter,drilFilter){
        var push=false;
        for(var i=0;i<drilFilter.length;i++){
            for(var j=0;j<globalFilter.length;j++){
                if(drilFilter[i].name==globalFilter[j].name){
                    drilFilter[i]=globalFilter[j];
                    push=true;
                }
            }
        }
        if(!push){
           return globalFilter;
        }
        return drilFilter;
    },
    drilFilterInFilterFields:function(drilFilter,newFilterFields,drilDown){
        if(!drilDown){
            return newFilterFields;
        }
        for(var i=0;i<drilFilter.length;i++){
            for(var j=0;j<newFilterFields.length;j++){
                if(drilFilter[i].name==newFilterFields[j].name){
                    drilFilter[i]=newFilterFields[j];
                    return drilFilter;
                }
            }
        }
        return newFilterFields;
    },
    drilDownFilterCoverDefaultFilter:function(defaultFilterFields,filterFields,rowTitleFields){
        for(var j=0;j<filterFields.length;j++){
            for(var i=0;i<rowTitleFields.length;i++){
                if(rowTitleFields[i].drillLevel>=0 && rowTitleFields[i].name==filterFields[j].name){
                    filterFields[j].drilDown=true;
                }
            }
        }
        for(var i=0;i<filterFields.length;i++){
            for(var j=0;j<defaultFilterFields.length;j++){
                if(filterFields[i].name==defaultFilterFields[j].name && filterFields[i].drilDown){
                    delete filterFields[i].drilDown;
                    defaultFilterFields[j]=filterFields[i];
                }
            }
        }
        return defaultFilterFields;
    }
}