var keyUp = function (obj) {
    obj.value = obj.value.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符
    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value = obj.value;
    }
}
//2个集合的差集
Array.prototype.minus = function (arr) {
    var result = new Array();
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = 1;
    }
    for (var j = 0; j < this.length; j++) {
        if (!obj[this[j]])
        {
            obj[this[j]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};
Array.prototype.minusObj = function (arr, key) {
    var result = new Array();
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i][key]] = 1;
    }
    for (var j = 0; j < this.length; j++) {
        if (!obj[this[j][key]]) {
            obj[this[j][key]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};
var vue = new Vue({
    el: '#page-inner',
    data: {
        tbodyId: "logs",
        lottery_categories: [],
        category: 0,
        index: 0,
        details: [],
        noSys: [],
        current_category: null,
        listName: "三分时时彩,幸运28,三分PK10,极速快3,极速六合彩",
        codes: {
            // "PC蛋蛋": "bjkl8",
            "幸运28": "luck28",
            "三分时时彩": "sfssc",
            "三分PK10": "sfpk10",
            "极速快3": "threeMinuteQuickThree",
            "极速六合彩": "quickSixMark",
        }
    },
    methods: {
        onLoad: function (e) {
            var that = this;
            // 获取系统彩列表
            request('/manage/lottery/categories.do', {}, function (e) {
                var _all = e.data;
                request('/manage/lottery/get_lottery_category_list.do', {}, function (res) {
                    var _noSys = res.data;
                    that.noSys = _noSys;
                    that.lottery_categories = _all.minusObj(_noSys, 'lotteryId')
                    // console.log(that.lottery_categories);
                    
                    that.request();
                    that.timedRefresh();
                });
            });
        },
        request: function () {
            var that = this;
            // 获取开奖balls数
            request('/front/lottery/luck_number.do', {}, function (e) {
                var _all = e.data;
                if (!e.data || e.data.length <= 0) {
                    layer.msg("没有彩种列表返回");
                    return false;
                }
                var _detailsArr = [];
                // 从全局数组和官方彩中，获得差集，系统彩的数组
                _detailsArr = _all.minusObj(that.noSys, 'lotteryId');
                for (var i = 0; i < _detailsArr.length; i++) {
                    var each = _detailsArr[i];
                    each["balls"] = each.number.split(",").length;
                    // for (var j = 0; j < that.lottery_categories.length; j++) {
                    //     var _each = that.lottery_categories[j];
                    //     if (_each.lotteryId === each.lotteryId) {
                    //         each['code'] = _each.icon // icon就是code
                    //     }
                    // }

                    that.details.push(each);
                    $("#panel").show();
                    that.freshLottery();
                }
                console.log(that.details);
                // if (e.data.length > 0) {
                //     if (that.details.length > 0) {
                //         for (var i = 0; i < that.details.length; i++) {
                //             var detail = that.details[i];
                //             for (var j = 0; j < e.data.length; j++) {
                //                 var each = e.data[j];
                //                 each.balls = each.number.split(",").length;
                //                 if (detail.lotteryId === each.lotteryId) {
                //                     that.details[i] = each;
                //                 }
                //             }
                //         }
                //     } else {
                //         for (var i = 0; i < e.data.length; i++) {
                //             var each = e.data[i];
                //             each.balls = each.number.split(",").length;
                //             // if (that.listName.indexOf(each.name) > -1 && each.name !='六合彩') {
                //             //     that.details.push(each);
                //             // }
                //         }
                //     }
                //     $("#panel").show();
                //     that.freshLottery();
                // } else {
                //     layer.msg("没有彩种列表返回");
                // }
            });
        },
        freshLottery: function () {
            var that = this;
            var doRecall = function (res) {
                if (res['code'] == 0) {
                    var _data = res['data'];
                    for (var i = 0; i < that.details.length; i++) {
                        for (var j = 0; j < _data.length; j++) {
                            if (that.details[i].lotteryId === _data[j].lotteryId) {
                                if (that.details[i].issue != _data[j].lastIssue) {
                                    // that.details[i].manual = null;
                                    $("#" + that.tbodyId).find('tr[lotteryId=' + that.details[i].lotteryId + ']').find('.manual').text("");
                                }
                                that.details[i].issue = _data[j].lastIssue;
                                that.details[i].number = _data[j].lastLuckyNumbers;
                            }
                        }
                    }
                }
            }
            if (that.details.length > 0) {
                var a = [];
                for (var i = 0; i < that.details.length; i++) {
                    var e = that.details[i];
                    a.push(e.lotteryId);
                }
                a = a.join(',');
                request("/front/lottery/draw_infos.do", {lotteryIds: a}, doRecall);
            }
        },
        timedRefresh: function () {
            var that = this;
            setInterval(function () {
                that.freshLottery();
            }, 5000);
        },
        updateLuck: function (item) {
            var that = this;
            var _user = JSON.parse(sessionStorage.getItem('user'));
            var title = item.name + ' 修改开奖';
            // "幸运28": "luck28",
            // "三分时时彩": "sfssc",
            // "三分PK10": "sfpk10"
            // console.log(item);
            
            // if (item.name == '幸运28') {
            //     title = '幸运28修改开奖------开奖规则：0,1,2，数字可以重复，最小为0最大数字为9'
            // }
            // if (item.name == '三分时时彩') {
            //     title = '三分时时彩修改开奖------开奖规则：0,1,2,3,4，数字可以重复，最小为0最大数字为9'
            // }
            // if (item.name == '三分PK10') {
            //     title = '三分PK10修改开奖---开奖规则：01,02,03,04,05,06,07,08,09,10 数字不可重复，最大数字为10'
            // }
            // if (item.name == '极速快3') {
            //     title = '极速快3修改开奖---开奖规则：1,2,3,4,5,6 数字可重复，最小为1最大数字为6'
            // }
            // if (item.name == '极速六合彩') {
            //     title = '极速六合彩修改开奖---开奖规则：1-49 数字不可重复，最小为1最大数字为49'
            // }
            var settle = {
                id: "settleMent",
                url: "",
                title: title,
                content: ""
            };
            var inputNum = item.balls;
            settle.content = '<div id="' + settle.id + '" class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>' +
                '<tr><td style="text-align: right;font-weight:bold;width: 74px;">开奖结果</td>' +
                '<td colspan="3" style="text-align: left;"><div class="form-inline">';
            for (var i = 0; i < inputNum; i++) {
                settle.content +='<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />';
            }
            settle.content +='</div></td></tr>' +
                '<tr><td colspan="4"><button class="btn btn-xs btn-info btn-edit">修改</button><button onclick="layer.closeAll()" class="btn btn-xs btn-default" style="margin-left:15px;">关闭</button></td></tr>' +
                '</tbody></div></div>';
            openIndex = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['720px', 'auto'], //宽高
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                title: settle.title,
                content: settle.content
            });

            function PrefixInteger(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            }

            $("#" + settle.id).find(".btn-edit").off("click").on("click", function (e) {
                // console.log(e);
                var _table = $("#" + settle.id + " table"), numberArr = [];
                var _input = {
                    luckNumber: _table.find("input[name=win]"),
                }
                if (!_user || !_user.userId) {
                    layer.msg("没有这个管理员信息。");
                    return false;
                }
                console.log('edit');
                
                var d = {
                    lotteryId: item.lotteryId,
                    name: item.name,
                    // code: (that.codes[item.name] ? that.codes[item.name] : ""),
                    // code: item.code,
                    issue: (item.number == "正在开奖" ? parseInt(item.issue) : parseInt(item.issue) + 1),
                    authorId: _user.userId,
                    authorName: _user.username
                }

                _input.luckNumber.each(function (e) {
                    var _t = $(this);
                    if (_t.val().length > 0) {
                        numberArr.push(_t.val())
                    }
                });
                var numbers = numberArr.length;
                var commit = false;
                var repeat = 0;
                var commitArray = [];
                // 排列3，福彩3d，时时乐
                // if (d.code.indexOf('ThreeD') > -1 || d.code.indexOf('3D') > -1 || d.code.indexOf('FrequentHappy') > -1 || d.code.indexOf('ArrangeThree') > -1 || d.code.indexOf('ssl') > -1 || d.code.indexOf('pls') > -1 || d.code.indexOf('sffc3d') > -1) {
                if (d.name.indexOf('时时乐') > -1 || d.name.indexOf('3D') > -1 || d.name.indexOf('排列三') > -1 || d.name.indexOf('排列3') > -1 || d.name.indexOf('蛋蛋') > -1) {
                    if (numbers != 3) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 3 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (a, i) {
                            var value = parseInt(a.valueOf(), 10);
                            if (a.valueOf() >= 0 && value < 10) {
                                commitArray.push(value);
                            } else {
                                repeat += 1;
                                layer.msg('当前输入的第（' + (i+1) + '）位开奖数字，输入有误，应该在0-9之间的数字');
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 时时彩
                // if (d.code.indexOf('ssc') > -1 || d.code === 'home_bottom_1') {
                if (d.name.indexOf('时时彩') > -1) {
                    if (numbers != 5) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 5 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (a, i) {
                            var value = parseInt(a.valueOf(), 10);
                            if (a.valueOf() >= 0 && value < 10) {
                                commitArray.push(value);
                            } else {
                                repeat += 1;
                                layer.msg('当前输入的第（' + (i+1) + '）位开奖数字，输入有误，应该在0-9之间的数字');
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 幸运28
                // if (d.code.indexOf('luck') > -1 || d.code.indexOf('xy28') > -1) {
                if (d.name.indexOf('幸运') > -1) {
                    if (numbers != 3) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 3 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (a, i) {
                            var value = parseInt(a.valueOf(), 10);
                            if (a.valueOf() >= 0 && value < 10) {
                                commitArray.push(value);
                            } else {
                                repeat += 1;
                                layer.msg('当前输入的第（' + (i+1) + '）位开奖数字，输入有误，应该在0-9之间的数字');
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 11选5
                // if (d.code.indexOf('11x5') > -1) {
                if (d.name.indexOf('11选5') > -1) {
                    if (numbers != 5) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 5 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (a, i) {
                            var value = parseInt(a.valueOf(), 10);
                            if (a.valueOf() >= 0 && value < 10) {
                                commitArray.push(value);
                            } else {
                                repeat += 1;
                                layer.msg('当前输入的第（' + (i+1) + '）位开奖数字，输入有误，应该在1-11之间的数字');
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // pk10
                // if (d.code.indexOf('pk10') > -1 || d.code.indexOf('sfmlaft') > -1 || d.code.indexOf('home_bottom_5') > -1) {
                if (d.name.indexOf('PK10') > -1 || d.name.indexOf('飞艇') > -1) {
                    if (numbers != 10) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 10 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (numberValues, numberint) {
                            var value = parseInt(numberValues.valueOf(), 10);
                            if (value > 0 && value <= 10) {
                                commitArray.push(PrefixInteger(value, 2));
                                numberArr.forEach(function (a, i) {
                                    if (parseInt(numberValues.valueOf(), 10) == parseInt(a.valueOf(), 10) && numberint != i) {
                                        layer.msg('第' + (numberint + 1) + '位，开奖号码' + numberValues.valueOf() + '和第' + (i + 1) + '位，开奖号码' + a.valueOf() + '重复。');
                                        repeat += 1;
                                    }
                                });
                                commit = true;
                            } else {
                                layer.msg('当前输入的第（' + (numberint + 1) + '）位开奖数字，输入有误，应该在1-10之间的数字');
                                repeat += 1;
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 快三
                // if (d.code.indexOf('k3') > -1 || d.code == 'threeMinuteQuickThree' || d.code.indexOf('jisuk3') > -1) {
                if (d.name.indexOf('快3') > -1) {
                    if (numbers != 3) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法应输入--' + 3 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (a, i) {
                            var value = parseInt(a.valueOf(), 10);
                            if (a.valueOf() >= 0 && value < 7) {
                                commitArray.push(value);
                            } else {
                                repeat += 1;
                                layer.msg('当前输入的第（' + (i+1) + '）位开奖数字，输入有误，应该在1-6之间的数字');
                            }

                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 六合彩
                // if (d.code.indexOf('SixMark') > -1 || d.code == 'quickSixMark' || d.code.indexOf('jisu6') > -1) {
                if (d.name.indexOf('六合彩') > -1) {
                    if (numbers != 7) {
                        layer.msg('当前输入了（' + numbers + '）个开奖数字，玩法因该输入--' + 7 + '--个开奖数字');
                    } else {
                        numberArr.forEach(function (numberValues, numberint) {
                            var value = parseInt(numberValues.valueOf(), 10);
                            if (value > 0 && value <= 49) {
                                commitArray.push(PrefixInteger(value, 2));
                                numberArr.forEach(function (a, i) {
                                    if (parseInt(numberValues.valueOf(), 10) == parseInt(a.valueOf(), 10) && numberint != i) {
                                        layer.msg('第' + (numberint + 1) + '位，开奖号码' + numberValues.valueOf() + '和第' + (i + 1) + '位，开奖号码' + a.valueOf() + '重复。');
                                        repeat += 1;
                                    }
                                });
                                commit = true;
                            } else {
                                layer.msg('当前输入的第（' + (numberint+1) + '）位开奖数字，输入有误，应该在1-49之间的数字');
                                repeat += 1;
                            }
                        });
                        d.number = commitArray.join(',');
                        commit = true;
                    }
                }
                // 验证通过，则提交
                if (commit && repeat == 0) {
                    request("/manage/lottery/system_lottery_manual_draw.do", d, function (res) {
                        if (res.code == 0) {
                            // that.request();
                            layer.closeAll();
                            $("#" + that.tbodyId).find('tr[lotteryId=' + item.lotteryId + ']').find('.manual').text(d.issue + "/" + d.number);
                            layer.closeAll();
                            layer.msg('新增成功');
                        }
                    });
                } else {
                    setTimeout(function(){
                        layer.msg('验证没通过');
                    }, 1500);
                }
            });

        }
    }

});
$(function () {
    vue.onLoad();
});