var $ = require('jquery');
import {
	Component
} from 'react';
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import FilterFieldsComponent from './FilterFieldsComponent';
class FilterValueComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedData: this.props.selectedData,
			metadataId: this.props.metadataId,
			fieldName: this.props.fieldName,
			col: this.props.col,
			row: this.props.row,
			inputValue: '',
			openTckBox: this.props.openTckBox,
			error: false,
			currentPageNo: 1,
			totalRows: null,
			loadingText: '',
			checkOpen:true
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			selectedData: nextProps.selectedData,
			metadataId: nextProps.metadataId,
			fieldName: nextProps.fieldName,
			col: nextProps.col,
			row: nextProps.row,
			openTckBox: nextProps.openTckBox,
			checkOpen:this.state.openTckBox==nextProps.openTckBox ? false : true
		})
	}
	componentWillMount() {}
	componentDidMount() {

	}
	componentDidUpdate() {
		this._showTckBox(); //打开弹出的方法
		this._clickBgFun(); //点击背景关闭弹出的方法
	}
	render() {
		return (
			<div className="tckSelectBox" ref='tckSelectBox'>
				<div className="tckSelectBoxTop" ref='tckSelectTopBox'>
					<div className="searchBox filterPopSearchBox">
                        <div className="searchInputBox">
                            <i className="iconfont icon-icsousuo24px"></i>
                            <input 
                            	type="text"
                            	name="search"
                            	onChange={(evt)=>this._onKeyUpHandle(evt)} 
                            	dealutValue={this.state.inputValue}
                            	value={this.state.inputValue}
                            	placeholder='搜索维度值'/>
                        </div>
                    </div>
					<div className="retractsBox">
						<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._closePopHandle(evt)}></span>
					</div>
				</div>
				<div className="tckSelectBoxDown" ref='tckSelectDownBox'>
					<FilterFieldsComponent 
						selectedData = {this.state.selectedData}
						metadataId = {this.state.metadataId}
						fieldName = {this.state.fieldName}
						col = {this.state.col}
						row = {this.state.row}
						loadingText = {this._setLoadingText.bind(this)}
						inputValue = {this.state.inputValue}
					/>
				</div>
				<div className="fieldLoadingPage">{this.state.loadingText}</div>
			</div>
		)

	}
	_showTckBox() { //判断展开的效果方法
		let _this = this;
		if (this.state.openTckBox && this.state.checkOpen) {
			let tckSelectBox = $(this.refs.tckSelectBox);
			let tckSelectTopBox = $(this.refs.tckSelectTopBox);
			let tckSelectDownBox = $(this.refs.tckSelectDownBox);
			let tckSelectBoxParent = tckSelectBox.parents("div.listBox");
			let parentOffsetLeft = tckSelectBox.next().offset().left;
			let hiddenBoxWidth = tckSelectBoxParent.parents('.selectBox-hiddenBox').width();
			let hiddenBoxHeight = tckSelectBoxParent.parents('.selectBox-hiddenBox').height();
			let leftWidth = hiddenBoxWidth * 0.5;
			tckSelectBox.attr('style', '');
			tckSelectBoxParent.css('z-index', 13);
			tckSelectBox.next()
				.css('z-index', 12)
				.css('z-index', 12)
				.css('left', -(parentOffsetLeft - 60))
				.css('cursor', 'default')
				.css('background', 'none')
				.css("width", hiddenBoxWidth)
				.css("height", hiddenBoxHeight);
			if (this.state.row == 1) {
				tckSelectBox.css('bottom', 0);
				tckSelectBox.next().css('top', -120)
			} else {
				tckSelectBox.css('top', 0);
				tckSelectBox.next().css('top', 0)
			}
			if (parentOffsetLeft > leftWidth) {
				tckSelectBox.css('right', 0);
				tckSelectBox.css('max-width', (tckSelectBox.parent().parent().parent().offset().left + 180));
			} else {
				tckSelectBox.css('left', 0);
				tckSelectBox.css('max-width', hiddenBoxWidth - tckSelectBox.parent().parent().parent().offset().left + 60);
			}
			if (tckSelectBoxParent.children('div').hasClass('floatDivBoxOpen')) {
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
		} else if(!this.state.openTckBox){
			let tckSelectBox = $(this.refs.tckSelectBox);
			let tckSelectBoxParent = tckSelectBox.parents("div.listBox");
			$(this.refs.tckSelectDownBox).hide();
			$(this.refs.tckSelectTopBox).hide();
			tckSelectBox.removeClass('tckSelectShowBox');
			setTimeout(function() {
				tckSelectBox.attr('style', '');
				tckSelectBoxParent.attr('style', '');
				tckSelectBox.next().attr('style', '');
			}, 350)
		}
	}
	_closePopHandle(evt) { //关闭弹出层的方法
		evt.stopPropagation();
		App.emit('APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE')
	}
	_clickBgFun() { //点击背景关闭弹出层的方法
		var _this = this;
		$('.stopClickBox').off('click');
		$('.stopClickBox').on("click", function(evt) {
			_this._closePopHandle(evt);
			return false;
		})
	}
	_onKeyUpHandle(event) { //onKeyUp搜索执行的方法
		var _this = this;
		var inputValue = $.trim(event.target.value);
		this.setState({
			inputValue: inputValue
		})
	}
	_setLoadingText(text) {
		this.setState({
			loadingText: text
		})
	}
}
export default FilterValueComponent;