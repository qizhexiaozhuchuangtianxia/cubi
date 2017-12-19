/**
 * 面包屑
 *
 */
'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var BreadTooltip = require('./BreadTooltip');
var FilterFieldsStore = require('../../stores/FilterFieldsStore');
var GlobalFilterStore = require('../../stores/GlobalFilterStore');
var ReportDateRange = require('./ReportDateRange');

module.exports = React.createClass({

	displayName: 'breadcrumbTop',
	defaultDate:{},
	getInitialState: function() {
		var breadData=this.props.item.breadData;
		if(this.props.item.closeBeadData){
			breadData=this.props.item.closeBeadData
		}
		breadData=this._dateFormat(this.props.item);
		return {
			item:this.props.item,
			breadData:breadData,
			open:true,
			clientX:0,
			clientY:0,
			drillLevel:this.props.drillLevel,
			disabledIndex:this.props.item.disabledIndex,
			date:{
				startTime:'',
				endTime:''
			},
			dateLevel:['','年','季度','月','周','日'],
			level:this.props.item.level,
		}
	},
	componentWillMount:function(){
		var _this = this;
		if(this.props.item.type=='GROUP_DATE_TITLE_FIELD'){
			if(!this.props.item.drillFilter||this.props.item.drillFilter.length==0){
				GlobalFilterStore.getFieldMaxMinData(this.props.metadataId,this.props.item.fieldName).then(function(result){
					_this.dateTime = {
						startTime:result.dataObject.min,
						endTime:result.dataObject.max
					}
					_this.defaultDate = {
						startTime:result.dataObject.min,
						endTime:result.dataObject.max
					}
					_this.setState({
						date:_this.dateTime
					})
				})
			}else{
				_this.dateTime = {
					startTime:this.props.item.drillFilter[0],
					endTime:this.props.item.drillFilter[1]
				}
				_this.defaultDate = {
					startTime:this.props.item.drillFilter[0],
					endTime:this.props.item.drillFilter[1]
				}
				_this.setState({
					date:_this.dateTime
				})
			}
			
		}
		
	},
	componentDidMount: function() {

	},

	componentDidUpdate: function() {

	},

	componentWillReceiveProps: function(nextProps) {
		var breadData=nextProps.item.breadData,date;
		if(nextProps.item.type=='GROUP_DATE_TITLE_FIELD'&&(nextProps.item.drillFilter&&nextProps.item.drillFilter.length>0)){
			date = {
				startTime:nextProps.item.drillFilter[0],
				endTime:nextProps.item.drillFilter[1]
			}
		}else{
			date = this.dateTime;
		}
		if(nextProps.item.closeBeadData){
			breadData=nextProps.item.closeBeadData
		}
		breadData=this._dateFormat(nextProps.item);
		this.setState({
			item:nextProps.item,
			breadData:breadData,
			date:date,
			level:nextProps.item.level
		})
	},
	render: function() {
		var breadClass = 'breadShow';
		if(this.props.item.type=='GROUP_DATE_TITLE_FIELD'){

		    var startTime = this.state.date ? this.state.date.startTime : '';
			var endTime   = this.state.date ? this.state.date.endTime   : '';

			if (!endTime && '' !== endTime) {

                endTime   = this.dateTime.endTime;
                startTime = this.dateTime.startTime;

			    if (('' !== endTime) && (!endTime)) {
                    endTime   = ReportDateRange.formatDateRange(this.dateTime.startTime).end;
                    startTime = ReportDateRange.formatDateRange(this.dateTime.startTime).start;
                }
			}

			return (
				<div className="breadcrumbTopBox" onMouseOut={(evt,key)=>this._mouseOut(evt,key)} onMouseMove={(evt,key)=>this._mouseOver(evt,key)}>
					<div className={breadClass}>
					<span className='breadCont' style={{cursor:'default'}}>
						<span>{this.props.item.breadData[0]} : </span>
						{startTime+' 至 '+endTime}
						{this.state.dateLevel.map((item,key)=>this._renderDateItem(item,key))}
					</span>
					</div>
					<div className="tooltipBox tooltipBoxHide" >
						<span>{this.state.breadData.map((item,key)=>this._renderItem(item,key))}</span>
					</div>
	    			</div>
			)
		}else{
			return (
				<div className="breadcrumbTopBox" onMouseOut={(evt,key)=>this._mouseOut(evt,key)} onMouseMove={(evt,key)=>this._mouseOver(evt,key)}>
					<div className={breadClass}>
					<span className='breadCont'>

						{this.state.breadData.map((item,key)=>this._renderItem(item,key))}
					</span>
					</div>
					<div className="tooltipBox tooltipBoxHide" >
						<span>{this.state.breadData.map((item,key)=>this._renderItem(item,key))}</span>
					</div>
	    			</div>
			)
		}
	},
	_renderItem:function(item,key){
		var Symbol = '>',breadclas='allShow';
		if(key===this.state.breadData.length-1){
			return <span key={key}  className='lastCont'>{item} </span>
		}

		if(key===0){
			Symbol=":";
			breadclas='breadclas';
		}
		var colorStyle={};
		if(key>0 && key<this.state.disabledIndex+1){
			colorStyle={
				color:"#dedede",
			}
		}
		return <span className={breadclas} style={colorStyle} onClick={(evt)=>this._clickBack(evt,key)} key={key} >{item} {Symbol} </span>
	},
	_renderDateItem:function(item,key){
		let style = {
			paddingLeft:16
		}
		if(item==this.state.level)
		style = {
			paddingLeft:16,
			color:"#0091ea",
			fontWeight:"bold"
		}
		return <span style={style} onClick={(evt)=>this._clickBack(evt,key)} key={key} > {item} </span>

	},
	_mouseOut:function(e){
		 var _this = $(ReactDOM.findDOMNode(this));
		 _this.find('.tooltipBox').removeClass('tooltipBoxShow').addClass('tooltipBoxHide');
	},
	_mouseOver:function(e){

		this._initWidth();
		var _this = $(ReactDOM.findDOMNode(this));
		var bodyWid = document.body.clientWidth;
		var tooltipWidth = _this.find('.tooltipBox').width();
		if(_this.hasClass('overflowBox')){
			// 鼠标到达边际判断
			if(tooltipWidth+e.clientX+24>bodyWid){
				var clientXLeft = bodyWid-tooltipWidth-26;

				_this.find('.tooltipBox').removeClass('tooltipBoxHide').addClass('tooltipBoxShow').css({'top':e.clientY+24,'left':clientXLeft});
			}else{
				_this.find('.tooltipBox').removeClass('tooltipBoxHide').addClass('tooltipBoxShow').css({'top':e.clientY+24,'left':e.clientX});
			}

		}

	},
	_initWidth:function(){
		var breadWid = $(ReactDOM.findDOMNode(this)).width();
		var breadContWid = $(ReactDOM.findDOMNode(this)).find('.breadCont').width()+24;
		//浏览器宽度与面包屑宽度比较
		if(breadContWid>breadWid){
			$(ReactDOM.findDOMNode(this)).addClass('overflowBox')
		}else{
			$(ReactDOM.findDOMNode(this)).removeClass('overflowBox')
		}

	},
	_clickBack:function(evt,index){
		var breadData = this.state.breadData;
		var breadDataLen = this.state.breadData.length;
		var delLen = breadDataLen-index;
		var item = this.state.item;
		var names=[];
		// 修改面包屑
		if(index==0  ){
			return
		}else{
			if(this.props.dashboard){
				if(index<this.state.disabledIndex+1){return;}
				if(this.state.disabledIndex == -1 || index>this.state.disabledIndex){
					this._dashboardHandTop(evt,index,item,names,delLen,breadDataLen,breadData)
				}

			}else{
				this.reportHandTop(evt,index,item,names,delLen,breadDataLen,breadData)
			}
		}

	},
	_dashboardHandTop:function(evt,index,item,names,delLen,breadDataLen,breadData){
			//日期返回
			if(item.type=="GROUP_DATE_TITLE_FIELD"){
				this._clickDateBack(evt,index);
				return;
			}
			var FilterFieldsData = FilterFieldsStore.setdrilDatasFun(evt,index,item,names,delLen,breadDataLen,breadData);
   			App.emit('APP-UPDATE-DRILL-BREADCRUMBTOP-DASHBOARD',FilterFieldsData.items,this.props.row,this.props.col)

	},
	reportHandTop:function(evt,index,item,names,delLen,breadDataLen,breadData){

		if (!this.isMounted()) return;
		if(index==0){
			return;
		}
		//日期返回
		if(item.type=="GROUP_DATE_TITLE_FIELD"){
			this._clickDateBack(evt,index);
			return;
		}

		var FilterFieldsData = FilterFieldsStore.setdrilDatasFun(evt,index,item,names,delLen,breadDataLen,breadData);
   		App.emit('APP-UPDATE-DRILL-BREADCRUMBTOP',FilterFieldsData.items)

	},
	_clickDateBack:function(evt,index){
		var newItem=this.state.item;
		newItem.breadData.splice(index);
		newItem.breadData.push('全部'+newItem.groupLevels[index-1])
		//newItem.levelItem=newItem.levelItemArr[index-2];
		newItem.drillFilter=newItem.levelItem;
		newItem.levelItemArr.splice(index);
		newItem.drillLevel=index-2;
		newItem.level=newItem.groupLevels[index-1];
		App.emit('APP-UPDATE-DRILL-DATE-BREADCRUMBTOP',{drilDownFilter:newItem,row:this.props.row,col:this.props.col});
		this.setState({
			level:this.state.dateLevel[index],
			dete:this.defaultDate
		})
	},
	_dateFormat:function(item){
		if(item.type!='GROUP_DATE_TITLE_FIELD'){
			if(item.closeBeadData){
				return item.closeBeadData; 
			}
			return item.breadData; 
		}
		var breads=JSON.parse(JSON.stringify(item.breadData));
		var value,val,level,year;
		if(item.drillDown && item.drillFilter && item.drillFilter.length>0){
			for(var i=1;i<breads.length;i++){
				var numberDate = breads[i];
					if(i==2 && breads.length>3){
						value = breads[i];
						level = item.groupLevels[i-1];
						year = value.substring(0, 4);
						val = value.substring(5);
						breads[i] = year+" 第"+ val + level;
					}
					if(i==4 && breads.length>5){
						value = breads[i];
						level = item.groupLevels[i-1];
						year = value.substring(0, 4);
						val = value.substring(5);
						breads[i] = year+" 第"+ val + level;
					}

			}

		}
		return breads

	}
});
