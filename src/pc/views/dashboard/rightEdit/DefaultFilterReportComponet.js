/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
	Component
} from 'react';
import App from 'app';
import ReportDefaultComponent from './ReportDefaultComponent';
import ReportDefaultFilterComponent from './ReportDefaultFilterComponent';
class DefaultFilterReportComponet extends Component {
	constructor(props) {
	  super(props);

	  this.state = {
        typeState: this.props.category == "CHART"?this.props.reportType:'',
        reportInfo: this.props.reportInfo,
				customCellWidthArr: this.props.columnAttributes
      };
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	componentDidMount() {
		this.mounted = true;
		App.on('APP-DASHBOARD-REPORT-SET-CELL-WIDTH-HANDLE',this._setCellsAutoWidthHandle.bind(this));

	}
    componentWillReceiveProps(nextProps) {
        this.setState({
            typeState: nextProps.category == "CHART"?nextProps.reportType:'',
        })
    }
	render(){
        if(this.props.showDefaultFilter){
            return (
                <div>
                    <ReportDefaultComponent
                        row={this.props.row}
                        col={this.props.col}
                        defaultFilterFileds={this.props.defaultFilterFileds}
                        reportId={this.props.reportId}
												tables={true}
												customCellWidthArr={this.state.customCellWidthArr}
                        typeState={this.state.typeState}
                        showDefaultFilter={this.state.showDefaultFilter}
                        reportInfo={this.state.reportInfo}
                        category={this.props.category}/>
                    <ReportDefaultFilterComponent
                        row={this.props.row}
                        col={this.props.col}
                        reportId={this.props.reportId}
                        reportInfo={this.state.reportInfo}
                        defaultFilterFiledsList={this.props.defaultFilterFiledsList}/>
                </div>
            )
        }else{
            return null;
        }

	}
	_setCellsAutoWidthHandle(arg){
		if (!this.mounted) return;
		var _this = this;
		setTimeout(function() {
			_this.setState(function(previousState,currentProps){
				previousState.customCellWidthArr=JSON.stringify(arg.customCellWidthArr);
				return {previousState}
			})
		},100)

	}
}
export default DefaultFilterReportComponet;
