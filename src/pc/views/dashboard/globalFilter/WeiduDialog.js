var React = require('react');
var App = require('app');
var Loading = require('../../common/Loading');
var DialogFiltercont = require('./DialogFiltercont');
var {
  Dialog,
  FlatButton,
  IconButton
} = require('material-ui');

module.exports = React.createClass({
	displayName:'驾驶舱全局筛选维度弹框',
	getInitialState:function(){
		return {
      open:this.props.open,
      body:'DialogFilterList',
      id:this.props.id,
      data:this.props.data,
      stack:this.props.stack,
    }
	},
	componentWillMount:function(){
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
            id:nextProps.id,
            data:nextProps.data,
            open:nextProps.open,
            body:nextProps.body,
            backId:nextProps.backId,
            stack:this.props.stack,
        });
	},
  app:{},
	componentDidMount: function() {
    this.app['APP-DIALOG-CONT-LIST'] = App.on('APP-DIALOG-CONT-LIST',this._statusFilterList);
	},
	componentWillUnmount: function() {
		for(var i in this.app){
            this.app[i].remove();
        }
	},
	render:function(){

        return (
          <div className="dialog">
          {this._DialogFilterShow()}

          </div>
        );

	},
  _statusFilterList:function(arg){
    if (!this.isMounted()) return;
    var body='DialogDetailsList';
     if(arg.body =='DialogFilterList'){
          body='DialogFilterList'
      }
    var stack=this.state.stack;
    stack.push(arg);
    this.setState({
        id: arg.id,
        body:body,
        stack:stack
    })
  },
  _DialogFilterShow:function(){
      var back=null;
     if(this.state.stack.length>1){
      back=<div className="goBackDirList">
             <IconButton
               iconClassName="iconfont icon-icarrowback24px"onTouchTap={this._handleToggle} />
           </div>
     }
    return <Dialog
           contentClassName="dialogChooseClassName"
           titleClassName="dialogChooseClassNameTitle back_title"
           bodyClassName="dialogChooseClassNameBody"
           actionsContainerClassName="dialogChooseClassNameBottom"
           modal={false}
           title={this.state.stack[this.state.stack.length-1].titleHeader}
           open={this.state.open}
           onRequestClose={this._DialogFilterClose}>
           {back}
           <DialogFiltercont row={this.props.row}  item={this.props.item} open={this.props.open}
           col={this.props.col} data={this.state.data} id={this.state.id} stack={this.state.stack}  
           body={this.state.body} filterType={this.props.filterType} dimensionId={this.props.dimensionId} 
           Weidutitle={this.props.Weidutitle} filterName={this.props.filterName} filterAliasName={this.props.filterAliasName}/>
         </Dialog>
  },
  _handleToggle:function(){
    if (!this.isMounted()) return;
    var stack=this.state.stack;
    stack.pop();
    var lastStack = stack[stack.length-1] ;
     this.setState({
        body:lastStack.body,
        id:lastStack.id,
        stack:stack
    })

  },
  _DialogFilterClose:function(){
    if (!this.isMounted()) return;
    App.emit('APP-WEIDU-CLOSE-DIALOG');
    this.setState({
        open:false
    });
  }

})
