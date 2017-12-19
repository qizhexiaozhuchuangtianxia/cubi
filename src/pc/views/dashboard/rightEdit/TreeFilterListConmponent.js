/**
 **驾驶舱的筛选器-FilterValue 模块
 **
 */
var $ = require('jquery');
import {
	Component
} from 'react';
import App from 'app';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
var Loading = require('../../common/Loading');
import {
	List,
	ListItem,
	FontIcon,
} from 'material-ui';
class TreeFilterValueComponent extends Component {
	constructor(props) {
		super(props);
		this.app = {};
		let strAllData = JSON.stringify({data:this.props.allData});
		let objAllData = JSON.parse(strAllData).data;
		this.state = {
			treeData:[],
			goBackData:{},
			allData:objAllData,
			levelId:this.props.levelId,
			pid:this.props.pid,
			inputValue:''
		};
	}
	componentDidMount(){
		//点击筛选值 确定的方法
 		this.app['APP-DASHBOARD-DEFAULT-CLICK-QUEDING-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-CLICK-QUEDING-HANDLE',this._clickQueDingHandle.bind(this));
 		//点击返回执行的方法
 		this.app['APP-DASHBOARD-DEFAULT-CLICK-GOBACK-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-CLICK-GOBACK-HANDLE',this._clickGoBackHandle.bind(this));
		//搜索方法
 		this.app['APP-DASHBOARD-DEFAULT-SEARCH-DATA-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-SEARCH-DATA-HANDLE',this._searchTreeFilterHandle.bind(this));
		this._scrollBrar();
	}
	componentDidUpdata(){
		this._scrollBrar();
	}
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render() {
		let listData = FilterFieldsStore.getDashboardListData(this.state.allData,this.state.levelId,this.state.inputValue);
		let listDatasArr = FilterFieldsStore.getTreeList(listData,this.state.pid,this.state.allData,this.state.levelId);
		if (listDatasArr.length > 0) {
			return 	(
				<div className="treeListScrollBox">
					<List>
						{listDatasArr.map((item, key)=>this._treeListHandle(item, key))}
					</List>
				</div>		
			)
		} else {
			return (
				<div className="nullDataClassName">没有搜索到选值</div>
			);
		} 
	}
	_scrollBrar() {//添加滚动条
		$('.treeListBox').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark",
		});
	}
	_clickGoBackHandle(){
		let goBackShow;
		this.setState(function(state){
			state.levelId = state.levelId-1;
			if(state.levelId==0){
				state.pid = 0;
				goBackShow = false;
			}else{
				state.pid = state.goBackData['level_'+state.levelId];
				goBackShow = true;
			}
			App.emit('APP-DASHBOARD-DEFAULT-SHOW-BACK-BUTTON-HANDLE',{
				dimensionId:this.props.dimensionId,
				goBackShow:goBackShow,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-DEFAULT-SHOW-PATH-HANDLE',{
				dimensionId:this.props.dimensionId,
				levelId:state.levelId,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-DEFAULT-RESET-SEARCH-HANDLE',{
				dimensionId:this.props.dimensionId,
				row:this.props.row,
				col:this.props.col,
			});
			return {state}
		})
	}
	_treeListHandle(item,key){
		var childClass = 'hide';
		var checboxBoolClass = 'hide';
		if(item.child){
			childClass = "iconfont icon-icchevronright24px openSrcClass";
		}
		if(item.checboxBool){
			checboxBoolClass = "iconfont icon-icqueding24px seletedClass";
		}
		return (
			<div key={key} className="true-list-li">
				<span className={checboxBoolClass}></span>
				<div className="title" onClick={(evt)=>this._onTouchTapHandle(evt,item)}>{item.name}</div>
				<span className={childClass} onClick={(evt)=>this._clickHandle(evt,item)}></span>
			</div>
		)
	}
	_searchTreeFilterHandle(obj){//搜索方法
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.props.dimensionId==obj.dimensionId){
			this.setState({
				inputValue:obj.inputValue
			})
		}
	}
	_clickQueDingHandle(){//点击确定执行的方法
		App.emit("APP-DASHBOARD-DEFAULT-QUEDING-BUTTON-HANDLE",{
			allData:this.state.allData,
			dimensionId:this.props.dimensionId,
			row:this.props.row,
			col:this.props.col
		});
	}
	_clickHandle(evt,item){//点击进到下一级
		evt.stopPropagation();
		let goBackShow;
		this.setState(function(state){
			state.levelId = item.levelLen+1;
			state.pid = item.id;
			if(item.levelLen == -1){
				goBackShow = false;
				state.goBackData={}
			}else{
				goBackShow = true;
				state.goBackData['level_'+state.levelId] = state.pid;
			}
			App.emit('APP-DASHBOARD-DEFAULT-SHOW-BACK-BUTTON-HANDLE',{
				dimensionId:this.props.dimensionId,
				goBackShow:goBackShow,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-DEFAULT-SHOW-PATH-HANDLE',{
				dimensionId:this.props.dimensionId,
				levelId:state.levelId,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-DEFAULT-RESET-SEARCH-HANDLE',{
				dimensionId:this.props.dimensionId,
				row:this.props.row,
				col:this.props.col,
			});
			return {state}
		})
	}
	_onTouchTapHandle(evt,item){//点击选中效果
		evt.stopPropagation();
		let listData = FilterFieldsStore.getDashboardListData(this.state.allData,this.state.levelId);
		let listDatasArr = FilterFieldsStore.getTreeList(listData,this.state.pid,this.state.allData,this.state.levelId);
		let _this = this;
		this.setState(function(state){
			let obj = {
				item:item,
				listData:listDatasArr,
				dimensionId:_this.props.dimensionId,
				pid:_this.state.pid,
				row:_this.props.row,
				col:_this.props.col,
				level:item.levelLen
			}
			let allDatas = FilterFieldsStore.setTreeSeletedHandle(_this.state.allData,obj);//设置数据都是选中和不选中的效果的方法
			state.allData = allDatas;
			return {state}
		})
	}
}
export default TreeFilterValueComponent;