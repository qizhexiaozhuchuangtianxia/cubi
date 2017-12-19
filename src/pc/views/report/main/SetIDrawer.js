/**
 * 右侧数据立方
 */
var React = require('react');
var ReactDOM = require('react-dom');
var ChartTypeStore = require('../../../stores/ChartTypeStore');
var App = require('app');
var $ = require('jquery');
var CheckEntryTextComponent = require('../../common/CheckEntryTextComponent');
var PublicTextField = require('../../common/PublicTextField');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			chartType: this.props.reportType,
			fileName: this.props.fileName,
			fileNameError: null,
			reportCategory:this.props.reportCategory
		};
	},
	componentDidMount: function() {
		var _this = this;
		this._typeListSliderHandle();
		$(window).resize(function() {//改变浏览器大小 重置滚动 方法
			_this._typeListSliderHandle();
		});
	},
	render: function() {
		var chartlist = ChartTypeStore.getChartTypeList();
		if (this.state.fileName != '') {
			var ht = this.state.fileName;
		} else {
			var ht = '分析名称';
		}
		return (
			<div className="charClass">
				<div className="reportName">
					<PublicTextField
						fullWidth={true}
						id="tableName"
						className='reportSetNameClassName'
						floatingLabelText="分析名称"
						defaultValue={this.state.fileName}
						errorText={this.state.fileNameError}
						onChange={this._handeTextValue} />
				</div>
				<div className="siliderBox">
					<h2>图形类型</h2>
					<div className="siliderBoxDown">
						<span className="spanIconLeft iconfont icon-icchevronleft24px" ref="leftClickBtn"></span>
						<div className="sliderHideBox">
							<div className="scrollBox"  ref="scrollBox">
								<ul>
									{chartlist.map(this._getChart) }
								</ul>
							</div>
						</div>
						<span className="spanIconRight iconfont icon-icchevronright24px" ref="rightClickBtn"></span>
					</div>
				</div>
			</div>
		)
	},
	_typeListSliderHandle:function(){//当前图形类型滚动的方法
		var scrollWidth = $('body').width()-96;//隐藏的宽度
		var leftClickBtn = $(this.refs.leftClickBtn);
		var rightClickBtn = $(this.refs.rightClickBtn);
		var scrollBox = $(this.refs.scrollBox);
		var liLen = $(scrollBox).find("li").length;
		var liWidth = $(scrollBox).find("li").outerWidth();
		var scrollBoxWidth = liLen*(liWidth+8);
		var maxWidth = scrollBoxWidth-scrollWidth;
		var page = 0;
		var pageLen = Math.ceil(Math.abs(maxWidth)/liWidth);
		scrollBox.width(scrollBoxWidth);
		scrollBox.animate({left:-liWidth*page},500);
		leftClickBtn.off('click');
		rightClickBtn.off('click');
		if(scrollWidth>=scrollBoxWidth){
			leftClickBtn.css("display","none")
			rightClickBtn.css("display","none")
		}else{
			if(page == 0){
				leftClickBtn.css("display","none");
			}else{
				leftClickBtn.css("display","block")
			}
			rightClickBtn.css("display","block")
		}
		leftClickBtn.on('click',function(){//点击向左的方法
			if(!scrollBox.is(":animated")){
				page--;
				rightClickBtn.css("display","block")
				if(page > 0){

						scrollBox.animate({left:-liWidth*page},500)
				}else if(page == 0){
						scrollBox.animate({left:-liWidth*page},500)
						leftClickBtn.css("display","none")
				}else{
					page = 0;
				}
			}
			return false;
		})
		rightClickBtn.on('click',function(){//点击向右的方法
			if(!scrollBox.is(":animated")){
				page++;
				leftClickBtn.css("display","block");
				if(page < pageLen){
						scrollBox.animate({left:-liWidth*page},500)

				}else if(page == pageLen){
						scrollBox.animate({left:-liWidth*page},500)
						rightClickBtn.css("display","none")
				}
			}
			return false;
		})
	},
	_getChart: function(item) {
		var typeClass = item.type == this.state.chartType ? 'liActive' : '';
		var cls = "imgBox " + item.type;
		return (
			<li className={typeClass} key={item.type} onClick={() => this._checkedChart(item.type, item.category) }>
				<div className={cls}></div>
				<p>{item.name}</p>
			</li>
		)
	},
	_checkedChart: function(type, category) {
		console.log("SetIDrawer.js line:138,The params is:",type +"|"+ category);
		App.emit('APP-REPORT-TYPE-CHANGED', type, category,{type:this.state.chartType,category:this.state.reportCategory});
		this.setState(function(previousState, currentProps) {
			return {
				chartType: type,
				reportCategory:category
			};
		});
		localStorage.removeItem('selectValue');
	},
	_checkFileName: function(thisVal) {
		var reportName = thisVal.trim();
		var fileNameError = '';
		if (reportName !== undefined && reportName !== null && reportName !== "") {
			if (CheckEntryTextComponent.checkEntryTextLegitimateHandle(reportName)) {
				fileNameError = '名称格式错误';
			} else {
				if (CheckEntryTextComponent.checkAllNameLengthHandle(reportName) > 16) {
					fileNameError = CheckEntryTextComponent.checkAllNameLengthHandle(reportName) + '/16';
				} else {
					fileNameError = null;
					App.emit('APP-GET-TABLE-NAME',reportName);
				}
			}
		} else {
			fileNameError = '名称不能为空';
			App.emit('APP-GET-TABLE-NAME',reportName);
		}
		this.setState({
			fileNameError: fileNameError,
			fileName:reportName
		})
	},
	_handeTextValue: function(e) {
		var name = e.target.value;
		this._checkFileName(name);
	}
})
