var React = require('react');
var DialogListComponent = require('./report/DialogListComponent');
module.exports = React.createClass({
	getInitialState: function() {//直接进入本页面的时候触发 设置了state属性
		return {
			dirId:null,
			dirName:null,
		}
	},
	componentWillMount:function(){},
	componentDidMount: function(){},
	render: function(){
		return (
			<DialogListComponent 
				dirId={this.state.dirId} 
				dirName={this.state.dirName} 
				row={this.props.row}
				col={this.props.col}
			/>
		) 
	}
});