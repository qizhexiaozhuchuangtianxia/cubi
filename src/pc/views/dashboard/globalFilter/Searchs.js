var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DelBtn =  require('../DelBtn');
var FilterHeader = require('./FilterHeader');
var $ = require('jquery');
import FilterFieldsStore from '../../../stores/FilterFieldsStore';
import GlobalFilterStore from '../../../stores/GlobalFilterStore';
import PublicTextField from '../../common/PublicTextField';
var {
	FontIcon,
  TextField,
  FlatButton,
	Paper
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选搜索',
	getInitialState:function(){
		return {
			data:this.props.data,
      		errorTextState:'',
      		allData:null,
      		list:[],
		}
	},
	componentWillMount:function(){
		var item=this.props.item;
		this._getTreeFilterData(item.dimensionId,item.metadataId,item.groupType,item.fieldName);
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
            data:nextProps.data
        });
        var item=nextProps.item;
		this._getTreeFilterData(item.dimensionId,item.metadataId,item.groupType,item.fieldName);

	},
	componentDidMount: function() {

	},
	render:function(){

		var hintStyle={
			'color':'rgba(0, 0, 0, 0.83)',
			'paddingLeft':'25px'
		}

		var mstyle={
            paddingTop:this.props.padding-10+'px'
        }
        return (
            <div className='search_input'>
				<FilterHeader reportTitle={this.props.reportTitle} row={this.props.row} col={this.props.col} data={this.props.data} operation={this.props.operation} filterType={this.props.filterType} item={this.props.item}/>
				<div style={mstyle} className="filterCount">
					<div className="textField">
						<i className="iconfont icon-icsousuo24px sousuo"></i>
						<PublicTextField
							ref="searchStr"
							defaultValue=""
							className="textSearchClassName"
							floatingLabelStyle={false}
							hintText="输入搜索内容"
							lineStyle={{  borderColor:'rgba(0,0,0,0.25)'}}
							hintStyle={hintStyle}
							inputStyle={hintStyle}
							errorText={this.state.errorTextState}
							onChange={(evt)=>this._getChangeInputVal(evt)}
							onEnterKeyDown={(evt)=>this._goSearch(evt)}/>
					</div>
				</div>
			</div>
        )

	},

  _getChangeInputVal:function(evt){
		evt.stopPropagation();
  },
  _DownSubmit:function(evt){
		evt.stopPropagation();

  },
  _goSearch:function(){
  	GlobalFilterStore.setGlobalSign(true);
  	var searchStr = $('.textSearchClassName').find('input').val();//this.refs.searchStr.getValue();
  	var seletedArr=GlobalFilterStore.searchSetItem(this.state.allData,this.state.list,searchStr,this.props.item);
  	if(!seletedArr){return}
  	App.emit('APP-DRIL-SET-DRILDOWN');
  	var _this=this;
    setTimeout(function(){
	  	App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER',{
			col:_this.props.col,
			row:_this.props.row,
			dbField:_this.props.item.fieldName,
			fieldName:_this.props.item.fieldName,
			groupType:_this.props.item.groupType || "",
			seletedArr:seletedArr,
			globalFilterSign:true,
			dimensionId:_this.props.item.dimensionId,
			metadataId:_this.props.item.metadataId,
			dataType:_this.props.item.dataType,
			filterType:"SEARCH_FILTER",
			name:_this.props.item.name,
			sign:_this.props.data.report.sign,
		});
  	},20);

  },
  _getTreeFilterData:function(dimensionId,metadataId,groupType,fieldName){
  	var _this=this;
  	if(!dimensionId || !metadataId){
  		return;
  	}

  	if(groupType=="GROUP_TITLE_FIELD"){
  		GlobalFilterStore.getTreeFilterData(dimensionId,metadataId).then(function(data){
	  		var datas=data.dataObject;
	  		FilterFieldsStore.modifyDimensionDataHandle(datas).then(function(data){
		  		_this.setState({
		  			list:data,
		  			allData:datas
		  		})
		  	})

	  	})
  	}else{
  		GlobalFilterStore.getPageFieldDataWithFilters(metadataId, fieldName).then(function(data){
  			_this.setState({
	  			allData:data.dataObject.dataArray
	  		})
  		})
  	}

  }
})
