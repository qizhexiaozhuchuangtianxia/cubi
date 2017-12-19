/**
 * 报表维度列表
 *
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var Item = require('./ZhibiaoItem');
var DialogFx= require('../DialogFx');
var DialogFi= require('../DialogFi');

module.exports = React.createClass({
	app:{},
	displayName:'zhibiaolistComponent',
	getInitialState: function() {
		return {
			dragStart: false,
			openDialog: false,
			openFiDialog:false,
			items:this.props.items,
			dragFx:true,
		}
	},
	componentWillUnmount:function(){
		for(var i in this.app){
			this.app[i].remove();
		}
	},
	componentDidMount:function(){
		var _this = this;
		this.drap();
		this.app['APP-DRAG-START-ZHIBIAO'] = App.on('APP-DRAG-START-ZHIBIAO', function(itemData) {
			_this.itemData = itemData;
			$(ReactDOM.findDOMNode(_this)).find('.drap-panel').show();
			_this._setChecked(true);
		});
		this.app['APP-DRAG-END-ZHIBIAO'] = App.on('APP-DRAG-END-ZHIBIAO', function() {
			$(ReactDOM.findDOMNode(_this)).find('.drap-panel').hide();
			_this._setChecked(false);
		});

        // 指标双击事件定义
        this.app['APP-DOUBLECLICK-ZHIBIAO'] = App.on('APP-DOUBLECLICK-ZHIBIAO', function (itemData) {
            _this.itemData = itemData;
            _this._selectedProcessor(_this);
            _this._setChecked(false);
        });

		this._setPrevNext(this,1000);
	},
	componentDidUpdate:function(){
		this._setPrevNext(this);
		//this._setOpenDialog(true);
	},
	componentWillReceiveProps: function(nextProps) {

	},
	itemData : '',
	render: function() {
		var items = [];
		// for(var i =0;i<this.props.items.length;i++){
		// 	items.push(this.props.items[i]);
		// 	if((i<this.props.check)||(this.props.check=="")){
		// 		items[i].checked = true;
		// 	}else{
		// 		items[i].checked = false;
		// 	}
		// };
		
		items = App.deepClone(this.props.items);
		var checkClass = (this.props.check>items.length)||(this.props.check=="")?"item-copy checked":"item-copy no-checked";
		var checkPanel = null;
		if(this.state.dragStart){
			checkPanel = <div className={checkClass}></div>;
		}
		return (
			<div className="zhibiao-List">
				<div className="prev iconfont icon-icchevronleft24px"></div>
				<div className="next iconfont icon-icchevronright24px"></div>
				<div className="items">
					{items.map(this.getItems)}
					{checkPanel}
				</div>
				<div className='drap-panel'></div>
				<DialogFx openDialog={this.state.openDialog} setOpenDialog={this._setOpenDialog}
				items={items} setItem={this._setItem}
				areaInfo={this.props.areaInfo} selectedWeiduList={this.props.selectedWeiduList}
				compareData={this.props.compareData}
            	compare={this.props.compare}/>
				<DialogFi openDialog={this.state.openFiDialog} setOpenDialog={this._setOpenFiDialog}
				items={items} setItem={this._setItem}
				areaInfo={this.props.areaInfo} selectedWeiduList={this.props.selectedWeiduList}
				compareData={this.props.compareData}
            	compare={this.props.compare}/>
			</div>
		)
	},
	getItems:function(item,index){
		// console.log(item,'item---')
		var key = new Date().getTime()+index;
		if(item.type){
			return <Item key={key} index={index} checked={item.checked} type={item.type} fieldName={item.fieldName} name={item.name}
			customName={item.customName} itemName={item.itemName} statistical={item.statistical}
			expression={item.expression} cexpression={item.cexpression} fxSign={item.fxSign} errMessage={item.errMessage} 
			pageFormater={item.pageFormater} distinct={item.distinct}/>;
		}
	},
	drap:function(){
		var _this = this;
		$(ReactDOM.findDOMNode(this)).find('.drap-panel').droppable({
			accept: '.zhibiao-items-panel>.item-drag',
			onDragEnter: function(e, source) {
				$(source).draggable('options').cursor = 'auto';
			},
			onDragLeave: function(e, source) {
				$(source).draggable('options').cursor = 'not-allowed';
			},
			onDrop: function(e,source) {
				$(source).draggable('options').cursor = 'move';
				//$(source).remove();

                ///////////
                _this._selectedProcessor(_this);
			}
		});
	},

    _selectedProcessor : function(_this) {
        var items = _this.props.items;
        var addOn = true;
        for(var i=0;i<items.length;i++){
            if(_this.itemData.type==8){
                addOn = true;
                break;
            }
            if(items[i].name==_this.itemData.name){
                addOn = false;
            }
        }
        if(addOn){
            items.push(_this.itemData);
            var dragName;
            if(_this.itemData.type=='2'){
                dragName = 'ZHIBIAO';
            }
            if(_this.itemData.type=='3'){
                dragName = 'HEJI';
            }
            if(_this.itemData.type=='4'){
                dragName = 'PINGJUN';
            }
            if(_this.itemData.type=='5'){
                dragName = 'MAX';
            }
            if(_this.itemData.type=='6'){
                dragName = 'MIN';
            }
            if(_this.itemData.type=='7'){
                dragName = 'JISHU';
            }
            if(_this.itemData.type=='9'){
                dragName = 'WEIDUJISHU';
            }
            if(_this.itemData.type!='8'){
                App.emit('APP-SET-ZHIBIAO-ITEMS',{items:items});
                App.emit('APP-SET-DRAG-'+dragName+'-ITEMS',_this.itemData,'del');
            }
            if(_this.itemData.type=='8'){
                App.emit('APP-ZHIBIAO-FX', {
                    openDialog:true,
                    titText:'',
                    fxText:'',
                    dragFx:true,
                    index:items.length-1,
                    fxSign:true,
                    type:8
                });
            }
            
            App.emit('APP-REPORT-SET-TABLE-FIELDS',null,_this.itemData.name);
        }
    },

	_setChecked:function(check){
		this.setState({
			dragStart:check
		})
	},
	_setPrevNext:function(_this,s){
		var speed = s?s:100;
		$(ReactDOM.findDOMNode(_this)).find('.items').css('left',0)
		setTimeout(function(){
			var width = document.body.clientWidth-(48+145);
			var defWidth = 0;
			$(ReactDOM.findDOMNode(_this)).find('.item').each(function(){
				var w = $(this).width();
				//var len = $(this).find('.text').text().length;
				//var w = len*12+60;
				defWidth+=(w+10);
			})
			var speedleft = 100;
			var slen  = Math.ceil((defWidth-width)/speedleft);
			var n = 0;
			if(defWidth>width){
				$(ReactDOM.findDOMNode(_this)).addClass('hover-items');
				$(ReactDOM.findDOMNode(_this)).find(".items").width(defWidth);
			}else{
				$(ReactDOM.findDOMNode(_this)).removeClass('hover-items');
			}
			$(ReactDOM.findDOMNode(_this)).find('.next').click(function(){
				n++;
				if(n>slen){
					n = slen;
				}
				$(ReactDOM.findDOMNode(_this)).find('.items').css('left',-n*speedleft)
			})
			$(ReactDOM.findDOMNode(_this)).find('.prev').click(function(){
				n--;
				if(n<0){
					n = 0;
				}
				$(ReactDOM.findDOMNode(_this)).find('.items').css('left',-n*speedleft)
			})
		},speed);
	},
	_setOpenDialog:function(open){
		this.setState({
			openDialog:open
		});
	},
	_setOpenFiDialog:function(open){
		this.setState({
			openFiDialog:open
		});
	},
	_setItem:function(submit,dragFx,items,index) {
		var item=this.props.items;
		if(submit){
			// if(!items[index].fxSign){return};
			App.emit('APP-SET-ZHIBIAO-ITEMS',{items:items});
		}else if(dragFx){
			item.splice(-1);
		}
	}
});
