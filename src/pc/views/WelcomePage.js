var $     = require('jquery');
var React = require('react');
var App   = require('app');

var SHOW_WELCOME_PAGE_TIP='SHOW_WELCOME_PAGE_TIP';

module.exports = React.createClass({
	displayName:'欢迎页面',
	getInitialState:function(){
		return {
			tipsState:false
		}
	},
	componentWillMount:function(){
		if(window.localStorage && localStorage.getItem(SHOW_WELCOME_PAGE_TIP) != 'NO'){
			localStorage.setItem(SHOW_WELCOME_PAGE_TIP,'NO');
			this.setState({
				tipsState:true
			})
		}
	},
	componentDidMount:function(){
		if(this.state.tipsState){
			this._welcomePageTipsHandle();
		}
	},
	render:function(){
		return (
			<div className="webcomePage">
				<div className="webcomePageLogoBox">
					<img src="themes/default/images/welcomePageLogo.png"/>
				</div>
			</div>
		)
	},
	_welcomePageTipsHandle:function(){//欢迎页面 是否显示提示用户如何操作的弹出层
		var guideLayer = $('<div class="guideLayer"></div>');
		var guideLayerMenu = $('<span class="iconfont icon-icmenu24px"></span>');
		var guideLayerMenuBox=$('<div class="guideLayerMenuBox"></div>');
		var guideLayerBox = $('<div class="guideLayerBox"><img src="themes/default/images/guideLayer.png"/></div>');
		var meKnow = $('<div class="meKnow"><a href="javascript:;">我知道了</a></div>');
		guideLayerMenu.appendTo(guideLayerMenuBox);
		guideLayerMenuBox.appendTo(guideLayer);
		guideLayerBox.appendTo(guideLayer);
		meKnow.appendTo(guideLayer);
		guideLayer.appendTo($('body'));
		meKnow.find("a").click(function(){
			guideLayer.remove();
		})
	}
})