var sessionid = $.cookie('sessionid');
function post(url, data, fun) {
	$
			.ajax({
				type : "POST",
				url : url,
				data : data,
				headers : {
					sessionid : sessionid,
					"x-requested-with" : $.cookie("JSESSIONID"),
					"temporary-sessionId": $.cookie("temporaryId")
				},
				success : function(e) {
					if (e.code >= 300 && e.code < 400) {
						layer.msg(e.msg);
						setTimeout(
								'location="/manage/account/login.do?redirect="+location.href',
								1500);
						return;
					} else if (e.code != 0) {
						layer.msg(e.msg);
						return;
					} else {
						if (!isLoaded) {
							layer.close(loadIndex);
							isLoaded = true;
						}
						fun(e);
					}
				},
				error : function(message) {
					console.log(message)
				}
			});
}

function request(url, data, fun, async) {
	$.ajax({
		type : "POST",
		url : url,
		async : async,
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(data),
		dataType : "json",
		headers : {
			sessionid : sessionid,
			"x-requested-with" : $.cookie("JSESSIONID"),
			"temporary-sessionId": $.cookie("temporaryId")
		},
		success : function(e) {
			if (e.code >= 300 && e.code < 400) {
				layer.msg(e.msg);
				setTimeout(
						'location="/manage/account/login.html#"+location.href',
						1500);
				return;
			} else if (e.code != 0) {
				layer.msg(e.msg);
				return;
			} else {
				if (!isLoaded) {
					layer.close(loadIndex);
					isLoaded = true;
				}
				fun(e);
			}
		},
		error : function(message) {
			console.log(message)
		}
	});
}

//var isLoaded = false;
// 初始
//var loadIndex = layer.load(2, {
//	shade : [ 0.9, '#fff' ]
//});
// 轮训
// var timer = setInterval(function() {
// request('/poll/manage.do', {
// sessionid : $.cookie('sessionid')
// }, function(e) {
// console.log(e);
// })
// }, 10000);
