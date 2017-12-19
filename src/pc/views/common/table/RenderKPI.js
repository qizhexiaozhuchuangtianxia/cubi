var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../../stores/ReportStore');
var PagerView = require('../PagerView');
var Loading = require('../Loading');
var HeadTd = require('./HeadTd');
var ReportUtil = require('../../../utils/ReportUtil');
var {
	Popover,
	FlatButton
} = require('material-ui');

module.exports = React.createClass({
	displayName: 'RenderKPI',

	propTypes: {
		data: React.PropTypes.object.isRequired,
		onFieldNameChanged: React.PropTypes.func,
	},

	getInitialState: function() {
		return {

		}
	},
	componentWillMount: function() {
		for (var i in this.app) {
			this.app[i].remove()
		}

	},
	app: {},
	componentDidMount: function() {
		var largeWidth,mainItem,viceItem;
		var _this = $(ReactDOM.findDOMNode(this));
			mainItem=  _this.find('.maincont').width();
			viceItem=   _this.find('.vicecont').width();

		// KPI值大于单元格宽度
		if(this.props.width<viceItem || this.props.width<mainItem){
			_this.find('.large_cont').removeClass('least').addClass('verySmall')
			mainItem=  _this.find('.maincont').width();
			viceItem=   _this.find('.vicecont').width();
			if(mainItem > viceItem ){
				largeWidth = mainItem;

			}else{
				largeWidth = viceItem;
			}
			_this.find('.large_cont').css( 'width', largeWidth+2);

		}

		if(mainItem > viceItem ){
			largeWidth = mainItem;

		}else{
			largeWidth = viceItem;
		}
		
		_this.find('.large_cont').css( 'width', largeWidth+2);
	   
		
	},
	componentWillReceiveProps: function(nextProps) {

	},
	render: function() {
		var _kpiConfig = this.props.kpiConfig?this.props.kpiConfig:{};
		var _sData = this.props.data;
		var _zhibaoCount = _sData.fields.length;
		var _data = _sData.pages[0].rows[0].cells;
		var _mainStyle={};
		var _viceStyle={};

		/* xuwneyue 添加KPI指标页面格式化遗漏部分BUG */
		let _formattedValue = this._getFormattedValues(_data);
		let _formattedValueOne = _formattedValue[0];
        let _formattedValueTwo = "";
        if (2 === _zhibaoCount) {
            _formattedValueTwo = _formattedValue[1];
        }

		if (_kpiConfig && _kpiConfig.mainThreshold && _kpiConfig.mainFZ && _kpiConfig.mainThresholdColor) {
			if (_kpiConfig.mainThreshold =='noReach') {
				//未达到
				if (_data[0].value < _kpiConfig.mainFZ) {
					_mainStyle.color=_kpiConfig.mainThresholdColor;
				}else{
					_mainStyle.color=_kpiConfig.mainColor;
				}

			}else{
				//超出
				if (_data[0].value > _kpiConfig.mainFZ) {
					_mainStyle.color=_kpiConfig.mainThresholdColor;
				}else{
					_mainStyle.color=_kpiConfig.mainColor;
				}
			}
		}else if (_kpiConfig.mainColor) {
			_mainStyle.color=_kpiConfig.mainColor;
		}
		var kpicontentClass = 'least large_cont';
		if( this.props.width ){
			kpicontentClass = this.setkpiLayout(this.props.width)
		}
		var mainQuotaStyle={display:'none'};
			if(_kpiConfig.mainTitle){
					mainQuotaStyle={display:'inline-block'}
			}
			var viceQuotaStyle={display:'none'};
			if(_kpiConfig.viceTitle){
					viceQuotaStyle={display:'inline-block'}
			}
		var _item ="";
		if (_zhibaoCount==1) {
			    _item=<div className="kpiContent">
			    		<div  className={kpicontentClass}>
				            <div className="mainItem">
				            	<div className="maincont">
				            			<span className="mainQuota" style={mainQuotaStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.mainTitle?_kpiConfig.mainTitle:'') } ></span><br/>
									<span className="mainConditionValue" style={_mainStyle} >{_formattedValueOne}</span>
									<span  className="mainUtil" style={_mainStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.mainUtil?_kpiConfig.mainUtil:'')}></span>
							</div>
			    	    	</div>
			    	    </div>
		    	    	</div>
		}else if (_zhibaoCount==2){

					if (_kpiConfig && _kpiConfig.viceThreshold && _kpiConfig.viceFZ && _kpiConfig.viceThresholdColor) {
						if (_kpiConfig.viceThreshold =='noReach') {
							//未达到
							if (_data[1].value < _kpiConfig.viceFZ) {
								_viceStyle.color=_kpiConfig.viceThresholdColor;
							}else{
								_viceStyle.color=_kpiConfig.viceColor;
							}

						}else{
							//超出
							if (_data[1].value > _kpiConfig.viceFZ) {
								_viceStyle.color=_kpiConfig.viceThresholdColor;
							}else{
								_viceStyle.color=_kpiConfig.viceColor;
							}
						}
					}else if (_kpiConfig.viceColor) {
						_viceStyle.color=_kpiConfig.viceColor;
					}

						
			    _item = <div className="kpiContent">
			    			<div className={kpicontentClass}>
				     			<div className="mainItem">
									<div className="maincont">
										<span className="mainQuota" style={mainQuotaStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.mainTitle?_kpiConfig.mainTitle:'')} ></span><br/>
										<span className="mainConditionValue" style={_mainStyle} >{_formattedValueOne}</span>
										<span  className="mainUtil" style={_mainStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.mainUtil?_kpiConfig.mainUtil:'')}></span>
									</div>
				    		    </div>
							<div className="viceItem">
								<div className="vicecont">
									<span className="viceQuota" style={viceQuotaStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.viceTitle?_kpiConfig.viceTitle:'')}></span><br/>
									<span className="viceConditionValue" style={_viceStyle} >{_formattedValueTwo} </span>
									<span className="viceUtil" style={_viceStyle} dangerouslySetInnerHTML={ this.createMarkup(_kpiConfig.viceUtil?_kpiConfig.viceUtil:'') }></span>
								</div>
								
							</div>
							</div>
						</div>

		}

		return (<div className="KPIDiv" >{_item}</div>);

	},
	setkpiLayout: function( boxWidth ){
		var boxWidth = boxWidth+48;
		var kpicontentClass ;
		 if(   boxWidth<=1200 && boxWidth > 900  ){
			kpicontentClass = 'large large_cont';
		}else if( boxWidth == 900 ){
			kpicontentClass='middle large_cont'
		}else if( boxWidth >= 600 &&  boxWidth < 900 ){
			kpicontentClass='small large_cont'
		}else if( boxWidth >= 300 && boxWidth <600){
			 kpicontentClass='least large_cont'
		}

		return kpicontentClass
	},
 	createMarkup: function(arg) {
		return {__html: arg};
	},
    /**
	 * 根据设定的格式化信息pageFormatter，格式化数据
     * @param datas
     * @returns {Array}
     * @private
     */
	_getFormattedValues: function(datas) {

		let formattedValues = [];

		for (let counter = 0, length = datas.length; counter < length; counter++) {

			let data = datas[counter];

			if (data.pageFormater) {
                formattedValues.push(ReportUtil.getFormattedValueWithFormatter(data.value, data.pageFormater));
			}
			else {
				formattedValues.push(data.value);
			}

		}

		return formattedValues;

	}


});
