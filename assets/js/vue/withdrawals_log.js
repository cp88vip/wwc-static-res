var vue = new Vue({
	el: '#page-wrapper',
	data: {
		logs: [],
		initRequestData: {
			account: null,
			status: -1,
			offset: 0,
			count: 15,
			start: 0,
			end: 0
		},
		initDate: {
			start: null,
			end: null
		},
		totalPages: 0,
		smallAmount: 0.0,
		totalAmount: 0.0,
		currentPage: 1,
		isShowPageNav: false,
		/*start 组件*/
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
		levelOptions: [],
		levels: [],
		/*end*/
		pageNum: 1,
		modal: {
			id: 'editModal'
		},
		shareList: [],
		currentItem: {},
		anotherCode: '',
		anotherPayList: null
		// easyLayer: easyLayer()
	},
	// components: {
	// 	"user-module": userModule
	// },
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
			request('/manage/member/common_levels.do', {}, function(res) {
				var result = res.data;
				$.each(result, function(k, v) {
					that.levels[v.id] = v.name;
				});
			});
			this.request();
			this.getAnotherPayList();
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
			requestOnce('/manage/finance/get_withdrawal_log.do', this.initRequestData, function(e) {
				var len = e.data.record.length;
				var logs = [];
				var data;
				var smallAmount = 0;
				for (var i = 0; i < len; i++) {
					data = e.data.record[i];
					if (data.status == 0) {
						data.css = 'warning';
					} else if (data.status == 1 || data.status == 4) {
						data.css = 'info';
					} else if (data.status == 2 || data.status == 5) {
						data.css = 'success';
					} else if (data.status == 3 || data.status == 6) {
						data.css = 'danger';
					}
					if (data.status == 2 || data.status == 5) {
						smallAmount += data.amount;
					}

					data.amount = data.amount.toFixed(2);
					logs[i] = data;
				}
				// console.log(logs);
				that.smallAmount = smallAmount.toFixed(2);
				var amount = e.data.total.totalAmount ? e.data.total.totalAmount : 0.0;
				that.totalAmount = amount.toFixed(2);
				// 翻页导航
				var totalRows = e.data.total.totalRows;
				that.logs = logs;
				that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
				that.isShowPageNav = that.totalPages > 1;
			})
		},
		query: function() {
			this.currentPage = 1;
			this.initRequestData.offset = 0;
			this.request();
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
			requestOnce('/manage/finance/locked_withdrawals.do', {
				orderId: id
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processed_time = resp.processed_time;
						that.logs[i].status = resp.status;
						that.logs[i].operator = resp.operator;
						that.logs[i].css = 'info';
						break;
					}
				}
			});
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
		successful: function(id) {
			var that = this;
			requestOnce('/manage/finance/withdrawals_action.do', {
				status: 2,
				orderId: id
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processedTime = resp.processedTime;
						that.logs[i].status = resp.status;
						that.logs[i].css = 'success';
						that.logs[i].remark = resp.remark;
						break;
					}
				}
				that.request();
			});
		},
		failed: function(id) {
			var that = this;
			requestOnce('/manage/finance/withdrawals_action.do', {
				status: 3,
				orderId: id
			}, function(e) {
				layer.msg('操作成功');
				var len = that.logs.length;
				var resp = e.data;
				for (var i = 0; i < len; i++) {
					if (that.logs[i].orderId == id) {
						that.logs[i].processedTime = resp.processedTime;
						that.logs[i].status = resp.status;
						that.logs[i].css = 'info';
						break;
					}
				}
				that.request();
			});
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
			requestOnce('/manage/system_settings/exp_withdrawal_excel.do', this.initRequestData, function(e) {
				console.log(e);
				location.href = e.data;
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
		showUserInfo: function(username) {
			var that = this;
			//清空member data
			for (var e in that.member) {
				if (that.member.hasOwnProperty(e)) {
					if (e == "level") {
						that.member[e] = -1;
					} else if (e == "enabled" || e == "rechargeNum" || e == "rechargeTotal" || e == "withdrawalTotal" || e == "withdrawalNum") {
						that.member[e] = 0;
					} else if( e == "levelId"){
						that.member[e] = 1;
					} 
					else {
						that.member[e] = null;
					}
				}
			}
			//获取用户信息
			postOnce('/manage/member/user_info.do', {
				account: username
			}, function(res) {
				// showUserInfo(e.data);
				// var user = res.data;
				// infoIndex = layer.open({
				//     type: 1,
				//     skin: 'layui-layer-rim', //加上边框
				//     area: ['80%', '56%'], //宽高
				//     closeBtn: 0, //不显示关闭按钮
				//     shadeClose: true, //开启遮罩关闭
				//     title:'查看会员详细信息',
				//     content: '<div class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">登录账号</td><td style="text-align: left;">'+user.account+'</td><td style="text-align: right;font-weight:bold;">所属上级</td><td style="text-align: left;">'+user.agent+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">会员姓名</td><td style="text-align: left;">'+user.username+'</td><td style="text-align: right;font-weight:bold;">类别</td><td style="text-align: left;">会员</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">会员余额</td><td style="text-align: left;">'+user.balance+'</td><td style="text-align: right;font-weight:bold;">积分</td><td style="text-align: left;">0</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">状态</td><td style="text-align: left;">'+(user.enabled == 1 ? '启用' : '禁用')+'</td><td style="text-align: right;font-weight:bold;">会员等级</td><td style="text-align: left;">'+user.level+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">电话</td><td style="text-align: left;">'+user.phone+'</td><td style="text-align: right;font-weight:bold;">微信号</td><td style="text-align: left;">'+user.wechat+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">QQ</td><td style="text-align: left;">'+user.qq+'</td><td style="text-align: right;font-weight:bold;">邮箱</td><td style="text-align: left;">-</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">银行账号</td><td colspan="3" style="text-align: left;">'+user.bankAccount+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">取现银行</td><td style="text-align: left;">'+user.receivingBank+'</td><td style="text-align: right;font-weight:bold;">银行地址</td><td style="text-align: left;">'+user.bankAddress+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">注册IP</td><td style="text-align: left;">'+user.registrationIp+'</td><td style="text-align: right;font-weight:bold;">设备号</td><td style="text-align: left;">'+user.deviceId+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">注册系统</td><td style="text-align: left;">'+user.client+'</td><td style="text-align: right;font-weight:bold;">最后登录时间</td><td style="text-align: left;">'+user.lastLoginTime+'</td></tr>'+
				//     '<tr><td style="text-align: right;font-weight:bold;">备注</td><td colspan="3" style="text-align: left;">'+(user.remark? user.remark : '')+'</td></tr>'+
				//     '<tr><td colspan="4"><button onclick="layer.closeAll()" class="btn btn-xs btn-default">关闭</button></td></tr>'+
				//     '</tbody></div></div>'
				// });
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
		markDown: function(orderId, msg) {
			var that = this;
			if (msg.remark) {
				var text = msg.remark;
			} else {
				var text = "";
			}
			var textId = "remarkText";
			var infoIndex = layer.open({
				type: 1,
				skin: 'layui-layer-rim',
				//加上边框
				area: ['40%', '28%'],
				//宽高
				closeBtn: 0,
				//不显示关闭按钮
				shadeClose: true,
				//开启遮罩关闭
				title: '修改备注',
				content: '<div id="' + textId + '" class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>' +
				'<tr><td style="text-align: right;font-weight:bold;">备注</td><td colspan="3" style="text-align: left;"><textarea class="form-control" style="min-height:100px;" name="remark">' + text +
				'</textarea></td></tr>' + '<tr><td colspan="4"><button class="btn btn-xs btn-info btn-edit">修改</button><button onclick="layer.closeAll()" class="btn btn-xs btn-default" style="margin-left:15px;">关闭</button></td></tr>' +
				'</tbody></div></div>'
				//'<tr><td colspan="4"><button onclick="layer.close(infoIndex)" class="btn btn-xs btn-default">关闭</button></td></tr>'+
			});
			$("#" + textId).find(".btn-edit").off("click").on("click", function(e) {
				// console.log(e);
				var _table = $("#" + textId + " table"),
					_textarea = _table.find('textarea');
				if (trim(_textarea.val()).length == 0) {
					layer.msg('备注不能为空');
					return false;
				}
				//url /manage/finance/withdrawals_action.do
				requestOnce('/manage/finance/add_remark.do', {
					orderId: orderId,
					remark: _textarea.val()
				}, function(e) {
					//备忘修改
					if (e.code == 0) {
						layer.msg('备注修改成功');
						// var len = that.logs.length;
						var resp = e.data;
						// for(var i=0; i<len; i++) {
						// 	if(that.logs[i].orderId == id) {
						// 		that.logs[i].remark = resp.remark;
						// 		break;
						// 	}
						// }
						setTimeout(function() {
							// that.clearMember();
							layer.closeAll();
							that.request();
						}, 1800);
					}
				});
			});
		},
		showAnother: function (log) {
			var _ts = this;
			this.currentItem = log;
			$("#anotherModal").modal();
			for(var key in _ts.anotherPayList) {
				if (log.payer == _ts.anotherPayList[key]) {
					_ts.anotherCode = key;
				}
			}
		},
		getAnotherPayList: function () {
				var _ts = this;
				request('/manage/finance/onlineProxyPayAvailable_list.do', {}, function (e) {
						console.log(e)
						if (e.code == 0) {
								_ts.anotherPayList = e.data.onlinePayList;
						}
				});
		},
		queryOrder: function (log) {
			var _ts = this;
			var postData = {
				thirdName: log.payer,
				id: log.id
			};
			requestOnce('/proxyPay/queryProxyPayOrder.do', postData, function (e) {
				console.log(e)
				layer.msg(e.msg);
				setTimeout(function(){
					layer.closeAll();
					_ts.request();
				},2000)
		});
		},
		person: function(log, num) {
			var _ts = this;
			var postData = {
				id: log.id,
				finalState: num
			};
			requestOnce('/proxyPay/orderPaymentedManual.do', postData, function (e) {
				console.log(e)
				layer.msg(e.msg);
				setTimeout(function(){
					layer.closeAll();
					_ts.request();
				},2000)
			})
		},
		replacePay: function () {
			var _ts = this;
			if (_ts.anotherCode == '' || _ts.anotherCode == null) {
				layer.msg('请选择第三方代付');
				return;
			}
			if (_ts.currentItem.id == undefined || _ts.currentItem.id == '' || _ts.currentItem.id == null) {
				layer.msg('当前记录不能成功设置第三方代付');
				return;
			}
			var postData = {
				thirdCode: _ts.anotherCode,
				withdrawalRecordId: _ts.currentItem.id
			};
			requestOnce('/proxyPay/proxyPay.do', postData, function (e) {
				console.log(e)
				layer.msg(e.msg);
				setTimeout(function(){
					layer.closeAll();
					_ts.request();
				},2000)
		});
		}
	},
	created: function() {
		$(document).keyup(function(event) {
			if (event.keyCode == 13) { //|| event.keyCode == 32
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
		},
		remarkFilter: function(val) {
			if (val.length > 14) {
				return val.substring(0,14) + '...'
			} else {
				return val
			}
		}
    }
});

vue.onLoad();
