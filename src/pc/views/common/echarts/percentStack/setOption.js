var ReportUtil = require('../../../../utils/ReportUtil');

function SetOption(option,indexFields) {
	this.option=option;
	this.indexFields=indexFields;
	this.setStackOption();
}

SetOption.prototype = {

	setStackOption: function() {

		this.selectedArr = [];
		this.stackArray = [];
		var option = this.option,
			indexFields = this.indexFields,
			selected = {};
		if (Object.prototype.toString.call(option.legend) === "[object Array]") {
			selected = option.legend[0]['selected'];
		} else {
			selected = option.legend.selected;
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
		this._setStackedIndexFields();	
		// if (indexFields.length == 1) {
		// 	this._setStackedIndexFields();
		//  } else {
		//  	this._multiIndexFields();
		//  }

		
	},
	getOption:function(){
		return this.option;
	},
	//堆积
	_stackName: function(name) {
		var stackArray = this.stackArray;
		for (var h = 0; h < stackArray.length; h++) {
			if (name.indexOf(stackArray[h].fieldsName) != -1) {
				return stackArray[h].name;
			}
		}
	},
	//判断是否选中方法
	_contrastName: function(name) {
		if (this.selectedArr.length == 0) {
			return true;
		}
		var index = 0;
		for (var i = 0; i < this.selectedArr.length;) {
			if (name === this.selectedArr[i].name) {
				return false;
			} else {
				i++;
				index++;
			}
		}
		if (index === this.selectedArr.length) {
			return true;
		}
	},
	_setStackedIndexFields: function() {
		var option = this.option;
		var series = this.option.series;
		var indexFields=this.indexFields;
		var dataLen = 0;
		var stackTotal = [];
		
		if(series[0]){
			dataLen = series[0].data.length;
		}
		if(indexFields.length>1){
			this._setIndexStackArr(series);
		}

		for (var i = 0; i < dataLen; i++) {
			var stackObj = {};
			for (var h = 0; h < indexFields.length; h++) { 
				var fieldsName = indexFields[h].name;
				stackObj[fieldsName] = [];
				var totalVal = 0;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					//选中状态 
					var isSelected = this._contrastName(curName);
					if (isSelected) {
						if (indexFields.length===1 || curName.indexOf(fieldsName) != -1) {
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
		for (var i = 0; i < dataLen; i++) {
			for (var h = 0; h < indexFields.length; h++) { //堆积图条数循环
				var indexName = indexFields[h].name;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					var isSelected = this._contrastName(curName);
					//选中状态 
					if (isSelected && ( indexFields.length===1 || curName.indexOf(indexName) != -1)) {
						var seriesVal = parseFloat(series[j].data[i]['realValue']);
						var totalVal = stackTotal[i][indexName][0];
						var value = 0;
						var stackName = series[0].name;
						if(indexFields.length>1){
							stackName = this._stackName(curName);
						}
						series[j].stack = stackName;
						if (seriesVal != 0 && totalVal != 0) {
							value = (seriesVal / totalVal * 100).toString();
							if (value.indexOf(".") != -1) {
								value = value.substring(0, value.indexOf(".") + 3);
							}
						}
						series[j].data[i]['value'] = parseFloat(value);
						series[j].data[i]['fieldsName'] = indexName;
						series[j].data[i]['totalValue'] = parseFloat(totalVal);
						var pattern      = series[j].data[i].pattern || "";
						let pageFormater = series[j].data[i].pageFormater || null;
						series[j].data[i]['formatTotalValue'] = ReportUtil.getFormattedTotalValueForStack(totalVal, pattern, pageFormater);
					}
					
				}
			}
		}
		this.option=option;
	},
	_setIndexStackArr:function(series){
		var indexFields = this.indexFields;
		//指标长度  一个x轴维度中的 堆积的柱状条数
		for (var i = 0; i < indexFields.length; i++) {
			for (var j = 0; j < series.length; j++) {
				var indexFieName = indexFields[i]['name'];
				if (series[j]['name'].indexOf(indexFieName) != -1) {
					var stackObj = {
						name: series[j].name,
						fieldsName: indexFieName
					}
					this.stackArray.push(stackObj);
					j = series.length + 1;
				}
			}
		}
	},
	_multiIndexFields: function() {
		var option = this.option;
		var series = this.option.series;
		var indexFields = this.indexFields;
		if(series[0]){
			var datas = series[0].data.length;
		}
		this._setIndexStackArr(series);

		//求和 计算
		var stackTotal = [];
		for (var i = 0; i < datas; i++) {
			var stackObj = {};
			for (var h = 0; h < indexFields.length; h++) { //堆积图条数循环
				var fieldsName = indexFields[h].name; 
				stackObj[fieldsName] = [];
				var totalVal = 0;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					//选中状态 
					var isSelected = this._contrastName(curName);
					if (isSelected) {
						if (curName.indexOf(fieldsName) != -1) {
							var realValue = series[j].data[i]['realValue'];
							totalVal += parseFloat(realValue);
						}
					}
				}
				stackObj[fieldsName].push(totalVal)
			}
			stackTotal.push(stackObj);
		}
		this.test = stackTotal;
		//写入计算结果
		for (var i = 0; i < datas; i++) {
			for (var h = 0; h < indexFields.length; h++) { //堆积图条数循环
				var fieldsName = indexFields[h].name;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					var isSelected = this._contrastName(curName);

					//选中状态 
					if (isSelected) {
						if (curName.indexOf(fieldsName) != -1) {
							var stackName = this._stackName(curName);
							series[j].stack = stackName;
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

							var pattern      = series[j].data[i].pattern || "";
							let pageFormater = series[j].data[i].pageFormater || null;

							series[j].data[i]['formatTotalValue'] = ReportUtil.getFormattedTotalValueForStack(totalArrVal, pattern, pageFormater);
						}
					}
				}
			}
		}
		this.option=option;
	},
};

module.exports = SetOption;