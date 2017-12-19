import React, {
	Component
} from "react";
import TreeFilterListConmponent from './TreeFilterListConmponent';
class TreeFilterFieldsConmponent extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	render(){
		return (
			<div className="treeListBox">
				<TreeFilterListConmponent
					dimensionId={this.props.dimensionId}
					allData={this.props.allData}
					levelId={this.props.levelId}
					pid={this.props.pid} 
					col={this.props.col} 
					row={this.props.row}/>
			</div>
		);
	}
}
export default TreeFilterFieldsConmponent;