var $ = require('jquery');
var React = require('react');
var App = require('app');
var moment = require('moment');
var Loading = require('../../common/Loading');
var WeiduDialog = require('./WeiduDialog');
var FilterPopoverType = require('./FilterPopoverType');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');
var CheckEntryTextComponent = require('../../common/CheckEntryTextComponent');
var PublicTextField = require('../../common/PublicTextField');

var {
	LeftNav,
	MenuItem,
	Popover,
	DatePicker

} = require('material-ui');
var areIntlLocalesSupported = require('intl-locales-supported');
if (!global.Intl || !areIntlLocalesSupported('zh-cn')) {
	global.Intl = require('intl');
	require('../../common/IntlLocaleData');
}

function dateFormater(date) {
	return moment(date).format('YYYY年MM月DD日');
}
var datePickerButtonWords = {
	ok: '确定',
	cancel: '取消'
};

module.exports = React.createClass({
	displayName: '驾驶舱全局筛选右侧弹框内容',
	getInitialState: function() {
		return {
			filterType: this.props.filterType,
			Weidutitle: '选择',
			titleType: this.props.item.tit,
			open: false,
			item: this.props.item,
			openPopover: false,
			anchorEl: null,
			id: null,
			errorTextState: '',
			dimensionId: null,
			metadataId: this.props.item.metadataId,
			startValue: this.props.startValue,
			endValue: this.props.endValue,
			minValue: this.props.minValue,
			maxValue:  this.props.maxValue,
			disabledDate: true,
			stack: [{
				id: null,
				body: 'DialogFilterList',
				titleHeader: '我的立方'
			}],
			body: 'DialogFilterList',
			dimensionDateid: null,
			val:this.props.data.report.filterName,
			filterAliasName:this.props.data.report.filterAliasName


		}
	},
	componentWillMount: function() {
		this._initStateItem();

	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	app: {},
	__tempThisVal: '',
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			Weidutitle: nextProps.Weidutitle,
			filterType: nextProps.filterType,
			open: nextProps.open,
			openPopover: nextProps.openPopover,
			item: nextProps.item,
			dimensionId: nextProps.dimensionId,
			metadataId: nextProps.metadataId,
			id: nextProps.id,
			minValue: this.props.minValue,
			maxValue:  this.props.maxValue,
			startValue: nextProps.startValue,
			endValue: nextProps.endValue,
			disabledDate: nextProps.disabledDate,
			val:nextProps.data.report.filterName,
			filterAliasName:nextProps.data.report.filterAliasName

		})
		this._initStateItem();
	},
	componentDidMount: function() {
		this.app['APP-FILTER-DATE-UPDATA'] = App.on('APP-FILTER-DATE-UPDATA', this._changeDateMinMax);
		this.app['APP-WEIDU-FILTER-VALUE'] = App.on('APP-WEIDU-FILTER-VALUE', this._updataValue);
		this.app['APP-WEIDU-CLOSE-DIALOG'] = App.on('APP-WEIDU-CLOSE-DIALOG', this._requestClose);
		this.app['APP-GET-FILTER-TYPE'] = App.on('APP-GET-FILTER-TYPE', this._updataFilterType);
		this.app['APP-WEIDU-FILTER-TYPE-VALUE'] = App.on('APP-WEIDU-FILTER-TYPE-VALUE', this._updataValueType);
		this._initStateItem();
	},
	render: function() {
		
		return (
			<div className="rightContentShow">
							<div className="right-bar-title">
									<div className="title">常规</div>
									<div className="right-test">
										<PublicTextField
												floatingLabelText="筛选器名称"
												defaultValue={this.state.filterAliasName}
												errorText={this.state.errorTextState}
												onChange={(evt)=>this._textFieldChange(evt)}/>
									</div>
							 </div>
							 <div className="line"></div>
							<div className="rightContentShow-bar-thr">
								 <h2 className="topTitle">筛选器设定</h2>
								 <div className="filterType">
								 		<span className="filterLeft">筛选器类型</span>
										<span className="filterRight" onClick={(evt)=>this._searchTypeFun(evt)}>{this.state.titleType}</span>
								 </div>
								 {this._renderWeiduNode()}
								 {this._serachTime()}
								 <WeiduDialog filterAliasName={this.state.filterAliasName} Weidutitle={this.state.Weidutitle} stack={this.state.stack} body={this.state.body} id={this.state.id}
								 data={this.props.data} item={this.state.item}  row={this.props.row}
	             	col={this.props.col} dimensionId={this.state.dimensionId} 	filterType={this.state.filterType}
	             	open={this.state.open} filterName={this.state.val}/>
							</div>
							<FilterPopoverType filterAliasName={this.state.filterAliasName}  data={this.props.data} item={this.state.item}  row={this.props.row}
						 col={this.props.col} filterType={this.state.filterType}  anchorEl={this.state.anchorEl}
						 openPopover={this.state.openPopover} filterName={this.state.val}/>
					</div>
		)

	},
	_renderFilterTypeNode: function(){
		return <div className="filterType">
					<span className="filterLeft">筛选器类型</span>
					<span className="filterRight" onClick={(evt)=>this._searchTypeFun(evt)}>{this.state.titleType}</span>
				</div>
	},
	_renderWeiduNode: function(){
		if(this.state.filterType === 'DATE_FILTER'){return null;}
		return <div className="searchWeidu">
					<span className="filterLeft">筛选维度</span>
					<span className="filterRight" onClick={(evt)=>this._searchWeiduFun(evt)}>{this.state.Weidutitle}</span>
				</div>
	},
	_textFieldChange: function(evt) {
		var thisVal = $(evt.target).val();
		thisVal = thisVal.trim();
		var filterAliasName=false;
		if (thisVal !== undefined && thisVal !== null && thisVal !== "") {

			if (CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)) {
				this.setState({
					errorTextState: '当前输入的名字格式错误'
				})
			} else if (CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16) {
				this.setState({
					errorTextState: CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) + ' / 16'
				})
			} else {

				this.setState({
					errorTextState: '',
					filterAliasName:thisVal
				});

				App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE',{
					isName:true,
					filterName:this.props.data.report.filterName,
					filterAliasName:thisVal,
					row: this.props.row,
					col: this.props.col,
					sign:this.props.data.report.sign,
				});

			}
		}else{
			this.setState({
				errorTextState: '',
				filterAliasName:thisVal

			});
			App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE',{
				isName:true,
				filterName:this.props.data.report.filterName,
				filterAliasName:thisVal,
				row: this.props.row,
				col: this.props.col,
				sign:this.props.data.report.sign,
			});

		}

	},
	_updataValueType: function(arg) {
		if (!this.isMounted()) return;
		this.setState({
			titleType: arg.name,
			filterType: arg.filterType,
			item: {},
			Weidutitle: arg.Weidutitle,
			startValue: '',
			endValue: '',
			filterAliasName:arg.filterAliasName,
			filterName:arg.filterName,
			disabledDate: arg.disabledDate
		})
	},
	_updataValue: function(arg) {
		if (!this.isMounted()) return;
		this.setState({
				Weidutitle: arg.item.name,
				item: arg.item,
				startValue: '',
				endValue: '',
				disabledDate: arg.disabledDate
			})
			// if(!arg.filterType){
			// 		this.setState({
			// 			Weidutitle:arg.item.name,
			// 			id:null,
			// 			item:null,
			// 			startValue:'',
			// 			endValue:'',
			// 			disabledDate:arg.disabledDate,
			// 			stack:[{
			// 				id:null,
			// 				body:'DialogFilterList',
			// 				titleHeader: '我的立方'
			// 			}],
			// 			body:'DialogFilterList',

		// 	});
		// }else{
		// 	this.setState({
		// 		filterType:arg.filterType,
		// 		titleType:arg.filterTypeName,
		// 		Weidutitle:'选择',
		// 		startValue:'',
		// 		endValue:'',
		// 		id:null,
		// 		item:null,
		// 		dimensionId:null,
		// 	  body:'DialogFilterList',
		// 		stack:[{
		//        id:null,
		//        body:'DialogFilterList',
		//        titleHeader: '我的立方'
		//      }],
		// });
		//}

	},
	_initStateItem: function() {
		if (!this.isMounted()) return;
		var name;
		if (this.state.item.name == '') {
			name = '选择'
		} else {
			name = this.state.item.name
		}
		this.setState({
			Weidutitle: name,
			dimensionId: this.state.item.dimensionId
		});

	},
	_updataFilterType: function(item) {
		if (!this.isMounted()) return;
		this.setState({
			openPopover: false,
			titleType: item.type.primaryText
		})
	},
	_searchTypeFun: function(evt) {
		if (!this.isMounted()) return;
		evt.preventDefault();
		this.setState({
			openPopover: true,
			anchorEl: evt.currentTarget
		});
	},
	_requestClose: function() {
		if (!this.isMounted()) return;
		this.setState({
			open: false,
			openPopover: false
		});

	},
	_searchWeiduFun: function() {
		if (!this.isMounted()) return;
		this.setState({
			stack: [{
				id: null,
				body: 'DialogFilterList',
				titleHeader: '我的立方'
			}],
			open: true
		})
	},

	_handleError: function(data) {
		//console.log(data)
	},
	_changeDateMinMax: function(arg) {
		if (!this.isMounted()) return;
		var _this = this;
		GlobalFilterStore.getFieldMaxMinData(arg.metadataId, arg.fieldName).then(function(data) {
			if (data.success) {
				_this.setState({
					startValue: GlobalFilterStore._dateFormaterChina(data.dataObject.min),
					endValue: GlobalFilterStore._dateFormaterChina(data.dataObject.max),
					minValue: GlobalFilterStore._dateFormaterChina(data.dataObject.min),
					maxValue: GlobalFilterStore._dateFormaterChina(data.dataObject.max),
					metadataId: arg.metadataId,
					dimensionDateid: arg.dimensionId,
					disabledDate: arg.disabledDate,
					item: arg.item,
					Weidutitle: arg.item.name,
					filterName:arg.filterName,
					filterAliasName:arg.filterAliasName,
				});

				App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE', {
					filterType: _this.state.filterType,
					//dimensionId: arg.dimensionId,
					//metadataId: arg.metadataId,
					col: _this.props.col,
					row: _this.props.row,
					item: arg.item,
					sign: _this.props.data.report.sign,
					minValue: moment(data.dataObject.min).format('YYYY年MM月DD日'),
					maxValue: moment(data.dataObject.max).format('YYYY年MM月DD日'),
					startValue: moment(data.dataObject.min).format('YYYY年MM月DD日'),
					endValue: moment(data.dataObject.max).format('YYYY年MM月DD日'),
					filterName: _this.state.val,
					filterAliasName:arg.filterAliasName,
				});
			}
		}).catch(this._handleError);
	},
	_serachTime: function() {
		if (this.state.filterType == 'DATE_FILTER' && this.state.disabledDate) {
			var startValue, endValue, startVal, endVal
			if (!this.state.minValue) {
				startVal = "选择";
			} else {
				startVal = this.state.minValue;
				startValue = this._formatDete(this.state.minValue, true);
			}
			if (!this.state.endValue) {
				endVal = "选择";
			} else {
				endVal = this.state.maxValue;
				endValue = this._formatDete(this.state.maxValue, true)

			}
			var startTime = (
				<div className="datePrevpicker">
							<DatePicker
										wordings={datePickerButtonWords}
										firstDayOfWeek={1}
										value={startValue}
										onChange={this._changeStartValues}
										DateTimeFormat={Intl.DateTimeFormat}
										formatDate={dateFormater}
										locale='zh-cn'
							/>
						</div>
			)
			var endTime = (
				<div className="dateNextpicker">
							<DatePicker
										wordings={datePickerButtonWords}
										firstDayOfWeek={1}
										value={endValue}
										onChange={this._changeEndValues}
										DateTimeFormat={Intl.DateTimeFormat}
										formatDate={dateFormater}
										locale='zh-cn'
							/>
						</div>
			)
			return <div className="timeFilter">
					<div className="startTime"><span className="filterLeft">最小时间</span><span onClick={(evt)=>this._startTime(evt)} className="filterRight">{startVal}</span>{startTime}</div>
					<div className="endTime"><span className="filterLeft">最大时间</span><span onClick={(evt)=>this._endTime(evt)} className="filterRight">{endVal}</span>{endTime}</div>
				</div>
		}
		return null;
	},
	_changeStartValues: function(_, date) {
		var _this = this;
		var value = moment(date).format('YYYY年MM月DD日');
		if (this._formatDete(value) < this._formatDete(this.state.endValue)) {
			this.setState({
				minValue: value
			});
			App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE', {
				filterType: this.state.filterType,
				dimensionId: this.state.dimensionDateid,
				metadataId: this.state.metadataId,
				col: this.props.col,
				row: this.props.row,
				item: this.state.item,
				minValue: value,
				maxValue: this.state.maxValue,
				startValue: value,
				endValue: this.state.endValue,
				sign: this.props.data.report.sign,
				filterName: _this.state.val,
				filterAliasName:this.state.filterAliasName,
			});
		}
	},
	_formatDete: function(date, type) {
		let time = date.replace(/[^0-9]/mg, '/');
		var newTime = new Date(time);
		if (type) {
			return newTime;
		}
		return newTime.getTime();
	},
	_changeEndValues: function(_, date) {
		var _this = this;
		var value = moment(date).format('YYYY年MM月DD日');
		if (this._formatDete(value) > this._formatDete(this.state.startValue)) {
			this.setState({
				maxValue: value
			});
			App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE', {
				filterType: this.state.filterType,
				dimensionId: this.state.dimensionDateid,
				metadataId: this.state.metadataId,
				col: this.props.col,
				row: this.props.row,
				item: this.state.item,
				minValue: this.state.minValue,
				maxValue: value,
				startValue: this.state.startValue,
				endValue: value,
				sign: this.props.data.report.sign,
				filterName: _this.state.val,
				filterAliasName:this.state.filterAliasName,

			});
		}
	},

})
