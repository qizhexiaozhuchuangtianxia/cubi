var React = require('react');
var App = require('app');

module.exports = React.createClass({
	displayName: 'CompareTooltip',
	getInitialState: function() {
		if(this.props.showTooltip){
			this._setInitTooltip(this.props.param)

		}
		return {
			showTooltip:this.props.showTooltip,
			copareInfoData:this.props.copareInfoData,
			eleWidth:null,
			eleHeight:null,
			leftX:null,
			topY:null,

		}
	},
	componentWillReceiveProps:function(nextProps){


		this.setState({
			copareInfoData:nextProps.copareInfoData,

		})
	},
	app:{},
	componentDidMount: function() {
		if(this.props.param){
			// console.log(this.props.param,'00')
			this._setInitTooltip(this.props.param)
		}
		this.app['APP-SET-COMPARETOOLTIP'] = App.on('APP-SET-COMPARETOOLTIP',this._setInitTooltip)
	},
	render: function() {
		var style = {
			display:'none'
		}
		if(this.props.showTooltip){
			style = {
				display:'block',
				left:this.state.leftX,
				top:this.state.topY,
				width:this.state.eleWidth,
				height:this.state.eleHeight
			}
		}
		return (
			<div style={style}  className="public-tooltip">
				<span>{this.props.copareInfoData.map((item,key)=>this.renderItem(item,key))}</span>
			</div> 
		)
	},
	renderItem:function(item,key){
		var line = '—'
		if(key === this.props.copareInfoData.length-1){
			return <span key={key} className="">{item} 。</span>
		}
		return <span key={key} className="">{item} {line}</span>
	},
	_setInitTooltip:function(arg){
    	if (!this.isMounted()) return;
    	if(arg.obj){
    		var locationWidth = arg.obj.locationWidth;

			if(arg.obj.clienX+arg.obj.eleWidth >= locationWidth){
				this.setState({
					leftX:locationWidth-arg.obj.eleWidth-2,
					eleWidth:arg.obj.eleWidth,
				    eleHeight:arg.obj.eleHeight,
					topY:arg.obj.clienY+20,


				})
			}else{

				this.setState({
					leftX:arg.obj.clienX-2,
					topY:arg.obj.clienY+20,
					eleWidth:arg.obj.eleWidth,
				    eleHeight:arg.obj.eleHeight,
				    locationWidth:locationWidth
				})
			}
    	}


	}

});
