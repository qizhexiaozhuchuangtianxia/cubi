/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import classnames from 'classnames';
import TreeFilterSearchComponent from './TreeFilterSearchComponent';
import TreeFilterFieldsConmponent from './TreeFilterFieldsConmponent';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
import PublicButton from '../../common/PublicButton' ;
import {
	Dialog,
	IconButton
} from 'material-ui';
class FilterDialogComponent extends Component {
	constructor(props) {
		super(props);
		this.app={}
		this.componentIsMount=true;
		this.state = {
			open: this.props.open,
			dimensionId : this.props.dimensionId,
			metadataId : this.props.metadataId,
            reportInfo: this.props.reportInfo,
			goBackShow:false,
			seletedArr:FilterFieldsStore.getSelectedData(this.props.item),
			levelId:0,
			pid:0,
			allData:[],
		};
	}
	componentWillReceiveProps(nextProps) {
		var _this = this;
		this.setState({
			open: nextProps.open,
		})
	}
	componentWillMount(){
		this.getDashboardListData();
	}
	componentDidMount(){
		this.componentIsMount=true;
 		//点击筛选值 点击当前选中效果
 		this.app['APP-DASHBOARD-DEFAULT-QUEDING-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-QUEDING-BUTTON-HANDLE',this._queDingHandle.bind(this));
 		//点击显示当前点击到什么位置
 		this.app['APP-DASHBOARD-DEFAULT-SHOW-PATH-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-SHOW-PATH-HANDLE',this._showPathHandle.bind(this));
 		//点击是否显示返回按钮
 		this.app['APP-DASHBOARD-DEFAULT-SHOW-BACK-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-DEFAULT-SHOW-BACK-BUTTON-HANDLE',this._showBackHandle.bind(this));
	}
	componentWillUnmount() {
		this.componentIsMount=false;
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render(){
		let filterName = this.props.item.name.toUpperCase()+" : ";
		let currentPathArr = this.props.groupLevels.slice(0,this.state.levelId+1);
		let filterPath = 	<div className="currentPath">
								{filterName}
								{currentPathArr.map((item,key)=>this._currentPathHandle(item,key,currentPathArr))}
							</div>
		let actions = [
						<PublicButton
							style={{color:"rgba(254,255,255,0.87)"}}
							labelText="取消"
							rippleColor="rgba(255,255,255,0.25)"
							hoverColor="rgba(255,255,255,0.15)"
							secondary={true}
							onClick={this._handleClose.bind(this)}/>,

						<PublicButton
							style={{color:"rgba(0,229,255,255)"}}
							labelText="确定"
							rippleColor="rgba(0,229,255,0.25)"
							hoverColor="rgba(0,229,255,0.15)"
							primary={true}
							keyboardFocused={false}
							onClick={this._handleSubmitHandle.bind(this)}/>

        ];
        let goBackDom = "";
        if(this.state.goBackShow){
        	goBackDom = <div className="goBackBox">
							<IconButton
								iconClassName="iconfont icon-icarrowback24px"
		 						onClick={(evt)=>this._handleToggle(evt)} />
						</div>
        }
		return (
			<Dialog
	            contentClassName="contentClassNameDialog"
	            titleClassName="titleClassNameDialog"
	            bodyClassName="bodyClassNameDialog"
	            actionsContainerClassName="actionsContainerClassNameDialog"
	            actions={actions}
	            modal={false}
	            open={this.state.open}
	            onRequestClose={this._handleClose.bind(this)}>
	            {goBackDom}
	            {filterPath}
	            <TreeFilterSearchComponent
	            	dimensionId={this.state.dimensionId}
					row={this.props.row}
					col={this.props.col}/>
	            <TreeFilterFieldsConmponent
					allData={this.state.allData}
					row={this.props.row}
					col={this.props.col}
					levelId={this.state.levelId}
					pid={this.state.pid}
					dimensionId={this.state.dimensionId}/>
	        </Dialog>
		)
	}
	getDashboardListData(){//获取树形筛选的值的方法
		let _this = this;
		let dimensionId=this.state.dimensionId;
		let metadataId=this.state.metadataId;
		let selectedDataTree=this.state.seletedArr;
		let data={
		  "areaParameters": {
		    "actionType": "VIEW",
		    "preview": "false",
		    "width": "100%",
		    "height": "100%",
		    "changeChartAllowed": "true",
		    "timeAxisUsed": "true",
		    "pageParameter": {
		      "pageRowCount": 500,
		      "currentPageNo": 1
		    },
		    "filterFields":this.state.reportInfo.filterFields,
		    "chartType": null,
		    "sortParameters": []
		  }
		};
		FilterFieldsStore.getTreeFilterData(dimensionId,metadataId,data,selectedDataTree).then(function(data){
			if(_this.componentIsMount){
				_this.setState(function(state){
					state.allData = data;
					return {state}
				})
			}
		})
	}
	_queDingHandle(obj){//点击树形当前的筛选是选中效果
		let _this = this;
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.state.dimensionId==obj.dimensionId){
			this.setState({
				seletedArr:FilterFieldsStore.setTreeFilterFields(obj.allData),//生成出来一个已选的树形结构的筛选条件,
				allData:obj.allData
			},function(){
				App.emit('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS',{
	    			col:_this.props.col,
					row:_this.props.row,
					dbField:_this.props.item.fieldName,
					groupType:_this.props.item.groupType,
					seletedArr:_this.state.seletedArr
	    		});
	    // 		App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
	    // 			col:_this.props.col,
					// row:_this.props.row,
					// dbField:_this.props.item.fieldName,
					// groupType:_this.props.item.groupType,
					// seletedArr:_this.state.seletedArr
	    // 		})
				_this._handleClose();
			})
		}
	}
	_showPathHandle(obj){
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.state.dimensionId==obj.dimensionId){
			this.setState({
				levelId:obj.levelId
			})
		}
	}
	_currentPathHandle(item,key,currentPathArr){//当前的路径方法
		if(key == currentPathArr.length-1){
			return <span key={key}>{item}</span>
		}else{
			return <span key={key}>{item} > </span>
		}
	}
	_showBackHandle(obj){
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.state.dimensionId==obj.dimensionId){
			this.setState({
				goBackShow:obj.goBackShow
			})
		}
	}
	_handleToggle(evt){//返回按钮的处理方法
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-DEFAULT-CLICK-GOBACK-HANDLE',{col:this.props.col,row:this.props.row,dimensionId:this.state.dimensionId});
	}
	_handleSubmitHandle(result){//点击确定 提交筛选条件刷新报表
		App.emit("APP-DASHBOARD-DEFAULT-CLICK-QUEDING-HANDLE");
	}
	_handleClose(){
		this.setState({
			goBackShow:false,
			levelId:0,
			pid:0,
		})
		App.emit('APP-DASHBOARD-REPORT-CLOSE-DEFAULT-FILTER-DIALOG',{row:this.props.row,col:this.props.col,dimensionId:this.state.dimensionId});//父级组件 关闭弹出框的方法
	}
}
export default FilterDialogComponent;
