var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var metaDataStore = require('../../../stores/MetaDataStore');
var MetaDataDetails = require('./MetaDataDetails');
var MetaDataEmpty = require('./MetaDataEmpty');
var MetaDataError = require('./MetaDataError');

var {

	FlatButton,

	FontIcon

} = require('material-ui');
module.exports = React.createClass({

	displayName: 'MetaDataDetailsView',

	propTypes: {
		id: React.PropTypes.string.isRequired,
		btnOnClick: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			btnOnClick: function(metadata) {
			},
		}
	},

	getInitialState: function() {
		return {
			metaDataContent:null,
			status:'LOADING',//LOADING|ERROR|EMPTY|SHOWDATA
			message:'获取数据失败'
		}
	},
	componentWillMount: function() {
		var id=this.props.id;

		this._getSelectedMetaData(id);

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
			return <MetaDataError message={this.state.message}/>
		}
		if(this.state.status=='EMPTY'){
			return <MetaDataEmpty />
		}
		return this._renderItem();
	},
	_getSelectedMetaData:function(id){

		metaDataStore.getMetaData(id).then(this._setMetaDataState).catch(this._handleError);
	},
	_setMetaDataState:function(data){
		if(this.isMounted()){
			if(data.success){
				this.setState({
					metaDataContent:data,
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

		return <MetaDataDetails btnOnClick={this._metaOnClick} metaDataContent={this.state.metaDataContent}/>
	},

	_metaOnClick:function(metadata){
		this.props.btnOnClick(metadata);

	},

	_handleError:function(error) {
		this.setState({
			status:'ERROR',
			message:error,
		});
	}
})
