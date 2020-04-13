window.verify = {
    username : /^[a-zA-Z0-9]{4,16}$/,
    passwd : /^[a-zA-Z0-9_]{6,12}$/ ,
    qq : /^[1-9][0-9]{5,11}$/ ,
    email : /^([.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/ ,
    tel : /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/
};

selOptions = {
  "0": "realName",
  "1": "qq",
  "2": "phone",
  "3": "email",
  "4": "wechat",
  "5": "invite"
};
selOptionsPlaceholder = {
  "realName": "真实姓名为2-15个汉字",
  "qq": "qq为5-13个数字",
  "phone": "手机号为11位数字",
  "email": "",
  "wechat": "",
  "invite": ""
};

//重置验证码图片
function getValidate(){
    Utils.request('passport/validate_image.do', {}, function (data) {
        console.log(data)
        if(data.code == 0) {
          $("#v_container_sub").attr('src', data.data);
        } else {
          _alert(data.msg);
        }
      })
}

function newVerify() {
    var parentSelector = "#reg_form_1";
    window.verifyCodeSub = new GVerify("v_container_sub");
    getValidate();
        
}
function refreshVerify() {
    verifyCodeSub.refresh();
    getValidate();
}

//验证码绑定事件
$(function(){
    var parentSelector = "#reg_form_1";
    $(parentSelector+" [name=\"verify\"]").click(function() {
        if( $(parentSelector+" [name=\"div_top_click\"]").css("display") == "none" ) {
            return;
        }
        // newVerify();
        $(parentSelector+" [name=\"div_top_click\"]").hide();
        try{if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}}catch(e){}
    }).focus(function() {
        try{if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}}catch(e){}
    });
    $(parentSelector+" [name=\"div_top_click\"]").click(function() {
        if( $(parentSelector+" [name=\"div_top_click\"]").css("display") == "none" )
        {
            return;
        }
        refreshVerify();
        $(parentSelector+" [name=\"verify\"]").trigger("focus");
        $(parentSelector+" [name=\"div_top_click\"]").hide();
    });
    $(parentSelector+" [name=\"login_img\"],"+parentSelector+" [name=\"btn_refresh\"]").click(function() {
        $(parentSelector+" [name=verify]").focus();
    });

    // 首次显示验证码
    newVerify();
    $(parentSelector+" [name=\"div_top_click\"]").hide();
});

// function trimSpace(value) {
//     return value.replace(/ /g,'')
// }

//注册配置选项
$(function(){

  $('.mustOptions').hide();
  $('.selOptions').html('');

  Utils.request('agent/generalize/register_options.do',{},function (data) {
    if (data.code != 0) {
      _alert(data.msg);
      return;
    }
    $('.mustOptions').show();
    //取出其中要显示的部分
    var list = data.data;
    var showNum = 0;
    var selOptionsStr = '';
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var type = item.type;
      var selName = selOptions[type];
      var parentSelector = "#reg_form_1";
      if (selName) {
        if (item.show) {
        showNum++;
        var star = (item.required)?'<span class="red">* </span>':'';
        selOptionsStr += '<li>'+
                            '<div class="info-left">'+star+''+item.name+'：</div>'+
                            '<div class="info-right">'+
                            // onkeyup="value=value.replace(/[^\d]/g,'')"
                            '<input id="'+ selName +'" name="'+selName+'" class="reg-int" type="text" placeholder="'+(item.remark ? item.remark : '请输入'+item.name)+'">'+
                            '</div>'+
                            '<div class="info-txt" id="_tips">'+selOptionsPlaceholder[selName]+'</div>'+
                        '</li>';
        //   if (showNum == 2) {
        //     break ;
        //   }
        }

        // $("#invite").bind("input propertychange",function(event){
        //     console.log($("#input1").val())
        // });

      }
    }
    // console.log(selOptionsStr)
    $('.selOptions').html(selOptionsStr);
    $("#invite").attr('maxlength', 8)
    // console.log(theRequest)
    var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
    // console.log(ins == '')
    if (ins) {
        $('[name=\"invite\"]').val(ins)
            .attr('disabled', true)
            .addClass('input-disable')
    }
    // if (sessionStorage.getItem('c')) {
    //     var __code = sessionStorage.getItem('c')
    //     $('[name=\"invite\"]').val(__code)
    //         .attr('disabled', true)
    //         .addClass('input-disable')
    // }
  });
  var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
        // console.log(ins == '')
        if (ins) {
            $('[name=\"invite\"]').val(ins)
                .attr('disabled', true)
                .addClass('input-disable')
        }
  setTimeout(function(){
      var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
        // console.log(ins == '')
        if (ins) {
            $('[name=\"invite\"]').val(ins)
                .attr('disabled', true)
                .addClass('input-disable')
        }
  },3000)
  setTimeout(function(){
    var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
      // console.log(ins == '')
      if (ins) {
          $('[name=\"invite\"]').val(ins)
              .attr('disabled', true)
              .addClass('input-disable')
      }
},10000)
  
});

// function getQueryString(name) {
// 	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
// 	var r = window.location.search.substr(1).match(reg);
// 	if (r != null) return unescape(r[2]); return null;
// }

var checkSubmitFlg = false;

//提交 注册
function submitRegistr() {
    var parentSelector = "#reg_form_1";
    var username = $.trim($(parentSelector+"  [name=\"username\"]").val());
    var passwd = $.trim($(parentSelector+"  [name=\"passwd\"]").val());
    var conpasswd = $.trim($(parentSelector+"  [name=\"conpasswd\"]").val());
    // var referrerCode = $.trim($(parentSelector+"  [name=\"referrerCode\"]").val());
    var verify_val = $.trim($(parentSelector+"  [name=\"verify\"]").val());
    if (!Utils.isUsername(username)) {
        _alert("请输入正确格式的用户名");
        $(parentSelector+" [name=\"username\"]").trigger("focus");
        return false;
    }
    if (!Utils.isPassword(passwd)) {
        _alert("请输入正确格式的密码");
        $(parentSelector+" [name=\"passwd\"]").trigger("focus");
        return;
    }
    if( passwd != conpasswd ) {
        _alert("两次密码不一致");
        $(parentSelector+" [name=\"conpasswd\"]").trigger("focus");
        return;
    }

    var param = {
        account : username,
        password : passwd,
        verifyImg: verify_val
    };
    var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
    if (ins) {
        if (!/^\d{8,}$/.test(Number(ins))) {
            _alert("邀请码不小于8位纯数字");
            return
        }
        if (!+ins) {
            _alert("邀请码格式有误");
            return
        }
        param.referrer = ins
    }


    //如果存在真实姓名输入框
    if( $(parentSelector+"  [name=\"realName\"]").length != 0 ) {
        var _reg=/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,15}$/;
        var _isReg = $(parentSelector+"  [name=\"realName\"]").val();
        // console.log($(parentSelector+"  [name=\"realName\"]").val())
        if( $.trim($(parentSelector+"  [name=\"realName\"]").val())=="" &&  $(parentSelector+"  [name=\"realName\"]").parent().parent().find(" .red").length != 0  )
        {
            _alert("真实姓名不可为空");
            $(parentSelector+"  [name=\"realName\"]").trigger("focus");
            return;
        }
        // if (!_reg.test(_isReg)) {
        //     _alert("真实姓名格式有误");
        //     $(parentSelector+"  [name=\"realName\"]").trigger("focus");
        //     return
        // }
        // && !Utils.isRealName( $.trim($(parentSelector+"  [name=\"realName\"]").val()) )
        if( $.trim($(parentSelector+"  [name=\"realName\"]").val())!="" && !_reg.test(_isReg))
        {
            _alert("真实姓名格式有误");
            $(parentSelector+"  [name=\"realName\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"realName\"]").val()) )
        {
            param.realName = $.trim($(parentSelector+"  [name=\"realName\"]").val());
        }
    }
    //如果存在qq输入框
    if( $(parentSelector+"  [name=\"qq\"]").length != 0 ) {
        if( $.trim($(parentSelector+"  [name=\"qq\"]").val())=="" &&  $(parentSelector+"  [name=\"qq\"]").parent().parent().find(" .red").length != 0  )
        {
            _alert("qq号码不可为空");
            $(parentSelector+"  [name=\"qq\"]").trigger("focus");
            return;
        }
        if( $.trim($(parentSelector+"  [name=\"qq\"]").val())!="" && !Utils.isQQ( $.trim($(parentSelector+"  [name=\"qq\"]").val()) ) )
        {
            _alert("qq号格式有误");
            $(parentSelector+"  [name=\"qq\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"qq\"]").val()) )
        {
            param.qq = $.trim($(parentSelector+"  [name=\"qq\"]").val());
        }
    }
    //如果存在手机输入框
    if( $(parentSelector+"  [name=\"phone\"]").length != 0 ) {
        if( $.trim($(parentSelector+"  [name=\"phone\"]").val())=="" &&  $(parentSelector+"  [name=\"phone\"]").parent().parent().find(" .red").length != 0  )
        {
            _alert("手机号码不可为空");
            $(parentSelector+"  [name=\"phone\"]").trigger("focus");
            return;
        }
        if( $.trim($(parentSelector+"  [name=\"phone\"]").val())!="" && !Utils.isMobile( $.trim($(parentSelector+"  [name=\"phone\"]").val()) ) )
        {
            _alert("手机号码格式有误");
            $(parentSelector+"  [name=\"phone\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"phone\"]").val()) )
        {
            param.phone = $.trim($(parentSelector+"  [name=\"phone\"]").val());
        }
    }
    //如果存在email输入框
    if( $(parentSelector+"  [name=\"email\"]").length != 0 ) {
        if( $.trim($(parentSelector+"  [name=\"email\"]").val())=="" &&  $(parentSelector+"  [name=\"email\"]").parent().parent().find(" .red").length != 0  )
        {
            _alert("邮箱不可为空");
            $(parentSelector+"  [name=\"email\"]").trigger("focus");
            return;
        }
        if( $.trim($(parentSelector+"  [name=\"email\"]").val())!="" && !Utils.isEmail( $.trim($(parentSelector+"  [name=\"email\"]").val()) ) )
        {
            _alert("邮箱格式有误");
            $(parentSelector+"  [name=\"email\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"email\"]").val()) )
        {
            param.email = $.trim($(parentSelector+"  [name=\"email\"]").val());
        }
    }

    //如果存在wechat输入框
    if( $(parentSelector+"  [name=\"wechat\"]").length != 0 ) {
        if( $.trim($(parentSelector+"  [name=\"wechat\"]").val())=="" &&  $(parentSelector+"  [name=\"wechat\"]").parent().parent().find(" .red").length != 0  )
        {
            _alert("微信号不可为空");
            $(parentSelector+"  [name=\"wechat\"]").trigger("focus");
            return;
        }
        if( $.trim($(parentSelector+"  [name=\"wechat\"]").val())!="" && !Utils.isWechat( $.trim($(parentSelector+"  [name=\"wechat\"]").val()) ) )
        {
            _alert("微信号格式有误");
            $(parentSelector+"  [name=\"wechat\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"wechat\"]").val()) )
        {
            param.wechat = $.trim($(parentSelector+"  [name=\"wechat\"]").val());
        }
    }
    // 如果存在邀请码输入框
    if ($(parentSelector + " [name =\"invite\"]").length != 0) {
        if( $.trim($(parentSelector+"  [name=\"invite\"]").val())=="" &&  $(parentSelector+"  [name=\"invite\"]").parent().parent().find(" .red").length != 0  ){
            _alert("邀请码不能为空")
            $(parentSelector+"  [name=\"invite\"]").trigger("focus");
            return
        }
        if( $.trim($(parentSelector+"  [name=\"invite\"]").val())!="" && !Utils.isReferrer( $.trim($(parentSelector+"  [name=\"invite\"]").val()) ) ) {
            _alert("邀请码格式有误");
            $(parentSelector+"  [name=\"invite\"]").trigger("focus");
            return;
        }
        if( "" != $.trim($(parentSelector+"  [name=\"invite\"]").val()) )
        {
            param.referrer = $.trim($(parentSelector+"  [name=\"invite\"]").val());
        }
        if (!+$(parentSelector+"  [name=\"invite\"]").val() && $(parentSelector+"  [name=\"invite\"]").parent().parent().find(" .red").length != 0) {
            _alert("邀请码格式错误");
            return;
        }
        if (!/^\d{8,}$/.test($(parentSelector+"  [name=\"invite\"]").val()) && $(parentSelector+"  [name=\"invite\"]").parent().parent().find(" .red").length != 0) {
            _alert("邀请码不小于8位纯数字");
            return;
        }
    }
    // 邀请码
    // if (referrerCode === '') {
    //     _alert('邀请码不能为空!');
    //     return false
    // }
    // if (referrerCode != '' && !Utils.isReferrer(referrerCode)) {
    //   _alert('邀请码格式有误!');
    //   return false;
    // } else {
    //   if (referrerCode != '') {
    //     param.referrer = referrerCode;
    //   }
    // }

    if (verify_val == '') {
        _alert('验证码不能为空!');
        return false;
    }
    // var res = verifyCodeSub.validate(verify_val);
    // if (res) {

    // } else {
    //   _alert("验证码错误");
    //   return false;
    // }

    // if( !$(parentSelector+" [name=\"reg_checkbox\"]").get(0).checked ) {
    //     _alert("请同意服务协议");
    //     return;
    // }


    if(checkSubmitFlg ==true) {
        return;
    }


    // 请求sessionId
    Utils.removeStorage('sessionid');
    Utils.removeStorage('temporaryId');
    UserTool.delUserInfo();
    // console.log(param)
    Utils.requestNeedTint('passport/distribute_sessionid.do',{},function (data) {
        if (data.code != 0) {
          _alert('请求失败');
          return ;
        }

        if (data.data.sessionid != '' && data.data.sessionid != undefined) {
          Utils.saveStorage('sessionid',data.data.sessionid);
        }
        if (data.data.temporaryId != '' && data.data.temporaryId != undefined) {
          Utils.saveStorage('temporaryId', data.data.temporaryId);
        }

        Utils.request('passport/register.do',param,function (data) {
            if (data.code == 0) {
              regAjaxSuccess(data);//由于每个页面的逻辑有区别。所以regAjaxSuccess方法定义在每个php页面里面，并没有定义在当前的js文件中
            } else {
              _alert(data.msg);
            }
        });
    });
    checkSubmitFlg ==true;
}

$(function(){
    // 注册输入框的回车事件
    (function(){
        var parentSelector = "#reg_form_1";
        $(parentSelector).get(0).onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if( e.keyCode == 9 )
            {
                try{if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;}}catch(e){}
            }
            if (e && (e.keyCode == 13 || e.keyCode == 9 ) ) { // enter 键
                if ($.trim($(parentSelector+" [name=\"username\"]").val()) == '')
                {
                    $(parentSelector+" [name=\"username\"]").trigger("focus");
                    return;
                }
                if ($.trim($(parentSelector+" [name=\"passwd\"]").val()) == '')
                {
                    $(parentSelector+" [name=\"passwd\"]").trigger("focus");
                    return;
                }
                if ($.trim($(parentSelector+" [name=\"conpasswd\"]").val()) == '')
                {
                    $(parentSelector+" [name=\"conpasswd\"]").trigger("focus");
                    return;
                }
                 //如果存在qq输入框
			    if( $(parentSelector+"  #qq").length != 0 && $.trim($(parentSelector+" #qq").val()) == '' )
			    {
			    	$(parentSelector+" #qq").trigger("focus");
			    	if( $(parentSelector+"  #qq").parent().parent().find(" .red").length != 0  )
			    	{//如果是必填
			    	 	return;
			    	}
			    	else
			    	{//如果是非必填项
			    	 	 var dom = e.target || e.srcElement ;
			    	 	if( dom != $(parentSelector+"  #qq").get(0) && ( dom != $(parentSelector+"  #email").get(0) && dom != $(parentSelector+"  #tel").get(0) && dom != $(parentSelector+"  #verify").get(0) ) )
			    	 	{//如果鼠标不在当前的输入框内（前一个输入框）
			    	 	   return;
			    	 	}
			    	}
			    	 //如果鼠标在当前的输入框内(则什么都不执行，不用return，就保证继续下面的逻辑)
			    }
                //如果存在email输入框
			    if( $(parentSelector+"  #email").length != 0 && $.trim($(parentSelector+" #email").val()) == '' )
			    {
			    	$(parentSelector+" #email").trigger("focus");
			    	if( $(parentSelector+"  #email").parent().parent().find(" .red").length != 0  )
			    	{//如果是必填
			    	 	return;
			    	}
			    	else
			    	{//如果是非必填项
			    	 	var dom = e.target || e.srcElement ;
			    	 	if( dom != $(parentSelector+"  #email").get(0)  && (dom != $(parentSelector+"  #tel").get(0) && dom != $(parentSelector+"  #verify").get(0) ) )
			    	 	{//如果鼠标不在当前的输入框内（前一个输入框）
			    	 	   return;
			    	 	}
			    	}
			    	 //如果鼠标在当前的输入框内(则什么都不执行，不用return，就保证继续下面的逻辑)
			    }
                //如果存在tel输入框
			    if( $(parentSelector+"  #tel").length != 0 && $.trim($(parentSelector+" #tel").val()) == '' )
			    {
			    	$(parentSelector+" #tel").trigger("focus");
			    	if( $(parentSelector+"  #tel").parent().parent().find(" .red").length != 0  )
			    	{//如果是必填
			    	 	return;
			    	}
			    	else
			    	{//如果是非必填项
			    	 	var dom = e.target || e.srcElement ;
			    	 	if( dom != $(parentSelector+"  #tel").get(0) && dom != $(parentSelector+"  #verify").get(0) )
			    	 	{//如果鼠标不在当前的输入框内（前一个输入框）
			    	 	   return;
			    	 	}
			    	}//如果鼠标在当前的输入框内(则什么都不执行，不用return，就保证继续下面的逻辑)
			    }

                if ( $(parentSelector+" [name=div_top_click]").length > 0 && ( $(parentSelector+" [name=div_top_click]").css("display")=="block"||$(parentSelector+" [name=div_top_click]").css("display")!="none"))
                {
                    $(parentSelector+" [name=\"div_top_click\"]").trigger("click");
                    return;
                }
                if ($.trim($(parentSelector+" [name=\"verify\"]").val()) == '')
                {
                    $(parentSelector+" [name=\"verify\"]").trigger("focus");
                    return;
                }
                //如果存在qq输入框，且是必填项
                if( $(parentSelector+" #qq").length != 0 &&  $(parentSelector+" #qq").parent().parent().find(" .red").length != 0)
                {
                    if ($.trim($(parentSelector+" #qq").val()) == '') {
                        $(parentSelector+" #qq").trigger("focus");
                        return;
                    }
                }
                //如果存在email输入框，且是必填项
                if( $(parentSelector+" #email").length != 0 &&  $(parentSelector+" #email").parent().parent().find(" .red").length != 0  )
                {
                    if ($.trim($(parentSelector+" #email").val()) == '') {
                        $(parentSelector+" #email").trigger("focus");
                        return;
                    }
                }
                //如果存在手机输入框，且是必填项
                if( $(parentSelector+" #tel").length != 0 &&  $(parentSelector+" #tel").parent().parent().find(" .red").length != 0  )
                {
                    if ($.trim($(parentSelector+" #tel").val()) == '') {
                        $(parentSelector+" #tel").trigger("focus");
                        return;
                    }
                }
                //验证码
                if ($.trim($(parentSelector+" [name=\"verify\"]").val()) == '') {
                    $(parentSelector+" [name=\"verify\"]").trigger("focus");
                    return;
                }
                if( !$(" [name=\"reg_checkbox\"]").get(0).checked )
                {
                    _alert("请同意服务协议");
                    return;
                }
                submitRegistr();
            }
        };
    })();
});

$(function(){
    setTimeout(function() {
        var ins = window.location.href.match(/[?|&]c=([0-9]*)/) ? window.location.href.match(/[?|&]c\=([0-9]*)/)[1] : null
        // console.log(ins == '')
        if (ins) {
            $('[name=\"invite\"]').val(ins)
                .attr('disabled', true)
                .addClass('input-disable')
        }
      },1000);
})
