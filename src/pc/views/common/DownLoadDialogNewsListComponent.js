import $ from 'jquery';
import {Component} from 'react';
import ReportStore from '../../stores/ReportStore';
import Loading from './Loading';
import App from 'app';
import {
	List,
	ListItem,
	FontIcon,
} from 'material-ui';
class DownLoadDialogNewsListComponent extends Component {
	constructor(props) {
		super(props);

		if ((!props.message) || (1 > props.message.length)) {
			this.state = {
				completed: 5,
				color: '#00e5ff',
				loading: false
			};
		}
		else {
			this.state = {
				completed: 5,
				color: '#00e5ff',
				listData: props.message,
				loading: false
			};
		}
	}

	componentWillMount() {
	}

	componentDidMount() {
		this._scrollBrar();
		this._formSubmit();
	}

	componentDidUpdate() {
		this._scrollBrar();
	}

	componentWillReceiveProps(nextProps) {//当父组件prop发生变化的时候，执行这个回调方法
	}

	componentWillUnmount() {
	}

	render() {
		if (!this.state.loading) {
			if ((this.state.listData) && (this.state.listData.length > 0)) {
				return (
					<div className="scrollBox">
						<List className="listClassName">
							{this.state.listData.map((item, key) => this._outPutDownListHandle(item, key))}
						</List>
					</div>
				)
			} else {
				return (
					<div className="downLoadListMessage">下载数据为空</div>
				)
			}
		} else {
			return (
				<div className="downLoadListMessage"><Loading/></div>
			)
		}
	}

	_scrollBrar() {
		$(".listClassName").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
	}

	_outPutDownListHandle(item, key) {//遍历输出下载的列表方法
		var leftIcon = 'iconfont icon-' + item.type + ' downLoadLeftIcon';
		if (!item.disabled) {
			return <ListItem
				className="downLoadItemList"
				key={key}
				primaryText={item.name}
				secondaryText={item.fileState}
				leftAvatar={<FontIcon className={leftIcon}/>}
				rightAvatar={<FontIcon
					className="iconfont icon-icxiazai24px downLoadRightIcon"
					onClick={(evt)=>this._downLoadHandle(evt, item)}
				/>}
			/>
		} else {
			return <ListItem
				className="downLoadItemList"
				key={key}
				primaryText={item.name}
				secondaryText={item.fileState}
				leftAvatar={<FontIcon className={leftIcon}/>}
				rightAvatar={<FontIcon
					className="iconfont icon-icxiazai24px downLoadRightIcon noClick"
				/>}
			/>
		}
	}

	_downLoadHandle(evt, item) {
		evt.stopPropagation();
		let url = '/services/report/runtime/downloadExcel';
		let $form = $("#formSubmitList");
		$form.attr("action", App.host + url + "?terminalType=PC&sessionId=" + encodeURIComponent(App.sid));
		$("input[name=id]").val(item.id);
		$form.submit();
	}

	_formSubmit() { //初始化页面form ifrem input等 结构
		if ($('#formSubmitList')) {
			$('#formSubmitList').remove();
		}
		if ($("iframe[name = myIfremIdList]")) {
			$("iframe[name = myIfremIdList]").remove();
		}
		let $form = $("<form></form>");
		let $ifrem = $("<iframe></iframe>");
		let $idInput = $("<input type='hidden' />");
		$form.attr("method", "POST");
		$form.attr("id", "formSubmitList");
		$form.attr("target", "myIfremIdList");
		$form.css('position', 'absolute');
		$form.css('top', '-1200px');
		$form.css('left', '-1200px');
		$form.appendTo('body');

		$ifrem.attr("name", "myIfremIdList");
		$ifrem.css("display", "none");
		$ifrem.appendTo('body');

		$idInput.attr('name', 'id');
		$idInput.attr('value', '1325456789');
		$idInput.appendTo($form);
	}
}
export default DownLoadDialogNewsListComponent;