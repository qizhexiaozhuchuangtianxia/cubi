import React, {
	Component
} from "react";
import TreeFilterListConmponent from './TreeFilterListConmponent';
import Loading from '../../common/Loading';
class TreeFilterFieldsConmponent extends Component {
	constructor(props) {
		super(props);
	}
	render(){
		if(this.props.loading){
			return <Loading/>
		}
		return (
			<div className="treeListBox">
				<TreeFilterListConmponent
					dimensionId={this.props.dimensionId}
					allData={this.props.allData}
					levelId={this.props.levelId}
					pid={this.props.pid} 
					col={this.props.col} 
					row={this.props.row}
					drilDownData={this.props.drilDownData}
					goBackData={this.props.goBackData}
					disableNum={this.props.disableNum}
					drilDown={this.props.drilDown}
					reprot={this.props.reprot}/>
			</div>
		);
	}
}
export default TreeFilterFieldsConmponent;