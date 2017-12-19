var $ = require('jquery');
import {Component} from 'react';
import App from 'app';
import {
	Checkbox,
} from 'material-ui';
class FilterValueComponent extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	inputValue:''
	  };
	}
	componentWillReceiveProps(nextProps){
 		
 	}
 	componentWillMount(){
 	}
 	componentDidMount(){
 		var _this = this;
 		var data = {
			fieldName:_this.state.fieldName,
			value:'',
            currentPageNo:1,
            selectedData:this.state.selectedData
		}
		setTimeout(function(){
	 		_this._getPageFieldData('',1);
	 		_this._scrollBrar();
 		},500);
 	}
 	componentDidUpdate(){
 		this._showTckBox();//打开弹出的方法
 		this._clickBgFun();//点击背景关闭弹出的方法
 	}
	render(){
		let boxDom;
		if(this.state.listData.length>0){
			boxDom = <div className="tckSelectBoxDownScroll">
								<div className="tckSelectBoxDownScrollBox">
									{this.state.listData.map((item,key)=>this._filterValueListHandle(item,key))}
								</div>
							</div>;
		}else{
			boxDom = <div className="nullDataClassName">没有搜索到选值</div>;
		}
		if(this.state.error){
			boxDom = <div className="nullDataClassName">{this.state.error}</div>;
		}
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
					{boxDom}
				</div>
				<div className="fieldLoadingPage">{this.state.loadingText}</div>
			</div>
		)
		
	}
	_filterValueListHandle(item,key){//输出筛选的值的方法
		var index = key;
		return <Checkbox 
				key={key} 
				label={item.name} 
				onCheck={(event)=>this._checkboxHandle(event,index,item)}
				defaultChecked={item.checboxBool}/>
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
				tckSelectBox.addClass('tckSelectShowBox');
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
			tckSelectBox.removeClass('tckSelectShowBox');
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
	_checkboxHandle(evt,index,item){//点击筛选值执行的方法
		var _this = this;
		evt.stopPropagation();
		var selectedData = [];
		for(var i=0;i<this.state.selectedData.length;i++){
			if(item.name!=this.state.selectedData[i].name)
			selectedData.push(this.state.selectedData[i])
		}
		if(!item.checboxBool){
			item.checboxBool = !item.checboxBool;
			selectedData.push(item)
		}
		App.emit('APP-REPORT-CLICK-FILTER-VALUE-HANDLE',{col:_this.state.col,row:_this.state.row,selectedData:selectedData})
	}
	_onKeyUpHandle(event) { //onKeyUp搜索执行的方法
		console.log(this)
		var _this = this;
		var inputValue = $.trim(event.target.value);
		this._getPageFieldData(inputValue,1);
	}
	_getPageFieldData(value,currentPageNo){
		var _this = this;
		var data = {
			fieldName:_this.state.fieldName,
			value:value,
            currentPageNo:currentPageNo,
            selectedData:this.state.selectedData
		}
		FilterFiledsStore.getPageFieldData(_this.state.metadataId,data).then(function(data){
			if(currentPageNo==1){
				var fieldsData = data.data;
			}else{
				var fieldsData = _this.state.listData.concat(data.data);
			}
 			_this.setState({
 				listData:fieldsData,
 				inputValue:value,
 				currentPageNo:currentPageNo,
 				totalRows:data.totalRows,
 				loadingText:''
 			},function(){
 				_this._scrollBrar();
 			})
 		},function(data){
 			_this.setState({
 				error:data.message,
 				inputValue:'',
 				currentPageNo:1,
 				totalRows:null,
 				loadingText:''
 			})
 		})
	}
	_scrollBrar() {
		var _this = this;
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
	_onPageData(){
		var _this = this;
		this.setState({
			loadingText:'加载中...'
		})
		if(parseInt(this.state.totalRows/50)>=this.state.currentPageNo){
			var currentPageNo = this.state.currentPageNo+1;
			this._getPageFieldData(this.state.inputValue,currentPageNo);
		}else{
			this.setState({
				loadingText:'已经是最后一页了'
			})
			setTimeout(function(){
				_this.setState({
					loadingText:''
				})
			},3000)
		}
	}
}
export default FilterValueComponent;