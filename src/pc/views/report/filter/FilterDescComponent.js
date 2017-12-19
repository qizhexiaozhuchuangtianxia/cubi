import {Component} from 'react';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class FilterDateDescComponent extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	filterField:this.props.filterField
	  };
	}
	componentWillReceiveProps(nextProps){
 		this.setState({
 			filterField:nextProps.filterField,
 		})
 	}
	render(){
		if(this.state.filterField.groupType=='GROUP_TITLE_FIELD'){
			var filterDesc = FilterFieldsStore.getTreeNameInfoDesc(this.state.filterField.popData);
		}else{
			var filterDesc = FilterFieldsStore.getNameInfoDesc(this.state.filterField);
		}
		if(filterDesc.length>0){
			return (
				<div className="filterPopList">
					<div className="filterPopListScroll">
						<div className="filterPopListScrollBox">
							<p>包含</p>
							<p>{filterDesc.map((item,key)=>this._nameInfoDescHandle(item,key))}</p>
						</div>
					</div>
				</div>
			)
		}else{
			return (
				<div className="filterPopList">
					<div className="filterPopListScroll">
						<div className="filterPopListScrollBox">
							<p>未筛选</p>
						</div>
					</div>
				</div>
			)
		}
		
	}
	_nameInfoDescHandle(item,key){
		return <span key={key}>{item+" "}</span>;
	}
}
export default FilterDateDescComponent;