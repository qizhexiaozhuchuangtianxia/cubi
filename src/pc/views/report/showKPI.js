var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');

var {
	Dialog,
	Divider,
	Popover,
	PopoverAnimationFromTop,
	SelectField,
	MenuItem,

} = require('material-ui');



module.exports = React.createClass({
	app: {},
	displayName: 'REPORT-KPI',
	getInitialState: function() {

		var _state={
			open: false,
			key:"KPISetting",
			resouceId:this.props.reportId ? this.props.reportId:'' ,
			initStyle:{
				minWidth:140,
				maxWidth:336,
				middleWidth:196,

			}
		}

		if (this.props.kpiConfig && this.props.kpiConfig.mainColor) {

			_state.mainColor=this.props.kpiConfig.mainColor;
			_state.mainThreshold=this.props.kpiConfig.mainThreshold;
			_state.mainThresholdColor=this.props.kpiConfig.mainThresholdColor;
			_state.viceThresholdColor=this.props.kpiConfig.viceThresholdColor;
			_state.viceColor=this.props.kpiConfig.viceColor;
			_state.viceThreshold=this.props.kpiConfig.viceThreshold;
			_state.mainUtil= this.props.kpiConfig.mainUtil;
			_state.mainTitle=this.props.kpiConfig.mainTitle;
			_state.mainFZ=this.props.kpiConfig.mainFZ;
			_state.viceUtil=this.props.kpiConfig.viceUtil;
			_state.viceTitle=this.props.kpiConfig.viceTitle;
			_state.viceFZ=this.props.kpiConfig.viceFZ;

		}else{

			_state.mainColor ='rgba(0,0,0,0.87)';
			_state.mainThreshold='noReach';
			_state.mainThresholdColor='#e51c23';
			_state.viceThresholdColor='#e51c23';
			_state.viceColor='rgba(0,0,0,0.87)';
			_state.viceThreshold='noReach';
			_state.mainUtil;
			_state.mainTitle;
			_state.mainFZ;
			_state.viceUtil;
			_state.viceTitle;
			_state.viceFZ;
		}

		return _state;

	},
	componentDidMount: function() {
		app['APP-REPORT-KPI'] = App.on('APP-REPORT-KPI', this._setStateOpen);
		this._scrollBrar();
		var _this = this;
		window.onresize = function(){
			var boxKPIHei,titleBoxHei,contentHei
			if(_this.state.open){
				boxKPIHei = $('.saveAsDialogBoxKPI').height();
				titleBoxHei = $('.saveAsDialogTitleBox').height();
				contentHei = boxKPIHei - titleBoxHei - 24 - 52;
				$('.scrollBoxKpi').height(contentHei)
			}
		}
		

	},
	findDimensions:function(){
			// console.log(342424243)
	},
	componentDidUpdate: function() {
		var _this = this;
		setTimeout(function() {
			_this._scrollBrar();
		}, 100)
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
		this._scrollBrar();
	},
	componentWillReceiveProps: function(nextProps) {

	},
	handleTouchTap :function(event){
	    this.setState({
	      open: true,
	      anchorEl: event.currentTarget
	    });
  	},
  	handleChange:function(event, index, value){
  		 this.setState({
	      mainColor:value
	    });
  	},
  	handleChangeThreshold:function(e,i,v){
  		this.setState({
	      mainThreshold:v
	    });
  	},
  	handleChangeThresholdColor:function(e,i,v){
  		this.setState({
	       mainThresholdColor:v
	    });
  	},
  	handleChangeVice:function(event, index, value){
  		 this.setState({
	      viceColor:value
	    });
  	},
  	handleChangeThresholdVice:function(e,i,v){
  		this.setState({
	      viceThreshold:v
	    });
  	},
  	handleChangeThresholdColorVice:function(e,i,v){
  		this.setState({
	       viceThresholdColor:v
	    });
  	},
  	handleRequestClose:function(){
    	this.setState({
      		open: false,
    	});
  	},
  	mainUtilHandleBlur:function(event){
 		this.setState({
 			mainUtil:event.target.value,
 		})
  	},
  	mainTitleHandleBlur:function(event){
		this.setState({
 			mainTitle:event.target.value,
 		})
  	},
  	mainFZHandleBlur:function(event){
  		this.setState({
 			mainFZ:event.target.value,
 		})
  	},
  	viceUtilHandleBlur:function(event){
 		this.setState({
 			viceUtil:event.target.value,
 		})
  	},
  	viceTitleHandleBlur:function(event){
		this.setState({
 			viceTitle:event.target.value,
 		})
  	},
  	viceFZHandleBlur:function(event){
  		this.setState({
 			viceFZ:event.target.value,
 		})
  	},
	render: function() {
		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
			labelText="取消"
			rippleColor="rgba(255,255,255,0.25)"
			hoverColor="rgba(255,255,255,0.15)"
			onClick={this._cancelDialog}/>,

		<PublicButton
			style={{color:"rgba(0,229,255,255)"}}
			labelText="保存"
			rippleColor="rgba(0,229,255,0.25)"
			hoverColor="rgba(0,229,255,0.15)"
			onClick={this._submitFormulas}/>

		];
		return (
			<Dialog
	            contentClassName="saveAsDialogBoxKPI"
	            titleClassName="saveAsDialogTitleBox"
			   bodyClassName="saveAsDialogBottmBoxKpi"
	            title='设定KPI格式'
	            actions={actions}
	            modal={false}	
			open={this.state.open}
			autoDetectWindowHeight={true} 
			onRequestClose={this._cancelDialog}>
			{this._contKpi()}

	        </Dialog>
		)

	},
	_contKpi :function(){
	 return 	<div ref='s'  className="savebodyKpiview">
	 		<div className="savebody">
				<div className="scrollBoxKpi">
						<div className="content">
							<div className="title">
								<span style={{fontSize: 20}}>主指标</span>
							</div>
							<div style={{width:"100%",display:'inline-block'}}>
						<PublicTextField
							style={{width:"100%"}}
							floatingLabelText='标题'
							defaultValue={this.state.mainTitle}
					  	onChange={this.mainTitleHandleBlur}	/>
						
						<div className="line-div">
							<div>
								<SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='颜色'
									value={this.state.mainColor}
									onChange={this.handleChange}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.87)'}}>
									<MenuItem value="rgba(0,0,0,0.87)" primaryText="黑色"/>
									<MenuItem value="#e51c23" primaryText="红色"/>
									<MenuItem value="#259b24" primaryText="绿色"/>
									<MenuItem value="#0091ea" primaryText="主色"/>
								 </SelectField>
							</div>
							<div>
								<PublicTextField
									defaultValue={this.state.mainUtil}
									floatingLabelText='单位'
									style={{display:"inline-block",verticalAlign:"bottom",width:this.state.initStyle.maxWidth}}
									onChange={this.mainUtilHandleBlur}/>
							</div>
						</div>
						<div className="line-div">
							<div>
								<SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='条件'
									value={this.state.mainThreshold}
									onChange={this.handleChangeThreshold}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.54)'}}>
									<MenuItem value="overstep" primaryText="超出"/>
									<MenuItem value="noReach" primaryText="未达到"/>
								</SelectField>
							</div>
							<div>
								 <PublicTextField
									style={{display:"inline-block",verticalAlign:"bottom",width:this.state.initStyle.middleWidth}}
									floatingLabelText='阈值'
									defaultValue={this.state.mainFZ}
									onChange={this.mainFZHandleBlur}/>
							</div>
							<div>
								<SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='颜色'
									value={this.state.mainThresholdColor}
									onChange={this.handleChangeThresholdColor}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.54)'}}>
									<MenuItem value="rgba(0,0,0,0.87)" primaryText="黑色"/>
									<MenuItem value="#e51c23" primaryText="红色"/>
									<MenuItem value="#259b24" primaryText="绿色"/>
									<MenuItem value="#0091ea" primaryText="主色"/>

								</SelectField>
							</div>
						</div>
						</div>

						<div className="title" style={{marginTop:10}} >
							<span style={{ fontSize: 16}}>副指标</span>
						</div>
							<div style={{width:"100%"}}>
						<PublicTextField
							style={{width:"100%"}}
							floatingLabelText='标题'
							defaultValue={this.state.viceTitle}
							onChange={this.viceTitleHandleBlur}/>
						
						<div className="line-div">
							<div>
								<SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='颜色'
									value={this.state.viceColor}
									onChange={this.handleChangeVice}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.54)'}}>
									<MenuItem value="rgba(0,0,0,0.87)" primaryText="黑色"/>
									<MenuItem value="#e51c23" primaryText="红色"/>
									<MenuItem value="#259b24" primaryText="绿色"/>
									<MenuItem value="#0091ea" primaryText="主色"/>

								</SelectField>
							</div>
							<div>
								<PublicTextField
									style={{display:"inline-block",verticalAlign:"bottom", width:this.state.initStyle.maxWidth}}
									floatingLabelText='单位'
									defaultValue={this.state.viceUtil}
									onChange={this.viceUtilHandleBlur}/>
							</div>
						</div>
						<div className="line-div">
							<div>
								 <SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='条件'
									value={this.state.viceThreshold}
									onChange={this.handleChangeThresholdVice}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.54)'}}>
									<MenuItem value="overstep" primaryText="超出"/>
									<MenuItem value="noReach" primaryText="未达到"/>
								 </SelectField>
							</div>
							<div>
								 <PublicTextField
									style={{display:"inline-block",verticalAlign:"bottom",width:this.state.initStyle.middleWidth}}
									floatingLabelText='阈值'
									defaultValue={this.state.viceFZ}
									onChange={this.viceFZHandleBlur}/>
							</div>
							<div>
								 <SelectField
									floatingLabelStyle={{fontSize:'14px'}}
									floatingLabelText='颜色'
									value={this.state.viceThresholdColor}
									onChange={this.handleChangeThresholdColorVice}
									style={{width:this.state.initStyle.minWidth,display:"inline-block",verticalAlign:"bottom",color:'rgba(255, 255, 255, 0.54)'}}>
									<MenuItem value="rgba(0,0,0,0.87)" primaryText="黑色"/>
									<MenuItem value="#e51c23" primaryText="红色"/>
									<MenuItem value="#259b24" primaryText="绿色"/>
									<MenuItem value="#0091ea" primaryText="主色"/>
									
								 </SelectField>
							</div>
						</div>
						</div>
						</div>
				</div>
			</div>
		</div>

	},
	_scrollBrar:function(){//滚动条方法
		$(".scrollBoxKpi").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark",
			mouseWheel: {
				scrollAmount: 100
			},
			autoExpandScrollbar: true,
			snapAmount: 1,
			snapOffset: 1
		});
	},
	_setStateOpen: function(open) {
		if (!this.isMounted()) return;


		this.setState(function(state){
			state.open=open;
			return state
		},function(){
			var boxKPIHei,titleBoxHei,contentHei
			if(this.state.open){
				boxKPIHei = $('.saveAsDialogBoxKPI').height();
				titleBoxHei = $('.saveAsDialogTitleBox').height();
				contentHei = boxKPIHei - titleBoxHei - 24 - 52;
				$('.scrollBoxKpi').height(contentHei)
			}

		})

	},
	//
	// _scrollBrar: function() { //滚动条方法
	// 	$(".show-KPI-panel").mCustomScrollbar({
	// 		autoHideScrollbar: true,
	// 		theme: "minimal-dark"
	// 	})
	// },
	_cancelDialog: function() {
		App.emit('APP-REPORT-CLOSE-KPI');
	},
	_submitFormulas: function() {
		delete this.state.open;
		App.emit('APP-REPORT-SET-KPI', this.state);
		this._setStateOpen(false);
	}
});
