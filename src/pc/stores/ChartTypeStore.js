/**
 * 报表类型Store
 */

var App = require('app');



module.exports = {
	/**
	 * 获取报表图形类型列表
	 */
	getChartTypeList: function() {
		return chartTypeList;
	},
	/**
	 * 获取默认使用的报表图形类型
	 */
	getDefaultChartType: function() {
		return this.getChartType('Pie2D');
	},
	/**
	 * 获取指定的图形类型
	 */
	getChartType: function(type) {
		for (var i = 0; i < chartTypeList.length; i++) {
			if (chartTypeList[i].type == type) {
				return chartTypeList[i];
			}
		}
		return null;
	},
	/**
	 * 获取指定类型的指标维度长度
	 */
	getLength: function(type) {
		for (var i = 0; i < chartTypeList.length; i++) {
			if (chartTypeList[i].type == type) {

				return {weiduLen:chartTypeList[i].wlength,zhibiaoLen:chartTypeList[i].zlength};
			}
		}
		return null;
	},

	isChartType(type) {
		if ("KPI" === type) {
			return false;
		}
		for (let counter = 0; counter < chartTypeList.length; counter++) {
			let chartType = chartTypeList[counter];

			if ("INDEX" === chartType.category) continue;
			if (chartType.type === type)        return true;
		}
		return false;
	},

	isIndexType(type) {
		if ("KPI" === type) {
			return false;
		}
		for (let counter = 0; counter < chartTypeList.length; counter++) {
			let chartType = chartTypeList[counter];

			if ("CHART" === chartType.category) continue;
			if (chartType.type === type)        return true;
		}
		return false;
	},

	isKPIType(type) {
		return "KPI" === type;
	},

	onChange:function(type,zlen,wlen){
		var changeed = false;
		switch (type) {
            case 'Pie2D':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
            case 'ScrollColumn2D':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
            case 'ScrollLine2D':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
            case 'StackedColumn2D':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
            case 'PercentColumn2D':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
			case 'MultiAxisLine' : {
				if ((0 < zlen) && (0 < wlen)) {
					changeed = true;
				}
				break;
			}
            case 'WordCloud' : {
                if ((0 < zlen) && (0 < wlen)) {
                    changeed = true;
                }
                break;
            }
            case 'EchartsMap':
                if(zlen>=1&&wlen>=1){
                	changeed = true;
                }
                break;
            case 'BASE':
                if(zlen>=1||wlen>=1){
                	changeed = true;
                }
                break;
            case 'TREE':
                if(zlen>=1||wlen>=1){
                	changeed = true;
                }
                break;
            case 'CATEGORY':
                if(zlen>=1||wlen>=1){
                	changeed = true;
                }
                break;
            case 'CROSS':
                if(zlen>=1&&wlen.row>=1&&wlen.col>=1){
                	changeed = true;
                }
                break;
            case 'KPI': 
            	if(zlen>=1&&wlen==0){            		 
            		changeed = true;            		              	
                } 
            	break;
            default:
                changeed = false;
    	}
    	return changeed;
	},
    checkIndexFields:function(indexFields,length,dimensionFields){
        let zhibiaolist = [];
        let checklist = [];
        let checked = true;
        indexFields.map(function(indexField){
            dimensionFields.map(function(dimensionField){
               if(dimensionField.fieldName  ==  indexField.fieldName){
                    checked = false;
                }

            })
            if(checked){
                indexField.checked = true;
                zhibiaolist.push(indexField);
            }else{
                indexField.checked = false;
                checklist.push(indexField);
            }
            checked = true;
        })
        if(zhibiaolist.length>length&&length!=''){
            for(var i=zhibiaolist.length-1;i>=length;i--){
                zhibiaolist[i].checked = false;
            }
        }
        return zhibiaolist.concat(checklist);
    },
    updateMultiAxis:function(multiAxisLine,zhibiaoLists,weiduList){
    	var name = '', multiAxisLineNew={},  yAxisKey='' ;

    	for( var i=0; i<zhibiaoLists.length; i++){
    		for(var j = 0; j<weiduList.length; ){
    			if(zhibiaoLists[i].fieldName == weiduList[j].fieldName ){
    				// name = weiduList[i].name;
    				name = zhibiaoLists[i].name;
    				i=zhibiaoLists.length;
    				break;
    			}else{
    				j++ 
    			}
    		}
    	}

 	for( var k =0; k<multiAxisLine.indexs.length;){
    		if( multiAxisLine.indexs[k].name == name ){
    			yAxisKey = multiAxisLine.indexs[k].yAxisKey;
    			multiAxisLine.indexs.splice(k,1);
    			break;
    		}else{ 
    			k++
    		}
    	}
    
    	 for(var o = 0; o<multiAxisLine.yAxis.length; ){
		// console.log(yAxisKey,'yAxisKey')
		if(multiAxisLine.yAxis[o].key == yAxisKey){
			// console.log(o,'ooooooo')
			multiAxisLine.yAxis.splice(o,1);
			// console.log(JSON.parse(JSON.stringify(multiAxisLine.yAxis)),multiAxisLine.yAxis,'sfsdf')
			// multiAxisLine.indexs = multiAxisLine.indexs;
			// multiAxisLine.yAxis = newYAxis;
			  console.log(multiAxisLine,'-=-=-=-=-=')
			return multiAxisLine
		}else{
			o++
		}
	}
    },
    updateMultiAxisZhibiaoList:function(zhibiaoLists,weiduList){
    	
    	var zhibiaoLists = JSON.parse(JSON.stringify(zhibiaoLists))

    	for( var i=0; i<zhibiaoLists.length; i++){
    		for(var j = 0; j<weiduList.length; ){
    			if(zhibiaoLists[i].fieldName == weiduList[j].fieldName ){
    				// name = weiduList[i].name;
    				zhibiaoLists.splice(i,1);
    				return zhibiaoLists
    				console.log(zhibiaoLists,'0---')
    			}else{
    				j++ 
    			}
    				

    		}
    	}
    	// for( var k =0; k<multiAxisLine.indexs.length;){
    	// 	if( multiAxisLine.indexs[k].name == name ){
    	// 		yAxisKey = multiAxisLine.indexs[k].yAxisKey;
    	// 		multiAxisLine.indexs.splice(k,1);

    	// 	}else{ 
    	// 		k++
    	// 	}
    	// }
    
 //    	 for(var o = 0; o<multiAxisLine.yAxis.length; ){
	// 	// console.log(yAxisKey,'yAxisKey')
	// 	if(multiAxisLine.yAxis[o].key == yAxisKey){
	// 		// console.log(o,'ooooooo')
	// 		multiAxisLine.yAxis.splice(o,1);
	// 		var newYAxis = JSON.parse(JSON.stringify(multiAxisLine.yAxis))
	// 		// console.log(JSON.parse(JSON.stringify(multiAxisLine.yAxis)),multiAxisLine.yAxis,'sfsdf')
	// 		// multiAxisLine.indexs = multiAxisLine.indexs;
	// 		// multiAxisLine.yAxis = newYAxis;
	// 		  console.log(multiAxisLine,'-=-=-=-=-=')
	// 		return multiAxisLine
	// 	}else{
	// 		o++
	// 	}
	// }

    }
}

//报表图形类型列表
var chartTypeList = [
    {
        type: "KPI",
        name: "KPI汇总表",
        category: "INDEX",
        info:"用于KPI的分析",
        wlength:0,
        zlength:2
    },
    {
		type: "Pie2D",
		name: "饼状图",
		info: "用于1指标1维度的分析",
		category: "CHART",
		wlength:1,
		zlength:1
	},{
		type: "ScrollColumn2D",
		name: "柱状图",
		info: "用于多指标1-2维度的分析",
		category: "CHART",
		wlength:2,
		zlength:""
	},{
		type: "ScrollLine2D",
		name: "折线图",
		info: "用于多指标1-2维度的分析",
		category: "CHART",
		wlength:2,
		zlength:""
	},{
		type: "PercentColumn2D",
		name: "百分比堆积柱状图",
		info: "用于多指标1-2维度的分析",
		category: "CHART",
		wlength:2,
		zlength:""
	},{
		type: "StackedColumn2D",
		name: "堆积柱状图",
		info: "用于多指标1-2维度的分析",
		category: "CHART",
		wlength:2,
		zlength:""
	},
	{
		type: "MultiAxisLine",
		name: "复合图",
		info: "用于多指标1维度的分析",
		category: "CHART",
		wlength:"1",
		zlength:""
	},
    {
        type: "WordCloud",
        name: "词云图",
        info: "用于1指标1维度的分析",
        category: "CHART",
        wlength:1,
        zlength:1
    },
	{
		type: "EchartsMap",
		name: "地图",
		info: "用于多指标1-2维度的分析",
		category: "CHART",
		wlength:2,
		zlength:7
	}
	, {
		type: "BASE",
		name: "明细表",
		info: "用于多指标多维度的分析",
		category: "INDEX",
		wlength:"",
		zlength:""
	}, {
		type: "TREE",
		name: "树形表",
		info: "用于多指标多维度的分析",
		category: "INDEX",
		wlength:"",
		zlength:""
	}, {
		type: "CATEGORY",
		name: "汇总表",
		info: "用于多指标多维度的分析",
		category: "INDEX",
		wlength:"",
		zlength:""
	}, {
		type: "CROSS",
		name: "交叉表",
		info: "用于多指标多维度的分析",
		category: "INDEX",
		wlength:"",
		zlength:""
	}

	/*
	, {
		type: "ScrollArea2D",
		name: "面积图",
		info: "用于多指标1-2维度的分析",
	 category:"CHART"
	}
	, {
		type: "StackedArea",
		name: "堆积面积图",
		info: "用于多指标1-2维度的分析",
	    category:"CHART"
	}
	, {
		type: "Pareto",
		name: "帕累托图",
		info: "用于1指标1维度的分析",
	    category:"CHART"
	}
	, {
		type: "Matrix",
		name: "矩阵图",
		info: "用于1指标2维度的分析",
	    category:"CHART"
	}

	, {
		type: "Pyramid",
		name: "金字塔图",
		info:"用于多指标0维度的分析"
	}, {
		type: "Funnel",
		name: "漏斗图",
		info:"用于多指标0维度的分析"
	}*/
];