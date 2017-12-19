import {
	Component
} from 'react';
import App from 'app';
var $ = require('jquery');
var ReportDateRangeSelector = require('../../common/ReportDateRangeSelector');
class FilterDateValueComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemObj: this.props.itemObj,
			valueType: this.props.itemObj.valueType,
			startDate: this.props.itemObj.popData[0],
			endDate: this.props.itemObj.popData[1],
			col: this.props.col,
			row: this.props.row,
			openTckBox: this.props.openTckBox,
		};
	}
	componentWillReceiveProps(nextProps) {
		let _this = this;
		this.setState({
			itemObj: nextProps.itemObj,
			valueType: nextProps.itemObj.valueType,
			startDate: nextProps.itemObj.popData[0],
			endDate: nextProps.itemObj.popData[1],
			col: nextProps.col,
			row: nextProps.row,
			openTckBox: nextProps.openTckBox,
		})
	}
	componentDidMount() {}
	componentDidUpdate() {
		this._showDateTckHandle(); //打开弹出的方法
		this._clickBgFun(); //点击背景关闭弹出的方法
	}
	render() {
		if (this.state.valueType == 'CUSTOM') {
			return (
				<div className='dateTckClassName' ref='dateTckSelectBox'>
						<div className="tckSelectBoxTop" ref='dateTckSelectTopBox'>
							<div className="retractsBox">
								<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._handleClose(evt)}></span>
							</div>
						</div>
						<div className="tckSelectBoxDown" ref='dateTckSelectDownBox'>
							<ReportDateRangeSelector
								itemObj={this.state.itemObj}
								dateRangeType={this.state.valueType} 
								startDate={this.state.startDate} 
								endDate={this.state.endDate} 
								onCancel={this._handleClose} 
								onOK={this._handleSubmitHandle.bind(this)}/>
						</div>
					</div>
			)
		} else {
			return (
				<div className='dateTckClassName' ref='dateTckSelectBox'>
					<div className="tckSelectBoxTop" ref='dateTckSelectTopBox'>
						<div className="retractsBox">
							<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._handleClose(evt)}></span>
						</div>
					</div>
					<div className="tckSelectBoxDown" ref='dateTckSelectDownBox'>
						<ReportDateRangeSelector 
						    itemObj={this.state.itemObj}
							dateRangeType={this.state.itemObj.popData[0]}  
							onCancel={this._handleClose} 
							onOK={this._handleSubmitHandle.bind(this)}/>
					</div>
				</div>
			)
		}
	}
	_handleSubmitHandle(result) { //日期弹出 确定按钮的方法
		let valueType = [result.type];
		if (result.type == 'CUSTOM') {
			valueType = [result.startDate, result.endDate];
		}
		App.emit('APP-REPORT-CLICK-FILTER-VALUE-HANDLE', {
			col: this.state.col,
			row: this.state.row,
			selectedData: valueType,
			valueType: result.type
		});
		App.emit('APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE');
	}
	_handleClose(evt) { //关闭弹出层的方法
		evt.stopPropagation();
		App.emit('APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE')
	}
	_clickBgFun() { //点击背景关闭弹出层的方法
		var _this = this;
		$('.stopClickBox').off('click');
		$('.stopClickBox').on("click", function(evt) {
			_this._handleClose(evt);
			return false;
		})
	}
	_showDateTckHandle() { //修改日期筛选组件的可见性方法
		if (this.state.openTckBox) {
			let dateTckSelectBox = $(this.refs.dateTckSelectBox);
			let dateTckSelectBoxParent = dateTckSelectBox.parents("div.listBox");
			let dateTckSelectTopBox = $(this.refs.dateTckSelectTopBox);
			let dateTckSelectDownBox = $(this.refs.dateTckSelectDownBox);
			let parentOffsetLeft=dateTckSelectBoxParent[0].offsetLeft;
			let parentOffsetTop=dateTckSelectBoxParent[0].offsetTop;
			let hiddenBoxWidth = dateTckSelectBoxParent.parents('.selectBox-hiddenBox').width();
			let hiddenBoxHeight = dateTckSelectBoxParent.parents('.selectBox-hiddenBox').height();
			dateTckSelectBox.attr('style', '');
			dateTckSelectBoxParent.css('z-index',13);
			dateTckSelectBox.next()
			.css('z-index',12)
			.css('z-index',12)
			.css('left',-parentOffsetLeft)
			.css('top',-parentOffsetTop)
			.css('cursor','default')
			.css('background','none')
			.css("width",hiddenBoxWidth)
			.css("height",hiddenBoxHeight);
			if (this.state.row == 1) {
				dateTckSelectBox.css('bottom', 0);
			} else {
				dateTckSelectBox.css('top', 0);
			}
			if (dateTckSelectBox.children('div').hasClass('floatDivBoxOpen')) {
				dateTckSelectBox.css('background', 'rgba(55,71,79,.87)');
			} else {
				dateTckSelectBox.css('background', '#3c505a');
			}
			dateTckSelectBox.css('display', 'block');
			setTimeout(function() {
				dateTckSelectBox.addClass('dateTckClassNameShowBox');
			}, 30)
			setTimeout(function() {
				dateTckSelectTopBox.fadeIn();
			}, 300)
			setTimeout(function() {
				dateTckSelectDownBox.fadeIn();
			}, 550)
		} else {
			let dateTckSelectBox = $(this.refs.dateTckSelectBox);
			let dateTckSelectBoxParent = dateTckSelectBox.parents("div.listBox");
			$(this.refs.dateTckSelectDownBox).hide();
			$(this.refs.dateTckSelectTopBox).hide();
			dateTckSelectBox.removeClass('dateTckClassNameShowBox');
			setTimeout(function() {
				dateTckSelectBox.attr('style', '');
				dateTckSelectBoxParent.attr('style', '');
				dateTckSelectBox.next().attr('style', '');
			}, 350)
		}
	}
}
export default FilterDateValueComponent;