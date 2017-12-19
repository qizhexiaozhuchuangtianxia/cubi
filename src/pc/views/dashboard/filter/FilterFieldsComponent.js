/**
 **驾驶舱的筛选器模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import {
    FlatButton,
    FontIcon
    } from 'material-ui';
import FilterFieldsButton from './FilterFieldsButton';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class FilterFieldsComponent extends Component {
	constructor(props) {
		super(props);
		//this.app={}
		this.state = {
			clearBtnBool:true
		};
	}
	componentWillMount(){
		//this.app['APP-DASHBOARD-REPORT-CLEAR-FILTER-HANDLE'] = App.on('APP-DASHBOARD-REPORT-CLEAR-FILTER-HANDLE',this._clearFilterBtnHandle.bind(this));
        this.setState({
            filterFields:this.props.filterFields,
			reportInfo: this.props.reportInfo,
        })
    }
	componentWillReceiveProps(nextProps){
		this.setState(function(state){
			let clearBtnBool = true;
			if(nextProps.filterFields.length>0){
				for (let i = 0,len=nextProps.filterFields.length; i < len; i++) {
					if(nextProps.filterFields[i].popData.length>0){
						clearBtnBool = false;
					}
				}
			}
			state.clearBtnBool = clearBtnBool;
			state.filterFields = nextProps.filterFields;
			state.reportInfo = nextProps.reportInfo;
			return {state}
		})
    }
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render() {
		var filterFields = this.state.filterFields;
		
		if(this.props.reportInfo.compare && this.props.report){
			filterFields = FilterFieldsStore.getCompareFilterFields(filterFields,this.state.reportInfo)
		}
		return (
			<div className="reportFilterBox">
			    {filterFields.map((item,key)=>this._filterFieldsListHandle(item,key))}
			    <FlatButton 
			    	icon={<FontIcon className="iconfont icon-icqingkongshaixuan18px clearIconClass" />}
			        className="clearClassName"
			        onTouchTap={()=>this._clearFilterHandle()} 
			        disabled={this.state.clearBtnBool}
			        hoverColor='rgba(250,64,128,.2)'
			        label="清空筛选" />
		    </div>
		)
	}
	// _clearFilterBtnHandle(obj){
	// 	// if(this.props.row == obj.row && this.props.col==obj.col){
	// 	// 	this.setState({
	// 	// 		clearBtnBool: obj.flag?false:true
	// 	// 	})
	// 	// }
	// }
	_filterFieldsListHandle(item,key){
		if(!item.compare){
			return <FilterFieldsButton 
					key={key}
					buttonIndex={key}
					row={this.props.row} 
                	col={this.props.col}
                	reportId={this.props.reportId} 
                	reportInfo={this.state.reportInfo}
                	item={item}
                	globalFilterFields={this.props.globalFilterFields}
                    clickHeader={this.props.clickHeader}
                    data={this.props.report}
                    drilDownData={this.props.drilDownData}
                    drilDown={this.props.drilDown}/>
        }
	}
	_clearFilterHandle(){
		//var globalSign = this.props.globalFilterSign ? true : false ; 
		GlobalFilterStore.setGlobalSign(false);
		GlobalFilterStore.setGlobalSignArr(this.props.row,this.props.col,false);
		App.emit('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',{
		    clear:true,
		    row:this.props.row,
		    col:this.props.col
		})
	}
	_setFilterFields(filterFields){
		this.setState({
            filterFields:filterFields,
			
        })
	}
}
export default FilterFieldsComponent;