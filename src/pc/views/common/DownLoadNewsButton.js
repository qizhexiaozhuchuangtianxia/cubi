import React, {Component} from 'react';
import App from 'app';
import {
	IconButton,
} from 'material-ui';

var SMSStore = require('../../stores/SMSStore');

class DownLoadNewsButton extends Component {
	constructor(props) {
		super(props);
		this.app = {};
		this.state = {
			unreadMessages: false
		}
	}

	componentWillMount() {
	}

	componentDidMount() {
		//订阅 打开或者关闭当下下载的列表弹出层的方法
		this.app['APP-NEWS-UNREAD-MESSAGES-HANDLE'] = App.on('APP-NEWS-UNREAD-MESSAGES-HANDLE', this._newsUnreadMessageHandle.bind(this));
	}

	componentWillUnmount() {

		for (let i in this.app) {
			this.app[i].remove();
		}
	}
	componentWillReceiveProps(nextProps) {

		var fixedMessage = this._receiveMessage(nextProps.receivedMessage);
		this.setState({
			unreadMessages: fixedMessage.unreadMessages,
			receivedMessage: fixedMessage
		});
	}
	render() {
		if (this.state.unreadMessages) {
			return (
				<div className="newsButtonBox">
					<div className="newsTip"></div>
					<IconButton
						iconClassName='iconfont icon-icxiaoxi24px newsButtonIcon'
						onClick={(evt)=>this._openDownLoadListDialogHandle(evt)}/>
				</div>
			)
		} else {
			return (
				<div className="newsButtonBox">
					<IconButton
						iconClassName='iconfont icon-icxiaoxi24px newsButtonIcon'
						onClick={(evt)=>this._openDownLoadListDialogHandle(evt)}/>
				</div>
			)
		}

	}

	_newsUnreadMessageHandle(obj) {
		this.setState({
			unreadMessages: obj.show
		})
		console.log('小蓝点是否要显示的方法');
	}

	_openDownLoadListDialogHandle(evt) {

		SMSStore.readMessage();
		this.setState({
			unreadMessages: false
		});

		evt.stopPropagation();

		if (this.state.receivedMessage) {
			App.emit('APP-OPEN-AND-CLOSE-DOWN-LOAD-DIALOG-HANDLE', {
				message: this.state.receivedMessage.message
			});
		}
		else {
			App.emit('APP-OPEN-AND-CLOSE-DOWN-LOAD-DIALOG-HANDLE', {
				message: []
			});
		}
	}

	/**
	 * 接收消息，根据消息内容判断是否要显示“有未读消息”
	 * 针对消息进行Merge，旧消息将被新的消息覆盖 fail → success → start → wait
	 * 根据消息体的sendStatus判断是否有新的消息
	 * 根据下载信息内容整理
	 * @param msg
	 * @private
	 * @author XuWenyue
	 */
	_receiveMessage(msg) {

		if (!msg) {
			return ({
				unreadMessages: false,
				message: []
			});
		}

		var contents  = msg.contents;
		var length    = contents.length;
		var messages  = {};
		var status    = {
			wait    : 1,
			start   : 2,
			success : 3,
			fail    : 4
		};

		// 解析下载信息，新的消息替换旧消息
		var hasNewMsg = false;
		for (var counter = 0; counter < length; counter++) {

			var content = eval('(' + contents[counter].content + ')');

			if (!messages[content.id]) {
				messages[content.id] = content;
			}
			else {
				if (status[content.status] > status[messages[content.id].status]) {
					messages[content.id] = content;
				}
			}

			if ("0" == contents[counter].sendStatus) {
				hasNewMsg = true;
			}

		}

		// Map → List
		// 整理下载信息内容
		var mList     = [];
		for (var item in messages) {
			if (!messages.hasOwnProperty(item)) {
				continue;
			}

			mList.push(formatContent(messages[item]));
		}

		return ({
			unreadMessages: hasNewMsg,
			message: mList
		});

		// 整理下载信息内容
		function formatContent(content) {

			if (content.type == 'excel') content.type = 'icexcel24px';
			if (content.type == 'csv')   content.type = 'iccsv24px';
			if (content.type == 'png')   content.type = 'icpng24px';

			if ('success' == content.status) {

				let curDate  = new Date();
				let crtDate  = new Date(content.createTime.replace(/-/g, "/"));
				let timespan = curDate.getTime() - crtDate.getTime();

				timespan = Math.ceil(content.deleteDays - (timespan / 1000 / 60 / 60 / 24));

				if (0 >= timespan) {
					content.fileState = '此文件已删除';
					content.disabled = true;
				}
				else {
					content.fileState = '此文件将在' + timespan + '天后删除';
					content.disabled  = false;
				}

			}
			else if ((content.status == 'start') ||
				     (content.status == 'wait')) {

				content.fileState = '文件下载中...';
				content.disabled  = true;

			}
			else if ("fail" === content.status) {

				content.fileState = '文件下载失败';
				content.disabled  = true;

			}
			else {

				content.fileState = '文件下载异常';
				content.disabled  = true;

			}

			return content;
		}

	}

}
DownLoadNewsButton.displayName = '异步下载的组件';
export default DownLoadNewsButton;