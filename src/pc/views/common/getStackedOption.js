/**
 * 计算百分百堆积柱状图option
 */
var ReportStore = require('../../stores/ReportStore');
module.exports = {
	getOption: function(option,indexFields) {
		this.indexFields=indexFields; 
		this.option=option;
		this.series=option.series;
		this.selectedArr = [];
		this.stackArray=[];

		var option = option,
			selected = {};

		if (Object.prototype.toString.call(option.legend) == "[object Array]") {
			selected = option.legend[0]['selected'];
		}
		//创建未选中图例数组
		for (var obj in selected) {
			var curObj = {
				name: obj
			};
			if (!selected[obj]) {
				curObj[obj] = selected[obj]
				this.selectedArr.push(curObj);
			}
		}
		if( typeof indexFields == 'string'){
			var _this=this;
			return ReportStore.getAreaInfo(indexFields).then(function(result) {
				if (result.success) {
					_this.indexFields=result.dataObject.indexFields;
					//只有一个指标
					if(_this.indexFields.length==1){
						return _this._oneIndexFields();
					//多个指标 
					}else{
						return _this._multiIndexFields();
					}
					//return resolve(result.dataObject.type);
				} else {
					return reject(result.message);
				}
			});
		}else{
			//只有一个指标
			if(indexFields.length==1){
				return this._oneIndexFields();
			//多个指标
			}else{
				return this._multiIndexFields();
			}
		}
		

	},
	//堆积
	_stackName:function(name){
		var stackArray=this.stackArray;
		for(var h=0;h<stackArray.length;h++){
			if(name.indexOf(stackArray[h].fieldsName)!=-1){
				return stackArray[h].name;
			}
		}
	},
	//判断是否选中方法
	_contrastName:function (name) {
		if (this.selectedArr.length == 0) {
			return true;
		}
		var index = 0;
		for (var i = 0; i < this.selectedArr.length;) {

			if (name == this.selectedArr[i].name) {
				return false;
			} else {
				i++;
				index++;
			}
		}
		if (index == this.selectedArr.length) {
			return true;
		}
	},
	_oneIndexFields:function(){
		//合计 计算
		var totalDatasetArray=[];
		var option=this.option;
		var series=option.series;
		if(series[0]){
			var datas = series[0].data.length;
		}
		// var datas = series[0].data.length;

		for (var i = 0; i < datas; i++) {
			var totalVal = 0;
			for (var j = 0; j < series.length; j++) {
				var curName = series[j]['name'];
				var isSelected = this._contrastName(curName);
				//选中状态 
				if (isSelected) {
					var realValue = series[j].data[i]['realValue'];
					totalVal += parseFloat(realValue);
				}
			} 
			totalDatasetArray.push(totalVal)
		}
		
		//写入计算结果
		for (var i = 0; i < datas; i++) {
			for (var j = 0; j < series.length; j++) {
				var curName = series[j]['name'];
				var isSelected = this._contrastName(curName);
				//选中状态 
				if (isSelected) {
					var seriesVal = parseFloat(series[j].data[i]['realValue']);
					var totalArrVal = totalDatasetArray[i];
					var value = 0;
					series[j].stack=series[0].name;
					if (seriesVal != 0 && totalArrVal != 0) {
						value = (seriesVal / totalArrVal * 100).toString();
						if (value.indexOf(".") != -1) {
							value = value.substring(0, value.indexOf(".") + 3);
						}
					}
					series[j].data[i]['value'] = parseFloat(value);
					series[j].data[i]['fieldsName'] = this.indexFields[0].name;
					series[j].data[i]['totalValue'] = parseFloat(totalArrVal);
				}
			}

		}
		return option;
	},
	_multiIndexFields:function(){
		var option=this.option;
		var series=option.series;
		var indexFields=this.indexFields;
		var datas = series[0].data.length;
		//指标长度  一个x轴维度中的 堆积的柱状条数
		for(var i=0;i<indexFields.length;i++){
			for(var j=0;j<series.length;j++){
				var indexFieName=indexFields[i]['name'];
				if(series[j]['name'].indexOf(indexFieName) !=-1){

					var stackObj={
						name:series[j].name,
						fieldsName:indexFieName
					}
					this.stackArray.push(stackObj);
					j=series.length+1;
				}
			}
		}
		//合计 计算
		var stackTotal=[];
		for (var i = 0; i < datas; i++) {
			var stackObj={};
			for(var h=0;h<indexFields.length;h++){ //堆积图条数循环
				var fieldsName=indexFields[h].name;//this.stackArray[h]['fieldsName'];
				stackObj[fieldsName]=[];
				var totalVal = 0;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					//选中状态 
					var isSelected = this._contrastName(curName);
						
					if (isSelected) {
						if(curName.indexOf(fieldsName) != -1){
							var realValue = series[j].data[i]['realValue'];
							totalVal += parseFloat(realValue);
						}
					}
				}
				stackObj[fieldsName].push(totalVal)
			}
			stackTotal.push(stackObj);
		}
		//写入计算结果
		for (var i = 0; i < datas; i++) {
			for(var h=0;h<indexFields.length;h++){ //堆积图条数循环
				var fieldsName=indexFields[h].name;//this.stackArray[h]['fieldsName'];
				for (var j = 0; j < series.length; j++) { 
					var curName = series[j]['name'];
					var isSelected = this._contrastName(curName);
					
					//选中状态 
					if (isSelected) {
						if(curName.indexOf(fieldsName) != -1){
							var stackName=this._stackName(curName);
							series[j].stack=stackName;
							//if(series[i].name.indexOf())
							var seriesVal = parseFloat(series[j].data[i]['realValue']);
							var totalArrVal = stackTotal[i][fieldsName][0];
							var value = 0;

							if (seriesVal != 0 && totalArrVal != 0) {

								value = (seriesVal / totalArrVal * 100).toString();

								if (value.indexOf(".") != -1) {
									value = value.substring(0, value.indexOf(".") + 3);
								}

							}
							series[j].data[i]['value'] = parseFloat(value);
							series[j].data[i]['fieldsName'] = fieldsName;
							series[j].data[i]['totalValue'] = parseFloat(totalArrVal);
						}
					}
				}
			}
		}
		return option;
	},
	setStacked:function(option,indexFields){

		this.indexFields=indexFields; 
		this.option=option;
		this.series=option.series;
		this.selectedArr = [];
		this.stackArray=[];
		var _this=this;
		var option = option,
			selected = {};

		if (Object.prototype.toString.call(option.legend) == "[object Array]") {
			selected = option.legend[0]['selected'];
		}
		//创建未选中图例数组
		for (var obj in selected) {
			var curObj = {
				name: obj
			};
			if (!selected[obj]) {
				curObj[obj] = selected[obj]
				this.selectedArr.push(curObj);
			}
		}

		if( typeof indexFields == 'string'){
			
			return ReportStore.getAreaInfo(indexFields).then(function(result) {
				if (result.success) {
					_this.indexFields=result.dataObject.indexFields;
					return _this._setStackedIndexFields(_this.indexFields)
				} else {
					return reject(result.message);
				}
			});
		}else{
			return _this._setStackedIndexFields(indexFields)
		}

		
	},
	_setStackedIndexFields:function(indexFields){//堆积图
		var option=this.option;
		var series=option.series;
		var indexFields=this.indexFields;
		var datas = series[0].data.length;
		//合计 计算
		var stackTotal=[];
		for (var i = 0; i < datas; i++) {
			var stackObj={};

			for(var h=0;h<indexFields.length;h++){
				var fieldsName=indexFields[h].name;
				stackObj[fieldsName]=[];
				var totalVal = 0;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					//选中状态 
					var isSelected = this._contrastName(curName);
						
					if (isSelected) {
						if(indexFields.length==1){
							var realValue = series[j].data[i]['realValue'];
								totalVal += parseFloat(realValue);
						}else{
							if(curName.indexOf(fieldsName) != -1){
								var realValue = series[j].data[i]['realValue'];
								totalVal += parseFloat(realValue);
							}
						}
					}
				}
				stackObj[fieldsName].push(totalVal)
			}
			stackTotal.push(stackObj);
		}
		//写入计算结果
		for (var i = 0; i < datas; i++) {
			for(var h=0;h<indexFields.length;h++){ //堆积图条数循环
				var fieldsName=indexFields[h].name;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					var isSelected = this._contrastName(curName);
					
					//选中状态 
					if (isSelected) {
						if(indexFields.length==1){
							series[j].stack=fieldsName;
							var totalArrVal = stackTotal[i][fieldsName][0];
							series[j].data[i]['fieldsName'] = fieldsName;
							series[j].data[i]['totalValue'] = parseFloat(totalArrVal);
						}else{
							if(curName.indexOf(fieldsName) != -1){
								series[j].stack=fieldsName;
								var totalArrVal = stackTotal[i][fieldsName][0];
								series[j].data[i]['fieldsName'] = fieldsName;
								series[j].data[i]['totalValue'] = parseFloat(totalArrVal);
							}
						}
						
					}
				}
			}
		}
		return option;
	},
}