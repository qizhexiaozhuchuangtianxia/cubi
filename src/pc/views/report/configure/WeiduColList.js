var $ = require('jquery');
var React = require('react');
var App = require('app');
var ReportStore = require('../../../stores/ReportStore');
var App = require('app');
var {
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
		App.on('APP-SET-DRAG-WEIDU-INDEX-Col', this._setIndex);
	 	App.on('APP-SET-DRAG-WEIDU-ELE-Col', this._setEle);
	 	App.on('APP-SET-WEIDU-HIDE-POPVER-Col',this._close);

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
		return (
			<div className="showPopoverCol" >
			<div className="hidePrimaryCol">{list.map((item,key,list)=>this.primaryText(item,key,list))}</div>
				<div className="weidu-popover-colList"  >
					{list.map(this._listItem)}
				</div>
				<div className="weidu-layer-Col"  onClick={this._close}></div>
			</div>
		)


	},
	primaryText:function(item,index,list){
		var level=this.state.items[this.state.index].name+': '+item.level;
		return <div>{level}</div>
	},
	_setEle:function(arg){
		if (!this.isMounted()) return;
		var ele=$(arg.ele).get(0);
		this.setState({
			anchorEl:ele,
			open:true
		});

		var _this = this;
		var itemHei =48*this._groupLevels().length+16;
		var offsetLeft = $('.colItems .item-weidu').eq(this.state.index).offset().left;
		var itemWidth = $('.colItems .item-weidu').eq(this.state.index).width();
		$('.weidu-popover-colList').addClass('show-popover');
		$('.show-popover').css({'left':offsetLeft});
		$('.weidu-popover-colList').css({'width':itemWidth})
		$('.weidu-layer-Col').addClass('show-layer');
		var hidePrimaryWidth = $('.hidePrimaryCol').width()+72+32;

		setTimeout(function(){
			$('.weidu-popover-colList').addClass('animate');
			$('.animate').css({'height':itemHei,'width':hidePrimaryWidth});

		},100);

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
	_listItem:function(item,index){
		var level=this.state.items[this.state.index].name+': '+item.level;
		return <div key={index} ref="WeiduItem" className="wei-popover-item" onClick={(evt)=>this._listClick(evt,item)} >
					<div className="item-bg">
						<div className="item-bg-img"></div>
					</div>
					<ListItem className="listItem-text"  primaryText={level} />
			   </div>

	},
	_listClick:function(evt,item){
		if (!this.isMounted()) return;
		var _this = this;
		var index=this.state.index;
		setTimeout(function(){
			var itemWidth = $('.colItems .item-weidu').eq(index).width();
			$('.weidu-popover-colList').addClass('hideAnimate');
			$('.weidu-popover-colList').css({'width':itemWidth});
			$('.weidu-popover-colList').css({'height':'32px'});
		},100);
		setTimeout(function(){
			$('.weidu-popover-colList').removeClass('show-popover');
			_this._setWeiDuListEmit(item.level,index);
		},400);
		$('.weidu-popover-colList').removeClass('animate');
		$('.weidu-layer-Col').removeClass('show-layer');

	},
	_setWeiDuListEmit:function(level,index){
		var items=this.state.items;
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
	_setIndex:function(arg,type){
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
		var itemWidth = $('.colItems .item-weidu').eq(arg.index).width();
		$('.weidu-popover-colList').css({'width':itemWidth});
		$('.weidu-popover').css({'width':itemWidth});
		var itemHei=this.state.items[arg.index].groupLevels.length*48+16;
		var offsetLeft = $('.colItems .item-weidu').eq(arg.index).offset().left;
		$('.weidu-popover-colList').addClass('show-popover');
		$('.show-popover').css({'left':offsetLeft});
		$('.weidu-layer-Col').addClass('show-layer');
		var hidePrimaryWidth = $('.hidePrimaryCol').width()+72+32;

		setTimeout(function(){
			$('.weidu-popover-colList').addClass('animate');
			$('.weidu-popover-colList').css({'height':itemHei,'width':hidePrimaryWidth});

		},100);
		$('.weidu-layer-Col').addClass('show-layer');

	},
	_close:function(){

		var _this = this;
		if (!this.isMounted()) return;
		if(this.state.isDrag){
			$('.weidu-popover-colList').removeClass('show-popover');
			$('.weidu-popover-colList').css({'height':'32px'});
			this._setWeiDuListEmit(null,this.state.index);
		}else{
			setTimeout(function(){
				var itemWidth = $('.colItems .item-weidu').eq(_this.state.index).width();
				$('.weidu-popover-colList').addClass('hideAnimate');
				$('.weidu-popover-colList').css({'width':itemWidth});
			},100);
			setTimeout(function(){
				$('.weidu-popover-colList').removeClass('show-popover');

			},400);
			$('.weidu-popover-colList').css({'height':'32px'});
			this._setWeiDuListEmit(this.state.items[this.state.index].level,this.state.index);
		}
		$('.weidu-popover-colList').removeClass('animate');
	    $('.weidu-layer-Col').removeClass('show-layer');


	}


})
