

module.exports = {
	year:function(str){
		var arr=[];
		var str=this.removeSpace(str);
		if(str.indexOf('-')!=-1){
			str=str.split('-');
			str=str[0];
		}
		arr[0]=str+'-01-01';
		arr[1]=str+'-12-31';
		return arr;
	},
	quarter:function(str){
		var str=this.removeSpace(str);
		var strArr=str.split('-');
		var m=strArr[1]*3;
		var arr=[];
		var days=[31,30,30,31];
		arr[0]=strArr[0]+'-'+ (m-2) +'-01';
		arr[1]=strArr[0]+'-'+ m +'-'+ days[strArr[1]-1];
		return arr;
	},
	month:function(str){
		var str=this.removeSpace(str);
		var strArr=str.split('-');
		var arr=[];
		var days=[31,28,31,30,31,30,31,31,30,31,30,31];
		if(this.isLeapYear(strArr[0])){
			days[1]=29;
		}
		arr[0]=strArr[0]+'-'+ strArr[1] +'-01';
		arr[1]=strArr[0]+'-'+ strArr[1] +'-'+days[strArr[1]-1];
		return arr;
	},
	week:function(str){
		var str=this.removeSpace(str),
			strArr=str.split('-'),
			year=strArr[0],
			week=strArr[1],
	        d = new Date(year, 0, 1);

        while (d.getDay() != 1) {
            d.setDate(d.getDate() + 1); //+1 往后算一周，-1 往前算一周
        }
        var to = new Date(year + 1, 0, 1),
			i = 1,
			arr = [];
        for (var from = d; from < to;) {
            if (i == week) {
                arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate());
            }
            var j = 6;
            while (j > 0) {
                from.setDate(from.getDate() + 1);
                if (i == week && j==1) {
                    arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate());
                }
                j--;
            }
            if (i == week) {
                return arr;
            }
            from.setDate(from.getDate() + 1);
            i++;
        }
	},
	
	isLeapYear:function(year) {  
		return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);  
	},
	dateToYear:function(str){
		var strArr=str.split('-');
		return strArr[0];
	},
	dateToQuarter:function(str){
		var strArr=str.split('-');
		var yu=strArr[1]%3;
		var qu=strArr[1]/3;
		var quarter=qu;
		if(yu!=0){
			quarter=Math.floor(qu)+1;
		}
		return strArr[0]+'-'+quarter;
	},
	dateToMonth:function(str){
		var strArr=str.split('-');
		return strArr[0]+'-'+strArr[1];
	},
	dateToWeek:function(str){
		var strArr=str.split('-');
		var time,week,
        checkDate = new Date(new Date(strArr[0],strArr[1]-1,strArr[2]));
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        time = checkDate.getTime();
        checkDate.setMonth(0);
        checkDate.setDate(1);
        week=Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        return strArr[0]+'-'+week;
	},
	dateToDate:function(str){
		return str
	},
	removeSpace:function(str){
		var str=str.toString();
		return str.replace(/\s/g,"");
	},
	isChineseToLine:function(str){
		var str=str.toString();
		return str.replace(/[^\u0000-\u00FF]/g,'-');
	},
}