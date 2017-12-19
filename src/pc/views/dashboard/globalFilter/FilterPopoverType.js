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
				{primaryText:"多选筛选器",filterType:'DOWN_FILTER',name:'选择'},
				{primaryText:"搜索筛选器",filterType:'SEARCH_FILTER',name:'选择'},
				{primaryText:"日历筛选器",filterType:'DATE_FILTER',name:'选择'}
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
		var filterName=item.primaryText;
		var filterAliasName=this.props.filterAliasName;

		var initFilter=this.state.initFilter;
		var sign=0;
		for(var i=0;i<initFilter.length;i++){
			if(filterAliasName!=initFilter[i].primaryText){
				sign++;
			}
		}
		if(sign<initFilter.length){
			filterAliasName=item.primaryText;
		}
		App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE',{
			filterType:filterType,
			filterName:this.props.filterName,
			col: this.props.col,
			row:this.props.row,
			sign:this.props.data.report.sign,
			item:'',
			filterAliasName:filterAliasName,
			filterName:filterName
		});
		var disabledDate=false;
		if(item.filterType == 'DATE_FILTER'){
			disabledDate=true;
		}
		App.emit('APP-WEIDU-CLOSE-DIALOG');
		// App.emit('APP-WEIDU-FILTER-VALUE',{item:item});//维度恢复默认
		App.emit('APP-WEIDU-FILTER-TYPE-VALUE',{
		name:item.primaryText,
		Weidutitle:item.name,
		filterType:item.filterType,
		disabledDate:disabledDate,
		filterAliasName:filterAliasName,
		filterName:filterName
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
