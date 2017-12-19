/**
 * ShowMultiAxisLineSetting
 */
var $ = require('jquery');
var React = require('react');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Dialog,
	SelectField,
	MenuItem,
} = require('material-ui');

module.exports = React.createClass({
	app: {},
	displayName: 'REPORT-MultiAxisLine',
	getInitialState: function () {

		let multiAxisLineSetting = this.props.multiAxisLineSetting ? this.props.multiAxisLineSetting : { yAxis:[], indexs:[] };

		return {
			open                 : false,
			reportId             : this.props.reportId ? this.props.reportId : '',
			reportData           : this.props.reportData,
			multiAxisLineSetting : multiAxisLineSetting,
			yAxis                : multiAxisLineSetting.yAxis,
			indexs               : multiAxisLineSetting.indexs,
		};
	},

	componentDidMount: function () {
		app['APP-REPORT-MULTIAXISLINE-SETTING'] = App.on('APP-REPORT-MULTIAXISLINE-SETTING', this._setStateOpen);
		this._scrollBrar();
		window.onresize = function () {
			var changeHei    = $('.multiAxisLineSettingDialogbodyBox').css('max-height');
			var LineYhei     = $('.multiAxisLineYaxisContainer').height()+24;
			var LineIhei     =	$('.multiAxisLineIndexContainer').height()+7;
			var contHei      = LineYhei+LineIhei;
			if(changeHei){
				var numberHeight = changeHei.substring(0, 3);
			}
			var boxMaxHei    = contHei  + 116;
			var boxMinHei    = parseInt(numberHeight) + 116;
			if (numberHeight > contHei) {
				$('.multiAxisLineContainer').height(contHei);
				$('.multiAxisLineScrollBox').height(contHei);
			  $('.multiAxisLineSettingDialogBox').css({'height':boxMaxHei});
				return;
			} else {
				$('.multiAxisLineScrollBox').css({'height':changeHei});
				$('.multiAxisLineSettingDialogBox').css({'height':boxMinHei});
			}
		}
	},

	componentDidUpdate: function () {
		var _this = this;
		setTimeout(function () {
			_this._scrollBrar();
		}, 100)
	},

	componentWillUnmount: function () {
		for (let i in this.app) {
			this.app[i].remove();
		}
		this._scrollBrar();


	},

	componentWillReceiveProps: function (nextProps) {
		this.setState({
			reportId             : nextProps.reportId ? nextProps.reportId : '',
			reportData           : nextProps.reportData,
			multiAxisLineSetting : nextProps.multiAxisLineSetting,
			yAxis                : nextProps.multiAxisLineSetting.yAxis,
			indexs               : nextProps.multiAxisLineSetting.indexs,
		});
	},

	render: function () {
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
				contentClassName="multiAxisLineSettingDialogBox"
				titleClassName="multiAxisLineSettingDialogTitleBox"
				bodyClassName="multiAxisLineSettingDialogbodyBox"
				actionsContainerClassName="multiAxisLineSettingDialogBottomBox"
				title='设定高级复合图'
				actions={actions}
				modal={false}
				repositionOnUpdate={true}
				open={this.state.open}
				onRequestClose={this._cancelDialog}>
				{this._createDialogContainer()}
			</Dialog>
		)

	},

	/**
	 * 绘制对话框内容： Y轴设定、指标设定两部分
	 * @returns {XML}
	 * @private
	 */
	_createDialogContainer: function() {
		return (
			<div className='multiAxisLineContainer'>
				<div className='multiAxisLineScrollBox'>
					<div className='multiAxisLineYaxisContainer'>
						<div className='multiAxisLineYaxisTitle'>
							<label>Y轴</label>
						</div>
						<div className='multiAxisLineYaxis'>
							{this.state.yAxis.map(this._createYaxis)}
						</div>
					</div>
					<div className='multiAxisLineIndexContainer'>
						<div className='multiAxisLineIndexTitle'>
							<label>指标</label>
						</div>
						<div className='multiAxisLineIndex'>
							{this.state.indexs.map(this._createIndexs)}
						</div>
					</div>
				</div>
			</div>
		);
	},

	/**
	 * 绘制Y轴设定
	 * @param item Y轴信息 { key, name, min, max }
	 * @param index
	 * @returns {XML}
	 * @private
	 */
	_createYaxis: function(item, index) {

		return (
			<ul key={index} className='clearfix'>
				<li className='multiAxisLineItemName'>
					<PublicTextField
						style={{width:'100%'}}
						floatingLabelText  = {'Y轴 #' + (index + 1) + ' 名称'}
						defaultValue    = {item.name}
						onChange = {(event)=>this._onYaxisTitleChanged(event, index)}
					/>
				</li>
				<li className='multiAxisLineItemOption'>
					<PublicTextField
						style={{width:'100%'}}
						floatingLabelText  = '最小值'
						defaultValue    = {item.min}
						onChange = {(event)=>this._onYaxisMinChanged(event, index)}
					/>
				</li>
				<li className='multiAxisLineItemOption'>
					<PublicTextField
						style={{width:'100%'}}
						floatingLabelText  = '最大值'
						defaultValue    = {item.max}
						onChange = {(event)=>this._onYaxisMaxChanged(event, index)}
					/>
				</li>
			</ul>
		);
	},

	/**
	 * 绘制指标设定
	 * @param item 指标信息 { name, chartType, yAxisKey }
	 * @param index
	 * @returns {XML}
	 * @private
	 */
	_createIndexs: function(item, index) {
		let indexIndex = index;

		return (
			<ul key={index} className='clearfix'>
				<li key="0" className='multiAxisLineItemName'>
					<PublicTextField
						style    = {{width:"100%"}}
						floatingLabelText  = '指标名称'
						defaultValue   = {item.name}
						disabled = {true}

					/>
				</li>
				<li key="1" className='multiAxisLineItemOption'>
					<SelectField
						value    = {item.chartType ? item.chartType : 'line'}
						onClick={this._updataStyle}
						onChange = {(event, index, value)=>this._onChartTypeChanged(event, index, value, indexIndex)}
						floatingLabelStyle = {{fontSize: '14px'}}
						floatingLabelText  = '图形类型'
						style = {{
							width: '100%',
							display: "inline-block",
							verticalAlign: "bottom",
							color: 'rgba(255, 255, 255, 0.87)'
						}}>
						<MenuItem className='figureType' index="0" value="line" primaryText="折线图"/>
						<MenuItem className='figureType' index="1" value="bar"  primaryText="柱状图"/>
						<MenuItem className='figureType' index="2" value="area" primaryText="面积图"/>
					</SelectField>
				</li>
				<li key="2" className='multiAxisLineItemOption'>
					<SelectField
						value    = {item.yAxisKey ? item.yAxisKey : 'yAxis1'}
						className = 'yAxisSelection'
						onChange = {(event, index, value)=>this._onIndexYaxisChanged(event, index, value, indexIndex)}
						floatingLabelStyle = {{fontSize: '14px'}}
						floatingLabelText  = 'Y轴'
						style={{
							width: '100%',
							display: "inline-block",
							verticalAlign: "bottom",
							color: 'rgba(255, 255, 255, 0.87)'
						}}>
						{this.state.yAxis.map(this._createYaxisSelection)}
					</SelectField>
				</li>
			</ul>
		);
	},

	/**
	 * 绘制指标设定中，Y轴选项
	 * @param item Y轴信息
	 * @param index
	 * @returns {XML}
	 * @private
	 */
	_createYaxisSelection: function (item, index) {
		return (
			<MenuItem
				className   = 'yAxisDialog'
				key         = {index}
				index       = {index + 1}
				value       = {"yAxis" + (index + 1)}
				primaryText = {item.name}
			/>);
	},

	/**
	 * Y轴名称编辑事件(共通处理)
	 * @param event 事件对象
	 * @param yAxisIndex Y轴Index
	 * @private
	 */
	_onYaxisTitleChanged: function(event, yAxisIndex) {
		let multiAxisLineSetting = this.state.multiAxisLineSetting;
		let yAxis                = multiAxisLineSetting.yAxis;

		yAxis[yAxisIndex].name     = event.target.value;
		multiAxisLineSetting.yAxis = yAxis;

		this.setState({
			multiAxisLineSetting: multiAxisLineSetting
		});
	},

	/**
	 * Y轴最小值编辑事件(共通处理)
	 * @param event 事件对象
	 * @param yAxisIndex Y轴Index
	 * @private
	 */
	_onYaxisMinChanged: function(event, yAxisIndex) {
		let multiAxisLineSetting = this.state.multiAxisLineSetting;
		let yAxis                = multiAxisLineSetting.yAxis;

		yAxis[yAxisIndex].min      = event.target.value;
		multiAxisLineSetting.yAxis = yAxis;

		this.setState({
			multiAxisLineSetting: multiAxisLineSetting
		});
	},

	/**
	 * Y轴最大值编辑事件(共通处理)
	 * @param event 事件对象
	 * @param yAxisIndex Y轴Index
	 * @private
	 */
	_onYaxisMaxChanged: function(event, yAxisIndex) {
		let multiAxisLineSetting = this.state.multiAxisLineSetting;
		let yAxis                = multiAxisLineSetting.yAxis;

		yAxis[yAxisIndex].max      = event.target.value;
		multiAxisLineSetting.yAxis = yAxis;

		this.setState({
			multiAxisLineSetting: multiAxisLineSetting
		});
	},
	_updataStyle:function(){
		setTimeout(function(){
			$('.figureType').parent().parent().parent().parent().parent().addClass('figureParent');
		},20)

	},
	/**
	 * 指标的图形类型修改事件(共通处理)
	 * @param event 事件对象
	 * @param index 选择项Index
	 * @param value 选择项Value
	 * @param indexIndex 指标Index
	 * @private
	 */
	_onChartTypeChanged: function(event, index, value, indexIndex) {
		let multiAxisLineSetting = this.state.multiAxisLineSetting;
		let indexs               = multiAxisLineSetting.indexs;

		indexs[indexIndex].chartType = value;
		multiAxisLineSetting.indexs  = indexs;

		this.setState({
			multiAxisLineSetting: multiAxisLineSetting
		});
	},

	/**
	 * 指标的选择Y轴修改事件(共通处理)
	 * @param event 事件对象
	 * @param index 选择项Index
	 * @param value 选择项Value
	 * @param indexIndex 指标Index
	 * @private
	 */
	_onIndexYaxisChanged: function(event, index, value, indexIndex) {
		let multiAxisLineSetting = this.state.multiAxisLineSetting;
		let indexs               = multiAxisLineSetting.indexs;

		indexs[indexIndex].yAxisKey = value;
		multiAxisLineSetting.indexs = indexs;

		this.setState({
			multiAxisLineSetting: multiAxisLineSetting
		});
	},

	/**
	 * 对话框滚动条处理方法
	 * @private
	 */
	_scrollBrar: function () {
		$(".multiAxisLineScrollBox").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark",
			mouseWheel: {
				scrollAmount: 100
			},
			autoExpandScrollbar: true,
			snapAmount: 1,
			snapOffset: 1
		});
	},

	/**
	 * 打开设定对话框
	 * @param open
	 * @private
	 */
	_setStateOpen: function (open) {
		if (!this.isMounted()) return;

		this.setState(function (state) {
			state.open = open;
			return state;
		}, function () {
			var changeHei    = $('.multiAxisLineSettingDialogbodyBox').css('max-height');
			var LineYhei     = $('.multiAxisLineYaxisContainer').height()+24;
			var LineIhei     =	$('.multiAxisLineIndexContainer').height()+7;
			var contHei      = LineYhei+LineIhei;
			var numberHeight = changeHei.substring(0, 3);
			var boxMaxHei    = contHei  + 116;
			var boxMinHei    = parseInt(numberHeight) + 116;
			if (numberHeight > contHei) {
				$('.multiAxisLineContainer').height(contHei);
				$('.multiAxisLineScrollBox').height(contHei-24);
				$('.multiAxisLineSettingDialogBox').css({'height':boxMaxHei});
				return;
			} else {
				$('.multiAxisLineScrollBox').css({'height':changeHei});
				$('.multiAxisLineSettingDialogBox').css({'height':boxMinHei});
			}
		});

	},

	/**
	 * 关闭对话框
	 * @private
	 */
	_cancelDialog: function () {
		App.emit('APP-REPORT-CLOSE-MULTIAXISLINE-SETTING');
	},

	/**
	 * 提交设定信息
	 * @private
	 */
	_submitFormulas: function () {
		delete this.state.open;
		App.emit('APP-REPORT-SET-MULTIAXISLINE-SETTING', this.state);
		this._setStateOpen(false);
	},

	/**
	 * 将Object数组，根据指定的成员对象，创建Object
	 * @param array
	 * @param key
	 * @returns {{}}
	 * @private
	 */
	_array2Object(array, key) {

		if ((!array) || (!key)) {
			return {};
		}

		let length = array.length;
		let object = {};

		for (let index = 0; index < length; index++) {
			let item = array[index];
			if (!item[key]) {
				return {};
			}

			object[item[key]] = item;
		}

		return object;
	}
});
