/**
 * 报表维度列表
 *
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
    	FontIcon,
	} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			name:this.props.name,
			id:''
		}
	},
	componentDidMount:function(){
		var _this = this;
		$(ReactDOM.findDOMNode(this)).draggable({
			proxy:function(source){
				var clone = $(source).clone(true).removeAttr('data-reactid').css('z-index',9999);
				clone.find('*').removeAttr('data-reactid');
				$(".drag-panel").html(clone);
				return clone;
			},
			revert:true,
			onStartDrag:function(e){
				var top = $(e.target).parent().parent().offset().top;
				var left = $(e.target).parent().parent().offset().left;
				$(".drag-panel").css({left:left,top:top});
			},
			onBeforeDrag:function(e){
				if(e.target.nodeName=='A'){
					return false;
				}
			}
		}).droppable({
			accept: '.item-zhibiao',
			onDragOver:function(e,source){

			},
			onDragLeave:function(e,source){

			},
			onDrop:function(e,source){
				var sIndex = $(source).data('index');
				var eIndex = $(this).data('index');
				$(this).removeAttr('style');
				$(source).removeAttr('style');
				App.emit('APP-SET-ZHIBIAO-ITEMS',{sort:{prev:sIndex,next:eIndex}});
			}
		});

	},
	render: function() {
		//var iconcls = this.props.checked?"checked":"";{this._zhibiaoFxIcon()}
		var textCls="text";
		if(this.props.type==8){
			textCls+=" fx-text"
		}else{
			textCls+=" fi-text"
		}
		return (
			<div className="item item-zhibiao" onClick={(evt)=>this._fxHandle(evt,this.props.index,this.props.fxSign,ReactDOM.findDOMNode(this))} data-index={this.props.index}>
				{this._zhibiaoIcon()}
				<div className={textCls}>{this.state.name}</div>
				{this._zhibiaoFxIcon()}
				<a href="javascript:void(0)" onClick={(evt)=>this.delItem(evt,this.props.index,this.props.fxSign)} className="iconfont icon-icguanbi24px close"></a>
			</div>
		)
	},
	_zhibiaoIcon:function(){
		// console.log(this.props.checked)
		var iconcls = "item-img-box";
		var iconBgCls="zhibiao-img";
		if(this.props.checked && this.props.fxSign==false){
			iconcls+=" checked-err"
		}else if(this.props.checked){
			iconcls+=" checked";
		}
		if(this.props.type==8){
			iconBgCls+=" jisuanlie-img";
		}
		//var className="iconfont icon-iczhibiao24px drag-icon "+iconcls;
		return <div className={iconcls}>
					<div className={iconBgCls}></div>
			   </div>
	},
	_zhibiaoFxIcon:function(){
		return <div className="fx-box">
						<a href="javascript:void(0)" className="fx-black"></a>
						<FontIcon className="iconfont icon-iczhankai24px fx-icon" />
					</div>
	},
	_fxHandle:function(e,index,fxSign,ele){
		e.stopPropagation();
		if(this.props.type!=8){
			App.emit('APP-ZHIBIAO-FI', {
				openDialog:true,
				titText:this.props.name,
				fxText:this.props.expression,
				cexpression:this.props.cexpression,
				dragFx:false,
				index:index,
				fxSign:fxSign,
				ele:ele,
				pageFormater:this.props.pageFormater,
				type:1
			});
		}else{
			App.emit('APP-ZHIBIAO-FX', {
				openDialog:true,
				titText:this.props.name,
				fxText:this.props.expression,
				cexpression:this.props.cexpression,
				dragFx:false,
				index:index,
				fxSign:fxSign,
				ele:ele,
				pageFormater:this.props.pageFormater,
				type:8
			});
		}
		
	},
	delItem:function(e,index,fxSign){
		e.stopPropagation();
		var data = {name:this.props.name,type:this.props.type,fieldName:this.props.fieldName,customName:this.props.customName,itemName:this.props.itemName,statistical:this.props.statistical};
		App.emit('APP-SET-ZHIBIAO-ITEMS',{items:data,type:'del',index:index,fxSign:fxSign});
		App.emit('APP-SET-RELOAD-DATA');
		if(this.props.type=='2'){
			App.emit('APP-SET-DRAG-ZHIBIAO-ITEMS',data,'add');
		}
		if(this.props.type=='3'){
			App.emit('APP-SET-DRAG-HEJI-ITEMS',data,'add');
		}
		if(this.props.type=='4'){
			App.emit('APP-SET-DRAG-PINGJUN-ITEMS',data,'add');
		}
		if(this.props.type=='5'){
			App.emit('APP-SET-DRAG-MAX-ITEMS',data,'add');
		}
		if(this.props.type=='6'){
			App.emit('APP-SET-DRAG-MIN-ITEMS',data,'add');
		}
		if(this.props.type=='7'){
			App.emit('APP-SET-DRAG-JISHU-ITEMS',data,'add');
		}
		if(this.props.type=='9'){
			data.distinct = this.props.distinct;
			App.emit('APP-SET-DRAG-WEIDUJISHU-ITEMS',data,'add');
		}
		// if(this.props.type=='8'){
		// 	App.emit('APP-SET-DRAG-JISUANLIE-ITEMS',data,'add');
		// }

		App.emit('APP-UPDATE-TABLE-CUSTOM-ARR', data, "del");
	}
});
