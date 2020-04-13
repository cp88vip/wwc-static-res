var _sty = '<style type="text/css">'+
	'.header-right{width: 73%; width: calc(100% - 260px);  width: -moz-calc(100% - 260px); width: -webkit-calc(100% - 260px); text-align: right; padding: 10px 50px 0px 50px;}'+
	'.shade{/*position: fixed; bottom: 12%; z-index: 110; left: 0;*/ text-align: left; width: 100%; display: block; position: relative; margin-top: 3px; height: 22px; background-color: rgba(0, 0, 0, 0.3); overflow: hidden;}'+
	'.roll{/*margin: 4px 8px; background-color: rgba(0, 0, 0, 0.3); */overflow: hidden; position: absolute; }'+
	'.roll li{height: auto; line-height: 1.5; color: #111; float: left; font-size: 14px; color: #fff; list-style: none;}'+
	'.pagination .btn-toolbar { display: inline-block; margin-left: 10px; height: 34px; line-height: 34px; color: #666; }'+
	'.btn-toolbar > .btn-group { margin: 0 6px;}'+
	'.btn-toolbar > .btn-group > input { height: 24px; width: 56px; }'+
	'.btn-toolbar > .btn-group > button { top: 5px; }'+
'</style>';
document.write(_sty);
//样式

var _nav = '<nav class="navbar navbar-default navbar-cls-top " role="navigation" style="margin-bottom: 0">'+
	'<div class="navbar-header">'+
		'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">'+
			'<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span>'+
			'<span class="icon-bar"></span> <span class="icon-bar"></span>'+
		'</button>'+
		'<a class="navbar-brand" href="#">管理后台</a>'+
	'</div>'+
	'<div class="header-right">'+
		'<a href="/manage/member/all_user.do?type=isOnline" class="btn btn-default" title="在线人数">在线人数 <b id="online-numbers">0</b></a>'+
		'<a href="/manage/finance/recharge_log.do" class="btn btn-default" title="充值">充值 <b id="recharge-numbers">0</b></a>'+
		'<a href="/manage/finance/withdrawals_log.do" class="btn btn-default" title="提现">提现 <b id="withdrawal-numbers">0</b></a>'+
		'<a href="#" class="btn btn-danger" title="Logout" id="logout"><i class="fa fa-exclamation-circle fa-fw"></i>退出系统</a> <!--login.html-->'+
		'<div id="roll" class="shade">'+
			'<ul class="roll"></ul>'+
		'</div>'+
	'</div>'+
'</nav>'+
'<!-- /. NAV TOP  -->'+
'<nav class="navbar-default navbar-side" role="navigation">'+
	'<div class="sidebar-collapse">'+
		'<ul class="nav" id="main-menu">'+
			'<li>'+
				'<div class="user-img-div">'+
					'<div class="inner-text">'+
						'<script type="text/javascript">'+
							'var user = JSON.parse(sessionStorage.getItem("user"));'+
							'if(!user) {'+
							    'user = {'+
										'lastLoginTime : "",'+
										'lastLoginIp : "",'+
										'username : ""'+
								'};'+
							"}"+
              "document.write(user.username);"+
						"</script>"+
						"<br /> <small>上次登录 :"+
							'<script type="text/javascript">document.write(user.lastLoginTime);</script>'+
							'</small>'+
						'<br /> <small><script type="text/javascript">document.write(user.lastLoginIp);</script></small>'+
					'</div>'+
				'</div>'+
			'</li>'+
		'</ul>'+
	'</div>'+
'</nav>';
document.write(_nav);

	window.statusObj = {
		"turnOn": 1,
		"turnOn": 2,
		"turnOn": 3,
	}
	/* 创建 XMLHttpRequest 对象 */
	var xmlHttp;
	// -----------ajax方法-----------//
	var getLabelsPost = function (url, fn){
		var GetXmlHttpObject = function (){
		    if (window.XMLHttpRequest){
		      // code for IE7+, Firefox, Chrome, Opera, Safari
		      xmlhttp = new XMLHttpRequest();
		    }else{// code for IE6, IE5
		      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    }
		    return xmlhttp;
		}
	  xmlHttp = GetXmlHttpObject();
	  if (xmlHttp == null){ alert('您的浏览器不支持AJAX！'); return; }
	  var postUrl = url;//"http://www.lifefrom.com/t/"+Math.random();
		if (typeof fn !== "function") { return ; }
		xmlHttp.onreadystatechange = function(){
			// console.log(xmlHttp.readyState);
			// console.log(xmlHttp.status);
			if (xmlHttp.readyState == 4 && xmlHttp.status== 200 ){
					var d = xmlHttp.responseText; // 返回值
					// 处理返回值
					fn(d);
			}
		};//发送事件后，收到信息了调用函数
	 	xmlhttp.open("POST", postUrl, true);
	  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  xmlhttp.send();
	}
	/****/
	document.querySelector("#logout").addEventListener("click", function(){
		var r = confirm("你确定要退出吗？");
		if (r) {
			getLabelsPost('/passport/logout.do', function(res){
				// console.log(res);
				res = JSON.parse(res);
				if (res.code == 0) {
				  sessionStorage.clear();
					window.location.href = "/manage/account/login.do";
				}
			});
		} else {

		}
	});
	window.onload = function(){
    request("/passport/check_status.do", {}, function(res){
        // console.log(res);
        user = res.data;
        sessionStorage.setItem("user", JSON.stringify(res.data));
    });
		/*roll*/
		var rollData = function () {
		  var broadUrl = "/manage/polling/service.do";
		  $(".roll").html("");
		  if (broadUrl.length > 0) {
		    request(broadUrl, {}, function(data){
					if (data['code'] == 0) {
						var _d = data['data'], arr = [], str = "";
						var _affiche = data['affiche'];
						if (_affiche) {
							if (_affiche.code == 106) {
								str += '<li issueTime="10" afficheId="'+_affiche.afficheId+'">'+_affiche.system['content']+'</li>';
							}
						}
						if (str.length == 0) {
							str += '<li issueTime="1000">暂无新通告</li>';
						}
						// console.log(str);
						$(".roll").html(str);
						rollRun();
					} else {
						console.log(data['msg']);
					}
				});
		  }
		}
		var rollRun = function() {
		  var left = $('.shade').width();
		  var sum = 0;
		  $('.roll li').each(function() {
		    $(this).css({
		      'width': $(this).width() + $('.shade').width()
		    });
		    sum += $(this).width()
		  });
		  $('.roll').css({
		    'width': sum
		  });
		  var count = left;
		  var timer = setInterval(function() {
		    count -= 0.5;
		    if(count <= -$('.roll').width()) {
		      count = $('.shade').width()
		    };
		    $('.roll').css({
		      'left': count
		    });

		  }, 10);
		}
		rollData();
	}
  //
