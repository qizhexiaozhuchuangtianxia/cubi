var React = require('react');
var App = require('app');
var SetAuthorityComponent = require('./SetAuthorityComponent');
var {
    IconButton
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentDidMount:function(){
	},
	render: function() {
		var disableBool = this.props.checkLenProps==1 && this.props.authority?false:true;
		var toolTip = '';
		var iconClassName='iconfont icon-renqun addreNameIconBtn';
		var	buttonClassName='authorityIconBtn addreNameIconParent';
		if(this.props.checkLenProps!=1 && this.props.checkLenProps!=0){
			toolTip = '不支持多个配置权限';
		}else if(!this.props.authority && this.props.checkLenProps!=0){
			toolTip = '您没有权限';
		}

		if(!disableBool){
			iconClassName='iconfont icon-renqun';
			buttonClassName='authorityIconBtn';
		}

		return (
			<IconButton 
				tooltipPosition='bottom-right'
				tooltip={toolTip} 
			 	touch={true}
				onClick={this._handClick} 
				disableTouchRipple={disableBool} 
				className={buttonClassName}
				iconClassName={iconClassName}></IconButton>
		)
	},
    _handClick:function(){
    	if(this.props.checkLenProps!=1 || !this.props.authority){
    		return;
    	}
    	App.emit('APP-DRAWER-RIGHT', <SetAuthorityComponent dashboardId={this.props.resourceId} />,360);
    }
});