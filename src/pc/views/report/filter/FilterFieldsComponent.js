var $ = require('jquery');
import {Component} from 'react';
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import Loading from '../../common/Loading';
import {
	Checkbox,
} from 'material-ui';
class FilterFieldsComponent extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	selectedData:this.props.selectedData,
	  	metadataId:this.props.metadataId,
	  	fieldName:this.props.fieldName,
	  	col:this.props.col,
	  	row:this.props.row,
	  	inputValue:this.props.inputValue,
	  	listData:[],
	  	error:false,
	  	currentPageNo:1,
	  	totalRows:null
	  };
	}
	componentWillReceiveProps(nextProps){
		let _this = this;
		if(nextProps.inputValue!=this.props.inputValue){
			_this._getPageFieldData(nextProps.inputValue,1);
		}
 		this.setState({
 			selectedData:nextProps.selectedData,
 			metadataId:nextProps.metadataId,
 			fieldName:nextProps.fieldName,
 			col:nextProps.col,
 			row:nextProps.row,
 			listData:FilterFiledsStore.getFieldData(this.state.listData,nextProps.selectedData)
 		})
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
	 		//_this._scrollBrar();
 		},500);
 	}
 	componentDidUpdate(){
 	}
	render(){
		let boxDom;
		if(this.state.listData.length>0){
			return (
				<div className="tckSelectBoxDownScroll" ref="tckSelectBoxDownScroll">
					<div className="tckSelectBoxDownScrollBox">
						{this.state.listData.map((item,key)=>this._filterValueListHandle(item,key))}
					</div>
				</div>
			);
		}else{
			return (
				<div className="nullDataClassName">没有搜索到选值</div>
			);
		}
		if(this.state.error){
			return (
				<div className="nullDataClassName">{this.state.error}</div>
			);
		}
	}
	_filterValueListHandle(item,key){//输出筛选的值的方法
		var index = key;
		return <Checkbox 
				key={key} 
				label={item.name} 
				onCheck={(event)=>this._checkboxHandle(event,index,item)}
				defaultChecked={item.checboxBool}/>
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
 				totalRows:data.totalRows
 			},function(){
 				_this.props.loadingText('')
 				_this._scrollBrar();
 			})
 		},function(data){
 			_this.setState({
 				error:data.message,
 				inputValue:'',
 				currentPageNo:1,
 				totalRows:null,
 				loadingText:''
 			},function(){
 				_this.props.loadingText('')
 			})
 		})
	}
	_scrollBrar() {
		var _this = this;
		setTimeout(function(){
			$(_this.refs.tckSelectBoxDownScroll).mCustomScrollbar({
				autoHideScrollbar: true,
				theme: "minimal-dark",
				callbacks:{
					onTotalScroll:function(){ 
						_this._onPageData();
					}
				}
			});
		},0)
	}
	_onPageData(){
		var _this = this;
		_this.props.loadingText('加载中...')
		if(parseInt(this.state.totalRows/50)>=this.state.currentPageNo){
			var currentPageNo = this.state.currentPageNo+1;
			this._getPageFieldData(this.state.inputValue,currentPageNo);
		}else{
			_this.props.loadingText('已经是最后一页了')
			setTimeout(function(){
				_this.props.loadingText('')
			},3000)
		}
	}
}
export default FilterFieldsComponent;