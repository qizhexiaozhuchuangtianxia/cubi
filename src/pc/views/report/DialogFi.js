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
	DropDownMenu,
	MenuItem,
	Dialog
} = require('material-ui');

module.exports = React.createClass({
	app:{},
	displayName: 'DialogFi',
	getInitialState : function() {
		var index = 0;
		var items=[];
		if (this.props.items.length > 0) {
			index = this.props.items.length;
			items=this.props.items;
		}
		let isIndexBase = false;
		if (("INDEX" === this.props.areaInfo.areaInfo.category) &&
			("BASE"  === this.props.areaInfo.areaInfo.type)) {
			isIndexBase = true;
		}
		return {
			openDialog     : false,
			loaded         : true,
			error   : '',
			titText        : '',
			index          : index,
			dragFx         : true,
			isIndexBase    : isIndexBase,
			pageFormater   :this.props.pageFormater||{},
			items:items,
			disabled: false,
			isNum:true

		}
	},

	componentWillMount : function() {

	},

	componentDidMount : function() {
		this.app['APP-ZHIBIAO-FI']=App.on('APP-ZHIBIAO-FI', this._setDialogText);
		this.app['APP-SEND-ZHIBIAO-FORMATER']=App.on('APP-SEND-ZHIBIAO-FORMATER',this._save);
		this.app['APP-CHANGE-ZHIBIAO-FORMATER']=App.on('APP-CHANGE-ZHIBIAO-FORMATER',this._changeText);
		
	},

	componentWillReceiveProps : function(nextProps) {
		let isIndexBase = false;
		if (("INDEX" === nextProps.areaInfo.areaInfo.category) &&
			("BASE"  === nextProps.areaInfo.areaInfo.type)) {
			isIndexBase = true;
		}
		this.setState({
			isIndexBase : isIndexBase,
			items:nextProps.items||[]
		});
	},
	componentWillUnmount: function() {
		//取消订阅
        for (var i in this.app) {
            this.app[i].remove()
        }
    },
	componentDidUpdate : function() {
		
	},

	render : function() {
		
		return (
			<Dialog
				contentClassName="fi-dialog"
				open           = {this.state.openDialog}
				onRequestClose = {this._dialogClose}>

				<div className="fi-popover-box">
					<div className="drawcont">
						<h2>{this.state.titText}</h2>
						<ZhibiaoFormater pageFormater={this.state.pageFormater} index={this.state.index} type={this.state.type}/>
					</div>
					<div style={{'color':'#f44336','display':this.state.isNum ? 'none' : 'block','position': 'absolute',
						'bottom': '46px'}}>请输入0-9有效数字</div>
					<div className="fi-btn">

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
							disabled    = {this.state.disabled}
							onClick     = {this._sureHandle}/>

					</div>

				</div>

			</Dialog>

		)
	},
	
	_setDialogText : function(arg) {

		if (!this.isMounted()) return;

		this.setState({
			titText    : arg.titText,
			openDialog : arg.openDialog,
			dragFx     : arg.dragFx,
			index      : arg.index,
			pageFormater:arg.pageFormater,
			type:arg.type,
		});

	},


	_dialogClose : function() {
		if (!this.isMounted()) return;
		
		var _this = this;
		//this.props.setItem(false, this.state.dragFx, this.props.items,'',true);
		$(".fx-popover").hide();
		_this.props.setOpenDialog(false);
		_this.setState({
			error   : '',
			titText        : '',
			openDialog     : false,
			isNum:true,
			disabled:false
		});
	},
	_sureHandle:function(){
		this._dialogClose();
		//获取formater数据后再保存
        App.emit('APP-GET-ZHIBIAO-FORMATER',{
        	index:this.state.index,
        	type:1
        });
	},
	//保存
	_save:function(arg){
		if(this.state.index==arg.index && arg.type!=8){
			var items = App.deepClone(this.state.items);
			items[this.state.index].pageFormater = arg.pageFormater;
			this.props.setItem(true, this.state.dragFx, items, this.state.index);
		}
	},
	_changeText:function(arg){
		if (!this.isMounted()) return;
		this.setState({
			disabled:arg.disabled,
			isNum:arg.isNum
		});
		
	}
});
