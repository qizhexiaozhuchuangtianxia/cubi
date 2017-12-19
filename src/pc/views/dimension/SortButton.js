var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var {
    MenuItem,
    DropDownMenu
} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {
			openState:false,
			value:'1'
		}
	},
	componentDidMount:function(){
	},
	render: function() {
		return (
			<DropDownMenu 
				className='iconfont icon-icpaixu24px sortBox'
				value={this.state.value}
				onClick={(evt)=>this._touchTapHandle(evt)}>
					<div className="iconMenuBox">
						<MenuItem 
							onClick={()=>this._onchangeHandle('createTime','DESC','1')} 
							value='1'
							className="sortListStyle" 
							primaryText="创建时间：从新到旧"/>
					    <MenuItem 
					    	onClick={()=>this._onchangeHandle('createTime','ASC','2')} 
					    	value='2'
					    	className="sortListStyle" 
					    	primaryText="创建时间：从旧到新"/>
					    <MenuItem 
					    	onClick={()=>this._onchangeHandle('pinyin','ASC','3')} 
					    	value='3'
					    	className="sortListStyle"
					    	primaryText="名称：从A到Z"/>
					    <MenuItem 
					    	onClick={()=>this._onchangeHandle('pinyin','DESC','4')} 
					    	value='4'
					    	className="sortListStyle"
					    	primaryText="名称：从Z到A"/>
					    <MenuItem 
					    	onClick={()=>this._onchangeHandle('updateTime','DESC','5')} 
					    	value='5'
					    	className="sortListStyle" 
					    	primaryText="编辑时间：从新到旧"/>
					    <MenuItem 
					    	onClick={()=>this._onchangeHandle('updateTime','ASC','6')} 
					    	value='6'
					    	className="sortListStyle" 
					    	primaryText="编辑时间：从旧到新"/>
					    {/*<MenuItem 
					    	className="sortListStyle" 
					    	value='7' 
					    	primaryText="数据更新时间：从新到旧"/>
					    <MenuItem 
					    	className="sortListStyle" 
					    	value='8' 
					    	primaryText="数据更新时间：从旧到新"/>*/}
				    </div>
			</DropDownMenu>
		)
	},
	_touchTapHandle:function(evt){
		$('.iconMenuBox').parent().parent().parent().addClass("sortListBox");
	},
	_onchangeHandle:function(sortName,sortMothed,value){
		/*this.setState({
			value:value
		})*/
		if(this.isMounted()){
			App.emit('APP-REPORT-SORT-REFRESH-LIST-HANDLE',{field:sortName,method:sortMothed})
		}
	}
});
