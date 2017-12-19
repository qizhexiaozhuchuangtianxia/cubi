var React = require('react');
var App = require('app');
var $ = require('jquery');
var Loading = require('../common/Loading');
var ReportStore = require('../../stores/ReportStore');
var {
	List,
	ListItem,
	Avatar,
	FontIcon,
	FileFolder
	} = require('material-ui');
module.exports = React.createClass({
	getInitialState:function(){
		return {
			listDatas:[],//默认列表数据是空的
			dirId:this.props.dirId,
			loaded:this.props.loaded
		}
	},
	componentWillMount:function(){
		this._getReportListHandle(this.state.dirId);//获取列表的方法
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			loaded:nextProps.loaded
		})
		this._getReportListHandle(nextProps.dirId);//获取列表的方法
	},
	componentDidMount:function(){
		this._scrollBrar();
	},
	componentDidUpdate:function(){
		this._scrollBrar();
	},
	render:function(){
		if (this.state.loaded){
			if(this.state.listDatas.length > 0){
				return (
					<div className="dialogReportListComponent">
						<div className="scrollBoxSaveAs">
							<List>
								{this.state.listDatas.map(this._listDomHanle)}
							</List>
						</div>
					</div>
				)
			}else{
				return (
					<div className="dialogReportListComponent">
						<div className="datasNullMessage">提示:当前数据为空</div>
					</div>
				)
			}
		}else{
			return (
		        <Loading/>
		    )
		}
	},
	_getReportListHandle:function(dirId){// 获取列表的方法
		var _this = this;
		var dataObj = {
			"queryParameters": {
				"sortParameters": [
					{
					"field": "isDirectory",
					"method": "ASC"
					},
				 	{
		                "field": "updateTime",
		                "method": "ASC"
		            }
				],
				"queryParameter": {
					"type": "LOGIC",
					"field": "parentId",
					"opertator": "EQ",
					"value": dirId || ""
				}
			}
		}
		ReportStore.getReportListDatas(dataObj).then(function(data){
			if(_this.isMounted()){
				_this.setState(function(previousState,currentProps){
					previousState.listDatas = data;
					previousState.loaded = true;
					return {previousState};
				});
			}
		});
	},
	_scrollBrar:function(){//滚动条方法
		$(".scrollBoxSaveAs").height(document.body.clientHeight-170);
		$(".scrollBoxSaveAs").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});
	},
	_listDomHanle:function(item,key){//遍历数据返回li数组
		var falseBool = (item.category == 'DIRECTORY')?true:false;
		var itemType = "";
		if(item.category == 'DIRECTORY'){
			itemType = 'list_dir_icon';
		}else{
			itemType = 'list_'+item.type+'_icon dialogIconClassName';
		}
		if(!falseBool){
			return	<ListItem
						key={key} 
						disabled={true}
						leftIcon={<FontIcon className={itemType}/>}
				        primaryText={item.name}/>
	    }else{
	    	return	<ListItem
	    				key={key}
	    				title={item.name}
	    				leftIcon={<FontIcon className="iconfont icon-icwenjianjia24px"/>}
	    				rightIcon={<FontIcon className="iconfont icon-icchevronright24px"/>}
	    				onTouchTap={()=>this._onTouchTapHandle(item)}
	    		        primaryText={item.name}/>
	    }
	},
	_onTouchTapHandle:function(item){//_onTouchTapHandle点击列表执行的方法
		if(item.category == 'DIRECTORY'){
			this.setState({
				loaded:false
			})
			//执行修改方法订阅在SaveAsBotton.js
			App.emit('APP-REPORT-SAVE-AS-LIST-HANDLE',{
				'dirId':item.id,
				'dirName':item.name,
				'authorityEdit':item.authorityEdit
			})
		}
	}
})