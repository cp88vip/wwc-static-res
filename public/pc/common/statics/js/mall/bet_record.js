function init_event_record() {
}

// 低频彩不显示追号
function showZhuiHaoView(lotteryId) {
  webStorageTool.getLotteryList(function (list) {
    $.each(list,function (i,item) {
      if (item.lotteryId == lotteryId) {
        if (item.type == 'l') {
           $('.zhuihao').hide();
        } else {
           $('.zhuihao').show();
        }
      }
    });
  });
}

function recordCleanAll() {
    0 != betLottoryRecord.buyListArr.length && $.confirm(lot_lang.am_s5, function () {
        cleanBetArea()
    })
}

function clickDelItem(index, e) {
    $(e).parent().closeFloat(), console.log("点击删除了" + index), $(e).parent().remove();
    var currentList = betLottoryRecord.buyListArr.slice();
    $.each(currentList, function (i, item) {
        if (item.index == index) {
            var cIndex = currentList.indexOf(item);
            betLottoryRecord.buyListArr.splice(cIndex, 1)
        }
    }), console.log("betLottoryRecord.buyListArr" + betLottoryRecord.buyListArr.length), showResultData()
}

function init_cell_oper() {
    $('td[class="tl_li_l"]').parent().off("mouseenter").mouseenter(function (e) {
        if (!isJoinBetting) {
            var currentIndex = $(this).attr("index"), _item = betLottoryRecord.buyListArr[parseInt(currentIndex) - 1],
                onlynostext = getCellShowNumbers(_item.smallPlayType, _item.selArr);
            onlynostext.length > 29 && (onlynostext = onlynostext.substring(0, 29) + "...");
            var $h = $('<div class=fbox><table><tr class=t><td class=tl></td><td class=tm></td><td class=tr></td></tr><tr class=mm><td class=ml><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td>' + lot_lang.dec_s30 + ": " + _item.bigPlayType.name + "_" + _item.smallPlayType.name + "<br/>" + lot_lang.dec_s31 + ":" + onlynostext + "<br/>" + lot_lang.dec_s32 + ": " + _item.mode + lot_lang.dec_s32 + ", " + lot_lang.dec_s33 + " " + _item.odds + ", " + "<br/><div class=in><span class=ic></span>  " + lot_lang.dec_s35 + " " + _item.zhuNumber + " " + lot_lang.dec_s1 + ", 每注金额 " + _item.singleZhuMoney + " " + _item.mode + " <br/> " + lot_lang.dec_s36 + " " + _item.zhuAllMoney + lot_lang.dec_s3 + '</div></td><td class=mr><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td></tr><tr class=b><td class=bl></td><td class=bm><img src="' + _prefixURL.common + '/img/lottery/t.gif"></td><td class=br></td></tr></table><div class=ar><div class=ic></div></div></div>'),
                offset = $(this).offset(), left = offset.left + 200, top = offset.top - 79;
            $(this).openFloat($h, "more", left, top), e.stopPropagation()
        }
    }).mouseout(function (e) {
        isJoinBetting || ($(this).closeFloat(), e.stopPropagation())
    }).click(function () {
        if (!isJoinBetting) {
            var currentIndex = $(this).attr("index"), _item = betLottoryRecord.buyListArr[parseInt(currentIndex) - 1],
                nostext = getCellShowNumbers(_item.smallPlayType, _item.selArr),
                sss = '<h4 style="text-align:left;">' + lot_lang.dec_s30 + ": " + _item.bigPlayType.name + "_" + _item.smallPlayType.name + "<br/>" + lot_lang.dec_s32 + ": " + _item.mode + lot_lang.dec_s32 + ", " + lot_lang.dec_s33 + " " + _item.odds + ", " + "<br/>" + lot_lang.dec_s35 + " " + _item.zhuNumber + " " + lot_lang.dec_s1 + ", 每注金额 " + _item.singleZhuMoney + " " + _item.mode + ", " + lot_lang.dec_s36 + " " + _item.zhuAllMoney + " " + lot_lang.dec_s3;
            sss += '<div class="data" style="height:60px;"><table border=0 cellspacing=0 cellpadding=0><tr><td>' + nostext + "</td></tr></table></div>", $.alert(sss, lot_lang.dec_s5, "", 450, !1)
        }
    })
}

function getCellShowNumbers(gameType, selArr) {
    if (0 == selArr.length) return "";
    var arr = [];
    return $.each(selArr, function (i, subrr) {
        if (0 != subrr.length) {
            var subStr = subrr.join(",");
            arr.push(gameType.layout[i].ints + " : " + subStr)
        }
    }), arr.join("; <br />")
}

function refreshCurrenDis(currentList) {
    $.each(currentList, function (i, item) {
        item.index = betLottoryRecord.buyListArr.length + i;
        var cell = betLottoryRecord.showRecordCell(item);
        $(".tz_tab_list_box").find("tbody").append(cell), 
        init_cell_oper()
    }), showResultData()
}

function cleanBetArea() {
    $(".tz_tab_list_box").find("tbody").html(""), 
    betLottoryRecord.buyListArr = [], 
    showResultData()
}

function showResultData() {
    var zhuNumber = 0, allMoney = 0;
    $.each(betLottoryRecord.buyListArr, function (i, item) {
        zhuNumber += parseInt(item.zhuNumber), allMoney += parseFloat(item.zhuAllMoney)
    }),
        $("#lt_cf_nums").html(zhuNumber + ""),
        $("#lt_cf_money").html(Utils.toDecimal2(allMoney * betLottoryRecord.times) + "")
}

function getBetShowNumbers(selArr) {
    if (0 == selArr.length) return "";
    var arr = [];
    return 1 == selArr.length ? selArr.join(",") : ($.each(selArr, function (i, n) {
        if (0 == n.length) arr.push("-"); else {
            var subStr = n.join("|");
            arr.push(subStr)
        }
    }), arr.join(","))
}

function confirmOrder() {
    if ("false" == parent._user_.isLogin) return void _alert("您还未登录！");
    if (0 == betLottoryRecord.buyListArr.length) return void _alert("请选择投注号码");
    if (parseInt($("#lt_cf_nums").html()) > 1e3) return _alert("一次性投注禁止超过1000注，请减少注数！"), !1;
    var currentMoney = parseFloat($("#balance").html().split("￥")[1]),
        orderMoney = parseFloat($("#lt_cf_money").html());
    if (currentMoney < orderMoney) return void _alert("当前余额(" + Utils.toDecimal2(currentMoney) + ")不足以支付该订单金额" + Utils.toDecimal2(orderMoney) + "; 请充值后重试!");
    var msg = "<h4>" + lot_lang.dec_s8.replace("[issue]", $("#current_issue").html()) + "</h4>",
        centerStyle = "text-align:center;";
    msg += '<div class="data"><table border=0 cellspacing=0 cellpadding=0 width=100%><tr class=hid><td width=150 style="' + centerStyle + '">玩法</td><td width=170 style="' + centerStyle + '">内容</td><td width=80 style="' + centerStyle + '">注数</td><td width=80 style="' + centerStyle + '">单注金额</td>', msg += '<td style="' + centerStyle + '">金额</td></tr>', $.each(betLottoryRecord.buyListArr, function (i, _item) {
        var method = _item.bigPlayType.name + "_" + _item.smallPlayType.name, zhuNumber = _item.zhuNumber,
        singleZhuMoney = _item.singleZhuMoney, 
        desc = getCellShowNumbers(_item.smallPlayType, _item.selArr),
        money = _item.zhuAllMoney, 
        oddsRebate = _item.odds + "/" + Math.ceil(1e3 * _item.rebate) / 10 + "%";
        msg += "<tr><td>" + method + "</td><td >" + desc + '</td><td  style="' + centerStyle + '">' + zhuNumber + '</td><td  style="' + centerStyle + '">' + singleZhuMoney + '</td><td  style="' + centerStyle + '">' + money + "</td></tr>"
    }), msg += "</table></div>";
    var zhui = 1 == betLottoryRecord.times ? "" : "(追" + betLottoryRecord.times + "期)";
    msg += '<div class="binfo"><span class=bbm>' + zhui + "     " + lot_lang.dec_s9 + ": " + $("#lt_cf_money").html() + " " + lot_lang.dec_s3 + "</span></div>", $.confirm(msg, function () {
        goBet()
    }, function () {
    }, "", 700, !0)
}

function goBet() {
    if (!isJoinBetting) {
        var touZhuArr = [];
        $.each(betLottoryRecord.buyListArr, function (i, recordItem) {

            var item = {},
                unitFee = "元" == recordItem.mode ? 100 * recordItem.singleZhuMoney : "角" == recordItem.mode ? 10 * recordItem.singleZhuMoney : recordItem.singleZhuMoney;
                item.playId = recordItem.smallPlayType.playId,
                item.issue = $("#current_issue").text(),
                // item.rebate = 100 * recordItem.rebate,
                item.rebate = 0,
                item.unitFee = unitFee,
                item.numbers = getBetShowNumbers(recordItem.selArr),
                touZhuArr.push(item)
        });
        var jsonObj = JSON.stringify(touZhuArr);
        console.log("购彩提交订单：" + touZhuArr), isJoinBetting = !0;
        var after = $("#times_nums").val() ? $("#times_nums").val() : 1;
        $.ajax({
            type: 'POST',
            url: "/front/bet/betting.do"+"?after="+after,
            // url: $.lt_ajaxurl,
            timeout: 10000,
            dataType: 'JSON',
            data: jsonObj,
            contentType:'application/json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid')),
                xhr.setRequestHeader("client-version", window.clientVersion),
                xhr.setRequestHeader("x-requested-with",window.xWidth)
                var _temporary = Utils.getStorage('temporaryId') || null
                if (_temporary) {
                    xhr.setRequestHeader('temporary-sessionId', _temporary);
                }
            },
            success: function (data) {
                isJoinBetting = false;
                if (data.code == 0) {//购买成功
                    parent._user_.refreshMoney("#balance");
                    betLottoryRecord.buyListArr = [];
                    cleanBetArea();
                    _alert(lot_lang.am_s24, lot_lang.dec_s25, function () {

                    });
                    betLottoryFoot.getBetLists();//TODO 更新投注记录
                        if (quickShareType) {
                            goShare (data.data[0].orderId,data.data[0].subId,Utils.getStorage('liveRoomId'))
                          }
                    return false;
                } else {//购买失败提示
                    if (data.code >= 300 && data.code < 400) {
                        _alert('登录超时，请重新登录!',function () {
                          if( window.name != 'home' ){//如果不是主页的其他页面则退出当前页面（一般是窗口）
                              window.close();
                          }
                          __openWin("home", "/pc/index.html");
                        });
                        return false;
                    }
                    if (data.msg != '') {//错误
                        $("span[id^='smalllabel_'][class='method-tab-front']", $($('#tabbar-div-s3'))).removeData("ischecked").click();
                        // cleanBetArea();
                        _alert(lot_lang.am_s100 + data.msg, '', function () {
                            // return checkTimeOut();
                        }, (data.msg.length > 10 ? 350 : 250));
                        //TODO 返回消息错误
                        return false;
                    }
                }
            },
            error: function () {
                isJoinBetting = false;
                // $.lt_submiting = false;
                // $.unblockUI({
                //     fadeInTime: 0,
                //     fadeOutTime: 0
                // });
                _alert('系统超时');
                // $.confirm(lot_lang.am_s99.replace("[msg]", '系统超时'), function () {//点确定[清空],//交易状态不确定,请查看是否购买成功,是否要清空已投注内容?
                //     if (checkTimeOut() == true) {//时间未结束
                //         $.lt_reset();
                //     }
                //     $.lt_onfinishbuy();
                //     $.fn.fastData();
                //     $.fn.updatehistory();
                // }, function () {//点取消
                //     $.lt_onfinishbuy();
                //     $.fn.fastData();
                //     $.fn.updatehistory();
                //     return checkTimeOut();
                // }, '', 480, true);
                return false;
            }
        });
    }
}

var isJoinBetting = !1, 
betLottoryRecord = {
    buyListArr: [], 
    times: 1, 
    init: function (lotteryId) {
        betLottoryRecord.buyListArr = [],
            init_event_record();
            showZhuiHaoView(lotteryId);
    }, 
    addItems: function (currentList) {
        clearRecordList(), 
        0 != currentList.length && (betLottoryRecord.buyListArr = betLottoryRecord.buyListArr.concat(currentList), 
        refreshCurrenDis(currentList))
    }, 
    showRecordCell: function (_item) {
        var nostext = getCellShowNumbers(_item.smallPlayType, _item.selArr),
            fistTint = "[" + _item.bigPlayType.name + "_" + _item.smallPlayType.name + "] <br>" + nostext;
        // 旧的东西
        // ' + _item.odds + "/" + Math.ceil(1e3 * _item.rebate) / 10 + '%
        // <td width="120" class="r">' + _item.odds + "/" + Math.ceil(1e3 * _item.rebate) / 10 + '%</td>
        return '<tr style="cursor:pointer;" id="tl_li_l" index="' + _item.index + '"><td width="4" class="tl_li_l"></td><td ><div style="max-width: 220px; word-wrap:break-word;">' + fistTint + '</div></td><td width="10"></td><td width="80" class="r">' + _item.zhuNumber + lot_lang.dec_s1 + '</td><td width="80" class="r">' + _item.singleZhuMoney + _item.mode + '</td><td width="120" class="r">' + _item.zhuAllMoney + lot_lang.dec_s3 + '</td><td class="c" onClick="clickDelItem(' + _item.index + ',this);" width="50" title="删除"><span class="xz_delete"></span><input type="hidden" name="lt_project[]" value="test" /></td></tr>'
    }
}, 
setTimesNum = function (type, selectors) {
    var times = $(selectors).siblings("[name=times_nums]").val();
    0 == times ? $(selectors).siblings("[name=times_nums]").val(1) : (0 == type || (1 == type ? (times = parseInt(times) - 1, times = times < 1 ? 1 : times) : 2 == type && (times = parseInt(times) < 100 ? parseInt(times) + 1 : times)), $(selectors).siblings("[name=times_nums]").val(0 ^ times | [-8][-9] * $)),
    betLottoryRecord.times = $(selectors).siblings("[name=times_nums]").val(),
    showResultData()
},
changeTime = function (input) {
    var times = $(input).val();
    times.replace(/\D/g, '');
    if (times == "") {
        times = 1;
    }
    times = parseInt(times);
    if (parseInt(times) < 0 || parseInt(times) == 0 || times.isNaN) {
        times = 1;
    }
    if (parseInt(times) > 100) {
        times = 100;
    }
    // $(input).val(times^0|[1-9][0-9]*$);
    $(input).val(times);
    betLottoryRecord.times = $(input).val();
    showResultData();
};
