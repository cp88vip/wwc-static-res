$(function () {
  var url = location.search;
  var gameId = (url.split('&')[0]).split('=')[1];
  var issueNum = 20;
  if (url.match('issue')) {
     issueNum = (url.split('&')[1]).split('=')[1];
  }
  $('#bodyDiv').attr('gameId',gameId);
  getBallSetColors();
  getLotteryData(gameId,issueNum);

  //下面方法来自 @ Moda
  window._canvas = {
      lineNum:1,  //线的数量
      isShowLine:1   ///是否显示线
  };
  try{
      _canvas.isShowLine = 1;
  }catch(e){
      console.log(e);
      _canvas.isShowLine = 0;
  }
  if(_canvas.isShowLine){
		$("#has_line").attr({"checked":true});
	}else{
		$("#has_line").attr({"checked":false});
	}
})

// 请求开奖数据
function getLotteryData(gameId,issueNum) {
  $('#chartsTable').html('');
  var isSix = (gameId == '9' || gameId == 9 || gameId == '28' || gameId == 28 || gameId == '48' || gameId == 48);
  if (gameId == '') {
    gameId = null;
  }
  var param = {'lotteryId':gameId,'issueSum':parseInt(issueNum)};
  $('.trendLoading').show();
  Utils.request('front/lottery/lottery_trend.do',param,function (res) {
    $('.trendLoading').hide();
    $('#chartsTable').html('');
    if (res.code == 0) {
      var head = res.data.head;
      renderSelHeader(gameId,head,isSix);
      if (!isSix) {
        renderTabHeader(head);
      }else {
        renderSixHeader(head);
      }

      var list = res.data.body;
      for (var i = 0; i < list.length; i++) {
        if (!isSix) {
          renderOneOpen(head,list[i]);
        }else {
          renderSixOpen(list[i]);
        }
        resizeCanvas();
      }
      $('#drawLine').hide();
    }else {
      _alert(res.msg);
    }
  });
}

// 更新当前期数数据
function updateOpenNum(gameId,issueNum) {

  $('#chartsTable').html('');
  var isSix = (gameId == '9'|| gameId == 9 || gameId == '28'|| gameId == 28 || gameId == '48' || gameId == 48);
  if (gameId == '') {
    gameId = null;
  }
  var param = {'lotteryId':gameId,'issueSum':issueNum};
  $('.trendLoading').show();
  Utils.request('front/lottery/lottery_trend.do',param,function (res) {
    $('.trendLoading').hide();
    $('#chartsTable').html('');
    if (res.code == 0) {
      var head = res.data.head;
      if (!isSix) {
        renderTabHeader(head);
      }else {
        renderSixHeader(head);
      }
      var list = res.data.body;
      for (var i = 0; i < list.length; i++) {
        if (!isSix) {
          renderOneOpen(head,list[i]);
        }else {
          renderSixOpen(list[i]);
        }
        resizeCanvas();
      }
      $('#drawLine').hide();
    }else {
      _alert(res.msg);
    }
  });
}

// 渲染走势选择头部
function renderSelHeader(gameid,head) {
  var hasLine = '<span>'+
                          '<label for="has_line" id="drawLine">'+
                            '<input type="checkbox" name="checkbox2" value="checkbox" id="has_line" checked="checked" />显示折线'+
                          '</label>'+
                        '</span>&nbsp;';
  var selHeadStr =  '<table border=0 cellpadding=0 cellspacing=0>'+
                  '<tr>'+
                      '<td align=left>'+
                          '<strong><font color="#FF0000">'+head.name+'：</font>开奖号码</strong>'+
                      '</td>'+
                      '<td align=left>'+
                          hasLine+
                          // '<span>'+
                          //     '<label for="no_miss">'+
                          //       '<input type="checkbox" name="checkbox" value="checkbox" id="no_miss" />不带遗漏'+
                          //     '</label>'+
                          // '</span>'+
                      '</td>'+
                      '<td align=left>'+
                          '<form method="POST">'+
                              '<a onclick="updateOpenNum('+gameid+',20)">最近20期</a>&nbsp;'+
                              '<a onclick="updateOpenNum('+gameid+',30)">最近30期</a>&nbsp;'+
                              '<a onclick="updateOpenNum('+gameid+',50)">最近50期</a>&nbsp;'+
                              '<a onclick="updateOpenNum('+gameid+',100)">最近100期</a>&nbsp;'+
                              // <a onclick="parent.goIframe(\"trend/index.html?gameId=51&type=b&out=yes\")">前天</a>&nbsp;
                              // <a onclick="parent.goIframe(\"trend/index.html?gameId=51&type=y&out=yes\")">昨天</a>&nbsp;
                              // <a onclick="parent.goIframe(\"trend/index.html?gameId=51&type=t&out=yes\")">今天</a>&nbsp;
                          '</form>'+
                      '</td>'+
                  '</tr>'+
              '</table>';

    $('#selHeader').html(selHeadStr);
    $("#has_line").click(function () {
        if($(this).get(0).checked)
        {
            $(canvasDom).show();
            _canvas.isShowLine = 1;
            if( $(canvasDom).width() != $(canvasDom).attr("width") )
            {
                resizeCanvas();
            }
        }
        else
        {
            $(canvasDom).hide();
            _canvas.isShowLine = 0;
        }
    });
}

// 渲染表格头部
function renderTabHeader(head) {
  var ints = head.ints;
  try{
      _canvas.lineNum = ints.length ; //线的数量
  }catch(e){
      console.log(e);
      _canvas.lineNum = 1 ;
  }


  var numbers = (head.num).split('|'),numStr = '';
  var htmlStr = '<tr class="th">' +
                  '<td rowspan="2" class="jiangqi">期号</td>' +
                  '<td rowspan="2" colspan="'+ints.length+'">开奖号码</td>';

  for (var j = 0; j < numbers.length; j++) {
    var num = numbers[j];
    numStr += '<td class="wdh">'+num+'</td>';
  }

  var numsStr = '<tr class="th">';
  for (var i = 0; i < ints.length; i++) {
    var item = ints[i];
    htmlStr += '<td rowspan="1" colspan="'+numbers.length+'">'+item+'</td>';
    numsStr += numStr;
  }
  numsStr += '</tr>';
  htmlStr += numsStr;
  htmlStr += '</tr>';

  $('#chartsTable').prepend(htmlStr);
}

// 渲染开奖部分
function renderOneOpen(head,list) {
  var issue = list.issue,openNums = (list.number).split(',');
  var numbers = (head.num).split("|");
  var rowStr = '<tr class="ball_row">' +
                  '<td class="issue"><div class="issueinfo">'+issue+'</div></td>';

  //开奖号码
  var openStr = '';
  for (var i = 0; i < openNums.length; i++) {
      var num = openNums[i];
      openStr += '<td align="center" class="codetd"><div class="historycode">'+num+'</div></td>';
  }
  // show
  var colsArr = [];
  for (var i = 0; i < openNums.length; i++) {
     var colArr = [];
     var lightNum = openNums[i];
     for (var j = 0; j < numbers.length; j++) {
        if (lightNum == numbers[j]) {
            colArr.push('<td class="charball td0" align="center"><div class="ball01">'+lightNum+'</div></td>');
        }else {
            colArr.push('<td class="wdh td0" align="center"><div class="ball03" style="display:inline-block;"></div></td>');
        }
     }
      colsArr.push(colArr);
  }

  rowStr += openStr;
  rowStr += colsArr.join('');
  rowStr += '</tr>';

  $('#chartsTable').append(rowStr);
}

// 六合彩单独处理
function renderSixHeader(data) {
  var htmlStr = '<thead>'+
                  '<tr><th rowspan="2">期数</th>'+
                      '<th rowspan="2">开奖时间</th>'+
                      '<th rowspan="2">正码一</th>'+
                      '<th rowspan="2">正码二</th>'+
                      '<th rowspan="2">正码三</th>'+
                      '<th rowspan="2">正码四</th>'+
                      '<th rowspan="2">正码五</th>'+
                      '<th rowspan="2">正码六</th>'+
                      '<th rowspan="2">特码</th>'+
                      '<th colspan="4">总和</th>'+
                      '<th colspan="5">特码</th></tr>'+
                  '<tr><th>总数</th>'+
                      '<th>单双</th>'+
                      '<th>大小</th>'+
                      '<th>七色波</th>'+
                      '<th>单双</th>'+
                      '<th>大小</th>'+
                      '<th>合单双</th>'+
                      '<th>合大小</th>'+
                      '<th>大小尾</th>'+
                      '</tr>'+
                '</thead>';

  $('#chartsTable').prepend(htmlStr);
}
// 六合彩开奖
function renderSixOpen(list) {
  var numbers = (list.number).split(',');
  var ballStr = '',allStr = '',specStr = '';
  for (var i = 0; i < numbers.length; i++) {
    var num = numbers[i];
    var zodiac = sixNumToZodiac(num);
    var color = sixNumToColor(num);
    ballStr += '<td class="name"><span class="sixNum-'+color+' sixNum">'+num+'</span><span class="'+color+'"> ('+zodiac+')</span></td>';
  }
  var rowStr = '<tr class="">'+
                  '<td class="period">'+list.issue+'</td>'+
                  '<td class="drawTime">'+list.time+'</td>'+
                  ballStr+
                  calSix(numbers)+
                  '</tr>' ;
  $('#chartsTable').append(rowStr);
}

//  六合彩计算总和、特码
function calSix(numbers) {
  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    var num = numbers[i];
    sum += parseInt(num);
  }

  var sum1 = (sum%2 == 0)?'总和双':'总和单';
  var sum2 = (sum >= 175)?'总和大':'总和小';
  var bo = sixNumToText(parseInt(numbers[6]));
  var sum1Color = (sum%2 == 0)?'double':'single';
  var sum2Color = (sum >= 175)?'big':'small';
  var boColor = sixNumToColor(numbers[6]);

  var allStr =  '<td class="other1">'+sum+'</td>'+
                '<td class="other GZDS_S '+sum1Color+'">'+sum1+'</td>'+
                '<td class="other GZDX_D '+sum2Color+'">'+sum2+'</td>'+
                '<td class="other G7SB_G '+boColor+'">'+bo+'波</td>';

  var spec = parseInt(numbers[6]);
  // console.log(parseInt(spec / 10))
  // console.log(spec % 10)
  var specSum = parseInt(spec/10) + spec%10;
  var spec1 = (spec%2 == 0)?'双':'单';
  var spec2 = (spec <= 24 )?'小':'大';
  var spec3 = (specSum%2 == 0)?'合双':'合单';
  console.log('spec3: 合单双', specSum , spec3);
  var spec4 = (specSum > 6)?'合大':'合小';
  var spec5 = (spec % 10 <= 4)?'尾小':'尾大';
  console.log('spec5: 尾大小', spec % 10, spec5);
  var spec1Color = (spec%2 == 0)?'double':'single';
  var spec2Color = (spec <= 24 )?'big':'small';
  var spec3Color = (specSum%2 == 0)?'double':'single';
  var spec4Color = (specSum > 6)?'big':'small';
  var spec5Color = (spec % 10 <= 4)?'small':'big';

  var specStr = '<td class="other GDS_S '+spec1Color+'">'+spec1+'</td>'+
                '<td class="other GDX_D '+spec2Color+'">'+spec2+'</td>'+
                '<td class="other GHDS_D '+spec3Color+'">'+spec3+'</td>'+
                '<td class="other GHDX_X '+spec4Color+'">'+spec4+'</td>'+
                '<td class="other GWDX_X '+spec5Color+'">'+spec5+'</td>';
  return allStr + specStr;
}
