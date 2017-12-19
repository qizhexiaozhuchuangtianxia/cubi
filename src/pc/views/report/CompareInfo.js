var $ = require('jquery');
var React = require('react');
var App = require('app');
var {
	Toggle
} = require('material-ui');

var CompareStore = require('../../stores/CompareStore');
var CompareTooltip = require('./CompareTooltip');

module.exports = React.createClass({
	displayName: 'CompareInfo',
	getInitialState: function() {
		var copareInfoData=[],
			slectedSences=[];
		if(this.props.selectedCompare.type!="nocompare"){
			copareInfoData=CompareStore.setCopareInfoData(this.props.selectedCompare.scenes,this.props.selectedCompare.weiItem.groupType);
			slectedSences=CompareStore.getSlectedSences(this.props.selectedCompare.scenes);
		}
			
		return {
			selectedCompare:this.props.selectedCompare,
			copareInfoData:copareInfoData,
			slectedSences:slectedSences,
			showCompareIcon: false,
			showTooltip:false,
        	param:{},
		 	left:null,
			ellipsis:false

		}
	},
	componentWillMount: function() {

	},
	componentWillReceiveProps:function(nextProps){
		var copareInfoData=[],
			slectedSences=[];
		if(nextProps.selectedCompare.type!="nocompare"){
			copareInfoData=CompareStore.setCopareInfoData(nextProps.selectedCompare.scenes,nextProps.selectedCompare.weiItem.groupType);
			slectedSences=CompareStore.getSlectedSences(nextProps.selectedCompare.scenes);
		}
		
		this.setState({
			selectedCompare:nextProps.selectedCompare,
			copareInfoData:copareInfoData,
			slectedSences:slectedSences,

		},function(){
			this._setCanShow();
		})
	},
	app:{},

	componentDidMount: function() {
		this._setCanShow();
		var _this = this;
			window.onresize = function () {
			_this._setCanShow();

		}
	},
	render: function() {
		if(this.state.selectedCompare.scenes.length>0){
			if(this.state.selectedCompare.scenes[0].selected){
				return null;
			}
		}
		if(this.state.selectedCompare.scenes.length<=1){
			return null;
		}
		var thumbStyles={
     	   backgroundColor:"rgb(0, 188, 212)"
    	}

	    if(!this.state.showCompareIcon){
	        thumbStyles={
	            backgroundColor:"#dbdbdb"
	        }
	    }

	    var editStyle={
	   		display:'black'
	   	}
	   	// console.log(this.state.param,'00this.state.ellipsis')
	    if(this.state.ellipsis && this.state.copareInfoData.length>0){
	   	  editStyle={
	   		display:'block'
	       	}
	    }
	    var copareInfoData=this.state.copareInfoData.map(this.renderItem)
	    if(this.state.copareInfoData.length==0){
	    	copareInfoData=<span>筛选值为空</span>
	    }

		return (
	        <div className='compare-con'>
	        	<div className='compare-info'>
		        	<div className='compare-info-list'>
		        		<span  className='compare-info-cont' onMouseOut={(evt,key)=>this._mouseOut(evt,key)} onMouseMove={(evt,key)=>this._mouseOver(evt,key)} >
		        			<span className='details-text-clone' style={{'position':'absolute','zIndex':'-10','height':'10px','overflow':'hidden'}}>{copareInfoData}</span>
		        			<span className='details-text'>{copareInfoData}</span>
		        			<span style={editStyle} className='compare-info-edit' onClick={this._editScene}>修改</span>
		        		</span>
						  
		        	</div>
		        	<div className='compare-info-toggle'>
		        		<div className='compare-info-text'>在对比中显示</div>
		        		<div className='compare-info-btn'>
									<Toggle
		        						thumbStyle={thumbStyles}
										iconStyle ={{width:'38px'}}
										toggled={this.state.slectedSences.displayInCompare}
										onToggle={this._onToggle}
		        			 		    defaultToggled={this.state.showCompareIcon}/>
		        		</div>
		        	</div>
	        		
	        	</div>
	        	<CompareTooltip 
					showTooltip={this.state.showTooltip}
					copareInfoData={this.state.copareInfoData} 
					param={this.state.param}
					copareInfoData={this.state.copareInfoData}/>
	        </div>
		)
	},
	renderItem:function(item,key){

		return <span key={key} className="compare-info-name">{item}&nbsp;</span>
	},
	_onToggle:function(){
		var selectedCompare=CompareStore.setOnToggle(this.state.selectedCompare,this.state.slectedSences);
		this.props.clickWeiList(selectedCompare,'toggle');
	},
	_mouseOver:function(e){
		var clienX = e.clientX;
		var clienY = e.clientY;
		var eleWidth = document.body.clientWidth/2;
		var obj = {
			clienX:clienX,
			clienY:clienY,
			eleWidth:eleWidth,
	        eleHeight:'auto',
	        elePixel:55,// padding
      		locationWidth:document.body.clientWidth
		}
		if(this.state.ellipsis){
			this.setState({
        		showTooltip:this.state.ellipsis,
            	param:obj
       		})
		App.emit('APP-SET-COMPARETOOLTIP',{obj})

		}
	},
	_mouseOut:function(){

		if(this.state.ellipsis){
			this.setState({
        		showTooltip: !this.state.ellipsis,
            	param:{}
       		})
		}
	},
	_setCanShow:function(step){
		var _this = this
		var eleWidth = $(ReactDOM.findDOMNode(this)).find('.details-text-clone').width();
    	var eleParentwidth = $(ReactDOM.findDOMNode(this)).find('.compare-info-list').width();
        if(eleWidth+60>eleParentwidth) {
          
           this.setState({
           		ellipsis:true
           },function(){
	           	$(ReactDOM.findDOMNode(this)).find('.details-text').css({
	           		'width':eleParentwidth-60
	           });
           })
           
        }else{
        	this.setState({
           		ellipsis:false
           },function(){
	        	$(ReactDOM.findDOMNode(this)).find('.details-text').css({
	           		'width':eleWidth+10
	           });
	        });
        }
        

	},
	_editScene:function(){
		this.props.setCompareDilogOpen(true,false)
	}
});
