var React = require('react');
var App = require('app');
var ListComponent = require('./dashboard/ListComponent');
module.exports = React.createClass({
	app:{},
	getInitialState: function() {//直接进入本页面的时候触发 设置了state属性
		return {
			dirId:null,
			field:'updateTime',
			method:'ASC',
		}
	},
	componentWillMount:function(){//将要挂在当前组件的时候
		this.setState({
			dirId:this.props.location.query.dirId||null,
			currentCanEdited:this.props.location.query.currentCanEdited||true,
		})
	},
	componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
		this.setState({
			dirId:nextProps.location.query.dirId||null,
			currentCanEdited:nextProps.location.query.currentCanEdited||true,
		})
	},
	componentDidMount: function() {
		//订阅 点击排序刷新当前页面
		this.app['APP-REPORT-SORT-REFRESH-LIST-HANDLE'] = App.on('APP-REPORT-SORT-REFRESH-LIST-HANDLE', this._sortRefreshListHandle);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render: function(){
		return (
			<ListComponent 
				dirId={this.state.dirId} 
				currentCanEdited={this.state.currentCanEdited} 
				field={this.state.field} 
				method={this.state.method} />
		) 
	},
	_sortRefreshListHandle:function(obj){//排序按钮方法 从新设置了排序的名字和方法
		this.setState({
			field:obj.field,
			method:obj.method,
		})
	}
});