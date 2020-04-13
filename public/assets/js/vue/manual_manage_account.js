var vue = new Vue({
	el: '#page-wrapper',
	data: {
		isShowUserInfo: false,
		isShowOption: false,
		isShowInput: false,
		selected: 1,
		user: {},
		account: null,
		responseData: null,
		requestData: {
			account: null,
			type: 0,
			amount: '',
			remark: null,
			ratio: 0,
			needDoRecord: false
		},
	},
	methods: {
		onLoad: function() {
			// layer.close(loadIndex);
		},
		showInput: function() {
			this.isShowInput = true;
			this.requestData.needDoRecord = true;
		},
		hideInput: function() {
			this.isShowInput = false;
			this.requestData.needDoRecord = false;
			this.requestData.ratio = 0;
		},
		clearRequestData: function() {
			this.requestData = {
				account: null,
				type: 0,
				amount: '',
				remark: null,
				ratio: 0,
				needDoRecord: false
			}
		},
		selectType: function() {
			if (this.selected >= 3 && this.selected != 4) {
				this.isShowOption = true;
			} else {
				if (this.requestData.type == 8) {//人工减款
					this.isShowOption = false;
					this.isShowInput = false;
					this.requestData.needDoRecord = false;
					this.requestData.ratio = 0;
				} else {
					this.isShowOption = true;
				}
			}
		},
		getUserInfo: function() {
			var that = this;
			that.isShowUserInfo = false;
			if (!this.account || this.account.length == 0) {
				layer.msg("请输入会员帐号");
				return false;
			}
			requestOnce('/manage/finance/get_user_info.do', {
				account: this.account
			}, function(e) {
				if (e.data) {
					e.data.available_balance = e.data.balance.toFixed(3);
					that.user = e.data;
					that.requestData.account = e.data.account;
					that.isShowUserInfo = true;
					that.responseData = e.data;
				} else {
					that.isShowUserInfo = false;
				}
			})
		},
		submit: function() {
			var that = this;
			if (this.requestData.type == 0) {
				layer.msg('请选择操作类型');
				return;
			}
			if (this.requestData.amount == '' || this.requestData.amount == 0) {
				layer.msg('请输入操作数额');
				return;
			}
			if (!/^\d+(?:\.\d{1,3})?$/.test(this.requestData.amount)) {
        layer.msg('请输入数字且只能保留三位小数');
				return;
			}
			if (this.requestData.amount > 10000000) {
				layer.msg('操作数额不能超过1千万');
				return;
			}
			// 	if (parseInt(this.requestData.amount)!=this.requestData.amount) {
			//   layer.msg('操作数额只能输入整数');
			// 		return;
			// }
			if (this.requestData.needDoRecord && this.requestData.type != 8) {
				if (this.requestData.ratio == 0) {
					layer.msg('请输入加码量倍数');
					return;
				}
				if (parseInt(this.requestData.ratio) != this.requestData.ratio) {
					layer.msg('加码量只能输入整数');
					return;
				}
			}

			this.requestData.type = parseFloat(this.requestData.type);
			this.requestData.amount = parseFloat(this.requestData.amount);
			this.requestData.ratio = parseFloat(this.requestData.ratio);
			requestOnce('/manage/finance/manual_cash_transfer.do', this.requestData, function(e) {
				layer.msg('操作成功');
				that.isShowOption = false;
				that.clearRequestData();
				that.hideInput();
				that.getUserInfo();
			});
		},
		uploadFile: function () {
			var formData = new FormData();
			console.log($("#file")[0].files[0]);
			
			formData.append("file", $("#file")[0].files[0])
			formData.forEach(function(d){
				console.log(d);
			})
			if ($("#file")[0].files[0] == undefined) {
				layer.alert("请选择上传的文件")
				return false
			}
			if ($("#file")[0].files[0].name.slice(-3) != "xls") {
				layer.alert("请提交xls格式的Excel文件")
				return false
			}
			$.ajax({
        type : "POST",
        url : "/manage/finance/uploadAccBanPlusFile.do",
        dataType: "json",
				cache: false,//上传文件无需缓存
				processData: false,//用于对data参数进行序列化处理 这里必须false
				contentType: false, //必须
        data : formData,
        beforeSend : function(xhr) {
            if (!isRequst) {
                isRequst += "1";
            } else {
                return ;
            }
            var _inx = layer.load(2, {
                shade: [0.2, "#000"],
                shadeClose: false
            });
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
			});
			xhr.setRequestHeader('temporary-sessionId', {
				toString : function() {
					return $.cookie("temporaryId");
				}
			});
			// var _temporary = sessionStorage.getItem('temporaryId') || null
			// if (_temporary) {
			// 	xhr.setRequestHeader('temporary-sessionId', _temporary);
			// }
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
            isRequst = "";
            layer.closeAll();

            if (e.code >= 300 && e.code < 400) {
                layer.msg(e.msg);
                var redirectUrl;
                if(location.pathname.startsWith("/manage")) {
                    redirectUrl = "/manage/account/login.do?redirect="+location.href;
                } else {
                    redirectUrl = "/agent/manage/login.do?redirect="+location.href;
                }
                setTimeout(
                    location=redirectUrl,
                    1500);
                return;
            } else if (!(e.code == 0 || e.code == 101)) {
                layer.msg(e.msg);
                // setTimeout(function(){
                // 	window.location.href = "/manage/account/index.do";
                // }, 1500);
                return;
            } else {
								// fun(e);
								if (e.data.length == 0) {
									layer.msg(e.msg);
								} else {
									layer.alert("以下账号没有插入成功:" + e.data.join())
								}
            }
        },
        error : function(message) {
            isRequst = "";
            layer.closeAll();
            console.log(message)
        }
    });
		},
		downloadFile: function () {
		// 	$.ajax({
    //     type : "GET",
    //     url : "/manage/finance/downloadAccBanPlusExcelModel.do",
    //     // data : data,
    //     beforeSend : function(xhr) {
    //         xhr.setRequestHeader('sessionid', {
    //             toString : function() {
    //                 return $.cookie("sessionid");
    //             }
    //         });
    //         xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
    //     },
    //     success : function(e) {
    //         if (!isLoaded) {
    //             layer.close(loadIndex);
    //             isLoaded = true;
    //         }
    //         if (e.code >= 300 && e.code < 400) {
    //             layer.msg(e.msg);
    //             var redirectUrl;
    //             if(location.pathname.startsWith("/manage")) {
    //                 redirectUrl = "/manage/account/login.do?redirect="+location.href;
    //             } else {
    //                 redirectUrl = "/agent/manage/login.do?redirect="+location.href;
    //             }
    //             setTimeout(
    //                 location=redirectUrl,
    //                 1500);
    //             return;
    //         } else if (!(e.code == 0 || e.code == 101)) {
    //             layer.msg(e.msg);
    //             return;
    //         } else {
		// 					layer.msg(e.msg);
    //         }
    //     },
    //     error : function(message) {
    //         console.log(message)
    //     }
    // });
			// $.get("/manage/finance/downloadAccBanPlusExcelModel.do", function(result){
			// 	layer.msg('操作成功');
			// });
			// requestOnce('/manage/finance/downloadAccBanPlusExcelModel.do', {}, function(e) {
			// 	if (e.code == 0) {
			// 		layer.msg('操作成功');
			// 		// location.href = e.data;
			// 	}
			// });
		}
	},
	created: function() {
		$(document).keyup(function(event) {
			if (event.keyCode == 13) {
				vue.getUserInfo();
			}
		});
	}
});
vue.onLoad();
