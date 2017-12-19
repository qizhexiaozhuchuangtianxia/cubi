/**
 * Created by Administrator on 2016-2-25.
 */
 var $ = require('jquery');
var React = require('react');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var App = require('app');
var PublicTextField = require('../common/PublicTextField');

var {
    TextField,
    Dialog
} = require('material-ui');
module.exports = React.createClass({
    app:{},
    displayName:'AddWeb',
    getInitialState: function() {
        return {
            name:this.props.name?this.props.name:'',
            url:this.props.url?this.props.url:'',
            errorText:false
        }
    },
    componentWillUnmount: function() {
        for(var i in this.app){
            this.app[i].remove();
        }
    },
    componentWillReceiveProps:function(nextProps){//点击本页面进入本页面的时候触发

    },
    componentWillMount:function(){

    },
    componentDidMount:function(){
        this.app['APP-DASHBOARD-SET-WEB-URL'] = App.on('APP-DASHBOARD-SET-WEB-URL', this._setData);
    },
    render: function(){
        return (
            <div className="dashboardView_col_content">
                <div className="report-web-url">
                    <PublicTextField
                        id="webName"
                        fullWidth={false}
                        floatingLabelText="标题名称"
                        defaultValue={this.state.name}
                        errorText={this.state.errorText}
                        onChange={this._setName}
                    />
                    <div className="web-panel">
                        <PublicTextField
                            id="webUrl"
                            fullWidth={true}
                            floatingLabelText="URL地址"
                            defaultValue={this.state.url}
                            errorText={this.state.errorText}
                            onChange={this._setUrl}
                        />
                    </div>
                </div>
            </div>
        )
    },
    _setName:function(){
        var name = $("#webName").val().trim();
        var errorText = false;
        if(CheckEntryTextComponent.checkAllNameLengthHandle(name)>16){
            errorText = '输入长度超出';
        }else{
            if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(name)){
                errorText = '输入名称不合法';
            }else{
                errorText = false;
            }
        }
        this.setState({name:name,errorText:errorText})
    },
    _setUrl:function(){
        var url = $("#webUrl").val().trim();
        var errorText = false;
        if(CheckEntryTextComponent.checkAllNameLengthHandle(url)>56){
            errorText = '输入长度超出';
        }else{
            if(CheckEntryTextComponent.checkEntryTextLegitimateHandle(name)){
                errorText = '输入名称不合法';
            }else{
                errorText = false;
            }
        }
        this.setState({url:url,errorText:errorText})
    },
    _setData:function(){
        var _this = this;
        if(!this.state.errorText){
            setTimeout(function(){
                App.emit('APP-DASHBOARD-ADD-REPORT',{
                    name:_this.state.name,
                    url:_this.state.url,
                    row:_this.props.row,
                    col:_this.props.col,
                    type:'WEB'
                })
                App.emit('APP-DASHBOARD-WEB-CLOSE');
            },100)
        }
    }
});
