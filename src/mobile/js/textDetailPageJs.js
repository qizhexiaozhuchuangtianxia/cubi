/**
 * Created by Administrator on 2015-12-23.
 */
(function(win,$){
    function tableDetail(){
        this.init = function(){
            this.myScrollY = {};
            this.iconBox = $("#iconBox");
            this.textDetail = $("#textDetail");
            this.textDetailScroll = $("#textDetailScroll");
            this.key = commentMethodObj.GetRequest()["key"];//当前用户userID
            this.data = commentMethodObj.GetRequest()["data"];//点击驾驶舱的ID
            this.reportId = commentMethodObj.GetRequest()["reportId"];//点击文本报表的ID
            this.getTextInfo();
            //start 返回上一页js
            commentMethodObj.backMethod(this.iconBox);
            //end 返回上一页js
        };
        this.getTextInfo = function(){
            var _self = this;
            var detailUrl = commentMethodObj.requestUrl.detailUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id='+this.data;
            commentMethodObj.ajaxComment(detailUrl,'',function(data){
                if(data.success){
                    var datas = data.dataObject;
                    for(var i=0;i<datas.reports.length;i++){
                        if(datas.reports[i].category == "TEXT" && i == _self.reportId){
                            _self.textDetailScroll.empty().html(datas.reports[i].content);
                        }
                    }
                    if(_self.myScrollY['textDetail']){
                        _self.myScrollY['textDetail'].refresh();
                    }else{
                        _self.scrollYMethod("textDetail");
                    }
                }
            })
        },
        /*start 左右的上下的滚动效果*/
        this.scrollYMethod = function(id){
            this.myScrollY[id] = new IScroll('#'+id, {
                scrollX: false,
                scrollY: true,
                scrollbars: 'custom'
            });
            this.myScrollY[id].on("scrollEnd",function(){
                if(this.y == this.maxScrollY){
                    $(".footerIcon").hide();
                }else{
                    $(".footerIcon").show();
                }
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        /*end 左右的上下的滚动效果*/
    }
    win.tableDetailObj = new tableDetail();
})(window,jQuery);
$(function(){
    tableDetailObj.init();
});