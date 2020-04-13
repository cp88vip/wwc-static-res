var vue = new Vue({
	el : '#page-inner',
	data : {
		loading : '',
		lottery_categories : [],
		category : 0,
		index : 0,
		details : [],
		current_category : null
	},
	methods : {
		onLoad : function(e) {
			var that = this;
			that.lottery_categories = [];
			request('/manage/lottery/categories_group.do', {}, function(e) {
				var lottery_categories = [];
				$.each(e.data.categories, function (i, item) {
						if (item.lotteryId != 100001) {
								item.isActive = false;
								lottery_categories.push(item);
						}
				});
				if (lottery_categories.length > 0) {
						lottery_categories[0].isActive = true;
						that.current_category = lottery_categories[0].name;
				}
				that.lottery_categories = lottery_categories;
				that.details = e.data.groups;
			});
		},
		request : function() {
			var that = this;
			that.loading = '正在加载';
			that.details = [];
			request('/manage/lottery/group.do', {lotteryId:this.category}, function(e) {
				that.loading = '';
				if (e.code != 0) {
					that.loading = e.msg;
					return ;
				}
				if (e.data.length == 0) {
					that.loading = '无相关玩法';
					return ;
				}
				that.details = e.data;
			})
		},
		switchCategory : function(category) {
			var len = this.lottery_categories.length;
			this.category = category;
			var lottery_categories = this.lottery_categories;
			for (var i = 0; i < len; i++) {
				if (lottery_categories[i].lotteryId == category) {
					lottery_categories[i].isActive = true;
					this.index = i;
				} else {
					lottery_categories[i].isActive = false;
				}
			}
			this.current_category   = lottery_categories[this.index].name;
			this.lottery_categories = lottery_categories;
			this.request();
		},
		enabled : function(item) {
			var ts = this;
			post('/manage/lottery/enabled_group.do?groupId=' + item.groupId, {}, function(e) {
			if (e.code != 0) {
						layer.msg(e.msg);
						return ;
				}
				ts.$set(item,'enabled',!item.enabled);
				layer.msg("修改成功,因缓存无法实时生效,请稍后留意修改状态")
			});
		},
		updateSort : function(item, i) {
			var ts = this;
			layer.prompt({
				title : '输入排序号,数值越大,越靠前',
				formType : 0,
				maxlength : 4
			}, function(sort, index) {
				var isNoPass = false;
				$.each(ts.details, function (j, log) {
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
					post('/manage/lottery/update_group_sort.do', {
						groupId : item.groupId,
						sort : sort,
					}, function(e) {
						layer.close(index);
						if (e.code == 0) {
							ts.$set(ts.details[i],'sort',sort);
							layer.msg('设置成功! (缓存原因,2分钟后生效,请两分钟留意排序数值)');
						} else {
							layer.msg(e.msg);
						}
					});
				}
			});
		}
	}
})
vue.onLoad();
