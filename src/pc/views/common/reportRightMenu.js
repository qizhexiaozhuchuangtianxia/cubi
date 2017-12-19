var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ArrowDropRight = require('material-ui/svg-icons/navigation-arrow-drop-right');
var FilterFieldsStore  = require('../../stores/FilterFieldsStore');

var {
    IconMenu,
    IconButton,
    MenuItem,
    Popover
} = require('material-ui');

module.exports = React.createClass({
    displayName: 'MenuItems',
	getInitialState: function() {

		return {
			nextlevelOpen: false,
            laststageOpen: false,
            huizongOpen:false,
		}
	},
	componentWillMount:function(){

	},

	componentDidMount: function() {

		 App.on('APP-REPORT-CLOSE-FORMULAS', this._setHuizongClose);
	},

	render: function(){
		return (
		 		<div className="reportRightMenu">
                    <MenuItem
                        onClick={(evt)=>this._setMenuScrolls(evt)}
                        leftIcon={<IconButton
                        className="moreIconsClassName"
                        iconClassName="icon iconfont icon-icgengduo24px"></IconButton>}/>
                        <Popover
                          open={this.state.nextlevelOpen}
                          anchorEl={this.state.anchorEl}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'left', vertical: 'top'}}
                           onRequestClose={this._MenuScrollClose}
                        >
                            <MenuItem
                                primaryText="导出"
                                rightIcon={<ArrowDropRight />}
                                className='MenuItemClassNames'
                                onClick={(evt)=>this._setTwoMenuScroll(evt)} />
	                        <MenuItem
	                            primaryText="显示汇总"
	                            className='MenuItemClassNames'
	                            onClick={(evt)=>this._setHuizongOpen(evt)} />
	                        <MenuItem
		                        primaryText="关于此分析..."
		                        className='MenuItemClassNames'
		                        onClick={(evt)=>this._aboutReport(evt)} />
                        </Popover>

                        <Popover
                            open={this.state.laststageOpen}
                            anchorEl={this.state.anchorEls}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'center'}}
                            onRequestClose={this._MenuTwoMenuScrollClose}
                        >


                            <MenuItem
                                primaryText="全部数据"
                                className="twoMenuItem"
                                disabled={ !this.props.exportData}
                                onTouchTap={(evt)=>this._outReportDataHandle(evt,'allDatas')}
                                value="allDatas" insetChildren={true}/>
                            <MenuItem
                                primaryText="当前筛选数据"
                                className="twoMenuItem"
                                disabled={ !this.props.exportDataModel}
                                onTouchTap={(evt)=>this._outReportDataHandle(evt,'currentFilterDatas')}
                                value="currentFilterDatas" insetChildren={true}/>

                        </Popover>
                </div>
            )
	},
    _setMenuScrolls: function(event) {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            nextlevelOpen: true,
            anchorEl: event.currentTarget,
        });
        setTimeout(function() {
            $('.MenuItemClassNames').parent().parent().addClass('twoMenuItemStyle')
        }, 100)
    },
    _setTwoMenuScroll: function(event) {
        event.preventDefault();
        this.setState({
          laststageOpen: true,
          anchorEls: event.currentTarget,
        });
        setTimeout(function() {
          $('.twoMenuItem').parent().parent().addClass('twoMenuItemStyle')
        }, 100)
    },
    _MenuScrollClose: function() {
        this.setState({
            nextlevelOpen: false,
        });
    },
    _MenuTwoMenuScrollClose: function() {
        this.setState({
            nextlevelOpen: false,
            laststageOpen: false,
        });
    },
     _setHuizongOpen:function(){
        if (!this.isMounted()) return;
        App.emit('APP-REPORT-HUIZONG', true);
        this._MenuScrollClose();
        this._MenuTwoMenuScrollClose();
     },

	/**
	 * 显示“关于此分析”对话框
	 * @private
	 */
	_aboutReport: function() {
     	if (!this.isMounted()) return;
		App.emit('APP-REPORT-SHOW-DIALOG-ABOUT-REPORT', true);
		this._MenuTwoMenuScrollClose();
	},

     _setHuizongClose:function(){
        App.emit('APP-REPORT-HUIZONG', false);
     },
    _outReportDataHandle: function(evt, value) { //导出当前报表
        evt.stopPropagation();

        var reportId         = this.props.reportId; //当前要导出报表的id值
        var reportFilterData = (value == "currentFilterDatas") ? this.props.filterFields : []; //当前要导出报表的是否有筛选的值
        var outPutExcelUrl = "/services/report/runtime/exportExcelByAreaInfo" ;  // 导出的是excel格式 导出当前筛选数据
        var outPutCsvUrl   =  "/services/report/runtime/exportDataModelByAreaInfo" ;// 导出的是csv格式 导出全部数据
        var outPutUrl = (value == "currentFilterDatas") ? outPutExcelUrl : outPutCsvUrl; //判断导出地址是什么？
        var outPutImg = (value == "currentFilterDatas") ? 'iconfont icon-icexcel24px' : 'iconfont icon-iccsv24px'; //抛物线的小图片？
        
	    if (!reportId) {
            var areaInfo = this.props.reportData.areaInfo;
		    if (!areaInfo.name) {
			    areaInfo.name = "未保存_" + (new Date()).getTime();
		    }
	    }

        var dataModelObj = { //csv要的参数对象
            "actionType": "EXPORT_DATAMODEL",
            "preview": false,
            "width": "100%",
            "height": "100%",
            "changeChartAllowed": true,
            "timeAxisUsed": true,
            "filterFields": reportFilterData,
            "chartType": null
        };

        var ExcelObj = { //excel要的参数对象
            "actionType": "VIEW",
            "preview": false,
            "width": "100%",
            "height": "100%",
            "changeChartAllowed": true,
            "timeAxisUsed": true,
            "filterFields": reportFilterData,
            "chartType": null
        };
        // "pageParameter": {
        //         "pageRowCount": 9,
        //         "currentPageNo": 1
        //     },

        var obj = (value == "currentFilterDatas") ? ExcelObj : dataModelObj; //如果点击的是excel导出 上传对应的obj
        var areaInfo=this.props.jsonData.areaInfo;//this.props.reportInfo;

        if ((!areaInfo.name) || ("" === areaInfo.name)) {
            areaInfo.name = "未保存_" + (new Date()).getTime();
        }

        // 导出全部数据 当前数据 bug
        if(value == "currentFilterDatas"){
          areaInfo.filterFields=this.props.filterFields;
          areaInfo=FilterFieldsStore.dwonloadSetZhibiaoFilter(areaInfo,this.props.sortFields,this.props.maxMin,this.props.topParameters);
        }
        this._outPutReportHandle(reportId, obj, outPutUrl, areaInfo); //启用导出方法
        this._addOutputListHandl(evt,outPutImg); //启用导出抛物线的方法

	    this._MenuTwoMenuScrollClose();
    },
    _outPutReportHandle: function(id, filterData, url, areaInfo) { //导出方法
        var $form       = $("#formSubmitByAreaInfo");

        var filterData  = encodeURIComponent(JSON.stringify(filterData));
	    $form.attr("action", App.host + url + "?terminalType=PC&sessionId=" + encodeURIComponent(App.sid));
	    let areaInfoURI = encodeURIComponent(JSON.stringify(areaInfo));
	    $("input[name=areaInfo]").val(areaInfoURI);
	    $("input[name=areaParameters]").val(filterData);
	    $form.submit();
    },
    _addOutputListHandl:function(evt,outPutImg){//导出抛物线的方法
        var newsButtonBox = $('.newsButtonBox');
        var $div = $('<div class="addMessagesBox"><div class="'+outPutImg+'"></div></div>');
        $div.fly({
            start:{
                left: $(evt.target).offset().left+24,  //开始位置（必填）#fly元素会被设置成position: fixed
                top: $(evt.target).offset().top-24,  //开始位置（必填）
                background:''
            },
            end:{
                left: newsButtonBox.offset().left, //结束位置（必填）
                top: newsButtonBox.offset().top,  //结束位置（必填）
            },
            onEnd: function(){//结束回调
                this.destroy();
            }
        });
    }
});
