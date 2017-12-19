var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var metaDataStore = require('../../../stores/MetaDataStore');
var MetaDataList = require('./MetaDataList');
var MetaDataEmpty = require('./MetaDataEmpty');

var MetaDataError = require('./MetaDataError');

module.exports = React.createClass({

	displayName: 'MetaDataListView',

	propTypes: {
		directoryId: React.PropTypes.string,
		onSelected: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			directoryId: null, //根目录
			onSelected: null,
		}
	},

	getInitialState: function() {
		return {
			list: [],
			status:'LOADING',//LOADING|ERROR|EMPTY|SHOWDATA
			message:'获取数据失败'
		}
	},
	componentWillMount: function() {

		var id=this.props.directoryId;
		this._getMetaDataResources(id);

	},
	componentDidMount:function(){

	},

	render: function() {
		var listLen=this.state.list.length;
		//加载loading
		if(this.state.status=='LOADING'){
			return (
				<div>
					<Loading />
				</div>
			)
		}
		//成功
		if(this.state.status=="SHOWDATA"){
			return (
				<MetaDataList list={this.state.list} onSelected={this._handleClick} />
			)
		}
		//数据为空
		if(this.state.status=="EMPTY"){
			return (
				<MetaDataEmpty />
			)
		}
		//数据错误
		if(this.state.status=="ERROR"){
			return (
				<MetaDataError message={this.state.message}/>
			)
		}

	},
	_getMetaDataResources:function(id){

		metaDataStore.getMetadataList(id).then(this._MetaDataResourcesSetState).catch(this._handleError);
	},
	_MetaDataResourcesSetState:function(mData){
		if(this.isMounted()){
			var status="EMPTY";
			if(mData.dataObject.length>0){
				status="SHOWDATA";
			}
			this.setState({
				list:mData.dataObject,
				status:status,
				message:mData.success
			});
		}
	},
	_handleClick: function(metadata) {
		if (this.props.onSelected != null) {

			this.props.onSelected(metadata);
		}
	},
	_handleError:function(error) {
		this.setState({
			status:'ERROR',
			message:error,
		});
	}
})
