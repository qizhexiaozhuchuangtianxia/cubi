var $ = require('jquery');
var React = require('react');
var App = require('app');
var classnames = require('classnames');
var dashboardList = require('./dashboardList');
var DashboardStore = require('../stores/DashboardStore'); //存储数据的js
var RowComponent = require('./dashboard/RowComponent'); //具体行列js
var AddBoxBtn = require('./dashboard/AddBoxBtn');
var SaveButton = require('./dashboard/SaveButton');
var Editor = require('./dashboard/Editor');
var WebComponent = require('./dashboard/WebComponent');
var LineCol = require('./dashboard/LineCol');
var LineRow = require('./dashboard/LineRow');
var Loading = require('./common/Loading');
var GlobalFilterStore = require('../stores/GlobalFilterStore');
import DownLoadNewsButton from "./common/DownLoadNewsButton";
var {
	Router
} = require('react-router');
var {
	FloatingActionButton
} = require('material-ui');

module.exports = React.createClass({
	app: {},
	displayName: '驾驶舱详情页',
	contextTypes: {
		router:React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		if(this.props.sdk){
			var operation = this.props.operation;
			this.authorityEdit = this.props.query.authorityEdit;
			this.action = this.props.query.action;
			this.parentId = this.props.query.parentId;
			this.actionName = this.props.query.actionName;
			this.dirName = this.props.query.dirName;
			this.randomId = this.props.query.randomId;
			this.signCode = this.props.query.signCode;
			this.SessionID = this.props.query.SessionID;
		} else{
			var operation = this.props.location.query.operation ? this.props.location.query.operation : 'view';
			this.authorityEdit = this.props.location.query.authorityEdit;
			this.action = this.props.location.query.action;
			this.parentId = this.props.location.query.parentId;
			this.actionName = this.props.location.query.actionName;
			this.dirName = this.props.location.query.dirName;
		}
		return {
			name: '',
			id: null,
			directoryId: '',
			rows: [{
				cells:[{
					width:1200,
					height:382,
					report:{
						addData:'no'
					}
				}]
			}],
			loading: true,
			operation: operation,
			canShowState: {
				canShow: false,
				canShowRowId: 0,
				canShowColId: 0,
				dirDownDatasLen: []
			},
			scale: 1,
			authorityEdit: this.authorityEdit,
			globalFilterFields: {
				oldGlobalFilter: [],
				filterFields: [],
				seletedArr: [],
				coverTreeFilter: null,
				coverFilter: null,
				coverDateFilter: null,
				coverTreeDateFilter: null,
				coverSearchFilter: null,
				metadataId: null
			},
			globalFilterSign: false,
			filterSign: null,
			clickHeader: false,
			version:0.1,
			exportData:this.props.location.query.exportData,
            		exportDataModel:this.props.location.query.exportDataModel
		}
	},
	componentWillMount: function() {
		var _this = this;
		this._setHeaderNavHandle(); //执行设置头部导航的方法
		if (this.action != "create") {
			var read = false;
			var urlObj = null;
			if(this.props.sdk){
				read = true;
				urlObj = {
					randomId:this.randomId,
					signCode:this.signCode,
					SessionID:this.SessionID
				}
			}
			DashboardStore.getDashboard(this.action,read,urlObj).then(function(data) {
				if (_this.isMounted()) {
					var rows = data.rows || [];
					var dashoboardName = data.name || _this.actionName;
					var directoryId = _this.parentId || '';
					/*if (rows) {
						if (data.version != '3.0') {
							for (var i = 0; i < rows.length; i++) {
								if(rows[i].cells.length==2){
									if(rows[i].cells.length==4){
										rows[i].cells[0].width = 300;
										rows[i].cells[1].width = 300;
									}
								}
								if (rows[i].cells.length == 1) {
									//var nowScale = Math.floor(rows[0].cells[0].width/16);
									rows[i].cells[0].width = 1200;
								} else {
									var defScale = Math.floor(1200 / 16);
									var leftScale = Math.floor(rows[i].cells[0].width / 16);
									var rightScale = Math.floor(rows[i].cells[1].width / 16);
									var newScale = (leftScale + rightScale);
									leftScale = leftScale * defScale / newScale;
									rightScale = rightScale * defScale / newScale;
									rows[i].cells[0].width = leftScale * 16;
									rows[i].cells[1].width = rightScale * 16;
								}
							}
						}
					}*/
					if(rows.length==0){
						rows = _this.state.rows;
					}
					if (data.version == '3.0'||data.version == '3.01'){
						rows = DashboardStore.setRows(rows);
					}
					_this.setState(function(previousState, currentProps) {
						return {
							rows: rows,
							name: dashoboardName,
							loading: false,
							id: data.id,
							directoryId: directoryId,
							version:data.version
						};
					});
				}
			});
		} else {
			_this.setState(function(previousState, currentProps) {
				return {
					directoryId: _this.parentId,
					name: _this.actionName,
					operation: 'edit',
					loading: false
				};
			});
		}
		if (window.localStorage) window.localStorage.removeItem('dirId');
		//App.emit('APP-MENU-TOGGLE-BACK-HANDLE',{toggle:true,arg:this.props.location.query.dirId,func:"APP-DASHBOARD-GO-BACK-HANDLE"});
	},
	componentWillReceiveProps: function(nextProps) { //点击本页面进入本页面的时候触发
	},
	componentDidMount: function() { //组件加载完成之后执行的方法
		this._scrollBrar();
		var dashboardBox = $(this.refs.boxWidth);
		var dashboardBoxWidth = dashboardBox.width(); //整行的宽度大小
		//订阅用户选择的立方事件
		this.app['APP-DASHBOARD-SHOW-EDIT-META-DATA'] = App.on('APP-DASHBOARD-SHOW-EDIT-META-DATA', this._changeDashboardDataHandle);
		this.app['APP-SET-DASHBOARD-REPORT-HEIGHT'] = App.on('APP-SET-DASHBOARD-REPORT-HEIGHT', this._setHeight);
		this.app['APP-SET-DASHBOARD-REPORT-WIDTH'] = App.on('APP-SET-DASHBOARD-REPORT-WIDTH', this._setWidth);
		this.app['APP-DASHBOARD-ADD-REPORT'] = App.on('APP-DASHBOARD-ADD-REPORT', this._useReport);
		//订阅用户选择的事件
		this.app['APP-DASHBOARD-GO-BACK-HANDLE'] = App.on('APP-DASHBOARD-GO-BACK-HANDLE', this._goBackHandle);
		this.app['APP-DASHBOARD-GO-SAVE'] = App.on('APP-DASHBOARD-GO-SAVE', this._goSave);
		this.app['APP-DASHBOARD-SAVE'] = App.on('APP-DASHBOARD-SAVE', this._save);
		//设置返回按钮和头部面包屑的方法
		this.app['APP-DIALIG-CLOSE-SET-HEADER-HANDLE'] = App.on('APP-DIALIG-CLOSE-SET-HEADER-HANDLE', this._closeDialogSetHeadrHandle);
		//修改传过来的对应的报表的是否是处于编辑状态
		this.app['APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE', this._editFilterHandle);
		//驾驶舱右侧编辑弹出操作方法
		this.app['APP-DASHBOARD-REPORT-EDIT-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-HANDLE', this._editReportHandle);
		// 驾驶舱右侧修改报表名称方法
		//this.app['APP-DASHBOARD-REPORT-EDIT-TITLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-TITLE', this._editReportTitle);
		//驾驶舱右侧编辑弹出操作是否可以切换不同图形效果方法
		this.app['APP-DASHBOARD-REPORT-EDIT-CHAR-TOGGLE-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-CHAR-TOGGLE-HANDLE', this._editReportChartIconHandle);
		//驾驶舱右侧编辑弹出操作是否可以显示图形展示区域方法
		this.app['APP-DASHBOARD-REPORT-EDIT-SET-CHAR-SHOW-TOGGLE-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-SET-CHAR-SHOW-TOGGLE-HANDLE', this._editReportShowChartIconHandle);
		//驾驶舱右侧弹出点击筛选条件 在左侧驾驶舱上显示选中的筛选条件
		this.app['APP-DASHBOARD-REPORT-EDIT-FILTER-TOGGLE-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-FILTER-TOGGLE-HANDLE', this._rightEditFilterListHandle);
		//驾驶舱 清空筛选按钮点击之后的触发的方法 重置当前驾驶舱每个分析里面的筛选字段 selected都是false
		this.app['APP-DASHBOARD-CLEAR-REPORT-FILTER-LIST-HANDLE'] = App.on('APP-DASHBOARD-CLEAR-REPORT-FILTER-LIST-HANDLE', this._clearReportFilterListHandle);
		this.app['APP-DASHBOARD-REPORT-FILTER-SORT'] = App.on('APP-DASHBOARD-REPORT-FILTER-SORT', this._filterSort);
		//点击驾驶舱右侧显示设置默认筛选值的方法
		this.app['APP-DASHBOARD-REPORT-SHOW-REPORT-HANDLE'] = App.on('APP-DASHBOARD-REPORT-SHOW-REPORT-HANDLE', this._showReportDefaultFilterHandle);
		//点击驾驶舱编辑模块设置自定义宽度方法 在EditReportComponent.js调用了
		this.app['APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE'] = App.on('APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE', this._setCellsAutoWidthHandle);
		//保存驾驶舱默认筛选的方法
		this.app['APP-DASHBOARD-SAVE-DEFAULT-FILTER-HANDLE'] = App.on('APP-DASHBOARD-SAVE-DEFAULT-FILTER-HANDLE', this._saveDefaultFilterHandle);
		//点击驾驶舱筛选按钮 选取值之后执行的方法
		this._closeDialogSetHeadrHandle();

		//_setGlobalFilterSign
		//this.app['APP-DASHBOARD-SET-GLOBAL-FILTER-SIGN'] =App.on('APP-DASHBOARD-SET-GLOBAL-FILTER-SIGN',this._setGlobalFilterSign);
		this.app['APP-DASHBOARD-SET-GLOBAL-FILTER'] = App.on('APP-DASHBOARD-SET-GLOBAL-FILTER', this._setGlobalFilter);
		//this.app['APP-DASHBOARD-SET-GLOBAL-SIGN'] = App.on('APP-DASHBOARD-SET-GLOBAL-SIGN', this._setGlobalFilterSign);
		this.app['APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE'] = App.on('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE', this._setGlobalFilterType);
		this.app['APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER'] = App.on('APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER', this._openGlobalFilter);

	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
		if (window.localStorage) window.localStorage.removeItem('dirId');
	},
	componentWillUpdate: function() {
		
	},
	componentDidUpdate: function() {
		this._scrollBrar();
	},
	render: function() {
		var rows = this.state.rows;
		var saveButton = this.state.authorityEdit == 'true' ? <SaveButton operation={this.state.operation}/> : '';
		var styles = {width:1200};
		if (this.state.loading) {
			return (
				<div className="dashboard-panel">
					<LineCol rows={this.state.rows}/>
					<LineRow rows={this.state.rows}/>
					<div className="dashboardView" ref="scrollBox">
						<div className="dashboardView_box" style={styles} ref="boxWidth">
							<Loading/>
						</div>
					</div>
				</div>
			)
		} else {
			if (rows.length == 0) {
				if(!this.props.sdk){
					return (
						<div className="dashboard-panel">
							<LineCol rows={this.state.rows}/>
							<LineRow rows={this.state.rows}/>
							<div className="dashboardView" ref="scrollBox">
								<div className="dashboardView_box" style={styles} ref="boxWidth">
				                    <AddBoxBtn
				                    	row="0"
				                    	cell="0"
				                    	data={{width:1216,height:310}}
				                    	operation={this.state.operation}
				                    	dirId={this.state.directoryId}
				                    	actionName={this.state.name}
				                    	width={1216}
				                    	colLength={0}
				                    	rows={this.state.rows}
				 						first={true}/>
								</div>
							</div>
							{saveButton}
		                	<Editor/>
		                	<WebComponent/>
						</div>
					)
				}else{
					return (
						<div className="dashboard-panel">
							<div className="dashboardView" ref="scrollBox">
								<div className="dashboardView_box" style={styles} ref="boxWidth">
				                    
								</div>
							</div>
						</div>
					)
				}
			} else {
				if(!this.props.sdk){
					return (
						<div className="dashboard-panel">
							<LineCol rows={this.state.rows}/>
							<LineRow rows={this.state.rows}/>
							<div className="dashboardView" ref="scrollBox">
								<div className="dashboardView_box" style={styles} ref="boxWidth">
				                    {rows.map(this._domHandle)}
								</div>
							</div>
							{saveButton}
		                	<Editor/>
		                	<WebComponent/>
						</div>
					)
				}else{
					return (
						<div className="dashboard-panel">
							<div className="dashboardView" ref="scrollBox">
								<div className="dashboardView_box" style={styles} ref="boxWidth">
				                    {rows.map(this._domHandle)}
								</div>
							</div>					                
						</div>
					)
				}
			}
		}
	},
	_closeDialogSetHeadrHandle: function() { //关闭弹出框执行的方法
		if(this.props.sdk){
			return;
		}
		this._setHeaderNavHandle(); //执行设置头部导航的方法
		App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
			toggle: true,
			arg: this.props.location.query.parentId,
			func: "APP-DASHBOARD-GO-BACK-HANDLE"
		});
	},
	_rightEditFilterListHandle: function(obj) { //编辑右侧弹出的筛选条件 在右侧的报表显示选中条件的列表
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			if (previousState.rows[obj.row].cells[argCells].report.filterFields != undefined) {
				previousState.rows[obj.row].cells[argCells].report.filterFields = obj.itemObj;
			}
			return previousState;
		});
	},
	_saveDefaultFilterHandle: function(obj) { //编辑右侧弹出的默认筛选条件 用于保存默认筛选
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.defaultFilterFileds = obj.defaultFilterFileds;
			return previousState;
		});
	},
	_filterSort: function(arg) {
		var argCells = arg.col;
		var row = arg.row,
			col = argCells,
			fields = arg.fields;

		this.setState(function(previousState, currentProps) {
			previousState.rows[row].cells[col].report.filterFields = fields;
			return previousState;
		})
	},
	_editReportHandle: function(obj) { //右侧编辑修改了报表的名字
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.name = obj.reportName;
			previousState.rows[obj.row].cells[argCells].report.tit = obj.reportName;
			return previousState;
		});
	},
	_editReportChartIconHandle: function(obj) { //控制右侧是否显示图形toggle按钮的方法
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.showCharIcon = !obj.showCharIcon;
			return previousState;
		});
	},
	_editReportShowChartIconHandle: function(obj) { //控制右侧筛选是否显示图形展示区域toggle按钮的方法
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.reportFilterSet = !obj.reportFilterSet;
			obj.callback(!obj.reportFilterSet)
			return previousState;
		});
	},
	_editFilterHandle: function(itemObj) { //修改传过来的对应的报表的是否是处于编辑状态
		this.setState(function(previousState, currentProps) {
			previousState.canShowState.canShow = itemObj.canShow;
			previousState.canShowState.canShowRowId = itemObj.itemRowIndex;
			previousState.canShowState.canShowColId = itemObj.itemColIndex;
			previousState.canShowState.dirDownDatasLen = itemObj.dirDownDatasLen;
			return {
				previousState
			};
		});
	},
	_goBackHandle: function(dirId) {
		this.context.router.push({
			pathname: '/dashboard/list',
			query: {
				'dirId': dirId
			}
		});
	},
	_domHandle: function(item, index) {
		return (
			<RowComponent
		        scale={this.state.scale}
		        directoryId={this.state.directoryId}
		        doshboarId={this.action}
		        canShowState={this.state.canShowState}
		        len={this.state.rows.length}
		        key={index}
		        row={index}
		        rows={this.state.rows}
		        rowData={item}
		        cells={item.cells}
		        actionName={this.actionName}
		        dirName={this.dirName}
		        operation={this.state.operation}
		        location={this.props.location}
		        globalFilterFields={this.state.globalFilterFields}
		        globalFilterSign={this.state.globalFilterSign}
		        filterSign={this.state.filterSign}
		        clickHeader={this.state.clickHeader}
		        exportData={ this.state.exportData}
                          exportDataModel={ this.state.exportDataModel}
	        />
        );
	},
	_setCellSlipped: function(item) {

	},
	_scrollBrar: function() {
		//$(this.refs.scrollBox).height(document.body.clientHeight-104);
		$(this.refs.scrollBox).mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark",
			mouseWheel: {
				scrollAmount: 150
			},
			autoExpandScrollbar: true,
			snapAmount: 1,
			snapOffset: 1
		});
	},
	_changeDashboardDataHandle: function(dataObj) { //点击当前驾驶舱 变成编辑状态的方法
		this.setState(function(previousState, currentProps) {
			return {
				previousState
			};
		});
	},
	_showEditHandle: function(evt, rowIndex, colIndex) { //点击当前驾驶舱 变成编辑状态的方法
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-SHOW-EDIT-META-DATA', {
			rowIndex: rowIndex,
			colIndex: colIndex
		});
	},
	_setHeight: function(index, hdata, fx) {
		this.setState(function(previousState, currentProps) {
			var isReport = false;
			for (var i = 0; i < previousState.rows[index].cells.length; i++) {
				var reportType = previousState.rows[index].cells[i]["type"];
				if (reportType != "TEXT"&&reportType != "WEB") {
					isReport = true;
				}
			}
			for (var i = 0; i < previousState.rows[index].cells.length; i++) {
				var height = previousState.rows[index].cells[i].height;
				var hdatas = Math.abs(hdata);
				if (hdatas < 24) {
					return;
				}
				height = (height - hdata);
				var reportType = previousState.rows[index].cells[i]["type"];
				if (!isReport && height < 30) {
					height = 30;
				} else if (isReport && height < 236) {
					height = 236;
				}
				previousState.rows[index].cells[i].height = height;
			}
			return previousState;
		});
	},
	_setWidth: function(row,col,w,cell,colLen,clen) {
		this.setState(function(previousState, currentProps) {
			previousState.rows = DashboardStore.setCellWidth(previousState.rows,w,row,cell,col);
			return previousState;
		});
	},
	_clearReportFilterListHandle: function(obj) { //点击情况筛选按钮执行的方法,把数据里面的selected全部设置成false
		var reportFilterData = this.state.rows[obj.row].cells[obj.col].report.filterFields;
		this.setState(function(previousState, currentProps) {
			if (reportFilterData.length > 0) {
				for (var i = 0; i < reportFilterData.length; i++) {
					reportFilterData[i].selected = false;
				}
			}
			return previousState;
		})
	},
	_setCellsAutoWidthHandle: function(obj) { //当设置了列的自定义宽度时候设置保存数据的方法.
		var argCells = obj.col;
		var columnAttributes = this.state.rows[obj.row].cells[argCells].report.columnAttributes;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.columnAttributes = obj.customCellWidthArr
			return previousState;
		})
	},
	_showReportDefaultFilterHandle: function(obj) { //设置当前报表是否显示配置默认筛选的模块的方法
		var argCells = obj.col;
		this.setState(function(previousState, currentProps) {
			previousState.rows[obj.row].cells[argCells].report.showDefaultFilter = obj.showDefaultFilter;
			if (!obj.showDefaultFilter) {
				previousState.rows[obj.row].cells[argCells].report.defaultFilterFileds = [];
			}
			return previousState;
		});
	},
	_useReport: function(arg) {
		if (!this.isMounted()) return;
		if (this.state.authorityEdit == 'false') {
			var message = '您暂时没有权限删除当前选中的驾驶舱';
			App.emit('APP-MESSAGE-OPEN', {
				content: message
			});
			return;
		}
		this.setState(function(previousState){
			arg.rows = previousState.rows;
			if(arg.id||arg.type=='TEXT'||arg.type=='WEB'){
				previousState.rows = DashboardStore.addReport(arg);
			}else if (arg.type == "DOWN_FILTER" || arg.type == "SEARCH_FILTER" || arg.type == "DATE_FILTER") {
				previousState.rows = DashboardStore.addGlobalFilter(arg);
			}else if(arg.useType == 'del'){
				previousState.rows = DashboardStore.delCell(arg);
			}else{
				previousState.rows = DashboardStore.addCell(arg);
			}
			return previousState;
		})
		this._setHeaderNavHandle(); //执行设置头部导航的方法
		App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
			toggle: true,
			arg: this.props.location.query.parentId,
			func: "APP-DASHBOARD-GO-BACK-HANDLE"
		});
	},
	_setHeaderNavHandle: function() { //执行设置头部导航的方法
		if(this.props.sdk){
			return;
		}
		var currentName = [{
			name: this.props.location.query.actionName,
			dirId: this.props.location.query.parentId
		}];
		App.emit('APP-HEADER-NAV-HANDLE', currentName) //Header.js文件
	},
	_save: function() {
		var _this = this;
		var rows=this._saveDelseletedArr(JSON.stringify(this.state.rows));
		var dashboardObject = {
			dashboardObject: {
				id: this.state.id ? this.state.id : null,
				name: this.state.name ? this.state.name : '',
				// directoryId:this.state.directoryId,
				timeAxis: false,
				rows: rows,
				version: '3.02'
			}
		}
		DashboardStore.saveDashboard(dashboardObject).then(function(data) {
			if (data.success) {
				_this.setState(function(previousState, currentProps) {
					previousState.operation = 'view';
					previousState.canShowState.canShow = false;
					return previousState;
				})
			}
			App.emit('APP-MESSAGE-OPEN', {
				content: data.message
			});
		});
	},
	_saveDelseletedArr:function(rows){
		var rows=JSON.parse(rows);
		for(var i=0;i<rows.length;i++){
			var cells=rows[i].cells;
			for(var j=0;j<cells.length;j++){
				if(cells[j].type=="REPORT"){
					var filter=cells[j].report.globalFilterFields;
					if(filter){
						for(var h=0;h<filter.length;h++){
							filter[h].seletedArr=[];
						}
					}
				}else{
					cells[j].report.seletedArr=[];
					if(cells[j].type=="DATE_FILTER"){
						cells[j].report.startValue=cells[j].report.minValue;
						cells[j].report.endValue=cells[j].report.maxValue;
					}
				}
			}
		}
		return rows;
	},
	_goSave: function() {
		if (this.props.location.query.authorityEdit == 'false') {
			var message = '您暂时没有权限编辑当前选中的驾驶舱';
			App.emit('APP-MESSAGE-OPEN', {
				content: message
			});
		} else {
			var _this = this;
			this.setState(function(previousState, currentProps) {
				previousState.operation = 'edit';
				return previousState;
			});
		}

	},
	
	//设置全局筛选器 筛选值
	_setGlobalFilter: function(arg) {
		this.setState(function(previousState, currentProps) {
			var rows = this.state.rows;
			
			var col=arg.col;
			rows[arg.row].cells[col].report.seletedArr = arg.seletedArr; //选中
			if (arg.filterType == "DATE_FILTER") {
				rows[arg.row].cells[col].report.startValue = arg.startValue;
				rows[arg.row].cells[col].report.endValue = arg.endValue;
				// rows[arg.row].cells[col].report.minValue = arg.minValue;
				// rows[arg.row].cells[col].report.maxValue = arg.maxValue;
			}
			for (var i = 0; i < rows.length; i++) {
				var cells = rows[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cell=cells[j];
					if (!GlobalFilterStore.isEmptyObject(cell.report)) {
						var globalFilter = cell.report.globalFilterFields;
						var pushSign = 0;
						if(!globalFilter){continue}
						for (var h = 0; h < globalFilter.length; h++) {
							delete globalFilter[h].curDimensionId;
							if (globalFilter[h].sign == arg.sign) {
								globalFilter[h].groupType = arg.groupType;
								globalFilter[h].metadataId = arg.metadataId;
								globalFilter[h].dimensionId = arg.dimensionId;
								globalFilter[h].seletedArr = arg.seletedArr;
								globalFilter[h].filterType = arg.filterType;
								globalFilter[h].curDimensionId = arg.curDimensionId;
								//日期
								if(globalFilter[h].filterType!=="DATE_FILTER"){
									globalFilter[h].fieldName = arg.fieldName;
									globalFilter[h].name = arg.name;
								}
							}

						}

					}
				}
			}
			previousState.rows = rows;
			previousState.globalFilterSign = arg.globalFilterSign;
			return previousState;
		});
	},
	//全局筛选关联报表
	_openGlobalFilter: function(arg) {
		this.setState(function(previousState, currentProps) {
			var rows = this.state.rows;
			for (var i = 0; i < rows.length; i++) {
				if(arg.row === i){
					var cells = rows[i].cells;
					for(var t=0;t<cells.length;t++){
						if (t == arg.col) {
							var filter = cells[t].report.globalFilterFields;
							for (var h = 0; h < filter.length; h++) {
								if (arg.open && filter[h].sign == arg.sign) {
									if(arg.filterType==='DATE_FILTER'){// && arg.row === i && arg.col === t
										filter[h].open = arg.open;
										filter[h].fieldName = arg.fieldName;
										filter[h].name = arg.name;
										filter[h].reportRow = arg.row;
										filter[h].reportCol = arg.col;
									}else if (arg.metadataId == filter[h].metadataId ) {
										filter[h].open = arg.open;
										filter[h].fieldName = arg.fieldName;
										filter[h].name = arg.name;
										filter[h].reportRow = arg.row;
										filter[h].reportCol = arg.col;
									}
								} else if(filter[h].sign == arg.sign){
									if(arg.filterType==='DATE_FILTER'){// && arg.row === i && arg.col === t
										filter[h].open = arg.open;
									}else if (arg.metadataId!=='' && arg.metadataId == filter[h].metadataId) {
										filter[h].open = arg.open;
									}
								}
							}
						}
					}
				}
			}
			previousState.rows = rows;
			return previousState;
		})
	},
	//设置全局筛选器类型,维度
	_setGlobalFilterType: function(arg) {
		this.setState(function(previousState, currentProps) {
			//设置筛选器单元格report属性
			var rows = JSON.parse(JSON.stringify(this.state.rows));
			var col=arg.col;
			if (arg.isName) {
				rows[arg.row].cells[col].report.filterAliasName = arg.filterAliasName;
				//rows[arg.row].cells[arg.col].report.filterAliasName = arg.filterAliasName;
			} else {
				rows[arg.row].cells[col].report.dimensionId = arg.item.dimensionId ||'';
				rows[arg.row].cells[col].report.metadataId = arg.item.metadataId ||'';
				rows[arg.row].cells[col].report.name = arg.item.name ||'';
				rows[arg.row].cells[col].type = arg.filterType;
				rows[arg.row].cells[col].report.filterName = arg.filterName;
				rows[arg.row].cells[col].report.filterAliasName = arg.filterAliasName;
				rows[arg.row].cells[col].report.seletedArr=[];
				rows[arg.row].cells[col].report.fieldName = arg.item.fieldName ||'';
				rows[arg.row].cells[col].report.groupType = arg.item.groupType ||'';
				rows[arg.row].cells[col].report.groupLevels = arg.item.groupLevels || [];

				if (arg.filterType == "DATE_FILTER") {
					rows[arg.row].cells[col].report.startValue = arg.startValue;
					rows[arg.row].cells[col].report.endValue = arg.endValue;
					rows[arg.row].cells[col].report.minValue = arg.minValue;
					rows[arg.row].cells[col].report.maxValue = arg.maxValue;
				}

			}
			//设置报表report属性
			for (var i = 0; i < rows.length; i++) {
				var cells = rows[i].cells;
				for (var j = 0; j < cells.length; j++) {
					var cell=cells[j];
					if (!GlobalFilterStore.isEmptyObject(cell.report)) {
						var globalFilter = cell.report.globalFilterFields;
						if(globalFilter){
							for (var h = 0; h < globalFilter.length; h++) {
								if (globalFilter[h].sign == arg.sign) {
									if (arg.isName) {
										globalFilter[h].filterAliasName = arg.filterAliasName;
									} else {
										globalFilter[h].dimensionId = arg.item.dimensionId;
										globalFilter[h].metadataId = arg.item.metadataId;
										globalFilter[h].filterType = arg.item.filterType || arg.filterType;
										globalFilter[h].filterName = arg.filterName;
										globalFilter[h].filterAliasName = arg.filterAliasName;
										globalFilter[h].seletedArr = [];
										globalFilter[h].open=false;
										globalFilter[h].name = arg.item.name;
										globalFilter[h].fieldName = arg.item.fieldName;
									}
								}
							}
						}
					}
				}
			}
			previousState.rows = rows;
			return previousState;
		});

	},
	
});
