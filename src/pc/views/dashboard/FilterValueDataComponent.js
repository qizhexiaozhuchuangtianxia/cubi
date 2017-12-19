var React = require('react');
var App = require('app');
module.exports = React.createClass({
	displayName:"筛选值列表的组件",
	getInitialState: function() {
        return {
            tabValue:'selectAll',
            filterValueData:[] || this.props.tabData,
            loadingBool:true,
            selectedArr:[]
        }
    },
    componentDidMount:function(){},
    render:function(){
    	if(this.props.selectValData.length>0){
    		return(
	    		<ul>
	    			{this.props.selectValData.map(this._selectValDomHandle)}
	    		</ul>
			)
    	}else{
    		return(
	    		<div className="nullClassName">暂无筛选值</div>
			)
    	}
    	
    },
    _selectValDomHandle:function(item,index){
        //输出筛选值的dom结构方法
    	var selectedClass=classnames({'':!item.select,'selectedOn':item.select === true});//选择之后的样式
        var selectedHtml=classnames({'选择':!item.select,'已选择':item.select});//选择之后的名字
        return  <li key={index}>
	                <dl>
	                    <dt>{item.name}</dt>
	                    <dd>
	                        <a href="javascript:;" onClick={(evt)=>this._clickSelectValHandle(evt,item)} className={selectedClass}>{selectedHtml}</a>
	                    </dd>
	                </dl>
	            </li>
    },
    _clickSelectValHandle:function(evt,itemObj){//点击列表右侧 选择或者已选择执行的方法
    	evt.stopPropagation();
    	App.emit('APP-DASHBOARD-MODIFY-REPORT-FILTER-VAL-HANDLE',{itemObj:itemObj});
    }
})