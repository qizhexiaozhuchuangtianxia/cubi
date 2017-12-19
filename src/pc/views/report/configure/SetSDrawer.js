/**
 * 右侧数据立方
 */
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var DragWeiduList = require('./DragWeiduList');
var DragZhibiaoList = require('./DragZhibiaoList');
var DragHejiList = require('./DragHejiList');
var DragPingjunList = require('./DragPingjunList');
var DragMaxList = require('./DragMaxList');
var DragMinList = require('./DragMinList');
var DragJishuList = require('./DragJishuList');
var WeiduList = require('./WeiduList');
var ZhiBiaoList = require('./ZhibiaoList');
var RowWeiduList = require('./RowWeiduList');
var ColWeiduList = require('./ColWeiduList');
var DragJisuanlieList = require('./DragJisuanlieList');
var DragWeiduJishuList = require('./DragWeiduJishuList');
var ChartTypeStore = require('../../../stores/ChartTypeStore');
var {
	DropDownMenu,
	MenuItem,
	List,
	ListItem,
	IconButton,
	Card,
	CardHeader,
	CardText,
	FlatButton

} = require('material-ui');
module.exports = React.createClass({
	displayName: '报表配置',
	app: {},
	getInitialState: function () {
		var selectValue = 'zhibiao';
		var selectedWeiduValue = 'allweidu';
		var weiduCheckList = ChartTypeStore.getLength(this.props.reportType).weiduLen;;
		var zhiBiaoCheckList = ChartTypeStore.getLength(this.props.reportType).zhibiaoLen;
		var putongShow,hejiShow,maxShow,minShow,jishuShow,pingjunShow,allweidushow,timeweidushow,regionweidushow,allweidushow,timeweidushow,regioweidushow,weiduJishushow,dragIndex,jisuanlieshow,fxSign,fxIndex;
		switch (this.props.reportType) {
            case 'BASE':
                putongShow = false;
				hejiShow = true;
				minShow = true;
				jishuShow = true;
				maxShow = true;
				pingjunShow = true;
				allweidushow = false;
				timeweidushow = false;
				regionweidushow = false;
				jisuanlieshow = false;
				weiduJishushow = true;//维度计数指标在明细表时不可配置
				selectValue = 'zhibiao';
				selectedWeiduValue = 'allweidu';
				dragIndex=-1;
				fxSign:true;
				fxIndex:-1;
                break;
            case 'EchartsMap':
                putongShow = true;
				hejiShow = false;
				minShow = false;
				jishuShow = false;
				maxShow = false;
				pingjunShow = false;
				allweidushow = true;
				timeweidushow = true;
				regionweidushow = false;
				jisuanlieshow = false;
				weiduJishushow = false;
                selectValue = 'heji';
				selectedWeiduValue = 'regionweidu';
				dragIndex=-1;
				fxSign:true;
				fxIndex:-1;
                break;
            default:
                putongShow = true;
				hejiShow = false;
				minShow = false;
				jishuShow = false;
				maxShow = false;
				pingjunShow = false;
				allweidushow = false;
				timeweidushow = false;
				regionweidushow = false;
				jisuanlieshow = false;
				weiduJishushow = false;
				selectValue = 'heji';
				selectedWeiduValue = 'allweidu';
				dragIndex=-1;
				fxSign:true;
				fxIndex:-1;
        }
		if(localStorage.getItem('selectValue')){
			if(this.props.reportType!='BASE')
			// console.log(localStorage.getItem('selectValue'),'localStorage',this.props.reportType,'type----')
		  selectValue = localStorage.getItem('selectValue');
			// localStorage.removeItem('selectValue')
		}
		var props = App.deepClone(this.props);
		return {
			selectedValue: selectValue,
			selectedWeiduValue:selectedWeiduValue,
			dragWeiduList: this.props.dragWeiduList,
			weiduList: this.props.weiduList,
			rowTitleFieldsList: this.props.rowTitleFieldsList,
			columnTitleFieldsList: this.props.columnTitleFieldsList,
			weiduchecklist: weiduCheckList,
			dragZhibiaoList: this.props.dragZhibiaoList,
			zhiBiaoList: ChartTypeStore.checkIndexFields(props.zhiBiaoList,zhiBiaoCheckList,props.weiduList),
			zhiBiaoCheckList:zhiBiaoCheckList,
			dragHejiList: this.props.dragHejiList,
			dragPingjunList: this.props.dragPingjunList,
			dragMaxList: this.props.dragMaxList,
			dragMinList: this.props.dragMinList,
			dragJishuList: this.props.dragJishuList,
			dragJisuanlieList:this.props.dragJisuanlieList,
			dragWeiduJishuList:this.props.dragWeiduJishuList,
			reportType: this.props.reportType,
			tableType: this.props.tableType,
			putongshow: putongShow,
			hejishow: hejiShow,
			minshow: minShow,
			maxshow: maxShow,
			jishushow: jishuShow,
			pingjunshow: pingjunShow,
			allweidushow:allweidushow,
			timeweidushow:timeweidushow,
			regionweidushow:regionweidushow,
			dragIndex:dragIndex,
			jisuanlieshow:jisuanlieshow,
			weiduJishushow:weiduJishushow,
			fxSign:fxSign,
			fxIndex:fxIndex,
			dragWeiSign:false,
			groupSelected:'',
			changeWeiIndex:false,
		};
	},

	componentDidMount: function () {
		this.app['APP-SET-WEIDU-ITEMS'] = App.on('APP-SET-WEIDU-ITEMS', this._setWeiduItems);
		this.app['APP-SET-ROW-WEIDU-ITEMS'] = App.on('APP-SET-ROW-WEIDU-ITEMS', this._setRowWeiduItems);
		this.app['APP-SET-COL-WEIDU-ITEMS'] = App.on('APP-SET-COL-WEIDU-ITEMS', this._setColWeiduItems);
		this.app['APP-SET-DRAG-WEIDU-ITEMS'] = App.on('APP-SET-DRAG-WEIDU-ITEMS', this._setDragWeiduItems);
		this.app['APP-SET-ZHIBIAO-ITEMS'] = App.on('APP-SET-ZHIBIAO-ITEMS', this._setZhibiaoItems);
		this.app['APP-SET-DRAG-ZHIBIAO-ITEMS'] = App.on('APP-SET-DRAG-ZHIBIAO-ITEMS', this._setDragZhibiaoItems);
		this.app['APP-SET-DRAG-HEJI-ITEMS'] = App.on('APP-SET-DRAG-HEJI-ITEMS', this._setDragHejiItems);
		this.app['APP-SET-DRAG-PINGJUN-ITEMS'] = App.on('APP-SET-DRAG-PINGJUN-ITEMS', this._setDragPingjunItems);
		this.app['APP-SET-DRAG-MAX-ITEMS'] = App.on('APP-SET-DRAG-MAX-ITEMS', this._setDragMaxItems);
		this.app['APP-SET-DRAG-MIN-ITEMS'] = App.on('APP-SET-DRAG-MIN-ITEMS', this._setDragMinItems);
		this.app['APP-SET-DRAG-JISHU-ITEMS'] = App.on('APP-SET-DRAG-JISHU-ITEMS', this._setDragJishuItems);
		this.app['APP-SET-DRAG-WEIDUJISHU-ITEMS'] = App.on('APP-SET-DRAG-WEIDUJISHU-ITEMS', this._setDragWeiduJishuItems);
		this.app['APP-SET-STATE-ITEMS'] = App.on('APP-SET-STATE-ITEMS', this._setState);
	},
	componentWillUnmount: function () {
		for (var i in this.app) {
			this.app[i].remove();
		}
	},
	render: function () {
		var cls = "select-scroll " + this.state.selectedValue;
		var whzClassName = this.state.putongshow?'matadata-select-item-default':'matadata-select-item';
		var hjClassName = this.state.hejishow?'matadata-select-item-default':'matadata-select-item';
		var pjClassName = this.state.pingjunshow?'matadata-select-item-default':'matadata-select-item';
		var weiduJishuClassName = this.state.weiduJishushow?'matadata-select-item-default':'matadata-select-item';
		var weiduClassName =  this.state.allweidushow?'matadata-select-item-default':'matadata-select-item';
		var regionClassName =  this.state.regioweidushow?'matadata-select-item-default':'matadata-select-item';
		//fix bug for jiSuanLie YanZheng
		var jiSuanLieDisabled = this._getJuSuanLieDisabled();
		var jisuanlieClassName = jiSuanLieDisabled?'matadata-select-item-default':'matadata-select-item';
		var dragWeiduList = [];
		if(this.state.selectedWeiduValue=='allweidu'){
			dragWeiduList = this.state.dragWeiduList;
		}
		/*if(this.state.selectedWeiduValue=='timeweidu'){
			for(var i=0;i<this.state.dragWeiduList.length;i++){
				if(this.state.dragWeiduList[i].fieldType=='DATE'){
					dragWeiduList.push(this.state.dragWeiduList[i])
				}
			};
		}*/
		if(this.state.selectedWeiduValue=='regionweidu'){
			for(var i=0;i<this.state.dragWeiduList.length;i++){
				if(this.state.dragWeiduList[i].dimensionDataType=='REGION'){
					dragWeiduList.push(this.state.dragWeiduList[i])
				}
			};
		}
		var _hideWD= false;
		if (this.props.reportType =='KPI') {
			_hideWD = true;
		}
		return (
			<div className="set-weidu-panel">
				<div className="setlist">
					<div className="selectLabel">
						可选指标
					</div>
					<div className="zhibiao-select-panel">
						<div className="select">
							<DropDownMenu className="param-select" onChange={this._handleChange} value={this.state.selectedValue} menuStyle={{ background: "#465962!important" }}>
								<MenuItem
									className={whzClassName}
									disabled={this.state.putongshow}
									value={'zhibiao'}
									primaryText="无汇总"/>
								<MenuItem
									className={hjClassName}
									disabled={this.state.hejishow}
									value={'heji'}
									primaryText="求和指标"/>
								<MenuItem
									className={pjClassName}
									disabled={this.state.pingjunshow}
									value={'pingjun'}
									primaryText="平均指标"/>
								<MenuItem
									className={hjClassName}
									disabled={this.state.maxshow}
									value={'max'}
									primaryText="最大值指标"/>
								<MenuItem
									className={hjClassName}
									disabled={this.state.minshow}
									value={'min'}
									primaryText="最小值指标"/>
								<MenuItem
									className={hjClassName}
									disabled={this.state.jishushow}
									value={'jishu'}
									primaryText="计数指标"/>
								<MenuItem
									className={jisuanlieClassName}
									disabled={jiSuanLieDisabled}
									value={'jisuanlie'}
									primaryText="计算列"/>
								<MenuItem
									className={weiduJishuClassName}
									disabled={this.state.weiduJishushow}
									value={'weidujishu'}
									primaryText="维度计数"/>
							</DropDownMenu>
						</div>
						<div className="select-panel zhibiao-panel">
							<div className={cls}>
								<div className="select-items zhibiao">
									<DragZhibiaoList items={this.state.dragZhibiaoList} reportType={this.state.type}/>
								</div>
								<div className="select-items heji">
									<DragHejiList items={this.state.dragHejiList}/>
								</div>
								<div className="select-items pingjun">
									<DragPingjunList items={this.state.dragPingjunList}/>
								</div>
								<div className="select-items max">
									<DragMaxList items={this.state.dragMaxList}/>
								</div>
								<div className="select-items min">
									<DragMinList items={this.state.dragMinList}/>
								</div>
								<div className="select-items jishu">
									<DragJishuList items={this.state.dragJishuList}/>
								</div>
								<div className="select-items jisuanlie">
									<DragJisuanlieList items={this.state.dragJisuanlieList}/>
								</div>
								<div className="select-items weidujishu">
									<DragWeiduJishuList items={this.state.dragWeiduJishuList}/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style={{ clear: "both" }}></div>
				<div className="zhibiaolist">
					<label>已选指标</label>
					<div className="zhibiao-panel panel">
						<ZhiBiaoList
						items={this.state.zhiBiaoList}
						reportType={this.props.reportType}
						check={this.state.zhiBiaoCheckList}
						areaInfo={this.props.areaInfo}
						selectedWeiduList={this.state.weiduList}
						compareData={this.props.compareData}
						reportCategory={this.props.reportCategory}
            compare={this.props.compare}/>
					</div>
				</div>

				<div className="setlist">
					<div className="selectLabel">
						可选维度
					</div>
					<div className="zhibiao-select-panel">
						<div className="select">
							<DropDownMenu className="param-select" disabled ={_hideWD} onChange={this._handleWeiduChange} value={this.state.selectedWeiduValue} menuStyle={{ background: "#465962!important" }}>
								<MenuItem
									 className={weiduClassName}
									 disabled={this.state.allweidushow}
									 value={'allweidu'}
									 primaryText="全部维度"
								 />
								<MenuItem
									className={regionClassName}
									disabled={this.state.regionweidushow}
									value={'regionweidu'}
									primaryText="地域维度"
								/>
							</DropDownMenu>
						</div>
						<div className="select-panel zhibiao-panel">
							<div className="select-scroll">
								<div className="select-items weidu">
									<DragWeiduList items={dragWeiduList} reportType={this.props.reportType}/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style={{ clear: "both" }}></div>
				{this._weiduListPanel() }

			</div>
		)
	},
	_weiduListPanel: function () {

		if (this.state.reportType=='CROSS') {
			return (
				<div className="weidulist">
					<div className="weiduTable">
						<label>行维度</label>
						<div className="weidu-panel panel">
							<RowWeiduList items={this.state.rowTitleFieldsList} check={this.state.weiduchecklist} reportType={this.props.reportType} colItemCount={this.state.columnTitleFieldsList.length}/>
						</div>
					</div>
					<div className="weiduTable">
						<label>列维度</label>
						<div className="weidu-panel panel">
							<ColWeiduList items={this.state.columnTitleFieldsList} check={this.state.weiduchecklist} reportType={this.props.reportType} rowItemCount={this.state.rowTitleFieldsList.length}/>
						</div>
					</div>
				</div>
			)
		} else {
			if (this.state.reportType =='KPI') {
				console.log('SetSDrawer:::::');
			}

			return (
				<div className="weidulist">
					<label>已选维度</label>
					<div className="weidu-panel panel">
						<WeiduList items={this.state.weiduList} check={this.state.weiduchecklist} reportType={this.props.reportType} />
					</div>
				</div>
			)
		}
	},
	_handleChange: function (e, index, v) {
		this.setState(function (previousState, currentProps) {
			return { selectedValue: v };
		});
		localStorage.setItem('selectValue',v);
	},
	_handleWeiduChange: function (e, index, v) {
		this.setState(function (previousState, currentProps) {
			return { selectedWeiduValue: v };
		});
	},
	_setState: function(state) {
        this.setState(function(previousState, currentProps) {
            previousState.weiduList = state.weiduList,
            previousState.zhiBiaoList = state.zhiBiaoList,
            previousState.columnTitleFieldsList = state.columnTitleFieldsList,
            previousState.rowTitleFieldsList = state.rowTitleFieldsList,
            previousState.dragWeiduList = state.dragWeiduList,
            previousState.dragZhibiaoList = state.dragZhibiaoList,
            previousState.dragHejiList = state.dragHejiList,
            previousState.dragPingjunList = state.dragPingjunList,
            previousState.dragMaxList = state.dragMaxList,
            previousState.dragMinList = state.dragMinList,
            previousState.dragJishuList = state.dragJishuList,
            previousState.dragJisuanlieList=state.dragJisuanlieList,
            previousState.dragWeiduJishuList = state.dragWeiduJishuList
            return previousState
        });
    },
	_setWeiduItems: function (arg) {
		this.setState(function (previousState, currentProps) {
			var items = [];
			previousState.changeWeiIndex=arg.changeWeiIndex;
			if (previousState.weiduList != null) {
				for (var i = 0; i < previousState.weiduList.length; i++) {
					items.push(previousState.weiduList[i]);
				}
			}
			if (!arg.type) {
				if (arg.items) {
					return { weiduList: arg.items };
				}
				if (arg.sort) {
					var prev = arg.sort.prev;
					var next = arg.sort.next;
					var prevItem = items[prev];
					var nextItem = items[next];
					if (prev < next) {
						items.splice((next + 1), 0, prevItem);
						items.splice(prev, 1);
					}
					if (prev > next) {
						items.splice(prev, 1);
						items.splice((next), 0, prevItem);
					}

					previousState.weiduList = items;
					return previousState;
				}
			} else {
				var n = 0;
				var newItems = [];
				if (arg.itemType == 'col') {
					items = previousState.columnTitleFieldsList;
				}
				if (arg.itemType == 'row') {
					items = previousState.rowTitleFieldsList;
				}
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != arg.items.name) {
						newItems.push(items[i])
					}
				}
				if (arg.itemType == 'col') {
					previousState.columnTitleFieldsList = newItems;
				} else if (arg.itemType == 'row') {
					previousState.rowTitleFieldsList = newItems;
				} else {
					previousState.weiduList = newItems;
				}

				if(arg.groupSelected=='no'){
					previousState.groupSelected=arg.groupSelected;
				}
				return previousState;
			}
		});

		this._emitReoprtData();
	},
	_setRowWeiduItems: function (arg) {
		this.setState(function (previousState, currentProps) {
			var items = [];
			for (var i = 0; i < previousState.rowTitleFieldsList.length; i++) {
				items.push(previousState.rowTitleFieldsList[i]);
			}
			if (!arg.type) {
				if (arg.items) {
					return { rowTitleFieldsList: arg.items };
				}
				if (arg.sort) {
					var prev = arg.sort.prev;
					var next = arg.sort.next;
					var prevItem = items[prev];
					var nextItem = items[next];
					if (prev < next) {
						items.splice((next + 1), 0, prevItem);
						items.splice(prev, 1);
					}
					if (prev > next) {
						items.splice(prev, 1);
						items.splice((next), 0, prevItem);
					}
					return { rowTitleFieldsList: items};
				}
			} else {
				var n = 0;
				var newItems = [];
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != arg.items.name) {
						newItems.push(items[i])
					}
				}
				return { rowTitleFieldsList: newItems };
			}
		});
		this._emitReoprtData();
	},
	_setColWeiduItems: function (arg) {
		this.setState(function (previousState, currentProps) {
			var items = [];
			for (var i = 0; i < previousState.columnTitleFieldsList.length; i++) {
				items.push(previousState.columnTitleFieldsList[i]);
			}
			if (!arg.type) {
				if (arg.items) {
					return { columnTitleFieldsList: arg.items };
				}
				if (arg.sort) {
					var prev = arg.sort.prev;
					var next = arg.sort.next;
					var prevItem = items[prev];
					var nextItem = items[next];
					if (prev < next) {
						items.splice((next + 1), 0, prevItem);
						items.splice(prev, 1);
					}
					if (prev > next) {
						items.splice(prev, 1);
						items.splice((next), 0, prevItem);
					}
					return { columnTitleFieldsList: items };
				}
			} else {
				var n = 0;
				var newItems = [];
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != arg.items.name) {
						newItems.push(items[i])
					}
				}
				return { columnTitleFieldsList: newItems };
			}
		});
		this._emitReoprtData();
	},

    _setDragWeiduItems: function (item, type, groupSelected) {

		var dragWeiSign = false;
        var items       = this.state.dragWeiduList;
        var newItems    = [];

        if (type == 'del') {
            dragWeiSign = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].name != item.name) {
                    newItems.push(items[i])
                }
            }
        }
        else if (type == 'add') {
            newItems = items;
            newItems.push(item);
        }
        else {
            return;
        }

        this.setState({
            dragWeiduList: newItems,
            groupSelected: groupSelected
        });

        if(dragWeiSign){
            return;
        }

		this._emitReoprtData();
	},

	_setZhibiaoItems: function (arg) {
		this.setState(function (previousState, currentProps) {
			var items = [];
			for (var i = 0; i < previousState.zhiBiaoList.length; i++) {
				items.push(previousState.zhiBiaoList[i]);
			}
			if (!arg.type) {
				if (arg.items) {
					return { zhiBiaoList: arg.items };
				}
				if (arg.sort) {
					var prev = arg.sort.prev;
					var next = arg.sort.next;
					var prevItem = items[prev];
					var nextItem = items[next];
					if (prev < next) {
						items.splice((next + 1), 0, prevItem);
						items.splice(prev, 1);
					}
					if (prev > next) {
						items.splice(prev, 1);
						items.splice((next), 0, prevItem);
					}

					return { zhiBiaoList: items,dragIndex:next };
				}
			} else {
				var n = 0;
				var newItems = [];
				var fxSign= true;
				var fxIndex=-1;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != arg.items.name) {
						newItems.push(items[i])
					}else{
						if(items[i].fxSign==false){
							fxSign=false;
							fxIndex=i;
						}
					}
				}
				return { zhiBiaoList: newItems ,fxSign: fxSign ,fxIndex: fxIndex};
			}
		});
		this._emitReoprtData();
	},
	_setDragZhibiaoItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragZhibiaoList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragZhibiaoList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragHejiItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragHejiList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragHejiList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragPingjunItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragPingjunList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragPingjunList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragMaxItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragMaxList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragMaxList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragMinItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragMinList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragMinList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragJishuItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragJishuList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragJishuList: newItems };
		});
		this._emitReoprtData();
	},
	_setDragWeiduJishuItems: function (item, type) {
		this.setState(function (previousState, currentProps) {
			var items = previousState.dragWeiduJishuList;
			var newItems = [];
			if (type == 'del') {
				var n = 0;
				for (var i = 0; i < items.length; i++) {
					if (items[i].name != item.name) {
						newItems.push(items[i])
					}
				}
			}
			if (type == 'add') {
				newItems = items;
				newItems.push(item);
			}
			return { dragWeiduJishuList: newItems };
		});
		this._emitReoprtData();
	},
	_emitReoprtData: function () {
		var _this = this;
		setTimeout(function () {
			_this.setState(function(previousState){
				previousState.zhiBiaoList = ChartTypeStore.checkIndexFields(previousState.zhiBiaoList,previousState.zhiBiaoCheckList,previousState.weiduList);
				return previousState;
			})
			var param = {
				weiduList: _this.state.weiduList,
				zhiBiaoList: _this.state.zhiBiaoList,
				rowTitleFieldsList: _this.state.rowTitleFieldsList,
				columnTitleFieldsList: _this.state.columnTitleFieldsList,
				dragWeiduList: _this.state.dragWeiduList,
				dragZhibiaoList: _this.state.dragZhibiaoList,
				dragHejiList: _this.state.dragHejiList,
				dragPingjunList: _this.state.dragPingjunList,
				dragMinList: _this.state.dragMinList,
				dragMaxList: _this.state.dragMaxList,
				dragJishuList: _this.state.dragJishuList,
				dragJisuanlieList:_this.state.dragJisuanlieList,
				dragWeiduJishuList:_this.state.dragWeiduJishuList,
				dragIndex:_this.state.dragIndex,
				fxSign:_this.state.fxSign,
				groupSelected:_this.state.groupSelected,
				changeWeiIndex:_this.state.changeWeiIndex,
			}
			App.emit('APP-REPORT-WEIDU-ZHIBIAO-CHANGED', param);
		}, 100)
	},
	_getJuSuanLieDisabled: function(){
		let disabledRet = false;
		if(this.props.areaInfo.areaInfo.category === "INDEX"){
			disabledRet = this.state.jisuanlieshow;
		}else{
			disabledRet = this.state.weiduList.length>0?false:true;
		}

		return disabledRet;
	}
})
