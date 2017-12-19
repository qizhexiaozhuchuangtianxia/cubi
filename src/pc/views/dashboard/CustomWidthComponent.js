var React = require('react');
var {
    Slider
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentWillMount:function(){
    },
    componentDidMount: function() {
    },
	render:function(){
		return(
			<div className="custom-width-box">
				<div className="dashboardReportEdit-bar-title">自定义列宽</div>
				<div className="custom-width-list-box">
					<span>类目</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={.5}/></div>
						<div className="customWidthComponet-sliderLable">适中</div>
					</div>
				</div>
				<div className="custom-width-list-box">
					<span>类型</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={.5}/></div>
						<div className="customWidthComponet-sliderLable">适中</div>
					</div>
				</div>
				<div className="custom-width-list-box">
					<span>促销价(平均)</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={0}/></div>
						<div className="customWidthComponet-sliderLable">隐藏</div>
					</div>
				</div>
				<div className="custom-width-list-box">
					<span>原价(平均)</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={1}/></div>
						<div className="customWidthComponet-sliderLable">完整</div>
					</div>
				</div>
				<div className="custom-width-list-box">
					<span>已售件数(求和)</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={1}/></div>
						<div className="customWidthComponet-sliderLable">完整</div>
					</div>
				</div>
				<div className="custom-width-list-box">
					<span>SPU(求和)</span>
					<div className="customWidthComponet">
						<div className="customWidthComponet-slider"><Slider step={0.10} value={1}/></div>
						<div className="customWidthComponet-sliderLable">完整</div>
					</div>
				</div>
			</div>
		)
	}
})