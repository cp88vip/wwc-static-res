
$(function () {
	var vm = new Vue({
		el: '#new_act',
		data() {
			return {
				listData: {
					category: [],
					list: []
				},
				show: false,
				details: ['邀请奖', '直属下级打码', '新人礼包', '新人礼包1', '新人礼包2', '新人礼包3'],
				detailsShow: false,
				tag: 'all',
				activ: 'all',
				dz: false,
				opt: [],
				select: 0,
				proid: null,
				rednum: null,
				data: null,
				code: null,
				lookshow: false,
				user: null,
				userid: Utils.getStorage('userInfo') ? Utils.getStorage('userInfo').userId : 0,
				flag: null,
				promotionAward: 0,
				jjbl: 0,
				kdjj: 0,
				UserVipLevel: [],
				AwardRecord: [],
				vip4hj: "(x + x + x) * 110%",
				subVip4hj: "(x + x) * 110%",
				btn1Text: '不可领取',
				btn2Text: '不可领取',
				dis1: 0,
				dis2: 0,
				topPrice: 0,
				rankshow: false,
				everday: false,
				award: false,
				liLength: null,
				obj: null,
				html: null,

				width: null,
				cos: null,
				moneyModal: false,
				getMoney: 0

			}
		},
		created() {
			Utils.request('front/promotion/getCategoryList.do', { 'userid': this.userid }, res => {
				this.listData.category = res.data.category
			})
			this.getActivityList()
			this.rank();

		},
		methods: {
			getActivityList() {
				Utils.request('front/promotion/getPromotionInfoList.do', { 'userid': this.userid }, res => {
					this.listData.list = res.data
				})
			},
			operationHandler({ promotionType, receiveStatus, promotionCode, id }) {
				if (promotionCode === 'RISELEVEL_AWARD') {
					this.award = !this.award
					return
				}
				if (promotionCode === 'EVERYDAY_AWARD') {
					this.everday = !this.everday
					return
				}

				// 联系客服
				if (promotionType === 6) {
					const serviceUrl = Utils.getStorage('serviceUrl')
					if (serviceUrl) {
						window.open(serviceUrl)
					}
				}

				if (promotionCode !== 'EVERYDAY_AWARD' && promotionCode !== 'RISELEVEL_AWARD') {
					this.lookdetails({ id, promotionCode })
					return
				}

				if (!this.userid) return

				if (receiveStatus === 0 || receiveStatus === 4) {
					return
				}

				// 立即领取
				if (promotionType === 2) {
					Utils.request('front/promotion/receivePromotion.do', { 'userid': this.userid, promotionCode }, res => {
						if (res.code === 0) {
							if (promotionCode === 'REG_AWARD' || promotionCode === 'SIGN_EVERYDAY') {
								this.getMoney = res.data.awardAmount
								this.moneyModal = true
								// _alert(`领取${res.data.awardAmount}元奖励成功`)
							} else {
								_alert('领取成功')
							}
							this.getActivityList()
						} else {
							_alert(res.msg)
						}
					})
				}

				// 申请
				if (promotionType === 4) {
					Utils.request('front/promotion/getUserPromotionItemByCode.do', { promotionCode }, res => {
						if (code === 0) {
							this.show = true
						}
					})
				}
			},
			operationState({ promotionType, receiveStatus }) {
				// 未登录
				if (!this.userid) {
					return { color: 'colorblue', text: promotionType === 6 ? '联系客服' : '查看详情' }
				}

				const textArr = new Map([
					[ 1, '自动领取' ],
					[ 2, '立即领取' ],
					[ 4, '申请' ],
					[ 6, '联系客服' ],
					[ 7, '查看详情' ],
					[ 8, '实时到账' ]
				])

				let color = 'colorblue', text = textArr.get(promotionType) || '查看详情'
				
				// 不可领取
				if (receiveStatus === 0 && promotionType !== 6 && promotionType !== 7) color = 'grey'
				// 可申请
				if (receiveStatus === 1) color = 'colorred'
				// 可领取
				if (receiveStatus === 2) color = 'coloryellow'
				// 审核中
				if (receiveStatus === 3) color = 'colorred yellowText'
				// 已领取
				if (receiveStatus === 4) color = 'grey', text = '已领取'
 
				return { color, text }
			},
			isJsonString(str) {
				try {
					if (typeof JSON.parse(str) === 'object') {
						return true
					}
				} catch (e) {
					console.log("字符串");
				}
				return false
			},
			link() {
				this.rankshow = !this.rankshow
				this.everday = !this.everday
				this.award = false
				console.log('link')
			},
			service() {
				var url = Utils.getStorage('serviceUrl')
				// window.open('https://chat.mqimg.com/dist/standalone.html?eid=139883&')
				if (!url) {
					_alert('没获取客服链接，请刷新页面重试。', {type: 'warning'})
					return
				}
				window.open(url)
			},
			linkTwo() {
				this.rankshow = !this.rankshow
				this.award = !this.award
				this.everday = false
				console.log("linktwo")
			},
			receive() {
				this.dz = false
				history.go(0)
			},
			lookdetails({ id, promotionCode }) {
				if (promotionCode === 'RISELEVEL_AWARD') {
					this.award = !this.award
					return
				}
				if (promotionCode === 'EVERYDAY_AWARD') {
					this.everday = !this.everday
					return
				}

				// Utils.request(`/front/promotion/getProIntroduce.do`, { id }, res => {
				// 	if (res.code === 0) {
				// 		this.lookshow = !this.lookshow
				// 		this.code = id

				// 	}
				// })

				// Utils.request('/front/promotion/getPromotionContentByCode.do?promotionCode=CHILD_BETNUM', res => {
				Utils.request(`/front/promotion/getProIntroduce.do`, { id }, res => {
					if (res.code === 0) {
						this.lookshow = !this.lookshow
						if (this.isJsonString(res.data)) {

							this.obj = JSON.parse(res.data)
							this.data = JSON.parse(res.data);

							this.code = id

							let registerTableArr = [], registerTitleArr = [], registerTableHtml = ''

							if (this.obj.code === 'SIGN_EVERYDAY') {
								registerTitleArr = this.obj.title.split(',')
								registerTableArr = this.obj.items.map(e => e.split('/'))

								let registerTitleTd = ''
								registerTitleArr.forEach(e => {
									registerTitleTd += `<td>${e}</td>`
								})

								let registerTableTr = ''
								registerTableArr.forEach((e, index, a) => {
									registerTableTr += `
										<tr>
											<td>${e[0]}</td>
											<td>${e[1]}</td>
											${index === 0 ? `<td rowspan="${a.length}">${this.obj.countMoney}</td>` : ''}
										</tr>
									`
								})
								registerTableHtml = `
									<table style="margin-top: 10px">
										<thead>
											<tr>${registerTitleTd}</tr>
										</thead>

										<tbody>${registerTableTr}</tbody>
									</table>
								`
							}

							switch (this.obj.code) {
								case 'REG_AWARD':
									this.html =
										`
										<h5>注册送优惠</h5>
										<p class="red">新用户完成注册账号，绑定银行卡成为正式会员，即可领取赠送彩金${this.obj.countMoney}元</p>

										<h5>领取方式</h5>
										<p>1.登陆游戏账号然后在<i class="red">【首页】</i>点击<i class="red">【活动】</i>进入优惠活动</p>
										<p>2.在优惠活动选择<i class="red">【签到领红包】</i>点击<i class="red">【立即领取】</i></p>
										<h5>活动说明</h5>
										<p>1.此活动仅针对新用户，必须满足注册和绑定银行卡</p>
										<p>2.参与此活动即表示您已同意以下「活动规则」中所述的条款条约。</p>
										<h5>活动规则</h5>
										<p>1.所有活动彩金均以人民币(CNY)为结算单位，以北京时间为计时区间；</p>
										<p>2.每位玩家﹑每一个住址 ﹑每一个手机号码﹑相同支付方式(相同借记卡/信用卡/银行账户)及相同的IP地址均视为一个人；若会员有存在恶意性重复申请行为，公司将保留取消或收回的权利；</p>
										<p>3.${__entire.name}的所有活动特为玩家而设，如发现任何团体或个人，以不诚实方式套取红利或任何威胁、滥用公司活动优惠等行为，公司保留冻结、取消该团体或个人账户及账户结余的权利；</p>
										<p>4.若会员对活动有争议时，为确保双方利益，杜绝身份盗用行为，${__entire.name}有权要求会员向我们提供充足有效的文件，用以确认是否享有该活动优惠的资质；</p>
										<p>5.所有活动彩金禁止投注超过该项玩法总注数的60%，禁止利用平台进行套利、套现、对打以及洗黑钱等违规行为，此类违规/套利行为均不在赠送名单之内；</p>
										<p>6.${__entire.name}保留对所有活动的最终解释权，以及在无通知的情况下修改、终止活动的权利，适用于所有活动优惠。</p>
										`
								break
								case 'SIGN_EVERYDAY':
									this.html =
									`
									${registerTableHtml}
								<h5>申请方式</h5>
									<p>1.登陆游戏账号然后在<i class="red">【首页】</i>点击<i class="red">【活动】</i>进入优惠活动</p>
									<p>2.在优惠活动选择<i class="red">【签到领红包】</i>点击<i class="red">【立即领取】</i></p>
									<h5>活动说明</h5>
									<p class='red'>注：在玩家签到的第一天起可连续签到7天，每天可领取相应彩金</p>
									<p>1.连续签到天数越高，可领取的彩金相应越高，连续7天签到可最高领取${this.obj.countMoney}元；</p>
									<p>2.如中途中断签到，则必须重新开始签到；</p>
									<p>3.参与此活动即表示您已同意以下「活动规则」中所述的条款条约。</p>
									<h5>活动规则</h5>
									<p>1.所有活动彩金均以人民币(CNY)为结算单位，以北京时间为计时区间；</p>
									<p>2.每位玩家﹑每一个住址 ﹑每一个手机号码﹑相同支付方式(相同借记卡/信用卡/银行账户)及相同的IP地址均视为一个人；若会员有存在恶意性重复申请行为，公司将保留取消或收回的权利；</p>
									<p>3.${__entire.name}的所有活动特为玩家而设，如发现任何团体或个人，以不诚实方式套取红利或任何威胁、滥用公司活动优惠等行为，公司保留冻结、取消该团体或个人账户及账户结余的权利；</p>
									<p>4.若会员对活动有争议时，为确保双方利益，杜绝身份盗用行为，${__entire.name}有权要求会员向我们提供充足有效的文件，用以确认是否享有该活动优惠的资质；</p>
									<p>5.所有活动彩金禁止投注超过该项玩法总注数的60%，禁止利用平台进行套利、套现、对打以及洗黑钱等违规行为，此类违规/套利行为均不在赠送名单之内；</p>
									<p>6.${__entire.name}保留对所有活动的最终解释权，以及在无通知的情况下修改、终止活动的权利，适用于所有活动优惠。</p>
											`
									break
							}
					} else {
						this.code = id

						this.html = res.data;

					}

				}
				})

			},
			ljlq(id) {
				Utils.request('receive/userPro/receiveAward.do', { 'promotionid': id }, res => {
					if (res.code === 0) {
						this.dz = true
						this.rednum = res.data.bonus
					} else {
						_alert(res.msg,{type:'warning'});
					}
				})
			},
			apply(item) {
				Utils.request('app/appView/getProConfig.do', { 'proid': item.id }, res => {
					if (res.code === 0) {
					this.show = true
					this.user = res.data.account
					this.opt = res.data.items
					this.proid = item.id
					this.flag = res.flag
					} else {
						_alert(res.msg,{type:'warning'});
					}
				})
			},
			subm() {
				
				// Utils.request('front/promotion/appPromotionApply.do', { 'userid': this.userid, promotionCode, remark: '', rewardLevelId: id }, res => {
				// 	console.log(res)
				// })
				Utils.request('/app/appView/addApplyPro.do', {
					'remark': document.getElementsByClassName("srk")[0].value,
					'itemid': this.select,
					'proid': this.proid
				}, res => {
					this.show = false
					if (res.code === 0) {
						_alert(res.data, function () {
							window.location.reload();
						})
					} else {
						_alert(res.msg,{type:'warning'});
					}
				})
			},
			tabnav(i, index) {
				this.tag = i
				this.activ = index
				// this.liLength = $(".content").find('li').length
				this.$nextTick(
					function () {
						this.liLength = this.$refs.content.children.length;
					}
				)

			},

			nowget() {
				this.show = true
			},
			close() {
				this.show = false
			},
			rank() {
				var _this = this;
				_this.UserVipLevel.vip = '未登陆';
				Utils.request('front/discountoff/promotions.do', {}, function (res) {
					var _res = res.data;
					if (_res.code != 0) {
						_this.UserVipLevel = _res;
						_this.minPrice = _res.amouts.split(",")[0];
						for (var t = 0; t < _res.amouts.split(",").length; t++) {
							var elementS = _res.amouts.split(",")[t];
							if (_res.betAmount >= elementS) {
								_this.jjbl = _this.UserVipLevel.userVipLevel[Number(_res.vip) - 1].awardPencent.split(",")[t];
							}
						}
						if (_res.awardRecord.length > 0) {
							// _this.jjbl = _data.reChangeToExpRate;
							// console.log(_data)
							for (var i = 0; i < _res.awardRecord.length; i++) {
								var elementS = _res.awardRecord[i];
								if (elementS.awardType === 1) {
									// console.log(elementS.awardAmount)
									// 晋级
									if (elementS.isWithdrawal === 0) {
										_this.dis2 = 1;
										_this.btn2Text = '未领取';
									} else {
										_this.dis2 = 0;
									}
									_this.promotionAward += elementS.awardAmount
								}
								if (elementS.awardType === 2) {
									// 加奖
									if (elementS.isWithdrawal === 0) {
										_this.dis1 = 1;
										_this.btn1Text = '未领取';
									} else {
										_this.dis1 = 0;
									}
									_this.kdjj = elementS.awardAmount;
								}
							}
						}
					}
					_this.swReward()
				})
			},
			swReward() {
				var _this = this;
				var _list = _this.UserVipLevel.userVipLevel;
				// console.log(_list)
				for (var y = 0; y < _list.length; y++) {
					_list[y].jReward = Math.ceil(_this.setRiseAward(y) * _this.UserVipLevel.jumpLevel);
					this.topPrice = _list[y].jReward;
				}
				var _vip4hj = Math.ceil((_list[0].riseAward + _list[1].riseAward + _list[2].riseAward + _list[3].riseAward) * _this.UserVipLevel.jumpLevel);
				var _subVip4hj = Math.ceil((_list[2].riseAward + _list[3].riseAward) * _this.UserVipLevel.jumpLevel);

				_this.vip4hj = `(${_list[0].riseAward} + ${_list[1].riseAward} + ${_list[2].riseAward} + ${_list[3].riseAward}) * ${_this.UserVipLevel.jumpLevel * 100}% = ${_vip4hj}`
				_this.subVip4hj = `(${_list[2].riseAward} + ${_list[3].riseAward}) * ${_this.UserVipLevel.jumpLevel * 100}% = ${_subVip4hj}`

				_list[1].jReward = Math.ceil(_list[1].riseAward * _this.UserVipLevel.jumpLevel)
			},
			setRiseAward(_index) {
				var _this = this;
				var _list = _this.UserVipLevel.userVipLevel;
				var number = 0;
				for (var index = 0; index < (_index + 1); index++) {
					number += _list[index].riseAward;
				}
				return number
			},
			ReceiveAward(type) {
				var _this = this;
				var _data = _this.UserVipLevel.userVipLevel;
				var typeArr1 = []; // 晋级
				var typeArr2 = []; // 加奖
				var post;
				for (var i = 0; i < _this.UserVipLevel.awardRecord.length; i++) {
					var element = _this.UserVipLevel.awardRecord[i];
					if (element.awardType === 1 && element.awardType !== 2) {
						typeArr2.push(element.awardId)
					}
					if (element.awardType === 2 && element.awardType !== 1) {
						typeArr1 = [element.awardId]
					}
				}
				if (type === 1) {
					post = typeArr2
				} else {
					post = typeArr1
				}
				_this.dis1 = 0
				_this.dis2 = 0
				Utils.request('front/discountoff/saveAwardToUser.do', { awardIds: post }, function (data) {
					if (data.code === 0) {
						_alert('领取成功', function () {
							Utils.requestNeedTint('passport/check_status.do', {}, function (data) {
								if (data.code == 0) {
									// console.log(data)
									UserTool.saveUserInfo(data.data);
									window.location.reload();
								}
							});
						})
					} else {
						_alert(data.msg, function () {
							window.location.reload();
						});
					}
				})
			},
			postdata(url, data, fun) {
				$.ajax({
					type: "POST",
					url: url,
					data: data,
					beforeSend: function (xhr) {
						if (Utils.getStorage('sessionid')) {
							xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
						}
						var _temporary = Utils.getStorage('temporaryId') || null
						if (_temporary) {
							xhr.setRequestHeader('temporary-sessionId', _temporary);
						}
						xhr.setRequestHeader("client-version", window.clientVersion);
						xhr.setRequestHeader("x-requested-with", window.xWidth);
					},
					success: function (e) {
						if (e.code >= 300 && e.code < 400) {
							var redirectUrl;
							if (location.pathname.startsWith("/manage")) {
								redirectUrl = "/manage/account/login.do?redirect=" + location.href;
							} else {
								redirectUrl = "/?redirect=" + location.href;
							}
							setTimeout(location = redirectUrl, 1500);
							return;
						} else if (!(e.code == 0 || e.code == 101)) {
							_alert(e.msg);
							layer.closeAll();
							return;
						} else {
							fun(e);
						}
					},
					error: function (message) {
						console.log(message)
					}
				});
			}
		}
	})
})