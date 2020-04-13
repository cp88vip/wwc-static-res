//重置验证码图片
function newVerify(nofocus) {
    var parentSelector = "#_form_login";
    window.verifyCodeSub = new GVerify("v_container_sub");
}
//刷新验证码图片
function refreshVerify() {
    verifyCodeSub.refresh();
}

function doLogin() {
    var parentSelector = "#_form_login";
    var username_login = $.trim($('#username_login').val());
    var passwd_login = $.trim($('#passwd_login').val());
    var authnum_login = $.trim($(parentSelector+' input[name=authnum_sub]').val());
    if ( username_login == '') {
        _alert('用户名不能为空!');
        return false;
    }
    if ( passwd_login == '') {
        _alert('密码不能为空!');
        return false;
    }
    if (authnum_login == '') {
        _alert('验证码不能为空!');
        return false;
    }

    var res = verifyCodeSub.validate(authnum_login);
    if (res) {
        // _alert("验证正确");
    } else {
      _alert("验证码错误");
      return false;
    }

    var param = {
        account : username_login,
        password : passwd_login
    };

    // 请求sessionId
    Utils.removeStorage('sessionid');
    Utils.removeStorage('temporaryId');
    UserTool.delUserInfo();
    Utils.requestNeedTint('passport/distribute_sessionid.do',{},function (data) {
        if (data.code != 0) {
          _alert('请求失败');
          return ;
        }
        if (data.data.sessionid != '' && data.data.sessionid != undefined) {
          Utils.saveStorage('sessionid', data.data.sessionid);
        }
        if (data.data.temporaryId != '' && data.data.temporaryId != undefined) {
          Utils.saveStorage('temporaryId', data.data.temporaryId);
        }
        // 登录
        Utils.requestNeedTint('passport/login.do',param,function (data) {
          $("#btn_login").attr("disabled", false);
          if (data.code == 0) {
            UserTool.saveUserInfo(data.data);
            //登陆成功
            _alert("登录成功",function(){
              __openWin('home','/pc/index.html');
            });
          } else {
            //登陆错误
            window.verifyCode = new GVerify("v_container", true);
            _alert( data.msg );
            refreshVerify();
          }
        },function (message) {
          $("#btn_login").attr("disabled", false);
        });
    },function (message) {
        $("#btn_login").attr("disabled", false);
    });
}

$(function(){
    //下面是绑定事件
    var parentSelector = "#_form_login";
    //获取新的验证码
    $(parentSelector+ ' [name=login_img]').on("click",function(){
        refreshVerify();
    });
    //按钮 - 提交登录
    $(parentSelector+ " #btn-sub").on("click",function(){
        doLogin();
    });
    //验证码输入框
    $(parentSelector+" input[name=\"authnum_sub\"]").bind("focus",function(){
        if($(this).val()=="")
        {
            // newVerify(true); // 注意这里一定要给参数 true ，否则会出现 事件 无限递归 的触发
        }
        try{if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}}catch(e){}
        $(parentSelector+" [name=yzm_img_div]").show();
        $(parentSelector+" [name=tip_yzm_img]").hide();
    });
    //重置按钮
/*    $("#btn_clean").bind("click",function(){
        $('#username_login').val("");
        $('#passwd_login').val("");
        newVerify();
    });*/

    //回车事件
    $(parentSelector).get(0).onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if( e.keyCode == 9 )
        {
            try{if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;}}catch(e){}
        }
        if(e && (e.keyCode == 13 || e.keyCode == 9 )){ // enter 键
            var username_login = $.trim($('#username_login').val());
            var passwd_login = $.trim($('#passwd_login').val());
            var authnum_login = $.trim($(parentSelector+' input[name=authnum_sub]').val());
            if ( username_login == '') {
                $('#username_login').focus();
                return;
            }
            if ( passwd_login == '') {
                $('#passwd_login').focus();
                return;
            }
            if ( authnum_login == '') {
                // $(parentSelector+' input[name=authnum_sub]').click();
                $(".need_captcha").click();
                return;
            }
            doLogin();
        }
    };
   // 首次出现验证码
   newVerify();
   $(parentSelector+" [name=yzm_img_div]").show();
   $(parentSelector+" [name=tip_yzm_img]").hide();
});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}
