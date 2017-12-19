/**
 **驾驶舱的筛选器-FilterValue 模块
 **
 */
var $ = require('jquery');
import {
	Component
} from 'react';
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import Loading from '../../common/Loading';
class FilterValueComponent extends Component {
	constructor(props) {
		super(props);
		this.app={}
		this.compunentIsMounted=true;
		this.state = {
			listData:[],
			loading:true,
			value:'',
			selectedData:this.props.selectedData,
			reportInfo: this.props.reportInfo,
			totalRows:0,
			currentPageNo:1,
			inputValue:''
		};
	}
	componentWillMount(){
		this._getFilterValueHandle(this.props.selectedData,1,this.state.value);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			listData:FilterFiledsStore.getFieldData(this.state.listData,nextProps.selectedData),
			selectedData:nextProps.selectedData,
			reportInfo: nextProps.reportInfo,
		})
	}
	componentDidMount(){
		//点击搜索 获取筛选值的方法
		this.app['APP-DASHBOARD-REPORT-SEARCH-FILTER-VALEU'] = App.on('APP-DASHBOARD-REPORT-SEARCH-FILTER-VALEU',this._getFilterValueHandle.bind(this));
		this._scrollBrar();
		this.compunentIsMounted=true;
	}
	componentWillUnmount() {
		this.compunentIsMounted=false;
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render() {
		if(this.state.loading){
			return <ul className="nullClassNameUl">
                    <li className="loading"><Loading/></li>
                </ul>
		}
		var listData=[];
		if(this.props.seletedFlag == 'seleted'){
			listData = this.state.selectedData;
		}else{
			listData = this.state.listData;
		}
		if(!this.state.loading){
			if(listData.length>0){
				return (
					<ul>
						{listData.map((item,key)=>this._renderListHandle(item,key))}
					</ul>
				)
			}else{
				return (
					<div className="nullClassName">暂无筛选值数据</div>
				)
			}
		}

	}
	_renderListHandle(item,key){
		var selectedClass=classnames({'':!item.checboxBool,'selectedOn':item.checboxBool == true});//选择之后的样式
		var selectedHtml=classnames({'选择':!item.checboxBool,'已选择':item.checboxBool});//选择之后的名字
		return 	<li key={key}>
				    <dl>
				        <dt title={item.name}>{item.name}</dt>
				        <dd>
				            <a href="javascript:;" onClick={(evt)=>this._clickFilterValueHandle(evt,item)} className={selectedClass}>{selectedHtml}</a>
				        </dd>
				    </dl>
				</li>
	}
	_clickFilterValueHandle(evt,item){//点击处理筛选值的方法
		evt.stopPropagation();
		var selectedData = [];
		for(var i=0;i<this.state.selectedData.length;i++){
			if(item.id!=this.state.selectedData[i].id)
			selectedData.push(this.state.selectedData[i])
		}
		if(!item.checboxBool){
			item.checboxBool = !item.checboxBool;
			selectedData.push(item)
		}
		App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-VALEU',{
			col:this.props.col,
			row:this.props.row,
			selectedData:selectedData,
			dbField:this.props.dbField
		});
	}
	_getFilterValueHandle(selectedData,currentPageNo,value){//获取筛选值的方法
		var _this = this;
		var data = {
			fieldName:this.props.dbField,
			value:value,
            currentPageNo:this.state.currentPageNo,
            selectedData:selectedData
		}
		FilterFiledsStore.getPageFieldDataWithFilter(this.state.reportInfo.metadataId, data, this.state.reportInfo.filterFields,true).then(
				function (result) {
					if(_this.compunentIsMounted){
                        // 修复BUG : #6676 生产环境驾驶舱筛选器有问题
                        // XuWenyue : 2017-01-23
                        let listData = result.data;
                        if (1 < _this.state.currentPageNo) {
                            listData = _this.state.listData.concat(listData);
                        }

                        _this.setState(function(state) {
                            state.listData = listData;
                            state.totalRows = result.totalRows;
                            state.loading  = false;
                            state.value    = value;
                            return {state}
                        });
					}
				}
			);
	}
	_scrollBrar() {
		var _this = this;
		$(".listComponentSelect").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark",
			callbacks:{
				onTotalScroll:function(){
					_this._onPageData();
				}
			}
		});
	}
	_onPageData(){//滚动加载更多
		var _this = this;
		_this.props.loadingText('加载中...')
		if(parseInt(this.state.totalRows/50)>=this.state.currentPageNo){
			var currentPageNo = this.state.currentPageNo+1;
			_this.setState({
				currentPageNo:currentPageNo
			},function(){
				_this._getFilterValueHandle(this.state.selectedData,'',this.state.inputValue)
				_this.props.loadingText(null)
			})
		}else{
			_this.props.loadingText('已经是最后一页了')
			setTimeout(function(){
				_this.props.loadingText('')
			},3000)
		}
	}
}
export default FilterValueComponent;
