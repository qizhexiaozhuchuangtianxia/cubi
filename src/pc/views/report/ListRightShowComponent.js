var $ = require('jquery');
var React = require('react');
var App = require('app');
var DataViewOfReport = require('../common/dataView/DataViewOfReport');
var ChartViewConfig = require('../common/ChartViewConfig');
var ReportStore = require('../../stores/ReportStore');
var AuthorityStore = require('../../stores/AuthorityStore');
var PublicButton = require('../common/PublicButton');

var {
	AppBar,
	IconButton,
	FontIcon,
	List,
	ListItem
} = require('material-ui');
var {
	Router
} = require('react-router');
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			createUser: '',
			updateUser: '',
			currentCanEdit: this.props.authorityEdit,
			data: [],
		}
	},
	componentDidMount: function() {
		this._scrollBrar();
	},
	componentDidUpdate: function() {
		this._scrollBrar();
	},
	componentWillMount: function() {
		var _this = this;
		if (this.props.reportCreatUser) {
			ReportStore.getReportUser(this.props.reportCreatUser).then(function(data) {
				if (_this.isMounted()) {
					_this.setState(function(previousState, currentProps) {
						previousState.createUser = data.dataObject.userName;
						return {
							previousState
						};
					});
				}
			});
		}
		if (this.props.reportUpdataUser) {
			ReportStore.getReportUser(this.props.reportUpdataUser).then(function(data) {
				if (_this.isMounted()) {
					_this.setState(function(previousState, currentProps) {
						previousState.updateUser = data.dataObject.userName;
						return {
							previousState
						};
					});
				}
			});
		}
		AuthorityStore.getAuthorListData(this.props.fileId).then(function(resultData) {
			_this.setState({
				data: resultData
			})
		})

	},
	render: function() {
			var charview = null;
			var reportRightShowBoxViewClass = 'reportRightShowBoxView';
			var iconStyleClassName = 'iconStyle ' + this.props.iconClassName;
			var reportTypeProps = ChartViewConfig.getTypeConfig(this.props.reportType);
			var reportLooked = ChartViewConfig.getSuportLookConfig(this.props.reportType);
			var reportEdited = ChartViewConfig.getSuportEditConfig(this.props.reportType);
			var reportButton = '',
				domHtml = '',
				appBarBtn = <AppBar
						    title={this.props.actionName}
					     	className="appBarClassName"
						    iconElementLeft={<IconButton iconClassName={iconStyleClassName}></IconButton>}/>;

		if (reportLooked) {
			charview = <DataViewOfReport
							isReportView={true}
							reportId={this.props.fileId}
							showPager={false}
							tables={false}
	            			pageSize={5}
							chartDisplaySchema="THUMBNAIL"
							pathname={this.props.pathname}
							listRightNoSort={true}/>
		}else{
			charview = <div className="msg_box"><span className="msg_position">此图形在当前版本不支持</span></div>
		}
		if(this.props.reportCategory == 'CHART'){
			reportRightShowBoxViewClass = 'reportRightShowBoxView reportRightCharShowBoxView';
		}
		domHtml =<div className="scrollBox">
					<div className="scrollBoxReportShow">
						<div className={reportRightShowBoxViewClass}><div className="chartPanel">{charview}</div></div>
						<div className="reportRightShowBoxTextDesc">
							<ul>
								<li>
									<label>分析ID</label>
									<span>{this.props.fileId}</span>
								</li>
								<li>
									<label>类型</label>
									<span>{reportTypeProps}</span>
								</li>
								<li>
									<label>位置</label>
									<div className="pathClassName">{this.props.pathState.map(this._positionHandle)}</div>
								</li>
								<li>
									<label>创建于</label>
									<span>{this.props.reportCreatTime}</span>
									<span>( 创建人: {this.state.createUser} )</span>
								</li>
								<li>
									<label>修改于</label>
									<span>{this.props.reportUpdataTime}</span>
									<span>( 修改人: {this.state.updateUser} )</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="reportRightShowBoxAuthority">
						<h2>谁可以访问</h2>
						<ul>

							<li ><label className='iconfont icon-ziji'></label><span className="authorityName">{this.state.createUser}</span><span className="openAuthority">所有者</span></li>
							{this.state.data.map(this._showAuthority)}

						</ul>
					</div>

				</div>


		return (
			<div className="reportRightShowBox">
				<div className="top-bar"></div>
				{appBarBtn}
				{domHtml}
				<div className="reportRightShowBoxBotton">
					<ul>
						<li>
							<PublicButton
								style={{color:"rgba(0,229,255,255)"}}
								className="editReportBtn"
								labelText="分析"
								rippleColor="rgba(0,229,255,0.25)"
								hoverColor="rgba(0,229,255,0.15)"
								disabled={!reportEdited}
								onClick={this._editReport}/>
						</li>
					</ul>
				</div>
			</div>
		)
	},
	_showAuthority: function (item,index) {
		var className ='iconfont icon-renqun'
		if(item.teamId == ''){
			className ='iconfont icon-suoyouren'
		}
		return <li  key={index}><label className={className}></label><span className="authorityName">{item.authorityName}</span><span className="openAuthority">{item.openAuthority}</span></li>
	},
	_scrollBrar: function() {
		var Noscroller = document.body.clientHeight - 134
		$(".scrollBox").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
		var containHei;
		var d=$(".scrollBox").children().children().children().find('.reportRightShowBoxTextDesc ul li');
		var liHei=0,liPadding;
		for(var i=0;i<d.length;i++){
		  liHei += $(d).eq(i).height()
			liPadding = d.length*14;
		}
		var ulHeu = liHei+liPadding;
		$(".scrollBox").children().children().children().find('.reportRightShowBoxTextDesc').height(ulHeu)
		var contHei =	$('.reportRightShowBoxView ').height()+16+$('.reportRightShowBoxTextDesc').height();
		 $('.scrollBoxReportShow').height(contHei)
		if($(".scrollBox").children().children().height()>$(".scrollBox").height()){
			$(".scrollBox").height(Noscroller);
			containHei = $('.scrollBox').height()+$('.appBarClassName').height()+24;
		}else{
			containHei = $('.mCSB_container').height()+$('.appBarClassName').height()+24;
			$(".scrollBox").height(Noscroller);
		}

 	 	$('.reportRightShowBoxBotton').css({'top':containHei })

	},
	_editReport: function() {
		this.context.router.push({
			pathname: '/report/edit',
			query: {
				exportData:this.props.userRoot.exportData,
				exportDataModel:this.props.userRoot.exportDataModel,
				reportId: this.props.fileId,
				dirId: this.props.parentId,
				actionName: this.props.actionName,
				canEdited: this.state.currentCanEdit,
				currentCanEdited:this.state.currentCanEdit
				

			}
		});
		App.emit('APP-DRAWER-RIGHT-CLOSE');
		//App.emit('APP-REPORT-SEAMLESS');
	},
	_positionHandle: function(item, key) {
		if (key == (this.props.pathState.length - 1)) {
			return <span key={key}>{item.name} </span>
		} else {
			return <span key={key}>{item.name} > </span>
		}
	},
});
