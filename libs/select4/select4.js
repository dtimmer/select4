//该组件依赖于jquery,加载该组件之前请先引入jquery文件
//该组件不支持低版本浏览器
//该组件为支持模糊匹配插件,因为整体结构与select3组件差异太大,故单独生成一个组件

/**
 * select3实例化组件
 * @param {Object} dom	初始化dom节点(唯一)
 */
function Select4(dom) {
	this._dom = dom;
	this.childNode = '<input class="select3_input" />' +
		'<div class="select3_options">' +
		'<div class="select3_scroll">' +
		'<ul></ul>' +
		'</div>' +
		'</div>';
	this.oldValue = null;
	this.selValue = [];
//	this.filter = new RegExp('');
	this.filter = '';
}

Select4.prototype.showData = function(arr) {
	var _this = this;
	var showAll = false;
	if (JSON.stringify(arr) == JSON.stringify(this.option.value)) {
		showAll = true;
	}
	$(this._dom).find('ul').empty();
	if (this.option.hasAll && showAll) {
		$(_this._dom).find('ul').append($(`<li class="all" title="ALL">ALL</li>`));
	}
//	arr = Array.from(new Set(ObjCopy(_this.selValue).filter(function(v) {
//		return v.indexOf(_this.filter) != -1;
//	}).sort(function(a, b) {
//		return a.toString().localeCompare(b.toString())
//	}).concat(arr.filter(function(v) {
//		return v.indexOf(_this.filter) != -1;
//	}).sort(function(a, b) {
//		return a.toString().localeCompare(b.toString());
//	}))));
	arr = Array.from(new Set(ObjCopy(_this.selValue).sort(function(a, b) {
		return a.toString().localeCompare(b.toString())
	}).concat(arr.sort(function(a, b) {
		return a.toString().localeCompare(b.toString());
	})).filter(function(v) {
		return v.indexOf(_this.filter) != -1;
	})));
	arr.forEach(function(v, i) {
		if (_this.option.selNum ? (i >= _this.option.selNum) : false) {
			return;
		}
		var li = $(`<li class="child_li" title="${v}">${v}</li>`);
		$(_this._dom).find('ul').append(li);
	});
	if (this.option.type == 'check') {
		$(this._dom).find('.select3_options').addClass('checks');
		var initArr = ObjCopy(_this.selValue);
		if (initArr[0] == 'ALL') {
			$(_this._dom).find('li').each(function(index, value) {
				$(this).addClass('sel');
			});
			$(_this._dom).find('.select3_input').attr('all', 'true');
		} else {
			$(_this._dom).find('li').each(function(index, value) {
				if (initArr.indexOf($(value).text()) != -1) {
					$(this).addClass('sel');
				}
			});
			var all_sel = true;
			if (JSON.stringify(_this.selValue.sort(function(a, b) {
					return a.toString().localeCompare(b.toString())
				})) != JSON.stringify(_this.option.value.sort(function(a, b) {
					return a.toString().localeCompare(b.toString())
				}))) {
				all_sel = false;
			}
			if (all_sel) {
				$(_this._dom).find('.all').addClass('sel');
			}
		}
	}
}

Select4.prototype.setOption = function(option) {
	var _this = this;
	_this.option = option;
	$(this._dom).html('');
	$(this._dom).addClass('select4');
	$(this._dom).css('position', 'relative');
	$(this._dom).append($(this.childNode));
	if (option.initValue) {
		_this.selValue = ObjCopy(option.initValue);
	}
	if (!option.type) {
		throw new Error('please set a true option!');
	}
	if (!option.value || !(option.value instanceof Array)) {
		throw new Error('option should have true values!');
	}
	this.showData(ObjCopy(option.value));
	$(this._dom).find('.select3_scroll').css('height', `${0.36 * option.value.length + 0.05}rem`);
	if(_this.option.hasAll) {
		$(this._dom).find('.select3_scroll').css('height', `${0.36 * option.value.length + 0.36 + 0.05}rem`);
	}
	$(this._dom).find('.select3_scroll').mCustomScrollbar({
		axis: "xy"
	});
	if(option.hasAll && option.value.length == option.initValue.length) {
		$(_this._dom).find('.select3_input').val('ALL');
		$(_this._dom).find('.select3_input').attr('all', 'true');
	} else {
		$(_this._dom).find('.select3_input').val(option.initValue.join(',').substr(0, 40));
		$(_this._dom).find('.select3_input').attr('all', 'false');
	}
	$(_this._dom).find('.select3_input').attr('data-data', option.initValue.join(','));
	if (option.initValue[0] == 'ALL') {
		var show_title = [];
		_this.selValue = ObjCopy(option.value);
		$(_this._dom).find('.select3_input').attr('data-data', _this.selValue.join(','));
		$(_this._dom).find('.select3_input').attr('all', 'true');
	}
	this.oldValue = JSON.stringify(option.initValue);
	//事件绑定
	$(this._dom).off();
	$(this._dom).on('click', function(e) {
		e.stopPropagation();
		if (!$(e.target).hasClass('select3_input')) {
			return;
		}
		//开始查询
		if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
			var select_value = $(_this._dom).find('.select3_input').val();
			if (_this.oldValue != select_value) {
				option.callback(select_value);
				_this.oldValue = select_value;
			}
		}
		$('.select4 .select3_options').removeClass('show');
		$('.select4 .select3_input').each(function(i, v) {
			if($(v).attr('all') == 'true') {
				$(v).removeClass('show').val('ALL');
			} else {
				$(v).removeClass('show').val($(v).attr('data-data').substr(0, 40));
			}
		})
		$(this).find('.select3_input').val('');
		$(_this._dom).find('.select3_options').addClass('show');
		$(_this._dom).find('.select3_input').addClass('show');
//		_this.filter = new RegExp('');
		_this.filter = '';
		_this.showData(ObjCopy(option.value));
	});
	$(this._dom).on('keyup', '.select3_input', function() {
//		_this.filter = new RegExp($(this).val());
		_this.filter = $(this).val();
		_this.showData(option.value.filter(function(v) {
//			return _this.filter.test(v);
			return v.indexOf(_this.filter) != -1;
		}));
	})
	$(this._dom).on('click', 'li.child_li', function(e) {
		e.stopPropagation();
		if (option.type == 'radio') {
			_this.selValue = [$(this).text()];
			$(_this._dom).find('.select3_input').attr('data-data', _this.selValue.join(','));
			if (option.autoClose) {
				if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
					var select_value = _this.selValue.join(',');
					if (_this.oldValue != select_value) {
						option.callback(select_value);
						_this.oldValue = select_value;
					}
				}
				$(_this._dom).find('.select3_input').val(_this.selValue.join(',').substr(0, 40));
				$('.select3_options').removeClass('show');
				$('.select3_input').removeClass('show');
			}
		} else {
			var temp_title = $(_this._dom).find('.select3_input').attr('data-data');
			if ($(this).hasClass('sel')) {
				$(this).removeClass('sel');
				_this.selValue.splice(_this.selValue.indexOf($(this).text()), 1);
				$(_this._dom).find('all').removeClass('all');
			} else {
				if ($(_this._dom).find('.sel').length >= option.max && !option.hasAll) {
					return;
				}
				$(this).addClass('sel');
				_this.selValue.push($(this).text());
			}
			var all_sel = true;
			if (JSON.stringify(_this.selValue.sort(function(a, b) {
					return a.toString().localeCompare(b.toString())
				})) != JSON.stringify(_this.option.value.sort(function(a, b) {
					return a.toString().localeCompare(b.toString())
				}))) {
				all_sel = false;
			}
			if (all_sel && _this.option.hasAll) {
				if (option.hasAll) {
					$(_this._dom).find('.all').addClass('sel');
					$(_this._dom).find('.select3_input').val('ALL');
					$(_this._dom).find('.select3_input').attr('all', 'true');
				}
			} else {
				$(_this._dom).find('.all').removeClass('sel');
				$(_this._dom).find('.select3_input').val(_this.selValue.join(',').substr(0, 40));
				$(_this._dom).find('.select3_input').attr('all', 'false');
			}
			$(_this._dom).find('.select3_input').attr('data-data', _this.selValue.join(','));
		}
	});
	$(this._dom).on('click', 'li.all', function(e) {
		e.stopPropagation();
		if ($(this).hasClass('sel')) {
			$(this).parent().find('li').removeClass('sel');
			$(_this._dom).find('.select3_input').val('');
			$(_this._dom).find('.select3_input').attr('data-data', '');
			_this.selValue = [];
			$(_this._dom).find('.select3_input').attr('all', 'false');
		} else {
			$(this).parent().find('li').addClass('sel');
			_this.selValue = ObjCopy(_this.option.value);
			$(_this._dom).find('.select3_input').attr('data-data', _this.selValue.join(','));
			$(_this._dom).find('.select3_input').val('ALL');
			$(_this._dom).find('.select3_input').attr('all', 'true');
		}
	});
//	$('body').off();
	$('body').on('click', function(e) {
		var select_value = $(_this._dom).find('.select3_input').attr('data-data');
		if(select_value.length && select_value.split(',').length == _this.option.value.length && _this.option.hasAll) {
			$(_this._dom).find('.select3_input').val('ALL');
			$(_this._dom).find('.select3_input').attr('all', 'true');
		} else {
			$(_this._dom).find('.select3_input').val(select_value.substr(0, 40));
			$(_this._dom).find('.select3_input').attr('all', 'false');
		}
		if ($(_this._dom).find('.select3_options').hasClass('show') && option.callback) {
			if (_this.oldValue != select_value) {
				option.callback(select_value);
				_this.oldValue = select_value;
			}
		}
		$('.select3_options').removeClass('show');
		$('.select3_input').removeClass('show');
	});
}

//select3接口
window.select4 = {
	init: function(dom) {
		if (!dom || !dom.toString().indexOf('HTMLDivElement')) {
			throw new Error('dom is not find!');
		}
		return new Select4(dom);
	}
}

//option demo
//{
//	type: radio|check,
//	initValue: initvalue,
//	value: select option,
//	max: option is check, selecked max value,
//	autoClose: option is radio, option has click, auto close,
//	callback: option is change, run it
//	isImg: value is some img has data-name to save this name
//	hasAll: true|false,
//	hasId: true|false, if true ,data and initValue should is [{name:.., id: ..}],
//	selNum: numer,if has a number, show numbers li
//}