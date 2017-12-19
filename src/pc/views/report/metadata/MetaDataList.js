var $ = require('jquery');
var React = require('react');

var {

	ListItem,
	FontIcon

} = require('material-ui');
module.exports = React.createClass({

	displayName: 'MetaDataList',

	propTypes: {
		onSelected: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			onSelected: null,
		}
	},

	getInitialState: function() {
		return {

		}
	},
	componentWillMount: function() {

	},
	componentDidMount:function(){
		this._setMetaDataScroll();

	},

	render: function() {

		var list=this.props.list;
		return (
			<div className="metadata-selector-view-body-view matadata">
				<div className="content">
					<div className="matadataContentList">{list.map(this._renderMetaDataResources)}</div>
				</div>
			</div>

		)

	},

	_renderMetaDataResources:function(item,key){
		if(item.directory==true){
			return <ListItem
				 	key={key}
					value={item.id}
			        leftIcon={<FontIcon className="iconfont icon-icwenjianjia24px"/>}
	    		    rightIcon={<FontIcon className="iconfont icon-icchevronright24px"/>}
			        title={item.name}
			        primaryText={item.name}
			        secondaryText={item.description}
			        onTouchTap={(evt)=>this._handleClick(evt,item)} />;
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
	_handleClick: function(evt,metadata) {
		if (this.props.onSelected != null) {
			this.props.onSelected(metadata);
		}
	},
	_setMetaDataScroll:function(){

		$(".content").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"minimal-dark"
		});

	},
})
