function goTrend() {
    if ("" != betItem.lotteryId) {
        var trend = "/pc/trend/chart.html?lotteryId=" + betItem.lotteryId + "&amp;periods=20";
        __openWin("home2", trend)
    }
}
// 近一期
function showOneIssue() {
    $("#gd-box1").show()
    $("#gd-box2").hide()
    $("#showgd-box-new .box-ul li a").removeClass("tabulous_active")
    $("#one_per").addClass("tabulous_active")
}
// 近十期
function showFiveIssue() {
    $("#gd-box1").hide()
    $("#gd-box2").show()
    $("#showgd-box-new .box-ul li a").removeClass("tabulous_active")
    $("#five_per").addClass("tabulous_active")
    void 0 == $("#five_per").data("ajax") && arr_nearby_openNum.length < 10 && (betLottoryHead.fetchFiveIssue(), $("#five_per").data("ajax", !0))
}

function checkTimeOut() {
    0 != betLottoryRecord.buyListArr.length && (console.log("弹出啦 " + betLottoryRecord.buyListArr), $.confirm(lot_lang.am_s99.replace("[msg]", lot_lang.am_s15), function () {
        cleanBetArea()
    }, function () {
    }, "", 450))
}
// 定义和值方法
// 大小单双
function getBigSmallObj(number, numberType, ds, setArray) {
    // console.log('setArray: ', setArray);
    // console.log(setArray)
    var obj = {
        bsName: '',
        bsColor: '',
        dsName: '',
        dsColor: ''

    }
    if (number > numberType) {
        obj.bsName = '大'
        obj.bsColor = 'big-color'
    } else {
        obj.bsName = '小'
        obj.bsColor = 'small-color'
    }
    if (ds && number % 2 === 0) {
        obj.dsName = '双'
        obj.dsColor = 'double-color'
    } else {
        obj.dsName = '单'
        obj.dsColor = 'single-color'
    }
    if (setArray) {
        var newSet =  Array.from(new Set([setArray[0], setArray[1], setArray[2]]))
        if (newSet.length === 3) {
            obj.setName = '组六'
            obj.setColor = 'green'
        }
        if (newSet.length === 2) {
            obj.setName = '组三'
            obj.setColor = 'red'
        }
        if (newSet.length === 1) {
            obj.setName = '豹子'
            obj.setColor = 'blue'
        }

    }
    return obj
}
function effectiveSixMark(num) {
    var textstr = "鼠|牛|虎|兔|龙|蛇|马|羊|猴|鸡|狗|猪";
    var textArr = textstr.split("|");
    var dic = Utils.getStorage('ballSetColorDicPc');
    var textNumArr = [];
    for ( var i = 0; i < textArr.length; i++) {
        textNumArr.push(dic[textArr[i]]);
    }
    for (var i = 0; i < textNumArr.length; i++) {
        var numArr = textNumArr[i];
        if (numArr.indexOf(num) > -1){
            return textArr[i];
        }
    }
    return '';
}
function getZuhe(numbers) {
    var newSet =  Array.from(new Set([numbers[0], numbers[1], numbers[2]]))
    var set = {}
    if (newSet.length === 3) {
        set.setName = '组六'
        set.setColor = 'red'
    }
    if (newSet.length === 2) {
        set.setName = '组三'
        set.setColor = 'green'
    }
    if (newSet.length === 1) {
        set.setName = '豹子'
        set.setColor = 'blue'
    }
    return set

}


function colorSixMark(number) {
    var colors = JSON.parse(localStorage.getItem('ballSetColorDicPc')).val
    var colorClassName = ''
    if (colors['红'].includes(Number(number))) {
        colorClassName = 'red'
    }
    if (colors['绿'].includes(Number(number))) {
        colorClassName = 'green'
    }
    if (colors['蓝'].includes(Number(number))) {
        colorClassName = 'blue'
    }
    return colorClassName
}
function favoriteHtml () {
    var html = '';
    var __data = Utils.getStorage('gameFavorite');
    html += '<span class="bg-col">我的收藏</span>';
    html += '<div class="favorite-wrap">';
        for (let index = 0; index < __data.length; index++) {
            var element = __data[index];
            html += '<div class="itemGames favorite-item" data-code="'+ element.platformCode +'" data-gamecode="'+ element.gameCode +'" data-kindid="'+ element.gameKindId +'">';
                html += '<div class="favorite-game">';
                    html += '<img src="'+ element.url +'">';
                    html += '<p>'+ element.gameName +'</p>';
                html += "</div>"
                html += '<div data-id="' + element.id + '" class="btn_close_favorite">';
                    html += '<span></span>';
                html += '</div>'
            html +='</div>';
        }
    html += '</div>';
    // <div class="btn_close"><span></span></div>
    $('.collection-wrap').html(html);

    $('.btn_close_favorite').click(function (event) {
        var __id = $(this).attr('data-id');
        Utils.request('/game/myCollection.do',
        {
            dealwith: 'del',
            id: __id
        },function (res) {
            _alert(res.msg, function () {
            Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
                if (res.code === 0) {
                Utils.saveStorage('gameFavorite',res.data);
                favoriteHtml();
                } else {
                _alert(res.msg);
                }
            });
            });
        });
        event.stopPropagation();  
    })
}

function colorsPcdd(number) {
    // big-color
    // small-color
    var obj = {
        sebo: '',
        color: ''
    }
    switch (number) {
        case 3:case 6:case 9:case 12:case 15:case 18:case 21:case 24:
            obj.sebo = '红'
            obj.color = 'red'
            break;
        case 2:case 5:case 8:case 11:case 17:case 20:case 23:case 26:
            obj.sebo = '蓝'
            obj.color = 'blue'
            break;
        case 1:case 4:case 7:case 10:case 16:case 19:case 22:case 25:
            obj.sebo = '绿'
            obj.color ='green'
            break;
        default:
            obj.sebo = '无'
            obj.color = 'huise'
            break;
    }
    return obj
}

// function getLotteryNama (lotteryId) {
//     var lotteryObj = {}
//     switch (lotteryId) {
//         // 时时彩
//         case 4:case 6:case 45:case 12:case 11:
//             lotteryObj.lotteryId = lotteryId
//             lotteryObj.typeName = 'pcdd'
//             break;
//         // 11选5
//         case 49:case 39:case 5:case 13:case 15:case 14:case 49:
//         default:
//             break;
//     }
// }



var betItem = {lotteryId: ""};
window.oneissuetime = 0
window._timer_getOneNum_ = null
window._nearbyOneIssue_random = null
window.__temp_daojishi_dateTime = null;
var arr_nearby_openNum = []
var game_new_issue = null
var isSix = !1
var isFirst = true
var historyOpenItem = null
var betLottoryHead = {
    init: function (lotteryId) {
        // betItem.lotteryId = lotteryId, $("#bet_head").load("/pc/mall/bet_head.html", function () {
            window.isFirstHead = true;
            betItem.lotteryId = lotteryId;
            $("#bet_head").show();

            var htmlStr = '<div class="gm_con_to">' +
                '<div style="margin-top:5px;" class="unit_title">' +
                    '<div class="ut_l"></div>' +
                    '<div class="ut_r"></div>' +
                '</div>' +
                '<div class="gct_l">' +
                    '<div class="game-icon1"></div>' +
                    '<p class="time-title">' +
                        '<span id="openTitle">已开盘,距离投注截止还有 </span>' +
                        '<span class="gdox" id="current_endtime" style="display: none;">?-?-? ?:?:?< </span>' +
                    '</p>' +
                    '<div class="gct-time">' +
                        '<div class="gct-time-now">' +
                            '<div class="gct-time-now-l beting-time" id="count_down">' +
                                '<span class="leaveh-1"><span>-</span></span>' +
                                '<span class="leaveh-2"><span>-</span></span>' +
                                '<span class="interval">:</span>' +
                                '<span class="leavem-1"><span>-</span></span>' +
                                '<span class="leavem-2"><span>-</span></span>' +
                                '<span class="interval">:</span>' +
                                '<span class="leaves-1"><span>-</span></span>' +
                                '<span class="leaves-2"><span>-</span></span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<h3 name="page_name">***</h3>' +
                    '<div class="gct_now"><strong>第&nbsp;&nbsp;<span id="current_issue" class="color-green"> ? </span>&nbsp;&nbsp;期</strong>' +
                        '<br />' +
                        '总共:&nbsp;&nbsp;<strong><span id="current_sale" class="color-green"> ? </span></strong>&nbsp;&nbsp;' +
                        '<br />' +
                        '<a onclick="goTrend()" target="_blank" class="bt01" id="jumpTrend">' +
                            '<span class="zoushi"></span>号码走势' +
                        '</a>' +
                        '<br />' +
                        '<a target="_blank" class="bt01 favorite-button-lottery">' +
                            '<img class="favorite-lottery-icon" src="/pc/common/statics/img/icon_sc_sel.png" />添加收藏' +
                        '</a>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '<div class="gct_menu"><a class="gct_menu_yl"  target="_blank"></a></div>' +
                '</div>' +
                '<div id="showgd-box-new">' +
                    '<ul class="box-ul">' +
                        '<li><a name="near_one_per_btn" class="tabulous_active" index="1" onclick="showOneIssue();" id="one_per">近一期</a></li>' +
                        '<li><a name="near_five_per_btn" index="2" onclick="showFiveIssue();" id="five_per">近十期</a></li>' +
                    '</ul>' +
                    '<div id="tabs_container">' +
                        '<div id="gd-box1" style="position: absolute; top: 40px;">' +
                            '<p><span name="page_name">***</span> 第' +
                                '&nbsp;&nbsp;<b><span class="color-green" id="lt_gethistorycode"></span></b>&nbsp;&nbsp;' +
                                '期<span id="lt_opentimebox" style="display:none;">&nbsp;&nbsp;' +
                                '<span id="waitopendesc"></span>&nbsp;' +
                                '<span style="color:#F9CE46;" id="lt_opentimeleft"></span>' +
                                '</span>' +
                                '<span id="lt_opentimebox2">' +
                                    '<strong>&nbsp;&nbsp;</strong>' +
                                '</span>' +
                            '</p>' +
                            '<ul class="lot-gd1" id="showcodebox" style=""></ul>'  +
                            '<div id="six-result" class="ball_liuhecai" style=""></div> ' +
                        '</div>' +
                        '<div id="gd-box2" style="position: absolute; top: 40px; display:none;">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
            '</div>';
            $('#bet_head').html(htmlStr);

            if (typeof(_time_left_int) != "undefined" && _time_left_int != null) {
                clearInterval(_time_left_int);
                _time_left_int = undefined;
            }
            isFirst = true;
            betLottoryHead.fetchFiveIssue();  // 需要提前知道有几位开奖号码 -- 方便布局
            if (parseInt(lotteryId) == 9 || parseInt(lotteryId) == 28) {
                isSix = true;
                $('#six-result').show();
            }else {
                isSix = false;
                $('#six-result').hide();
            }
            $('#gd-box2').hover(function () {
                $(this).css('height', 'auto')
            }, function () {
                $(this).css('height', '120px')
            });
            var lotteryFavorite = Utils.getStorage('gameFavorite');
            var __hash = window.location.hash.split('=')[1];
            var ____html = '<img class="favorite-lottery-icon" src="/pc/common/statics/img/icon_sc_sel.png">取消收藏';
            var ____html2 = '<img class="favorite-lottery-icon" src="/pc/common/statics/img/icon_sc_sel.png">添加收藏';
            $.each(lotteryFavorite, function (k, v) {
                var ___id = v.id.replace('lt',"");
                if (Number(___id) === Number(__hash)) {
                    $('.favorite-button-lottery').addClass('favorite-off');
                    $('.favorite-off').html(____html);
                }
            });
            $('.favorite-button-lottery').click(function () {
                if (!$(this).hasClass('favorite-off')) {
                    Utils.request('/game/myCollection.do',{
                        dealwith: 'add',
                        lotteryId: __hash
                    }, function(res) {
                        if (res.code === 0) {
                            _alert(res.msg, function () {
                                Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
                                    if (res.code === 0) {
                                        $('.favorite-button-lottery').addClass('favorite-off');
                                        $('.favorite-button-lottery').html(____html);
                                        Utils.saveStorage('gameFavorite',res.data);
                                        if (!$('.collection-wrap').is(":hidden")) {
                                            favoriteHtml();
                                        }
                                        // $('.collection-wrap').
                                    }
                                })
                            })
                        }
                    })
                } else {
                    Utils.request('/game/myCollection.do',{
                        dealwith: 'del',
                        id: 'lt' + __hash
                    }, function(res) {
                        if (res.code === 0) {
                            _alert(res.msg, function () {
                                Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
                                    if (res.code === 0) {
                                        $('.favorite-button-lottery').removeClass('favorite-off');
                                        $('.favorite-button-lottery').html(____html2);
                                        Utils.saveStorage('gameFavorite',res.data);
                                        if (!$('.collection-wrap').is(":hidden")) {
                                            favoriteHtml();
                                        }
                                    }
                                })
                            })
                        }
                    })
                }
                // console.log(__hash);
                // console.log('彩票收藏');
            });
        // })
    },
    fetchLastOne: function () {
        $("#lotteryid").val(betItem.lotteryId);
        // console.log("进入了投注界面" + betItem.lotteryId)
        Utils.request("front/lottery/draw_info.do", {lotteryId: betItem.lotteryId}, function (res) {
            if (0 != res.code) return void _alert(res.msg);
            betLottoryHead.refreshHead(res);
            if (window.isFirstHead) {
                betLottoryContent.init(betItem.lotteryId);
                window.isFirstHead = false;
            }
        })
    },
    refreshHead: function (res) {
        // console.log('refreshHead: ', res);
        var data = res.data;
        var iconUrl = _home_menu.getLotteryIconUrl(betItem.lotteryId);
        $(".game-icon1").css("background",'url('+iconUrl+') no-repeat'),
        $(".game-icon1").css("background-size",'114px 114px'),
        isFirst && ($(document).attr("title", data.name), $("head title").text(data.name), $("[name=page_name]").each(function () {
            $(this).text(data.name)
        }),isFirst = false), $("#current_issue").html(data.currentIssue), $("#current_sale").text(getIssue(data.lotteryId)), $("#lt_gethistorycode").html(data.lastIssue), $("#current_endtime").html(data.deadline), betLottoryHead.refreshMidWaitingOpen(res), betLottoryHead.renderOpenItem(res.data), $("#bet_head").show()
    },
    fetchFiveIssue: function () {
        Utils.request("front/lottery/luck_number.do", {lotteryId: betItem.lotteryId}, function (res) {
            0 == res.code && (betLottoryHead.fetchLastOne(), betLottoryHead.renderFiveIssue(res.data.slice(0, 10)), historyOpenItem = res.data.slice(0, 1)[0])
        })
    },
    renderFiveIssue: function (recentlycode) {
        // console.log(recentlycode, '')
        var sRecentlyCode = ""
        var issuecount = recentlycode.length
        var openCodeStr = "开奖号码";
        "9" != betItem.lotteryId && "52" != betItem.lotteryId || (openCodeStr = "");
        for (var m = 0; m < issuecount; m++) {
            var issue = recentlycode[m].issue, numbers = recentlycode[m].number.split(',');
            var date = new Date, year = date.getFullYear();
            if (numbers.length >= 10) {
                if (issue.indexOf(year) > -1) {
                    issue = issue.substring(4, issue.length);
                }
            }

            if (!(recentlycode[m].number.split(",").length > 10 && (openCodeStr = ""))) {
                sRecentlyCode += '<p class="lottery-flex-s">'
                    sRecentlyCode += '第'+ issue +'期'
                    sRecentlyCode += openCodeStr + ':  '
                    sRecentlyCode += betLottoryHead.getFiveIssueBallDiv(recentlycode[m])
                sRecentlyCode += '</p>'
            }

            // console.log('asdasd',recentlycode[m].number.split(",").length > 5 && (openCodeStr = ""))
            // recentlycode[m].number.split(",").length > 5 && (openCodeStr = ""), sRecentlyCode += '<p>第<span class="gd-box-q">' + issue + "</span>期" + openCodeStr + ": &nbsp;&nbsp;", sRecentlyCode += betLottoryHead.getFiveIssueBallDiv(recentlycode[m]), sRecentlyCode += "</p>"
        }
        $("#gd-box2").html(sRecentlyCode)
    },
    refreshMidWaitingOpen: function (res) {
        var _data = res.data;
        if (res.system_time > _data.deadline) {
            $("#openTitle").html("未开盘,距离开盘时间还有"), $("#lt_buy").mousedown(function (e) {
                _alert("未开盘,不能下注");
                try {
                    e.preventDefault ? e.preventDefault() : e.returnValue = !1
                } catch (e) {
                }
                return !1
            });
            $(".gct-time  #count_down").show()
            _data.system_time
        } else if(_data.indexDesc && _data.indexDesc == '未开盘'){
            $("#openTitle").html("<span style='font-size:28px;font-weight:bolder;'>未开盘</span>")
            $(".gct-time  #count_down").hide()
            setInterval(function(){
                betLottoryHead.fetchLastOne();
            },30000)
        } else {
            // console.log(res)
            $(".gct-time  #count_down").show()
            $("#openTitle").html("已开盘,距离投注截止还有");
            _data.deadline;
            $("#lt_buy").unbind("mousedown")
        }
        betLottoryHead.getCountDown(res)
    },
    getCountDown: function (res) {
        function time_html(arr) {
            if (arr.length > 6) {
                return '<span class="leaveh-1">' + arr[0] + '</span><span class="leaveh-1">' + arr[1] + '</span><span class="leaveh-2">' + arr[2] + '</span><span class="interval">:</span><span class="leavem-1">' + arr[3] + '</span><span class="leavem-2">' + arr[4] + '</span><span class="interval">:</span><span class="leaves-1">' + arr[5] + '</span><span class="leaves-2">' + arr[6] + '</span>'
            } else {
                return '<span class="leaveh-1">' + arr[0] + '</span><span class="leaveh-2">' + arr[1] + '</span><span class="interval">:</span><span class="leavem-1">' + arr[2] + '</span><span class="leavem-2">' + arr[3] + '</span><span class="interval">:</span><span class="leaves-1">' + arr[4] + '</span><span class="leaves-2">' + arr[5] + "</span>"
            }
        }

        function temp(i, arr) {
            i < 10 ? 0 == i ? (arr.push(0), arr.push(0)) : (arr.push(0), arr.push(i)) : (arr.push(parseInt(i / 10)), arr.push(i % 10))
        }

        var data = res.data, startTime = res.system_time;
        if (oneissuetime = parseInt((data.deadline - startTime) / 1e3), console.log("倒计时" + oneissuetime), ("undefined" == typeof __temp_daojishi_dateTime || null == __temp_daojishi_dateTime) && (window.__temp_daojishi_dateTime = (new Date).getTime(), startTime)) {
            try {
                __temp_daojishi_dateTime = null;
                var shicha = parseInt((data.deadline - startTime) / 1e3);
                $("#_game_top [name=time_title]").text("已开盘,欢迎投注。距离投注截止还有"), "undefined" == typeof _time_left_int && (window._time_left_int = setInterval(function () {
                    var arr = [0, 0, 0, 0, 0, 0], it = shicha;
                    if (it > 1) {
                        it -= 1, shicha -= 1, arr = [];
                        var h = parseInt(it / 3600);
                        temp(h, arr), it -= 3600 * h;
                        var m = parseInt(it / 60);
                        temp(m, arr), it -= 60 * m;
                        temp(it, arr)
                    }
                    // 如果倒计时首位超过9，则时间数组增加到7位
                    if (arr[0] > 9) {
                        let n = []
                        temp(arr[0], n)
                        arr.splice(0, 1)
                        arr = n.concat(arr);
                    }
                    $(".gct-time  #count_down").html(time_html(arr));
                    // 倒计时小时到了三位数，则调整样式
                    if (arr.length > 6) {
                        $(".gct-time  #count_down").css({ 'margin-right': '-18px' });
                    }
                }, 1e3))
            } catch (e) {
                try {
                    console.log(e)
                } catch (e) {
                }
            }
            if (!(shicha >= -1)) return;
            setTimeout(function () {
                checkTimeOut(), console.log("重新获取？ 定时获取"), clearInterval(_time_left_int), _time_left_int = void 0, betLottoryHead.fetchLastOne()
            }, 1e3 * Math.abs(shicha + 1))
        }
    },
    renderOpenItem: function (openItem) {
        openItem && ("正在开奖" == openItem.lastLuckyNumbers ? betLottoryHead.handleWaitingOpen(openItem) : "undefined" != typeof _timer_getOneNum_ && null != _timer_getOneNum_ && (clearInterval(window._timer_getOneNum_), window._timer_getOneNum_ = null), betLottoryHead.renderOpenHeader(openItem))
    },
    randomMaxNum: function () {
        // var _lotteryListData = JSON.parse(localStorage.getItem('lotteryListData'))
        var _lotteryListData = Utils.getStorage('lotteryListData')
        // for (var i = 0; i < _lotteryListData.length; i++) {
        //     console.log(_lotteryListData[i])
        //     // _lotteryListData[i]
        // }
        // _lotteryListData.forEach();
        // console.log(window.betLotteryId);
        // console.log()
        return window.betLotteryId
    },
    renderOpenHeader: function (data) {
        // console.log('`````````````````````````')
        // console.log(data)
        // console.log('`````````````````````````')
        function random_num() {
            if (null == _nearbyOneIssue_random) return void clearInterval(window._nearbyOneIssue_random);
            var li = $("#showcodebox").find("li");
            var p = $("#showcodebox").find("p");
            var animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
            var _betLotteryId = betLottoryHead.randomMaxNum()
            var timeNumber = 10
            // console.log(_betLotteryId)
            if(li){
                // console.log('class=li');
                // console.log(window.betLotteryId);
                $.each(li, function (i, n) {
                    if (!$(this).hasClass('ball-one-plus')) {
                      $(this).html(function () {
                        if (data.lotteryId === 44 || data.lotteryId === 37 || data.lotteryId === 38 || data.lotteryId === 36 || data.lotteryId === 35 || data.lotteryId === 34 || data.lotteryId === 33 || data.lotteryId === 32 || data.lotteryId === 27 || data.lotteryId === 31 || data.lotteryId === 1 || data.lotteryId === 30 || data.lotteryId === 50)
                        {
                        timeNumber = 6
                        }
                        // console.log($('#showcodebox').children('li:eq(3)').text())
                        if (data.lotteryId === 4 || data.lotteryId === 6 || data.lotteryId === 45 || data.lotteryId === 12 || data.lotteryId === 11) {
                            var number = Math.floor(Math.random() * 9)
                            $(this).text(number)
                        } else if (data.lotteryId === 7 || data.lotteryId === 17 || data.lotteryId === 47) {
                            var number = Math.floor(Math.random() * timeNumber + 1)
                            $(this).text(number)
                            // $('#showcodebox').children('li:eq(3)').text(Math.floor(Math.random() * 27 + 1))
                        } else {
                            var number = Math.floor(Math.random() * timeNumber + 1)
                            if (number < 10) {
                                number = '0' + number
                            }
                            $(this).text(number)
                        }


                      });
                    }
                    // pk10系列
                    if (data.lotteryId == 60 || data.lotteryId == 59 || data.lotteryId == 58 || data.lotteryId == 3 || data.lotteryId == 51 || data.lotteryId == 8 || data.lotteryId == 46 || data.lotteryId == 43 || data.lotteryId == 29) {
                        // console.log('AAAAAAAAAAAAAAAAAAAA')
                        $(this).attr('class', 'ball-one-ten dom-pk10-box dom-pk10-' + $(this).text())
                        $('#luck-pk10-info').hide()
                    }
                    // 快三系列
                    if (data.lotteryId === 1 || data.lotteryId == 50 || data.lotteryId === 27 || data.lotteryId === 30 || data.lotteryId === 31 || data.lotteryId === 32 || data.lotteryId === 33 || data.lotteryId === 34 || data.lotteryId === 35 || data.lotteryId === 36 || data.lotteryId === 37 || data.lotteryId === 38 || data.lotteryId === 44) {
                        $(this).attr('class', 'lq3-boxs lq3-bgc-' + $(this).text())
                        $(this).text(' ')
                        $('#lq3-info').hide()
                    }
                    // 六合彩系列
                    if (data.lotteryId === 28 || data.lotteryId === 53 || data.lotteryId === 9 || data.lotteryId === 48) {
                        // $(this).text(' ')
                        // $('#pcdd-id').hide()
                    }
                    // 11选5和时时彩
                    if (data.lotteryId === 4 || data.lotteryId === 52 || data.lotteryId === 6 || data.lotteryId === 11 || data.lotteryId === 12 || data.lotteryId === 45) {
                        console.log('这里是时时彩')
                    }
                    // pc蛋蛋
                    if (data.lotteryId === 7 || data.lotteryId === 54 || data.lotteryId === 17 || data.lotteryId === 47 || data.lotteryId === 56 || data.lotteryId === 57) {
                        $('#pcdd-id').hide()
                    }
                    // 3d系列

                    // if ()
                    // if (data.lotteryId === 42 || data.lotteryId === 40 || data.lotteryId === 41 || data.lotteryId === 2 || data.lotteryId === 18 || data.lotteryId === 10) {
                    //     $(this).atte('class', 'ssl-boxs')
                    // }
                })
            }
            if(p){
                // console.log('class=p');
                // console.log(window.betLotteryId);
                $.each(p, function (i, n) {
                        // 生成随机数
                    var indexNum = parseInt(Math.random()*12)
                        if(i != 6){
                            // console.log('indexNum: ', indexNum);
                            var index = Math.floor(28 * Math.random());
                            $(this).find("span").eq(0).html(index);
                            $(this).find("span").eq(1).html(animals[indexNum]);
                            // $("#showcodebox").find("p").not($("#showcodebox").find("p").eq(6)).html(index);
                            var color = pcSumToColor(index+'');
                            $(n).find("span").eq(0).attr('class','');
                            $(n).find("span").eq(0).attr('class','ball-sum-num '+'ball_'+ color);
                        }

                })
            }
            $("#showcodebox").find("li .ball-sum-num")
        }

        if (data.lastLuckyNumbers == '正在开奖') {
            // 怎么判断有几个数  -- 取历史开奖数据的第一个
            if ($('#showcodebox').html() == '' && historyOpenItem) {
                historyOpenItem.lastLuckyNumbers = historyOpenItem.number; // 适配
                $('#showcodebox').html(betLottoryHead.getOneIssueBallDiv(historyOpenItem));
            }
            if ($('#showcodebox').html() == '' && historyOpenItem) {
                betLottoryHead.fetchFiveIssue();
            }
        }else {
            // console.log('????????????????????????11111111111')
            $('#showcodebox').html(betLottoryHead.getOneIssueBallDiv(data));
        }
        $("#_game_top [name=orig_issue]").text(data.lastIssue);
        if (data.lastLuckyNumbers == '正在开奖') {
            // console.log('????????????????????????2222222222')
            if(typeof(_nearbyOneIssue_random) == "undefined" ||  _nearbyOneIssue_random == null) {
                //未开奖的时候，数字随机滚动
                $("#showcodebox").find("li").attr("flag", "move");
                window._nearbyOneIssue_random = setInterval(random_num,150);
                $("#lt_opentimebox2>strong").text("正在开奖");
            }
            return;
        }
        "undefined" == typeof _nearbyOneIssue_random && null == _nearbyOneIssue_random || (clearInterval(window._nearbyOneIssue_random), window._nearbyOneIssue_random = null), $("#lt_opentimebox2>strong").text("开奖号码"), betLottoryFoot.getBetLists(),
        Utils.request("front/lottery/luck_number.do", {lotteryId: betItem.lotteryId}, function (res) {
            0 == res.code && (betLottoryHead.renderFiveIssue(res.data.slice(0, 10)))
        })
    },
    handleWaitingOpen: function (data) {
        "undefined" != typeof _timer_getOneNum_ && null != _timer_getOneNum_ && (clearInterval(window._timer_getOneNum_), window._timer_getOneNum_ = null), window._timer_getOneNum_ = setInterval(function () {
            // console.log('经过了draw_info.do ==== 2')
            Utils.request("front/lottery/draw_info.do", {lotteryId: data.lotteryId}, function (res) {
                // console.log('handleWaitingOpen: ', res);
                console.log("开奖号码请求了 " + res.data.lastLuckyNumbers), 0 == res.code && "正在开奖" != res.data.lastLuckyNumbers && betLottoryHead.renderOpenItem(res.data)
            })
        }, 5e3)
    },
    getOneIssueBallDiv: function (one) {
        // console.log('one: ', one);
        var temp = ''
        var type = 'quanquan';

        if( !one.hasOwnProperty("lastLuckyNumbers") || "正在开奖" == one.lastLuckyNumbers ) {//暂无开奖号码
            return "";
        }

        // if (idName == 'pk10') {
        //     console.log()
        //     var temp = '';
        //     if (one.lastLuckyNumbers) {
        //         for (var y = 0; y < one.lastLuckyNumbers.split(',').length; y++) {
        //             var idx = one.lastLuckyNumbers.split(',')[i];
        //             temp += '<li flag="normal" class="ball-one-ten dom-pk10-box dom-pk10-'+ idx +'">'+ idx +'</li>'
        //         }
        //     }
        //     return temp;
        // }
        var _id = one.lotteryId;
        switch (_id) {
            case 1:case 27:case 30:case 31:case 32:case 33:case 34:case 35:case 36:case 37:case 38:case 44:case 50:
                type = 'touzi'
                break;
            case 4:case 6:case 11:case 12:case 45:case 5:case 13:case 14:case 15:case 39:case 49:case 55:
                type = 'quanquan'
                break;
            case 3:case 8:case 29:case 43:case 46:case 51:case 58: case 59: case 60:
                type = 'pk10'
                break;
            case 7:case 17:case 47:case 54:case 56: case 57:
                type = 'pcdd'
                break;
            case 2:case 10:case 18:case 40:case 41:case 42:
                type = '3dxl'
                break;
            case 9:case 28:case 48:case 53:
                type = 'lhc'
                break;
            case 64: case 65: case 66:
                type = 'qx'
                break;
        }
        if (type == 'qx'){
            var val = null
            var temp = ''
            one.lastLuckyNumbers.split(',').forEach(e => {
                val += +e
                temp += '<li flag="normal" class="ball-one-five pcdd-boxs">' + e + '</li>';
            });
            var obj = getBigSmallObj(val, 17, true)
            // console.log(obj, '')
            temp += '<div id="pcdd-id">'
            // temp += '<span class="big-color">'+ pcddhezhi +'</span>'
            temp += '<span class="bass_' + obj.color + '">和值：' + val + '</span>'
            temp += '<span class="' + obj.bsColor + '-border">' + obj.bsName + '</span>'
            temp += '<span class="' + obj.dsColor + '-border">' + obj.dsName + '</span>'
            temp += '</div>'
            var ballDiv = temp
            return ballDiv
        }


        if (type == 'pk10') {
            var temp = '';
            var array = one.lastLuckyNumbers.split(',')
            if (one.lastLuckyNumbers) {
                for (var y = 0; y < array.length; y++) {
                    var idx = array[y];
                    temp += '<li flag="normal" class="ball-one-ten dom-pk10-box dom-pk10-'+ idx +'">'+ idx +'</li>'
                }
                var guan = getBigSmallObj(array[0], 5, true)
                var ya =  getBigSmallObj(array[1], 5, true)
                var hezhi = getBigSmallObj((Number(array[1]) + Number(array[0])), 11, true)
                // pk10冠亚军计算
                // (Number(array[0]) + Number(array[1]))
                temp += '<div id="luck-pk10-info" class="pk10-hezhi">'
                    temp += '<div>'
                        temp += '<span>冠:</span>'
                        temp += '<span class="'+ guan.bsColor+'">'+ guan.bsName +'</span>'
                        temp += '<span class="'+ guan.dsColor+'">'+ guan.dsName +'</span>'
                    temp += '</div>'
                    temp += '<div>'
                        temp += '<span>亚:</span>'
                        temp += '<span class="'+ ya.bsColor+'">'+ ya.bsName +'</span>'
                        temp += '<span class="'+ ya.dsColor+'">'+ ya.dsName +'</span>'
                    temp += '</div>'
                    temp += '<div>'
                        temp += '<span>冠亚和:</span>'
                        temp += '<span class="big-color">'+ (Number(array[1]) + Number(array[0])) +'</span>'
                        temp += '<span class="'+ hezhi.bsColor +'">'+ hezhi.bsName +'</span>'
                        temp += '<span class="'+ hezhi.dsColor +'">'+ hezhi.dsName +'</span>'
                    temp += '</div>'
                temp += '</div>'
            }
            return temp;
        }
        if (type == "quanquan") {//时时彩
            var temp = "";
            // console.log('one.lastLuckyNumbers: ', one.lastLuckyNumbers);
            if(one.lastLuckyNumbers) {
                for( var i = 0 ; i< one.lastLuckyNumbers.split(",").length ; i++ ) {
                    var idx = one.lastLuckyNumbers.split(",")[i];
                    if (one.lastLuckyNumbers.split(",").length > 5) {
                        temp += '<li flag="normal" class="ball-one-ten ssl-boxs">'+idx+'</li>';
                    }else {
                        temp += '<li flag="normal" class="ball-one-five ssl-boxs">'+idx+'</li>';
                    }
                }
            }
            return temp;
        }
        if( type == "touzi" ) {//快三
            var temp = "";sum = 0;
            for( var i = 0 ; i< one.lastLuckyNumbers.split(",").length ; i++ ) {
                var idx = one.lastLuckyNumbers.split(",")[i];
                sum += parseInt(idx);
                temp += '<li flag="normal" class="lq3-boxs lq3-bgc-'+ idx +'"></li>';
            }
            var q3hezhi = Number(one.lastLuckyNumbers.split(",")[0]) + Number(one.lastLuckyNumbers.split(",")[1]) + Number(one.lastLuckyNumbers.split(",")[2])
            var ddhezhi = getBigSmallObj(q3hezhi, 10,true)
            temp += '<div id="lq3-info" class="lq3-info">'
                temp += '<span>和值:</span>'
                temp += '<span class="big-color">'+ q3hezhi +'</span>'
                temp += '<span class="'+ ddhezhi.bsColor +'">'+ ddhezhi.bsName +'</span>'
                temp += '<span class="'+ ddhezhi.dsColor +'">'+ ddhezhi.dsName +'</span>'
            temp += '</div>'
            // temp += '<li flag="normal">和值:'+sum+'</li>';
            return temp;
        }
        if( type == "lhc" ) {//香港六合彩
            var temp = "";
            var jiaqin = ['鼠', '虎', '龙', '蛇', '猴', '兔']
            if(one.lastLuckyNumbers){
                for( var i = 0 ; i< one.lastLuckyNumbers.split(",").length ; i++ )
                {
                    var idx = one.lastLuckyNumbers.split(",")[i];
                    var color = sixNumToColor(idx); //生肖
                    var sx = sixNumToZodiac(idx); //生肖
                    if (i == 6) {
                        temp += '<p><img class="ball-one-add" src="/pc/common/statics/img/draw/add.png"/><span> </span></p>';
                    }
                    temp += "<p><span class='ball_"+color+"'>" + idx + "</span><span class='font'>"+sx+"</span></p>";
                    if (i == 6) {
                        temp += '<div class="sm6-info">'
                            // temp += '<span>'+ sx +'</span>'
                            if (idx > 24) {
                                temp += '<span style="background-color:#ffc13d">大</span>'
                            } else {
                                temp += '<span style="background-color:#6a9eff">小</span>'
                            }
                            if (idx % 2 === 0) {
                                temp += '<span style="background-color:#ffc13d">双</span>'
                            } else {
                                temp += '<span style="background-color:#6a9eff">单</span>'
                            }
                            // e43d3d
                            if (jiaqin.includes(sx)){
                                temp += '<span style="background-color:#e43d3d">野兽</span>'
                            } else{
                                temp += '<span style="background-color:#62c15e">家禽</span>'
                            }
                            // temp += '<span class="big-color">'+ q3hezhi +'</span>'
                            // temp += '<span class="'+ ddhezhi.bsColor +'">'+ ddhezhi.bsName +'</span>'
                            // temp += '<span class="'+ ddhezhi.dsColor +'">'+ ddhezhi.dsName +'</span>'
                        temp += '</div>'
                    }
                }
            }
            var ballDiv = '<div class="ball_liuhecai">'+temp+'</div>';
            return ballDiv;
        }
        if( type == "pcdd" ) {//PC蛋蛋
            var temp = "";
            var sum = 0;
            var numbers = one.lastLuckyNumbers.split(",");
            for (var i = 0; i < numbers.length; i++) {
                var idx = numbers[i];
                sum += parseInt(idx);
                temp += '<li flag="normal" class="ball-one-five pcdd-boxs">'+idx+'</li>';
                if (i < 2) {
                    temp += '<img class="ball-one-add" src="/pc/common/statics/img/draw/add.png"/>';
                }
            }
            var pcddhezhi = Number(numbers[0]) + Number(numbers[1]) + Number(numbers[2])
            var hesb = colorsPcdd(pcddhezhi)
            var color = pcSumToColor(sum+'');
            temp += '<img class="ball-one-add" src="/pc/common/statics/img/draw/equal.png"/>';
            temp += '<li flag="normal" class="ball-one-five ball_'+color+' ball-sum-num pcdd-boxs-new pcdd-boxs-'+ hesb.color +'">'+sum+'</li>';
            var ddhezhi = getBigSmallObj(pcddhezhi, 13,true)

            temp += '<div id="pcdd-id">'
                // temp += '<span class="big-color">'+ pcddhezhi +'</span>'
                temp += '<span class="bass_'+ hesb.color +'">'+ hesb.sebo +'</span>'
                temp += '<span class="'+ ddhezhi.bsColor +'-border">'+ ddhezhi.bsName +'</span>'
                temp += '<span class="'+ ddhezhi.dsColor +'-border">'+ ddhezhi.dsName +'</span>'
            temp += '</div>'
            var ballDiv = temp;

            return ballDiv;
        }
        if( type == "3dxl" ) {//3d系列
            var temp = "";
            var sum = 0;
            var numbers = one.lastLuckyNumbers.split(",");
            for (var i = 0; i < numbers.length; i++) {
                var idx = numbers[i];
                sum += parseInt(idx);
                temp += '<li flag="normal" class="ball-one-five pcdd-boxs">'+idx+'</li>';
                if (i < 2) {
                    temp += '<img class="ball-one-add" src="/pc/common/statics/img/draw/add.png"/>';
                }
            }
            var pcddhezhi = Number(numbers[0]) + Number(numbers[1]) + Number(numbers[2])
            var hesb = colorsPcdd(pcddhezhi)
            var color = pcSumToColor(sum+'');
            // console.log(hesb)
            // console.log(color)
            temp += '<img class="ball-one-add" src="/pc/common/statics/img/draw/equal.png"/>';
            temp += '<li flag="normal" class="ball-one-five ball_'+color+' ball-sum-num pcdd-boxs-new pcdd-boxs-red">'+sum+'</li>';
            var ddhezhi = getBigSmallObj(pcddhezhi, 13,true, numbers)
            var zuhe = getZuhe(numbers)
            // console.log(zuhe)
            temp += '<div id="pcdd-id">'
                temp += '和值:<span class="big-color"> '+ pcddhezhi +'</span>'
                temp += '<span class="zuhe-'+ zuhe.setColor +'">'+ zuhe.setName +'</span>'
                // temp += '<span class="big-color">'+ pcddhezhi +'</span>'
                // temp += '<span class="bass_'+ hesb.color +'">'+ hesb.sebo +'</span>'
                // temp += '<span class="'+ ddhezhi.bsColor +'-border">'+ ddhezhi.bsName +'</span>'
                // temp += '<span class="'+ ddhezhi.dsColor +'-border">'+ ddhezhi.dsName +'</span>'
            temp += '</div>'
            var ballDiv = temp;

            return ballDiv;
        }
        return '';
    },
    getFiveIssueBallDiv: function (one) {
        if (!one.hasOwnProperty("number")) return "正在开奖";
        var type = "quanquan";
        var _id = one.lotteryId
        switch (_id) {
            case 1:case 27:case 30:case 31:case 32:case 33:case 34:case 35:case 36:case 37:case 38:case 44:case 50:
                type = 'touzi'
                break;
            case 4:case 6:case 11:case 12:case 45:case 5:case 13:case 14:case 15:case 39:case 49:case 55:
                type = 'quanquan'
                break;
            case 3:case 8:case 29:case 43:case 46:case 51:case 58:case 59:case 60:
                type = 'pk10'
                break;
            case 7:case 17:case 47:case 54:case 56:case 57:
                type = 'pcdd'
                break;
            case 2:case 10:case 18:case 40:case 41:case 42:
                type = '3dxl'
                break;
            case 9:case 28:case 48:case 53:
                type = 'lhc'
                break;
            case 64: case 65: case 66:
                type = 'qx'
                break;
        }
        if (type == 'qx') {
            if (one.number) {
                var temp = '';
                var numberArray = one.number.split(',');
                // console.log(numberArray, '')
                var hezhi = Number(numberArray[0]) + Number(numberArray[1]) + Number(numberArray[2])+ Number(numberArray[3])
                var hesb = colorsPcdd(hezhi)
                var ddhezhi = getBigSmallObj(hezhi, 17, true)
                // var hezhiObj = getBigSmallObj(hezhi, 14,true)
                temp += '<span class="quanquan-box">' + numberArray[0] + '</span>';
                temp += '<span class="quanquan-box">' + numberArray[1] + '</span>';
                temp += '<span class="quanquan-box">' + numberArray[2] + '</span>';
                temp += '<span class="quanquan-box">' + numberArray[3] + '</span>';
                temp += '<span class="five_bass_wrap">';
                temp += '<span >和值：' + hezhi + '</span>';
                temp += '<span class="' + ddhezhi.bsColor + '-border">' + ddhezhi.bsName + '</span>';
                temp += '<span class="' + ddhezhi.dsColor + '-border">' + ddhezhi.dsName + '</span>';
                temp += '</span>';
                // temp += '<span>和值</span>'
            }
            return temp
        }
        if (type == 'touzi') {
            var temp = '';
            var numberArray = one.number.split(',')
            sum = 0;
            for (var i = 0; i < numberArray.length; i++) {
                var idx = numberArray[i];
                sum += parseInt(idx);
                temp += '<span class="touzi-five-box lq3-bgc-'+ idx +'"></span>'
            }
            var _hezhi = Number(numberArray[0]) + Number(numberArray[1]) + Number(numberArray[2])
            var _dxds = getBigSmallObj(_hezhi, 10, true)
            temp += '<span>和值: <span class="big-color">'+ _hezhi +'</span></span>'
            temp += '<span class="touzi-five-m">'
                temp += '<span class="'+ _dxds.bsColor + 's' +'">'+ _dxds.bsName +'</span>'
                temp += '<span class="'+ _dxds.dsColor + 's' +'">'+ _dxds.dsName +'</span>'
            temp += '</span>'
            return temp
        }
        if (type == 'quanquan') {
            var temp = '';
            if (one.number) {
                var numberArray = one.number.split(',');
                for (var i = 0; i < numberArray.length; i++) {
                    var idx = numberArray[i];
                    temp += '<span class="quanquan-box">'+ idx +'</span>'
                }
            }
            return temp
        }
        if (type == 'pk10') {
            var temp = '';
            if (one.number) {
                var numberArray = one.number.split(',');
                var guan = getBigSmallObj(Number(numberArray[0]), 5, true);
                var ya = getBigSmallObj(Number(numberArray[1]), 5, true);
                var hezhi = getBigSmallObj((Number(numberArray[0]) + Number(numberArray[1])), 11, true)
                for (var i = 0; i < numberArray.length; i++) {
                    var idx = numberArray[i]
                    if (i == 0) {
                        temp += '<span class="dom-pk10-wraps">'
                            temp += '<span class="dom-pk10 dom-pk10s dom-pk10-'+ idx +'">'+ idx +'</span>'
                            temp += '<span class="pk10-info-wrap">'
                                temp += '<span>冠: </span>'
                                temp += '<span class="'+ guan.bsColor +'">'+ guan.bsName +'</span>'
                                temp += '<span class="'+ guan.dsColor +'">'+ guan.dsName +'</span>'
                                temp += '<span>亚: </span>'
                                temp += '<span class="'+ ya.bsColor +'">'+ ya.bsName +'</span>'
                                temp += '<span class="'+ ya.dsColor +'">'+ ya.dsName +'</span>'
                                temp += '<span>冠亚和: </span>'
                                temp += '<span class="'+ hezhi.bsColor +'">'+ hezhi.bsName +'</span>'
                                temp += '<span class="'+ hezhi.dsColor +'">'+ hezhi.dsName +'</span>'
                            temp += '</span>'
                        temp += '</span>'
                    } else {
                        temp += '<span class="dom-pk10 dom-pk10s dom-pk10-'+ idx +'">'+ idx +'</span>'
                    }
                }
            }
            return temp
        }
        if (type == 'pcdd') {
            if (one.number) {
                var temp = '';
                var numberArray = one.number.split(',');
                var hezhi = Number(numberArray[0]) + Number(numberArray[1]) + Number(numberArray[2])
                var hesb = colorsPcdd(hezhi)
                var ddhezhi = getBigSmallObj(hezhi, 13,true)
                // var hezhiObj = getBigSmallObj(hezhi, 14,true)
                temp += '<span class="quanquan-box">'+ numberArray[0] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/add.png"/>';
                temp += '<span class="quanquan-box">'+ numberArray[1] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/add.png"/>';
                temp += '<span class="quanquan-box">'+ numberArray[2] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/equal.png"/>';
                temp += '<span class="quanquan-box five_bass_'+ hesb.color +'">'+ hezhi +'</span>';
                temp += '<span class="five_bass_wrap">';
                    temp += '<span class="five_bass_'+ hesb.color +'">'+ hesb.sebo +'</span>';
                    temp += '<span class="'+ ddhezhi.bsColor +'-border">'+ ddhezhi.bsName +'</span>';
                    temp += '<span class="'+ ddhezhi.dsColor +'-border">'+ ddhezhi.dsName +'</span>';
                temp += '</span>';
                // temp += '<span>和值</span>'
            }
            return temp
        }
        if (type == '3dxl') {
            if (one.number) {
                var temp = '';
                var numberArray = one.number.split(',');
                var hezhi = Number(numberArray[0]) + Number(numberArray[1]) + Number(numberArray[2])
                var hesb = colorsPcdd(hezhi)
                var ddhezhi = getBigSmallObj(hezhi, 14,true)
                var zuhe = getZuhe(numberArray)
                // var hezhiObj = getBigSmallObj(hezhi, 14,true)
                temp += '<span class="quanquan-box">'+ numberArray[0] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/add.png"/>';
                temp += '<span class="quanquan-box">'+ numberArray[1] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/add.png"/>';
                temp += '<span class="quanquan-box">'+ numberArray[2] +'</span>';
                temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/equal.png"/>';
                temp += '<span class="quanquan-box">'+ hezhi +'</span>';
                temp += '<span class="five_bass_wrap">';
                    temp += '和值:<span class="big-color">'+ hezhi +'</span>';
                    temp += '<span class="zuhe-'+ zuhe.setColor +'">'+ zuhe.setName +'</span>';
                    // temp += '<span class="'+ ddhezhi.bsColor +'-border">'+ ddhezhi.bsName +'</span>';
                    // temp += '<span class="'+ ddhezhi.dsColor +'-border">'+ ddhezhi.dsName +'</span>';
                temp += '</span>';
                // temp += '<span>和值</span>'
            }
            return temp
        }
        if ("lhc" == type) {
            var temp = "";
            var jiaqin = ['鼠', '虎', '龙', '蛇', '猴', '兔']
            if (one.number) for (var i = 0; i < one.number.split(",").length; i++) {
                var idx = one.number.split(",")[i]
                var color = sixNumToColor(idx);
                var sx =sixNumToZodiac(idx);
                if (i == 6) {
                    temp += '<img class="ball-one-add ball-one-add2" src="/pc/common/statics/img/draw/add.png"/>';
                }
                temp += "<span class='gd-box-h ball_" + color + "''>" + idx + "</span>"
                if (i == 6) {
                    temp += '<span class="sm6-info2">'
                        temp += sx + ' '
                        if (idx > 24) {
                            temp += '<span style="background-color:#ffc13d">大</span>'
                        } else {
                            temp += '<span style="background-color:#6a9eff">小</span>'
                        }
                        if (idx % 2 === 0) {
                            temp += '<span style="background-color:#ffc13d">双</span>'
                        } else {
                            temp += '<span style="background-color:#6a9eff">单</span>'
                        }
                        // e43d3d
                        if (jiaqin.includes(sx)){
                            temp += '<span style="background-color:#e43d3d">野兽</span>'
                        } else{
                            temp += '<span style="background-color:#62c15e">家禽</span>'
                        }
                        // temp += '<span class="big-color">'+ q3hezhi +'</span>'
                        // temp += '<span class="'+ ddhezhi.bsColor +'">'+ ddhezhi.bsName +'</span>'
                        // temp += '<span class="'+ ddhezhi.dsColor +'">'+ ddhezhi.dsName +'</span>'
                    temp += '</span>'
                }
                // temp += "<p><span class='ball_"+color+"'>" + idx + "</span><span class='font'>"+sx+"</span></p>";
                // 6 == i && (temp += "<span class='gd-box-plus'>+</span>"),
            }
            var ballDiv = temp;
            return ballDiv
        }

        // if (1 == one.lotteryId ? type = "touzi" : 9 == one.lotteryId ? type = "lhc" : 7 != one.lotteryId && 17 != one.lotteryId || (type = "pcdd"), "quanquan" == type) {
        //     var temp = "";
        //     if (one.number) for (var i = 0; i < one.number.split(",").length; i++) {
        //         var idx = one.number.split(",")[i];
        //         temp += '<span class="gd-box-h">' + idx + "</span>"
        //     }
        //     return temp
        // }
        // if ("touzi" == type) {
        //     var temp = "";
        //     sum = 0;
        //     for (var i = 0; i < one.number.split(",").length; i++) {
        //         var idx = one.number.split(",")[i];
        //         sum += parseInt(idx), temp += '<span class="gd-box-h">' + idx + "</span>"
        //     }
        //     return temp
        // }
        // if ("lhc" == type) {
        //     var temp = "";
        //     if (one.number) for (var i = 0; i < one.number.split(",").length; i++) {
        //         var idx = one.number.split(",")[i], color = sixNumToColor(idx);
        //         sixNumToZodiac(idx);
        //         6 == i && (temp += "<span class='gd-box-plus'>+</span>"), temp += "<span class='gd-box-h ball_" + color + "''>" + idx + "</span>"
        //     }
        //     var ballDiv = temp;
        //     return ballDiv
        // }
        // if ("pcdd" == type) {
        //     var sum = 0;
        //     numbers = one.number.split(",");
        //     for (var temp = "", i = 0; i < numbers.length; i++) {
        //         var idx = numbers[i];
        //         sum += parseInt(idx), temp += '<span class="gd-box-h">' + idx + "</span>", i < 2 && (temp += "<span class='gd-box-plus'>+</span>")
        //     }
        //     var color = pcSumToColor(sum + "");
        //     temp += "<span class='gd-box-plus'>=</span>", temp += '<span class="gd-box-h ball_' + color + '">' + sum + "</span>";
        //     var ballDiv = temp;
        //     return ballDiv
        // }
        return ""
    }
};
$(document).off('click', '.itemGames').on('click', '.itemGames', function () {
    // console.log('fastClick')
    // if (fastClick) {
    // 	return;
    // };
    fastClick = true;
    var _this = $(this);
    var code = _this.data('code');
    var kindId = _this.data('kindid');
    var gameCode = _this.data('gamecode')
    if (lotteryId.indexOf('lt') > -1 ) {
        __openWin('lottery_hall',lotteryId.replace('lt', ''));
      } else {
        layer.msg('正在加载中...', {
            icon: 16,
            shade: 0.2,
            time: 50000
        });
        /**
         * 额度转换添加
        */
        // 转出
        Utils.request('/changeMoney/transfer.do', { transferStatus: 2 }, function (data) {
            if (data.code !== 0) {
                layer.closeAll();
                // _alert(data.msg);
                if (data.data) {
                    _alert('正在' + (data.data.platformName ? data.data.platformName : data.data.fromPlatformName) + '中进行游戏');
                }
                return;
            }
            // 转入游戏
            Utils.request('/changeMoney/transfer.do', { transferStatus: 1, gameCode: code }, function (data2) {
                if (data2.code !== 0) {
                    layer.closeAll();
                    // _alert(data2.msg);
                    if (data.data) {
                        _alert('当前正在' + (data.data.platformName ? data.data.platformName : data.data.fromPlatformName) + '中进行游戏，账户不能同时进行其他游戏。');
                    }
                    return;
                }
                Utils.requestNoTint('game/loginGame.do', { "gameCode": gameCode, "platformCode": code, "gameKindId": kindId }, function (res) {
                    fastClick = false;
                    layer.closeAll();
                    if (res.code !== 0) {
                        _alert(res.msg);
                        return;
                    }
                    if (res.code === 0) {
                        __openWin('single_game', res.data);
                        // console.log('code,进入游戏', res.code)
                        // balance 更新
                        _user_.getAjaxData("#balance");
                        return;
                    }
                    // Utils.requestNeedTint('passport/check_status.do', {}, function (data3) {
                    //     if (data3.code == 0) {
                    // 	  UserTool.saveUserInfo(data3.data);
                    // 	}
                    // });
                }, function (res) {
                    _alert(res.msg);
                    fastClick = false;
                    return false
                }, function () {
                    fastClick = false;
                })
                setTimeout(() => {
                    if (fastClick) {
                        fastClick = false;
                    }
                }, 15000);
            });
        });

      }
})
