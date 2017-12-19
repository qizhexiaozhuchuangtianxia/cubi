

/**
 * 对比场景
 */
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var CompareStore = require('../../stores/CompareStore');
var CompareDilog = require('./CompareDilog');
var {
	FontIcon
} = require('material-ui');

module.exports = React.createClass({

	displayName: 'CompareScene',

	getInitialState: function(){
		var scenes=this.props.selectedCompare.scenes;
		var show=true;
		if(scenes.length==1||scenes[0].type=='isCompare'){
			show=false;
		}
		return{
		 	selectedCompare:this.props.selectedCompare,
		    scenes:this.props.selectedCompare.scenes,
		    show:show,
		    open:false
		}
		 
	},

	componentWillMount: function() {

	},

	componentDidMount: function() {
		App.on('APP-REPORT-SET-COMPARE-DILOG',this._setDilogOpen);
	},

	componentWillReceiveProps:function(nextProps) {
		var scenes=nextProps.selectedCompare.scenes;
		var show=true;
		if(scenes.length==1 ||scenes[0].type=='isCompare'){
			show=false;
		}
		this.setState({
			selectedCompare:nextProps.selectedCompare,
		    scenes:nextProps.selectedCompare ? nextProps.selectedCompare.scenes : [],
		    show:show
		})
	},
	render: function() {
		if(this.props.isNoCompare){return null;}
		return (
			<div className='scenes'>
				{this.state.scenes.map(this.renderScene)}
				{this.renderSceneAdd()}
			</div>
		)
	},
	renderScene:function(item, index){
		if(this.state.scenes.length<=1){
			return null;
		}
		return <div key={index} className='scenes-item' onClick={(evt)=>this._clickScene(evt,item)}>
					{this.renderSceneName(item)}
					{this.renderSceneLine(item.selected)}
				</div>
	},
	renderSceneAdd:function(){
		if(this.state.selectedCompare){
			return <div className='scenes-item scenes-add' onClick={(evt)=>this._addScene(evt)}>
					<FontIcon className="iconfont icon-ictianjia24px" />
				</div>
		}
		return null;
	},
	renderSceneName:function(item){
		if(item.selected){
			return <div className='scenes-name scenes-name-selected'>{item.sceneName}</div>
		}
		return <div className='scenes-name'>{item.sceneName}</div>;
	},
	renderSceneLine:function(selected){
		if(selected){
			return <div className='scenes-line'></div>
		}
		return null;
	},
	_clickScene:function(evt,item){
		// 设置 selectedScenes
		var selectedCompare=CompareStore.clickSceneSetFields(item,this.state.selectedCompare,this.state.scenes);
		//设置 scenes:selected
		var newSelectedCompare=CompareStore.setSlectedScene(selectedCompare,item);

		this.props.clickWeiList(newSelectedCompare);
		
	},
	_addScene:function(){
		if(this.state.scenes.length>=8){return;}
		this.props.setCompareDilogOpen(true,true)
	},
	_setDilogOpen:function(open){
		this.setState({
			open:open
		})
	},
	
});
