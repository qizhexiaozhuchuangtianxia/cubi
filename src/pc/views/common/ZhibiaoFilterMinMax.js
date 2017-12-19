var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var PublicButton = require('./PublicButton');
var PublicTextField = require('./PublicTextField');
var {
    Dialog
} = require('material-ui');

module.exports = React.createClass({

    displayName: 'ZhibiaoFilterMinMax',

    getInitialState: function() {
      var disabled = true;
      if(this.props.maxMin){//this.props.zhibiaoMax,
        disabled = false;
      }
        return {
            open:this.props.open,
            min:null,
            max:null,
            error:disabled,
            minErrorText:null,
            maxErrorText:null,
            initMinMax:false,
            maxMinName:this.props.maxMinName
        }
    },
    componentDidMount: function() {

    },

    componentWillReceiveProps: function(nextProps) {
      var disabled =true;
      if(nextProps.zhibiaoMinMax){
        // 修改指标范围筛选bug
        var maxMin = this._selectedScenesMinMax(nextProps.item.name,nextProps.zhibiaoMinMax);
        if(maxMin.min && maxMin.max){
            disabled = false;
        }
      }


       this.setState({ 
            open:nextProps.open,
             error:disabled,
             min:nextProps.zhibiaoMinMax ? maxMin.min : null,
             max:nextProps.zhibiaoMinMax ? maxMin.max : null,
       })
    },

    render: function() {
        var min=null,max=null,name=this.props.item.name;
        if(this.state.initMinMax==true){
          min=this.state.min;
          max=this.state.max;
        }else{
           if(this.props.item.customName){ // 重命名指标
            // 修改指标范围筛选bug
             name = this.props.item.name
           }
           if(this.props.zhibiaoMinMax){
             var maxMin = this._selectedScenesMinMax(name,this.props.zhibiaoMinMax);
             min=maxMin.min;
             max=maxMin.max;
           }else{
             min=null;
             max=null;
           }

        }
        var item=this.props.item;
        var title=item.customName?item.customName:item.name;
        title=title+'数据范围';
        var actions = [
              <PublicButton
                  style={{color:"rgba(254,255,255,0.87)"}}
                labelText="取消"
                rippleColor="rgba(255,255,255,0.25)"
                hoverColor="rgba(255,255,255,0.15)"
                onClick={this._handleClose}/>,

            <PublicButton
                style={{color:"rgba(0,229,255,255)"}}
                labelText="保存"
                rippleColor="rgba(0,229,255,0.25)"
                hoverColor="rgba(0,229,255,0.15)"
                disabled={this.state.error}
                onClick={(evt)=>this._handleSave(evt )}/>
            ];

        return (
            <Dialog
            title={title}
            open={this.state.open}
            contentClassName="zhiBiaoMinMaxDialog"
            actionsContainerClassName="zhibiaobottomDialog"
            onRequestClose={this._handleClose}
            actions={actions}
            repositionOnUpdate={true}>

             <div className="textFieldCont">
                <div>
                    <PublicTextField
                      ref="min"
                      className="min-text"
                      style={{width:'150px'}}
                      floatingLabelText="最小值"
                      defaultValue={min}
                      errorText={this.state.minErrorText}
                      onChange={(evt)=>this._changeVal(evt,'min')}/>
                </div>
                <div>
                    <PublicTextField
                      ref="max"
                      className="max-text"
                      style={{width:'150px'}}
                      floatingLabelText="最大值"
                      defaultValue={max}
                      errorText={this.state.maxErrorText}
                      onChange={(evt)=>this._changeVal(evt,'max')}/>
                </div>
             </div>

            </Dialog>

        )

    },
    _selectedScenesMinMax:function(name,maxMin){
      var newMaxMin={};
          for(var i=0;i<maxMin.length;i++){
            if(maxMin[i].name == name){
                if(maxMin[i].operator[0]=='GE'){
                  newMaxMin.min=maxMin[i].value[0];
                }
                if(maxMin[i].operator[0]=='LE'){
                    newMaxMin.max=maxMin[i].value[0];
                }
           }
          }
          return newMaxMin;

    },
    _handleClose:function(){
        if (!this.isMounted()) return;
        var obj =[{'CloseMinMaxPopover':false}];
        this.props.CloseMinMaxPopover(obj);
        this.setState({
            open:false,
            initMinMax:false,
        })
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
            if(min>max && min && max){
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

            }else if(isNaN(min) || isNaN(max) ){
              _this.setState({

                    error:true,

                })
            }else{
                _this.setState({
                    min:min,
                    max:max,
                    error:false,
                    minErrorText:null,
                    maxErrorText:null,
                    initMinMax:true
                })
            }
        },200);


    },
    _handleSave:function(){
      var obj =[{'CloseMinMaxPopover':false}];
      this.props.CloseMinMaxPopover(obj);
      var item=this.props.item;
      var selectedScenesName=this.props.selectedScenesName;
      var indexFields=this.props.zhiBiaoindexFields;
       var type="INDEX_FIELD",dbFieldName=item.dbName,name=item.name;
       if(this.props.compare){
           type="COMPARE_INDEX_FIELD";
           if(item.customName != ''){
                name=item.customName;
                dbFieldName=item.customName;
           }
         //  dbFieldName = ReportStore.compareFilterdbFiels(indexFields,selectedScenesName,item.dbName)
       }

            var filter={
              maxMin:[
                {
                    "valueType": item.dataType,
                    "name": name,
                    "pattern": "",
                    "dbField":dbFieldName,
                    "type":type,
                    "operator": [ // 操作符：EQ（等于）,NE（不等于）,LT（小于）,LE（小于等于）,GT（大于）,GE（大于等于）
                        "GE"
                    ],
                    "value": [
                        this.state.min
                    ],
                    "items": [],
                    "selected": true
                },
                {
                    "valueType": item.dataType,
                    "name": name,
                    "pattern": "",
                    "dbField": dbFieldName,
                    "type":type,
                    "operator": [ // 操作符：EQ（等于）,NE（不等于）,LT（小于）,LE（小于等于）,GT（大于）,GE（大于等于）
                        "LE"
                    ],
                    "value": [
                        this.state.max
                    ],
                    "items": [],
                    "selected": true
                }
              ]
            };
            filter.row=this.props.row;
            filter.col=this.props.col;
            App.emit('APP-REPORT-SET-ZHIBIAO-MAXMIN', filter);

            // this.props.setZhibiaoState(filter);
            // App.emit('APP-REPORT-SET-FILTER',filter);
    }
});
