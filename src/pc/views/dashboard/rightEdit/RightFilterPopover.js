var React = require('react');
var App = require('app');

var {
	LeftNav,
	MenuItem,
	Popover,
  Menu,
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选单表右侧筛选器类型弹框',
	getInitialState:function(){
		return {

    	}
	},
	componentWillUnmount:function(){

		for(var i in this.app){
			this.app[i].remove();
		}
	},
	app:{},
	componentWillReceiveProps:function(nextProps){

	},
	componentDidMount: function() {

	},
	render:function(){

        return (

          <Popover
              open={this.props.open}
              anchorEl={this.props.anchorEl}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              onRequestClose={this._close}>
				<Menu>
					{this.props.filterListItem.map(this._filterListItem)}
				</Menu>
            </Popover>

        )

	},
	_filterListItem:function(item,key){
 		var filterName='filterList';
		if(item.disabled==true){
			filterName='filterdisabled'
		}
		return <MenuItem  className={filterName}  key={key} primaryText={item.name}
			onClick={(evt)=>this._selectedItem(item,key)}
			disabled={item.disabled}/>
	},
	_selectedItem:function(item){
		if(!item.metadataId && item.filterType !== 'DATE_FILTER' && item.type !== 'no'){
			this.props.setOpen(false);
			return;
		}
		if(item.disabled){
			return;
		}

		// var open= true;
		// if(item.open=='false'){
		// 	open=false;
		// }
		// var disabled=false;
		// if(item.open){disabled=true}
		App.emit('APP-DASHBOARD-CLEAR-DEFAULT-FILTER',{show:false,disabled:!item.open});
		item.row = this.props.row;
		item.col = this.props.col;
		item.open = item.type === 'no' ? item.open : !item.open;
		App.emit('APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER', item);
		this.props.setOpen(false);
		App.emit('APP-DASHBOARD-SET-GLOBAL-OPEN-FILTER-RIGHT', item);
		

	},
	_close:function(){
		this.props.setOpen(false);
	},

})
