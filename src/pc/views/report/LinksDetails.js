var $ = require('jquery');
var React = require('react');
var App = require('app');

var {
	FlatButton,
	Dialog,
	IconButton,
	List,
	ListItem,
	FontIcon
} = require('material-ui');



module.exports = React.createClass({


	getInitialState: function() {
		return {
			
		}
	},

	componentWillMount: function() {
		
	},

	componentDidMount: function() {
		this._calculationWidth();
		this._scrollBar();
	},

	componentDidUpdate: function() {

	},

	render: function() {
		return (
			<div>
				{this.props.listData.map(this._listDomHanle)}
			</div>
		)
	},

	_listDomHanle: function(item,key){
		var curItem=item;
		if(item.length>1){
			curItem=curItem.slice(0,item.length-1);
		}
		return	<ListItem className="LinksListItem" key={key} leftIcon={<FontIcon className="left-icon"/>}>
					<div>{item[item.length-1].name}</div>
					<div className="textDashBox">
						{curItem.map(this._listDashboard)}
					</div>
	    		</ListItem>
	},
	_listDashboard:function(item,key){
		if(key==0){
			return <span key={key} className="textDashSpan"><span className="textArrow"></span><span className="textName">{item.name}</span></span>
		}else{
			return <span key={key} className="textDashSpan"><span className="textArrow">></span><span className="textName">{item.name}</span></span>
		}
		
	},
	_calculationWidth:function(){

		var scrollBoxSaveAs=$('.scrollBoxSaveAs');
		var textDashBox=$('.textDashBox');
		var width=$(textDashBox).width();

		for(var i=0;i<textDashBox.length;i++){
			var curtextDashBox=$('.textDashBox').eq(i);
			var curtextDashSpan=$(curtextDashBox).find('.textDashSpan');
			var spanLen=$(curtextDashSpan).length
			var spanWidth=0;

			for(var j=0;j<$(curtextDashSpan).length;j++){	
				spanWidth+=$(curtextDashBox).find('.textDashSpan').eq(j).width();
			}
			var len=parseInt(spanWidth/width);

			if(len>0){
				for(var h=0;h<spanLen;h++){
					
					if($(curtextDashBox).find('.textDashSpan').length==1 && spanWidth+10>=width){
						
						h=spanLen+1;
						//var w=spanWidth+80-width;
						var span=$(curtextDashBox).find('.textDashSpan').eq(0);
						var spanName=$(span).find('.textName');
				
						var text=$(spanName).text();
						var len=text.length;
						//var spanW=$(spanName).width();
						var zhong=0;
						var ying=0;
						
						for(var z=len;z>0;z--){
							var str=text.substring(z-1,len) 
							if(/^[\u4e00-\u9fa5]/.test(str)){
								zhong++;
							}else{
								ying++;
							}
							if((zhong*12+ying*8)>=width-20){
								var newtext=text.substring(z);
								$(spanName).text(text.substring(z));
								$(span).find('.textArrow').html('...');
								z=0;
							}
						}
						
						
					}else{

						var curspan=$(curtextDashBox).find('.textDashSpan').eq(h);
						var spanwid=$(curspan).width();
						spanWidth=spanWidth-spanwid;
						$(curspan).remove();
						h=h-1;
						if(spanWidth<width){
							h=spanLen+1;
							$(curtextDashBox).find('.textDashSpan').eq(0).find('.textArrow').html('...');
						}
						
					}
				
				}
			}
			
		}
	},
	_scrollBar:function(){//滚动条方法
		var _this=this;
		if(this.props.listData.length>0){
			
	        $('.scrollBoxs').mCustomScrollbar({
	            autoHideScrollbar:true,
	            theme:"minimal-dark"
	        });
		   
		}
	},

})