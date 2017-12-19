import React, {
	Component
} from "react";
import App from 'app';
var $     = require('jquery');
class SearchComponent extends Component {
	constructor(props) {
		super(props);
		this.app={}
		this.state = {
			inputValue:'',
			showSearch:false
		};
	}
	componentDidMount(){
 		//重置搜索的方法
 		this.app['APP-DASHBOARD-RESET-SEARCH-HANDLE'] = App.on('APP-DASHBOARD-RESET-SEARCH-HANDLE',this._resetSearchHandle.bind(this));
	}
	componentWillUnmount() {
        for(let i in this.app){
            this.app[i].remove();
        }
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
	_resetSearchHandle(obj){
		let _this = this;
		if(this.props.row==obj.row&&this.props.col==obj.col&&this.props.dimensionId==obj.dimensionId){
			this.setState({
				inputValue:'',
				showSearch:false
			},function(){
				App.emit('APP-DASHBOARD-SEARCH-DATA-HANDLE',{
					row:_this.props.row,
					col:_this.props.col,
					dimensionId:_this.props.dimensionId,
					inputValue:_this.state.inputValue
				})
			})
		}
	}
	_onKeyUpHandle(event){//输入搜索值的方法
		let _this = this;
		let inputValue = $.trim(event.target.value);
    	this.setState({
			inputValue:inputValue
		},function(){
			if(this.timer){
	            clearTimeout(this.timer);
	        }
			this.timer = setTimeout(function(){
				_this._searchValueHandle();
			},200);
		});
        
		
	}
	_searchValueHandle(){//输入了筛选值执行筛选的方法
		App.emit('APP-DASHBOARD-SEARCH-DATA-HANDLE',{
			row:this.props.row,
			col:this.props.col,
			dimensionId:this.props.dimensionId,
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