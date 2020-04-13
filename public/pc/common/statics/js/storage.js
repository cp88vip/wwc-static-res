var webStorageTool = {
    isShowZc : function (success) {
      var list = Utils.getStorage('lotteryListData');
      if (list && list.length != 0) {
        var isShow = false;
        $.each(list, function (i, item) {
            if (item.type == 'j') {
              isShow = true;
            }
        });
        return isShow;
      } else {
        return false;
      }
    },
    getLotteryList : function (success,failure) { // 获取彩种列表
      var list = Utils.getStorage('lotteryListData');
      if (list && list.length != 0) {
          if (typeof success !== "function") { return ; }
          if (success) {
            success(list);
          }
          // 照样请求一次，不影响渲染
          Utils.request('front/lottery/init.do',{},function (data) {
            if (data.code == 0) {
              Utils.saveStorage('lotteryListData',data.data);
            }
          });
      } else {
        Utils.request('front/lottery/init.do',{},function (data) {
          if (data.code == 0) {
            Utils.saveStorage('lotteryListData',data.data);
            if (typeof success !== "function") { return ; }
            if (success) {
              success(list);
            }
          } else {
            if (typeof failure !== "function") { return ; }
            if (failure) {
              failure(data.msg);
            }
          }
        });
      }
    },
    getGameLayout : function (lotteryId, success, failure) { // 获取玩法布局
      var list = Utils.getStorage('lotteryGame'+lotteryId);
      if (list && list.length != 0) {
        if (typeof success !== "function") { return ; }
        if (success) {
          console.log('join storage');
          success(list);
        }
        // 照样请求一次，不影响渲染
        $.ajax({
            type: "POST",
            url: "/pc/front/lottery/get_game.do",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({lotteryIds: lotteryId}),
            dataType: "json",
            async: !1,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("sessionid", Utils.getStorage("sessionid")),
                xhr.setRequestHeader("client-version", window.clientVersion),
                xhr.setRequestHeader("x-requested-with", window.xWidth)
                var _temporary = Utils.getStorage('temporaryId') || null
                if (_temporary) {
                    xhr.setRequestHeader('temporary-sessionId', _temporary);
                }
            },
            success: function (res) {
                if (res.code == 0) {
                  Utils.saveStorage('lotteryGame'+lotteryId,res.data);
                }
            },
            error: function (message) {
            }
        });

      } else {
        $.ajax({
            type: "POST",
            url: "/pc/front/lottery/get_game.do",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({lotteryIds: lotteryId}),
            dataType: "json",
            async: !1,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("sessionid", Utils.getStorage("sessionid")),
                xhr.setRequestHeader("client-version", window.clientVersion),
                xhr.setRequestHeader("x-requested-with", window.xWidth)
                var _temporary = Utils.getStorage('temporaryId') || null
                if (_temporary) {
                    xhr.setRequestHeader('temporary-sessionId', _temporary);
                }
            },
            success: function (res) {
                if (res.code == 0) {
                  if (typeof success !== "function") {return ;}
                  if (success) {
                    success(res.data);
                    Utils.saveStorage('lotteryGame'+lotteryId,res.data);
                  }
                } else {
                  if (res.code >= 300 && res.code < 400) {
                     _alert('登录超时，请重新登录!',function () {
                       if( window.name != 'home' ){//如果不是主页的其他页面则退出当前页面（一般是窗口）
                           window.close();
                           localStorage.removeItem('user');
                                    localStorage.removeItem('pv');
                       }
                       __openWin("home", "/pc/index.html");
                     });
                  } else {
                    if (typeof failure !== "function") { return ; }
                    if (failure) {
                      failure(res.msg);
                    }
                  }
                }
            },
            error: function (message) {
              if (typeof failure !== "function") { return ; }
              if (failure) {
                failure('请求超时');
              }
            }
        });
      }
    },
    getSystemConfigData : function (success, failure) { // 获取系统配置 : serviceUrl - 客服
      var serverStr = Utils.getStorage('serviceUrl');
      if (serverStr && serverStr != '') {
        if (typeof success !== "function") { return ; }
        if (success) {
          success(serverStr);
        }
        // 照样请求一次，不影响渲染
        Utils.request('front/homepage/get_sidebar_config.do', {}, function(res){
          if (res.code == 0) {
            webStorageTool.handleSystemServiceUrl(res);
          }
        },function () {},true);
      } else {
        Utils.request('front/homepage/get_sidebar_config.do', {}, function(res){
          if (res.code == 0) {
            var serviceUrl = webStorageTool.handleSystemServiceUrl(res);
            if (typeof success !== "function") { return ; }
            if (success) {
              success(serviceUrl);
            }
          } else {
            if (typeof failure !== "function") { return ; }
            if (failure) {
              failure(res.msg);
            }
          }
        },function () {},true);
      }
    },
    handleSystemServiceUrl : function (res) { // 处理客服url
      var list = res.data, isThird = false, serviceUrl = '';
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item && item.remark == 'CUSTOMER_TYPE') { // 客服设置
            isThird = (item.value == 'SYSTEM') ? false : true;
        }
        if (item && item.remark == 'CUSTOMER_SERVICE_URL') {
            serviceUrl = item.value;
        }
      }
      if (isThird) { // 客服
        if (serviceUrl && serviceUrl.indexOf("{name}") != -1) {
            if (UserTool.getUserMes('account') && UserTool.getUserMes('account') != '') {// 会员
                serviceUrl = serviceUrl.replace('{name}', UserTool.getUserMes('account'));
            } else {// 游客
                serviceUrl = serviceUrl.replace('{name}', '游客');
            }
        }
        Utils.saveStorage('serviceUrl',serviceUrl);
        return serviceUrl;
      } else {
        Utils.saveStorage('serviceUrl',window.baseUrl + 'mobile/service/serviceOnline.html');
        return window.baseUrl + 'mobile/service/serviceOnline.html';
      }
    }
}
