/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import classnames from 'classnames';
import DefaultFilterSearchComponent from './DefaultFilterSearchComponent';
import DefaultFilterListConmponent from './DefaultFilterListConmponent';
import ReportDateRangeSelector from '../../common/ReportDateRangeSelector';
import FilterFiledsStore from '../../../stores/FilterFieldsStore';
import PublicButton from '../../common/PublicButton';
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
            reportInfo: this.props.reportInfo,
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			filterItem: nextProps.item,
			open: nextProps.open,
			seletedArr:FilterFiledsStore.getSelectedData(nextProps.item),
			dbField:nextProps.item.fieldName,
			reportId:nextProps.reportId,
			buttonIndex:nextProps.buttonIndex,
			reportInfo: this.props.reportInfo,
		})
	}
	componentDidMount(){
		//点击筛选值 修改筛选值的方法
		this.app['APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-VALEU'] = App.on('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-VALEU',this._modifyFilterValueHandle.bind(this));
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
        let SearchComponent = <DefaultFilterSearchComponent
        						seletedData={this.state.seletedArr}
        						row={this.props.row}
        						col={this.props.col}/>;
        let DialogContentComponent = <DefaultFilterListConmponent
        								row={this.props.row}
                						col={this.props.col}
        								reportId={this.state.reportId}
        								seletedArr={this.state.seletedArr}
        								reportInfo={this.state.reportInfo}
        								dbField={this.state.dbField}/>
		let contentClassName = classnames('contentClassNameDialog', {
			'contentClassNameDialogDate': this.state.filterItem.dataType == 'DATE'
		});
		let titleClassName = 'titleClassNameDialog';
		let bodyClassName = classnames('bodyClassNameDialog', {
			'dashboardDateClass': this.state.filterItem.dataType == 'DATE'
		});
		let actionsContainerClassName="actionsContainerClassNameDialog" ;
		if(this.state.filterItem.dataType == 'DATE'){
			actions = null;
			SearchComponent=null;
			if(this.state.filterItem.valueType == 'CUSTOM'){
				var dateRangeType = this.state.filterItem.valueType;
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
	            title={this.state.filterItem.name.toUpperCase()}
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
			App.emit('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS',{
                col:this.props.col,
				row:this.props.row,
				dbField:this.state.filterItem.fieldName,
				seletedArr:seletedArrDate,
				dataType:dateType
            });
    //         App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
    //             col:this.props.col,
				// row:this.props.row,
				// dbField:this.state.filterItem.fieldName,
				// seletedArr:seletedArrDate,
				// dataType:dateType
    //         })
        }else{
    		App.emit('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS',{
    			col:this.props.col,
    			row:this.props.row,
    			dbField:this.state.filterItem.fieldName,
    			seletedArr:this.state.seletedArr
    		});
    // 		App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
    //             col:this.props.col,
				// row:this.props.row,
				// dbField:this.state.filterItem.fieldName,
				// seletedArr:this.state.seletedArr,

    //         })
        }
        this._handleClose();
	}
	_handleClose(){
		App.emit('APP-DASHBOARD-REPORT-CLOSE-DEFAULT-FILTER-DIALOG',{
			col:this.props.col,
			row:this.props.row,
			dbField:this.state.filterItem.fieldName,
		});//父级组件 关闭弹出框的方法
	}
	_modifyFilterValueHandle(obj){//点击了筛选值之后 点击确定按钮执行的方法
		if(obj.col == this.props.col && obj.row==this.props.row && obj.dbField == this.state.filterItem.fieldName){
			this.setState({
				seletedArr:obj.selectedData
			})
		}
    }
}
export default FilterDialogComponent;
