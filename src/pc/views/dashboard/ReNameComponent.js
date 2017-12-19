var React = require('react');
var {
    IconButton
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	render: function() {
		var disableBool = this.props.checkLenProps==1?false:true;
		var toolTip = '';
		var iconClassName='iconfont icon-icgaiming24px addreNameIconBtn';
		var	buttonClassName='authorityIconBtn addreNameIconParent';

		if(this.props.checkLenProps!=1 && this.props.checkLenProps!=0){
			toolTip = '不支持多个重命名';
		}
		if(!disableBool){
			iconClassName='iconfont icon-icgaiming24px';
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
    	if(this.props.checkLenProps!=1){
    		return;
    	}
    	this.props.reNameFun();
    }
});