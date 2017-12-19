/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
    Component
} from 'react';
import App from 'app';
import DataViewOfReport from '../../common/dataView/DataViewOfReport';
class ReportDefaultComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reportInfo: this.props.reportInfo,
            customCellWidthArr:this.props.customCellWidthArr
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            reportInfo: nextProps.reportInfo,
            customCellWidthArr:nextProps.customCellWidthArr
        })
    }
    render() {
        let pageSize = 7;
        let strFilterFields = JSON.stringify(this.props.defaultFilterFileds);
        if (this.props.category === "CHART") {
            return <div className="dashboardReportEdit-bar-toggle-box">
                        <div className="dashboardShowCharBox">
                            <div className="showCharBox">
                                <DataViewOfReport
                                    chartDisplaySchema="THUMBNAIL"
                                    filterFields={strFilterFields}
                                    reportId={this.props.reportId}
                                    reportInfo={this.state.reportInfo}
                                    defaultFilterFileds={this.props.defaultFilterFileds}
                                    reportType={this.props.typeState}
                                    listRightNoSort={true}/>
                            </div>
                        </div>
                    </div>
        } else {
            return <div className="dashboardReportEdit-bar-toggle-box">
                        <div className="tableReportShowBox">
                            <div className="tableReportShowBox-scroll">
                                <DataViewOfReport
                                    width={402}
                                    height={375}
                                    showPager={false}
                                    pageSize={7}
                                    tables={this.props.tables}
                                    customCellWidthArr={this.state.customCellWidthArr}
                                    filterFields={strFilterFields}
                                    defaultFilterFileds={this.props.defaultFilterFileds}
                                    reportId={this.props.reportId}
                                    reportInfo={this.state.reportInfo}
                                    reportType={this.props.typeState}
                                    listRightNoSort={true}/>
                            </div>
                        </div>
                    </div>
        }
    }
}
export default ReportDefaultComponent;
