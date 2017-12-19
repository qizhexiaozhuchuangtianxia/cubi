/**
 * 对比
 */
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var CompareDilog = require('./CompareDilog');
var {
    IconButton,
    FontIcon,
    Popover,
    MenuItem,
    Menu
} = require('material-ui');
module.exports = React.createClass({

	displayName: 'CompareWeiduList',

	getInitialState: function(){
		return{
			open:false,
			compareData:this.props.compareData,
			name:this.props.selectedCompare.dimensionName
		}

	},

	componentWillMount: function() {

	},

	componentDidMount: function() {


	},

	componentWillReceiveProps:function(nextProps) {
		this.setState({
 			compareData:nextProps.compareData,
 			name:nextProps.selectedCompare.dimensionName
 		})
	},

	render: function() {
		var bgstyle={
            backgroundColor:'#546e7a',
        }
		return (
			<div className='compare-weiduList'>
				<div className='compare-text' onClick={(evt)=>this._handleCompare(evt)}>{this.state.name} <FontIcon className="iconfont icon-icarrowdropdown24px iconBut" /></div>
				<Popover
		            className="compare-popover"
		            open={this.state.open}
		            style={bgstyle}
		            anchorEl={this.state.anchorEl}
		            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
         			targetOrigin={{horizontal: 'left', vertical: 'top'}}
		            onRequestClose={this._close}>
		        	{this.state.compareData.map((item,key)=>this._setCompareList(item,key))}
	    	    </Popover>
			</div>
		)
	},

	_handleCompare:function(evt){
		this.setState({
			open:true,
			anchorEl: evt.currentTarget,
		})
	},
	_close:function(){
		this.setState({
			open:false
		})
	},
	_setCompareList:function(item,key){
    var disabled = false, listItem ='listItem'
		 if(item.disableds){
		 		disabled = item.disableds;
		 		listItem = 'listItem disabledlistItem';
		 		var style={
       				color: '#fff !important'
		 		}

		 }
		return <MenuItem key={key} style={style} disabled={disabled} className={listItem}   primaryText={item.dimensionName} onClick={(evt)=>this._clickWeiList(evt,item,key,disabled)}/>
	},
	_clickWeiList:function(evt,item,key,disabled){
		if(disabled){return;}
		if(this.props.selectedCompare.dimensionName === item.dimensionName){
			this.setState({
				open:false,
			});
			return;
		}
	    this.props.clickWeiList(item,'clickCompare');
		this.setState({
			open:false,
			name:item.dimensionName,
		});
	}
});
