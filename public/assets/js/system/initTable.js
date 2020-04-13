var Game = {};
Game.Table = function(cfg) {
	var defCfg = {
		method : 'post',
		cache : false,
		striped : true,
		pagination : true,
		// sortOrder: "asc",
		pageList : [ 20, 25, 50, 100 ],
		contentType : "application/json; charset=utf-8",
		ajaxOptions:{
				// headers: {"content-encoding": "gzip"}
				headers: {"sessionid": $.cookie("sessionid")},
				'temporary-sessionId':  $.cookie("temporaryId")
    },
		pageSize : 20,
		pageNumber : 1,
		queryParamsType : null,
		sidePagination : 'server',// 设置为服务器端分页
		showRefresh : true,
		showColumns : true,
		showToggle : false,
		minimumCountColumns : 2,
		onLoadSuccess: function(e){  //加载成功时执行
			// console.log("sdsdsds");
      if (e.code != 0 ) {
        if (e.code >= 300 && e.code < 400) {
  				layer.msg(e.msg);
  			} else if (!(e.code == 0 || e.code == 101)) {
  				layer.msg(e.msg);
  			} else {
  				layer.msg(e.msg);
  			}
      }
    },
    onLoadError: function(){  //加载失败时执行
      layer.msg("加载数据失败");
    }
  }
	for ( var key in defCfg) {
		if (cfg[key] === undefined) {
			cfg[key] = defCfg[key];
		}
	}
	return $('#' + cfg.id).bootstrapTable(cfg);
};
