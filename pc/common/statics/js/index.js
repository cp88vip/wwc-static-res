$(document).ready(function () {
    function checkinput(idinput,idval,value){
        if((value.keyCode == 8 || value.keyCode == 46) && ($(idinput).val().length <=1 )){
            $(idinput).val(idval);
            value.preventDefault();
            value.stopPropagation();
        }
        if ($.inArray(value.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (value.keyCode === 65 && (value.ctrlKey === true || value.metaKey === true)) || (value.keyCode >= 35 && value.keyCode <= 40)) {
            return;
        }
        if ((value.shiftKey || (value.keyCode < 48 || value.keyCode > 57)) && (value.keyCode <= 95 || value.keyCode > 105 )) {
            value.preventDefault();
            value.stopPropagation();
        }
        if((value.key <0 ) && ($(idinput).val().length <=1 )){
            $(idinput).val(idval);
            value.preventDefault();
            value.stopPropagation();
        }
    }

    var times_numsinput = $("#times_nums").val();
    $("#times_nums").on("keydown", function (value) {
        checkinput('#times_nums',times_numsinput,value);
    });

    $("#times_nums").on("keyup", function (value) {
        checkinput('#times_nums',times_numsinput,value);
    });

    $("#times_nums").focusout(function() {
        if($.isNumeric($(this).val())){}else{$(this).val(1);}
    }).blur(function(value) {
        if($.isNumeric($(this).val())){}else{$(this).val(1);}
    });
    //获取联播图
    (function(){
        //下面是除了动态图片之外的几张静态固定图片
        var home_img_arr = [];//几张固定的图片{img_url:_prefixURL.statics+"/images/home/home_1.jpg",url_id:"4"},{img_url:_prefixURL.statics+"/images/home/home_1.jpg",url_id:"4"}
        function imgHtml(data, img_arr)
        {
            console.log(data, '???')
            var len = data.length;
            var len2 = home_img_arr.length;
            var picHtml = '';
            var iconHtml = '';
            if( len > 0)
            {
                for (var i = 0; i < len; i++) {
                    picHtml += '<div class="show_picture" style="display: none;" id="show_pic_'+i+'"><a onclick=\"__openWin(\'home2\',\'/pc/index/newpromotion.html?id=' + data[i].id + '\')\" ><img src="'+data[i].imageUrl+'"></a></div>';
                    iconHtml += '<li data-val=\"'+i+'\" class="pic_logo" id="pic_logo_'+i+'"><a>'+(i+1)+'</a></li>';
                }
            }
            if( len2 > 0)
            {
                for (var i = 0; i < len2; i++) {
                    picHtml += '<div class="show_picture" style="display: none;" id="show_pic_'+(i+len)+'"><a onclick=\"__openWin(\'home2\',\'/pc/index/newpromotion.html?id=' + home_img_arr[i].url_id + '\')\"><img src=\"'+home_img_arr[i].img_url+'\"></a></div>';
                    iconHtml += '<li data-val=\"'+(i+len)+'\" class="pic_logo" id="pic_logo_'+(i+len)+'"><a>'+(i+1+len)+'</a></li>';
                }
            }
            if(len==0&&len2==0)
            {
                return;
            }
            $('#slides_control').empty().html(picHtml);
            $('#slides .pagination').empty().html(iconHtml);
            //下面是轮播图
            (function(_len,clickSelector,parentSelector){
                var index = $(parentSelector).data("index") ? parseInt($(parentSelector).data("index")): 0 , picCount=_len;
                function swichPic( index )
                {
                    $(parentSelector).data("index",index);
                    $(clickSelector).removeClass("current");
                    $(parentSelector+"  .show_picture").hide();
                    $(parentSelector+" #pic_logo_"+index).addClass("current");
                    $(parentSelector+"  #show_pic_"+index).show();
                }
                swichPic(index);
                $(clickSelector).click(function(){
                    index = $(this).data("val")-0;
                    clearInterval(_itl_img);
                    swichPic(index);
                    window._itl_img = setInterval(function(){
                        index = (index+1)>(_len-1) ? 0 : (index+1);
                        swichPic(index);
                    },3000);
                });
                if( typeof(_itl_img) != "undefined" )
                {
                    clearInterval(_itl_img);
                }
                window._itl_img = setInterval(function(){
                    index = (index+1)>(_len-1) ? 0 : (index+1);
                    swichPic(index);
                },3000);
            })(len+len2, "#slides .pagination>li", "#slides");
        }

        Utils.request('front/promotion/getPromotionInfoList.do', {}, function(res){
            var _d = res.data.map(e => {
                e.image = e.imageUrl
                return e
            });
            // var arr = [];
            // var str = "";
            // var newDate = fmtDate(res['system_time'])
            // var newDate = new Date(res['system_time'])
            // var YYMMDD = newDate.toLocaleDateString().replace(/\//g, "-") + " " + newDate.toTimeString().substr(0, 8)
            // localStorage.setItem('drawDate', newDate)
            // console.log(newDate)

            imgHtml(_d, home_img_arr);
        },function(){},true);
        // imgHtml([], home_img_arr);

    })();

    lowDataAleady=false;
    $('.tab-sel').on('mouseover', function (e) { //各彩种开奖公告

        for (i = 1; i < 3; i++) { //共3个标签
            if (i == $(this).data('val')) {
                $('#tab-cont-' + i).css('display', '');
            } else {
                $('#tab-cont-' + i).css('display', 'none');
            }
        }
        $('.tab-sel').removeClass("on");
        $(this).addClass("on");
        if ($(this).attr('data-val') == 2 && $('#lastOpenQt').html() === '' && lowDataAleady == false) {//获取低频彩
            lowDataAleady = true;
            $.ajax({
                'url': '/nonAuthority/home/ajaxGetLastAndNextPeriod?parentid=6',
                'dataType': 'json',
                'type': 'get',
                'success': function (data) {

                    try
                    {
                        if ( session_timeout(data) === false )
                        {
                            return false;
                        }
                    } catch(e){ console.log(e);}
                    if (data.Records.length == 0) {
                        return;
                    }
                    var txtQtHtml = '';//体彩最新hom开奖信息
                    var openArr = [];
                    var tmpArr = [];
                    for (var i = 0; i < data.Records.length; i++) {
                        tmpArr = data.Records[i].period_opennum_opentime.split('___');
                        if (tmpArr.length != 3)
                            continue;
                        openArr = new Array();
                        if (tmpArr[1] != '' && tmpArr[1] != undefined) {
                            openArr = tmpArr[1].split('|');
                        }
                        var perName = tmpArr[0];

                        function switchHcyNum(number) {
                            if (number == '')
                                return '';
                            var codeSx = ['猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
                            var season = ['', '春', '夏', '秋', '冬'];
                            var direct = ['东', '南', '西', '北'];
                            var num = parseInt(number);
                            var pos = 0;
                            if (num > 18) {
                                pos = num % 2 == 0 ? 3 : 2;
                            } else {
                                pos = num % 2 == 0 ? 1 : 0;
                            }
                            var strNum = number + '|' + codeSx[num % 12] + '|' + season[Math.ceil(num / 9)] + '|' + direct[pos];
                            return strNum;
                        }
                        txtQtHtml += ''
                                + '<li>'
                                + '<div>'
                                + '<span class="lot-name"><a onclick=\"__openWin(\'lottery_hall\',\'' + data.Records[i].link + '\')\" >' + data.Records[i].gname + '&nbsp;</a>' + perName + '期</span>'
                                + '<span class="term">' + tmpArr[2].substr(0, 10) + '</span>'
                                + '<span class="clear"></span>'
                                + '<div class="clear"></div>'
                        if (data.Records[i].gid == 32) {
                            var num = switchHcyNum(openArr[0]);
                            arrNum = num.split('|');
                            txtQtHtml += '<div class="redball">' + arrNum[0] + '</div>'
                                    + '<div class="redball">' + arrNum[1] + '</div>'
                                    + '<div class="redball">' + arrNum[2] + '</div>'
                                    + '<div class="redball">' + arrNum[3] + '</div>';
                        }
                        var openLen = openArr.length;
                        for (var j = 0; j < openLen; j++) {
                            if (!(j == 0 && data.Records[i].gid == 32)) {
                                txtQtHtml += '<div class="redball">' + openArr[j] + '</div>';
                            }
                        }
                        var link = data.Records[i].lotteryId;
                        txtQtHtml += '<br>'
                                + '<div class="fr">'
                                + '<a  onclick="__openWin(\'home2\',\'/pc/trend/chart.html?lotteryId=' + data.Records[i].gid + '&periods=30\');">走势</a>'
                                + '　|　<a onclick="__openWin(\'lottery_hall\',\'' + link + '\');" >投注</a>'
                                + '</div>'
                                + '<div class="clear"></div>'
                                + '</div>'
                                + '</li>';
                    }
                    $('#lastOpenQt').html(txtQtHtml);
                    lowDataAleady=false;
                },
                error: function (XMLHttpRequest, status) {
                    lowDataAleady=false;
                    process_timeout(status);
                }
            });
        }
    });


    $('#times_nums').val(1);
    $('#bet_amount').text(2);


    var arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
    var arr2 = arr.sort(randomsort);
    for (var i = 0; i < 3; i++) {
        $('#bet_pk' + i).val(arr2[i]);
    }
    //山东11选5
    setEsdNum('#bet_esd');
});

function setbetNum() {
    console.log("随机选数？");
    var type = $('#selected_open').val();
    if (type == 1) { //时时彩
        $('#bet_cq1').val(parseInt(Math.random(10) * 10));
        $('#bet_cq2').val(parseInt(Math.random(10) * 10));
        $('#bet_cq3').val(parseInt(Math.random(10) * 10));
        $('#bet_cq4').val(parseInt(Math.random(10) * 10));
        $('#bet_cq5').val(parseInt(Math.random(10) * 10));
    } else if (type == 2) { //福彩
        $('#bet_fc1').val(parseInt(Math.random(10) * 10));
        $('#bet_fc2').val(parseInt(Math.random(10) * 10));
        $('#bet_fc3').val(parseInt(Math.random(10) * 10));
    } else if (type == 3) { //体彩
        $('#bet_tc1').val(parseInt(Math.random(10) * 10));
        $('#bet_tc2').val(parseInt(Math.random(10) * 10));
        $('#bet_tc3').val(parseInt(Math.random(10) * 10));
    } else if (type == 4) {//pk10
        setPk10Num('#bet_pk');
    } else if (type == 5) {//山东11选5
        setEsdNum('#bet_esd');
    }
}

function setEsdNum(e) {
    var arrEsd = [];
    for (var i = 1; i <= 5; i++) {
        var num = parseInt(Math.random(10) * 11 + 1);
        while ($.inArray(num, arrEsd) != -1) {
            num = parseInt(Math.random(10) * 11 + 1);
        }
        arrEsd.push(num);
        $(e + i).val(num);
    }
}

function setPk10Num(e) {
    var arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
    var arr2 = arr.sort(randomsort);
    for (var k = 0; k < 3; k++) {
        $(e + k).val(arr2[k]);
    }
}

function randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
}

function getTarget(url) {
    __openWin('lottery_hall',url);;
}
function doBet() {
    console.log("doBet?");
    var type = $('#selected_open').val();
    if (type == 1) {//重庆时时彩
        getTarget('/game/cqssc.html?times=' + $('#bet_amount').text() +'&num1=' + $('#bet_cq1').val() + '&num2=' + $('#bet_cq2').val() + '&num3=' + $('#bet_cq3').val() + '&num4=' + $('#bet_cq4').val() + '&num5=' + $('#bet_cq5').val() +  '&amount=' + $('#bet_amount').text());
    } else if (type == 2) { //福彩
        getTarget('/gameFtc/fcsd.html?times=' +  $('#bet_amount').text() + '&num3=' + $('#bet_fc1').val() + '&num4=' + $('#bet_fc2').val() + '&num5=' + $('#bet_fc3').val() + '&amount=' + $('#bet_amount').text());
    } else if (type == 3) { //体彩
        getTarget('/gameFtc/tcps.html?times=' + $('#bet_amount').text() +'&num3=' + $('#bet_tc1').val() + '&num4=' + $('#bet_tc2').val() + '&num5=' + $('#bet_tc3').val() +  '&amount=' + $('#bet_amount').text());
    } else if (type == 4) {//pk10
        getTarget('/game/bjsc.html?times=' +  $('#bet_amount').text() +'&num1=' + $('#bet_pk0').val() + '&num2=' + $('#bet_pk1').val() + '&num3=' + $('#bet_pk2').val() +  '&amount=' + $('#bet_amount').text());
    } else if (type == 5) {//山东11选5
        getTarget('/elevenGame/sd.html?times=' + $('#bet_amount').text() +'&num1=' + $('#bet_esd1').val() + '&num2=' + $('#bet_esd2').val() + '&num3=' + $('#bet_esd3').val() + '&num4=' + $('#bet_esd4').val() + '&num5=' + $('#bet_esd5').val() +  '&amount=' + $('#bet_amount').text());
    }
}

function setTimesNum(type) { //1:减,2:加
    var times = $('#times_nums').val();
    if (type == 0) {
    } else if (type == 1) {
        times = parseInt(times) - 1;
        times = (times < 1) ? 1 : times;
    } else if (type == 2) {
        times = parseInt(times) + 1;
    }
    $('#times_nums').val(times);
    $('#bet_amount').text(times * 2);
}

function setHelpTab(obj, type) {
    if (type == 'hot') {
        $('#help_tab_hot').addClass('on');
        $('#help_tab_newer').removeClass('on');
        $('#cont_help_hot').css('display', '');
        $('#cont_help_newer').css('display', 'none');
    } else if (type == 'newer') {
        $('#help_tab_newer').addClass('on');
        $('#help_tab_hot').removeClass('on');
        $('#cont_help_newer').css('display', '');
        $('#cont_help_hot').css('display', 'none');
    }
}

//var flag = true;

function doLogOut() {
    $.ajax({
        'url': '/index/ajaxLogOut.html',
        'dataType': 'json',
        'type': 'post',
        'success': function (data) {
            try
            {
                if ( session_timeout(data) === false )
                {
                    return false;
                }
            } catch(e){ console.log(e);}
            if (data == null || data == '' || data == undefined || data.Result != true) {
                return;
            }
            $("#need_captcha").hide();//去掉验证码
            $('#login_box').css('display', 'none');
            $('#unlogin_box').css('display', 'block');
        }
    });
}

function initClear() {
    $('.init-clear').val('');
}
// 消息
function getLotNews() {
    Utils.request('front/news/get_list.do',{page : 1,pageSize : 10},function (data) {
        if (data.code != 0) {
          return ;
        }
        var html = "",html2 = "";
        for (var i = 0; i < data.rows.length; i++) {
            var newsId = data.rows[i].id,
                title  = data.rows[i].title;
            if(i == 0){
                $('#newsTitle_1').html(data.rows[0].title);
                $('#newsTitle_1').data("key",data.rows[0].id);
                $('#newsTitle_1').bind("click",function(){
                    __openWin('home2','/pc/news/newsDetail.html?'+ data.rows[0].id + '');
                });
            }
            if(i == 5){
              $('#newsTitle_2').html(data.rows[5].title);
              $('#newsTitle_2').data("key",data.rows[5].id);
              $('#newsTitle_2').bind("click",function(){
                  __openWin('home2','/pc/news/newsDetail.html?'+ data.rows[5].id + '');
              });
            }
            if (i > 9) {
                break;
            }
            var status = (data.rows[i].category == 1)?'新闻':'技巧';
            if (i < 5) {
              html += '<li><a onclick=\"__openWin(\'home2\',\'/pc/news/newsDetail.html?'+ newsId +'\')\" class="c-grey">' + status + '</a><span class="pad c-grey">|</span> <a onclick=\"__openWin(\'home2\',\'/pc/news/newsDetail.html?'+ newsId +'\')\">' + title + '</a> </li>';
            } else {
              html2 += '<li><a onclick=\"__openWin(\'home2\',\'/pc/news/newsDetail.html?'+ newsId +'\')\" class="c-grey">' + status + '</a><span class="pad c-grey">|</span> <a onclick=\"__openWin(\'home2\',\'/pc/news/newsDetail.html?'+ newsId +'\')\">' + title + '</a> </li>';
            }
        }
        $("#news-bar-content1 ul").html(html);
        $("#news-bar-content2 ul").html(html2);
    });
}
//获取高频彩开奖公告 和首页截止倒计时。
function getLastAndNextPeriod() {
    Utils.request('pc/front/lottery/luck_number.do',{},function (data) {
        if (data.code != 0) {
          return;
        }
        try
        {
            if ( session_timeout(data) === false )
            {
                return false;
            }
        } catch(e){ console.log(e);}
        if ( !data.data || data.data.length == 0) {
            return;
        }
        var txtHighHtml = '', highLength = 0;//高频最新开奖信息
        var txtLowHtml = '', lowLength = 0;//低频最新开奖信息
        var openArr = [];
        var nextArr = new Array(1, 5, 9, 2, 12);//下一期彩种列表
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];

            openArr = new Array();
            if (item.number != '') {
                openArr = item.number.split(',');
            }

            if (item.oldType == 'h') {//高频
                var perName = item.issue;

                if (item.gid == 19) {
                    for (var t = 0; t < 3; t++) {
                        openArr[t] = switchKlpkOneNum(openArr[t]);
                    }
                }
                if(openArr.length < 9){//去掉开奖号码太长的彩种，样式有问题。
                    var link = item.lotteryId;
                    highLength ++;
                    if (highLength < 5) {
                      txtHighHtml += ''
                              + '<li>'
                              + '<div>'
                              + '<span class="lot-name"><a onclick=\"__openWin(\'lottery_hall\',\'' + link + '\')\">' + item.name + '&nbsp;</a></span>'
                              + '<span class="term">' + perName + '期'
                              + ' &nbsp;&nbsp;' + item.time.substr(5, 5) + '</span>'
                              // + '<span class="clear"></span>'
                              + '<div class="clear"></div>';

                      var openLen = openArr.length;
                      for (var j = 0; j < openLen; j++) {
                          txtHighHtml += '<div class="redball">' + openArr[j] + '</div>';
                      }
                      txtHighHtml += '<br>'
                              + '<div class="fr">'
                              + '<a  onclick="__openWin(\'home2\',\'/pc/trend/chart.html?lotteryId='+item.lotteryId+'&periods=30\');" >走势</a>'
                              + '　|　'
                              + '<a  onclick="__openWin(\'lottery_hall\',\''+ link +'\');">投注</a>'
                              + '</div>'
                              + '<div class="clear"></div>'
                              + '</div>'
                              + '</li>';
                    }
                }
            }

            if (item.oldType == 'l') {// 低频
              var perName = item.issue;

              if (item.gid == 19) {
                  for (var t = 0; t < 3; t++) {
                      openArr[t] = switchKlpkOneNum(openArr[t]);
                  }
              }
              if(openArr.length < 9){//去掉开奖号码太长的彩种，样式有问题。
                  var link = item.lotteryId;
                  lowLength ++;
                  if (lowLength < 5) {
                    txtLowHtml += ''
                            + '<li>'
                            + '<div>'
                            + '<span class="lot-name"><a onclick=\"__openWin(\'lottery_hall\',\'' + link + '\')\">' + item.name + '&nbsp;</a></span>'
                            + '<span class="term">' + perName + '期'
                            + ' &nbsp;&nbsp;' + item.time.substr(5, 5) + '</span>'
                            // + '<span class="clear"></span>'
                            + '<div class="clear"></div>';

                    var openLen = openArr.length;
                    for (var j = 0; j < openLen; j++) {
                        txtLowHtml += '<div class="redball">' + openArr[j] + '</div>';
                    }
                    txtLowHtml += '<br>'
                            + '<div class="fr">'
                            + '<a  onclick="__openWin(\'home2\',\'/pc/trend/chart.html?lotteryId='+item.lotteryId+'&periods=30\');" >走势</a>'
                            + '　|　'
                            + '<a  onclick="__openWin(\'lottery_hall\',\''+ link +'\');">投注</a>'
                            + '</div>'
                            + '<div class="clear"></div>'
                            + '</div>'
                            + '</li>';
                  }
              }
            }
        }
        if (nextArr.length > 0) {
            nextArr.forEach(function (v) {
                $('#quick_' + v).remove();
            });
        }

        $('#lastOpenSsc').html(txtHighHtml);
        $('#lastOpenQt').html(txtLowHtml);
    });
}

// 公告
function getNewMsg(data) {
    if (data.code != 0) {
      return;
    }
    if (!data.data.notices) {
        return;
    }
    var notices = data.data.notices;
    var allHtml = '';
    var tmpStr = '';
    var count = (notices.length > 4 ) ? 4 : notices.length;
    for (var i = 0; i < count; i++) {
        if (notices[i].hasOwnProperty('content')) {
          tmpStr = notices[i].content.substr(0, 20);
          tmpStr += (notices[i].content.length > tmpStr.length) ? '...' : '';
          allHtml += '<li><a>' + tmpStr + '</a></li>';
        }
    }
    // onclick=\"__openWin(\'home2\',\'/index/newsContent.html?skey=' + notices[i].id + '\')\"
    if (allHtml == '') {
        allHtml = '暂无公告';
        $("#help_tab_newer").trigger('onmouseover');
    }
    $('#cont_help_hot').html(allHtml);
}

//轮播排名列表
function pmCarousel()
{
    var length = 355 ;
    if( $("#prizeUser").height() <= length )
    { //小于9个的时候不用 循环滚动
        return;
    }
    var _top1 = $(".tableCarousel .thead").height();
    var iCount = 0 ;
    function goPaly()
    {
        iCount++;
        if( iCount%6 > 0 )
        {
            $("#prizeUser").css("top",_top1 - (iCount%6)*6);
        }
        else
        {
            var newTr = $("#prizeUser  p:eq(0)");
            $("#prizeUser").append("<p>"+newTr.html()+"</p>");
            $("#prizeUser").css("top",_top1);
            $("#prizeUser p:eq(0)").remove();
        }
    }
    window.__sItl_1 = setInterval(goPaly,200);
    $("#prizeUser").bind("mouseover",function(){
        clearInterval( window.__sItl_1);
    });
    $("#prizeUser").bind("mouseout",function(){
        window.__sItl_1 = setInterval(goPaly,200);
    });
}

/*----------  倒计时功能  ----------*/
//倒计时
leftTime = 0;
interval = 1000;
leftTimeCounter = '';

//获取中奖排行
function getPrizeUser(data){
    console.log(data)
   if (data.code != 0) {return;}
   var html = '';
   var rank = 1;
   var list = data.data.records;
   for (var i = 0; i < list.length; i++) {
       var item = list[i];
       if(rank < 10){
           var rankStr= '0'+rank;
       } else {
           var rankStr=rank;
       }
       rank++;
       if (rank > 4) {
          html +='<p><span class="c-green"><span class="c-green-bg">'+rankStr+'</span>'+item.username+'</span><span class="c-green c-right">'+item.winFee+'元</span><span>'+ item.lotteryCategory +'</span></p>';
       }else {
          html +='<p><span class="orange"><span class="orange-bg">'+rankStr+'</span>'+item.username+'</span><span class="orange c-right">'+item.winFee+'元</span><span>'+ item.lotteryCategory +'</span></p>';
       }
   }
   $('#prizeUser').empty().html(html);
   pmCarousel();
}

$(function () {
    $("#slides_prev").click(function () {
        objTurn.setPrevPic();
    });

    $("#slides_next").click(function () {
        objTurn.setNextPic();
    });

    $("#slides").mouseover(function () {
        $("#slides_prev").css('display', 'block');
        $("#slides_next").css('display', 'block');
    });

    $("#slides").mouseleave(function () {
        $("#slides_prev").css('display', 'none');
        $("#slides_next").css('display', 'none');
    });

});
$(function () {
    _home_menu.checkLogin(); //检查是否登录并显示余额和用户id
    getLastAndNextPeriod();
    // getNewMsg();//系统公告
    getLotNews();//新闻
    _home_menu.getMqData('#sys_tip_outer');//跑马灯公告
    // getPrizeUser();
    getHomeHotLists();
    promotion ();
});
$(function () {
    setTimeout("initClear()", 100);
});

// 热门彩种
function getHomeHotLists() {
  Utils.request('pc/front/lottery/shortcut.do',{},function (res) {
    var games = [];
    for (var i = 0; i < res.data.length; i++) {
      var result = res.data[i];
      if (result.name != "六合彩" && games.length < 5 && result.lotteryId < 10000) {
        games.push(result);
      }
    }
    _index_countdownIssue(games,res);
  });
}

function _index_countdownIssue(games,res) {
    var selector = "#_index_countdownIssue";
    //该数组包含 id的顺序
    var gameIdArr = [];
    var gameListData = {};
    for (var i = 0; i < games.length; i++) {
        gameIdArr.push(games[i].lotteryId);
    }
    function randomRandom(e) {
        var numList = [],
            isAllowRepeat = e.repeatable;
        var isCount = e.max - e.min + e.min === e.count;
        if (isCount) {
            numList = new Array(e.count)
                .fill('')
                .map((item, inx) => inx + 1)
                .sort(function () {
                    return .5 - Math.random();
                });
        } else {
            while (true) {
                var isExists = false;
                var random = parseInt(Math.random() * (e.max - e.min) + e.min);
                var sameCount = 0;
                for (var i = 0; i < numList.length; i++) {
                    if (!isAllowRepeat) {
                        if (random === numList[i]) {
                            isExists = true;
                            break;
                        }
                    } else {
                        if (random === numList[i]) {
                            if (sameCount == 1) {
                                isExists = true;
                                break;
                            }
                            sameCount++;
                        }
                    }
                }
                if (!isExists)
                    numList.push(random);
                if (numList.length === e.count)
                    break;
            }
        }
        var isTwo = (parseInt(e.max) > 9),
            s = "";
        $.each(numList, function (i, num) {
            if (isTwo && num < 10) {
                num = '0' + num;
            }
            numList[i] = num;
        });
        return numList;
    }
    var initData = function () {
      for (var i = 0; i < games.length; i++) {
        var e = games[i];
        var timeLeave = parseInt(e.deadline - res.system_time/1000);
        gameListData[e.lotteryId] = {
          hide:( i == 0 ? false : true ),
          gameId:e.lotteryId,
          name:e.name,
          game_url:lotteryLink(e.name)+"?lotteryId="+e.lotteryId,
          game_url_param:function() {
            return "";
          },
          numbers:[],
          trend_url:"/pc/front/lottery/shortcut.do",
          trend_data:{lotteryIds:[e.lotteryId]},
          timeout: timeLeave,
          issue: e.currentIssue,
          item: e,
          rNum: function(selector, dict) {
            var numList = randomRandom(dict.item);
            var isTwo = (parseInt(e.max) > 9), s = "";
            if (numList.length > 8) {
                numList.splice(8, numList.length - 8)
            }
            $.each(numList , function (i , num) {
              s += "<li class=\"qb-red lot_sn_red\"><input value=\""+numList[i]+"\" readonly></li>"
            });
            $(selector+" [name=num_list]").html(s);
          }
        }
      }
    }
    initData();
    var getTimeArr = function( sec ) {
        sec = parseInt(sec);
        var arr = [];
        var day = parseInt(sec/(3600*24));
        arr.push(day);
        sec = sec - (3600*24)*day;
        var h = parseInt(sec/3600);
        arr.push(h);
        sec = sec - 3600*h;
        var m = parseInt(sec/60);
        arr.push(m);
        sec = sec - 60*m;
        arr.push(sec);
        return arr;
    };
    var init_event = function() {
        if( "true" == $(selector).data("bind") ){
            return;
        }
        var str = "" ;
        for( var k = 0; k < gameIdArr.length ; k++ ){
            var gameId = gameIdArr[k];
            var o = gameListData[gameId];
            // if( o["hide"] !== false ){
            //     continue;
            // }
            str += "<li class=\"tab-sel-open\" data-gameid=\""+gameId+"\" name=\"gameid_"+gameId+"\"><a>"+o["name"]+"</a></li>";
        }
        $(selector+" [name=quick_tab_list]").html(str);
        $(selector+" [name=quick_tab_list]>li").bind('mouseover',function(e){
            //各彩种中奖号码
            $(selector+" [name=quick_tab_list]>li").removeClass("on");
            $(this).addClass("on");
            var gameId = $(this).data("gameid");
            (function html(selector,o){
                $(selector+" [name=issue]").text(o["issue"]);
                var t_arr = getTimeArr(o["timeout"]);
                $(selector+" [name=h]").text(t_arr[1]);
                $(selector+" [name=m]").text(t_arr[2]);
                $(selector+" [name=s]").text(t_arr[3]);
                o["rNum"](selector, o);
            })(selector,gameListData[gameId]);
            $(selector).data("gameid",gameId);
        });

        $(selector+" [name=change_gameNum]").bind("click",function(){
            var gameId = $(selector).data("gameid");
            var o = gameListData[gameId];
            o["rNum"](selector, o);
        });

        $(selector+" [name=quick_tab_list]>li").eq(0).trigger("mouseover");

        $(selector+" [name=quick_tab_list]>li").bind('click',function(e){
            var gameId = $(this).data("gameid");
            __openWin('lottery_hall',gameId);
        });

        $(selector+" [name=btn_game_play]").bind('click',function(e){
            var gameId = $(selector).data("gameid");
            __openWin('lottery_hall',gameId);
        });

        $(selector+" [name=btn_trend]").bind('click',function(e){
            var gameId = $(selector).data("gameid");
            __openWin("home2","/pc/trend/chart.html?lotteryId="+gameId+"&periods=30");
        });

        $(selector+" [name=doBet]").bind('click',function(e){
            var gameId = $(selector).data("gameid");
            __openWin("lottery_hall",gameId);
        });

        setInterval(function(){
            for( var k in gameListData ) {
                var o = gameListData[k];
                var leftTime = parseInt(o["timeout"])-1 ;
                if( leftTime <= 0 ){
                    o["timeout"] = 0;
                    queryData();
                }else{
                    o["timeout"] = leftTime;
                }
            }
            var gameId = $(selector).data("gameid");
            (function html(selector,o){

                $(selector+" [name=issue]").text(o["issue"]);
                var t_arr = getTimeArr(o["timeout"]);
                $(selector+" [name=h]").text(t_arr[1]);
                $(selector+" [name=m]").text(t_arr[2]);
                $(selector+" [name=s]").text(t_arr[3]);

            })(selector,gameListData[gameId]);
        }, 1000);
        $(selector).data("bind","true");
    };

    var queryData = function() { //TODO 重新获取下一期
        console.log('重新获取下一期')
        var data = [];
        Utils.requestSyn('front/lottery/draw_infos.do', {lotteryIds: gameIdArr.join(",")}, function(res) {
          if (res.code == 0) {
            var _data = res.data;
            for (var i = 0; i < _data.length; i++) {
              var _e = _data[i];
              if(_e){
                  data.push({
                      "issue": _e.currentIssue,
                      "gameId": _e.lotteryId,
                      "url": lotteryLink(_e.name)+"?lotteryId="+_e.lotteryId,
                      "timeout": parseInt((_e.deadline-res.system_time)/1000)
                  });
              }
            }
          }
        });

        for( var i in data ){
            try {
                var o = data[i];
                if( gameListData.hasOwnProperty(o["gameId"]) ){
                    gameListData[o["gameId"]]["issue"] = o["issue"];
                    gameListData[o["gameId"]]["game_url"] = o["url"];
                    gameListData[o["gameId"]]["timeout"] = o["timeout"];
                    gameListData[o["gameId"]]["hide"] = false ;
                }
            }catch(e){console.log(e);}
        }
        init_event();
    };
    window.setTimesNum = function (type) { //1:减,2:加
        var times = $(selector+' [name=times_nums]').val();
        if(times==0){
            $(selector+" [name=times_nums]").val(1);
            $(selector+' [name=bet_amount]').text(2);
        }else{
            if (type == 0) {
            } else if (type == 1) {
                times = parseInt(times) - 1;
                times = (times < 1) ? 1 : times;
            } else if (type == 2) {
                times = parseInt(times) + 1;
            }
            $(selector+" [name=times_nums]").val(times^0|[1-9][0-9]*$);
            $(selector+' [name=bet_amount]').text(times * 2);
        }
    };
    queryData();
}
