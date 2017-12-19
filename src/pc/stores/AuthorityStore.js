/**
 * 权限Store
 */
var App = require('app');
var { WEB_API } = require('../../constants/api');
module.exports = {
    getReportSetAuthorListHandle:function(resourceId){//获取报表右侧拉出权限列表的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/authority/getAuthorities',
                httpUrl: WEB_API.GET_AUTHORITIES_URL,
                type: "GET",
                contentType: 'application/json',
                param: '&resourceId=' + resourceId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getReportTeamNameHandle:function(teamId){//获取报表团队名字的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/usm/team/getTeamObject',
                httpUrl: WEB_API.GET_TEAM_OBJECT_URL.replace(':id', teamId),
                type: "GET",
                //type: "POST",
                contentType: 'application/json',
                param: '&id=' + teamId,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getTeamListHandle:function(){//当权限列表是空的时候执行的方法
        return new Promise((resolve, reject) => {
            var teamObj = {};
            var teamStr = '没有权限';
            teamObj.teamId = "";//当前的组id
            teamObj.authorityName = '所有人';//当前组的中文名字
            teamObj.view = false;//当前的组是否可以查看
            teamObj.edit = false;//当前的组是否可以编辑
            teamObj.delete = false;//当前的组是否可以删除
            teamObj.everyTeam = true;//当前组是否是所有人的组
            teamObj.seletedData = [{
                name:'可读',
                authorityListIndex:0,
                seleteBool:false,
                seletedIndex:0,
                anotherName :'view'
            },{
                name:'编辑',
                authorityListIndex:0,
                seleteBool:false,
                seletedIndex:1,
                anotherName:'edit'
            },{
                name:'删除',
                authorityListIndex:0,
                seleteBool:false,
                seletedIndex:2,
                anotherName:'delete'
            }];
            teamObj.openAuthority = teamStr;//当前的组有什么权限 如果什么都没有设置就返回的‘没有权限’
            resolve(teamObj);
        })
    },
    getAuthorityListData:function(authorityList){//拼接页面渲染需要的数据
        var resultDataArr = [];
        if(authorityList.length>0){
            for (var i = 0; i < authorityList.length; i++) {
                resultDataArr.push(this.getTeamNameListHandle(authorityList[i],i))
            }
        }else{
            resultDataArr.push(this.getTeamListHandle())
        }
        return new Promise((resolve, reject) => {
            Promise.all(resultDataArr).then(function(arr) {
                resolve(arr);
            });
        });
    },
    getTeamNameListHandle:function(itemObj,key){//拼接渲染页面需要的数据的拼接方法
        return new Promise((resolve, reject) => {
            this.getReportTeamNameHandle(itemObj.teamId).then(function(resultData) {
                if(resultData.success){
                    var teamObj = {};
                    var teamStr = '没有权限';
                    teamObj.teamId = itemObj.everyTeam?"":itemObj.teamId;//当前的组id
                    teamObj.authorityName = itemObj.everyTeam?'所有人':resultData.dataObject.teamName;//当前组的中文名字
                    teamObj.view = itemObj.view;//当前的组是否可以查看
                    teamObj.edit = itemObj.edit;//当前的组是否可以编辑
                    teamObj.delete = itemObj.delete;//当前的组是否可以删除
                    teamObj.everyTeam = itemObj.everyTeam;//当前组是否是所有人的组
                    teamObj.seletedData = [{
                        name:'可读',
                        authorityListIndex:key,
                        seleteBool:itemObj.view,
                        seletedIndex:0,
                        anotherName :'view'
                    },{
                        name:'编辑',
                        authorityListIndex:key,
                        seleteBool:itemObj.edit,
                        seletedIndex:1,
                        anotherName:'edit'
                    },{
                        name:'删除',
                        authorityListIndex:key,
                        seleteBool:itemObj.delete,
                        seletedIndex:2,
                        anotherName:'delete'
                    }];
                    if(itemObj.view || itemObj.edit || itemObj.delete){
                        teamStr = '';
                        if(itemObj.view){
                            teamStr += '读取 '
                        }
                        if(itemObj.edit){
                            teamStr += '编辑 '
                        }
                        if(itemObj.delete){
                            teamStr += '删除 '
                        }
                    }
                    teamObj.openAuthority = teamStr;//当前的组有什么权限 如果什么都没有设置就返回的‘没有权限’
                }else{
                    console.log(resultData.message);
                }
                resolve(teamObj);
            })
        });
    },
    getAuthorListData:function(reportId){//获取权限第一层的数据\
        var _this = this;
        return new Promise((resolve,reject) => {
            this.getReportSetAuthorListHandle(reportId).then(function(resultData){//获取第一层带有组id的接口
                if(resultData.success){
                    _this.getAuthorityListData(resultData.dataObject).then(function(data){//通过组id拼进出来租的名字
                        resolve(data);
                    })
                }else{
                    console.log(resultData.message);
                }
            })
        })
    },
    saveAuthorityHandle:function(saveData){//实时保存权限的方法
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/authority/saveResourceAuthorities',
                //type: "POST",
                httpUrl: WEB_API.SAVE_RESOURCE_AUTHORITIES_URL,
                type: 'PUT',
                contentType: 'application/json',
                data:saveData,
                callback: function(result) {
                    resolve(result);
                }
            })
        })
    },
    getAuthorityTreeHandle:function(resourceId,parentId){//获取全部分组的方法
        var _this = this;
        return new Promise((resolve, reject) => {
            App.ajax({
                url: '/services/authority/getAuthorityTree',
                //type: "POST",
                httpUrl: WEB_API.GET_AUTHORITY_TREE_URL,
                type: "GET",
                contentType: 'application/json',
                param: '&resourceId=' + resourceId,
                callback: function(result) {
                    _this.changeAuthorityArr(result.dataObject).then(function(dataArr){
                        resolve(dataArr);
                    })
                }
            })
        })
    },
    changeAuthorityArr:function(arrData){//转换成页面需要的数据数组的方法
        var arr = [];
        for(var i=0;i<arrData.length;i++){
            if(!arrData[i].checked) {
                arr.push({id:arrData[i].id,checked:arrData[i].checked,name:arrData[i].name});
            }
            if(arrData[i].children){
                each(arrData[i].children)   
            }   
        }
        function each(children){
            for(var j=0;j<children.length;j++){
                if(!children[j].checked){
                    arr.push({id:children[j].id,checked:children[j].checked,name:children[j].name});
                }
                if(children[j].children){
                    each(children[j].children);
                }   
            }   
        }
        return new Promise((resolve, reject) => {
            resolve(arr);
        })
    }
}