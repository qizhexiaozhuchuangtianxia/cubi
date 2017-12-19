var $ = require('jquery');
var React = require('react');
var DimensionStore = require('../../stores/DimensionStore');
var App = require('app');
var SortButton = require('./SortButton');
var Loading = require('../common/Loading');
var {
	
    FlatButton,
    FontIcon,
	} = require('material-ui');
var {
	Router
} = require('react-router');

module.exports = React.createClass({
	displayName: 'dimensionListCoponent',
	app:{},
	contextTypes: {
	    router: React.PropTypes.object.isRequired
	},
	componentWillUnmount: function() {
		// for(var i in this.app){
  //           this.app[i].remove();
  //       }
	},
	getDefaultProps: function() {
		return {
           
		}
	},
	getInitialState: function() {
		return {
			loaded:true,
			listData:[],
		}
	},
	componentWillMount:function(){
		this._getDimensionObjects();
		var currentName=[{name:'维度',id:null,}];
		App.emit('APP-HEADER-NAV-HANDLE',currentName);//设置头部
		App.emit('APP-COMMANDS-SHOW', [
			<SortButton/>,
		]);
	},
	componentWillReceiveProps:function(nextProps){
		//console.log(nextProps,'ssdffg')
		this._getDimensionObjects(nextProps);
		this._scrollBar();
	},
	componentDidMount: function() {
		this._scrollBar();
	},
	componentDidUpdate: function() {
		this._scrollBar();
	},
	componentWillUnmount: function () {
       
    },
	render: function() {
		if (!this.state.loaded){
			//if(this.state.listData.length>0){
				return (
					<div className="dimensionlistBox">
						<div className="listBoxTop">
							<table>
								<thead>
								<tr>
									<td>
										<dl>
											
										</dl>
									</td>
									<td>
										<table>
											<tbody>
											<tr>
												<td>名称</td>
												<td>层级</td>
												<td>最后修改时间</td>
												
											</tr>
											</tbody>
										</table>
									</td>
								</tr>
								</thead>
							</table>
						</div>
						{this._initListHandle()}
					</div>
				)
			//}
		}else{
        	return (
                <Loading/>
            )
       } 
	},
	_getDimensionObjects:function(nextProps){
		var _this=this;
		
		var sortParameters={
			field:this.props.field,
			method:this.props.method
		}
		if(nextProps){
			sortParameters.field=nextProps.field;
			sortParameters.method=nextProps.method;
		}
		//console.log(this.props.field,this.props.method,'opppps')
		DimensionStore.getDimensionObjects(sortParameters).then(function(result){
			if (_this.isMounted()){
				_this.setState({
					listData:result.dataObject,
					loaded:false
				});
			}
			
		});
	},
	_listHandleComponent : function(item,index){
		var iconClassName,typeClassName;
		
			iconClassName = 'list_dir_icon';
			typeClassName = '文件夹';

		var typeLen='1层';
		if(item.levelName){
			var levelArr=item.levelName.split('>');
			typeLen=levelArr.length+'层';
		}
		
		return	<li className="list-item" key={index}>
				<a href="javascript:;" onClick={(evt)=>this._clickListHandle(evt,item)}>
					<table>
						<tbody>
						<tr>
							<td>
								<dl className="list-icon">
									<dd className='list_dir_icon'>
										<FontIcon className="iconfont icon-weiduiconsvg24 dimen-icon"/>
									</dd>
								</dl>
							</td>
							<td>
								<table>
									<tbody>
									<tr>
										<td>{item.name}</td>
										<td>{typeLen}</td>
										<td>{item.createTime}</td>
										
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
	_initListHandle:function(){
		var data=this.state.listData;

		if(data.length>0){
			return  <div className="listBoxDown">
						<ul>
							{data.map(this._listHandleComponent)}
						</ul>
					</div>
			
		}else{
			
			return 	<div className="cubi-error noGetReportError">当前数据为空</div>
					
		}
		
	},
	_clickListHandle:function(evt,item){
		//console.log(item,'item');
		this.context.router.push({
			pathname: '/dimension/details',
			query: {
				dimensionId:item.id,
				dimensionName:item.name
			}
		});
	},
	_scrollBar:function(){//滚动条方法
		if(this.state.listData.length>0){
			//$(".listBoxDown").height($(window).height()-145);
			$(".listBoxDown").mCustomScrollbar({
				autoHideScrollbar:true,
				theme:"minimal-dark"
			});
		}
	},
})