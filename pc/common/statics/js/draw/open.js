
window._openManager = {
    // 开奖大厅
  getAllOpenList : function() {
    $('.checkLoding').show();
    $('.checkNodata').hide();
    Utils.request('pc/front/lottery/luck_number.do',{},function (data) {
        $('.checkLoding').hide();
        $('.checkNodata').hide();
        if (data.code != 0) {
          $('.checkNodata').show();
          $('.checkNodata').html(data.msg);
          return ;
        }
        var count = data.count;
        if (count === 0) {
            $('.checkNodata').show();
            $('.checkNodata').html('无查询数据');
            return;
        }
        var _list = data.data;
        Utils.saveStorage('lotteryListIssue', _list);
        if (data.data instanceof Array) {
            var len = data.data.length;
            if( 0 == len ) {
                $('.checkNodata').show();
                $('.checkNodata').html('无查询数据');
                $("#_games_2  table tbody").html('');
                return;
            }
            var tableHtmlJson = {},tableHtmlArr = [];
            for( var i = 0; i < len; i++ ) {
                var one = data.data[i];
                var gameId = one.lotteryId ;
                var t = one.type ;
                var drawLink = '/pc/draw/detailNew.html?lotteryId='+gameId;
                var hallLink = one.lotteryId;
                var str = '<tr id="_menu_draw_b_'+gameId+'" name="_type_'+one.type+'" class="bgcolor">'+
                            '<td><a class="name" href="'+drawLink+'">'+one.name+'</a></td>'+
                            '<td><a href="'+drawLink+'">'+one.issue+'</a></td>'+
                            '<td>'+one.time+'</td><td>'+_openManager.getBallDiv(one)+'</td>'+
                            '<td>'+one.issueNum+'</td><td>'+one.frequency+'</td>'+
                            // '<td><a class="c-blue blod" onclick="goIframe(\''+drawLink+'\')"><img src="/pc/common/statics/img/draw/details.gif"></a></td>'+
                            '<td><a onclick="__openWin(\'home\',\'/pc/trend/newtrendList.html?lotteryId='+gameId+'&periods=30\')"><img src="/pc/common/statics/img/draw/zst_01.gif"></a></td>'+
                            '<td class="b"><a onclick="__openWin(\'lottery_hall\',\''+hallLink+'\')" class="draw-lottery-btn">投注</a></td>'+
                          '</tr>';
                tableHtmlJson[gameId] = str;
            }

            // 添加开奖结果
            for ( var k = 0; k < _list.length; k++) {
                if ( tableHtmlJson[_list[k].lotteryId]) {
                    tableHtmlArr.push(tableHtmlJson[_list[k].lotteryId]);
                }
            }
            $("#_games_2  table tbody").html(tableHtmlArr.join(""));
        }
    },function () {
      $('.checkLoding').hide();
      $('.checkNodata').show();
      $('.checkNodata').html('请求超时,请稍侯重试!');
    });
  },
  // 是否有竞技彩
  isShowZcOpen : function (data) {
    var isShow = false;
    if (data && data.length  != 0) {
      $.each(data, function (i, item) {
          if (item.type == 'j') {
            isShow = true;
          }
      });
    }
    return isShow;
  },
  // 球显示
  getBallDiv : function (one) {
      if( !one.hasOwnProperty("number") || "" == one.number )
      {//暂无开奖号码
          return "<div class='nodata'>正在开奖...</div>";
      }
      if (one.type == "quanquan")
      {//时时彩
        var temp = "";
        if(one.number){
          for( var i = 0 ; i< one.number.split(",").length ; i++ )
              {
                  var idx = one.number.split(",")[i];
                  temp += "<span class='col-"+idx+"'>" + idx + "</span>";
              }
        }
          var ballDiv = '<div class="ballbg">'+temp+'</div>';
        return ballDiv;
      }
      if( one.type == "touzi" )
      {//快三
          var temp = "";sum = 0;
          for( var i = 0 ; i< one.number.split(",").length ; i++ )
          {
              var idx = one.number.split(",")[i];
              sum += parseInt(idx);
              temp += "<span class='ks_ball_"+idx+"'>"+ idx + "</span>";
          }
          temp += "<b>和值:" + sum + "</b>";
          var ballDiv = '<div class="ball_kuaisan">'+temp+'</div>';
          return ballDiv;
      }
      if( one.type == "lhc" )
      {//香港六合彩
          var temp = "";
        if(one.number){
          for( var i = 0 ; i< one.number.split(",").length ; i++ )
              {
                  var idx = one.number.split(",")[i];
                  var color = sixNumToColor(idx); //生肖
                  var sx = sixNumToZodiac(idx); //生肖
                  // var sx = "xx"; //生肖
                  temp += "<p><span class='col-"+idx+" ball_"+color+"'>" + idx + "</span><span class='font'>"+sx+"</span></p>";
              }
        }
          var ballDiv = '<div class="ball_liuhecai">'+temp+'</div>';
          return ballDiv;
      }
      if( one.type == "pcdd" )
      {//PC蛋蛋
          var sum = 0;numbers = one.number.split(",");
          for (var j = 0; j < numbers.length; j++){
            var num = numbers[j];
            sum += parseInt(num);
          }
          var temp = "<span>" + one.number.split(",")[0] + "</span><b>+</b><span>" + one.number.split(",")[1] + "</span><b>+</b><span>" + one.number.split(",")[2] + "</span><b>=</b><span class='ball_"+pcSumToColor(sum+"")+"'>" + sum + "</span>";
          var ballDiv = '<div class="ball_kuaisan">'+temp+'</div>';
          return ballDiv;
      }
      var temp = "<span>"+one.number.split(",").join("</span><span>")+"</span>";
      var ballDiv = '<div class="ballbg">'+temp+'</div>';
      return ballDiv;
  }

}
