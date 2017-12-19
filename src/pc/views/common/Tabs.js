var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			selectIndex: 0,
			contentData: this.props.data[0].content
		}
	},
	componentDidMount: function() {
		App.on('APP-TAB-COMPONENT', this._getContentData);
	},
	render: function() {
		if (this.props.type == 0) {
			return (
				<div className="cubi-tabs-container">
					<div className="cubi-tabs">
						<div className="page-container">
							<ul>
						        {this.props.data.map(this._renderTab)}
						    </ul>
						</div>
					</div>
					{this.props.data.map(this._renderContent)}
				</div>
			)
		} else {
			return (
				<div className="cubi-tabs-container">
					<div className="cubi-tabs">
						<div className="page-container">
							<ul>
						        {this.props.data.map(this._renderTab)}
						    </ul>
						</div>
					</div>
					{this._renderContentAjax()}
				</div>
			)
		}
	},
	_renderContent: function(data, index) {
		if (this.state.selectIndex == index) {
			return (
				<div key={index} className="cubi-tabs-content">
					{data.content}
				</div>
			);
		} else {
			return (
				<div key={index} className="cubi-tabs-content hide">
					{data.content}
				</div>
			);
		}
	},
	_renderContentAjax: function() {
		return (
			<div className="cubi-tabs-content">
				{this.state.contentData}
			</div>
		);
	},
	_getContentData: function(component) {
		var state = this.state;
		state.contentData = component;
		this.setState(state);
	},
	_renderTab: function(data, index) {
		var _this = this;
		if (this.state.selectIndex == index) {
			return (
				<li onClick={function(){_this._handleTab(index)}} key={index} index={index} className="cubi-tab">
		        	<a href="javascript:void(0)" className="active">{data.label}</a>
		        </li>
			);
		} else {
			return (
				<li onClick={function(){_this._handleTab(index)}} key={index} index={index} className="cubi-tab">
		        	<a href="javascript:void(0)">{data.label}</a>
		        </li>
			);
		}
	},
	_handleTab: function(index) {
		var state = this.state;
		state.selectIndex = index;
		this.setState(state);
		if (this.props.type == 1 && this.props.onTouchTap) {
			this.props.onTouchTap.call(this, index);
		}
	}
})