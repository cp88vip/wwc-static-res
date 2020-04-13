window.isRequst = "";

var isLoaded = false;
var loadIndex = layer.load(2, {
    shade : [ 0.9, '#fff' ]
});
function trim ( string ) {
    return string.replace(/(^\s*)|(\s*$)/g,'');
}

function isInteger(num) {
  var reg = /[^0-9]/;
  if (reg.test(num)) {
  return false;
  }
  return true;
}

function clearNoNumWithTwoPoint(obj) {
  obj.value = obj.value.replace(/[^\d.]/g,"");
  obj.value = obj.value.replace(/\.{2,}/g,".");
  obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
  if(obj.value.indexOf(".")< 0 && obj.value != ""){
      obj.value = parseFloat(obj.value);
  }
}

// 限制整数
function clearNoNumInt(obj){
		// obj.value = obj.value.replace(/^(\-)*(\d+).*$/,'$1$2');
		// if(obj.value.indexOf(".")< 0 && obj.value != ""){
		// 		obj.value = parseFloat(obj.value);
		// }
    obj.value = obj.value.replace(/[^\d]/g, ""); //清除“数字”和“.”以外的字符
    if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      obj.value = obj.value;
    }
}
function numFloat(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = parseFloat(obj.value);
    }
}

function setPlayType () {
    let headtype = JSON.parse(sessionStorage.getItem('user'));

    if (headtype == undefined || headtype == 'undefined' || headtype == null) {
        sessionStorage.setItem('playType', 1);
    }
    if (!sessionStorage.getItem('playType')) {
        sessionStorage.setItem('playType', headtype.playType);
    }
    // sessionStorage.setItem('playType', headtype.playType)
}
setPlayType()
function numberFloor (number) {
    if (number <= 0) {
        return -(Math.floor(-number * 1000) / 1000).toFixed(3)
    } else {
        return (Math.floor(number * 1000) / 1000).toFixed(3)
    }
}
//2个集合的差集
Array.prototype.minus = function (arr) {
    var result = new Array();
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = 1;
    }
    for (var j = 0; j < this.length; j++) {
        if (!obj[this[j]])
        {
            obj[this[j]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};
Array.prototype.minusObj = function (arr, key) {
    var result = new Array();
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i][key]] = 1;
    }
    for (var j = 0; j < this.length; j++) {
        if (!obj[this[j][key]]) {
            obj[this[j][key]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};
// 设置请求头部
function temporaryHead (xhr) {
    // temporary-sessionId
    var _temporary = sessionStorage.getItem('temporaryId') || null
    if (_temporary) {
        xhr.setRequestHeader('temporary-sessionId', _temporary);
    }
}
function post(url, data, fun) {
    $.ajax({
        type : "POST",
        url : url,
        data : data,
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            if (!isLoaded) {
                layer.close(loadIndex);
                isLoaded = true;
            }
            if (e.code >= 300 && e.code < 400) {
                layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout(
                    location=redirectUrl,
                    1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                return;
            } else {

                fun(e);
            }
        },
        error : function(message) {
            console.log(message)
        }
    });
}


function postOnce(url, data, fun) {
    return $.ajax({
        type : "POST",
        url : url,
        data : data,
        beforeSend : function(xhr) {
            if (!isRequst) {
                isRequst += "1";
            } else {
                return ;
            }
            var _inx = layer.load(2, {
                shade: [0.2, "#000"],
                shadeClose: false
            });
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            // if (!isLoaded) {
            //     layer.close(loadIndex);
            //     isLoaded = true;
            // }
            isRequst = "";
            layer.closeAll();
            if (e.code >= 300 && e.code < 400) {
                layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout( location=redirectUrl, 1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                return;
            } else {
                fun(e);
            }
        },
        error : function(message) {
            isRequst = "";
            layer.closeAll();
            console.log(message)
        }
    });
}

function reuqestNoneAuth(url, data, fun) {
    $.ajax({
        type : "POST",
        url : url,
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(data),
        dataType : "json",
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            if (!isLoaded) {
                layer.close(loadIndex);
                isLoaded = true;
            }
            if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg, function () {
                    // location.reload(true);
                });
            } else {
                fun(e);
            }
        },
        error : function(message) {
            console.log(message)
        }
    });
}

function request(url, data, fun) {
    // console.log(sessionStorage.getItem('playType'))
    $.ajax({
        type : "POST",
        url : url,
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(data),
        dataType : "json",
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            if (!isLoaded) {
                layer.close(loadIndex);
                isLoaded = true;
            }
            if (e.code >= 300 && e.code < 400) {
                layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout(
                    location=redirectUrl,
                    1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                // setTimeout(function(){
                // 	window.location.href = "/manage/account/index.do";
                // }, 1500);
                return;
            } else {
                fun(e);
            }
        },
        error : function(message) {
            console.log(message)
        }
    });
}

function requestOnce(url, data, fun) {
    $.ajax({
        type : "POST",
        url : url,
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(data),
        dataType : "json",
        beforeSend : function(xhr) {
            if (!isRequst) {
                isRequst += "1";
            } else {
                return ;
            }
            var _inx = layer.load(2, {
                shade: [0.2, "#000"],
                shadeClose: false
            });
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            isRequst = "";
            layer.closeAll();

            if (e.code >= 300 && e.code < 400) {
                layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout(
                    location=redirectUrl,
                    1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                // setTimeout(function(){
                // 	window.location.href = "/manage/account/index.do";
                // }, 1500);
                return;
            } else {
                fun(e);
            }
        },
        error : function(message) {
            isRequst = "";
            layer.closeAll();
            console.log(message)
        }
    });
}

//同步，实现ajax返回值
var requestSyn = function(url, data, fn){
    var result;
    $.ajax({
        type : "POST",
        url : url,
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(data),
        dataType : "json",
        async: false,
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            if (!isLoaded) {
                layer.close(loadIndex);
                isLoaded = true;
            }
            if (e.code >= 300 && e.code < 400) {
                layer.msg("需要重新登录哦~");

                // layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout(function(){
                    window.location.href = redirectUrl;
                }, 1500);
                // setTimeout(
                // 		'location="/manage/account/login.do#"+location.href',
                // 		1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                // setTimeout(function(){
                // 	window.location.href = "/manage/account/index.do";
                // }, 1500);
                return;
            } else {
                if (typeof fn !== "function") { return ;}
                result = fn(e);
            }
        },
        error : function(message) {
            console.log(message);
        }
    });
    return result;
}
var requestSynRegist = function(url, data, fn){
    var result;
    $.ajax({
        type : "POST",
        url : url,
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(data),
        dataType : "json",
        async: false,
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return sessionStorage.getItem("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
                toString : function() {
                    return $.cookie("temporaryId");
                }
            });
            // temporaryHead(xhr);
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            if (!isLoaded) {
                layer.close(loadIndex);
                isLoaded = true;
            }
            if (e.code >= 300 && e.code < 400) {
                layer.msg("需要重新登录哦~");

                // layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = location.href;
                } else {
                    redirectUrl = location.href;
                }
                setTimeout(function(){
                    window.location.href = redirectUrl;
                }, 1500);
                // setTimeout(
                // 		'location="/manage/account/login.do#"+location.href',
                // 		1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                // setTimeout(function(){
                // 	window.location.href = "/manage/account/index.do";
                // }, 1500);
                return;
            } else {
                if (typeof fn !== "function") { return ;}
                result = fn(e);
            }
        },
        error : function(message) {
            console.log(message);
        }
    });
    return result;
}
function strDateTime(str) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if ( r==null ) return false;
    var d = new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth()+1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}
var easyLayer = function($config) {
  try {
    //判断有没有layer
    var _layer = layer;
  } catch (e) {
    var _layer = null;
    return _layer;
  }
  /****/
  var _base = {
    type: 1,
    skin: 'layui-layer-rim', //加上边框
    area: ['40%', '28%'],
    closeBtn: 1,
    shadeClose: true,
    title: "",
    content: ""
  };
  if (typeof $config === "object" && JSON.stringify($config) !== "{}") {
    for (var _e in $config) {
      if ($config.hasOwnProperty(_e)) {
        _base[_e] = $config[_e];
      }
    }
  }

  var _loading = function() {
    return _layer.load(2, {
      shade: [0.2, "#000"],
      shadeClose: false
    });
  }
  var _open = function($config, $event) {//只能支持 click？
    if (typeof $config === "object" && JSON.stringify($config) !== "{}") {
      for (var _e in $config) {
        if ($config.hasOwnProperty(_e)) {
          _base[_e] = $config[_e];
        }
      }
    }
    /*弹出层*/
    var _inx = _layer.open(_base);
    /*相应的dom操作*/
    if (typeof $event === "object") {
      // var _elements = $event.elements;
      for (var _element in $event) {
        if ($event.hasOwnProperty(_element)) {
          $(_element).off("click").on("click", $event[_element]);
        }
      }
    } else {
      console.log($event);
      return false;
    }
    return _inx;
  }
  var _close = function($inx) {
    _layer.close($inx);
  }
  return {
    loading: _loading,
    open: _open,
    close: _close
  }
}

$(function(){
    // 通过该方法来为每次弹出的模态框设置最新的zIndex值，从而使最新的modal显示在最前面
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1041 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 10);
    });
});

var BroswerUtil = {
  //检测浏览器
  getBrowserName: function (str) {
    var UserAgent = str.toLowerCase();
    return {
      isIE6: /msie 6.0/.test(UserAgent), // IE6
      isIE7: /msie 7.0/.test(UserAgent), // IE7
      isIE8: /msie 8.0/.test(UserAgent), // IE8
      isIE9: /msie 9.0/.test(UserAgent), // IE9
      isIE10: /msie 10.0/.test(UserAgent), // IE10
      isIE11: /msie 11.0/.test(UserAgent), // IE11
      isLB: /lbbrowser/.test(UserAgent), // 猎豹浏览器
      isUc: /ucweb/.test(UserAgent) || /ucbrowser/.test(UserAgent), // UC浏览器
      is360: /360se/.test(UserAgent), // 360浏览器
      isBaidu: /bidubrowser/.test(UserAgent), // 百度浏览器
      isSougou: /metasr/.test(UserAgent) || /sogoumse/.test(UserAgent) || /sogoumobilebrowser/.test(UserAgent), // 搜狗浏览器
      isChrome: /chrome/.test(UserAgent) && /safari/.test(UserAgent) && !/edge/.test(UserAgent) && !/vivobrowser/.test(UserAgent) && !/miuibrowser/.test(UserAgent) && !/opr/.test(UserAgent) && !/qqbrowser/.test(UserAgent) && !/mqqbrowser/.test(UserAgent) && !/ucbrowser/.test(UserAgent) && !/metasr/.test(UserAgent) && !/sogoumse/.test(UserAgent) && !/sogoumobilebrowser/.test(UserAgent), // Chrome浏览器
      isFirefox: /firefox/.test(UserAgent), // 火狐浏览器
      isOpera: /opera/.test(UserAgent), // Opera浏览器
      isSafire: /safari/.test(UserAgent) && !/edge/.test(UserAgent) && !/chrome/.test(UserAgent), // safire浏览器
      isQQ: /qqbrowser/.test(UserAgent) || /mqqbrowser/.test(UserAgent),//qq浏览器
      isEdge: /edge/.test(UserAgent),
      isVivoBrowser: /vivobrowser/.test(UserAgent),
      isMiuiBrowser: /miuibrowser/.test(UserAgent),
      isSSC: /ssc/.test(UserAgent),
      isColor: /[c|C]olor[C|c]hat/.test(UserAgent),
      isOppo:/opr/.test(UserAgent)
    };
  },
  CurrentSystem: function (str) {
    var system = {
      win: false,
      mac: false,
      xll: false,
      iphone: false,
      ipoad: false,
      ipad: false,
      ios: false,
      android: false,
      nokiaN: false,
      winMobile: false,
      wii: false,
      ps: false,
      manage:false,
      ssc:false
    };
    var ua = str;
    // 检测平台
    var p = str;
    system.manage = p.indexOf('manager') > -1;
    system.win = p.indexOf('Win') > -1;
    system.mac = p.indexOf('Mac') > -1;
    system.xll = (p.indexOf('Xll') > -1 || p.indexOf('Linux') > -1 && !p.indexOf('Android'));
    system.ssc = p.indexOf('SSC') > -1;
    if(system.ssc){
        system.ssc = p;
    }
    // 检测Windows操作系统
    if (system.win) {
      if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp['$1'] == 'NT') {
          switch (RegExp['$2']) {
            case '5.0':
              system.win = 'Windows2000';
              break;
            case '5.1':
              system.win = 'WindowsXP';
              break;
            case '6.0':
              system.win = 'WindowsVista';
              break;
            case '6.1':
              system.win = 'Windows7';
              break;
            case '6.2':
              system.win = 'Windows8';
              break;
            case '10.0':
              system.win = 'Windows10';
              break;
            default:
              system.win = 'WindowsNT';
              break;
          }
        } else if (RegExp['$1'] == '9x') {
          system.win = 'WindowsME';
        } else {
          system.win = RegExp['$1'];
        }
      }
    }
    // windows mobile
    if (system.win == 'CE') {
        system.winMobile = system.win;
      } else if (system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d)/i.test(ua)) {
          system.win = 'Phone';
          system.winMobile = parseFloat(RegExp['$1']);
        }
      }
      // 检测IOS版本
      if (system.mac && ua.indexOf('Mobile') > -1) {
        if (/CPU (?:iPhone )?OS (\d+_\d+)/i.test(ua)) {
          system.ios = parseFloat(RegExp['$1'].replace('_',
            '.'));
        } else {
          system.ios = 2;    // 不能真正检测出来，所以
          只能猜测
        }
      }
      // 检测Android版本
      if (/Android (\d+\.\d+)/i.test(ua)) {
        system.android = parseFloat(RegExp['$1']);
      }
      // 游戏系统
      system.wii = ua.indexOf('Wii') > -1;
      system.ps = /PlayStation/i.test(ua);
    // 移动设备
    system.iphone = ua.indexOf('iPhone') > -1 && !(system.mac) && !(system.ssc);
    system.ipod = ua.indexOf('iPod') > -1;
    system.ipad = ua.indexOf('iPad') > -1;
    system.nokiaN = ua.indexOf('nokiaN') > -1;
    system.android = ua.indexOf('Android') >-1 && !(system.ssc);
    
    return {
      system: system
    }
  }

}
function getSystem(str) {
  var systems = BroswerUtil.CurrentSystem(str);
  for (var sys in systems.system) {
    if (systems.system[sys]) {
      switch (sys) {
        case "win":
          return systems.system[sys]+"系统";
          break;
        case "xll":
          return "Linux系统";
          break;
        case "iphone":
          return "iphone手机iOS系统";
          break;
        case "ipoad":
          return "ipoad系统";
          break;
        case "ipad":
          return "ipad系统";
          break;
        case "ipod":
          return "ipod系统";
          break;
        case "ios":
          return "iOS系统";
          break;
        case "android":
          return "Android系统";
          break;
        case "nokiaN":
          return "Nokia系统";
          break;
        case "winMobile":
          return "winMobile系统";
          break;
        case "wii":
          return "wii游戏系统";
          break;
        case "ps":
          return "ps游戏系统";
          break;
        case "manage":
          return "manager注册";
          break;
        case "mac":
          return "苹果Mac系统";
          break;
        case "ssc":
          return systems.system[sys];
          break;
        default:
          return "未知系统";
          break;
      }
    } else {
      continue
    }
  }
  return "未知系统";
}

function getBrowser(str) {
  var browser = BroswerUtil.getBrowserName(str);
  for (bro in browser) {
    if (browser[bro]) {
      switch (bro) {
        case "isIE6":
          return "IE6浏览器";
          break;
        case "isIE7":
          return "IE7浏览器";
          break;
        case "isIE8":
          return "IE8浏览器";
          break;
        case "isIE9":
          return "IE9浏览器";
          break;
        case "isIE10":
          return "IE10浏览器";
          break;
        case "isIE11":
          return "IE11浏览器";
          break;
        case "isLB":
          return "猎豹浏览器";
          break;
        case "isUc":
          return "UC浏览器";
          break;
        case "is360":
          return "360浏览器";
          break;
        case "isBaidu":
          return "百度浏览器";
          break;
        case "isSougou":
          return "搜狗浏览器";
          break;
        case "isChrome":
          return "Chrome浏览器";
          break;
        case "isFirefox":
          return "火狐浏览器";
          break;
        case "isOpera":
          return "Opera浏览器";
          break;
        case "isSafire":
          return "safari浏览器";
          break;
        case "isQQ":
          return "qq浏览器";
          break;
        case "isEdge":
          return "Edge浏览器";
          break;
        case "isVivoBrowser":
          return "Vivo手机自带浏览器";
          break;
        case "isMiuiBrowser":
          return "小米手机自带浏览器";
          break;
        case "isSSC":
          return "来自APP";
          break;
        case "isOppo":
          return "Oppo手机自带浏览器";
          break;
        case "isColor":
          return "彩聊自带浏览器";
          break;
        default:
          return str; // "未知浏览器";
          break;
      }
    } else {
      continue
    }
  }
  return "未知浏览器";
}
