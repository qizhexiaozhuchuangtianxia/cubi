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
import DrilDownStore from '../../../stores/DrilDownStore';
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
		let levleIdObj=FilterFieldsStore.reportFilterMatchGlobalFilter(objAllData,this.props.levelId,this.props.pid,this.props.goBackData)
		let drilDownData=FilterFieldsStore.setReortFilterToDrilDownData(objAllData,this.props.drilDownData,this.props.dimensionId,levleIdObj)
		this.state = {
			treeData:[],
			goBackData:this.props.goBackData,
			allData:objAllData,
			levelId:levleIdObj.levelId,
			pid:levleIdObj.pid,
			inputValue:'',
			disableNum:this.props.disableNum,
			drilDownData:drilDownData
		};
	}
	componentWillMount() {
	}
	componentDidMount(){
		//点击筛选值 确定的方法
 		this.app['APP-DASHBOARD-CLICK-QUEDING-HANDLE'] = App.on('APP-DASHBOARD-CLICK-QUEDING-HANDLE',this._clickQueDingHandle.bind(this));
 		//点击返回执行的方法
 		this.app['APP-DASHBOARD-CLICK-GOBACK-HANDLE'] = App.on('APP-DASHBOARD-CLICK-GOBACK-HANDLE',this._clickGoBackHandle.bind(this));
 		//搜索方法
 		this.app['APP-DASHBOARD-SEARCH-DATA-HANDLE'] = App.on('APP-DASHBOARD-SEARCH-DATA-HANDLE',this._searchTreeFilterHandle.bind(this));
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
    componentWillReceiveProps(nextProps) {

		let levleIdObj=FilterFieldsStore.reportFilterMatchGlobalFilter(this.state.allData,this.state.levelId,this.state.pid,this.state.goBackData)
		let drilDownData=FilterFieldsStore.setReortFilterToDrilDownData(this.state.allData,nextProps.drilDownData,nextProps.dimensionId,levleIdObj)
    	this.setState({
			disableNum:nextProps.disableNum,
			levelId:levleIdObj.levelId,
			pid:levleIdObj.pid,
			drilDownData:drilDownData,
		});
    }
	render() {
		let levelId=this.state.levelId;
		let pid=this.state.pid;
		let listData = FilterFieldsStore.getDashboardListData(this.state.allData,levelId,this.state.inputValue);
		let listDatasArr = FilterFieldsStore.getTreeList(listData,pid,this.state.allData,levelId);
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
	_searchTreeFilterHandle(obj){//搜索方法
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.props.dimensionId==obj.dimensionId){
			this.setState({
				inputValue:obj.inputValue
			})
		}
	}
	_clickGoBackHandle(){
		let goBackShow;
		this.setState(function(state){
			state.levelId = state.levelId-1;
			if(this.state.disableNum>0){
				state.disableNum=this.state.disableNum-1;
			}
			if(state.levelId==0){
				state.pid = 0;
				goBackShow = false;
			}else{
				state.pid = state.goBackData['level_'+state.levelId];
				goBackShow = true;
			}
			App.emit('APP-DASHBOARD-SHOW-BACK-BUTTON-HANDLE',{
				dimensionId:this.props.dimensionId,
				goBackShow:goBackShow,
				row:this.props.row,
				col:this.props.col,
				disableNum:state.disableNum
			});
			App.emit('APP-DASHBOARD-SHOW-PATH-HANDLE',{
				dimensionId:this.props.dimensionId,
				levelId:state.levelId,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-RESET-SEARCH-HANDLE',{
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
		var colors={}
		if(this.state.disableNum==0){
			colors={
				color:'rgba(255,255,255,0.3)'
			}
		}
		if(item.child){
			childClass = "iconfont icon-icchevronright24px openSrcClass";
		}
		if(item.checboxBool){
			checboxBoolClass = "iconfont icon-icqueding24px seletedClass";
		}
		return (
			<div key={key} className="true-list-li">
				<span className={checboxBoolClass}></span>
				<div className="title" onClick={(evt)=>this._onTouchTapHandle(evt,item,this.state.disableNum)} style={colors}>{item.name}</div>
				<span className={childClass} onClick={(evt)=>this._clickHandle(evt,item)}></span>
			</div>
		)

	}
	_clickQueDingHandle(arg){//点击确定执行的方法
		if(arg.custom){
			App.emit('APP-TREEFILTER-GIT-DATA',{
				allData:this.state.allData
			})
		}else{
			App.emit("APP-DASHBOARD-QUEDING-BUTTON-HANDLE",{
				allData:this.state.allData,
				dimensionId:this.props.dimensionId,
				row:this.props.row,
				col:this.props.col,
				globalFilterSign:arg.globalFilterSign
			});
		}
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
			var disableNum=this.state.disableNum;
			if(disableNum>0){ 
				disableNum+=1;
			}else{
				disableNum=FilterFieldsStore.setDashboradFilterDisable(this.state.drilDownData,item,this.props.dimensionId,this.state.disableNum);
			}
			// if(!this.props.drilDown){
			// 	disableNum=undefined;
			// }
			App.emit('APP-DASHBOARD-SHOW-BACK-BUTTON-HANDLE',{
				dimensionId:this.props.dimensionId,
				goBackShow:goBackShow,
				row:this.props.row,
				col:this.props.col,
				disableNum:disableNum
			});
			App.emit('APP-DASHBOARD-SHOW-PATH-HANDLE',{
				dimensionId:this.props.dimensionId,
				levelId:state.levelId,
				row:this.props.row,
				col:this.props.col,
			});
			App.emit('APP-DASHBOARD-RESET-SEARCH-HANDLE',{
				dimensionId:this.props.dimensionId,
				row:this.props.row,
				col:this.props.col,
			});
			return {state}
		})
	}
	_onTouchTapHandle(evt,item,disableNum){//点击选中效果
		evt.stopPropagation();
		if(disableNum==0){return;}
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