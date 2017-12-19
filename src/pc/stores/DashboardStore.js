/**
 * 驾驶舱列表Store
 */
var App = require('app');
var { WEB_API } = require('../../constants/api');
module.exports = {
    events: {},
    setRows:function(rows){
        var rowData = [];
        rows.map(function(rowItem,rowIndex){
            var items = {cells:[]};
            rowItem.cells.map(function(cellItem,cellIndex){
                cellItem.cells.map(function(colItem,colIndex){
                    if(rowItem.cells.length==1){
                        colItem.width = colItem.width - 16;
                    }
                    if(rowItem.cells.length==2){
                        if(cellItem.cells.length==1){
                            colItem.width = colItem.width - 8;
                        }
                        if(cellItem.cells.length==2){
                            colItem.width = colItem.width - 4;
                        }
                    }
                    items.cells.push(colItem);
                })
            })
            rowData.push(items);
        })
        return rowData;
    },
    addCell:function(arg){
        var rows = arg.rows,
            row = arg.row,
            cell = arg.cell,
            col = arg.col,
            id = arg.id,
            useType = arg.useType,
            minWidth = 300,
            maxWidth = minWidth*3,
            cells = {
                width:minWidth*4,
                height:382,
                report:{}
            };
        if(rows.length==0){
            rows.push({
                cells:[cells]
            })
            return rows;
        }
        if (!col) {
            rows.splice(row, 0,{cells:[cells]});
            return rows;
        }
        var colLength = rows[row].cells.length;
        var addCol;
        if (col == 'left') {
            addCol = arg.cell;
        }
        if(col == 'right'){
            addCol = arg.cell + 1;
        }
        cells.height = rows[row].cells[0].height;
        if(colLength==1){
            rows[row].cells[0].width = minWidth*2;
            cells.width = minWidth*2;
        }
        if(colLength==2){
            let width = minWidth*4/3;
            if(rows[row].cells[0].width > minWidth && rows[row].cells[1].width > minWidth){
                let width_0 = rows[row].cells[0].width - width/2;
                let width_1 = rows[row].cells[1].width - width/2;
                if(width_0 < minWidth){
                    let differWidth = minWidth - width_0;
                    width_0 = minWidth;
                    width_1 = width_1 - differWidth; 
                }
                if(width_1 < minWidth){
                    let differWidth = minWidth - width_1;
                    width_1 = minWidth;
                    width_0 = width_0 - differWidth; 
                }
                rows[row].cells[0].width = width_0;
                rows[row].cells[1].width = width_1;
            }else{
                if(rows[row].cells[0].width == 300){
                    rows[row].cells[1].width = rows[row].cells[1].width - width;
                }
                if(rows[row].cells[1].width == 300){
                    rows[row].cells[0].width = rows[row].cells[0].width - width;
                }
            }
            cells.width = width;
        }
        if(colLength==3){
            rows[row].cells[0].width = minWidth;
            rows[row].cells[1].width = minWidth;
            rows[row].cells[2].width = minWidth;
            cells.width = minWidth;
        }
        rows[row].cells.splice(addCol, 0, cells);
        return rows;

    },
    delCell:function(arg){
        var rows = arg.rows,
        row = arg.row,
        cell = arg.cell,
        col = arg.col,
        w = 1200;
        rows=this.delGlobalFilter(arg);
        if(rows[row].cells.length==1){//一列
            rows.splice(row, 1);
        }else if(rows[row].cells.length==2){//两列
            rows[row].cells.splice(col, 1);
             rows[row].cells[0].width = w;
        }else if(rows[row].cells.length==3){//三列
            var width = rows[row].cells[col].width,width_1=0,width_2=0;
            if(col==0){
                width_1 = rows[row].cells[1].width;
                width_2 = rows[row].cells[2].width;
            } 
            if(col==1){
                width_1 = rows[row].cells[0].width;
                width_2 = rows[row].cells[2].width;
            } 
            if(col==2){
                width_1 = rows[row].cells[0].width;
                width_2 = rows[row].cells[1].width;
            } 
            rows[row].cells.splice(col, 1);
            rows[row].cells[0].width = width_1+width/2;
            rows[row].cells[1].width = width_2+width/2;
        }else if(rows[row].cells.length==4){//四列
            rows[row].cells.splice(col, 1);
            rows[row].cells[0].width = w/3;
            rows[row].cells[1].width = w/3;
            rows[row].cells[2].width = w/3;
        }
        return rows;
    },
    //删除全局筛选器
    delGlobalFilter: function(arg) {
        var rows=arg.rows,
            delCell=rows[arg.row].cells[arg.col];
        if(delCell.type=="REPORT"){return rows;}
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].cells;
            for(var t=0;t<cells.length;t++){
                var globalFilter = cells[t].report.globalFilterFields;
                if(!globalFilter){continue;}
                for (var h = 0; h < globalFilter.length; h++) {
                    if (globalFilter[h].sign == delCell.report.sign) {
                        globalFilter.splice(h, 1);
                    }
                }
            }
        }
        return rows;
    },
    addReport:function(arg){
        var rows = arg.rows,
        row = arg.row,
        cell = arg.cell,
        col = arg.col,
        id = arg.id,
        name = arg.name,
        useType = arg.useType,
        category = arg.category,
        rtype = arg.rtype,
        type = arg.type,
        content = arg.content,
        url = arg.url,
        cate = category ? category : 'CHART',
        reportType = rtype ? rtype : 'Pie2D',
        cellType = type ? type : 'REPORT',
        cells = {
            width:rows.length==0?1200:rows[row].cells[col].width,
            height:rows.length==0?382:rows[row].cells[col].height
        };
        cells.report = {};
        cells.report.id = id; 
        cells.report.name = name; 
        cells.report.category = cate;
        cells.report.type = reportType;
        cells.report.filterFields = [];
        if (arg.customCellWidthArr) {
            arg.customCellWidthArr.map(function(customCellWidth,customCellIndex){
                customCellWidth.labelVal = '适中';
                customCellWidth.defaultValue = 0.5;
            })
        }
        cells.report.columnAttributes = arg.customCellWidthArr;
        if(type=='TEXT'){
            cells.report = {
                name: name,
                content: content
            }
        }
        if(type=='WEB'){
            cells.report = {
                name: name,
                url: url
            }
        }
        cells.type = cellType;
        var max = 0;
        var index = 0;
        var globalFilter = [];
        for (var i = 0; i < rows.length; i++) {
            var cellNum = rows[i].cells;
            for (var j = 0; j < cellNum.length; j++) {
                var f = cellNum[j].report.globalFilterFields;
                if (f) {
                    if (f.length > max) {
                        max = f.length;
                        globalFilter = cellNum[j].report.globalFilterFields;
                    }
                }
            }
        }
        var globalFilters = JSON.stringify(globalFilter);
        globalFilters = JSON.parse(globalFilters);
        for (var i = 0; i < globalFilters.length; i++) {
            globalFilters[i].open = false;
        }
        cells.report.globalFilterFields = globalFilters;
        if(rows.length==0){
            rows.push({
                cells:[cells]
            })
            return rows;
        }
        if(rows.length==1&&rows[0].cells[0].report.addData=='no'){
            rows[0].cells[0] = cells;
            return rows;
        }
        rows.map(function(rowItem,rowIndex){
            if(rowIndex==row){
                rowItem.cells[col] = cells;
            }
        })
        return rows;
    },
    addGlobalFilter:function(arg){
        var rows = arg.rows,
        row = arg.row,
        cell = arg.cell,
        col = arg.col,
        type = arg.type,
        sign = new Date().getTime(),
        cellType = type ? type : 'REPORT',
        globalFilterFields = {
            filterType: arg.type,
            filterName: arg.name,
            filterAliasName:arg.name,
            open: false,
            sign: sign,
            row: row,
            col: col,
            
        },
        cells = {
            width:rows.length>0 ? rows[row].cells[col].width : 1200,
            height:rows.length>0 ?  rows[row].cells[col].height : 382
        };
        
        cells.report ={
            sign:sign,
            filterName:arg.name,
            filterAliasName:arg.name,
            //globalFilterFields:[globalFilterFields] 
        };
        if(arg.type==="DATE_FILTER"){
            cells.report.startValue='1990年1月1日';
            cells.report.endValue='2090年1月1日';
            cells.report.minValue='1990年1月1日';
            cells.report.maxValue='2090年1月1日';
            cells.report.disabled=false;
        }
        cells.type = cellType;
        //修改bug 创建首个全局筛选报错
        if(rows.length==0){
            rows.push({
                cells:[cells]
            })
        }else{
            rows[row].cells[col] = cells;
        }
        rows.map(function(rowItem,rowIndex){
            rowItem.cells.map(function(cellItem,cellIndex){
                if(!cellItem.report.globalFilterFields){
                    cellItem.report.globalFilterFields = []; 
                } 
               cellItem.report.globalFilterFields.push(globalFilterFields);
            })
        })

        return rows;
    },
    setCellWidth:function(rows,dragWidth,row,cell,col,validate){
        var colLength = rows[row].cells.length;
        var addWidth = rows[row].cells[col].width + rows[row].cells[col+1].width;
        var prevWidth = rows[row].cells[col].width - dragWidth;
        var nextWidth = rows[row].cells[col+1].width + dragWidth;
        if(prevWidth<=300){
            prevWidth = 300;
            nextWidth = addWidth - 300;
        }
        if(prevWidth>=900){
            prevWidth = 900;
            nextWidth = addWidth - 900;
        }
        if(nextWidth<=300){
            nextWidth = 300;
            prevWidth = addWidth - 300;
        }
        if(nextWidth>=900){
            nextWidth = 900;
            prevWidth = addWidth - 900;
        }
        rows[row].cells[col].width = prevWidth;
        rows[row].cells[col+1].width = nextWidth;
        return rows;
    },
    dashboardComponentData:function(json){
        var datas = {
            data: [],
            message: "获取驾驶舱信息成功。",
            sessionId: "xJ8VucyOdh7+k6LXNM1We3NK+c8vSiAYB8gp2QZ2ggQjybGQWgeqLg==",
            success: true
        };
        var dashboardData = json.dataObject.rows;
        for(var i=0;i<dashboardData.length;i++){
            var conSpan = 2;
            if(dashboardData[i].cells.length>1){
                conSpan = 1;
            }
            for(var j=0;j<dashboardData[i].cells.length;j++){
                dashboardData[i].cells[j].colSpan = conSpan;
               datas.data.push(dashboardData[i].cells[j]); 
            }
        };
        var rows = datas.data;
        var row = 0;
        for(var i=0;i<rows.length;i++){
            if(rows[i].colSpan==1){
                if(row==0){
                    var w = (rows[i].width+rows[(i+1)].width);
                    rows[i].pwidth =rows[i].width/w;
                    rows[(i+1)].pwidth =rows[(i+1)].width/w;
                    row= 1;
                }else{
                    row = 0;
                }
            }
            if(rows[i].colSpan==2){
                rows[i].pwidth = 1;
            }
        }
        return datas.data;
    },
    getDashboard:function(id,read,urlObj){//从列表页进到驾驶舱页面 获取驾驶舱数据的接口
        var _this = this;
        var strictSsionId=undefined;
        var param= '&id='+id;
        if(read){
            strictSsionId = urlObj.SessionID;// || '01jwaf/GPUsdY9zZ4VX+t4RXxyG3l2kYFEwbJ9BWU7No0='
            param+='&randomId='+urlObj.randomId + '&signCode='+urlObj.signCode;
        }
        return new Promise((resolve,reject)=>{
            App.ajax({
                url: '/services/dashboard/design/getDashboard',
                //type: 'POST',
                httpUrl: WEB_API.DASHBOARD_GET_DASHBOARD_URL.replace(":id", id),
                type: "GET",
                param: param,
                strictSsionId:strictSsionId,
                callback: function (result) {
                    if(result.success){
                        _this.modifyGetDashboardData(result.dataObject).then(function(data){
                            resolve(data);
                        });
                    }else{
                        console.log(result.message);
                    }
                },
                errorCallback:function(){
                    reject();
                }
            })
        })
    },
    modifyGetDashboardData:function(data){//修改驾驶舱的数据返回
        return new Promise((resolve, reject)=>{
            if(data.rows){
                for (var i = 0; i < data.rows.length; i++) {
                    if(data.version=='3.0'||!data.version){
                        if(data.rows[i].cells.length==2){
                            var cell0 = data.rows[i].cells[0],
                                cell1 = data.rows[i].cells[1]
                           data.rows[i].cells =[{
                                cells:[cell0]
                           },{
                                cells:[cell1]
                           }] 
                        }else{
                            data.rows[i].cells =[{
                                cells:[data.rows[i].cells[0]]
                           }]
                        }
                    }
                    if(data.version!='3.02'){
                        for (var j = 0; j < data.rows[i].cells.length; j++) {
                            for(var x=0;x<data.rows[i].cells[j].cells.length;x++){
                                if(data.rows[i].cells[j].cells[x].report.category == 'INDEX' && !data.rows[i].cells[j].cells[x].report.columnAttributes){
                                    this.initAutoColWidthHandle(data.rows[i].cells[j].cells[x].report.id).then(function(result){
                                        data.rows[i].cells[j].cells[x].report.columnAttributes = result || [];
                                    });
                                }
                            }
                        }
                    } else {
                        for (var j = 0; j < data.rows[i].cells.length; j++) {
                             if(data.rows[i].cells[j].report.category == 'INDEX' && !data.rows[i].cells[j].report.columnAttributes){
                                this.initAutoColWidthHandle(data.rows[i].cells[j].report.id).then(function(result){
                                    data.rows[i].cells[j].report.columnAttributes = result || [];
                                });
                            }
                        }
                    }
                }
            }
            resolve(data);
        })
    },
    initAutoColWidthHandle:function(reportId){//当没有自定列宽的时候调用接口获取列表，并且初始化       
        return new Promise((resolve, reject) => {
            this.getColumnAttributesHandle(reportId).then(function(data){
                for(var i=0,j=data.length;i<j;i++){
                    data[i].labelVal='适中';
                    data[i].defaultValue=0.5;
                }
                resolve(data)
            })
        })
    },
    getColumnAttributesHandle:function(reportId){
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/design/getAreaInfo',
                //type: 'POST',
                type: "GET",
                httpUrl: WEB_API.DASHBOARD_GET_AREA_URL.replace(":id", reportId),
                contentType: 'application/json',
                param: '&id=' + reportId,
                callback: function(result) {
                    if(result.success){
                        resolve(result.dataObject.rowTitleFields.concat(result.dataObject.indexFields));
                    }else{
                        console.log(result.messsage);
                    }
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    getDashboardlist:function(data){
        return new Promise((resolve, reject) => {
            App.ajax({
                url:'/services/dashboard/design/getResources',
                type: "POST",
                httpUrl: WEB_API.DASHBOARD_QUERY_RESOURCES_URL,
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
    getDashboardFileslist:function(dirId){
        return new Promise((resolve, reject) => {
            App.ajax({
                url:'/services/dashboard/design/getDashboardsThumbnail',
                type : "POST",
                param:'&id='+dirId,
                callback:function(result){
                    result = result.dataObject.dashboards;
                    for(var i=0;i<result.length;i++){
                        result[i].index = i;
                        result[i].typeName = '文件';
                        result[i].listType = 'files';
                        result[i].listCheckBoxBool=false;
                    }
                    resolve(result);
                }
            })
        })
    },
    newCreateDashboardDir:function(saveReNameObj){
        return new Promise((resolve, reject) => {
            App.ajax({
                url:'/services/dashboard/design/saveResource',
                httpUrl: WEB_API.SAVE_RESOURCE_URL,
                type : "POST",
                param:'&resourceObject=' + encodeURIComponent(JSON.stringify(saveReNameObj)),
                data: { 'resourceObject': saveReNameObj },
                contentType: 'application/json',
                callback:function(result){
                    resolve(result);
                }
            })
        })
    },
    saveDashboard:function(data){
        return new Promise((resolve, reject) => {
            App.ajax({
                url:'/services/dashboard/design/saveDashboard',
                httpUrl: WEB_API.SAVE_DASHBOARD_URL,
                type : "PUT",
                data:data,
                contentType: 'application/json',
                callback:function(result){
                    resolve(result);
                }
            })
        })
    },
    getFilterValueHandle:function(id,dbField,inputValue){//驾驶舱获取筛选值得方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url:'/services/metadata/runtime/getSearchFieldData',
                type : "POST",
                param:'&id='+id+'&fieldName='+dbField+'&fieldValue='+inputValue,
                callback:function(result){
                    resolve(result);
                }
            })
        })
    },
    deleteDashboardListHandle:function(id){//删除驾驶舱列表的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url:"/services/dashboard/design/deleteResource",
                //type: "POST",
                type: "DELETE",
                httpUrl: WEB_API.DASHBOARD_DELETE_RESOURCE_URL.replace(':id', id),
                param: '&id=' + id,
                contentType: 'application/json',
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    reNameSaveDashboardHandle:function(reNameId,reNameName){//驾驶舱重命名的方法3
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dashboard/design/renameResource',
                //type: "POST",
                type: "PATCH",
                httpUrl: WEB_API.DASHBOARD_RENAME_RESOURCE_URL.replace(":id", reNameId),
                param: '&id=' + reNameId +'&name=' + reNameName,
                contentType: 'application/json',
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getPathDataHandle: function(resourceId) { //通过当前资源id获取头部面包屑导航方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dashboard/design/getPath',
                //type: "POST",
                type: "GET",
                httpUrl: WEB_API.DASHBOARD_GET_PATH_URL.replace(":id", resourceId),
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
                httpUrl: WEB_API.COMMON_GET_FUNCTIONS_URL,
                type: "GET",
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
                url: '/services/dashboard/design/moveResources',
                type: "POST",
                httpUrl: WEB_API.DASHBOARD_MOVE_RESOURCES_URL,
                contentType: 'application/json',
                data:data,
                param: '&targetId=' + targetId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    copyTargetHandle: function(targetId,data) { //用户操作当前文件夹复制接口方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dashboard/design/copyResources',
                type: "POST",
                httpUrl: WEB_API.DASHBOARD_COPY_RESOURCES_URL,
                contentType: 'application/json',
                data:data,
                param: '&targetId=' + targetId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    /**
    *
    *获取resouse的数据信息
    *
    **/
    getDashboardtData:function(dashboardId){
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/dashboard/design/getResource',
                //type: "POST",
                type: "GET",
                httpUrl: WEB_API.DASHBOARD_GET_RESOURCE_URL.replace(":id", dashboardId),
                param: '&id=' + dashboardId,
                contentType: 'application/json',
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    analysisExpression:function(expressions){
        var data = {  
            "expressions": expressions
        }
         return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/report/runtime/analysisExpression',
                type: "POST",
                httpUrl: WEB_API.DASHBOARD_ANALYSIS_EXPRESSION_URL,
                contentType: 'application/json',
                data:data,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },

};