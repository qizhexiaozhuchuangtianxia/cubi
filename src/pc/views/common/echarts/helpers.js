/**
 * helpers
 */

function createTooltipFormatter(xAxisName) {

	return function (series, ticket, callback) {

		if (series == null) return;

		if (!series.length) series = [series];
		if (series[0]) {
			var title = series[0].name;
		}
		else {
			var title = '';
		}

		var rows = '';

		for (var i = 0; i < series.length; i++) {
			var item = series[i];
			rows += `<tr><td style="color:${item.color}">${item.seriesName} ：</td><td>&nbsp;${item.value}</td></tr>`;
		}

		return (
			`<table className="echarts-tooltip"><tr className="head"><td>${xAxisName} ：</td><td>&nbsp;${title}</td></tr>${rows}</table>`
		);
	}
}

function createScrollbarLabelFormatter(xAxisLabelArr) {

	return function (index) {
		var value = xAxisLabelArr[index];
		if (value) {
			if (value.length > 11) {
				return value.substring(0, 10) + '...';
			}
			else {
				return value;
			}
		}
		else {
			return [];
		}
	}
}

function createTooltipFormatterForItem(item, xAxisName) {

	return function () {
		var row = (
			`<tr>` +
				`<td style="color:${item.color}">${item.seriesName} ：</td>` +
				`<td>&nbsp;${item.formatValue}</td>` +
			`</tr>`
		);

		return (
			`<table className="echarts-tooltip">` +
				`<tr className="head">` +
					`<td>${xAxisName} ：</td>` +
					`<td>&nbsp;${item.name}</td>` +
				`</tr>` +
				`${row}` +
			`</table>`
		);
	}
}

function createTooltipFormatterForStackItem(item, xAxisName) {

	return function () {
		var val =       item.data.value;
		var totalVal   = item.data.totalValue;
		var percentVal = Number(val / totalVal * 100).toFixed(2);

		percentVal = '(' + percentVal + '%)';

		var row = (
			`<tr>` +
				`<td style="color:${item.color}">${item.seriesName} ：</td>` +
				`<td>&nbsp;${item.formatValue}&nbsp;&nbsp;${percentVal}</td>` +
			`</tr>` +
			`<tr>` +
				`<td>${item.data.fieldsName}</td>` +
				`<td>&nbsp;${item.data.formatTotalValue}</td>` +
			`</tr>`
		);

		return (
			`<table className="echarts-tooltip">` +
				`<tr className="head">` +
					`<td>${xAxisName} ：</td>` +
					`<td>&nbsp;${item.name}</td>` +
				`</tr>` +
				`${row}` +
			`</table>`
		);
	}
}

function tooltipFormattedValueForStackItem(item) {

	var val        = item.data.value;
	var totalVal   = item.data.totalValue;
	var percentVal = '(' + Number(val / totalVal * 100).toFixed(2) + '%)';

	var row = (
		`<tr>` +
			`<td style="color:${item.color}">${item.seriesName} ：</td>` +
			`<td>&nbsp;${item.data.formatValue}&nbsp;&nbsp;${percentVal}</td>` +
		`</tr>` +
		`<tr>` +
			`<td>${item.data.fieldsName}</td>` +
			`<td>&nbsp;${item.data.formatTotalValue}</td>` +
		`</tr>`
	);

	return (
		`<table className="echarts-tooltip">` +
			`<tr className="head">` +
				`<td>${item.data.xAxisName} ：</td>` +
				`<td>&nbsp;${item.name}</td>` +
			`</tr>` +
			`${row}` +
		`</table>`
	);
}

function createTooltipFormatterForChart(dataSetArr, xAxisName) {

	return function (series, ticket, callback) {

		if (series == null) return;

		if (!series.length) series = [series];
		if (series[0]) {
			var title = series[0].name;
		}
		else {
			var title = '';
		}

		var rows = '';

		for (var i = 0; i < series.length; i++) {
			var item       = series[i];
			var seriesName = item.seriesName;
			seriesName     = seriesName.replace(/-/, " - ");

			rows += (
				`<tr><td style="color:${item.color}">${seriesName} ：</td><td>&nbsp;${dataSetArr[item.seriesIndex][item.dataIndex]}</td></tr>`
			);
		}

		return (
			`<table className="echarts-tooltip">` +
				`<tr className="head">` +
					`<td>${xAxisName} ：</td>` +
					`<td>&nbsp;${title}</td>` +
				`</tr>` +
				`${rows}` +
			`</table>`
		);
	}
}

function createTooltipFormatterForSortChart(dataSetArr, xAxisName) {

	return function (series, ticket, callback) {

		if (series == null || !xAxisName) return;
		if (!series.length) series = [series];

		if (series[0] && series[0].data) {
			var title = series[0].data.xAxisName;
		}
		else {
			return;
		}

		var rows = '';
		for (var i = 0; i < series.length; i++) {
			var item     = series[i];
			var data     = item.data;
			var dataName = data.name;
			var value    = data.value;

			if (data.formattedValue) {
				value = data.formattedValue;
			}

			dataName = dataName.replace(/-/, " - ");

			rows += `<tr><td style="color:${item.color}">${data.weiName} - </td><td style="color:${item.color}">${item.seriesName} ：</td><td>&nbsp;${value}</td></tr>`;
		}

		return (
			`<table className="echarts-tooltip">${rows}</table>`
		);
	}
}

function tooltipFormattedValueForChart(series, xAxisName) {

	if (series == null) return;
	if (!series.length) series = [series];

	if (series[0]) {
		var title = series[0].name;
	}
	else {
		var title = '';
	}

	var rows = '';

	for (var i = 0; i < series.length; i++) {
		var item = series[i];
		rows += (
			`<tr>` +
				`<td style="color:${item.color}">${item.seriesName} ：</td>` +
				`<td>&nbsp;${item.data.formatValue}</td>` +
			`</tr>`
		);
	}

	return (
		`<table className="echarts-tooltip">` +
			`<tr className="head">` +
				`<td>${xAxisName} ：</td>` +
				`<td>&nbsp;${title}</td>` +
			`</tr>` +
			`${rows}` +
		`</table>`
	);
}

function createTooltipFormatterForPercentStackItem(item, xAxisName) {

	return function () {

		var percentVal = Number(item.data.value).toFixed(2);
		percentVal = '(' + percentVal + '%)';

		var row = (
			`<tr>` +
				`<td style="color:${item.color}">${item.seriesName} ：</td>` +
				`<td>&nbsp;${item.formatValue}&nbsp;&nbsp;${percentVal}</td>` +
			`</tr>` +
			`<tr>` +
				`<td>${item.data.fieldsName}</td>` +
				`<td>&nbsp;${item.data.formatTotalValue}</td>` +
			`</tr>`
		);

		return (
			`<table className="echarts-tooltip">` +
				`<tr className="head">` +
					`<td>${xAxisName} ：</td>` +
					`<td>&nbsp;${item.name}</td>` +
				`</tr>` +
				`${row}` +
			`</table>`
		);
	}
}

function tooltipFormattedValueForPercentStackItem(item, xAxisName) {

	var percentVal = '(' + Number(item.data.value).toFixed(2) + '%)';

	return (
		`<table className="echarts-tooltip">` +
			`<tr className="head">` +
				`<td>${xAxisName} ：</td>` +
				`<td>&nbsp;${item.name}</td>` +
			`</tr>` +
			`<tr>` +
				`<td style="color:${item.color}">${item.seriesName} ：</td>` +
				`<td>&nbsp;${item.data.formatValue}&nbsp;&nbsp;${percentVal}</td>` +
			`</tr>` +
			`<tr>` +
				`<td>${item.data.fieldsName}</td>` +
				`<td>&nbsp;${item.data.formatTotalValue}</td>` +
			`</tr>` +
		`</table>`
	);
}

/**
 * 饼图Tooltip格式化
 * @param dataSetArr 格式化后数据
 * @param xAxisName
 * @returns {Function}
 */
function createPieTooltipFormatter(dataSetArr, xAxisName) {

	return function (series) {

		if (series == null) return;

		if (!series.length) series = [series];

		return (
			`<table>` +
				`<tr>` +
					`<td>${xAxisName}：</td>` +
					`<td>&nbsp;${series[0].name}</td>` +
				`</tr>` +
				`<tr>` +
					`<td>${series[0].seriesName}：</td>` +
					`<td>&nbsp;${dataSetArr[series[0].seriesIndex][series[0].dataIndex]}&nbsp;(${series[0].percent}%)</td>` +
				`</tr>` +
			`</table>`
		);
	}
}

/**
 * 饼图标签格式化
 * @param dataSetArr
 * @returns {Function}
 */
function createBarLabelFormatter(dataSetArr) {

	return function (series) {

		if (null == series) return;

		return dataSetArr[0][series.dataIndex];

	}
}

function createBarLabelFormatterForSort() {
	return function (series) {
		if (null == series) return;

		let value = series.data.value;
		if (series.data.formattedValue) {
			value = series.data.formattedValue;
		}

		return value;
	}
}

module.exports = {
	createTooltipFormatter,
	createTooltipFormatterForItem,
	createScrollbarLabelFormatter,
	createTooltipFormatterForChart,
	tooltipFormattedValueForChart,
	createTooltipFormatterForStackItem,
	tooltipFormattedValueForStackItem,
	createTooltipFormatterForPercentStackItem,
	tooltipFormattedValueForPercentStackItem,
	createTooltipFormatterForSortChart,
	createPieTooltipFormatter,
	createBarLabelFormatter,
	createBarLabelFormatterForSort,
}