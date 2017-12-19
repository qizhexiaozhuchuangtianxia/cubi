var React = require('react');
var LoginBoxComponent = require('./views/cubi/loginBoxComponent');
module.exports = React.createClass({
	getInitialState:function(){
		return {}
	},
	componentDidMount:function(){},
	render:function(){
		return	(
			<div className="loginBody">
				<div className="loginBox">
					<LoginBoxComponent showAndHideLoginBtn={true}/>
				</div>
			</div>
		)
	}
})