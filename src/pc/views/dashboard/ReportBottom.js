/**
 * Created by Administrator on 2016-2-25.
 */
var $ = require('jquery');
var React = require('react');
var App = require('app');
var {
    MenuItem,
    DropDownMenu,
    FontIcon
    } = require('material-ui');
module.exports = React.createClass({
    app:{},
    displayName:'分析模块底部组件',
    getInitialState: function() {
        return {
            charListDatas:[{
                value:'Pie2D',
                primaryText:'饼状图',
                className:'icon_Pie2D'
            },{
                value:'ScrollColumn2D',
                primaryText:'柱状图',
                className:'icon_ScrollColumn2D'
            },{
                value:'ScrollLine2D',
                primaryText:'折线图',
                className:'icon_ScrollLine2D'
            },{
                value:'PercentColumn2D',
                primaryText:'百分比堆积柱状图',
                className:'icon_PercentColumn2D'
            },{
                value:'StackedColumn2D',
                primaryText:'堆积柱状图',
                className:'icon_StackedColumn2D'
            },
	            {
		            value:'MultiAxisLine',
		            primaryText:'复合图',
		            className:'icon_MultiAxisLine'
	            }, {
                    value       : 'WordCloud',
                    primaryText : '词云图',
                    className   : 'icon_WordCloud',
                }],
            valueType:this.props.bottomData.type
        }
    },
    componentDidMount: function() {
        //如果关闭了图形切换按钮 就重置页面报表
        this.app['APP-DASHBOARD-REPORT-RESET-CHAR-ICON-HANDLE'] = App.on('APP-DASHBOARD-REPORT-RESET-CHAR-ICON-HANDLE',this._resetCharIconHandle);
    },
    render: function() {
        var iconClassName = this.state.valueType+'_Icon';
        return (
            <div className="dashboardView_col_bottom">
                <div className="dashboardView_col_bottom_box">
                    <DropDownMenu
                        onClick={this._setMenuScroll}
                        autoWidth={true}
                        value={this.state.valueType}
                        className={iconClassName}
                        onChange={this._handleChange}>
                            {this.state.charListDatas.map(this._menuItemListHandle)}
                    </DropDownMenu>
                </div>
            </div>
        )
    },
    _menuItemListHandle:function(item,key){
        var className = 'dashboardCharIcon '+item.className;
        return <MenuItem
                    key={key}
                    className='dashboardCharIconClass'
                    leftIcon={<FontIcon className={className}/>}
                    value={item.value}
                    primaryText={item.primaryText}/>
    },
    _setMenuScroll:function(){
        $(".dashboardCharIconClass").parent().parent().parent().parent().parent().addClass('dashboardSelectMenuPanelBox');
        $(".dashboardCharIconClass").parent().parent().parent().addClass('dashboardSelectMenuPanel');

    },
    _resetCharIconHandle:function(obj){//如果关闭了图形切换按钮 就重置页面报表
        if(obj.row == this.props.row && obj.col == this.props.col){
            this.setState({
                valueType:this.props.bottomData.type
            })
        }
    },
    _handleChange : function(target,key,payload){//点击切换图形 执行的方法
        this.setState(function(previousState,currentProps){
            previousState.valueType = payload;
            return {previousState};
        });
        App.emit('APP-DASHBOARD-TOGGLE-CHAR-TYPE-REFRESH-HANDLE',{//用于驾驶舱报表 选择切换图形刷新报表的方法
            charType:payload,
            row:this.props.row,
            col:this.props.col
        })
    }
});
