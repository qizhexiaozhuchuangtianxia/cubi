var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../../stores/ReportStore');
var FilterFieldsStore = require('../../../stores/FilterFieldsStore');
var DrillDownTransformDate = require('../DrillDownTransformDate');
var PagerView = require('../PagerView');
var Loading = require('../Loading');
var HeadTd = require('./HeadTd');
var ReportUtil = require('../../../utils/ReportUtil');
var PublicButton = require('../PublicButton');
var PublicTextField = require('../PublicTextField');
var {
	TextField,
	Popover,
	FlatButton
} = require('material-ui');

module.exports = React.createClass({
	displayName: 'RenderTable',

	propTypes: {
		data: React.PropTypes.object.isRequired,
		onFieldNameChanged: React.PropTypes.func,
	},

	getInitialState: function() {
		return {
			data: this.props.data,
			preTableHeight: 0,
			errorTextField: '',
			formulas: '',
			dataType:null,
			customName: {
				Open: false,
				name: '',
				anchorEl: null,
				index: 0
			},
			clienX:0,
			clienY:0,
			display:'none'
		}
	},
	componentWillMount: function() {
		for (var i in this.app) {
			this.app[i].remove()
		}

	},
	app: {},
	componentDidMount: function() {
		this.app['APP-TABLE-SET-CUSTOMNAME'] = App.on('APP-TABLE-SET-CUSTOMNAME', this._openCustomName);

		this._setScrollbar();

	},
	n: 1,
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			data: nextProps.data
		});
	},
	render: function() {
		var data = this._tableData();
		var fields = data.fields;
		var rows = data.pages[0].rows; //分析页面取1，驾驶舱页取 curpage;
		var style={}
		if (this.props.isDashboardTable) {
			var currentNo = this.props.currentPage - this.props.startNo;
			rows = data.pages[0].rows;
			style={
				"height":this.props.height-42 + 'px'
			}
		}
		rows = this._fixRowWithHiddenCol(rows);

		var head = <thead>
			<tr>
				{fields.map(this.renderHead)}
			</tr>
		</thead>;
		if (data.type == 'CROSS') {
			head = null
		}

		return (
			<div className="table-gundong"  style={style}>
				<div ref="table-container" className="table-container">
					<table border="0" cellSpacing="0" cellPadding="0" className="table-report table-bordered">
						{head}
						<tbody>
							{rows.map(this._renderBody)}
						</tbody>
					</table>

					<Popover
						open={this.state.customName.open}
						anchorEl={this.state.customName.anchorEl}
						anchorOrigin={{horizontal: 'left', vertical: 'top'}}
						targetOrigin={{horizontal: 'left', vertical: 'top'}}
						onRequestClose={this._handleRequestClose}
						style={{background:'#fff',boxShadow:'1px 1px 10px 0px #999'}}
					>
						<div className="set-customName-panel">
							<h2 className="title">表头修改</h2>
							<PublicTextField
								style={{width:240, fontSize:"12px"}}
								floatingLabelStyle={false}
								inputStyle={{color:'rgba(0,0,0,0.83)'}}
								lineStyle={{  borderColor:'rgba(0,0,0,0.25)'}}
								underlineFocusStyle={{borderColor:'rgba(7,151,239,239)	'}}
								defaultValue={this.state.customName.name}
								errorText={this.state.errorTextField}
								onChange={(evt)=>this._chengeCustomName(evt)}/>

							<div className="set-customName-buttons">
								<PublicButton
											 style={{width:70,minWidth:50,color:"rgba(0,0,0,0.87)"}}
											 labelText="取消"
											 rippleColor="rgba(0,0,0,0.20)"
 											 hoverColor="rgba(0,0,0,0.10)"
										   onClick={this._closeCustomNamePopover}/>
								<PublicButton
									    style={{width:70,minWidth:50,color:"rgba(0,145,234,234)"}}
											labelText="确定"
											rippleColor="rgba(0,229,255,0.25)"
											hoverColor="rgba(7,151,239,239)"
											onClick={this._setCustomName}/>
							</div>
						</div>
					</Popover>
				</div>
			</div>
		)
	},
	_tableData: function() {
		var tableCustomArr = ReportStore.tableCustomArr;
		//var data = JSON.parse(JSON.stringify(this.state.data));
		var data = this.state.data;
		if (tableCustomArr.length > 0) {
			// for(var i=0;i<data.fields.length;i++){
			// 	if(data.fields[i].name==tableCustomArr[i].name){
			// 		data.fields[i].customName=tableCustomArr[i].customName;
			// 	}

			// }
			// return data;
			for (var i = 0; i < tableCustomArr.length; i++) {
				for (var j = 0; j < data.fields.length; j++) {
					if (data.fields[j].name === tableCustomArr[i].name) {
						data.fields[j].customName = tableCustomArr[i].customName;
						break;
					}
				}
			}
		}
		return data;
	},

	/**
	 * XuWenyue
	 * 驾驶舱隐藏列时，要求不影响计算列的使用
	 * 隐藏方式在前端进行，根据配置信息， 之隐藏指标列，维度列仍然由后端隐藏
	 * 由于返回后端返回数据为表格形式，无法获取到具体cell的对应列，
	 * 因此预先计算隐藏指标的位置，然后根据位置隐藏列
	 */
	_fixRowWithHiddenCol(fixingRows) {
//debugger;
		var dataFields = this.state.data.fields;
		var tableConfigs = this.props.tableConfig;
		var hiddenCols = {};
		var hiddenColArr = [];

		// 整理隐藏列配置信息
		if ((!tableConfigs) || (1 > tableConfigs.length)) {
			return fixingRows;
		}
		for (var counter = 0; counter < tableConfigs.length; counter++) {
			if (0 != tableConfigs[counter].defaultValue) {
				continue;
			}
			hiddenCols[tableConfigs[counter].name] = -1;
		}

		// 整理隐藏列位置信息
		for (var counter = dataFields.length - 1; counter > -1; counter--) {
			if ("dimension" == dataFields[counter].dmType) {
				continue;
			}
			if (!hiddenCols[dataFields[counter].name]) {
				continue;
			}

			hiddenCols[dataFields[counter].name] = dataFields.length - counter - 1;
		}

		// 设置隐藏列的属性
		for (var counter = 0; counter < fixingRows.length; counter++) {
			var fixingRow = fixingRows[counter];
			for (var hiddenCol in hiddenCols) {

				if (0 > hiddenCols[hiddenCol]) {
					continue;
				}

				var cellsIndexLength = fixingRow.cells.length - 1;

				fixingRow.cells[cellsIndexLength - hiddenCols[hiddenCol]].clazz = 'hiddenColClass';
			}
		}

		return fixingRows;

	},
	_setScrollbar: function() {
		$(ReactDOM.findDOMNode(this)).mCustomScrollbar({
			axis: "x",
			theme: "dark-3",
			scrollInertia: 500,
			autoExpandScrollbar: true,
			autoHideScrollbar: false,
			alwaysShowScrollbar: 0,
			mouseWheel:{
			    enable: false,
			},
			advanced: {
				autoExpandHorizontalScroll: false
			},


		});
	},
	renderHead: function(item, index) {
// zhibiaoMax={this.props.zhibiaoMax}
// 				zhibiaoMin={this.props.zhibiaoMin}
// 				maxMinName={this.props.maxMinName}
		return (
			<HeadTd
				key={index}
				item={item}
				index={index}
				dimesion={this.props.dimesion}
				isDashboardTable={this.props.isDashboardTable}
				tableConfig={this.props.tableConfig}
				sortName={this.props.sortName}
				sortParameters={this.props.sortParameters}
				pathname={this.props.pathname}
				row={this.props.row}
				col={this.props.col}
				setSortParams={this.props.setSortParams}
				listRightNoSort={this.props.listRightNoSort}
				statRows={this.state.data.statRows}
				setZhibiaoState={this.props.setZhibiaoState}
				setzhibiaoTop={this.props.setzhibiaoTop}
				topParameters={this.props.topParameters}
				zhibiaoMinMax={this.props.zhibiaoMinMax}
				sortFieldsIndex={this.props.sortFieldsIndex}
				compare={this.props.compare}
			/>
		)
	},
	_renderBody: function(item, index) {
		return (
			<tr key={index}>
				{item.cells.map((value,index)=>this._renderCell(value,index,item))}
			</tr>
		)
	},
	_tdClazz: null,
	_renderCell: function(item, index, rows) {
		var clazz = item.clazz;
		var configtitle = this.props.tableConfig;
		var clazzName;
		var fieldsData = this.state.data.fields;
		if (this.props.tables == true) {
			for (var i = 0; i < configtitle.length; i++) {
				for (var j = 0; j < fieldsData.length; j++) {
					var name;
					if (fieldsData[j].dmType == "dimension") {
						if (!fieldsData[j].groupName) {
							name = fieldsData[j].name
						} else {
							name = fieldsData[j].groupName
						}

					} else {
						name = fieldsData[j].name

					}
					if (i == index) {
						if (configtitle[i].name == name) {
							if (configtitle[i].defaultValue == 0.5) {
								clazzName = 'category_category_shizhong_text';
							} else {
								clazzName = "category_category_kuansong_text";
							}
						}
					}
				}
			}

		} else {
			clazzName = '';
		}

		if (item.colType == 'STAT_TITLE' && index == 0) {
			this._tdClazz = 'TOTAL';
		}
		if (item.colType != 'STAT_TITLE' && index == 0) {
			this._tdClazz = null;
		}
		if (this._tdClazz != null) {
			clazz = clazz + this._tdClazz
		}
		var alignCenter = '';
		if (item.colspan > 1) {
			// XuWenyue: 小计、合计标题不应居中显示
			if ("SOURCE" != item.rowType) {
				clazz = clazz + ' centerClass';
			}
		}
		if (this.props.dimesion) {
			clazz = ''
		}
		var statPanel = null;
		var formattedVal = "";
		var rowTitleArr = this.props.rowTitleFields;
		var columnArr = this.props.columnTitleFields; // 列维度
		if (this.state.data.type === "CROSS") {
			// XuWenyue: Fix the information of dimession DateTree

			if(rowTitleArr && columnArr){
				var newWeidulist = rowTitleArr.concat(columnArr);

				for(var i=0;i<rowTitleArr.length;i++){
					if(rowTitleArr[i].groupType=='GROUP_DATE_TITLE_FIELD'){
						if(i == item.columnNo){
							item["groupType"] = rowTitleArr[item.columnNo].groupType;
							item["level"]     = rowTitleArr[item.columnNo].level;
							item["dataType"]  = 'DATE';
						}
					}

				}
				for(var j=0;j<columnArr.length;j++){
					if(columnArr[j].groupType=='GROUP_DATE_TITLE_FIELD'){
						// indexWei = j;

						if(j == item.rowNo){
							item["groupType"] = columnArr[item.rowNo].groupType;
							item["level"]     = columnArr[item.rowNo].level;
							item["dataType"]  = 'DATE';
						}

					}
				 	//item["dataType"] = undefined
				}
			}
			formattedVal = ReportUtil.getFormattedCrossCellValue(item);
		} else {
			// XuWenyue: Fix the information of dimession DateTree
			if ((this.props.weiduList) && item.columnNo>-1 && (item.columnNo < this.props.weiduList.length)) {
				item["groupType"] = this.props.weiduList[item.columnNo].groupType;
				item["level"]     = this.props.weiduList[item.columnNo].level;
			}
			formattedVal = ReportUtil.getFormattedCellValue(item);
		}
		var content = (
			<span className={clazzName} title={formattedVal}>
				{formattedVal}
			</span>
		);

		if ("TREE_STAT_TITLE" == item.colType) {
			var fields = [];
			var stateFields = this.state.data.fields;
			for (let i = 0; i < stateFields.length; i++) {
				if (stateFields[i].dmType == 'measure' || !stateFields[i].dmType||stateFields[i].expression) {
					fields.push(stateFields[i]);
				}
			}
			var stateList = [];
			for (let i = 1; i < rows.cells.length; i++) {
				stateList.push(rows.cells[i]);
			}
			for (let i = 0; i < stateList.length; i++) {
				stateList[i].fieldName = fields[i].name;
			}
			var tooltipPanelStyle = {
				'position':'fixed',
				'left':this.state.clienX+20,
				'top':this.state.clienY+20,
				'display':this.state.display,
				'zIndex':9999
			};
			content = (
				<div className="statTooltipPanel">
					<div className="tooltipPanel" style={tooltipPanelStyle}>
						<div className="tooltipList">
							<div className="zhibiaoPanel">
								<label>{formattedVal}</label>
							</div>
							{stateList.map(this._getStatRows)}
						</div>
					</div>
					<span className={clazzName} title={formattedVal} onMouseMove={(evt)=>this._mouseMove(evt)} onMouseOut={(evt,key)=>this._mouseOut(evt,key)}>
						{formattedVal}
					</span>
				</div>
			)
		}

		// 表格中显示为URL连接
		if ((item.URL) && ("" != item.URL)) {
			clazz += " toptitle-cursor";
			return (
				<td key={index} className={clazz} colSpan={item.colspan} rowSpan={item.rowspan} onClick={(evt)=>this._urlTDClickHandle(item.URL)}>
					{content}
				</td>
			);
		}
		//钻取
		if(!this.props.listRightNoSort){
			var drilDown = FilterFieldsStore.drillDownAuth(item, this.props.weiduList, this.props.drilDownFilter, this.state.data.type,this.props.isDashboardTable);
			if (drilDown) {
				clazz += " toptitle-cursor";
				return (
					<td key={index} className={clazz} colSpan={item.colspan} rowSpan={item.rowspan} onClick={(evt)=>this._drillDownFilter(item)}>
						{content}
					</td>
				)
			}
		}

		return (
			<td key={index} className={clazz} colSpan={item.colspan} rowSpan={item.rowspan}>
				{content}
			</td>
		)
	},

	_urlTDClickHandle: function(url) {
		window.open(url, '_blank');
	},

	_getStatRows: function(item, index) {
		return (
			<div className="huizongPanel" key={index}>
				<label>{item.fieldName}：</label><b>{item.formatValue}</b>
			</div>
		)
	},
	_handleRequestClose: function() {
		this.setState(function(prevState) {
			prevState.customName.open = false;
			return prevState;
		})
	},
	_openCustomName: function(el, index, item) {
		this.setState(function(prevState) {
			prevState.customName.open = true;
			prevState.customName.anchorEl = el;
			prevState.customName.name = item.customName ? item.customName : item.name;
			prevState.customName.index = index;
			prevState.dataType = item.dataType ? item.dataType : null;
			return prevState;
		})
	},
	_chengeCustomName: function(evt) {
		evt.stopPropagation()
		var name = $(evt.target).val() || '';
		this.setState(function(prevState) {
			prevState.customName.name = name;
			return prevState;
		})
	},
	_closeCustomNamePopover: function() {
		this.setState(function(prevState) {
			prevState.customName.open = false;
			prevState.errorTextField = '';
			return prevState;
		})
	},
	_checkSameName: function(prevState, fields) {
		if (prevState.customName.name == fields[prevState.customName.index].name || prevState.customName.name == fields[prevState.customName.index].customName) {
			fields[prevState.customName.index].customName = prevState.customName.name;
			prevState.customName.open = false;
			prevState.errorTextField = '';


		} else if (prevState.customName.name == '') {
			fields[prevState.customName.index].customName = fields[prevState.customName.index].name;
			prevState.customName.open = false;


		} else {
			for (var i = 0; i < fields.length; i++) {
				if (prevState.customName.name == fields[i].name || prevState.customName.name == fields[i].customName) {
					prevState.errorTextField = '名字已存在';
					prevState.customName.open = true;
					return
				}

			}
			fields[prevState.customName.index].customName = prevState.customName.name;
			prevState.customName.open = false;
			prevState.errorTextField = '';
		}
	},

	_setCustomName: function() {
		var _this = this;
		// if(this.state.dataType == "DOUBLE"){
		// 	this.setState(function(prevState) {
		// 		prevState.customName.open = false

		// 	})
		// }else{
			var weiduList = [];
		var custName = [];
		this.setState(function(prevState) {
		var fields = prevState.data.fields;
		this._checkSameName(prevState, fields)

		for (var i = 0; i < fields.length; i++) {
			var newCustomNameText = {
				customName: '',
				name: ''
			};
			newCustomNameText['customName'] = fields[i].customName;
			newCustomNameText['name'] = fields[i].name;
			if(i==this.state.customName.index){
							newCustomNameText['index'] = this.state.customName.index;

						}
			custName.push(newCustomNameText);

			if (fields[i].dmType == "dimension") {
				var weidu = {
					checked: true,
					customName: "",
					fieldName: "",
					name: "",
					type: 1

				};
				weidu['customName'] = fields[i]['customName'];
				weidu['name'] = fields[i]['name'];
				weidu['fieldName'] = fields[i]['dbName'];
				weiduList.push(weidu)
			}
		}

			if (this.state.data.type == 'TREE') {
				App.emit('APP-HUIZONG-UPDATASTATE', {
					reportType: 'TREE',
					formulas: this.state.formulas,
					weiduList: weiduList
				});
			}
			ReportStore.huizongTableCustomName(custName);
			// console.log(prevState,'prevState')
			return prevState;
		}, function() {
			if(this.props.compare){
				App.emit('APP-REPORT-SET-COMPAREINFO', custName);
			}else{
				App.emit('APP-REPORT-SET-TABLE-FIELDS', _this.state.data.fields);
			}
		})
		// }

	},

	_drillDownFilter: function(item) {
		if(item.dataType=="DATE"){
			this._drillDownDateFilter(item)
		}else{
			this._drillDownTreeFilter(item);
		}


	},
	_drillDownTreeFilter:function(item){
		var wei = this.props.weiduList;
		var columnNo = item.columnNo;
		var dimensionId = wei[columnNo].dimensionId;
		var _this = this;
		App.emit('APP-REPORT-SET-FILTER-LOADING',{row:_this.props.row,col:_this.props.col,loading:true});
		FilterFieldsStore.getTreeFilterFiledsHandle(dimensionId, []).then(function(data) {
			if(FilterFieldsStore[dimensionId]){FilterFieldsStore[dimensionId].clickNext=false;}
			//设置全部数据中对应的level选中
			var levelItem = FilterFieldsStore.drillDownMatchLevel(data, item);
			if(levelItem.level==undefined){
				var value=FilterFieldsStore.getValue(item, false);
				App.emit('APP-REPORT-SET-DRILL-ERROR-FILTER', {
					value:value,
					dimensionId:dimensionId,
					row:_this.props.row,
					col:_this.props.col,
				});
				return;
			}
			//设置数据都是选中
			var selectData = FilterFieldsStore.setTreeSeletedHandle(data, levelItem);
			//转换成后台树形结构参数
			var treeData = FilterFieldsStore.setTreeFilterFields(selectData);
			var updateWeidu = FilterFieldsStore.updateWeidu(wei[columnNo].level, wei, dimensionId, wei[columnNo].groupLevels);
			var filterObj = FilterFieldsStore.treeToOneDimen(treeData);
			var max = FilterFieldsStore.setObjLen(filterObj);
			var drillLevel = max >= updateWeidu[columnNo].groupLevels.length ? max : updateWeidu[columnNo].groupLevels.indexOf(updateWeidu[columnNo].level)
			//转换返回  面包导航数据格式
			var backAndBreadData = FilterFieldsStore.setBackAndBreadData(treeData, updateWeidu, dimensionId, _this.props.drilDownFilter);
			var levelItemArr = FilterFieldsStore.initSetLevelItemArr(filterObj);
			App.emit('APP-REPORT-SET-DRILL-FILTER', {
				drillFilter: treeData,
				dimensionId: dimensionId,
				groupLevels: updateWeidu[columnNo].groupLevels,
				level: updateWeidu[columnNo].level,
				levelItem: levelItemArr.length>0 ? levelItemArr[levelItemArr.length-1] : [],
				levelItemArr: levelItemArr,
				drillDown: true,
				drillLevel: drillLevel,
				weiduList: updateWeidu,
				breadData: backAndBreadData.breadData,
				goBackData: backAndBreadData.goBackData,
				type:null,
				fieldName:updateWeidu[columnNo].fieldName,
				row:_this.props.row,
				col:_this.props.col,
			});

		});
	},
	_drillDownDateFilter:function(item){
		var date=[];
		var weiduList = this.props.weiduList;
		var columnNo=item.columnNo;
		var wei=weiduList[columnNo];
		var levelLen=wei.groupLevels.indexOf(wei.level);
		wei.level=wei.groupLevels[levelLen];
		App.emit('APP-REPORT-SET-FILTER-LOADING',{row:this.props.row,col:this.props.col,loading:true});
		if(levelLen==0){
			date=DrillDownTransformDate.year(item.value);
		}
		if(levelLen==1){
			date=DrillDownTransformDate.quarter(item.value);
		}
		if(levelLen==2){
			date=DrillDownTransformDate.month(item.value);
		}
		if(levelLen==3){
			date=DrillDownTransformDate.week(item.value);
		}

		//var drillLevel=this.dateHasDrillLevel(wei,this.props.drilDownFilter,this.props.rowTitleFields,false);
		var breadData=FilterFieldsStore.setDateBreadData(date[0],wei,levelLen+1);
		var levelItemArr=FilterFieldsStore.setDatelevelItemArr(breadData);
		var updateWeidu = FilterFieldsStore.updateWeidu(wei.level, weiduList, wei.name, wei.groupLevels);
		wei=updateWeidu[columnNo];
		App.emit('APP-REPORT-SET-DRILL-DATE-FILTER', {
				drillFilter: date,
				dimensionId: wei.name,
				groupLevels: wei.groupLevels,
				level: wei.level,
				levelItem: [],
				levelItemArr: levelItemArr,
				drillDown: true,
				drillLevel: levelLen+1,
				weiduList: weiduList,
				breadData: breadData,
				type:'GROUP_DATE_TITLE_FIELD',
				fieldName:wei.fieldName,
				row:this.props.row,
				col:this.props.col,
				weiduList: updateWeidu,
				//goBackData: backAndBreadData.goBackData,
			});
	},
	_mouseMove:function(evt){
		this.setState({
			clienX:evt.clientX,
			clienY:evt.clientY,
			display:'block'
		})
	},
	_mouseOut:function(evt){
		this.setState({
			display:'none',
		})
	}

})
