/**
 * 报表日期范围选择器
 *
 * by yankai
 */
var App = require('app');
var React = require('react');
var PublicButton = require('../common/PublicButton');
var {
	Menu,
	MenuItem,
	Popover,
	DatePicker
} = require('material-ui');

var moment = require('moment');

var ReportDateRange = require('./ReportDateRange');

var areIntlLocalesSupported = require('intl-locales-supported');

if (!global.Intl || !areIntlLocalesSupported('zh-cn')) {

	global.Intl = require('intl');
	require('./IntlLocaleData');
}

function dateFormater(date) {
	return moment(date).format('YYYY年MM月DD日');
}

const datePickerButtonWords = {
	ok: '确定',
	cancel: '取消'
};

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

module.exports = React.createClass({

	displayName: 'ReportDateRangeSelector',

	propTypes: {
		dateRangeType: React.PropTypes.string, //初始化日期区间的范围类型
		startDate: React.PropTypes.string,
		endDate: React.PropTypes.string,
		onOK: React.PropTypes.func, //确定的事件回调
		onCancel: React.PropTypes.func, //取消的事件回调
	},

	getDefaultProps: function() {
		return {
			dateRangeType: ReportDateRange.customDateRange.value,
			startDate: null,
			endDate: null,
			onOK: (dateRange) => {},
			onCancel: () => {},
		}
	},

	getInitialState: function() {

		var rangeType = this.props.dateRangeType;

		var dateRange = ReportDateRange.getDateRangeByType(rangeType);
		var startDate, endDate;
		if (this.props.startDate)
			startDate = new Date(this.props.startDate);

		if (this.props.endDate)
			endDate = new Date(this.props.endDate);

		if (rangeType != ReportDateRange.customDateRange.value ) {
			startDate = new Date(dateRange.start);
			endDate = new Date(dateRange.end);
		}
		return {
			showMenu: false,
			dateRangeType: dateRange.value,
			dateRangeName: dateRange.label,
			startDate: startDate,
			endDate: endDate,
			disabled:true,
			reportInfo:null
		}

	},

	componentWillReceiveProps: function(nextProps) {

		var startDate, endDate;

		if (nextProps.startDate)
			startDate = new Date(nextProps.startDate);

		if (nextProps.endDate)
			endDate = new Date(nextProps.endDate);


		if (nextProps.dateRangeType == this.state.dateRangeType && startDate == this.state.startDate && endDate == this.state.endDate) {
			return;
		}

		var rangeType = nextProps.dateRangeType;

		var dateRange = ReportDateRange.getDateRangeByType(rangeType);

		if (rangeType != ReportDateRange.customDateRange.value) {
			startDate = new Date(dateRange.start);
			endDate = new Date(dateRange.end);
		}

		this.setState({
			dateRangeType: dateRange.value,
			dateRangeName: dateRange.label,
			startDate: startDate,
			endDate: endDate,
			disabled:false,
			reportInfo: nextProps.reportInfo
		});
	},

	componentDidMount: function() {

	},

	render: function() {
		return (
			<div className="ReportDateRangeSelector">
				<table>
					<colgroup align="left" width="80" ></colgroup>
					<tbody>
						<tr>
							<td>时间周期</td>
							<td>
								<div className="date-range" onClick={this._showdateRangeView}>
									<span>{this.state.dateRangeName}</span>
									<i className="iconfont icon-icarrowdropdown24px"></i>
									{this._renderDateRangeView()}
								</div>
							</td>
						</tr>
						<tr>
							<td>开始时间</td>
							<td>
								<DatePicker
									hintText="请选择开始时间"
									textFieldStyle={styles.datePickerInputStyle}
									wordings={datePickerButtonWords}
									firstDayOfWeek={1}
									value={this.state.startDate}
									onChange={this._changeStartDate}
									DateTimeFormat={Intl.DateTimeFormat}
									formatDate={dateFormater}
									locale="zh-cn"/>
							</td>
						</tr>
						<tr>
							<td>结束时间</td>
							<td>
								<DatePicker hintText="请选择结束时间"  textFieldStyle={styles.datePickerInputStyle}
									wordings={datePickerButtonWords} firstDayOfWeek={1} value={this.state.endDate}
									onChange={this._changeEndDate}  DateTimeFormat={Intl.DateTimeFormat} formatDate={dateFormater}
									locale="zh-cn"/>
							</td>
						</tr>
					</tbody>
				</table>
				<div className="dateButtons">
								<PublicButton
									style={{color:"rgba(254,255,255,0.87)"}}
									labelText="取消"
									rippleColor="rgba(255,255,255,0.25)"
									hoverColor="rgba(255,255,255,0.15)"
									onClick={(evt)=>this._cancel(evt)}/>,

								<PublicButton
									style={{color:"rgba(0,229,255,255)"}}
									labelText="保存"
									rippleColor="rgba(0,229,255,0.25)"
									hoverColor="rgba(0,229,255,0.15)"
									disabled={this.state.disabled}
									secondary={true}
									onClick={ this._save }/>
				</div>
			</div>
		)
	},

	_save: function() {

		var result = {
			type : this.state.dateRangeType//=="CUSTOM" ? "DATE_RANGE" : this.state.dateRangeType
		};

		if (this.state.dateRangeType == ReportDateRange.customDateRange.value) {
			if (this.state.startDate == null && this.state.endDate == null) {
				result.startDate = null;
				result.endDate = null;
			}
			if(this.state.startDate == null && this.state.endDate != null){
				var endDate = moment(this.state.endDate).startOf('day');
				result.startDate = null;
				result.endDate = endDate.format('YYYY-MM-DD');
			}
			if(this.state.startDate != null && this.state.endDate == null){
				var startDate = moment(this.state.startDate).startOf('day');
				result.startDate = startDate.format('YYYY-MM-DD');
				result.endDate = null;
			}
			if (this.state.startDate != null && this.state.endDate != null) {
				var startDate = moment(this.state.startDate).startOf('day');
				var endDate = moment(this.state.endDate).startOf('day');
				result.startDate = startDate.format('YYYY-MM-DD');
				result.endDate = endDate.format('YYYY-MM-DD');

				if (startDate.toDate() > endDate.toDate()) {
					App.emit('APP-MESSAGE-OPEN', {
						content: '开始时间不能大于结束时间'
					});
					return;
				}
			}
		}
		else {
			result.startDate = moment(this.state.startDate).format("YYYY-MM-DD");
			result.endDate   = moment(this.state.endDate).format("YYYY-MM-DD");
		}

		var dayLimitCheckedMessage = this._checkLimitDay(result);
		if (null != dayLimitCheckedMessage) {
			App.emit('APP-MESSAGE-OPEN', {
				content: dayLimitCheckedMessage
			});
			return;
		}

		var checkedMessage = this._checkDateWithAreaInfo(result);
		if (null != checkedMessage) {
			App.emit('APP-MESSAGE-OPEN', {
				content: checkedMessage
			});
			return;
		}
		this.props.onOK(result);
	},

	_checkDateWithAreaInfo: function(result) {

		if (null == this.props.reportInfo) {
			return null;
		}
		var filterFields = this.props.reportInfo.filterFields;
		var length       = filterFields.length;
		if (1 > length) {
			return null;
		}

		var filterField = null;
		for (var counter = 0; counter < length; counter++) {
			if (this.props.dbField == filterFields[counter].dbField) {
				filterField = filterFields[counter];
				break;
			}
		}
		if (null == filterField) {
			return null;
		}

		var startDate     = null;
		var endDate       = null;
		var areaStartDate = null;
		var areaEndDate   = null;

		// 获取AraeInfo中配置的日期筛选范围
		if ((ReportDateRange.customDateRange.value == filterField.valueType) ||
		    ("DATE_RANGE"                          == filterField.valueType)) {
			if ((0 < filterField.value.length) && (null != filterField.value[0])) {
				areaStartDate = moment(filterField.value[0]);
			}
			if ((1 < filterField.value.length) && (null != filterField.value[1])) {
				areaEndDate = moment(filterField.value[1]);
			}
		}
		else {
			if ((1 > filterField.value.length) || (null == filterField.value[0])) {
				return null;
			}
			var range     = ReportDateRange.getDateRangeByType(filterField.value[0]);
			areaStartDate = moment(range.start);
			areaEndDate   = moment(range.end);
		}

		// 获取驾驶舱中的日期筛选范围
		if (ReportDateRange.customDateRange.value == result.type) {
			if (null != result.startDate) {
				startDate = moment(result.startDate);
			}
			if (null != result.endDate) {
				endDate   = moment(result.endDate);
			}
		}
		else {
			var range = ReportDateRange.getDateRangeByType(result.type);
			startDate = moment(range.start);
			endDate   = moment(range.end);
		}

		var message = '筛选日期超出范围，范围：';

		if(areaStartDate != null && areaEndDate == null){
			message += '从 ' + moment(areaStartDate).format('YYYY年MM月DD日') + ' 开始';
		}
		if(areaStartDate == null && areaEndDate != null){
			message += '到 ' + moment(areaEndDate).format('YYYY年MM月DD日') + ' 结束';
		}
		if(areaStartDate != null && areaEndDate != null){
			message += '从 ' + moment(areaStartDate).format('YYYY年MM月DD日') + ' 到 ' + moment(areaEndDate).format('YYYY年MM月DD日');
		}

		if (null != areaStartDate) {
			if (null == startDate) {
				return message;
			}
			if (startDate < areaStartDate) {
				return message;
			}
		}
		if (null != areaEndDate) {
			if (null == endDate) {
				return message;
			}
			if (areaEndDate < endDate) {
				return message;
			}
		}

		return null;

	},

	_checkLimitDay: function(result) {

		if ((null == this.props.itemObj) ||
		    (null == this.props.itemObj.dateSize)) {
			// 异常判断、防空
			return null;
		}

		var dateSize = this.props.itemObj.dateSize;
		if (0 > dateSize) {
			// 未设定日期筛选时长
			return null;
		}

		if ((null == result.startDate) || (null == result.endDate)) {
			return null;
		}

		var startDate = new Date(result.startDate.replace(/-/g, "/"));
		var endDate   = new Date(result.endDate.replace(/-/g, "/"));

		// "1 + ": 包含筛选开始日期当天
		var days = 1 + parseInt(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));

		if (days > dateSize) {
			dateSize += 1;
			return '您只能查看少于' + dateSize + '天的数据';
		}

		return null;
	},

	_cancel: function(evt) {
		this.setState({
			startDate: null,
			endDate: null,
			dateRangeType: ReportDateRange.customDateRange.value,
			dateRangeName: ReportDateRange.customDateRange.label,
		});
		this.props.onCancel(evt);
	},

	_changeStartDate: function(_, date) {
		this.setState({
			startDate: date,
			dateRangeType: ReportDateRange.customDateRange.value,
			dateRangeName: ReportDateRange.customDateRange.label,
			disabled:false
		})
	},

	_changeEndDate: function(_, date) {
		this.setState({
			endDate: date,
			dateRangeType: ReportDateRange.customDateRange.value,
			dateRangeName: ReportDateRange.customDateRange.label,
			disabled:false
		})
	},

	_showdateRangeView: function(e){
		this.setState({
			showMenu: true,
			menuAnchorEl: e.currentTarget,
		})
	},

	_closeMenuHandler: function() {
		this.setState({
			showMenu: false,
		});
	},

	_renderDateRangeView: function() {
		var clickHandler = this._menuItemClickHandler;

		function renderSubMemuItem(dataItem) {
			//console.log(dataItem.label, dataItem.start.format('YYYY-MM-DD'), '-', dataItem.end.format('YYYY-MM-DD'))

			return <MenuItem
						key={dataItem.value}
						value={dataItem.value}
						primaryText={dataItem.label}
						onTouchTap={()=>{clickHandler(dataItem)}}/>
		}

		function renderMemuItem(dataItem) {
			var subItems = null;
			var rightIcon = null;
			if (dataItem.children && dataItem.children.length > 0) {
				subItems = dataItem.children.map(renderSubMemuItem);
				rightIcon = <ArrowDropRight />;
			}
			return <MenuItem key={dataItem.value} value={dataItem.value} primaryText={dataItem.label} menuItems={subItems} rightIcon={rightIcon}  onTouchTap={()=>{clickHandler(dataItem)}}></MenuItem>
		}

		var items = ReportDateRange.dateRangeList.map(renderMemuItem);

		return (
			<Popover
	          open={this.state.showMenu}
	          anchorEl={this.state.menuAnchorEl}
	          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
	          targetOrigin={{horizontal: 'left', vertical: 'top'}}
	          onRequestClose={this._closeMenuHandler}>
	          	<Menu>
					{items}
				</Menu>
	        </Popover>
		)
	},

	_menuItemClickHandler: function(dataItem) {
		if (dataItem.isNav) return;
		var start, end;
		if (dataItem.value != ReportDateRange.customDateRange.value) {
			start = new Date(dataItem.start);
			end = new Date(dataItem.end);
			this.setState(function(state){
				state.showMenu = false;
				state.startDate = start;
				state.endDate = end;
				state.dateRangeType = dataItem.value;
				state.dateRangeName = dataItem.label;
				state.disabled = false;
				return {state};
			})
		}else{
			this.setState(function(state){
				state.showMenu = false;
				state.startDate = start;
				state.endDate = end;
				state.dateRangeType = dataItem.value;
				state.dateRangeName = dataItem.label;
				state.disabled = true;
				return {state};
			})
		}
		/*this.setState(function(state){
			state.showMenu = false;
			state.startDate = start;
			state.endDate = end;
			state.dateRangeType = dataItem.value;
			state.dateRangeName = dataItem.label;
			return {state};
		})*/
		/*this.setState({
			showMenu: false,
			startDate: start,
			endDate: end,
			dateRangeType: dataItem.value,
			dateRangeName: dataItem.label,
			disabled:true
		});*/
	}
});


var styles = {

	datePickerInputStyle: {
		width: '100%',
		fontSize: '14px',
	}
}
