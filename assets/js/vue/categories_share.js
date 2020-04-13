var vue = new Vue({
    el : '#page-inner',
    data : {
        loading : '',
        lottery_categories : [],
        groups : [],
        plays : [],
        details : [],
        category_index : 0,
        group_index : 0,
        showOddsEditor : false,
		subPrizes : [],
		lotteryType: { // 类型对应lotteryId
			FrequentLottery: [4, 6, 11, 12, 45],
			ElevenPickFive: [5, 13, 14, 15, 39, 49],
			PCEggs: [7, 17, 47],
			QuickThree: [1, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 44],
			SixMark: [9, 28, 48],
			Three: [2, 10, 18, 40, 41, 42],
			PK10: [3, 8, 29, 43, 46]
		},
		categoryLotterys: [	// 静态彩种
			{name: "时时彩", value: null, lotteryClassName: "FrequentLottery", isActive: false},
			{name: "快3", value: null, lotteryClassName: "QuickThree", isActive: false},
			{name: "11选5", value: null, lotteryClassName: "ElevenPickFive", isActive: false},
			{name: "排列三/3D/时时乐", value: null, lotteryClassName: "Three", isActive: false},
			{name: "蛋蛋/28", value: null, lotteryClassName: "PCEggs", isActive: false},
			{name: "赛车/飞艇", value: null, lotteryClassName: "PK10", isActive: false},
			{name: "六合彩", value: null, lotteryClassName: "SixMark", isActive: false},
		],
        currentItem : {}
    },
    created: function () {
        var ts = this;
        request('/manage/lottery/categories.do', {}, function(e) {
            if (e.code != 0) {
                return layer.msg(e.msg);
            }
            var lottery_type = new LotteryType().setLotteryType(e.data);
            // console.log(lottery_type);
            ts.lotteryType = lottery_type;
        });
    },
    methods : {
        onLoad : function() {
            var _ts = this;
            _ts.category_index = 0;
			_ts.group_index = 0;
			// 
			var _category = _ts.categoryLotterys[_ts.category_index];
			_category.isActive = true;
			_ts.requestCategory(_category);
            // request('/manage/lottery/categories_play.do', {}, function(e) {
			// 	var lottery_categories = [], groups = e.data.groups;
            //     // $.each(e.data.categories, function (i, item) {
            //     //     if (item.lotteryId != 100001) {
            //     //         item.isActive = false;
            //     //         lottery_categories.push(item);
            //     //     }
            //     // });
            //     // $.each(groups, function (j, group) {
            //     //     group.isActive = false;
            //     // });
            //     // if (lottery_categories.length > 0) {
            //     //     lottery_categories[_ts.category_index].isActive = true;
            //     // }
            //     // if (groups.length > 0) {
            //     //     groups[_ts.group_index].isActive = true;
            //     // }
            //     // _ts.lottery_categories = lottery_categories;
            //     // _ts.groups  = groups;
            //     // $.each(e.data.plays, function (j, item) {
            //     //     item.maxPrize = item.maxPrize.toFixed(2);
            //     //     item.minPrize = item.minPrize.toFixed(2);
            //     //     item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
            //     // });
            //     // _ts.details = e.data.plays;
            // });
		},
		requestCategory: function(category) {
			var _ts = this;
			var _oneLottery = _ts.lotteryType[category.lotteryClassName][0];
			_ts.loading = '正在加载';
            _ts.details = [];
			request('/manage/lottery/categories_play.do', {lotteryId: _oneLottery}, function(e) {
				_ts.loading = '';
                if (e.code != 0) {
                    _ts.loading = e.msg;
                    return ;
                }
                if (e.data.groups.length == 0) {
                    _ts.loading = '无相关玩法';
                    return ;
				}
				var groups = e.data.groups;
                var len = groups.length;
                for (var i = 0; i < len; i++) {
                    groups[i].isActive = i == 0;
                }
                _ts.group_index = 0;
                _ts.groups = groups;
                $.each(e.data.plays, function (j, item) {
                    // item.maxPrize = item.maxPrize.toFixed(2);
                    // item.minPrize = item.minPrize.toFixed(2);
                    item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
                });
                _ts.details = e.data.plays;
			});
		},
        switchCategory : function(category) {
			var _ts = this, 
				len = _ts.categoryLotterys.length, 
				categoryLotterys = _ts.categoryLotterys;
			// categoryLotterys
			for (var i = 0; i < len; i++) {
                if (categoryLotterys[i].lotteryClassName == category.lotteryClassName) {
                    categoryLotterys[i].isActive = true;
                    _ts.category_index = i;
                } else {
                    categoryLotterys[i].isActive = false;
                }
			}
			console.log(_ts.categoryLotterys);
			_ts.requestCategory(category);
			
            // var _ts = this, len = _ts.lottery_categories.length, lottery_categories = _ts.lottery_categories;
            // for (var i = 0; i < len; i++) {
            //     if (lottery_categories[i].lotteryId == category) {
            //         lottery_categories[i].isActive = true;
            //         _ts.category_index = i;
            //     } else {
            //         lottery_categories[i].isActive = false;
            //     }
            // }
            // _ts.lottery_categories = lottery_categories;
            // _ts.loading = '正在加载';
            // _ts.details = [];
            // request('/manage/lottery/categories_play.do', {
            //     lotteryId : category
            // }, function(e) {
            //     _ts.loading = '';
            //     if (e.code != 0) {
            //         _ts.loading = e.msg;
            //         return ;
            //     }
            //     if (e.data.groups.length == 0) {
            //         _ts.loading = '无相关玩法';
            //         return ;
            //     }
            //     var groups = e.data.groups;
            //     var len = groups.length;
            //     for (var i = 0; i < len; i++) {
            //         groups[i].isActive = i == 0;
            //     }
            //     _ts.group_index = 0;
            //     _ts.groups  = groups;
            //     $.each(e.data.plays, function (j, item) {
            //         item.maxPrize = item.maxPrize.toFixed(2);
            //         item.minPrize = item.minPrize.toFixed(2);
            //         item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
            //     });
            //     _ts.details = e.data.plays;
            // });
		},
		requestPlays: function(group) {
			var _ts = this;
			request('/manage/lottery/play.do', {groupId : group}, function(e) {
                _ts.loading = '';
                if (e.code != 0) {
                    _ts.loading = e.msg;
                    return ;
                }
                if (e.data.length == 0) {
                    _ts.loading = '无相关玩法';
                    return ;
                }
                $.each(e.data, function (j, item) {
                    // item.maxPrize = item.maxPrize.toFixed(2);
                    // item.minPrize = item.minPrize.toFixed(2);
                    item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
                });
                _ts.details = e.data;
            });
		},
        switchGroup : function(category, group) {
            var _ts = this, groups = _ts.groups, len = groups.length;
            for (var i = 0; i < len; i++) {
                if (groups[i].groupId == group) {
                    groups[i].isActive = true;
                    _ts.group_index = i;
                } else {
                    groups[i].isActive = false;
                }
            }
            _ts.loading = '正在加载';
            _ts.details = [];
            _ts.requestPlays(group);
        },
        updateOdds : function(item) {
            var _ts = this;
            // _ts.currentItem = item;
            _ts.currentItem.minPrize = item.minPrize;
            _ts.currentItem.maxPrize = item.maxPrize;
            _ts.currentItem.lotteryClassName = item.lotteryClassName;
            _ts.currentItem.lotteryId = item.lotteryId;
            _ts.currentItem.maxPrizeHalf = item.maxPrizeHalf;
            _ts.currentItem.lotteryMethodName = item.lotteryMethodName;
            _ts.currentItem.playId = item.playId;
            _ts.currentItem.groupId = item.groupId;

            if(_ts.currentItem.minPrize == 0.00) {
                post('/manage/lottery/prizes.do', {playId : _ts.currentItem.playId}, function(e){
                    _ts.showOddsEditor = true;
                    // $.each(e.data, function (j, odd) {
                    //     odd.prize = odd.prize.toFixed(2);
                    // });
                    _ts.subPrizes = e.data;
                }, true);
            } else {
                _ts.showOddsEditor = true;
            }
        },
        // enabled : function(id, status) {
        //     var that = this;
        //     post('/manage/lottery/enabled_play.do', {playId : id, status : status ? true : false}, function(e) {
        //         var len = that.details.length;
        //         for (var i = 0; i < len; i++) {
        //             if (that.details[i].playId == id) {
        //                 that.details[i].enabled = !that.details[i].enabled;
        //                 break;
        //             }
        //         }
        //         if (status == 1) {
        //             layer.msg('激活成功(因缓存无法实时生效,请稍后留意修改状态)');
        //         } else {
        //             layer.msg('禁用成功(因缓存无法实时生效,请稍后留意修改状态)');
        //         }
        //     });
        // },
        closeEditor : function() {
            this.subPrizes = [];
            this.showOddsEditor = false;
        },
        updatePrizeByPlayId : function() {
            var ts = this;
            var _ts = this;
            if ( _ts.currentItem.maxPrize <= 0 ) {
                layer.msg("最高赔率必须大于零");
                return;
            }
            if (!_ts.judgeNum(_ts.currentItem.maxPrize) || !_ts.judgeNum(_ts.currentItem.minPrize)) {
                layer.msg('请输入正确数字（最多保留两位小数）！',{time : 1000});
                return ;
            }
            if (_ts.currentItem.maxPrize*1 < _ts.currentItem.minPrize*1) {
                layer.msg("最高赔率必须大于最低赔率");
                return;
            }
            if(_ts.details[0].groupId == 65 || _ts.details[0].groupId == 129 || _ts.details[0].groupId == 272 || _ts.details[0].groupId == 323){
                console.log(65);
                _ts.currentItem.lotteryMethodName = _ts.currentItem.lotteryMethodName +'A';
            }
            if(_ts.details[0].groupId == 66 || _ts.details[0].groupId == 130 || _ts.details[0].groupId == 273 || _ts.details[0].groupId == 324){
                _ts.currentItem.lotteryMethodName = _ts.currentItem.lotteryMethodName +'B';
            }
			var _d = {
				min: _ts.currentItem.minPrize, 
				max: _ts.currentItem.maxPrize,
				methodName: _ts.currentItem.lotteryMethodName
            };
            
            // console.log(ts.currentItem);
            var className = _ts.currentItem.lotteryClassName
            if (className.indexOf('Three') > -1) {
                if (className.indexOf('ThreeD') > -1 || className.indexOf('ArrangeThree') > -1 || className.indexOf('FrequentHappy') > -1) {
                    className = 'Three'
                }
            }
            // console.log(className);
			for (var _el of _ts.categoryLotterys) {
                if (className === 'Three') {
                    _d['lotteryIds'] = _ts.lotteryType[className].join(",");
					break;
                } else if (className.indexOf(_el.lotteryClassName) > -1 && _el.lotteryClassName !== 'Three') {
					_d['lotteryIds'] = _ts.lotteryType[_el.lotteryClassName].join(",");
					break;
				}
			}
			// console.log(_d);

            post('/manage/lottery/update_lottery_prize.do', _d, function(e){
                layer.msg(e.msg);
				_ts.showOddsEditor = false;
                if (e.code == 0) {
                    // for (var i = 0; i < ts.details.length; i++) {
                    //     if (ts.details[i].playId == ts.currentItem.playId) {
                    //         ts.details[i].minPrize = ts.currentItem.minPrize;
                    //         ts.details[i].maxPrize = ts.currentItem.maxPrize;
                    //         console.log(ts.details);
                    //         break;
                    //     }
					// }
					_ts.subPrizes = [];
					_ts.requestPlays(_ts.currentItem.groupId);
                }
            }, true);
        },
        updatePrizeByNumber : function(item, prizeId,name1,name2) {
            var _ts = this, prize = $('#s' + prizeId).val(), minPrize=$('#m' + prizeId).val();
            if (prize == item.prize && minPrize == item.minPrize) {
                layer.msg('请修改赔率');
                return ;
            }
            if (parseFloat(minPrize) > parseFloat(prize)){
                layer.msg('最低赔率不能大于最高赔率');
                return ;
            }
            if (!_ts.judgeNum(prize) || !_ts.judgeNum(minPrize)) {
                layer.msg('请输入正确数字（最多保留两位小数）！',{time : 1000});
                return ;
			}
			// console.log(item);
            // console.log(_ts.currentItem);
            // 区分特码A和B
            if(_ts.details[0].groupId == 65 || _ts.details[0].groupId == 129 || _ts.details[0].groupId == 272 || _ts.details[0].groupId == 323){
                // console.log(65);
                _ts.currentItem.lotteryMethodName = _ts.currentItem.lotteryMethodName +'A';
            }
            if(_ts.details[0].groupId == 66 || _ts.details[0].groupId == 130 || _ts.details[0].groupId == 273 || _ts.details[0].groupId == 324){
                _ts.currentItem.lotteryMethodName = _ts.currentItem.lotteryMethodName +'B';
            }
            
			var _d = {
				number : item.number,
				prize : prize,
				minPrize : minPrize,
				methodName: _ts.currentItem.lotteryMethodName
            };

            // TODO: 遍历玩法类型
            var className = _ts.currentItem.lotteryClassName
            if (className.indexOf('Three') > -1) {
                if (className.indexOf('ThreeD') > -1 || className.indexOf('ArrangeThree') > -1 || className.indexOf('FrequentHappy') > -1) {
                    className = 'Three'
                }
            }
            // console.log(className);
			for (var _el of _ts.categoryLotterys) {
                if (className === 'Three') {
                    _d['lotteryIds'] = _ts.lotteryType[className].join(",");
					break;
                } else if (className.indexOf(_el.lotteryClassName) > -1 && _el.lotteryClassName !== 'Three') {
					_d['lotteryIds'] = _ts.lotteryType[_el.lotteryClassName].join(",");
					break;
				}
			}
            // console.log(_d);
            
            post ('/manage/lottery/update_lottery_prize.do', _d, function(e) {
                layer.msg(e.msg);
				_ts.showOddsEditor = false;
                if (e.code == 0) {
					_ts.subPrizes = [];
					_ts.requestPlays(_ts.currentItem.groupId);
                }
            });

        },
        judgeNum : function (num) {
          if ((/^[\d]+(\.[\d]{1,2})?$/.test(num))) {
              return true;
          } else {
              return false;
          }
        },
        // updateSort : function(item, i) {
        //   var ts = this;
        //   layer.prompt({
        //       title     : item.name + '- 输入排序号,数值越大,越靠前',
        //       formType  : 0,
        //       maxlength : 4
        //   }, function(sort, index) {
        //     var isNoPass = false;
        //     $.each(ts.details, function (j, log) {
        //         if (!isInteger(sort)) {
        //           layer.msg('请输入数字！',{time : 1000});
        //           isNoPass = true;
        //         } else {
        //           if (parseInt(sort) <= 0) {
        //             layer.msg('请输入正确的排序数字',{time : 1000});
        //             isNoPass = true;
        //           } else if (log.sort == parseInt(sort)) {
        //             layer.msg('请输入与其它排序不同的数字！',{time : 1000});
        //             isNoPass = true;
        //           }
        //         }
        //     });
        //     if (!isNoPass) {
        //         post('/manage/lottery/update_play_sort.do', {
        //             playId : item.playId,
        //             sort   : sort,
        //         }, function(e) {
        //             layer.close(index);
        //             if (e.code == 0) {
        //                 ts.$set(ts.details[i],'sort',sort);
        //                 layer.msg('设置成功! (缓存原因,2分钟后生效,请两分钟留意排序数值)');
        //             } else {
        //                 layer.msg(e.msg);
        //             }
        //         });
        //     }
        //   });
        // }
    }
})
$(function() {
	vue.onLoad();
});
