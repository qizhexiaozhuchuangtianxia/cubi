module.exports = {
	checkEntryTextLegitimateHandle:function(checkText){///*、、判断输入的文字 是否合法的方法**/
		var patrn=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im; //正则表但是判断是否合法
		return patrn.test(checkText)
	},
	checkAllNameLengthHandle:function(checkText){//判断输入的文字的长度
		var strLen = 0;
        for (var i=0; i<checkText.length; i++) {
            strLen++;
            /*var c = checkText.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                strLen++;
            }else {
                strLen+=2;
            }*/
        }
        return strLen;
	},
}