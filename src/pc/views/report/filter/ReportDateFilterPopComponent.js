var React = require('react');
var App = require('app');
var $ = require('jquery');
var ReportDateRangeSelector = require('../../common/ReportDateRangeSelector');
module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {}
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentWillMount:function(){
	},
	componentDidMount:function(){
		this._clickBgBox();
		//修改时间日期筛选的组件方法
		this.app['APP-REPORT-MODIFY-DATE-COMPONENT-POP-HANDLE'] = App.on('APP-REPORT-MODIFY-DATE-COMPONENT-POP-HANDLE',this._modifyDateComponentHandle);
	},
	componentDidUpdate: function() {
		this._clickBgBox();
	},
	render:function(){
		if(this.state.valueType == 'CUSTOM'){
			return (
				<div className='dateTckClassName' ref='dateTckSelectBox'>
					<div className="tckSelectBoxTop" ref='dateTckSelectTopBox'>
						<div className="retractsBox">
							<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._handleClose(evt)}></span>
						</div>
					</div>
					<div className="tckSelectBoxDown" ref='dateTckSelectDownBox'>
						<ReportDateRangeSelector
							dateRangeType={this.state.valueType} 
							startDate={this.state.startDate} 
							endDate={this.state.endDate} 
							onCancel={this._handleClose} 
							onOK={this._handleSubmitHandle}/>
					</div>
				</div>
				)
		}else{
			return (
				<div className='dateTckClassName' ref='dateTckSelectBox'>
					<div className="tckSelectBoxTop" ref='dateTckSelectTopBox'>
						<div className="retractsBox">
							<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._handleClose(evt)}></span>
						</div>
					</div>
					<div className="tckSelectBoxDown" ref='dateTckSelectDownBox'>
						<ReportDateRangeSelector 
							dateRangeType={this.state.valueType}  
							onCancel={this._handleClose} 
							onOK={this._handleSubmitHandle}/>
					</div>
				</div>
				)
		}
	},
	_modifyDateComponentHandle:function(itemData){//修改日期筛选组件的可见性方法
		var _this = this;
		this.setState({
			itemIndex : itemData.itemIndex,
			valueType : itemData.valueType,
			startDate : itemData.startDate,
			endDate : itemData.endDate,
		})
		App.emit('APP-REPORT-STOP-DATE-CLICK-BOX-HANDLE')
		$(this.refs.dateTckSelectBox).attr('style', '');
		var evtTarget = $(itemData.evtTarget);
		var offsetLeft = evtTarget.offset().left-60;
		if (evtTarget.hasClass('listBoxDown')) {
			$(this.refs.dateTckSelectBox).css('bottom', 0);
		} else {
			$(this.refs.dateTckSelectBox).css('top', 0);
		}
		if (offsetLeft > evtTarget.parents('.selectBox-hiddenBox').width() * 0.5) {
			$(this.refs.dateTckSelectBox).css('right', (evtTarget.parents('.selectBox-hiddenBox').width() - (offsetLeft + 240)));
		} else {
			$(this.refs.dateTckSelectBox).css('left', offsetLeft);
		}
		if (evtTarget.children('div').hasClass('floatDivBoxOpen')) {
			$(this.refs.dateTckSelectBox).css('background', 'rgba(55,71,79,.87)');
		} else {
			$(this.refs.dateTckSelectBox).css('background', '#3c505a');
		}
		$(this.refs.dateTckSelectBox).css('display', 'block');
		setTimeout(function() {
			$(_this.refs.dateTckSelectBox).addClass('dateTckClassNameShowBox');
		}, 30)
		setTimeout(function() {
			$(_this.refs.dateTckSelectTopBox).fadeIn();
		}, 300)
		setTimeout(function() {
			$(_this.refs.dateTckSelectDownBox).fadeIn();
		}, 550)
	},
	_handleSubmitHandle:function(result){//确定按钮方法
		var valueType = [result.type];
        if(result.type == 'CUSTOM'){
            valueType = [result.startDate,result.endDate];
        }
        App.emit('APP-REPORT-FILTER-CURRENT-OPEN-CHECK', {
        	parentIndex: this.state.itemIndex,
        	dateFilterValueArr:valueType,
        	valueType:result.type
        });
        this._handleClose();
	},
	_handleClose:function(evt){//取消按钮方法
		var _this = this;
		$(this.refs.dateTckSelectDownBox).hide();
		$(this.refs.dateTckSelectTopBox).hide();
		$(this.refs.dateTckSelectBox).removeClass('dateTckClassNameShowBox');
		setTimeout(function() {
			$(_this.refs.dateTckSelectBox).attr('style', '');
			App.emit('APP-REPORT-STOP-DATE-CLICK-BOX-HANDLE');
		}, 350)
	},
	_clickBgBox:function(){//点击阴影部分关闭弹出层
		var _this = this;
		var stopDateClickBox = $(".stopDateClickBox");
		stopDateClickBox.off('click');
		stopDateClickBox.on("click",function(){
			_this._handleClose();
			return false;
		})		
	}
})