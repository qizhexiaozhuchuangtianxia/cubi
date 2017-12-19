var React = require('react');
var App = require('app');
var $ = require('jquery');
var Loading = require('../common/Loading');
var ReportStore = require('../../stores/ReportStore');
var {
	List,
	ListItem,
	FontIcon,
	} = require('material-ui');
module.exports = React.createClass({
	app:{},
	getInitialState:function(){
		return {
			listDatas:[],//默认列表数据是空的
			dirId:this.props.dirId,
			loaded:this.props.loaded
		}
	},
	componentWillMount:function(){
		this._getReportListHandle(this.state.dirId,this.props.seletedArr);//获取列表的方法
		this._getPathDataHandle(this.state.dirId);//获取列表上级id和名字的方法
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			loaded:nextProps.loaded
		})
		this._getReportListHandle(nextProps.dirId,nextProps.seletedArr);//获取列表的方法
		this._getPathDataHandle(nextProps.dirId);//获取列表上级id和名字的方法
	},
	componentDidMount:function(){
		//订阅 添加文件夹之后刷新列表页
		this.app['APP-REPORT-REMOVE-REFRESH-LIST-HANDLE'] = App.on('APP-REPORT-REMOVE-REFRESH-LIST-HANDLE', this._removeRefreshListHandle);
		this._scrollBrar();
	},
	componentDidUpdate:function(){
		this._scrollBrar();
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
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
	_removeRefreshListHandle:function(dirId){
		this.setState({
			loaded:false
		})
		this._getReportListHandle(dirId,this.props.seletedArr);
	},
	_getReportListHandle:function(dirId,seletedArr){// 获取列表的方法
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
				for(var i=0;i<data.length;i++){
					for(var j=0;j<data.length;j++){
						if(data[i].id == seletedArr[j]){
							data[i].seletedBool = true;
						}
					}
				}
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
	    	if(item.seletedBool){
	    		return	<ListItem
	    				key={key}
	    				disabled={true}
	    				leftIcon={<FontIcon className="disabledLeftClassName"/>}
	    				rightIcon={<FontIcon className="iconfont icon-icchevronright24px disabledRightClassName"/>}
	    		        primaryText={item.name}/>
	    	}
	    	return	<ListItem
	    				key={key}
	    				title={item.name}
	    				leftIcon={<FontIcon className="iconfont icon-icwenjianjia24px"/>}
	    				rightIcon={<FontIcon className="iconfont icon-icchevronright24px"/>}
	    				onTouchTap={()=>this._onTouchTapHandle(item)}
	    		        primaryText={item.name}/>
	    }
	},
	_getPathDataHandle:function(resourceId) {//获取面包屑导航的方法
		var _this = this;
		var goBackObj = {name:'我的分析',id:null};
		if(resourceId){
			ReportStore.getPathDataHandle(resourceId).then(function(data){//获取面包屑的接口
				var dataLen = data.dataObject.length-1;
				var arrIndex = data.dataObject.length-2;
				if(dataLen>0){
					App.emit('APP-REPORT-SET-DIRID-DIRNAME-REMOVE',data.dataObject[arrIndex])
				}else{
					App.emit('APP-REPORT-SET-DIRID-DIRNAME-REMOVE',goBackObj)
				}
				
			});
		}else{
			App.emit('APP-REPORT-SET-DIRID-DIRNAME-REMOVE',goBackObj)
		}
	},
	_onTouchTapHandle:function(item){//_onTouchTapHandle点击列表执行的方法
		if(item.category == 'DIRECTORY'){

			this.props.authorityAddHandle(item.authorityEdit);
			
			this.setState({
				loaded:false
			});
			//执行修改方法订阅在SaveAsBotton.js
			App.emit('APP-REPORT-REMOVE-HANDLE',{
				'dirId':item.id,
				'dirName':item.name,
				canEdited:item.canEdited
			});
			App.emit('APP-REPORT-SET-CAN-REMOVE-ARR-HANDLE',{
				'authorityEdit':item.authorityEdit
			});

		}
	}
})