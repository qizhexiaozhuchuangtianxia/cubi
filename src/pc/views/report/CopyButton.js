var React = require('react');
var App = require('app');
var ReportStore = require('../../stores/ReportStore');
var CopyListComponent = require('./CopyListComponent');
var CreateDirComponent=require('./CreateDirComponent');
var PublicButton = require('../common/PublicButton');

var {
    Dialog,
    IconButton,
    FontIcon
} = require('material-ui');

module.exports = React.createClass({
    app:{},
    displayName: '另存为组件',
    __dirId:'',
    __dirName:'',
    getInitialState: function() {
        return {
            openDialog:false,
            tipsTitle:'我的分析',
            dirId:null,
            dirName:'我的分析',
            loaded:false,
            canEdited:true,//默认不可以点击保存按钮
            canCopyArr:[],
            seletedArr:[],
            edit:[]
        }
    },
    componentDidMount: function() {
        //订阅 更新dirid和dirname
        this.app['APP-REPORT-COPY-LIST-HANDLE'] = App.on('APP-REPORT-COPY-LIST-HANDLE', this._modifyDirIdAndDirName);
        //弹出层设置顶部的返回方法
        this.app['APP-REPORT-SET-DIRID-DIRNAME-COPY'] = App.on('APP-REPORT-SET-DIRID-DIRNAME-COPY', this._setIdNameHandle);
        //每次点击设置一个存储用户是否可以复制的的数组
        this.app['APP-REPORT-SET-CAN-COPY-ARR-HANDLE'] = App.on('APP-REPORT-SET-CAN-COPY-ARR-HANDLE', this._setCanCopyArrHandle);
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    render: function() {
        var disableBool = this.props.checkLenProps>0?false:true
        return (
            <div>
                <IconButton
                    disabled={disableBool}
                    className="deleteIconBtn"
                    onClick={this._handClick}
                    iconClassName='iconfont icon-icfuzhi24px'></IconButton>
                    {this._copyDialogHandle()}
            </div>
        )
    },
    _setCanCopyArrHandle:function(obj){
        this.setState(function(previousState,currentProps){
            previousState.canCopyArr.push(obj.authorityEdit);
            return {previousState};
        });
    },
    _handClick: function() {//点击复制按钮执行的方法
        // if(!this.props.selectedAuthorityEdit){
        //     var message='您暂时没有权限复制当前选中的驾驶舱';
        //     App.emit('APP-MESSAGE-OPEN',{
        //         content:message
        //     });
        //     return;
        // }
        var arr = [];
        for(var i=0,j=this.props.listData.length;i<j;i++){
            if(this.props.listData[i].listCheckBoxBool){
                arr.push(this.props.listData[i].id);
            }
        }
        this.setState({
            openDialog:true,
            seletedArr:arr
        })
    },
    _modifyDirIdAndDirName:function(obj){//订阅 更新dirid和dirname
        this.setState({
            dirId:obj.dirId,
            tipsTitle:obj.dirName,
            canEdited:!obj.canEdited,
        })
    },
     _authorityAddHandle:function(edit){
        var moveArr=this.state.edit;
        moveArr.push(edit);
        this.setState({
            edit:moveArr
        });
    },
    _authorityPopHandle:function(){
        var moveArr=this.state.edit;
        moveArr.pop();
        this.setState({
            edit:moveArr
        });
    },
    _copyDialogHandle:function(){//另存为按钮提示框的方法
       //移动权限
        var copy=true;
        var moveArr=this.state.edit;
        var stateEdit=true;
        if(moveArr.length>0){
            stateEdit=moveArr[moveArr.length-1];
        }
        if((this.props.canRemoveId != this.state.dirId)  && stateEdit){
            copy=false;
        }
        //新建权限
        var sceneCreate=true;
        if(this.props.sceneCreate && stateEdit){
            sceneCreate=false;
        }

        var actions = [
            <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                onClick={this._cancelDialogHandle}/>,
            <PublicButton
                style={{color:"rgba(0,229,255,255)"}}
                labelText="复制"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                disabled={copy}
                title={(this.props.canRemoveId == this.state.dirId)?'请选择一个文件夹':''}
                onClick={this._yesDialogHandle}/>,
            <PublicButton
                style={{color:"rgba(0,229,255,255)"}}
                className="createDir"
                labelText="新建目录"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                disabled={sceneCreate}
                icon={<FontIcon className="iconfont icon-ictianjia24px"/>}
                onClick={this._createDirHandle}/>
        ];
        if(this.state.dirId == null){
            return  <Dialog
                        contentClassName="saveAsDialogBox"
                        titleClassName="saveAsDialogTitleBox"
                        bodyClassName="saveAsDialogBodyBox"
                        actionsContainerClassName="saveAsDialogBottmBox"
                        title={this.state.tipsTitle}
                        actions={actions}
                        modal={false}
                        open={this.state.openDialog}
                        onRequestClose={this._cancelDialogHandle}>
                            <CreateDirComponent
                                canCreated={this.state.canCopyArr[this.state.canCopyArr.length-1]}
                                parentId={this.state.dirId}/>
                            <CopyListComponent seletedArr={this.state.seletedArr} dirId={this.state.dirId} loaded={this.state.loaded}
                            authorityAddHandle={this._authorityAddHandle}/>
                    </Dialog>
        }else{
            return  <Dialog
                        contentClassName="saveAsDialogBox"
                        titleClassName="saveAsDialogTitleBox addGoBack"
                        bodyClassName="saveAsDialogBodyBox"
                        actionsContainerClassName="saveAsDialogBottmBox"
                        title={this.state.tipsTitle}
                        actions={actions}
                        modal={false}
                        open={this.state.openDialog}
                        onRequestClose={this._cancelDialogHandle}>
                            <CreateDirComponent
                                canCreated={this.state.canCopyArr[this.state.canCopyArr.length-1]}
                                parentId={this.state.dirId}/>
                            <CopyListComponent seletedArr={this.state.seletedArr} dirId={this.state.dirId} loaded={this.state.loaded}
                            authorityAddHandle={this._authorityAddHandle}/>
                            <div className="goBackDirList">
                                <IconButton
                                    iconClassName="iconfont icon-icarrowback24px"
                                    onTouchTap={this._handleToggle} />
                            </div>
                    </Dialog>
        }

    },
    _createDirHandle:function(){//弹出层新建目录的方法
        if(this.state.canCopyArr[this.state.canCopyArr.length-1]){
            if(this.state.canCopyArr[this.state.canCopyArr.length-1]){
                App.emit('APP-REPORT-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE',{target:'COPY'});
            }else{
                App.emit('APP-MESSAGE-OPEN',{
                    content:'您暂时没有权限编辑当前文件夹'
                });
            }
        }else{
            App.emit('APP-REPORT-OPEN-CREATE-DIRECTIVE-DIALOG-HANDLE',{target:'COPY'});
        }
    },
    _cancelDialogHandle:function(){//弹出层 取消按钮的方法
        this.setState({
            openDialog:false
        },function(){
            App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
        })
    },
    _yesDialogHandle:function(){//弹出层 确定按钮的方法v
        var _this = this;
        var targetId = this.state.dirId== null?'':this.state.dirId;
        var dataObj = {
            resources:[]
        }
        for(var i=0,j=this.props.listData.length;i<j;i++){
            if(this.props.listData[i].listCheckBoxBool){
                dataObj.resources.push(this.props.listData[i].id);
            }
        }
        if(this.state.canCopyArr[this.state.canCopyArr.length-1]){
            if(this.state.canCopyArr[this.state.canCopyArr.length-1]){
                ReportStore.copyTargetHandle(targetId,dataObj).then(function(data){
                    if(data.success){
                        _this._cancelDialogHandle();
                        App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
                    }else{
                        App.emit('APP-MESSAGE-OPEN',{
                            content:data.message
                        });
                    };
                });
            }else{
                App.emit('APP-MESSAGE-OPEN',{
                    content:"您暂时没有权限编辑当前文件夹"
                });
            }
        }else{
            ReportStore.copyTargetHandle(targetId,dataObj).then(function(data){
                if(data.success){
                    _this._cancelDialogHandle();
                    App.emit('APP-REPORT-REFRESH-LIST-HANDLE');
                }else{
                    App.emit('APP-MESSAGE-OPEN',{
                        content:data.message
                    });
                };
            });
        }
    },
    _handleToggle:function(){//点击返回按钮的方法
        var _this = this;
        this._authorityPopHandle();
        this.setState(function(previousState,currentProps){
            previousState.canCopyArr.pop();
            previousState.dirId= _this.__dirId;
            previousState.tipsTitle= _this.__dirName;
            return {previousState};
        });
    },
    _setIdNameHandle:function(obj){
        this.__dirId = obj.id;
        this.__dirName = obj.name;
    },
});
