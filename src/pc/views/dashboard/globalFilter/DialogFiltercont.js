var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DialogFilterList = require('./DialogFilterList');
var daialogFilterStore = require('../../../stores/MetaDataStore');
var DialogDetailsList = require('./DialogDetailsList');
var {
  List,
	ListItem,
  FlatButton
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选维度弹框内容区',
	getInitialState:function(){
		return {

    }
	},
	componentWillMount:function(){

	},
	componentDidMount: function() {

	},
	render:function(){
        return (
          <div className="DialogFilter-box">
                 <div className="DialogFilter-selector-view-body">
                   {this._renderBody()}
                 </div>
          </div>
        )

	},
  _renderBody:function(){
    var body = this.props.body;
    var id = this.props.id;
    if (body == 'DialogFilterList') {

		return 	<DialogFilterList data={this.props.data} id={this.props.id} item={this.props.item} row={this.props.row} filterType={this.props.filterType}  col={this.props.col} dimensionId={this.props.dimensionId} Weidutitle={this.props.Weidutitle} filterName={this.props.filterName} filterAliasName={this.props.filterAliasName}/>;
	} else if (body == 'DialogDetailsList') {

	return	 <DialogDetailsList data={this.props.data} item={this.props.item}  id={this.props.id} row={this.props.row} filterType={this.props.filterType} col={this.props.col} dimensionId={this.props.dimensionId} Weidutitle={this.props.Weidutitle} filterName={this.props.filterName} filterAliasName={this.props.filterAliasName}/>;
	}
  },
  _handleSelectList:function(dataList){

  }
})
