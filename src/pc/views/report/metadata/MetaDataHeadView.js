var React = require('react');
var App = require('app');
var {

	IconButton

} = require('material-ui');

module.exports = React.createClass({

	displayName: 'MetaDataHeadView',

	propTypes: {
		title: React.PropTypes.string.isRequired,
		canBack: React.PropTypes.bool,
		onClickBack: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			onClickBack: function(medatada) {

			},
		}
	},

	render: function() {
		return (  
			<div className="header">
				<div className="top-bar"></div>
				<div className="head">  
					{this._renderBackButton(this.props.canBack)}
					<div className="name-box">{this.props.title}</div>
				</div>
			</div>
		)

	},
	_renderBackButton: function(canBack) {
		if (canBack) {
			return (
				<div className="back-box">
					<IconButton className="headerIconClassName" iconClassName="iconfont icon-icarrowback24px" onTouchTap={(evt)=>this._backHandle(evt)}/>
				</div>
			)
		} else {
			return (
				<div className="back-box"> 
					<i className=" headerIconClassName iconfont icon-icshujulifang24px"/>
				</div> 
			) 
		}
	},
	_backHandle: function(evt) {
		this.props.onClickBack();
	}
})