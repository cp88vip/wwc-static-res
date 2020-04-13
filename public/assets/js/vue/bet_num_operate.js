var vue = new Vue({
	el : '#page-wrapper',
	data : {
		isShowUserInfo : false,
		account : null,
    type : 0,
    responseData :null,
		requestData : {
			account : null,
			amount : '',
			remark : null
		},
	},
	methods : {
		onLoad : function() {
			// layer.close(loadIndex);
		},
		getUserInfo : function() {
			var that = this;
      that.isShowUserInfo = false;
			if (!this.account || this.account.length == 0) {
				layer.msg("请输入会员帐号");
				return false;
			}
			requestOnce('/manage/finance/get_bet_num.do', {account:this.account}, function(e) {
				if(e.data) {
					that.requestData.account = e.data.username;
          that.responseData = e.data;
					that.isShowUserInfo = true;
				} else {
					that.isShowUserInfo = false;
				}
			})
		},
    clearUserInfo : function() {
			this.account = '';
			this.requestData.account = '';
			this.isShowUserInfo = false;
			$('.form-inline .form-control').val('');
    },
		resetRequestData : function() {
			var that = this;
			that.requestData.amount = '';
			that.type = 0;
			that.requestData.remark = '';
		},
		submit : function() {
			var that = this, _requestData = that.requestData;
			var _submitAmount = 0, _diff = 0;
			if (parseInt(this.type) == 0 ) {
				layer.msg('请选择操作类型');
				return;
			}
			if (_requestData.amount == '' || _requestData.amount == 0) {
				layer.msg('请输入操作数额');
				return;
			}
      // if (parseInt(_requestData.amount*100)/100<parseInt(_requestData.amount*1000)/1000) {
			if (!/^\d+(?:\.\d{1,2})?$/.test(_requestData.amount)) {
        layer.msg('请输入数字且只能保留两位小数');
				return;
      }
			if (that.responseData == null) {
				layer.msg("没有会员打码量。");
				return false;
			}
			_submitAmount = parseFloat(_requestData.amount)*parseInt(this.type);
			_diff = _submitAmount + that.responseData.betNumNeed;
			if (_diff < 0) {
				layer.msg("扣除打码量不能超过"+that.responseData.betNumNeed);
				return false;
			}

			// _requestData.amount = parseFloat(_requestData.amount)*parseInt(this.type);
			_requestData.amount = _submitAmount;
      _requestData.account = this.account;
			requestOnce('/manage/finance/add_or_subtract_bet_num.do', _requestData, function(e) {
				layer.msg('操作成功');
				if (that.account && that.account.length > 0) {
					that.resetRequestData();// 重置
					that.getUserInfo();
					// request('/manage/finance/get_bet_num.do', {account: that.account}, function(e) {
					// 	if(e.data) {
					// 		that.requestData.account = e.data.username;
					// 		that.responseData = e.data;
					// 		that.isShowUserInfo = true;
					// 	} else {
					// 		that.isShowUserInfo = false;
					// 	}
					// })
				}
			})
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
