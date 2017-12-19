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
			name:'',
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
			/*proxy:'clone',*/
			revert: true ,
			onStartDrag:function(e){
				var top = $(e.target).parent().parent().offset().top;
				var left = $(e.target).parent().parent().offset().left;
				$(".drag-panel").css({left:left,top:top});
				App.emit('APP-DRAG-START-ZHIBIAO',{
					name:_this.props.name,
					fieldName:_this.props.fieldName,
					type:_this.props.type,
					statistical:_this.props.statistical,
					typeName:_this.props.typeName,
					itemName:_this.props.itemName,
					customName:_this.props.customName,
				});
			},
			onStopDrag:function(){
				App.emit('APP-DRAG-END-ZHIBIAO');
			}
		});
	},
	render: function() {
		//<FontIcon className="iconfont icon-iczhibiao24px drag-icon"/>
		return (
			<div className="item item-drag" onDoubleClick={this._doubleClick}>
				<div className="item-img-box">
					<div className="zhibiao-img"></div>
				</div>
				<div className="text">{this.props.name}</div>
			</div>
		)
	},

    _doubleClick:function(){
        App.emit('APP-DOUBLECLICK-ZHIBIAO',{
            name:this.props.name,
            fieldName:this.props.fieldName,
            type:this.props.type,
            statistical:this.props.statistical,
            typeName:this.props.typeName,
            itemName:this.props.itemName,
            customName:this.props.customName,
        });
    }
});