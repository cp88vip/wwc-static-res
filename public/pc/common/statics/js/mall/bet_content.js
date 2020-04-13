function init_event_content() {
	$(document).on("change", "#lt_sel_modes", function (e) {
		checkNum()
	})
	$(document).on("keyup", "#lt_sel_times", function (obj) {
		checkNum()
	})
	$(document).off("mouseenter").on("mouseenter", "#lt_example", function (obj) {
		// 整理后的代码
		var _html = '<div class=ibox>'+
									'<table border=0 cellspacing=0 cellpadding=0>'+
										'<tr class=t>'+
											'<td class=tl></td>'+
											'<td class=tm></td>'+
											'<td class=tr></td>'+
										'</tr>'+
										'<tr class=mm>'+
											'<td class=ml>'+
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">'+
											'</td>'+
											'<td>' + betContentItem.layoutGameType.example + '</td>'+
											'<td class=mr>'+
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">'+
											'</td>'+
										'</tr>'+
										'<tr class=b>' +
											'<td class=bl></td>'+
											'<td class=bm>'+
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">'+
											'</td>'+
											'<td class=br> </td>'+
										'</tr>' +
									'</table>'+
									'<div class=ar>'+
										'<div class=ic></div>'+
									'</div>'+
								'</div>';
		var offset = $('#lt_example').offset();
		var left = offset.left - 27;
		var top = offset.top - 35;
		$('#lt_example').openFloat(_html, 'more', left, top);
		obj.stopPropagation();
		// 整理前
		// var $h = $('<div class=ibox><table border=0 cellspacing=0 cellpadding=0><tr class=t><td class=tl></td><td class=tm></td><td class=tr></td></tr><tr class=mm><td class=ml><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td>' + betContentItem.layoutGameType.example + '</td><td class=mr><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td></tr><tr class=b><td class=bl></td><td class=bm><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td class=br> </td></tr></table><div class=ar><div class=ic></div></div></div>'),
		// 	offset = $("#lt_example").offset(),
		// 	left = offset.left - 37,
		// 	top = offset.top - 35;
		// $("#lt_example").openFloat($h, "more", left, top), obj.stopPropagation()
	})
	$(document).off("mouseleave").on("mouseleave", "#lt_example", function (obj) {
		$("#lt_example").closeFloat();
		obj.stopPropagation();
	})
	$(document).on("mouseenter", "#lt_help", function (obj) {
		// 整理后
		var _html = '<div class=ibox>' +
									'<table border=0 cellspacing=0 cellpadding=0>' +
										'<tr class=t>' +
											'<td class=tl></td>' +
											'<td class=tm></td>' +
											'<td class=tr></td>' +
										'</tr>' +
										'<tr class=mm>' +
											'<td class=ml>' +
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">' +
											'</td>' +
											'<td>' + betContentItem.layoutGameType.info + '</td>' +
											'<td class=mr>' +
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">' +
											'</td>' +
										'</tr>' +
										'<tr class=b>' +
											'<td class=bl></td>' +
											'<td class=bm>' +
												'<img src="' + _prefixURL.common + '/img/lottery/t.gif">' +
											'</td>' +
											'<td class=br> </td>' +
										'</tr>' +
									'</table>' +
									'<div class=ar>' +
										'<div class=ic></div>' +
									'</div>' +
								'</div>' ;
		var offset = $('#lt_help').offset();
		var left = offset.left - 37;
		var top = offset.top - 35;

		$("#lt_help").openFloat(_html, "more", left, top)
		obj.stopPropagation()
		// 整理前
		// var $h = $('<div class=ibox><table border=0 cellspacing=0 cellpadding=0><tr class=t><td class=tl></td><td class=tm></td><td class=tr></td></tr><tr class=mm><td class=ml><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td>' + betContentItem.layoutGameType.info + '</td><td class=mr><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td></tr><tr class=b><td class=bl></td><td class=bm><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td class=br> </td></tr></table><div class=ar><div class=ic></div></div></div>'),
		// 	offset = $("#lt_help").offset(),
		// 	left = offset.left - 37,
		// 	top = offset.top - 35;
		// $("#lt_help").openFloat($h, "more", left, top), obj.stopPropagation()
	})
	$(document).on("mouseleave", "#lt_help", function (obj) {
		$("#lt_help").closeFloat();
		obj.stopPropagation();
	})
}

function changeSelNum(e) {
	console.log(e)
	changeNoCss(e);
	$("li[class^='dxjoq']", $(e).closest("div[class='gd']")).attr("class", "dxjoq");
}

function selectNum(obj, isButton) {
	if ($.trim($(obj).attr("class")) == 'on') {
		return;
	}
	$(obj).attr("class", "on");
	place = Number($(obj).attr("name").replace("lt_place_", ""));
	var number = $.trim($(obj).html());
	//替换号码中的无用字符
	number = number.replace(/\<span.*\<\/span>/gi, "").replace(/\r\n/gi, "");
	number = number.replace(/\<div.*>(.*)\<\/div>/gi, "$1").replace(/\r\n/gi, "");
	//胆拖玩法
	if (betContentItem.isDanTuo) {
		if (data_sel[0].length + 1 >= betContentItem.danTuoLength && place == 0) {
			var lastnumber = data_sel[0][data_sel[0].length - 1];
			$.each($('div[name="lt_place_0"][class="on"]'), function (i, n) {
				if ($(this).html() == lastnumber) {
					$(this).attr("class", "");
					data_sel[0] = $.grep(data_sel[0], function (n, i) {
						return n == lastnumber;
					}, true);
				}
			});
		}
		var unplace = 1 - place;
		if (data_sel[unplace].length > 0 && (data_sel[unplace].indexOf(number) > -1)) {
			$.each($('div[name="lt_place_' + unplace + '"][class="on"]'), function (i, n) {
				if ($(this).html() == number) {
					$(this).attr("class", "");
					data_sel[unplace] = $.grep(data_sel[unplace], function (n, i) {
						return n == number;
					}, true);
				}
			});
		}
	}
	// 二同号 - 两行
	if (betContentItem.isSingTwo) {
		var unplace = 1 - place;
		var newNumber = (number.length == 1) ? number + number : number.substr(0, 1);
		if (data_sel[unplace].length > 0 && data_sel[unplace].indexOf(newNumber) > -1) {
			$.each($('div[name="lt_place_' + unplace + '"][class="on"]'), function (i, n) {
				if ($(this).html() == newNumber) {
					$(this).attr("class", "");
					data_sel[unplace] = $.grep(data_sel[unplace], function (n, i) {
						return n == newNumber;
					}, true);
				}
			});
		}
	}

	// 最大值  -- 一般只针对一行的
	if (betContentItem.isHaveMaxSelNum > 0 && data_sel.length == 1) {
		var selSum = 0;
		$.each(data_sel, function (i, arr) {
			selSum += arr.length;
		});
		if (selSum >= betContentItem.isHaveMaxSelNum) {
			// _alert('最多选择'+betContentItem.isHaveMaxSelNum+'个号码!');
			//去掉第一个
			var oneNumber = data_sel[place][0];
			$.each($('div[name="lt_place_' + place + '"][class="on"]'), function (i, n) {
				var disNumber = '';
				if ($(n).html().indexOf('<span') > -1) {
					disNumber = $(n).html().split('<span')[0];
				} else {
					disNumber = $(n).html();
				}
				if (disNumber == oneNumber) {
					$(n).attr("class", "");
				}
			});
			data_sel[0].shift();
		}
	}

	data_sel[place].push(number); //加入到数组中
	console.log('data_sel:' + data_sel);
	if (!isButton) { //如果不是按钮触发则进行统计，按钮的统一进行统计
		var numlimit = parseInt(betContentItem.layoutGameType.maxSel); //???
		console.log("////////不是按钮触发？///////");
		// console.log(numlimit);
		if (numlimit > 0) {
			if (data_sel[place].length > numlimit) {
				$.each($(obj).parent().find("div[name^='lt_place_']"), function (i, n) {
					unSelectNum(n, false);
				});
				selectNum(obj, false);
			}
		}
		checkNum();
	}
};

function unSelectNum(obj, isButton) {
	if ("on" == $.trim($(obj).attr("class"))) {
		$(obj).attr("class", ""), place = Number($(obj).attr("name").replace("lt_place_", ""));
		var number = $.trim($(obj).html());
		number.indexOf("<span") && (number = number.split("<span")[0]), data_sel[place] = $.grep(data_sel[place], function (n, i) {
			return n == number
		}, !0), isButton || checkNum()
	}
}

function changeNoCss(obj) {
	"on" == $.trim($(obj).attr("class")) ? unSelectNum(obj, !1) : selectNum(obj, !1)
}

function selectOdd(obj) {
	if (parseInt($(obj).html()) % 2 == 1) {
		// console.log($(obj).html());
		selectNum(obj, true);
	} else {
		unSelectNum(obj, true);
	}
};

function selectEven(obj) {
	parseInt($(obj).html()) % 2 == 0 ? selectNum(obj, !0) : unSelectNum(obj, !0)
}

function selectBig(i, obj) {
	i >= betContentItem.noBigIndex ? selectNum(obj, !0) : unSelectNum(obj, !0)
}

function selectSmall(i, obj) {
	i < betContentItem.noBigIndex ? selectNum(obj, !0) : unSelectNum(obj, !0)
}

function selectRandom() {
	var layout = (betContentItem.playId, betContentItem.layoutGameType),
		btns = $("#lt_selector .gd").find("div").not(".single-odds-div");
	// console.log( $("#lt_selector .gd").find("div").not(".single-odds-div") );
	if (betContentItem.isDragonTiger) {
		var rownumbers = layout.layout[0].numbers.split(',');
		var number = Math.floor(Math.random() * rownumbers.length);
		console.log('随机数' + number);
		data_sel[0].push(rownumbers[number].replace('|', 'vs')),
			checkNum(),
			clickAddBetOrder()
	} else {
		0 == btns.length && (btns = $("#lt_selector .gdts").find("div").not(".single-odds-div")), btns.each(function (i) {
			$(this).hasClass("on") && unSelectNum($(this), !1)
		}), randomChoose.do(btns, layout, function (btns, layout) {
			btns.each(function (e) {
				if ($(this).hasClass("on")) {
					var obj = this,
						name = $(obj).attr("name");
					name && (place = Number(name.replace("lt_place_", "")));
					var number = $.trim($(obj).html());
					number = number.replace(/\<span.*\<\/span>/gi, "").replace(/\r\n/gi, ""), number = number.replace(/\<div.*>(.*)\<\/div>/gi, "$1").replace(/\r\n/gi, ""), data_sel[place].push(number), console.log("data_sel" + data_sel), checkNum()
				}
			})
		}), clickAddBetOrder()
	}
}

function randomOneZhu() {
	$("#lt_sel_nums").html() > 0 ? $.confirm(lot_lang.am_s38, function () {
		selectRandom()
	}, function () {
		clickAddBetOrder()
	}, "", 350) : selectRandom()
}

function randomFiveZhu() {
	if ($("#lt_sel_nums").html() > 0) $.confirm(lot_lang.am_s38, function () {
		for (var j = 0; j < 5; j++) selectRandom()
	}, function () {
		clickAddBetOrder()
	}, "", 350);
	else {
		for (var j = 0; j < 5; j++) {
			selectRandom()
		}
	}
}

function checkNum() {
	var modeIndex = 0;
	$.each($(".choose-money").find("li"), function (i, n) {
		$(n).hasClass("on") && (modeIndex = i)
	});
	var nums = 0,
		gdh = (betContentItem.playId, $(".gds").length),
		al = algorithms.switch(betContentItem.layoutGameType.lotteryClassName),
		methodName = betContentItem.layoutGameType.lotteryMethodName;
	if (1 == gdh || betContentItem.isDragonTiger) var selArr = data_sel[0];
	else var selArr = data_sel;
	var times = parseInt($("#lt_sel_times").val(), 10);
	isNaN(times) && (times = 0, $("#lt_sel_times").val(0)), nums = al.calculate(methodName, selArr);
	var money = Math.round(times * nums * (1e3 * modes[modeIndex].rate)) / 1e3;
	money = isNaN(money) ? 0 : money, $("#lt_sel_nums").html(nums), $("#lt_sel_money").html(money)
}

function clearRecordList() {
	recordList = []
}

function clickAddBetOrder() {
	console.log("选择了" + data_sel + "新增");
	var single = parseInt($("#lt_sel_times").val(), 10);
	if (single == 0) {
		layer.msg("单注金额最小值为1");
		checkNum();
		return;
	}
	var nums = parseInt($("#lt_sel_nums").html(), 10);
	if (0 == nums) return void _alert("请选择投注号码");
	var modeIndex = 0;
	if ($.each($(".choose-money").find("li"), function (i, n) {
			$(n).hasClass("on") && (modeIndex = i)
		}), nums > 1e3) return _alert("一次性投注禁止超过1000注，请减少注数！"), !1;
    creatRecordItem(nums, modes[modeIndex].name),
    cleanSelNumbers(),
    checkNum(),
    cleanTraceIssue()
}

function cleanSelNumbers() {
	for (i = 0; i < data_sel.length; i++) data_sel[i] = [];
	$("div", $("#lt_selector")).filter(".on").removeClass("on"), $("li[class^='dxjoq']", $("#lt_selector")).attr("class", "dxjoq")
	$("span", $("#longhu")).filter(".lhact").removeClass("lhact")
}

function creatRecordItem(zhuNumber, mode) {
    // 新建一条投注单，要把返利去掉
	var sel_prize = 0,
        sel_point = 1;
	// if (void 0 == $("#sliderSpanStart")) return $.alert(lot_lang.am_s27), !1;
	// var sel_dy = $("#sliderSpanStart").html(),
	// 	selPrize = $("#sliderSpanEnd").html();
	// if (sel_dy = sel_dy.split("%"), void 0 == sel_dy[0]) return $.alert(lot_lang.am_s27), !1;
	// sel_dy[0] = sel_dy[0] / 100, sel_prize = selPrize, sel_point = Number(sel_dy[0]).toFixed(3);
	var item = {};
    item.selArr = data_sel.slice(),
    item.zhuNumber = zhuNumber,
    item.zhuAllMoney = Utils.toDecimal2(parseFloat($("#lt_sel_money").html())),
    item.singleZhuMoney = parseInt($("#lt_sel_times").val(), 10),
    item.odds = sel_prize,
    item.rebate = sel_point,
    item.mode = mode,
    item.bigPlayType = betContentItem.bigPlayType,
    item.smallPlayType = betContentItem.layoutGameType,
    item.layoutGameType = betContentItem.layoutGameType,
    betLottoryRecord.bigPlayType = betContentItem.bigPlayType,
    betLottoryRecord.smallPlayType = betContentItem.layoutGameType,
    betLottoryRecord.layoutGameType = betContentItem.layoutGameType,
    recordList.push(item);
	var addList = recordList.slice();
    betLottoryRecord.addItems(addList);

}

function getLayoutRows(layout) {
	if ("prizes" != layout.hasOwnProperty) return [];
	var rowNums = layout.numbers.split("|"),
		rowOddArr = [];
	layout.prizes.length > 0 && -1 != layout.prizes.match("|") && (rowOddArr = layout.prizes.split("|"));
	var rowItems = [];
	return $each(rowNums, function (j, m) {
		var item = {};
		item.selTitle = m, item.disOdds = rowOddArr[j], rowItems.push(item)
	}), rowItems
}

function conversionLayout(layout) {
	return layout
}
var calcOddsByOneLayout = function(layout, inx) { //只单项的layout，全局的maxprize不计算，inx是索引
    var _pvList = Utils.getStorage('pv'); // 检验是否登录
    if (layout.maxPrizes && _pvList) {
        var maxArr = layout.maxPrizes.split("|");
        var prizeArr = layout.prizes.split("|");
        return Utils.calcRealPrize({
            minPrize: prizeArr[inx],
            maxPrize: maxArr[inx],
            shareCode: ShareCode.code
        });
    } else {
        return "";
    }
}
var calcOddsByWholeLayout = function(layout) { //只对全局的的layout
    var _pvList = Utils.getStorage('pv'); // 检验是否登录
    if (layout && _pvList) {
        return Utils.calcRealPrize({
            minPrize: layout.minPrize,
            maxPrize: layout.maxPrize,
            shareCode: ShareCode.code
        });
    } else {
        return "";
    }
}
/** 另起一个方法，获取sharecode，页面加载的时候默认计算 */
var ShareCode = (function(){
    var _returnObj = {
        code: 0,
        shareList: [],
    }
    var _pvList = Utils.getStorage('pv');
    if (_pvList) {
        _returnObj.shareList = _pvList;
        _returnObj.setShare = function(className) {
            for (var i = 0; i < _pvList.length; i++) {
                var _each = _pvList[i];
                // 调整上海时时彩名字
                if (className.indexOf("FrequentHappy") > -1 || className.indexOf("ArrangeThree") > -1 || className.indexOf("ThreeD") > -1) {
                    className = 'Three'
                } else if (className.indexOf("Luck") > -1) {
					// 调整幸运28名字
					className = 'PCEggs'
				}
				if (className.indexOf('ThreeMinute') > -1) {
					className = className.replace('ThreeMinute', '');
				}
				if (className.indexOf(_each.lotteryClassName) > -1) {
					if (className.indexOf('Three') > -1 && className.indexOf('QuickThree') == -1) {
						_returnObj.code = _each.share;
						break;
					} else if (className.indexOf('QuickThree') > -1) {
						_returnObj.code = _each.share;
						break;
					} else {
						_returnObj.code = _each.share;
					}
					// break;
                }
            }
            return _returnObj.code;
        }
        _returnObj.calcOdds = function(minPrize, maxPrize) {
            //只单项的layout，全局的maxprize不计算，inx是索引
            minPrize = minPrize ? minPrize : 0;
            maxPrize = maxPrize ? maxPrize : 0;
            return Utils.calcRealPrize({
                minPrize: minPrize,
                maxPrize: maxPrize,
                shareCode: 0
            });
        }
    } else {
        // _alert("请登录后再操作本页面~");
        _returnObj.setShare = function() {
            _returnObj.code = 0;
            return _returnObj.code;
        }
    }

    return _returnObj;
})();
// 这tm是什么，当前页面的配置信息？
var betContentItem = {
	bigPlayType: null,
	layoutGameType: null,
	lotteryTitle: "",
	lotteryId: "",
	palyId: "",
	lotteryClassName: "",
	noBigIndex: 0,
	bigMaxSel: 0,
	price_unit: 2,
	isDanTuo: !1,
	danTuoLength: 0,
	isHaveMaxSelNum: 0,
	isSingTwo: !1,
	isDragonTiger: !1
};

window.modes = [{
	name: "元",
	rate: 1
}, {
	name: "角",
	rate: .1
}, {
	name: "分",
	rate: .01
}], window.oneissuetime = 120, window._timer_getOneNum_ = null, window._nearbyOneIssue_random = null, window.__temp_daojishi_dateTime = null;
var arr_nearby_openNum = [],
	game_new_issue = null,
	isSix = !1,
	playLayoutList = [],
	currentBigIndex = 0,
	currentSmallIndex = 0,
	data_sel = [],
	minchosen = [],
	disType = "digital",
	recordList = [],
	betLottoryContent = {
		init: function (lotteryId) { // 初始页面
			betContentItem.lotteryId = lotteryId;
			$('#bet_content').show();
			var htmlStr = '<div class="gm_con_to">' +
				'<div class="tz_body">' +
				'<div class="unit">' +
				'<div class="unit_title">' +
				'<div class="ut_l"></div>' +
				'<div class="u_tab_div" id="tabbar-div-s2">' +
				'<span class="tab-back" id="changemode">' +
				'<span class="tabbar-left"></span>' +
				'<span class="content" title="点击切换" id="request_play_load">loading</span>' +
				'<span class="tabbar-right"></span>' +
				'</span>' +
				'</div>' +
				'<div class="ut_r"></div>' +
				'</div>' +
				'<div id="tabCon">' +
				'<div class="tabcon_n">' +
				'<ul id="tabbar-div-s3"></ul>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="tzn_body">' +
				'<div class="tzn_b_n">' +
				'<div class="tbn_top">' +
				'<h5 id="lt_desc"></h5>' +
				'<span class="methodexample  fa-bars" id="lt_example">' +
				'<span class="fanli"></span>范例' +
				'</span>' +
				'<span class=" fa " id="lt_help">' +
				'<span class="shuoming"></span> 中奖说明' +
				'</span>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'<div class="tbn_cen">' +
				'<div class="tbn_c_ft"></div>' +
				'<div class="tbn_c_s">' +
				'<div id="lt_selector"></div>' +
				'</div>' +
				'</div>' +
				'<div class="tbn_bot">' +
				'<div class="tbn_b_top">' +
				'<div class="tbn_bt_sel"> 您选择了 <strong><span class="n" id="lt_sel_nums">0</span></strong> 注, 共 <strong><span class="n" id="lt_sel_money">0</span></strong> 元,' +
				'单注金额:' +
				'<input name="lt_sel_times" type="TEXT" size="4" value="2" class="bei" id="lt_sel_times" maxlength="8" onblur="Utils.gt0(this)"  onkeyup="Utils.clearNoNumInt(this)" />' +
				'<ul id="#" class="choose-money">' +
				'<li class="on">元</li>' +
				// '<li>角</li>' +
				// '<li>分</li>' +
				'</ul>' +
				'<span>' +
				'<select name="lt_sel_modes" id="lt_sel_modes" class="cs-select cs-skin-border width-60" style="display: none;">' +
                '<option value="1">元</option>' +
                // 清掉角分
				// '<option value="2">角</option>' +
				// '<option value="3">分</option>' +
				'</select>' +
				'</span>' +
						'<span id="same-prize"></span>' + // 同一赔率
						'快捷分享注单：<input type="checkbox" style="vertical-align: middle;" onClick="quickShare(this)"> (快捷分享注单到当前房间)' +
                '</div>' +
                    // '<div id="lt_sel_prize" style="float: left;">' +
                    //     '<div id="sliderArea">' +
                    //         '<div class="div-re">' +
                    //             '<span class="fl"><span id="sliderSpanStart"></span></span>' +
                    //             '<span class="fr">' +
                    //                 '<span id="sliderSpanEnd" class="fl"></span>' +
                    //                 '<span id="sliderSpanEnd2" class="fl"></span>' +
                    //                 '<span id="sliderSpanEnd1" class="fl"></span>' +
                    //             '</span>' +
                    //         '</div>' +
                    //         '<div id="mySlider"></div>' +
                    //         '<div class="div-re" style="margin-top: 5px">' +
                    //             '<span class="fr">' +
                    //                 '<span id="B_sliderSpanEnd" class="fl"></span>' +
                    //                 '<span id="B_sliderSpanEnd2" class="fl"></span>' +
                    //                 '<span id="B_sliderSpanEnd1" class="fl"></span>' +
                    //             '</span>' +
                    //         '</div>' +
                    //     '</div>' +
                    // '</div>' +
				'<div class="g_submit" id="lt_sel_insert" onClick="clickAddBetOrder();"><span class="touzhu"></span>添加注单</div>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="tbn_b_bot">' +
				'<div class="tbn_bb_l">' +
				'<div class="tbn_bg1">' +
				'<div class="tbn_bg2"></div>' +
				'</div>' +
				'<div class="tbn_bb_ln">' +
				'<div class="tz_tab_list_box">' +
				'<table cellspacing="0" cellpadding="0" border="0" id="lt_cf_content" class="tz_tab_list">' +
				'<tbody></tbody>' +
				'</table>' +
				'</div>' +
				'</div>' +
				'<div class="zh_box">' +
				'<div class="zhuihao">' +
				'<span class="zhuihao_wz">我要追号：</span>' +
				'<span class="fl lt_bei_box">' +
				'<a onclick="setTimesNum(1, this)" data-type="fc3d" class="tz_bei_sub fl">−</a>' +
				'<input onkeyup="changeTime(this)" name="times_nums" type="text" maxlength="3" data-type="fc3d" id="times_nums" class="multiple fl" value="1" />' +
				'<a onclick="setTimesNum(2, this)" class="tz_bei_add fl" data-type="fc3d">+</a>' +
				'</span>' +
				'</div>' +
				'<div id="lt_cf_clear" class="scall" onClick="recordCleanAll();"><span class="scall_ui"></span> <a >删除全部</a></div>' +
				'</div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="tbn_bb_2"><span class="tbn_clear" id="lt_random_one" title="点击多次，随机更多" onClick="randomOneZhu();">随机一注</span><span class="tbn_clear" onClick="randomFiveZhu();" id="lt_random_five">随机五注</span>' +
				'<div class="g_submit" id="lt_buy" onClick="confirmOrder();"><span class="tianjia"></span>确认投注</div>' +
				'<div class="sub_txt"> 总注数: <strong><span class="r" id="lt_cf_nums"></span></strong>注</div>' +
				'<div class="sub_txt"> 总金额: <strong><span class="r" id="lt_cf_money"></span></strong>元</div>' +
				'<div><span id="lt_issues"></span>' +
				'</div>' +
				'<div class="clear"></div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'<div class="zh_body">' +
				'<div class="unit">' +
				'<div class="unit_title">' +
				'<div class="ut_l"></div>' +
				'<div class="ut_r"></div>' +
				'</div>' +
				'<div class="trace_box" style="display: none;" id="lt_trace_box">' +
				'<div class="unit1">' +
				'<div class="unit_title2">' +
				'<div id="tab02" class="u_tab_div">' +
				'<div class="bd">' +
				'<div id="general_txt_100" class="bd2">' +
				'<div class="tabcon_n">' +
				'<label name="lt_trace_stop" class="zh_continue">' +
				'<input type="checkbox" value="yes" id="lt_trace_stop" name="lt_trace_stop" />中奖后停止追号' +
				'</label>' +
				'</div>' +
				'<table width="100%" class="tabbar-div-s3">' +
				'<tbody>' +
				'<tr>' +
				'<td id="lt_trace_label"></td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'<div class="bl3p"></div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'<div class="zhgen">' +
				'<table width="100%" cellspacing="0" cellpadding="0" border="0">' +
				'<tbody>' +
				'<tr>' +
				'<td>' +
				'追号期数:<select id="lt_trace_qissueno">' +
				'<option value="">请选择</option>' +
				'<option value="5">5期</option>' +
				'<option selected="selected" value="10">10期</option>' +
				'<option value="15">15期</option>' +
				'<option value="20">20期</option>' +
				'<option value="25">25期</option>' +
				'<option value="all">全部</option>' +
				'</select>' +
				'总期数: <span id="lt_trace_count" class="y">0</span> 期 追号总金额:' +
				'<span id="lt_trace_hmoney" class="y">0</span> 元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;追号计划:' +
				'<span id="lt_trace_labelhtml"></span>' +
				'</td>' +
				'<td valign="bottom" align="right" rowspan="2">' +
				'<div style="display: none;" id="lt_trace_ok" class="g_submit"><span></span></div>' +
				'</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'</div>' +
				'<div id="lt_trace_issues" class="zhlist">' +
				'<table width="100%" cellspacing="0" cellpadding="0" border="0" id="lt_trace_issues_table"><tbody></tbody></table>' +
				'</div>' +
				'<input type="hidden" name="formhash" value="LU62LwGVtNNA23W4eMEK2KtQ2xHN983" />' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div class="clear"></div>' +
				'<div class="gm_con" id="lt_bet_box" style="margin-bottom:70px;"></div>' +
				'</div>' +
				'</div>' +
				'</div>';
			$('#bet_content').html(htmlStr);
			$("#_tip_loading_").css("display", "block");
			// $("#bet_content").load("/pc/mall/bet_content.html", function () {
			if (parseInt(lotteryId) == 9 || parseInt(lotteryId) == 28 || parseInt(lotteryId) == 48) {
				isSix = true;
				$('#six-result').show();
				$('#showgd-box').hide();
			} else {
				isSix = false;
				$('#six-result').hide();
				$('#showgd-box').show();
			}
			betLottoryContent.fetchLayout();
            betLottoryFoot.init(lotteryId);
            // console.log(betContentItem);
			// })
		},
		fetchLayout: function () {
			$('#request_play_load').html('loading');
			$("#lotteryid").val(betContentItem.lotteryId);

			webStorageTool.getGameLayout(betContentItem.lotteryId, function (list) {
                // betContentItem.lotteryId
				window.isRequestLottery = false;
				$("#_tip_loading_").css("display", "none");
				$("#bet_content").show();
				if (list.length == 0) {
                    $('#request_play_load').html('暂无玩法');
					return;
				}
				$('#request_play_load').html('');
				var eg = list[0].playWayData[0]; // 获取第一条玩法的信息
                console.log("进入了布局界面");
                console.log(eg);
                var	pId = eg.playId;

                // 设置当前sharecode
                ShareCode.setShare(eg.lotteryClassName);
                console.log(ShareCode.code);

				$("#gameId").val(pId);
				betContentItem.playId = pId;
				betContentItem.lotteryTitle = eg.name, playLayoutList = [];
				playLayoutList = list;
				betLottoryContent.refreshPlayNavi(list);
			}, function (msg) {
				window.isRequestLottery = false;
				$("#_tip_loading_").css("display", "none");
				$("#bet_content").show();
				$('#request_play_load').html(msg);
				_alert(msg);
			});
		},
		refreshPlayNavi: function (list) {
			var bhtml = "";
			currentBigIndex = 0, $.each(list, function (i, n) {
				if (n.playWayData.length > 0) {
					if (typeof (n) == 'object') {
						if (i == 0) {
							bhtml = bhtml.replace("front", "back");
							bhtml += '<span class="tab-front" value="' + i + '" tag="0" default="1" onClick="betLottoryContent.changeBigPlay(this);"><span class="tabbar-left"></span><span class="content">' + n.name + '</span><span class="tabbar-right"></span></span>';
							betLottoryContent.lt_smalllabel(n);
							betContentItem.bigPlayType = n;
						} else {
							if ((betContentItem.lotteryId == 9 || betContentItem.lotteryId == 28 || betContentItem.lotteryId == 48) && i > 9) {
								bhtml += '<span class="tab-back" value="' + i + '" tag="0" default="0" onClick="betLottoryContent.changeBigPlay(this);"><span class="tabbar-left"></span><span class="content" style="margin-top:8px;">' + n.name + '</span><span class="tabbar-right"></span></span>';
							} else {
								bhtml += '<span class="tab-back" value="' + i + '" tag="0" default="0" onClick="betLottoryContent.changeBigPlay(this);"><span class="tabbar-left"></span><span class="content">' + n.name + '</span><span class="tabbar-right"></span></span>';
							}
						}
					}
				}
			}), $("#tabbar-div-s2").html(""), $("#tabbar-div-s2").html(bhtml);
			if (betContentItem.lotteryId == 9 || betContentItem.lotteryId == 28 || betContentItem.lotteryId == 48) {
				$("#tabbar-div-s2").css('height', 'auto');
			}
		},
		lt_smalllabel: function (root) {
            console.log(root);
			if (root.hasOwnProperty("playWayData")) {
				var playWayData = root.playWayData,
					html = "";
				if (1 == playWayData.length) return $("#tabbar-div-s3").html(""), void betLottoryContent.renderBetContent(playWayData[0]);
				var bigPlayName = root.name,
                    layoutArr = [];
                //
				$.each(playWayData, function (i, layout) {
					var gName = groupName(layout.name, layout.lotteryMethodName, bigPlayName).name;
					layout.gName = gName, -1 == layoutArr.indexOf(gName) && layoutArr.push(gName)
                }),
                //
                $.each(layoutArr, function (i, groupName) {
					html += '<li class="tz_li">', html += '<span class="tz_title" id="groupName_red">' + groupName + "</span>";
					var isFirst = 0;
					$.each(playWayData, function (j, item) {
						groupName == item.gName && 0 == isFirst && 0 == i ? (isFirst = 1, html += '<div class="act" index="' + j + '" onClick="betLottoryContent.changeSmallPlay(this)"><span class="method-tab-front" id="smalllabel_' + i + "_" + j + '">' + item.name + "</span></div>", betLottoryContent.renderBetContent(item)) : groupName == item.gName && (html += '<div class="back" index="' + j + '" onClick="betLottoryContent.changeSmallPlay(this)"><span class="method-tab-back" id="smalllabel_' + i + "_" + j + '">' + item.name + "</span></div>")
					}), html += "</li>"
                }),
                $("#tabbar-div-s3").html(""), $("#tabbar-div-s3").html(html)
			}
		},
		renderBetContent: function (layout) {
			void 0 != layout && ($("#lt_desc").html(layout.simpleInfo), betLottoryContent.lt_selectarea(layout))
		},
		lt_selectarea: function (layout) {
            console.log("layout is");
            console.log(layout);

			function showQuikyList(i) {
				var quikyStr = "",
					newQuikyArr = [],
					newQuikyTintArr = [],
					newIsNoQuiky = !1;
				return 0 == i && -1 != (layout.lotteryMethodName.indexOf("duplex") && layout.lotteryMethodName.indexOf("dragonTiger")) ? (newQuikyArr = [], newQuikyTintArr = [], newIsNoQuiky = !0) : (newQuikyArr = quikyArr, newQuikyTintArr = quikyTintArr, newIsNoQuiky = isNoQuiky), $.each(newQuikyArr, function (k, quiky) {
					quikyStr += '<li class="dxjoq" name="' + newQuikyTintArr[k] + '" onClick="betLottoryContent.clickQuikyBtn(this);">' + quiky + "</li>"
				}), quikyStr = newIsNoQuiky ? "" : '<div class="to"><ul><li class="l"></li>' + quikyStr + '<li class="r"></li></ul></div>'
			}

			function getBallWidthHeigthColorOdd(j, num) {
				new RegExp("[\\u4E00-\\u9FFF]+", "g").test(num) && (isShowRect = !0);
				var isSpecial = !1,
					ballColor = "";
				return (isSingleOdds || isAdaptLayout) && (isSpecial = !0, ballColor = isSix ? "" != sixNumToColor(num + "") ? sixNumToColor(num + "") : "normal" : isPcdd ? judgePcddColor(num + "") : "normal"), {
					isSpecialBall: isSpecial,
					ballColor: ballColor
				}
			}

			// layout = conversionLayout(layout);
			var isSix = (layout.lotteryClassName.indexOf('SixMark') > -1),
				isPcdd = (layout.lotteryClassName.indexOf('28') > -1) || (layout.lotteryClassName.indexOf("PCEggs") > -1),
				isK3 = (layout.lotteryClassName.indexOf('QuickThree') > -1),
				layoutList = layout.hasOwnProperty('layout') ? layout.layout : [],
				quikyArr = layout.shortcut ? ["全", "大", "小", "奇", "偶", "清"] : ["清"],
				quikyTintArr = layout.shortcut ? ["all", "big", "small", "odd", "even", "clean"] : ["clean"],
				layoutStr = "";
			data_sel = [];
			var isJustOneRow = 1 == layoutList.length,
				isShowRect = (layout.lotteryClassName.indexOf("QuickThree") > -1),
				isNoQuiky = -1 == layout.lotteryMethodName.match("Sum") || 7 == betContentItem.lotteryId || 17 == betContentItem.lotteryId,
				isSingleOdds = 0 == layout.maxPrize,
				isAdaptLayout = isJustOneRow && ("extraNumberSelected3" == layout.lotteryMethodName || isSix || -1 != layout.lotteryMethodName.match("Sum")),
				isSum = -1 != layout.lotteryMethodName.match("Sum"),
				isDragonTiger = -1 != layout.lotteryMethodName.indexOf("dragonTiger");
			    betContentItem.isDragonTiger = isDragonTiger;
			    $.each(layoutList, function (i, row) {
				console.log(row) // 每项layout
					data_sel.push([]);
					var numStr = "",
						nums = row.numbers.split("|"),
						prizes = (isSingleOdds || isAdaptLayout) && row.hasOwnProperty("prizes") ? row.prizes.split("|") : []; // 获取单个赔率，如果赔率不是全局赔率，则初始空数组
						// console.log(layout.lotteryClassName)

                    betContentItem.noBigIndex = 5,
                    $.each(nums, function (j, num) {
                        // 判断一维还是多维选择
						if (new RegExp("[\\u4E00-\\u9FFF]+", "g").test(num) && (isShowRect = !0), getBallWidthHeigthColorOdd(j, num).isSpecialBall) {
                            var ballColor = getBallWidthHeigthColorOdd(j, num).ballColor;
                            // 旧版赔率
                            // var	odd = 0 == Utils.toDecimal2(prizes[j]) ? "" : Utils.toDecimal2(prizes[j]);
                            var odd = 0;
                            odd = (!prizes[j]) ? "" : prizes[j];
                            if (odd) { // 如果不是单个赔率，则最大赔率需要逐个获取
                                odd = calcOddsByOneLayout(row, j);
                            }
							// 整理整理后
							// console.log(layout)
							// console.log(row)
							// console.log(JSON.parse(localStorage.getItem('userInfo')))

							var	oddStr = isSingleOdds || isAdaptLayout ? '<span class="ball-single-odds">' + odd + "</span>" : "";

							var	rowHeight = "" != odd ? "height:70px !important;" : isSum ? "height:50px !important;" : "height:45px !important;";
							var	rowWidth = isShowRect ? "" : (isSix || isPcdd) && nums.length > 18 ? "width:60px !important;" : "";
							isShowRect && isPcdd && 10 == nums.length && (rowWidth = "width:100px !important;")
							isK3 && (rowWidth = num.length > 4 ? "width:130px !important;" : "width:70px !important;")
							numStr += '<div class="single-odds-div single_' + ballColor + '" style="' + rowHeight + rowWidth + '"><div style="' + rowWidth + '" id="wei_' + i + "_" + j + '" name="lt_place_' + i + '"" onClick="changeSelNum(this)">' + num + oddStr + "</div></div>"
						} else {
							var normalRowWidth = "";
							isK3 && (normalRowWidth = num.length > 4 ? "width:130px !important;" : "width:70px !important;")
							numStr += '<div style="' + normalRowWidth + '" id="wei_' + i + "_" + j + '" name="lt_place_' + i + '"" onClick="changeSelNum(this)">' + num + "</div>"
						}
					});
					if (!betContentItem.isDragonTiger) {
                        // 非龙虎

                        var quikyStr = showQuikyList(i),
                        ballClass = isShowRect ? "gdts" : "gd",
                        listHeight = isSingleOdds ? "min-height:60px" : "",
                        tiMargin = isJustOneRow ? "margin-bottom:10px;" : "",
                        rowStr = '<div class="gds"><div class="ti" style="' + tiMargin + '">' + row.ints + '</div><div class="' + ballClass + '" style="' + listHeight + '">' + numStr + "</div>" + quikyStr + "</div>";

						layoutStr += rowStr
					} else {
                        // 龙虎
                        var longhuArr = row.numbers.split(',');

						layoutStr += '<div class="ti" style="">' + row.ints + '</div>';
						layoutStr += '<div class="longhu" id="longhu">';
						$.each(longhuArr, function (k, longhuItem) {
							if (longhuItem.indexOf('|') != -1) {
								var first = longhuItem.split('|')[0];
								var last = longhuItem.split('|')[1];
								layoutStr += '<div class="gd big"><span class="" onclick="clickLongHuNum(this)" num="' + first + 'vs' + last + '">' + first + '</span> <i>vs</i> <span class="" onclick="clickLongHuNum(this)" num="' + last + 'vs' + first + '">' + last + '</span></div>';
							}
						});
						layoutStr += '</div>';
					}
                }),
                $("#lt_selector").html(""), // 重置投注面板布局
                $("#lt_selector").html(layoutStr), //赋值投注面板布局
                betLottoryContent.renderOdds(layout), // 赋值赔率到页面上，修改成新方法
                betContentItem.layoutGameType = layout,
                init_event_content(),
                -1 != layout.lotteryMethodName.indexOf("same2single") ? betContentItem.isSingTwo = !0 : betContentItem.isSingTwo = !1, -1 != layout.lotteryMethodName.indexOf("duplex") ? (betContentItem.isDanTuo = !0, betContentItem.danTuoLength = parseInt(layout.layout[0].maxSel) + 1) : (betContentItem.isDanTuo = !1, betContentItem.danTuoLength = 0), layout.layout[0].maxSel > 0 ? betContentItem.isHaveMaxSelNum = layout.layout[0].maxSel : betContentItem.isHaveMaxSelNum = 0

		},
		renderOdds: function (layout) {
            var minPrize = layout.minPrize,
                maxPrize = layout.maxPrize;
			$("#same-prize").html("");
            // $("#lt_sel_prize").show(),
            // window.myPoint = [.13, 0],
            // window.myPrize = [minPrize, maxPrize],
            // initSlider(myPoint[1]),
            // window.prizeChangeBind && prizeChangeBind()

            window.playId = layout.playId;
            // TODO: 新的计算赔率方法
            if (minPrize == 0 && maxPrize == 0) {
                if (layout.layout[0].prizes) {
                    // 隐藏全局赔率
                }
            } else {
                if (layout.layout[0].prizes && layout.layout[0].maxPrizes) {
                    // 优先选择单项的赔率进行循环。不过暂时是没有的。幸运28的是后台错误
                } else {
                    $("#same-prize").html("赔率:  " + calcOddsByWholeLayout(layout));
                }
            }
		},
		changeBigPlay: function (e) {
			if ("tab-front" != $.trim($(e).attr("class")) && "changemode" != $.trim($(e).attr("id"))) {
				$("#tabbar-div-s2").children().attr("class", "tab-back"), $(e).attr("class", "tab-front");
				var index = parseInt($(e).attr("value"), 10);
				betLottoryContent.lt_smalllabel(playLayoutList[index]), currentBigIndex = index, betContentItem.bigPlayType = playLayoutList[index], lt_selcountback()
			}
		},
		changeSmallPlay: function (e) {
			if ("act" != $.trim($(e).attr("class"))) {
				$("#tabbar-div-s3 .tz_li").children().attr("class", "back"), $(e).attr("class", "act");
				var index = parseInt($(e).attr("index"));
				betLottoryContent.renderBetContent(playLayoutList[currentBigIndex].playWayData[index]),
					currentSmallIndex = index, betContentItem.layoutGameType = playLayoutList[currentBigIndex].playWayData[index], lt_selcountback()
			}
		},
		clickQuikyBtn: function (e) {
			$("li[class^='dxjoq']", $(e).parent()).attr("class", "dxjoq");
			$(e).attr("class", "dxjoq on");
			switch ($(e).attr('name')) {
				case 'all':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						selectNum(n, true);
					});
					break;
				case 'big':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						selectBig(i, n);
					});
					break;
				case 'small':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						selectSmall(i, n);
					});
					break;
				case 'odd':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						selectOdd(n);
					});
					break;
				case 'even':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						selectEven(n);
					});
					break;
				case 'clean':
					$.each($(e).closest("div[class='gds']").find("div[name^='lt_place_']"), function (i, n) {
						unSelectNum(n, true);
					});
				default:
					break;
			}
			checkNum();
		}
	},
	cleanTraceIssue = function () {
        $("input[name^='lt_trace_issues']",
        $("#lt_trace_issues")).attr("checked", !1),
        $("input[name^='lt_trace_times_']",
        $("#lt_trace_issues")).val(0).attr("disabled", !0),
        $("span[id^='lt_trace_money_']",
        $("#lt_trace_issues")).html("0.00"),
        $("tr", $("#lt_trace_issues")).removeClass("on"),
        $("#lt_trace_hmoney").html(0),
        $("#lt_trace_money").val(0),
        $("#lt_trace_count").html(0)
	},
	lt_selcountback = function () {
		$("#lt_sel_nums").html(0), $("#lt_sel_money").html(0), $("#lt_sel_times").val(2), $(".choose-money").find("li").eq(0).click()
	};

// 添加
function clickLongHuNum(e) {
	"lhact" == $.trim($(e).attr("class")) ? unSelectLongHuNum(e, !1) : selectLongHuNum(e, !1)
}

function unSelectLongHuNum(e) {
	if ("lhact" != $.trim($(e).attr("class"))) {
		return;
	}
	$(e).attr("class", "");
	var num = $(e).attr('num');
	if (data_sel[0].indexOf(num) != -1) {
		data_sel[0].remove(num);
	}
	checkNum();
}

function selectLongHuNum(e) {
	if ($.trim($(e).attr("class")) == 'lhact') {
		return;
	}
	$(e).attr("class", "lhact");
	var num = $(e).attr('num');
	if (data_sel[0].indexOf(num) == -1) {
		data_sel[0].push(num);
	}
	checkNum();
}
