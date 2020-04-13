var vue = new Vue({
	el: '#page-wrapper',
	data: {
		logs: [],
		initRequestData: {
			account: null,
			type: 0,
			offset: 0,
			count: 15,
			start: 0,
			end: 0
		},
		initDate: {
			start: null,
			end: null
		},
		pageNum: 1,
		member: {
			account: null,
			username: null,
			agent: null,
			balance: null,
			password: null,
			repassword: null,
			phone: null,
			QQ: null,
			wechat: null,
			level: -1,
			bankName: null,
			bankAccount: null,
			bankAddress: null,
			remark: null,
			registrationIp: null,
			deviceId: null,
			enabled: 0,
			rechargeNum: 0,
			rechargeTotal: 0,
			withdrawalNum: 0,
			withdrawalTotal: 0,
			client: null,
			lastLoginTime: null,
			receivingBank: null,
			lastLoginIp:null,
            ladtLoginAddress:null,
            payee:null,
            code: null,
			levelId: 1,
			createdTime: null
		},
		action: null,
		modal: {
			id: 'editModal'
		},
		options: [{
			name: '全部类型',
			id: 0
		}, {
			name: '充值',
			id: 1
		}, {
			name: '提款',
			id: 2
		}, {
			name: '购彩',
			id: 3
		}, {
			name: '派奖',
			id: 4
		}, {
			name: '每日加奖',
			id: 5
		}, {
			name: '返点',
			id: 6
		}, {
			name: '手动加款',
			id: 7
		}, {
			name: '手动减款',
			id: 8
		}, {
			name: '赠送彩金',
			id: 9
		}, {
			name: '注册赠送',
			id: 10
		},{
			name: '撤单',
			id: 11
		},{
			name: '晋级奖励',
			id: 21
		},{
			name: '红包支出',
			id: 22
		},{
			name: '红包收入',
			id: 23
		},{
			name: '红包退回',
			id: 24
		},{
			name: '转出',
			id: 25
		},{
			name: '转入',
			id: 26
		}],
		types: {
			s1: '充值',
			s2: '提款',
			s3: '购彩',
			s4: '派奖',
			s5: '每日加奖',
			s6: '返点',
			s7: '手动加款',
			s8: '手动减款',
			s9: '赠送彩金',
			s10: '注册赠送',
			s11: '撤单',
			s20: '代理结算',
			s21: '晋级奖励',
			s22: '红包支出',
			s23: '红包收入',
			s24: '红包退回',
			s25: '转出',
			s26: '转入'
		},
		levels: [],
		levelOptions: [],
		totalPages: 0,
		currentPage: 1,
		totalRows: 0,
		isShowPageNav: false,
		shareList: []
	},
	methods: {
		onLoad: function() {
			if (location.hash && location.hash.startsWith("#account_")) {
				this.initRequestData.account = location.hash.substring(9);
			}
			location.hash = '';
			var that = this;
			$(".form_datetime_start").datetimepicker({
				format: 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
			}).on('changeDate', function(ev) {
				that.initDate.start = ev.target.value
			});
			$(".form_datetime_end").datetimepicker({
				format: 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
			}).on('changeDate', function(ev) {
				that.initDate.end = ev.target.value
			});
			var currentDate = getCurrentDate();
			this.initDate.start = currentDate + " 00:00:00";
			this.initDate.end = currentDate + " 23:59:59";
			request('/manage/member/common_levels.do', {}, function(res) {
				var result = res.data;
				$.each(result, function(k, v) {
					that.levels[v.id] = v.name;
				});
			});
			this.request();
		},
		request: function() {
			// 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
			var start = this.initDate.start.replace(/-/g, "/");
			var end = this.initDate.end.replace(/-/g, "/");
			this.initRequestData.start = new Date(start).getTime();
			this.initRequestData.end = new Date(end).getTime();
			var reg = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]|[0-9][1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
			if(!this.initDate.start || !this.initDate.end){
				layer.msg('开始时间与结束时间不能为空');
				return false;
			}
			if(Date.parse(trim(this.initDate.start))>Date.parse(trim(this.initDate.end))){
                layer.msg('开始时间不能大于结束时间！');
                return false;
            }
			if(!reg.test(trim(this.initDate.start)) || !reg.test(trim(this.initDate.end))) {
                layer.msg('请输入正确的时间！');
                return false;
            }
			var that = this;
			that.initRequestData.account = that.initRequestData.account == "" ? null : that.initRequestData.account;
			requestOnce('/manage/finance/get_account_change.do', this.initRequestData, function(e) {
				var data;
				var logs = [];
				var len = e.data.length;
				for (var i = 0; i < len; i++) {
					data = e.data[i];
					data.type = that.types["s" + data.type];
					data.beforeAmount = data.beforeAmount;
					data.afterAmount = data.afterAmount;
					data.variableAmount = data.variableAmount;
					logs[i] = data;
				}
				that.logs = logs;
				var totalRows = e.totalRows;
				that.totalRows = totalRows;
				that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
				that.isShowPageNav = that.totalPages > 1;
			});
		},
		query: function() {
			this.currentPage = 1;
			this.initRequestData.offset = 0;
			this.request();
		},
		countChange: function() {
			this.initRequestData.offset = 0;
			this.currentPage = 1;
			this.initRequestData.count = parseInt(this.initRequestData.count);
			this.request();
		},
		openShareList: function(id) {
            var that = this;
            if (!id || id == "" || id == 0) {
                return false;
            }
            requestOnce('/manage/member/share_list.do', { id: id }, function(data) {
                that.shareList = data.data;
                $("#shareModal").modal();
            });
        },
		doDate: function(name) {
			this.initRequestData.offset = 0;
			this.currentPage = 1;
			switch (name) {
				case "toDay":
					var currentDate = getCurrentDate();
					this.initDate.start = currentDate + " 00:00:00";
					this.initDate.end = currentDate + " 23:59:59";
					break;
				case "thisWeek":
					this.initDate.start = getWeekStartDate() + " 00:00:00";
					this.initDate.end = getWeekEndDate() + " 23:59:59";
					break;
				case "thisMonth":
					this.initDate.start = getMonthStartDate() + " 00:00:00";
					this.initDate.end = getMonthEndDate() + " 23:59:59";
					break;
				case "yesterday":
					var yesterday = getYesterdayDate();
					this.initDate.start = yesterday + " 00:00:00";
					this.initDate.end = yesterday + " 23:59:59";
					break;
				case "lastWeek":
					this.initDate.start = getLastWeekStartDate() + " 00:00:00";
					this.initDate.end = getLastWeekEndDate() + " 23:59:59";
					break;
				case "lastMonth":
					this.initDate.start = getLastMonthStartDate() + " 00:00:00";
					this.initDate.end = getLastMonthEndDate() + " 23:59:59";
					break;
				default:
					break;
			}
			this.request();
		},
		pageNav: function(p) {
			if (p < 1 || p > this.totalPages) return;
			this.currentPage = p;
			this.initRequestData.offset = (p - 1) * this.initRequestData.count;
			this.request();
		},
		pageCul: function(curr) {
			var curr = parseInt(curr);
			if (curr > this.totalPages - 9) {
				var p = this.totalPages;
				return [p - 9, p - 8, p - 7, p - 6, p - 5, p - 4, p - 3, p - 2, p - 1, p];
			} else if (curr < 10) {
				return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			} else {
				return [curr - 5, curr - 4, curr - 3, curr - 2, curr - 1, curr, curr + 1, curr + 2, curr + 3, curr + 4]
			}

		},
		showUserInfo: function(username) {
			var that = this;
			for (var e in that.member) {
				if (that.member.hasOwnProperty(e)) {
					if (e == "level") {
						that.member[e] = -1;
					} else if (e == "enabled" || e == "rechargeNum" || e == "rechargeTotal" || e == "withdrawalTotal" || e == "withdrawalNum") {
						that.member[e] = 0;
					} else if( e == "levelId"){
						that.member[e] = 1;
					} else {
						that.member[e] = null;
					}
				}
			}
			postOnce('/manage/member/user_info.do', {
				account: username
			}, function(res) {
				// showUserInfo(e.data);
				that.action = "show";
				var _data = res.data;
				for (var eh in _data) {
					if (_data.hasOwnProperty(eh)) {

						for (var ea in that.member) {
							if (that.member.hasOwnProperty(ea)) {
								if (eh == ea) {
									that.member[ea] = _data[eh];
								}
							}
						}

					}
				}
				that.member.bankName = _data.receivingBank;
				$("#" + that.modal.id).modal();
			});

		}
	},
	created: function() {
		$(document).keyup(function(event) {
			if (event.keyCode == 13) {
				vue.query();
			}
		});
	},
	filters: {
        levelFileter: function(val) {
            return "VIP" + val;
		},
		newName: function(val) {
            if (val == 'FrequentLottery') {
                return "时时彩";
            }
            if (val == 'QuickThree') {
                return "快3";
            }
            if (val == 'ElevenPickFive') {
                return "11选5";
            }
            if (val == 'Three') {
                return "排列3";
            }
            if (val == 'PCEggs') {
                return "快乐8";
            }
            if (val == 'PK10') {
                return "北京赛车";
            }
            if (val == 'SixMark') {
                return "六合彩";
            }
        }
    }
});

vue.onLoad();
