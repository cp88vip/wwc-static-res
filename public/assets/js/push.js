var __requestUrl;
$(window).on('hashchange', function() {
	hashChange();
});

function hashChange() {
	if (location.hash == '#android') {
		// customizedcastLabel
		$('#customizedcast').show();
		$('#customizedcastLabel').show();
		__requestUrl = '/manage/app_settings/android_push.do';
	} else {
		$('#customizedcast').show();
		$('#customizedcastLabel').show();
		__requestUrl = '/manage/app_settings/ios_push.do';
	}
	$('h1').text(location.hash.substring(1) + "推送");
}

var selType = 'broadcast';
var offset = 0;
var count = 30;
var postList = [];
var selList = [];

function init(argument) {
	var options = {
		language: 'zh-CN',
		autoclose: 1,
		weekStart: 1,
		todayBtn: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
		showSecond: 1,
		minuteStep: 1,
		format: 'yyyy-mm-dd hh:ii:00'
	};
	$('#begin').datetimepicker(options);
	options.format = "yyyy-mm-dd hh:ii:59";
	// $('#end').datetimepicker(options); /* 加载发送用户列表 */
	$('#userlist').removeClass('hidden');
	// $('#push-imme').addClass('hidden');
	var v = 0;
	$('input[name=pushPeople]').each(function(e) {
		if ($(this).prop('checked')) {
			v = $(this).val();
		}
	});
	selType = v;
	getUserlist(offset, count);

	var begin = DateUtil.getCurrentDateAll();
	setDate(begin);

	$('#selInput').on({
		click: function() {
			var display = $('#seluserlist').css('display');
			if (display == 'block') {
				$(this).html('点击展开选择');
			} else {
				$(this).html('点击关闭选择');
			}
			$('#seluserlist').toggle();
		}
	});
}

function bindInput() {
	$(':radio').on({
		click: function(argument) {
			var value = $(this).val();
			// console.log(value);
			if (value == 'broadcast') {
				$('#userlist').addClass('hidden');
				selType = value;
			} else if (value == 'customizedcast') {
				$('#userlist').removeClass('hidden');
				selType = value;
				getUserlist(offset, count);
			}

			if (value == 'immetime') {
				$('#push-imme').addClass('hidden');
			} else if (value == 'timingtime') {
				$('#push-imme').removeClass('hidden');
			}
		}
	});
}

function push(argument) {
	var title = $("#title").val();
	var subtitle = $("#subtitle").val();
	var content = $("#sub-description").val();
	var type = selType;
	var alias = [];
	for (var i = 0; i < selList.length; i++) {
		var sel = selList[i];
		alias.push(sel.account);
	}
	var sendTime = $("#begin").val();
	if (!title) {
		layer.alert("主标题不能为空！");
		return;
	}
	if (!content) {
		layer.alert("描述内容不能为空！");
		return;
	}
	if (type == 'customizedcast') {
		if (alias.length == 0) {
			layer.alert("特定用户不能为空！");
			return;
		} else {
			if (alias.length > 50) {
				layer.alert("特定用户个数不能超过50个！");
				return;
			}
		}
	}

	var data = {};
	data['title'] = title;
	data['subtitle'] = subtitle;
	data['content'] = content;
	data['type'] = type;
	data['alias'] = alias;
	var timeval = $('input:radio[name="pushTime"]:checked').val();
	if (timeval == 'timingtime') {
		data['sendTime'] = sendTime;
	}

	request(__requestUrl, data, function(result) {
		if (result.code == 0) {
			layer.alert(result.msg);
			clearAll();
		}
	});
}

function clearAll(argument) {
	$("#title").val('');
	$("#subtitle").val('');
	$("#sub-description").val('');
	selType = 'broadcast';
	// $('')
	var begin = DateUtil.getCurrentDateAll();
	setDate(begin);

	$("input[type='radio'][name='pushPeople']").attr("checked", false); //所有单选按钮都不选中
	$("input[type='radio'][name='pushPeople']").get(0).checked = true; //选中第一个
	$('#userlist').addClass('hidden');

	$("input[type='radio'][name='pushTime']").attr("checked", false); //所有单选按钮都不选中
	$("input[type='radio'][name='pushTime']").get(0).checked = true; //选中第一个
	$('#push-imme').addClass('hidden');

	$('#seluserlist').find('ul').empty();
	$('#seldislist').find('ul').empty();
	$("#account").val('');
	postList = [];
	selList = [];

}

function setDate(begin) {
	$('#begin').val(begin);
}

function pre(argument) {
	if (offset == 0) {
		layer.msg('已经是第一页了');
		return;
	}
	offset = offset - count;
	getUserlist(offset, count);
}

function next(argument) {
	if (postList.length < 30) {
		layer.msg('已经是最后一页了');
		return;
	}
	offset = offset + count;
	getUserlist(offset, count);
}

// 获取列表
function getUserlist(offset, count) {
	var platform = location.href.split("#")[1];
	var url = '/manage/app_settings/user_info.do?type=' + platform + '&offset=' + offset + '&count=' + count;
	// var offsetstr = '&offset=' + offset;
	// var countstr = '&count=' + count;
	// var index = layer.load(2, {
	// 	time: 20*1000,
	// 	shade: [0.2,'#000'] //0.1透明度的白色背景
	// });
	// var index = layer.msg('正在加载',{time:20*1000});
	post(url, {}, function(result) {
		layer.closeAll();
		if (result.code == 0) {
			postList = [];
			postList = result.data;
			$('#seluserlist').find('ul').empty();
			userlistDis(postList);
		}
	});
}

function userlistDis(lists) {
	var htmlstr = '';
	for (var i = 0; i < postList.length; i++) {
		var item = postList[i];
		htmlstr += '<li>' + '<a href="javascript:void(0);" id="userid" user="' + item + '">' + '<span>' + item.account + '</span>' + '<i class="glyphicon glyphicon-ok" style="display:none"></i>' + '</a>' + '</li>';
	}
	$('#seluserlist').find('ul').html(htmlstr);
	refreshSellist(selList);

	// 选择的点击
	$('#seluserlist').off("click").on('click', 'ul li a', function(e) {
		var index = $(this).parent().index();
		var item = postList[index];

		$(this).find('i').toggle();
		// $(this).parent().remove();
		var display = $(this).find('i').css('display');
		if (display == 'none') {
			// 删除
			for (var i = 0; i < selList.length; i++) {
				var sel = selList[i];
				if (sel.userId == item.userId) {
					//selList.remove(i);
					selList.splice(i, 1);
					$('#seldislist').find('ul li').eq(i).remove();
				}
			}

		} else {
			// 添加
			var listr = '<li userid=' + item.userId + '>' + '<a href="javascript:void(0);">' + item.account + '' + '</a>' + '</li>';
			$('#seldislist').find('ul').append(listr);

			selList.push(item);
		}
	});

	// 展示的点击
	$('#seldislist').off('click').on('click', 'ul li a', function(e) {
		$(this).parent().remove();

		// 删除
		var index = $(this).parent().index();
		var delItem = selList[index];
		selList.splice(index, 1);

		refreshSellist(selList);
	});
}

function refreshSellist(selList) {

	for (var i = 0; i < postList.length; i++) {
		$('#seluserlist').find('ul li').eq(i).find('a i').css('display', 'none');
	}
	// 展示的列表刷新
	for (var i = 0; i < postList.length; i++) {
		var post = postList[i];
		for (var j = 0; j < selList.length; j++) {
			var sel = selList[j];
			if (post.userId == sel.userId) {
				$('#seluserlist').find('ul li').eq(i).find('a i').css('display', 'inline-block');
			}
		}
	}
}

function add(argument) {
	var account = $('#account').val();
	if (account == '') {
		layer.msg('请输入用户名!');
		return;
	}
	var data = {
		'username': account,
		'account': account,
		'userid': -1
	};
	for (var i = 0; i < selList.length; i++) {
		var sel = selList[i];
		if (sel.account == data.account) {
			layer.msg('用户已添加');
			return;
		}
	}
	layer.msg('添加成功');
	$('#account').val('');
	selList.push(data);
	// 添加
	var listr = '<li userid=' + data.userId + '>' + '<a href="javascript:void(0);">' + data.account + '' + '</a>' + '</li>';
	$('#seldislist').find('ul').append(listr);
}

$(function() {
	init();
	bindInput();
	hashChange();
});
