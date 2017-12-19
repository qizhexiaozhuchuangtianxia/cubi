var React = require('react');
var App = require('app');
var CheckEntryTextComponent = require('../common/CheckEntryTextComponent');
var PublicButton = require('../common/PublicButton');
var PublicTextField = require('../common/PublicTextField');
var {
	Dialog,
} = require('material-ui');

module.exports = React.createClass({

	displayName: 'SetReportNameView',

	propTypes: {
		open: React.PropTypes.bool,
		onOK: React.PropTypes.func,
		onCancel: React.PropTypes.func,
		reportName: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			open: false,
			onOK: (reportName) => {},
			onCancel: () => {},
			reportName:null
		}
	},

	getInitialState: function() {
		return {
			open: this.props.open,
			reportName: this.props.reportName,
			error: null,
			inputVal:this.props.reportName || ''
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.open != this.state.open) {
			this.setState({
				open: nextProps.open,
				error: null,
				reportName: nextProps.reportName,
                /* xuwenyue 分析另存为时，如果不改名无法保存的BUG修复 */
				inputVal: nextProps.reportName
			})
		}
	},

	render: function() {

		var disabledOK = this.state.error != null || this.state.reportName == null || this.state.reportName.length == 0;

		var actions = [
			<PublicButton
				style={{color:"rgba(254,255,255,0.87)"}}
				labelText="取消"
				rippleColor="rgba(255,255,255,0.25)"
				hoverColor="rgba(255,255,255,0.15)"
				onClick={this._handleClose}/>,

			<PublicButton
				style={{color:"rgba(0,229,255,255)"}}
				labelText="保存"
				rippleColor="rgba(0,229,255,0.25)"
				hoverColor="rgba(0,229,255,0.15)"
				disabled={disabledOK}
				onClick={this._handleOK}/>

		];

		return (
			<Dialog
				title="分析名称"
                contentClassName="dialogAddClassName"
	            titleClassName="dialogAddClassNameTitle"
	            bodyClassName="dialogAddClassNameBody"
	            actionsContainerClassName="dialogAddClassNameBottom"
	          	modal={true}
	          	actions={actions}
          		open={this.state.open}>
          		<PublicTextField
          			style={{width:'100%'}}
          			floatingLabelText="分析名称"
					defaultValue={this.state.reportName}
					errorText={this.state.error}
					onChange={ this._handlerReportNameChange}
					onEnterKeyDown={this._handleOK}/>
        	</Dialog>
		);
	},

	_handlerReportNameChange: function(e) {

		var input = e.target.value || '';

		input = input.trim();

		this._check(input);
		this.setState({
			inputVal:input
		})
		this.setState({
			reportName: input
		})
	},

	_check: function(thisVal) {
		thisVal = thisVal.trim();
		if (thisVal !== undefined && thisVal !== null && thisVal !== "") {
			if (CheckEntryTextComponent.checkEntryTextLegitimateHandle(thisVal)) {
				this.setState({
					error: '名称格式错误'
				})
			} else {
				if (CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) > 16) {
					this.setState({
						error: CheckEntryTextComponent.checkAllNameLengthHandle(thisVal) + ' / 16',
					})
				} else {
					this.setState({
						error: null
					})
				}
			}
		} else {
			this.setState({
				error: '名称不能为空',
			})
		}
	},

	_handleClose: function() {
		this.setState({
			open: false
		});
		this.props.onCancel();
	},

	_handleOK: function() {
		if(this.state.error == null && this.state.inputVal != ''){
			this.setState({
				open: false
			});
			this.props.onOK(this.state.reportName);
		}

	}

})
