var $ = require('jquery');
var React = require('react');
var App = require('app');
var Loading = require('../common/Loading');
var AuthorityStore = require('../../stores/AuthorityStore');
var {
	List,
	ListItem,
	FontIcon
} = require('material-ui');
module.exports = React.createClass({
	displayName:'权限列表的组件',
	getInitialState:function(){
		return {
			saveDataObj:{
			    "resourceObj": [
			        {
			            "resourceId": this.props.reportId, // 资源ID
			            "resourceType": 'report' // 资源类型
			        }
			    ],
			    "authorities": [] // 设定权限内容
			},
			authorityListData:[],
			authorityMessage:'暂时没有分组',
			loading:true
		}
	},
	componentWillMount:function(){
		this._getTeamArrAndSetSaveDataArr(this.props.reportId);//获取页面需要的数据和拼接保存data的数据		
	},
	componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发
		this._getTeamArrAndSetSaveDataArr(nextProps.reportId);	
		this._scrollHandle();	
	},
	componentDidMount: function() {
		this._scrollHandle();
	},
	componentDidUpdate: function() {
		this._scrollHandle();
	},
	render:function(){
		if (!this.state.loading){
			if(this.state.authorityListData.length>0){
				return (
					<div className="authorityGroupListBox">
						<div className="scrollBox">
							<List className="authorityGroupList">
								{this.state.authorityListData.map(this._mapListHandle)}
						    </List>
					    	<List className="addGroupClass">
					          <ListItem
					          	primaryText="添加分组" 
					          	onTouchTap={this._addGroupHandle}
					          	leftIcon={<FontIcon className="iconfont icon-tianjiaxifen addIconButton" />} />
					        </List>
						</div>
					</div>
				)
			}else{
				return (
					<div className="authorityGroupListBox">
						<div className="nullMessageBox">{this.state.authorityMessage}</div>
					</div>
				)
			}
		}else{
			return (
				<div className="authorityGroupListBox">
					<Loading/>
				</div>
			)
		}
	},
	_addGroupHandle:function(){
		App.emit('APP-REPORT-REFRESH-OPEN-ADD-GROUP-HANDLE');
	},
	_getTeamArrAndSetSaveDataArr:function(reportId){//获取渲染页面的数据和设置保存数据的结构的方法
		var _this = this;
		AuthorityStore.getAuthorListData(reportId).then(function(data){//获取页面渲染需要的数据
			/*拼接保存时候需要的data对象*/
			var arrData = [];
			if(data.length>0){
				for (var i = 0; i < data.length; i++) {
					var objData = {};
					objData.id = data[i].teamId||''; // 团队ID
					objData.view = data[i].view; // 读权限
					objData.edit = data[i].edit; // 写权限
					objData.delete = data[i].delete; // 删权限
					objData.authorize = 'false'; // 授权权限，暂时需求不支持
					objData.everyTeam = data[i].everyTeam; // 是否为“所有人”权限
			        arrData.push(objData);
				}
			}
			/*拼接保存时候需要的data对象*/
			_this.setState(function(state){
				state.authorityListData=data;
				state.loading=false;
				state.saveDataObj.authorities = arrData;
				return {state}
			});
			_this._scrollHandle();
		})
	},
	_mapListHandle:function(item,key){//遍历权限数据输出列表
		var _this = this;
		var delTemplate=function(item){
			if(item.everyTeam){
				return  <div className="rightIcon">
							<FontIcon className="iconfont icon-icxiangxiazhankai24px iconArrow" />
						</div>
			}else{
				return  <div className="rightIcon">
							<FontIcon onClick={(evt)=>_this._deleteTeamHandle(evt,item)} className="iconfont icon-icshanchu24px deleteIconButton" />
							<FontIcon className="iconfont icon-icxiangxiazhankai24px iconArrow" />
						</div>
			}
			
		}
		var peopleTeplate=function(item){
			if(item.everyTeam){
				return <FontIcon className="iconfont icon-suoyouren authorityIconButton"/>
			}else{
				return <FontIcon className="iconfont icon-renqun authorityIconButton"/>
			}
		}
		return 	<div key={key} className="authorityBoxs">
					<ListItem className="listItemBox" onClick={(evt)=>this._listItemClick(evt,key)}>
						<div className="listItem">
							<div className="leftIcon">
								{peopleTeplate(item)}
							</div>
							<div className="textBox">
								<div className="name" title={item.authorityName}>{item.authorityName}</div>
								<div className="authority">
									{item.openAuthority}
								</div>
							</div>
							{delTemplate(item)} 
						</div>
					</ListItem>
					<div className="selectedBox">
						{item.seletedData.map(this._mapSeletedListHandle)}
					</div>
				</div>
		
	},
	_deleteTeamHandle:function(evt,item){
		evt.stopPropagation();
		var _this = this;
		this.setState(function(state){
			for (var i = 0; i < state.saveDataObj.authorities.length; i++) {
				if(state.saveDataObj.authorities[i].id == item.teamId){
					state.saveDataObj.authorities.splice(i,1);
					break;
				}
			}
			App.emit('APP-REPORT-REFRESH-SAVE-AUTHORITY-HANDLE',{saveDataObj:state.saveDataObj});
			return {state}
		})
	},
	_mapSeletedListHandle:function(item,key){
		var className='seleteIcon';
		var seleteClassName="seleteText";
		if(item.seleteBool){
			className+=' itemSeleted';
			seleteClassName+=" seletedText";
		}
		return <ListItem className="selecteItemBox" key={key} onClick={(evt)=>this._listItemClickHandle(evt,item)}>
					<div className="seleteItem">
						<div className={className}>
							<FontIcon className="iconfont icon-icqueding24px iconButton"/>
						</div>
						<div className={seleteClassName}>{item.name}</div>
					</div>
				</ListItem>
	},
	_listItemClick:function(evt,index){
		evt.stopPropagation();
		var thisBox=$(ReactDOM.findDOMNode(this));
		var curBox=$(thisBox).find('.authorityBoxs').eq(index);
		var listBox=$(curBox).find('.listItemBox');
		var selEle=$(curBox).find('.selectedBox');
		var display=$(selEle).css('display');
		$(thisBox).find('.selectedBox').removeClass('selectedBg').hide();
		$(thisBox).find('.listItemBox').removeClass('selectedBg');
		$(thisBox).find('.name').removeClass('selectedColor');
		$(thisBox).find('.authority').removeClass('selectedColor');
		$(thisBox).find('.authorityIconButton').removeClass('selectedColor');
		$(thisBox).find('.iconArrow').removeClass('iconRotate');

		if(display=="block"){
			$(selEle).hide().removeClass('selectedBg');
			$(listBox).find('.authorityIconButton').removeClass('selectedColor');
			$(listBox).find('.name').removeClass('selectedColor');
			$(listBox).find('.authority').removeClass('selectedColor');

		}else{
			$(selEle).show().addClass('selectedBg');
			$(listBox).addClass('selectedBg');
			$(listBox).find('.authorityIconButton').addClass('selectedColor');
			$(listBox).find('.name').addClass('selectedColor');
			$(listBox).find('.authority').addClass('selectedColor');
			$(listBox).find('.iconArrow').addClass('iconRotate');
		}
		
	},
	_listItemClickHandle:function(evt,item){//点击权限修改保存参数的对象
		evt.stopPropagation();
		var _this = this;
		this.setState(function(state){
			state.saveDataObj.authorities[item.authorityListIndex][item.anotherName] = !item.seleteBool;
			App.emit('APP-REPORT-REFRESH-SAVE-AUTHORITY-HANDLE',{saveDataObj:state.saveDataObj});
			return {state}
		})
	},
	_scrollHandle:function(){//滚动条方法
		$(".scrollBox").height(document.body.clientHeight - 88);
		$(".scrollBox").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
	},
})