function opRegDIV() {
    0 == $("#__pup_REG_div").length ? ($("body").append('<div id="__pup_REG_div"><div><iframe src="/pc/register/regDiv.html" name="_iframe_reg" scrolling="no" marginwidth="0px" marginwidth="0px" frameborder="0"  samless ></iframe></div></div>'), $("#__pup_REG_div").css({
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: "15",
        backgroundColor: "rgba(30,30,30,0.5)",
        left: "0",
        top: "0"
    }), $("#__pup_REG_div>div").css({
        width: "650px",
        marginLeft: "-325px",
        height: "520px",
        marginTop: "-260px",
        position: "absolute",
        left: "50%",
        top: "49%"
    }), $("#__pup_REG_div iframe").css({
        width: "100%",
        height: "100%",
        margin: "0",
        display: "block"
    })) : $("#__pup_REG_div iframe").attr("src", "/pc/register/regDiv.html"), $("#__pup_REG_div").show(), event.preventDefault ? event.preventDefault() : event.returnValue = !1
}

function getServiceMethod() {
    webStorageTool.getSystemConfigData(function (serviceUrl) {
      $("#onlineService").attr("href", serviceUrl);
    },function (msg) {
      $("#onlineService").bind("click", function () {
          _alert(msg);
      });
    });
}

window._static_const = {
    online_service: "object" == typeof _layout ? _layout.kf_url : "/",
    download_Iphone: "/pc/index/mobile.html",
    download_Android: "/pc/index/mobile.html",
    register_url: "/passport/register.do",
    home_lottery: "/pc/mall/common.html",
    Signout_url: "/index/LogOut.html"
}, window.lottery = {arr: [], gameIds: "", obj: {}}, window._lottery_menu = {
    checkLogin: function () {
        Utils.request("passport/check_status.do", {}, function (data) {
            function changeImg(nofocus) {
                $(selector_1 + " [name=login_img]").attr("src", "/validateCode?t=" + Math.random()), nofocus || $(selector_1 + " input[name=authnum]").val("").focus(), $(selector_1 + ' [name="div_top_click"]').hide()
            }

            if (data.code == 0) {
                $("#header_user").css("display", "block");
                $("#header_user_login").css("display", "none");
                $("#user_name").html(data.data.account);
                // var strBalance = data.data.balance.toString();
                var strBalance = changeThreeDecimal(data.data.balance);
                // $("#balance").html(strBalance.substring(0,strBalance.lastIndexOf('.')+3) ? "￥" + strBalance.substring(0,strBalance.lastIndexOf('.')+3) : "￥0");
                $("#balance").html(strBalance);
                _user_.isLogin = "true", _user_.userName = data.data.account;
            } else {
                try {
                    !function () {
                        var _flag_click_input_1 = !1;
                        $("#header_user_login input[type=text],#header_user_login input[type=password]").bind("click", function () {
                            _flag_click_input_1 = !0
                        }), $("#header_user_login [name=passwd]").bind("input", function () {
                            _flag_click_input_1 || $(this).val("")
                        }), $("#header_user_login [name=passwd]").val("")
                    }()
                } catch (e) {
                    console.log(e)
                }
                $("#header_user").css("display", "none"), $("#header_user_login").css("display", "block");
                var selector_1 = "#header_user_login";
                $(selector_1 + " [name=login]").bind("click", function () {
                    var authnum_login = $.trim($(parentSelector + ' [name="authnum"]').val()),
                        username_login = $.trim($(parentSelector + ' [name="username"]').val()),
                        passwd_login = $.trim($(parentSelector + ' [name="passwd"]').val());
                    if ("" == username_login) {
                        _alert("用户名不能为空!");
                        return ;
                    }
                    if ("" == passwd_login) {
                        _alert("密码不能为空!");
                        return ;
                    }
                    if ("" == authnum_login) {
                        _alert("验证码不能为空!");
                        return ;
                    }
                    // if (!verifyCodeMall.validate(authnum_login)) {
                    //   _alert("请输入正确的验证码!");
                    //   return ;
                    // }
                    _user_.doLogin(selector_1, "#header_user", !1) && $("#i_list_2 div_iframe").length > 0 && window.location.reload();
                });
                var parentSelector = "#header_user_login";
                $(parentSelector + ' [name="login_img"],' + parentSelector + ' [name="btn_refresh"],' + parentSelector + ' [name="div_top_click"]').click(function () {
                    _home_menu.getValidateImage(), $(parentSelector + ' [name="authnum"]').val("").trigger("focus"), $(parentSelector + ' [name="div_top_click"]').hide()
                }),
                $(parentSelector).get(0).onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if (9 == e.keyCode) try {
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1
                    } catch (e) {
                    }
                    if (e && (13 == e.keyCode || 9 == e.keyCode)) {
                        if ("" == $.trim($(parentSelector + ' [name="username"]').val())) return void $(parentSelector + ' [name="username"]').focus();
                        if ("" == $.trim($(parentSelector + ' [name="passwd"]').val())) return void $(parentSelector + ' [name="passwd"]').focus();
                        if ("" == $.trim($(parentSelector + ' [name="authnum"]').val())) return void $(".top_click").click();
                        _user_.doLogin(selector_1, "#header_user", !1)
                    }
                },
                $(selector_1 + ' [name="authnum"]').bind("focus", function () {
                    "" == $(this).val() && changeImg(!0);
                    try {
                        event.preventDefault ? event.preventDefault() : event.returnValue = !1
                    } catch (e) {
                    }
                }),
                $(selector_1 + ' [name="login_img"]').bind("click", function () {
                    changeImg();
                    try {
                        event.preventDefault ? event.preventDefault() : event.returnValue = !1
                    } catch (e) {
                    }
                })
            }
        }, function () {
        }, !1, !1, !0)
    }, head: function () {
        _lottery_menu.checkLogin(), function () {
            $("#_lottery_menu_head>button").click(function () {
                "none" != $("#_lottery_menu_head>div[name]").css("display") ? ($("#_lottery_menu_head>div[name]").hide(), $("#_lottery_menu_head>button").addClass("_open").removeClass("_close"), $("#iframeDivList").css("height", $(window).height() + "px")) : ($("#_lottery_menu_head>div[name]").show(), $("#_lottery_menu_head>button").addClass("_close").removeClass("_open"), $("#iframeDivList").css("height", $(window).height() - $("#_lottery_menu_head").height() + "px"))
            })
        }(), function (domSelector) {
            Utils.request("front/homepage/init.do", {}, function (data) {
                if (0 == data.code && data.data.notices.length > 0) {
                    var item = data.data.notices[0];
                    $("#sys_tip_outer").append('<marquee id="sys_tip" behavior="scroll"></marquee>');
                    var html = item.content ? item.content.replace(/<br\s*\/?>/gi, "&nbsp;&nbsp;") : "";
                    $("#sys_tip").html(html)
                }
            })
        }()
    }, leftMenu : function () {
        webStorageTool.getLotteryList(function (list) {
            _lottery_menu.handleLeftMenuData(list);
        });

        $("#hot_lottery .main-tit").on("click", function () {
            $(this).children("i").attr("class").indexOf("icon-attr-up") >= 0 ? ($(this).children("i").removeClass("icon-attr-up"), $(this).parent().find("ul").css("display", "none")) : ($(this).children("i").addClass("icon-attr-up"), $(this).parent().find("ul").css("display", "block"))
        }), $("#live-main-list .main-top").on("click", function () {
            $(this).children("i").attr("class").indexOf("icon-attr-up") >= 0 ? ($(this).children("i").removeClass("icon-attr-up"), $(this).parent().find("ul.gao-ul").css("display", "none")) : ($(this).children("i").addClass("icon-attr-up"), $(this).parent().find("ul.gao-ul").css("display", "block"))
        }), $("#live-menu-wrap>.live-logo").length > 0 && $("#live-menu-wrap>.live-logo").bind("click", function () {
            __openWin("home", "../index.html")
        })
    },
    handleLeftMenuData : function (list) {
      function getClickStr(obj) {
          lotteryLink(obj.name), obj.lotteryId;
          return " onclick=\"_lottery_mall.jumpToBet('" + obj.lotteryId + "')\""
      }
      var count = list.length;
      if (0 === count) return void $("#live-main-list").html("");
      for (var static_value = {topNum: 6}, hotHtmlArr = [], highHtmlArr = [], lowHtmllArr = [], gameIdStr_hot = "", gameIdStr_high = "", gameIdStr_low = "", i = 0; i < count; i++) {
          var sort = 0;
          "h" == list[i].type ? sort = 1 : "l" == list[i].type && (sort = 2);
          var id = list[i].lotteryId;
          if (lottery.gameIds += id + ",", lottery.obj[id] = list[i], lottery.arr.length > 0) {
              if (sort - lottery.arr[lottery.arr.length - 1][0] >= 0) lottery.arr.push([sort, id]); else for (var ll = lottery.arr.length, j = 0; j < ll; j++) if (sort - lottery.arr[j][0] <= 0) {
                  lottery.arr.splice(j, 0, [sort, id]);
                  break
              }
          } else lottery.arr.push([sort, id])
      }
      for (var i = 0; i < count; i++) {
          var obj = lottery.obj[lottery.arr[i][1]];
          if (1 != obj.stop) {
              var iconUrl = _home_menu.getLotteryIconUrl(obj.lotteryId);
              if (i < static_value.topNum && obj.lotteryId < 1e4) {
                  var hot_li_d_id = "hot_main-item-" + obj.lotteryId,
                      str = '<li class="nav-li lot_' + obj.icon + '"  data-sort="' + obj.sort + '"><a id="' + hot_li_d_id + '" class="nav-btn cur-btn" data-argsid="' + obj.lotteryId + '" title="' + obj.name + '" ' + getClickStr(obj) + ' ><i style="background:url('+iconUrl+');background-size: 27px 27px;"></i><span class="lot-text">' + obj.name + "</span></a>";
                  hotHtmlArr.push(str), gameIdStr_hot += obj.lotteryId + ","
              }
              var li_d_id = "main-item-" + obj.lotteryId,
                  str = '<li class="nav-li lot_' + obj.icon + '"  data-sort="' + obj.sort + '"><a id="' + li_d_id + '" class="nav-btn cur-btn" data-argsid="' + obj.lotteryId + '" title="' + obj.name + '" ' + getClickStr(obj) + ' ><i style="background:url('+iconUrl+');background-size: 27px 27px;"></i><span class="lot-text">' + obj.name + "</span></a>";
              "h" == obj.type ? (highHtmlArr.push(str), gameIdStr_high += obj.lotteryId + ",") : "l" == obj.type && (lowHtmllArr.push(str), gameIdStr_low += obj.lotteryId + ",")
          }
      }
      $("#hot_lottery .main-tit").data("gameIdStr", gameIdStr_hot);
      $("#hot_lottery>ul").html(hotHtmlArr.join(""));
      $("#high_lottery>ul").append(highHtmlArr.join(""));
      $("#high_lottery  .main-top").data("gameIdStr", gameIdStr_high);
      $("#low_lottery>ul").html(lowHtmllArr.join(""));
      $("#low_lottery  .main-top").data("gameIdStr", gameIdStr_low), setTimeout(function () {
          $(window).resize()
      }, 500);
    }
}, $(function () {
    // getServiceMethod()
    _lottery_menu.head()
    _lottery_menu.leftMenu()
});
