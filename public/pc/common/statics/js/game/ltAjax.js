$.fn.lt_ajaxSubmit = function () {
    var me = this;
    $(this).click(function () {
        if (checkTimeOut() == false) {//未超时
            return;
        }
        $.lt_submiting = true;//倒计时提示的主动权转移到这里
        var istrace = $($.lt_id_data.id_tra_if).prop("checked");
        if ($.lt_total_nums <= 0 || $.lt_total_money <= 0) {//检查是否有投注内容
            $.lt_submiting = false;
            $.alert(lot_lang.am_s7);
            return;
        } else if ($.lt_total_nums > 1000) {
          _alert("投注总数禁止超过1000注，请减少注数！");
          return false;
        }
        if (istrace == true) {//追号开关打开
            if ($.lt_trace_issue <= 0 || $.lt_trace_money <= 0) {//检查是否有追号内容
                $.lt_submiting = false;
                $.alert(lot_lang.am_s20);
                return;
            }
            var terr = "";
            $("input[name^='lt_trace_issues']:checked", $($.lt_id_data.id_tra_issues)).each(function () {
                if (Number($(this).closest("tr").find("input[name^='lt_trace_times_']").val()) <= 0) {
                    terr += $(this).val() + '&nbsp;&nbsp;';
                }
            });
            if (terr.length > 0) {//有错误倍数的奖期
                $.lt_submiting = false;
                $.alert(lot_lang.am_s21.replace("[errorIssue]", terr), '', '', 300, false);
                return;
            }
        }
        if (istrace == true) {
            var msg = '<h4>' + lot_lang.am_s144.replace("[count]", $.lt_trace_issue) + '</h4>';
        } else {
            var msg = '<h4>' + lot_lang.dec_s8.replace("[issue]", $("#current_issue").html()) + '</h4>';
        }
        $.lt_singlebet_winmoney = ( $.lt_singlebet_winmoney == undefined || $.lt_singlebet_winmoney == '' || $.lt_singlebet_winmoney == 0 ) ? $('#singlebet_maxwin').val() : 1000000;//默认1000000
        if ($.lt_singlebet_winmoney == undefined || $.lt_singlebet_winmoney == '' || $.lt_singlebet_winmoney == 0) {
            $.lt_singlebet_winmoney = 1000000;
        }
        var modesmsg = [];
        var modes = 0;
        var lossMoney = 0;//亏损的钱
        var tmpMsg = '';
        var tmpMsgPos = '';
        var blPosition = false;
        $.each($('tr', $($.lt_id_data.id_cf_content)), function (i, n) {
            datas = $(n).data('data');
            // console.log(datas);
            var tmpData = $(n).find(":input").val();
            var jsonobj = eval('(' + tmpData + ')');
            var money = (jsonobj.money == undefined || jsonobj.money == '') ? 0 : jsonobj.money;//投注金额
            var point = (jsonobj.point == undefined || jsonobj.point == '') ? 0 : jsonobj.point;//返水百分比
            //计算每注亏损=最高可中奖金额-投注金额+返水金额,最高可中奖金额=赔率*投注金额
            var tmpWinMoney = money * datas.prize;
            tmpWinMoney = (tmpWinMoney > $.lt_singlebet_winmoney) ? $.lt_singlebet_winmoney : tmpWinMoney;
            var tmpMoney = tmpWinMoney - money + money * point;//最高可以获得的总金额
            lossMoney += (tmpMoney < 0) ? -tmpMoney : 0;
            tmpMsg += '<tr><td>' + datas.methodname + '</td>'
                + '<td>' + datas.modename + '</td>'
                + '<td title="' + datas.fulldesc + '">' + datas.desc + '</td>'
                + '<td>' + money + '</td></tr>';
            tmpMsgPos += '<tr><td>' + datas.methodname + '</td>'
                + '<td>' + datas.modename + '</td>'
                + '<td title="' + datas.fulldesc + '">' + datas.desc + '</td>'
                + '<td>' + datas.positiondesc + '</td>'
                + '<td>' + money + '</td></tr>';
            if (datas.positiondesc != "") {
                blPosition = true;
            }
            // console.log(tmpMsg);
            // console.log(tmpMsgPos);
        });
        msg += '<div class="data">'
            + '<table border=0 cellspacing=0 cellpadding=0 width=100%>'
            + '<tr class=hid>'
            + '<td width=150>玩法</td>'
            + '<td width=40>单位</td>'
            + '<td width=180>内容</td>';
        if (blPosition) {
            msg += '<td width=110>位置</td>';
        }
        msg += '<td>金额</td></tr>';
        if (blPosition) {
            msg += tmpMsgPos;
        } else {
            msg += tmpMsg;
        }
        msg += '</table></div>';
        msg += '<div class="binfo"><span class=bbm>' + (istrace == true ? lot_lang.dec_s16 + ': ' +
                JsRound($.lt_trace_money, 2, true) : lot_lang.dec_s9 + ': ' + $.lt_total_money) + ' ' + lot_lang.dec_s3 +
            '</span><!--<span style="margin-left: 10px;">单注最高奖:' + $('#singlebet_maxwin').val() + '元</span>--></div>';

        $.confirm(msg, function () {//点确定[提交]
            if (checkTimeOut() == false) {//正式提交前再检查以下时间
                $.lt_submiting = false;
                return;
            }
            $("#lt_total_nums").val($.lt_total_nums);
            $("#lt_total_money").val($.lt_total_money);
            //TODO 提交数据
            ajaxSubmit();
        }, function () {//点取消
            $.lt_submiting = false;
            return checkTimeOut();
        }, '', 580, true);
    });
    //检查时间是否结束，然后做处理
    function checkTimeOut() {
        if ($.lt_time_leave <= 0) {//结束   //当前期结束，是否要清空已投注
          console.log("弹出啦 "+$.lt_time_leave);

            $.confirm(lot_lang.am_s99.replace("[msg]", lot_lang.am_s15), function () {//确定
                $.lt_reset(false);
                $.lt_ontimeout();//重新发期数请求
            }, function () {//取消
                $.lt_reset(true);
                $.lt_ontimeout();//重新发期数请求
            }, '', 450);
            return false;
        } else {
            return true;
        }
    }
    function serializeObject(form) {
      var o = {};
      $.each(form.serializeArray(), function(index){
        if(o[this['name']]){
           o[this['name']] = o[this['name']] +","+this['value'];
        }else{
           o[this['name']] = this['value'];
        }
      });
      return o;
    }
    //ajax提交表单
    function ajaxSubmit() {
        $.blockUI({
            message: lot_lang.am_s22,
            overlayCSS: {
                backgroundColor: '#000000',
                opacity: 0.3,
                cursor: 'wait'
            }
        });
        var form = $(me).closest("form");
        console.log($(form));
        var data = $(form).serialize();
        //封装对象，调用购买彩票接口
        var obj = serializeObject(form);
        console.log("这个是obj");
        console.log(obj);
        var list = [] , projects = [];
        var projects_str = '[' + obj['lt_project[]'] + ']';
        projects = eval('(' + projects_str + ')');
        console.log(projects);

        var lt_trace_if = obj['lt_trace_if'];
        var lt_trace_stop;
        var tra_issues;
        var betWinStop =null;
        if (lt_trace_if != undefined) {
          var tra_issues_str = '[' + obj['lt_trace_issues[]'] + ']';
          tra_issues = eval('(' + tra_issues_str + ')');
          lt_trace_stop = obj['lt_trace_stop'];

          betWinStop = lt_trace_stop =="yes"? "Y":"N";
        }

        var reward;
        if ($('#sliderSpanStart') != undefined && $('#sliderSpanStart').html() != '') {
          tempRd = $('#sliderSpanStart').html();
          reward = parseFloat(tempRd.split("%")[0]) / 100;
        }
        //TODO
        var after = ( $("#times_nums").val() ? $("#times_nums").val() : 1 );
        $.each(projects , function(i){
          var p = projects[i];
          var buycp = {};
          // buycp.unitPrice = parseFloat(p.money / parseInt(p.nums));
          // buycp.buyCount = p.nums;
          // buycp.location = p.position;
          // buycp.cpCategoryId = pri_lotteryid;
          // buycp.periodNO = $('#current_issue').text();
          // buycp.playTypeId =p.methodid ;
          // buycp.playTypeName =p.desc ;
          // buycp.buyNO = p.codes;
          // buycp.cpCategoryName = $.lottery_name;
          // buycp.reward = p.point;
          // buycp.betWinStop = betWinStop;
          // buycp.traIssues = JSON.stringify(tra_issues);
          // console.log(p);

          var nNums = p.codes.split('|');
          if (nNums.length == 1) {
            nNums = nNums[0].split('&');
            if (nNums.length > 1) {
              nNums = nNums.join(',');
            } else {
              nNums = nNums.join('');
            }
            // nNums = nNums.join('');
          } else {
            var ar = [];
            for (var i = 0; i < nNums.length; i++) {
              var ex = nNums[i];
              // console.log(ex);
              if (!ex) {
                ex = "-";
              } else {
                var ex = ex.split('&');
                if (ex.length == 1) {
                  ex = ex.join('');
                } else {
                  ex = ex.join('|');
                }
              }
              ar.push(ex);
            }
            // console.log(ar);
            nNums = ar.join(',');
          }

          buycp.unitFee = parseFloat(p.money / parseInt(p.nums)) * 100;
          buycp.size = p.nums;
          buycp.location = p.position;
          buycp.lotteryId = pri_lotteryid;
          buycp.issue = $('#current_issue').text();
          buycp.playId = p.methodid;

          buycp.odds = parseInt(p.odds);
          buycp.numbers = nNums;
          buycp.lotteryName = $.lottery_name;
          buycp.rebate = (parseFloat(p.point)*100).toFixed(2);
          if (after > 1) {

              buycp.remark = '注单追号';
          } else {
              buycp.remark = '购彩大厅'
          }
          // buycp.playName =p.desc ;
          // buycp.betWinStop = betWinStop;
          // buycp.traIssues = JSON.stringify(tra_issues);
          list.push(buycp);
        });
        var jsonObj = JSON.stringify(list);
        console.log("购彩提交订单：");
        console.log(list);
        
        $.ajax({
            type: 'POST',
            url: "/front/bet/betting.do"+"?after="+after,
            // url: $.lt_ajaxurl,
            timeout: 10000,
            dataType: 'JSON',
            data: jsonObj,
            contentType:'application/json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
                var _temporary = Utils.getStorage('temporaryId') || null
                if (_temporary) {
                    xhr.setRequestHeader('temporary-sessionId', _temporary);
                }
                xhr.setRequestHeader("client-version", window.clientVersion);
                xhr.setRequestHeader("x-requested-with",window.xWidth);
            },
            success: function (data) {
                $.unblockUI({
                    fadeInTime: 0,
                    fadeOutTime: 0
                });
                if (data.is_timeout == 'timeout') {
                    alert('请登录!');//timeout 是在这里写的吗 魂淡
                    return false;
                }
                var result = session_timeout(data);
                if (result === false) {
                    return false;
                }
                $.lt_submiting = false;
                if (data.length <= 0) {
                    $.alert(lot_lang.am_s16);
                    return false;
                }
                if (data.code == 0) {//购买成功
                    parent._user_.refreshMoney("#balance");//_user_.refreshMoney("#balance");
                    $.lt_reset();//清空注单
                    $.alert(lot_lang.am_s24, lot_lang.dec_s25, function () {
                        $.lt_onfinishbuy();
                        $.fn.fastData();
                        //TODO 更新投注记录的地方，或许需要做
                        $.fn.updatehistory();
                    });
                    $($.lt_id_data.id_tra_if).prop("checked", false);
                    $($.lt_id_data.id_tra_stop).attr("disabled", true).prop("checked", false);
                    $($.lt_id_data.id_tra_box).hide();

                    bet_con();//TODO 更新投注记录
                    return false;
                } else {//购买失败提示
                    if (data.msg != '') {//错误
                        $.lt_reset();//清空注单
                        $.alert(lot_lang.am_s100 + data.msg, '', function () {
                            return checkTimeOut();
                        }, (data.msg.length > 10 ? 350 : 250));
                        //TODO 返回消息错误
                        return false;
                    }
                }
            },
            error: function () {
                $.lt_submiting = false;
                $.unblockUI({
                    fadeInTime: 0,
                    fadeOutTime: 0
                });
                $.confirm(lot_lang.am_s99.replace("[msg]", '系统超时'), function () {//点确定[清空],//交易状态不确定,请查看是否购买成功,是否要清空已投注内容?
                    if (checkTimeOut() == true) {//时间未结束
                        $.lt_reset();
                    }
                    $.lt_onfinishbuy();
                    $.fn.fastData();
                    $.fn.updatehistory();
                }, function () {//点取消
                    $.lt_onfinishbuy();
                    $.fn.fastData();
                    $.fn.updatehistory();
                    return checkTimeOut();
                }, '', 480, true);
                return false;
            }
        });
    }

};
