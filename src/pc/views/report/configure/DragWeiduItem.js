/**
 * 报表维度列表
 *
 */
'use strict';
var $ = require('jquery');
var React    = require('react');
var ReactDOM = require('react-dom');
var App      = require('app');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            name: '',
            id: '',
            disabled: this.props.disabled
        }
    },

    componentDidMount: function () {
        this._dragMe()
    },

    componentDidUpdate: function () {
        this._dragMe()
    },

    render: function () {
        //<FontIcon className="iconfont icon-weiduiconsvg24 drag-icon drag-wei-icon"/>
        return (
            <div className="item item-drag" onDoubleClick={this._doubleClick}>
                <div className="item-img-box">
                    <div className="weidu-img"></div>
                </div>
                <div className="text">{this.props.name}</div>
            </div>
        )
    },

    _dragMe: function () {
        var _this = this;
        $(ReactDOM.findDOMNode(this)).draggable({
            proxy: function (source) {
                var clone = $(source).clone(true).removeAttr('data-reactid').css('z-index', 9999);
                clone.find('*').removeAttr('data-reactid');
                $(".drag-panel").html(clone);
                return clone;
            },
            /*proxy:'clone',*/
            revert: true,
            disabled: this.state.disabled,
            onStartDrag: function (e) {
                var top = $(e.target).parent().parent().offset().top;
                var left = $(e.target).parent().parent().offset().left;
                $(".drag-panel").css({left: left, top: top});
                App.emit('APP-DRAG-START-WERIDU', {
                    name: _this.props.name,
                    fieldName: _this.props.fieldName,
                    type: _this.props.type,
                    customName: '',
                    dimensionDataType: _this.props.dimensionDataType,
                    groupType: _this.props.groupType,
                    groupLevels: _this.props.groupLevels,
                    dimensionId: _this.props.dimensionId
                });
                App.emit('APP-DRAG-START-WERIDU-ROW', {
                    name: _this.props.name,
                    fieldName: _this.props.fieldName,
                    type: _this.props.type,
                    customName: _this.props.customName,
                    dimensionDataType: _this.props.dimensionDataType,
                    groupType: _this.props.groupType,
                    groupLevels: _this.props.groupLevels
                });
                App.emit('APP-DRAG-START-WERIDU-COL', {
                    name: _this.props.name,
                    fieldName: _this.props.fieldName,
                    type: _this.props.type,
                    customName: _this.props.customName,
                    dimensionDataType: _this.props.dimensionDataType,
                    groupType: _this.props.groupType,
                    groupLevels: _this.props.groupLevels
                });
            },
            onStopDrag: function () {
                App.emit('APP-DRAG-END-WERIDU');
                App.emit('APP-DRAG-END-WERIDU-COL');
                App.emit('APP-DRAG-END-WERIDU-ROW');
            }
        });
    },

    _doubleClick: function () {

        let params = {
            name: this.props.name,
            fieldName: this.props.fieldName,
            type: this.props.type,
            customName: this.props.customName,
            dimensionDataType: this.props.dimensionDataType,
            groupType: this.props.groupType,
            groupLevels: this.props.groupLevels,
            dimensionId: this.props.dimensionId
        };

        App.emit('APP-DOUBLECLICK-WEIDU'    , params);
        App.emit('APP-DOUBLECLICK-WEIDU-COL', params);
        App.emit('APP-DOUBLECLICK-WEIDU-ROW', params);
    }
});