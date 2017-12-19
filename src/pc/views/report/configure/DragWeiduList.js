/**
 * 报表维度列表
 * 
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var Item = require('./DragWeiduItem');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			items:[]
		}
	},
	componentDidMount:function(){
		this._setPrevNext(this,1000)
	},
	componentDidUpdate:function(){
		this._setPrevNext(this)
	},
	render: function(){
		var items = this.props.items;
		return (
			<div className="weidu-items">
				<div className="prev iconfont icon-icchevronleft24px"></div>
				<div className="next iconfont icon-icchevronright24px"></div>
				<div className="weidu-items-panel">
					{items.map(this.getItems)}
				</div>
			</div>
		)
	}, 
	getItems:function(item,index){
		var disabled = false;		
		
		if (this.props.reportType =='KPI') {
			//disabled = true;
			return "";
		}
		return <Item key={item.fieldName} 
				disabled={disabled} 
				dimensionDataType={item.dimensionDataType} 
				customName={item.customName} 
				fieldName={item.fieldName} 
				type={item.type} 
				name={item.name} 
				groupType={item.groupType} 
				groupLevels={item.groupLevels} 
				reportType = {this.props.reportType}
				dimensionId={item.dimensionId}
				/>;	
	},
	_setPrevNext:function(_this,s){
		var speed = s?s:100;
		$(ReactDOM.findDOMNode(_this)).find('.weidu-items-panel').css('left',0)
		setTimeout(function(){
			var width = document.body.clientWidth-(48+145+80);
			var defWidth = 0;
			$(ReactDOM.findDOMNode(_this)).find('.item-drag').each(function(){
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
				$(ReactDOM.findDOMNode(_this)).find(".weidu-items-panel").width(defWidth);
			}else{
				$(ReactDOM.findDOMNode(_this)).removeClass('hover-items');
			}
			$(ReactDOM.findDOMNode(_this)).find('.next').click(function(){
				n++;
				if(n>slen){
					n = slen;
				}
				$(ReactDOM.findDOMNode(_this)).find('.weidu-items-panel').css('left',-n*speedleft)
			})
			$(ReactDOM.findDOMNode(_this)).find('.prev').click(function(){
				n--;
				if(n<0){
					n = 0;
				}
				$(ReactDOM.findDOMNode(_this)).find('.weidu-items-panel').css('left',-n*speedleft)
			})
		},speed);
	}
});