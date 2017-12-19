/**
 * 对比
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var CompareStore = require('../../stores/CompareStore');
var ReportStore = require('../../stores/ReportStore');
var CompareWeiduList = require('./CompareWeiduList');
var CompareScene = require('./CompareScene');
var CompareInfo = require('./CompareInfo');
var CompareDilog = require('./CompareDilog');

module.exports = React.createClass({

	displayName: 'CompareHeader',

	getInitialState: function(){
		var selectedCompare = ReportStore.getSelectedCompareWei(this.props.compareData,this.props.compare);
		var isNoCompare=ReportStore.selectedNoCompare(selectedCompare);
	    //var selectedCompare = ReportStore.getSelectedScene(newDataList);
	    var slectedSences=CompareStore.getSlectedSences(selectedCompare.scenes);
		return {
			compareData:this.props.compareData,
			open:false,
			compareDilogOpen:false,
			sceneData:[],
			selectedCompare:selectedCompare,
			filterDialogOpen:false,
			isAdd:false,
			slectedSences:slectedSences,
			isNoCompare:isNoCompare
		}
	},

	componentWillMount: function() {

	},

	componentDidMount: function() {
	},

	componentWillReceiveProps:function(nextProps) {
		var selectedCompare = ReportStore.getSelectedCompareWei(nextProps.compareData,nextProps.compare);
		var isNoCompare=ReportStore.selectedNoCompare(selectedCompare);
        // var selectedCompare = ReportStore.getSelectedScene(newDataList);
		this.setState({
 			compareData:nextProps.compareData,
 			selectedCompare:selectedCompare,
 			slectedSences:CompareStore.getSlectedSences(selectedCompare.scenes),
 			isNoCompare:isNoCompare
 		})
	},
	// shouldComponentUpdate:function(nextProps,nextState){
	// 	console.log(nextState.update,'nextState.update')
	// 	if(nextState.update=='no'){
	// 		return false;
	// 	}
	// 	return true;
	// },
	render: function() {
		var type=this.props.reportType;
		if(type=="ScrollColumn2D" || type=='ScrollLine2D' || type=='TREE' || type=='CATEGORY'){
			return (
				<div className="contrast">
					<div className='compare-cont'>
						<div className='weidu-list'>
							<CompareWeiduList
							compareData={this.state.compareData}
							clickWeiList={this._clickWeiList}
							selectedCompare={this.state.selectedCompare}
							isNoCompare={this.state.isNoCompare}/>
						</div>
						<div className='compare-scene'>
							<CompareScene selectedCompare={this.state.selectedCompare}
							clickWeiList={this._clickWeiList}
							compare={this.props.compare}
							addScenes={this.props.addScenes}
							setCompareDilogOpen={this._setCompareDilogOpen}
							isNoCompare={this.state.isNoCompare}/>
						</div>
						</div>
					<div className='compare-details'>
						<CompareInfo
						selectedCompare={this.state.selectedCompare}
						clickWeiList={this._clickWeiList}
						compare={this.props.compare}
						setCompareDilogOpen={this._setCompareDilogOpen}
						slectedSences={this.state.slectedSences}
						isNoCompare={this.state.isNoCompare}/>
					</div>
					<CompareDilog
					open={this.state.compareDilogOpen}
					selectedCompare={this.state.selectedCompare}
					addScenes={this._addScenes}
					setCompareDilogOpen={this._setCompareDilogOpen}
					isAdd={this.state.isAdd}
					setFilterDialogOpen={this._setFilterDialogOpen}
					slectedSences={this.state.slectedSences}
					compare={this.props.compare}
					delScene={this._delScene}
					isNoCompare={this.state.isNoCompare}
					zhiBiaoList={this.props.zhiBiaoList}/>
				</div>

			)
		}
		return null;
	},

	_clickWeiList: function(item,isWeiList){
		this.props.updateCompareDate(item,isWeiList);
	},
	_setFilterDialogOpen:function(open){
		this.setState({
			filterDialogOpen:open,
		})
	},
	_addScenes:function(selectedCompare,isAdd){
		this.props.addScenes(selectedCompare,isAdd);
	},
	_setCompareDilogOpen:function(open,isAdd){
		this.setState({
			compareDilogOpen:open,
			isAdd:isAdd,
		})
	},
	_delScene:function(sceneName){
		this.props.delScene(sceneName);
	}

});
