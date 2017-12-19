'use strict';
var React = require('react');
var App = require('app');
var $ = require('jquery');
var ReportStore = require('../../../stores/ReportStore');
var {
	Checkbox,
} = require('material-ui');
module.exports = React.createClass({
	app: {},
	displayName: '非日期筛选值显示的弹出层组件',
	getInitialState: function() {
		return {
			propData:[],
			inputValueState: '搜索维度值',
			metadataIdState:'',
			checkedData:[]
		}
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentWillMount: function() {},
	componentDidMount: function() {
		var _this = this;
		this.app['APP-REPORT-FILTER-CURRENT-POP'] = App.on('APP-REPORT-FILTER-CURRENT-POP',this._openCurrentPopHandle);
		this._scrollBrar();
		this._getAreaInfoHandle();
	},
	componentDidUpdate: function() {
		this._scrollBrar();
		this._clickBgBoxHandle();
	},
	render: function() {
		if (this.state.propData.length > 0) {
			return <div className="tckSelectBox" ref='tckSelectBox'>
						<div className="tckSelectBoxTop" ref='tckSelectTopBox'>
							<div className="searchBox filterPopSearchBox">
		                        <div className="searchInputBox">
		                            <i className="iconfont icon-icsousuo24px"></i>
		                            <input 
		                            	type="text"
		                            	onKeyUp={(evt)=>this._onKeyUpHandle(evt)} 
		                            	name="search"
		                            	ref='serchRefs'
		                            	placeholder={this.state.inputValueState}/>
		                        </div>
		                    </div>
							<div className="retractsBox">
								<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._closePopHandle(evt)}></span>
							</div>
						</div>
						<div className="tckSelectBoxDown" ref='tckSelectDownBox'>
							<div className="tckSelectBoxDownScroll">
								<div className="tckSelectBoxDownScrollBox">
									{this.state.propData.map(this._CheckboxListHandle)}
								</div>
							</div>
						</div>
						<div className="loadingPage">加载中...</div>
					</div>
		} else {
			return <div className="tckSelectBox" ref='tckSelectBox'>
						<div className="tckSelectBoxTop" ref='tckSelectTopBox'>
							<div className="searchBox filterPopSearchBox">
		                        <div className="searchInputBox">
		                            <i className="iconfont icon-icsousuo24px"></i>
		                            <input 
		                            	type="text"
		                            	ref='serchRefs'
		                            	onKeyUp={(evt)=>this._onKeyUpHandle(evt)} 
		                            	name="search"
		                            	placeholder={this.state.inputValueState}/>
		                        </div>
		                    </div>
							<div className="retractsBox">
								<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._closePopHandle(evt)}></span>
							</div>
						</div>
						<div className="tckSelectBoxDown" ref='tckSelectDownBox'>
							<div className="nullDataClassName">没有搜索到选值</div>
						</div>
					</div>
		}
	},
	_openCurrentPopHandle:function(itemData){//点筛选维度 打开当前维度的弹出层方法
		var _this = this;
		this.setState(function(previousState, currentProps) {
			var state = previousState;
			var checkedData = [];
			var checboxDatasCurrent = itemData.items.popDataInfo;
			if (checboxDatasCurrent.length > 0) {
				var checboxDatasCurrent = checboxDatasCurrent;
				for (var i = 0; i < checboxDatasCurrent.length; i++) {
					checboxDatasCurrent[i].index = i;
					if(checboxDatasCurrent[i].checboxBool){
						checkedData.push(checboxDatasCurrent[i]);
					}
				}
				state.propIndex = itemData.itemIndex;
				state.FieldName = itemData.FieldName;
				state.CheckboxBool = itemData.items.popDataType;
				state.itemDataStr = itemData;
				state.checkedData = checkedData;
			}
			$(_this.refs.serchRefs).val('');
			state.propData = checboxDatasCurrent;
			return state;
		})
		this._showTckBox(itemData);
	},
	_getAreaInfoHandle:function(){//获取数据立方的id
		var _this = this;
		ReportStore.getAreaInfo(this.props.reportId).then(function(data) { //通过接口获取数据立方的id,在后面获取筛选值用得到
			if (data.success) {
				_this.setState({
					metadataIdState: data.dataObject.metadataId
				})
			} else {
				console.log(data.message);
			}
		})
	},
	_CheckboxListHandle: function(item, index) { //拼接Checkbox列表
		return <Checkbox 
				key={index} 
				label={item.name} 
				defaultChecked={item.checboxBool} 
				onCheck={(event)=>this._checkboxHandle(event,item.index,this.state.propIndex,item.checboxBool,this.state.propData.length,item)} 
				labelStyle={{fontSize:'14px'}} 
				iconStyle={{width:'20px',height:'20px',marginTop:'1px'}} />
	},
	_scrollBrar: function() {
		var _this = this;
		if(this.state.propData.length > 0){
			$(".tckSelectBoxDownScroll").mCustomScrollbar({
				autoHideScrollbar: true,
				theme: "minimal-dark",
				callbacks:{
					onTotalScroll:function(){ 
						_this._onPageData();
					}
				}
			});
		}
	},
	_showTckBox: function(itemData) {
		var _this = this;
		App.emit('APP-REPORT-STOP-CLICK-BOX-HANDLE');
		var evtTarget = $(itemData.evtTarget);
		var offsetLeft = evtTarget.offset().left-60;
		var tckSelectBox = $(this.refs.tckSelectBox);
		var tckSelectTopBox = $(this.refs.tckSelectTopBox);
		var tckSelectDownBox = $(this.refs.tckSelectDownBox);
		var hiddenBoxWidth = evtTarget.parents('.selectBox-hiddenBox').width()
		var leftWidth = hiddenBoxWidth * 0.5;
		var bodyWidth = $('.selectBox-hiddenBox').width();
		tckSelectBox.attr('style', '');
		if (evtTarget.hasClass('listBoxDown')) {
			tckSelectBox.css('bottom', 0);
		} else {
			tckSelectBox.css('top', 0);
		}
		if (offsetLeft > leftWidth) {
			tckSelectBox.css('right', (hiddenBoxWidth - (offsetLeft + 240)));
		} else {
			tckSelectBox.css('left', offsetLeft);
			tckSelectBox.css('max-width', bodyWidth-offsetLeft-16);
		}
		if (evtTarget.children('div').hasClass('floatDivBoxOpen')) {
			tckSelectBox.css('background', 'rgba(55,71,79,.87)');
		} else {
			tckSelectBox.css('background', '#3c505a');
		}
		tckSelectBox.css('display', 'block');
		setTimeout(function() {
			tckSelectBox.addClass('tckSelectShowBox');
		}, 30)
		setTimeout(function() {
			tckSelectTopBox.fadeIn();
		}, 300)
		setTimeout(function() {
			tckSelectDownBox.fadeIn();
		}, 550)
	},
	_checkboxHandle: function(evt, currentIndex, parentIndex, checked, indexNum,item) {
		var _this = this;
		evt.stopPropagation();
		if(!checked){
			this.setState(function(p){
				p.checkedData.push(item);
				p.propData[currentIndex].checboxBool = true;
				return p;
			})
		}else{
			this.setState(function(p){
				var checkedData = [];
				for(var i=0;i<p.propData.length;i++){
					if(p.propData[i].checboxBool&&p.propData[i].id!=p.propData[currentIndex].id){
						checkedData.push(p.propData[i]);
					}
				}
				p.checkedData=checkedData;
				p.propData[currentIndex].checboxBool = false;
				return p;
			})
		}
		setTimeout(function(){
			App.emit('APP-REPORT-FILTER-CURRENT-OPEN-CHECK', {
				parentIndex: parentIndex,
				currentIndex: currentIndex,
				checked: checked,
				indexNum: indexNum,
				checkedData:_this.state.checkedData
			});
		},200)
		App.emit('APP-REPORT-FILTER-CURRENT-OPEN-CHECK', {
			parentIndex: parentIndex,
			currentIndex: currentIndex,
			checked: checked,
			indexNum: indexNum,
			item:item
		});
	},
	_closePopHandle: function(evt) {
		var _this = this;
		$(this.refs.tckSelectDownBox).hide();
		$(this.refs.tckSelectTopBox).hide();
		$(this.refs.tckSelectBox).removeClass('tckSelectShowBox');
		setTimeout(function() {
			$(_this.refs.tckSelectBox).attr('style', '');
			App.emit('APP-REPORT-STOP-CLICK-BOX-HANDLE');
		}, 350)
	},
	_clickBgBoxHandle:function(){//点击阴影部分关闭弹出层
		var _this = this;
		var stopClickBox = $(".stopClickBox");
		stopClickBox.off('click');
		stopClickBox.on("click",function(){
			_this._closePopHandle();
			return false;
		})		
	},

	_onKeyUpHandle: function(event) { //onKeyUp搜索执行的方法
		var _this = this;
		if (this.timeOutId) {
			clearTimeout(this.timeOutId);
		}
		var  metadataId=_this.state.metadataIdState;
		if(!metadataId){
			metadataId = _this.props.metadataId;
		}
		var inputValue = $.trim(event.target.value);
		this.currentPageNo = 1;
		this.timeOutId = setTimeout(function() { //输入完成之后才执行的方法
			var data = {
				fieldName:_this.state.FieldName,
				value:inputValue,
	            currentPageNo:_this.currentPageNo
			}
			ReportStore.getPageFieldData(metadataId,data).then(function(result) {
				if (result.success) {
					var listDatas = result.dataObject.dataArray;
					for (var i = 0; i < listDatas.length; i++) {
						listDatas[i].checboxBool = false;
						for(var j=0;j<_this.state.checkedData.length;j++){
							if(listDatas[i].id==_this.state.checkedData[j].id){
								listDatas[i].checboxBool=_this.state.checkedData[j].checboxBool;
							}
						}
						listDatas[i].index = i
					}
					_this.setState({
						propData:listDatas
					})
				} else {
					App.emit('APP-MESSAGE-OPEN', {
	                    content: result.message
	                });
				}
			})
		}, 350)
	},
	currentPageNo:1,
	pageCount:1,
	fieldValue:'',
	_onPageData: function() { //onKeyUp搜索执行的方法
		var _this = this;
		var currentPageNo = _this.currentPageNo++;
		$('.loadingPage').show();
		var data = {
			fieldName:_this.state.FieldName,
			value:_this.fieldValue,
            currentPageNo:currentPageNo
		}
		ReportStore.getPageFieldData(_this.state.metadataIdState,data).then(function(result) {
			if (result.dataObject.length > 0) {
				$('.loadingPage').hide();
				_this.setState(function(previousState){
					var data = previousState.propData;
					var listDatas = data.concat(result.dataObject);
					for (var i = 0; i < listDatas.length; i++) {
						listDatas[i].checboxBool = false;
						for(var j=0;j<previousState.checkedData.length;j++){
							if(listDatas[i].id==previousState.checkedData[j].id){
								listDatas[i].checboxBool=previousState.checkedData[j].checboxBool;
							}
						}
						listDatas[i].index = i
					}
					previousState.propData = listDatas;
					return previousState;
				})
			} else {
				$('.loadingPage').text('已经到最后一页了');
				setTimeout(function(){
					$('.loadingPage').hide();
					$('.loadingPage').text('加载中...');
				},2000)
			}
		})
	}
});