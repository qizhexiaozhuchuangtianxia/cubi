var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DialogFilterList = require('./DialogFilterList');
var daialogFilterStore = require('../../../stores/MetaDataStore');
var DialogFilterListView = require('./DialogFilterListView');
var DialogDetailsListView = require('./DialogDetailsListView');
var FilterDataEmpty = require('./FilterDataEmpty');
var FilterDataError = require('./FilterDataError');
var {
  List,
	ListItem,
  FlatButton
} = require('material-ui');

module.exports = React.createClass({
  displayNmae:'DialogFilterList',
	getInitialState:function(){
		return {
      listDatas:[],
      status:'LOADING',//LOADING|ERROR|EMPTY|SHOWDATA
      message:'获取数据失败',

    }
	},
	componentWillMount:function(){
	   this._getReportFilterList(this.props.id);//获取列表的方法
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
            data:nextProps.data,
            openFilterDialog:nextProps.open,
            id:nextProps.id,
        });
    this._getReportFilterList(nextProps.id);
	},
	componentDidMount: function() {

	},
  _getReportFilterList:function(id){
    daialogFilterStore.getMetadataList(id).then(this._FilterDataResourcesSetState).catch(this._handleError);

  },
  _FilterDataResourcesSetState:function(listData){
    if(this.isMounted()){
      var status="EMPTY";
      if(listData.dataObject.length>0){
        status="SHOWDATA";
      }
      this.setState({
        listDatas:listData.dataObject,
        status:status,
        message:listData.success
      });
    }
  },
  _handleError:function(error){
    this.setState({
      status:'ERROR',
      message:error,
    });
  },
	render:function(){
        //加载loading
    		if(this.state.status=='LOADING'){
    			return (
    				<div>
    					<Loading />
    				</div>
    			)
    		}
        //成功
        if(this.state.status=='SHOWDATA'){
        	return (  <DialogFilterListView Weidutitle={this.props.Weidutitle} item={this.props.item} data={this.props.data} id={this.props.id} filterType={this.props.filterType}  dimensionId={this.props.dimensionId} listDatas={this.state.listDatas} filterName={this.props.filterName} filterAliasName={this.props.filterAliasName}/>
          )
        }
        //数据为空
        if(this.state.status=="EMPTY"){
          return (
            <FilterDataEmpty />
          )
        }
        //数据错误
        if(this.state.status=="ERROR"){
          return (
            <FilterDataError message={this.state.message}/>
          )
        }
	}


})
