import {Component} from 'react';
import App from 'app';
import DownLoadDialogNewsListComponent from './DownLoadDialogNewsListComponent'
import {
    Dialog,
    FlatButton
} from 'material-ui';
class NewsListComponent extends Component {
	constructor(props) {
		super(props);
		this.app = {}
		this.state = {
			openDialog:false
		};
	}
	componentDidMount (){
		//订阅 打开或者关闭当下下载的列表弹出层的方法
        this.app['APP-OPEN-AND-CLOSE-DOWN-LOAD-DIALOG-HANDLE'] = App.on('APP-OPEN-AND-CLOSE-DOWN-LOAD-DIALOG-HANDLE', this._openAndCloseDialogHandle.bind(this));
	}
	componentWillUnmount(){
		for (let i in this.app) {
			this.app[i].remove();
		}
	}
	render (){
		return (
			<div>{this._dialogComponent()}</div>
		)
	}
	_dialogComponent(){
		/*var actions = [不要删除
	        <FlatButton label="清空" onTouchTap={()=>this._clearListHandle()}/>
	    ];
	    actions={actions}*/
        return  <Dialog 
                    contentClassName="downLoadDialog" 
		            titleClassName="downLoadDialogTitle" 
		            bodyClassName="downLoadDialogBody" 
		            actionsContainerClassName="downLoadDialogAction"
                    title='消息列表'
                    modal={false} 
                    open={this.state.openDialog} 
                    onRequestClose={()=>this._closeDialogHandle()}>
                    <DownLoadDialogNewsListComponent
	                    message = {this.state.message} />
                </Dialog>
	}
	_openAndCloseDialogHandle (message){//打开弹出层的方法
		this.setState({
			openDialog:true,
			message: message.message
		})
	}
	_closeDialogHandle(){//关闭弹出层的方法
		this.setState({
			openDialog:false
		})
	}
	_clearListHandle(){//清空弹出层列表按钮的方法
		console.log('清空了无效数据');
	}
}
NewsListComponent.displayName = '异步下载弹出层组件'; 
export default NewsListComponent