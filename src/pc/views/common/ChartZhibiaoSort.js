var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var PublicButton = require('./PublicButton');
var PublicButton = require('./PublicButton');
var ReportStore = require('../../stores/ReportStore');
var App = require('app');
var {
  Dialog,
  SelectField,
  MenuItem
} = require('material-ui');

module.exports = React.createClass({

    displayName: 'ChartZhibiaoSort',

    getInitialState: function() {
      var zhibiaoValue='请选择';
      var sortValue='请选择';
      var selIndexFields={};
      var sortWay=false;
      if(this.props.sortFields && this.props.sortFields.length>0){
        zhibiaoValue=this.props.sortFields[0].field;
        selIndexFields=this.props.sortFields[0];
        selIndexFields.name=zhibiaoValue;
        //selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,this.props.indexFields);
        if(this.props.sortFields[0].method=="ASC"){
          sortValue='升序';
          sortWay=-1;
        }else if(this.props.sortFields[0].method=="DESC"){
          sortValue='降序';
          sortWay=1;
        }else{
          sortValue='无排序';
        }
      }
      var error=this._setError(sortValue,zhibiaoValue);
        return {
          title: '排序',
          open: false,//this.props.open,
          labelText: '2',
          errorTextState: '',
          thisValue:"Top",
          textEmpty:false,
          zhibiaoValue:zhibiaoValue,
          sortValue: sortValue,
          indexFields:this.props.indexFields,
          selIndexFields:selIndexFields,
          sortWay:sortWay,
          error:error,
        }
    },
    componentDidMount: function() {
      App.on('APP-ZHIBIAO-SORT-DIALOG', this._setSortDialogState);
    },

    componentWillReceiveProps: function(nextProps) {
      var zhibiaoValue='请选择';
      var sortValue='请选择';
      var selIndexFields={};
      var sortWay=false;
      if(nextProps.sortFields && nextProps.sortFields.length>0){
        zhibiaoValue=nextProps.sortFields[0].field || nextProps.sortFields[0].name;
        selIndexFields=nextProps.sortFields[0];
        selIndexFields.name=zhibiaoValue;
        //selIndexFields=ReportStore.setSelIndexFields(zhibiaoValue,nextProps.indexFields);
        if(nextProps.sortFields[0].method=="ASC"){
          sortValue='升序';
          sortWay=-1;
        }else if(nextProps.sortFields[0].method=="DESC"){
          sortValue='降序';
          sortWay=1;
        }else{
          sortValue='无排序';
        }
      }
      var error=this._setError(sortValue,zhibiaoValue);
      this.setState({
        open:false,//nextProps.open,
        zhibiaoValue:zhibiaoValue,
        sortValue: sortValue,
        selIndexFields:selIndexFields,
        indexFields:nextProps.indexFields,
        sortWay:sortWay,
        error:error,
      })
    },

    render: function() {

        var action = [
            <PublicButton
                style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                onClick={this._deleteDialogClose}/>,

            <PublicButton
                style={{color:"rgba(0,229,255,255)"}}
                labelText="确定"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                disabled={this.state.error}
                onClick={(evt)=>this._SubmitColse(evt,true)}/>
        ];
        return (

            <Dialog 
              contentClassName="zhibiaoRankingDialog"
              titleClassName="zhibiaotitleNameDialog"
              actionsContainerClassName="zhibiaobottomDialog"
              title={this.state.title}
              actions={action}
              modal={false}
              open={this.state.open}
              onRequestClose={this._deleteDialogClose}>
              <div className='content'>
                <div className="chooseType">
                  <SelectField
                    autoWidth={true}
                    className='textSelsct'
                    ref='selectTest'
                    onClick={this._updataStyle}
                    value={this.state.zhibiaoValue}
                    onChange = {(evt,index,value)=>this._onChartTypeChanged(evt,index,value)}
                    floatingLabelText='指标'
                    floatingLabelStyle = {{fontSize: '14px'}}
                    style={{width: '100%', display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>

                    {this.state.indexFields.map(this._renderZhibiaoMenu)}
                  </SelectField>
                </div>
                <div className="chooseSortType">
                  <SelectField
                    ref='selectTest'
                    onClick={this._updataStyle}
                    onChange = {(evt,index,value)=>this._onSortTypeChanged(evt,index,value)}
                    floatingLabelText='顺序'
                    value={this.state.sortValue}
                    floatingLabelStyle = {{fontSize: '14px'}}
                    style={{width: '100%', display: "inline-block", verticalAlign: "bottom", color: 'rgba(255, 255, 255, 0.87)' }}>

                   <MenuItem  value="无排序"  primaryText="无排序" />
                   <MenuItem  value="升序"  primaryText="升序" />
                   <MenuItem  value="降序"  primaryText="降序" />
                  </SelectField>
                </div>
              </div>
            </Dialog>
        )

    },
    _renderZhibiaoMenu:function(item,key){
        return <MenuItem key={key}  value={item.name}  primaryText={item.name}/>
    },
    _deleteDialogClose:function(){
      this._setOpen(false);
    },
    _onChartTypeChanged:function(evt,index,val){
      if (!this.isMounted()) return;

        this.setState(function(state){
          state.selIndexFields=this.state.indexFields[index];

          state.zhibiaoValue=val;
          var error=this._setError(this.state.sortValue,val);
          state.error=error;
          return state;
        })
    },
    _onSortTypeChanged:function(evt,index,val){
      if (!this.isMounted()) return;
        this.setState(function(state){
          var sortWay=1;
          if(index==1){
            sortWay=-1;
          }else if(index==0){
            sortWay=false;
          }
          var error=this._setError(val,this.state.zhibiaoValue);
          state.error=error;
          state.sortValue=val;
          state.sortWay=sortWay;

          return state;
        })

    },
    _SubmitColse:function(){
      if (!this.isMounted()) return;
      // var inputText = this.refs.inputText.getValue();
      // var selectval = this.state.thisValue;
      var method='NORMAL';
      if(this.state.sortWay==1){
        method='DESC';
      }
      if(this.state.sortWay==-1){
        method='ASC';
      }
      App.emit('APP-REPORT-SET-ZHIBIAO-SORT', {
          sortFields:ReportStore.creatZhiBiaoFilterFields('SortFields',{
            method:method,
            selIndexFields:this.state.selIndexFields
          }),
          row:this.props.row,
          col:this.props.col
      });
      // this.props.setSortState({
      //   selIndexFields:this.state.selIndexFields,
      //   sortWay:this.state.sortWay,
      //   method:method
      // });
      this._setOpen(false);
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

    },
    _setError:function(sortValue,zhibiaoValue){
        var error = false;
        if(sortValue=='' || sortValue=='请选择' || zhibiaoValue=='' || zhibiaoValue=='请选择'){
            error = true;
        }

        return error;
    },
    _setSortDialogState: function(arg) {
      if(this.state.open ==false){
        if(this.props.row==arg.row&&this.props.col==arg.col){
          this._setOpen(arg.open);
        }else{
          this._setOpen(false);
          return;
        }
      }
    
    },
    _setOpen: function(open) {
      if (!this.isMounted()) return;
      this.setState({
        open: open,
      });
    },
});
