var React = require('react');
var App = require('app');
var {
	Router
	} = require('react-router');
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState:function(){
		return {}
	},
	render:function(){
		return	(
			<div className="pageNavClassName">
				<ul>
					{this.props.headerNavData.map(this._pageNavHandle)}
				</ul>
			</div>
		)
	},
	_pageNavHandle:function(item,key){//返回页面面包屑导航结构
		if(key == (this.props.headerNavData.length-1)){
			return <li key={key} className="noPointer"><a>{item.name}</a></li>
		}else{
			return <li key={key} onClick={(evt)=>this._onClickHandle(evt,item)}><a>{item.name}</a><span>></span></li>
		}
	},
	_onClickHandle:function(evt,item){
		evt.stopPropagation();
		var routerUrl = '/report/list';
		if(!item.dialog){
			if(item.linkType == 'DIRECTORY'){
				routerUrl = '/dashboard/list'
			}
			this.context.router.push({
				pathname:routerUrl,
				query:{
					'dirId':item.id,
					'currentCanEdited':item.authorityEdit
				}
			});
		}else{
			App.emit('APP-GET-PATH-DATA-HANDLE',item.id);
			App.emit('APP-REPORT-SET-DIRID-HANDLE',item.id);//report文件夹下 DialogListComponent.js定义的方法 如果是弹出 不执行路由跳转刷新列表
		}
	}
})