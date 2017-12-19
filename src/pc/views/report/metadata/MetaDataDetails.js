var $ = require('jquery');
var React = require('react');
var App = require('app');
var metaDataStore = require('../../../stores/MetaDataStore');
var PublicButton = require('../../common/PublicButton');
var {
	FontIcon
} = require('material-ui');
module.exports = React.createClass({

	displayName: 'MetaDataDetails',

	propTypes: {
		btnOnClick: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			btnOnClick: function(metadata) {
				console.log('details click',metadata);
			},
		}
	},

	getInitialState: function() {
		return {

		}
	},
	componentWillMount: function() {

	},
	componentDidMount:function(){
		this._setMetaDataDetailsScroll();
	},
	render: function() {

		return this._renderItem();
	},

	_renderItem: function() {


		var weidulist = [];
		var metaDataContent=this.props.metaDataContent;

		for(var i=0;i<metaDataContent.weiduList.length;i++){
			weidulist.push(metaDataContent.weiduList[i].name);
		}
		//weidulist = weidulist.join(',');
		var zhibiaolist = [];
		for(var i=0;i<metaDataContent.zhibiaoList.length;i++){
			zhibiaolist.push(metaDataContent.zhibiaoList[i].name);
		}
		//zhibiaolist = zhibiaolist.join(',');
		return (
			<div className="metadata-selector-view-body-view matadata">

				<div className="content">
					<div className="matadata-content">
						<dl>
							<dt><i className="iconfont icon-icshujulifang24px"/></dt>
							<dd>
								<h2 title={metaDataContent.name}>{metaDataContent.name}</h2>
								<p>{metaDataContent.directionAnalysis}</p>
							</dd>
						</dl>
						<div className='metaDataDescBox'>
							<p>{metaDataContent.content}</p>
						</div>
						<div className="cardMatadata">
							<div className='cardMatadataBox'>
								<h2>维度</h2>
								<div className="spanClassName">
									{weidulist.map(this._spanDomHandle)}
								</div>
							</div>
							<div className='cardMatadataBox'>
								<h2>指标</h2>
								<div className="spanClassName">
									{zhibiaolist.map(this._spanDomHandle)}
								</div>
							</div>
						</div>
						<div className="matadata-submit-panel">
							<PublicButton
								style={{color:"rgba(0,229,255,255)"}}
								labelText="使用立方"
								rippleColor="rgba(0,229,255,0.25)"
								hoverColor="rgba(0,229,255,0.15)"
								disabled={this.state.disabledState}
								className="matadata-submit-btn"
								onClick={(evt)=>this._metaOnClick(evt,metaDataContent)}/>

						</div>
					</div>

				</div>
			</div>
		)
	},
	_spanDomHandle:function(item,key){
		return <span key={key}>{item}</span>
	},
	_metaOnClick:function(evt,metadata){
		this.props.btnOnClick(metadata);

	},
	_setMetaDataDetailsScroll:function(){

		$(".content").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});

	}
})
