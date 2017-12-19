/**
 * Created by Administrator on 2016-2-25.
 */
 var $ = require('jquery');
var React = require('react');
var App = require('app');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var PublicTextField = require('../common/PublicTextField');

var {
    Dialog
} = require('material-ui');
module.exports = React.createClass({
    app:{},
    getInitialState: function() {
        return {
            name:this.props.name?this.props.name:'',
            content:this.props.content?this.props.content:'',
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
        var index = 0;
        $('#wysiwyg').wysiwyg({
            position:'top-selection',
            buttons: {
                fontsize: {
                    title: 'Size',
                    image: 'icon-icwenzibianxiao24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    popup: function( $popup, $button, $editor ) {
                            var list_fontsizes = {
                                // Name : Size
                                '1': 7,
                                '2': 6,
                                '3': 5,
                                '4': 4,
                                '5': 3,
                                '6': 2,
                                '7': 1
                            };
                            var $list = $('<div/>').addClass('wysiwyg-toolbar-list')
                                                   .attr('unselectable','on');
                            $.each( list_fontsizes, function( name, size ){
                                var $link = $('<a/>').attr('href','javascript:;')
                                                    .css( 'font-size', (8 + (size * 3)) + 'px' )
                                                    .html( name )
                                                    .click(function(event){
                                                        $('#wysiwyg').wysiwyg('shell').fontSize(7).closePopup();
                                                        $('#wysiwyg').wysiwyg('container')
                                                                .find('font[size=7]')
                                                                .removeAttr("size")
                                                                .css( 'font-size', (8 + (size * 3)) + 'px' );
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           }
                    //showstatic: true,    // wanted on the toolbar
                    //showselection: true    // wanted on selection
                },
                forecolor: {
                    title: 'Text color',
                    image: 'icon-iczitiyanse24px'
                },
                bold: {
                    title: 'Bold (Ctrl+B)',
                    image: 'icon-icjiacu24px',
                    hotkey: 'b'
                },
                italic: {
                    title: 'Italic (Ctrl+I)',
                    image: 'icon-icxieti24px',
                    hotkey: 'i'
                },
                underline: {
                    title: 'Underline (Ctrl+U)',
                    image: 'icon-icxiahuaxian24px',
                    hotkey: 'u'
                },
                insertlink: index != 0 ? false : {
                    title: 'Insert link',
                    image: 'icon-ic_insert_link_black', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    showselection: false 
                },
                indent: index != 0 ? false : {
                    title: 'Indent',
                    image: 'icon-icxiangyousuojin24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                outdent: index != 0 ? false : {
                    title: 'Outdent',
                    image: 'icon-icxiangzuosuojin24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                alignleft: index != 0 ? false : {
                    title: 'Left',
                    image: 'icon-iczuoduiqi24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                alignright: index != 0 ? false : {
                    title: 'Right',
                    image: 'icon-icyouduiqi24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                aligncenter: index != 0 ? false : {
                    title: 'Center',
                    image: 'icon-icjuzhongduiqi24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                alignjustify: index != 0 ? false : {
                    title: 'Justify',
                    image: 'icon-iczuoyouduiqi24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                orderedList: index != 0 ? false : {
                    title: 'Ordered list',
                    image: 'icon-icxiangmufuhaodaishuzi24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                },
                unorderedList: index != 0 ? false : {
                    title: 'Unordered list',
                    image: 'icon-icxiangmufuhao24px', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    //showstatic: true,    // wanted on the toolbar
                    showselection: false    // wanted on selection
                }

            }
        });
        this.app['APP-DASHBOARD-SET-TEXT-REPORT'] = App.on('APP-DASHBOARD-SET-TEXT-REPORT', this._setData);
    },
    render: function(){
        return (
            <div className="dashboardView_col_content">
                <div className="report-text-edit">
                    <PublicTextField
                        style={{width:'100%'}}
                        className="textReportName"
                        floatingLabelText="标题名称"
                        defaultValue={this.state.name}
                        fullWidth={true}
                        errorText={this.state.errorText}
                        onChange={this._setName}
                    />
                    <div className="editer-line"></div>
                    <div className="editer-panel">
                        <textarea id="wysiwyg" defaultValue={this.state.content} style={{width:'100%',height:'200px'}}/>
                    </div>
                </div>
            </div>
        )
    },
    _setName:function(){
        var name = $(".textReportName").find('input').val().trim();
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
    _setData:function(){
        var _this = this;
        if(!this.state.errorText){
            this.setState({content:$("#wysiwyg").val()});
            setTimeout(function(){
                App.emit('APP-DASHBOARD-ADD-REPORT',{
                    name:_this.state.name,
                    content:_this.state.content,
                    row:_this.props.row,
                    col:_this.props.col,
                    type:'TEXT'
                })
                App.emit('APP-DASHBOARD-REPORT-EDITOR-CLOSE');
            },100)
        }
    }
});
