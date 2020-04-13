window.lotteryMall = {
    newSortArr: [],
    gameIds: "",
    obj: {}
};
// 定义和值方法
// 大小单双
function getBigSmallObj(number, numberType, ds, setArray) {
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
        }
        if (newSet.length === 2) {
            obj.setName = '组三'
        }
        if (newSet.length === 1) {
            obj.setName = '豹子'
        }

    }
    return obj
}
// 七星彩和值
function sevenstar(num) {
var val = null
     num.split(',').forEach(e => {
        val += +e
    });
    return val
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

lotteryMall.newSortArr = [];
window._lottery_mall = {
    goIframe: function () {
        var urlstr = decodeURIComponent(window.location.hash);
        if (urlstr.indexOf("#lotteryId=")) $("#i_list_1").css("display", "block"), $("#_tip_loading_").css("display", "block"); else {
            var lotteryId = urlstr.split("#lotteryId=")[1];
            $("#i_list_1").hide()
            $("#i_list_2").show()
            $("#i_list_2 #bet_head").html("")
            $("#i_list_2 #bet_content").html("")
            betLottoryHead.init(lotteryId)
            betLottoryRecord.init(lotteryId)
            betLottoryFoot.init(lotteryId)
        }
    }, ajax_1: function (sortType) {
        for (var temp_1_gameIds = "_", i = 0; i < lotteryMall.newSortArr.length; i++) {
            temp_1_gameIds += lotteryMall.newSortArr[i].id + "_"
        }
        webStorageTool.getLotteryList(function (list) {
          $("#_tip_loading_").css("display", "none");
          var count = list.length;
          if (0 === count) return void $("#live-main-list").html("");
          for (var i = 0; i < count; i++) {
              var id = (list[i].type, list[i].lotteryId);
              lotteryMall.gameIds += id + ",", lotteryMall.obj[id] = list[i], lotteryMall.newSortArr.push({
                  id: id,
                  name: list[i].name,
                  className: list[i].lotteryClassName
              });
          }
          _lottery_mall.right_timeList();
        });
    }, right_timeList: function (gameIdStr) {
        var _this = this;
        function time_html(time_str) {
            function munChange(num) {
                return 0 == num ? "00" : num >= 10 ? num : "0" + num
            }

            var time = time_str - 0, time_obj = {h: "00", m: "00", s: "00"};
            if (time > 0) {
                var h = parseInt(time / 3600), m = parseInt((time - 3600 * h) / 60), s = time - 3600 * h - 60 * m;
                time_obj.h = munChange(h), time_obj.m = munChange(m), time_obj.s = munChange(s)
            }
            return '<span class="leaveh-1">' + time_obj.h + '</span><span class="interval"> ：</span><span class="leavem-1">' + time_obj.m + '</span><span class="interval"> ：</span><span class="leaves-1">' + time_obj.s + "</span>"
        }

        function timer(allStr) {
            var dealTimer = function () {
                try {
                    var gameIdStr = function () {
                        var gameIdStr = "";
                        for (var p in lotteryMall.obj) {
                            var time_str = $("#lot" + p).data("time") - 1;
                            $("#lot" + p).data("time", time_str), $("#lot" + p + " .gct_time_now_l").html(time_html(time_str));
                            var currentTime = (new Date).getTime();
                            $("#lot" + p).data("time") <= 0 && "true" != $("#lot" + p).data("ajax") && (gameIdStr += p + ",", $("#lot" + p).data("ajax", "true")), $("#lot" + p).data("opentime") <= 0 && "" == $("#lot" + p).data("opennum") && "true" != $("#lot" + p).data("ajax") && (currentTime - $("#lot" + p).data("lasttimer")) / 1e3 >= 45 && (gameIdStr += p + ",", $("#lot" + p).data("ajax", "true"))
                        }
                        return gameIdStr
                    }();
                    if (0 == gameIdStr.length) return;
                    refreshLottery(gameIdStr)
                } catch (e) {
                }
            };
            setInterval(dealTimer, 1e3);
            var heartTimers = function () {
                try {
                    refreshLottery(allStr)
                } catch (e) {
                }
            };
            setInterval(heartTimers, 5e3)
        }

        function lottery_innerHtml(id, issue, time, openNum, link, name, desc, icon, drawListUrl, item) {
            var openNum_HTML = "";
            var __str = "";
            var class_temp = "";
            if (openNum && openNum.length > 0 && "" != openNum[0]) {
                // console.log(id, '156')
                var arr = openNum.split(",");
                if (arr.length > 7) {
                    class_temp = "";
                } else {
                    class_temp = 'big_ball';
                }
                if (id === 28 || id === 9 || id === 48 || id === 53) {
                    openNum_HTML += '<span class="fl">上期开奖</span><div class="show-gd1"><ul class="hezhi-flex lhc-flex '+ class_temp +'">';
                } else if(id === 64 || id==65 || id === 66) {
                    // console.log(id, '')
                    openNum_HTML += '<span class="fl">上期开奖</span><div class="show-gd1"><ul class="hezhi-flex '+ class_temp +'">';
                } else {
                    // console.log(id, '')
                    openNum_HTML += '<span class="fl">上期开奖</span><div class="show-gd1"><ul class="hezhi-flex ' + class_temp + '">';
                }
                // for (var q = 0; q < arr.length; q++) arr[q] && (openNum_HTML += '<li flag="normal">' + arr[q] + "</li>");
                // console.log(arr)
                for (var q = 0; q < arr.length; q++) {
                    // 只能在这里加了
                    if (arr[q]) {
                        // pk10
                        if (id == 3 || id == 8 || id == 46 || id == 43 || id == 29 || id == 51 || id == 58 || id == 59 || id == 60) {
                            openNum_HTML += '<li class="dom-pk10 dom-pk10-'+ arr[q] +'" flag="normal">'+ arr[q] +'</li>'
                        }
                        // 六合彩模板
                        if (id === 28 || id === 9 || id === 48 || id === 53){
                            if (q === 6) {
                                openNum_HTML += '<li flag="normal" class="lhc-bgc lhc-tema lhc-'+colorSixMark(arr[q])+'">'
                                openNum_HTML += '<span>'+ arr[q] +'</span>'
                                openNum_HTML += '<span style="color:#000">'+ effectiveSixMark(arr[q])+'</span>'
                            } else {
                                openNum_HTML += '<li flag="normal" class="lhc-bgc lhc-'+colorSixMark(arr[q])+'">'
                                openNum_HTML += '<span>'+ arr[q] +'</span>'
                                openNum_HTML += '<span style="color:#000">'+ effectiveSixMark(arr[q]) +'</span>'
                            }
                            openNum_HTML += '</li>'
                        }
                        // 时时彩和11选5模板
                        if (id === 64 || id === 65 || id === 66 || id === 61 || id === 62 || id === 63 || id === 4 || id===55 || id === 52 || id === 6 || id === 45 || id === 12 || id === 11 || id == 49 || id == 39 || id == 5 || id == 13 || id == 15 || id == 14) {
                            openNum_HTML += '<li class="lhc-bgc" flag="normal">'+ arr[q] +'</li>'
                        }
                        // 快三模板
                        if (id === 44 || id === 50 || id === 37 || id === 38 || id === 36 || id === 35 || id === 34 || id === 33 || id === 32 || id === 27 || id === 31 || id === 1 || id === 30){
                            openNum_HTML += '<li class="lq3-bgc lq3-bgc-'+ arr[q] +'" flag="normal"></li>'
                        }
                    }
                }
                // 写繁琐点最安全
                //pk10 和值类添加
                if (id == 3 || id == 8 || id == 46 || id == 43 || id == 29 || id == 51 || id == 58 || id == 59 || id == 60) {
                    // console.log('AAAAAAAAAAAAAAAA')
                    var guan = getBigSmallObj(Number(arr[0]), 5, true);
                    var ya = getBigSmallObj(Number(arr[1]), 5, true);
                    var he = getBigSmallObj(Number(arr[1]) + Number(arr[0]), 10, true)
                    openNum_HTML += '<div class="hezhi-iflex">'
                    openNum_HTML += '<p>冠: <span class="'+ guan.bsColor +'">'+ guan.bsName +'</span><span class="'+ guan.dsColor +'">'+ guan.dsName +'</span></p>'
                    openNum_HTML += '<p>亚: <span class="'+ ya.bsColor +'">'+ ya.bsName +'</span><span class="'+ ya.dsColor +'">'+ ya.dsName +'</span></p>'
                    openNum_HTML += '<p>冠亚和: <span class="big-color">'+ (Number(arr[1]) + Number(arr[0])) +'</span><span class="'+ he.bsColor +'">'+ he.bsName +'</span><span class="'+ he.dsColor +'">'+ he.dsName +'</span></p>'
                    openNum_HTML += '</div>'
                }
                // 七星彩系列
                if (id === 64 || id == 65 || id === 66) {
                    // console.log([id, issue, time, openNum, link, name, desc, icon, drawListUrl, item], '')
                   var val= sevenstar(openNum)
                    var size = val < 17?'小':'大'
                    var odd = ''
                    if (val % 2 === 0) {
                        odd = '双'
                    }else{
                      odd = '单'  
                    }
                    openNum_HTML += '<div class="hezhi-iflex no-float">'
                    openNum_HTML += '<p>和值: <span class="big-color">' + val + '</span></p>'
                    openNum_HTML += '<p><span>' + size + '</span></p>'
                    openNum_HTML += '<p><span>' + odd + '</span></p>'
                    openNum_HTML += '</div>'
                }
                // pc蛋蛋系列固定模板
                if (id === 57 || id === 56 || id === 54 ||id == 7 || id == 17 || id == 47) {
                    var he = (Number(arr[2]) + Number(arr[1]) + Number(arr[0]))
                    var heds = getBigSmallObj(he, 13, true, arr)
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[0] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/add.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[1] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/add.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[2] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/equal.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc-blue">'+ he +'</li>'
                    openNum_HTML += '<div class="hezhi-iflex no-float">'
                    openNum_HTML += '<p>和值: <span class="big-color">'+ he +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.dsColor +'">'+ heds.dsName +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.bsColor +'">'+ heds.bsName +'</span></p>'
                    // openNum_HTML += '<p><span>'+ heds.setName +'</span></p>'
                    openNum_HTML += '</div>'
                }
                // 3D
                if (id === 41 || id === 40 || id === 42 ||id == 10 || id == 2 || id == 18) {
                    var he = (Number(arr[2]) + Number(arr[1]) + Number(arr[0]))
                    var heds = getBigSmallObj(he, 13, true, arr)
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[0] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/add.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[1] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/add.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc">'+ arr[2] +'</li>'
                    openNum_HTML += '<span class="pcdd-span"><img src="/pc/common/statics/img/draw/equal.png"/></span>'
                    openNum_HTML += '<li class="pcdd-bgc-blue">'+ he +'</li>'
                    openNum_HTML += '<div class="hezhi-iflex no-float">'
                    openNum_HTML += '<p>和值: <span class="big-color">'+ he +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.dsColor +'">'+ heds.dsName +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.bsColor +'">'+ heds.bsName +'</span></p>'
                    openNum_HTML += '<p><span>'+ heds.setName +'</span></p>'
                    openNum_HTML += '</div>'
                }
                // 六合彩额外
                if (id === 53 ||id === 28 || id === 9 || id === 48){
                    openNum_HTML += '<li class="flex-order"><img src="/pc/common/statics/img/draw/add.png"/></li>'
                }
                // 快三额外
                if (id === 50 || id === 44 || id === 37 || id === 38 || id === 36 || id === 35 || id === 34 || id === 33 || id === 32 || id === 27 || id === 31 || id === 1 || id === 30){
                    var he = (Number(arr[2]) + Number(arr[1]) + Number(arr[0]))
                    var heds = getBigSmallObj(he, 10, true, arr)
                    openNum_HTML += '<div class="hezhi-iflex q3-ss">'
                    openNum_HTML += '<p class="ssc-span">和值: <span> '+ he +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.dsColor +'">'+ heds.dsName +'</span></p>'
                    openNum_HTML += '<p><span class="'+ heds.bsColor +'">'+ heds.bsName +'</span></p>'
                    openNum_HTML += '</div>'
                }
                openNum_HTML += '<span class="tabulousclear"></span></ul></div>'
            } else {
                openNum_HTML = "<span class=\"fl\">上期开奖</span><span class='tip newtip'>正在开奖</span>"
            };
            // var kjzs_link = "\/pc\/trend\/newtrendList.html?lotteryId=" + id;
            var kjzs_link = "\/pc\/trend\/chart.html?lotteryId=" + id;
            var iconSrc = _home_menu.getLotteryIconUrl(id);
            // 足彩单独放模板
            if(id>1e4){
                // console.log(item);
                __str = '<div class="lot-wrap">'
                    + '<div class="lott-top">'
                    + '<div class="lott-name">'
                    + '<span class="lott-imgbox" >'
                    + '<img src="' + iconSrc + '" class="mCS_img_loaded">'
                    + '</span>'
                    + '<div class="lott-name-righ">'
                    + '<h3>' + name + '</h3>'
                    + '</div>'
                    + '</div>'
                    + '<div class="lot-fore">'
                    + '<span class="tip newtip">' + item.indexDesc+'</span>'
                    + '</div>'
                    + '</div>'
                    + '<div class="lott-bot">'
                    // + '<a class="lot-btn" href="/pc/football/common.html">立即投注</a>'
                    + '<a target="_blank"></a>'
                    + '<a target="_blank"></a>'
                    +'<a target="_blank" class="lot-btn" onclick="__openWin(\'home\',\'/pc/football/common.html\')\"="">立即投注</a>'
                    + '</div>'
                    + '</div>';
            } else {
            __str = '<div class="lot-wrap">'
                        +'<div class="lott-top">'
                            +'<div class="lott-name">'
                                +'<a class="lott-imgbox" onclick="_lottery_mall.jumpToBet(\'' + id + '\');" >'
                                    +'<img src="'+iconSrc+'" class="mCS_img_loaded">'
                                +'</a>'
                                +'<div class="lott-name-righ">'
                                    +'<h3>' + name + '</h3>'
                                    +'<p>第' + issue + ' 期</p>'
                                    +'<div class="gct_time">'
                                        +'<div class="gct_time_now">'
                                            +'<div class="gct_time_now_l">'
                                            + time_html(time)
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                            +'<div class="lot-fore">'
                                + openNum_HTML
                            +'</div>'
                        +'</div>'
                        +'<div class="lott-bot">'
                            +'<a target="_blank" onclick="__openWin(\'home\',\''+ (drawListUrl || "") +'\')">开奖公告</a>'
                            +'<a target="_blank" onclick="__openWin(\'home2\', \''+ kjzs_link + '\')">开奖走势</a>'
                            +'<a class="lot-btn bg-col" onclick="_lottery_mall.jumpToBet('+ id +')">立即投注</a>'
                            // +'<a target="_blank" onclick="__openWin(\'home\',\'' + (drawListUrl || " ") = "" +="" "')\"="">开奖结果</a>'
                        +'</div>'
                    +'</div>'

            }
            return __str
            // //什么鬼东西
            // return '<div class="lot-wrap"><div class="lott-top"><div class="lott-name"><a class="lott-imgbox"  onclick="_lottery_mall.jumpToBet(\'' + id + '\');" ><img src="'+iconSrc+'" class="mCS_img_loaded"></a><div class="lott-name-righ"><h3>' + name + "</h3><p>第 " + issue + ' 期</p><div class="gct_time"><div class="gct_time_now"><div class="gct_time_now_l">' + time_html(time) + '</div></div></div></div></div><div class="lot-fore">' + openNum_HTML + '</div></div><div class="lott-bot"><a target="_blank" onclick="__openWin(\'home\',\'' + (drawListUrl || "") + "')\">开奖结果</a><a onclick=\"__openWin('home2','" + kjzs_link + '\');"  target="_blank">开奖走势</a><a class="lot-btn" onclick="_lottery_mall.jumpToBet(\'' + id + "')\">立即投注</a></div></div>"
        }

        var gameIdStr = gameIdStr || "";
        var luckNav = ['全部', "快三", " PC蛋蛋", "时时彩", "PK10", "六合彩", "11选5", "七星彩","3D系列", "竞技彩"];
        var systemTime = '';
        Utils.requestNeedTint("front/lottery/init.do", {}, function (data) {
            // $("#_tip_loading_").css("display", "none")
            if (0 == data.code) {
                var navHtml = '<ul class="luck-number-list" id=luckNav><li class="active"><!---->全部</li >'+
                    '<li class=""><img src="/pc/common/statics/img/draw/QuickThree.png" class="nav-icon">快三' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/PCEggs.png" class="nav-icon">PC蛋蛋' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/FrequentLottery.png" class="nav-icon">时时彩' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/pk10.png" class="nav-icon">PK10' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/SixMark.png" class="nav-icon">六合彩' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/ElevenPickFive.png" class="nav-icon">11选5' +
                    '</li><li class=""><img src="/pc/common/statics/img/draw/SevenStar.png" class="nav-icon">七星彩' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/FrequentHappy.png" class="nav-icon">3D系列' +
                '</li><li class=""><img src="/pc/common/statics/img/draw/Football.png" class="nav-icon">竞技彩' +
                '</li></ul>';
                $("#ele-live-wrap>div").html(navHtml);
                systemTime = data.system_time;
                _this.renderNav(lotteryMall.newSortArr);
                $("#demo_right").css("display", "none");
                Utils.saveStorage('lotteryListData',data.data);
            }
        });
        this.renderNav = function(arr){
            for (var arrOuter = [], allStr = [], i = 0; i < arr.length; i++) {
                var id = arr[i].id;
                if (allStr.push(id), void 0 == lotteryMall.obj[id]) return;
                var item = lotteryMall.obj[id], link = lotteryLink(item.name) + "?lotteryId=" + item.lotteryId,
                    drawListUrl = "pc/draw/newIndex.html?lotteryId=" + item.lotteryId, name = item.name,
                    issue = item.currentIssue,
                    time = parseInt((new Date(item.deadline) - new Date(systemTime)) / 1e3),
                    openTime = time > 40 ? time - 40 : time,
                    openNum = "正在开奖" == item.lastLuckyNumbers ? "" : item.lastLuckyNumbers,
                    temp = '<div data-className=' + arr[i].className+' class="showhide-38 ele-live-layout" id="lot' + id + '" data-id="' + id + '" data-issue="' + issue + '" data-time="' + time + '" data-opentime="' + openTime + '" data-opennum="' + openNum + '" data-ajax="false" data-lasttimer="' + (new Date).getTime() + '">' + lottery_innerHtml(id, issue, time, openNum, link, name, '', item.icon, drawListUrl,item) + "</div>";
                    if(id>1e4) {
                        temp = '<div data-className=' + arr[i].className + ' class="showhide-38 ele-live-layout" id="lot' + id + '" data-id="' + id + '" data-issue="' + issue + '" data-time="' + time + '" data-opentime="' + openTime + '" data-opennum="' + openNum + '" data-ajax="false" data-lasttimer="' + (new Date).getTime() + '">' + lottery_innerHtml(id, issue, time, openNum, link, name, '', item.icon, drawListUrl, item) + "</div>";
                    }
                id < 1e6 && arrOuter.push(temp)
            }
            $("#ele-live-wrap>div").append(arrOuter.join(""));
            timer(allStr.join(","));
        }
        var refreshLottery = function (gameIdStr) {
            !function (gameIdStr) {
                if (window.betLotteryId === '') {
                    Utils.request("front/lottery/draw_infos.do", {lotteryIds: gameIdStr}, function (data) {
                        try {
                            if (!1 === session_timeout(data)) return !1
                        } catch (e) {
                            console.log(e)
                        }
                        if (!data.data) return;
                        for (var _data = data.data, p = 0; p < _data.length; p++) {
                            if (_data[p]) {
                                // console.log('_data[p]: ', _data[p]);
                                var id = _data[p].lotteryId,
                                    item = _data[p],
                                    link = lotteryLink(item.name) + "?lotteryId=" + item.lotteryId,
                                    drawListUrl = "pc/draw/newIndex.html?lotteryId=" + item.lotteryId,
                                    name = item.name,
                                    issue = item.currentIssue,
                                    time = parseInt((new Date(item.deadline) - new Date(data.system_time)) / 1e3),
                                    openTime = time > 40 ? time - 40 : time,
                                    openNum = "正在开奖" == item.lastLuckyNumbers ? "" : item.lastLuckyNumbers;

                              $("#lot" + id).data("issue", issue);
                              $("#lot" + id).data("time", time);
                              $("#lot" + id).data("opentime", openTime);
                              $("#lot" + id).data("opennum", openNum);
                              $("#lot" + id).data("lasttimer", (new Date).getTime());
                              $("#lot" + id).html(lottery_innerHtml(id, issue, time, openNum, link, name, '', item.icon, drawListUrl));
                              $("#lot" + id).data("ajax", "false");
                            }
                        }
                    })
                }
            }(gameIdStr)
        };
        $(parent.document).find("#live-main-list").length > 0 && ($(parent.document).find("#live-main-list").on("click", "#hot_lottery .main-tit", function () {
            $(this).find("i").attr("class").indexOf("icon-attr-up") >= 0 ? ($("#ele-live-wrap>div>.ele-live-layout").hide(), $("#lot" + parent.$(this).data("gameIdStr").split(",").join(",#lot")).show()) : $("#ele-live-wrap>div>.ele-live-layout").show()
        }), $(parent.document).find("#live-main-list").on("click", ".main-top", function () {
            $(this).find("i").attr("class").indexOf("icon-attr-up") >= 0 ? ($("#ele-live-wrap>div>.ele-live-layout").hide(), $("#lot" + parent.$(this).data("gameIdStr").split(",").join(",#lot")).show()) : $("#ele-live-wrap>div>.ele-live-layout").show()
        }))
    }, jumpToBet: function (lotteryId) {
        if (window.isRequestLottery) {
            return;
        }
        window.isRequestLottery = true;
        betLottoryRecord.times = 1;
        $("#_tip_loading_").css("display", "block");
        window.location.hash.indexOf("#lotteryId=") > -1 ? history.replaceState ? history.replaceState(null, null, window.location.href.split("#lotteryId=")[0] + "#lotteryId=" + lotteryId) : window.location.hash = "" : history.replaceState ? history.replaceState(null, null, window.location.href + "#lotteryId=" + lotteryId) : window.location.hash = "", $("#i_list_1").hide(), $("#i_list_2").show(), $("#i_list_2 #bet_head").html(""), $("#i_list_2 #bet_content").html(""), betLottoryHead.init(lotteryId),betLottoryRecord.init(lotteryId), betLottoryFoot.init(lotteryId)
    }
}, $(function () {
    $("#i_list_1").hide(), $("#i_list_2").show(), _lottery_mall.goIframe(), _lottery_mall.ajax_1(), $(document).attr("title", "购彩大厅"), $("head title").text("购彩大厅") ,
    getBallSetColors();
    Utils.saveStorage('lotteryListIssue',[]);
    getIssue(1);
    window.isRequestLottery = false;
    // 给导航添加点击事件
    var luckClassName = ['all', 'QuickThree', 'PCEgg|Luck', 'FrequentLottery', 'PK10', 'SixMark', 'PickFive', 'Seven','ArrangeThree|ThreeD|FrequentHappy', 'Football'];
    $(document).on('click','.luck-number-list li',function () {
        $('.active').removeClass('active');
        $(this).addClass('active');
        // 过滤彩种
        var resultArr = [];
        var index = $(this).index();
        if(0===index){
            $('div[data-className]').show();
        }else {
            var curType = luckClassName[$(this).index()].split('|');
            $('div[data-className]').hide().each(function(item){
                var _this = $(this);
                curType.some(function(type){
                    if (_this.data('classname').toUpperCase().includes(type.toUpperCase())){
                        _this.show();
                    }
                })
            })
        }
    })
});
