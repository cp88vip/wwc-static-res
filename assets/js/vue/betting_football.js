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
            lotteryId: 100001,
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
            winFee: null
        },
        levelOptions: [],
        action: null,
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
            this.request();
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
            request('/manage/foot_ball/football_betting.do', this.initRequestData, function (e) {
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
                that.totalWinFee = totalWinFee.toFixed(2);
                that.totalRows = e.data.total.totalRows;
                // 翻页导航
                var totalRows = e.data.total.totalRows;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
                that.isShowPageNav = that.totalPages > 1;
                that.totalOrder=e.data.total.totalOrder;
            });
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
            request('/manage/system_settings/member_footballBettingRecords_down_excel.do', this.initRequestData, function (e) {
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
        query: function () {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.request();
        },
        lookDetile :function (orderId) {
            var html ='<table class="detile table table-bordered table-striped">';
            html +='<thead>';
            html +='<tr>';
            html +='<th>赛事编号</th>';
            html +='<th>主队</th>';
            html +='<th>客队</th>';
            html +='<th>比赛结果</th>';
            html +='<th style="width: 400px;">注单内容</th>';
            html +='<th>胆</th>';

            html +='<th>让球个数</th>';
            html +='</tr>';
            html +='</thead>';
            html +='<tbody>';
            html +='<tr><td colspan="100">数据加载中。。。</td></tr>';
            html +='</tbody>';
            html +='</table>';
            layer.open({
                type: 1,
                title: '注单详情',
                shadeClose: true,
                skin: 'layui-layer-rim', //加上边框
                area: ['1000px', '500px'], //宽高
                content: html
            });
            request('/manage/foot_ball/football_betting_detail.do', {orderId:orderId}, function (res) {
                var result = res.data,html1 = '';

                $.each(result,function (k, v) {
                    html1 +='<tr>';
                    html1 +='<td>' + v.code + '</td>';
                    html1 +='<td>' + v.teamHome + '</td>';
                    html1 +='<td>' + v.teamAway + '</td>';
                    if(v.playResult){
                        html1 +='<td>' + v.playResult + '</td>';
                    }else{
                        html1 +='<td>-</td>';
                    }
                    html1 +='<td>';

                    $.each(v,function (k2, v2) {
                        switch (k2){
                            case "oddSpfHf":
                            case "oddSpf":
                            case "oddSpfR":
                                var arr = v2.split("|"),arr1 = arr[0].split(":");
                                if(arr[1]){
                                    if(arr1[1].indexOf(arr[1]) == -1){
                                        html1 += v2 +'<br/>';
                                    }else{
                                        var arr0 = arr1[1].split(arr[1]);
                                        html1 += arr1[0] +":"+arr0[0] +"<span style='color:#ff3300;'>"+ arr[1] +'</span>'+arr0[1]+'|'+arr[1]+'<br/>';

                                    }
                                }else{
                                    html1 += v2 +'<br/>';
                                }

                                break;
                            case "oddGoal":
                                var arr = v2.split("|");arr1 = arr[0].split(":");
                                if(arr[1]){
                                    if(arr[1].indexOf("+") == -1){
                                        if(arr1[1].indexOf(arr[1]) == -1){
                                            html1 += v2 +'<br/>';
                                        }else{
                                            var arr0 = arr1[1].split(arr[1]);
                                            html1 += arr1[0] +":"+arr0[0] +"<span style='color:#ff3300;'>"+ arr[1] +'</span>'+arr0[1]+'|'+arr[1]+'<br/>';

                                        }
                                    }else{
                                        if(arr[0].indexOf("7+") == -1){
                                            html1 += v2 +'<br/>';
                                        }else{
                                            var arr0 = arr[0].split("7+");
                                            html1 += arr0[0] +"<span style='color:#ff3300;'>7+</span>"+arr0[1]+'|'+arr[1]+'<br/>';

                                        }
                                    }
                                }else{
                                    html1 += v2 +'<br/>';
                                }

                                break;
                            case "oddRate":
                                var arr = v2.split("|");
                                if(arr[1]){
                                    if(arr[0].indexOf(arr[1]) == -1){
                                        html1 += v2 +'<br/>';
                                    }else{
                                        var arr0 = arr[0].split(arr[1]);
                                        html1 += arr0[0] +'<span style="color:#ff3300;">'+arr[1]+'</span>'+arr0[1]+'|'+arr[1]+'<br/>';
                                    }
                                }else{
                                    html1 += v2 +'<br/>';
                                }

                                break;
                        }
                    });

                    html1 +='</td>';
                    if(v.courage){
                        html1 +='<td>胆</td>';
                    }else{
                        html1 +='<td>-</td>';
                    }

                    if(v.oddRang){
                        html1 +='<td>' + v.oddRang + '球</td>';
                    }else{
                        html1 +='<td>-</td>';
                    }
                    html1 +='</tr>';
                });
                $(".detile tbody").html(html1);
            });

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
        doSettle: function (item) {
            var that = this;
            var _orderId = item.orderId;
            request("/manage/foot_ball/manual_cash_prize.do", {orderId: _orderId}, function(res) {
              layer.msg("开奖成功");
              setTimeout(function() {
                layer.closeAll();
                that.request();
              }, 1500);
            });
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
                    request('/manage/lottery_log/kill_order.do', data, function (res) {
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


            post('/manage/member/user_info.do', {account: item.aminName}, function (res) {
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
        }
    }
});

vue.onLoad();
vue.$watch('lotteryCode', function (newVal, oldVal) {
    vue.lottertyNums = vue.lotterys[newVal];
},{deep:true});
