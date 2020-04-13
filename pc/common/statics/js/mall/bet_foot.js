
var betLotteryId = '';
var stu = 0;
var isLogin = false;
var currentIndex = 1;
var currentPageSize = 20;
var ajaxFlag=false;
var quickShareType = false;
var betLottoryFoot = {
  init: function (lotteryId) {
    betLotteryId = lotteryId;
    $('#lt_bet_box').show();
    var htmlStr = '<div class="gm_con_to">' +
        '<div class="yx_body">' +
            '<div class="unit">' +
                '<div class="unit_title1">' +
                    '<div class="ut_l"></div>' +
                    '<table class="tabbar-div-s3" width="100%">' +
                      '<tbody>' +
                        '<tr>' +
                            '<td id="lt_trace_label">' +
                                '<span id="lt_margin" class="def_title tab-front" onClick="clickBetList(this);"><span class="tabbar-left"></span><span class="content">投注记录</span><span class="tabbar-right"></span></span>' +
                                '<span id="lt_sametime" class="def_title tab-back" onClick="clickOpenList(this);"><span class="tabbar-left"></span><span class="content">开奖记录</span><span class="tabbar-right"></span></span>' +
                            '</td>' +
                        '</tr>' +
                      '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
            '<div class="yx_box"  id="betHistory-div" style="width:950px;">' +
                '<div class="yxlist" style="max-height:1000px;">' +
                    '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                      '<tbody>' +
                        '<tr>' +
                            '<th>彩种</th>' +
                            '<th>下注时间</th>' +
                            '<th>期号</th>' +
                            '<th>玩法</th>' +
                            '<th>单注额</th>' +
                            '<th>下注总额</th>' +
                            '<th>状态</th>' +
                            '<th>操作</th>' +
                            '<th width="30"><input type="checkbox" id="chedan" onClick="clickCheDanAll(this);"></th>' +
                        '</tr>' +
                      '</tbody>' +
                      '<tbody class="projectlist" id="betlist">' +
                      '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
            '<div class="yx_box" id="openHistory-div" style="width:950px;display:none;">' +
                '<div class="yxlist" style="max-height:1000px;">' +
                    '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                      '<tbody>' +
                        '<tr>' +
                            '<th>彩种</th>' +
                            '<th>下注时间</th>' +
                            '<th>期号</th>' +
                            '<th>玩法</th>' +
                            '<th>中奖金额</th>' +
                            '<th>单注额</th>' +
                            '<th>下注总额</th>' +
                            '<th>状态</th>' +
                        '</tr>' +
                      '</tbody>' +
                      '<tbody class="projectlist" id="openlist">' +
                      '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
            '<div>' +
                '<div height="37" align="center" colspan="9" id="pageinfo" style="display:inline-block;margin-top:10px;">' +
                    '每页记录数:' +
                    '<select name="pageRecordCount" id="pageRecordCount">' +
                        '<option value="5">5条</option>' +
                        '<option value="10">10条</option>' +
                        '<option value="15">15条</option>' +
                        '<option value="20" selected="selected">20条</option>' +
                    '</select>' +
                    '第' +
                    '<select name="pageIndex" id="pageIndex" class="form">' +
                    '</select> 页' +
                '</div>' +
                '<div id="chedBtn" style="display:none;" onClick="clickCheDanList(this);">' +
                    '撤 单' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div style="float: left; height: 1px;"></div>';
    $('#lt_bet_box').html(htmlStr);
    // $('#lt_bet_box').load('/pc/mall/bet_foot.html',function () {
      if (parent._user_.isLogin == 'false') {
        isLogin = false;
        showEmptyData();
      }else {
        isLogin = true;
        betLottoryFoot.getBetLists();
        bindFootEvent();
      }
    // });
  },
  getBetLists: function () {
    if (!isLogin) {return;}
    $('#chedBtn').hide();
    if (stu == 0) {
      $("#betlist").html("");
    }else {
      $("#openlist").html("");
    }
    showLoadingData();
    var param = {
      lotteryId: betLotteryId,
      page: currentIndex,
      pageSize:currentPageSize,
      status: (stu === 1? -1 : 1),
      startTime: Utils.getDistanceFromToday(0)+" 00:00:00",
      endTime: Utils.getDistanceFromToday(0)+" 23:59:59"
    }
    Utils.request('front/bet/log_list.do', param, function(data) {
      ajaxFlag=true;
      if (data.code !== 0) {
        showEmptyData();
        return ;
      }
      var total = data.total;
      if (total == 0) {
        showEmptyData();
        return ;
      }
      // 分页
      var totalPage = parseInt((total%currentPageSize==0)?(total/currentPageSize):(total/currentPageSize+1));
      if (totalPage > 1) {
        var page = '';
        $("#pageinfo").show();
        $("#pageIndex").html(currentIndex+'');
        for (var j = 1; j <= totalPage; j++) {
            var sel = (j == currentIndex) ? 'Selected' : '';
            page += '<option value="' + j + '" ' + sel + '>' + j + '</option>';
        }
        $("#pageIndex").append(page);
      }else {
        $("#pageinfo").hide();
      }

      var html = "";
      var _data = data.data;
      for (var i = 0; i < _data.length; i++) {
          var _each = _data[i];
          var orderId = "'"+_each.orderId+"'";
          var subId = "'"+_each.subId+"'";
          html += '<tr>';
          html += '<td height="37" align="center">' + _each.lotteryName + '</td>';
          html += '<td height="37" align="center">' + _each.betTime + '</td>';
          html += '<td height="37" align="center">' + _each.issue + '</td>';
          html += '<td height="37" align="center">' + _each.groupName + '/' + _each.playName + '</td>';
          //html += '<td height="37" align="center"><a onclick="showBetDetail(\'' + $.param(data.Records[i]) + '\')" >' + data.Records[i].code.substr(0, 3).replace(/&/g,',') + '...</td>' //详情
          if(stu){
              if (_each.status == 2) {
                var _winStr = "<span class='color-gray'>"+_each.winFee+"</span>";
              } else if (_each.status == 3) {
                var _winStr = "<span class='color-red'>"+_each.winFee+"</span>";
              } else {
                var _winStr = "<span>"+_each.winFee+"</span>";
              }
              html += '<td height="37" align="center">' + _winStr + '</td>';
          }
          html += '<td height="37" align="center">' +  (parseFloat(_each.unitFee)/100).toFixed(2) + '</td>';
          html += '<td height="37" align="center" class="amount" >' + Utils.toDecimal2(_each.totalFee) + '</td>';
          var typeStr = getTypeStatus(_each.status);
          html += '<td height="37" align="center" class="">' + typeStr + '</td>';
          html += ('<td height="37" align="center" style="cursor: pointer;" onClick="shareOrder('+orderId +','+subId+');">分享订单</td>');
          if(_each.status == 1 && stu != 1){
              html += '<td height="37" align="center"><input type="checkbox" data-subId="' + _each.subId + '" data-orderId="' + _each.orderId + '" name="sKey" value="' + _each.oid + '" ></td>'
          }
          html += '</tr>';
      }
      if (stu == 0) {
        $("#betlist").html(html);
        $('#chedBtn').show();
        $('#chedan').off('click').on('click',function(){
            $('#betlist').find('input').prop('checked',$(this).prop('checked'));
        });
      }else {
        $('#chedBtn').hide();
        $("#openlist").html(html);
      }
    });
  }
}

// 点击投注记录
function clickBetList(obj) {
  if ($(obj).attr("class") == "tab-front") {
      return;
  }
  $(obj).attr("class", "tab-front");
  $('#lt_sametime').attr("class", "tab-back");
  $('#betHistory-div').show();
  $('#openHistory-div').hide();
  stu = 0;
  currentIndex = 1;
  betLottoryFoot.getBetLists();
}

// 点击开奖记录
function clickOpenList(obj) {
  if ($(obj).attr("class") == "tab-front") {
      return;
  }
  $(obj).attr("class", "tab-front");
  $('#lt_margin').attr("class", "tab-back");
  $('#betHistory-div').hide();
  $('#openHistory-div').show();
  stu = 1;
  currentIndex = 1;
  betLottoryFoot.getBetLists();
}

// 显示空页面
function showEmptyData() {
  $("#chedan").prop("checked", false);
  var html = '<tr><td height="37" align="center" colspan="9" >暂无信息！</td></tr>';
  $(".projectlist").html(html);
  $(".projectlist").show();
  $("#pageinfo").hide();
}

// 显示正在加载页面
function showLoadingData() {
  $("#chedan").prop("checked", false);
  var html = '<tr><td height="37" align="center" colspan="9" >正在加载中...</td></tr>';
  $(".projectlist").html(html);
  $(".projectlist").show();
  $("#pageinfo").hide();
}

// 订单状态
function getTypeStatus(status) {
  var typeStr = '';
  switch (status) {
    case 1:
      typeStr = '待开奖';
      break;
    case 2:
      typeStr = '<span class="color-gray">未中奖</span>';
      break;
    case 3:
      typeStr = "<span class='color-red'>已中奖</span>";
      break;
    case 4:
      typeStr = '和局';
      break;
    case 10:
      typeStr = '已撤单';
      break;
    case 20:
      typeStr = '<span class="color-gray">已撤单</span>';
      break;
    case 30:
      typeStr = "追加中";
      break;
    case 99:
      typeStr = "订单异常";
      break;
    default:
      typeStr = '';
      break;
  }
  return typeStr;
}
function bindFootEvent() {
  $(document).on('change','#pageRecordCount',function (obj) {
      currentPageSize = parseInt(($("#pageRecordCount").find("option:selected").text()).split('条')[0]);
      currentIndex = 1;
      betLottoryFoot.getBetLists();
  });
  $(document).on('change','#pageIndex',function (obj) {
      currentIndex = parseInt($("#pageIndex").find("option:selected").text());
      betLottoryFoot.getBetLists();
  });
}

//撤单操作
function clickCheDanList(obj) {
    // return;
    var text = "";
    var amount = 0;
    var repealArr = [];
    $.each($("#betlist input[name=sKey]"),function (i,obj) {
      if ($(obj).prop("checked") && $(obj).attr('disabled') != 'disabled') {
          text += ',' + $(obj).val();
          if (!$(obj).attr("data-orderId") || !$(obj).attr("data-subId")) {
            return ;
          }
          repealArr.push({
            "orderId": $(obj).attr("data-orderId"),
            "subId": $(obj).attr("data-subId")
          });
      }
    });
    console.log(repealArr);
    var gameId = betLotteryId;
    if (text.length == 0) {
        _alert('请选择需要撤销的注单号！');
        return ;
    } else {
      console.log(text);
        $.confirm('确定要撤销投注单号吗？', function () {
            Utils.request('front/bet/batch_repeal.do', repealArr, function(res) {
              if (res.code != 0) {
                _alert(res.msg);
                return;
              }
              console.log(res);
              _alert("撤单成功");
              parent._user_.refreshMoney("#balance");
              currentIndex = 1;
              betLottoryFoot.getBetLists();
              $("#chedan").prop("checked", false);
            });
       }, function () {
         _alert('取消成功!');
         $("#chedan").trigger('click');
         if ($("#chedan").is(':checked')) {
           $("#chedan").trigger('click');
         }
       }, '', 350);
    }
}
//撤单全选
function clickCheDanAll(obj) {
  if ($(obj).prop("checked") == true) {
      $("#betlist input:checkbox").prop("checked", true);
  } else {
      $("#betlist input:checkbox").prop("checked", false);
  }
}

// 分享订单
function shareOrder(orderId,subId) {
  console.log(orderId)
  var msg = "<h2>点击选择分享订单的房间</h2>" + '<input type="button" value="全部分享" id="fastShare" style="margin-right:15px;background-color:#169bd5;position: absolute;top: 42px;right: 0;" class="yh">';
  var orderId = orderId;
  var subId = subId;
  var centerStyle = "text-align:center;";
  var centerStyle2 = "text-align:center;cursor:pointer;";
  var roomId = '';
  var enableChat = true;
  $.ajax({
    type: 'GET',
    url: (__entire.chatHttp || '') + '/room/list/' + Utils.getStorage('accessToken'), // 聊天室平台地址，从base.js里获取
    // url: $.lt_ajaxurl,
    timeout: 10000,
    dataType: 'JSON',
    // data: localStorage.getItem('accessToken'),
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
      // $("#confirm_no").hide()
      if (data.code == 0) {
        msg += '<div class="data"><table border=0 cellspacing=0 cellpadding=0 width=100%><tr class=hid><td width=150 style="' + centerStyle + '">房间名称</td></tr>', $.each(data.data, function (i, _item) {
          msg += "<tr><td class='roomclass' data-roomId='"+_item.roomId+"' data-enableChat='"+_item.enableChat+"' style=" + centerStyle2 + ">" + _item.name + "</td><tr>"
        }), msg += "</table></div>";

          $.confirm(msg, function () {
            console.log(orderId + ',' +subId + ',' +roomId);
            if (enableChat == 'true' || Utils.getStorage('userType') == 2) {
              goShare (orderId,subId,roomId);
            } else {
              if (roomId == '') {
                _alert("请选择分享的聊天室！");
                return
              }
              _alert("该聊天室已禁言，禁止分享订单！");
              return
            }

          }, function () {
          }, "", 700, !0)
          // setTimeout(function(){
          //   $("#confirm_yes").before('<input type="button" value="一键分享" id="fastShare" style="margin-right:15px;background-color:#169bd5;" class="yh">')
          //   $("#confirm_no").hide()
          // }, 0)
          $("body").unbind('click').on("click",'#fastShare',function(){
            console.log(1111)
            var allRoomId = '';
            var allRoomIdList = []
            $.each(data.data, function(ix, itm) {
              allRoomIdList.push(itm.roomId) 
            });
            allRoomId = allRoomIdList.join(',');
            if (allRoomId.length>0) {
              $("#JS_blockPage").hide();
              $("#JS_blockOverlay").hide();
              goShare (orderId,subId,allRoomId);
            }
          })

          $('.roomclass').on('click',function(){
            $('.roomclass').removeClass('roomback');
            $(this).addClass('roomback');
            roomId = $(this).attr('data-roomId');
            enableChat = $(this).attr('data-enableChat');
          })
      } else if (data.code == 1312) {
        _alert("分享订单依赖聊天室，请先进聊天室登录后再操作！");
        return
      } else {
        _alert(data.msg);
        return
      }
    },
    error: function () {
      _alert('系统超时');
      return false;
    }
  });
  
}
function goShare (orderId,subId,roomId) {
  var _openid = Utils.getStorage('openid')
  console.log(_openid)
  var urls = '';
  if (Utils.getStorage('userType') == -1) {
    _alert("分享订单依赖聊天室，请先进聊天室登录后再操作！");
    return
  }
  if (Utils.getStorage('userType') == 2) {
   urls = '/chat_room/share_order.do?openid='+_openid+'&orderId='+orderId+'&subId='+subId+'&roomId='+roomId+'&type=10';
  } else {
   urls = '/chat_room/share_order.do?openid='+_openid+'&orderId='+orderId+'&subId='+subId+'&roomId='+roomId+'&type=4';
  }
  $.ajax({
    type: 'GET',
    url: urls,
    timeout: 10000,
    dataType: 'JSON',
    // data: localStorage.getItem('accessToken'),
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
      console.log(data)
      if (data.code == 0) {
        _alert("分享成功");
        return
      }else if (data.code == 500) {
        if (data.msg) {
            _alert(data.msg.replace(/\n/g,'<br>'));
            return
          } else {
            _alert("分享订单依赖聊天室，请先进聊天室登录后再操作！");
            return
          }
      } else {
        _alert(data.msg);
        return
      }
    },
    error: function () {
      _alert('系统超时');
      return false;
    }
})
}
function quickShare (e) {
  console.log($(e).context.checked)
  quickShareType = $(e).context.checked;
  console.log(Utils.getStorage('liveRoomId'))
}
