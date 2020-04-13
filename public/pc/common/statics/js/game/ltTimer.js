//倒计时
$.fn.lt_timer = function (start, end) {//服务器开始时间，服务器结束时间
    console.log("开始时间：" + start + ",结束时间：" + end);
    var me = this;
    if (start == "" || end == "") {
        $.lt_time_leave = 0;
    } else {
        // $.lt_time_leave = (format(end).getTime() - format(start).getTime()) / 1000;//总秒数
        $.lt_time_leave =  parseInt((new Date(end) - new Date(start)) / 1000);  //关盘剩余秒数
        console.log("xxxxxxxxxxxxxxxxxxxxx left "+$.lt_time_leave);
    }
    function fftime(n) {
        return Number(n) < 10 ? "" + 0 + Number(n) : Number(n);
    }

    function format(dateStr) {//格式化时间
        // return new Date(dateStr.replace(/[\-\u4e00-\u9fa5]/g, "/"));
        return dateStr;
    }
    function diff(t) {//根据时间差返回相隔时间
        return t > 0 ? {
                day: Math.floor(t / 86400),
                hour: Math.floor(t / 3600),
                minute: Math.floor(t % 3600 / 60),
                second: Math.floor(t % 60)
            } : {
                day: 0,
                hour: 0,
                minute: 0,
                second: 0
            };
    }
    var firstTime = 60 + randomKey;
    var secondTime = Math.ceil(Math.random() * (89 - 30) + 30);
    // console.log(secondTime+" second time");
    var timerno = setInterval(function () {
        //随机读取服务器时间
        // console.log($.lt_time_leave+" 倒计时");
        // if ($.lt_time_leave > 0 && ($.lt_time_leave % firstTime == 0 || $.lt_time_leave == secondTime)) {
        //     window.__temp_type1_dateTime = new Date().getTime();
        //     var paramissue = $($.lt_id_data.id_cur_issue).html();
        //     console.log(paramissue+" 当前期数 TODO 更新开奖号码");
        //     Utils.request($.lt_ajaxurl, {lotteryId: $.lt_lottid}, function(res) {
        //       if (res.code == 0) {
        //         console.log(res);
        //         var _data = res.data;
        //         var lucks = _data.lastLuckyNumbers;
        //         var codebox = $("#showcodebox").find("li");
        //         if (lucks == "正在开奖") {
        //
        //         } else {
        //           var codes = lucks.split(',');
        //           console.log(codes);
        //           $.each(codebox, function (i, n) {
        //             $(codebox[i]).attr("flag", "normal");
        //             $(this).html(codes[i]);
        //           });
        //         }
        //       }
        //       // //TODO 倒计时
        //       // var _data = res.data, _deadline = _data.deadline, dataT = 0;
        //       //
        //       // var shicha = Math.round((__temp_type1_dateTime - new Date().getTime()) / 2000);
        //       // shicha = shicha < 1 ? 1 : shicha;
        //       // var deadshicha = _deadline - __temp_type1_dateTime;
        //       // console.log(deadshicha);
        //       // console.log(shicha);
        //       //
        //       // dataT = deadshicha - shicha;
        //       // dataT = parseInt(dataT, 10);
        //       // dataT = isNaN(dataT) ? 0 : dataT;
        //       // dataT = dataT <= 0 ? 0 : dataT;
        //       // $.lt_time_leave = dataT;
        //       // if (_last_query_daojishi.hasOwnProperty("remainTime") && _last_query_daojishi.issue == paramissue && dataT <= 5) {
        //       //     $.lt_time_leave = 0;
        //       // }
        //       // _last_query_daojishi = {issue:paramissue, remainTime:dataT};
        //     });
        //     // $.ajax({
        //     //     type: 'POST',
        //     //     url: $.lt_ajaxurl,
        //     //     timeout: 30000,
        //     //     data: "lotteryid=" + $.lt_lottid + "&issue=" +paramissue+ "&type=1",
        //     //     success: function (data) {//成功
        //     //         var objdata = eval("(" + data + ")");
        //     //         var result = session_timeout(objdata);
        //     //         if (result === false) {
        //     //             return false;
        //     //         }
        //     //         var shicha = Math.round((__temp_type1_dateTime-new Date().getTime())/2000) ;
        //     //         shicha = shicha < 1 ? 1 : shicha;
        //     //         data = data - shicha;
        //     //         data = parseInt(data, 10);
        //     //         data = isNaN(data) ? 0 : data;
        //     //         data = data <= 0 ? 0 : data;
        //     //         $.lt_time_leave = data;
        //     //         if(_last_query_daojishi.hasOwnProperty("remainTime") && _last_query_daojishi.issue == paramissue && data <= 5) {
        //     //             $.lt_time_leave=0;
        //     //         }
        //     //         _last_query_daojishi = {issue:paramissue,remainTime:data};
        //     //     }
        //     // });
        // }

        if ($.lt_time_leave <= 0) {//结束 //lt_time_leave投注剩余秒数
            console.log($.lt_time_leave + " time leave "+($.lt_time_leave<=0));
            clearInterval(timerno);
            //倒计时结束，清除获取上一期开奖号码定时器
            // clearInterval($.lt_timerLastCodeNo);
            //进入开奖倒计时,只有上期正常获取到才继续下期获取
            $("#lt_opentimeleft").lt_opentimer(parseInt($($.lt_id_data.id_cur_issue).html()), 3);
            //节约服务器性能，本期投注倒计时为0之后的70秒后才会有上期的开奖结果，而这里延迟55秒开启定时器(该定时器用来查询开奖号码)。
            $($.lt_id_data.id_tra_if).prop("checked", false);
            $($.lt_id_data.id_tra_stop).attr("disabled", true).prop("checked", false);
            $($.lt_id_data.id_tra_box).hide();
            console.log($.lt_submiting + " 是否有注单表单");
            if ($.lt_submiting == false) { //如果没有正在提交数据则弹出对话框,否则主动权交给提交表单
                $.unblockUI({
                    fadeInTime: 0,
                    fadeOutTime: 0
                });
                console.log("弹出啦");
                $.confirm(lot_lang.am_s99.replace("[msg]", lot_lang.am_s15), function () { //确定
                    $.lt_reset(false);
                    $.lt_ontimeout();
                }, function () {//取消
                    $.lt_reset(true);
                    $.lt_ontimeout();
                }, '', 450);
                var confirm_no_txt = $("#confirm_no").val();
                var auto_close_seconds = 3; // 奖期投注倒计时截止时弹出框自动关闭秒数
                var auto_close_timerno = setInterval(function () {
                    if (auto_close_seconds <= 0) {
                        clearInterval(auto_close_timerno);
                        $("#confirm_no").click();
                    }
                    $("#confirm_no").val(confirm_no_txt + " (" + auto_close_seconds + ")");
                    auto_close_seconds--;
                }, 1000);
            }
            //TODO 将投注记录里，已close的期数的投注的checkbox去掉
            setHisCheckbox( $('#current_issue').text() );
        }

        ////开奖倒计时
        var oDate = diff($.lt_time_leave--);
        var ahour = fftime(oDate.hour).toString().split("");
        var aminute = fftime(oDate.minute).toString().split("");
        var asecond = fftime(oDate.second).toString().split("");
        if (ahour[0] != $(me).find(".leaveh-1").find("span").html()) {
            $(me).find(".leaveh-1").html('<span>' + ahour[0] + '</span>');
        }
        if (ahour[1] != $(me).find(".leaveh-2").find("span").html()) {
            $(me).find(".leaveh-2").html('<span>' + ahour[1] + '</span>');
        }
        if (aminute[0] != $(me).find(".leavem-1").find("span").html()) {
            $(me).find(".leavem-1").html('<span>' + aminute[0] + '</span>');
        }
        if (aminute[1] != $(me).find(".leavem-2").find("span").html()) {
            $(me).find(".leavem-2").html('<span>' + aminute[1] + '</span>');
        }
        if (asecond[0] != $(me).find(".leaves-1").find("span").html()) {
            $(me).find(".leaves-1").html('<span>' + asecond[0] + '</span>');
        }
        if (asecond[1] != $(me).find(".leaves-2").find("span").html()) {
            $(me).find(".leaves-2").html('<span>' + asecond[1] + '</span>');
        }

    }, 1000);
};
//开奖倒计时，获得近期开奖号码
//openissue:上期开奖号码 TODO 这里有一个定时请求的东东。我去。两个定时请求，哪个是哪个啊。。made
$.fn.lt_opentimer = function (openissue, delayTime) { //服务器开始时间，服务器结束时间 //delayTime:延迟N秒后再查询上期的开奖号码
    $.lt_open_status = false;
    $("#lt_opentimebox2").show();
    //开奖号码
    function _getcode(issue) {
        Utils.request('front/lottery/draw_info.do',{lotteryId:$.lt_lottid},function (data) {
            if (data == '') {
                return;
            }
            $("#lt_gethistorycode").html(data.data.lastIssue);
            if (data.data.lastLuckyNumbers || data.data.lastLuckyNumbers != '') {
                var lucks = data.data.lastLuckyNumbers;
                var codebox = $("#showcodebox").find("li");
                if (lucks == "正在开奖") {
                  code = '';
                  // moveno();
                  // var str = lucks.split('');
                  // $.each(codebox, function (i, n) {
                  //   $(codebox[i]).attr("flag", "normal");
                  //   $(this).html( (str[i]?str[i]:"") );
                  // });
                } else {
                  // clearInterval(opentimerget);
                  // $("#lt_opentimebox2").hide();
                  // clearInterval(moveno);
                  // moveno = null;
                  // $(codebox[$i]).attr("flag", "normal");
                  $.lt_open_status = true;
                  var codes = lucks.split(',');
                  var $i = codebox.length - 1;
                  console.log(codes);
                  $.each(codebox, function (i, n) {
                    $(codebox[i]).attr("flag", "normal");
                    $(this).html(codes[i]);
                  });
                  clearInterval(opentimerget);
                  $("#lt_opentimebox2").hide();
                  clearInterval(moveno);
                  moveno = null;
                }
            }
            // $($.lt_id_data.id_count_down).lt_timer(opts.servertime, opts.cur_issue.endtime);
            Utils.request('front/lottery/luck_number.do', {lotteryId: $.lt_lottid}, function(res) {
              // console.log(res);
              // var recentlycode = data.recentlycode;
              // if (recentlycode) {
              //   fillRecently(recentlycode);
              // }
              if (res.code == 0) {
                fillRecently(res.data.slice(0, 5));
              }
            });
        });
        //,function (msg) {
        //     window.location.reload();
        // }

        // $.ajax({
        //     type: 'POST',
        //     dataType: 'JSON',
        //     url: $.lt_ajaxurl,
        //     data: "lotteryid=" + $.lt_lottid + "&type=3&issue=" + issue,
        //     success: function (data) {
        //         var result = session_timeout(data);
        //         if (result === false) {
        //             return false;
        //         }
        //         if (data == '') {
        //             return;
        //         }
        //
        //         if (data.code != 0) {
        //             _alert(data.msg);
        //             return;
        //         }
        //
        //         $("#lt_gethistorycode").html(data.issue);
        //         if(data.code != '' ){
        //             $.lt_open_status = true;
        //             var codebox = $("#showcodebox").find("li");
        //             var $i = codebox.length - 1;
        //             clearInterval(opentimerget);
        //             $("#lt_opentimebox2").hide();
        //             clearInterval(moveno);moveno=null;
        //             $(codebox[$i]).attr("flag", "normal");
        //             $.each(codebox, function (i, n) {
        //                 $(this).html(data.code[i]);
        //             });
        //         }
        //         var recentlycode = data.recentlycode;
        //
        //         fillRecently(recentlycode);
        //     },
        //     error: function(XMLHttpRequest,status) {
        //         window.location.reload();
        //     }
        // });
    }

    //每过一段时间就重新请求，获取开奖号码
    $('#lt_gethistorycode').html(openissue);//上期的期号
    var tttime = 9*1000;//Math.ceil(Math.random() * 15 + 10) * 1000;//10-25秒之间读取
    var _flag = 0;
    console.log('一开始和结束后，每经过一段时间');
    //_getcode( $.trim($('#lt_gethistorycode').html()) );
    window.opentimerget = setInterval(function () {
        // _flag++;
        console.log('经过了draw_info.do')
        if ($.lt_open_status == true) {
            console.log("is open status " + $.lt_open_status);
            clearInterval(moveno);
            $.each($("#showcodebox").find("li"), function (i, n) {
                $(this).attr("flag", "normal");
            });
            clearInterval(opentimerget);
        }
        if ( !delayTime || ( delayTime && (_flag+1)*tttime >= delayTime*1000) ) {
            //_flag <= 1 ||
            //_flag==1 当天第一期时候，无需延迟delayTime的时间，
            //TODO 这个很重要。
            _getcode( $.trim($('#lt_gethistorycode').html()) );
        }
    }, tttime);
    // console.log(opentimerget);
    //未开奖的时候，数字随机滚动
    $("#showcodebox").find("li").attr("flag", "move");
    window.moveno = setInterval(function () {
        if (moveno == null) {
            clearInterval( window.moveno);
            return;
        }
        $.each($("#showcodebox").find("li"), function (i, n) {
            $(this).html(Math.floor(10 * Math.random()));
        });
    }, 100);
};

var fillRecently = function (recentlycode) {
  // console.log(recentlycode);
  var $sRecentlyCode = "";
    var issuecount = recentlycode.length;
    var openCodeStr = '开奖号码';
    var codeCss = 'gd-box-h';
    if ($.lt_lottid == '9'||$.lt_lottid == '52') {
        openCodeStr = '';
        codeCss = 'gd-box-p';
    }
    for (var m = 0; m < issuecount; m++) {
        var allcode = recentlycode[m].number.split(',');
        var codecount = allcode.length;
        if (codecount > 5) {
          openCodeStr = "";
        }
        $sRecentlyCode += '<p>第<span class="gd-box-q">' + recentlycode[m].issue + '</span>期' + openCodeStr + ': &nbsp;&nbsp;';

        for (var n = 0; n < codecount; n++) {
            $sRecentlyCode += '<span class="' + codeCss + '">' + allcode[n] + '</span>';
        }
        $sRecentlyCode += '</p>';
    }
    $("#gd-box2").html($sRecentlyCode);
}
