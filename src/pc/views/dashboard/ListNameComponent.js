var React = require('react');
var ReportStore = require('../../stores/ReportStore');
module.exports = React.createClass({
	getInitialState:function(){
		return {
			landownersName:'测试'
		}
	},
	componentWillMount:function(){
		var _this = this;
		ReportStore.getReportUser(this.props.nameId).then(function(data){
			if(_this.isMounted()){
				_this.setState(function(previousState,currentProps){
					previousState.landownersName = data.dataObject.userName;
					return {previousState};
				});
			}
		});
	},
	componentWillReceiveProps:function(nextProps){
		var _this = this;
		if(nextProps.dataArr.length!=this.props.dataArr.length){
			ReportStore.getReportUser(this.props.nameId).then(function(data){
				if(_this.isMounted()){
					_this.setState(function(previousState,currentProps){
						previousState.landownersName = data.dataObject.userName;
						return {previousState};
					});
				}
			});
		}
	},
	render:function(){
		return (
			<span>{this.state.landownersName}</span>
		)
	}
})