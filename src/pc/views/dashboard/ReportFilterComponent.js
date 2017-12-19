var React = require('react');
var App = require('app');
var FilterButton = require('./FilterButton');
var {
    FlatButton,
    } = require('material-ui');

module.exports = React.createClass({
    app:{},
    displayName:"分析报表筛选信息",
    getInitialState: function() {
        return {}
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentDidMount: function() {
        //this.app['APP-DASHBOARD-CLICK-BUTTON-HANDLE'] = App.on('APP-DASHBOARD-CLICK-BUTTON-HANDLE', this._clearFilterHandle);
    },
    _reportFilterListHandle:function(item,index){
        return <FilterButton 
                key={index} 
                row={this.props.row} 
                col={this.props.col} 
                index={index} 
                reportId={this.props.reportId} 
                item={item}/>
    },
    render: function(){
        if(this.props.filterFields){
            if(this.props.filterFields.length>0){
                return (
                    <div className="reportFilterBox">
                        {this.props.filterFields.map(this._reportFilterListHandle)}
                        <FlatButton 
                            className="clearClassName"
                            onTouchTap={this._clearFilterHandle} 
                            label="清空筛选" />
                        </div>
                )
            }else{
                return null
            }
        }else{
            return null
        }
    },
    _clearFilterHandle:function(){//点击情况筛选按钮的 触发的方法
        var _this = this;
        App.emit('APP-DASHBOARD-SET-REPORT-FILTER-VALUES',{
            clear:true,
            row:this.props.row,
            col:this.props.col
        })
        App.emit('APP-DASHBOARD-REPORT-SET-FILTER-SELECTED-ITEMS',[],null,'clear');
    }
});
