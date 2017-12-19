/**
 * @author : XuWenyue
 * @description :
 * 	01 | 2017-04-13 | XuWenyue | Fixed
 * 	02 | 2017-04-13 | XuWenyue | 修改计算列验证方式, 改为验证所有计算列
 */

var React           = require('react');
var App             = require('app');
var ReportStore     = require('../../stores/ReportStore');
var CompareStore    = require('../../stores/CompareStore');
var PublicButton    = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var $               = require('jquery');
var ZhibiaoFormater=require('./ZhibiaoFormater');
var {
	FontIcon,
	Popover,
	Dialog
} = require('material-ui');

module.exports = React.createClass({

	_clickStep : 0,
	displayName: 'DialogFx',
	app:{},
	getInitialState : function() {
		var index = 0;
		if (this.props.items.length > 0) {
			index = this.props.items.length;
		}
		let isIndexBase = false;
		if (("INDEX" === this.props.areaInfo.areaInfo.category) &&
			("BASE"  === this.props.areaInfo.areaInfo.type)) {
			isIndexBase = true;
		}
		return {
			openDialog     : false,
			loaded         : true,
			errorTit   : '',
			errorFx:'',
			fxDisabled     : true,
			titText        : '',
			fxText         : '',
			fxSign         : true,
			index          : index,
			dragFx         : true, 
			isSuccess      : false,
			isIndexBase    : isIndexBase,
			pageFormater   :this.props.pageFormater||{},
			type:8,
			newDisabled:true,
			isNum:true,
		}
	},

	componentWillMount : function() {

	},

	componentDidMount : function() {
		this.app['APP-ZHIBIAO-FX']=App.on('APP-ZHIBIAO-FX', this._setDialogText);
		this.app['APP-SEND-ZHIBIAO-FORMATER']=App.on('APP-SEND-ZHIBIAO-FORMATER',this._saveFx);
		this.app['APP-CHANGE-ZHIBIAO-FORMATER']=App.on('APP-CHANGE-ZHIBIAO-FORMATER',this._changeText);
		this._setHrColor();
	},

	componentWillReceiveProps : function(nextProps) {
		let isIndexBase = false;
		if (("INDEX" === nextProps.areaInfo.areaInfo.category) &&
			("BASE"  === nextProps.areaInfo.areaInfo.type)) {
			isIndexBase = true;
		}
		this.setState({
			isIndexBase : isIndexBase
		});
	},

	componentDidUpdate : function() {
		this._setHrColor();
	},

	render : function() {

		var titErrorCls    = '';
		var fxErrorCls     = '';
		var fontIconClsTit = 'iconfont icon-ictanhaotishi224px iconPrompt iconPromptTit';
		var fontIconCls    = 'iconfont icon-ictanhaotishi224px iconPrompt';

		if (this.state.errorFx != '') {
			fxErrorCls   = 'drawTextSpanError';
			fontIconCls += " showPrompt";
		}
		if (this.state.errorTit != '') {
			titErrorCls     = 'drawTextSpanError';
			fontIconClsTit += " showPrompt";
		}

		return (
			<Dialog
				contentClassName="fx-dialog"
				open           = {this.state.openDialog}
				onRequestClose = {this._dialogClose}>
				<div className="fx-dialog-box">

					<h2>编辑计算列</h2>

					<div className="drawText">

						<span className={titErrorCls}>标题</span>

						<PublicTextField
							style              = {{width:292}}
							className          = "titText"
							defaultValue       = {this.state.titText}
							floatingLabelFixed = {true}
							errorText          = {this.state.errorTit}
							onChange           = {()=>this._changeTitle()}/>

						<FontIcon className={fontIconClsTit}  pageFormater={this.state.pageFormater}/>

					</div>
					<ZhibiaoFormater style={{'marginTop':'10px'}} pageFormater={this.state.pageFormater} index={this.state.index} type={this.state.type}/>
					<div style={{
						'color':'#f44336',
						'display':this.state.isNum ? 'none' : 'block',
						'position': 'absolute',
						'bottom': '120px'}}>
						请输入0-9有效数字
					</div>
					<div className="drawText drawTextFx">
						<span className={fxErrorCls}>公式</span>

						<PublicTextField
							style              = {{width:292}}
							className          = "fxText"
							defaultValue       = {this.state.fxText}
							floatingLabelFixed = {true}
							errorText          = {this.state.errorFx}
							onChange           = {()=>this._changeFx()}/>

						<div className="fx-meassage">	
							<FontIcon className={fontIconCls} />
							<div className="successText" style={{'display':(this.state.isSuccess && this.state.errorFx=='' && !this.state.fxDisabled) ? 'block' : 'none'}}>验证通过</div>
						</div>

					</div>

					<div className="fx-btn">

						<PublicButton
							style = {{color :  "rgba(0,229,255,255)"}}
							className   = "judgeFormula"
							labelText   = "验证公式"
							rippleColor = "rgba(0,229,255,0.25)"
							hoverColor  = "rgba(0,229,255,0.15)"
							disabled    = {this.state.fxDisabled}
							onClick     = {this._checkedFxHandle}/>

						<PublicButton
							style = {{color :  "rgba(254,255,255,0.87)"}}
							labelText   = "取消"
							rippleColor = "rgba(255,255,255,0.25)"
							hoverColor  = "rgba(255,255,255,0.15)"
							onClick     = {this._dialogClose}/>

						<PublicButton
							style = {{color :  "rgba(0,229,255,255)"}}
							className   = "sureSubmit"
							labelText   = "确定"
							rippleColor = "rgba(0,229,255,0.25)"
							hoverColor  = "rgba(0,229,255,0.15)"
							disabled    = { this.state.isNum ? this.state.newDisabled : true}
							onClick     = {this._sureHandle}/>

					</div>

				</div>

			</Dialog>

		)
	},
	_getDisabled:function(errorText,errorTit){
		var fxText= $('.fxText').find('input').val(),
			titText= $('.titText').find('input').val(),
			newDisabled=true,
			fxDisabled=true,
			isSuccess=this.state.isSuccess;
		
		if(fxText != ''){
			if(titText != ''){
				newDisabled = false;
			}
			fxDisabled=false;
		}
		if(errorTit!=''){
			newDisabled=true;
		}
		if(errorText=='errorFx'){
			isSuccess=false;
		}
		
		var state={
			newDisabled:newDisabled,
			fxDisabled:fxDisabled,
			isSuccess:isSuccess,
		}
		if(errorText=='errorFx'){
			state.errorFx='';
		}else{
			state.errorTit=errorTit;
		}
		
		return state;
	},
	_changeTitle : function() {
		var _this = this;
		if (this.titTime) clearTimeout(this.titTime);
		this.titTime = setTimeout(function () {
			var sameName=_this._sameName();
			_this.setState(_this._getDisabled('errorTit',sameName.errorTit));
		}, 200);
	},

	_changeFx : function() {
		var _this = this;
		if (this.titTime) clearTimeout(this.titTime);
		this.titTime = setTimeout(function () {
			_this._removeHrColor();
			_this.setState(_this._getDisabled('errorFx',_this.state.errorTit));
		}, 200);

	},

	_sameName : function() {

		var item    = this.props.items;
		var titText = $('.titText').find('input').val();
		var errorTit='标题已被占用，请选取其他名称。';
		for (var i = 0; i < item.length; i++) {
			if (titText == item[ i ].name && i != this.state.index) {
				return {
					errorTit   : errorTit,
					// errorTextState : this.state.errorTextState,
					// sameName       : true,
					// newDisabled:true
				};
			}
		}

		/* XuWenyue: 计算列标题重名检查，检查维度列名称 */
		item = this.props.areaInfo.areaInfo.rowTitleFields;
		if (item) {
			for (var counter = 0; counter < item.length; counter++) {
				var colName = item[ counter ].name;
				var colCustomName = item[ counter ].customName;
				if(titText!==''){
					if ((colName == titText) || (colCustomName == titText)) {
						return {
							errorTit   : '标题已被占用，请选取其他名称。',
							// errorTextState : this.state.errorTextState,
							// sameName       : true,
							// newDisabled:true
						};
					}
				}
			}
		}
		return {
			errorTit : '',
		};
	},

	_setClickStep : function() {
		this._clickStep = 0;
	},

	_dialogClose : function() {
		if (!this.isMounted()) return;
		this.props.setItem(false, this.state.dragFx, this.props.items);
		$(".fx-popover").hide();
		this.props.setOpenDialog(false);
		this.setState({
			errorTitText   : '',
			errorTit:'',
			fxText         : '',
			titText        : '',
			fxSign         : true,
			openDialog     : false,
			isSuccess      : false,
		});

	},

	_setDialogText : function(arg) {

		if (!this.isMounted()) return;
		var empty = false;
		var newDisabled=false;
		var fxDisabled=false;
		
		if (arg.dragFx) {
			empty = true;
			newDisabled=true;
			fxDisabled=true;
		}
		var cexpression = arg.cexpression;
		if (!cexpression || cexpression == '') {
			cexpression = arg.fxText;
		}

		this.setState({
			titText    : arg.titText,
			fxText     : cexpression,
			openDialog : arg.openDialog,
			dragFx     : arg.dragFx,
			index      : arg.index,
			fxSign     : arg.fxSign,
			pageFormater:arg.pageFormater,
			type:arg.type,
			newDisabled:newDisabled,
			fxDisabled:fxDisabled
		});

		if (arg.fxSign == false) {
			this._checkedFormula(arg.titText, arg.fxText, this.state.index);
		}
	},
	_checkedFxHandle:function(){
		if (!this.isMounted()) return;
		var fxText  = $('.fxText').find('input').val(),
			titText = $('.titText').find('input').val();
		this._checkedFormula(titText, fxText, this.state.index);
	},
	_sureHandle : function(submit) {

		if (!this.isMounted()) return;

		this.setState({
			openDialog  : false
		},function(){
			this._getFormater();
		});
			
	},

	_setValidateFields : function(titText, fxText, index) {

		var cfxText = ReportStore.replaceIndexField({ expression : fxText }, this.state.isIndexBase);
		var items   = this.props.items;

		var indexFields = [];
		for (var i = 0; i < items.length; i++) {
			var obj = {
				"name"        : items[ i ].name,
				"customName"  : items[ i ].customName,
				"statistical" : items[ i ].statistical || "",
			};

			if (items[ i ].type == 8) {

				obj[ "expression" ] = items[ i ].expression;
				var cexpression = items[ i ].cexpression;
				if (!cexpression) {
					var o = ReportStore.replaceIndexField({ expression : items[ i ].expression }, this.state.isIndexBase);
					cexpression = o.cexpression;
				}
				obj[ "cexpression" ] = cexpression;
			}

			if (i == index) {
				obj[ "name" ]        = titText;
				obj[ "customName" ]  = "";
				obj[ "statistical" ] = "";
				obj[ "expression" ]  = cfxText.expression;
				obj[ "cexpression" ] = cfxText.cexpression;
			}

			indexFields.push(obj);
		}
		return indexFields;
	},

	_checkedFormula : function(titText, fxText, index) {

		var obj = this.props.areaInfo;
		obj.areaInfo.indexFields = this._setValidateFields(titText, fxText, index);

		if (obj.areaInfo.category === "CHART") {
			obj.areaInfo.categoryFields = this._setValidateCategoryFields();
		}

		var _this                = this;
		var changeZhicompareData = CompareStore.changeZhibiaoUpdateCompareData(this.props.compareData, obj.areaInfo.indexFields, this.props.compare);
		var compareData          = CompareStore.changeWeiduUpdateCompare(changeZhicompareData, this.props.selectedWeiduList);
		var compareInfo          = CompareStore.setCompareInfo(compareData, obj.areaInfo.indexFields, false, obj.areaInfo.categoryFields);

		obj.areaInfo.compareInfo = compareInfo;
		obj.areaInfo.compare     = CompareStore.updateCompare(compareInfo, obj.areaInfo.indexFields);

		return new Promise(function (resolve, reject) {

			ReportStore.validateExpression(obj).then(function (data) {

				// 判断计算列检查的返回结果
				_this._checkedFx(data);

				return resolve(data);

			});
		})

	},

	/**
	 * 检索错误表达式, 如果有当前表达式错误, 更新状态
	 * @param dataObjects 所有有错误的计算列信息
	 * @private
	 */
	_checkedFx : function(data) {

		if (!this.isMounted()) return;

		// 全部计算列验证成功, 更新当前成功状态
		if (true == data.success) {
			this.setState({
				errorFx : "",
				fxSign         : true,
				isSuccess      : true
			});
			return;
		}
		// 全部计算列中出现了错误的计算列, 检查是否为当前计算列有错误
		let fxText     = $('.fxText').find('input').val();
		let titText    = $('.titText').find('input').val();
		let dataObject = null;

		fxText = ReportStore.replaceIndexField({ expression : fxText }, this.state.isIndexBase);
		fxText = fxText.expression;

		for (let counter = 0; counter < data.dataObject.length; counter++) {

			dataObject = data.dataObject[counter];

			if ((titText != dataObject.colName) || (fxText != dataObject.expression)) {
				dataObject = null;
				continue;
			}

			break;
		}

		// 当前计算列没有错误, 更新当前成功状态
		if (null == dataObject) {
			this.setState({
				errorFx : "",
				fxSign         : true,
				isSuccess      : true
			});
			return;
		}

		// 当前计算列有错误, 更新当前有误状态
		var mess = dataObject.message.replace(/SUM/, "(求和)");
		this.setState({
			errorFx : mess,
			fxSign         : false,
			isSuccess      : false
		});

	},
	_getFormater:function(){
		
		 App.emit('APP-GET-ZHIBIAO-FORMATER',{
        	index:this.state.index,
        	type:8
        });
	},
	_saveFx : function(arg) {
		if (!this.isMounted()) return;
		if(this.state.index!=arg.index || !arg.type || arg.type!=8){return;}
		var fxText  = $('.fxText').find('input').val(),
			titText = $('.titText').find('input').val(),
			_this = this,
			arg=arg;

		this._checkedFormula(titText, fxText, _this.state.index).then(function (data) {
			var items         = _this.props.items;
			var index         = _this.state.index;
			var expressionObj = ReportStore.replaceIndexField({ expression : fxText }, _this.state.isIndexBase);

			let errFxs    = {};
			let length    = data.dataObject ? data.dataObject.length : 0;
			let curErrMsg = null;
			for (let counter = 0; counter < length; counter++) {
				let dataObject = data.dataObject[counter];
				errFxs[dataObject.colName + ":" + dataObject.expression] = dataObject;

				if ((titText == dataObject.colName) && (expressionObj.expression == dataObject.expression)) {
					curErrMsg = dataObject.message;
				}
			}

			items[ index ].expression  = expressionObj.expression;
			items[ index ].cexpression = fxText;
			items[ index ].name        = titText;

			for (let counter = 0; counter < items.length; counter++) {

				items[counter].fxSign     = true;
				items[counter].errMessage = null;

				let errFx = errFxs[items[counter].name + ":" + items[counter].expression];

				if (!errFx) {
					continue;
				}

				items[counter].fxSign     = false;
				items[counter].errMessage = errFx.message;
			}
			items[_this.state.index].pageFormater=arg.pageFormater;

			_this.props.setItem(true, _this.state.dragFx, items, index);
			_this.props.setOpenDialog(false);

			$(".fx-popover").hide();
			_this.setState({
				fxText         : '',
				titText        : '',
				fxSign         : true,
				openDialog     : false,
				isSuccess      : false,
				pageFormater:arg.pageFormater
			});

		});

	},

	_removeHrColor : function() {
		var thisEle = $('.fx-popover-box');
		$(thisEle).find('.drawText').eq(1).find('hr').eq(1).removeClass('hr-error hr-true');
		$(thisEle).find('.successText').removeClass('textTrue');
	},

	_setHrColor : function() {

		var _this = this;

		this._removeHrColor();
		var thisEle = $('.fx-popover-box');

		if (_this.state.errorTit!='') {
			$(thisEle).find('.drawText').eq(0).find('hr').eq(1).addClass('hr-error');
		}

		if (_this.state.fxSign === false) {
			$(thisEle).find('.drawText').eq(1).find('hr').eq(1).addClass('hr-error');
		}
		else if (_this.state.fxSign && _this.state.isSuccess) {
			$(thisEle).find('.drawText').eq(1).find('hr').eq(1).addClass('hr-true');
			$(thisEle).find('.successText').addClass('textTrue');
		}

	},

	_setValidateCategoryFields : function() {

		var itemList  = [];
		var weiduList = this.props.selectedWeiduList || [];

		for (var i = 0; i < weiduList.length; i++) {
			var item = {};

			item.name       = weiduList[ i ].name;
			item.customName = weiduList[ i ].customName;

			if (weiduList[ i ].groupType && weiduList[ i ].level) {
				item.level = weiduList[ i ].level;
				item.type  = weiduList[ i ].groupType;
			}
			itemList.push(item);
		}
		return itemList;
	},
	_changeText:function(arg){
		if (!this.isMounted()) return;

		this.setState({
			isNum:arg.isNum
		});
		
	}
});
