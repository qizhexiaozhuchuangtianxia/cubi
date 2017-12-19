
var React           = require('react');
var App             = require('app');
var ReportStore     = require('../../stores/ReportStore');
var PublicButton    = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var $               = require('jquery');
var {indexFieldFormaterList}  = require('../../stores/ConstStore');
var {
	FontIcon,
	Popover,
	DropDownMenu,
	MenuItem,
	SelectField
} = require('material-ui');

module.exports = React.createClass({
	displayName: 'ZhibiaoFormater',
	app:{},
	getInitialState : function() {
		var standard=0;
		var pageFormater=this.props.pageFormater||{};
		if(pageFormater.type){
			var formaterObj = indexFieldFormaterList.filter(function(item,index){
			  	return item.type === pageFormater.type;
			});
			standard=formaterObj[0].standard;
		}
		return {
			type:pageFormater.type||indexFieldFormaterList[0].type,
			standard:standard,
			digit:pageFormater.digit>=0 ? pageFormater.digit : -1,
		}
	},

	componentWillMount : function() {

	},

	componentDidMount : function() {
		this.app['APP-GET-ZHIBIAO-FORMATER']=App.on('APP-GET-ZHIBIAO-FORMATER',this._getZhibiaoFormater);
	},

	componentWillReceiveProps : function(nextProps) {
		
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
			<div className="zhibiao-formater">
				<div className="formater-tit">
					<div className="standard-panel">
						<SelectField
		                    className="standard"
		                    floatingLabelStyle = {{fontSize: '14px',color:'#00e5ff'}}
		                    onChange = {(evt,index,value)=>this._changeDownMenu(evt,index,value)}
		                    floatingLabelText='格式' 
		                    value={this.state.standard}
		                    style={{width: '100%',verticalAlign: "bottom", color: '#00e5ff' }}>

	                    {indexFieldFormaterList.map(this._menuItem)}

	                  </SelectField>

					</div>
				</div>
				<div className="xtext-panel">
					<div className="xtext">小数点后显示</div>
					<PublicTextField
							style              = {{width:30}}
							className          = "fixText xtext-input"
							defaultValue       = {this.state.digit==-1 ? '' : this.state.digit}
							floatingLabelFixed = {true}
							onChange           = {()=>this._changeText()}/>
					<div className="xtext">位</div>
				</div>
			</div>

		)
	},
	_menuItem:function(item,index){
		return <MenuItem key={index} style={{fontSize:'12px'}}  value={index} primaryText={item.name}/>
	},
	_changeDownMenu:function(evt,index){
		this.setState({
			standard:index,
			type:indexFieldFormaterList[index].type,
		});
	},
	_changeText:function(defaultValue){
		var _this = this;
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(function () {
			var digit=$('.fixText').find('input').val();
			var disabled=false;
			var isNum=ReportStore.pageFormaterIsNum(digit);
			if(digit==''){
				digit=-1;
			}
			if(!isNum){
				disabled=true;
			}
			_this.setState({
				digit:digit,
				disabled:disabled
			});
			App.emit('APP-CHANGE-ZHIBIAO-FORMATER',{
				digit:digit,
				disabled:disabled,
				isNum:isNum
			});
		}, 200);

		
	},
	_getZhibiaoFormater:function(arg){
		if(arg.index!=this.props.index){
			return;
		}
		var pageFormater={
			type:this.state.type,
			pattern: "",
            digit: this.state.digit
		}
		App.emit('APP-SEND-ZHIBIAO-FORMATER',{
			pageFormater:pageFormater,
			index:this.props.index,
			type:arg.type,
		});
	}
	
});
