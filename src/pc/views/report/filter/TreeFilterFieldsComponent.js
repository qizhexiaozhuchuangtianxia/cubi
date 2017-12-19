var $ = require('jquery');
import {
	Component
} from 'react';
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import Loading from '../../common/Loading';
import TreeListComponent from './TreeListComponent';
class TreeFilterFieldsComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		this.currentPageNo = 1;
 		this.listDataLength = 0;
		this.state = {
			selectedData: this.props.selectedData,
			dimensionId: this.props.dimensionId,
			col: this.props.col,
			row: this.props.row,
			allData:[],
			error: false,
			totalRows: null,
			levelId:this.props.levelId,
			pageNum:10,
			pid:this.props.pid,
			inputValue:'',
			pageSize:20
		};
	}
	componentWillReceiveProps(nextProps) {
		let _this = this;
		FilterFiledsStore.matchDataHandle(this.state.allData,nextProps.selectedData).then(function(result){
			_this.setState(function(state){
				state.selectedData = nextProps.selectedData;
				state.dimensionId = nextProps.dimensionId;
				state.col = nextProps.col;
				state.row = nextProps.row;
				state.allData = result;
				state.levelId = nextProps.levelId;
				state.pid = nextProps.pid;
				state.inputValue = '';
				return {state}
			})
		})
	}
	componentDidMount() {
 		//当点击树形之后 刷新值
 		this.app['APP-REPORT-SELETED-TREE-FILTER-HANDLE'] = App.on('APP-REPORT-SELETED-TREE-FILTER-HANDLE', this._seletedTreeFilterHandle.bind(this));
 		//当搜索 刷新值
 		this.app['APP-REPORT-SEARCH-DATA-HANDLE'] = App.on('APP-REPORT-SEARCH-DATA-HANDLE', this._searchTreeFilterHandle.bind(this));
 		this._getTreeFilterFiledsHandle();
	}
	componentDidUpdate() {
		this._scrollBrar();
	}
	componentWillUnmount() {
 		for (let i in this.app) {
 			this.app[i].remove();
 		}
 	}
	render() {
		let listObject = FilterFiledsStore.getListData(this.state.allData,this.state.levelId,this.state.inputValue,this.state.pid,this.currentPageNo,this.state.pageSize,true);
		let listData = listObject.listData;
		this.listDataLength = listObject.totalPage;
		if(this.state.allData['level_'+this.state.levelId]){
			if (listData.length > 0) {
				return (
					<div className="treeListBox" ref="treeListBox">
						<div className="treeScrollBox">
							<TreeListComponent 
								allData = {this.state.allData}
								listData={listData} 
								levelId = {this.state.levelId}
								pid={this.state.pid} 
								pageSize = {this.state.pageSize}
								totalPage = {listObject.totalPage}
								col={this.state.col} 
								row={this.state.row}
								drilDownFilter={this.props.drilDownFilter}
								dimensionId={this.state.dimensionId}
								goBackShow={this.props.goBackShow}
								goBackData={this.props.goBackData}
								selectedData={this.state.selectedData}
								weiduList={this.props.weiduList}
								disableNum={this.props.disableNum}/>
						</div>
						
					</div>
				);
			} else {
				return (
					<div className="nullDataClassName">没有搜索到选值</div>
				);
			}
		}else{
			return (
				<div className="nullDataClassName">没有搜索到选值</div>
			);
		}
		if (this.state.error) {
			return (
				<div className="nullDataClassName">{this.state.error}</div>
			);
		}
	}
	_searchTreeFilterHandle(obj){
		if(this.state.row==obj.row&&this.state.col==obj.col){
			this.setState({
				inputValue:obj.inputValue
			})
		}
	}
	_seletedTreeFilterHandle(obj){//点击树形当前的筛选是选中效果
		if(this.state.row==obj.row&&this.state.col==obj.col){
			let stateData = FilterFiledsStore.setTreeSeletedHandle(this.state.allData,obj);//设置数据都是选中和不选中的效果的方法
			this.setState({
				allData:stateData,
				levelId:obj.level,
				pid:obj.pid,
			},function(){
				this._formLevelToTreeDataHandle(obj.item);//从层级数据获取已经选中的转化成树形数据
			})
		}
	}
	_formLevelToTreeDataHandle(item){//从层级数据获取已经选中的转化成树形数据
		let _this = this;
		let treeData = FilterFiledsStore.setTreeFilterFields(this.state.allData);
		var chart=true;
		if(this.props.reportCategory=="INDEX"){
			chart=false;
		}
		var drilDownFilter=this.props.drilDownFilter;
		var filterFields= [
			{
				dimensionId:this.state.dimensionId,
				value:treeData,
				groupType:"GROUP_TITLE_FIELD"
			}
		];
		var curWei=[];
		for(var i=0;i<this.props.weiduList.length;i++){
			if(this.props.weiduList[i].dimensionId==this.state.dimensionId){
				curWei=this.props.weiduList[i];
				break;
			}
		}
		
        FilterFiledsStore.setAllDataToLevel([curWei],filterFields,this.props.drilDownFilter,false).then(function(result){
            var drill=FilterFiledsStore.replactDrilDownFilter(_this.props.drilDownFilter,result);
            App.emit('APP-REPORT-CLICK-FILTER-VALUE-HANDLE',{col:_this.state.col,row:_this.state.row,selectedData:treeData,drilDownFilter:drill});
        });
	}
	_getTreeFilterFiledsHandle(){//获取树形维度值的方法
		let _this = this;
		FilterFiledsStore.getTreeFilterFiledsHandle(this.state.dimensionId,this.state.selectedData).then(function(data) {
			_this.setState(function(state){
				state.allData=data;
				return {state}
			})
		})
	}
	_scrollBrar() {
		let _this = this;
		setTimeout(function() {
			$(_this.refs.treeListBox).mCustomScrollbar({
				autoHideScrollbar: true,
				theme: "minimal-dark",
				callbacks: {
					onTotalScroll: function() {
						_this._onPageData();
					}
				}
			});
		}, 0)
	}
	_onPageData() {
		let _this = this;
		let len = this.listDataLength;
		var totalPage = parseInt(len/this.state.pageSize)+1;
		if(this.currentPageNo<totalPage){
			this.currentPageNo += 1; 
		}
		App.emit('APP-REPORT-SELETED-TREE-GET-PAGE',this.currentPageNo,this.state.row,this.state.col);
	}
}
export default TreeFilterFieldsComponent;