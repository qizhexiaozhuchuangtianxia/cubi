/**
 * Created by Administrator on 2015-12-10.
 */
(function(win,$){
    function detailMethod(){
        this.init = function(){
            this.myScroll = {};
            this.key = commentMethodObj.GetRequest()["key"];//当前用户userID
            this.data = commentMethodObj.GetRequest()["id"];//点击驾驶舱的ID
            this.showHeight = $("#wrapper").height()-5;//分页显示的区域高度
            this.thelist = $("#thelist");
            this.titleBox = $("#titleBox");
            this.iconBox = $("#iconBox");
            this.pageBox = $("#pageBox");
            this.loadLength = 2;
            this.loadStart = 0;
            this.yHeight = 0;
            this.down = true;
            if(this.key !== undefined){
               this.getDashboardDetailMethod();//获取驾驶舱的基本信息方法
            }else{
                location.href = "login.html";
            }
            //start 返回上一页js
            commentMethodObj.backMethod(this.iconBox);
            //end 返回上一页js
        };
        this.getInfoData = function(){
            var _this=this;
            var shareUrl = commentMethodObj.requestUrl.shareUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id='+this.data;
            commentMethodObj.ajaxComment(shareUrl,'',function(data){
                var lastIndex = data.dataObject.endDate.indexOf(":")+3;
                var expiresTime = data.dataObject.endDate.substr(0,lastIndex);
                /*var strReplaceH = data.dataObject.endDate.replace(/-/g,"年");
                var strReplaceK = data.dataObject.endDate.replace(/\s/g,"年");*/
                _this.sessionID = commentMethodObj.GetRequest(data.dataObject.url)["sessionId"];//当前用户userID
                _this.dashboardID = _this.data;//点击驾驶舱的ID// desc: "此链接将在"+ data.dataObject.endDate +"过期",
                if(data.success){
                    var pid = '56f382deb251869623e28c86';
                    var account = 'gh_3a281c1d883e';
                    var optionsObj = {
                        title : _this.dashboardName,
                        desc: "此链接将在"+ expiresTime +"过期",
                        picURL : 'http://mcubi.sandbox.minisite.h5plus.net/FTP19961/mcubi/CUBI/mobile/images/cubi_logo.jpg',
                        link:h5sdk.mtsGetProjectPath()+"/mobile/sharePage.html?dashboardID="+_this.dashboardID+"&sessionID=" + _this.sessionID 
                    };
                    var optionsObjTimeLine = {
                        title : _this.dashboardName,
                        picURL : 'http://mcubi.sandbox.minisite.h5plus.net/FTP19961/mcubi/CUBI/mobile/images/cubi_logo.jpg',
                        link:h5sdk.mtsGetProjectPath()+"/mobile/sharePage.html?dashboardID="+_this.dashboardID+"&sessionID=" + _this.sessionID
                    };
                    h5sdk.wxOpenidInit(pid, account);
                    h5sdk.wxInit(pid, account, function() {
                      h5sdk.wxShareToFriend(optionsObj.title, optionsObj.link, optionsObj.picURL, optionsObj.desc);
                      h5sdk.wxShareToTimeline(optionsObjTimeLine.title, optionsObjTimeLine.link, optionsObjTimeLine.picURL);
                    });
                }
            })
            
        }
        //start 获取驾驶舱的基本信息
        this.getDashboardDetailMethod = function(){
            var html = "";
            html += '<li style="height:'+this.showHeight+'px">' +
                        '<span class="loadingText"><div class="loadingLogo"></div> <div class="progress">' +
                            '<div class="indeterminate"></div>' +
                            '</div>' +
                        '</span>' +
                    '</li>';
            this.thelist.empty().html(html);
            this.getInfoMethod();
        };
        this.getInfoMethod = function(){
            var html;
            var _self = this;
            var detailUrl = commentMethodObj.requestUrl.detailUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id='+this.data;
            commentMethodObj.ajaxComment(detailUrl,'',function(data){
                var datas = data.dataObject;
                _self.dashboardId = datas.id;
                _self.dashboardName = datas.name;
                _self.reportArray = datas.reports;
                _self.titleBox.empty().html(_self.dashboardName);
                _self.getInfoData();
                if(_self.reportArray.length != 0){
                    html = "";
                    html += '<span id="current">1</span>/<span id="total">'+_self.reportArray.length+'</span>'
                    _self.pageBox.html(html);
                    _self.current = $("#current");
                    _self.htmlDomMethod();
                }else{
                    html = '<div class="nullDashboard" style="height:'+_self.showHeight+'px"><div class="nullBox">此处未添加报表或该报表已经被删除</div></div>';
                    _self.thelist.html(html);
                }
            })
        };
        //end 获取驾驶舱的基本信息
        //start 根据基本信息渲染页面DOM结构
        this.htmlDomMethod = function(){
            var html = "";
            var _self = this;
            for(var i = 0;i<this.reportArray.length;i++){
                if(_self.reportArray[i].category == "TEXT"){
                    html += '<li id="textReport_'+i+'" style="height:'+this.showHeight+'px"> ' +
                                '<span class="loadingText">' +
                                    '<div class="loadingLogo"></div> ' +
                                    '<div class="progress">' +
                                        '<div class="indeterminate"></div>' +
                                    '</div>' +
                                '</span>' +
                            '</li>';
                }else{
                    html += '<li id="'+ this.reportArray[i].id + i +'" style="height:'+this.showHeight+'px">' +
                                '<span class="loadingText">' +
                                    '<div class="loadingLogo"></div> ' +
                                    '<div class="progress">' +
                                        '<div class="indeterminate"></div>' +
                                    '</div>' +
                                '</span>' +
                            '</li>';
                }
                if(i<this.loadLength){
                    (function(options,indexI){
                        if(options.category == "TEXT"){
                            _self.textReport(options,indexI);//文本报表
                        }else{
                            _self.getReportInfo(options,indexI);//根据报表的ID获取当前报表的信息渲染出对应的图形
                        }
                    })(_self.reportArray[i],i)
                }
            }
            html += '<em class="noMore" id="downNo">已经翻到最后一页</em>';
            this.thelist.empty().html(html);
            if(this.reportArray.length > 1){
                this.detailScroll();//结构渲染完成之后执行翻页方法
            }else{
                $(".footerIcon").hide();
            }

        };
        //end 根据基本信息渲染页面DOM结构
        //start 根据报表的ID获取当前报表的信息渲染出对应的图形
        this.getReportInfo = function(options,indexI){
            var html;
            var dataVal = ''
            var _self = this;
            var dataObj = '{"areaParameters":{"pageParameter":{"currentPageNo":1,"pageRowCount":2}}}';
            var getReportUrl = commentMethodObj.requestUrl.detailReportUrl + '?sessionId='+ encodeURIComponent(this.key) + '&terminalType=MOBILE&id=' + options.id +'&data='+dataVal;
            commentMethodObj.ajaxComment(getReportUrl,dataObj,function(data){
                html = "";
                if(data.success){
                    var datas = data.dataObject;
                    switch (datas.category){
                        case 'CHART':
                            _self.getCharReport(datas,indexI);//fc展现图报表
                            break;
                        case "INDEX":
                            _self.getTableReport(datas,indexI);//tabel表格报表
                            break;
                        default:
                            break;
                    }
                }else{
                    html = '<div class="nullDashboard" style="height:'+_self.showHeight+'px"><div class="nullBox">此处未添加报表或该报表已经被删除</div></div>';
                    $("#"+options.id + indexI).html(html);
                    //$("#"+options.id + indexI).find("span").css("width","100%").html(data.message);
                }
            })
        };
        //end 根据报表的ID获取当前报表的信息渲染出对应的图形
        //start 根据数据渲染图形报表
        this.getCharReport = function(data,indexI){
            var EleId = data.id+indexI;
            if(EleId){
                if(data.type == "wordCloud"){
                    var chart = echarts.init(document.getElementById(EleId), {
                        playInterval : {
                            rotate : 90
                        },
                        noDataLoadingOption : {
                            text : '暂无数据',
                            effect : 'bubble',
                            effectOption : {
                                effect : {
                                    n : 0
                                }
                            },
                            textStyle : {
                                fontSize : 32,
                                fontWeight : 'bold'
                            }
                        },
                        loadingOption : {
                            text : '数据读取中',
                            effect : 'bubble',
                            effectOption : {
                                effect : {
                                    n : 0
                                }
                            },
                            textStyle : {
                                fontSize : 32,
                                fontWeight : 'bold'
                            }
                        }

                    });
                    var option = data.chartInfo.jsonData;
                    chart.setOption(option);
                }else{
                    var chart = new FusionCharts({
                     type: data.type,
                     width: "100%",
                     height: "100%",
                     dataFormat: "xml",
                     canvasBgColor: "FFFFFF",
                     bgColor: "FFFFFF",
                     plotGradientColor: ""
                     });
                     chart.setXMLData(data.chartInfo.xmlData);
                     //chart.configure("LoadingText", "报表加载中...");
                     chart.configure("ChartNoDataText", "未检索到您期望的数据！");
                     chart.setChartAttribute("decimals", "2");
                     chart.render(EleId);
                }
            }

        };
        //end 根据数据渲染图形报表
        //start 根据数据渲染table报表
        this.getTableReport = function(data,indexI){
            var fields = data.fields;
            var pages = data.pages;
            var html = "";
            var eleId = data.id+indexI;
            if(data.name.indexOf("交叉表")!="-1" || data.name.indexOf("树形表")!="-1"){
                $("#"+eleId).find("span").css("width","100%").html("暂不支持此类报表显示，请登录http://www.cubicube.net/查看");
            }else{
                html += '<div class="table-report">';
                if(pages[0].rows.length >= 10){
                    html += '<a href="tableDetail.html?id='+ data.id +'&key='+this.key+'" class="lookDetailBtn">查看详情</a>';
                }
                html += '<div class="downTable">' +
                    '<table class="tableBox">' +
                    '<thead>' +
                    '<tr>';
                for(var i=0;i<fields.length;i++){
                    if(i<3){
                        html += '<td>'+fields[i].name+'</td>';
                    }
                }
                html += '</tr>' +
                    '</thead>' +
                    '<tbody>';
                for(var j=0;j<pages[0].rows.length;j++){
                    if(j<10){
                        html += '<tr>';
                        for(var x=0;x<pages[0].rows[j].cells.length;x++){
                            if(x < 3){
                                html += '<td>'+pages[0].rows[j].cells[x].formatValue+'</td>';
                            }
                        }
                        html += '</tr>';
                    }
                }
                html += '</tbody>' +
                    '</table></div>' +
                    '</div>';
                $("#"+eleId).empty().html(html);
            }
        };
        //end 根据数据渲染table报表
        //start 文本输出方法
        this.textReport = function(data,indexI){
            var html = '';
            html += '<div class="table-report">' +
                        '<a href="textDetail.html?data='+ this.data +'&key='+this.key+'&reportId='+indexI+'" class="lookDetailBtn">查看详情</a>' +
                        '<div class="text-accent-1">' +
                            data.content+
                        '</div> '+
                    '</div> ';
            setTimeout(function(){
                $("#textReport_"+indexI).empty().html(html);
            },200)
        };
        //end  文本输出方法
        //start iscroll翻页效果
        this.detailScroll = function(){
            var _self = this;
            this.myScroll = new IScroll('#wrapper', {
                scrollX: false,
                scrollY: true,
                momentum: false,
                snap: 'li',
                snapSpeed: 400,
                directionLockThreshold: 5,//多少像素开始监听
                preventDefault : false
            });
            this.myScroll.on("scrollEnd",function(){//每次滚动完成之后执行的方法
                if(this.y <_self.yHeight){
                    _self.yHeight = this.y;
                    if(this.currentPage.pageY != (_self.current.html()-1)){
                        _self.loadStart = _self.loadLength;
                        _self.loadLength+=1;
                        if(_self.loadLength <= _self.reportArray.length){
                            for(var i = _self.loadStart;i < _self.loadLength;i++){
                                (function(options,indexI){
                                    if(options.category == "TEXT"){
                                        _self.textReport(options,indexI);//文本报表
                                    }else{
                                        _self.getReportInfo(options,indexI);//根据报表的ID获取当前报表的信息渲染出对应的图形
                                    }
                                })(_self.reportArray[i],i)
                            }
                        }else{
                            _self.loadLength = _self.reportArray.length+1;
                        }
                    }
                    if(this.currentPage.pageY == (_self.reportArray.length-1)){
                        $(".footerIcon").hide();
                        $("#downNo").css("display","inline-block");
                    }

                }else{
                    if(this.currentPage.pageY == (_self.reportArray.length-1)){
                        $(".footerIcon").hide();
                    }else{
                        $(".footerIcon").show();
                    }
                }
                _self.current.html(this.currentPage.pageY+1);
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        };
        //end iscroll翻页效果
    }
    win.detailMethodObj = new detailMethod();
})(window,$);
$(function(){    
    detailMethodObj.init();
});