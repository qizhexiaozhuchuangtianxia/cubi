/**
 **驾驶舱的筛选器-FilterSearch 模块
 **
 */
import {Component} from 'react';
import App from 'app';
import ReportStore from '../../../stores/ReportStore';
class DefaultFilterSearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSearchComponent:false, 
        };
    }
    render() {
        if(this.state.openSearchComponent){
            return  (
                <div className="searchBox searchBoxWidth">
                    <div className="searchInputBox">
                        <i className="iconfont icon-icsousuo24px"></i>
                        <input type="text" ref="searchRef" onChange={(evt)=>this._onKeyUpHandle(evt)} placeholder="搜索维度值" />
                    </div>
                    <span className="iconfont icon-icquxiao24px" onClick={(evt)=>this._closeKeyUpHandle(evt)}></span>
                </div>
            )
        }else{
            return  (
                <div className="searchBox">
                    <a href="javascript:;" onClick={(evt)=>this._openInputBoxHandle(evt)} className="iconfont icon-icsousuo24px"></a>
                </div>
            )
        }
    }
    _onKeyUpHandle(event,keyword){//onKeyUp搜索执行的方法
        var inputValue = $.trim(event.target.value);
        if(this.timer){
            clearTimeout(this.timer);
        }
        var _this=this;
        this.timer = setTimeout(function(){
            App.emit('APP-DASHBOARD-REPORT-SEARCH-DEFAULT-FILTER-VALEU',_this.props.seletedData,1,inputValue);
        },200);
               
    }
    _closeKeyUpHandle(evt){
        evt.stopPropagation();
        var inputValue = '';
        App.emit('APP-DASHBOARD-REPORT-SEARCH-DEFAULT-FILTER-VALEU',this.props.seletedData,1,inputValue);
        this.setState({
            openSearchComponent:false
        })
    }
    _openInputBoxHandle(evt){//点击搜索按钮显示输入框
        evt.stopPropagation();
        this.setState({
            openSearchComponent:!this.state.openSearchComponent
        })
    }
}
export default DefaultFilterSearchComponent;