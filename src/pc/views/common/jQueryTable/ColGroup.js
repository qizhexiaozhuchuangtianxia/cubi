var $ = require('jquery');

function ColGroup(fileds, config) {
	this.fileds = fileds;
	this.config = {};

	if (config != null) {
		for (let i = 0; i < config.length; i++) {
			let item = config[i];
			this.config[item.name] = item;
		};
	}
}

ColGroup.prototype.build = function() {
	let $group = $('<colgroup></colgroup>');
	for (let i = 0; i < this.fileds.length; i++) {
		let field = this.fileds[i];
		let config = this.config[field.getName()];
		let $col = $('<col/>');
		var className = getColClassName(config);
		if (className) {
			$col.addClass(className);
		}
		/**
		 * 为col加上自定义宽度
		 */
		$group.append($col);
	};
	return $group;
};


function getColClassName(config) {
	if (config == null) return;
	if (config.defaultValue == 0.5) {
		return 'shizhongClass'
	} else if (config.defaultValue == 1) {
		return 'kuansongClass'
	}
}

module.exports = ColGroup;