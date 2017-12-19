var $ = require('jquery');
var React = require('react');
var App = require('app');
var ReportStore = require('../../../stores/ReportStore');
var {
	TextField,
	FontIcon,
	FlatButton,
	Popover,
	ListItem,
} = require('material-ui');
module.exports = React.createClass({
	displayName: '拖拽维度列表弹框',
	getInitialState: function() {

		return{
			open:this.props.open,//false,
			anchorEl:this.props.anchorEl,//document.body,
			index:this.props.index,//-1,
			items:this.props.items,
			isDrag:this.props.isDrag,
			itemData:this.props.itemData,
			name:this.props.name,
			itemType:this.props.itemType
		}
	},
	componentWillMount:function(){
	},
	componentDidMount: function() {
		App.on('APP-SET-DRAG-WEIDU-INDEX', this._setIndex);
		App.on('APP-SET-DRAG-WEIDU-ELE', this._setEle);
	},
	componentWillReceiveProps: function(nextProps) {
		var index=nextProps.index;
		if(nextProps.items.length-1<index){
			index=nextProps.items.length-1;
		}
		this.setState({
			open:nextProps.open,
			anchorEl:nextProps.anchorEl,
			index:index,
			items:nextProps.items,
			isDrag:nextProps.isDrag,
			itemData:nextProps.itemData,
			name:nextProps.name,
		});
	},
	componentDidUpdate:function(){

	},
	render: function() {
		var list=this._groupLevels();
		var open=this.state.open;
		if(list.length==0){
			open=false;
		}
		var anchorOrigin={horizontal: 'left', vertical: 'bottom'}
		var targetOrigin={horizontal: 'left', vertical: 'bottom'}
		return (
			<Popover className="weidu-popover"
				open={open}
				anchorEl={this.state.anchorEl}
				anchorOrigin={anchorOrigin}
				targetOrigin={targetOrigin}
				onRequestClose={this._dialogClose}>
				<div>
					{list.map(this._listItem)}
				</div>
			</Popover>

		)


	},
	_listItem:function(item,index){
		var level=this.state.items[this.state.index].name+': '+item.level;
		return <div key={index} className="wei-popover-item" onClick={(evt)=>this._listClick(evt,item)} >
					<div className="item-bg">
						<div className="item-bg-img"></div>
					</div>
					<ListItem primaryText={level} />
			   </div>

	},
	_listClick:function(evt,item){
		if (!this.isMounted()) return;
		this._setState();
		$('.weidu-popover').hide();
		//if(this.state.items[this.state.index].level!=item.level){
			this._setWeiDuListEmit(item.level,this.state.index);
		//}

	},
	_dialogClose:function(index){
		if (!this.isMounted()) return;
		$('.weidu-popover').hide();

		if(this.state.isDrag){
			this._setWeiDuListEmit(null,index);
		}else{
			this._setWeiDuListEmit(this.state.items[this.state.index].level,index);
		}
		this._setState();
	},
	_setWeiDuListEmit:function(level,index){
		var items=this.state.items;
		var index=this.state.index
		//拖拽后直接关闭
		if(!level && !items[this.state.index].level){
			var data=items[index];

			App.emit('APP-SET-DRAG-WEIDU-ITEMS', data, 'add','no');
			App.emit('APP-SET-WEIDU-ITEMS', {
				items: data,
				type: 'del',
				itemType: this.state.itemType,
				groupSelected:'no'
			});
			return;
		}
		//选中和上一次相同
		if(items[index].level==level){
			return;
		}
		if(level){
			items[index].level=level;
		}

		App.emit('APP-SET-WEIDU-ITEMS', { items: items });
		if(this.state.isDrag){
			App.emit('APP-REPORT-SET-TABLE-FIELDS',null,this.state.itemData.name);
		}

	},
	_setState:function(){
		if (!this.isMounted()) return;
		App.emit('APP-WERIDU-POP-OPEN',false);
		this.setState({
			open:false,
		});

	},
	_setIndex:function(arg){
		if (!this.isMounted()) return;
		this.setState({
			open:arg.open,
			items:arg.items||this.state.items,
			itemData:arg.itemData,
			index:arg.index,
			isDrag:arg.isDrag,
			anchorEl:arg.anchorEl,
			name:arg.name,
		});


	},
	_groupLevels:function(){
		var list=[];
		if(this.state.index>=0){
			var curItem=this.state.items[this.state.index];
			if(curItem.groupLevels){
				for(var i=0;i<curItem.groupLevels.length;i++){
					var o={
						level:curItem.groupLevels[i]
					}
					list.push(o);
				}
			}
		}

		return list;
	},
	_setEle:function(arg){
		if (!this.isMounted()) return;
		var ele=$(arg.ele).get(0);
		this.setState({
			anchorEl:ele,
			open:arg.open
		});

	}
})
