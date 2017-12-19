var $ = require('jquery');
var React = require('react');
var App = require('app');
var CompareStore = require('../../stores/CompareStore');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
import FilterDialogComponent from '../dashboard/filter/FilterDialogComponent';
import TreeFilterDialogComponent from '../dashboard/filter/TreeFilterDialogComponent';
var {
	Dialog
	} = require('material-ui');

module.exports = React.createClass({
	displayName: 'CompareDilog',
	getInitialState: function() {
		//CompareStore.filterFields=this.props.slectedSences.filterFields;

		return {
			selectedCompare:this.props.selectedCompare,
			initFilter:this.props.initFilter,
			filterFields:this.props.isAdd ? [] : this.props.slectedSences.filterFields||[],
			sameName:false,
			open:this.props.open,
			filterDialogOpen:false,
  			slectedSences:this.props.slectedSences,
			errorTextState:'',
			noFilterFields:false,
			disabledState:this.props.isAdd ? true : false,
		}
	},
	componentWillReceiveProps:function(nextProps){

		this.setState({
			open:nextProps.open,
			selectedCompare:nextProps.selectedCompare,
			filterFields:nextProps.isAdd ? [] : nextProps.slectedSences.filterFields||[],
			slectedSences:nextProps.slectedSences,
		})
	},
	componentDidMount: function() {
		App.on('APP-DASHBOARD-REPORT-MODIFY-FILTER-FIELDS',this._setFilterFields);
		App.on('APP-DASHBOARD-REPORT-CLOSE-FILTER-DIALOG',this._closeFilterFields);
	},
	render: function() {


		var flabelStyle ={
  			fontSize:"14px !important",
  			color:"rgba(255,255,255,0.54)"
  		}
  		var floatingLabelStyle ={
	  			fontSize:"12px",
	  			color:"rgba(0,229,255,255)"
  			}
		var actions = [

			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				onClick={(evt)=>this._cancleHandle(evt)}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="添加"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				disabled={this.state.disabledState}
				onClick={(evt)=>this._clickAddHandle(evt)}/>

  		];
  		var defaultValue='';
  		if(!this.props.isAdd){
  			defaultValue=this.state.slectedSences.sceneName;
  		}

		return (
			<Dialog
				title="添加场景"
				actions={actions}
				modal={false}
				contentClassName="comparedialogAddClassName"
				bodyClassName="comparedialogAddClassNameBody"
				titleClassName="comparedialogAddClassNameTitle"
				actionsContainerClassName="comparedialogAddClassNameBottom"
				onRequestClose={this._closeCompareDilog}
				open={this.state.open}>
				<PublicTextField
					style={{width:'100%',color:'255,255,255,255'}}
					floatingLabelText="名称"
					defaultValue={defaultValue}
					errorText={this.state.errorTextState}
					onChange={(evt)=>this._getInputVal(evt)}/>
		        {this._renderNoFilter()}
		        {this._renderFilter()}
	        	<PublicButton
								style={{color:"rgba(254,255,255,0.87)"}}
								labelText="筛选"
								rippleColor="rgba(0,229,255,0.25)"
								hoverColor="rgba(7,151,239,239)"
								backgroundColor="rgba(0,145,234,234)"
								onClick={(evt)=>this._clickFilterBtn(evt)}/>

		        <div className="delButton" style={{'display':this.props.isAdd ? 'none' : 'block'}}>
		        	<span className="sceneDialog"   onClick={(evt)=>this._delScene(evt)}>删除场景</span>
		        </div>
	        </Dialog>
		)
	},

	_renderFilter:function(){
		if(this.props.isNoCompare){return null;}
		var weiItem=this.state.selectedCompare.weiItem||{};
		//var getFilter=CompareStore.getFilter(this.state.selectedCompare,this.props.isAdd);
		weiItem.popData=this.state.filterFields.length>0 ? this.state.filterFields[0].value : [] ;
		if(weiItem.groupType==""){
			weiItem.popData=this.state.filterFields.length>0 ? this.state.filterFields[0].items : [] ;
		}
		if(weiItem.groupType=="GROUP_DATE_TITLE_FIELD"){
			weiItem.valueType = 'DATE_RANGE';
			if(weiItem.popData.length==1){
				weiItem.valueType = weiItem.popData[0];
			}
		}
		if(weiItem.groupType=="GROUP_TITLE_FIELD"){
			return <TreeFilterDialogComponent
	                dimensionId={weiItem.dimensionId}
	                metadataId={weiItem.metadataId}
	                open={this.state.filterDialogOpen}
	                groupLevels={weiItem.groupLevels}
	                item={weiItem}
	                reportInfo={{filterFields:[]}}
	                reprot={true}/>
		}else{
			return <FilterDialogComponent
					metadataId={weiItem.metadataId}
					item={weiItem}
					reportInfo={{
						filterFields:[],
						metadataId:weiItem.metadataId
					}}
					open={this.state.filterDialogOpen}
					reprot={true}/>;

		}

	},
	_cancleHandle:function(evt){
		this.setState({
			sameName:false

		});
		this.props.setCompareDilogOpen(false);
	},

	_clickAddHandle:function(){
		if(this.state.errorTextState!=''){return;}
		var name= $('.textField').find('input').val(),
			name=$.trim(name),
		selectedCompare=this.state.selectedCompare;
		if(name==''){
			return;
		}
		if(this.state.filterFields.length==0){
			this.setState({
				noFilterFields:true
			});
			return;
		}
		this.setState({
			sameName:false,
			noFilterFields:false
		});
		//添加
		if(this.props.isAdd){
			selectedCompare=CompareStore.addScenes(name,this.state.filterFields,selectedCompare,this.props.zhiBiaoList);
		//编辑
		}else{
			selectedCompare=CompareStore.editScenes(name,this.state.filterFields,this.state.slectedSences,selectedCompare,this.props.zhiBiaoList);
		}
		this.props.addScenes(selectedCompare,this.props.isAdd);
		this.props.setCompareDilogOpen(false);
	},

	_getInputVal:function(evt){
		evt.stopPropagation();
		var thisVal = $(evt.target).val();
		var errorText = '名称已存在!';
		if(CompareStore.checkName(thisVal,this.state.selectedCompare,this.state.slectedSences,this.props.isAdd)){
			this.setState({
				errorTextState:errorText
			});
			return;
		}else{
			var disabledState=true;
			if (thisVal !== undefined && thisVal !== null && thisVal !== "") {
					disabledState=false;
					this.setState({
						errorTextState:'',
						disabledState:disabledState,

					});
			}else{
				this.setState({
					errorTextState:'名字不能为空',
					disabledState:disabledState,

				});
			}

		}
	},
	_clickFilterBtn:function(evt){
		this.setState({
			filterDialogOpen:true
		})

	},
	_setCompareDilogOpen:function(){

	},
	_renderNoFilter:function(){
		if(this.state.noFilterFields){
			return <div style={{'color':'#f5344b','fontSize':'12px'}}>请选择筛选条件</div>
		}
		return null;
	},
	_setFilterFields:function(arg){
		if (!this.isMounted()) return;
		var groupType='';
		if(this.state.selectedCompare.weiItem){
			groupType=this.state.selectedCompare.weiItem.groupType;
		}
		var filterFields=CompareStore.setFilterFields(arg,groupType)
		this.setState({
			filterFields:filterFields,
			filterDialogOpen:false,
			noFilterFields:filterFields.length>0 ? false :true
		})
	},
	_closeCompareDilog:function(){
		if (!this.isMounted()) return;
		this.setState({
			filterDialogOpen:false,
			noFilterFields:false,
			errorTextState:'',
			disabledState:true
		});
		this.props.setCompareDilogOpen(false);
	},
	_closeFilterFields:function(){
		if (!this.isMounted()) return;
		this.setState({
			filterDialogOpen:false,
		})
	},
	_delScene:function(evt){
		if (!this.isMounted()) return;
		this.setState({
			filterDialogOpen:false,
		});
		this.props.setCompareDilogOpen(false);

	 	this.props.delScene(this.state.selectedCompare.scenes.length)
	}
});
