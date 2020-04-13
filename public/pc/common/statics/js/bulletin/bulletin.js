// import userInfo from "../utils/userInfo"
var doc = document;
function closeJjModel() {
	$('#jj-model').remove()
}

function openPromotion() {
	$('#jj-model').remove()
	window.open('/pc/index/newpromotion.html?id=20')
}
function urlSwitchLink(url) {
	var a = ''
	switch (url) {
		case 'wwc://platformapi/wwc/orders':
			a = '/pc/userCenter/accountDetail.html'
			break
		case 'wwc://platformapi/wwc/accountDetail':
			a = '/pc/userCenter/accountDetail.html'
			break
		case 'wwc://platformapi/wwc/rechargeRecord':
			a = '/pc/userCenter/accountDetail.html'
			break
		case 'wwc://platformapi/wwc/withdrawRecord':
			a = '/pc/userCenter/accountDetail.html'
			break
		case 'wwwc://platformapi/wwc/messages':
		case 'wwc://platformapi/wwc/messages':
			a = '/pc/userCenter/privateMsg.html'
			break
		case 'wwc://platformapi/wwc/securityCenter':
			a = '/pc/userCenter/accountInfo.html'
			break
		case 'wwc://platformapi/wwc/onlineService':
			a = '/mobile/service/serviceOnline.html'
			break
		case 'wwc://platformapi/wwc/playRules':
			a = '/pc/rule/index.html'
			break
		case 'wwc://platformapi/wwc/aboutUs':
			a = '/pc/helpCenter/index.html'
			break
		case 'wwc://platformapi/wwc/profitLoss':
			a = '/pc/userCenter/accountDetail.html'
			break
		case 'wwc://platformapi/wwc/friendList':
			a = '/pc/studio/#/chatroom'
			break
		case 'wwc://platformapi/wwc/followList':
			a = '/pc/studio/#/chatroom'
			break
		case 'wwc://platformapi/wwc/football':
			a = '/pc/football/common.html'
			break
		case 'wwc://platformapi/wwc/betChatRoom':
			a = '/pc/studio/#/chatroom'
			break
		case 'wwc://platformapi/wwc/betChatRoom?position=1':
			a = '/pc/studio/#/chatroom'
			break
		case 'wwc://platformapi/wwc/betting':
			a = '/pc/mall/common.html'
			break
		case 'wwc://platformapi/wwc/chatRoom':
			a = '/pc/studio/#/chatroom'
			break
		case 'wwc://platformapi/wwc/redPacket?rid=':
			a = '/pc/userCenter/index.html'
			break
		case 'wwc://platformapi/wwc/privateChat?receiver=':
			a = '/pc/studio/#/chatroom'
			break

		default:
			a = '/pc/userCenter/index.html'
			break
	}
	// console.log(url)
	return a
}

function switchLink(url, str) {
	if (url.indexOf('customLinkUrl') > -1) {
		// var _customRule = /href="([a-zA-Z0-9\:\/\_\?\=\.]+)"/
		// var _u = url.split('url=')[1]
		// var _replace = str.match(_customRule)[1] || url
		// str = str.replace(_replace, _u)
		var _u = url.split('url=')[1]
		str = str.replace(url, _u)
	} else {
		let _url = url
		if (url.indexOf('?title=') > -1) {
			_url = url.split('?title=')[0]
		}
		var a = ''
		switch (_url) {
			case 'wwc://platformapi/wwc/orders':
				a = '/pc/userCenter/accountDetail.html'
				break
			case 'wwc://platformapi/wwc/activity':
				a = '/pc/index/newpromotion.html'
				break
			case 'wwc://platformapi/wwc/accountDetail':
				a = '/pc/userCenter/accountDetail.html'
				break
			case 'wwc://platformapi/wwc/rechargeRecord':
				a = '/pc/userCenter/accountDetail.html'
				break
			case 'wwc://platformapi/wwc/withdrawRecord':
				a = '/pc/userCenter/accountDetail.html'
				break
			case 'wwwc://platformapi/wwc/messages':
			case 'wwc://platformapi/wwc/messages':
				a = '/pc/userCenter/privateMsg.html'
				break
			case 'wwc://platformapi/wwc/securityCenter':
				a = '/pc/userCenter/accountInfo.html'
				break
			case 'wwc://platformapi/wwc/onlineService':
				a = '/mobile/service/serviceOnline.html'
				break
			case 'wwc://platformapi/wwc/playRules':
				a = '/pc/rule/index.html'
				break
			case 'wwc://platformapi/wwc/aboutUs':
				a = '/pc/helpCenter/index.html'
				break
			case 'wwc://platformapi/wwc/profitLoss':
				a = '/pc/userCenter/accountDetail.html'
				break
			case 'wwc://platformapi/wwc/friendList':
				a = '/pc/studio/#/chatroom'
				break
			case 'wwc://platformapi/wwc/followList':
				a = '/pc/studio/#/chatroom'
				break
			case 'wwc://platformapi/wwc/football':
				a = '/pc/football/common.html'
				break
			case 'wwc://platformapi/wwc/betChatRoom':
				a = '/pc/studio/#/chatroom'
				break
			case 'wwc://platformapi/wwc/betChatRoom?position=1':
				a = '/pc/studio/#/chatroom'
				break
			case 'wwc://platformapi/wwc/betting':
				a = '/pc/mall/common.html'
				break
			case 'wwc://platformapi/wwc/chatRoom':
				a = '/pc/studio/#/chatroom'
				break
			case 'wwc://platformapi/wwc/redPacket?rid=':
				a = '/pc/userCenter/index.html'
				break
			case 'wwc://platformapi/wwc/privateChat?receiver=':
				a = '/pc/studio/#/chatroom'
				break

			case 'wwc://platformapi/wwc/webH5':
				a = '/pc/index/newpromotion.html'
				break

			default:
				a = '/pc/userCenter/index.html'
				break
		}
		// 替换链接
		str = str.replace(url, a)
	}
	return str
}
var commonList = [];
var Bulletin = {
	constructor: function () {
		if (isSw) {
			return;
		}
		var _data = {};
		var heartUrl = "im/customer_service/customer_heartbeat.do";
		_data.showMaintenance = function (maintenance, system_time) {
			if (maintenance.activeTime > system_time) {//  结束时间大于系统时间 显示
				//  _alert(maintenance.content);
				let _realStr = maintenance.content
				let _linkArr = []
				let _wwcReg = /wwc:\/\/platformapi\/wwc\/[^'" ]+/g
				_linkArr = maintenance.content.match(_wwcReg)
				// console.log(_linkArr)
				if (_linkArr && _linkArr.length > 0) {
					_linkArr.forEach((item, inx) => {
						_realStr = switchLink(item, _realStr)
					})
				}
				_alert(_realStr, '通知');
			}
		}
		_data.showCommon = function (common, system_time) {
			// 取出时间
			//  var createtime = Utils.getStorage('commonCreateTime');
			//  if (common.createTime > createtime && common.activeTime > system_time) {// 大于前一次 && 结束时间大于系统时间 显示
			//    // 存
			// 	 Utils.saveStorage('commonCreateTime',common.createTime);
			let _realStr = common.content
			let _linkArr = []
			let _wwcReg = /wwc:\/\/platformapi\/wwc\/[^'" ]+/g
			_linkArr = common.content.match(_wwcReg)
			// console.log(_linkArr)
			if (_linkArr && _linkArr.length > 0) {
				_linkArr.forEach((item, inx) => {
					_realStr = switchLink(item, _realStr)
				})
			}
			//  _alert(_realStr,'通知');
			return _realStr;
			// }
		}
		_data.showWarn = function (warn, system_time) {
			// 取出时间
			var createtime = Utils.getStorage('warnCreateTime');
			if (warn.createTime > createtime) {// 大于前一次 && 结束时间大于系统时间 显示
				// 存
				Utils.saveStorage('warnCreateTime', warn.createTime);
				// _alert(warn.content);
				$('#_msn').show();
			}
		}
		commonList = [];
		_data.init = function () {
			Utils.request(heartUrl, {}, function (res) {
				// console.log('有维护公告')
				if (res.code == 0 || res.code == 10001 || res.code == 101) {
					// 公告弹窗
					var inform = res.affiche;
					if (inform.maintenance.code == 103) {// 有维护公告
						if (inform.maintenance.isLoca) {// 锁上
							var ref_url = window.location.pathname;
							if (ref_url != '/pc/index/bulletin.html') {
								__openWin('home', '/pc/index/bulletin.html');
							}
							let _realStr = inform.maintenance.content
							let _linkArr = []
							let _wwcReg = /wwc:\/\/platformapi\/wwc\/[^'" ]+/g
							_linkArr = inform.maintenance.content.match(_wwcReg)
							// console.log(_linkArr)
							if (_linkArr && _linkArr.length > 0) {
								_linkArr.forEach((item, inx) => {
									_realStr = switchLink(item, _realStr)
								})
							}
							$('#bulletin-content').html(_realStr);
							$('#bulletin-content').children('p').children('a').each(function () {
								$(this).attr('href', urlSwitchLink($(this).attr('href')))
							})
						} else {// 没锁
							var ref_url = window.location.pathname;
							if (ref_url == '/pc/index/bulletin.html') {
								__openWin('home', '/pc/index.html');
							}
							// _data.showMaintenance(inform.maintenance,res.system_time);
						}
					} else {
						var ref_url = window.location.pathname;
						if (ref_url == '/pc/index/bulletin.html') {
							__openWin('home', '/pc/index.html');
						}
					}
					
					if (inform.common.code == 105) {// 有普通公告
						// _data.commonList = [];
						var createtime = Utils.getStorage('commonCreateTime') || 0;
						if (inform.common.common[0].createTime > createtime && inform.common.common[0].activeTime > res.system_time) {// 大于前一次 && 结束时间大于系统时间 显示
							// 存
							Utils.saveStorage('commonCreateTime', inform.common.common[0].createTime);
							inform.common.common.forEach(function (item) {
								commonList.push({ content: _data.showCommon(item, res.system_time), title: item.title });
							})
							var _noticeStr = '';
							_noticeStr += '<div class="noticeList">'
							_noticeStr += '<div class="notice_box">'
							_noticeStr += '<div class="title bg-col">'
							_noticeStr += '公告  <span class="icon_close" onclick="closeAllNotice()"></span>'
							_noticeStr += '</div><div class="content"><div class="left">'
							for (var i = 0; i < commonList.length; i++) {
								_noticeStr += '<div onclick="setCurIndex(this)" title="' + i + '" class="notice_title' + (i == 0 ? ' current_title' : '') + '"><span class="red_icon">●</span>' + (commonList[i].title ? commonList[i].title : "无标题") + '</div>'
							}
							_noticeStr += '</div><div class="right"><div class="right_title">' + (commonList[0].title ? commonList[0].title : '') + '</div>'
							_noticeStr += '<div class="right_content"><span>' + commonList[0].content + '</span></div></div></div></div></div>'
							$('body').append(_noticeStr)
							$('.noticeList').show();
						}

						// console.log(commonList);

					}
					if (inform.warn && inform.warn.code == 107) { // 有警告公告
						_data.showWarn(inform.warn, res.system_time);
					}
					if (!inform.notify || !inform.notify.notifyId || (inform.notify.notifyId && inform.notify.notifyId === parseInt(Utils.getStorage('notifyId')))) {
						return false
					} else {
						if (inform.notify.type == 3) {
							_alert(inform.notify.content, '个人消息');
							Utils.saveStorage('notifyId', inform.notify.notifyId)
						} else {

							Utils.saveStorage('notifyId', inform.notify.notifyId)
							var _model = ''
							// var award = inform.notify.award.toFixed(2)
							// console.log(award)
							_model += '<div id="jj-model">'
							_model += '<div class="jj-model-content">'
							_model += '<img src="' + inform.notify.imageUrl + '">'
							// _model += '<span>'+ award + '￥' +'</span>'
							_model += '<button type="button" onclick="openPromotion()"></button>'
							_model += '<i onclick="closeJjModel()"></i>'
							_model += '</div>'
							_model += '</div>'
							if (!($('#jj-model').length > 0)) {
								$('body').append(_model)
							}
							// Utils.saveStorage('notifyId', inform.notify.notifyId)
							// _alert('您有新的奖励待领取！',function () {
							// 	__openWin("home", "/pc/index/newpromotion.html?id=21");
							// });
							// let _wwcReg = /wwc:\/\/platformapi\/wwc\/[^'" ]+/g
							// let _linkArr = inform.notify.content.match(_wwcReg)
							// console.log(_linkArr)
							// let _realStr = inform.notify.content
							// if (_linkArr && _linkArr.length > 0) {
							// 	_linkArr.forEach((item, inx) => {
							// 		// _realStr = urlSwitchLink(_linkArr)
							// 		_realStr = switchLink(item, _realStr)
							// 	})
							// }
							// console.log(inform.notify.imageUrl)
							// console.log('`````````````````````````````')
							// console.log(inform.notify.content)
							// console.log('`````````````````````````````')
							// console.log($('body'))
							// _alert(_realStr);
						}
					}
				}
			}, function () { }, true, true);
		}
		// 游戏轮循
		_data.changeMoney = function () {
			// 未进入游戏或者游戏没退出
			// console.log(xGame);
			if (!xGame || xGame.closed === false) {
				return false
			}
			// 进入游戏后，退出游戏
			if (xGame.closed === true) {
				// Utils.request('/changeMoney/transfer.do', { transferStatus: 2 }, function (res) {
				// 	if (res.code === 0) {
				// 		// 转出成功，则重置变量
				// 		xGame = null
				// 		return
				// 	} else {

				// 	}
				// });
			}
		}
		// 轮循
		_data.loop = function () {
			setInterval(function () {
				// Utils.request(heartUrl, {}, function(res){
				// },function(){},true,true);
				// 心跳包
				_data.init();
				// 默认检查游戏是否退出
				// _data.changeMoney();
			}, 15000);
		}
		// TODO  弹出框
		_data.init();
		_data.loop();
		return _data;
	}
}
function closeAllNotice() {
	$('.noticeList').hide();
	commonList = [];
}

function setCurIndex(obj) {
	console.log($(obj)[0].title)
	$(obj).addClass('current_title')
	$(obj).siblings().removeClass('current_title')
	$('.right_title').html(commonList[$(obj)[0].title].title);
	$('.right_content').html(commonList[$(obj)[0].title].content);
	// $('.right_title')[0].innerText = commonList[$(obj)[0].title].title;
	// $('.right_content')[0].innerHTML = commonList[$(obj)[0].title].content;
}
// export default Bulletin;
