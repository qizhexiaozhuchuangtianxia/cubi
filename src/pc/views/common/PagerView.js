/**
 * 分页组件
 */

var React = require('react');

	var {
	FontIcon
	} = require('material-ui');

module.exports = React.createClass({
	displayName: 'PagerView',

	propTypes: {
		totalRow: React.PropTypes.number.isRequired,
		currentPage: React.PropTypes.number.isRequired,
		pageSize: React.PropTypes.number.isRequired,
	},

	getDefaultProps: function() {
		return {
			totalRow: 1,
			currentPage: 1,
			onPageTo: (index) => {
				console.log('page to ', index);
			},
		}
	},

	render: function() {

		var current = Math.max(this.props.currentPage, 1);
		var pageClassName = "page-row",papeClass="page-altogether";
		var total = Math.ceil(this.props.totalRow / this.props.pageSize);
		total = Math.max(total, 1);
		if(this.props.width<=300){
			pageClassName = "page-hide";
			papeClass = "page-hide";
		}
		if (current > total) current = total;

        // 获取每页行数, 并计算当前显示起始行 - 结束行
        let page_size    = this.props.pageSize;
        let curPageLines = ((current - 1) * page_size + 1) + " - ";

        if (current * page_size > this.props.totalRow) {
            curPageLines += this.props.totalRow;
        }
        else {
            curPageLines += current * page_size;
        }

        // 拼装翻页按钮
		var preHtml = <a className="pre-page" href="javascript:void(0)"><FontIcon className="iconfont icon-icchevronleft24px page-iconStyle" /></a>;
		var nextHtml = <a className="next-page" href="javascript:void(0)"><FontIcon className="iconfont icon-icchevronright24px page-iconStyle" /></a>;

        let firstHtml = <a className="pre-page" href="javascript:void(0)"><FontIcon className="iconfont icon-diyiye_px page-iconStyle" /></a>;
        let lastHtml = <a className="next-page" href="javascript:void(0)"><FontIcon className="iconfont icon-zuihouyiye_px page-iconStyle" /></a>;

		if (current > 1) {
			preHtml = <a href="javascript:void(0)"
				onClick={()=>this.props.onPageTo(current-1)}
				className="pre-page active"><FontIcon className="iconfont icon-icchevronleft24px page-iconStyle" /></a>;
            firstHtml = <a href="javascript:void(0)"
                           onClick={()=>this.props.onPageTo(1)}
                           className="pre-page active"><FontIcon className="iconfont icon-diyiye_px page-iconStyle" /></a>;
		}

		if (current < total) {
			nextHtml = <a href="javascript:void(0)"
			 	onClick={()=>this.props.onPageTo(current+1)}
			 	className="next-page active"><FontIcon className="iconfont icon-icchevronright24px page-iconStyle" /></a>;
            lastHtml = <a href="javascript:void(0)"
                          onClick={()=>this.props.onPageTo(total)}
                          className="next-page active"><FontIcon className="iconfont icon-zuihouyiye_px page-iconStyle"/></a>;
		}

		return (
			<div className="pager-view">
				<p className="flip-icon"><i>{firstHtml}</i><i>{preHtml}</i><i>{nextHtml}</i><i>{lastHtml}</i></p>
				<p className={papeClass}>第<span>&nbsp;{curPageLines}&nbsp;</span>行,&nbsp;共<span>&nbsp;{this.props.totalRow}&nbsp;</span>行</p>
				<p className={pageClassName}>每页行数:<span>{page_size}</span></p>
			</div>
		);
	},
})
