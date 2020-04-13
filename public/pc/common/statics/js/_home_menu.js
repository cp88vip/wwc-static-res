/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-13 17:15:51
 * @LastEditTime: 2019-08-13 20:41:01
 * @LastEditors: Please set LastEditors
 */
///* 该文件包括 主页的部分功能 ：1 主页中左边的彩票menu列表； 2 头部html; 3 定义全局刷新余额的方法： window.refreshAmount */
// from  moda
// _common 是 当前文件的命名空间

var _hre = window.location.search
var theRequest = new Object()
if (_hre.indexOf("?") != -1) {
  var str = _hre.substr(1);
  strs = str.split("&");
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
}
if (theRequest.c) {
  sessionStorage.setItem('c', theRequest.c)
}
function fmtDate(obj) {
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}
function goamountConver() {

  var userInfo = UserTool.getUserInfo();
  console.log(userInfo)
    if (!userInfo || userInfo.userId == 0) {
      _alert('请登录后再操作!');
      return false;
    }
    __openWin('user_center','/pc/userCenter/amountConver.html');
}

window._home_menu = {
  isShowChat: 'open',
  isDragon: 'close',
  isShowZc: false, // 判断是否显示足彩
  pcCpName: (__entire && __entire.name ? __entire.name : '彩票8'),
  studioUrl: (__entire && __entire.studioUrl ? __entire.studioUrl : 'http://' + location.hostname + '/'),
  hotList:null,//棋牌开关
  // 新增一个埋点
  // buriedPoint: function (type) {
  //     Utils.request('', {type: type}, function () {

  //     })
  // },
  // 根据id获取彩种图标url
  getShowChat: function () {
    Utils.request('front/get_global_config.do', {}, function (data) {
      if (data.code == 0) {
        _home_menu.isDragon = data.data.status.dragonStatus
        _home_menu.isShowChat = data.data.status.chatRoomOpenStatus
        console.log(123123123);
        if (_home_menu.isDragon == 'open') {
          $('#isDragon').show()
        } else {
          $('#isDragon').hide()
        }
      }
    });
  },
  getLotteryIconUrl: function (lotteryId) {
    var iconUrl = '';
    var lotteryListIconUrl = Utils.getStorage('lotteryListIconUrl');
    if (!lotteryListIconUrl || lotteryListIconUrl.length == 0) {
      Utils.request('/front/lottery/sixmark_attribute.do', {}, function (result) {
        if (result.code == 0) {
          Utils.saveStorage('ballSetColorDicPc', result["data"]);
          Utils.saveStorage('lotteryListIconUrl', result['rows']);
          $.each(lotteryListIconUrl, function (i, item) {
            if (item.lotteryId == lotteryId) {
              iconUrl = item.URL;
            }
          });
        }
      });
    } else {
      $.each(lotteryListIconUrl, function (i, item) {
        if (item.lotteryId == lotteryId) {
          iconUrl = item.URL;
        }
      });
      if (iconUrl == '') {
        Utils.saveStorage('lotteryListIconUrl', []);
        _home_menu.getLotteryIconUrl(lotteryId);
      }
    }
    return iconUrl;
  },
  //header 跑马灯模块
  getHeaderMarquee: function () {
    var marqueeStr = '<div class="quick-tpis" id="sys_tip_outer">' +
      '<i class="icon-acc"></i>' +
      //这里是跑马灯<marquee>标签，由js加入dom
      '<div id="scroll" class="quick-list">';
    //<a target="_self" href="/pc/news/index.html">资讯</a><span> | </span>
    marqueeStr += "<a target=\"_self\" onClick=\"__openWin('home2','/pc/rule/index.html')\">玩法</a><span> | </span>";
    marqueeStr += "<a target=\"_self\" onClick=\"__openWin('home2','/pc/helpCenter/index.html')\">帮助中心</a><span> | </span>";
    marqueeStr += '<a id="shoucang">加入收藏</a>';
    //<a id="agent_reg_url" onClick="__openWin('reg','/pc/register/agent.html')" target="_self" title="加入代理" style="display: none;" ><span> | </span>加入代理</a>
    // marqueeStr += "<a id=\"play_free\" onclick=\"__openWin('reg','/pc/register/regPlay.html')\" style=\"display: none;\" ><span> | </span>免费试玩</a>";
    //   marqueeStr += "<a id=\"play_free\" style=\"display: none;\" ><span> | </span>免费试玩</a>";
    '</div>' +
      '</div>';
    $('.header-plus .header-toptray-plus').html('');
    $('.header-plus .header-toptray-plus').html(marqueeStr);
  },
  //header menu模块
  getHeaderMenu: function () {
    var menuStr = '';
    menuStr += '<div class="wrapper clearfix relative">' +
      '<h1 class="sprite sprite-logo"></h1>' +
      '<img class="sprite sprite-logo2" src="/pc/common/statics/img/home/logo-2.png"/>' +
      // 未登录
      '<div id="header_user_login" class="wrap-login" style="display:none">' +
      '<div class="logxinxi" id="logxinxi">' +
      '<div class="top_login">' +
      '<div class="fr">' +
      '<div class="fl">' +
      '<div style="overflow: hidden;">' +
      '<div class="top-login-bg"><i class="icon-6"></i><input class="top_loginip" name="username" type="text" placeholder="请输入用户名"></div>' +
      '<div class="top-login-bg"><i class="icon-lock-icon"></i><input class="top_loginip" name="passwd" type="password" placeholder="请输入密码"></div>' +
      '</div>' +
      '<div>' +
      '<div class="need_captcha">' +
      '<div class="top_click" name="div_top_click">请输入验证码</div>' +
      '<div class="yanzhengma">' +
      '<div class="top-login-bg2">' +
      '<input class="top_loginmm" id="authnum" name="authnum" maxlength="5" type="text" placeholder="请输入验证码">' +
      '<span class="register_captcha_span" style="margin:0; position: relative;">' +
      '<img id="v_container" src="" style="width:65px;height:30px;background:#fff;">' +
      '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div><input class="dr_anniu bg-col" type="button" name="login" value="登录"></div>' +
      '</div>' +
      '</div>' +
      '<div style="float: left;">';
    menuStr += "<input class=\"dr_anniu reg_anniu\" type=\"button\" onclick=\"__openWin('reg','/pc/register/index.html')\" value=\"免费注册\">";
    menuStr += '</div>' +
      '</div>' +
      '<input type="hidden" name="ref_url" value="">' +
      '<input type="hidden" name="form_submit" value="ok">' +
      '<input type="hidden" name="formhash" value="">' +
      '</div>' +
      '</div>' +
      '</div>' +

      // 已登录
      '<div id="header_user" class="logxinxi login_mes" hidden="" style="display: none;">' +
      '<div class="top_login top_login_mes">';
    menuStr += "<span>您好，<a onclick=\"__openWin('user_center','/pc/userCenter/index.html');\" rel=\"nofollow\" class=\"play-jl\" target=\"_blank\" name=\"user_name\"></a></span>";
    menuStr += '<span> 余额：</span>' +
      '<span><a class="balance colorRed" id="a_show_money" rel="nofollow"><span class="text-col" id="balance">￥</span></a>' +
      '</span>' +
      '<span><a id="header_money_refresh" style="margin-left: 5px;"><i class="icon-refresh-icon before-col"></i></a></span>' +
      '<span>&nbsp;|&nbsp;';
    menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/washCode.html');\">洗码</a>&nbsp;|&nbsp;";
    menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/index.html');\">用户中心</a>&nbsp;|&nbsp;";
    menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/deposit.html');\">充值</a>&nbsp;|&nbsp;";
    menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/bindbank.html');\">提现</a>&nbsp;|&nbsp;";
    if (sessionStorage.getItem('openChess') == "true") {
    menuStr += "<a onclick=\"goamountConver();\">额度转换</a>&nbsp;|&nbsp;";
    }
    menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/accountDetail.html');\">交易记录</a>&nbsp;|&nbsp;";
    // menuStr += "<a onclick=\"__openWin('user_center','/pc/userCenter/privateMsg.html');\">个人消息</a>&nbsp;|&nbsp;";
    menuStr += "<a onclick=\"__openWin('lgOut','/passport/logout.do')\">退出</a>&nbsp;";
    menuStr += '</span>' +
      '</div>' +
      '</div>' +
      '</div>';

    $('.liansai-wrap .liansai').html('');
    $('.liansai-wrap .liansai').html(menuStr);
  },

  // 网站导航条  -- 要改成动态显示的
  getNaviMenu: function (index) {
    var _this = this;
    // 请求iconUrl
    //   console.log(index)
    Utils.request('front/get_global_config.do', {}, function (data) {
      if (data.code == 0) {
        _home_menu.isDragon = data.data.status.dragonStatus
        _home_menu.isShowChat = data.data.status.chatRoomOpenStatus
        _home_menu.isshowChess = data.data.gameSwitch['game'].switchFlag === 1
        // 棋牌开关判断
        _user_.openChess = _home_menu.isshowChess === true ? true : false;
        sessionStorage.setItem('openChess', _user_.openChess);
        sessionStorage.setItem('openDragon', data.data.status.dragonStatus);
        sessionStorage.setItem('checkTransferAllStatus', data.data.status.checkTransferAllStatus);
        _this.hotList = data.data.hotList;
        if (_home_menu.isDragon == 'open') {
          $('#isDragon').show()
        } else {
          $('#isDragon').hide()
        }
      }
    }).done(function () {
      if (!Utils.getStorage('ballSetColorDicPc') || !Utils.getStorage('lotteryListIconUrl')) {
        Utils.request('/front/lottery/sixmark_attribute.do', {}, function (result) {
          if (result.code == 0) {
            Utils.saveStorage('ballSetColorDicPc', result["data"]);
            Utils.saveStorage('lotteryListIconUrl', result['rows']);
          }
          Utils.requestNeedTint('front/lottery/init.do', {}, function (data) {
            if (data.code == 0) {
              _home_menu.getNaviMenuView(data.data, index);
              Utils.saveStorage('lotteryListData', data.data);
            }
          });
        });
      } else {
        // 先判断缓存
        var list = Utils.getStorage('lotteryListData');
        if (list && list.length != 0) {
          _home_menu.getNaviMenuView(list, index);
        } else {
          Utils.requestNeedTint('front/lottery/init.do', {}, function (data) {
            if (data.code == 0) {
              _home_menu.getNaviMenuView(data.data, index);
              Utils.saveStorage('lotteryListData', data.data);
            }
          });
        }
      }
      setTimeout(() => {
        // 导航菜单高亮_
        var currentUrl = location.href;
        var search = location.search;
        $('ul.nav-plus li').each(function () {
          var title = $(this).data('title');
          if (currentUrl.indexOf(title) > -1) {
            $(this).addClass('on')
            if (search != '' && $(this).html().indexOf(search) > -1) {
              return
            } else if (search != '' && $(this).html().indexOf(search) == -1) {
              $(this).removeClass('on')
            }
          }
        })
      }, 200);
    });

    //  无论有没有都请求一次，但是不影响页面的渲染 -- 彩种禁用、启用
    Utils.request('front/lottery/init.do', {}, function (data) {
      if (data.code == 0) {
        Utils.saveStorage('lotteryListData', data.data);
      }
    });
  },
  getNaviMenuView: function (list, index) {
    var _this = this;
    $.each(list, function (i, item) {
      if (item.type == 'j') {
        _home_menu.isShowZc = true;
      }
    });
    if (!_home_menu.isShowZc && index > 2) {
      index--;
    }
    // console.log('``````````````````````````')
    //   console.log(_home_menu.isShowChat)
    //   console.log(_home_menu.isDragon)
    //   console.log('``````````````````````````')
    // 获取棋牌和彩票  /game/getHotGame.do
    // var urlType = {
    //   lottery: "'lottery_hall','-1'",
    //   chess: "'home2','/pc/games/games.html?type=chess'",
    //   fish: "'home2','/pc/games/games.html?type=fish'",
    //   fruit: "'home2','/pc/games/games.html?type=fruit'",
    //   slot: "'home2','/pc/games/games.html?type=slot'",
    //   eSports:"'home2','/pc/games/games.html?type=eSports'"
    // }
    var urlType = {
      lottery: "'lottery_hall','-1'",
    }
    _this.hotList.forEach(function(item){
      urlType[item.platformType] = "'home2','/pc/games/games.html?type=" + item.platformType + "'"
    })
    urlType.lottery = "'lottery_hall','-1'";
    var naviStr = '', display = '', home = '', liWStyle = _home_menu.isShowZc ? 'width:107px' : 'width:124px';
    if (_home_menu.isShowChat == 'open') {
      liWStyle = 'width:80px'
    }
    if (index == 0) {
      display = 'display:block;';
      home = '<li data-title=/pc/index.html id="navHome"><a>首页</a></li>';
    } else {
      display = 'display:none;';
      home = "<li data-title=/pc/index.html id='navHome'><a data-url=\"/pc/index.html\" onclick=\"__openWin('home','/pc/index.html');\">首页</a></li>";
    }
    naviStr += '<div class="wrapper clearfix" id="header_box">' +
      '<div class="lottery-plus" id="lotterys">' +
      "<a class='lottery-hall-a' onclick=__openWin('lottery_hall','-1') target=_blank>购彩大厅</a>" +
      '<div class="lotterys-list-hd" id="lotterysList" style="' + display + '">' +
      '<ul class="lottery-list-box" id="lottery-list-box">' +
      //下面一行html代码不起作用，由 js getGameList() 动态生成
      '</ul>' +
      '</div>' +
      '</div>' +
      '<ul class="nav-plus clearfix" id="web_navi">';
    naviStr += home;
    // naviStr += '<li style="'+liWStyle+'">';
    // naviStr += "<a onclick=\"__openWin('lottery_hall','-1');\" target=\"_blank\">购彩大厅</a></li>";
    // naviStr += '<li style="'+liWStyle+'">';
    // naviStr += "<a onclick=\"__openWin('home2','/pc/games/games.html');\">棋牌</a></li>";
    if (_home_menu.isShowZc) {
      naviStr += '<li data-title=football>';
      naviStr += "<a onClick=\"__openWin('home2','/pc/football/common.html')\">竞彩</a></li>";
    }

    naviStr += '<li data-title=mobile>';
    naviStr += "<a onclick=\"__openWin('home_phone','/pc/index/mobile.html');\">手机版</a><em class=\"hot-icon\"></em></li>";
    naviStr += '<li data-title=promotion>';
    // naviStr += "<a onclick=\"__openWin('home2','/pc/index/promotion.html');\">优惠活动</a><em class=\"hot-icon\"></em></li>";
    naviStr += "<a onclick=\"__openWin('home2','/pc/index/newpromotion.html');\">活动</a><em class=\"hot-icon\"></em></li>";
    naviStr += '<li data-title=newIndex>';
    naviStr += "<a onclick=\"__openWin('home2','/pc/draw/newIndex.html')\" class=\"dropdown-desc\">开奖</a></li>";
    naviStr += '<li data-title=chart>';
    naviStr += "<a onClick=\"__openWin('home2','/pc/trend/chart.html')\">走势图</a></li>";
    if (_home_menu.isShowChat == 'open') {
      naviStr += '<li data-title=聊天室>';
      naviStr += "<a onClick=\"__openWin('home3','/pc/studio/#/chatroom')\">聊天室</a></li>";
    }
    /**
    naviStr += '<li data-title=/pc/index/mobile>';
    naviStr += "<a onclick=\"__openWin('home_phone','/pc/index/mobile.html');\">手机购彩</a><em class=\"hot-icon\"></em></li>";
    naviStr += '<li data-title=promotion>';
    naviStr += "<a onclick=\"__openWin('home2','/pc/index/newpromotion.html');\">优惠活动</a><em class=\"hot-icon\"></em></li>";
    naviStr += '<li data-title=newIndex>';
    naviStr += "<a onclick=\"__openWin('home2','/pc/draw/newIndex.html')\" class=\"dropdown-desc\">开奖公告</a></li>";
    naviStr += '<li data-title=newtrendList>';
    naviStr += "<a onClick=\"__openWin('home2','/pc/trend/newtrendList.html')\">走势图表</a></li>";
    if (_home_menu.isShowChat == 'open') {
      naviStr += '<li data-title=chatroom>';
      naviStr += "<a onClick=\"__openWin('home3','/pc/studio/#/chatroom')\">聊天室</a></li>";
    }
     */

    naviStr += '</ul>' +
      '</div>';
    $('.header-navbar-plus').html('');
    $('.header-navbar-plus').html(naviStr);
    // 选中对应选项
    _home_menu.getGameList("#lottery-list-box", list);
    // 是否显示棋牌
    if (!_home_menu.isshowChess) {
      // $('#navHome').after("<li data-title=购彩大厅><a onclick=__openWin('lottery_hall','-1') target=_blank>购彩大厅</a></li>")
    } else {
      // 合并接口，不再调用此接口
      // $.post('/game/getHotGame.do', function (data) {
        //  console.log(data);
        var itemsData = _this.hotList;
        if (itemsData == null) return;
        var inData = '';
        for (var i = 0; i < itemsData.length; i++) {
          var item = itemsData[i];
          var _blank = false;
          sessionStorage[item.platformType] = item.platformName;
          if (item.platformName === '彩票') {
            // item.platformName = '购彩大厅'
            // _blank = true;
            // _user_.openChess = false;
            // inData += '<li data-title=mall>' +
            //   "<a onclick=\"__openWin(" + urlType[item.platformType] + ");\" " + (_blank ? "target=\"_blank\"" : "") + ">" + item.platformName + "</a></li>";
          } else {
            _user_.openChess = true;
            inData += '<li data-title=games>' + 
            "<a onclick=\"__openWin(" + urlType[item.platformType] + ");\" " + (_blank ? "target=\"_blank\"" : "") + ">" + item.platformName + "</a><em class=\"hot-icon  hot-icon-new\"></em></li>";
          }
        }
        sessionStorage.setItem('openChess', _user_.openChess);
        $('#navHome').after(inData)
      // })
    }

    // 彩票列表
    if (index != 0) {
      // 一定要调用这个，否则列表不能展示
      _home_menu.readyLotteryListOpera();
    }
  },
  // footer
  getFooter: function () {
    var footerStr = '',
      footTimeArea = (__entire && __entire.footTimeArea ? __entire.footTimeArea : '2009-' + new Date().getFullYear()),
      footUrlAddressStr = (__entire && __entire.footUrlAddressStr ? __entire.footUrlAddressStr : '彩票网址：http://' + location.hostname),
      footCpTint = _home_menu.pcCpName;
    footerStr += '<div class="footer-cn js-lazy">' +
      '<div class="cnRight">' +
      '<div class="cnTop">' +
      //logo区
      '<div class="cn-list">' +
      '<i class="sprite sprite-end_logo"></i>' +
      '</div>' +
      '<div class="cn-list">' +
      '<h3 class="text-col"><i class="sprite sprite-hzxg"></i>&nbsp;&nbsp;账户相关</h3>';
    footerStr += '<ul>';
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-1')\" title=\"\">如何注册账号</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-3')\" title=\"\">怎么找回登录密码</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-37')\" title=\"\">如何修改手机号码</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-26')\" title=\"\">如何修改真实姓名</a></li>";
    footerStr += '</ul>' +
      '</div>' +
      '<div class="cn-list">' +
      '<h3 class="text-col"><i class="sprite sprite-czgc"></i>&nbsp;&nbsp;充值购彩</h3>';
    footerStr += '<ul>';
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-tit3')\" title=\"\">如何进行充值</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-tit4')\" title=\"\">如何购买彩票</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-9')\" title=\"\">如何查询购彩记录</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-tit3')\" title=\"\">充值没到账怎么办</a></li>";
    footerStr += '</ul>' +
      '</div>' +
      '<div class="cn-list">' +
      '<h3 class="text-col"><i class="sprite sprite-djtk"></i>&nbsp;&nbsp;兑奖提款</h3>';
    footerStr += '<ul>';
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-10')\">怎样进行兑奖</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-12')\">如何进行提款</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-13')\">提款是否收手续费</a></li>";
    footerStr += "<li><a onclick=\"__openWin('home_help','/pc/helpCenter/helpInfo.html#help-16')\">提款不成功怎么办</a></li>";
    footerStr += '</ul>' +
      '</div>' +
      '<div class="cn-list service">' +
      '<h3 class="text-col"><i class="sprite sprite-zxkf"></i>&nbsp;&nbsp;扫码下载</h3>';
    footerStr += '<ul>';
    footerStr += "<li><div class=\"down-img\"><img id=\"img-apple-footer\" src=\"\"><p>苹果扫码下载</p></div></li>";
    footerStr += "<li><div class=\"down-img\"><img id=\"img-android-footer\" src=\"\"><p>安卓扫码下载</p></div></li>";
    footerStr += '</ul>' +
      '<p>在线咨询时间：7*24小时</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="foot_box">' +
      '<div class="about_box">' +
      '<p>' + footTimeArea + '©<span>' + _home_menu.pcCpName + ' | </span>' + footUrlAddressStr +
      '<br><span class="c-grey">' + footCpTint + '郑重提示：彩票有风险，投注需谨慎！ 不向未满18周岁的青少年出售彩票</span></p>';
    footerStr += '<ul class="foot_info">';
    footerStr += "<li class=\"foot_wljc\"><img src=\"/pc/common/statics/img/foot/foot-bot1.png\"></li>";
    footerStr += "<li class=\"foot_wangan\"><img src=\"/pc/common/statics/img/foot/foot-bot2.png\"></li>";
    footerStr += "<li class=\"foot_wsjy\"><img src=\"/pc/common/statics/img/foot/foot-bot3.png\"></li>";
    footerStr += "<li class=\"foot_xylh\"><img src=\"/pc/common/statics/img/foot/foot-bot4.png\"></li>";
    footerStr += "<li class=\"foot_kxwz\"><img src=\"/pc/common/statics/img/foot/foot-bot5.png\"></li>";
    footerStr += '</ul>' +
      '<div class="clear"></div>' +
      '</div>' +
      '</div>' +
      '<div class="clear nospace"></div>';
    $(".jc-footer").html('');
    $(".jc-footer").html(footerStr);
  },

  // 两边下载浮动标
  getLeftRightDownloadAD: function () {
    var serviceHtml = `
      <div id="_leftAD" class="_float_AD l_AD">
        <img src="/pc/common/statics/img/home/serviceFloat-header.png">

        <div class="top_btn top_btn_service"></div>
        <div class="top_btn top_btn_qq"></div>
        <div class="top_btn top_btn_wechat"></div>
        <div class="top_btn top_btn_phone"></div>

        <div class="two_img ios-float">
          <img id="img-apple-float" src="">
        </div>

        <img class="float-close" src="/pc/common/statics/img/home/serviceFloat-close.png">
      </div>

      <div id="_rightAD" class="_float_AD r_AD">
        <img src="/pc/common/statics/img/home/serviceFloat-header.png">

        <div class="top_btn top_btn_service"></div>
        <div class="top_btn top_btn_qq"></div>
        <div class="top_btn top_btn_wechat"></div>
        <div class="top_btn top_btn_phone"></div>

        <div class="two_img android-float">
          <img id="img-android-float" src="">
        </div>

        <img class="float-close" src="/pc/common/statics/img/home/serviceFloat-close.png">
      </div>
    `
    // var ADStr = '<div id="_leftAD" class="_float_AD l_AD">' +
    //   '<img src="/pc/common/statics/img/home/online-right.png?v=1">' +
    //   '<div name="close_btn"></div>';
    // ADStr += "<div class=\"top1_btn\" name=\"_leftAD_service\"><a></a></div>";
    // ADStr += "<div class=\"top2_btn\" name=\"_leftAD_qq\"><a target=\"_blank\"></a></div>";
    // ADStr += '<div class="two_img"><img id="img-apple-float" src=""></div>' +
    //   '</div>' +
    //   '<div id="_rightAD" class="_float_AD r_AD">' +
    //   '<img src="/pc/common/statics/img/home/online-left.png?v=1">' +
    //   '<div name="close_btn"></div>';
    // ADStr += "<div class=\"top1_btn\" name=\"_rightAD_service\"><a></a></div>";
    // ADStr += "<div class=\"top2_btn\" name=\"_rightAD_qq\"><a target=\"_blank\"></a></div>";
    // ADStr += '<div class="two_img"><img id="img-android-float" src=""></div>' +
      // '</div>';
    // 加新消息
    var msn = '<div id="_msn" class="_float_msn _float_AD r_AD animated infinite bounce" style="display:none;">' +
      '<img src="/pc/common/statics/img/home/msn.png?">' +
      '<div name="msn_close_btn"></div>' +
      '<div name="msn_tint" class="msn_tint"></div>' +
      '</div>';
    $('body').append(serviceHtml + msn);
    // $('.top_btn').on('click', function() {
    //   if (!$(this).children($('.top_btn_alert')).length && !$(this).hasClass('top_btn_service')) {
    //     _alert('该客服通道正在建设中，请尝试使用其他客服方式。为您带来不便敬请谅解。')
    //   }
    // })
  },
  //@ parem  domSelector  : 一个dom选择器，  获得游戏列表(主页等彩票列表)
  getGameList: function (domSelector, list) {
    var static_value = {
      topNum: 6   //热门彩种，选前6个作为热门彩种
    };

    var count = list.length;
    if (count === 0) {
      return;
    }
    var hotHtmlArr = []; //热门彩种
    var hotTintArr = window.__entire.hotTintArr || ['最火爆的彩票', '彩友中200注', '最火爆的彩票', '彩友最爱', '彩友中500万', '最火爆的彩票']; //热门彩种提示
    var highHtml = "", //高频彩种
      lowHtml = "",
      allHtml = "";
    var highFreq = new Array();
    var lowFreq = new Array();
    var all = new Array();
    var isHaveCompet = false;
    for (var i = 0; i < count; i++) {
      var desc = hotTintArr[i];
      var hallLink = list[i].lotteryId;
      var iconUrl = _home_menu.getLotteryIconUrl(list[i].lotteryId);
      if (i < static_value.topNum) {
        if (hallLink < 100000) {
          hotHtmlArr.push("<li class=\"mainGame\"><a  onclick=\"__openWin(\'lottery_hall\',\'" + hallLink + "\');\" class=\"mainA\"><i class=\"icon nav40-9\"><img src=\"" + iconUrl + "\" /></i><span class=\"color333\">" + list[i].name + "</span></a>" + (desc ? "<a  onclick=\"__openWin(\'lottery_hall\',\'" + hallLink + "\');\" target=\"_blank\" class=\"status-desc\">" + desc + "</a></li>" : ''));
        } else {
          isHaveCompet = true;
        }
      }
      if (isHaveCompet && i == static_value.topNum) {
        desc = hotTintArr[i - 1];
        hotHtmlArr.push("<li class=\"mainGame\"><a  onclick=\"__openWin(\'lottery_hall\',\'" + hallLink + "\');\" class=\"mainA\"><i class=\"icon nav40-9\"><img src=\"" + iconUrl + "\" /></i><span class=\"color333\">" + list[i].name + "</span></a>" + (desc ? "<a  onclick=\"__openWin(\'lottery_hall\',\'" + hallLink + "\');\" target=\"_blank\" class=\"status-desc\">" + desc + "</a></li>" : ''));
      }
      if (list[i].type == 'h') {
        highFreq.push(list[i]);
      }
      if (list[i].type == 'l') {
        lowFreq.push(list[i]);
      }
      if (list[i].type != 'j') {
        all.push(list[i]);
      }
    }
    var highCount = highFreq.length;
    var lowCount = lowFreq.length;
    var allCount = all.length;
    if (highCount > 0) {
      highHtml += '<li class="allGames clearfix" data-type="1">';
      highHtml += '<h3><i class=\"icon-ALARM\"></i><span>高频彩</span></h3>';
      highHtml += '<ul class="clearfix game-list">';
      var showHtml = '';
      var hideHtml = '';
      for (var i = 0; i < highCount; i++) {
        var hallLink = highFreq[i].lotteryId;
        if (i < 6) {
          if ((i + 1) % 3 === 0) {
            showHtml += '<li><a  onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\">' + highFreq[i].name + '</a></li>';
          } else {
            showHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\">' + highFreq[i].name + '</a></li>';
          }
        }
        hideHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\">' + highFreq[i].name + '</a></li>';
        if (6 >= highCount) {
          hideHtml = "";
        }
      }
      showHtml += '</ul>';
      highHtml += showHtml;
      if (hideHtml !== '') {
        highHtml += '<i class="icon" id="open-btn-1" style="display: block;"></i>'
          + '<div class="line-fff"></div>'
          + '<div class="moreGames clearfix" style="display: none;" id="moreGames_1">'
          + '<div class="moreGames-box fl">'
          + '<div class="otherGames num-games">'
          + '<h3>高频彩</h3>'
          + '<ol>'
          + hideHtml
          + '</ol></div></div>'
          + '</div>';
      }
      highHtml += '</li>';
    }
    if (lowCount > 0) {
      lowHtml += '<li class="allGames" data-type="2">';
      lowHtml += '<h3><i class=\"icon-TIME\"></i><span>低频彩</span></h3>';
      lowHtml += '<ul class="clearfix game-list">';
      var showHtml = '';
      var hideHtml = '';
      for (var i = 0; i < lowCount; i++) {
        var hallLink = lowFreq[i].lotteryId;
        if (i < 6) {
          if ((i + 1) % 3 === 0) {
            showHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\">' + lowFreq[i].name + '</a></li>';
          } else {
            showHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\">' + lowFreq[i].name + '</a></li>';
          }
        }
        hideHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\" >' + lowFreq[i].name + '</a></li>';
        if (6 >= lowCount) {
          hideHtml = "";
        }
      }
      showHtml += '</ul>';
      lowHtml += showHtml;
      if (hideHtml !== '') {
        lowHtml += '<i class="icon" id="open-btn-1" style="display: block;"></i>';
        lowHtml += '<div class="line-fff"></div>';
        lowHtml += '<div class="moreGames clearfix" style="display: none;" id="moreGames_2">';
        lowHtml += '<div class="moreGames-box fl">';
        lowHtml += '<div class="otherGames num-games">';
        lowHtml += '<h3>低频彩</h3>';
        lowHtml += '<ol>';
        lowHtml += hideHtml;
        lowHtml += '</ol></div></div></div>';
      }
      lowHtml += '</li>';
    }
    if (allCount > 0) {
      allHtml += '<li class="allGames clearfix" data-type="3">';
      allHtml += '<h3><i class=\"icon-billiard-ball\"></i><span>全部</span></h3>';
      allHtml += '<ul class="clearfix game-list">';
      var showHtml = '';
      var hideHtml = '';
      for (var i = 0; i < allCount; i++) {
        var hallLink = all[i].lotteryId;
        if (i < 6) {
          if ((i + 1) % 3 === 0) {
            showHtml += '<li><a  onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\" >' + all[i].name + '</a></li>';
          } else {
            showHtml += '<li><a onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\" >' + all[i].name + '</a></li>';
          }
        }
        hideHtml += '<li><a  onclick=\"__openWin(\'lottery_hall\',\'' + hallLink + '\');\" >' + all[i].name + '</a></li>';
        if (6 >= allCount) {
          hideHtml = "";
        }
      }
      showHtml += '</ul>';
      allHtml += showHtml;
      if (hideHtml !== '') {
        allHtml += '</ul>';
        allHtml += '<i class="icon" id="open-btn-1" style="display: block;"></i>';
        allHtml += '<div class="line-fff"></div>';
        allHtml += '<div class="moreGames clearfix" style="display: none;" id="moreGames_3">';
        allHtml += '<div class="moreGames-box fl">';
        allHtml += '<div class="otherGames num-games">';
        allHtml += '<h3>全部</h3>';
        allHtml += '<ol>';
        allHtml += hideHtml;
        allHtml += '</ol></div></div></div>';
      }
      allHtml += '</li>';
    }

    // 竞技彩
    function getCompetitiveList() {
      var competHtml = ""; //竞技彩
      competHtml += '<li class="allGames clearfix" data-type="3">';
      competHtml += '<h3><i class=\"icon-billiard-ball\"></i><span>竞技彩</span></h3>';
      competHtml += '<ul class="clearfix game-list">';
      var showHtml = '';
      var hideHtml = '';
      var list = ['混投', '胜平负', '让球胜平负', '比分', '总进球', '半全场'];
      for (var i = 0; i < list.length; i++) {
        var hallLink = '/pc/football/common.html?playId=' + i;
        if (i < 6) {
          showHtml += '<li><a  onclick=\"__openWin(\'home2\',\'' + hallLink + '\');\" >' + list[i] + '</a></li>';
        }
        // hideHtml += '<li><a  onclick=\"__openWin(\'lottery_hall\',\''+ hallLink +'\');\" >' + list[i] + '</a></li>';
        // if (6 >= list.count) {
        //     hideHtml = "";
        // }
      }
      showHtml += '</ul>';
      competHtml += showHtml;
      if (hideHtml !== '') {
        competHtml += '</ul>';
        competHtml += '<i class="icon" id="open-btn-1" style="display: block;"></i>';
        competHtml += '<div class="line-fff"></div>';
        competHtml += '<div class="moreGames clearfix" style="display: none;" id="moreGames_3">';
        competHtml += '<div class="moreGames-box fl">';
        competHtml += '<div class="otherGames num-games">';
        competHtml += '<h3>竞技彩</h3>';
        competHtml += '<ol>';
        competHtml += hideHtml;
        competHtml += '</ol></div></div></div>';
      }
      competHtml += '</li>';
      return competHtml;
    }
    if (_home_menu.isShowZc) { //列表
      $(domSelector).html(hotHtmlArr.join("") + getCompetitiveList() + highHtml + lowHtml);
    } else {
      $(domSelector).html(hotHtmlArr.join("") + highHtml + lowHtml + allHtml);
    }
    $(domSelector).on('mouseover', '.allGames', function () {
      $('.allGames').mouseover(function (e) {
        var tag = $(this).data('type');
        $(this).addClass('allGames-on').siblings('li').removeClass('allGames-on').find('.moreGames').css({ 'display': 'none' });
        $('#moreGames_' + tag).css({ 'display': 'block' });
        $('#lotterysList').addClass('lotterys-list-hd-border1');
        $(this).children('.icon').hide();
        $(this).children('.line-fff').show();
      });
      $('.allGames').mouseout(function (e) {
        $(this).removeClass('allGames-on').find('.moreGames').css({ 'display': 'none' });
        $('#lotterysList').removeClass('lotterys-list-hd-border1');
        $(this).children('.icon').show();
        $(this).children('.line-fff').hide();
      });
    });
  },
  // 彩种列表展开或收起
  readyLotteryListOpera: function () {
    $('#lotterysList').hide();
    $('#lotterys').mouseover(function () {
      $('#lotterysList').show();
    }).mouseout(function () {
      $('#lotterysList').hide();
    });
    //added by ian
    $('#lottery-list-box').on('mouseover', '.allGames', function (e) {
      var tag = $(this).data('type');
      $(this).addClass('allGames-on').siblings('li').removeClass('allGames-on').find('.moreGames').css({ 'display': 'none' });
      $('#moreGames_' + tag).css({ 'display': 'block' });
      $('#lotterysList').addClass('lotterys-list-hd-border1');
      $(this).find('.icon').hide();
      $(this).find('.line-fff').show();
    });
    $('#lottery-list-box').on('mouseout', '.allGames', function (e) {
      $(this).removeClass('allGames-on').find('.moreGames').css({ 'display': 'none' });
      $('#lotterysList').removeClass('lotterys-list-hd-border1');
      $(this).find('.icon').show();
      $(this).find('.line-fff').hide();
    });
  },

  //ajax获取跑马灯数据
  getMqData: function (domSelector) {
    if ($(domSelector).length == 0) {
      return;
    }
    Utils.request('front/homepage/init.do', {}, function (data) {
      if (data.data.notices.length > 0) {
        var item = data.data.notices[0];
        $("#sys_tip_outer").append("<marquee id=\"sys_tip\" behavior=\"scroll\"></marquee>");
        ///* marquee标签必须由后来添加，和innerHTML同时存在，不可先于内容存在  */
        var html = item.content ? item.content.replace(/<br\s*\/?>/gi, "&nbsp;&nbsp;") : "";
        var marqueeDom = $("#sys_tip")
        marqueeDom.html(html);
      }
      if (window.location.pathname == '/pc/' || window.location.pathname == '/pc/index.html') {
        getNewMsg(data);//系统公告
        getPrizeUser(data);//中奖列表
      }
    });
  },
  validateImage: '',
  getValidateImage: function(){
    Utils.request('passport/validate_image.do', {}, function (data) {
      console.log(data)
      if(data.code == 0) {
        _home_menu.validateImage = data.data;
        $("#v_container").attr('src', data.data);
      } else {
        _alert(data.msg);
      }
    })
  },
  /*
     检查是否登陆
     未登录 则隐藏用于余额，显示登录输入框。登录，反之。
     已登录需要弹出系统公告，还需要显示 余额和用户名
   * */
  checkLogin: function () {
    // 可以先取缓存
    var userInfo = UserTool.getUserInfo();
    if (userInfo && userInfo.userId != 0) {
      _home_menu.handleHeadUserMes(userInfo);
      // 照样请求，不影响渲染
      Utils.requestNeedTint('passport/check_status.do', {}, function (data) {
        if (data.code == 0) {
          UserTool.saveUserInfo(data.data);
        }
      });
    } else {
      // Utils.request('passport/check_status.do',{},function (data) {
      // if (data.code == 0) {
      //     UserTool.saveUserInfo(data.data);
      //     _home_menu.handleHeadUserMes(data.data);
      // } else {
      $("#play_free,#agent_reg_url").show();
      var parentSelector = "#header_user_login";//父级dom的选择器
      $("#header_user").hide();
      if (location.href.indexOf("login.html") >= 0 || $("#_form_login").length > 0) {
        $(parentSelector).hide();
      } else {
        $(parentSelector).show();
      }

      /**
       * 登录的方法
       */
      function doLogin(async_) {
        var username_login = $.trim($(parentSelector + " [name=\"username\"]").val());
        var passwd_login = $.trim($(parentSelector + " [name=\"passwd\"]").val());
        var authnum_login = $.trim($(parentSelector + " [name=\"authnum\"]").val());
        if (username_login == '') {
          _alert('用户名不能为空!');
          return false;
        }
        if (passwd_login == '') {
          _alert('密码不能为空!');
          return false;
        }
        if (authnum_login == '') {
          _alert('验证码不能为空!');
          return false;
        }
        // var res = verifyCode.validate(authnum_login);
        // if (res) {
        //   // _alert("验证正确");
        // } else {
        //   _alert("验证码错误");
        //   $(parentSelector + " [name=\"authnum\"]").val('').trigger("focus");
        //   return false;
        // }

        var param = {
          account: username_login,
          password: passwd_login,
          headImg: authnum_login
        };

        // 请求sessionId
        Utils.removeStorage('sessionid');
        Utils.removeStorage('temporaryId');
        UserTool.delUserInfo();
        Utils.removeStorage('pv');
        //   Utils.removeStorage('noticeread');
        Utils.requestNeedTint('passport/distribute_sessionid.do', {}, function (data) {
          if (data.code != 0) {
            _alert('请求失败');
            return;
          }

          if (data.data.sessionid != '' && data.data.sessionid != undefined) {
            Utils.saveStorage('sessionid', data.data.sessionid);
          }
          if (data.data.temporaryId != '' && data.data.temporaryId != undefined) {
            Utils.saveStorage('temporaryId', data.data.temporaryId);
          }

          if (typeof (async_) != "boolean") {
            async_ = true;
          }
          // 登录
          Utils.requestNeedTint('passport/login.do', param, function (data) {
            if (data.code == 0) {
              //   console.log(1)
              _alert('登录成功', function () {
                if (location.href.match('/pc/register/index.html') || location.href.match('/pc/register/login.html')) {
                  __openWin('home', '/pc/index.html');
                }
                if (window.location.pathname === "/pc/index/newpromotion.html") {
                  window.location.reload();
                }
                if ($('#openIframe').attr('data-dragon') == 1) {
                  $('#openIframe').attr('src', '').hide().attr('data-dragon', 0)
                }
                Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
                  if (res.code === 0) {
                    Utils.saveStorage('gameFavorite',res.data);
                    $('#isDavorite').show();
                  }
                });
                //   if ($('#openIframe').attr())
                //   $('#openIframe')
              });
              UserTool.saveUserInfo(data.data);
              var __shareCodes = data.data.shareCodes;
              _home_menu.getValidateImage();
              Utils.saveStorage('pv', __shareCodes);
              Utils.saveStorage('isLogin', true);
              Utils.removeStorage('userType');
              Utils.removeStorage('accessToken');
              Utils.removeStorage('openid');
              Utils.removeStorage('nickname');
              Utils.removeStorage('commonCreateTime');
              _home_menu.getServiceMethod();
              promotion()
              //登陆成功
              //下面是刷新用户名和余额
              _home_menu.checkLogin();
              // 足彩的一个提示显示 -- 别删
              $('#sorcRecordLoading').html('');
            } else {
              window.verifyCode = new GVerify("v_container", true);
              _home_menu.getValidateImage();
              var parentSelector = "#header_user_login";//父级dom的选择器
              //登陆错误
              _alert(data.msg);
              if (data.hasOwnProperty('login_yzm') && data.login_yzm == 1) {
                $(parentSelector + " [name=\"login_img\"]").click();
                $(parentSelector + " [name=\"authnum\"]").val("");
              }
              $(parentSelector + " [name=\"authnum\"]").val("");
              $(parentSelector + " [name=\"username\"]").val("");
              $(parentSelector + " [name=\"passwd\"]").val("");
            }
          }, function () { });
        });
      }

      $(parentSelector + " [name=\"login\"]").click(doLogin);
      $("#v_container").click(function(){
        _home_menu.getValidateImage();
      })
      $(parentSelector + " [name=\"login_img\"]," + parentSelector + " [name=\"btn_refresh\"]," + parentSelector + " [name=\"div_top_click\"]").click(function newVerify() {
        var parentSelector = "#logxinxi";
        window.verifyCode = new GVerify("v_container", true);
        _home_menu.getValidateImage();
        $(parentSelector + " [name=\"authnum\"]").val('').trigger("focus");
        $(parentSelector + " [name=\"div_top_click\"]").hide();
      });
      // $(parentSelector+" [name=\"div_top_click\"]").trigger("click");//点击 按钮[请点击输入验证码]一次，帮助用户点击一次
      $(parentSelector + " [name=\"authnum\"]").bind("focus", function () {
        try { if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; } } catch (e) { }
      });
      $("#play_free").show();
      // $(parentSelector).get(0).onkeydown = function (event) {
      //   try {
      //     var e = event || window.event;
      //   } catch (e) {
      //     var e = arguments.callee.caller.arguments[0];
      //   }
      //   if (e.keyCode == 9) {// Tab 键
      //     try { if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; } } catch (e) { }
      //   }
      //   if (e && (e.keyCode == 13 || e.keyCode == 9)) { // enter 键
      //     if ($.trim($(parentSelector + " [name=\"username\"]").val()) == '') {
      //       $(parentSelector + " [name=\"username\"]").focus();
      //       return;
      //     }
      //     if ($.trim($(parentSelector + " [name=\"passwd\"]").val()) == '') {
      //       $(parentSelector + " [name=\"passwd\"]").focus();
      //       return;
      //     }
      //     if ($.trim($(parentSelector + " [name=\"authnum\"]").val()) == '') {
      //       $(parentSelector + " [name=\"div_top_click\"]").click();
      //       return;
      //     }
      //     if (!/^[0-9]{4}$/.test($.trim($(parentSelector + " [name=\"authnum\"]").val()))) {
      //       return;
      //     }
      //     doLogin();//不要刪我的代码
      //   }
      // };
      _bug_placeholder("#header_user_login");//解决 placeholder 兼容性问题
      // }

      // },function () {});

      // 照样请求，不影响渲染 - 考虑一下要不要
      Utils.request('passport/check_status.do', {}, function (data) {
        if (data.code == 0) {
          UserTool.saveUserInfo(data.data);
        }
      });
    }
  },
  handleHeadUserMes: function (data) {
    $("#header_user").show();
    $("#header_user_login").hide();
    $("#header_user [name=\"user_name\"]").html(data.account);
    // var strBalance = data.balance.toString();
    // $("#balance").html("￥" + Utils.toDecimal2(data.balance));
    // $("#balance").html("￥" + strBalance.substring(0,strBalance.lastIndexOf('.')+3));
    var strBalance = changeThreeDecimal(data.balance);
    $("#balance").html("￥" + strBalance.substring(0, strBalance.length - 1));
    // console.log(strBalance.substring(0,strBalance.lastIndexOf('.')+3))
    _user_.isLogin = "true";
    _user_.userName = data.account;
    $('#header_money_refresh').click(function () {

      _user_.refreshMoney("#balance");
    });
    $("#play_free,#agent_reg_url").hide();
  },
  // 请求客服方式+请求下载二维码
  getServiceMethod: function () {
    Utils.request('game/getCustomer.do', {}, function(res) {
      if (res.code === 0) {
        var copyContact = function(event) {
          var contactText = event.target.dataset.contact
          
          var divEle = document.createElement('div')
          divEle.append(contactText)
          document.body.appendChild(divEle)

          var range = document.createRange()
          range.selectNode(divEle)
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)
          
          try {
            document.execCommand('copy')
            _alert('复制成功')
          } catch (error) {
            console.error('复制客服联系方式报错：', error)
          } finally {
            document.body.removeChild(divEle)
          }
        }

        Utils.saveStorage({ serviceUrl: res.data.other })
        $('.top_btn_service').on('click', function() {
          window.open(res.data.other)
        })

        var itemList = []

        res.data.data.forEach(d => {
          var itemsHtml = document.createElement('div')
          var itemHeader = document.createElement('div')
          itemsHtml.className = 'top_btn_alert'
          itemHeader.className = 'top_btn_alert_item_header'

          d.links.forEach(l => {
            $(itemsHtml).append(
              `
                <div class="top_btn_alert_item">
                  <span>${l.name}</span>
                  <span class="top_btn_alert_item_contact">${l.contact}</span>
                  <img class="contact-copy" data-contact="${l.contact}" src="/pc/common/statics/img/home/copy.png" />
                </div>
              `
            )
          })

          switch (d.type) {
            case 'qq':
              itemHeader.append('QQ客服')
              itemsHtml.prepend(itemHeader)
              itemList.push(itemsHtml)
              $('.top_btn_qq').append(itemList).show()
              break
            case 'weChat':
              itemHeader.append('微信客服')
              itemsHtml.prepend(itemHeader)
              itemList.push(itemsHtml)
              $('.top_btn_wechat').append(itemList).show()
              break
            case 'hotLine':
              itemHeader.append('电话客服')
              itemsHtml.prepend(itemHeader)
              itemList.push(itemsHtml)
              $('.top_btn_phone').append(itemList).show()
              break
          }

          itemList = []
        })

        $('.contact-copy').on('click', copyContact)
      }
    })
    Utils.request('front/homepage/get_sidebar_config.do', {}, function (res) {
      if (res.code == 0) {
        $('#_leftAD [name=_leftAD_service]').find('a').attr('target', '_blank');
        $('#_rightAD [name=_rightAD_service]').find('a').attr('target', '_blank');
        // 放置时间戳
        var newDate = fmtDate(res.system_time)
        Utils.saveStorage('fmtDate', newDate)
        var list = res.data; var isThird = false; var serviceUrl = '';
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          // 客服设置
          if (item && item.remark == 'CUSTOMER_TYPE') {
            isThird = (item.value == 'SYSTEM') ? false : true;
          }
          if (item && item.remark == 'CUSTOMER_SERVICE_URL') {
            serviceUrl = item.value;
          }
          // 二维码下载
          if (item && item.value.length > 0) {
            if (item.remark == "ANDROID_IMG") {
              $("#img-android").attr('src', item.value);
              $("#img-android-float").attr('src', item.value);
              $("#img-android-footer").attr('src', item.value);
            } else if (item.remark == "IOS_IMG") {
              $("#img-apple").attr('src', item.value);
              $("#img-apple-float").attr('src', item.value);
              $("#img-apple-footer").attr('src', item.value);
            } 
            // else if (item.remark.indexOf("ONLINE_QQ_SERVICE") > -1) {
            //   if (item.remark === 'LEFT_ONLINE_QQ_SERVICE') {
            //     // 左侧QQ
            //     $('#_leftAD .top2_btn').find('a').attr('href', item.value);
            //   } else if (item.remark === 'RIGHT_ONLINE_QQ_SERVICE') {
            //     // 右侧QQ 可以不一样
            //     $('#_rightAD .top2_btn').find('a').attr('href', item.value);
            //   } else {
            //     // 同一个链接
            //     $('#_leftAD .top2_btn').find('a').attr('href', item.value);
            //     $('#_rightAD .top2_btn').find('a').attr('href', item.value);
            //   }
            // }
          }
        }
        if (isThird) {
          if (serviceUrl && serviceUrl.indexOf("{name}") != -1) {
            if (UserTool.getUserMes('account') && UserTool.getUserMes('account') != '') {
              serviceUrl = serviceUrl.replace('{name}', UserTool.getUserMes('account'));
            } else {
              serviceUrl = serviceUrl.replace('{name}', '游客');
            }
          }
          Utils.saveStorage('serviceUrl', serviceUrl);
          $('#_leftAD [name=_leftAD_service]').find('a').attr('href', serviceUrl);
          $('#_rightAD [name=_rightAD_service]').find('a').attr('href', serviceUrl);
          if (serviceUrl == '') {
            $('#_leftAD [name=_leftAD_service]').find('a').hide();
            $('#_rightAD [name=_rightAD_service]').find('a').hide();
            $("#_leftAD [name=_leftAD_service]").bind("click", function () {
              _alert('客服系统升级中，请稍候重试');
            });
            $("#_rightAD [name=_rightAD_service]").bind("click", function () {
              _alert('客服系统升级中，请稍候重试');
            });
          }
        } else {
          Utils.saveStorage('serviceUrl', window.baseUrl + 'mobile/service/serviceOnline.html');
          $('#_leftAD [name=_leftAD_service]').find('a').attr('href', baseUrl + 'mobile/service/serviceOnline.html');
          $('#_rightAD [name=_rightAD_service]').find('a').attr('href', baseUrl + 'mobile/service/serviceOnline.html');
        }

      } else {
        $("#_leftAD [name=_leftAD_service]").bind("click", function () {
          _alert(res.msg);
        });
        $("#_rightAD [name=_rightAD_service]").bind("click", function () {
          _alert(res.msg);
        });
      }
    }, function () { }, true);
  }
};

try {
  //下面是静态资源url的前缀
  if (typeof (_prefixURL) != "object") {
    window._prefixURL = {
      common: "/common/statics"
    };
  }
} catch (e) {
  console.log(e);
}

$(function () {
  try {
    //首页点击 logo 跳转主页,如果是主页则不绑定该方法
    if (location.href.length > document.domain.length + 2) {
      $("#liansai .sprite-logo").bind("click", function () {
        //document.domain
        __openWin("home", "/");
      });
    }
  } catch (e) { console.log(e); }
});

//下面是解决 placeholder 兼容性问题：
function _bug_placeholder(parent_selector_str) {
  try {
    var selector_str = parent_selector_str + " input[placeholder]";
    if (!$(selector_str) && $(selector_str).length == 0) {
      return;
    }
    if (!('placeholder' in document.createElement('input'))) {
      $(selector_str).each(function () {
        var that = $(this),
          text = that.attr('placeholder');
        var isFlag = false;
        if (that.attr("name") == "passwd" || that.attr("name") == "passward" || that.attr("name") == "pwd" || that.attr("type") == "password") {
          isFlag = true;
        }
        else {
          isFlag = false;
        }
        if (that.val() === "") {
          that.val(text).addClass('_bug_placeholder');
          if (isFlag) {
            that.removeAttr("type");
          }
        }
        that.bind("focus", function () {
          if ($(this).val() === text) {
            $(this).val("").removeClass('_bug_placeholder');
            if (isFlag) {
              that.attr("type", "password");
            }
          }
        }).bind("blur", function () {
          if ($(this).val() === "") {
            $(this).val(text).addClass('_bug_placeholder');
            if (isFlag) {
              that.removeAttr("type");
            }
          }
          else if (isFlag) {
            that.attr("type", "password");
          }
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
}

$(function () {
  // 来源接口请求
  var sourceQuery = ['pc/index.html','pc/register/index.html'];
  // 'pc/register/index.html'
  // Utils.request
  for (var i = 0; i < sourceQuery.length; i++) {
    var el = sourceQuery[i];
    if (window.location.href.indexOf(el) > -1) {
      // console.log(el)
      try {
        // operationType 操作类型：1 访客
        Utils.request('/counter/sourceHearBeat.do', { 'operationType': 1 });
      } catch (error) {}
    }
  }

  // _home_menu.getShowChat();
  UserTool.isClearLocalStorage();
  // 加载跑马灯模块
  _home_menu.getHeaderMarquee();
  // 加载网站头部数据
  _home_menu.getHeaderMenu();
  if (window.name == 'wn_1_home_first') {
    // 加载网站尾部数据
    _home_menu.getFooter();
    // 两边下载浮动标
    _home_menu.getLeftRightDownloadAD();
    // 请求客服方式+请求下载二维码
    _home_menu.getServiceMethod();
  }

  //点击免费试玩
  $("#play_free").on('click', function () {
    isShowSw = true;
    __openWin('reg', '/pc/register/regPlay.html');
  });

  //点击加入收藏
  $("#shoucang").on('click', function () {
    AddFavorite(location.herf, _home_menu.pcCpName);
    function AddFavorite(sURL, sTitle) {
      try {
        window.external.addFavorite(sURL, sTitle);
      } catch (e) {
        try {
          window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
          _alert("请使用Ctrl+D进行添加");
        }
      }
    }
  });
  $('.float-close').on('click', function () {
    $(this).parent().hide()
  })
  // 浮动标关闭
  $("#_leftAD [name=close_btn],#_rightAD [name=close_btn]").click(function () {
    $(this).parent().hide();
  });
  // 点击免费试玩 悬浮窗的试玩去掉
  //   $("#_rightAD .top1_btn").click(function() {
  //     /*!key_pcSwAD_start*/if (isSw && _user_.isLogin == true) { _alert('亲，已经在试玩状态了!'); } else { if (_user_.isLogin == true) { _alert('亲，您已登录!'); } else { isShowSw = true; __openWin('reg','/pc/register/regPlay.html'); } }/*!key_pcSwAD_end*/
  //   });
  // 新消息
  $("#_msn [name=msn_close_btn]").click(function () {
    $(this).parent().hide();
  });
  $("#_msn [name=msn_tint]").click(function () {
    $(this).parent().hide();
    __openWin('user_center', '/pc/userCenter/privateMsg.html');
  });

  //玩法规则左边高亮加class
  function menuLeftUI() {
    var ar = $("#left .list li a"), flag = false;
    for (var i = 0; i < ar.length; i++) {
      if (location.href.indexOf($(ar[i]).attr("href")) > 0) {
        $(ar[i]).parent().addClass("current");
        flag = true;
        break;
      }
    }
    if (!flag) {
      $(ar[0]).parent().addClass("current");
    }
  }
  try {
    if ($("#left .list li a").length > 0) {
      menuLeftUI();
    }
  } catch (e) { }
});

// 推广公告
window.promotion = function () {
  if (Utils.getStorage('noticeread')) {
    return
  }
  Utils.request('front/news/notice.do', {}, function (res) {
    if (res.code == 0) {
      if (!res.data) {
        return
      }
      if (!res.data.linkUrl || typeof res.data.linkUrl !== 'string') {
        return
      }
      Utils.saveStorage('noticeread', true)
      // content的a标签的跳转内容转换一下
      let _realStr = res.data.linkUrl
      // let _linkArr = []
      // let _wwcReg = /wwc:\/\/platformapi\/wwc\/[^'" ]+/g
      // ["wwc://platformapi/wwc/orders'"]
      // let _dirReg = /customLinkUrl\?url=(http|https|wwc)?(:\/\/)?[^'" ]+/g
      // ["customLinkUrl?url=http://www.baidu.com'"]
      // if (res.data.indexOf('customLinkUrl') > -1) {
      //   _linkArr = res.data.match(_dirReg)
      // } else {
      // }
      // _linkArr = res.data.linkUrl.match(_wwcReg)
      // console.log(_linkArr)
      // if (_linkArr && _linkArr.length > 0) {
      //   _linkArr.forEach((item, inx) => {
      //     _realStr = switchLink(item, _realStr)
      //   })
      // }
      var slink = function (url) {
        if (url.indexOf('customLinkUrl') > -1) {
          // var _customRule = /href="([a-zA-Z0-9\:\/\_\?\=\.]+)"/
          // var _u = url.split('url=')[1]
          // var _replace = str.match(_customRule)[1] || url
          // str = str.replace(_replace, _u)
          var _u = url.split('url=')[1]
          url = url.replace(url, _u)
        } else {
          switch (url) {
            case 'wwc://platformapi/wwc/orders':
              url = '/pc/userCenter/accountDetail.html'
              break
            case 'wwc://platformapi/wwc/accountDetail':
              url = '/pc/userCenter/accountDetail.html'
              break
            case 'wwc://platformapi/wwc/rechargeRecord':
              url = '/pc/userCenter/accountDetail.html'
              break
            case 'wwc://platformapi/wwc/withdrawRecord':
              url = '/pc/userCenter/accountDetail.html'
              break
            case 'wwwc://platformapi/wwc/messages':
            case 'wwc://platformapi/wwc/messages':
              url = '/pc/userCenter/privateMsg.html'
              break
            case 'wwc://platformapi/wwc/securityCenter':
              url = '/pc/userCenter/accountInfo.html'
              break
            case 'wwc://platformapi/wwc/onlineService':
              url = '/mobile/service/serviceOnline.html'
              break
            case 'wwc://platformapi/wwc/playRules':
              url = '/pc/rule/index.html'
              break
            case 'wwc://platformapi/wwc/aboutUs':
              url = '/pc/helpCenter/index.html'
              break
            case 'wwc://platformapi/wwc/profitLoss':
              url = '/pc/userCenter/accountDetail.html'
              break
            case 'wwc://platformapi/wwc/friendList':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/followList':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/football':
              url = '/pc/football/common.html'
              break
            case 'wwc://platformapi/wwc/betChatRoom':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/betChatRoom?position=1':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/betting':
              url = '/pc/mall/common.html'
              break
            case 'wwc://platformapi/wwc/chatRoom':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/redPacket?rid=':
              url = '/pc/userCenter/index.html'
              break
            case 'wwc://platformapi/wwc/privateChat?receiver=':
              url = '/pc/studio/#/chatroom'
              break
            case 'wwc://platformapi/wwc/activity':
              url = '/pc/index/newpromotion.html'
              break
            default:
              url = '#'
              break
          }
        }
        return url
      }

      var html = "<a href='" + slink(_realStr) + "'><img src='" + res.data.imageUrl + "'></a>";
      _alert3(html)
      // layer.open({
      //     title:"推广公告",
      //     content:_realStr
      // })
    }
  });
}
function switchLink(url, str) {
  if (url.indexOf('customLinkUrl') > -1) {
    // var _customRule = /href="([a-zA-Z0-9\:\/\_\?\=\.]+)"/
    // var _u = url.split('url=')[1]
    // var _replace = str.match(_customRule)[1] || url
    // str = str.replace(_replace, _u)
    var _u = url.split('url=')[1]
    str = str.replace(url, _u)
  } else {
    var a = ''
    switch (url) {
      case 'wwc://platformapi/wwc/orders':
        a = '/pc/userCenter/accountDetail.html'
        break
      case 'wwc://platformapi/wwc/accountDetail':
        a = '/pc/userCenter/accountDetail.html'
        break
      case 'wwc://platformapi/wwc/rechargeRecord':
        a = '/pc/userCenter/accountDetail.html'
        break
      case 'wwc://platformapi/wwc/withdrawRecord':
        a = '/pc/userCenter/accountDetail.html'
        break
      case 'wwwc://platformapi/wwc/messages':
      case 'wwc://platformapi/wwc/messages':
        a = '/pc/userCenter/privateMsg.html'
        break
      case 'wwc://platformapi/wwc/securityCenter':
        a = '/pc/userCenter/accountInfo.html'
        break
      case 'wwc://platformapi/wwc/onlineService':
        a = '/mobile/service/serviceOnline.html'
        break
      case 'wwc://platformapi/wwc/playRules':
        a = '/pc/rule/index.html'
        break
      case 'wwc://platformapi/wwc/aboutUs':
        a = '/pc/helpCenter/index.html'
        break
      case 'wwc://platformapi/wwc/profitLoss':
        a = '/pc/userCenter/accountDetail.html'
        break
      case 'wwc://platformapi/wwc/friendList':
        a = '/pc/studio/#/chatroom'
        break
      case 'wwc://platformapi/wwc/followList':
        a = '/pc/studio/#/chatroom'
        break
      case 'wwc://platformapi/wwc/football':
        a = '/pc/football/common.html'
        break
      case 'wwc://platformapi/wwc/activity':
        a = '/pc/index/newpromotion.html'
        break
      case 'wwc://platformapi/wwc/betChatRoom':
        a = '/pc/studio/#/chatroom'
        break
      case 'wwc://platformapi/wwc/betChatRoom?position=1':
        a = '/pc/studio/#/chatroom'
        break
      case 'wwc://platformapi/wwc/betting':
        a = '/pc/mall/common.html'
        break
      case 'wwc://platformapi/wwc/chatRoom':
        a = '/pc/studio/#/chatroom'
        break
      case 'wwc://platformapi/wwc/redPacket?rid=':
        a = '/pc/userCenter/index.html'
        break
      case 'wwc://platformapi/wwc/privateChat?receiver=':
        a = '/pc/studio/#/chatroom'
        break
      default:
        a = '#'
        break
    }
    // 替换链接
    str = str.replace(url, a)
  }
  return str
}
function urlSwitchLink(url) {
  console.log(url)
  var a = ''
  switch (url) {
    case 'wwc://platformapi/wwc/orders':
      a = '/pc/userCenter/accountDetail.html'
      break
    case 'wwc://platformapi/wwc/accountDetail':
      a = '/pc/userCenter/accountDetail.html'
      break
    case 'wwc://platformapi/wwc/rechargeRecord':
      a = '/pc/userCenter/accountDetail.html'
      break
    case 'wwc://platformapi/wwc/withdrawRecord':
      a = '/pc/userCenter/accountDetail.html'
      break
    case 'wwwc://platformapi/wwc/messages':
    case 'wwc://platformapi/wwc/messages':
      a = '/pc/userCenter/privateMsg.html'
      break
    case 'wwc://platformapi/wwc/securityCenter':
      a = '/pc/userCenter/accountInfo.html'
      break
    case 'wwc://platformapi/wwc/onlineService':
      a = '/mobile/service/serviceOnline.html'
      break
    case 'wwc://platformapi/wwc/playRules':
      a = '/pc/rule/index.html'
      break
    case 'wwc://platformapi/wwc/aboutUs':
      a = '/pc/helpCenter/index.html'
      break
    case 'wwc://platformapi/wwc/profitLoss':
      a = '/pc/userCenter/accountDetail.html'
      break
    case 'wwc://platformapi/wwc/friendList':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/followList':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/football':
      a = '/pc/football/common.html'
      break
    case 'wwc://platformapi/wwc/betChatRoom':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/betChatRoom?position=1':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/betting':
      a = '/pc/mall/common.html'
      break
    case 'wwc://platformapi/wwc/chatRoom':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/redPacket?rid=':
      a = '/pc/userCenter/index.html'
      break
    case 'wwc://platformapi/wwc/privateChat?receiver=':
      a = '/pc/studio/#/chatroom'
      break
    case 'wwc://platformapi/wwc/activity':
      a = '/pc/index/newpromotion.html'
      break
    default:
      a = '#'
      break
  }
  // console.log(url)
  return a
}

$(function () {
  $('#openDragon').click(function () {
    var _isDragon = $('#openIframe')
    var _isDragonVal = _isDragon.attr('data-dragon')
    if (_isDragonVal == 0) {
      $('#openIframe').attr('src', '/pc/draw/dragon.html').show()
      _isDragon.attr('data-dragon', 1)
    } else {
      $('#openIframe').attr('src', '').hide()
      _isDragon.attr('data-dragon', 0)
    }
    // $('#openIframe').toggle(0,function () {
    //     console.log('奇数')
    //     $('#openIframe').attr('src', '')
    // }, function () {
    //     console.log('偶数')
    //     $('#openIframe').attr('src', '/pc/draw/dragon.html')
    // })
  })
})


// 收藏模块
$(function () {
  if (UserTool.getUserInfo()) {
    Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
      if (res.code === 0) {
        Utils.saveStorage('gameFavorite',res.data);
      } else {
        _alert(res.msg);
      }
    });
    $('#isDavorite').show()
  } else {
    $('#isDavorite').hide()
  }

  function favoriteHtml () {
    var html = '';
    var __data = Utils.getStorage('gameFavorite');
    if (__data.length === 0) {
      html += '<span class="bg-col">我的收藏</span>';
      html += '<div class="favorite-wrap">';
        html += '<div class="favorite-none">暂无收藏</div>'
      html += '</div>';
    } else {
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
    }
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
      })
      event.stopPropagation();  
    })

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
      var lotteryId = _this.children('.btn_close_favorite').data('id');
      
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
  }

  


  $('#davorite').click(function () {
    var _parent = $('#isDavorite');
    $('.collection-wrap').toggle()
    favoriteHtml();
    // $('#isDavorite').em
    // Utils.request('/game/myCollection.do', { dealwith: "get" }, function (res) {
    //   var html = '';
    //   var msg = '';
    //   var _data = [];
    //   if (res.code === 0) {
    //     if (res.data.length === 0) {
    //       msg = '您暂无收藏的游戏'
    //     } else {
    //       Utils.saveStorage('gameFavorite',_data);
    //     }
    //   }

      

    // });

    // $.ajax({
    //   type: "post",
    //   url: "/game/myCollection.do",
    //   data: { dealwith: "get" },
    //   dataType: "JSON",
    //   success: function (response) {
    //     console.log(response);
    //   }
    // });
  });
})