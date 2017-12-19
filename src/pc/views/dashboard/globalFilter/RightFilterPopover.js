var React = require('react');
var App = require('app');
var FilterPopoverType = require('./FilterPopoverType');
var {
	LeftNav,
	MenuItem,
	Popover,
  Menu,
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选右侧筛选器类型弹框',
	getInitialState:function(){
		return {
			openPopover:this.props.openPopover,
			initFilter:[
				{primaryText:"多选筛选器",filterType:'DOWN_FILTER'},
				{primaryText:"搜索筛选器",filterType:'SEARCH_FILTER'},
				{primaryText:"日历筛选器",filterType:'DATE_FILTER'}
			]
    }
	},
	componentWillUnmount:function(){
		for(var i in this.app){
						this.app[i].remove();
				}
	},
	app:{},
	componentWillReceiveProps:function(nextProps){
		this.setState({
				openPopover:nextProps.openPopover,

		});
	},
	componentDidMount: function() {

	},
	render:function(){
        return (

          <Popover
              open={this.state.openPopover}
              anchorEl={this.props.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this._handleRequestClose}
            >
						<Menu className="SelectType">
							{this.state.initFilter.map(this._multifilter)}
						</Menu>
            </Popover>

        )

	},
	_multifilter:function(item,key){
		return <MenuItem  key={key} primaryText={item.primaryText}  onClick={(evt)=>this._getFilterType(item,key)} />
	},
	_getFilterType:function(item,key){
		var filterType=item.filterType;
		if(this.props.filterType && item.filterType==this.props.filterType){
			filterType=this.props.filterType;
		}
		App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE',{
			filterType:filterType,
			col: this.props.col,
			row:this.props.row,
			item:'',
		});
		App.emit('APP-WEIDU-CLOSE-DIALOG');
		App.emit('APP-WEIDU-FILTER-VALUE',{name:'选择'});//维度恢复默认
		App.emit('APP-WEIDU-FILTER-TYPE-VALUE',{
		name:item.primaryText,
		filterType:item.filterType
		});//筛选器类型切换
	},
	_handleRequestClose:function(){
		if (!this.isMounted()) return;
		App.emit('APP-WEIDU-CLOSE-DIALOG');
		this.setState({
		 openPopover: false,

	 });
	}

})
