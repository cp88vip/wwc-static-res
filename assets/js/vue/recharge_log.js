var vue = new Vue({
	el: '#page-wrapper',
	data: {
		logs: [],
		initRequestData: {
			// order_id: null,
			account: null,
			// payment_platform: null, //支付种类？
			type: -1,
			status: -1,
			manual: null,
			offset: 0,
			count: 15,
			start: 0,
			end: 0,
			payMethod:null
		},
		initDate: {
			start: null,
			end: null
		},
		options: {
			type: [{
				name: '全部类型',
				value: -1
			}, {
				name: '第三方支付',
				value: 1
			}, {
				name: '银行入款',
				value: 2
			}, {
				name: '快速入款',
				value: 3
			}, {
				name: '手工加款',
				value: 7
			}],
			status: [{
				name: '全部状态',
				value: -1
			}, {
				name: '未处理',
				value: 0
			}, {
				name: '处理中',
				value: 1
			}, {
				name: '充值成功',
				value: 2
			}, {
				name: '充值失败',
				value: 3
			}],
			manual: [{
				name: '全部处理方式',
				value: null
			}, {
				name: '系统处理',
				value: false
			}, {
				name: '手动处理',
				value: true
			}]
		},
		onlinePay:[
			{value:null,name:'全部支付方式'},
			{value:0,name:'银行卡'},
			{value:1,name:'支付宝'},
			{value:2,name:'微信'},
			{value:4,name:'QQ钱包'},
			{value:8,name:'网银'},
			{value:16,name:'银联'},
			{value:32,name:'京东钱包'},
			{value:64,name:'快捷支付'},
			{value:128,name:'百度钱包'},
			{value:256,name:'云闪付'},
		],
		onlinePay2:[
			{value:null,name:'全部支付方式'},
			{value:1,name:'支付宝'},
			{value:2,name:'微信'},
			{value:4,name:'QQ钱包'},
			{value:16,name:'银联'},
			{value:32,name:'京东钱包'},
			{value:128,name:'百度钱包'},
			{value:256,name:'云闪付'},
		],
		totalPages: 0,
		smallAmount: 0.0,
		totalAmount: 0.0,
		currentPage: 1,
		isShowPageNav: false,
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
            levelId:null,
			code:null,
			createdTime: null
		},
		action: null,
		levelOptions: [],
		levels: [],
		modal: {
			id: 'editModal'
		},
		pageNum: 1,
		shareList: []
	},
	filters:{
		paymentFormat:function(val){
			if(!val) return ''
			return val.replace(/&/g,'\n');
		},
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
	},
	methods: {
		onLoad: function(e) {
			var that = this;
			$(".form_datetime_start").datetimepicker({
				format: 'yyyy-mm-dd hh:ii:ss'
			}).on('changeDate', function(ev) {
				that.initDate.start = ev.target.value
			});
			$(".form_datetime_end").datetimepicker({
				format: 'yyyy-mm-dd hh:ii:ss'
			}).on('changeDate', function(ev) {
				that.initDate.end = ev.target.value
			});
			var currentDate = getCurrentDate();
			this.initDate.start = currentDate + " 00:00:00";
			this.initDate.end = currentDate + " 23:59:59";
			// 提取用户账号参数
			url = window.location.href;
			if (url.indexOf('#') != -1) {
				this.initRequestData.account = url.split('#')[1];
			}
			request('/manage/member/common_levels.do', {}, function(res) {
				var result = res.data;
				$.each(result, function(k, v) {
					that.levels[v.id] = v.name;
				});
			});
			this.request();

		},
		// trimStr: function(ev, key) {
		// 	var _element = ev.currentTarget;
		// 	console.log(_element);
		// 	var _str = trim($(_element).val());
		// 	this.initRequestData[key] = _str;
		// },
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
			requestOnce('/manage/finance/get_recharge_log.do', this.initRequestData, function(e) {
				var len = e.data.records.length;
				var logs = [];
				var data;
				var smallAmount = 0;
				for (var i = 0; i < len; i++) {
					data = e.data.records[i];
					if (data.status == 0) {
						data.css = 'warning';
					} else if (data.status == 1) {
						data.css = 'info';
					} else if (data.status == 2) {
						data.css = 'success';
					} else if (data.status == 3) {
						data.css = 'danger';
					}
					// if (data.status == 2) {
						smallAmount += data.amount*1;
					// }
					data.amount = data.amount.toFixed(2);
					logs[i] = data;
				}
				that.smallAmount = smallAmount.toFixed(2);
				var amount = e.data.total.totalAmount ? e.data.total.totalAmount : 0.0;
				that.totalAmount = amount.toFixed(2);
				// 翻页导航
				var totalRows = e.data.total.totalRows;
				that.logs = logs;
				that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
				that.isShowPageNav = that.totalPages > 1;
			});
		},
		query: function() {
			this.currentPage = 1;
			this.initRequestData.offset = 0;
			// this.initRequestData.type = 0;
			var that= this;

			// if(that.initRequestData.type==2){
			// 	that.initRequestData.payMethod=0;
			// }
			this.request();
		},
		download: function() {
			this.currentPage = 1;
			this.initRequestData.offset = 0;
			this.downloadReq();
		},
		downloadReq: function() {
			// 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
			var start = this.initDate.start.replace(/-/g, "/");
			var end = this.initDate.end.replace(/-/g, "/");
			this.initRequestData.start = new Date(start).getTime();
			this.initRequestData.end = new Date(end).getTime();

			var that = this;
			requestOnce('/manage/system_settings/exp_recharge_excel.do', this.initRequestData, function(e) {
				console.log(e);
				location.href = e.data;
			});

		},
		countChange: function() {
			// console.log(this.initRequestData.count);
			this.initRequestData.offset = 0;
			this.currentPage = 1;
			this.initRequestData.count = parseInt(this.initRequestData.count);
			this.request();
		},
		doDate: function(name) {
			this.currentPage = 1;
			this.initRequestData.offset = 0;
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
		locked: function(id) {
			var that = this;
			requestOnce('/manage/finance/locked_recharge.do', {
				orderId: id
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processed_time = resp.processedTime;
						that.logs[i].status = resp.status;
						that.logs[i].operator = resp.operator;
						that.logs[i].manual = resp.manual;
						that.logs[i].css = 'info';
						break;
					}
				}
			});
		},
		successful: function(id) {
			var that = this;
			requestOnce('/manage/finance/recharge_action.do', {
				orderId: id,
				status: 2
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processedTime = resp.processedTime;
						that.logs[i].status = resp.status;
						that.logs[i].css = 'success';
						break;
					}
				}
				that.request();
			});
		},
		failed: function(id) {
			var that = this;
			requestOnce('/manage/finance/recharge_action.do', {
				orderId: id,
				status: 3
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processedTime = resp.processedTime;
						that.logs[i].status = resp.status;
						that.logs[i].css = 'danger';
						that.logs[i].remark = resp.remark;
						break;
					}
				}
				that.request();
			});
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
	},
	watch:{
		'initRequestData.type':function(val,oldval){
			var that = this;
			if(val==3){
				that.initRequestData.payMethod = null;
			}
		}
	},
	created: function() {
		$(document).keyup(function(event) {
			if (event.keyCode == 13) { // || event.keyCode == 32
				vue.query();
			}
		});
	},
	// watch:{
	// 	'initRequestData.type':function(val,oldval){
	// 		this.initRequestData.payMethod='';
	// 	}
	// }
});

vue.onLoad();
