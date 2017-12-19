var React = require('react');
var $ = require('jquery');
var App = require('app');
var classnames=require('classnames');
var DashboardStore = require('../stores/DashboardStore');
var RowComponent=require('./dashboard/RowComponent');
var Loading =  require('./common/Loading');
var {
	Router
} = require('react-router');
var { 
	FloatingActionButton
} = require('material-ui');
//
module.exports = React.createClass({
	app:{},
	displayName: '驾驶舱详情页',
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			name:'',
			id:null,
			directoryId:'',
			rows: [],
			loading:true,
			operation:this.props.location.query.operation?this.props.location.query.operation:'view',
			canShowState:{
				canShow:false,
				canShowRowId:0,
				canShowColId:0
			},
			scale:1,
			currentCanEdited:this.props.location.query.currentCanEdited,
			globalFilterFields:[],
		}
	}, 
	componentWillMount: function() {
		var _this = this;
		var readUrl = this.props.location.query;//单页面访问的地址的sessionId
		DashboardStore.getDashboard(this.props.location.query.action,true,readUrl).then(function(data){

			if(_this.isMounted()){
				
				var rows = data.rows || [];
				var dashoboardName = data.name || _this.props.location.query.actionName;
				var directoryId = _this.props.location.query.parentId || '';
				if(rows){
					/*if(data.version!='3.0'){
						for(var i=0;i<rows.length;i++){
							if(rows[i].cells.length==1){
								//var nowScale = Math.floor(rows[0].cells[0].width/16);
								rows[i].cells[0].width = 1216;
							}else{
								var defScale = Math.floor(1216/16);
								var leftScale = Math.floor(rows[i].cells[0].width/16);
								var rightScale = Math.floor(rows[i].cells[1].width/16);
								var newScale = (leftScale+rightScale);
								leftScale = leftScale*defScale/newScale;
								rightScale = rightScale*defScale/newScale;
								rows[i].cells[0].width = leftScale*16;
								rows[i].cells[1].width = rightScale*16;
							}
						}
					}*/
					if (data.version == '3.0'||data.version == '3.01'){
						rows = DashboardStore.setRows(rows);
					}
				}
				var globalFilter=_this._globalFilter();

				_this.setState(function(previousState,currentProps){
				
					return {
						rows:rows,
						name:dashoboardName,
						loading:false,
						id:data.id,
						directoryId:directoryId,
						globalFilterFields:globalFilter
					};
				});
			}
			
		});
	},
	componentDidMount: function() {
		$('.page-main-frame').css({
			'padding-top':0
		})
        this._scrollBrar();
		this.app['APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE'] = App.on('APP-DASHBOARD-REPORT-EDIT-FILTER-HANDLE', this._editFilterHandle);	
		
	},
	componentWillUnmount: function() {
		
		if(window.localStorage)window.localStorage.removeItem('dirId');
	},
    componentWillUpdate : function(){
        this._scrollBrar();
    },
	render: function() {
		var rows = this.state.rows;
		if(this.state.loading){
			return (
				<div className="dashboard-panel">
					<div className="dashboardView" ref="scrollBox">
						<div className="dashboardView_box" ref="boxWidth">
							<Loading/>
						</div>
					</div>
				</div>
			)
		}else{
			if(rows.length==0){
				return (
					<div className="dashboard-panel">
						<div className="dashboardView" ref="scrollBox">
							<div className="dashboardView_box" ref="boxWidth">
			                    
							</div>
						</div>
					</div>
				)
			}else{
				return (
					<div className="dashboard-panel">
						<div className="dashboardView" ref="scrollBox">
							<div className="dashboardView_box" ref="boxWidth">
			                    {rows.map(this._domHandle)}
							</div>
						</div>					                
					</div>
				)
			}
		}
	},

    _editFilterHandle:function(itemObj){//修改传过来的对应的报表的是否是处于编辑状态
    	this.setState(function(previousState,currentProps){
    		previousState.canShowState.canShow = itemObj.canShow;
    		previousState.canShowState.canShowRowId = itemObj.itemRowIndex;
    		previousState.canShowState.canShowColId = itemObj.itemColIndex;
			return {previousState};
		});
    }, 
	
	_domHandle:function(item,index){
        return <RowComponent
		        scale={this.state.scale}
		        directoryId={this.state.directoryId}
		        doshboarId={this.action}
		        canShowState={this.state.canShowState}
		        len={this.state.rows.length}
		        key={index}
		        row={index}
		        rows={this.state.rows}
		        rowData={item}
		        cells={item.cells}
		        actionName={this.actionName}
		        dirName={this.dirName}
		        dashBoardRead={true}
		        operation={this.state.operation}
		        location={this.props.location}
		        globalFilterFields={this.state.globalFilterFields}
		        globalFilterSign={this.state.globalFilterSign}
		        filterSign={this.state.filterSign}
		        clickHeader={this.state.clickHeader}
	        />;
        
	},
    _scrollBrar:function(){
        $(this.refs.scrollBox).mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"minimal-dark",
            mouseWheel:{scrollAmount:100},
			autoExpandScrollbar:true,
			snapAmount:1,
            snapOffset:1
        });
    },
    _globalFilter:function(rows){
    	//从url里面获取
  //   	var g=[
		// 	    {
		// 	        "name": "行政区域",
		// 	        "valueType": "STRING",
		// 	        "dbField": "",
		// 	        "value": [
		// 	            {
		// 	                "id": "086",
		// 	                "name": "中国",
		// 	                "children": [
		// 	                    {
		// 	                        "id": "330000",
		// 	                        "name": "浙江",			                        
		// 	                        "children": [
		// 	                            {
		// 	                                "id": "330400",
		// 	                                "name": "嘉兴市",			                                
		// 	                                "children": []
		// 	                            }
		// 	                        ]
		// 	                    }
		// 	                ]
		// 	            }
		// 	        ],
		// 	        "selected": true,
		// 	        "items": [],
		// 	        "groupType": "GROUP_TITLE_FIELD",
		// 	        "dimensionId": "5b960d4a303641dfa7d94bc67218f641",
		// 	        "pattern": ""
		// 	    },
		// 	    {
		// 	        "name": "行政区域2",
		// 	        "valueType": "STRING",
		// 	        "dbField": "",
		// 	        "value": [
		// 	            {
		// 	                "id": "086",
		// 	                "name": "中国2",
		// 	                "children": [
		// 	                    {
		// 	                        "id": "330000",
		// 	                        "name": "浙江2",			                        
		// 	                        "children": [
		// 	                            { 
		// 	                                "id": "330400",
		// 	                                "name": "嘉兴市2",			                                
		// 	                                "children": []
		// 	                            }
		// 	                        ]
		// 	                    }
		// 	                ]
		// 	            }
		// 	        ],
		// 	        "selected": true,
		// 	        "items": [],
		// 	        "groupType": "GROUP_TITLE_FIELD",
		// 	        "dimensionId": "5b960d4a303641dfa7d94bc67218f641",
		// 	        "pattern": ""
		// 	    }
		// 	];
		// for(var i=0;i<g.length;i++){
		// 	var val=g[i].value;
		// 	for(var j=0;j<val.length;j++){
		// 		var curObj=val[j];
		// 		var levelLen=0;
		// 		function addValAttr(obj){
					
		// 			if(obj.children){
		// 				if(obj.children.length>0){
		// 					levelLen++;
		// 					for(var h=0;h<obj.children.length;h++){
		// 						obj.children[h].checboxBool=true;
		// 						obj.children[h].pid=obj.id;
		// 						obj.children[h].levelLen=levelLen;
  //                               obj.children[h].child=true;
  //                               addValAttr(obj.children[h]);
		// 					}
		// 				}
		// 			}
		// 		}
		// 		addValAttr(curObj);
		// 	}
			
		// }
		// console.log(g,'gggg')
    	var globalFilterFields={
    		globalFilterSign:true,
    		filterFields:[
				// {
				// 	dbField:"date",
				// 	dimensionId:"",//维度ID
				// 	metadataId:"972b5d0043af4bb8901e1fed48bd005b",//立方ID
				// 	groupType:"",
				// 	items:[],
				// 	name:"date",
				// 	pattern:"",
				// 	selected:true,
				// 	value:["2015-10-20", "2016-10-20"],
				// 	valueType:"DATE_RANGE"
				// }
			]
    	}

		//var rows=this.state.rows;
		// for(var i=0;i<rows.length;i++){
		// 	var cells=rows[i].cells;
		// 	for(var j=0;j<cells.length;j++){
		// 		cells[j].report.filterFields=globalFilterFields;
		// 	}
		// }
		return globalFilterFields;
		// this.setState(function(previousState,currentProps){
		// 	previousState.globalFilterFields=globalFilterFields;
		// 	previousState.rows=rows;
		// 	return {previousState};
		// });
		
	}
	
});

