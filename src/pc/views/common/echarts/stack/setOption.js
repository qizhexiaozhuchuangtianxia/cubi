
var ReportUtil = require('../../../../utils/ReportUtil');

function SetOption(option,indexFields) {
	this.option=option;
	this.indexFields=indexFields;
	this.setStackOption();
}

SetOption.prototype = {

	setStackOption:function(){
		var option = this.option,
			selected = {};
		this.unselectedArr = [];
 
		if (Object.prototype.toString.call(option.legend) === "[object Array]") {
			selected = option.legend[0]['selected'];
		}else{
			selected=option.legend.selected;
		}
		//创建未选中图例数组
		for (var obj in selected) {
			var curObj = {
				name: obj
			};
			if (!selected[obj]) {
				curObj[obj] = selected[obj]
				this.unselectedArr.push(curObj);
			}
		}
		this._setStackedIndexFields();
		
	},
	//判断是否选中方法
	_contrastName:function (name) {
		if (this.unselectedArr.length == 0) {
			return true;
		}
		var index = 0;
		for (var i = 0; i < this.unselectedArr.length;) {
			if (name === this.unselectedArr[i].name) {
				return false;
			} else {
				i++;
				index++;
			}
		}
		if (index === this.unselectedArr.length) {
			return true;
		}
	},
	_setStackedIndexFields:function(){//堆积图
		var option=this.option;
		var series=option.series;
		var indexFields=this.indexFields;
		var dataLen = 0;
		if(series[0]){
			dataLen = series[0].data.length;
		}
		//求和 计算
		var stackTotal=[];
		for (var i = 0; i < dataLen; i++) {
			var stackObj={};

			for(var h=0;h<indexFields.length;h++){
				var fieldsName=indexFields[h].name;
				stackObj[fieldsName]=[];
				var totalVal = 0;
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					//图例的选中状态 
					var isSelected = this._contrastName(curName);	

					if (isSelected) {
						if(indexFields.length===1 || curName.indexOf(fieldsName) != -1){
							var realValue = series[j].data[i]['realValue'];
								totalVal += parseFloat(realValue);
						}
						// else{
						// 	if(curName.indexOf(fieldsName) != -1){
						// 		var realValue = series[j].data[i]['realValue'];
						// 		totalVal += parseFloat(realValue);
						// 	}
						// }
					}
				}
				stackObj[fieldsName].push(totalVal)
			}
			stackTotal.push(stackObj);
		}
		//写入计算结果
		for (var i = 0; i < dataLen; i++) {
			for(var h=0;h<indexFields.length;h++){ //堆积图条数循环
				var fieldsName=indexFields[h].name;

				// series的长度就是一根柱上要堆积多少块
				for (var j = 0; j < series.length; j++) {
					var curName = series[j]['name'];
					var isSelected = this._contrastName(curName);
					
					//选中状态 
					if (isSelected) {
						if(indexFields.length===1 || curName.indexOf(fieldsName) != -1){
							// 设置堆积 stack 是echart的配置
							series[j].stack=fieldsName;
							var totalVal = stackTotal[i][fieldsName][0];
							series[j].data[i]['fieldsName'] = fieldsName;
							series[j].data[i]['totalValue'] = parseFloat(totalVal);
							var pattern      = series[j].data[i].pattern || "";
							let pageFormater = series[j].data[i].pageFormater || null;
							series[j].data[i]['formatTotalValue'] = ReportUtil.getFormattedTotalValueForStack(totalVal, pattern, pageFormater);
						}
						// else{
						// 	if(curName.indexOf(fieldsName) != -1){
						// 		series[j].stack=fieldsName; 
						// 		var totalArrVal = stackTotal[i][fieldsName][0];
						// 		series[j].data[i]['fieldsName'] = fieldsName;
						// 		series[j].data[i]['totalValue'] = parseFloat(totalArrVal);

						// 		var pattern      = series[j].data[i].pattern || "";
						// 		let pageFormater = series[j].data[i].pageFormater || null;

						// 		series[j].data[i]['formatTotalValue'] = ReportUtil.getFormattedTotalValueForStack(totalArrVal, pattern, pageFormater);
						// 	}
						// }
						
					}
				}
			}
		}
		this.option=option;
	},
	getOption:function(){
		return this.option;
	}
};

module.exports = SetOption;