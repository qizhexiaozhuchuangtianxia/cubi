var React = require('react');
var App = require('app');
var AddComponent = require('./AddComponent');
var {
	Checkbox,
	} = require('material-ui');
module.exports = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentDidMount: function() {
	},
	_listHandleComponent : function(item,index){//单选按钮
		var iconClassName,typeClassName;
		if(item.typeName === '文件夹'){
			iconClassName = 'list_dir_icon';
			typeClassName = '文件夹'
		}else if(item.typeName === '文件'){
			iconClassName = 'list_'+item.reportTypes[0]+'_icon';
			typeClassName = '驾驶舱'
		}
		return	<li key={index}>
			<table>
				<tbody>
				<tr>
					<td>
						<dl><Checkbox defaultChecked={item.listCheckBoxBool} onCheck={(evt)=>this._checkBoxHandle(evt,index)} style={this.props.styles.defaultClass} iconStyle={this.props.styles.iconClass} />
							<dd className={iconClassName}></dd>
						</dl>
					</td>
					<td>
						<a href="javascript:;" onClick={()=>this.props.onHandleTap(item.listType,item.id)}>
							<table>
								<tbody>
								<tr>
									<td>{item.name}</td>
									<td>{typeClassName}</td>
									<td>{item.listModifyTime}</td>
								</tr>
								</tbody>
							</table>
						</a>
					</td>
				</tr>
				</tbody>
			</table>
		</li>
	},
	_checkBoxHandle:function(evt,index){//单个的复选框是否选中
		var _this=this;
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-CHECK-BOX-BOOLE-HANDLE',{
            Dataindex:index
        });
	},
	_checkAllBoxHandle : function(){//全选按钮
		return <dl>
					<Checkbox defaultChecked={this.props.allCheckBoxBool} onCheck={(evt)=>this._onCheckHandle(evt)} style={this.props.styles.defaultClass} iconStyle={this.props.styles.iconClass} />
				</dl>;
	},
	_onCheckHandle : function(evt){//设置全选选项是否选中
		evt.stopPropagation();
		App.emit('APP-DASHBOARD-CHECK-BOX-ALL-BOOLE-HANDLE',{
            allCheckBool:!this.props.allCheckBoxBool
        });
		this.setState(function(previousState,currentProps){
			previousState.allCheckBoxBool = !previousState.allCheckBoxBool;
			return {previousState};
		})
	},
	render: function() {
		return (
			<div className="listComponentBox">
				<AddComponent />
				<div className="listComponentBoxTop">
					<table>
						<thead>
						<tr>
							<td>
								{this._checkAllBoxHandle()}
							</td>
							<td>
								<table>
									<tbody>
									<tr>
										<td>名称</td>
										<td>类型</td>
										<td>最后修改时间</td>
									</tr>
									</tbody>
								</table>
							</td>
						</tr>
						</thead>
					</table>
				</div>
				<div className="listComponentBoxDown">
					<ul>
						{this.props.datas.map(this._listHandleComponent)}
					</ul>
				</div>
			</div>
		)
	}
});