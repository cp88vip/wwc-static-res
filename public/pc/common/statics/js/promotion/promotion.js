
// window._promManager = {

//     //@ parem  domSelector  : 一个dom选择器，  获得游戏列表(主页等彩票列表)
//     getPromList: function (domSelector) {

//         Utils.request('pc/front/discountoff/list.do',{},function(data){
//             if (data.code != 0) {
//                 $(".ac_list").html('');
//                 return ;
//             }

//             var _d = data['data'], arr = [], str = "";
//             for (var i = 0; i < _d.length; i++) {
//               var e = _d[i];
//               var url = e.redirectUrl+e.discountoffId;
//                   str +=  '<div id="act_1" style="display: block;">'+
//                               '<div class="ac_list_box">'+
//                                   '<table cellpadding="0" cellspacing="0" border="0" class="ac_list_table">'+
//                                       '<tbody>'+
//                                           '<tr id="act'+ e.discountoffId +'">'+
//                                               '<td class="ac_img">'+
//                                                       '<a onclick="showDetail('+e.discountoffId+')"><img src="'+e.coverUrl+'"/></a>'+
//                                                   '</td>'+
//                                               '<td>'+
//                                                   '<div class="td_wrapper">'+
//                                                       '<h2><a onclick="showDetail('+e.discountoffId+')">'+e.title+'</a></h2>'+
//                                                       '<ul class="info">'+
//                                                           '<li class="rules"><a onclick="showDetail('+e.discountoffId+')"></a></li>'+
//                                                           '<li class="applicable"><em></em>活动对象：<span class="grey">全体会员</span></li>'+
//                                                           '<li class="date"><em></em>活动内容：<span class="grey">'+e.description+'</span></li>'+
//                                                       '</ul>'+
//                                                       '<a class="join" onclick="showDetail('+e.discountoffId+')">查看详情</a>'+
//                                                   '</div>'+
//                                               '</td>'+
//                                           '</tr>'+
//                                       '</tbody>'+
//                                   '</table>'+
//                                   '<div class="xialawz" id="down_show_'+e.discountoffId+'" style="display: none;">'+
//                                       e.content+
//                                   '</div>'+
//                               '</div>'+
//                             '</div>';
//             }
//             $(".ac_list").html(str);
//             $("#act21").remove();
//             $("#act20").remove();

//         },function(){},true);
//     }
// }

$(function() {
    var vm = new Vue({
        el: '#new_act',
        data: {
            test: '121',
            content1: false,
            content2: false,
            btn1Text: '不可领取',
            btn2Text: '不可领取',
            dis1: 0,
            dis2: 0,
            UserVipLevel: [],
            AwardRecord:[],
            listData: [],
            vip4hj: "(x + x + x) * 110%",
            subVip4hj: "(x + x) * 110%",
            promotionAward: 0,
            jjbl: 0,
            kdjj: 0,
            topPrice: 0,
            minPrice: 0,
            isDisclick: false
        },
        created() {
            var _this = this;
            _this.UserVipLevel.vip = '未登陆';
            Utils.request('front/discountoff/promotions.do', {}, function(res){
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
            Utils.request('pc/front/discountoff/list.do', {}, function(data){
                var _data = data.data;
                if (data.code == 0) {
                    for (var i = 0; i < _data.length; i++) {
                        var element = _data[i];
                        element.show = false;
                        _this.listData.push(element)
                        // if (element.discountoffId !== 20 && element.discountoffId !== 21){
                        //     element.show = false;
                        //     _this.listData.push(element)
                        // }
                    }
                }
            })
        },
        methods: {
            listTabs(index){
                var _this = this;
                var temp = _this.listData
                temp[index].show = ! temp[index].show
                _this.listData = temp
            },
            open_info (val) {
                switch (val) {
                    case 0 : this.content1 = !this.content1;this.content2 = false; break;
                    case 1 : this.content2 = !this.content2;this.content1 = false; break;
                }
            },
            setRiseAward (_index) {
                var _this = this;
                var _list =  _this.UserVipLevel.userVipLevel;
                var number = 0;
                for (var index = 0; index < (_index + 1); index++) {
                    number += _list[index].riseAward;
                }
                return number
            },
            swReward () {
                var _this = this;
                var _list = _this.UserVipLevel.userVipLevel;
                // console.log(_list)
                for (var y = 0; y < _list.length; y++) {
                    _list[y].jReward = Math.ceil(_this.setRiseAward(y) * _this.UserVipLevel.jumpLevel);
                    this.topPrice = _list[y].jReward;
                }
                var _vip4hj = Math.ceil((_list[0].riseAward+ _list[1].riseAward + _list[2].riseAward + _list[3].riseAward) * _this.UserVipLevel.jumpLevel);
                var _subVip4hj = Math.ceil((_list[2].riseAward + _list[3].riseAward) * _this.UserVipLevel.jumpLevel);

                _this.vip4hj = `(${_list[0].riseAward} + ${_list[1].riseAward} + ${_list[2].riseAward} + ${_list[3].riseAward}) * ${_this.UserVipLevel.jumpLevel * 100}% = ${_vip4hj}`
                _this.subVip4hj = `(${_list[2].riseAward} + ${_list[3].riseAward}) * ${_this.UserVipLevel.jumpLevel * 100}% = ${_subVip4hj}`

                _list[1].jReward = Math.ceil(_list[1].riseAward * _this.UserVipLevel.jumpLevel)
            },
            ReceiveAward (type) {
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
                    if (element.awardType === 2  && element.awardType !== 1) {
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
                Utils.request('front/discountoff/saveAwardToUser.do', {awardIds:post}, function (data) {
                    if (data.code === 0) {
                        _alert('领取成功',function () {
                            Utils.requestNeedTint('passport/check_status.do',{},function (data) {
                                if (data.code == 0) {
                                    // console.log(data)
                                    UserTool.saveUserInfo(data.data);
                                    window.location.reload();
                                }
                            });
                        })
                    } else {
                        _alert( data.msg , function () {
                            window.location.reload();
                        });
                    }
                })
            }
        }
    })
})