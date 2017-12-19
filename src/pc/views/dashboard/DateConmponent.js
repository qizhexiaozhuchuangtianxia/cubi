var React = require('react');
var ReportStore = require('../../stores/ReportStore');
var { 
    DatePicker
} = require('material-ui');
module.exports = React.createClass({
    displayName:"弹出的日期筛选的值",
    getInitialState: function() {
        return {
            tabValue:'selectAll',
            filterValueData:[]
        }
    },
    componentWillMount:function(){
        var _this = this;
        ReportStore.getAreaInfo(this.props.reportId).then(function (data) {
            if(data.success){
                ReportStore.getFieldData(data.dataObject.metadataId,_this.props.dbField).then(function(result){
                    _this.setState(function(previousState,currentProps){
                        previousState.filterValueData=result;
                        return {previousState};
                    });
                })
            }else{
                console.log(data.message);
            }
        })
    },
    componentDidMount: function() {
    },
    render:function(){
    	return (
    		<DatePicker mode="landscape" />
		)
    }
});