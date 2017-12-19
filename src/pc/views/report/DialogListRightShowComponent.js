var $ = require('jquery');
var React = require('react');
var App = require('app');
var DataViewOfReport = require('../common/dataView/DataViewOfReport');
var ChartViewConfig = require('../common/ChartViewConfig');
var ReportStore = require('../../stores/ReportStore');
var AuthorityStore = require('../../stores/AuthorityStore');

var {
	AppBar,
	FlatButton,
	IconButton
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
			createUser:'',
			updateUser:'',
			customCellWidthArr:[],
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
		ReportStore.getAreaInfo(this.props.fileId).then(function(resultData){
            if(resultData.success){
            	if(resultData.dataObject.rowTitleFields){
        			_this.setState(function(previousState,currentProps){
        		        previousState.customCellWidthArr = resultData.dataObject.rowTitleFields.concat(resultData.dataObject.indexFields);
        		        return {previousState};
        		    });
            	}
            }
        })
		if(this.props.reportCreatUser){
			ReportStore.getReportUser(this.props.reportCreatUser).then(function(data){
				if(_this.isMounted()){
					_this.setState(function(previousState,currentProps){
						previousState.createUser = data.dataObject.userName;
						return {previousState};
					});
				}
			});
		}
		if(this.props.reportUpdataUser){
			ReportStore.getReportUser(this.props.reportUpdataUser).then(function(data){
				if(_this.isMounted()){
					_this.setState(function(previousState,currentProps){
						previousState.updateUser = data.dataObject.userName;
						return {previousState};
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
		if (reportLooked) {
			charview = <DataViewOfReport
							reportId={this.props.fileId}
							showPager={false}
            	pageSize={5}
							tables={false}
							chartDisplaySchema="THUMBNAIL"
							listRightNoSort={this.props.listRightNoSort}/>
		}else{
			charview = <div className="msg_box"><span className="msg_position">此图形在当前版本不支持</span></div>
		}
		if(this.props.reportCategory == 'CHART'){
			reportRightShowBoxViewClass = 'reportRightShowBoxView reportRightCharShowBoxView';
		}
		return (
			<div className="reportRightShowBox">
				<div className="top-bar"></div>
				<AppBar
				    title={this.props.actionName}
			     	className="appBarClassName"
				    iconElementLeft={<IconButton iconClassName={iconStyleClassName}></IconButton>}/>
				<div className="scrollBox">
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
				<div className="reportRightShowBoxBotton dashboardBoxBtn">
					<ul>
						<li>
							<FlatButton
								disabled={!reportEdited}
								onTouchTap={this._useReport}
								className="useReportBtn"
								label="使用此分析"/>
						</li>
					</ul>
				</div>
			</div>
		)
	},
	_scrollBrar: function() {
		var Noscroller = document.body.clientHeight - 134
		$(".scrollBox").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		});
		var containHei;
		if($(".scrollBox").children().children().height()>$(".scrollBox").height()){
			$(".scrollBox").height(Noscroller);

			containHei = $('.scrollBox').height()+$('.appBarClassName').height()+24;
		}else{
			containHei = $('.mCSB_container').height()+$('.appBarClassName').height()+24;
			$(".scrollBox").height(Noscroller);
		}

 	 	$('.reportRightShowBoxBotton').css({'top':containHei })

	},
	_showAuthority: function (item,index) {
		var className ='iconfont icon-renqun'
		if(item.teamId == ''){
			className ='iconfont icon-suoyouren'
		}
		return <li  key={index}><label className={className}></label><span className="authorityName">{item.authorityName}</span><span className="openAuthority">{item.openAuthority}</span></li>
	},
	_useReport:function(){//点击使用此分析执行的方法
		App.emit('APP-DASHBOARD-ADD-REPORT',{
			id:this.props.fileId,
			name:this.props.actionName,
			row:this.props.row,
			col:this.props.col,
			category:this.props.reportCategory,
			rtype:this.props.reportType,
			customCellWidthArr:this.state.customCellWidthArr
		});
		App.emit('APP-DRAWER-RIGHT-CLOSE');
		App.emit('APP-DIALIG-CLOSE');
	},
	_positionHandle: function(item, key) {
		if (key == (this.props.pathState.length - 1)) {
			return <span key={key}>{item.name}</span>
		} else {
			return <span key={key}>{item.name} > </span>
		}
	},
});
