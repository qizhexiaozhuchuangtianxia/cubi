/**
 * 报表维度列表
 *
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var Item = require('./WeiduItem');
var WeiduColList=require('./WeiduColList');

module.exports = React.createClass({
	displayName: '列维度',
	app:{},
	getInitialState: function() {
		return {
			dragStart: false,
			open:false,
			items:this.props.items,
			itemData:null,
			index:this.props.items.length-1,
			isDrag:false,
			anchorEl:document.body,
            rowItemCount:this.props.rowItemCount
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
		this.app['APP-DRAG-START-WERIDU-COL'] = App.on('APP-DRAG-START-WERIDU-COL', function(itemData) {
			_this.itemData = itemData;
			$(ReactDOM.findDOMNode(_this)).find('.drap-panel').show();
			_this._setChecked(true);

		});
		this.app['APP-DRAG-END-WERIDU-COL'] = App.on('APP-DRAG-END-WERIDU-COL', function() {
			$(ReactDOM.findDOMNode(_this)).find('.drap-panel').hide();
			_this._setChecked(false);
		});

        // 定义双击事件
        this.app['APP-DOUBLECLICK-WEIDU-COL'] = App.on('APP-DOUBLECLICK-WEIDU-COL', function(itemData) {

            if (_this.props.rowItemCount <= _this.props.items.length) {
                return;
            }

            _this.itemData = itemData;
            _this._selectedProcessor(_this);
            _this._setChecked(false);
        });

		this._setPrevNext(this,1000);

		this.app['APP-WERIDU-POP-OPEN-Col'] = App.on('APP-WERIDU-POP-OPEN-Col',this._setOpen);
		this.app['APP-WERIDU-COL-OPEN-Col'] = App.on('APP-WERIDU-COL-OPEN-Col',this._setOpen);
	},
	componentDidUpdate:function(){
		this._setPrevNext(this);
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			items:nextProps.items,
			index:nextProps.items.length-1,
            rowItemCount:this.props.rowItemCount
		})
	},
	itemData : '',
	render: function() {
		var items = [];
		if (this.props.items != null) {
			for (var i = 0; i < this.props.items.length; i++) {
				items.push(this.props.items[i]);
				if((i<this.props.check)||(this.props.check=="")){
					items[i].checked = true;
				}else{
					items[i].checked = false;
				}
			};
		}
		var checkClass = (this.props.check>items.length)||(this.props.check=="")?"item-copy wei-checked":"item-copy no-checked";
		var checkPanel = null;
		if(this.state.dragStart){
			checkPanel = <div className={checkClass}></div>;
		}
		return (
			<div className="weidu-List">
				<div className="prev iconfont icon-icchevronleft24px"></div>
				<div className="next iconfont icon-icchevronright24px"></div>
				<div className="items colItems">
					{items.map(this.getItems)}
					{checkPanel}
				</div>
				<div className='drap-panel'></div>
				<WeiduColList
					open={this.state.open}
					itemData={this.state.itemData} items={items}
					index={this.state.index}
					isDrag={this.state.isDrag}
					anchorEl={this.state.anchorEl}
					itemType="col"/>
			</div>
		)
	},
	getItems:function(item,index){
		var key = new Date().getTime()+index;
		if(item.type){
			return <Item key={key} index={index} itemType="col" checked={item.checked} type={item.type} fieldName={item.fieldName} name={item.name} customName={item.customName}
			level={item.level} groupType={item.groupType} groupLevels={item.groupLevels}
			setClickPopover={this._setClickPopover}/>;
		}else{
			if(item.checked){
				return <div key={item.fieldName} className="item-copy wei-checked"></div>;
			}else{
				return <div key={item.fieldName} className="item-copy"></div>;
			}
		}
	},
	drap:function(){
		var _this = this;
		$(ReactDOM.findDOMNode(this)).find('.drap-panel').droppable({
			accept: '.weidu-items .item-drag',
			onDragEnter: function(e, source) {
				$(source).draggable('options').cursor = 'auto';
			},
			onDragLeave: function(e, source) {
				$(source).draggable('options').cursor = 'not-allowed';
			},
			onDrop: function(e,source) {
				$(source).draggable('options').cursor = 'move';

                // 处理选择后的结果
                _this._selectedProcessor(_this);
			}
		});
	},

    _selectedProcessor : function(_this) {

        var items = _this.props.items;
        var addOn = true;
        for(var i=0;i<items.length;i++){
            if(items[i].name==_this.itemData.name){
                addOn = false;
            }
        }

        if(addOn){
            items.push(_this.itemData);
            //判断是否是树形维度
            if ((_this.itemData.groupType=="GROUP_TITLE_FIELD") ||
                ("GROUP_DATE_TITLE_FIELD" == _this.itemData.groupType)) {

                var popObj={
                    open:false,
                    items:items,
                    itemData:_this.itemData,
                    isDrag:true,
                    //anchorEl:document.body
                }
                _this._setDragPopover(popObj);

            }else{
                App.emit('APP-SET-COL-WEIDU-ITEMS',{items:items});
                App.emit('APP-REPORT-SET-TABLE-FIELDS',null,_this.itemData.name);
            }

            App.emit('APP-SET-DRAG-WEIDU-ITEMS',_this.itemData,'del');

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
			var width = (document.body.clientWidth-(48+145+88))/2;
			var defWidth = 0;
			$(ReactDOM.findDOMNode(_this)).find('.item').each(function(){
				var w = $(this).width();
				//var len = $(this).find('.text').text().length;
				//var w = len*12+60;
				defWidth+=(w+10);
			})
			var speed = 100;
			var slen  = Math.ceil((defWidth-width)/speed);
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
				$(ReactDOM.findDOMNode(_this)).find('.items').css('left',-n*speed)
			})
			$(ReactDOM.findDOMNode(_this)).find('.prev').click(function(){
				n--;
				if(n<0){
					n = 0;
				}
				$(ReactDOM.findDOMNode(_this)).find('.items').css('left',-n*speed)
			})
		},speed);
	},
	_setOpen:function(open){
		this.setState({
			open:open
		})
	},

	_setClickPopover:function(index,ele,name){

		var obj={
			open:true,
			items:this.state.items,
			itemData:this.state.itemData,
			index:index,
			isDrag:false,
			anchorEl:ele,
			name:name,
		}

		App.emit('APP-SET-DRAG-WEIDU-INDEX-Col', obj);
	},
	_setDragPopover:function(popObj){
		if (!this.isMounted()) return;
		this.setState({
			open:popObj.open,
			items:popObj.items,
			itemData:popObj.itemData,
			index:popObj.items.length-1,
			isDrag:popObj.isDrag,
			anchorEl:popObj.anchorEl
		});
		var _this=this;
		setTimeout(function(){
			var e=$('.weiduTable').eq(1).find('.item-weidu').eq(_this.state.items.length-1);
			App.emit('APP-SET-DRAG-WEIDU-ELE-Col', {ele:e,open:true,});
			App.emit('APP-WERIDU-ROW-OPEN-Col',false);
		},100);
	},
});
