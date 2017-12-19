var React = require('react');
var App = require('app');
var ListComponent = require('./dimension/ListComponent');
module.exports = React.createClass({
	displayName: 'dimensionList',
	app:{},
	getInitialState: function() {
		return {
			field:'updateTime',
			method:'ASC',
		}
	},
	componentWillMount:function(){
		
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	componentDidMount: function() {
		//订阅 排序刷新当前页面
		this.app['APP-REPORT-SORT-REFRESH-LIST-HANDLE'] = App.on('APP-REPORT-SORT-REFRESH-LIST-HANDLE', this._sortRefreshListHandle);
		// App.emit('APP-MENU-TOGGLE-BACK-HANDLE', {
  //           toggle: true,
  //           func: 'APP-CREATE-REPORT-GO-BACK-HANDLE'
  //       });
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render: function(){
		return <ListComponent field={this.state.field} method={this.state.method} />
	},
	_sortRefreshListHandle:function(obj){//排序
		if (!this.isMounted()){return;}
		this.setState({
			field:obj.field,
			method:obj.method,
		});
	}
});