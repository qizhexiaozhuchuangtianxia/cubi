var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');
var PublicButton = require('../common/PublicButton');

var {
	Checkbox,
	Dialog,
	IconButton,
	List,
	ListItem,
	Divider,
	Toggle
} = require('material-ui');

module.exports = React.createClass({
	app: {},
	displayName: 'REPORT-SHOWHUIZONG',
	getInitialState: function() {

		return {
			reportType: this.props.reportType,
			open: false,
			data: this.props.weiduList,
			formulas: ReportStore.setFormulasList(this.props.reportType, this.props.formulas, this.props.weiduList ),
			formulasNew:ReportStore.setFormulasList(this.props.reportType, this.props.formulas, this.props.weiduList )
		}

	},
	componentDidMount: function() {
		app['APP-REPORT-HUIZONG'] = App.on('APP-REPORT-HUIZONG', this._setStateOpen);
		app['APP-HUIZONG-UPDATASTATE']=App.on('APP-HUIZONG-UPDATASTATE',this._updataState);
		this._scrollBrar();
	},
	componentDidUpdate: function() {
		var _this = this;
		setTimeout(function() {
			_this._scrollBrar();
		}, 100)
	},
	componentWillUnmount: function() {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	componentWillReceiveProps: function(nextProps) {

		this.setState({
			reportType: nextProps.reportType,
			//open:nextProps.open,
			weiduList: nextProps.weiduList,
			formulas: ReportStore.setFormulasList(nextProps.reportType, nextProps.formulas, nextProps.weiduList ),
			formulasNew: ReportStore.setFormulasList(nextProps.reportType, nextProps.formulas, nextProps.weiduList ),

		})
	},
	render: function() {

		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"

				onClick={this._cancelDialog}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="保存"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				onClick={this._submitFormulas}/>

		];
		return (
			<Dialog
	            contentClassName="saveAsDialogBox"
	            titleClassName="saveAsDialogTitleBox"
	            bodyClassName="saveAsDialogBodyBox"
	            actionsContainerClassName="saveAsDialogBottmBox"
	            title='显示汇总'
	            actions={actions}
	            modal={false}
	            open={this.state.open}
	            onRequestClose={this._cancelDialog}>
	            	<div className="show-huizong-panel">
	            		<div className="content">
	            			<div className="title"><span>求和</span><span>请选择需要显示合计的维度</span></div>

	            			<List className="list-panel">
						        {this.state.formulas.SUM.map(this._getHeijiItems)}

					      	</List>
	            				<Divider className="divIderLine" />
	            			<div className="title"><span>平均</span><span>请选择需要显示平均的维度</span></div>

					      	<List className="list-panel">
						        {this.state.formulas.AVG.map(this._getPingjunItems)}

					      	</List>
	            				<Divider className="divIderLine"  />
	            			<div className="title"><span>最大值</span><span>请选择需要显示最大值的维度</span></div>

					      	<List className="list-panel">
						        {this.state.formulas.MAX.map(this._getMaxItems)}

					      	</List>
	            				<Divider className="divIderLine"  />
	            			<div className="title"><span>最小值</span><span>请选择需要显示最小值的维度</span></div>

					      	<List className="list-panel">
						        {this.state.formulas.MIN.map(this._getMinItems)}

					      	</List>
	            				<Divider className="divIderLine"  />
	            			<div className="title"><span>计数</span><span>请选择需要显示计数的维度</span></div>

					      	<List className="list-panel">
						        {this.state.formulas.COUNT.map(this._getCountItems)}

					      	</List>

	            		</div>
	            	</div>
	        </Dialog>
		)
	},
	_updataState: function(formulas) {
		this.setState({
			formulas: ReportStore.setFormulasList(formulas.reportType, formulas.formulas, formulas.weiduList )
		})
	},
	_setStateOpen: function(open,formulas) {
		if (!this.isMounted()) return;
		this.setState({
			open: open
		})

	},
	_getHeijiItems: function(item, index) {
		var listName = '';
		if (index == 0) {
			listName = item.name;
		}
		if (item.customName != '' && index != 0) {
			/* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理 */
			if (true == item.crossTable) {
				listName = item.name;
			}
			else {
				listName = item.customName;
			}
		} else {
			listName = item.name;
		}
		return <div  key={index}><ListItem primaryText={listName}
		rightToggle={<Checkbox defaultChecked={item.selected}  onClick={(evt)=>this._charIconToggleHandle(evt,'SUM',item.selected,index)} />} /><Divider  className="hrLine" inset={true} /></div>

	},
	_getPingjunItems: function(item, index) {
		var listName = '';
		if (index == 0) {
			listName = item.name;
		}
		if (item.customName != '' && index != 0) {
			/* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理 */
			if (true == item.crossTable) {
				listName = item.name;
			}
			else {
				listName = item.customName;
			}
		} else {
			listName = item.name;
		}
		return <div  key={index}><ListItem primaryText={listName}
		rightToggle={<Checkbox  defaultChecked={item.selected} onClick={(evt)=>this._charIconToggleHandle(evt,'AVG',item.selected,index)}  />} /><Divider  className="hrLine" inset={true} /></div>
	},
	_getMaxItems: function(item, index) {
		var listName = '';
		if (index == 0) {
			listName = item.name;
		}
		if (item.customName != '' && index != 0) {
			/* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理 */
			if (true == item.crossTable) {
				listName = item.name;
			}
			else {
				listName = item.customName;
			}
		} else {
			listName = item.name;
		}
		return <div  key={index}><ListItem primaryText={listName}
		rightToggle={<Checkbox defaultChecked={item.selected} onClick={(evt)=>this._charIconToggleHandle(evt,'MAX',item.selected,index)} />} /><Divider  className="hrLine" inset={true} /></div>
	},
	_getMinItems: function(item, index) {
		var listName = '';
		if (index == 0) {
			listName = item.name;
		}
		if (item.customName != '' && index != 0) {
			/* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理 */
			if (true == item.crossTable) {
				listName = item.name;
			}
			else {
				listName = item.customName;
			}
		} else {
			listName = item.name;
		}
		return <div  key={index}><ListItem primaryText={listName}
		rightToggle={<Checkbox defaultChecked={item.selected} onClick={(evt)=>this._charIconToggleHandle(evt,'MIN',item.selected,index)} />} /><Divider  className="hrLine" inset={true} /></div>
	},
	_getCountItems: function(item, index) {
		var listName = '';
		if (index == 0) {
			listName = item.name;
		}
		if (item.customName != '' && index != 0) {
			/* XuWenyue： 交叉表显示汇总，“全表纵向”显示特殊处理 */
			if (true == item.crossTable) {
				listName = item.name;
			}
			else {
				listName = item.customName;
			}
		} else {
			listName = item.name;
		}
		return <div  key={index}><ListItem primaryText={listName}
		rightToggle={<Checkbox defaultChecked={item.selected} onClick={(evt)=>this._charIconToggleHandle(evt,'COUNT',item.selected,index)} />} /><Divider  className="hrLine" inset={true} /></div>
	},
	_scrollBrar: function() { //滚动条方法.formulas.SUM
		$(".show-huizong-panel").mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "minimal-dark"
		})
	},
	_charIconToggleHandle: function(e, type, selected, index) {
		var _this = this;
		this.setState(function(prevState) {
			prevState.formulasNew[type][index].selected = !selected;
			return prevState;
		})
		
	},
	_cancelDialog: function() { //弹出层 取消按钮的方法
		App.emit('APP-REPORT-CLOSE-FORMULAS');
		
	},
	_submitFormulas: function() {
		ReportStore.huizong=true;
		App.emit('APP-REPORT-SET-FORMULAS', this.state.formulasNew);
		this._setStateOpen(false);
	},
});
