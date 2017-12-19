/**
 * Created by Administrator on 2016-2-25.
 */
var React = require('react');
var App = require('app');
var $ = require('jquery');
// var EditReprotComponent = require('./EditReprotComponent');
import EditReprotComponent from './rightEdit/RightEditComponent';
var BreadcrumbTop = require('../common/BreadcrumbTop');
var FilterFieldsStore = require('../../stores/FilterFieldsStore');
var ReportStore = require('../../stores/ReportStore');
var {
	IconButton,
	IconMenu,
	MenuItem,
	Popover
} = require('material-ui');
var ArrowDropRight = require('material-ui/svg-icons/navigation-arrow-drop-right');
var {
	Router
} = require('react-router');
module.exports = React.createClass({
	app: {},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
		var zhibaioFilter=ReportStore.initZhibiaoFilters(this.props.reportInfo);
		return {
			showHideBool: false,
			reprotData: this.props.reportHeader,
			filterFields: this.props.reportHeader.filterFields,
			nextlevelOpen: false,
			laststageOpen: false,
			drilDownDatas:[],
			reportInfo: this.props.reportInfo,
			newRow:null,
			newCol:null,
			topParameters:zhibaioFilter.topParameters,
			maxMin:zhibaioFilter.maxMin,
			sortFields:zhibaioFilter.sortFields,
		}
	},
	componentWillReceiveProps: function (nextProps) { //当上一级props发生改变 本级执行的方法3
		this.setState({
			filterFields: nextProps.reportHeader.filterFields,
			reportInfo: nextProps.reporInfo
		})
	},
	componentWillUnmount: function () {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentDidMount: function () {
		// 初始化面包屑
		 this.app['APP-SET-BREAD-DRILDOWNDATA'] = App.on('APP-SET-BREAD-DRILDOWNDATA', this._getDrildowndata);
		var _this = this;
		//订阅报表头部 导出功能需要筛选值的方法
		this.app['APP-DASHBOARD-REPORT-HEADER-SET-FILTER'+'_'+this.props.row+'_'+this.props.col] = App.on('APP-DASHBOARD-REPORT-HEADER-SET-FILTER'+'_'+this.props.row+'_'+this.props.col, this._setReportHeaderFilterValues);
		//指标排序 
        App.on('APP-REPORT-SET-ZHIBIAO-SORT', this._setSortFields);
        // 最大最小值 
        App.on('APP-REPORT-SET-ZHIBIAO-MAXMIN', this._setSortMaxMin);
        // topn 
        App.on('APP-REPORT-SET-ZHIBIAO-TOPN', this._setSortTopn);
		//表格清空筛选 不包括排序
		App.on('APP-REPORT-SET-NOPFILTER',this._setNoFilter);

		$(document).off("click");
		$(document).on("click", function (evt) {
			var eventEleDom = $(evt.target).attr("class");
			if (_this.props.canShowProps.canShow) {
				if (eventEleDom == "mCSB_container" || eventEleDom == 'dashboardView_row' || eventEleDom == 'add_dashboard_panel' || eventEleDom == 'dashboardView_col_box' || eventEleDom == 'add_dashboard') {
					setTimeout(function () {
						App.emit('APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE', {
							canShow: !_this.props.canShowProps.canShow,
							itemRowIndex: _this.props.row,
							itemColIndex: _this.props.col
						});
					}, 100)
				}
			}
		})
	},
	_clickHandle: function (evt) {

		if (this.props.type == 'TEXT') {
			if (this.props.operation == 'edit') {
				this._clickHeader(evt);
			}
		} else {
			this._clickHeader(evt);
		}

	},
	_clickHeader: function (evt) {
		var eventEle = $(evt.target);
		var eventEleClass = eventEle.attr("class");
		var _this = this;
		var dirDownDatasLen = this.state.drilDownDatas.length;

		if (!_this.props.canShowProps.canShow) {
			App.emit('APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE', {
				canShow: !_this.props.canShowProps.canShow,
				itemRowIndex: _this.props.row,
				itemColIndex: _this.props.col,
				dirDownDatasLen: dirDownDatasLen
			});
		} else {
			setTimeout(function () {
				App.emit('APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE', {
					canShow: !_this.props.canShowProps.canShow,
					itemRowIndex: _this.props.row,
					itemColIndex: _this.props.col,
					dirDownDatasLen: dirDownDatasLen
				});
			}, 10)
		}
		//App.emit('APP-DASHBOARD-SET-GLOBAL-SIGN', {clickHeader: true});
	},
	_setReportHeaderFilterValues: function (obj) { //报表头部导出功能设置筛选条件的方法
		if (obj.row == this.props.row && obj.col == this.props.col) {
			this.setState({
				filterFields: obj.filterFields
			})
		}
	},
	_getDrildowndata:function(drilDownDatas,row,col){

		  if (row == this.props.row && col == this.props.col) {
			this.setState({
				drilDownDatas:drilDownDatas,
				newRow:row,
				newCol:col,
			})
		  }

	},
	render: function () {
		var headerClass = "dashboardView_col_header";
		if (this.props.type == 'TEXT' && this.props.operation != 'edit') {
			headerClass = "dashboardView_col_header text_report_header";
		}
		var breadStyle = {
			opacity: '0',
			padding:'0'
		}
		var breadClass = 'breads'
		if(this.state.drilDownDatas.length<1){
			breadClass = "dashboardshow";
		}
		var svgStyle = {
			display:"block",
			height:24,
			width:24,
			userSelect:"none",
			transition:"all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
			position:"absolute",
			top:0,
			color:"#bdbdbd",
			fill:"#bdbdbd",
			right:4
		};
		var svg = <svg style={svgStyle} viewBox="0 0 24 24"><path d="M9.5,7l5,5l-5,5V7z"></path></svg>;
		return (
			<div className='dashboardView_cont'>
					<div className={headerClass} onClick={(evt)=>this._clickHandle(evt)}>
						<div className="header_left">
							<h2>{this.props.headerName}</h2>
								<p>{this.props.headerTime}</p>
							</div>
							<div className="header_right">
								{this._editeHandle()}
							{this._moveIcon()}
						</div>
					</div>
					{this._renderBreadcrumbTop(breadClass,breadStyle)}
				</div>
		)
	},
	_renderBreadcrumbTop:function(breadClass,breadStyle){
		if(this.props.reportHeader.type!="BASE"){
			return (
				<div className={breadClass} style={breadStyle}>
					{this.state.drilDownDatas.map((item,key)=>this._drilDownBreadData(item,key))}
				</div>
			)
		}else{
			return null;
		}
	},
	_drilDownBreadData:function(item,key){
		return  <BreadcrumbTop 
			metadataId={this.props.metadataId} 
			drillLevel={item.drillLevel}  
			row={this.props.row}  
			col={this.props.col} 
			item={item} 
			key={item.fieldName} 
			reportInfo={this.props.reportInfo}
			dashboard={true}
		/>
	},

	_renderIndexMenuItem: function () {
		var _exportButton ="";
		var useReportClass = 'MenuItemClassNames';
		if(sessionStorage.getItem('VIEWREPORT')!=1) {
			useReportClass = 'MenuItemClassNames disabled';
		}
		if (this.state.reprotData.type != "KPI") {
			_exportButton = <MenuItem
						primaryText="导出"
						rightIcon={<ArrowDropRight />}
						onClick={(evt)=>this._setTwoMenuScroll(evt)}
						className='MenuItemClassNames'/>;
		}else{
			_exportButton ="";
		}

		if (this.props.dashBoardRead) {
			return (
				<div>
					<MenuItem
						primaryText="刷新"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._refreshCurrentReportHandle(evt)}/>
					<MenuItem
						primaryText="重置"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._resetCurrentReportHandle(evt)}/>
					{_exportButton}
					{this._aboutReportMenu()}
				</div>
			)
		} else {
			return (
				<div>
					<MenuItem
						primaryText="刷新"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._refreshCurrentReportHandle(evt)}/>
					<MenuItem
						primaryText="重置"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._resetCurrentReportHandle(evt)}/>
					{_exportButton}
					<MenuItem
						primaryText="使用此分析"
						onTouchTap={(evt)=>this._useReportHandle(evt)}
						className={useReportClass}/>
					{this._aboutReportMenu()}
				</div>
			)
		}

	},
	_renderChartMenuItem: function () {
		var useReportClass = 'MenuItemClassNames';
		if(sessionStorage.getItem('VIEWREPORT')!=1) {
			useReportClass = 'MenuItemClassNames disabled';
		}
		if (this.props.dashBoardRead) {
			return (
				<div>
					<MenuItem
						primaryText="刷新"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._refreshCurrentReportHandle(evt)}/>
					<MenuItem
						primaryText="重置"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._resetCurrentReportHandle(evt)}/>
					{this._aboutReportMenu()}
				</div>
			)
		} else {
			return (
				<div>
					<MenuItem
						primaryText="刷新"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._refreshCurrentReportHandle(evt)}/>
					<MenuItem
						primaryText="重置"
						className='MenuItemClassNames'
						onTouchTap={(evt)=>this._resetCurrentReportHandle(evt)}/>
					<MenuItem
						primaryText="使用此分析"
						className={useReportClass}
						onTouchTap={(evt)=>this._useReportHandle(evt)}/>
					{this._aboutReportMenu()}
				</div>
			)
		}

	},
	_resetCurrentReportHandle:function (){
		var _this = this;
		setTimeout(function(){
			_this.setState({
				nextlevelOpen: false,
			});
		},200)
		App.emit('APP-DASHBOARD-RESET-REPORT-DATA',this.props.row,this.props.col,true);
	},
	_moveIcon: function () {
		if (this.props.type != "TEXT")
			if (this.state.reprotData.category == "INDEX") {

				return (
					<div className="more_icon">
						<MenuItem
							onClick={(evt)=>this._setMenuScrolls(evt)}
							leftIcon={<IconButton
								className="moreIconsClassName"
								iconClassName="icon iconfont icon-icgengduo24px">
							</IconButton>}/>
						<Popover
							open={this.state.nextlevelOpen}
							anchorEl={this.state.anchorEl}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							targetOrigin={{horizontal: 'left', vertical: 'top'}}
							onRequestClose={this._MenuScrollClose}
						>
							{this._renderIndexMenuItem()}
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
								onTouchTap={(evt)=>this._outReportDataHandle(evt, 'allDatas')}
								className="twoMenuItem"
								value="allDatas" insetChildren={true}
								disabled={ !this.props.exportData}/>
                                					

							<MenuItem
								primaryText="当前筛选数据"
								className="twoMenuItem"
                                					disabled={ !this.props.exportDataModel}
								onTouchTap={(evt)=>this._outReportDataHandle(evt, 'currentFilterDatas')}
								value="currentFilterDatas" insetChildren={true}/>

						</Popover>


					</div>
				)
			} else {
				return (
					<div className="more_icon">
						<MenuItem
							leftIcon={<IconButton
								className="moreIconsClassName"
								onClick={(evt)=>this._setMenuScrolls(evt)}
								iconClassName="icon iconfont icon-icgengduo24px">
							</IconButton>}/>
						<Popover
							open={this.state.nextlevelOpen}
							anchorEl={this.state.anchorEl}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							targetOrigin={{horizontal: 'left', vertical: 'top'}}
							onRequestClose={this._MenuScrollClose}
						>
							{this._renderChartMenuItem()}
						</Popover>
					</div>
				)
			}
	},
	_setMenuScroll: function (event) {
		event.preventDefault();
		this.setState({
			nextlevelOpen: true,
			anchorEl: event.currentTarget,
		});
	},
	_setMenuScrolls: function (event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			nextlevelOpen: true,
			anchorEl: event.currentTarget,
		});
		setTimeout(function () {
			$('.MenuItemClassNames').parent().parent().addClass('twoMenuItemStyle')
		}, 100)

	},
	_setTwoMenuScroll: function (event) {
		event.preventDefault();
		this.setState({
			laststageOpen: true,
			anchorEls: event.currentTarget,
		});
		setTimeout(function () {
			$('.twoMenuItem').parent().parent().addClass('twoMenuItemStyle')
		}, 100)
	},
	_MenuScrollClose: function () {
		this.setState({
			nextlevelOpen: false,
		});
	},
	_MenuTwoMenuScrollClose: function () {
		this.setState({
			nextlevelOpen: false,
			laststageOpen: false,
		});
	},
	_refreshCurrentReportHandle: function () { //刷新当前报表
		var _this = this;
		setTimeout(function(){
			_this.setState({
				nextlevelOpen: false,
			});
		},200)
		App.emit('APP-DASHBOARD-CLEAR-REPORT-REFRESH-BUTTON-HANDLE', {
			reportAreaId: this.props.reportHeader.id,
			row: this.props.row,
			col: this.props.col,
		},function(){

		})
	},
	_outReportDataHandle: function (evt, value) { //导出当前报表
		evt.stopPropagation();
		var reportId         = this.state.reprotData.id; //当前要导出报表的id值
		var reportFilterData = (value == "currentFilterDatas") ? this.state.filterFields : []; //当前要导出报表的是否有筛选的值
		var outPutExcelUrl = "/services/report/runtime/exportExcelByAreaInfo";//导出的是excel格式
		var outPutCsvUrl   = "/services/report/runtime/exportDataModelByAreaInfo" // 导出的是csv格式WEB_API.EXPORT_DATA_MODEL_URL;
		var outPutUrl = (value == "currentFilterDatas") ? outPutExcelUrl : outPutCsvUrl; //判断导出地址是什么？
		var outPutImg = (value == "currentFilterDatas") ? 'iconfont icon-icexcel24px' : 'iconfont icon-iccsv24px'; //抛物线的小图片？
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
		var obj = (value == "currentFilterDatas") ? ExcelObj : dataModelObj; //如果点击的是excel导出 上传对应的obj
		var areaInfo=this.props.reportInfo;
		if(value == "currentFilterDatas"){
			areaInfo=FilterFieldsStore.dwonloadUpdateAreaInfo(this.props.reportInfo,this.state.drilDownDatas,this.state.filterFields);
			areaInfo=FilterFieldsStore.dwonloadSetZhibiaoFilter(areaInfo,this.state.sortFields,this.state.maxMin,this.state.topParameters);
		}
		this._outPutReportHandle(reportId, obj, outPutUrl,areaInfo); //启用导出方法
		if (!this.props.dashBoardRead) {
			this._addOutputListHandl(evt, outPutImg); //启用导出方法
		}
		this._MenuTwoMenuScrollClose();
	},

	_useReportHandle: function () { //使用此分析
		//权限判断
		console.log("sessionStorage.getItem('VIEWREPORT')",sessionStorage.getItem('VIEWREPORT'))
		if(sessionStorage.getItem('VIEWREPORT')==1) {
			var currentCanEdited = this.props.location.query.authorityEdit;
			if (currentCanEdited == 'false') {
				var message = '您暂时没有权限编辑当前选中的驾驶舱';
				App.emit('APP-MESSAGE-OPEN', {
					content: message
				});
				return;
			}
			this.context.router.push({
				pathname: '/report/create',
				query: {
					dsDirId: this.props.directoryId,
					doshboarId: this.props.doshboarId,
					reportId: this.state.reprotData.id,
					dsActionName: this.props.actionName,
					dsDirName: this.props.dirName,
					sourceTarget: "dashboard",
					dsAuthority: this.props.location.query.authority,
					dsAuthorityDelete: this.props.location.query.authorityDelete,
					dsAuthorityView: this.props.location.query.authorityView,
					dsCurrentCanEdited: this.props.location.query.authorityEdit
				}
			});
		}
	},
	_editeHandle: function () {
		if (this.props.operation === "edit") {
			return <div className="bianji_icon">
				<IconButton
					onClick={(evt)=>this._handleToggle(evt, this.props.reportHeader)}
					className="bianjiClassName"
					iconStyle={{color: '#666'}}
					iconClassName="icon iconfont icon-icbianji24px" />
			</div>
		}
	},
	_handleToggle: function (evt, data) {
		//获取当前点击的分析的数据,并弹出右侧分析编辑模块
		evt.stopPropagation();
		if (this.props.type == 'TEXT') {
			var name = '';
			var content = '';
			try {
				name = data.name;
				content = data.content;
			} catch (e) {
			}
			var propsCell = this.props.col;
			App.emit('APP-DASHBOARD-REPORT-TEXT-OPEN', {
				row: this.props.row,
				cell: propsCell,
				col: propsCell,
				name: name,
				content: content
			});
		} else {
			App.emit('APP-DRAWER-RIGHT', <EditReprotComponent
				rowNum={this.props.row}
				colNum={this.props.col}
				areaInfo={this.props.reportInfo}
				reprotData={data}
				columnAttributes={this.props.columnAttributes}
				listRightNoSort={true}/>, 450, 80);
		}
		App.emit("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE", {
			isClick: false,
			sIndex: null
		});
	},
	_outPutReportHandle: function (id, filterData, url, areaInfo) { //导出方法

		let $form =  $("#formSubmitByAreaInfo");
		filterData = encodeURIComponent(JSON.stringify(filterData));
        let sid = App.sid ? App.sid: sessionStorage.getItem("SID");
		var formUrl = App.host + url + "?terminalType=PC&sessionId=" + encodeURIComponent(sid);
		$form.attr("action", formUrl);
		let areaInfoURI = encodeURIComponent(JSON.stringify(areaInfo));
		$("input[name=areaInfo]").val(areaInfoURI);
		$("input[name=areaParameters]").val(filterData);
		$form.submit();
	},
	_addOutputListHandl: function (evt, outPutImg) { //导出抛物线的方法
		var newsButtonBox = $('.newsButtonBox');
		var $div = $('<div class="addMessagesBox"><div class="' + outPutImg + '"></div></div>');
		$div.fly({
			start: {
				left: $(evt.target).offset().left + 24, //开始位置（必填）#fly元素会被设置成position: fixed
				top: $(evt.target).offset().top - 24, //开始位置（必填）
				background: ''
			},
			end: {
				left: newsButtonBox.offset().left, //结束位置（必填）
				top: newsButtonBox.offset().top, //结束位置（必填）
			},
			onEnd: function () { //结束回调
				this.destroy();
			}
		});
	},

	_aboutReportMenu: function() {
		return (
			<MenuItem
				primaryText="关于此分析..."
				onTouchTap={(evt)=>this._aboutReport(evt)}
				className='MenuItemClassNames'/>
		);
	},

	/**
	 * 显示“关于此分析”对话框
	 * @private
	 */
	_aboutReport: function() {
		if (!this.isMounted()) return;
		App.emit('APP-DASHBOARD-SHOW-DIALOG-ABOUT-REPORT', true, this.props.col, this.props.row);
		this._MenuTwoMenuScrollClose();
	},
	//指标排序
	_setSortFields:function(arg){
		if (!this.isMounted()) return;
		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
	           sortFields:arg.sortFields,
	        });
		}
   },
   // 最大最小值
   _setSortMaxMin:function(arg){
   		if (!this.isMounted()) return;
   		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
	           maxMin:arg.maxMin,
			   topParameters:false
	        });
		}
   },
   //topn
   _setSortTopn:function(arg){
   		if (!this.isMounted()) return;
	   	if(arg.row==this.props.row && arg.col==this.props.col){
	        this.setState({
	           topParameters:arg.topParameters,
	           maxMin:false
	        });
	    }
   },
   _setNoFilter:function(arg){
		if (!this.isMounted()) return;
		if(arg.row==this.props.row && arg.col==this.props.col){
			this.setState({
				topParameters:false,
				maxMin:false
			});
		}
	},
});
