/**
 * 保存弹框
 * 
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var Loading = require('../common/Loading');
var ReportStore = require('../../stores/ReportStore');
var LinksDetails=require('./LinksDetails');
var {
	FlatButton,
	Dialog,
	IconButton,
	List,
	ListItem,
	FontIcon
} = require('material-ui');

module.exports = React.createClass({

	displayName: 'SaveButton',

	getInitialState: function() {
		return {
			openDialog: false,
			disabled: true,
			loaded: true,
			listData:null,

		}
	},
	componentWillMount: function() {
		
	},
	componentWillReceiveProps: function(nextProps) {
	
	},
	componentDidMount: function() {
		this.app['APP-REPORT-LINKS-DASHBOARDS'] = App.on('APP-REPORT-LINKS-DASHBOARDS',this._getUsedDashboards);
		
	},
	app:{},
	componentWillUnmount: function() {
		for (var i in this.app) {
            this.app[i].remove()
        }
	},
	render: function() {

		return (
			<div>
				{this._saveAsDialogHandle()}
			</div>
		)
	},

	_getUsedDashboards: function(arg) {
		var reportId=this.props.reportId;
		var _this=this;

		if(reportId && this.props.name!=''){
			ReportStore.getUsedDashboards(reportId).then(function(result){

				// var result={
				// 		    "dataObject": [
				// 		        [
				// 		            {
				// 		                "name": "1层层层层层层层层层层层层层层层e",
				// 		                "id": "5094d4ccf470461ba7709dc589a98841",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "2层层层层层层层层层r",
				// 		                "id": "1a47659cb1c94d849a6a829d416ecd5d",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "3层层层层层层er",
				// 		                "id": "ab07bc8d0ae247f7b0f69576df5788b4",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "简单驾驶舱",
				// 		                "id": "66aa15fe173d499cb1b6036e8e090af5",
				// 		                "type": "dashboard"
				// 		            }
				// 		        ],
				// 		        [
				// 		            {
				// 		                "name": "111层层层层层层层层层层层层层层层层层层层层层层层层层层层层层层层层rty",
				// 		                "id": "5094d4ccf470461ba7709dc589a98841",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "egg",
				// 		                "id": "203831e479394735b5454a6952dcd9af",
				// 		                "type": "dashboard"
				// 		            }
				// 		        ],
				// 		        [
				// 		            {
				// 		                "name": "111层层层层层层层层层层层",
				// 		                "id": "5094d4ccf470461ba7709dc589a98841",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "egg",
				// 		                "id": "203831e479394735b5454a6952dcd9af",
				// 		                "type": "dashboard"
				// 		            }
				// 		        ],
				// 		        [
				// 		            {
				// 		                "name": "层层层层层层层层层层层层层层层层层层层层层rty111层层层层层层层层",
				// 		                "id": "5094d4ccf470461ba7709dc589a98841",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "egg",
				// 		                "id": "203831e479394735b5454a6952dcd9af",
				// 		                "type": "dashboard"
				// 		            }
				// 		        ],
				// 		        [
				// 		            {
				// 		                "name": "层层层层层层层层层层层层层",
				// 		                "id": "5094d4ccf470461ba7709dc589a98841",
				// 		                "type": "directory"
				// 		            },
				// 		            {
				// 		                "name": "egg",
				// 		                "id": "203831e479394735b5454a6952dcd9af",
				// 		                "type": "dashboard"
				// 		            }
				// 		        ]
				// 		    ],
				// 		    "success": true,
				// 		    "sessionId": "01xJ8VucyOdh7+k6LXNM1We3NK+c8vSiAYUler2heFZShVibKf7f7l+g=="
				// 		}

				if(result.success){
					_this._setListData(result.dataObject)
					
				}
			});
			
		}else{
			App.emit('APP-REPORT-SAVE');
		}
		
		
	},
	_setListData:function(listData){
		if(!this.isMounted()){
			return;
		}
		if(listData.length>0){
			this.setState({
				openDialog: true,
				loaded:false,
				listData:listData
			});
		}else {
			App.emit('APP-REPORT-SAVE');
		}
		
		
	},
	_saveAsDialogHandle: function() { //另存为按钮提示框的方法

		var actions = [
			<FlatButton label="取消" onTouchTap={this._cancelDialogHandle}/>,
			<FlatButton label="保存" onTouchTap={(evt)=>this._yesDialogHandle(evt)}/>
		];
		
			return <Dialog 
	    	            contentClassName="saveAsDialogBox" 
	    	            titleClassName="saveAsDialogTitleBox" 
	    	            bodyClassName="saveAsDialogBodyBox" 
	    	            actionsContainerClassName="saveAsDialogBottmBox BottmBoxColor" 
	    	            title="提示"
	    	            actions={actions} 
	    	            modal={false} 
	    	            open={this.state.openDialog} 
	    	            onRequestClose={this._cancelDialogHandle}>
	    	            {this._listItem()}
	    	            	
					 </Dialog>

	},
	_changeSave: function(model) {
		this.setState({
			disabled: !model.changeed
		});
	},
	_cancelDialogHandle:function(){
		this.setState({
			openDialog:false
		});
	},
	_yesDialogHandle:function(evt){
		evt.stopPropagation();
		this.setState({
			openDialog:false
		});
		App.emit('APP-REPORT-SAVE');
	},
	_listItem:function(){

		if (this.state.loaded) {
			return (
				<Loading/>
			)
			
		} else {
			if (this.state.listData.length > 0) {
				return (
					<div className="dialogReportListComponent">
						<div className="titleText">
							<div className="titleIcon">
								<FontIcon className="iconfont icon-ictanhaotishi24px titIcon"/>
							</div>
							<div className="titltxt">该分析已被以下驾驶舱引用，是否确定保存?</div>
						</div>
						<div className="scrollBoxLinks">
							<div className="scrollBoxs">
								<LinksDetails listData={this.state.listData}/>
							</div>
							
						</div>
					</div>
				)
			} else {
				return (
					<div className="dialogReportListComponent">
						<div className="datasNullMessage">提示:当前数据为空</div>
					</div>
				)
			}
		}
	},

	
	
});