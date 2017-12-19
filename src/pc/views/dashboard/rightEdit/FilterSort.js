var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var classnames=require('classnames');
var {
    IconButton
} = require('material-ui');

module.exports = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentWillMount: function() {
        
    },
    componentDidMount: function() {
        var _this = this;
        var isClick=this._clickState.isClick;
        var sIndex=this._clickState.sIndex;

        $(ReactDOM.findDOMNode(this)).click(function(){
            if(!isClick){
                $('.deleteIconBtn').find('button').addClass('button-add-cursor');
            }
        });

        $(ReactDOM.findDOMNode(this)).draggable({
            proxy:function(source){
                var clone = $(source).parent().parent().parent().clone(true).removeAttr('data-reactid').css({'z-index':9999,'margin-left':'-392px'});
                clone.find('*').removeAttr('data-reactid');
                $(source).parent().parent().parent().parent().append(clone);
                return clone;
            },
            revert:true,
            onBeforeDrag:function(e,source){//点击换位置
                
                App.on("APP-DASHBOARD-REPORT-FILTER-GET-DRAG-STATE",_this._filterSortClickHandle);

                var isClick=_this._clickState.isClick;
                var sIndex=_this._clickState.sIndex;
       
                
                if(sIndex==$(this).attr('data-index')){
                    _this._removeButtonCursor();
                }
                if(!isClick){

                    sIndex=$(this).attr('data-index');
                    $(this).parents('li').find('.shadow-dl').addClass('shadow-line');
                    $(this).parents('li').addClass('dragAddBorder');

                    App.emit("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE",{
                        isClick:true,
                        sIndex:sIndex
                    });  
                }else if(isClick && sIndex!=$(this).attr('data-index')){
                    var eIndex = $(this).attr('data-index');
                    App.emit('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT-CLICK',{
                        prev:sIndex,
                        next:eIndex
                    });
                    
                    _this._removeButtonCursor();
                    _this._onClickRemoveClass(this);
                    App.emit("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE",{
                        isClick:false,
                        sIndex:null
                    }); 
                    return false;
                }
                
            },
            onStartDrag:function(e){
                $(e.target).parents('li').addClass('droppableed');
            },
            onDrag:function(e,source){
                var d = e.data;
                if(d.left!=392) d.left = 392;
            },
            onStopDrag:function(e){
                $(".droppableed").removeClass('droppableed'); 

                if(!isClick){
                    $('.deleteIconBtn').find('button').addClass('button-add-cursor');
                }
            }
        }).droppable({
            onDrop:function(e,source){

                var startIndex = $(source).data('index');
                var endIndex = $(this).data('index');
                App.emit('APP-DASHBOARD-REPORT-FILTER-RIGHT-SORT',{
                    prev:startIndex,
                    next:endIndex
                });
                //恢复未点击状态
                App.emit("APP-DASHBOARD-REPORT-FILTER-DRAG-STATE",{
                    isClick:false,
                    sIndex:null
                });
                
                _this._removeButtonCursor();
                _this._onClickRemoveClass(this);
            }
        });
    },
    _clickState:{
        isClick:false,
        sIndex:null
    },
    _filterSortClickHandle:function(arg){
        this._clickState.isClick=arg.isClick;
        this._clickState.sIndex=arg.sIndex;
    },
    render:function(){
         return (
            <div className="deleteIconBtn" data-index={this.props.index}>
                <IconButton iconClassName='iconfont icon-ictuodong24px1'></IconButton>
            </div>
        );
    },
    _removeButtonCursor:function(){
        $('.deleteIconBtn').find('button').removeClass('button-add-cursor');
    }, 
    _onClickRemoveClass:function(t){
        $(t).parents('ul').find('.shadow-dl').removeClass('shadow-line');
        $(t).parents('ul').find('li').removeClass('dragAddBorder');
    }
});
