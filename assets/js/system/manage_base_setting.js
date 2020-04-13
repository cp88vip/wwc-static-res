$(function(){
    // 获取域名配置
    var hostsInf={
        description: "网站域名",
        groupId: 2,
        id: "a2",
        remark: "LIMIT_OF_IP",
        value: "a2",
    };

    request('/manage/system_settings/get_all_config.do',{},function(result) {
        if (result.code == 0) {
            // 封装下数据
            var final =	handlerData(devergeData(result));
            initXeditable(final);////页面显示及事件监听
        }else {
            layer.msg(result.msg);
        }
    });


});

// 转换数据
function devergeData(data) {
	var lists = [];
	for (var i = 0; i < data.data.length; i++) {
		var item = data.data[i];
		var newItem = {};
		if(item.groupId == 1){
        newItem.groupName = "在线客服配置";
    }
    if(item.groupId == 2){
        newItem.groupName = "系统设置";
    }
    if(item.groupId == 3){
        newItem.groupName = "首页设置";
    }
    if(item.groupId == 4){
        newItem.groupName = "彩票配置";
    }
		newItem.groupId = item.groupId;
		newItem.name = item.description;
		newItem.title = (item.tip)?item.tip:item.description;
		newItem.configId = item.id;
		newItem.id = item.id;
		newItem.value = item.value;
		newItem.remark = item.remark;
		newItem.type = item.type;

		if (newItem.type === 'select') {
      if (item.reserve) {
        newItem.source = item.reserve;
      }
		}
    lists.push(newItem);
	}
	return {"confs":lists};
}
//新数组数据封装
function handlerData(data){
	var gps = [];
	var groupMap = {
		0 : {
			id : 0,
			name : "其他",
			sons : []
		}
	};
	for (var i = 0; i < data.confs.length; i++) {
		var c = data.confs[i];
		if(c.type && c.type=='datetime'){
			c.type='combodate';
		}
		if (c.groupId) {
			if (groupMap[c.groupId]) {
				groupMap[c.groupId].sons.push(c);
			} else {
				var gp = {
					id : c.groupId,
					name : c.groupName,
					sons : []
				};
				groupMap[c.groupId] = gp;
				gp.sons.push(c);
				gps.push(gp);
			}

		} else {
			groupMap[0].sons.push(c);
		}
	}
	if (groupMap[0].sons.length > 0) {
		gps.push(groupMap[0]);
	}

	data.gps = gps;
	return data;
}

function initXeditable(data){
	var contentHtml = '';

	for (var i = 0; i < data.gps.length; i++) {
		 var gp = data.gps[i];

		 var tbodyHtml = '';
		 for (var j = 0; j <  gp.sons.length; j++) {
		   var conf = gp.sons[j];
       // console.log(conf);
		   tbodyHtml +=  "<tr><td width=\"30%\" class=\"text-center\">"+conf.name+"</td>";
       tbodyHtml +=  "<td width=\"70%\">";
       tbodyHtml += "<a style=\"word-break: break-all;display:inline-block;\" href=\"#\" id=\"" + conf.configId + "\" data-type=\"" + conf.type + "\" data-value=\"" + $.trim(conf.value) + "\" data-pk=\"" + conf.id + "\"" + " data-title=\"" + conf.title + "\"  data-source='" + conf.source + "' data-remark=\"" + conf.remark + "\">" + conf.expand + "</a>";
       tbodyHtml +=  "</td></tr>";
		 }

			contentHtml += '<div class="panel panel-default">'
					+'<div class="panel-heading"><a role="button" data-toggle="collapse" href="#config_list_collapse_'+gp.id+'"'
					+'aria-expanded="true" aria-controls="config_list_collapse_'+gp.id+'">'+gp.name+'</a></div>'
					+'<div class="collapse in" id="config_list_collapse_'+gp.id+'"><div class="panel-body">'
					+'<table class="table table-bordered table-striped">'
					+'<tbody>'
					+tbodyHtml
					+'</tbody></table></div></div></div>';
	}
  //字符串显示
	$("#config_list_content_id").html(contentHtml);

	$("#config_list_content_id").find("a").each(function() {
		var options = {
				url : '/manage/system_settings/update_config.do',//修改配置链接
				emptytext : '无配置',
				params : setParams,
				placement : 'right',
				ajaxOptions:{
					type:'post',
					dataType:'json',
					headers: {
							"sessionid": $.cookie("sessionid"),
							"temporary-sessionId": $.cookie("temporaryId") || null,
							"Content-type": "application/json; charset=utf-8"
					},
					success:function(response, newValue){
						if (response.code == '0') {
							layer.msg("修改成功");
						}else {
							layer.msg(response.msg);
							return;
						}
					},
					error:function(rsp) {
            rsp.statusText = "修改失败";
					}
				},
        display: function(value) {
          var type = $(this).attr('data-type');
          var _remark = $(this).attr("data-remark");
          if (type == 'select') {
              var sels = $(this).attr('data-source');
              var list = JSON.parse(sels);
              for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.hasOwnProperty(value)) {
                  $(this).text(item[value]);
                }
              }
          } else {
          	$(this).text(value);
          }
        }
			},
			type = $(this).attr("data-type"),
			source = $(this).attr("data-source"),
			val = $(this).attr("data-value");
		if (val !== undefined && val !== "") {
			$(this).html(val.replace(/</g,"&lt;"));
		}
		if (type === 'select') {
			options.source = source;
			var arr = eval(source);
			for (var i = 0; i < arr.length; i++) {
				var obj = arr[i];
				if (obj[val] !== undefined) {
					$(this).html(obj[val]);
					break;
				}
			}
		} else if (type === 'combodate') {
			var fmt = 'HH:mm'
				,cdconf={
					format : fmt
	                ,minYear: 2015
	                ,maxYear: 2030
	                ,minuteStep: 1
				};
			if (source) {
				var src = eval("(" + source + ")");
				for ( var key in src) {
					if (key != "format") {
						cdconf[key] = src[key];
					}
				}
			}
			options.template = fmt;
			options.format = fmt;
			options.viewformat = fmt;
			options.combodate = cdconf;
		} else if (type === 'textarea') {
			options.placement = 'top';
		}
		$(this).editable(options);//配置插件，实现数据修改
	});
}

function setParams(params) {
	console.log(params)
	var newParams = {};
  var _t = $(this);
  if (!params.value || params.value.length == 0) {
    layer.msg("设置项不能为空");
    return ;
  }
  // TODO 手机限制验证
  var _remark = _t.attr("data-remark");
  // if (_remark == "LIMIT_OF_PHONE") {
  //   if (!/^[\d]+(\.[\d]{1,2})?$/.test(params.value)) {
  //     layer.msg("手机限制项请输入数字");
  //     return ;
  //   }
  // }
  if (_remark == "MINIMUM_LIMIT" || _remark == "RED_PACKET_TOTAL") {
    if (!/^[\d]+(\.[\d]{1,2})?$/.test(params.value)) {
      layer.msg("只能输入数字（可保留两位小数）");
      return ;
    }
	}

	if (_remark == "WITHDRAWAL_COUNT" || _remark == "LIMIT_OF_PHONE" || _remark == "LIMIT_OF_IP" || _remark == "RED_PACKET_NUMBER") {
		if (!/^[0-9]*$/.test(params.value)) {
      layer.msg("只能输入数字");
      return ;
    }
	}
	if (_remark == "RED_PACKET_TOTAL") {
		if (params.value < 2) {
			layer.msg("单个红包最大金额不能小于2");
      return ;
		}
	}

	newParams.configValue = $.trim(params.value);
	newParams.id = _t.attr("id");
  //参数提交格式化
	return JSON.stringify(newParams);
}
