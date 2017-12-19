/**
 **驾驶舱的筛选器-FilterList 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
var { 
    Tabs,
    Tab
} = require('material-ui');
import FilterValueComponent from './FilterValueComponent';
import ReportStore from '../../../stores/ReportStore';
class FilterListConmponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabValue:'selectAll',
			loadingText:'',
			reportInfo: this.props.reportInfo,
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			reportInfo: this.props.reportInfo,
		});
	}
	render() {
		return (
			<Tabs value={this.state.tabValue} onChange={()=>this._tabChangeHandle()} inkBarStyle={{backgroundColor:"#00e5ff"}}>
                <Tab label="全部" value="selectAll" className="tabsClassName">
                    <div className="listComponentSelect">
                    	<div>
                    		{this._filterValuesHandle()}
                    	</div>
                	</div>
                	<div className="fieldLoadingPage">{this.state.loadingText}</div>
                </Tab>
                <Tab label="已选" value="selected" className="tabsClassName">
                    <div className="listComponentSelect">
                    	<div>
                    		{this._filterValuesHandle('seleted')}
                    	</div>
                	</div>
                	<div className="fieldLoadingPage">{this.state.loadingText}</div>
                </Tab>
            </Tabs>
		)
	}
	_filterValuesHandle(arg){
		return <FilterValueComponent
				row={this.props.row} 
				col={this.props.col} 
				seletedFlag={arg}
				dbField={this.props.dbField}
				reportId={this.props.reportId}
				reportInfo={this.props.reportInfo}
				loadingText = {this._setLoadingText.bind(this)}
				selectedData={this.props.seletedArr}/> 
	}
	_tabChangeHandle(value){//tab 切换的效果方法
        this.setState(function(previousState,currentProps){
            previousState.tabValue = value;//设置切换到什么上的值
            return {previousState};
        });
    }
    _setLoadingText(text){
		this.setState({
			loadingText:text
		})
	}
    
}
export default FilterListConmponent;