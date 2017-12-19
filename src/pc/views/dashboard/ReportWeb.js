/**
 * Created by Administrator on 2016-2-25.
 */
var React = require('react');
var App = require('app');
var DashboardStare = require('../../stores/DashboardStore')
module.exports = React.createClass({
    app:{},
    displayName:'ReportWeb',
    getInitialState: function() {
        return {
            report:this.props.report || null,

        }
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
        this.setState({
            report:nextProps.report
        })
    },
    componentWillMount:function(){
    },
    componentDidMount:function(){
    },
    render: function(){
        var reportShowBoxHei=this.props.height-48;
        return (
            <div className='dashboardView_col_content_text dashboardView_col_content'>
                <div className='report-web' style={{height:reportShowBoxHei}}>
                    <iframe src={this.state.report.url} frameBorder="0" width="100%" height={reportShowBoxHei} scrolling="auto"></iframe>
                </div>
            </div>
        )
    }
});