/**
 * 图形分析右上角菜单
 * @author: XuWenyue
 */
var $ = require('jquery');
import {Component} from 'react';
import App         from 'app';
var {
	IconButton,
	MenuItem,
	Popover
} = require('material-ui');

class ChartRightMenu extends Component {

	constructor(props) {
		super(props);
		this.state = {
			nextlevelOpen: false,
			laststageOpen: false
		};
	}

	componentWillReceiveProps(nextProps) {
	}

	componentWillMount() {
	}

	componentDidMount() {
	}

	componentDidUpdate() {
	}

	render() {
		return (
			<div className="reportRightMenu">
				<MenuItem
					onClick={(evt)=>this._setMenuScrolls(evt)}
					leftIcon={<IconButton
						className="moreIconsClassName"
						iconClassName="icon iconfont icon-icgengduo24px" />}/>
				<Popover
					open={this.state.nextlevelOpen}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'left', vertical: 'top'}}
					onRequestClose={this._MenuScrollClose.bind(this)}
				>
					<MenuItem
						primaryText="关于此分析..."
						className='MenuItemClassNames'
						onClick={(evt)=>this._aboutReport(evt)} />
				</Popover>

			</div>
		)
	}

	_setMenuScrolls(event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			nextlevelOpen: true,
			anchorEl: event.currentTarget,
		});
		setTimeout(function() {
			$('.MenuItemClassNames').parent().parent().addClass('twoMenuItemStyle')
		}, 100)
	}

	_setTwoMenuScroll(event) {
		event.preventDefault();
		this.setState({
			laststageOpen: true,
			anchorEl: event.currentTarget,
		});
		setTimeout(function() {
			$('.twoMenuItem').parent().parent().addClass('twoMenuItemStyle')
		}, 100)
	}

	_MenuScrollClose() {
		this.setState({
				nextlevelOpen: false,
		});
	}

	_MenuTwoMenuScrollClose() {
		this.setState({
			nextlevelOpen: false,
			laststageOpen: false,
		});
	}

	/**
	 * 显示“关于此分析”对话框
	 * @private
	 */
	_aboutReport() {
		App.emit('APP-REPORT-SHOW-DIALOG-ABOUT-REPORT', true);
		this._MenuTwoMenuScrollClose();
	}
}

export default ChartRightMenu;
