var $ = require('jquery');
import React, {
	Component
} from "react";
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import TreeFilterFieldsComponent from './TreeFilterFieldsComponent';
import TreeSearchComponent from './TreeSearchComponent';
import {
	IconButton
} from 'material-ui';
class TreeFilterValueComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		var disableNum=FilterFiledsStore.initFilterDisable(this.props.drilDownFilter,this.props.pid,this.props.dimensionId);
		this.state = {
			nameInfoType : this.props.nameInfoType,
			dimensionId : this.props.dimensionId,
			groupLevels : this.props.groupLevels,
			selectedData:this.props.selectedData,
			col:this.props.col,
			row:this.props.row,
			openTckBox: this.props.openTckBox,
			loadingText:'',
			goBackShow:this.props.goBackShow,
			goBackData:this.props.goBackData,
			levelId:this.props.levelId,
			pid:this.props.pid,
			allData:[],
			disable:'',
			disableNum:disableNum,
		};

	}
	componentWillReceiveProps(nextProps){
		//var disableNum=FilterFiledsStore.initFilterDisable(nextProps.drilDownFilter,nextProps.pid,nextProps.dimensionId);
 		this.setState({
 			nameInfoType : nextProps.nameInfoType,
			dimensionId : nextProps.dimensionId,
			groupLevels : nextProps.groupLevels,
			selectedData:nextProps.selectedData,
			col:nextProps.col,
			row:nextProps.row,
			goBackShow:nextProps.goBackShow,
			openTckBox: nextProps.openTckBox,
			levelId:nextProps.levelId,
			pid:nextProps.pid,
			goBackData:nextProps.goBackData,
			//disableNum:disableNum
 		})
 	}
 	componentDidMount(){
 		//当点击树形之后 刷新值
 		this.app['APP-REPORT-CLICK-TREE-FILTER-HANDLE'] = App.on('APP-REPORT-CLICK-TREE-FILTER-HANDLE', this._clickTreeFilterHandle.bind(this));
 	}
	componentDidUpdate(){
 		this._showTckBox();//打开弹出的方法
 		this._clickBgFun();//点击背景关闭弹出的方法
 	}
 	componentWillUnmount() {
 		for (let i in this.app) {
 			this.app[i].remove();
 		}
 	}
	render(){
		let nameInfoType = this.state.nameInfoType+" : ";
		let currentPathArr = this.state.groupLevels.slice(0,this.state.levelId+1);
		let backDom = "";
		if(this.state.goBackShow){
			backDom = 	<div className="goBackBox">
							<IconButton
								iconClassName="iconfont icon-icarrowback24px" 
								onClick={(evt)=>this._handleToggle(evt)} />
						</div>
		}
		return (
			<div className="tckSelectBox" ref='tckSelectBox'>
				<div className="tckSelectBoxTop" ref='tckSelectTopBox'>
					{backDom}
					<div className="currentPath">
						{nameInfoType}
						{currentPathArr.map((item,key)=>this._currentPathHandle(item,key,currentPathArr))}
					</div>
					<TreeSearchComponent
						col = {this.state.col}
						row = {this.state.row}/>
					<div className="retractsBox">
						<span className="closeIcon iconfont icon-icshouqi24px" onClick={(evt)=>this._closePopHandle(evt)}></span>
					</div>
				</div>
				<div className="tckSelectBoxDown treeTckSelectBoxDown" ref='tckSelectDownBox'>
					<TreeFilterFieldsComponent 
						selectedData = {this.state.selectedData}
						dimensionId = {this.state.dimensionId}
						col = {this.state.col}
						row = {this.state.row}
						loadingText = {this._setLoadingText.bind(this)}
						levelId = {this.state.levelId}
						pid = {this.state.pid}
						drilDownFilter={this.props.drilDownFilter}
						goBackShow={this.state.goBackShow}
						goBackData={this.state.goBackData}
						weiduList={this.props.weiduList}
						reportCategory={this.props.reportCategory}
						rowTitleFields={this.props.rowTitleFields}
						filterData={this.props.filterData}
						disableNum={this.state.disableNum}
					/>
				</div>
				<div className="fieldLoadingPage">{this.state.loadingText}</div>
			</div>
		)
	}
	_currentPathHandle(item,key,currentPathArr){//当前的路径方法
		if(key == currentPathArr.length-1){
			return <span key={key}>{item}</span>
		}else{
			return <span key={key}>{item} > </span> 
		}
		
	}
	_clickTreeFilterHandle(obj){//点击树形维度之后切换到点击的维度里面去
		if(this.state.row==obj.row&&this.state.col==obj.col){
			this.setState(function(state){
				state.levelId = obj.item.levelLen+1;
				state.pid = obj.item.id;
				state.allData=obj.allData;
				if(obj.item.levelLen == -1){
					state.goBackShow = false;
					state.goBackData={};
					state.disableNum=obj.disableNum;
				}else{
					state.goBackShow = true;
					state.goBackData['level_'+(state.levelId-1)] = obj.item.pid;
					state.goBackData['level_'+state.levelId] = state.pid;
					state.disableNum=obj.disableNum;
					var objs={
						pid:obj.item.pid,
						level:obj.item.levelLen,
						clickNext:true,
						goBackShow:true,
						goBackData:state.goBackData
					}
					FilterFiledsStore[obj.item.dimensionId]=objs;
				}
				return {state}
			})
		}
	}
	_handleToggle(evt){//返回按钮的处理方法
		evt.stopPropagation();

		this.setState(function(prevState){
			prevState.levelId = prevState.levelId-1;
			if(prevState.disableNum>0){
				prevState.disableNum=prevState.disableNum-1;
			}
			if(prevState.levelId==0){
				prevState.pid = 0;
				prevState.goBackShow = false;
			}else{
				prevState.pid = prevState.goBackData['level_'+prevState.levelId];
				prevState.goBackShow = true;
			}
			return prevState;
		})
	}
	_showTckBox() {//判断展开的效果方法
		let _this = this;
		if(this.state.openTckBox){
			let tckSelectBox = $(this.refs.tckSelectBox);
			let tckSelectTopBox = $(this.refs.tckSelectTopBox);
			let tckSelectDownBox = $(this.refs.tckSelectDownBox);
			let tckSelectBoxParent = tckSelectBox.parents("div.listBox");
			let parentOffsetLeft= tckSelectBox.next().offset().left;
			let hiddenBoxWidth = tckSelectBoxParent.parents('.selectBox-hiddenBox').width();
			let hiddenBoxHeight = tckSelectBoxParent.parents('.selectBox-hiddenBox').height();
			let leftWidth = hiddenBoxWidth * 0.5;
			tckSelectBox.attr('style', '');
			tckSelectBoxParent.css('z-index',13);
			tckSelectBox.next()
			.css('z-index',12)
			.css('z-index',12)
			.css('left',-(parentOffsetLeft-60))
			.css('cursor','default')
			.css('background','none')
			.css("width",hiddenBoxWidth)
			.css("height",hiddenBoxHeight);
			if(this.state.row == 1){
				tckSelectBox.css('bottom', 0);
				tckSelectBox.next().css('top',-120)
			}else{
				tckSelectBox.css('top', 0);
				tckSelectBox.next().css('top',0)
			}
			if (parentOffsetLeft > leftWidth) {
				tckSelectBox.css('right', 0);
				tckSelectBox.css('max-width', (tckSelectBox.parent().parent().parent().offset().left+180));
			} else {
				tckSelectBox.css('left', 0);
				tckSelectBox.css('max-width', hiddenBoxWidth-tckSelectBox.parent().parent().parent().offset().left+60);
			}
			if (tckSelectBoxParent.children('div').hasClass('floatDivBoxOpen')) {
				tckSelectBox.css('background', 'rgba(55,71,79,.87)');
			} else {
				tckSelectBox.css('background', '#3c505a');
			}
			tckSelectBox.css('display', 'block');
			setTimeout(function() {
				tckSelectBox.addClass('treeTckSelectShowBox');
			}, 30)
			setTimeout(function() {
				tckSelectTopBox.fadeIn();
			}, 300)
			setTimeout(function() {
				tckSelectDownBox.fadeIn();
			}, 550)
		}else{
			let tckSelectBox = $(this.refs.tckSelectBox);
			let tckSelectBoxParent = tckSelectBox.parents("div.listBox");
			$(this.refs.tckSelectDownBox).hide();
			$(this.refs.tckSelectTopBox).hide();
			tckSelectBox.removeClass('treeTckSelectShowBox');
			setTimeout(function() {
				tckSelectBox.attr('style', '');
				tckSelectBoxParent.attr('style', '');
				tckSelectBox.next().attr('style', '');
			}, 350)
		}
	}
	_closePopHandle(evt){//关闭弹出层的方法
		evt.stopPropagation();
		App.emit('APP-REPORT-MODIFY-FILTER-MOUDLE-HANDLE')
	}
	_clickBgFun(){//点击背景关闭弹出层的方法
		var _this = this;
		$('.stopClickBox').off('click');
		$('.stopClickBox').on("click",function(evt){
			_this._closePopHandle(evt);
			return false;
		})
	}
	_setLoadingText(text){
		this.setState({
			loadingText:text
		})
	}
}
export default TreeFilterValueComponent;