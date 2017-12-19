import React, {
	Component
} from "react";
import App from 'app';
var $     = require('jquery');
class SearchComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue:'',
			showSearch:false
		};
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			inputValue:'',
			showSearch:false
		})
	}
	render(){
		let showSearchClass = this.state.showSearch?"treeFilterSearchBox treeFilterSearchBox-show":'treeFilterSearchBox';
		return (
			<div className={showSearchClass}>
				<i className="iconfont icon-icsousuo24px" onClick={(evt)=>this._showSearchBoxHandle(evt)}></i>
				<div className="showSearchInput">
					<input type="text" value={this.state.inputValue} onChange={(evt)=>this._onKeyUpHandle(evt)} placeholder="搜索维度值" />
					<span className="iconfont icon-icquxiao24px" onClick={(evt)=>this._showSearchBoxHandle(evt)}></span>
				</div>
            </div>
		)
	}
	_onKeyUpHandle(event){//输入搜索值的方法
		var _this = this;
		var inputValue = $.trim(event.target.value);
		this.setState({
			inputValue:inputValue
		},function(){
			_this._searchValueHandle();
		})
	}
	_searchValueHandle(){//输入了筛选值执行筛选的方法
		App.emit('APP-REPORT-SEARCH-DATA-HANDLE',{
			row:this.props.row,
			col:this.props.col,
			inputValue:this.state.inputValue
		})
	}
	_showSearchBoxHandle(evt){//是否打开搜索框
		evt.stopPropagation();
		this.setState({
			showSearch:!this.state.showSearch
		})
	}
}
export default SearchComponent;