/**
 * 立方Store
 */

var App = require('app');
var { WEB_API } = require('../../constants/api');
module.exports = {

	events: {

	},

	/**
	 * 获取当前用户的立方目录列表
	 * @return Promise
	 */
	getUserMetaDataDirectoryList: function(sessionId) {
		//return new Promise();
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/design/getDirectories',
				type: 'POST',
				data: {},
				contentType: 'application/json',
				callback: function(result) {
					resolve(result);
				},
				errorCallback: function() {
					reject();
				}
			})


		});
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
				param: '&id=' + id + '&fieldName' + fieldName,
				contentType: 'application/json',
				callback: function(result) {
					resolve(result);
				},
				errorCallback: function() {
					reject();
				}
			})


		});
	},

	/**
	 * 获取指定目录的立方列表
	 * @return Promise
	 */
	getDirectoryMetaDataList: function(directoryId) {
		//return new Promise();
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/design/getMetadatas',
              			httpUrl: `${  WEB_API. GET_METADATA_URL}/${ directoryId }`,
				type: 'GET',
				data: {
					"queryParameters": {
						"queryParameter": {
							"type": "LOGIC",
							"field": "directoryId",
							"opertator": "EQ",
							"value": directoryId
						}
					}
				},
				contentType: 'application/json',
				callback: function(result) {
					resolve(result);
				},
				errorCallback: function() {
					reject();
				}
			});
		})


	},


	/**
	 * 获取指定的立方
	 * @return Promise
	 */
	getMetaData: function(metaDataId) {
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/runtime/getMetadata',
            		          httpUrl: `${  WEB_API. GET_METADATA_URL}/${ metaDataId }`,
				type: 'GET',
				param: '&id=' + metaDataId,
				contentType: 'application/json',
				callback: function(result) {
					if (!result.success) return resolve(result);

					var model = {};
					model.id = result.dataObject.id;
					model.directoryId = result.dataObject.directoryId;
					model.name = result.dataObject.name;
					model.containsRegion = result.dataObject.containsRegion;
					model.content = result.dataObject.cubeComment;
					model.canEdited = result.dataObject.canEdited;
					model.weiduList = [];
					model.zhibiaoList = [];
					model.zhibiao_pj_list = [];
					model.zhibiao_hj_list = [];
					model.zhibiao_max_list = [];
					model.zhibiao_min_list = [];
					model.zhibiao_jishu_list = [];
					model.zhibiao_jisuanlie_list = [];
					model.zhibiao_weidujishu_list = [];
					model.filterData = [];
					for (var i = 0; i < result.dataObject.metadataColumns.length; i++) {
						if (result.dataObject.metadataColumns[i].show)
							if (result.dataObject.metadataColumns[i].dmType == 'dimension') {
								//维度
								var weiduObj = {
									"name": result.dataObject.metadataColumns[i].name,
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dateSize": result.dataObject.metadataColumns[i].dateSize,  // 立方中设置筛选日期时长，-1未设置
									"dimensionId": result.dataObject.metadataColumns[i].dimensionId || null,
									"dimensionDataType": result.dataObject.metadataColumns[i].dimensionDataType,
									"type": 1,
									"customName": '',
								}
								//树形维度 GROUP：复合字段
								var type=result.dataObject.metadataColumns[i].type||'';
								if (type=="GROUP_TITLE_FIELD") {
									weiduObj.groupType = type; 
									weiduObj.groupLevels = result.dataObject.metadataColumns[i].groupLevels;
								} else if ("GROUP_DATE_TITLE_FIELD") {
									weiduObj.groupType = type;
									weiduObj.groupLevels = ["年", "季度", "月", "周", "日" ];
								}
								
								model.weiduList.push(weiduObj);
								model.filterData.push({
									"nameInfoDesc": [],
									"nameInfoType": result.dataObject.metadataColumns[i].name,
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"name": result.dataObject.metadataColumns[i].name,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dateSize": result.dataObject.metadataColumns[i].dateSize,  // 立方中设置筛选日期时长，-1未设置
									"nameInfoOpen": false,
									"popData": [],
									'groupType':type,
									'groupLevels' : result.dataObject.metadataColumns[i].groupLevels||[],
									'dimensionId' : result.dataObject.metadataColumns[i].dimensionId||'',
								});
								model.zhibiao_weidujishu_list.push({
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"name": result.dataObject.metadataColumns[i].name + '(计数)',
									"typeName": '(计数)',
									"statistical": "COUNT",
									"distinct":"distinct", 
									"type": 9,
								})
								
							} else { 
								model.zhibiaoList.push({
									"name": result.dataObject.metadataColumns[i].name,
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"itemName": result.dataObject.metadataColumns[i].name,
									"typeName": '',
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dimensionId": null,
									"dimensionDataType": null,
									"statistical": "",
									"type": 2,
									"customName": ''
								});
								model.zhibiao_hj_list.push({
									"name": result.dataObject.metadataColumns[i].name + '(求和)',
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"itemName": result.dataObject.metadataColumns[i].name,
									"typeName": '(求和)',
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dimensionId": null,
									"dimensionDataType": null,
									"statistical": "SUM",
									"type": 3,
									"customName": ''
								});
								model.zhibiao_pj_list.push({
									"name": result.dataObject.metadataColumns[i].name + '(平均)',
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"itemName": result.dataObject.metadataColumns[i].name,
									"typeName": '(平均)',
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dimensionId": null,
									"dimensionDataType": null,
									"statistical": "AVG",
									"type": 4,
									"customName": ''
								});
								model.zhibiao_max_list.push({
									"name": result.dataObject.metadataColumns[i].name + '(最大值)',
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"itemName": result.dataObject.metadataColumns[i].name,
									"typeName": '(最大值)',
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dimensionId": null,
									"dimensionDataType": null,
									"statistical": "MAX",
									"type": 5,
									"customName": ''
								});
								model.zhibiao_min_list.push({
									"name": result.dataObject.metadataColumns[i].name + '(最小值)',
									"fieldName": result.dataObject.metadataColumns[i].fieldName,
									"itemName": result.dataObject.metadataColumns[i].name,
									"typeName": '(最小值)',
									"fieldType": result.dataObject.metadataColumns[i].dataType,
									"jdbcType": result.dataObject.metadataColumns[i].jdbcType,
									"dataType": result.dataObject.metadataColumns[i].dataType,
									"dmType": result.dataObject.metadataColumns[i].dmType,
									"show": result.dataObject.metadataColumns[i].show,
									"dimensionId": null,
									"dimensionDataType": null,
									"statistical": "MIN",
									"type": 6,
									"customName": ''
								});

							}
					}
					model.zhibiao_jishu_list.push({
						"name": '计数',
						"fieldName": 'countIndex',
						"itemName": 'count',
						"typeName": '(计数)',
						"fieldType": 'VARCHAR',
						"jdbcType": '',
						"dataType": 'STRING',
						"dmType": 'measure',
						"show": false,
						"dimensionId": null,
						"dimensionDataType": null,
						"statistical": "COUNT",
						"type": 7,
						"customName": ''
					});
					model.zhibiao_jisuanlie_list.push({
						"name": "计算列",
						// "fieldName": '',
						// "itemName": '',
						// "typeName": '(计算列)',
						// "fieldType": '',
						// "jdbcType": '',
						// "dataType": '',
						// "dmType": '',
						// "show": false,
						// "dimensionId": null,
						// "dimensionDataType": null,
						"statistical": "",
						"type": 8,
						"customName": '',
						"expression": ''
					});

					model.success = true;
					resolve(model);
				},
				errorCallback: function() {
					reject();
				}
			});
		});

	},

	/**
	 * 根据指定目录ID获取子目录和立方列表
	 * @parentDirectoryId：根目录为null，可以不传值
	 * @return 子目录和立方列表
	 */
	getMetadataList: function(parentDirectoryId) {
		parentDirectoryId = parentDirectoryId || '';
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/design/getResources',
				type: 'POST',
				data: {
					'queryParameters': {
						'sortParameters': [{
							'field': 'id',
							'method': 'DESC'
						}],
						'queryParameter': {
							'type': 'LOGIC',
							'field': 'parentId',
							'opertator': 'EQ',
							"value": parentDirectoryId
						}
					}
				},
				httpUrl:WEB_API.METADATA_GET_RESOURCES,
				contentType: 'application/json',
				callback: function(result) {
					if (result.success) {
						resolve(result);
					} else {
						reject(result.message);
					}
				},
				errorCallback: function() {
					reject('网络错误');
				}
			});
		});

	},
	getPageFieldFirstData: function(id, fieldName, pageRowCount) {
		//return new Promise();
		var data = {
			"fieldName": fieldName, // 筛选字段（必选）
			"sortParameters": { // 排序属性（可选）
				"field": fieldName, // 排序字段
				"method": "ASC"
			},
			"filterParameter": { // 筛选条件（可选）
				"field": fieldName, // 筛选字段
				"value": '' // 筛选值
			},
			"pageParameter": { // 可选
				"pageRowCount": pageRowCount ? pageRowCount : 50, //一页的数据行数
				"currentPageNo": 1 //一页的数据行数
			}
		}
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/runtime/getPageFieldData',
              			httpUrl: `${WEB_API.GET_PAGE_FIELD_DATA_URL}/${ id }`, 
				type: 'POST',
				contentType: 'application/json',
				param: '&id=' + id,
				data: data,
				callback: function(result) {
					resolve(result.dataObject);
				},
				errorCallback: function() {
					reject();
				}
			})
		});
	},
	getFilterFieldItems: function(metaDataId, filterFields) {
		var promiseList = [];
		for (var i = 0; i < filterFields.length; i++) {
			promiseList.push(this.getFieldItems(filterFields[i], metaDataId));

		}
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then(function(arr) {
				resolve(arr);
			});
		});
	},
	getFieldItems: function(filterField, id) {
		return new Promise((resolve, reject) => {
			this.getPageFieldFirstData(id, filterField.FieldName, 50).then(function(items) {
				filterField.popData = {
					popDataType: 0,
					popDataInfo: []
				};
				for (var i = 0; i < items.dataArray.length; i++) {
					var datainfo = {
						id: items.dataArray[i].id,
						name: items.dataArray[i].name,
						checboxBool: false
					}
					filterField.popData.popDataInfo.push(datainfo);
				}
				resolve(filterField);

			})
		});
	},
	setFilterData: function(filterData, filterFields) {
		var newFilterData = [];
		for (var i = 0; i < filterData.length; i++) {
			newFilterData.push(filterData[i]);
		}
		//初始化filter信息
		if (filterFields.length > 0) {
			for (var i = 0; i < filterFields.length; i++) {
				if (filterFields[i].valueType == 'STRING') {
					for (var j = 0; j < newFilterData.length; j++) {
						if (filterFields[i].dbField == newFilterData[j].FieldName) {
							newFilterData[j].NameInfoOpen = true;
							for (var k = 0; k < filterFields[i].items.length; k++) {
								for (var l = 0; l < newFilterData[j].popData.popDataInfo.length; l++) {
									if (filterFields[i].items[k].value == newFilterData[j].popData.popDataInfo[l].id) {
										newFilterData[j].popData.popDataInfo[l].checboxBool = true;
										newFilterData[j].nameInfoDesc.push(newFilterData[j].popData.popDataInfo[l].name);
									}
								}
							}
						}
					}
				} else if (filterFields[i].valueType == 'DATE_CYCLE') {
					for (var j = 0; j < newFilterData.length; j++) {
						if (filterFields[i].dbField == newFilterData[j].FieldName) {
							newFilterData[j].NameInfoOpen = true;
							newFilterData[j].nameInfoDesc = filterFields[i].value;
							newFilterData[j].valueType = filterFields[i].value[0];
						}
					}
				} else if (filterFields[i].valueType == 'DATE_RANGE') {
					for (var j = 0; j < newFilterData.length; j++) {
						if (filterFields[i].dbField == newFilterData[j].FieldName) {
							newFilterData[j].NameInfoOpen = true;
							newFilterData[j].nameInfoDesc = filterFields[i].value;
							newFilterData[j].valueType = 'CUSTOM';
						}
					}
				}
			}
		}
		return newFilterData;
	},
	setDashboardFilterData:function(filterFields,metaFilterFields,metadataId){
		var filterFields=filterFields;
		for(var i=0;i<filterFields.length;i++){ 
            for(var j=0;j<metaFilterFields.length;j++){
                if(filterFields[i].name==metaFilterFields[j].name){
                    filterFields[i].groupType=metaFilterFields[j].groupType;
                    filterFields[i].dimensionId=metaFilterFields[j].dimensionId;
                    filterFields[i].groupLevels=metaFilterFields[j].groupLevels;
                    filterFields[i].metadataId=metadataId;
                }
            }
            
        }
        return filterFields;
	},

	/**
	 * 获取立方资源的相关信息
	 * @param metadataId 立方ID
	 */
	getMetadataInfo: function(metadataId) {
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/design/getResource',
				type: 'POST',
				contentType: 'application/json',
				//param: '&resourceId=' + metadataId,
				httpUrl:WEB_API.METADATA_GET_RESOURCE.replace(":id", metadataId),
				//data: {resourceId:metadataId},
				callback: function(result) {
					resolve(result.dataObject);
				},
				errorCallback: function() {
					reject();
				}
			});
		});
	},

	/**
	 * 获取立方文件夹路径
	 * @param metadataId 立方ID
	 */
	getMetadataPath: function(metadataId) {
		return new Promise((resolve, reject) => {
			App.ajax({
				url: '/services/metadata/design/getPath',
				type: 'POST',
				contentType: 'application/json',
				//param: '&id=' + metadataId,
				httpUrl:WEB_API.METADATA_GET_PATH.replace(':id',metaDataId),
				//data: {id:},
				callback: function(result) {
					resolve(result.dataObject);
				},
				errorCallback: function() {
					reject();
				}
			});
		});
	}
}