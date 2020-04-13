/**
 * 基础链接 window下的
 * @type {[type]}
 */
window.baseUrl = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/";
window.playUrl = location.protocol + "//sw." + location.hostname + (location.port ? ":" + location.port : "") + "/";
window.xWidth = "XMLHttpRequest";
window.clientVersion = __entire.version || "5.2.0";
window.xGame = null;
window.isSw = false;
window.isShowSw = false;

if (location.hostname.indexOf("sw.") > -1) {
	var hostname = location.hostname.replace('sw.', '');
	baseUrl = location.protocol + "//" + hostname + (location.port ? ":" + location.port : "") + "/";
	playUrl = location.protocol + "//sw." + hostname + (location.port ? ":" + location.port : "") + "/";
	isSw = true;
	isShowSw = true;
} else {
	isSw = false;
	isShowSw = false;
	if (location.hostname.indexOf("www.") > -1) {
		playUrl = location.protocol + "//" + location.hostname.replace('www.', 'sw.') + (location.port ? ":" + location.port : "") + "/";
	} else if (location.hostname.indexOf("app.") > -1) {
		playUrl = location.protocol + "//" + location.hostname.replace('app.', 'sw.') + (location.port ? ":" + location.port : "") + "/";
	} else {
		playUrl = location.protocol + "//sw." + location.hostname + (location.port ? ":" + location.port : "") + "/";
	}
}


window.addEventListener('load', function () {
	// var queryC = GetQueryString(document.referrer, 'c')
	// var queryC = document.referrer.match(/[?|&]c=([0-9]*)/)
	// var pathname = window.location.pathname
	var queryC = document.referrer.match(/[?|&]c=([1-9][0-9]{7})/)
	var currentParam = window.location.search
	var paramC = queryC && queryC[1] && currentParam !== queryC[0] ? queryC[0] : ''
	if (queryC) history.replaceState('', '', currentParam + paramC)
	// console.log(queryC)
	// var currenPathname = window.location
	// if (queryC) history.replaceState('','', '?c=' + queryC[1])
})


var getIssue = function (lotteryId) {
	var lotteryIssue = 0;
	var lotteryListIssue = Utils.getStorage('lotteryListIssue');
	if (!lotteryListIssue || lotteryListIssue.length == 0) {
		Utils.requestSyn('pc/front/lottery/luck_number.do', {}, function (data) {
			if (data.code != 0) {
				return;
			}
			var _list = data.data;
			Utils.saveStorage('lotteryListIssue', _list);
			$.each(_list, function (i, item) {
				if (parseInt(lotteryId) == item.lotteryId) {
					lotteryIssue = item.issueNum;
				}
			});
		});
	} else {
		$.each(lotteryListIssue, function (i, item) {
			if (parseInt(lotteryId) == item.lotteryId) {
				lotteryIssue = item.issueNum;
			}
		});
	}
	return lotteryIssue;
}

var getIssueItem = function (lotteryId) {
	var getItem = null;
	var lotteryListIssue = Utils.getStorage('lotteryListIssue');
	if (!lotteryListIssue) {
		Utils.requestSyn('pc/front/lottery/luck_number.do', {}, function (data) {
			if (data.code != 0) {
				return;
			}
			var _list = data.data;
			Utils.saveStorage('lotteryListIssue', _list);
			$.each(_list, function (i, item) {
				if (parseInt(lotteryId) == item.lotteryId) {
					getItem = item;
				}
			});
		});
	} else {
		$.each(lotteryListIssue, function (i, item) {
			if (parseInt(lotteryId) == item.lotteryId) {
				getItem = item;
			}
		});
	}
	return getItem;
}

var lotteryLink = function (str) {
	var link = "";
	if (str.indexOf("时时彩") > -1) {
		link = "/pc/game/ssc.html";
	} else if (str.indexOf("11选5") > -1) {
		link = "/pc/elevenGame/115.html";
	} else if (str.indexOf("快3") > -1) {
		link = "/pc/gameKs/ks.html";
	} else if (str.indexOf("幸运") > -1) {
		link = "/pc/pcdd/index.html";
	} else if (str.indexOf("3D") > -1) {
		link = "/pc/gameFtc/fc.html";
	} else if (str.indexOf("排列") > -1) {
		link = "/pc/gameFtc/pl.html";
	} else if (str.indexOf("PC") > -1) {
		link = "/pc/pcdd/index.html";
	} else if (str.indexOf("PK10") > -1) {
		link = "/pc/game/pk10.html";
	} else if (str.indexOf("时时乐") > -1) {
		link = "/pc/gameFtc/happy.html";
	} else if (str.indexOf("合彩") > -1) {
		link = "/pc/sixGame/index.html";
	} else {

	}
	return link;
}


// 保留3位小数，不够用0补充
var changeThreeDecimal = function (x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		return 0;
	}
	var f_x = Math.round(x * 1000) / 1000;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 3) {
		s_x += '0';
	}
	return s_x;
}


// 计算实际赔率
// var calcRealPrize = function (dict) {
//     // (maxPrize - minPrize) / 9 * sharecode + minPrize
//     let number = 0;
//     number = (dict.maxPrize*1 - dict.minPrize*1) / 9 * dict.shareCode*1 + dict.minPrize*1;
//     if (number < -1) {
//         return changeThreeDecimal(-1 * (Math.floor(-1 * number * 1000) / 1000));
//     } else {
//         return changeThreeDecimal(Math.floor(number * 1000) / 1000);
//     }
// }

/** e.g.
    calcRealPrize({
        minPrize: data.minPrize,
        maxPrize: data.maxPrize,
        shareCode: _isClassName(data.lotteryClassName)
    });
 */

/*工具函数*/
var Utils = {
	/*设置状态*/
	status: false,
	/*去除字符串前后空格*/
	trim: function (string) {
		console.log(string)
		return string.replace(/(^\s*)|(\s*$)/g, '');
	},

	/*是否为数值*/
	isNumber: function (value) {
		var r = /^[0-9]*$/g;
		if (r.test(value)) {
			return true;
		}
		return false;
	},

	/*清除本地储存*/
	clearStorage: function () {
		localStorage.clear();
	},

	saveStorage: function (key, obj, time) {
		// if (key == 'sessionid') {
		// 	var time = 12 * 60 * 60
		// 	var cacheExpireDate = (new Date() - 1) + time * 1000
		// 	var cacheVal = {
		// 		val: obj,
		// 		exp: cacheExpireDate
		// 	}
		// 	localStorage.setItem(key, JSON.stringify(cacheVal))
		// 	// localStorage.setItem(key, obj);
		// 	return obj;
		// }
		// var str = JSON.stringify(obj);
		// localStorage.setItem(key, str);
		// return str;
		try {
			if (!localStorage) {
				return false
			}
			// 定时，12小时后为失效存储
			if (!time || isNaN(time)) {
				time = 12 * 60 * 60
			}
			var cacheExpireDate = (new Date() - 1) + time * 1000
			var cacheVal = {
				val: obj,
				exp: cacheExpireDate
			}
			localStorage.setItem(key, JSON.stringify(cacheVal)) // 存入缓存值
			// console.log(key+":存入缓存，"+new Date(cacheExpireDate)+"到期")
		} catch (e) {}
		return obj
	},
	getStorage: function (key) {
		// if (key == 'sessionid') {
		// 	var cacheVal = localStorage.getItem(key)
		// 	var result = JSON.parse(cacheVal)
		// 	var now = new Date() - 1
		// 	if (!result) {
		// 		return null
		// 	} // 缓存不存在
		// 	if (now > result.exp) { // 缓存过期
		// 		this.remove(key)
		// 		return ''
		// 	}
		// 	return result.val
		// 	// return localStorage.getItem(key);
		// }
		// return JSON.parse(localStorage.getItem(key));
		try {
			if (!localStorage) {
				return false
			}
			var cacheVal = localStorage.getItem(key)
			var result = JSON.parse(cacheVal)
			var now = new Date() - 1
			if (!result) {
				return null
			} // 缓存不存在
			if (now > result.exp) { // 缓存过期
				//   this.remove(key)
				localStorage.removeItem(key)
				return ''
			}
			// console.log("get cache:"+key)
			return result.val
		} catch (e) {
			// this.remove(key)
			localStorage.removeItem(key)
			return null
		}
	},

	removeStorage: function (key) {
		localStorage.removeItem(key);
		if (localStorage.getItem(key)) {
			return false;
		} else {
			return true;
		}
	},

	/*切换state*/
	toggle: function (fn) {
		var _this = this;
		if (typeof fn === 'function') {
			fn(_this.status = !_this.status);
			return;
		}
		return _this.status = !_this.status;
	},

	/*验证手机号*/
	isMobile: function (phoneNum) {
		// var reg = /(^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/g;
		var reg = /^\d{11}$/g;
		if (!reg.test(phoneNum)) {
			return false;
		}
		return true;
	},

	/*验证邮箱*/
	isEmail: function (str) {
		if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(str))) {
			return false;
		}
		return true;
	},
	/*数字过万省略*/
	checkVolume: function (number) {
		if (number >= 10000) {
			return (number / 10000).toFixed(1) + ' 万';
		} else {
			return number;
		}
	},
	/*验证真实姓名*/
	isRealName: function (str) {
		str.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
		reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,15}$/;
		if (!reg.test(str)) {
			return false;
		} else {
			return true;
		}
	},
	/*验证QQ*/
	isQQ: function (str) {
		if (!(/^[1-9][0-9]{4,16}$/.test(str))) {
			return false;
		}
		return true;
	},

	/*验证微信*/
	isWechat: function (str) {
		var newReg = new RegExp('^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$')
		if ((/^[a-zA-Z\d_]{6,20}$/.test(str)) || (newReg.test(str))) {
			return true;
		}
		return false;
	},
	/*验证用户账号格式*/
	isUsername: function (str) {
		if (!(/^[a-zA-Z0-9]{4,16}$/.test(str))) {
			return false;
		}
		return true;
	},
	/*验证密码格式*/
	isPassword: function (psw) {
		if (!(/^[a-zA-Z0-9_]{6,12}$/.test(psw))) {
			return false;
		}
		return true;
	},
	/*验证微博--网址验证*/
	isWeibo: function (url) {
		var regExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
		if (url.match(regExp)) {
			return true;
		} else {
			return false;
		}
	},
	/*验证邀请格式*/
	isReferrer: function (str) {
		if (!(/^[0-9]*$/.test(str))) {
			return false;
		}
		return true;
	},
	/*是否是有效时间*/
	isValidDate: function (date) {
		return date instanceof Date && !isNaN(date.getTime());
	},
	/*查找父节点*/
	parents: function (obj) {
		if (typeof obj !== 'object') {
			throw new Error('obj is not a object')
		};
		if ((obj.hasOwnProperty('target')) && (obj.target.nodeType === 1)) {
			var target = obj.target,
				parent = target;
			for (var i = 0; i < 10; i++) {
				console.log((parent.className.indexOf(obj.parentClassName) > -1), obj.parentClassName, parent.className);
				if (parent.className.indexOf(obj.parentClassName) > -1) {
					return parent;
					break;
				}
				parent = parent.parentNode;
			}
			return parent;
		}
	},

	calcRealPrize: function (dict) {
		// console.log('经过了calcRealPrize')
		// (maxPrize - minPrize) / 9 * sharecode + minPrize
		let number = 0;
		number = (+dict.maxPrize - +dict.minPrize) / 9 * dict.shareCode + +dict.minPrize
		// console.log(number)
		return isNaN(number) ? 0 : Utils.numFixed(number, 3)
		// number = (dict.maxPrize*1000 - dict.minPrize*1000) / 9 * dict.shareCode*1 + dict.minPrize*1000;
		// if (number < -1) {
		// 	return changeThreeDecimal(-1 * (Math.floor(-1 * number) / 1000));
		// } else {
		// 	return changeThreeDecimal(Math.floor(number) / 1000);
		// }
	},

	/*从个人主页获取ID*/
	filterconcern: function (strconcern) {
		if (strconcern === "") {
			return false;
		} else {
			var str1index = String(strconcern).lastIndexOf("/");
			var str1 = String(strconcern).substr(0, str1index);
			var str2index = str1.lastIndexOf("/");
			var str3 = String(strconcern).slice(str2index + 1, str1index);
			return str3;
		}
	},
	/*从新个人主页获取ID*/
	filterurl: function (strconcern) {
		if (strconcern === "") {
			return false;
		} else {
			var str1index = String(strconcern).lastIndexOf(".");
			var str2index = String(strconcern).lastIndexOf("/");
			var str1 = String(strconcern).substring(str2index + 1, str1index);
			return str1;
		}
	},
	/*网址检测*/
	isURL: function (url) {
		var regExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
		if (url.match(regExp)) {
			return true;
		} else {
			return false;
		}
	},
	/*获取地址栏参数*/
	getUrlParam: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if (r != null) return unescape(r[2]);
		return null; //返回参数值
	},
	/*获取meta信息 description||key*/
	getmetainfo: function (name) {
		var meta = document.getElementsByTagName('meta');
		var share_desc = '';
		for (var i in meta) {
			if (typeof meta[i].name != "undefined" && meta[i].name.toLowerCase() == name) {
				share_desc = meta[i].content;
			}
		}
		return share_desc;
	},
	// 设置请求头部
	temporaryHead: function (xhr) {
		// 新版头部
		// temporary-sessionId
		var _temporary = Utils.getStorage('temporaryId') || null
		if (_temporary) {
			xhr.setRequestHeader('temporary-sessionId', _temporary);
		}
	},
	/*ajax请求，需要jquery库，异步*/
	// isOri 是否强制请求正式环境 isShowError 超时是否提示 isShowTimeout 是否提示登录超时
	request: function (url, data, fn, er, isOri, isShowError, hideShowTimeout) {
		// console.log(setSession);
		return $.ajax({
			type: "POST",
			url: (isOri) ? baseUrl + url : ((isSw) ? playUrl + url : baseUrl + url),
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json",
			timeout: 1000 * 300,
			beforeSend: function (xhr) {
				if (Utils.getStorage('sessionid')) {
					xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
				}
				Utils.temporaryHead(xhr);
				xhr.setRequestHeader("client-version", window.clientVersion);
				xhr.setRequestHeader("x-requested-with", window.xWidth);
			},
			success: function (e) {
				if (e.code >= 300 && e.code < 400) {
					Utils.removeStorage('sessionid');
					UserTool.delUserInfo();
					// if (hideShowTimeout) {
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
					localStorage.removeItem('pv');
					localStorage.removeItem('user');
					// }else {
					// 	_alert('登录超时，请重新登录!',function () {
					// 		if( window.name != 'home' ){//如果不是主页的其他页面则退出当前页面（一般是窗口）
					// 				window.close();
					// 		}
					// 			__openWin("home", "/pc/index.html");
					// 	});
					// }
					console.log(url + '：登录超时，请重新登录!');
					return;
				} else if (!(e.code == 0 || e.code == 101)) {
					// layer.msg(e.msg);
					console.log(e);
					// return;
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				} else {
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				}
			},
			error: function (message) {
				if (url.indexOf('register') > -1 && message.status === 600) {
					return _alert("输入内容含有非法字符，请重新输入~");
				}

				console.log(url + '：请求超时!');
				if (typeof er !== "function") {
					return;
				}
				er(message);
			}
		});
	},
	requestNeedTint: function (url, data, fn, er, isOri) {
		$.ajax({
			type: "POST",
			url: (isOri) ? baseUrl + url : ((isSw) ? playUrl + url : baseUrl + url),
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json",
			beforeSend: function (xhr) {
				if (Utils.getStorage('sessionid')) {
					xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
				}
				Utils.temporaryHead(xhr);
				xhr.setRequestHeader("client-version", window.clientVersion);
				xhr.setRequestHeader("x-requested-with", window.xWidth);
			},
			success: function (e) {
				if (e.code >= 300 && e.code < 400) {
					Utils.removeStorage('sessionid');
					UserTool.delUserInfo();
					_alert('登录超时，请重新登录!', function () {
						if (window.name != 'home') { //如果不是主页的其他页面则退出当前页面（一般是窗口）
							window.close();
						}
						__openWin("home", "/pc/index.html");
					});
					return;
				} else if (!(e.code == 0 || e.code == 101)) {
					console.log(e);
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				} else {
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				}
			},
			error: function (message) {
				if (url.indexOf('login') > -1 && message.status === 600) {
					return _alert("输入内容含有非法字符，请重新输入~");
				}
				_alert("请求超时");
				if (typeof er !== "function") {
					return;
				}
				er(message);
			}
		});
	},
	requestNoTint: function (url, data, fn, er,com) {
		$.ajax({
			type: "POST",
			url: (isSw) ? playUrl + url : baseUrl + url,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json",
			beforeSend: function (xhr) {
				if (Utils.getStorage('sessionid')) {
					xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
				}
				Utils.temporaryHead(xhr);
				xhr.setRequestHeader("client-version", window.clientVersion);
				xhr.setRequestHeader("x-requested-with", window.xWidth);
			},
			success: function (e) {
				if (e.code >= 300 && e.code < 400) {
					Utils.removeStorage('sessionid');
					UserTool.delUserInfo();
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				} else if (e.code == 0) {
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				} else {
					if (typeof er !== "function") {
						return;
					}
					er(e);
				}
			},
			error: function (message) {
				if (typeof er !== "function") {
					return;
				}
				er(message);
			},
			complete:function(data){
				if (typeof com !== "function") {
					return;
				}
				com(data);
			}
		});
	},
	request2: function (url, data, fn, er, isOri, isShowError, hideShowTimeout) {
		// console.log(setSession);
		$.ajax({
			type: "POST",
			url: url,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json",
			beforeSend: function (xhr) {
				if (Utils.getStorage('sessionid')) {
					xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
				}
				Utils.temporaryHead(xhr);
				xhr.setRequestHeader("client-version", window.clientVersion);
				xhr.setRequestHeader("x-requested-with", window.xWidth);
			},
			success: function (e) {
				if (e.code >= 300 && e.code < 400) {
					Utils.removeStorage('sessionid');
					UserTool.delUserInfo();
					if (hideShowTimeout) {
						if (typeof fn !== "function") {
							return;
						}
						fn(e);
					} else {
						_alert('登录超时，请重新登录!', function () {
							if (window.name != 'home') { //如果不是主页的其他页面则退出当前页面（一般是窗口）
								window.close();
							}
							__openWin("home", "/pc/index.html");
						});
					}
					return;
				} else if (!(e.code == 0 || e.code == 101)) {
					// layer.msg(e.msg);
					console.log(e);
					// return;
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				} else {
					if (typeof fn !== "function") {
						return;
					}
					fn(e);
				}
			},
			error: function (message) {
				if (!isShowError) {
					_alert("请求超时");
				}
				if (typeof er !== "function") {
					return;
				}
				er(message);
			}
		});
	},
	/* 同步ajax请求 */
	requestSyn: function (url, data, fn) {
		var result;
		$.ajax({
			type: "POST",
			url: (isSw) ? playUrl + url : baseUrl + url,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json",
			async: false,
			beforeSend: function (xhr) {
				if (Utils.getStorage('sessionid')) {
					xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
				}
				Utils.temporaryHead(xhr);
				xhr.setRequestHeader("client-version", window.clientVersion);
				xhr.setRequestHeader("x-requested-with", window.xWidth);
			},
			success: function (e) {
				if (e.code >= 300 && e.code < 400) {
					Utils.removeStorage('sessionid');
					UserTool.delUserInfo();
					return;
				} else if (!(e.code == 0 || e.code == 101)) {
					// layer.msg(e.msg);
					return;
				} else {
					if (typeof fn !== "function") {
						return;
					}
					result = fn(e);
				}
			},
			error: function (message) {
				console.log(message);
			}
		});
		return result;
	},

	handleBankCardNum: function (cardNum) {
		var account = '';
		var number = new Number(cardNum);
		var numCard = number.toString();
		if (numCard.length != 0) {
			if (numCard.length > 9) {
				account = numCard.substring(0, 4) + '****' + numCard.substring(numCard.length - 4, numCard.length);
			} else {
				account = numCard.substring(0, 1) + '****' + numCard.substring(numCard.length - 1, numCard.length);
			}
		}
		return account;
	},
	/*获取浏览器类型*/
	getUserAgentType: function () {
		var ua = navigator.userAgent;
		var isAndroid = false,
			isIos = false;
		if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) { //安卓手机
			isAndroid = true;
		} else if (ua.indexOf('iPhone') > -1) { //苹果手机
			isIos = true;
		}

		if (isAndroid) {
			return "android";
		} else if (isIos) {
			return "ios";
		} else {
			var Agents = ["Android", "iPhone",
				"SymbianOS", "Windows Phone",
				"iPad", "iPod"
			];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (ua.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			if (!flag) {
				return false;
			} else {
				return "pc";
			}
		}

	},
	// 限制输入小数点后两位
	clearNoNum: function (obj) {
		// if (typeof(Number(obj)) === "number") {
		// 	var newObj = {}
		// 	obj = newObj.value = obj
		// }
		console.log(obj)
		obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
		obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
		obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
		if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			obj.value = parseFloat(obj.value);
		}
	},
	// 限制整数
	clearNoNumInt: function (obj) {
		obj.value = obj.value.replace(/^(\-)*(\d+).*$/, '$1$2');
		if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			obj.value = parseFloat(obj.value);
		}
	},
	gt0: function (obj) {
		var singleInjection = parseInt($(obj).val());
		if (singleInjection < 1) {
			// $(obj).val(1);
			layer.msg("单注金额最小值为1");
			return
		}
		// console.log(singleInjection);
	},
	numFixed: function (num, bit) {
		if (isNaN(num)) {
			return Number(0).toFixed(bit)
		} else {
			if (bit > 0) {
				if (num.toString().indexOf('.') === -1) {
					let suffix = '.'
					for (let i = 0; i < bit; i++) {
						suffix += '0'
					}
					return num + suffix
				} else {
					const splitNum = num.toString().split('.')
					if (splitNum[1].length >= bit) {
						return splitNum[0] + '.' + splitNum[1].slice(0, bit)
					} else {
						let suffix = ''
						for (let i = 0; i < bit - splitNum[1].length; i++) {
							suffix += '0'
						}
						return splitNum[0] + '.' + splitNum[1] + suffix
					}
				}
			} else {
				return num
			}
		}
	},
	toDecimal2: function (x) {
		if (x == undefined) x = 0;
		var f = parseFloat(x);
		if (isNaN(f)) {
			return false;
		}
		var f = Math.round(x * 100) / 100;
		var s = f.toString();
		var rs = s.indexOf('.');
		if (rs < 0) {
			rs = s.length;
			s += '.';
		}
		while (s.length <= rs + 2) {
			s += '0';
		}
		return s;
	},
	kStringIsEmpty: function (str) {
		if (typeof (str) == "undefined") {
			return '';
		}
		return str;
	},
	// 获取距离当天间隔天数的时间
	getDistanceFromToday: function (distance) {
		var dd = new Date();
		dd.setDate(dd.getDate() + distance); //获取distance天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1; //获取当前月份的日期
		var d = dd.getDate();
		//判断 月
		if (m < 10) {
			m = "0" + m;
		} else {
			m = m;
		}
		//判断 日
		if (d < 10) { //如果天数<10
			d = "0" + d;
		} else {
			d = d;
		}
		return y + "-" + m + "-" + d;
	}
};

// export default Utils;
/* cookie */
var CookieUtil = {
	get: function (name) {
		var cookieName = encodeURIComponent(name) + '=',
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null,
			cookieEnd;

		if (cookieStart > -1) {
			cookieEnd = document.cookie.indexOf(';', cookieStart);

			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
		}
		return cookieValue;
	},
	set: function (key, value) {
		try {
			document.cookie = key + "=" + value;
		} catch (e) {
			console.log(e);
		}
	},
	del: function (name) {
		var _ts = CookieUtil;
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = _ts.get(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds()
		// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
				(("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/* sessionStorages */
var sessionUtil = {
	/*清除本地储存*/
	clearStorage: function () {
		sessionStorage.clear();
	},

	saveStorage: function (key, obj) {
		var str = JSON.stringify(obj);
		sessionStorage.setItem(key, str);
		return str;
	},

	getStorage: function (key) {
		var str = sessionStorage.getItem(key);
		if (str == "undefined") {
			return '';
		}
		return JSON.parse(str);
	},

};

var UserTool = {
	userInfo: "userInfo",
	isClearLocalStorage: function () {
		var currentTime = new Date().chinese().getTime(),
			endTime = Utils.getStorage('joinPcTime');
		// console.log(currentTime+'---'+endTime);
		if (endTime && endTime > 0) {
			if (currentTime > endTime) {
				localStorage.clear();
				Utils.removeStorage('joinPcTime');
				// Utils.removeStorage(UserTool.userInfo);
				Utils.removeStorage('sessionid');
				Utils.removeStorage('userInfo');
				Utils.removeStorage('commonCreateTime');
				Utils.removeStorage('warnCreateTime');
			}
		}
	},
	saveUserInfo: function (dict) {
		var _ts = this;
		if (!dict || !dict['userId']) {
			return false;
		}
		var u = {
			userId: dict['userId'],
			role: dict['role'],
			account: dict['account'],
			balance: dict['balance'],
			username: dict['username'],
			playType: dict['playType'],
			levelId: dict['levelId']
		}
		// 改不动 改不动 只能取巧
		if (dict.shareCodes !== null || dict.shareCodes !== undefined) {
			u.shareCodes = dict['shareCodes']
		}
		//存入一个有效值
		var currentTime = new Date().chinese().getTime();
		var time = currentTime + 12 * 60 * 60 * 1000;
		Utils.saveStorage('joinPcTime', time);
		return Utils.saveStorage(_ts.userInfo, u);
	},
	getUserInfo: function () {
		var _ts = this;
		return Utils.getStorage(_ts.userInfo);
	},
	getUserMes: function (str) {
		var _ts = this;
		var user = Utils.getStorage(_ts.userInfo);
		if (user) {
			return user[str];
		}
		return '';
	},
	delUserInfo: function () {
		var _ts = this;
		Utils.removeStorage(_ts.userInfo);
		Utils.removeStorage('joinPcTime');
	},
	isLogin: function (Fn) {
		var _ts = this;
		if (!Utils.getStorage("sessionid")) {
			if (typeof Fn !== "function") {
				return;
			}
			Fn(false);
		}

		Utils.request('passport/check_status.do', {}, function (res) {
			if (res.code == 0) {
				_ts.saveUserInfo(res.data);
				if (typeof Fn !== "function") {
					return;
				}
				Fn(true);
			} else {
				if (typeof Fn !== "function") {
					return;
				}
				Fn(false);
			}
		});
	}
}

//修改时区，统一东八区
Date.prototype.chinese = function() {
	var _n = this.getTime();
	var _offset = this.getTimezoneOffset() * 60 * 1000;
	var _zone = 8;
	return new Date(_n + _offset + _zone * 60 * 60 * 1000);
}

// 禁止在这里直接添加调用方法
// (function() {
// })()
// xGame = Utils.getStorage('xGame');
// console.log(xGame);
