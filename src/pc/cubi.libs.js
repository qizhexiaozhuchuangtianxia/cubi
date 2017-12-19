var React = require('react');
var ReactDOM = require('react-dom');
var jQuery = require('jquery');
var classnames = require('classnames');
var cookie = require('cookie');
var ReactRouter = require('react-router');
var fbemitter = require('fbemitter');
var materialUI = require('material-ui');
var moment = require('moment');
var lodash = require('lodash');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var echarts = require('echarts');
require('../libs/echarts-map-china');
require('../libs/jQuery-fly/fly');
require('../libs/jQuery-fly/requestAnimationFrame');
require('../libs/jquery-easyui-1.4/plugins/jquery.parser');
require('../libs/jquery-easyui-1.4/plugins/jquery.draggable');
require('../libs/jquery-easyui-1.4/plugins/jquery.droppable');
require('../libs/wysiwyg-master/wysiwyg');
require('../libs/wysiwyg-master/wysiwyg-editor');
require('malihu-custom-scrollbar-plugin');

/* Echarts 词云图插件 */
require('echarts-wordcloud');

require("babel-polyfill");
require("react-tap-event-plugin")(); //Material-UI需要，1.0后移除

module.exports = {
	React,
	ReactDOM,
	jQuery,
	ReactRouter,
	classnames,
	fbemitter,
	cookie,
	materialUI,
	echarts,
	moment,
	lodash,
	ReactCSSTransitionGroup,
};