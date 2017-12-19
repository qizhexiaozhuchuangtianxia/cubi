var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var PublicButton = require('./PublicButton');
var PublicTextField = require('./PublicTextField');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');
var {
  Dialog,
  SelectField,
  MenuItem,
} = require('material-ui');

module.exports = React.createClass({

    displayName: 'ChartZhibiaoFilterTop',

    getInitialState: function() {
      var top='';
      var zhibiaoValue='';
      var selIndexFields={};
      var topType='';

        if(this.props.topParameters){// && this.props.topParameters.length>0
          if(this.props.topParameters.length>0){
            top=this.props.topParameters[0].topn;
            zhibiaoValue=this.props.topParameters[0].field;
            // selIndexFields.name=zhibiaoValue;
            selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,this.props.indexFields);
            if(this.props.topParameters[0].method=="ASC"){
              topType='Bottom';

            }else if(this.props.topParameters[0].method=="DESC"){
              topType='Top';

            }
          }

        }
        var error=this._setError(zhibiaoValue,topType,top);

        return {
          title: '排行榜',
          open:false,//this.props.open,
          //labelText: 6,
          errorTextState: '',
          topType:topType,
          zhibiaoValue:zhibiaoValue,
          textEmpty:false,
          indexFields:this.props.indexFields,
          selIndexFields:selIndexFields,
          top:top,
          error:error,
        }
    },
    componentDidMount: function() {
        App.on('APP-ZHIBIAO-TOP-DIALOG', this._setTopDialogState);
    },

    componentWillReceiveProps: function(nextProps) {
      var top='';
      var zhibiaoValue='';
      var selIndexFields={};
      var topType='';
        if(nextProps.topParameters){
          if(nextProps.topParameters.length>0){
            top=nextProps.topParameters[0].topn;
            zhibiaoValue=nextProps.topParameters[0].field;
            //selIndexFields.name=zhibiaoValue;
            selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,nextProps.indexFields);
            if(nextProps.topParameters[0].method=="ASC"){
              topType='Bottom';

            }else if(nextProps.topParameters[0].method=="DESC"){
              topType='Top';

            }
          }
        }
        var error=this._setError(zhibiaoValue,topType,top);
      this.setState({
         open:false,//nextProps.open,
         topType:topType,
          zhibiaoValue:zhibiaoValue,
          indexFields:nextProps.indexFields,
          selIndexFields:selIndexFields,
          top:top,
          error:error,
      })
    },

    render: function() {
        // var titDisabled= false;
        // if(this.state.textEmpty){
        //   titDisabled=true
        // }
        var action = [
            <PublicButton
               style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                onClick={this._deleteDialogClose}/>,

            <PublicButton
                style={{ color:"rgba(0,229,255,255)"}}
                labelText="确定"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                disabled={this.state.error}
                onClick={(evt)=>this._SubmitColse(evt,true)}/>

        ];
        return (

            <Dialog
              contentClassName="zhibiaoRankingDialog"
              titleClassName="zhibiaotitleNameDialo"
              bodyClassName="zhibiaoBodyDialog zhibiao"
              actionsContainerClassName="zhibiaobottomDialog"
              title={this.state.title}
              actions={action}
              modal={false}
              open={this.state.open}
              onRequestClose={this._deleteDialogClose}>
              <div className='content'>
                <div className="zhibiaoName">
                    <SelectField
                      autoWidth={true}
                      className='textSelsct'
                      ref='selectzhibiaoTest'
                      onClick={this._updataStyle}
                      onChange = {(evt,index,value)=>this._onChartzhibiaoChanged(evt,index,value)}
                      floatingLabelText='指标' value={this.state.zhibiaoValue} floatingLabelStyle = {{fontSize: '14px'}} style={{width: '100%',display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>
                      {this.props.indexFields.map(this._zhibiaoName)}
                    </SelectField>
                </div>
                <div>
                  <div className="chooseType">
                    <SelectField
                      ref='selectTypeTest'
                      onClick={this._updataStyle}
                      onChange = {(evt,index,value)=>this._onChartTypeChanged(evt,index,value)}
                      floatingLabelText='类型' value={this.state.topType} floatingLabelStyle = {{fontSize: '14px'}} style={{width: '100%', display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>
                      <MenuItem className='Top' value="Top"  primaryText="Top"/>
                      <MenuItem className='Bottom' value="Bottom"  primaryText="Bottom"/>
                    </SelectField>
                  </div>
                  <div className="textCont">
                    <PublicTextField
                      defaultValue={this.state.top}
                      errorText={this.state.errorTextState}
                      onChange={(evt)=>this._onChangedText(evt)}/>
                  </div>
                </div>
              </div>
            </Dialog>
        )

    },
    _zhibiaoName:function(item,index){
        return(
          <MenuItem key={index} value={item.name}  primaryText={item.name}/>
       )


    },
    _deleteDialogClose:function(){
      this._setOpen(false);
    },
    _onChartzhibiaoChanged:function(evt,index,val){

      this.setState(function(state){
          state.selIndexFields=this.props.indexFields[index];
          state.zhibiaoValue=val;
          var error=this._setError(val,this.state.topType,this.state.top);
          state.error=error;
          return state;
        })

    },
    _onChartTypeChanged:function(evt,index,val){
        this.setState({
          topType:val,
        })
    },
    _SubmitColse:function(){
      if (!this.isMounted()) return;
      var method='NORMAL';
      var sortWay=false;
      if(this.state.topType=="Top"){
        sortWay=1;
        method='DESC';
      }else if(this.state.topType=="Bottom"){
        sortWay=-1;
        method='ASC';
      }

      App.emit('APP-REPORT-SET-ZHIBIAO-TOPN', {
            topParameters:ReportStore.creatZhiBiaoFilterFields('TopParameters',{
              method:method,   
              topn:this.state.top,
              selIndexFields:this.state.selIndexFields
            }),
            row:this.props.row,
            col:this.props.col
        });

      // this.props.setTopDialogState({
      //   selIndexFields:this.state.selIndexFields,
      //   sortWay:sortWay,
      //   topType:this.state.topType,
      //   topn:this.state.top,
      //   method:method
      // })
      this._setOpen(false);
    },

    _setZhibiaoDialog:function(){
      this.setState({
        open:true
      })
    },
    _onChangedText: function(evt){
      var thisVal = $(evt.target).val();
      var error=this._setError(this.state.zhibiaoValue,this.state.topType,thisVal);

      	if (thisVal !== undefined && thisVal !== null && thisVal !== "") {
          if(thisVal<=50 && thisVal>0 ){
            this.setState({
              errorTextState:'',
              top:thisVal,
              textEmpty:false,
              error:error,
            });
          }else if(isNaN(thisVal)) {
            this.setState({
              errorTextState:'输入数字',
              textEmpty:true,
              top:false,
              error:error,

            });
          }else{
            this.setState({
              errorTextState:'输入1-50之间数字',
              textEmpty:true,
              top:false,
              error:error,
            });
          }
        }else{

          this.setState({
            errorTextState:'',
            textEmpty:true,
            top:thisVal,
            error:error
          });
        }

    },
    _setError:function(zhibiaoValue,topType,topn){
        var error = false;
        if(topn=='' || topType=='' || zhibiaoValue=='' || zhibiaoValue=='请选择'){
            error = true;
        }

        return error;
    },
    _setTopDialogState: function(arg) {
      if(this.state.open == false){
            if(this.props.row==arg.row &&this.props.col==arg.col){
              this._setOpen(arg.open);
            }else{
              this._setOpen(false);
              return;
            }
      }else{
        this._setOpen(arg.open);
      }
    },
    _setOpen: function(open) {
      if (!this.isMounted()) return;
      this.setState({
        open: open,
      });
    },
});
