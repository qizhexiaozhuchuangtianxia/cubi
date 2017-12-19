var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ArrowDropRight = require('material-ui/svg-icons/navigation-arrow-drop-right');
var ZhibiaoFilterMinMax = require('./ZhibiaoFilterMinMax');
var ZhibiaoFilterTop = require('./ZhibiaoFilterTop');
var {
    IconButton,
    FontIcon,
    Popover,
    MenuItem
} = require('material-ui');
module.exports = React.createClass({

    displayName: 'ZhibiaoHeadFilterList',

    getInitialState: function() {
        return {
            open:this.props.open,
            openChild:false,
            openMinMax:false,
            openTop:false,
            checked:null,
            topn:null,
            method:'DESC',
            hideFilter:this.props.hideFilter,
            sortParameters:this.props.sortParameters
        }
    },
    componentDidMount: function() {
        this._setBgColor();

    },

    componentWillReceiveProps: function(nextProps) {
       this.setState({
            open:nextProps.open,
            sortParameters:nextProps.sortParameters

       });
       this._setBgColor();
    },

    render: function() {
        var bgstyle={
            backgroundColor:'#fff',
            color: 'rgba(0, 0, 0, 0.56)'
        }
        var zhiBiaoFilterList = 'zhiBiaoFilterList';
        if(this.state.hideFilter){
            zhiBiaoFilterList='zhiBiaoFilterList hideFilter';
        }
        var sortMethod=this.props.item.sortMethod;
        var checkedIndex=0;
        if(this.props.sortName == -1){
            if(sortMethod=="ASC" && this.props.index == 0){// 升序
               checkedIndex=1;
            }
            if(sortMethod=="DESC" && this.props.index == 0){// 降序
               checkedIndex=2;
            }
        }else{
            if(sortMethod=="ASC" ){// 升序
               checkedIndex=1;
            }
            if(sortMethod=="DESC" ){// 降序
               checkedIndex=2;
            }
        }

        var items = this.props.item;
        var checkedShow=1;
        var topParameters = this.props.topParameters;
        var name = items.name;
        if(items.customName){
            // 修改指标范围筛选选中bug
              name = items.name
        }
       if( this.props.zhibiaoMinMax ){
             if( name == this.props.zhibiaoMinMax[0].name){
                   checkedShow=2;

             }
       }
        if( topParameters){
           if(items.name == topParameters[0].field){
              checkedShow=3;

           }
        }


        var MenuItemArr=[
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="无排序" insetChildren={true} checked={checkedIndex===0?true:false} onTouchTap={(evt)=>this._setSort(evt,0)}/>,
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="升序" insetChildren={true} checked={checkedIndex===1?true:false} onTouchTap={(evt)=>this._setSort(evt,1)}/>,
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="降序" insetChildren={true} checked={checkedIndex===2?true:false} onTouchTap={(evt)=>this._setSort(evt,2)}/>,
          ]
        var MenuItemArr2=[
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="无筛选" insetChildren={true} checked={checkedShow===1?true:false} onTouchTap={(evt)=>this._showDialog(evt,0)}/>,
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="筛选范围" insetChildren={true} checked={checkedShow===2?true:false}  onTouchTap={(evt)=>this._showDialog(evt,1)}/>,
            <MenuItem className="zhiBiaoFilterChild" style={bgstyle} primaryText="排行榜" insetChildren={true} checked={checkedShow===3?true:false} onTouchTap={(evt)=>this._showDialog(evt,2)}/>,
          ]

        return (

            <div className="zhiBiaoFilter">
                <Popover
                    className="zhiBiaoPopover"
                    style={bgstyle}
                    open={this.state.open}
                    anchorEl={this.props.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this._close}>
                        <MenuItem
                            onTouchTap={this._setBgColor}
                            style={bgstyle}
                            primaryText="排序"
                            rightIcon={<ArrowDropRight />}
                            className='zhiBiaoFilterList'
                            menuItems={MenuItemArr}/>
                        <MenuItem
                          style={bgstyle}
                          primaryText="筛选"
                          onTouchTap={this._setBgColor}
                          rightIcon={<ArrowDropRight />}
                          className={zhiBiaoFilterList}
                          menuItems={MenuItemArr2}/>
                </Popover>

                <ZhibiaoFilterMinMax
                open={this.state.openMinMax}
                CloseMinMaxPopover={this._CloseMinMax}
                item={this.props.item}
                zhibiaoMinMax={this.props.zhibiaoMinMax}
                setZhibiaoState={this.props.setZhibiaoState}
                compare={this.props.compare}
                zhiBiaoindexFields={this.props.zhiBiaoindexFields}
                selectedScenesName={this.props.selectedScenesName}
                row={this.props.row}
                col={this.props.col}/>

                <ZhibiaoFilterTop
                CloseTopPopover={this._CloseTop}
                open={this.state.openTop}
                item={this.props.item}
                topParameters={this.props.topParameters}
                setzhibiaoTop={this.props.setzhibiaoTop}
                compare={this.props.compare}
                row={this.props.row}
                col={this.props.col}/>
            </div>

        )

    },
    _CloseMinMax:function(arg){

        if (!this.isMounted()) return;
        this.setState({
            openMinMax:arg[0].CloseMinMaxPopover

        });
    },
    _CloseTop:function(arg){


        if (!this.isMounted()) return;
        this.setState({
            openTop:arg[0].CloseTopPopover

        });
    },
    _close:function(){
        if (!this.isMounted()) return;
        if(this.state.open){

            this.props.initPopover(false);

        }
        this.setState({
            open:!this.state.open,

        })
    },
    _closeChild:function(){

    },
    _setBgColor:function(){
        var _this=this;
        setTimeout(function(){
            var zhiBiaoFilterList=$('.zhiBiaoFilterChild');
            $(zhiBiaoFilterList).parent().parent().addClass('setBg');
            $(zhiBiaoFilterList).parent().parent().parent().addClass('setBg');
            $(zhiBiaoFilterList).parent().parent().parent().parent().parent().parent().parent().addClass('setBg');
        },10)

    },
    _setSort:function(evt,menuIndex){
        evt.stopPropagation();
        var item=this.props.item;
        var index=this.props.index;
        var method="NORMAL";
        var sortName = item.name;
        var name=  item.groupName || item.name;
        if(menuIndex==1){
            method="ASC";
        }else if(menuIndex==2){
            method="DESC";
        }else{
          menuIndex=0;
        }
        var params={
            sortFields:[{
                "field": name,
                "method": method
            }],
            sortName:name,
            dmType:item.dmType,
            row:this.props.row,
            col:this.props.col
        };
        if(menuIndex==0 && (this.props.sortFieldsIndex==this.props.index)){
            params.sortFields=false;
            params.dmType=item.dmType;
            params.sortName=null;
            App.emit('APP-REPORT-SET-ZHIBIAO-SORT',params);
            //App.emit('APP-REPORT-SET-FILTER',{'noSort':true});
        }else if((this.props.sortFieldsIndex!=this.props.index) && menuIndex==0) {
            if(this.state.open){
                this.props.initPopover(false);
            }
        }else{
            App.emit('APP-REPORT-SET-ZHIBIAO-SORT',params);
            
            //App.emit('APP-REPORT-SET-FILTER',params);
            //this.props.setSortParams(params);
        }
    },
    _showDialog:function(evt,menuIndex){
        if (!this.isMounted()) return;
        if(this.state.open){

            this.props.initPopover(false);

        }
        if(menuIndex==0){
            this.setState({
                checked:1
            })
            
            //App.emit('APP-REPORT-SET-FILTER',{'noFilter':true});
            App.emit('APP-REPORT-SET-NOPFILTER',{row:this.props.row,col:this.props.col});

        }
        if(menuIndex==1){
            this.setState({
                open:!this.state.open,
                openMinMax:!this.state.openMinMax
            })
        }
        if(menuIndex==2){
            this.setState({
                open:!this.state.open,
                openTop:!this.state.openTop
            })
        }
    }
});
// module.exports = ZhibiaoToolTip;
