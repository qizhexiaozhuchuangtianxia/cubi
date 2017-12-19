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
import DefaultFilterValueComponent from './DefaultFilterValueComponent';
class DefaultFilterListConmponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabValue:'selectAll',
			reportInfo: this.props.reportInfo,
		};
	}
	componentWillReceiveProps(nextProps) {
		 this.state = {
		 	reportInfo: this.props.reportInfo,
		 }
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
                </Tab>
                <Tab label="已选" value="selected" className="tabsClassName">
                    <div className="listComponentSelect">
                    	<div>
                    		{this._filterValuesHandle('seleted')}
                    	</div>
                	</div>
                </Tab>
            </Tabs>
		)
	}
	_filterValuesHandle(arg){
		return <DefaultFilterValueComponent
				row={this.props.row} 
				col={this.props.col} 
				seletedFlag={arg}
				dbField={this.props.dbField}
				reportId={this.props.reportId}
				reportInfo={this.props.reportInfo}
				selectedData={this.props.seletedArr}/> 
	}
	_tabChangeHandle(value){//tab 切换的效果方法
        this.setState(function(previousState,currentProps){
            previousState.tabValue = value;//设置切换到什么上的值
            return {previousState};
        });
    }
    
}
export default DefaultFilterListConmponent;