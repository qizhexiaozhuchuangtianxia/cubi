var $ = require('jquery');
var React = require('react');
var App = require('app');
var moment = require('moment');
var Message = require('./Message');
var {
	DatePicker
} = require('material-ui');
var areIntlLocalesSupported = require('intl-locales-supported');
if (!global.Intl || !areIntlLocalesSupported('zh-cn')) {
	global.Intl = require('intl');
	require('./IntlLocaleData');
}
function dateFormater(date) {
	return moment(date).format('YYYY年MM月DD日');
}
const datePickerButtonWords = {
	ok: '确定',
	cancel: '取消'
};

module.exports = React.createClass({
	getInitialState:function(){
		this._panelWidth = 0;
		this._startLine = false;
		this._startPrev = false;
		this._startPrevClientX = 0;
		this._startNext = false;
		this._startNextClientX = 0;
		this._lineWidth = 0;
		this._pxunit = 0;
		this.prevZindex = false;
		this.nextZindex = false;
		return {
			prevLeft:0,
			lineDateWidth:0,
			prevScale:1,
			nextScale:1,
			lineHover:{
				btnTop:-4,
				height:4,
				top:0
			},
			minValue:this.props.minValue,
			maxValue:this.props.maxValue,
			startValue:this.props.startValue,
			endValue:this.props.endValue
		}
	},
	componentWillUnmount: function() {

	},
	componentDidMount: function() {
		let _this = this;
		$(document).mousemove(function(e){
			if(_this._startLine){
				e.preventDefault();
				_this._onMouseLineMove(e);
			}
			if(_this._startPrev){
				e.preventDefault();
				_this._onMousePrevMove(e);
			}
			if(_this._startNext){
				e.preventDefault();
				_this._onMouseNextMove(e);
			}
		})
		$(document).mouseup(function(e){
			if(_this._startPrev||_this._startNext||_this._startLine){
				_this._startPrev = false;
				_this._startNext = false;
				_this._startLine = false;
				_this._onMouseUp(e);
			}
		})
		var width=$(this.refs.lineDatePicker).width();
		if(this.props.width){
			width=this.props.width-240;
			// if(this.props.width<350){
			// 	width=this.props.width-30;
			// }else{
			// 	width=this.props.width-240;
			// }

		}
		this._panelWidth = width;
		this._pxunit = this._getPxunitValue(this.state.minValue,this.state.maxValue);
		this._getInitValue();
	},
	componentWillReceiveProps:function(nextProps){
		var _this = this;
		if(this.props.width!=nextProps.width || nextProps.change){
			var width=nextProps.width-240;
			// if(nextProps.width<350){
			// 	width=nextProps.width-30
			// }
			this._panelWidth = width;
			this.setState({
				minValue:nextProps.minValue,
				maxValue:nextProps.maxValue,
				startValue:nextProps.startValue,
				endValue:nextProps.endValue
			},function(){
				_this._pxunit = _this._getPxunitValue(_this.state.minValue,_this.state.maxValue);
				_this._getInitValue(this.state.startValue,this.state.endValue);//value
			});
		}

	},
	render: function() {

		let lineDatePicker = {
			width:this.props.width ? this.props.width : '100%',
			position:'relative',
			padding:'0 120px',
			//overflow:'hidden'
		}

		let datePickerPanel = {
			width:'100%',//this.props.width ? this.props.width-240 :
			height:4,
			position:'relative',
			margin:'12px 0',
			background:'#ccc',
			zIndex:1
		}

		let minDate = {
			position:'absolute',
			width:100,
			top:-10,
			left:10,
			lineHeight:'26PX',
			color: 'rgba(0, 0, 0, 0.56)',
			cursor:'pointer',
			overflow:'hidden'
		}
		let maxDate = {
			position:'absolute',
			width:100,
			top:-10,
			right:10,
			textAlign:'right',
			lineHeight:'26PX',
			color: 'rgba(0, 0, 0, 0.56)',
			cursor:'pointer',
			overflow:'hidden',
		}
		let dataLine = {
			display: 'none',
			position: 'relative',
			width: '7px',
			overflow: 'hidden'
		}
		if(this.props.width<350){
			minDate.left=40;
			maxDate.right=40;
			datePickerPanel.display='none';
			dataLine.display='block';
			dataLine.left=20;
			dataLine.top=-6;
			  
    		
			// datePickerPanel.position='absolute';
			// datePickerPanel.left=15;
			// datePickerPanel.top=30;
			// datePickerPanel.width=this.props.width-30;
		}
		let lineDate = {
			position:'absolute',
			width:this.state.lineDateWidth,
			height:this.state.lineHover.height,
			zIndex:2,
			left:this.state.prevLeft,
			top:this.state.lineHover.top,
			background:'rgba(0, 151, 167, 1)',
			cursor:'pointer'
		}
		let prev = {
			position:'absolute',
			width:12,
			height:12,
			borderRadius:'6px',
			background:'rgba(0, 151, 167, 1)',
			left:-6,
			top:this.state.lineHover.btnTop,
			cursor:'pointer',
			transform:'scale('+this.state.prevScale+')',
			WebkitTransform:'scale('+this.state.prevScale+')',
			MozTransform:'scale('+this.state.prevScale+')',
			msTransform:'scale('+this.state.prevScale+')',
			OTransform:'scale('+this.state.prevScale+')',
			zIndex:this.prevZindex?this.prevZindex:999
		}
		let next = {
			position:'absolute',
			width:12,
			height:12,
			borderRadius:'6px',
			background:'rgba(0, 151, 167, 1)',
			right:-6,
			top:this.state.lineHover.btnTop,
			cursor:'pointer',
			transform:'scale('+this.state.nextScale+')',
			WebkitTransform:'scale('+this.state.nextScale+')',
			MozTransform:'scale('+this.state.nextScale+')',
			msTransform:'scale('+this.state.nextScale+')',
			OTransform:'scale('+this.state.nextScale+')',
			zIndex:this.nextZindex?this.nextZindex:999
		}
		let startValue = this._formatDete(this.state.startValue,true);
		let endValue = this._formatDete(this.state.endValue,true);

		var prevDatePicker = (
			<div style={{position:'absolute',zIndex:10,top:0,opacity:0}}>
				<DatePicker
					wordings={datePickerButtonWords}
					firstDayOfWeek={1}
					value={startValue}
					onChange={this._changeStartValue}
					DateTimeFormat={Intl.DateTimeFormat}
					formatDate={dateFormater}
					locale="zh-cn"
				/>
			</div>
		)
		var nextDatePicker = (
			<div style={{position:'absolute',zIndex:10,top:0,opacity:0}}>
				<DatePicker
					wordings={datePickerButtonWords}
					firstDayOfWeek={1}
					value={endValue}
					onChange={this._changeEndValue}
					DateTimeFormat={Intl.DateTimeFormat}
					formatDate={dateFormater}
					locale="zh-cn"
				/>
			</div>
		)
		return (
			<div className="line-date-picker" style={lineDatePicker} ref="lineDatePicker">
				<div className="min-date" style={minDate}>
					<span className="min-date-span" style={{position:'relative',zIndex:9}}>{this.state.startValue}</span>
					{prevDatePicker}
				</div>
				<div style={dataLine}>—</div>
				<div className="date-picker-panel" style={datePickerPanel}>
					<div className="line-date" style={lineDate} onMouseDown={this._onMouseLineDown}>
						<div className="prev" ref="prev" onMouseDown={this._onMousePrevDown} style={prev}></div>
						<div className="next" ref="next" onMouseDown={this._onMouseNextDown} style={next}></div>
					</div>
				</div>
				<div className="max-date" style={maxDate}>
					<span className="min-date-span" style={{position:'relative',zIndex:9}}>{this.state.endValue}</span>
					{nextDatePicker}
				</div>
			</div>
		)
	},
	_onMouseLineDown:function(e){
		e.stopPropagation();
		this._startPrevClientX = e.clientX - this.state.prevLeft;
		this._startLine = true;
		this.setState({
			lineHover:{
				btnTop:0,
				top:-4,
				height:12
			}
		})
	},
	_onMousePrevDown:function(e){
		e.stopPropagation();
		this._startPrevClientX = e.clientX - this.state.prevLeft;
		this._startPrev = true;
		this.prevZindex = 9999;
		this.nextZindex = false;
		this.setState({
			prevScale:1.5
		})
	},
	_onMouseNextDown:function(e){
		e.stopPropagation();
		this._startNextClientX = e.clientX;
		this._startNext = true;
		this._lineWidth = this.state.lineDateWidth;
		this.nextZindex = 9999;
		this.prevZindex = false;
		this.setState({
			nextScale:1.5
		})
	},
	_onMouseUp:function(e){
		var _this = this;
		this.setState({
			prevScale:1,
			nextScale:1,
			lineHover:{
				btnTop:-4,
				height:4,
				top:0
			},
			startValue:this._getStartValue(),
			endValue:this._getEndValue()
		},function(){
			//_this.props.onChange.call(this,{start:this.state.startValue,end:this.state.endValue});
			_this.props.onMouseUp.call(this,{start:this.state.startValue,end:this.state.endValue});

		})
	},
	_setValue:function(){
		var _this = this;
		this.setState({
			startValue:this._getStartValue(),
			endValue:this._getEndValue()
		},function(){
			_this.props.onChange.call(this,{start:this.state.startValue,end:this.state.endValue});
		})
	},
	_onMouseLineMove:function(e){
		let _this = this;
		let left = this._startPrevClientX - e.clientX;
		if(left<=0&&(-left+this.state.lineDateWidth)<=this._panelWidth){
			this.setState(function(prevState){
				prevState.prevLeft = -left;
				return prevState;
			},function(){
				_this._setValue()
			})
		}
		if(left<=0&&(-left+this.state.lineDateWidth)>this._panelWidth){
			this.setState(function(prevState){
				prevState.prevLeft = this._panelWidth-this.state.lineDateWidth;
				return prevState;
			},function(){
				_this._setValue()
			})
		}
		if(left>0){
			this.setState(function(prevState){
				prevState.prevLeft = 0;
				return prevState;
			},function(){
				_this._setValue()
			})
		}

	},
	_onMousePrevMove:function(e){
		let _this = this;
		let left = this._startPrevClientX - e.clientX;
		if(left<=0){
			this.setState(function(prevState){
				let width = prevState.lineDateWidth + (left + this.state.prevLeft);
				if(width>=0){
					prevState.lineDateWidth = width;
					prevState.prevLeft = -left;
				}
				return prevState;
			},function(){
				_this._setValue()
			})
		}
		if(left>0){
			this.setState(function(prevState){
				let width = prevState.lineDateWidth +  this.state.prevLeft;
				prevState.lineDateWidth = width;
				prevState.prevLeft = 0;
				return prevState;
			},function(){
				_this._setValue()
			})
		}

	},
	_onMouseNextMove:function(e){
		let _this = this;
		let right = this._startNextClientX - e.clientX;
		this.setState(function(prevState){
			let width =  _this._lineWidth - right;
			if(width>=0&&(width+this.state.prevLeft)<=_this._panelWidth){
				prevState.lineDateWidth = width;
			}
			if(width>(_this._panelWidth-this.state.prevLeft)){
				prevState.lineDateWidth = _this._panelWidth-this.state.prevLeft;
			}
			return prevState;
		},function(){
			_this._setValue()
		})
	},
	_formatDete:function(date,type){
		let time = date.replace(/[^0-9]/mg,'/');
		var newTime = new Date(time);
		if(type){
			return newTime;
		}
		return newTime.getTime();
	},
	_getPxunitValue:function(minData,maxData){
		var pxunit = this._panelWidth/(this._formatDete(maxData) - this._formatDete(minData));
		return pxunit;
	},
	_getInitValue:function(startData,endData){
		var _this = this;
		var leftValue = this._formatDete(this.state.startValue) - this._formatDete(this.state.minValue);
		leftValue = leftValue*this._pxunit;
		var lineWidth = this._formatDete(this.state.endValue) - this._formatDete(this.state.startValue);
		lineWidth = lineWidth*this._pxunit;
		this.setState({
			prevLeft:leftValue,
			lineDateWidth:lineWidth
		},function(){
			_this.props.onChange.call(this,{start:this.state.startValue,end:this.state.endValue});
		})
	},
	_getStartValue:function(){
		let minValue = this._formatDete(this.state.minValue);
		let startValue = parseInt(this.state.prevLeft/this._pxunit);
		return moment(new Date(minValue+startValue)).format('YYYY年MM月DD日')
	},
	_getEndValue:function(){
		let minValue = this._formatDete(this.state.minValue);
		let endValue = parseInt((this.state.prevLeft+this.state.lineDateWidth)/this._pxunit);
		return moment(new Date(minValue+endValue)).format('YYYY年MM月DD日')
	},
	_changeStartValue:function(_, date){
		var _this = this;
		var value = moment(date).format('YYYY年MM月DD日');
		if(this._formatDete(value)<=this._formatDete(this.state.endValue)){
			if(this._formatDete(value)<=this._formatDete(this.state.minValue)){
				this.setState({
					startValue:value,
					minValue:value
				},function(){
					_this._pxunit = _this._getPxunitValue(_this.state.minValue,_this.state.maxValue);
					_this._getInitValue(value,this.state.endValue);
				})
			}else{
				this.setState({
					startValue:value
				},function(){
					_this._getInitValue(value,this.state.endValue);
					_this.props.onMouseUp.call(this,{start:this.state.startValue,end:this.state.endValue});
				})
			}
		}else{
			App.emit('APP-MESSAGE-OPEN',{content:"开始时间不得大于结束时间" });
		}
	},
	_changeEndValue:function(_, date){
		var _this = this;
		var value = moment(date).format('YYYY年MM月DD日');
		if(this._formatDete(value)>=this._formatDete(this.state.startValue)){
			if(this._formatDete(value)>=this._formatDete(this.state.maxValue)){
				this.setState({
					endValue:value,
					maxValue:value
				},function(){
					_this._pxunit = _this._getPxunitValue(_this.state.minValue,_this.state.maxValue);
					_this._getInitValue(this.state.startValue,value);
				})
			}else{
				this.setState({
					endValue:value
				},function(){
					_this._getInitValue(this.state.startValue,value);
					_this.props.onMouseUp.call(this,{start:this.state.startValue,end:this.state.endValue});
				})
			}
		}else{
			App.emit('APP-MESSAGE-OPEN',{content:"结束时间不得大于开始时间" });
		}
	}
});
