var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var PublicButton = require('./PublicButton');
var PublicTextField = require('./PublicTextField');
var {
  Dialog,
  SelectField,
  MenuItem,
} = require('material-ui');

module.exports = React.createClass({

    displayName: 'ZhibiaoFilterTop',

    getInitialState: function() {
      var labelText=null, method='DESC',textEmpty=true;
      if(this.props.topParameters){
          labelText=this.props.topParameters[0].topn;
          method=this.props.topParameters[0].method;
          textEmpty=false;
      }
        return {
          open: this.props.open,
          labelText:labelText,
          errorTextState: '',
          method:method,
          textEmpty:textEmpty,
          initTopOn:false
        }
    },
    componentDidMount: function() {
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({
        open:nextProps.open,
      })

    },

    render: function() {
        var labelText=null,method='DESC';
        if(this.state.initTopOn==true){
          method =this.state.method;
        }else{
          if(this.props.topParameters){
             if(this.props.topParameters[0].field == this.props.item.name){
                  labelText = this.state.labelText;
                  method = this.state.method;
              }else{
                  method='DESC'
              }
          }

        }
        var item=this.props.item;
        var title=item.customName?item.customName:item.name;
        title=title+'排行榜';
        var titDisabled= false;
        if(this.state.textEmpty){
          titDisabled=true
        }
        var action = [
            <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
              labelText="取消"
              rippleColor="rgba(255,255,255,0.25)"
              hoverColor="rgba(255,255,255,0.15)"
              onClick={this._deleteDialogClose }/>,

          <PublicButton
              style={{color:"rgba(0,229,255,255)"}}
              labelText="保存"
              rippleColor="rgba(0,229,255,0.25)"
              hoverColor="rgba(0,229,255,0.15)"
              disabled={titDisabled}
              onClick={(evt)=>this._SubmitColse(evt,true)}/>

        ];

        return (

            <Dialog
              contentClassName="zhibiaoRankingDialog"
              titleClassName="zhibiaotitleNameDialog"
              bodyClassName="zhibiaoBodyDialog"
              actionsContainerClassName="zhibiaobottomDialog"
              title={title}
              actions={action}
              modal={false}
              open={this.state.open}
              onRequestClose={this._deleteDialogClose}>
              <div className='content'>
                <div className="chooseType">
                  <SelectField
                    ref='selectTest'
                    errorStyle={{color: '#f5344b'}}
                    onClick={this._updataStyle}
                    onChange = {(evt,index,value)=>this._onChartTypeChanged(evt,index,value)}
                    floatingLabelText='类型' value={method} floatingLabelStyle = {{fontSize: '14px'}} style={{width: '100%', display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>
                    <MenuItem className='Top' value="DESC"  primaryText="Top"/>
                    <MenuItem className='Bottom' value="ASC"  primaryText="Bottom"/>
                  </SelectField>
                </div>
                <div className="textCont">
                  <PublicTextField
                      defaultValue={labelText}
                      errorText={this.state.errorTextState}
                      onChange={(evt)=>this._onChangedText(evt)} />
                </div>
              </div>
            </Dialog>
        )

    },
    _deleteDialogClose:function(){
        if (!this.isMounted()) return;
        var obj =[{'CloseTopPopover':false}];
        this.props.CloseTopPopover(obj);
        this.setState({
          open:false,
          initTopOn:false
        })
    },
    _onChartTypeChanged:function(evt,index,val){
        this.setState({
          method:val,
          initTopOn:true

        })
    },
    _SubmitColse:function(){

      if (!this.isMounted()) return;
      var method ='ASC'; // （top：DESC，bottom：ASC）
      var item = this.props.item;
      var inputText = $('.textField').find('input').val();
      inputText = parseInt(inputText)
      var selectval = this.state.method;
      var obj =[{'CloseTopPopover':false}];
      if(selectval=='DESC'){
        method ='DESC'
      }
      this.props.CloseTopPopover(obj);
      this.setState({
          open:false
      });
      var name=item.name;
      if(this.props.compare && item.customName != ""){
        name=item.customName;
      }
      var  param={
            topParameters:[
              {
               'field': name,
               'method': method,
               'topn': inputText
              }
            ],
            row:this.props.row,
            col:this.props.col,
      };
      App.emit('APP-REPORT-SET-ZHIBIAO-TOPN',param);
      // this.props.setzhibiaoTop(param);
      // App.emit('APP-REPORT-SET-FILTER',param);
    },
    _setZhibiaoDialog:function(){
      this.setState({
        open:true
      })
    },
    _onChangedText: function(evt){
      var thisVal = $(evt.target).val();
      	if (thisVal !== undefined && thisVal !== null && thisVal !== "") {
          if(thisVal<=50 && thisVal>0 ){
            this.setState({
              errorTextState:'',
              textEmpty:false
            });
          }else if(isNaN(thisVal)) {
            this.setState({
              errorTextState:'输入数字',
              textEmpty:true

            });
          }else{
            this.setState({
              errorTextState:'输入1-50之间数字',
              textEmpty:true

            });
          }
        }else{
          this.setState({
            errorTextState:'',
            textEmpty:true
          });
        }
    }

});
