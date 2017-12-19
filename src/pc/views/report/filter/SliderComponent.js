var $ = require('jquery');
 import {
 	Component
 } from 'react';
 import App from 'app';
 import FilterCellsComponent from './FilterCellsComponent';
 class SliderComponent extends Component {
 	constructor(props) {
 		super(props);
 		this.app = {}
 		this.state = {
 			metadataId: this.props.metadataId,
 			listData: this.props.listData
 		};
 	}
 	componentWillReceiveProps(nextProps) {
 		this.setState({
 			metadataId: nextProps.metadataId,
 			listData: nextProps.listData
 		})
 	}
 	componentDidMount() {
 		let _this = this;
 		//当列表组件加载完成之后绑定左右滚动点击效果方法
 		this.app['APP-REPORT-SLIDER-LIST-HANDLE'] = App.on('APP-REPORT-SLIDER-LIST-HANDLE', this._listTypeSliderHandle.bind(this));
 		this._listTypeSliderHandle();
 		$(window).resize(function() { //改变浏览器大小 重置滚动 方法
 			_this._listTypeSliderHandle();
 		});
 	}
 	componentWillUnmount() {
 		for (let i in this.app) {
 			this.app[i].remove();
 		}
 	}
 	render() {
 		return (
 			<div className="selectBox-hidden" ref='selectBoxHidden'>
 				<a href="javascript:void(0)" ref="leftClickBtn" className="linkButton prev iconfont icon-icchevronleft24px"></a>
 				<a href="javascript:void(0)" ref="rightClickBtn" className="linkButton next iconfont icon-icchevronright24px"></a>
 				<div className="selectBox-hiddenBox">
	 				<div className="selectScrollBox">
	 					{this.state.listData.map((item,key)=>this._filterCellsFun(item,key))}
	 				</div>
	 			</div>
 			</div>
 		)
 	}
 	_filterCellsFun(item, key) {
 		return <FilterCellsComponent 
					key={key}
				 	col={key} 
				 	cellsData={item.cells} 
				 	metadataId={this.state.metadataId} 
				 	drilDownFilter={this.props.drilDownFilter}
				 	weiduList={this.props.weiduList}
				 	reportCategory={this.props.reportCategory}
				 	rowTitleFields={this.props.rowTitleFields}
				 	filterData={this.props.filterData}
				 	compareData={this.props.compareData}
				/>
 	}
 	_listTypeSliderHandle() { //左右滚动的方法
 		let scrollWidth = $('body').width() - 120; //隐藏的宽度
 		let leftClickBtn = $(this.refs.leftClickBtn);
 		let rightClickBtn = $(this.refs.rightClickBtn);
 		let scrollBox = $(".selectScrollBox");
 		let liLen = $(scrollBox).find("div.selectBoxListBox").length;
 		let liWidth = $(scrollBox).find("div.selectBoxListBox").outerWidth();
 		let scrollBoxWidth = liLen * (liWidth + 8);
 		let maxWidth = scrollBoxWidth - scrollWidth;
 		let page = 0;
 		let pageLen = Math.ceil(Math.abs(maxWidth) / liWidth);
 		scrollBox.width(scrollBoxWidth);
 		scrollBox.animate({
 			left: 0
 		}, 500);
 		leftClickBtn.off('click');
 		rightClickBtn.off('click');
 		if (scrollWidth >= scrollBoxWidth) {
 			leftClickBtn.css("display", "none")
 			rightClickBtn.css("display", "none")
 		} else {
 			if (page == 0) {
 				leftClickBtn.css("display", "none");
 			} else {
 				leftClickBtn.css("display", "block")
 			}
 			rightClickBtn.css("display", "block")
 		}
 		leftClickBtn.on('click', function() { //点击向左的方法
 			if (!scrollBox.is(":animated")) {
 				page--;
 				rightClickBtn.css("display", "block");
 				if (page > 0) {
 					scrollBox.animate({
 						left: -liWidth * page
 					}, 500)
 				} else if (page == 0) {
 					scrollBox.animate({
 						left: -liWidth * page
 					}, 500)
 					leftClickBtn.css("display", "none")
 				} else {
 					page = 0;
 				}
 			}
 			return false;
 		})
 		rightClickBtn.on('click', function() { //点击向右的方法
 			if (!scrollBox.is(":animated")) {
 				page++;
 				leftClickBtn.css("display", "block");
 				if (page < pageLen) {
 					scrollBox.animate({
 						left: -liWidth * page
 					}, 500)
 				} else if (page == pageLen) {
 					scrollBox.animate({
 						left: -liWidth * page
 					}, 500)
 					rightClickBtn.css("display", "none")
 				}
 			}
 			return false;
 		})
 	}
 }
 export default SliderComponent;