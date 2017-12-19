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
    MenuItem
} = require('material-ui');

module.exports = React.createClass({

    displayName: 'ChartZhibiaoFilterMinMax',

    getInitialState: function() {
        var min='';
        var max='';
        var zhibiaoValue='请选择';
        var selIndexFields={};
        if(this.props.maxMin){
            zhibiaoValue=this.props.maxMin[0].name;
            // selIndexFields.name=zhibiaoValue;
            selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,this.props.indexFields);
            min=this.props.maxMin[0].value[0];
            max=this.props.maxMin[1].value[0];

        }
        var error=this._setError(min,max,zhibiaoValue);
        return {
            open:false,//this.props.open,
            min:min,
            max:max,
            error:error,
            minErrorText:null,
            maxErrorText:null,
            indexFields:this.props.indexFields,
            selIndexFields:selIndexFields,
            zhibiaoValue:zhibiaoValue
        }
    },
    componentDidMount: function() {
        App.on('APP-ZHIBIAO-MAX-DIALOG', this._setMaxDialogState);
    },

    componentWillReceiveProps: function(nextProps) {
        var min='';
        var max='';
        var zhibiaoValue='请选择';
        var selIndexFields={};
        var indexFields=nextProps.indexFields;
        if(nextProps.maxMin){
            zhibiaoValue=nextProps.maxMin[0].name;
            selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,indexFields);
            min=nextProps.maxMin[0].value[0];
            max=nextProps.maxMin[1].value[0];

        }
       var error=this._setError(min,max,zhibiaoValue);
       this.setState({
            open:false,//nextProps.open,
            indexFields:nextProps.indexFields,
            min:min,
            max:max,
            zhibiaoValue:zhibiaoValue,
            selIndexFields:selIndexFields,
            error:error,
       })
    },

    render: function() {
        var title='数据范围';
        var actions = [
          <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
        				labelText="取消"
        				rippleColor="rgba(255,255,255,0.25)"
        				hoverColor="rgba(255,255,255,0.15)"
        				onClick={ this._handleClose }/>,

      		<PublicButton
                style={{color:"rgba(0,229,255,255)"}}
        				labelText="保存"
        				rippleColor="rgba(0,229,255,0.25)"
        				hoverColor="rgba(0,229,255,0.15)"
                disabled={this.state.error}
        				onClick={(evt)=>this._handleSave(evt)}/>

            ];

        return (
            <Dialog
            title={title}
            open={this.state.open}
            onRequestClose={this._handleClose}
            actions={actions}
            contentClassName="zhiBiaoMinMaxDialog"
            actionsContainerClassName="zhibiaobottomDialog"
            repositionOnUpdate={true}>

             <div className="textFieldCont">
                <SelectField
                    autoWidth={true}
                    className='textSelsct'
                    onClick={this._updataStyle}
                    onChange = {(evt,index,value)=>this._onChartTypeChanged(evt,index,value)}
                    floatingLabelText='指标'
                    value={this.state.zhibiaoValue}
                    floatingLabelStyle = {{fontSize: '14px'}}
                    style={{width: '330px', display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>

                    {this.state.indexFields.map(this._renderZhibiaoMenu)}
                </SelectField>
                <div>
                    <PublicTextField
                      className="min-text"
                      style={{width:'150px'}}
                      floatingLabelText="最小值"
                      defaultValue={this.state.min}
                      errorText={this.state.minErrorText}
                      onChange={(evt)=>this._changeVal(evt,'min')}/>
                </div>
                <div >
                    <PublicTextField
                      className="max-text"
                     style={{width:'150px'}}
                      floatingLabelText="最大值"
                      defaultValue={this.state.max}
                      errorText={this.state.maxErrorText}
                      onChange={(evt)=>this._changeVal(evt,'max')}/>
                </div>
             </div>

            </Dialog>

        )

    },
    _renderZhibiaoMenu:function(item,key){
        return <MenuItem key={key} className='Top' value={item.name}  primaryText={item.name} className='selectItem'/>
    },
    _handleClose:function(){
        this._setOpen(false);
    },
    _changeVal:function(evt,str){
        if (!this.isMounted()) return;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        var _this=this;
        this.timer = setTimeout(function(evt) {
           var min=parseFloat($('.min-text').find('input').val());
           var max=parseFloat($('.max-text').find('input').val());
           var error=_this._setError(min,max,_this.state.zhibiaoValue);
            if(min>max && !error){// && min && max
                var errorText='最小值不能大于最大值';
                if(str=='min'){
                    _this.setState({
                        error:true,
                        minErrorText:errorText
                    })
                }else{
                    _this.setState({
                        error:true,
                        maxErrorText:errorText
                    })
                }

            }else{
                _this.setState({
                    min:min,
                    max:max,
                    error:error,
                    minErrorText:null,
                    maxErrorText:null
                })
            }
        },200);


    },
    _onChartTypeChanged:function(evt,index,val){
      if (!this.isMounted()) return;

        this.setState(function(state){
          state.selIndexFields=this.state.indexFields[index];
          state.zhibiaoValue=val;
          var error=this._setError(this.state.min,this.state.max,val);
          state.error=error;
          return state;
        })
    },
    _handleSave:function(){
        var indexType='INDEX_FIELD';
        var selIndexFields=this.state.selIndexFields;
        if(this.props.compare){
            indexType="COMPARE_INDEX_FIELD";
            selIndexFields.fieldName=selIndexFields.name;
        }
        App.emit('APP-REPORT-SET-ZHIBIAO-MAXMIN', {
            maxMin:ReportStore.creatZhiBiaoFilterFields('MaxMin',{
                min:this.state.min,
                max:this.state.max,
                indexType:indexType,
                selIndexFields:selIndexFields,
            }),
          row:this.props.row,
          col:this.props.col
        });
        // this.props.setMaxState({
        //     selIndexFields:this.state.selIndexFields,
        //     sortWay:false,
        //     min:this.state.min,
        //     max:this.state.max,
        // })
        this._setOpen(false);
    },
    _setError:function(min,max,zhibiaoValue){
        var error = false;
        if(min==='' || max ==='' || zhibiaoValue==='' || zhibiaoValue==='请选择'){
            error = true;
        }
        if(isNaN(min) || isNaN(max)){
            error = true;
        }
        return error;
    },
    _setMaxDialogState: function(arg) {
        if(this.state.open==false){
            if(this.props.row==arg.row&&this.props.col==arg.col){
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
