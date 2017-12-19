
var ReportStore = require('./ReportStore');
var ReportDateRange = require('../views/common/ReportDateRange');
var App = require('app');
var moment = require('moment');
module.exports = {
    cloneObj:function(obj){
        return JSON.parse(JSON.stringify(obj));
    },
    
    clickSceneSetSelected:function(item,scenes){
        for(var i=0;i<scenes.length;i++){
            if(scenes[i].senceName==item.senceName){
                scenes[i].selected=!scenes[i].selected;
            }else{
                scenes[i].selected=false;
            }

        }
        return scenes;
    },
    clickSceneSetFields:function(item,compareWei,scenes){ //设置 selectedScenes
        var scenes=compareWei.scenes,
            selectedScenes=[];
        for(var i=0;i<scenes.length;i++){
            if(item.type=='isCompare'){
                if(i>0){
                    selectedScenes.push({
                        name:scenes[i].sceneName
                    });
                }
                
            }else{
                if(scenes[i].sceneName==item.sceneName){
                    selectedScenes.push({
                        name:item.sceneName
                    });
                }
            }
        }
        compareWei.selectedScenes=selectedScenes;
        return compareWei;
    },
    setSlectedScene:function(selectedCompare,item){ //设置  Scenes:selected

        var scenes=selectedCompare.scenes,
            selectedScenes=selectedCompare.selectedScenes;
            for(var i=0;i<scenes.length;i++){
                for(var j=0;j<selectedScenes.length;j++){
                    scenes[i].selected=false;
                    //全选
                    if(item.type=='isCompare'){
                        scenes[0].selected=true;
                        selectedCompare.selectedCompare=true;
                    }else{
                        if(scenes[i].sceneName == selectedScenes[j].name){
                            scenes[i].selected=true;
                            selectedCompare.selectedCompare=false;
                        }
                    }

                }
            }
        return selectedCompare;
    },
    getSlectedSences:function(scenes){
        if(!scenes){return []}
        for(var i=0;i<scenes.length;i++){
            if(scenes[i].selected){
                return scenes[i];
            }
        }
        return [];
    },
    getSlectedSencesVal:function(scenes,groupType){
        var curScen=this.getSlectedSences(scenes);
        if(curScen.selected && curScen.filterFields.length>0){
            var value=curScen.filterFields[0].value;
            if(groupType==""){
                var val=curScen.filterFields[0].items;
                value=[];
                for(var i=0;i<val.length;i++){
                    value.push(val[i].name);
                }
            }
            return {
                groupType: curScen.filterFields[0].groupType,
                value:value
            }
        }
        return [];
    },
    treeToObj: function(dataArr) { //获取树形值之后 转化成具有层级的数据

        var listObj = {};
        var levelLen = 0;
        if (!dataArr) {
            return listObj;
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
        return listObj;

    },
    setCopareInfoData:function(scenes,groupType){
        var valueObj=this.getSlectedSencesVal(scenes,groupType);
        if(groupType=="GROUP_DATE_TITLE_FIELD"){
            var dateArr=[];
            if(valueObj.value && valueObj.value.length==1){
                var date=ReportDateRange.getDateRangeByType(valueObj.value[0]);
                dateArr=[date.start,date.end];

            }else{
                dateArr=valueObj.value || [];
            }
            return this.compareInfoFormatDate(dateArr)
        }
        if(valueObj.groupType==""){
            return valueObj.value;
        }
        var obj = this.treeToObj(valueObj.value);
        return this.setCopareInfoDataList(obj);

    },
    compareInfoFormatDate:function(date){
        var dates=[];
        for(var i=0;i<date.length;i++){
            var d = moment(date[i]).format('YYYY年MM月DD日');
            if(i==0){
                d+="  至";
            }
            dates.push(d);
        }
        return dates;

    },
    setCopareInfoDataList:function(obj){
        var list=[];
        for(var o in obj){
            var arr=obj[o];
            for(var j=0;j<arr.length;j++){
                list.push(arr[j].name);
            }
            // var last=list[list.length-1]+'、';
            // list[list.length-1]=last;
        }
        return list;
    },
    setOnToggle:function(selectedCompare,scenes){
        var scenesList=selectedCompare.scenes;
        for(var i=0;i<scenesList.length;i++){
            if(scenesList[i].sceneName==scenes.sceneName){
                var displayInCompare=!scenes.displayInCompare;
                scenes.displayInCompare=displayInCompare;
                scenesList[i]=scenes;
                return selectedCompare;
            }
        }
        return selectedCompare;
    },
    getFilter:function(selectedCompare,isAdd){
        if(!selectedCompare || isAdd){return []}
        var scenes=selectedCompare.scenes;
        for(var i=0;i<scenes.length;i++){
            if(scenes[i].selected){
                return scenes[i].filterFields;
            }
        }
        return [];
    },
    addScenes:function(name,filterFields,selectedCompare,zhiBiaoList){

        if(selectedCompare.selectedScenes.length==0){
            selectedCompare.selectedCompare=true;
        }
        var scenesItem={
          "sceneName":name,
          "filterFields":filterFields,
          "displayInCompare":true,
        }
        selectedCompare.scenes.push(scenesItem);
        var scenes=selectedCompare.scenes;
        var selectedScenes=[];
        scenes[0].selected=true;
        for(var j=1;j<scenes.length;j++){
            scenes[j].selected=false;
            if(scenes[j].displayInCompare){
                selectedScenes.push({
                    name:scenes[j].sceneName
                })
            }
            
        }
        selectedCompare.selectedScenes=selectedScenes;
        var compareIndexFields=this.initCompareIndexFields([{
            name:name
        }],zhiBiaoList);
        compareIndexFields=selectedCompare.compareIndexFields.concat(compareIndexFields);
        selectedCompare.compareIndexFields=compareIndexFields;
        return selectedCompare;

    },

    editScenes:function(name,filterFields,selectedScenes,selectedCompare,zhiBiaoList){
        var newScenes=selectedScenes,
            oldScenes=App.deepClone(selectedScenes),//;this.cloneObj(selectedScenes)
            scenes=selectedCompare.scenes,
            compareSelectedScenes=selectedCompare.selectedScenes,
            compareIndexFields=selectedCompare.compareIndexFields;
        newScenes.sceneName=name;
        newScenes.filterFields=filterFields;
        for(var i=0;i<scenes.length;i++){
            for(var j=0;j<compareSelectedScenes.length;j++){
                if(oldScenes.sceneName==compareSelectedScenes[j].name){
                    compareSelectedScenes[j].name=name;
                }
            }
            if(oldScenes.sceneName==scenes[i].sceneName){
                scenes[i]=newScenes;
            }
        }
        for(var h=0;h<compareIndexFields.length;h++){
            if(compareIndexFields[h].sceneName==oldScenes.sceneName){
                for(var t=0;t<zhiBiaoList.length;t++){
                    var n=zhiBiaoList[t].name+':'+oldScenes.sceneName;
                    if(n==compareIndexFields[h].name){
                        compareIndexFields[h].name=zhiBiaoList[t].name+':'+name;
                    }
                }
                compareIndexFields[h].sceneName=name;
            }
        }
        //selectedCompare.compareIndexFields=this.initCompareIndexFields(compareSelectedScenes,zhiBiaoList);
        selectedCompare.selectedScenes=compareSelectedScenes;
        return selectedCompare;

    },
    initCompareIndexFields:function(selectedScenes,zhiBiaoList){
        var compareIndexFields=[];
        for(var i=0;i<zhiBiaoList.length;i++){
            if(!zhiBiaoList[i].expression){
                //增加未起作用指标判断
                if(zhiBiaoList[i].checked||zhiBiaoList[i].checked==undefined)
                for(var j=0;j<selectedScenes.length;j++){
                    if(!selectedScenes[j].type){
                        var n=selectedScenes[j].name||selectedScenes[j].sceneName;
                        var o={
                            "sceneName":n,
                            "name":zhiBiaoList[i].name+':'+n,
                            "customName":'',
                            "statistical": zhiBiaoList[i].statistical,
                            "type": "COMPARE_INDEX_FIELD",
                        };
                        //增加维度指标属性
                        if(zhiBiaoList[i].distinct=='distinct'){
                            o.distinct = zhiBiaoList[i].distinct
                        }
                        if(zhiBiaoList[i].pageFormater){
                            o.pageFormater=zhiBiaoList[i].pageFormater;
                        }
                        compareIndexFields.push(o);
                    }
                }
            }
                
        }
        return compareIndexFields;
    },
    addScenesUpdateCompare:function(selectedCompare,compareData,zhiBiaoList,isAdd){
        
        for(var i=0;i<compareData.length;i++){
            if(compareData[i].dimensionName==selectedCompare.dimensionName){
                compareData[i]=selectedCompare;
                //选中的是对比
                var selectedScenes=[];
                var scenes=compareData[i].scenes;
                if(scenes[0].selected){
                    for(var j=1;j<scenes.length;j++){
                        scenes[j].selected=false;
                        if(scenes[j].displayInCompare){
                            selectedScenes.push({
                                name:scenes[j].sceneName
                            })
                        }
                    }
                    compareData[i].selectedScenes=selectedScenes;
                }
                return compareData;
            }
        }
        return compareData;
    },
    checkName:function(name,selectedCompare,selectedScenes,isAdd){
        var scenes=selectedCompare.scenes;
        for(var i=0;i<scenes.length;i++){
            if(isAdd){
                if(name==scenes[i].sceneName){
                    return true;
                }
            }else{
                if(name==scenes[i].sceneName && selectedScenes.sceneName!=scenes[i].sceneName){
                    return true;
                }
            }
        }

        return false;
    },
    getSelectedScene:function(selectedCompare){
        var scenes=selectedCompare.scenes;
        for(var i=0;i<scenes.length;i++){
            if(scenes[i].selected){
                return scenes[i];
            }
        }
    },
    setCompareInfo:function(compareData,zhiBiaoList,save,category){
        var compareDimension=App.deepClone(compareData);
        var compareInfo={
            compareDimension:[]
        };
        if(compareDimension.length>0 && compareDimension[0].type=="nocompare"){
            compareDimension.splice(0,1);
        }
        for(var i=0;i<compareDimension.length;i++){
            delete compareDimension[i].weiItem;
            delete compareDimension[i].disableds;
            var scenes=compareDimension[i].scenes;
            var selectedScenes=compareDimension[i].selectedScenes;
            var newSelectedScenes=[];
            for(var t=0;t<scenes.length;t++){
                if(scenes[0].type==='isCompare' && scenes[0].selected && t>0){
                    if((scenes[t].displayInCompare && !save) || save ){
                        newSelectedScenes.push({
                            name:scenes[t].sceneName
                        });
                    }
                }else if(!scenes[t].type){
                    if(save){
                        newSelectedScenes.push({
                            name:scenes[t].sceneName
                        });
                        if(compareDimension[i].selected){
                            compareDimension[i].selectedCompare=true;
                        }
                    }else if(!save && scenes[t].selected && scenes[t].displayInCompare){
                        newSelectedScenes.push({
                            name:scenes[t].sceneName
                        });
                    }
                }
                
            }
            for(var j=0;j<scenes.length;){
                if(scenes[j].type==='isCompare'){
                    scenes.splice(0,1);
                }else{
                    if(scenes[j].hasOwnProperty("selected")){
                        delete scenes[j].selected;
                    }
                    j++;
                }
            }
            compareDimension[i].selectedScenes=newSelectedScenes;
            compareDimension[i].compareIndexFields=this.setCompareIndexFields(compareDimension[i],zhiBiaoList,save,category);
        }
        compareInfo.compareDimension=compareDimension;
        return compareInfo;
    },
    setCompareIndexFields:function(compareDimension,zhiBiaoList,save,category){
        var compareIndexFields=compareDimension.compareIndexFields || [];
        var selectedScenes=compareDimension.selectedScenes;
        if(category==="CHART"){
            for(var i=0;i<compareIndexFields.length;i++){
                compareIndexFields[i].customName='';
            }
        }
        if(save){
            return compareIndexFields;
        }
        if(compareIndexFields.length>0){
              var newCompareIndexFields = [];
              for(var i=0;i<selectedScenes.length;i++){
                    for(var j=0;j<compareIndexFields.length;j++){
                        if(selectedScenes[i].name===compareIndexFields[j].sceneName){
                            newCompareIndexFields.push(compareIndexFields[j]);
                        }
                    }
              }
              return newCompareIndexFields;
        }else{
            compareIndexFields=this.initCompareIndexFields(selectedScenes,zhiBiaoList)
        }

        return compareIndexFields;

    },
    setFilterFields:function(arg,groupType){
        var filterFields = [{
            "name": arg.name,
            "valueType": "STRING",
            "dbField": "",
            "value": [],
            "selected": true,
            "items": [],
            "groupType":groupType,
            "dimensionId":arg.dimensionId,
            "pattern": ""
        }];
        if(groupType==="GROUP_DATE_TITLE_FIELD"){
            var dateType= arg.dateType=="CUSTOM"? "DATE_RANGE" : arg.dateType;
            filterFields[0].valueType=dateType;
            filterFields[0].dimensionId='';
            filterFields[0].dbField=arg.dbField;
            filterFields[0].value=arg.seletedArr;
            filterFields[0].groupType='GROUP_DATE_TITLE_FIELD';

        }
        if(groupType==="GROUP_TITLE_FIELD"){
            filterFields[0].value=arg.seletedArr;
        }
        if(groupType===""){
            filterFields[0].dbField=arg.dbField;
            var seletedArr=arg.seletedArr;
            var value=[];
            var items=[];
            for(var i=0;i<seletedArr.length;i++){
                items.push({
                    name:seletedArr[i].name,
                    value:seletedArr[i].id,
                });
                value.push(
                    seletedArr[i].id
                );
            }
            filterFields[0].value=value;
            filterFields[0].items=items;
        }
        return filterFields;
    },

    changeWeiduUpdateCompare:function(compareData,weiduList,reportType){
        for(var i=0;i<compareData.length;i++){
            compareData[i].disableds = false;
            for(var j=0;j<weiduList.length;j++){
                if(compareData[i].dimensionName==weiduList[j].name){
                    if((reportType==="ScrollColumn2D" || reportType==="ScrollLine2D") && j>1){
                        compareData[i].disableds=false;
                    }else{
                        if(compareData[i].selected){
                            compareData[0].selected=true;
                        }
                        compareData[i].selected=false;
                        compareData[i].disableds=true;
                    }
                    
                }
            }
        }
       return compareData;
    },
    changeZhibiaoUpdateCompareData:function(compareData,zhiBiaoList){
        var isAdd=true;
        if(this.zhiBiaoList){
            if(this.zhiBiaoList.length>zhiBiaoList.length){
                isAdd=false;
            }
        }
        var compareData=App.deepClone(compareData);
        for(var i=0;i<compareData.length;i++){
            var oldCompareIndexFields=compareData[i].compareIndexFields;
            var oldCompareIndexFields2=[];
            var compareIndexFields=this.initCompareIndexFields(compareData[i].scenes,zhiBiaoList);
            if(!isAdd){
                
                for(var j=0;j<oldCompareIndexFields.length;j++){
                    for(var h=0;h<zhiBiaoList.length;h++){
                        if(oldCompareIndexFields[j].name.indexOf(zhiBiaoList[h].name)!=-1){
                            oldCompareIndexFields2.push(oldCompareIndexFields[j]);
                        }
                    }
                }
            }
            
            for(var j=0;j<oldCompareIndexFields2.length;j++){
                for(var h=0;h<compareIndexFields.length;h++){
                    if(oldCompareIndexFields2[j].name===compareIndexFields[h].name && oldCompareIndexFields2[j].customName!=''){
                        compareIndexFields[h].customName=oldCompareIndexFields2[j].customName
                    }
                }

            }
            compareData[i].compareIndexFields=compareIndexFields;

        }
        this.zhiBiaoList=App.deepClone(zhiBiaoList);
        return compareData;
    },
   delSceneUpdateCompare:function(delScene,compareData,compare){
       var delSceneLen = delScene;
       var compareData = compareData;
       var compare=false;
       for(var i=0;i<compareData.length;i++){
            if(compareData[i].selected){
               var compareDataScenes = compareData[i];
               for(var j=0; j<compareDataScenes.scenes.length;j++){
                   if(compareDataScenes.scenes[j].selected){
                       if(delSceneLen == 2){
                           compareDataScenes.scenes.splice(1);
                           compareDataScenes.selectedScenes=[];
                           compareDataScenes.compareIndexFields=[];
                           compare=false;
                       }else{
                           compareDataScenes.scenes.splice(j,1);
                           compareDataScenes.scenes[0].selected=true;
                           var scenes=compareDataScenes.scenes;
                           var selectedScenes=[];
                           var compareIndexFields=compareDataScenes.compareIndexFields;
                           var newCompareIndexFields=[];
                           //删除设置selectedScenes全部选中
                           for(var h=1;h<scenes.length;h++){
                                scenes[h].selected=false;
                                if(scenes[h].displayInCompare){
                                    compare=true;
                                }
                                selectedScenes.push({
                                    name:scenes[h].sceneName
                                });
                           }
                           // 删除重置compareIndexFields全部选中
                           for(var t=0;t<compareIndexFields.length;t++){
                                for(var w=0;w<selectedScenes.length;w++){
                                    if(compareIndexFields[t].sceneName==selectedScenes[w].name){
                                        newCompareIndexFields.push(compareIndexFields[t]);
                                    }
                                }
                           }
                           compareDataScenes.selectedCompare=true;
                           compareDataScenes.selectedScenes=selectedScenes;
                           compareDataScenes.compareIndexFields=newCompareIndexFields;
                        }
                        return {
                            compareData:compareData,
                            compare:compare
                        }
                   }
               }
           }
       }
   },
   updateCompare:function(compareInfo,zhiBiaoList){
        var compare=false;
        var selectedCompare=null;
        var compareDimension=compareInfo.compareDimension;
        for(var i=0;i<compareDimension.length;i++){
            if(compareDimension[i].selected){
                selectedCompare=compareDimension[i];
                break;
            }
        }
        if(selectedCompare && selectedCompare.compareIndexFields.length>0 && selectedCompare.selectedScenes.length>0){
            compare=true;
        }
        if(zhiBiaoList.length==0 || zhiBiaoList.length==1 && zhiBiaoList[0].expression){
            compare=false;
        }
        return compare;
   },
    updataZhibiaoCustomName:function(compareData,CompareNewcustName){
        var compareData =compareData;
        for(var i=1;i<compareData.length;i++){
          if( compareData[i].compareIndexFields){
                    var compareIndexFields = compareData[i].compareIndexFields;
                      for(var j=0;j<compareIndexFields.length;j++){
                          for(var n=1;n<CompareNewcustName.length;n++){
                              if(compareIndexFields[j].name == CompareNewcustName[n].name){
                                  compareIndexFields[j].customName = CompareNewcustName[n].customName;

                              }
                          }
                      }
            }
      }

    return compareData
    },
    setChartCompareIndex:function(selectedCompare,zhibiaoList){
        var zhibiaoList=App.deepClone(zhibiaoList);
        if(selectedCompare.type=='nocompare'){
            return zhibiaoList;
        }
        var newZhibiaoList=[];
        var selectedScenes=selectedCompare.selectedScenes;
        for(var j=0;j<zhibiaoList.length;j++){
            for(var i=0;i<selectedScenes.length;i++){
                var n=zhibiaoList[j].name+':'+selectedScenes[i].name;
                var cur=JSON.parse(JSON.stringify(zhibiaoList[j]));
                cur.name=n;
                newZhibiaoList.push(cur);
            }
        }
            
        return newZhibiaoList;
    },
    getSelectedCompareWei:function(compareDimension,compare){
        if(!compareDimension && !compare){return [];}
        for(var i=0;i<compareDimension.length;i++){
            if(compareDimension[i].selected){
                return compareDimension[i];
            }
        }
    },
    isClickCompare:function(compareData,compare,oldCompareData,oldCompare){
        var selectedCompare=this.getSelectedCompareWei(compareData,compare);
        var oldSelectedCompare='';
        if(oldCompareData){
            oldSelectedCompare=this.getSelectedCompareWei(oldCompareData,oldCompare);
        }
        if(JSON.stringify(selectedCompare)==JSON.stringify(oldSelectedCompare)){
            return {
                isClickCompare:false,
                selectedCompare:selectedCompare
            };
        }
        return {
                isClickCompare:true,
                selectedCompare:selectedCompare
            };
    },
    updateZhibiaocustomName:function(compareData,zhibiaoList){
        var zhibiaoList=App.deepClone(zhibiaoList);
        for(var i=0;i<zhibiaoList.length;i++){
            for(var j=0;j<compareData.length;j++){
                var compareIndexFields=compareData[j].compareIndexFields;
                for(var h=0;h<compareIndexFields.length;h++){
                    var n=zhibiaoList[i].name+':'+compareIndexFields[h].sceneName;
                    if(n==compareIndexFields[h].name && zhibiaoList[i].customName!=''){
                         zhibiaoList[i].customName="";
                    }
                }
            }
        }
        return zhibiaoList;
    },
    delCompareFilterFields:function(selectedCompare,filterFields,filterData){
        if(selectedCompare.type!="nocompare"){
            for(var i=0;i<filterFields.length;){
                if(selectedCompare.dimensionName==filterFields[i].name||selectedCompare.dimensionName==filterFields[i].dbField){
                    filterFields.splice(i,1);
                }else{
                    i++
                }
            }
            for(var i=0;i<filterData.length;i++){
                if(selectedCompare.weiItem.fieldName==filterData[i].fieldName||selectedCompare.dimensionName==filterData[i].name||selectedCompare.dimensionName==filterData[i].fieldName){
                    if(filterData[i].valueType){
                        delete filterData[i].valueType;
                    }
                    filterData[i].popData=[];
                    filterData[i].nameInfoOpen=false;
                }
            }
        }
        
        return {
            filterFields:filterFields,
            filterData:filterData
        };
    },
    addPageFormater:function(compareData,zhibiaoList){
        for(var i=0;i<zhibiaoList.length;i++){
            for(var j=0;j<compareData.length;j++){
                var compareIndexFields=compareData[j].compareIndexFields;
                for(var h=0;h<compareIndexFields.length;h++){
                    var n=zhibiaoList[i].name+':'+compareIndexFields[h].sceneName;
                    if(n==compareIndexFields[h].name){
                         compareIndexFields[h].pageFormater=zhibiaoList[i].pageFormater;
                    }
                }
            }
        }
        return compareData;
    }


}
