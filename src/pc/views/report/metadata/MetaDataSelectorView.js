var React = require('react');
var App = require('app');
var MetaDataHeadView = require('./MetaDataHeadView');
var MetaDataListView = require('./MetaDataListView');
var MetaDataDetailsView = require('./MetaDataDetailsView');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var BodyView = require('./BodyView');

module.exports = React.createClass({

	displayName: 'MetaDataSelectorView',

	getInitialState: function() {
		return {
			title: '我的立方',
			body: 'MetaDataListView', //MetaDataListView|MetaDataDetailsView
			metadataId: null,
			stack: [{
				metadataId: null,
				title: "我的立方"
			}], //{metadataId,title}
			bodyTransitionName: 'metadata-selector-view-body-push',
		}
	},

	componentDidMount: function() {

	},

	render: function() {

		return (
			<div className="metatada-selector-box">
				<MetaDataHeadView title={this.state.title} canBack={this.state.stack.length>1} onClickBack={this._onClickBack}/>
					<div className="metadata-selector-view-body">
						<ReactCSSTransitionGroup transitionName={this.state.bodyTransitionName} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
							{this._renderBody()}
						</ReactCSSTransitionGroup>
					</div>
			</div>
		)
	},
	_renderBody: function() {
		var body = this.state.body;
		var metadataId = this.state.metadataId;
		var key = metadataId;
		var view = null;
		if (body == 'MetaDataListView') {
			view = <MetaDataListView directoryId={metadataId} onSelected={this._handleSelectMetaData} />;
		} else if (body == 'MetaDataDetailsView') {
			view = <MetaDataDetailsView id={metadataId} btnOnClick={this._handleDetailsViewClick} />;
		}
		return <BodyView key={key}>{view}</BodyView>
	},

	_handleSelectMetaData: function(metadata) {
		var stack = this.state.stack;



		var body;
		var title =''
		if (metadata.directory == true) {
			body = "MetaDataListView";
			title = '我的立方'

		} else if (metadata.directory == false) {
			body = "MetaDataDetailsView";
			title = '立方详情'
		}
		var curStack = {
			metadataId: metadata.id,
			title: title
		};

		stack.push(curStack);

		this.setState({
			metadataId: metadata.id,
			body: body,
			stack: stack,
			title: title,
			bodyTransitionName: 'metadata-selector-view-body-push',
		});
	},

	_onClickBack: function() {
		var stack = this.state.stack;
		stack.pop();
		var last = stack.slice(-1)[0];
		this.setState({
			body: "MetaDataListView",
			metadataId: last.metadataId,
			title: last.title,
			stack: stack,
			bodyTransitionName: 'metadata-selector-view-body-pop',
		});
	},

	_handleDetailsViewClick: function(metadata) {

		var _this = this;
		App.emit('APP-REPORT-USER-CHOOSED-META-DATA', {
			weidu: metadata.weiduList,
			zhibiao: metadata.zhibiaoList,
			pingjun: metadata.zhibiao_pj_list,
			heji: metadata.zhibiao_hj_list,
			max: metadata.zhibiao_max_list,
			min: metadata.zhibiao_min_list,
			jishu: metadata.zhibiao_jishu_list,
			jisuanlie:metadata.zhibiao_jisuanlie_list,
			weidujishu:metadata.zhibiao_weidujishu_list,
			did: _this.state.metadataId,
			mid: metadata.id,
			crg: metadata.containsRegion,
			allweidu: metadata.weiduList,
			mdname: metadata.name,
			filterData:metadata.filterData
		});

		App.emit('APP-DRAWER-RIGHT-CLOSE');

	}

})
