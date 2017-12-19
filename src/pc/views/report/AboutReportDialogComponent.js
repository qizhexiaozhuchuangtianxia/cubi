/**
 * 关于此分析对话框
 * @author: XuWenyue
 */

var $ = require('jquery');
import {Component} from 'react';
import App         from 'app';
import USMStore    from '../../stores/USMStore';

var ReportStore   = require('../../stores/ReportStore');
var MetaDataStore = require('../../stores/MetaDataStore');
var PublicButton = require('../common/PublicButton');

var {
	Dialog
} = require('material-ui');

var _isMounted = false;

class AboutReportDialogComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			reportData : props.reportData,
			areaInfo   : props.reportData.areaInfo,
			reportId   : props.reportId,
			reportName : props.reportName,
			mdName     : "",
			mdPosition : "",
			mdCreator  : "",
			mdCreateDT : "",
			mdUpdater  : "",
			mdUpdateDT : "",
			rpPosition : "",
			rpCreator  : "",
			rpCreateDT : "",
			rpUpdater  : "",
			rpUpdateDT : ""
		};
	}

	componentWillReceiveProps(nextProps) {
		if (false == this._isMounted) {
			return;
		}
		this.state = {
			open: this.state.open,
			reportData : nextProps.reportData,
			areaInfo   : nextProps.reportData.areaInfo,
			reportId   : nextProps.reportId,
			reportName : nextProps.reportName
		};

	}

	componentWillMount() {
	}

	componentDidMount() {
		app['APP-REPORT-SHOW-DIALOG-ABOUT-REPORT'] =
			App.on('APP-REPORT-SHOW-DIALOG-ABOUT-REPORT', this._aboutReport.bind(this));
		this._isMounted = true;
		this._initAboutReortHeight();

	}

	componentDidUpdate() {
	}

	componentWillUnmount() {
		this._isMounted = false;

	}

	render() {
		var actions = [
		<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="确定"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				onClick={this._closeDialog.bind(this)}/>
		];

		return (
			<Dialog
				contentClassName="aboutReportDialogBox"
				titleClassName="aboutReportTitleBox"
				bodyClassName="aboutReportBodyBox"
				actionsContainerClassName="aboutReportBottmBox"
				autoDetectWindowHeight={false}
				title='关于此分析'
				actions={actions}
				modal={false}
				open={this.state.open}
				onRequestClose={this._closeDialog.bind(this)}>
				<div className='aboutReportContaint'>
					<div className='aboutReportHeader'>
						<ul>
							<li>
								<label>立方信息</label>
							</li>
							<li>
								<label>分析信息</label>
							</li>
						</ul>
					</div>
					<div className='aboutReportList'>
						<ul>
							<li>
								<label>立方名称:</label>
								<span>{this.state.mdName}</span>
							</li>
							<li>
								<label>分析名称:</label>
								<span>{this.state.reportName}</span>
							</li>
							<li>
								<label>立方ID:</label>
								<span>{this.state.areaInfo.metadataId}</span>
							</li>
							<li>
								<label>分析ID:</label>
								<span>{this.state.reportId}</span>
							</li>
							<li>
								<label>位置:</label>
								<span>{this.state.mdPosition}</span>
							</li>
							<li>
								<label>位置:</label>
								<span>{this.state.rpPosition}</span>
							</li>
							<li>
								<label>创建人:</label>
								<span>{this.state.mdCreator}</span>
							</li>
							<li>
								<label>创建人:</label>
								<span>{this.state.rpCreator}</span>
							</li>
							<li>
								<label>创建时间:</label>
								<span>{this.state.mdCreateDT}</span>
							</li>
							<li>
								<label>创建时间:</label>
								<span>{this.state.rpCreateDT}</span>
							</li>
							<li>
								<label>修改人:</label>
								<span>{this.state.mdUpdater}</span>
							</li>
							<li>
								<label>修改人:</label>
								<span>{this.state.rpUpdater}</span>
							</li>
							<li>
								<label>修改时间:</label>
								<span>{this.state.mdUpdateDT}</span>
							</li>
							<li>
								<label>修改时间:</label>
								<span>{this.state.rpUpdateDT}</span>
							</li>
						</ul>
					</div>
				</div>
			</Dialog>
		)
	}

	_initAboutReortHeight(){
		if(this.state.mdPosition !='') return
	}

	_aboutReport(dialogOpen) {
		if (false == this._isMounted) {
			return;
		}
		this.setState({
			open: dialogOpen
		});
		var _this=this;
		setTimeout(function () {
			var hei=_this._sumHei(2);
			$('.aboutReportList').height(hei);
			var newHei = hei+16+60+2;
			var listHeight = $('.aboutReportList').height();
			$('.aboutReportList').height(hei);
			$('.aboutReportBodyBox').css({'height':newHei+'px'});
		},400)


		if (true == dialogOpen) {
			this._getAboutInfo(this.state.areaInfo.metadataId, this.state.reportId);
		}
	}
	_sumHei(h){
		var lis=$('.aboutReportList ul li');
		var heiObj={}
		var sign=0;
		for(var i=0;i<lis.length;i++){
			if(i%h==0){
				if(!heiObj['step'+i]){
					heiObj['step'+i]=[];
					sign=i;
				}
			};
			if(heiObj['step'+sign]){
				var curHei=$(lis).eq(i).height();
				heiObj['step'+sign].push(curHei);
			}
		}
		return this._getMax(heiObj);
	}
	_getMax(obj){
		var heiArr=[];
		var lis=$('.aboutReportList ul li');
		var index=0;
		for(var o in obj){
			index++;
			var a=obj[o];
			var m = Math.max.apply(null, a);
			var newIndex=index*a.length-1;
			$(lis).eq(newIndex).height(m)
			m+=14;
			heiArr.push(m);
		}
		var max=0;
		for(var i=0;i<heiArr.length;i++){
			max+=heiArr[i];
		}
		return max;
	}
	_closeDialog() {
		this.setState({
			open: false
		});
	}

	_getAboutInfo(metadataId, reportId) {

		this._getAboutMetadataInfo(metadataId);
		this._getAboutReportInfo(reportId);

	}

	_getAboutMetadataInfo(metadataId) {
		let _this = this;

		MetaDataStore.getMetadataInfo(metadataId).then(function(data) {
			if (!data) return;

			_this.setState({
				mdName     : data.name,
				mdCreateDT : data.createTime,
				mdUpdateDT : data.updateTime
			});

			USMStore.getUserName(data.createUser).then(function(data) {
				if (!data) return;
				_this.setState({
					mdCreator: data.userName
				});
			});
			USMStore.getUserName(data.updateUser).then(function(data) {
				if (!data) return;
				_this.setState({
					mdUpdater: data.userName
				});
			});
		});

		MetaDataStore.getMetadataPath(metadataId).then(function(data) {
			if (!data) return;
			let path = "立方";
			for (let counter = 0; counter < data.length; counter++) {
				if ("DIRECTORY" != data[counter].type) {
					continue;
				}
				path += " > " + data[counter].name;
			}
			_this.setState({
				mdPosition: path
			});
		});
	}

	_getAboutReportInfo(reportId) {
		let _this = this;

		ReportStore.getReportData(reportId).then(function(data) {
			if ((!data) || (false == data.success)) return;
			data = data.dataObject;
			_this.setState({
				rpCreateDT : data.createTime,
				rpUpdateDT : data.updateTime
			});

			USMStore.getUserName(data.createUser).then(function(data) {
				if (!data) return;
				_this.setState({
					rpCreator: data.userName
				});
			});
			USMStore.getUserName(data.updateUser).then(function(data) {
				if (!data) return;
				_this.setState({
					rpUpdater: data.userName
				});
			});
		});

		ReportStore.getPathDataHandle(reportId).then(function(data) {
			if ((!data) || (false == data.success)) return;
			data = data.dataObject;
			let path = "我的分析";
			for (let counter = 0; counter < data.length; counter++) {
				if ("DIRECTORY" != data[counter].type) {
					continue;
				}
				path += " > " + data[counter].name;
			}
			_this.setState({
				rpPosition: path
			});
		});
	}
}

export default AboutReportDialogComponent;
