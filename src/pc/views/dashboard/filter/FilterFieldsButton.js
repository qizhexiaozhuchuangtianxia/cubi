/**
 **驾驶舱的筛选器-button模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import classnames from 'classnames';
import {
	FlatButton,
} from 'material-ui';
import FilterDialogComponent from './FilterDialogComponent';
import TreeFilterDialogComponent from './TreeFilterDialogComponent';
class FilterFieldsButton extends Component {
	constructor(props) {
		super(props);
		this.app={}
		this.state = {
			open:false,
			treeOpen:false,
			filterItem: this.props.item,
			reportInfo: this.props.reportInfo,
			dimensionId:null,
			groupLevels:[],
		};
	}
	componentDidMount() {
		// if(this.state.filterItem.popData.length > 0){
		// 	App.emit('APP-DASHBOARD-REPORT-CLEAR-FILTER-HANDLE',{row:this.props.row,col:this.props.col,flag:true});
		// }
        //关闭驾驶舱报表筛选条件的弹出框的方法
        this.app['APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG'] = App.on('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG',this._closeDialog.bind(this));
    }
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
    componentWillReceiveProps(nextProps) {
		this.setState({
			filterItem: nextProps.item,
			reportInfo: nextProps.reportInfo,
		})
	}
	render() {
		let filterButtonClass = classnames('filterItem', {
			'checked': this.props.item.popData.length > 0
		});
		let dialogComponent = <FilterDialogComponent 
			                	row={this.props.row} 
			                	col={this.props.col} 
			                	buttonIndex={this.props.buttonIndex} 
			                	reportId={this.props.reportId}
			                	reportInfo={this.state.reportInfo}
			                	item={this.props.item}
			                	dimensionId={this.props.item.dimensionId}
			                	metadataId={this.props.item.metadataId}
			                	open={this.state.open}
			                	globalFilterFields={this.props.globalFilterFields}
                    			globalFilterSign={false}                    		
                    			clickHeader={this.props.clickHeader}
                    			data={this.props.data}
                    			drilDownData={this.props.drilDownData}/>
		if(this.props.item.groupType == "GROUP_TITLE_FIELD"){
			dialogComponent = <TreeFilterDialogComponent 
			                	row={this.props.row} 
			                	col={this.props.col} 
			                	item={this.props.item}
			                	dimensionId={this.props.item.dimensionId} 
			                	groupLevels={this.props.item.groupLevels} 
			                	metadataId={this.props.item.metadataId}
			                	reportInfo={this.state.reportInfo}
			                	open={this.state.treeOpen}
                    			globalFilterFields={this.props.globalFilterFields}
                    			globalFilterSign={false}
                    			clickHeader={this.props.clickHeader}
                    			data={this.props.data}
                    			drilDownData={this.props.drilDownData}
                    			drilDown={this.props.drilDown}/>	
		}
		return (
			<div className={filterButtonClass}>
                <FlatButton 
                    label={this.props.item.name} 
                    onClick={(evt)=>this._handleOpen(evt,this.props.item)}
                    labelStyle={{color:'#455a64',fontWeight:'bold',fontSize:'14px'}} 
                    hoverColor='#eceeef'/>
                {dialogComponent}
            </div>
		)
	}
	_handleOpen(evt,item){
		evt.stopPropagation();
		if(item.groupType == "GROUP_TITLE_FIELD"){
			this.setState({
				treeOpen:true,
			});
		}else{
			this.setState({
				open:true
			});
		}
		//App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-SIGN',{globalFilterSign:false});
	}
	_closeDialog(){
		this.setState({
			open:false,
			treeOpen:false,
		});
	}
}
export default FilterFieldsButton;