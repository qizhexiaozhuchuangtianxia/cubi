/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import classnames from 'classnames';
import FilterSearchComponent from './FilterSearchComponent';
import FilterListConmponent from './FilterListConmponent';
import ReportDateRangeSelector from '../../common/ReportDateRangeSelector';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import PublicButton from '../../common/PublicButton' ;
import {
	Dialog,
} from 'material-ui';
class FilterDialogComponent extends Component {
	constructor(props) {
		super(props);
		this.app={}
		this.state = {
			filterItem: this.props.item,
			open: this.props.open,
            seletedArr:FilterFiledsStore.getSelectedData(this.props.item),
            dbField:this.props.item.fieldName,
            reportId:this.props.reportId,
            buttonIndex:this.props.buttonIndex,
		};
	}
	componentWillReceiveProps(nextProps) {
		var seletedArr=FilterFiledsStore.getSelectedData(nextProps.item);

		var gSign=GlobalFilterStore.getGlobalSign(this.props.row,this.props.col);

		if((gSign && !nextProps.globalFilterSign) || (!gSign && nextProps.globalFilterSign)){
			seletedArr=nextProps.data.report.seletedArr||[];
		}
		this.setState({
			filterItem: nextProps.item,
			open: nextProps.open,
			seletedArr:seletedArr,
			dbField:nextProps.item.fieldName,
			reportId:nextProps.reportId,
			buttonIndex:nextProps.buttonIndex,
			reportInfo: this.props.reportInfo,
		})
	}
	componentDidMount(){
		//点击筛选值 选中 修改筛选值的方法
		this.app['APP-DASHBOARD-REPORT-MODIFY-FILTER-VALEU'] = App.on('APP-DASHBOARD-REPORT-MODIFY-FILTER-VALEU',this._modifyFilterValueHandle.bind(this));
	}
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render(){
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
        let SearchComponent = <FilterSearchComponent
        						seletedData={this.state.seletedArr}
        						row={this.props.row}
        						col={this.props.col}/>;
        let DialogContentComponent = <FilterListConmponent
        								row={this.props.row}
                						col={this.props.col}
        								reportId={this.state.reportId}
        								reportInfo={this.state.reportInfo}
        								seletedArr={this.state.seletedArr}
        								dbField={this.state.dbField}/>
		let contentClassName = classnames('contentClassNameDialog', {
			'contentClassNameDialogDate': this.state.filterItem.groupType == 'GROUP_DATE_TITLE_FIELD'
		});
		//this.state.filterItem.valueType == 'DATE_CYCLE' || this.state.filterItem.valueType == 'DATE_RANGE' || this.state.filterItem.valueType == 'DATE' || this.state.filterItem.valueType == 'CUSTOM'
		let titleClassName = 'titleClassNameDialog';
		let bodyClassName = classnames('bodyClassNameDialog', {
			'dashboardDateClass': this.state.filterItem.groupType == 'GROUP_DATE_TITLE_FIELD'
		});
		//this.state.filterItem.valueType == 'DATE_CYCLE' || this.state.filterItem.valueType == 'DATE_RANGE' || this.state.filterItem.valueType == 'DATE' || this.state.filterItem.valueType == 'CUSTOM'
		let actionsContainerClassName="actionsContainerClassNameDialog" ;

		if(this.state.filterItem.groupType == 'GROUP_DATE_TITLE_FIELD' || this.state.filterItem.valueType == 'DATE_CYCLE' || this.state.filterItem.valueType == 'DATE_RANGE' || this.state.filterItem.valueType == 'DATE' || this.state.filterItem.valueType == 'CUSTOM'){
			actions = null;
			SearchComponent=null;
			if(this.state.filterItem.valueType=='DATE_RANGE' || this.state.filterItem.valueType == 'CUSTOM' || this.state.filterItem.valueType == 'DATE'){
				var dateRangeType = 'CUSTOM';
				var startDate = this.state.filterItem.popData[0];
				var endDate = this.state.filterItem.popData[1];
				DialogContentComponent = <ReportDateRangeSelector
										reportInfo={this.state.reportInfo}
										dbField={this.state.dbField}
					                    dateRangeType={dateRangeType}
					                    startDate={startDate}
					                    endDate={endDate}
					                    onCancel={this._handleClose.bind(this)}
					                    onOK={this._handleSubmitHandle.bind(this)}/>
			}else{
				var dateRangeType = this.state.filterItem.popData[0];
					DialogContentComponent = <ReportDateRangeSelector
											reportInfo={this.state.reportInfo}
											dbField={this.state.dbField}
						                    dateRangeType={dateRangeType}
						                    onCancel={this._handleClose.bind(this)}
						                    onOK={this._handleSubmitHandle.bind(this)}/>
			}
		}
		return (
			<Dialog
	            contentClassName={contentClassName}
	            titleClassName={titleClassName}
	            bodyClassName={bodyClassName}
	            actionsContainerClassName={actionsContainerClassName}
	            title={this.props.item.name.toUpperCase()}
	            actions={actions}
	            modal={false}
	            open={this.state.open}
	            onRequestClose={this._handleClose.bind(this)}>
	            {SearchComponent}
	            {DialogContentComponent}
	        </Dialog>
		)
	}
	_handleSubmitHandle(result){
		if(!this.props.submit){
			//设置全局筛选标记
			var globalSign = this.props.globalFilterSign ? true : false ;
			GlobalFilterStore.setGlobalSign(globalSign);
			GlobalFilterStore.setGlobalSignArr(this.props.row,this.props.col,false);
			var sign=false;
			if(this.props.data && this.props.data.report){
				sign=this.props.data.report.sign
			}
			if(result.type != 'mouseup'){
				let seletedArrDate = [result.type];
				let dateType = 'DATE_CYCLE';
				if(result.type == 'CUSTOM'){
					seletedArrDate = [result.startDate,result.endDate];
					dateType = result.type;
					this.setState({
						dateRangeType:result.type,
						startDate:result.startDate,
	                    endDate:result.endDate
					})
				}else{
					this.setState({
						dateRangeType:result.type,
					 	startDate:null,
	                    endDate:null
					})
				}

				App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
	                col:this.props.col,
					row:this.props.row,
					dbField:this.state.dbField,
					fieldName:this.state.dbField,
					seletedArr:seletedArrDate,
					dateType:dateType,
					groupType:"",
					globalFilterSign:this.props.globalFilterSign,
					metadataId:this.state.reportInfo.metadataId,
					dimensionId:this.props.item.dimensionId,
					filterType:this.props.filterType,
					name:this.props.item.name,
					sign:sign,
	            })
	        }else{
	    		App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
	    			col:this.props.col,
	    			row:this.props.row,
	    			dbField:this.state.dbField,
	    			fieldName:this.state.dbField,
	    			seletedArr:this.state.seletedArr,
	    			groupType:"",
					globalFilterSign:this.props.globalFilterSign,
					metadataId:this.state.reportInfo.metadataId,
					dimensionId:this.props.item.dimensionId,
					filterType:this.props.filterType,
					name:this.props.item.name,
					sign:sign,
	    		})
	        }
	        App.emit('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG');//父级组件 关闭弹出框的方法
	    }else{
	    	var seletedArrDate = this.state.seletedArr;
	    	if(result.type != 'mouseup'){
				seletedArrDate = [result.type];
				let dateType = 'DATE_CYCLE';
				if(result.type == 'CUSTOM'){
					seletedArrDate = [result.startDate,result.endDate];
					dateType = result.type;
					this.setState({
						dateRangeType:result.type,
						startDate:result.startDate,
	                    endDate:result.endDate
					})
				}else{
					this.setState({
						dateRangeType:result.type,
					 	startDate:null,
	                    endDate:null
					})
				}
				//selectedData = [result.startDate,result.endDate];
			}
	    	this.props.submit({
	    		groupType:"",
	    		selectedData:seletedArrDate,
	    		valueType:this.props.item.dataType,
	    		dataType: result.type == 'CUSTOM' ? 'DATE_RANGE' : 'DATE_CYCLE'
	    	});
	    }
	}
	_handleClose(){
		if(!this.props.close){
			App.emit('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG');//父级组件 关闭弹出框的方法
		}else{
			this.props.close();
		}
	}
	_modifyFilterValueHandle(obj){//点击了筛选值之后 点击确定按钮执行的方法
		if(obj.col == this.props.col && obj.row==this.props.row && obj.dbField == this.state.dbField){
			this.setState({
				seletedArr:obj.selectedData
			})
		}
    }
}
export default FilterDialogComponent;
