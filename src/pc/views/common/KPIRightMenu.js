var $ = require('jquery');
var React = require('react');
var App   = require('app');
var {
	IconButton,
	MenuItem,
	Popover
} = require('material-ui');

module.exports = React.createClass({
	displayName: 'MenuItems',
	getInitialState: function () {
		return {
			nextlevelOpen: false,
			laststageOpen: false
		}
	},
	componentWillMount: function () {

	},

	componentDidMount: function () {
		App.on('APP-REPORT-CLOSE-KPI', this._setKPIClose);
	},

	render: function () {
		return (
			<div className="reportRightMenu">
				<MenuItem
					index={0}
					onClick={(evt)=>this._setMenuScrolls(evt)}
					leftIcon={<IconButton
						className="moreIconsClassName"
						iconClassName="icon iconfont icon-icgengduo24px"/>}/>
				<Popover
					open={this.state.nextlevelOpen}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'left', vertical: 'top'}}
					onRequestClose={this._MenuScrollClose}
				>
					<MenuItem
						index={1}
						primaryText="设定KPI格式"
						className='MenuItemClassNames'
						onClick={(evt)=>this._setKPIOpen(evt)}/>
					<MenuItem
						index={2}
						primaryText="关于此分析..."
						className='MenuItemClassNames'
						onClick={(evt)=>this._aboutReport(evt)}/>
				</Popover>

			</div>
		)
	},
	_setMenuScrolls: function (event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			nextlevelOpen: true,
			anchorEl: event.currentTarget,
		});
		setTimeout(function () {
			$('.MenuItemClassNames').parent().parent().addClass('twoMenuItemStyle')
		}, 100)
	},
	_setTwoMenuScroll: function (event) {
		event.preventDefault();
		this.setState({
			laststageOpen: true,
			anchorEls: event.currentTarget,
		});
		setTimeout(function () {
			$('.twoMenuItem').parent().parent().addClass('twoMenuItemStyle')
		}, 100)
	},
	_MenuScrollClose: function () {
		this.setState({
			nextlevelOpen: false,
		});
	},
	_MenuTwoMenuScrollClose: function () {
		this.setState({
			nextlevelOpen: false,
			laststageOpen: false,
		});
	},
	_setKPIOpen: function () {

		if (!this.isMounted()) return;
		App.emit('APP-REPORT-KPI', true);
		this._MenuScrollClose();
		this._MenuTwoMenuScrollClose();
	},
	_setKPIClose: function () {
		App.emit('APP-REPORT-KPI', false);
	},

	/**
	 * 显示“关于此分析”对话框
	 * @private
	 */
	_aboutReport: function() {
		if (!this.isMounted()) return;
		App.emit('APP-REPORT-SHOW-DIALOG-ABOUT-REPORT', true);
		this._MenuTwoMenuScrollClose();
	},

});