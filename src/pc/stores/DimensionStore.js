/**
 * 维度Store
 */

var App = require('app');
import { WEB_API } from '../../constants/api';
module.exports = {

    getDimensionObjects: function(param) {
       
        var data={
            "queryParameters": {
                "sortParameters": [
                    {
                        "field": param.field,
                        "method":param.method
                    }
                ]
            }
        };

        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dimension/runtime/getDimensionObjects',
                httpUrl:WEB_API.GET_DIMENSION_OBJECTS_URL,
                type: 'POST',
                data: data,
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

    getDimensionObject: function(id) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dimension/runtime/getDimensionObject',
                httpUrl:`${WEB_API.GET_DIMENSION_OBJECT_URL}/${id}`,
                type: 'GET',
                param: '&id=' + id,
                //data: param,
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

    getDimensionData: function(id) {
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dimension/runtime/getDimensionData',
                httpUrl:`${WEB_API.GET_DIMENSION_DATA_URL}/${id}`,
                type: 'GET',
                param: '&id=' + id,
                //data: param,
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
    
    setDimensionObject:function(dataObject){

        var fileds=[];
        var nameArr=[];
        if(dataObject.levelName){
            var nameStr=dataObject.levelName;
            nameArr=nameStr.split('>');
        }else{
            nameArr=[dataObject.name];
        }

        for(var i=0;i<nameArr.length;i++){
            var obj={
                name:nameArr[i],
                customName:""
            }
            fileds.push(obj);
        }
        dataObject.fileds=fileds;

        return dataObject;
    },
    _rows:[],
    _cells:[],
    _lastColspan:1,
    _init:function(){
        this._rows=[];
        this._cells=[];
        this._lastColspan=1;
    },
    _tree:function(node,fields) { 
        var children = node.children;
        var rowspans=1;
        var obj={
                formatValue:node.name,
            }
        function sumRowspan(child){
            if (child && child.length) {
                for(var z=0;z<child.length;z++){
                    if(z>0){
                        rowspans++;
                    }
                    sumRowspan(child[z].children);
                }
                return rowspans;
            }      
        }
        if (children && children.length) {
            this._lastColspan++;
           var roe = sumRowspan(children)
        }else{
           roe=1;
           obj.colspan=fields.length;
           this._lastColspan=1;
        }
        obj.rowspan=roe;
        this._cells.push(obj);

        if (children && children.length) { 
            for (var i = 0; i < children.length; i++) { 
                this._tree(children[i],fields); 
            } 
        }else{
            var o={
                cells:null
            }
            o.cells=this._cells.slice(0);
            //o.cells.colspan=this._lastColspan;
            this._rows.push(o);
            this._cells=[];
           
        }
    },
    loopTree:function(json,fields){
        for(var i=0;i<json.length;i++){
            this._tree(json[i],fields);
        }
        var rowslen=this._rows.length;
        var dataObject = {
            pageParameter:{
                pageRowCount: rowslen+1,
                totalRowCount: rowslen,
                currentPageNo: 1
            },
            fields:fields,
            category:"INDEX",
            startNo:1,
            type:"TREE",
            pages:[
                {
                    rows:this._rows
                }
            ]
        };
        return dataObject;
    },
}