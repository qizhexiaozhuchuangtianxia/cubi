/**
 **驾驶舱的筛选器模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import {
    RaisedButton
    } from 'material-ui';
import FilterDialogComponent from '../filter/FilterDialogComponent';
import TreeFilterDialogComponent from '../filter/TreeFilterDialogComponent';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class CompareButton extends Component {
	constructor(props) {
		super(props);
		this.app={};
		this.state = {
			filterFields:this.props.item.filterFields,
			item:this.props.item,
			open:false
		};
	}
	componentWillMount(){
	}
	componentDidMount(){
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			item:nextProps.item,
			filterFields:nextProps.item.filterFields
		})
    }
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render() {
		return (
			<div className="compareBox">
		    	<RaisedButton label={this.props.item.sceneName} onTouchTap={(evt)=>this.openDialog(evt)} backgroundColor="#fff" labelColor="#333"/>
		    	{this._renderFilter()}
		    </div>
		)
	}
	openDialog(){
		if(this.props.index>=0){
			this.setState({
				open:true
			})
		}else{
			this.submit();
		}
	}
	_renderFilter(){
		if(this.props.index>=0){
			var weiItem=this.state.item.weiItem||{};
			weiItem.popData=this.state.filterFields.length>0 ? this.state.filterFields[0].value : [] ;
			if(weiItem.groupType==""){
				weiItem.popData=this.state.filterFields.length>0 ? this.state.filterFields[0].items : [] ;
			}
			if(weiItem.groupType=="GROUP_DATE_TITLE_FIELD"){
				weiItem.valueType = 'DATE';
				if(weiItem.popData.length==1){
					weiItem.valueType = weiItem.popData[0];
				}
			}
			if(weiItem.groupType=="GROUP_TITLE_FIELD"){
				return <TreeFilterDialogComponent
		                dimensionId={weiItem.dimensionId}
		                metadataId={weiItem.metadataId}
		                open={this.state.open}
		                groupLevels={weiItem.groupLevels}
		                item={weiItem}
		                submit={this.submit.bind(this)}
		                close={this.closeDialog.bind(this)}
		                reportInfo={{filterFields:[]}}
		                reprot={true}/>
			}else{
				return <FilterDialogComponent
						metadataId={weiItem.metadataId}
						item={weiItem}
						reportInfo={{
							filterFields:[],
							metadataId:weiItem.metadataId
						}}
		                submit={this.submit.bind(this)}
		                close={this.closeDialog.bind(this)}
						open={this.state.open}
						reprot={true}/>;

			}
		}else{
			return null;
		}

	}
	submit(arg){
		if(arg){
			var selectedData = arg.selectedData;
			var filterFields = App.deepClone(this.state.filterFields);
			if(arg.groupType=="GROUP_TITLE_FIELD"){
				filterFields[0].value = arg.selectedData;
			}else{
				if(arg.valueType == 'DATE'){
					//var value = [selectedData[0],selectedData[1]];
					filterFields[0].value = arg.selectedData;//value;
					filterFields[0].valueType= arg.dataType;
				}else{
					var items = [];
					var value = [];
					selectedData.map(function(item,index){
						items.push({name:item.name,value:item.id});
						value.push(item.id);
					})
					filterFields[0].items = items;
					filterFields[0].value = value;
				}
			}
		}else{
			var filterFields = null;
		}
		App.emit('APP-DASHBOARD-SET-REPORTINFO-DATA',{
			compareData:{
				sceneName:this.props.item.sceneName,
				filterFields:filterFields,
				index:this.props.index
			},
			row:this.props.row,
			col:this.props.col
		})
		this.setState({
			open:false
		})
	}
	closeDialog(){
		this.setState({
			open:false
		})
	}
}
export default CompareButton;