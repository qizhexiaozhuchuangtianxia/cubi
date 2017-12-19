var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DelBtn =  require('../DelBtn');
var DownFilter =  require('./DownFilter');
var DateFilter =  require('./DateFilter');
var AddCellLeft = require('../AddCellLeft');
var AddCellRight = require('../AddCellRight');
var Searchs = require('./Searchs');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');
var DragCol =  require('../DragCol');
var {
	List,
	ListItem,
	FontIcon
} = require('material-ui');

module.exports = React.createClass({
	displayName: '驾驶舱全局筛选列表',
	getInitialState: function() {
		return {
			item:{},
		}
	},
	componentWillMount: function() {
		this._setMetaDataItem(this.props.data);
	},
	componentWillReceiveProps: function(nextProps) {
		this._setMetaDataItem(nextProps.data);
	},
	componentWillUnmount:function(){

	},
	componentDidMount: function() {

	},
	render: function() {
		if(this.props.dashBoardRead){return null;}
		var delBtnBox = <DelBtn row={this.props.row} col={this.props.col} operation={this.props.operation}/>;
		var rowData = this.props.rowData;
        var colLen = rowData.cells.length;
        var DragColPanel = null;
		var DragColComponent = <DragCol 
            operation={this.props.operation} 
            row={this.props.row} 
            left={this.props.data.width-8} 
            col={this.props.col}
            clen={this.props.clen}
            colLen={colLen} />;
        if(colLen<4){
        	if(this.props.col!=colLen-1){
	             DragColPanel = DragColComponent;
	        }
        }    
		
        // if(this.props.col==0&&this.props.clen==2){
        //     DragColPanel = <DragCol operation={this.props.operation} 
        //     row={this.props.row} 
        //     left={this.props.data.width-8} 
        //     col={this.props.col}/>
        // }

		var reportShowBoxHei = this.props.data.height - 24;
		var pageSize = parseInt((reportShowBoxHei - 106) / 48);
		reportShowBoxHei = pageSize * 49 + 56 * 2 + 1;
		return (
			<div className="dashboardView_col" style={{width:this.props.data.width}}>
                    <AddCellLeft row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
                    <AddCellRight row={this.props.row} col={this.props.col} operation={this.props.operation} colLength={colLen}/>
				{DragColPanel}
                <div className="dashboardView_col_box">
                    {delBtnBox}
                    <div className="add_dashboard">
                        <div className="add_dashboard_panel" style={{height:reportShowBoxHei}}>
                            {this._filterList(reportShowBoxHei)}
                        </div>
                    </div>
                </div>
            </div>
		);

	},

	_filterList: function(hei) {

		var type = this.props.data.type;
		var padding=hei/2-40;
		if (type == "DOWN_FILTER") {
			return <DownFilter
			data={this.props.data}
			row={this.props.row}
            col={this.props.col} 
            item={this.state.item}
            padding={padding}
			reportTitle={this.props.data.report}
            operation={this.props.operation}
            globalFilterFields={this.props.globalFilterFields}
            filterType={type}
            metadataId={this.props.data.report.metadataId}
            reportNum={this.props.reportNum}/>
		} else if (type == 'SEARCH_FILTER') {
			return <Searchs
				data={this.props.data}
				row={this.props.row}
            	col={this.props.col} 
            	item={this.state.item}
            	padding={padding}
				reportTitle={this.props.data.report}
            	operation={this.props.operation}
            	globalFilterFields={this.props.globalFilterFields}
            	filterType={type}
            	metadataId={this.props.data.report.metadataId}/>
		} else if (type == 'DATE_FILTER') {
			return <DateFilter
			data={this.props.data}
			row={this.props.row}
            col={this.props.col} 
            item={this.state.item}
            padding={padding}
			reportTitle={this.props.data.report}
            operation={this.props.operation}
            globalFilterFields={this.props.globalFilterFields}
            filterType={type}
            metadataId={this.props.data.report.metadataId}/>
		}
	},
	_setMetaDataItem:function(data){
		var item={
				filterType : data.type,
				metadataId:data.report.metadataId || '',
				dimensionId:data.report.dimensionId || '',
				groupType:data.report.groupType || '',
				groupLevels:data.report.groupLevels||[],
				name:data.report.name || '',
				popData : [],
				fieldName:data.report.fieldName || '',
				tit:"多选筛选器"
			}

		if(data.type=='DATE_FILTER'){
			item.tit="日历筛选器";
		}else if(data.type=='SEARCH_FILTER'){
			item.tit="搜索筛选器";
		}

		this.setState({
			item:item
		})
		
	}
})
