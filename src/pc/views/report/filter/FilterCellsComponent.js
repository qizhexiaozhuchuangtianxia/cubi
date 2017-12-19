 import {
 	Component
 } from 'react';
 import App from 'app';
 import FilterRowsComponent from './FilterRowsComponent';
 import FilterFieldsStore from '../../../stores/FilterFieldsStore';
 class FilterCellsComponent extends Component {
 	constructor(props) {
 		super(props);
 		this.state = {
 			metadataId: this.props.metadataId,
 			cellsData: this.props.cellsData,
 			col: this.props.col
 		};
 	}
 	componentWillReceiveProps(nextProps) {
 		this.setState({
 			metadataId: nextProps.metadataId,
 			cellsData: nextProps.cellsData,
 			col: nextProps.col
 		})
 	}
 	render() {
 		var cellsData = FilterFieldsStore.setCellsData(this.state.cellsData,this.props.compareData)
 		console.log('this.state.cellsData',cellsData)
 		return (
 				<div className="selectBoxListBox">
 					 {cellsData.map((item,key)=>this._filterRowsFun(item,key))}
 				</div>
 		)
 	}
 	_filterRowsFun(item, key) {
 		let downClassName = classnames('listBox', {
 			'listBoxDown': key == 1
 		});
 		return <div key={key} className={downClassName}>
 					<FilterRowsComponent 
 						key={key}
 						metadataId={this.state.metadataId} 
 						col={this.state.col} 
 						row={key} 
 						rowItem={item.rows}
 						drilDownFilter={this.props.drilDownFilter}
 						weiduList={this.props.weiduList}
 						reportCategory={this.props.reportCategory}
 						rowTitleFields={this.props.rowTitleFields}
 						compareData={this.props.compareData}
 						filterData={this.props.filterData}/>
 				</div>
 	}
 }
 export default FilterCellsComponent;