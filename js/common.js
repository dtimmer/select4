//该文件内存储部分公共函数，依赖环境jquery，请在使用前加入jquery

window.Swindth = window.screen.width;
//   window.Swindth = 1366;
window.REM = Swindth / 19.2;
$('html').css('font-size', window.REM + 'px');
//document.querySelector('html').style.fontSize = window.REM + 'px';
//document.getElementsByTagName('html')[0].style.fontSize = window.REM + 'px';

//深拷贝函数
function ObjCopy(obj) {
	var tmp_obj;
	if(typeof obj == 'object') {
		if(obj instanceof Array) {
			tmp_obj = [];
		} else {
			tmp_obj = {};
		}
	} else {
		return obj;
	}
	for (var i in obj) {
		if (typeof obj[i] != 'object') {
			tmp_obj[i] = obj[i];
		} else if (obj[i] instanceof Array) {
			tmp_obj[i] = [];
			for (var j in obj[i]) {
				if (typeof obj[i][j] != 'object') {
					tmp_obj[i][j] = obj[i][j];
				} else {
					tmp_obj[i][j] = ObjCopy(obj[i][j]);
				}
			}
		} else {
			tmp_obj[i] = ObjCopy(obj[i]);
		}
	}
	return tmp_obj;
}

/**
 * @params object: 请求参数
 */
function SEQAjax(obj) {
	$.ajax(Object.assign({
		type: 'post',
		dataType: 'json',
		headers: {
			"X-CSRF-TOKEN": pageConfig.token
		}
	}, obj))
}

//解决大屏嵌套问题
//if (top !== self) {
//	window.open(window.location.href, "_blank");
//}

function zeroize(num) {
	return +num < 10 ? "0" + num : num;
};

Date.prototype.format = function(pattern, sub_time1) {
	var sub_time;
	if (typeof sub_time1 == 'undefined') {
//		sub_time = 2700000;
		sub_time = 0;
	} else {
		sub_time = sub_time1;
	}

	function zeroize(num) {
		return num < 10 ? "0" + num : num;
	};
	var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
	var thisday = new Date(this - sub_time);
	var dateObj = {
		"Y": thisday.getFullYear(),
		"M": zeroize(thisday.getMonth() + 1),
		"D": zeroize(thisday.getDate()),
		"h": zeroize(thisday.getHours()),
		"m": zeroize(thisday.getMinutes()),
		"s": zeroize(thisday.getSeconds())
	};
	return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
		switch (match) {
			case "YYYY":
				return dateObj.Y;
			case "MM":
				return dateObj.M;
			case "DD":
				return dateObj.D;
			case "hh":
				return dateObj.h;
			case "mm":
				return dateObj.m;
			case "ss":
				return dateObj.s;
		};
	});
};
Date.prototype.past = function(pattern, pastDays, sub_time1) {
	var sub_time;
	if (typeof sub_time1 == 'undefined') {
//		sub_time = 2700000;
		sub_time = 0;
	} else {
		sub_time = sub_time1;
	}

	function zeroize(num) {
		return num < 10 ? "0" + num : num;
	};
	var pastday = new Date((this - sub_time) - 1000 * 60 * 60 * 24 * pastDays);
	var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
	var dateObj = {
		"Y": pastday.getFullYear(),
		"M": zeroize(pastday.getMonth() + 1),
		"D": zeroize(pastday.getDate()),
		"h": zeroize(pastday.getHours()),
		"m": zeroize(pastday.getMinutes()),
		"s": zeroize(pastday.getSeconds())
	};
	return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
		switch (match) {
			case "YYYY":
				return dateObj.Y;
			case "MM":
				return dateObj.M;
			case "DD":
				return dateObj.D;
			case "hh":
				return dateObj.h;
			case "mm":
				return dateObj.m;
			case "ss":
				return dateObj.s;
		};
	});
};
Date.prototype.yestoday = function(pattern, sub_time1) {
	var sub_time;
	if (typeof sub_time1 == 'undefined') {
//		sub_time = 2700000;
		sub_time = 0;
	} else {
		sub_time = sub_time1;
	}
	return this.past(pattern, 1, sub_time);
};
Date.prototype.tomorrow = function(pattern, sub_time1) {
	var sub_time;
	if (typeof sub_time1 == 'undefined') {
//		sub_time = 2700000;
		sub_time = 0;
	} else {
		sub_time = sub_time1;
	}
	return this.past(pattern, -1, sub_time);
};

/**
 * 添加千分位分隔符
 * @param {number/string} s 需要转换的数字
 * @param {Boolean} type 是否处理小数位
 * 默认分割两位小数
 **/
function formatNumber(s, type) {
	var flag = false;
	if (/[-]/.test(s)) {
		s = s.toString().substring(1, s.length); //111
		flag = true;
	}
	if (s == null || s == "" || s == undefined)
		return "0";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s).replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	if (type == 0) { // 不带小数位(默认是有小数位)
		var a = s.split(".");
		var str = a[1].toString().substring(1, 2);
		if (str == "0") {
			s = a[0] + "." + a[1].toString().substring(0, 1);
		}
		if (a[1] == "00") {
			s = a[0];
		}
	}
	if (flag) {
		s = "-" + s;
	}
	if (s[s.length - 1] == ",") {
		s = s.slice(0, -1)
	}
	return s;
};

// js四舍五入自定义小数点几位函数
function round(v, e) {
	var t = 1;
	for (; e > 0; t *= 10, e--);
	for (; e < 0; t /= 10, e++);
	return Math.round(v * t) / t;
}

// js向上取整函数
function ceil(v, e) {
	var t = 1;
	for (; e > 0; t *= 10, e--);
	for (; e < 0; t /= 10, e++);
	return Math.ceil(v * t) / t;
}

// js向下取整小数点几位函数
function floor(v, e) {
	var t = 1;
	for (; e > 0; t *= 10, e--);
	for (; e < 0; t /= 10, e++);
	return Math.floor(v * t) / t;
}

//获取服务器地址及端口号
function Location() {
	//获取当前网址
	var curWwwPath = window.document.location.href;
	//获取主机地址之后的目录
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	//获取主机地址
	var localhostPaht = curWwwPath.substring(0, pos);
	//获取带"/"的项目名
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return localhostPaht + projectName;
}

//获取url地址参数
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

//form表单转换ajax提交,需加载getFormJson函数
function ajaxSubmit(frm, fn) {
	var dataPara = getFormJson(frm);
	$.ajax({
		url: frm.action,
		type: frm.method,
		data: dataPara,
		success: fn
	});
}

//将form中的值转换为键值对。
function getFormJson(frm) {
	var o = {};
	var a = $(frm).serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}

function fixTime(date, interval) { //interval间隔秒数
	var minutes = date.format("mm", 0);
	var latelyMin = minutes - (minutes % (interval / 60));
	latelyMin < 10 ? (latelyMin = "0" + latelyMin) : latelyMin;
	var latelyTime = new Date(date).format("YYYY/MM/DD hh:" + latelyMin, 0)
	return new Date(latelyTime).getTime();
};

//生成排序依据的函数
function sortby(str) {
	return function sortby(a,b){
		return b[str]-a[str];
	}
}

/**
 * 格式化数组数据为96个
 * @param {Array} data	需要格式化的数组
 */
function judgeNum(data){
	var temp = new Array(96 - data.length);
	for(var i = 0; i < 96 - data.length; i++) {
		temp[i] = '';
	}
	data = data.concat(temp);
	return data;
}

/**
 * 批量格式化时间数据
 * @param {Array} timeMark 时间戳数组
 */
function tranDate(timeMark){
	var res = [];
	for(var i = 0,len = timeMark.length; i < len ; i++){
		res.push(new Date(Number(timeMark[i]) * 1000).format('hh:mm'));
	}
	return res;
}

/*
 * //调用
 *$(document).ready(function(){
 *    $('#Form1').bind('submit', function(){
 *        ajaxSubmit(this, function(data){
 *            alert(data);
 *        });
 *        return false;
 *    });
 *});
 */
