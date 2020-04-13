var keyPress = function (ob) {
    if (!ob.value.match(/^[\+\-]?\d*?\.?\d*?$/)) ob.value = ob.t_value; else ob.t_value = ob.value;
    if (ob.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/)) ob.o_value = ob.value;
}
var keyUp = function (obj) {
    obj.value = obj.value.replace(/[^\d]/g, "");  //清除“数字”和“.”以外的字符
    // obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    // obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    // obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        // obj.value= parseFloat(obj.value);
        obj.value = obj.value;
    }
}
var onBlur = function (ob) {
    if (!ob.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?|\.\d*?)?$/)) ob.value = ob.o_value; else {
        if (ob.value.match(/^\.\d+$/)) ob.value = 0 + ob.value;
        if (ob.value.match(/^\.$/)) ob.value = 0;
        ob.o_value = ob.value
    };
}
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        pageNum: 1,
        initRequestData: {
            account: null,
            type: -1,
            offset: 0,
            count: 15,
            start: 0,
            end: 0,
            issue: null,
            orderId: null,
            lotteryId: -1,
            status: -1
        },
        initDate: {
            start: null,
            end: null
        },
        logData: {
            betTime: null,
            content: null,
            count: 0,
            groupName: null,
            issue: null,
            lotteryName: null,
            luckNumber: null,
            oid: null,
            orderId: null,
            playName: null,
            remark: null,
            status: null,
            totalFee: null,
            unitFee: null,
            winFee: null,
        },
        levelOptions: [],
        action: null,
        modal: {
            id: "logModal"
        },
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
        options: {
            status: [
                {
                    name: '全部状态',
                    value: -1
                }, {
                    name: '未开奖',
                    value: 1
                }, {
                    name: '未中奖',
                    value: 2
                }, {
                    name: '已中奖',
                    value: 3
                }, {
                    name: '已撤单',
                    value: 10
                },
            ],
            lotteryCategory: []
        },
        totalFee: 0.0,
        totalWinFee: 0.0,
        totalPages: 0,
        totalRows: 0,
        totalOrder:0,
        smallFee: 0.0,
        smallWinFee: 0.0,
        levels: [],
        currentPage: 1,
        isShowPageNav: false,
        selected: "",
        lotteryArry : [],
        lotterys: {},
        lotteryCode : "cqssc",
        lottertyNums :5,
        isShowOpenNumber: true,
        systemCodes: {
            // "幸运28": "luck28",
            // "三分时时彩": "sfssc",
            // "三分PK10": "sfpk10",
            6: "三分时时彩",
            8: "三分PK10",
            17: "幸运28",
            27: "极速快3",
            28: "极速六合彩"
        },
        lotteryType: { // 类型对应lotteryId
			FrequentLottery: [4, 6, 11, 12],
			ElevenPickFive: [5, 13, 14, 15, 39],
			PCEggs: [7, 17],
			QuickThree: [1, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 44],
			SixMark: [9, 28],
			Three: [2, 10, 18, 40, 41, 42],
			PK10: [3, 8, 29, 43]
		},
        openNum: {
            FrequentLottery: 5,
            ElevenPickFive: 5,
            PCEggs: 3,
            QuickThree: 3,
            SixMark: 7,
            Three: 3,
            PK10: 10
        },
        shareList: []
    },
    methods: {
        onLoad: function (e) {
            var that = this;
            $(".form_datetime_start").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
            }).on('changeDate', function (ev) {
                that.initDate.start = ev.target.value
            });
            $(".form_datetime_end").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
            }).on('changeDate', function (ev) {
                that.initDate.end = ev.target.value
            });
            var currentDate = getCurrentDate();
            this.initDate.start = currentDate + " 00:00:00";
            this.initDate.end = currentDate + " 23:59:59";
            request('/manage/member/common_levels.do', {}, function (res) {
                var result = res.data;
                $.each(result, function (k, v) {
                    that.levels[v.id] = v.name;
                });
            });
            request('/manage/lottery/get_lottery_category_list.do', {}, function (res) {
                var result = res.data;
                that.lotteryArry = result;
                $.each(result, function (k, v) {
                    that.lotterys[v.code] = v.total;
                });
            });
            this.requestCategories();
            // this.request();
        },
        requestCategories : function () {
            var that = this;
            that.options.lotteryCategory = [];
            that.options.lotteryCategory.push({ name: '全部彩种', lotteryId: -1 });
            request('/manage/lottery/categories.do', {}, function(e) {
                if (e.code != 0) {
                    return layer.msg(e.msg);
                }
                var lottery_type = new LotteryType().setLotteryType(e.data);
                that.lotteryType = lottery_type;
                console.log(that.lotteryType);
                $.each(e.data, function (i, item) {
                    if (item.lotteryId != 100001) {
                        that.options.lotteryCategory.push(item);
                    }
                });
                if (that.options.lotteryCategory.length != 0) {
                    // that.selectLotteryId = that.lotteryCategory[0].lotteryId;
                    // that.selectLotteryName = that.lotteryCategory[0].name;
                }
                that.request();
            });
        },
        request: function () {
            var that = this;
            this.initRequestData.start = this.initDate.start;
            this.initRequestData.end = this.initDate.end;
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
            for (var e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(e)) {
                    if (that.initRequestData[e] == "") {
                        that.initRequestData[e] = null;
                    }
                }
            }
            layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            request('/manage/lottery_log/betting.do', this.initRequestData, function (e) {
                if (e.code != 0) {
                    layer.msg(e.msg)
                     layer.closeAll();
                    return;
                }
                layer.closeAll();
                that.logs = e.data.orders;
                var smallFee = 0;
                var smallWinFee = 0;
                for (var i = 0; i < that.logs.length; i++) {
                    if (e.data.orders[i].status != 10) {
                        smallFee += e.data.orders[i].totalFee ? e.data.orders[i].totalFee : 0;
                        smallWinFee += e.data.orders[i].winFee ? e.data.orders[i].winFee : 0;
                    }
                }

                that.smallFee = smallFee.toFixed(2);
                that.smallWinFee = smallWinFee;
                var totalFee = e.data.total.totalFee ? e.data.total.totalFee : 0.0;
                that.totalFee = totalFee.toFixed(2);
                var totalWinFee = e.data.total.winFee ? e.data.total.winFee : 0.0;
                that.totalWinFee = totalWinFee.toFixed(3);
                that.totalRows = e.data.total.totalRows;
                // 翻页导航
                var totalRows = e.data.total.totalRows;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
                that.isShowPageNav = that.totalPages > 1;
                that.totalOrder=e.data.total.totalOrder;
            });
        },
        query: function () {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.request();
        },
        download: function () {
            var that = this;
            this.initRequestData.start = this.initDate.start;
            this.initRequestData.end = this.initDate.end;
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
            for (var e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(e)) {
                    if (that.initRequestData[e] == "") {
                        that.initRequestData[e] = null;
                    }
                }
            }
            layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            request('/manage/system_settings/member_bettingRecords_down_excel.do', this.initRequestData, function (e) {
                if (e.code != 0) {
                    layer.msg(e.msg)
                     layer.closeAll();
                    return;
                } else {
                    location.href = e.data;
                }
                layer.closeAll();
            })
        },
        countChange: function () {
            this.initRequestData.offset = 0;
            this.currentPage = 1;
            this.initRequestData.count = parseInt(this.initRequestData.count);
            this.request();
        },
        doDate: function (name) {
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
        doStatus: function (item) {
            var str = '';
            if (item.status == 1) {
                str = '<small class="label label-info">未开奖</small>';
            }
            if (item.status == 2 && item.winFee == 0) {
                str = '<small class="label label-danger">未中奖</small>';
            }
            if (item.status == 3 && item.winFee > 0) {
                str = '<small class="label label-success">已中奖</small>';
            }
            if (item.status == 4) {
                str = '<small class="label label-warning">和局</small>';
            }
            if (item.status == 10) {
                str = '<small class="label label-warning">已撤单</small>';
            }
            if (item.status == 20) {
                str = '<small class="label label-info">手动回滚</small>';
            }
            if (item.status == 30) {
                str = '<small class="label label-success">追加中</small>';
            }
            if (item.status == 99) {
                str = '<small class="label label-danger">异常状态</small>';
            }
            return str;

        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.offset = (p - 1) * this.initRequestData.count;
            this.request();
        },
        pageCul: function (curr) {
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
        doSettle: function (item, type) {
            var that = this;
            var _user = JSON.parse(sessionStorage.getItem('user'));
            var oid = item.oid;
            // console.log(oid);
            // var _inx = layer.load(2, {
            //   shade: [0.2, "#000"],
            //   time: 5000
            // });

            var settle = {
                id: "settleMent",
                url: "",
                title: "",
                content: ""
            };
            // if (that.systemCodes[that.lotteryCode]) {
            
            // var isSystemCodes = false;
            // for (var e in that.systemCodes) {
            //     if (that.systemCodes.hasOwnProperty(e) && that.systemCodes[e] == item.lotteryName) {
            //         isSystemCodes = true;
            //     }
            // }
            var isSystemCodes = true;
            for (var j = 0; j < that.lotteryArry.length; j++) {
                var _manChangeLottery = that.lotteryArry[j];
                if (_manChangeLottery.lotteryId === item.lotteryId) {
                    isSystemCodes = false;
                }
            }
            //系统彩下，开奖号码系统自己计算
            if (isSystemCodes) {
                var d = {
                    oid: oid,
                    userId: _user.userId,
                    userName: _user.account
                }
                requestOnce("/manage/lottery_log/betting_head.do", d, function (res) {
                    // layer.closeAll();
                    if (res.code == 0) {
                        layer.msg("开奖成功");
                        setTimeout(function() {
                            that.request();
                            layer.closeAll();
                        }, 1300);
                    }
                });
                return false;
            }
            //公共彩，可以让用户人工开奖
            if (type == "award") {
                settle.url = "";
                settle.title = '人工开奖';
                // TODO: 找到默认开奖数
                var type = "", _openNum = 10;
                for (var inx = 0; inx < that.lotteryArry.length; inx++) {
                    var _item = that.lotteryArry[inx];
                    
                    if (_item.name == item.lotteryName) {
                        // console.log(_item);
                        // console.log(item);
                        for (var key in that.lotteryType) {
                            if (that.lotteryType.hasOwnProperty(key)) {
                                var e = that.lotteryType[key];
                                if (e.indexOf(_item.lotteryId) > -1) {
                                    type = key;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                _openNum = that.openNum[type];
                // console.log(type+" "+_openNum);
                if (!_openNum || _openNum == 0) { return false; }
                var luckyData = '';
                var _inputHtml = '';
                request("/manage/lottery_log/get_luckNumber.do", {lotteryId:item.lotteryId,issue:item.issue}, function (res) {
                    if (res.code == 0) {
                        luckyData = res.data
                    } else {
                        layer.msg("无开奖结果，请手动输入开奖结果");
                    }
                    if (luckyData.length > 0) {
                        $("#" + settle.id + " table").find("input[name=win]").each(function (index,item) {
                            var _t = $(this);
                            // console.log(e);
                            _t.val(luckyData.split(',')[index])
                        });
                    }
                });
                
                _inputHtml = (function(){
                    var s = "";
                    for (var _i = 0; _i < _openNum; _i++) {
                        s += '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />'
                    }
                    return s;
                })();
                /**
                 '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +

                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px; margin-right: 5px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />' +
                    '<input class="form-control" style="width: 48px;" type="text" onkeyup="keyUp(this)" name="win" maxLength="3" />'
                 */
                 
                settle.content = '<div id="' + settle.id + '" class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>' +
                '<tr><td style="text-align: right;font-weight:bold;">开奖结果</td>' +
                '<td colspan="3" style="text-align: left;"><div class="form-inline">' +
                _inputHtml +
                '</div></td></tr>' +
                '<tr><td colspan="4"><button class="btn btn-sm btn-info btn-edit">修改</button><button onclick="layer.closeAll()" class="btn btn-sm btn-default" style="margin-left:15px;">关闭</button></td></tr>' +
                '</tbody></div></div>';
                    
                //<input class="form-control" type="text" name="win" value="" />
            } else if (type == "settle") {
                // settle.url = "";
                // settle.title = '人工结算';
                // settle.content = '<div id="'+settle.id+'" class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>'+
                // '<tr><td style="text-align: right;font-weight:bold;">开奖结果</td><td colspan="3" style="text-align: left;"><input class="form-control" type="text" name="win" value="" /></td></tr>'+
                // '<tr><td style="text-align: right;font-weight:bold;">开奖状态</td><td colspan="3" style="text-align: left;"><select class="form-control" name="status"><option value="1">未开奖</option><option value="2">未中奖</option><option value="3">已中奖</option></select></td></tr>'+
                // '<tr><td colspan="4"><button class="btn btn-xs btn-info btn-edit">修改</button><button onclick="layer.closeAll()" class="btn btn-xs btn-default" style="margin-left:15px;">关闭</button></td></tr>'+
                // '</tbody></div></div>';
            }

            var infoIndex = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['720px', '22%'], //宽高
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                title: settle.title,
                content: settle.content
            });
            //'<tr><td colspan="4"><button onclick="layer.close(infoIndex)" class="btn btn-xs btn-default">关闭</button></td></tr>'+
            $("#" + settle.id).find(".btn-edit").off("click").on("click", function (e) {
                // console.log(e);
                var _table = $("#" + settle.id + " table"), numberArr = [];
                // var key = ["luckNumber", "status"];
                var _input = {
                    luckNumber: _table.find("input[name=win]"),
                    // status: _table.find('input[name=status]')
                }
                if (!_user.userId) {
                    layer.msg("没有这个管理员信息。");
                    return false;
                }
                var d = {
                    oid: oid,
                    userId: _user.userId,
                    userName: _user.account
                }
                // if (trim(_input[key[0]].val()).length == 0) {
                // 	layer.msg("开奖结果不能为空");
                // 	return false;
                // } else {
                // 	d[key[0]] = _input[key[0]].val();
                // }

                _input.luckNumber.each(function (e) {
                    var _t = $(this);
                    // console.log(e);
                    if (_t.val().length > 0) {
                        numberArr.push(_t.val())
                    }
                });
                d.luckNumber = numberArr.join(',');
                // console.log(d);
                // if (_input[key[1]].length > 0) {
                // 	if (trim(_input[key[1]].val()).length == 0) {
                // 		layer.msg("开奖状态不能为空");
                // 		return false;
                // 	} else {
                // 		d[key[1]] = _input[key[1]].val();
                // 	}
                // }

                requestOnce("/manage/lottery_log/betting_head.do", d, function (res) {
                    if (res.code == 0) {
                        layer.msg("开奖成功");
                        setTimeout(function() {
                            that.request();
                            layer.closeAll();
                        }, 1300);
                    }
                });
            });

        },
        delRow: function (item) {
            var that = this;
            var lock = false; //默认未锁定
            layer.confirm('确定撤单？', {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function (index, layero) {
                // layer.msg("撤单成功");
                var uu = JSON.parse(sessionStorage.getItem("user"));
                var data = {
                    oid: item.oid,
                    authorId: uu.userId,
                    authorName: uu.account
                }
                if (!lock) {
                    lock = true; // 锁定
                    requestOnce('/manage/lottery_log/kill_order.do', data, function (res) {
                        if (res.code == 0) {
                            that.request();
                            layer.msg("撤单成功");
                            setTimeout(function () {
                                layer.closeAll();
                            }, 1000);
                        }
                    });
                }


            }, function () {

            });
        },
        showUserInfo: function (item) {
            var that = this;
            for (var e in that.logData) {
                if (that.logData.hasOwnProperty(e)) {
                    that.logData[e] = null;
                }
            }
            that.action = "show";
            for (var e in item) {
                if (item.hasOwnProperty(e)) {
                    that.logData[e] = item[e];
                }
            }
            $("#" + that.modal.id).modal();
        },
        logDetailStatus: function(logData) {
            var str = "";
            if (logData.status == 1) {
                str = "未开奖";
            } else if (logData.status == 2) {
                str = "未中奖";
            } else if (logData.status == 3) {
                str = "已中奖";
            } else if (logData.status == 4) {
                str = "和局";
            } else if (logData.status == 10) {
                str = "已撤单";
            } else if (logData.status == 20) {
                str = "手动回滚";
            } else if (logData.status == 30) {
                str = "追加中";
            } else {
                str = "异常状态";
            }
            return str;
        },
        newLuckyNumber: function () {
            $("#lucky-number-modal").modal('toggle');
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
        checkIsShow: function() {
            var that = this;
            var _code = that.lotteryCode,
                _lotteryId = 0;

            $.each(that.lotteryArry, function(i, val){
                if (val.code == _code) {
                    _lotteryId = val.lotteryId
                }
            });
            var _notSys = true;
            if (that.systemCodes[_lotteryId]) {
                _notSys = false;
            }
            that.isShowOpenNumber = _notSys;
        },
        save: function () {
            var data = {};
            var submitUrl = "/manage/lottery/add_luck_number.do";

            var that = this;
            var _inputs = $("#lucky-number-modal").find(".form-control");
            _inputs.each(function (e) {
                var _t = $(this);
                data[_t.attr('name')] = _t.val();
            });
            var lotteryId = $("#m-code").find("option:selected").attr("lotteryId");
            data['lotteryId'] = lotteryId;
            var number = [];
            var numberInputs = $(".number");
            $.each(numberInputs,function (k, v) {
                number.push($(this).val());
            });
            data['number'] = number.join(",");
            var canReauest = true;
            if (!data.code || data.code == "") {
                layer.msg("请选择彩种名称");
                canReauest = false;
            } else if(!data.issue || data.issue == "") {
                layer.msg("请输入期数");
                canReauest = false;
            } else if(!data.number || data.number == "" || data.number.split(",")[0] == "") {
                if (!that.systemCodes[lotteryId]) {
                    layer.msg("请输入开奖号码");
                    canReauest = false;
                }
            } else if(!data.time || data.time == "") {
                layer.msg("请输入开奖时间");
                canReauest = false;
            } else {
                canReauest = true;
            }
            if (canReauest == true) {
                request(submitUrl, data, function (res) {
                    if (res.code == 0) {
                        layer.msg(res.data.message);
                        _inputs.each(function (e) {
                            $(this).val('');
                        });
                        numberInputs.each(function (e) {
                            $(this).val('');
                        });
                        $('#lucky-number-modal').modal('hide');
                    }
                });
            }

        },
        showUserInfos: function (item) {
            var that = this;
            for (var e in that.logData) {
                if (that.logData.hasOwnProperty(e)) {
                    that.logData[e] = null;
                }
            }
            that.action = "show";
            for (var e in item) {
                if (item.hasOwnProperty(e)) {
                    that.logData[e] = item[e];
                }
            }
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

            post('/manage/member/user_info.do', {account: item.remark}, function (res) {
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

                $("#userModal").modal();
            });
        }

    },
    created : function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13 || event.keyCode == 32) {
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
        orderFilter: function(val) {
            var strLength = val.length;
            var str1 = val.substring(0,8);
            var str2 = val.substring(strLength-3,strLength);
            var str3 = str1 + '...' + str2;
            return str3
        }
    }
});

vue.onLoad();
vue.$watch('lotteryCode', function (newVal, oldVal) {
    vue.lottertyNums = vue.lotterys[newVal];
},{deep:true})
