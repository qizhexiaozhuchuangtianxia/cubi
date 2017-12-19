var React = require('react');

module.exports = React.createClass({

	displayName: 'MetaDataEmpty',

	render: function() {
		return (
			<div className="metadata-empty">
				<div  className="iconfont icon-ictanhaotishi24px metadata-empty-bg"></div> 
					<div className="metadata-empty-text">当前数据为空</div>
				
				
			</div>
		)

	}
})