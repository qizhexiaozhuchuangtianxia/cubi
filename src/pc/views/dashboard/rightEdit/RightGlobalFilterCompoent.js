/**
 **驾驶舱的筛选器-Dialog 模块
 **
 */
import {
    Component
} from 'react';
import App from 'app';
import RightFilterPopover from './RightFilterPopover';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import FilterFieldsStore from '../../../stores/FilterFieldsStore';

class RightGlobalFilterCompoent extends Component {
    constructor(props) {
        super(props);
        //var globalFilterFields=GlobalFilterStore.setFilterDisabled(this.props.reprotData.globalFilterFields,this.props.reportInfo.metadataId);
        //this._toggleShow(globalFilterFields);
        this.state = {
            open:false,
            filterListItem:[],
            anchorEl:null,
            globalFilterFields:this.props.reprotData.globalFilterFields,
        };
        this.toggleShow=true;
    }
    componentWillReceiveProps(nextProps) {
        //var globalFilterFields=GlobalFilterStore.setFilterDisabled(nextProps.reprotData.globalFilterFields,nextProps.reportInfo.metadataId);
        //this._toggleShow(globalFilterFields);
        this.setState({
            globalFilterFields:this.props.reprotData.globalFilterFields
        });

    }
    componentDidMount() {
    }

    render() {
        var globalFilterFields = this.state.globalFilterFields;
        if(this.props.reportInfo.compare){
            globalFilterFields = FilterFieldsStore.getCompareFilterFields(globalFilterFields,this.props.reportInfo)
        }
        if(globalFilterFields.length>0){
            return (
               <div className="right-global-filter">
                    <h1>全局筛选器</h1>
                    <div className="global-tit">关联全局筛选器后此分析可以被全局筛选器所控制：</div>
                    {globalFilterFields.map((item, key) => this._renderList(item, key))}

                    <RightFilterPopover
                        reprotData={this.props.reprotData}
                        open={this.state.open}
                        filterListItem={this.state.filterListItem}
                        anchorEl={this.state.anchorEl}
                        reportInfo={this.props.reportInfo}
                        setOpen={this._setOpen.bind(this)}
                        row={this.props.row}
                        col={this.props.col}
                    />
               </div>
            )
        }else{
            return null;
        }


    }
    _renderList(item,key){
        var open=item.open;
        var selName="未关联";
        if(open){
            selName=item.name;
        }
        if(item.compare){
            selName = '不可关联';
            filterTypeSet = null;
        } 
        
        var filterTypeSet = <div className="filter-type-set" onClick={(evt)=>this._selHandler(evt, item)}>{selName}</div>;
        return <div key={key} className="filter-type-right">
                    <div className="filter-type-name">{item.filterAliasName}</div>
                    {filterTypeSet}
                </div>
    }
    _selHandler(evt,item){
        //if(item.disabled){return}
        var _this=this;
        var anchorEl=evt.currentTarget;
        var list=[];
        list.push({
            name:'未关联',
            open:false,
            row:item.row,
            col:item.col,
            dimensionId:item.dimensionId,
            metadataId:item.metadataId,
            sign:item.sign,
            disabled:false,
            reportRow:this.props.row,
            reportCol:this.props.col,
            type:'no',
            filterType:item.filterType
        });
        let metadataId = item.filterType === "DATE_FILTER" ? this.props.reportInfo.metadataId : item.metadataId;

        if (metadataId) {
            GlobalFilterStore.getMetaData(metadataId).then(function (data) {

                // TODO 如果立方信息获取失败怎么办 sucess：false的时候

                let columns = data.dataObject.metadataColumns;
                for (let i = 0; i < columns.length; i++) {

                    if ('dimension' !== columns[i].dmType) {
                        /* 非维度 */
                        continue;
                    }

                    /* 日期维度关联 */
                    if ('DATE_FILTER' === item.filterType) {
                        if ('DATE' !== columns[i].dataType) {
                            continue;
                        }
                    }
                    else {
                        /* 关联维度表的维度 */
                        if (columns[i].dimensionId) {
                            if (item.dimensionId !== columns[i].dimensionId) {
                                /* 有维度表关联，但是不是当前维度 */
                                continue;
                            }
                        }
                        else {
                            if (item.name !== columns[i].name) {
                                /* 普通维度，但是维度不匹配 */
                                continue;
                            }
                        }
                    }

                    columns[i].metadataId = item.metadataId;
                    columns[i].row = item.row;
                    columns[i].col = item.col;
                    columns[i].reportRow = item.reportRow;
                    columns[i].reportCol = item.reportCol;
                    columns[i].sign = item.sign;

                    if ('DATE_FILTER' === item.filterType) {
                        columns[i].filterType = "DATE_FILTER";
                    }

                    list.push(columns[i]);
                }
                _this.setState({
                    filterListItem: GlobalFilterStore.setDimensionDisabled(_this.state.globalFilterFields, list, _this.props.row, _this.props.col, _this.props.reportInfo.metadataId),
                    open: true,
                    anchorEl: anchorEl,
                });
            });
        }
        else {
            _this.setState({
                filterListItem: list,
                open: true,
                anchorEl: anchorEl
            });
        }
    }
    _setOpen(open){
        this.setState({
            open:open,
        })
    }
    // _toggleShow(globalFilter){
    //     var toggleShow=true;
    //     for(var i=0;i<globalFilter.length;i++){
    //         if(globalFilter[i].open){
    //             toggleShow=false;
    //             break;
    //         }
    //     }
    //     App.emit('APP-DASHBOARD-SET-DEFAULT-FILTER-TOGGLE',toggleShow)
    // }
}
export default RightGlobalFilterCompoent;
