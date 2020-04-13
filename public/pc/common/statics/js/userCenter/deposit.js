$(function () {
  var vue = new Vue({
    el: '#deposits',
    data :{
      amountNumber: [100,500,1000,2000,5000,10000,20000,50000],
      depositsData:[],
      depositsActive: 0,
      depositData: {},
      liveDepositData: {},
      radioActive: 0,
      param: 0,
      amount: null,
      isLengthZero: false,
      account: '',
      isDisabled: false,
      ajaxUrl: '/front/recharge/',
      activeIndex: null,
      vipRechargeData: [],
      isVipShow: false,
      myAccount: ''
    },
    created() {
      var _this = this;
      var postData = {
        userId: JSON.parse(localStorage.getItem('userInfo')).val.userId,
        platform: 'WEB',
        version: '1.0.0'
      }
      _this.myAccount = JSON.parse(localStorage.getItem('userInfo')).val.account;
      layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
      })

      // localStorage.getItem('czAccount') ||
      Utils.request('front/recharge/get_deposit_list.do', postData, function(e) {
        if (e.data && (e.data.rechargeList.length > 0 || e.data.vipRechargeConfigList.length > 0)) {
          if (e.data.rechargeList.length > 0) {
            _this.depositsData = e.data.rechargeList;
            _this.depositData = _this.depositsData[0].payways[0]
            _this.liveDepositData = _this.depositsData[0]
            _this.account = localStorage.getItem(_this.liveDepositData.type + 'account')
            // _this.amount = localStorage.getItem(_this.liveDepositData.type + 'amount')
            _this.isLengthZero = false
            _this.depositsData.forEach(function(item){
              item.payways.forEach(function(it){
                if(it.discount){
                  item.discount = true;
                }
              })
            })
          }
          if (e.data.vipRechargeConfigList.length > 0) {
            _this.vipRechargeData = e.data.vipRechargeConfigList;
            _this.isLengthZero = false
          }
        } else {
          _this.isLengthZero = true
        }
        layer.closeAll()
        // localStorage.setItem('reAccount', _this.liveDepositData.type)
        // var getAa = JSON.parse(localStorage.getItem('userElement'))
        // if (getAa[_this.liveDepositData.type]) {
        //   if (getAa[_this.liveDepositData.type]) {
        //     _this.account = getAa[_this.liveDepositData.type].account
        //   }
        //   if (getAa[_this.liveDepositData.type]) {
        //     _this.amount = getAa[_this.liveDepositData.type].amount
        //   }
        // }
      })
      setTimeout(function(){
        layer.closeAll()
      },2000)
    },
    watch: {
      param: function(index){
        this.depositData = this.liveDepositData.payways[index]
      }
    },
    methods: {
      selectBtn: function(item, index) {
        this.amount = item;
        this.activeIndex = index;
      },
      showVip: function() {
        this.isVipShow = true;
        this.depositsActive = null;
      },
      geAmount: function(item, index) {
        this.amount = item;
        this.activeIndex = index;
      },
      onCopy: function (e) {
        _alert(e.text + ' 复制成功')
      },
      onError: function (e) {
        _alert('复制失败,请手工复制文本')
      },
      rechargeAmount(value) {
        this.amount = (value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
      },
      rechargeAccount(value, type) {
        if (type === 'bank' && this.account !== null) {
          // this.account = (value.replace(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,15}$/g,''))
        }
      },
      paramTabs (index) {
        this.param = index
        this.radioActive = index
      },
      depositTabs (item,index) {
        this.isVipShow = false;
        this.depositsActive = index
        this.liveDepositData = item
        this.activeIndex = null
        this.param = 0
        this.radioActive = 0
        this.depositData = item.payways[0]
        this.account = localStorage.getItem(this.liveDepositData.type + 'account')
        this.amount = localStorage.getItem(this.liveDepositData.type + 'amount')
      },
      setItemUser (){
        localStorage.setItem(this.liveDepositData.type + 'account', this.account)
        localStorage.setItem(this.liveDepositData.type + 'amount', this.amount)
        // var getUserElement = JSON.parse(localStorage.getItem('userElement'))
        // if (getUserElement) {
        //   var newUserObj = Object.assign(getUserElement,{ [this.liveDepositData.type]: { account: this.account, amount: this.amount } } )
        //   localStorage.setItem('userElement', JSON.stringify(newUserObj))
        // }
        // var userObj = { [this.depositData.id]: { account: this.account, amount: this.amount } }


        // console.log(this.liveDepositData.payways)
        // this.liveDepositData.payways.forEach(element => {
          // if (this.depositData.id === element.id) {
            // localStorage.setItem('userElement', userElement[payways])
          // }
          // console.log(element)
        // });
      },
      isAmount() {
        if (+this.amount == '') {
          _alert('充值金额不能为空');
          return false
        }
        if (this.depositData.isFix == 1) {
          return true
        }
        if (+this.amount < +this.depositData.minAmount ||
            +this.amount > +this.depositData.maxAmount ||
            +this.amount == 0) {
          _alert('充值金额超出范围, 请修改');
          return false
        } else {
          return true
        }
      },
      isAccount() {
        if (this.liveDepositData.type == 'bank' && this.account && !/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,15}$/.test(this.account)) {
          _alert('银行户名格式错误')
          return false
        }
        if (this.liveDepositData.type == 'bank' && this.account && this.account.length < 2) {
          _alert((this.depositData.payerName) + '应为2-15个汉字')
          return false
        }
        if (this.account == '' || this.account == null) {
          _alert((this.depositData.payerName) + '不能为空');
          return false
        } else {
          return true
        }
      },
      alertMsg (booln, text) {
        booln ? _alert('订单提交成功，若5分钟未及时到账，请联系客服！') : _alert(text)
      },
      disabled (booln) {
        booln ? isDisabled = true : isDisabled = false
      },
      bankSumbit () {
        console.log('银行入款')
        var _t = this;
        if (!this.isAmount()) return
        if (!this.isAccount()) return
        this.isDisabled = true
        Utils.request(this.ajaxUrl + 'deposit_common.do', {
          bankId: _t.depositData.id,
          depositor: _t.account,
          amount: parseFloat(_t.amount)
        }, function (res) {
          // _t.setItemUser()
          _t.isDisabled = false
          if (res.code === 0) {
            _t.setItemUser()
            _t.alertMsg(true)
          } else {
            _t.alertMsg(false,res.msg)
          }

          // res.code === 0 ? _t.alertMsg(true) : _t.alertMsg(false)
        })
      },
      thirdSumbit () {
        var _t = this;
        if (!this.isAmount()) return
        // Utils.request(this.ajaxUrl + 'third.do', )
        console.log('第三方订单申请')
        // console.log(this.depositData)
        // console.log(this.liveDepositData)
        this.isDisabled = true
        Utils.request(this.ajaxUrl + 'deposit_third.do', {
          thirdCode: _t.depositData.thirdCode,
          thirdMode: _t.depositData.thirdMode,
          thirdId: _t.depositData.id,
          amount: parseFloat(_t.amount)
        }, function (res) {
          // this.setItemUser()
          _t.isDisabled = false
          if (res.code === 0) {
            _t.setItemUser()
            var isSame = res.data.split('?')[1];
            if (isSame.split('&')[1]) {
              isSame = isSame.split('&')[1].split('=')[1]
            }
            if (isSame === 'false') {
              window.location.href = res.data
            } else{
              layer.open({
                type: 2,
                area: ['800px', '560px'],
                title: _t.liveDepositData.title,
                content: res.data,
                yes: function (index, layero) {
                  _t.amount = null
                  _t.account = ''
                  layer.close(index);
                }
              });
            }
          } else {
            _alert(res.msg);
          }
        })
      },
      otherSumbit () {
        console.log('固码模式')
        var _t = this;
        if (!this.isAmount()) return
        if (!this.isAccount()) return
        this.isDisabled = true
        Utils.request(this.ajaxUrl + 'preOrder.do', {
          thirdCode: _t.depositData.thirdCode,
          thirdMode: _t.depositData.thirdMode,
          thirdId: _t.depositData.id,
          receiveBank: _t.depositData.receiveBank,
          receiveAccount: _t.depositData.receiveAccount,
          receiveName: _t.depositData.receiveName,
          payType: _t.depositData.payType,
          depositName: _t.account,
          amount: parseFloat(_t.amount)
        }, function (res) {
          _t.isDisabled = false
          // this.setItemUser()
          if (res.code === 0) {
            _t.setItemUser()
            _t.alertMsg(true)
          } else {
            _t.alertMsg(false,res.msg)
          }
          // res.code === 0 ? _t.alertMsg(true) : _t.alertMsg(false)
        })
      },
      rechargeSubmit () {
        var redirectUrl = this.liveDepositData.payways[this.radioActive].gwRedirectUrl
        if (redirectUrl) {
          var _this= this
          Utils.request('front/recharge/third_bank_list.do', {
            third_code: this.depositData.thirdCode,
            third_mode: this.depositData.thirdMode
          }, function(res) {
            var bankKey = Object.keys(res.data)
            var bankVal = Object.values(res.data)
            var bankList = ''
            var bankName = ''
            bankVal.forEach((e, i) => {
              bankList += `<div class="bankList-items" data-bankname="${bankKey[i]}">${e}</div>`
            })
            layer.open({
              area: ['400px', '560px'],
              title: '请选择充值银行',
              content: bankList,
              yes: function (index) {
                if (!bankName) {
                  layer.msg('请先选择充值银行')
                  return
                }
                Utils.request('front/recharge/deposit_third.do', {
                  amount: _this.amount,
                  thirdCode: _this.depositData.thirdCode,
                  thirdId: _this.depositData.id,
                  thirdMode: bankName
                }, function(data) {
                  // console.log(data)
                  if (data.code === 0) {
                    window.location.href = data.data
                  }
                })
              }
            });
            $('.bankList-items').on('click', function(ele) {
              bankName = ele.target.dataset.bankname
              $('.bankList-items').removeClass('active')
              this.setAttribute('class', 'bankList-items active')
            })
          })
          return
        }
        if (this.liveDepositData.type && this.liveDepositData.type === 'bank') {
          if (!this.isAmount()) return
          this.bankSumbit()
        } else {
          switch (this.depositData.payType) {
            case 'BANK':
            case 'SELF':
            case 'TRAN':
              this.otherSumbit()
              break;
            case 'ONLINE':
              this.thirdSumbit()
              break;
          }
        }
      }
      // bankSubmit () {
      //   console.log('进行银行入款的订单申请')
      //   // console.log(this.amount)
      //   // console.log(this.account)
      //   // console.log(this.livePayWays)
      //   Utils.request('/front/recharge/common.do', {
      //     bankId: this.livePayWays.id,
      //     depositor: this.account,
      //     amount: this.amount
      //   },function (res) {
      //     console.log(res)
      //   })
      //   // Utils.request('/front/recharge/common.do')
      // },
      // thirdSubmit () {
      //   console.log('进行第三方订单申请')
      // },
      // otherSubmit () {
      //   console.log('进入固码模式')
      // },
      // submitAmount () {
      //   if (this.amount === '' || this.amount === null) {
      //     _alert('金额不能为空');
      //     return
      //   }
      //   if (this.account === '' || this.account === null) {
      //     _alert('银行户名不能为空');
      //     return
      //   }
      //   // 这里开始进行订单申请
      //   // 判断是否为银行入款
      //   if (this.liveDepositData.type && this.liveDepositData.type === "bank") {
      //     this.bankSubmit()
      //   } else {
      //     // 判断
      //     if (this.livePayWays.payType === 'BANK') {
      //       this.bankSubmit()
      //     }
      //     if (this.livePayWays.payType === 'ONLINE') {
      //       this.thirdSubmit()
      //     }
      //     if (this.livePayWays.payType === 'SELF') {
      //       this.otherSubmit()
      //     }
      //   }
      // },
      // detailsTabs (item, index) {
      //   this.detailsActive = index
      //   this.detailsText = item.text
      //   this.livePayWays = item
      // },
      // addAmount (amount) {
      //   this.amount = amount
      // },
      // recharge (list) {
      //   if (list.payways.length === 0) {
      //     _alert('当前通道维护中,请更换通道');
      //     return
      //   } else {
      //     this.liveActive = 1
      //     this.liveDepositData = list
      //     this.livePayWays = list.payways[0]
      //     this.detailsText = this.liveDepositData.payways[0].text
      //   }
      // }
    }
  })
})