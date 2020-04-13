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
        currentItem : null
    },
    methods : {
        onLoad : function() {
            var _ts = this;
            _ts.category_index = 0;
            _ts.group_index = 0;
            request('/manage/lottery/categories_play.do', {}, function(e) {
                var lottery_categories = [], groups = e.data.groups;
                $.each(e.data.categories, function (i, item) {
                    if (item.lotteryId != 100001) {
                        item.isActive = false;
                        lottery_categories.push(item);
                    }
                });
                $.each(groups, function (j, group) {
                    group.isActive = false;
                });
                if (lottery_categories.length > 0) {
                    lottery_categories[_ts.category_index].isActive = true;
                }
                if (groups.length > 0) {
                    groups[_ts.group_index].isActive = true;
                }
                _ts.lottery_categories = lottery_categories;
                _ts.groups  = groups;
                $.each(e.data.plays, function (j, item) {
                    item.maxPrize = item.maxPrize.toFixed(2);
                    item.minPrize = item.minPrize.toFixed(2);
                    item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
                });
                _ts.details = e.data.plays;
            });
        },
        switchCategory : function(category) {
            var _ts = this, len = _ts.lottery_categories.length, lottery_categories = _ts.lottery_categories;
            for (var i = 0; i < len; i++) {
                if (lottery_categories[i].lotteryId == category) {
                    lottery_categories[i].isActive = true;
                    _ts.category_index = i;
                } else {
                    lottery_categories[i].isActive = false;
                }
            }
            _ts.lottery_categories = lottery_categories;
            _ts.loading = '正在加载';
            _ts.details = [];
            request('/manage/lottery/categories_play.do', {
                lotteryId : category
            }, function(e) {
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
                _ts.groups  = groups;
                $.each(e.data.plays, function (j, item) {
                    item.maxPrize = item.maxPrize.toFixed(2);
                    item.minPrize = item.minPrize.toFixed(2);
                    item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
                });
                _ts.details = e.data.plays;
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
                    item.maxPrize = item.maxPrize.toFixed(2);
                    item.minPrize = item.minPrize.toFixed(2);
                    item['maxPrizeHalf'] = (item.lotteryClassName.indexOf('FrequentLottery') > -1 && item.lotteryMethodName.indexOf('combinationSum') > -1);
                });
                _ts.details = e.data;
            });
        },
        updateOdds : function(item) {
            var _ts = this;
            _ts.currentItem = item;
            if(_ts.currentItem.minPrize == 0.00) {
                post('/manage/lottery/prizes.do', {playId : _ts.currentItem.playId}, function(e){
                    _ts.showOddsEditor = true;
                    $.each(e.data, function (j, odd) {
                        odd.prize = odd.prize.toFixed(2);
                    });
                    _ts.subPrizes = e.data;
                }, true);
            } else {
                _ts.showOddsEditor = true;
            }
        },
        enabled : function(id, status) {
            var that = this;
            post('/manage/lottery/enabled_play.do', {playId : id, status : status ? true : false}, function(e) {
                var len = that.details.length;
                for (var i = 0; i < len; i++) {
                    if (that.details[i].playId == id) {
                        that.details[i].enabled = !that.details[i].enabled;
                        break;
                    }
                }
                if (status == 1) {
                    layer.msg('激活成功(因缓存无法实时生效,请稍后留意修改状态)');
                } else {
                    layer.msg('禁用成功(因缓存无法实时生效,请稍后留意修改状态)');
                }
            });
        },
        closeEditor : function() {
            this.subPrizes = [];
            this.showOddsEditor = false;
        },
        updatePrizeByPlayId : function() {
            var ts = this;
            if( ts.currentItem.maxPrize <= 0 ){
                layer.msg("最高赔率必须大于零");
                return;
            }
            if (!ts.judgeNum(ts.currentItem.maxPrize) || !ts.judgeNum(ts.currentItem.minPrize)) {
                layer.msg('请输入数字！',{time : 1000});
                return ;
            }
            if (ts.currentItem.maxPrize*1 < ts.currentItem.minPrize*1) {
                layer.msg("最高赔率必须大于最低赔率");
                return;
            }
            post('/manage/lottery/update_play_prize.do', {playId : ts.currentItem.playId, min : ts.currentItem.minPrize, max : ts.currentItem.maxPrize}, function(e){
                layer.msg(e.msg);
                if(e.code === 0) {
                    ts.showOddsEditor = false;
                    for(var i = 0; i < ts.details.length; i++) {
                        if(ts.details[i].playId == ts.currentItem.playId) {
                            ts.details[i].minPrize = ts.currentItem.minPrize;
                            ts.details[i].maxPrize = ts.currentItem.maxPrize;
                            console.log(ts.details);
                            break;
                        }
                    }
                }
            }, true);
        },
        updatePrizeByNumber : function(item, prizeId) {
            var _ts = this, prize =  $('#s' + prizeId).val(),minPrize=$('#m' + prizeId).val();
            if (prize == item.prize && minPrize == item.minPrize) {
                layer.msg('请修改赔率');
                return ;
            }
            if (parseFloat(minPrize) > parseFloat(prize)){
                layer.msg('最低赔率不能大于最高赔率');
                return ;
            }
            if (!_ts.judgeNum(prize) || !_ts.judgeNum(minPrize)) {
                layer.msg('请输入数字！',{time : 1000});
                return ;
            }
            post('/manage/lottery/update_play_prize.do', {playId : item.playId, number : item.number, prize : prize, minPrize : minPrize}, function(e){
                layer.msg(e.msg);
                if(e.code === 0) {
                    _ts.showOddsEditor = false;
                    _ts.subPrizes = [];
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
        updateSort : function(item, i) {
          var ts = this;
          layer.prompt({
              title     : item.name + '- 输入排序号,数值越大,越靠前',
              formType  : 0,
              maxlength : 4
          }, function(sort, index) {
            var isNoPass = false;
            $.each(ts.details, function (j, log) {
                if (!isInteger(sort)) {
                  layer.msg('请输入数字！',{time : 1000});
                  isNoPass = true;
                } else {
                  if (parseInt(sort) <= 0) {
                    layer.msg('请输入正确的排序数字',{time : 1000});
                    isNoPass = true;
                  } else if (log.sort == parseInt(sort)) {
                    layer.msg('请输入与其它排序不同的数字！',{time : 1000});
                    isNoPass = true;
                  }
                }
            });
            if (!isNoPass) {
                post('/manage/lottery/update_play_sort.do', {
                    playId : item.playId,
                    sort   : sort,
                }, function(e) {
                    layer.close(index);
                    if (e.code == 0) {
                        ts.$set(ts.details[i],'sort',sort);
                        layer.msg('设置成功! (缓存原因,2分钟后生效,请两分钟留意排序数值)');
                    } else {
                        layer.msg(e.msg);
                    }
                });
            }
          });
        }
    }
})
vue.onLoad();
