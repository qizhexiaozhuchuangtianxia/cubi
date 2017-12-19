var $ = require('jquery');
var React = require('react');
var App = require('app');
var AddComponent = require('./AddComponent');
var DeleteComponent = require('./DeleteComponent');
var ReNameComponent = require('./ReNameComponent');
var SortButton = require('./SortButton');
var CopyButton = require('./CopyButton');
var RemoveButton = require('./RemoveButton');
var ListNameComponent = require('./ListNameComponent');
var AuthorityButton = require('./AuthorityButton');
var Loading = require('../common/Loading');
var DashboardStore = require('../../stores/DashboardStore');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Checkbox,
    Dialog,
	} = require('material-ui');
var {
	Router
	} = require('react-router');
module.exports = React.createClass({
	app:{},
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	getDefaultProps: function() {
		return {
            styles : {
                defaultClass: {
                    width:'14px',
                    height:'14px',
                    marginTop: '7px',
                    float:'left'
                },
                iconClass: {
                    fill:'#a8b0b4'
                }
            }
		}
	},
	getInitialState: function() {
		return {
			canRemoveId:null,
			listData:[],
			checkLen:0,//默认列表长度
			allCheckBoxBool:false, //全选是否选中
			openDelete:false,
			openReName:false,
			thisVal:'',
			loaded:false,
			disabledState:false,
			errorTextState:'',
			userRoot:{},
			resourceId:'',
			authority:false,//当前选中的是否可以点击配置权限
			authorityEdit:true,//默认是可以可以操作的
		}
	},
	componentWillMount:function(){//驾驶舱列表页面
		this.setState({
			authorityEdit:this.props.currentCanEdited,
			canRemoveId:this.props.dirId
		})
		this._getDashboardListHandle(this.props.dirId,this.props.field,this.props.method);//获取列表页面的方法
		this._getPathDataHandle(this.props.dirId);//获取面包屑导航的方法
		this._getRootHandle('Dashboard');//获取当前用户对当前模块的权限的方法
	},
	componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
		this.setState({
			checkLen:0,
			loaded:false,
			allCheckBoxBool:false,
			canRemoveId:nextProps.dirId,
			authorityEdit:nextProps.currentCanEdited,
		})
		this._getDashboardListHandle(nextProps.dirId,nextProps.field,nextProps.method);//获取列表页面的方法
		this._getPathDataHandle(nextProps.dirId);//获取面包屑导航的方法
		this._getRootHandle('Dashboard');//获取当前用户对当前模块的权限的方法
	},
	componentDidMount: function() {
		//订阅 添加文件夹和文件刷新当前页面
		this.app['APP-DASHBOARD-REFRESH-LIST-HANDLE'] = App.on('APP-DASHBOARD-REFRESH-LIST-HANDLE', this._refreshDashaboardHandle);
		this._scrollBrar();
	},
	componentDidUpdate: function() {
		var deleteComponent = '',
			renameComponent = '',
			copyComponent = '',
			authorityComponent = '',
			removeComponent = '';
		if(this.state.userRoot){
			if(true){//当前用户是否可以在我的分析列表页面看到 配置权限按钮
				authorityComponent = <AuthorityButton
				resourceId={this.state.resourceId}
				authority={this.state.authority}
				checkLenProps={this.state.checkLen}/>;
			}
			if(this.state.userRoot.delete){//当前用户是否可以在我的分析列表页面看到 删除按钮
				deleteComponent = <DeleteComponent checkLenProps={this.state.checkLen} deleteFun={this._deleteDialogOpen}/>;
			}
			if(this.state.userRoot.rename){//当前用户是否可以在我的分析列表页面看到 重命名按钮
				renameComponent = <ReNameComponent checkLenProps={this.state.checkLen} reNameFun={this._reNameDialogOpen}/>;
			}
			if(this.state.userRoot.copy){//当前用户是否可以在我的分析列表页面看到 复制按钮
				copyComponent = <CopyButton
					canRemoveId={this.state.canRemoveId}
					checkLenProps={this.state.checkLen}
					listData={this.state.listData}
					copy={this.state.userRoot.copy}
					authorityEdit={this.state.authorityEdit}
					sceneCreate={this.state.userRoot.sceneCreate}/>;
			}
			if(this.state.userRoot.move){//当前用户是否可以在我的分析列表页面看到 移动按钮按钮
				removeComponent = <RemoveButton
					canRemoveId={this.state.canRemoveId}
					authorityEdit={this.state.authorityEdit}
					checkLenProps={this.state.checkLen}
					listData={this.state.listData}
					sceneCreate={this.state.userRoot.sceneCreate}/>;
			}
		}
		App.emit('APP-COMMANDS-SHOW', [
			<SortButton/>,
			removeComponent,
			copyComponent,
			deleteComponent,
			renameComponent,
			authorityComponent,
		]);
		this._scrollBrar();
	},
	componentWillUnmount: function () {
        App.emit('APP-COMMANDS-REMOVE');
    },
    _deleteOneHandleSubmit:function(){//删除方法只能删除一个 下一期会去掉//确定删除
    	var deleteId;//删除的id值
    	var _this = this;
    	for(var i=0;i<this.state.listData.length;i++){
    		if(this.state.listData[i].listCheckBoxBool){
    			deleteId = this.state.listData[i].id;
    		}
    	}
    	DashboardStore.deleteDashboardListHandle(deleteId).then(function(resultData){
    		if(resultData.success){
    			_this._getDashboardListHandle(_this.props.dirId,_this.props.field,_this.props.method);
    			_this.setState({
		    		openDelete:false
		    	})
    		}else {
    			App.emit('APP-MESSAGE-OPEN', {
		            content: resultData.message
		        });
    		}
    	})
    },
    _deleteDialogOpen:function(){//打开删除弹窗
    	var canDeleted = false;//默认当前选中你给的是不可以删除
    	var deletedTipText = '您暂时没有权限删除当前选中的文件夹';//默认提示的文字信息是文件不可以删除
    	for(var i=0;i<this.state.listData.length;i++){
    		if(this.state.listData[i].listCheckBoxBool){
    			if(this.state.listData[i].authorityDelete && this.state.authorityEdit){
    				canDeleted = true;
    			}else{
    				canDeleted = false;
    			}
    			if(this.state.listData[i].type == 'DASHBOARD'){
    				deletedTipText = '您暂时没有权限删除当前选中的驾驶舱';
    			}
    		}
    	}
    	if(canDeleted){
    		this.setState({
	    		openDelete:true
	    	})
    	}else{
			App.emit('APP-MESSAGE-OPEN', {
	            content: deletedTipText
	        });
    	}
    },
    _deleteDialogClose:function(){//取消删除
    	this.setState({
    		openDelete:false
    	})
    },
    _deleteDialogHandle:function(){//删除操作时候提示框的方法
    	var tipText = '删除文件夹会导致该文件夹下的全部内容被删除,确定删除吗？';
    	var tipTextClassName = 'tipTextBox';
    	for(var i=0,j=this.state.listData.length;i<j;i++){
    		if(this.state.listData[i].listCheckBoxBool){
    			if(this.state.listData[i].type == "DASHBOARD"){
	    			tipText = '您确定要删除当前选中驾驶舱吗？';
	    			tipTextClassName="tipTextClassName";
	    		}
    		}
    	}
    	var actions = [
    		<PublicButton
						  style={{color:"rgba(254,255,255,0.87)"}}
							labelText="取消"
							rippleColor="rgba(255,255,255,0.25)"
							hoverColor="rgba(255,255,255,0.15)"
							onClick={(evt)=>this._deleteDialogClose(evt)}/>,

			<PublicButton
						  style={{color:"rgba(0,229,255,255)"}}
							labelText="确定"
							rippleColor="rgba(0,229,255,0.25)"
							hoverColor="rgba(0,229,255,0.15)"
							onClick={(evt)=>this._deleteOneHandleSubmit(evt	)}/>

        ];
        return  <Dialog
                    contentClassName="dialogAddClassName"
		            titleClassName="dialogAddClassNameTitle"
		            bodyClassName="dialogAddClassNameBody"
		            actionsContainerClassName="dialogAddClassNameBottom"
                    title='删除提示'
                    actions={actions}
                    modal={false}
                    open={this.state.openDelete}
                    onRequestClose={this._deleteDialogClose}>
                    <div className={tipTextClassName}>{tipText}</div>
                </Dialog>
    },
    _reNameOneHandleSubmit:function(evt){//重命名提交方法
    	evt.stopPropagation();
    	var _this = this;
    	var reNameId,reNameName;
    	for(var i=0;i<this.state.listData.length;i++){
			if(this.state.listData[i].listCheckBoxBool){
				reNameId = this.state.listData[i].id;
				reNameName = this.state.thisVal||this.state.listData[i].name;
			}
		}
    	if(this.state.errorTextState != ''){
    		return false
    	}else{
			DashboardStore.reNameSaveDashboardHandle(reNameId,reNameName).then(function(resultData){
				if(resultData.success){
	    			_this.setState({
			    		openReName:false,
			    		thisVal:''
			    	},function(){
			    		_this._getDashboardListHandle(_this.props.dirId,_this.props.field,_this.props.method);
			    	})
	    		}else{
	    			_this.setState({
			    		errorTextState:resultData.message,
						disabledState:true
			    	})
	    		}
			})
    	}

    },
    _reNameDialogOpen:function(){//重命名打开弹出框
    	var canReName = false;//默认是不可以重命名的
    	var renameTipText = '您暂时没有权限重命名当前选中的文件夹';//默认是没有权限编辑当前文件夹的提示文字
    	for(var i=0;i<this.state.listData.length;i++){
    		if(this.state.listData[i].listCheckBoxBool){
    			if(this.state.listData[i].authorityEdit){
    				canReName=true;
    			}else{
    				canReName=false;
    			}
    			if(this.state.listData[i].type == 'DASHBOARD'){
    				renameTipText = '您暂时没有权限重命名当前选中的驾驶舱'
    			}
    		}
    	}
    	if(canReName){
    		this.setState({
	    		openReName:true
	    	})
    	}else{
    		App.emit('APP-MESSAGE-OPEN', {
                content: renameTipText
            });
    	}
    },
    _reNameDialogClose:function(){//重命名取消弹出框
    	this.setState({
    		openReName:false,
    		thisVal:'',
    		errorTextState:'',
    		disabledState:false
    	})
    },
    _reNameDialogHandle:function(){//重命名操作时候提示框的方法
    	var reName;
    	var tipText = '重命名文件夹';
    	var labelText = '驾驶舱名称';
    	for(var i=0,j=this.state.listData.length;i<j;i++){
    		if(this.state.listData[i].listCheckBoxBool){
    			if(this.state.listData[i].type == "DASHBOARD"){
	    			tipText = '重命名驾驶舱';
    				labelText = '驾驶舱名称'
	    		}
	    		reName = this.state.listData[i].name;
    		}
    	}
		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				onClick={(evt)=>this._reNameDialogClose(evt)}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="确定"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				disabled={this.state.disabledState}
				onClick={(evt)=>this._reNameOneHandleSubmit(evt,reName)}/>

	    	]
		return (
			<Dialog
			title={tipText}
			actions={actions}
			contentClassName="dialogAddClassName"
            titleClassName="dialogAddClassNameTitle"
            bodyClassName="dialogAddClassNameBody"
            actionsContainerClassName="dialogAddClassNameBottom"
			modal={false}
			open={this.state.openReName}
            onRequestClose={this._reNameDialogClose}>
        		<PublicTextField
             		style={{width:'100%'}}
             		floatingLabelText={labelText}
	        		defaultValue={reName}
	        		errorText={this.state.errorTextState}
	        		onChange={(evt)=>this._getReNameInputVal(evt)}
	        		onEnterKeyDown={(evt)=>this._reNameOneHandleSubmit(evt,reName)}/>
	        </Dialog>
		)
    },
    _getReNameInputVal:function(evt){//当焦点离开输入框的时候执行的方法
    	evt.stopPropagation();
		var thisVal = $(evt.target).val();
		thisVal = thisVal.trim();
		if(thisVal!==undefined && thisVal!== null && thisVal !== ""){
			if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)){
				this.setState({
					errorTextState:'当前输入的名字格式错误',
					disabledState:true
				})
			}else{
				if(CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16){
					this.setState({
						errorTextState:CheckEntryTextComponent.checkAllNameLengthHandle(thisVal)+' / 16',
						disabledState:true
					})
				}else{
					this.setState({
						thisVal:thisVal,
						disabledState:false,
						errorTextState:''
					})
				}
			}
		}else{
			this.setState({
				disabledState:true,
				errorTextState:'名字不能为空',
			})
		}
    },
	_refreshDashaboardHandle:function(){//订阅的事件 点击刷新了驾驶舱的方法 添加一个文件就会刷新本页面
		this._getDashboardListHandle(this.props.dirId,this.props.field,this.props.method);
	},
	_getDashboardListHandle:function(dirId,field,method){//获取列表数据的方法
		var _this = this;
		var dataObj = {
			    "queryParameters": {
			        "sortParameters": [
			            {
						"field": "isDirectory",
						"method": "ASC"
						},
					 	{
		                "field": field,
		                "method": method
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

		DashboardStore.getDashboardlist(dataObj).then(function(data){
			if(_this.isMounted()){
				_this.setState(function(previousState,currentProps){
					previousState.listData = data;
					previousState.checkLen = 0;
					previousState.loaded = true;
					previousState.allCheckBoxBool=false;
					return {previousState};
				});
			}
		});
		if(dirId){
			DashboardStore.getDashboardtData(dirId).then(function(data){
				_this.setState({
					authorityEdit:data.dataObject.authorityEdit
				})
			});
		}
	},
	_getRootHandle:function(modelStr){//获取用户对当前模块的权限的方法
		var _this = this;
		DashboardStore.getRootDataHandle(modelStr).then(function(data){//获取面包屑的接口
			if(data.success){
				_this.setState({
					userRoot:data.dataObject
				})
			}else{
				console.log(data.message);
			}
		});
	},
	_getPathDataHandle:function(resourceId) {//获取面包屑导航的方法
		var _this = this;
		var currentName = [{name:'驾驶舱',id:null,linkType:'DIRECTORY',authorityEdit:true}];
		if(resourceId){
			DashboardStore.getPathDataHandle(resourceId).then(function(data){//获取面包屑的接口
				if(_this.isMounted()){
					if(data.success){
						for(var i=0,j=data.dataObject.length;i<j;i++){
							data.dataObject[i].linkType = 'DIRECTORY';
						}
						currentName = currentName.concat(data.dataObject);
						App.emit('APP-HEADER-NAV-HANDLE',currentName);//Header.js文件
					}else{
						console.log(data.message);
					}
				}
			});
		}else{
			App.emit('APP-HEADER-NAV-HANDLE',currentName);//Header.js文件
		}
	},
	_listHandleComponent : function(item,index){//单选按钮
		var iconClassName,typeClassName,checkBoxType;
		if(item.type == 'DIRECTORY'){
			iconClassName = 'list_dir_icon';
			typeClassName = '文件夹'
		}else if(item.type == 'DASHBOARD'){
			iconClassName = 'list_dashboardIcon_icon';
			typeClassName = '驾驶舱'
		}
		if(item.listCheckBoxBool){
			checkBoxType = 'checkBoxType';
		}
		return	<li className={checkBoxType} key={index}>
					<a href="javascript:;" onClick={(evt)=>this._clickListHandle(evt,item)}>
						<table>
							<tbody>
							<tr>
								<td>
									<dl className="checkBoxClassNameDiv">
										<Checkbox
											defaultChecked={item.listCheckBoxBool}
											onClick={(evt)=>this._checkBoxHandle(evt,index)}
											style={this.props.styles.defaultClass}
											iconStyle={this.props.styles.iconClass}/>
										<dd className={iconClassName}></dd>
									</dl>
								</td>
								<td>
									<table>
										<tbody>
										<tr>
											<td>{item.name}</td>
											<td>{typeClassName}</td>
											<td>{item.updateTime}</td>
											<td><ListNameComponent dataArr={this.state.listData} nameId={item.createUser}/></td>
										</tr>
										</tbody>
									</table>
								</td>
							</tr>
							</tbody>
						</table>
					</a>
				</li>
	},
	_clickListHandle:function(evt,itemObj){
		if(itemObj.type == 'DIRECTORY'){
			this.context.router.push({
				pathname:'/dashboard/list',
				query:{
					'dirId':itemObj.id,
					'dirName':itemObj.name,
					'currentCanEdited':itemObj.authorityEdit,
				}
			})
		}else if(itemObj.type == 'DASHBOARD'){
			this.context.router.push({ 
				pathname:'/dashboard', 
				query:{
					'action':itemObj.id,
					'parentId':itemObj.parentId,
					'actionName':itemObj.name,
					'authorityEdit':itemObj.authorityEdit,
					'exportData':this.state.userRoot.exportDataDash,
					'exportDataModel':this.state.userRoot.exportDataModelDash,
				}
			})
		}
	},
	_checkBoxHandle:function(evt,index){//点击单个选择的效果方法
		evt.stopPropagation();
		this.setState(function(previousState,currentProps){
			if(previousState.listData[index].listCheckBoxBool){
				previousState.checkLen--;
			}else{
				previousState.checkLen++;
			}
			if(previousState.checkLen == previousState.listData.length){
				previousState.allCheckBoxBool=true;
			}else{
				previousState.allCheckBoxBool=false;
			}
			previousState.listData[index].listCheckBoxBool = !previousState.listData[index].listCheckBoxBool;
			if(previousState.checkLen == 1){
				for(var i=0;i<previousState.listData.length;i++){
					if(previousState.listData[i].listCheckBoxBool){
						previousState.authority = previousState.listData[i].authority;
						previousState.resourceId = previousState.listData[i].id;
						break;
					}
				}
			}
			return {previousState};
		});
	},
	_checkBoxAllHandle:function(evt){//全选的按钮效果
		evt.stopPropagation();
		this.setState(function(previousState,currentProps){
			if(previousState.allCheckBoxBool){
				for(var i=0;i<previousState.listData.length;i++){
					previousState.listData[i].listCheckBoxBool = false;
				}
				previousState.checkLen = 0;
			}else{
				for(var i=0;i<previousState.listData.length;i++){
					previousState.listData[i].listCheckBoxBool = true;
				}
				previousState.checkLen = previousState.listData.length;
			}
			previousState.allCheckBoxBool = !previousState.allCheckBoxBool;
			return {previousState};
		});
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
	_radioCheckBoxHandle:function(evt,index){//只能选一个的删除操作 下一期就会去掉
		evt.stopPropagation();
		this.setState(function(previousState,currentProps){
			for(var i=0;i<previousState.listData.length;i++){
				if(previousState.listData[index].id == previousState.listData[i].id){
					continue;
				}
				previousState.listData[i].listCheckBoxBool = false;
			}
			if(previousState.listData[index].listCheckBoxBool){
				previousState.checkLen = 0;
				previousState.listData[index].listCheckBoxBool = false;
			}else{
				previousState.listData[index].listCheckBoxBool = true
				previousState.checkLen = 1;
			}
			return {previousState};
		});
	},
	render: function() {
		var addComponent = <AddComponent
							userRoot={this.state.userRoot}
							dirId={this.props.dirId}
							listData = {this.state.listData}/>
	 	if(!this.state.authorityEdit){
 			addComponent = null;
	 	}
		if (this.state.loaded){
			if(this.state.listData.length>0){
				return (
					<div className="listComponentBox">
						{this._deleteDialogHandle()}
						{this._reNameDialogHandle()}
						{addComponent}
						<div className="listComponentBoxTop">
							<table>
								<thead>
								<tr>
									<td>
										<dl>
											<Checkbox
												defaultChecked={this.state.allCheckBoxBool}
												onCheck={(evt)=>this._checkBoxAllHandle(evt)}
												style={this.props.styles.defaultClass}
												iconStyle={this.props.styles.iconClass} />
										</dl>
									</td>
									<td>
										<table>
											<tbody>
											<tr>
												<td>名称</td>
												<td>类型</td>
												<td>最后修改时间</td>
												<td>所有者</td>
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
						{addComponent}
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
												<td>所有者</td>
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
	}
});
