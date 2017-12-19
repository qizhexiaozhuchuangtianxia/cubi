var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var SetSDrawer = require('./configure/SetSDrawer');
// var SetGDrawer = require('./filter/SetGDrawer');
import SetGDrawer from './filter/SetGDrawer'
var SetIDrawer = require('./main/SetIDrawer');
var {
    FloatingActionButton
} = require('material-ui');

module.exports = React.createClass({
    displayName: 'BottomButton',
    getDefaultProps: function() {
        return {}
    },
    getInitialState: function() {
        return {
            reportId:this.props.reportId,
            reportType:this.props.reportType, 
            reportCategory:this.props.reportCategory,
            tableType:this.props.tableType, 
            tableName:this.props.tableName,
            rowTitleFieldsList:this.props.rowTitleFieldsList, 
            columnTitleFieldsList:this.props.columnTitleFieldsList,  
            weiduList:this.props.weiduList,
            zhiBiaoList:this.props.zhiBiaoList,
            dragWeiduList:this.props.dragWeiduList,
            dragZhibiaoList:this.props.dragZhibiaoList,
            dragHejiList:this.props.dragHejiList, 
            dragPingjunList:this.props.dragPingjunList,
            dragMaxList:this.props.dragMaxList,
            dragMinList:this.props.dragMinList,
            dragJishuList:this.props.dragJishuList,
            dragJisuanlieList:this.props.dragJisuanlieList,
            dragWeiduJishuList:this.props.dragWeiduJishuList,
            filterData:this.props.filterData,
            filterFields:this.props.filterFields,
            metaDataId:this.props.metaDataId,
            filterLoaded:this.props.filterLoaded,
            compareData:this.props.compareData
        }
    },
    app:{},
    componentWillMount: function() {
       
    },
    componentDidMount: function() {
        App.on('APP-REPORT-DEL-ERROR-FX', this._delErrorFx);
    },
    componentWillUpdate: function() {
        
    },
    componentWillReceiveProps: function(nextProps) {
       this.setState({
            reportId:nextProps.reportId,
            reportType:nextProps.reportType, 
            reportCategory:nextProps.reportCategory,
            tableType:nextProps.tableType, 
            tableName:nextProps.tableName,
            rowTitleFieldsList:nextProps.rowTitleFieldsList, 
            columnTitleFieldsList:nextProps.columnTitleFieldsList,  
            weiduList:nextProps.weiduList,
            zhiBiaoList:nextProps.zhiBiaoList,
            dragWeiduList:nextProps.dragWeiduList,
            dragZhibiaoList:nextProps.dragZhibiaoList,
            dragHejiList:nextProps.dragHejiList, 
            dragPingjunList:nextProps.dragPingjunList,
            dragMaxList:nextProps.dragMaxList,
            dragMinList:nextProps.dragMinList,
            dragJishuList:nextProps.dragJishuList,
            dragJisuanlieList:nextProps.dragJisuanlieList,
            dragWeiduJishuList:nextProps.dragWeiduJishuList,
            filterData:nextProps.filterData,
            filterFields:nextProps.filterFields,
            metaDataId:nextProps.metaDataId,
            filterLoaded:nextProps.filterLoaded,
            compareData:nextProps.compareData
       })
    },
    componentWillUnmount: function() {
       
    },
    render: function() {
        return (
            <div className="set-panel">
                <div className="sbtn-panel panel" ref="sbtnPanel">
                    <div className="bi-btn">
                        <FloatingActionButton  className="sbtn" iconClassName="iconfont icon-icpeizhi24px" onTouchTap={this._handleSetS} />
                    </div>
                </div>
                <div className="gbtn-panel panel">
                    <div className="bi-btn">
                        <FloatingActionButton  className="gbtn" iconClassName="iconfont icon-icshaixuanfab24px" onTouchTap={this._handleSetG} />
                    </div>
                </div>
                <div className="ibtn-panel panel">
                    <div className="bi-btn">
                        <FloatingActionButton  className="ibtn" iconClassName="iconfont icon-icbianji24px" onTouchTap={this._handleSetI} />
                    </div>
                </div>
            </div>
        )
    },
    _handleSetS: function(e) {
        // var currentCanEdited=this.props.currentCanEdited || this.props.dscurrentCanEdited;
        
        // if(this.props.currentCanEdited=='false'){
        //     var message='您暂时没有权限编辑当前分析';
        //     App.emit('APP-MESSAGE-OPEN',{
        //         content:message
        //     });
        //     return false;
        // }
        $('.sbtn-panel').hide();
        App.emit('APP-DRAWER-BOTTOM', <SetSDrawer 
            reportType={this.state.reportType} 
            tableType={this.state.tableType} 
            rowTitleFieldsList={this.state.rowTitleFieldsList} 
            columnTitleFieldsList={this.state.columnTitleFieldsList}  
            weiduList={this.state.weiduList} 
            zhiBiaoList={this.state.zhiBiaoList} 
            reportCategory={this.props.reportCategory}
            dragWeiduList={this.state.dragWeiduList} 
            dragZhibiaoList={this.state.dragZhibiaoList} 
            dragHejiList={this.state.dragHejiList} 
            dragPingjunList={this.state.dragPingjunList}
            dragMaxList={this.state.dragMaxList}
            dragMinList={this.state.dragMinList}
            dragJishuList={this.state.dragJishuList}
            dragJisuanlieList={this.state.dragJisuanlieList}
            dragWeiduJishuList={this.state.dragWeiduJishuList}
            areaInfo={this.props.areaInfo}
            compareData={this.props.compareData}
            compare={this.props.compare}
        />, 'sdrawer');
    },
    _handleSetG: function(e) {
        $('.gbtn-panel').hide();
        App.emit('APP-DRAWER-BOTTOM', <SetGDrawer
            reportId={this.state.reportId}
            filterData={this.state.filterData}
            filterFields={this.state.filterFields}
            metadataId={this.state.metaDataId}
            filterLoaded={this.state.filterLoaded}
            drilDownFilter={this.props.drilDownFilter}
            weiduList={this.state.weiduList} 
            reportCategory={this.state.reportCategory}
            rowTitleFields={this.props.rowTitleFields}
            compareData={this.props.compareData}
            />, 'gdrawer');
    },
    _handleSetI: function(e) {
        $('.ibtn-panel').hide();
        App.emit('APP-DRAWER-BOTTOM', <SetIDrawer fileName={this.state.tableName} reportType={this.state.reportType} reportCategory= {this.state.reportCategory} />, 'idrawer');
    },
    _delErrorFx:function(arg){
        var zhiBiaoList=this.state.zhiBiaoList;
        var newZhibiaoList=[];
        for(var i=0;i<zhiBiaoList.length;i++){
            if(arg.fxIndex!=i && zhiBiaoList[i].fxSign!=false){
                newZhibiaoList.push(zhiBiaoList[i]);
            }
        }
        this.setState({
            zhiBiaoList:newZhibiaoList
        });
    }
});