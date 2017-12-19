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
			name: this.props.name,
			level:this.props.level,
			id: ''
		}
	},

	componentDidMount: function() {

		var _this = this;
		$(ReactDOM.findDOMNode(this)).draggable({
			proxy: function(source) {
				var clone = $(source).clone(true).removeAttr('data-reactid').css('z-index', 9999);
				clone.find('*').removeAttr('data-reactid');
				$(source).parent().after(clone);
				return clone;
			},
			revert: true,
			onStartDrag: function(e) {
				var top = $(e.target).parent().parent().offset().top;
				var left = $(e.target).parent().parent().offset().left;
				$(".drag-panel").css({
					left: left,
					top: top
				});
			},
			onBeforeDrag: function(e) {
				if (e.target.nodeName == 'A') {
					return false;
				}
			}
		}).droppable({
			accept: '.item-weidu',
			onDragOver: function(e, source) {

			},
			onDragLeave: function(e, source) {

			},
			onDrop: function(e, source) {
				var sIndex = $(source).data('index');
				var eIndex = $(this).data('index');
				$(this).removeAttr('style');
				$(source).removeAttr('style');
				if (_this.props.itemType == 'row') {
					App.emit('APP-SET-ROW-WEIDU-ITEMS', {
						sort: {
							prev: sIndex,
							next: eIndex
						}
					});
				} else if (_this.props.itemType == 'col') {
					App.emit('APP-SET-COL-WEIDU-ITEMS', {
						sort: {
							prev: sIndex,
							next: eIndex
						}
					});
				} else {
					App.emit('APP-SET-WEIDU-ITEMS', {
						sort: {
							prev: sIndex,
							next: eIndex
						}
					});
				}
			}
		});

	},
	render: function() {
		var iconcls = this.props.checked ? "wei-checked" : "";
		var iconclassName = "item-img-box " + iconcls;
		var name=this.state.name+':'+this.state.level;
		if(!this.state.level){
			name=this.state.name;
		};
		// if(!name || name==''){
		// 	name=this.state.name;
		// }
		if (("GROUP_TITLE_FIELD"      == this.props.groupType) ||
		    ("GROUP_DATE_TITLE_FIELD" == this.props.groupType)){
                return (
                    <div className="item item-weidu" data-index={this.props.index} onClick={(evt)=>this._setClickPopover(evt, this.props.index, ReactDOM.findDOMNode(this), this.state.name)}>
                        <div className={iconclassName}>
                            <div className="weidu-img"></div>
                        </div>
                        <div className="text fx-text">{name}</div>
                        <div className="weidu-icon-box">
                            <a className="weidu-arrow-icon" href="javascript:void(0)"></a>
                            <FontIcon className="iconfont icon-icarrowdropdown24px"/>
                        </div>
                        <a href="javascript:void(0)" onClick={(evt)=>this.delItem(evt)}
                           className="iconfont icon-icguanbi24px close"></a>
                    </div>
                )

		}else{
			return (
				<div className="item item-weidu" data-index={this.props.index}>
					<div className={iconclassName}>
						<div className="weidu-img"></div>
					</div>
					<div className="text">{this.state.name}</div>
					<a href="javascript:void(0)" onClick={(evt)=>this.delItem(evt)} className="iconfont icon-icguanbi24px close"></a>
				</div>
			)
		}

	},
	delItem: function(e) {
		e.stopPropagation();
		var data = {
			name: this.props.name,
			type: this.props.type,
			fieldName: this.props.fieldName,
			customName: this.props.customName,
			dimensionDataType: this.props.dimensionDataType,
			groupType: this.props.groupType,
			groupLevels:this.props.groupLevels,
			dimensionId:this.props.dimensionId
		};
		var delData=JSON.stringify(data);
		delData=JSON.parse(delData);
		delData.name=this.props.name;

		//判断是否是树形维度
		if (("GROUP_TITLE_FIELD" == this.props.groupType) || ("GROUP_DATE_TITLE_FIELD" == this.props.groupType)) {
			console.log('this.props.fieldName',this.props.fieldName);
			// data.name=this.props.fieldName;
			data.name=this.props.name;
		}
		App.emit('APP-SET-DRAG-WEIDU-ITEMS', data, 'add');

		App.emit('APP-SET-WEIDU-ITEMS', {
			items: delData,
			type: 'del',
			itemType: this.props.itemType
		});

		App.emit('APP-SET-RELOAD-DATA');
		App.emit('APP-UPDATE-TABLE-CUSTOM-ARR', data, "del");
	},
	_setClickPopover:function(evt,index,ele,name){

		if (("GROUP_TITLE_FIELD"      == this.props.groupType) ||
			("GROUP_DATE_TITLE_FIELD" == this.props.groupType)) {
			this.props.setClickPopover(index,ele,name);
		}
	},

});
