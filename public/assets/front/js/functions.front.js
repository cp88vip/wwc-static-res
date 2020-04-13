var isLoaded = false;
var loadIndex = layer.load(2, {
	shade : [ 0.9, '#fff' ]
});
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
function post(url, data, fun, async) {
	$
			.ajax({
				type : "POST",
				url : url,
				data : data,
				async : async,
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
					xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
				},
				success : function(e) {
					if (e.code >= 300 && e.code < 400) {
						layer.msg(e.msg);
						setTimeout(
								'location="/manage/account/login.do?redirect="+location.href',
								1500);
						return;
					}else if (!(e.code == 0 || e.code == 101)) {
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
			xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
		},
		success : function(e) {
			if (!(e.code == 0 || e.code == 101)) {
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
			xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
		},
		success : function(e) {
			if (e.code >= 300 && e.code < 400) {
				layer.msg(e.msg);
				setTimeout(
						'location="/manage/account/login.do#"+location.href',
						1500);
				return;
			} else if (!(e.code == 0 || e.code == 101)) {
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