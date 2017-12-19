import {
	Component
} from 'react';
import App from 'app';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import {
	List,
	ListItem,
	FontIcon,
} from 'material-ui';
class TreeListComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		this.state = {
			listData:props.listData,
			currentPageNo:1,
			pageSize:props.pageSize,
			row:props.row,
			col:props.col
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			listData:nextProps.listData,
			pageSize:nextProps.pageSize,
			row:nextProps.row,
			col:nextProps.col
		});
		
	}
	componentDidMount() {
 		//当点击树形之后 刷新值
 		this.app['APP-REPORT-SELETED-TREE-FILTER-GET-PAGE'] = App.on('APP-REPORT-SELETED-TREE-GET-PAGE', this._page.bind(this));
	}
	componentWillUnmount() {
 		for (let i in this.app) {
 			this.app[i].remove();
 		}
 	}
	render(){
		var listData = this.state.listData;
		if(listData.length>this.state.currentPageNo*this.state.pageSize){
			listData = listData.slice(0,this.state.currentPageNo*this.state.pageSize)
		}
		return 	(
			<div className="treeListScrollBox">
				<List>
					{listData.map((item, key)=>this._treeListHandle(item, key))}
				</List>
			</div>
		)
	}
	_page(currentPageNo,row,col){
		if(row==this.state.row&&col==this.state.col){
			this.setState(function(prevState){
				prevState.currentPageNo = currentPageNo;
				return prevState;
			})
		}
	}
	_treeListHandle(item, key) { //输出筛选的值的方法

		let index = key;
		var childClass = 'hide';
		var checboxBoolClass = 'hide';
		if(item.child){
			childClass = "iconfont icon-icchevronright24px openSrcClass";
		}
		if(item.checboxBool){
			if(item.checboxBool==2){
				checboxBoolClass = "iconfont icon-icqueding24px seletedClass seletedClass2";
			}else{
				checboxBoolClass = "iconfont icon-icqueding24px seletedClass";
			}
		}
		
		
		var style={
			disables:{}
		}
		if(this.props.disableNum==0){
			style.disables={
				color:'rgba(255,255,255,0.3)'
			}
		}
		return (
			<div key={key} className="true-list-li">
				<span className={checboxBoolClass}></span>
				<div className="title" onClick={(evt)=>this._onTouchTapHandle(evt,item,this.props.disableNum)} style={style.disables}>{item.name}</div>
				<span className={childClass} onClick={(evt)=>this._clickHandle(evt,item)}></span>
			</div>
		)
	}
	_clickHandle(evt,item){//点击进到下一级
		evt.stopPropagation();
		var disableNum=this.props.disableNum;
		if(disableNum>0){
			disableNum=disableNum+1;
		}else{
			disableNum=FilterFiledsStore.setFilterDisable(this.props.drilDownFilter,item,this.props.dimensionId,this.props.disableNum);
		}
		App.emit('APP-REPORT-CLICK-TREE-FILTER-HANDLE',{item:item,allData:this.props.allData,row:this.props.row,col:this.props.col,disableNum:disableNum});
	}
	//判断是否可以点击
	_onTouchTapHandle(evt,item,clickDisable){//点击选中效果
		evt.stopPropagation();
		if(clickDisable==0){return}
		var obj={
			item:item,
			pid:this.props.pid,
			row:this.props.row,
			col:this.props.col,
			level:item.levelLen,
			listData:this.state.listData,
			clickNext:true,
			goBackShow:this.props.goBackShow,
			goBackData:this.props.goBackData
		}
		FilterFiledsStore[this.props.dimensionId]=obj;//clickNextObj
		App.emit('APP-REPORT-SELETED-TREE-FILTER-HANDLE',obj);
	}
	_checkboxHandle(index, item) { //点击筛选值执行的方法
		let _this = this;
		evt.stopPropagation();
		let selectedData = []; 
		for (let i = 0; i < this.state.selectedData.length; i++) {
			if (item.name != this.state.selectedData[i].name)
				selectedData.push(this.state.selectedData[i])
		}
		if (!item.checboxBool) {
			item.checboxBool = !item.checboxBool;
			selectedData.push(item)
		}
		App.emit('APP-REPORT-CLICK-FILTER-VALUE-HANDLE', {
			col: _this.state.col,
			row: _this.state.row,
			selectedData: selectedData
		})
	}
}
export default TreeListComponent;