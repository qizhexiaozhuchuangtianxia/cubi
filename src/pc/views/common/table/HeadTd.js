var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ZhibiaoHeadFilterList = require('../ZhibiaoHeadFilterList');

var {
	IconButton,
	FontIcon
} = require('material-ui');

module.exports = React.createClass({
	displayName: 'TABLE-HEADTD',
	getInitialState: function() {
		return {
			item:this.props.item,
			index:this.props.index,
			row:this.props.row,
			customName:'',
			statRows:this.props.statRows?this.props.statRows:[],
			openPopover:false,
			anchorEl:null,
			clienX:0,
			clienY:0,
			tdIndexWid:'auto',
			display:'none'
		}
	},
	componentWillMount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	app: {},
	componentDidMount: function() {

	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			item:nextProps.item,
			index:nextProps.index,
			statRows:nextProps.statRows?nextProps.statRows:[],
			openPopover:nextProps.openPopover
		})
	},

	render: function() {
		var name = (this.state.item.customName &&this.state.item.customName!='' ) ? this.state.item.customName:this.state.item.name;
		var customNameClass = this.state.isShow?'customname-button show':'customname-button';
		if(this.state.statRows.length>0){
			var statRows = this.state.statRows;
		}else{
			var statRows = [];
		}
		var iconButtonItem=<IconButton
						className='customname-button'
						iconClassName="icon iconfont icon-icbianji24px customname-icon"
						onTouchTap={(evt)=>this._setCustomName(evt,this.state.item,this.state.index)}/>;
		var tooltip = null;
		var addstyle = {};
		//树形维度表和驾驶舱没有编辑
		if(this.props.dimesion || this.props.isDashboardTable){
			iconButtonItem=null;
				addstyle = {
	 				padding:'0 12px 0 12px'
	 			}
		}
		if(this.state.item.dmType!='dimension'&&statRows.length>0){
			var tooltipPanelStyle = {
				'position':'fixed',
				'left':this.state.clienX+20,
				'top':this.state.clienY+20,
				'display':this.state.display,
				'zIndex':9999
			};
			var stat = [];
			for(let i in statRows[0]){
				stat = statRows[0][i].cells;
			}
			// if(this.state.index>stat[0].colspan+stat.length-3){
			// 	tooltipPanelStyle = {right:-24};
			// }
			tooltip = (
				<div className="tooltipPanel" style={tooltipPanelStyle}>
					<div className="tooltipList">
						<div className="zhibiaoPanel">
							<label>指标：</label><b>{name}</b>
						</div>
						{statRows.map(this._getStatRows)}
					</div>
				</div>
			)
		}
		//驾驶舱自定义列宽
		var tdClassName=this._getCellClassName();
		if(this.props.pathname=="/report/list" || this.props.dimesion || this.props.listRightNoSort || this.state.item.expression){
				return (
					<td className={tdClassName}>
						<div className="theadDiv">
							{tooltip}
							{this._sortItme(this.state.index)}
							<span className="toptitle" title={this.state.name} onMouseMove={(evt)=>this._mouseMove(evt)} onMouseOut={(evt,key)=>this._mouseOut(evt,key)}>
								{name}
							</span>
							{iconButtonItem}
						</div>
					</td>
				)
		}else{
			tdClassName+= ' toptitle-cursor';
			var signText;
			if(this.props.topParameters ){
				var method = 'Bottom';
				if(this.state.item.name == this.props.topParameters[0].field || this.state.item.customName == this.props.topParameters[0].field){
					if(this.props.topParameters[0].method == 'DESC'){
						method ='Top'
					}
					signText = method + this.props.topParameters[0].topn;
				}

			}
			if(this.props.zhibiaoMinMax && this.props.zhibiaoMinMax.length>0){
				if(this.state.item.name == this.props.zhibiaoMinMax[0].name || this.state.item.customName== this.props.zhibiaoMinMax[0].name){
					signText = 'Range';
				}
			}
			var hideFilter=false;
			if(this.state.item.dmType){
				if(this.state.item.dmType !== "measure" ){
					hideFilter=true;
					signIcon=''
				}
			}else{
				if(this.state.item.dataType !== "DOUBLE"){
					hideFilter=true;
					signIcon=''
				}
			}
			var zhibiaofilterList = <ZhibiaoHeadFilterList
			item={this.state.item}
			open={this.state.openPopover}
			anchorEl={this.state.anchorEl}
			hideFilter={hideFilter}
			sortName={this.props.sortName}
			index={this.state.index}
			initPopover={this._initOpenClose}
			setSortParams={this.props.setSortParams}
			setZhibiaoState={this.props.setZhibiaoState}
			setzhibiaoTop={this.props.setzhibiaoTop}
			topParameters={this.props.topParameters}
			zhibiaoMinMax={this.props.zhibiaoMinMax}
			row={this.props.row}
			col={this.props.col}
			sortFieldsIndex={this.props.sortFieldsIndex}
			compare={this.props.compare}
			zhiBiaoindexFields={this.props.zhiBiaoindexFields}
			selectedScenesName={this.props.selectedScenesName}
			sortParameters={this.props.sortParameters}/>

			var signIcon = <div className='signIconHide'></div>;
			if(signText){
					signIcon = 	<div className='signIcon'>{signText}</div>;
			}

			return (
				<td className={tdClassName}  onClick={(evt)=>this._showList(evt)} >
					<div className="theadDiv" >
						{tooltip}
						{this._sortItme(this.state.index)}
						<span className="toptitle " title={this.state.name} onMouseMove={(evt)=>this._mouseMove(evt)} onMouseOut={(evt,key)=>this._mouseOut(evt,key)} >
							{name}
						</span>
								<span style={addstyle}>{iconButtonItem}</span>
						{signIcon}
					</div>
					{zhibiaofilterList}
				</td>
			)
		}

	},
	_initOpenClose:function(open){
		this.setState({
			openPopover : open
		})
	},
	_getStatRows:function(item,index){
		for(var key in item){
			var list = item[key];
		}
		var rowIndex = this.state.index-list.cells[0].colspan+1;
		return (
			<div className="huizongPanel" key={index}>
				<label>{list.cells[0].formatValue}：</label><b>{list.cells[rowIndex].formatValue}</b>
			</div>
		)
	},
	_setCustomName:function(e,item,index){
		// var itemCutName = item.name;
		// var sub = itemCutName.split(':')[1];

		App.emit('APP-TABLE-SET-CUSTOMNAME',$(e.currentTarget).parent()[0],index,item)
	},
	_getCellClassName:function() {
		var config=this.props.tableConfig;
		var name;
		if(this.state.item.dmType == "dimension"){

			if(!this.state.item.groupName){
				name=this.state.item.name;
			}else{
				name=this.state.item.groupName;
			}
		}else{
			name=this.state.item.name;
		}
		var className="tree_column_header_td kuansongClass ";
		if (config == null) return "tree_column_header_td";
		for(var i=0;i<config.length;i++){
			if(config[i].name==name){

				if (config[i].defaultValue == 0.5) {
					className='tree_column_header_td shizhongClass';
				}else if (0 == config[i].defaultValue) { // XuWenyue： 驾驶舱隐藏列，指标列由前端隐藏，隐藏标题
					className = 'tree_column_header_td hiddenColClass';
				}
			}

		}
		return className;
	},
	_sortItme:function(index){
		//分析右侧滑出表格无排序
			var item=this.state.item;
		if(this.props.pathname=="/report/list" || this.props.dimesion || this.props.listRightNoSort || item.expression){
			return null;
		};
		var iconClassName="icon iconfont topIcon";
		var spanClassName="theadLeftIcon";
		var sortName=  item.groupName || item.name;
		if(this.props.sortFieldsIndex == index){
			if(item.sortMethod=="ASC" ){
				iconClassName+=" icon-icpaixuxiangshang18px";
			}else if(item.sortMethod=="DESC"){
				iconClassName+=" icon-icpaixuxiangxia18px";
			}else{
				iconClassName+="";
			}
		}

		if(this.props.sortName==item.name || item.name){
			spanClassName+=" showTheadLeftIcon";
		}
		var sortIconItem=<span className={spanClassName}>
				<FontIcon className={iconClassName} />
			</span>

		return sortIconItem;
	},

	_showList:function(evt){
		if (!this.isMounted()) return;
		if(evt.target.className.indexOf('customname-icon')!=-1){
			return;
		}
		if(evt.target.className=='signIcon'){
			return;
		}
		evt.stopPropagation();
		this.setState({
			openPopover:!this.state.openPopover,
			anchorEl:evt.currentTarget
		})
	},
	_mouseMove:function(evt){
		this.setState({
			clienX:evt.clientX,
			clienY:evt.clientY,
			display:'block'
		})
	},
	_mouseOut:function(evt){
		this.setState({
			display:'none',
		})
	}

})
