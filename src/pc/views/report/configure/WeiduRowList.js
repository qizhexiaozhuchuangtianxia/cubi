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
	 	App.on('APP-SET-WEIDU-HIDE-POPVER',this._close);

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
		var listLen = list.length

		var open=this.state.open;
		return (
			<div className="showPopover" >
			<div className="hidePrimary">{list.map((item,key,list)=>this.primaryText(item,key,list))}</div>
				<div className="weidu-popover" ref="popovers">
					{list.map((item,key,list)=>this._listItem(item,key,list))}
				</div>
				<div className="weidu-layer" ref="layer" onClick={this._close}></div>
			</div>


		)


	},
	primaryText:function(item,index,list){
		var level=this.state.items[this.state.index].name+': '+item.level;
		return <div key={index}>{level}</div>
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
		var offsetLeft =  $('.rowItems .item-weidu').eq(this.state.index).offset().left;
		var itemWidth = $('.rowItems .item-weidu').eq(this.state.index).width();
		$(this.refs.popovers).addClass('show-popover');
		$('.show-popover').css({'left':offsetLeft});
		$('.weidu-popover').css({'width':itemWidth})
		$(this.refs.layer).addClass('show-layer');
		var hidePrimaryWidth = $('.hidePrimary').width()+72+32;
		setTimeout(function(){
			$(_this.refs.popovers).addClass('animate');
		    $('.animate').css({'height':itemHei,'width':hidePrimaryWidth });
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
	_listItem:function(item,index,list){
		var listLen = list.length
		var style={
			backgroundColor:'#ddd',
			paddingLeft: '72px',
			fontSize:'14px'
		}
		var disabled = true;
		if(this.props.itemType == 'BASE' && listLen  == index+1){
			disabled = false;
			style.paddingLeft='0';
			style.backgroundColor='#2baf2b';
		}else if(this.props.itemType != 'BASE'){
			disabled = false;
			style.paddingLeft='0';
			style.backgroundColor='#2baf2b';
		}
		var level=this.state.items[this.state.index].name+': '+item.level;
		return <div key={index} ref="WeiduItem" className="wei-popover-item" onClick={(evt)=>this._listClick(evt,item,index,listLen)} >
					<div className="item-bg" style={{'backgroundColor':style.backgroundColor}}>
						<div className="item-bg-img"></div>
					</div>
					<ListItem className="Item" style={{'paddingLeft':style.paddingLeft,'fontSize':style.fontSize}}  disabled={disabled} primaryText={level}  />
			   </div>

	},
	_listClick:function(evt,item,thisIndex,listLen){
		if (!this.isMounted()) return;
		var _this = this;
		var index=this.state.index;

		if(listLen!=thisIndex+1 && this.props.itemType == 'BASE'){
			return
		}else{
			setTimeout(function(){
				var itemWidth = $('.rowItems .item-weidu').eq(index).width();
				$('.weidu-popover').addClass('hideAnimate');
				$('.weidu-popover').css({'width':itemWidth});
				$('.weidu-popover').css({'height':'32px'});
			},100);
			setTimeout(function(){
				$('.weidu-popover').removeClass('show-popover');
				 _this._setWeiDuListEmit(item.level,index)
			},400);
			$('.weidu-popover').removeClass('animate');
			$('.weidu-layer').removeClass('show-layer');
		}



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
		App.emit('APP-SET-WEIDU-ITEMS', { items: items,changeWeiIndex: index});
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
		var itemWidth = $('.rowItems .item-weidu').eq(arg.index).width();
		$('.weidu-popover').css({'width':itemWidth});
		var itemHei=this.state.items[arg.index].groupLevels.length*48+16;
		var offsetLeft = $('.rowItems .item-weidu').eq(arg.index).offset().left;
		$('.weidu-popover').addClass('show-popover');
		$('.show-popover').css({'left':offsetLeft});
		var hidePrimaryWidth = $('.hidePrimary').width()+72+32;

		setTimeout(function(){
			$('.weidu-popover').addClass('animate');
			$('.weidu-popover').css({'height':itemHei,'width':hidePrimaryWidth});

		},100);
		$('.weidu-layer').addClass('show-layer');

	},
	_close:function(){

		var _this = this;
		if (!this.isMounted()) return;
		if(this.state.isDrag){
			$('.weidu-popover').removeClass('show-popover');
			$('.weidu-popover').css({'height':'32px'});
			this._setWeiDuListEmit(null,this.state.index);
		}else{
			setTimeout(function(){
				var itemWidth = $('.rowItems .item-weidu').eq(_this.state.index).width();
				$('.weidu-popover').addClass('hideAnimate');
				$('.weidu-popover').css({'width':itemWidth});

			},100);
			setTimeout(function(){
				$('.weidu-popover').removeClass('show-popover');

			},400);
			$('.weidu-popover').css({'height':'32px'});
			this._setWeiDuListEmit(this.state.items[this.state.index].level,this.state.index);
		}
		$('.weidu-popover').removeClass('animate');
	    $('.weidu-layer').removeClass('show-layer');


	}


})
