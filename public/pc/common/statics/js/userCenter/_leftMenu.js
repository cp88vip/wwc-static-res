// @ Moda

/**
 *左边树、头部 公共代码
 */

$(function(){
    //初始化 左边树 和 头部
    (function initHTML(){
        var time = new Date().getTime();
        var date = new Date(time).chinese();
        var dateStr = date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):("0"+(date.getMonth()+1)))+"-"+(date.getDate()>=10?date.getDate():("0"+date.getDate()))+" "+(date.getHours()>=10?date.getHours():("0"+date.getHours()))+":"+(date.getMinutes()>=10?date.getMinutes():("0"+date.getMinutes()))+":"+(date.getSeconds()>=10?date.getSeconds():("0"+date.getSeconds()));
        var htmlStr_header = "<div><div class=\"logo1\" ><a onclick=\"__openWin('home','/pc/index.html')\"></a></div><div class=\"logo1-2\" ></div><div class=\"header-right\"><div id='current_time' data-timestamp='"+time+"'><i></i>北京时间："+dateStr+"</div></div></div>";
        var header_banner = "<div class=\"header_banner bg-nav-col\"><span class=\"bg-col\">会员中心</span></div>";
        $("#header").html(htmlStr_header + header_banner);
        var leftHtml_arr = [
            "<li id=\"index\" data-href='/pc/userCenter/index.html'><a><i class=\"icon-Home\"></i><span>用户中心</span></a></li>",
            "<li id=\"deposit\" data-href=\"/pc/userCenter/deposit.html\"><a><i class=\"icon-coin-yen\"></i><span>在线存款</span></a></li>",
            "<li id=\"qukuan\" data-href=\"/pc/userCenter/bindbank.html\"><a><i class=\"icon-coin-dollar\"></i><span>在线取款</span></a></li>",
            "<li id=\"accountInfo\" data-href='/pc/userCenter/accountInfo.html'><a><i class=\"icon-credit-card\"></i><span>安全中心</span></a></li>",
            "<li id=\"jiaoyi\" data-href='/pc/userCenter/accountDetail.html'><a><i class=\"icon-Notes\"></i><span>交易记录</span></a></li>",
            "<li id=\"message\" data-href=\"/pc/userCenter/privateMsg.html\"><a><i class=\"icon-acc\"></i><span>消息中心</span></a></li>",
            "<li id=\"profitLoss\" data-href='/pc/userCenter/profitLoss.html'><a><i class=\"icon-ALARM\"></i><span>今日盈亏</span></a></li>",
            // "<li id=\"agentCenter\" data-href='/pc/userCenter/manageinvite.html'><a><i class=\"icon-3\"></i><span>代理中心</span></a></li>",
            // '<li id="customerService" data-href="/pc/userCenter/customerService.html"><a><i class=\"icon-users\"></i><span>客服中心</span></a></li>',
        ];
        leftHtml_arr.push("<li id=\"washCode\" data-href='/pc/userCenter/washCode.html'><a><i class=\"iconfonty icon-yue\"></i><span>洗码</span></a></li>");
        var userType = _user_.userRole;
        if ((_user_.openChess || sessionStorage.getItem('openChess') == "true") && sessionStorage.getItem('checkTransferAllStatus') != "open") {
            leftHtml_arr.push('<li id="amountConver" data-href="/pc/userCenter/amountConver.html"><a target=\"_blank\"><i class=\"icon-3\"></i><span>额度转换</span></a></li>')
        }
        if (parseInt(userType) == 1) {
            leftHtml_arr.push("<li id=\"agentCenter\" data-href='/pc/userCenter/manageinvite.html'><a><i class=\"icon-3\"></i><span>代理中心</span></a></li>");
        } else {
            // leftHtml_arr.push("<li id=\"agentPlay\" data-href=\"/pc/userCenter/agentAply.html\"><a><i class=\"icon-link\"></i><span>申请代理</span></a></li>");
        }
        // leftHtml_arr.push("<li id=\"yuEBao\" data-href='/pc/userCenter/yuEBao.html'><a><i class=\"iconfonty icon-yue\"></i><span>余额宝</span></a></li>");
        $("#menu").html(leftHtml_arr.join(""));
        setInterval(function(){//倒计时
            var new_timestamp =  parseInt($("#current_time").data("timestamp"))+1000;
            $("#current_time").data("timestamp",new_timestamp );
            var date = new Date(new_timestamp).chinese();
            var dateStr = date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):("0"+(date.getMonth()+1)))+"-"+(date.getDate()>=10?date.getDate():("0"+date.getDate()))+" "+(date.getHours()>=10?date.getHours():("0"+date.getHours()))+":"+(date.getMinutes()>=10?date.getMinutes():("0"+date.getMinutes()))+":"+(date.getSeconds()>=10?date.getSeconds():("0"+date.getSeconds()));
            $("#current_time").html("<i></i>北京时间："+dateStr);
        },1000);
        //左边树样式，使得当前行高亮
        if( _leftMenu && _leftMenu.treeName ) {
            $("#"+_leftMenu.treeName).addClass("current");
        }
    })();

    // 请求客服方式
    // (function getServiceMethod() {
    //   webStorageTool.getSystemConfigData(function (serviceUrl) {
    //     $('#customerService').find('a').attr('href',serviceUrl);
    //     $('.pay-online-btn').attr('href',serviceUrl);
    //   },function (msg) {
    //     $("#customerService").bind("click",function(){
    //       _alert(msg);
    //     });
    //   });
    // })();
    //给左边菜单绑定点击事件
    (function event_bind(){
        var arr = ["index","bindBank","accountInfo","jiaoyi","deposit","qukuan","message","profitLoss","amountConver","yuEBao","customerService","agentCenter","washCode"];
        var userType = _user_.userRole;
        if ( parseInt(userType) ) {
            arr = arr.concat(["spread","agentMgr","totalAccount","agentReport"]);
        } else {
            arr = arr.concat(["agentPlay"]);
        }
        console.log('进入点击事件');
        for ( var q = 0 ; q < arr.length; q++ ) {
            $("#" + arr[q]).bind("click",function(){
                if( $(this).data("href") ) {
                    __openWin("user_center",$(this).data("href"));
                }
            });
        }
    })();

    //初始页面内容的高度
    window.initContentHeight = function(right_selector ) {
        $("#h2").css("height","auto");
        var menu_h = $("#menu").height();
        var right_h = $(right_selector).height();
        var min_height = $(window).height() - $("body>div>#header").height() ;
        if( menu_h > right_h ) {
            if ( menu_h > min_height ) {
                min_height = menu_h;
            }
        } else {
            if ( right_h > min_height ) {
                min_height = right_h + 10;
            }
        }
        var static_height = 430;
        if ( min_height < static_height ) {
            min_height = static_height;
        }
        $("#h2").css("height",min_height);
    };
    initContentHeight(".right-div");
});

/**
 * 用于计算两个数的加法（包括带小数的浮点）
 * @demo  Math_add( 0.003 ,0.2005 )   //return 0.2035
 * @return // 0.2035
 */
var  Math_add = function (a, b) {
    var length_a = 0,length_b = 0,length = 0,a = a,b = b;
    if ( a.toString().indexOf(".") >= 0 ) {
        length_a = a.toString().split(".")[1].length;
        a = a.toString().split(".")[0]+""+a.toString().split(".")[1];
    }
    if ( b.toString().indexOf(".") >= 0  ) {
        length_b = b.toString().split(".")[1].length ;
        b = b.toString().split(".")[0]+""+b.toString().split(".")[1];
    }
    if ( length_b > length_a ) {
        a = parseInt(a)*Math.pow(10,length_b-length_a);
        b = parseInt(b);
        length = length_b;
    } else {
        b = parseInt(b)*Math.pow(10,length_a-length_b);
        a = parseInt(a);
        length = length_a;
    }
    return (a+b)/Math.pow(10,length);
};

//定时刷新用户是否登录超时
try {
    setInterval(function() {
        Utils.request('passport/check_status.do',{},function (data) {
            if (data.code == 0) {
                UserTool.saveUserInfo(data.data);
            } else if ( data.code >= 300 && data.code < 400 ) {
                _alert("您已退出登录或登录超时",function () {
                    localStorage.removeItem('pv');
                    localStorage.removeItem('user');
                    window.close();
                    if(window.opener && !window.opener.closed) {
                        window.opener.location.href = window.opener.location.href;
                    }
                });
            }
        });
    }, 12000);
} catch(e){ console.log(e); }

//下面是解决 placeholder 兼容性问题：
function _bug_placeholder( parent_selector_str ) {
    try {
        var selector_str = parent_selector_str + " input[placeholder]";
        if( !$(selector_str) && $(selector_str).length == 0 ) {
            return;
        }
        if( !('placeholder' in document.createElement('input')) ) {
            $(selector_str).each(function() {
                var that = $(this),
                    text = that.attr('placeholder');
                if(that.val() === "") {
                    that.val(text).addClass('_bug_placeholder');
                }
                $(that).bind("focus",function() {
                    if( $(this).val() === text) {
                        $(this).val("").removeClass('_bug_placeholder');
                    }
                }).bind("blur",function() {
                    if($(this).val() === "") {
                        $(this).val(text).addClass('_bug_placeholder');
                    }
                });
            });
        }
    }catch(e){
        console.log(e);
    }
}
//将需要复制的内容放入黏贴板里，参数copyStr，是要复制的内容
function _copy(str,idinput) {
    var apdDom = idinput ? $(idinput) : $("body");
    function beforeCopy(copyStr) {
        if( typeof(copyStr) == "number" ) {
            copyStr = copyStr+"";
        }
        if( typeof(copyStr) != "string" ) {
            _alert("复制参数错误");
            return;
        }
        try {
            //创建选择区域
            var jDom = $("#__copy_temp_data").length > 0 ? $("#__copy_temp_data"):$("<input id='__copy_temp_data' style='position:absolute;top:0;left:0;z-index:-50;opacity:0;border:0;' readonly>");
            apdDom.append(jDom);
            jDom.val(copyStr);
            var strLen = copyStr.length;
            //创建选择区域
            if(jDom.get(0).createTextRange) {//IE浏览器
                var range = jDom.get(0).createTextRange();
                range.moveStart("character", 0);
                range.moveEnd("character",strLen);
                range.select();
            } else {//非IE浏览器
                jDom.get(0).setSelectionRange(0,strLen);
                jDom.get(0).focus();
            }
            return true;
        }
        catch(e) {//不支持h5黏贴 或 不支持选中功能
            return false;
        }
    }
    var res = beforeCopy( str );
    var isOk = false;
    if( res ) {//支持h5
        var isCopyOk = document.execCommand('copy');//h5复制成功
        if(isCopyOk) {
            isOk = true;
        }
    }
    if(!isOk) {
        _alert("当前浏览器版本过低，复制失败，建议使用谷歌浏览器");
    } else {
        _alert("复制成功");
    }
    $("#__copy_temp_data").remove();
}
