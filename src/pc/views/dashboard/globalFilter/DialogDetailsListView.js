var $ = require('jquery');
var React = require('react');
var App = require('app');
var GlobalFilterStore = require('../../../stores/GlobalFilterStore');

var {

	ListItem,
	FontIcon

} = require('material-ui');
module.exports = React.createClass({

	getInitialState: function() {
		return {

		}
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
      open:nextProps.open
    })
	},
	componentWillMount: function() {
    this._scrollBrar();

	},
	componentDidMount:function(){
    	this._scrollBrar();
	},

	render: function() {

		var list=this._setTreeType();
		return (
			<div className="selector-view-body-view">
				<div className="scrollBoxSaveAs">
					<div className="ContentList">{list.map(this._renderListDataResources)}</div>
				</div>
			</div>

		)

	},
	_scrollBrar:function(){//滚动条方法
		$(".scrollBoxSaveAs").height(document.body.clientHeight-170);
		$(".scrollBoxSaveAs").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});
	},
	_renderListDataResources:function(item,key){
		var disabled=true;
		if(this.props.filterType=='DATE_FILTER'){
			if(item.fieldType=="DATE"){
				disabled=false;
			}else {
				disabled=true;
			}
		}else if(this.props.filterType	== 'DOWN_FILTER' || this.props.filterType	== 'SEARCH_FILTER'){
			if(item.fieldType=="DATE"){
				disabled=true;
			}else {
				disabled=false;
			}

		}
			return <ListItem
							key={key}
							value={item.name}
							type="1"
							leftIcon={<FontIcon className="iconfont icon-weiduiconsvg24  listIconClassName"/>}
							title={item.name}
							disabled={disabled}
							primaryText={item.name}
							onTouchTap={(evt)=>this._handleClick(evt,item)} />

	},
	_handleClick: function(evt,item) {
		if(this.props.Weidutitle != item.name){

			item.metadataId=this.props.id;
			//item.filterType=this.props.filterType;
			var dimensionId=item.dimensionId;
			if(!item.dimensionId){
				dimensionId='';
			};
			if(item.dataType=="DATE" && this.props.filterType=='DATE_FILTER'){
				App.emit('APP-FILTER-DATE-UPDATA',{
					'metadataId':this.props.id,
					'fieldName':item.fieldName,
					'dimensionDateid':dimensionId,
					'item':item,
					'disabledDate':true,
					filterName:this.props.filterName,
					filterAliasName:this.props.filterAliasName,
				});
				// App.emit('APP-WEIDU-FILTER-VALUE',{'item':item});

			}else{
				App.emit('APP-DASHBOARD-SET-GLOBAL-FILTER-TYPE',{
					filterType:this.props.filterType,
					//dimensionId:dimensionId,
					//metadataId:this.props.id,
					item:item,
					col: this.props.col,
					row:this.props.row,
					sign:this.props.data.report.sign,
					filterName:this.props.filterName,
					filterAliasName:this.props.filterAliasName,
				});
				App.emit('APP-WEIDU-FILTER-VALUE',{'item':item,'disabledDate':false});
			}
			App.emit('APP-WEIDU-CLOSE-DIALOG');

		}else {
			App.emit('APP-WEIDU-CLOSE-DIALOG');
		}

	},
	_setMetaDataScroll:function(){

		$(".content").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});

	},
	_setTreeType:function(){
		var list=this.props.DataContent.weiduList;
		var sign=false;
		for(var i=0;i<list.length;i++){
			if(list[i].groupType=='GROUP_TITLE_FIELD'){
				sign=true;
				break;
			}
		}
		if(sign){
			for(var i=0;i<list.length;i++){
				if(list[i].dataType=='DATE'){
					list[i].groupType='GROUP_TITLE_FIELD';
				}
			}
		}
		return list;
	}
})
