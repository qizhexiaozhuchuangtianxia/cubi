/**
 * Created by Administrator on 2016-2-25.
 */
var $ = require('jquery');
var React = require('react');
var App = require('app');
var DashboardStare = require('../../stores/DashboardStore')
module.exports = React.createClass({
    app:{},
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
        this._resolveContent(nextProps.report);
        $(ReactDOM.findDOMNode(this)).find(".report-text").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark",
            mouseWheel:{scrollAmount:100},
            autoExpandScrollbar:true,
            snapAmount:1,
            snapOffset:1
        });
    },
    componentWillMount:function(){
        this._resolveContent(this.props.report);
    },
    componentDidMount:function(){
       $(ReactDOM.findDOMNode(this)).find(".report-text").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark",
            mouseWheel:{scrollAmount:100},
            autoExpandScrollbar:true,
            snapAmount:1,
            snapOffset:1
        });
    },
    render: function(){

        var pageSize = parseInt((this.props.height - 106) / 48);
        var reportShowBoxHei=this.props.height;
        reportShowBoxHei=pageSize*49+56*2-24;
        return (
            <div className='dashboardView_col_content_text dashboardView_col_content'>
                <div className='report-text' style={{height:reportShowBoxHei}}>
                    <div dangerouslySetInnerHTML={{__html:this.state.report.content}}></div>
                </div>
            </div>
        )
    },
    _resolveContent:function(report){
        var _this = this;
        report = JSON.parse(JSON.stringify(report));
        var content = report.content;
        var reg = /\[code\].*?\[\/code\]/gi;
        var texts = content.match(reg);
        var expressions = [];
        if(!texts){
            _this.setState({
                report:report
            })
            return;
        }
        expressions = texts.map(text => text.slice(6, -7).replace(/<\/?\w+[^>]*>/g, ''));
        DashboardStare.analysisExpression(expressions).then(function(data){
            var dataObject = data.dataObject, sarr, i = 0;

            if(data.success){
                sarr = dataObject.map(o => o.success ? o.value[0] : o.message);
                report.content = report.content.replace(reg, function(m){
                    return sarr[i++];
                });
            }
            _this.setState({
                report:report
            })
        })
    }
});