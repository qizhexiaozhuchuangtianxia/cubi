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
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import DrilDownStore from '../../../stores/DrilDownStore';
import PublicButton from '../../common/PublicButton' ;
import {
	Dialog,
	IconButton
} from 'material-ui';
class FilterDialogComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		this.gSign=true;
		var levelId=0;
		var pid=0;
		var seletedArr=FilterFieldsStore.getSelectedData(this.props.item);
		var goBackShow=false;
		var goBackData={};
		if(!this.props.reoprt){
			//钻取，设置勾选状态
			var drilDownData=DrilDownStore.setSeletedDatas(this.props.drilDownData,this.props.dimensionId);
			if(drilDownData){
				seletedArr=drilDownData.drillFilter;
				levelId=drilDownData.levelItem.levelLen+1;
				pid=drilDownData.levelItem.id;
				goBackShow=true;
				goBackData=drilDownData.goBackData;
			}
			var disableNum=FilterFieldsStore.initFilterDisable(this.props.drilDownData,pid,this.props.dimensionId);
		}
		this.state = {
			open: this.props.open,
			dimensionId : this.props.dimensionId,
			metadataId : this.props.metadataId,
            reportInfo: this.props.reportInfo,
			goBackShow:goBackShow,
			seletedArr:seletedArr,
			levelId:levelId,
			pid:pid,
			allData:[],
			goBackData:goBackData,
			disableNum:disableNum,
			loading:false,
			row:this.props.row,
			col:this.props.col
		};
	}
	componentWillReceiveProps(nextProps) {
		var _this = this;
		var levelId=0;
		var pid=0;
		var goBackShow=false;
		var seletedArr=FilterFieldsStore.getSelectedData(nextProps.item);
		var goBackData=this.state.goBackData;
		var gSign=GlobalFilterStore.getGlobalSign(this.props.row,this.props.col);
		var disableNum=null;
		if((gSign && !nextProps.globalFilterSign) || (!gSign && nextProps.globalFilterSign)){
			seletedArr=nextProps.data.report.seletedArr||[];
		}
		//钻取，设置勾选状态
		var drilDownData=DrilDownStore.setSeletedDatas(nextProps.drilDownData,nextProps.dimensionId);
		if(drilDownData && drilDownData.drillLevel>-1){
			var arrLen=drilDownData.levelItemArr.length;
			var drilLevel=drilDownData.drillLevel-1;
			if(arrLen==1){
				drilLevel=0;
			}
			var levelItem=drilDownData.levelItemArr[drilLevel]
			levelId=levelItem.levelLen+1;
			pid=levelItem.id;

			seletedArr=drilDownData.drillFilter;
			goBackShow=true;
			goBackData=drilDownData.goBackData;
			disableNum=FilterFieldsStore.initFilterDisable([drilDownData],levelItem.id,this.props.dimensionId);
		}

		this.setState({
			open: nextProps.open,
			metadataId: nextProps.metadataId,
			dimensionId: nextProps.dimensionId,
			reportInfo: nextProps.reportInfo,
			seletedArr:seletedArr,
			levelId:levelId,
			pid:pid,
			goBackShow:goBackShow,
			goBackData:goBackData,
			disableNum:disableNum,
			row:nextProps.row,
			col:nextProps.col
		},function(){
			_this.getDashboardListData();
		})
	}
	componentWillMount(){
		this.getDashboardListData();
	}
	componentDidMount(){
 		//点击筛选值 点击当前选中效果
 		this.app['APP-DASHBOARD-QUEDING-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-QUEDING-BUTTON-HANDLE',this._queDingHandle.bind(this));
 		//点击显示当前点击到什么位置
 		this.app['APP-DASHBOARD-SHOW-PATH-HANDLE'] = App.on('APP-DASHBOARD-SHOW-PATH-HANDLE',this._showPathHandle.bind(this));
 		//点击是否显示返回按钮
 		this.app['APP-DASHBOARD-SHOW-BACK-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-SHOW-BACK-BUTTON-HANDLE',this._showBackHandle.bind(this));
 		this.app['APP-TREEFILTER-GIT-DATA'] = App.on('APP-TREEFILTER-GIT-DATA',this._getData.bind(this));
	}
	componentWillUnmount() {
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
					col={this.props.col}
					reprot={this.props.reprot}/>
	            <TreeFilterFieldsConmponent
					allData={this.state.allData}
					row={this.props.row}
					col={this.props.col}
					levelId={this.state.levelId}
					pid={this.state.pid}
					dimensionId={this.state.dimensionId}
					drilDownData={this.props.drilDownData}
					goBackData={this.state.goBackData}
					disableNum={this.state.disableNum}
					drilDown={this.props.drilDown}
					reprot={this.props.reprot}
					loading={this.state.loading}/>
	        </Dialog>
		)
	}
	getDashboardListData(){//获取树形筛选的值的方法
		let _this = this;
		let dimensionId=this.state.dimensionId;
		let metadataId=this.state.metadataId;
		let selectedDataTree=this.state.seletedArr;
		this.setState({
			loading:true
		})
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
		FilterFieldsStore.getTreeFilterData(dimensionId,metadataId,data,selectedDataTree).then(function(datas){
			_this.setState(function(state){
				//全局筛选 选中状态 控制_this.props.globalFilterSign GlobalFilterStore.globalSign
				state.allData = datas;
				state.loading=false;
				return {state}
			})
		})
	}
	_queDingHandle(obj){//点击树形当前的筛选是选中效果
		let _this = this;
		if(this.props.row==obj.row&&this.props.col==obj.col && this.state.dimensionId==obj.dimensionId){
			this.setState({
				seletedArr:FilterFieldsStore.setTreeFilterFields(obj.allData),//生成出来一个已选的树形结构的筛选条件,
				allData:obj.allData
			},function(){
				var sign=false;
				if(!this.props.reprot && this.props.data.report){
					sign=this.props.data.report.sign
				}
				var arg={
					col:_this.props.col,
					row:_this.props.row,
					dbField:_this.props.item.fieldName,
					fieldName:_this.props.item.fieldName,
					groupType:"GROUP_TITLE_FIELD",
					seletedArr:_this.state.seletedArr,
					globalFilterSign:obj.globalFilterSign,
					dimensionId:_this.state.dimensionId,
					metadataId:_this.state.metadataId,
					dataType:_this.props.item.dataType,
					filterType:this.props.filterType,
					name:this.props.item.name,
					sign:sign,
					curDimensionId:_this.state.dimensionId,
				}
				if(this.props.reportNum==0){
					App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER',arg);
				}
				App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',arg)
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
				goBackShow:obj.goBackShow,
				disableNum:obj.disableNum
			})
		}
	}
	_handleToggle(evt){//返回按钮的处理方法
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-CLICK-GOBACK-HANDLE');
	}
	_handleSubmitHandle(result){//点击确定 提交筛选条件刷新报表
		if(!this.props.submit){
			var globalSign = this.props.globalFilterSign ? true : false ;
			//this.gSign=globalSign;
			GlobalFilterStore.setGlobalSign(globalSign);
			GlobalFilterStore.setGlobalSignArr(this.props.row,this.props.col,false);
			App.emit("APP-DASHBOARD-CLICK-QUEDING-HANDLE",{globalFilterSign:this.props.globalFilterSign});
		}else{
			App.emit("APP-DASHBOARD-CLICK-QUEDING-HANDLE",{custom:true});
			this.props.submit({groupType:"GROUP_TITLE_FIELD",selectedData:FilterFieldsStore.setTreeFilterFields(this.selectedData.allData)});
		}
	}
	_getData(data){
		this.selectedData = data;
	}
	_handleClose(){
		if(!this.props.close){
			this.setState({
				goBackShow:false,
				levelId:0,
				pid:0,
				open:false
			})
			App.emit('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG');//父级组件 关闭弹出框的方法
		}else{
			this.props.close();
		}
	}
}
export default FilterDialogComponent;
