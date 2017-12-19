var moment = require('moment');

var YYYY_MM_DD = 'YYYY-MM-DD';

const CUSTOM_DATE_RANGE = {
	value: 'CUSTOM',
	label: '自定义时间区间'
}

var DATA_RANGES = [{
	value: 'nature',
	label: '自然时间',
	isNav: true,
	children: [{
		label: '今天',
		value: 'TODAY',
		start: moment().format(YYYY_MM_DD),
		end: moment().format(YYYY_MM_DD),
	}, {
		label: '昨天',
		value: 'YESTORDAY',
		start: moment().subtract(1, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}, {
		label: '本周',
		value: 'THISWEEK',
		start: moment().startOf('isoWeek').format(YYYY_MM_DD),
		end: moment().endOf('isoWeek').format(YYYY_MM_DD),
	}, {
		label: '上周',
		value: 'LASTWEEK',
		start: moment().subtract(1, 'weeks').startOf('isoWeek').format(YYYY_MM_DD),
		end: moment().subtract(1, 'weeks').endOf('isoWeek').format(YYYY_MM_DD),
	}, {
		label: '本月',
		value: 'THISMONTH',
		start: moment().date(1).format(YYYY_MM_DD),
		end: moment().endOf('month').format(YYYY_MM_DD),
	}, {
		label: '上月',
		value: 'LASTMONTH',
		start: moment().subtract(1, 'months').startOf('month').format(YYYY_MM_DD),
		end: moment().subtract(1, 'months').endOf('month').format(YYYY_MM_DD),
	}, {
		label: '本季度',
		value: 'THISQUARTER',
		start: moment().startOf('quarter').format(YYYY_MM_DD),
		end: moment().endOf('quarter').format(YYYY_MM_DD),
	}, {
		label: '上季度',
		value: 'LASTQUARTER',
		start: moment().subtract(1, 'quarters').startOf('quarter').format(YYYY_MM_DD),
		end: moment().subtract(1, 'quarters').endOf('quarter').format(YYYY_MM_DD),
	}, {
		label: '本年度',
		value: 'THISYEAR',
		start: moment().startOf('year'),
		end: moment().endOf('year'),
	}, {
		label: '上年度',
		value: 'LASTYEAR',
		start: moment().subtract(1, 'years').startOf('year').format(YYYY_MM_DD),
		end: moment().subtract(1, 'years').endOf('year').format(YYYY_MM_DD),
	}]
}, {
	value: 'relative',
	label: '相对时间',
	isNav: true,
	children: [{
		label: '过去7天',
		value: 'LAST7DAYS',
		start: moment().subtract(7, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}, {
		label: '过去30天',
		value: 'LAST30DAYS',
		start: moment().subtract(30, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}, {
		label: '过去90天',
		value: 'LAST90DAYS',
		start: moment().subtract(90, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}, {
		label: '过去180天',
		value: 'LAST180DAYS',
		start: moment().subtract(180, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}, {
		label: '过去365天',
		value: 'LAST365DAYS',
		start: moment().subtract(365, 'days').format(YYYY_MM_DD),
		end: moment().subtract(1, 'days').format(YYYY_MM_DD),
	}]
}, CUSTOM_DATE_RANGE];

exports.dateRangeList = DATA_RANGES;

exports.customDateRange = CUSTOM_DATE_RANGE;

exports.formatDateRange = function(dateTime){
	var time = {
	    start : dateTime,
        end   : dateTime,
    };

    this.dateRangeList.map(function(list){
        if(list.children)
        list.children.map(function(children){
            if (children.value==dateTime) {
                time = {
                    start:children.start,
                    end:children.end
                }
            }
        })
    });
    return time;
};

/**
 * 根据类型，获取时间区间
 */
exports.getDateRangeByType = function(value) {
	for (var i = 0; i < DATA_RANGES.length; i++) {
		var item1 = DATA_RANGES[i];
		if (item1.value == value) return item1;

		if (item1.children) {
			for (var j = 0; j < item1.children.length; j++) {
				var item2 = item1.children[j];
				if (item2.value == value) return item2;
			}
		}
	}
};