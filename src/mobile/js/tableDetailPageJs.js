/**
 * Created by Administrator on 2015-12-23.
 */
(function(win,$){
    function tableDetail(){
        this.init = function(){
            this.myScrollX = {};
            this.myScrollY = {};
            this.iconBox = $("#iconBox");
            this.titleBox = $("#titleBox");
            this.tableTopHtml = $("#tableTopHtml");
            this.scrollTableHtml = $("#scrollTableHtml");
            this.key = commentMethodObj.GetRequest()["key"];//当前用户userID
            this.tableId = commentMethodObj.GetRequest()["id"];//点击驾驶舱的ID
            this.currentIndex = commentMethodObj.GetRequest()["currentIndex"];//点击驾驶舱的ID
            this.pageIndex = 1;
            this.pageNum = 10;
            this.getTableInfo();
            //start 返回上一页js
            commentMethodObj.backMethod(this.iconBox);
            //end 返回上一页js
        };
        this.getTableInfo = function(){
            var _self = this;
            var dataObj = '{"areaParameters":{"pageParameter":{"currentPageNo":'+this.pageIndex+',"pageRowCount":'+this.pageNum+'}}}';
            var getReportUrl = commentMethodObj.requestUrl.detailReportUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id=' + options.id;
            commentMethodObj.ajaxComment(getReportUrl,dataObj,function(data){
                var errorEle = '<div class="errorClass">数据为空！</div>'
                if(data.success){
                    var fields = data.dataObject.fields;
                    var pages = data.dataObject.pages;
                    var eleHtml = '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
                    _self.titleBox.empty().html(data.dataObject.name);
                    if(fields.length > 0 && pages.length > 0){
                        var htmlTop="",
                            htmlDwon="";
                        htmlTop +=  '<table>' +
                                        '<thead>' +
                                            '<tr>'
                        for(var i=0;i<fields.length;i++){
                            htmlTop += '<td>'+fields[i].name+'</td>';
                        }
                        htmlTop +=          '</tr>' +
                                        '</thead>' +
                                    '</table>';
                        htmlDwon += '<table>' +
                                        '<tbody id="tbodyEle">'
                        for(var j=0;j<pages[0].rows.length;j++){
                            htmlDwon += '<tr>';
                            for(var x=0;x<pages[0].rows[j].cells.length;x++){
                                htmlDwon += '<td>'+pages[0].rows[j].cells[x].formatValue+'</td>';
                            }
                            htmlDwon += '</tr>';
                        }
                        htmlDwon +=    '</tbody>' +
                                    '</table>'
                        htmlDwon += '<div class="spinner" id="spinner"></div>'
                        _self.tableTopHtml.empty().html(htmlTop);
                        _self.scrollTableHtml.empty().html(htmlDwon);
                        document.getElementById("spinner").style.width = $('#scrollX').width()+'px';
                        document.getElementById("spinner").style.marginTop = '10px';
                        document.getElementById("spinner").style.fontSize = '12px';
                        document.getElementById("spinner").innerHTML = eleHtml;
                    }else{
                        _self.scrollTableHtml.append(errorEle);
                    }
                    if(_self.myScrollY["scrollY"]){
                        _self.myScrollY['scrollY'].refresh();
                    }else{
                        _self.scrollYMethod('scrollY');
                    }
                    _self.scrollXMethod();
                }else{
                    alert(data.message)
                }
            });
        },
        /*start 左右的上下的滚动效果*/
        this.scrollYMethod = function(id){
            var _self = this;
            var pullUp = $("#spinner");
            this.myScrollY[id] = new IScroll('#'+id, {
                scrollX: false,
                scrollY: true,
                useTransition: true, 
                probeType : 3,
                mouseWheel: false,
                scrollbars: false,
                fadeScrollbars: true,
                preventDefault: false
            });
            this.myScrollY[id].on("scroll",function(){
                if(this.y < 0){
                    if(this.y < this.maxScrollY+31 && !pullUp.hasClass("pullOn")){
                        pullUp.attr("style",'');
                        pullUp.width($('#scrollX').width());
                        pullUp.css('margin-top',"10px");
                        pullUp.css('font-size','12px');
                        pullUp.attr("class","pullOn");
                        this.maxScrollY = this.maxScrollY+10;
                    }else if(this.y > this.maxScrollY-31 && pullUp.hasClass("pullOn")){
                        pullUp.attr("style",'');
                        pullUp.width($('#scrollX').width());
                        pullUp.css('margin-top',"10px");
                        pullUp.css('font-size','12px');
                        pullUp.attr("class","pullOn");
                        this.maxScrollY = -1*(pullUp[0].offsetTop- ($("#scrollY").height()));
                    }
                }
            });
            this.myScrollY[id].on("scrollEnd",function(){
                if(pullUp.hasClass("pullOn")){
                    pullUp.css("visibility",'hidden');
                    pullUp.attr("class","pullClose");
                    _self.loadMore();
                }
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        this.scrollXMethod = function(){
            this.scrollX = $("#scrollX");
            this.scrollXBox = $("#scrollXBox");
            this.tdWidth = Math.ceil(this.scrollX.width()/3);
            this.tdLength = this.tableTopHtml.find("td").length;
            if(this.tdLength<=3){
                this.scrollXBox.width('100%');
            }else{
                this.scrollXBox.width(this.tdWidth*this.tdLength);
            }
            this.myScrollX = new IScroll('#scrollX', {
                scrollX: true,
                scrollY: false,
                scrollbars: 'custom'
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        this.loadMore = function(){
            var _self = this;
            ++this.pageIndex;
            var dataObj = '{"areaParameters":{"pageParameter":{"currentPageNo":'+this.pageIndex+',"pageRowCount":'+this.pageNum+'}}}';
            var getReportUrl = commentMethodObj.requestUrl.detailReportUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id=' + options.id;
            commentMethodObj.ajaxComment(getReportUrl,dataObj,function(data){
                var htmlDwon='';
                if(data.success){
                    var pages = data.dataObject.pages;
                    if(pages[0].rows.length > 0){
                        for(var j=0;j<pages[0].rows.length;j++){
                            htmlDwon += '<tr>';
                            for(var x=0;x<pages[0].rows[j].cells.length;x++){
                                htmlDwon += '<td>'+pages[0].rows[j].cells[x].formatValue+'</td>';
                            }
                            htmlDwon += '</tr>';
                        }
                        $('#tbodyEle').append(htmlDwon);
                        _self.myScrollY['scrollY'].refresh();
                    }else{
                        document.getElementById("spinner").innerHTML = "没有更多数据";
                        document.getElementById("spinner").style.fontSize = '12px';
                    }   
                }else{
                    alert(data.message)
                }
            })
        }
        /*end 左右的上下的滚动效果*/
    }
    win.tableDetailObj = new tableDetail();
})(window,jQuery);
$(function(){
    tableDetailObj.init();
});