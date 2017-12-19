var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('app');
var ReportStore = require('../../../stores/ReportStore');
var PagerView = require('../PagerView');
var Loading = require('../Loading');

module.exports = React.createClass({
	displayName: 'ScrollTable',

	propTypes: {
		data: React.PropTypes.object.isRequired,
		onFieldNameChanged: React.PropTypes.func,
	},

	getInitialState: function() {
		return {
			data: this.props.data,
			preTableHeight: 0 ,
		}
	},
	componentWillMount: function() {
		for (var i in this.app) {
			this.app[i].remove()
		}

	},
	app: {},
	componentDidMount: function() {
		//this.app['APP-REPORT-SEAMLESS'] = App.on('APP-REPORT-SEAMLESS', this._setPreTableHeiht);
		this._setTable();
	},

	componentWillReceiveProps: function(nextProps) {
		
		this.setState({
			data: nextProps.data
		}, this._setTable);
	},
	_setTable: function() {
		var container = this.refs['table-container'];
		$(container).dataTable(this.state.data, {
			canEditFieldName: true,
			onFieldNameChanged: this.props.onFieldNameChanged,
		});
		this._scrollBar();
		this.props.setScrollbar();
	},
	_preTableHeight: [0],
	_setPreTableHeiht: function() {
		this._preTableHeight[0] = 0;
	},
	_scrollBar: function() {
		var _this = this;
		if (!this.isMounted()) return;
		
		var tableHei = $(ReactDOM.findDOMNode(this)).find('table').height();

		$(ReactDOM.findDOMNode(this)).mCustomScrollbar({
			axis: "x",
			theme: "minimal-dark",
			scrollInertia: 500,
			autoExpandScrollbar: true,
			advanced: {
				autoExpandHorizontalScroll: false
			},
			
		});

	},

	render: function() {
		return (
			<div className="table-gundong">
				<div ref="table-container" className="table-container"></div>
			</div>
		)
	}
})