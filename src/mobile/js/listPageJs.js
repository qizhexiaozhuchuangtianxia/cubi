(function(win,$){
    var html;
    function listMethod(){
        //start初始化方法
        this.init = function(){
            this.myScroll = {};
            this.myScrollY = {};
            this.listHtml = $("#listHtml");//把获取到的数据添加到目标区域
            this.userName = $("#userNameBox");
            this.key = localStorage.getItem("key");//用户的userID
            this.userNameKey = localStorage.getItem("userName");//用户的userName
            this.loadStart = 1;//默认从第一个开始取
            this.loadLength = Math.ceil($("#dashboard-down").height()/68);//每次取多少个
            this.userName.html(this.userNameKey);
            this.selectMethod();//顶部下拉列表的方法
            commentMethodObj.sliderNav();//左侧菜单导航
            this.quitMethod();//退出登录的方法
        };
        //end初始化方法
        //start顶部情景库下拉列表的方法
        this.scrollYMethod = function(id){
            this.myScrollY[id] = new IScroll('#'+id, {
                scrollX: false,
                scrollY: true,
                snap: 'li',
                scrollbars: 'custom',
                preventDefault: false
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        this.selectMethod = function(){
            var _self = this;
            var showSelect = $("#showSelect");
            var selectText = $("#selectText");
            var html="";
            if(this.key !== undefined){
                var dirUrl = commentMethodObj.requestUrl.urlDirector + '?terminalType=MOBILE&sessionId=' + encodeURIComponent(this.key);
                commentMethodObj.ajaxComment(dirUrl,'',function(data){
                    if(data.success){
                        var datas = data.dataObject;
                        html += '<div class="selectBoxButton" id="selectBoxButton">' +
                            '<ul id="selectUl"><li value="" class="selectOn">全部</li>';
                        for(var i=0;i<datas.length;i++){
                            html += '<li class="waves-effect waves-light" value="'+datas[i].id+'">'+datas[i].name+'</li>';
                        }
                        html += '</ul>'+
                            '</div>'
                        $("body").append(html);
                        _self.selectId = datas[0].id;
                        _self.getDashboardMethod();//获取所有驾驶舱的列表的方法
                    }
                });
                showSelect.on("click",function(){
                    $("#selectBoxButton").addClass("selectBoxShow");
                    $("#selectUl > li").off("click");
                    $("#selectUl").on("click","li",function(){
                        _self.selectId = $(this).attr("value");
                        _self.selectText = $(this).html();
                        _self.loadStart = 1;
                        $("#selectUl").find("li").removeClass("selectOn");
                        $(this).addClass("selectOn");
                        selectText.empty().html( _self.selectText);
                        $("#selectBoxButton").removeClass("selectBoxShow");
                        _self.getDashboardMethod();
                    });
                    if(_self.myScrollY['selectBoxButton']){
                        _self.myScrollY['selectBoxButton'].refresh();
                    }else{
                        _self.scrollYMethod("selectBoxButton");
                    }
                    return false;
                });
                $(document).on("click",function(){
                    $("#selectBoxButton").removeClass("selectBoxShow");
                })
            }else{
                location.href = "login.html";
            }
            
        };
        //end顶部情景库下拉列表的方法
        //start默认取得全部情景库下的所有驾驶舱的列表的方法
        this.getDashboardMethod = function(){
            var _self = this;
            var getAllDashboardUrl = commentMethodObj.requestUrl.urlAllDashboard + '?sessionId=' + encodeURIComponent(this.key) +'&terminalType=MOBILE&dirId=' + this.selectId;//获取驾驶舱列表的接口变量
            var dataObj = '{"queryParameters":{"pageParameter":{"currentPageNo":'+this.loadStart+',"pageRowCount":'+this.loadLength+'}}}';
            $("#selectBoxButton").removeClass("selectBoxShow");
            commentMethodObj.ajaxComment(getAllDashboardUrl,dataObj,function(data){
                if(data.success){
                    var datas = data.dataObject.rows;
                    if(datas.length>0){
                        html = '';
                        _self.pages = Math.ceil(data.dataObject.total/_self.loadLength);
                        var eleHtml = '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
                        document.getElementById("spinner").innerHTML = eleHtml;
                        if(_self.pages <= 1){
                            document.getElementById("spinner").style.visibility = "hidden";
                        }else{
                            document.getElementById("spinner").style.visibility = "inherit";
                        }
                        if(_self.myScroll["dashboard-down"]){
                            _self.myScroll["dashboard-down"].destroy();
                        }
                        for(var i=0;i<datas.length;i++){
                            html += '<li class="collection-item avatar">' +
                                '<a href="detailPage.html?id='+ datas[i].id +'&key='+_self.key+'">' +
                                '<i class="material-icons circle '+datas[i].firstReportType+'"></i>' +
                                '<span class="title">'+datas[i].name+'</span>' +
                                '<p>内有'+datas[i].reportCount+'个报表</p>' +
                                '</a>' +
                                '</li>'
                        }
                    }else{
                        html = '<div class="nullDashboard" style="height:'+$("#dashboard-down").height()+'px"><div class="nullBox">此处未添加驾驶舱或该驾驶舱已经被删除</div></div>';
                    }
                    _self.listHtml.empty().html(html);
                    _self.scrollLoadMethod("dashboard-down");
                }
            })
        };
        //end默认取得全部情景库下的所有驾驶舱的列表的方法
        //start退出登录方法
        this.quitMethod = function(){
            var quitBtn = $("#quit");
            var quitUrls = commentMethodObj.requestUrl.quitUrl + '?terminalType=MOBILE&sessionId=' + encodeURIComponent(this.key);
            quitBtn.off("click");
            quitBtn.on("click",function(){
                commentMethodObj.ajaxComment(quitUrls,'',function(data){
                    localStorage.removeItem("key");
                    localStorage.removeItem("userNameKey");
                    location.href = "login.html";
                })
            })
        };
        //end退出登录方法
        //向上滑动加载更多数据的方法
        this.scrollLoadMethod = function(id) {
            var _self = this;
            var pullUp = $("#spinner");
            this.myScroll[id] = new IScroll("#"+id,{
                useTransition: true, 
                probeType : 3,
                mouseWheel: false,
                scrollbars: false,
                fadeScrollbars: true,
                hScroll : false,
                vScrollbar : false,
                preventDefault: false
            });
            this.myScroll[id].on("scroll",function(){
                if(this.y < 0){
                    if(this.y < this.maxScrollY+50 && !pullUp.hasClass("pullOn")){
                        pullUp.attr("style",'');
                        pullUp.attr("class","pullOn");
                        this.maxScrollY = this.maxScrollY;
                    }else if(this.y > this.maxScrollY-50 && pullUp.hasClass("pullOn")){
                        pullUp.attr("style",'');
                        pullUp.attr("class","pullOn");
                        this.maxScrollY = -1*(pullUp[0].offsetTop- ($("#dashboard-down").height()+10));
                    }
                }
            });
            /*this.myScroll[id].on("scroll",function(){
                if(this.y < 0){
                    $(".dashboard-main-list").addClass('dashboard-main-list-paddingTop');
                    $(".dashboard-top").addClass('dashboard-top-hide').hide();
                }else if(this.y >= 0){
                    $(".dashboard-main-list").removeClass('dashboard-main-list-paddingTop');
                    $(".dashboard-top").show().removeClass('dashboard-top-hide');
                }
            });*/
            this.myScroll[id].on("scrollEnd",function(){
                if(pullUp.hasClass("pullOn")){
                    pullUp.css("visibility",'hidden');
                    pullUp.attr("class","pullClose");
                    _self.loadingMore();
                }
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        //start加载列表页面的方法
        this.loadingMore = function (){//加载列表页面的方
            var getAllDashboardUrl;
            var _self = this;
            ++this.loadStart;
            if(this.loadStart <= this.pages) {
                var getAllDashboardUrl = commentMethodObj.requestUrl.urlAllDashboard + '?sessionId=' + encodeURIComponent(this.key) +'&terminalType=MOBILE&dirId=' + this.selectId;//获取驾驶舱列表的接口变量
                var dataObj = '{"queryParameters":{"pageParameter":{"currentPageNo":'+this.loadStart+',"pageRowCount":'+this.loadLength+'}}}';
                commentMethodObj.ajaxComment(getAllDashboardUrl,dataObj,function(data){
                    html = '';
                    var datas = data.dataObject.rows;
                    for(var i=0;i<datas.length;i++){
                        html += '<li class="collection-item avatar">' +
                                    '<a href="detailPage.html?id='+ datas[i].id +'&key='+_self.key+'">' +
                                        '<i class="material-icons circle '+datas[i].firstReportType+'"></i>' +
                                        '<span class="title">'+datas[i].name+'</span>' +
                                        '<p>内有'+datas[i].reportCount+'个报表</p>' +
                                    '</a>' +
                                '</li>'
                    }
                    _self.listHtml.append(html);
                    _self.myScroll['dashboard-down'].refresh();
                })
            }else{
                document.getElementById("spinner").innerHTML = "没有更多数据";
            }
        }
    }
    win.listMethodObj = new listMethod();
})(window,jQuery);
$(function(){
    listMethodObj.init();
});