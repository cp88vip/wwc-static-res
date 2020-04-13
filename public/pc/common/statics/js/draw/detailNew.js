
window._openDetailManager = {
    // 开奖大厅
  getSingleOpenList:function(lotteryId,dateStr){
    if (lotteryId == undefined) {
      return ;
    }
    $("#_games_2  table tbody").html("");
    $('.checkLoding').show();
    $('.checkNodata').hide();
    var date = (dateStr == "")?Utils.getDistanceFromToday(0):dateStr;
    // console.log($('#cqssc_draw_time_box').val())
    // console.log(localStorage.getItem('fmtDate'))
    var param = {
      'lotteryId': lotteryId,
      'date': $('#cqssc_draw_time_box').val()
    };
    Utils.request('pc/front/lottery/get_luck_number_list.do',param,function (res) {
        $('.checkLoding').hide();
        $('.checkNodata').hide();
        if (res.code != 0) {
          $('.checkNodata').show();
          $('.checkNodata').html(data.msg);
          return ;
        }
        var data = res.data;
        var item = data.data;
        // 初始化头部信息
        $('#_games_2 h1').html(item.name+"开奖公告");
        $(".sl-draw-notice-r").html("共"+item.issueNum+"&nbsp;&nbsp;&nbsp;&nbsp;"+item.frequency+"开奖");
        $("#cqssc_latest_draw_phase").html(item.issue);
        $(".sl-draw-number").html("");
        $(".sl-draw-number").html(_openManager.getBallDiv(item));
        // 如果是低频彩不需要时间查询
         if (item.oldType == "l") {
           $(".sl-draw-list-t").hide();
         } else {
           $(".sl-draw-list-t").show();
         }
        var _list = data.list;
        if(_list instanceof Array) {
            var len = _list.length;
            if( 0 == len ) {
                $('.checkNodata').show();
                $('.checkNodata').html('无查询数据');
                return;
            }
            $('.checkNodata').hide();
            var tableHtmlJson = {},tableHtmlArr = [],tableHtmlArr1 = [];
            for( var i = 0; i < len; i++ ) {
                var one = _list[i];
                var issue = one.issue ;
                one.type = item.type;
                var str = '<tr id="_menu_draw_b_'+one.lotteryId+'" name="_type_'+one.type+'" class="bgcolor">'+
                            '<td><a>'+one.issue+'</a></td>'+
                            '<td>'+one.time+'</td><td>'+_openManager.getBallDiv(one)+'</td>'+
                          '</tr>';

                tableHtmlJson[issue] = str;
                if (i == 0 && dateStr == "") {// 在当天时
                  $("#cqssc_latest_draw_phase").html(issue);
                  $(".sl-draw-number").html("");
                  $(".sl-draw-number").html(_openManager.getBallDiv(one));
                }
            }

            // 添加开奖结果
            for( var k = 0; k < _list.length; k++) {
                if (tableHtmlJson[_list[k].issue]) {
                    var total = 0;
                    if (_list.length % 2 == 0) {
                      total = parseInt(_list.length / 2);
                    } else {
                      total = parseInt(_list.length / 2 + 1);
                    }
                    if (k < total) {
                      tableHtmlArr.push(tableHtmlJson[_list[k].issue]);
                    } else {
                      tableHtmlArr1.push(tableHtmlJson[_list[k].issue]);
                    }
                }
            }
            $("#_games_2  .kj_tab_1 tbody").html(tableHtmlArr.join(""));
            $("#_games_2  .kj_tab_2 tbody").html(tableHtmlArr1.join(""));
        }
    },function () {
      $('.checkLoding').hide();
      $('.checkNodata').show();
      $('.checkNodata').html('请求超时,请稍侯重试!');
    });
  },
  getFootOpenList : function (dateStr) {
    $("#_games_2  table tbody").html("");
    $('.checkLoding').show();
    $('.checkNodata').hide();
    var date = (dateStr == "")?Utils.getDistanceFromToday(0):dateStr;
    var param = {'date':date};
    Utils.request('front/football/pc_match_results.do',param,function (res) {
        $('.checkLoding').hide();
        $('.checkNodata').hide();
        if (res.code != 0) {
          $('.checkNodata').show();
          $('.checkNodata').html(res.msg);
          return ;
        }
        // 初始化头部信息
        $('#_games_2 h1').html("足球开奖公告");
        var _list = res.data;
        var tableHtmlArr = [];
        if (_list.length == 0) {
          $('.checkNodata').show();
          $('.checkNodata').html('无查询数据');
          return ;
        }
        for( var i = 0; i < _list.length; i++ ) {
            var one = _list[i];
            var rangColor = (one.oddRang <= 0) ? 'rang_green' : 'rang_red',
                rang = (one.oddRang <= 0) ? one.oddRang : '+' + one.oddRang;
            var result = one.playResult;
            var str = '<tr class="bgcolor">'+
                        '<td>'+one.code+'</td>'+
                        '<td>'+one.startTime+'</td>'+
                        '<td>'+one.leagueName+'</td>'+
                        '<td>'+one.teamHome+'<em class="'+rangColor+'">('+rang+')</em></td>'+
                        '<td>'+one.teamAway+'</td>'+
                        '<td>'+one.scoreH+'</td>'+
                        '<td>'+one.scoreF+'</td>'+
                        '<td class="rang_red">'+result[0].split('|')[0]+'<sapn> ('+result[0].split('|')[1]+')</span></td>'+
                        '<td class="rang_red">'+result[1].split('|')[0]+'<sapn> ('+result[1].split('|')[1]+')</span></td>'+
                        '<td class="rang_red">'+result[2].split('|')[0]+'<sapn> ('+result[2].split('|')[1]+')</span></td>'+
                        '<td class="rang_red">'+result[3].split('|')[0]+'<sapn> ('+result[3].split('|')[1]+')</span></td>'+
                        '<td class="rang_red" style="border-right: 1px solid #e4e4e4;">'+result[4].split('|')[0]+'<sapn> ('+result[4].split('|')[1]+')</span></td>'+
                      '</tr>';
            tableHtmlArr.push(str);
        }
        $("#_games_2  .kj_tab_1 tbody").html(tableHtmlArr.join(""));
    },function () {
      $('.checkLoding').hide();
      $('.checkNodata').show();
      $('.checkNodata').html('请求超时,请稍侯重试!');
    });
  }
}

$(function () {
  if (window.location.href.indexOf('football.html') == -1) {
    // url传递过来的数据
    var url = location.search; //获取url中"?"符后的字串
    var lotteryId = url.split('=')[1];
    $('#lottery-id').val(lotteryId);
    // 单个彩种开奖
    _openDetailManager.getSingleOpenList(lotteryId,"");
  } else {
    _openDetailManager.getFootOpenList("");
  }
})
