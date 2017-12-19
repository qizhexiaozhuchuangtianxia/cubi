var $ = require('jquery');
var React = require('react');
var App = require('app');
var DialogDetailsList = require('./DialogDetailsList')
var {

	ListItem,
	FontIcon

} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {

		}
	},
	componentWillMount: function() {
    this._scrollBrar();

	},
	componentDidMount:function(){
    	this._scrollBrar();
	},

	render: function() {

		var list=this.props.listDatas;
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

      if(item.directory==true){
	        return <ListItem
			            key={key}
			            value={item.id}
	                leftIcon={<FontIcon className="iconfont icon-icwenjianjia24px"/>}
	                rightIcon={<FontIcon className="iconfont icon-icchevronright24px"/>}
	                title={item.name}
	                primaryText={item.name}
	                secondaryText={item.description}
	                onTouchTap={(evt)=>this._handleFolderClick(evt,item)} />;
	      }else{
	        return <ListItem
			            key={key}
			            value={item.id}
			            type="1"
	                leftAvatar={<i className="iconfont icon-icshujulifang24px listIconClassName"/>}
	                title={item.name}
	                primaryText={item.name}
	                secondaryText={item.description}
	                onTouchTap={(evt)=>this._handleClick(evt,item)} />
	      }


	},
	_handleFolderClick:function(evt,item){
			evt.stopPropagation();
			App.emit('APP-DIALOG-CONT-LIST',{
					'id':item.id,
					'titleHeader':item.name,
					'body':'DialogFilterList'
			})
	},
	_handleClick: function(evt,item) {
			evt.stopPropagation();
				App.emit('APP-DIALOG-CONT-LIST',{
					'id':item.id,
					'titleHeader':item.name,
					'body':'DialogDetailsList'
				})


	},
	_setMetaDataScroll:function(){

		$(".content").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});

	},
})
