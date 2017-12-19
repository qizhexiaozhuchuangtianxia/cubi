/**
 **驾驶舱的右侧编辑-默认筛选器-筛选值 模块
 **
 */
import {
	Component
} from 'react';
var {
    IconButton,
} = require('material-ui');
import App from 'app';
import DefaultFilterDialogComponent from './DefaultFilterDialogComponent';
import TreeFilterDialogComponent from './TreeFilterDialogComponent';
class ReportDefaultFilterValueComponent extends Component {
	constructor(props) {
		super(props);
		this.app = {}
		this.state = {
			open:false,
			treeOpen:false,
			item: this._getItemByReportInfo(this.props.item, this.props.reportInfo),
			reportInfo: this.props.reportInfo,
			dimensionId:null,
			groupLevels:[],
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			item: nextProps.item,
			reportInfo: nextProps.reportInfo,
		})
	}
	componentDidMount(){
		//关闭驾驶舱报表默认筛选条件的弹出框的方法
        this.app['APP-DASHBOARD-REPORT-CLOSE-DEFAULT-FILTER-DIALOG'] = App.on('APP-DASHBOARD-REPORT-CLOSE-DEFAULT-FILTER-DIALOG',this._closeDialog.bind(this));
	}
	render() {
		var selectedClass=classnames({//选择之后的样式
		    'filterBtnDefault':!this.state.item.nameInfoOpen,
		    'deleteIconBtnOn':this.state.item.nameInfoOpen === true
		});
		var selectedHtml=classnames({//选择之后的名字
		    '筛选':!this.state.item.nameInfoOpen,
		    '已筛选':this.state.item.nameInfoOpen
		});
		if(this.props.item.compare){
			selectedClass = classnames({'filterBtnDefault-compare':true});
			selectedHtml = classnames({'不可选':true});
		}
		let dialogComponent = <DefaultFilterDialogComponent 
			                	row={this.props.row} 
			                	col={this.props.col} 
			                	reportId={this.props.reportId}
			                	item={this.state.item}
			                	buttonIndex={this.props.buttonIndex}
			                	reportInfo={this.props.reportInfo}
			                	open={this.state.open}/>
		if(this.state.item.groupType == "GROUP_TITLE_FIELD"){
			dialogComponent = <TreeFilterDialogComponent 
			                	row={this.props.row} 
			                	col={this.props.col} 
			                	item={this.state.item}
			                	dimensionId={this.state.item.dimensionId} 
			                	groupLevels={this.state.item.groupLevels} 
			                	metadataId={this.state.item.metadataId}
			                	reportInfo={this.state.reportInfo}
			                	open={this.state.treeOpen}/>	
		}
		return  (
			<li>
                <dl>
                    <dt>{this.state.item.name.toUpperCase()}</dt>
                    <dd>
                        <IconButton onClick={(evt)=>this._clearFilterHandle(evt)} className="deleteIconBtn" iconClassName='iconfont icon-icshanchu24px'></IconButton>
                        <a href="javascript:;" onClick={(evt)=>this._openHandle(evt,this.state.item)} className={selectedClass}>{selectedHtml}</a>
                    </dd>
                </dl>
                {dialogComponent}
            </li>
        )
	}
	_closeDialog(obj){
		if(obj.dimensionId){
			if(this.props.col==obj.col&&this.props.row==obj.row&&this.state.item.dimensionId==obj.dimensionId){
				this.setState({
					open:false,
					treeOpen:false,
				})
			}
		}else{
			if(this.props.col==obj.col&&this.props.row==obj.row&&this.state.item.fieldName==obj.dbField){
				this.setState({
					open:false,
					treeOpen:false,
				})
			}
		}
	}
	_openHandle(evt,item){
		evt.stopPropagation();
		if(!this.props.item.compare){
			if(item.groupType == "GROUP_TITLE_FIELD"){
				this.setState({
					treeOpen:true,
				});
			}else{
				this.setState({
					open:true
				});
			}
		}
	}
	_clearFilterHandle(evt){
		evt.stopPropagation();
		if(!this.props.item.compare){
			App.emit('APP-DASHBOARD-REPORT-MODIFY-DEFAULT-FILTER-FIELDS',{
			    clear:true,
			    row:this.props.row,
			    col:this.props.col,
			    dbField:this.state.item.fieldName,
			})
		}
	}
	_getItemByReportInfo(itemOld, reportInfo){
		let columnArr = this._getColumnArrByReportInfo(reportInfo);
		for(let i=0; i<columnArr.length; i++){
            if (itemOld.name === columnArr[i].name){
                if((columnArr[i].customName) && ("" !== columnArr[i].customName)) {
                    itemOld.name = columnArr[i].customName;
                }else if(columnArr[i].level && columnArr[i].type){
                    itemOld.name = columnArr[i].name + "_" + columnArr[i].level;
                }else{
                    itemOld.name = columnArr[i].name;
                }

                break;
			}
		}

		return itemOld;
	}
	_getColumnArrByReportInfo(reportInfo){
		var columnArrTmp = [];
		if(reportInfo.category === "CHART"){
			columnArrTmp = reportInfo.categoryFields.concat(reportInfo.indexFields);
		}else if(reportInfo.category === "INDEX"){
			columnArrTmp = reportInfo.rowTitleFields.concat(reportInfo.indexFields);;
		}else{
			//TODO
		}

		return columnArrTmp;
	}
}
export default ReportDefaultFilterValueComponent;