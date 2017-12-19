var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var daialogFilterStore = require('../../../stores/MetaDataStore');
var DialogDetailsListView = require('./DialogDetailsListView');
var FilterDataEmpty = require('./FilterDataEmpty');
var FilterDataError = require('./FilterDataError');

module.exports = React.createClass({
	displayNmae:'DialogDetailsList',
 	getInitialState: function() {
		return {
			DataContent:null,
			status:'LOADING',//LOADING|ERROR|EMPTY|SHOWDATA
			message:'获取数据失败'
		}
	},
	componentWillMount: function() {
		this._getSelectedMetaData(this.props.id);

	},
	componentWillReceiveProps:function(nextProps){

	},
	componentDidMount:function(){

	},
	render: function() {
		if(this.state.status=='LOADING'){
			return (
				<Loading />
			)
		}
		if(this.state.status=='ERROR'){
			return <FilterDataError message={this.state.message}/>
		}
		if(this.state.status=='EMPTY'){
			return <FilterDataEmpty />
		}
		return this._renderItem();
	},
	_getSelectedMetaData:function(id){
    
		daialogFilterStore.getMetaData(id).then(this._setDataState).catch(this._handleError);
	},
	_setDataState:function(data){
		if(this.isMounted()){
			if(data.success){
				this.setState({
					DataContent:data,
					status:'SHOWDATA'
				});
			}else{
				this.setState({
					status:'ERROR',
					message:this.state.message,
				});
			}

		}
	},
	_renderItem: function() {
		return <DialogDetailsListView item={this.props.item} data={this.props.data} id={this.props.id} Weidutitle={this.props.Weidutitle}  dimensionId={this.props.dimensionId} filterType={this.props.filterType} row={this.props.row} col={this.props.col}  DataContent={this.state.DataContent} filterName={this.props.filterName} filterAliasName={this.props.filterAliasName}/>
	},
	_handleError:function(error) {
		this.setState({
			status:'ERROR',
			message:error,
		});
	}
})
