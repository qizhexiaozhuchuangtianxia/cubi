'use strict';
var React = require('react');
var App = require('app');
var $ = require('jquery');
var moment = require('moment');
var classnames = require('classnames');
var ReportFilterPopComponent = require('./ReportFilterPopComponent');
var ReportDateFilterPopComponent = require('./ReportDateFilterPopComponent');
var ReportDateRange = require('../../common/ReportDateRange');
module.exports = React.createClass({
	displayName: '报表筛选列表的组件--点击中间按钮显示',
	getInitialState: function() {
		return {
			item: '',
			showPOP: false,
			filterData:this.props.datas
		}
	},
	componentWillMount: function() {},
	componentDidMount: function() {
		this._parentCompentSliderListHnadle();
		this._scrollBrar();
	},
    componentWillReceiveProps: function(nextProps) {
       this.setState({
            filterData:nextProps.datas
       })
    },
	componentDidUpdate: function() {
		this._scrollBrar();
	},
	render: function() {
		return (
				<div className="selectBox-hiddenBox">
					<div className="selectScrollBox">
						{this.state.filterData.map(this._colDomHandle)}
					</div>
					<ReportFilterPopComponent reportId={this.props.reportId} metadataId={this.props.metadataId}/>
					<ReportDateFilterPopComponent metadataId={this.props.metadataId}/>
				</div>
			);
	},
	_parentCompentSliderListHnadle:function(){//组件加载完成之后或者更新之后刷新父组件左右滚动效果方法
		App.emit('APP-REPORT-SLIDER-LIST-HANDLE');
	},
	_scrollBrar: function() {
		$(".filterPopListScroll").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
	},
	_popDomHandle: function(index,dataType,evt) { //弹出层效果]
		evt.stopPropagation();
		if(dataType == 'DATE'){
			if ($('.dateTckClassNameShowBox').length == 0 && $('.tckSelectShowBox').length == 0) {
				if (!$('.dateTckClassName').hasClass('dateTckClassNameShowBox')) {
					//修改时间日期筛选的组件方法在ReportDateFilterPopComponent组件里面
					if(this.state.filterData[index].nameInfoDesc){
						App.emit('APP-REPORT-MODIFY-DATE-COMPONENT-POP-HANDLE',{
							evtTarget: $(evt.target).parents('.listBox'),
							itemIndex: index,
							valueType:this.state.filterData[index].valueType,
							startDate:this.state.filterData[index].nameInfoDesc[0],
							endDate:this.state.filterData[index].nameInfoDesc[1],
						});
					}else{
						App.emit('APP-REPORT-MODIFY-DATE-COMPONENT-POP-HANDLE',{
							evtTarget: $(evt.target).parents('.listBox'),
							itemIndex: index,
						});
					}
				}
			}
		}else{
			if ($('.tckSelectShowBox').length == 0 && $('.dateTckClassNameShowBox').length == 0) {
				if (!$('.tckSelectBox').hasClass('tckSelectShowBox')) {
					App.emit('APP-REPORT-FILTER-CURRENT-POP', {
						items: this.state.filterData[index].popData,
						evtTarget: $(evt.target).parents('.listBox'),
						itemIndex: index,
						FieldName: this.state.filterData[index].FieldName,
						dataType:dataType
					});
				}
			}
		}
	},
	_currentOpen: function(index, evt) { //当前的筛选条件是否选中
		evt.stopPropagation();
		if(this.state.filterData[index].nameInfoDesc.length>0){
			App.emit('APP-REPORT-FILTER-CURRENT-OPEN', {
				items: !this.state.filterData[index].NameInfoOpen,
				itemIndex: index
			});
		}else{
			
		}
	},
	_nameInfoDesc: function(item, index) {
		return <span key={index}>{item+" "}</span>;
	},
	_dateFilterDesc:function(item,index){
		var range,startTime,endTime;
		if(item.valueType){
			if(item.valueType == 'CUSTOM'){
				if(item.nameInfoDesc[0] == null && item.nameInfoDesc[1] == null){
					startTime = '';
					endTime = '';
				}
				if(item.nameInfoDesc[0] != null && item.nameInfoDesc[1] == null){
					startTime = '从'+ moment(item.nameInfoDesc[0]).format('YYYY年MM月DD日');
					endTime = '开始';
				}
				if(item.nameInfoDesc[0] == null && item.nameInfoDesc[1] != null){
					startTime = '到' + moment(item.nameInfoDesc[1]).format('YYYY年MM月DD日');
					endTime = '结束';
				}
				if(item.nameInfoDesc[0] != null && item.nameInfoDesc[1] != null){
					startTime = '从'+ moment(item.nameInfoDesc[0]).format('YYYY年MM月DD日');
					endTime = '到' + moment(item.nameInfoDesc[1]).format('YYYY年MM月DD日');
				}
			}else{
				range = ReportDateRange.getDateRangeByType(item.valueType);
				startTime = '从'+ moment(range.start).format('YYYY年MM月DD日');
				endTime = '到' + moment(range.end).format('YYYY年MM月DD日');
			}
			return 	<div>
						<p><span>{startTime}</span></p>
						<p><span>{endTime}</span></p>
					</div>
		}else{
			
		}
	},
	_rowDomHandle: function(item, index) { //渲染行
		var downClassName = classnames('listBox', {
			'listBoxDown': index % 2 !== 0
		});
		var openClassName = classnames('floatDivBox', {
			'floatDivBoxOpen': item.NameInfoOpen
		});
		if(item.dataType == 'DATE'){
			return <div key={index} className={downClassName}>
						<div className={openClassName} onClick={(e)=>this._popDomHandle(item.index,item.dataType,e)}>
							<div className="listBox-top">
								<h3>{item.nameInfoName}</h3>
								<div className="filterPopList">
									<div className="filterPopListScroll">
										<div className="filterPopListScrollBox">
											{this._dateFilterDesc(item)}
										</div>
									</div>
								</div>
								
							</div>
							<div className="listBox-down">
								<span>{item.NameInfoType}</span><a href="javascript:;" onClick={(e)=>this._currentOpen(item.index,e)} className="shaixuan iconfont icon-icshaixuan24px"></a>
							</div>
						</div>
					</div>
		}else{
			return <div key={index} className={downClassName}>
						<div className={openClassName} onClick={(e)=>this._popDomHandle(item.index,item.dataType,e)}>
							<div className="listBox-top">
								<h3>{item.nameInfoName}</h3>
								<div className="filterPopList">
									<div className="filterPopListScroll">
										<div className="filterPopListScrollBox">
											<p>{item.nameInfoDesc.map(this._nameInfoDesc)}</p>
										</div>
									</div>
								</div>
								
							</div>
							<div className="listBox-down">
								<span>{item.NameInfoType}</span><a href="javascript:;" onClick={(e)=>this._currentOpen(item.index,e)} className="shaixuan iconfont icon-icshaixuan24px"></a>
							</div>
						</div>
					</div>
		}
	},
	_colDomHandle: function(item, index) { //渲染列
		var data = [];
		var n = 2 * index;
		var len = (n + 2) <= this.state.filterData.length ? (n + 2) : this.state.filterData.length;
		for (var i = n; i < len; i++) {
			data.push(this.state.filterData[i]);
		}
		if (n < len) {
			return (
				<div key={index} className="selectBoxListBox">
					{data.map(this._rowDomHandle)}
				</div>
			);
		}
	},
});