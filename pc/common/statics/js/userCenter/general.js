window._value = {
    wechat:{},   //用于保存微信支付数据
    alipay:{},     //用于保存支付宝支付数据
    bank:{},    //用于保存银行入款返回的 data对象
    quiky:{},
    currentItem:null,
    currentLayerIndex: 0,
    bankSelList : {}
};

window.init_event = {
    // 获取充值方式列表
    getPayMethodList:function (userId) {
        var param = {userId:userId,platform:'WEB',version:'3.2.0'};
        $('.loading').show();
        $('.play-wrap').hide();
        Utils.requestNeedTint('front/recharge/get_list.do',param,function(result){
            $('.loading').hide();
            if (result['code'] != 0) {
              _alert(result.msg);
              return;
            }
            $('.play-wrap').show();
            var data = result['data'];
            init_event.setPayMethodView(data);
        },function () {
            $('.loading').hide();
        });
    },
    // 充值方式列表
    setPayMethodView:function (methodList) {
      $('.pay-top_1').html('');
      var methodStr = '';
      for (var i = 0; i < methodList.length; i++) {
        var item = methodList[i],method = '';
        if (item.type == 'ONLINE_RECHARGE') {
          if (item.title.match('微信')) {
            method = 'weChatDeposit_1';
            methodStr += '<a>'+item.title+'</a>';
          }else if (item.title.match('支付宝')) {
            method = 'baoDeposit_1';
            methodStr += '<a>'+item.title+'</a>';
          }else {
            method = 'quikyDeposit_1';
            methodStr += '<a>'+item.title+'</a>';
          }
        }else if (item.type == 'bank') {
            method = 'bankDeposit';
            methodStr += '<a data-func="'+method+'">'+item.title+'</a>';
        }
      }
      $('.pay-top_1').html(methodStr);
      //充值方式列表切换
      init_event.page();
      $('.pay-top_1 a:first-child').trigger("click");
      //填充支付列表
      init_event.getPayList(methodList);
    },
    // 填充支付列表
    getPayList:function (methodList) {
      for (var i = 0; i < methodList.length; i++) {
        var item = methodList[i],payList = item.payways;
        init_event.setSelMoneyList('wechat_moneyList');
        if (item.type == 'bank') {
          init_event.setBankListView(payList);
          _value.bank.Records = payList;
        }else if (item.type == 'ONLINE_RECHARGE') {
          if (item.title.match('微信') || item.title.match('QQ')) {
            init_event.setTencentListView(payList);
            _value.wechat.Records = payList;
          }else if (item.title.match('支付宝')) {
            init_event.setAlipayListView(payList);
            _value.alipay.Records = payList;
          }else {
            init_event.setQuikyListView(payList);
            _value.alipay.quiky = payList;
          }
        }
      }
    },
    // 维护cell
    getMaintainCell:function () {
      return  '<div class="maintain_div">'+
                  '<img src="/pc/common/statics/img/userCenter/pay_maintain.png">'+
                  '<div class="right_part">'+
                    '<div class="right_title">支付通道维护中</div>'+
                    '<div class="right_subtitle text-gray">请选择其它入款方式</div>'+
                  '</div>'+
                '</div>';
    },
    // 微信/QQ/支付宝支付cell
    getTencentCell:function (item,i) {
      var image = item.icon;
      var moneyRange = '金额范围:'+Utils.toDecimal2(item.min_amount)+'-'+Utils.toDecimal2(item.max_amount);
      var jsonStr = JSON.stringify(item);
      jsonStr = encodeURI(jsonStr);
      var htmlStr = '<div>'+
                      '<a href="javascript:init_event.jumpToThirdPay('+jsonStr+');" class="list">'+
                        '<img src="'+image+'">'+
                        '<div class="textPart">'+
                          '<div class="list-title">'+item.third_name+'</div>'+
                          '<div class="list-subtitle text-gray">'+moneyRange+'</div>'+
                        '</div>'+
                        '<img class="arrowRight" src="/pc/common/statics/img/userCenter/arrow_right.png">'+
                      '</a>'+
                    '</div>';
      return htmlStr;
    },
    // 银行cell
    getBankCell:function (item,i) {
      var moneyRange = Utils.toDecimal2(item.minAmount)+'-'+Utils.toDecimal2(item.maxAmount);
      var htmlStr = '<div class="bank-mess">'+
                      '<ul style="width: 90%;display: inline-block;" onClick="init_event.jumpToBankPay('+i+');">'+
                          '<li style="margin: 7px;"><span class="bold">收款人：</span>'+item.receiveName+'</li>'+
                          '<li style="margin: 7px;"><span class="bold">银行：</span>'+item.receiveBank+'（'+item.bankAddress+'）</li>'+
                          '<li style="margin: 7px;"><span class="bold">帐号：</span>'+item.bankAccount+'</li>'+
                          '<li style="margin: 7px;color: #a1a1a1;"><span class="bold">金额范围：</span>'+moneyRange+'</li>'+
                      '</ul>'+
                      '<img style="float:right;margin-top:43px;width:20px;margin-right:10px;" src="/pc/common/statics/img/userCenter/arrow_right.png">'+
                    '</div>';
      return htmlStr;
    },
    // 添加充值金额列表
    setSelMoneyList:function functionName(selector_str) {
      var selList = '<div class="rechargeList">'+
                      '<div class="rechargeInput">'+
                        '<span>请输入充值金额:</span>'+
                        '<input class="rechargeMoney" name="account" maxlength="10" type="text" onkeyup="Utils.clearNoNum(this)" value="" placeholder="">'+
                        '<span>元</span>'+
                      '</div>'+
                      '<div class="chargeMoneyList">'+
                        '<ul class="list">'+
                          '<li class="moneyList"><span class="">50元</span></li>'+
                          '<li class="moneyList"><span class="">100元</span></li>'+
                          '<li class="moneyList"><span class="">300元</span></li>'+
                          '<li class="moneyList"><span class="">500元</span></li>'+
                        '</ul>'+
                        '<ul class="list">'+
                          '<li class="moneyList"><span class="">800元</span></li>'+
                          '<li class="moneyList"><span class="">1000元</span></li>'+
                          '<li class="moneyList"><span class="">2000元</span></li>'+
                          '<li class="moneyList"><span class="">3000元</span></li>'+
                        '</ul>'+
                      '</div>'+
                    '</div>';
      $('.'+selector_str).html(selList);
      //点击选择充值金额列表
      $('.chargeMoneyList .list li span').on({
        click:function() {
            //清除所有span节点的class
            $('.chargeMoneyList .list li span').removeClass();
            //给当前点击的span节点添加class
            $(this).addClass('clickli');
            //显示金额
            var money =$(this).html();
            money = money.replace(/[^0-9]/ig,"");
            $('.rechargeMoney').val(Utils.toDecimal2(money));
        }
      });
    },
    setTencentListView:function (tencentList) {
      var htmlStr = '';
      if (tencentList.length == 0) {
        htmlStr = init_event.getMaintainCell();
      }else {
        for (var i = 0; i < tencentList.length; i++) {
          var item =  tencentList[i];
          htmlStr += init_event.getTencentCell(item,i);
        }
      }
      $("#wechat_step1 .wechat-one").html(htmlStr);
    },
    setAlipayListView:function (alipayList) {
      var htmlStr = '';
      if (alipayList.length == 0) {
        htmlStr = init_event.getMaintainCell();
      }else {
        for (var i = 0; i < alipayList.length; i++) {
            var item =  alipayList[i];
            htmlStr += init_event.getTencentCell(item,i);
        }
      }
      $("#bao_step1 .wechat-one").html(htmlStr);
    },
    setBankListView:function (bankList) {
      var htmlStr = '';
      if (bankList.length == 0) {
        htmlStr = init_event.getMaintainCell();
      }else {
        for (var i = 0; i < bankList.length; i++) {
          var item =  bankList[i];
          if (item.hasOwnProperty('bankAccount')) {
              htmlStr += init_event.getBankCell(item,i);
          } else {
              htmlStr += init_event.getTencentCell(item,i);
          }
        }
      }
      $("#bankDeposit_div #bank_list").html(htmlStr);
    },
    setQuikyListView:function (quikyList) {
      var htmlStr = '';
      if (quikyList.length == 0) {
        htmlStr = init_event.getMaintainCell();
      }else {
        for (var i = 0; i < quikyList.length; i++) {
            var item =  quikyList[i];
            htmlStr += init_event.getTencentCell(item,i);
          }
      }
      $("#quiky_step1 .wechat-one").html(htmlStr);
    },
    // 进行第三方支付
    jumpToThirdPay : function (jsonStr) {
        var item = jsonStr,
            money = init_event.judgeMaxMineMoney(item);
            layer.load(2);
        if (money == "" || money.length == 0) {
          layer.closeAll();
          return ;
        }
        $('#third-html').attr('src','');
        _value.currentItem = item;
        if (item.gwRedirectUrl) {
            Utils.request('front/recharge/third_bank_list.do',{"third_code":item.third_code,"third_mode":item.third_mode},function (data) {
                layer.closeAll();
                if (data.code != 0) {
                    layer.msg(data.msg);
                    return ;
                }
                var list = data.data,mes = '<div class="bankIconDiv">';
                _value.bankSelList = list;
                var width = $(window).width() * 0.85 * 0.25;
                var index = 0;
                for (var key in list) {
                    var ulStr = (index % 4 == 0) ? '<ul class="bankIcons">' : '';
                    if (list.hasOwnProperty(key)) {
                        index ++;
                        ulStr += '<li class="bankIconList" style="width:'+width+'" onClick="javascript:init_event.clickBankIcon('+index+');">'+list[key]+'</li>';
                    }
                    ulStr += (index % 4 == 0) ? '</ul>' : '';
                    mes += ulStr;
                }
                mes += '</div>';
                //弹出银行卡选择
                currentLayerIndex = layer.open({
                    type: 1,
                    title : '选择银行:',
                    skin: 'layui-layer-demo',
                    closeBtn: 1,
                    anim: 2,
                    shadeClose: false, //开启遮罩关闭
                    area: ['85%', '70%'],
                    content: mes
                    });
            },function (error) {
                layer.closeAll();
                layer.msg(data.msg);
            });
        } else {
            init_event.requestThirdPay(item);
        }
    },
    // 选择银行卡
    clickBankIcon: function (currentIndex) {
      layer.closeAll();
      var index = 0;
      for (var key in _value.bankSelList) {
          if (_value.bankSelList.hasOwnProperty(key)) {
              index ++;
              if (index == currentIndex) {
                _value.currentItem.third_mode = key;
                init_event.requestThirdPay(_value.currentItem);
                break;
              }
          }
      }
    },
    requestThirdPay: function (item) {
      var index = layer.load(2);
      var money = init_event.judgeMaxMineMoney(item);
       if(money){
           // 进入加载网页
           Utils.request('front/recharge/third.do',{
               amount:money,
               third_code:item.third_code,
               third_mode:item.third_mode,
               third_id:item.id,
           },function(result){
               layer.close(index);
               if (result['code'] == 0) {
                    // 如果是后台返回的要重新打开新页面的，根据标注进行跳转
                    if (result.data.indexOf('isSame') > -1 && result.data.split('isSame')[1].indexOf('false') > -1) {
                        // window.open(result.data);
                        window.location.href = result.data;
                        return false;
                    }
                    $('.bgPop,.pop').show();
                    $('.payLoading').show();
                    $('.intercept').show();
                    $('#third-html').attr('src',result.data);
                    var iframe = document.getElementById('third-html');
                	if (iframe.attachEvent){
                	    iframe.attachEvent("onload", function(){
                          $('.payLoading').hide();
                          $('.intercept').hide();
                	    });
                	} else {
                	    iframe.onload = function(){
                	        $('.payLoading').hide();
                          $('.intercept').hide();
                	    };
                	}
               } else {
                   _alert(result.msg);
               }
               setTimeout(function(){
                   layer.close(index);
               }, 2500);
           },function () {
              layer.close(index);
           },true);

       } else {
           layer.close(index);
       }
    },
    // 判断最大值与最小值
    judgeMaxMineMoney: function (item) {
      var selMoney = $('.rechargeMoney').val();
      if (selMoney == '') {
        _alert('请输入充值金额');
        return '';
      }else{
        // selMoney = selMoney.split('.')[0];
        if (parseFloat(selMoney) < Utils.toDecimal2(item.min_amount) || parseFloat(selMoney) > Utils.toDecimal2(item.max_amount)) {
            var str = "充值金额范围:"+Utils.toDecimal2(item.min_amount)+'-'+Utils.toDecimal2(item.max_amount)+'元';
            _alert(str);
            return '';
        }
      }
      return Utils.toDecimal2(selMoney);
    },
    page:function(){
        // 支付方式 选项卡
        $('.pay-top_1 a').click(function(){
            $('.pay-top_1 a').removeClass();
            $('.wechat_moneyList').show();
            $(this).addClass('current')
            $('.deposit-info').find('.pay-info').hide();
            $('.deposit-info').find('.pay-info').eq( $(this).index() ).show().css("display","block");
        });
    },
    // 银行支付
    jumpToBankPay : function (index) {
        var item = _value.bank.Records[index];
        var selMoney = $('.rechargeMoney').val();
        if (selMoney == '') {
          _alert('请输入充值金额');
          return ;
        }
        // selMoney = selMoney.split('.')[0];
        if (parseFloat(selMoney) < Utils.toDecimal2(item.minAmount) || parseFloat(selMoney) > Utils.toDecimal2(item.maxAmount)) {
            var str = "充值金额范围:" + Utils.toDecimal2(item.minAmount) + '-' + Utils.toDecimal2(item.maxAmount) + '元';
            _alert(str);
            return ;
        }

        $('.play-wrap').hide();
        $('#bankDeposit_div_2').show();
        $('#div_2_1').show();
        _value.bank.amount = Utils.toDecimal2(selMoney);
        init_event.bindBankDiv2(item);
    },
    //银行入款第2步，绑定事件
    bindBankDiv2:function(item) {
        var div_id = "div_2_1";
        (function initDate(){
            $( "#"+div_id+" input[name=\"amount\"]").val( _value.bank.amount );
            $( "#"+div_id+" input[name=\"userName\"]").val();

            $( "#"+div_id+" [name=\"sReceiverAddr\"]").text( item["bankAddress"] );
            $( "#"+div_id+" [name=\"sReceiverName\"]").text( item["receiveName"] );
            $( "#"+div_id+" [name=\"bankName\"]").text( item["receiveBank"] );
            $( "#"+div_id+" [name=\"sReceiverAccount\"]").text( item["bankAccount"] );
            //绑定时间控件
            //给日期控件赋上默认值
            function getDateStr( time ) {
                var date = new Date(parseInt(time)).chinese();
                return  date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):("0"+(date.getMonth()+1)))+"-"+(date.getDate()>=10?date.getDate():("0"+date.getDate()));
            }
            $("#"+div_id+"  .bt_time").val(getDateStr($("#current_time").data("timestamp")));
            $("#"+div_id+"  .bt_time").datepicker({
                dateFormat:'yy-mm-dd',
                onSelect: function( startDate ) {

                }
            }); //绑定输入框
        })();
        if( $("#"+div_id).data("initevent") == "true" ) {
            return;
        }
        $("#sReceiverAddr_copy").click(function(){
            _copy($('#div_2_1 [name="sReceiverAddr"]').text(),$("#sReceiverAddr_copy"));
        });
        $("#sReceiverName_copy").click(function(){
            _copy($('#div_2_1 [name="sReceiverName"]').text(),$("#sReceiverName_copy"));
        });
        $("#bankName_copy").click(function(){
            _copy($('#div_2_1 [name="bankName"]').text(),$("#bankName_copy"));
        });
        $("#sReceiverAccount_copy").click(function(){
            _copy($('#div_2_1 [name="sReceiverAccount"]').text(),$("#sReceiverAccount_copy"));
        });
        //时间下拉填充html
        (function(){
             var str = "";
             var new_timestamp =  parseInt($("#current_time").data("timestamp"))+1000;
             var date = new Date(new_timestamp);
            for( var a = 0; a < 24 ; a++){
                if( a == date.getHours() ){
                    str +="<option selected>"+(a<10?("0"+a):a)+"</option>" ;
                } else {
                   str +="<option>"+(a<10?("0"+a):a)+"</option>" ;
                }
            }
            $("#bank-order-time [name=\"hour\"]").html(str);
             var mins = "";
            for( var b = 0; b < 60; b++) {
                if( b == date.getMinutes()) {
                    mins +="<option selected>"+(b<10?("0"+b):b)+"</option>" ;
                } else {
                   mins +="<option>"+(b<10?("0"+b):b)+"</option>" ;
                }
            }
            $("#bank-order-time  [name=\"minutes\"]").html(mins);
        })();

        $("#"+div_id+" [name=\"back_btn\"]").bind("click",function(){
          $('.play-wrap').show();
          $('#bankDeposit_div_2').hide();
            initContentHeight("#bankDeposit_div_2");
        });
        $("#"+div_id+" [name=\"submit\"]").bind("click",function(){
            if(  $("#"+div_id+" [name=\"submit\"]").data("ajax") == "true" ) {//防止按钮重复点击，导致重复调用接口
                return;
            }

            var amount = $.trim( $( "#"+div_id+" input[name=\"amount\"]").val()),
                userName =  $.trim( $( "#"+div_id+" input[name=\"userName\"]").val()),
                payType =  $("#"+div_id+" input[name=\"order-pay\"]:checked ").val();
            if( !/^\d{0,12}(?:\.\d{1,2}|)$/.test(amount) ) {
                _alert("金额必须大于1，且最多2位小数!");
                return;
            }
            if( amount < item.minAmount || amount > item.maxAmount) {
                _alert("存入金额输入有误，不能大于" + item.maxAmount + ",且不能小于" + item.minAmount);
                return;
            }
            if(!Utils.isRealName(userName)) {
                _alert("请输入存入人姓名(2-5个汉字)");
                return;
            }
            if( !payType ) {
                _alert("请选择存款方式");
                return;
            }
            $("#"+div_id+" [name=\"submit\"]").data("ajax","true");
            _value.bank.amount = amount;
            _value.bank.userName = userName;
            _value.bank.payTypeName =  $("#"+div_id+" input[name=\"order-pay\"]:checked ").parent().text();

            // 银行卡提交订单
            var orderParams = {
            	  depositor:userName,
                amount:amount,
                deposit_time:$("#"+div_id+" .bt_time").val()+" "+$("#"+div_id+" [name=\"hour\"]").val()+":"+$("#"+div_id+" [name=\"minutes\"]").val()+":00",
                deposit_type:_value.bank.payTypeName,
                bank_id:item.id
            };
            init_event.util_depositSucess(orderParams,function(data){
                $("#"+div_id+" [name=\"submit\"]").data("ajax","false");
                if( "0" == data.code ) {
                    $("#div_2_2").css("display","block");
                    $("#div_2_1").css("display","none");
                    var div_id = "div_2_2";
                    var sReceiverAccount = item["bankAccount"];
                    $( "#"+div_id+" [name=\"cunru\"]").text( item["bankAddress"]+"/"+item["receiveName"]+"/"+("****"+ sReceiverAccount.substr( sReceiverAccount.length-5, sReceiverAccount.length-1 ) )  );
                    $( "#"+div_id+" [name=\"bankName\"]").text( item["receiveBank"] );
                    $( "#"+div_id+" [name=\"userName\"]").text( _value.bank.userName );
                    $( "#"+div_id+" [name=\"payTypeName\"]").text( _value.bank.payTypeName );
                    $( "#"+div_id+" [name=\"cunruShijian\"]").text(orderParams.deposit_time);
                    $( "#"+div_id+" [name=\"amount\"]").text('￥ ' + Utils.toDecimal2(_value.bank.amount)+'元');
                    $( "#"+div_id+" [name=\"orderId\"]").text( data.data.orderId);
                    initContentHeight("#div_2"); // 重新赋值高度
                } else {
                    _alert(data.msg);
                }
            });

        });

        $("#"+div_id).data("initevent","true");
    },
    util_depositSucess:function(paramObj,callback) {
        Utils.request('front/recharge/common.do',paramObj,function (data) {
          try {
              if ( session_timeout(data) === false ) {
                  _alert(data.msg);
                  return false;
              }
          } catch(e){ console.log(e);}
          if ( callback && typeof (callback) == "function") {
              callback(data);
          }
        });
    }
};

$(function(){
    if (isSw) {
        _alert('试玩环境下不能进行此操作!');
        return;
    }
    //检查登录 - 通过以此获取userid (以后优化)
    Utils.request('passport/check_status.do',{},function (data) {
        try {
            if (data.is_timeout == 'timeout') {
                _user_.isLogin = "false";
                location.reload();
                return false;
            }
        } catch(e){ console.log(e);}

        if (data.code != 0) {
          _alert(data.msg);
          return ;
        }
        //请求充值列表
        init_event.getPayMethodList(data.data.userId);
    });
});
