var $ = require('jquery');
var React = require('react');
var App = require('app');
var Loading = require('../common/Loading');
var ReportStore = require('../../stores/ReportStore');
var DialogListRightShowComponent = require('./DialogListRightShowComponent');
var ChartViewConfig = require('../common/ChartViewConfig');
module.exports = React.createClass({
	app:{},
	getInitialState: function() {
		return {
			listData:[],
			loaded:false,
			pathState:[]
		}
	},
	componentWillMount:function(){
		this._getReportListHandle(window.localStorage.getItem("dirId"));//获取弹出层列表的方法
		this._getPathDataHandle(window.localStorage.getItem("dirId"));//获取面包屑导航的方法
	},
	componentDidMount: function() {
		//进入弹出层获取弹出层列表的方法
		this.app['APP-REPORT-SET-DIRID-HANDLE'] = App.on('APP-REPORT-SET-DIRID-HANDLE', this._getReportListHandle);
		this.app['APP-GET-PATH-DATA-HANDLE'] = App.on('APP-GET-PATH-DATA-HANDLE', this._getPathDataHandle);
		this._scrollBrar();
	},
	componentDidUpdate: function() {
		this._scrollBrar();
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
    render: function() {
    	if (this.state.loaded){
    		if(this.state.listData.length>0){
    			return (
    				<div className="listComponentBox">
    					<div className="listComponentBoxTop">
    						<table>
    							<thead>
    							<tr>
    								<td></td>
    								<td>
    									<table>
    										<tbody>
    										<tr>
    											<td>名称</td>
    											<td>类型</td>
    											<td>最后修改时间</td>
    										</tr>
    										</tbody>
    									</table>
    								</td>
    							</tr>
    							</thead>
    						</table>
    					</div>
    					<div className="listComponentBoxDown">
    						<ul>
    							{this.state.listData.map(this._listHandleComponent)}
    						</ul>
    					</div>
    				</div>
    			)
    		}else{
    			return (
    				<div className="listComponentBox">
    					<div className="listComponentBoxTop">
    						<table>
    							<thead>
    							<tr>
    								<td></td>
    								<td>
    									<table>
    										<tbody>
    										<tr>
    											<td>名称</td>
    											<td>类型</td>
    											<td>最后修改时间</td>
    										</tr>
    										</tbody>
    									</table>
    								</td>
    							</tr>
    							</thead>
    						</table>
    					</div>
    					<div className="listComponentBoxDown">
    						<div className="cubi-error noGetReportError">当前数据为空</div>
    					</div>
    				</div>
    			)
    		}
    	}else{
			return (
		        <Loading/>
		    )
    	}
	},
	_scrollBrar:function(){//滚动条方法
		if(this.state.listData.length>0){
			$(".listComponentBoxDown").height(document.body.clientHeight-170);
			$(".listComponentBoxDown").mCustomScrollbar({
				autoHideScrollbar:true,
				theme:"minimal-dark"
			});
		}
	},
	_listHandleComponent : function(item,index){//遍历循环输出需要个dom结构
		var iconClassName,typeClassName,checkBoxType;
		if(item.category === 'DIRECTORY'){
			iconClassName = 'list_dir_icon';
			typeClassName = '文件夹'
		}else{
			iconClassName = 'list_'+item.type+'_icon';
			typeClassName = ChartViewConfig.getTypeConfig(item.type);
		}
		return	<li className={checkBoxType} key={index}>
			<table>
				<tbody>
				<tr>
					<td>
						<dl>
							<dd className={iconClassName}></dd>
						</dl>
					</td>
					<td>
						<a href="javascript:;" onClick={(evt)=>this._clickListHandle(evt,item,iconClassName)}>
							<table>
								<tbody>
								<tr>
									<td>{item.name}</td>
									<td>{typeClassName}</td>
									<td>{item.updateTime}</td>
								</tr>
								</tbody>
							</table>
						</a>
					</td>
				</tr>
				</tbody>
			</table>
		</li>
	},
	_getReportListHandle:function(dirId){//加载了列表组件之后，获取列表数据的方法
		var _this = this;
		var reportDirId = dirId || ''
		if(window.localStorage){
			window.localStorage.setItem("dirId",reportDirId);
		}else{
		 	console.log('当前浏览器不支持localStorage存储');
		}
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
					"value": reportDirId || ""
				}
			}
		}
		ReportStore.getReportListDatas(dataObj).then(function(data){
			if(_this.isMounted()){
				_this.setState(function(previousState,currentProps){
					previousState.listData = data;
					previousState.checkLen = 0;
					previousState.loaded = true;
					return {previousState};
				});	
				App.emit('APP-MENU-TOGGLE-BACK-HANDLE',{toggle:true,func:'APP-DIALIG-CLOSE-HANDLE'});	
			}
		})
	},
	_getPathDataHandle:function(resourceId) {//获取面包屑导航的方法
		var _this = this;
		var currentName = [{name:'我的分析',id:null,dialog:true}];
		if(resourceId){
			ReportStore.getPathDataHandle(resourceId).then(function(data){//获取面包屑的接口
				if(_this.isMounted()){
					if(data.success){
						for(var i=0,j=data.dataObject.length;i<j;i++){
							data.dataObject[i].dialog = true;
						}
						currentName = currentName.concat(data.dataObject);
						_this.setState({
							pathState:currentName
						})
						App.emit('APP-HEADER-NAV-HANDLE',currentName);//Header.js文件
					}else{
						console.log(data.message);
					}
				}
			});
		}else{
			this.setState({
				pathState:currentName
			})
			App.emit('APP-HEADER-NAV-HANDLE',currentName);//Header.js文件
		}
	},
	_clickListHandle:function(evt,itemObj,iconClassName){//点击列表之后执行的方法
		if(itemObj.category == 'DIRECTORY'){
			this._getReportListHandle(itemObj.id);
			this._getPathDataHandle(itemObj.id);//获取面包屑导航的方法
		}else{
			App.emit('APP-DRAWER-RIGHT', <DialogListRightShowComponent 
				fileId={itemObj.id}
				iconClassName={iconClassName} 
				reportType={itemObj.type} 
				reportCreatTime={itemObj.createTime}
				reportCreatUser={itemObj.createUser}  
				reportUpdataTime={itemObj.updateTime}
				reportUpdataUser={itemObj.updateUser} 
				reportCategory={itemObj.category}
				dirName={this.props.dirName}
				actionName={itemObj.name}
	            row={this.props.row} 
				col={this.props.col}
				pathState={this.state.pathState}
				listRightNoSort={true} />,360);
		}
	},
})