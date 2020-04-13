var vue = new Vue({
	el : '#page-wrapper',
	data : {
		items : []
	},
	methods : {
		onLoad : function() {
			var that = this;
      that.request();
		},
    request :function () {
      var that = this;
      request('/manage/lottery/categories.do', {}, function(e) {
        that.items = e.data;
      })
    },
		enabled : function(lotteryId,index) {
			var that = this, enabled = that.items[index].enabled;
			post('/manage/lottery/enabled_category.do?lotteryId='+lotteryId, {}, function(e) {
				layer.msg("修改成功,因缓存无法实时生效,请稍后留意修改状态");
        that.items[index].enabled = !enabled;
			});
		},
		updateSort : function(item,i) {
			var ts = this;
			layer.prompt({
				title : '输入排序号,数值越大,越靠前',
				formType : 0,
				maxlength : 4
			}, function(sort, index) {
				var isNoPass = false;
				$.each(ts.items, function (j, log) {
					if (!isInteger(sort)) {
						layer.msg('请输入数字！',{time : 1000});
						isNoPass = true;
					} else {
						if (parseInt(sort) <= 0) {
							layer.msg('请输入正确的排序数字',{time : 1000});
							isNoPass = true;
						} else if (log.sort == parseInt(sort)) {
							layer.msg('请输入与其它排序不同的数字！',{time : 1000});
							isNoPass = true;
						}
					}
				});
				if (!isNoPass) {
					post('/manage/lottery/update_category_sort.do', {
						lotteryId : item.lotteryId,
						sort : parseInt(sort),
					}, function(e) {
						layer.close(index);
						if (e.code == 0) {
							ts.$set(ts.items[i],'sort',sort);
							layer.msg('设置成功! (缓存原因,2分钟后生效,请两分钟留意排序数值)');
						} else {
							layer.msg(e.msg);
						}
					});
				}
			});
		}
	}
});
vue.onLoad();
