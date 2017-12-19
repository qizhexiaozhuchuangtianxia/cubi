var result = {

    "categories": [{
        "category": [{
            "label": "一月"
        }, {
            "label": "二月"
        }, {
            "label": "三月"
        }, {
            "label": "四月"
        }, {
            "label": "五月"
        }, {
            "label": "六月"
        }, {
            "label": "七月"
        }, {
            "label": "八月"
        }, {
            "label": "九月"
        }, {
            "label": "十月"
        }, {
            "label": "十一月"
        }, {
            "label": "十二月"
        }]
    }],
    "dataset": null,
}

function random() {
    return parseInt(Math.random() * 10000);
}

function generateSeries(seriesName) {
    var series = {
        "seriesName": seriesName,
        "data": []
    };

    for (var i = 0; i < 12; i++) {
        series.data.push({
            "value": random()
        })
    };

    return series;
}

module.exports.generate = function() {
    
    result.dataset = [];
    var series = generateSeries('裤子');
    result.dataset.push(series);

    var series = generateSeries('衣服');
    result.dataset.push(series);

    var series = generateSeries('鞋子');
    result.dataset.push(series);

    return result;
};