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
import CompareButton from './CompareButton';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class CompareComponent extends Component {
	constructor(props) {
		super(props);
		this.app={};
		this.state = {
			reportInfo:this.props.reportInfo,
			scenes:this._setData(this.props.reportInfo)
		};
	}
	componentWillMount(){
	}
	componentWillReceiveProps(nextProps){
		this.state = {
			reportInfo:nextProps.reportInfo,
			scenes:this._setData(nextProps.reportInfo)
		};
    }
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
    }
	render() {
		if(this.state.reportInfo.compare){
			return (
				<div className="dashboardCompareBox reportFilterBox">
				    {this.state.scenes.map(this._renderCompareList.bind(this))}
			    </div>
			)
		}else{
			return null;
		}
	}
	_renderCompareList(item,index){
		return (
			<CompareButton key={index} index={index} item={item} row={this.props.row} col={this.props.col}/>
		)
	}
	_setData(reportInfo){
		reportInfo = App.deepClone(reportInfo);
		var scenes = [];
		/*scenes.push({
			sceneName:"对比",
			filterFields:[],
			displayInCompare:false
		})*/
		if(reportInfo.compare){
			var compareDimension = reportInfo.compareInfo.compareDimension;
			compareDimension.map(function(item,index){
				if(item.selected){
					item.scenes.map(function(scItem,scIndex){
						scItem.weiItem = item.weiItem;
						scenes.push(scItem);
					})
				}
			})
		}
		return scenes;
	}
}
export default CompareComponent;