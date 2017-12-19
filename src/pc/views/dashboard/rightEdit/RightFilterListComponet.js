/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
    Component
} from 'react';
import App from 'app';
import classnames from 'classnames';
import FilterSort from './FilterSort';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
class RightFilterListComponet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterListData: []
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            filterListData: nextProps.filterListData
        })
    }
    componentDidMount() {
        App.on("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE", this._filterSortClickSign.bind(this))
    }
    _filterSortClickSign(arg) {
        App.emit("APP-DASHBOARD-REPORT-FILTER-GET-DRAG-STATE", {
            isClick: arg.isClick,
            sIndex: arg.sIndex
        });
    }
    render() {
        var filterListData = this.state.filterListData;
        if (filterListData.length > 0) {
            if(this.props.reportInfo.compare){
                filterListData = FilterFieldsStore.getCompareFilterFields(this.state.filterListData,this.props.reportInfo);
            }
            return (
                <div className="dashboardReportEdit-bar-toggle-box">
                     <div className="dashboardReportEdit-bar-toggle-box-title">
                         <h1>筛选器</h1>
                         <p>打开维度筛选器可以在使用此分析时进行数据筛选：</p>
                     </div>
                     <ul className="rightFilterList">
                         {filterListData.map((item,key)=>this._filterLiHtmlHandle(item,key))}
                     </ul>
                 </div>
            )
        } else {
            return (
                <div className="dashboardReportEdit-bar-toggle-box">
                     <div className="dashboardReportEdit-bar-toggle-box-title">
                         <h1>筛选器</h1>
                         <p>打开维度筛选器可以在使用此分析时进行数据筛选：</p>
                     </div>
                     <ul></ul>
                 </div>
            )
        }
    }
    _filterLiHtmlHandle(item, index) {
        var selectedClass = classnames({
            'filterBtnDefault': !item.selected,
            'deleteIconBtnOn': item.selected
        }); //选择之后的样式
        var selectedHtml = classnames({
            '选择': !item.selected,
            '已选择': item.selected
        }); //选择之后的名字
        var filterSortPanel = <FilterSort name={item.name} index={index} row={this.props.row} col={this.props.col}/>;
        if(item.compare){
            selectedClass = classnames({'filterBtnDefault-compare': true});
            selectedHtml = classnames({'不可选':true});
            //filterSortPanel = null;
        }
        //let filterName = item.customName === "" ? item.name : item.customName;
        //if(this.props.reportInfo.category != "CHART"){
        let filterName = this._getItemNameByReportInfo(item, this.props.reportInfo);
        //}else{
        //   filterName = item.name;
        //}
        return <li key={item.name}>
                    <dl>
                        <dt>{filterName.toUpperCase()}</dt>
                        <dd>
                            {filterSortPanel}
                            <a href="javascript:;" className={selectedClass} onClick={(evt)=>this._selectHandle(evt,index,filterName,item.selected,item)}>{selectedHtml}</a>
                        </dd>
                    </dl>
                    <dl className="shadow-dl"></dl>
                </li>
    }
    _selectHandle(evt, filterIndex, filterName, filterSelected, item) {
        if(!item.compare){
            evt.stopPropagation();
            let fields = (this.state.filterListData);
            // let itemObj = {
            //     dbField: item.fieldName,
            //     name: item.name,
            //     valueType: item.fieldType,
            //     dataType: item.dataType,
            //     selected: !item.selected,
            //     value: [],
            //     items: [],
            //     pattern: ""
            // }
            let items = [];
            for (let i = 0; i < fields.length; i++) {
                if (i == filterIndex) {
                    fields[i].selected = !filterSelected;
                }
                if (fields[i].selected) {
                    let filterFieldName = this._getFilterFieldName(fields[i], i, filterIndex, filterName);
                    let obj = {
                        dbField: fields[i].fieldName,
                        name: filterFieldName,
                        valueType: fields[i].fieldType,
                        dataType: fields[i].dataType,
                        selected: !fields[i].selected,
                        value: [],
                        items: [],
                        pattern: "",
                        dimensionId: fields[i].dimensionId || "",
                        groupLevels: fields[i].groupLevels || [],
                        groupType: fields[i].groupType || "",
                        metadataId: fields[i].metadataId,
                    }
                    items.push(obj);
                }
            }
            App.emit("APP-DASHBOARD-REPORT-FILTER-SELETED-HANDLE", { //点击编辑小笔 修改筛列表是否可见
                filterIndex: filterIndex,
                selectedBool: filterSelected
            });
            App.emit("APP-DASHBOARD-REPORT-EDIT-FILTER-TOGGLE-HANDLE", { //修改筛选是否可见之后，从新渲染页面 定义在dashboard.js里面
                row: this.props.row,
                col: this.props.col,
                itemObj: items
            });
        }
    }
    _getItemNameByReportInfo(item, reportInfo){
        let nameTemp = item.name;
        let columnArr = this._getColumnArrByReportInfo(reportInfo);
        for (let i = 0; i < columnArr.length; i++) {
            if (item.name === columnArr[i].name) {
                if ((columnArr[i].customName) && ("" !== columnArr[i].customName)) {
                    nameTemp = columnArr[i].customName;
                } else if (columnArr[i].level && columnArr[i].type) {
                    nameTemp = columnArr[i].name + "_" + columnArr[i].level;
                } else {
                    nameTemp = columnArr[i].name;
                }

                break;
            }
        }

        return nameTemp;
    }
    _getFilterFieldName(field, i, filterIndex, filterName){
        let fieldNameTmp = "";
        if(field.customName !== ""){
            fieldNameTmp = field.customName;
        // }else if(i === filterIndex){
        //     fieldNameTmp = filterName;
        //     field.customName = filterName;
        }else{
            fieldNameTmp = field.name;
        }

        return fieldNameTmp;
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
export default RightFilterListComponet;