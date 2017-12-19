var $ = require('jquery');
var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DelBtn =  require('../DelBtn');
var FilterHeader =  require('./FilterHeader');
// import Report from './ReportComponent';
import FilterDialogComponent from '../filter/FilterDialogComponent';
import TreeFilterDialogComponent from '../filter/TreeFilterDialogComponent';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
var {
	FontIcon,
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选下拉筛选',
	app:{},
	getInitialState:function(){
		return {
			open:false,
			treeOpen:false,
			reportInfo:{
				metadataId:this.props.item.metadataId,
				filterFields:[]
			},
			list:[],
			listWidth:'auto',

		}
	},
	componentWillMount:function(){

	},
	componentWillReceiveProps:function(nextProps){
		if (!this.isMounted()) return;
		this.setState(function(previousState,currentProps){
			var list=GlobalFilterStore.setDownSelected(nextProps.data.report.seletedArr);
			previousState.list=list;
			previousState.reportInfo.metadataId=nextProps.item.metadataId;
			previousState.listWidth='auto';
			return previousState;
		})

		//this._setListWidth();
	},
	componentDidMount: function() {
		//关闭驾驶舱报表筛选条件的弹出框的方法
        this.app['APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG'] = App.on('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG',this._closeDialog);
        //点击筛选值 确定的方法
        this._setListWidth();
	},
	componentWillUpdate:function(){
		this._setListWidth();
	},
	render:function(){
		//if(!this.props.item.metadataId){return null;}
		var list;
		if(this.state.list.length==0){
			list = <span>全部</span>
		}else{
			list=this.state.list.map(this._renderList);
		}
		var style={
            paddingTop:this.props.padding+'px'
        }
				var styles={
					width:this.state.listWidth
				}

        return (
            <div className="down_filter">
            	<FilterHeader
            	tit={this.props.item.name}
            	item={this.props.item}
				reportTitle={this.props.reportTitle}
            	operation={this.props.operation}
            	data={this.props.data}
            	filterType={this.props.filterType}
            	row={this.props.row}
            	col={this.props.col} />
                <div style={style} className="filterCount filter_cont">
                	<div className="cont_list" onTouchTap={(evt)=>this._openFilterDialog(evt)}>
                		<div className="list" style={styles}>
                			{list}
                		</div>
                		<div className="cont_icon">
	                		<FontIcon className="iconfont icon-icarrowdropdown24px filter_down_btn"/>
	                	</div>
                	</div>
                	{this._renderDialog()}
                </div>

            </div>
        )

	},
	_renderDialog:function(){

	    if(GlobalFilterStore.isEmptyObject(this.props.item)){return null;}

	    var groupType=this.props.item.groupType;
		if(groupType == "GROUP_TITLE_FIELD"){
			return <TreeFilterDialogComponent
                		row={this.props.row}
	                	col={this.props.col}
	                	item={this.props.item}
	                	dimensionId={this.props.item.dimensionId}
	                	groupLevels={this.props.item.groupLevels}
	                	metadataId={this.props.item.metadataId}
	                	reportInfo={this.state.reportInfo}
	                	open={this.state.treeOpen}
	        			globalFilterSign={true}
	        			globalFilterFields={this.props.globalFilterFields}
	        			filterSign={this.props.filterSign}
	        			filterType={"DOWN_FILTER"}
	        			data={this.props.data}
	        			reportNum={this.props.reportNum}/>
        }

        return <FilterDialogComponent
            	row={this.props.row}
            	col={this.props.col}
            	item={this.props.item}
            	open={this.state.open}
            	reportInfo={this.state.reportInfo}
            	metadataId={this.props.item.metadataId}
            	dimensionId={this.props.item.dimensionId}
    			globalFilterSign={true}
    			globalFilterFields={this.props.globalFilterFields}
    			filterSign={this.props.filterSign}
    			filterType={"DOWN_FILTER"}
    			data={this.props.data}/>
	},
	_renderList:function(item,index){
		var len=this.state.list.length;
		if(index==len-1){
			return <span key={index}>{item.name}</span>
		}
		return <span key={index}>{item.name} 、</span>
	},
	_openFilterDialog:function(evt){
		if (!this.isMounted()) return;
		if (this.props.item.name=='') return;
		if(this.props.item.groupType == "GROUP_TITLE_FIELD"){
			this.setState({
				treeOpen:true
			})
		}else{
			this.setState({
				open:true
			})
		}
		//App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-SIGN',{globalFilterSign:true});
	},
	_closeDialog:function(){
		if (!this.isMounted()) return;
		this.setState({
			open:false,
			treeOpen:false,
		});
	},
	_setListWidth:function(){
		var _this=this;
		setTimeout(function(){
			var contWidth=$(ReactDOM.findDOMNode(_this)).find('.filter_cont').width();
			var listWidth=$(ReactDOM.findDOMNode(_this)).find('.list').width();

			var width=contWidth-24;
			var reportWidth=_this.props.data.width;

			 if(listWidth>contWidth-10){
				_this.setState({
					listWidth:width,

				})
			}

		},20)

	},
	_setList:function(list){
		if (!this.isMounted()) return;
		this.setState({
			list:[]
		});
	}
})
