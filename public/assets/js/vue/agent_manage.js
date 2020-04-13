var vue = new Vue({
    el: '#page-wrapper',
    data: {
        users: [],
        levels: [],
        account: null,
        requestData: {
            account: null,
            startTime: null,
            userId: null,
            endTime: null,
            page: 1,
            pageSize: 15,
            code:null
        },
        userIdArr: [],
        pageNum: 1,
        selectKey: "account",
        selectValue: null,
        selectOptions: {
            agent: null,
        },
        totalPages: 0,
        totalRows: 0,
        currentPage: 1,
        isShowPageNav: false,
        isShowEditor: false,
        action: null, // add, edit, show
        member: {
            userId: null,
            account: null,
            username: null,
            agent: null,
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
            role: 1,
            share: null,
            receivingBank: null,
            balance: 0,
            lastLoginIp: null,
            ladtLoginAddress: null,
            payee: null,
            code: null,
            levelId: null,
            createdTime: null
        },
        systmParams: {
            role: 1,
            sixMark: null,
            pk10: null,
            pcEggs: null,
            three: null,
            elevenPickFive: null,
            quickThree: null,
            frequentLottery: null,
            bankAddress: null,
            receivingBank: null,
            bankAccount: null,
            payee: null,
            wechat: null,
            QQ: null,
            phone: null,
            username: null,
            password: null,
            level: -1,
            account: null
        },
        respassword: null,
        largePrize: {
            frequentLottery: 9,
            quickThree: 9,
            elevenPickFive: 9,
            pk10: 9,
            sixMark: 9,
            three: 9,
            pcEggs: 9
        },
        memberOnlyShow: {
            registrationIp: null,
            deviceId: null,
            enabled: 0,
            rechargeNum: 0,
            rechargeTotal: 0,
            withdrawalNum: 0,
            withdrawalTotal: 0,
            client: null,
            lastLoginTime: null,
        },
        modal: {
            id: 'editModal'
        },
        levelOptions: {},
        initDate: {
            start: null,
            end: null
        },
        ruleLevel: 0, //0为无权限，1为可新增，4为可修改可显示，9为全权限
        shareList: []
    },
    methods: {
        onLoad: function() {
            var that = this;
            $(".form_datetime_start").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function(ev) {
                that.initDate.start = ev.target.value
            });
            $(".form_datetime_end").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function(ev) {
                that.initDate.end = ev.target.value
            });
            request('/manage/member/common_levels.do', {}, function(e) {
                // that.levelOptions = e.data;
                var options = {};
                that.levels = e.data;
                for (var i = 0; i < e.data.length; i++) {
                    options['s' + e.data[i].id] = e.data[i].name;
                }
                that.levelOptions = options;
            });
            var currentDate = getCurrentDate();
            // this.initDate.start = currentDate + " 00:00:00";
            this.initDate.start = "2017-09-01 00:00:00";
            this.initDate.end = currentDate + " 23:59:59";
            this.request();
        },
        request: function(fn) {
            var that = this;
            var start = this.initDate.start
            var end = this.initDate.end
            var reg = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]|[0-9][1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!this.initDate.start || !this.initDate.end) {
                layer.msg('开始时间与结束时间不能为空');
                return false;
            }
            if (Date.parse(trim(this.initDate.start)) > Date.parse(trim(this.initDate.end))) {
                layer.msg('开始时间不能大于结束时间！');
                return false;
            }
            if (!reg.test(trim(this.initDate.start)) || !reg.test(trim(this.initDate.end))) {
                layer.msg('请输入正确的时间！');
                return false;
            }
            this.requestData.startTime = start
            this.requestData.endTime = end
            requestOnce('/manage/member/get_agent_info_list.do', this.requestData, function(e) {
                that.users = e.rows;
                var totalRows = e.total;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.requestData.pageSize);
                that.isShowPageNav = that.totalPages > 1;

                if (e.other) {
                    //可修改权限
                    that.ruleLevel = 4;
                }
                if (typeof fn === "function") { fn(e); }
            });
        },
        openShareList: function(id) {
            var that = this;
            if (!id || id == "" || id == 0) {
                return false;
            }
            requestOnce('/agent/lottery_share/share_list.do', { id: id }, function(data) {
                that.shareList = data.data;
                $("#shareModal").modal();
            });
        },
        doEnabled: function(username, enabled) {
            var that = this;
            requestOnce('/manage/member/dis_enabled.do', { account: username, enabled: enabled }, function() {
                var count = that.users.length;
                for (var i = 0; i < count; i++) {
                    if (that.users[i].account == username) {
                        // that.users[i].enabled = enabled;
                        that.$set(that.users[i], "enabled", enabled);
                        layer.msg("操作成功");
                        // that.request();
                        break;
                    }
                }
            })
        },
        updatePass: function(username, account) {
            // updatePassword(username , account);
            var openIndex = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['480px', '360px'], //宽高
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                title: '修改密码',
                content: '<div class="table-responsive" style="margin:15px;">' +
                    '<table class="table table-striped table-bordered table-hover">' +
                    '<tbody>' +
                    '<tr><td>用户名</td><td>' + username + '</td></tr>' +
                    '<tr><td>密码类型</td><td><div class="form-group form-inline" style="margin-bottom:0"><div class="radio"><label>' +
                    '<input type="radio" name="passType" value="password" checked="">登录密码</label></div>' +
                    '<div class="radio"><label>' +
                    '<input type="radio" name="passType" value="paypassword">支付密码</label></div></div></td></tr>' +
                    '<tr><td>新密码</td><td><input id="pass" class="form-control" type="password"></td></tr>' +
                    '<tr><td>确认密码</td><td><input id="repass" class="form-control" type="password"></td></tr>' +
                    '<tr><td colspan="2"><button onclick="layer.closeAll()" class="btn btn-xs btn-default">关闭</button> <button data-username="' + account + '" onclick="vue.submitPSW(this)" type="button" class="btn btn-xs btn-success">保存</button></td></tr>' +
                    '</tbody></div></div>'
            });

        },
        submitPSW: function(that) {
            var username = $(that).attr('data-username');
            var password = $('#pass').val();
            var repassword = $('#repass').val();
            var type = $('input:radio[name="passType"]:checked').val();
            if (!password) {
                layer.msg('请正确输入密码');
                return;
            }
            if (password != repassword) {
                layer.msg('两次密码不一样,请从新输入');
                var password = $('#pwd').val('');
                var repassword = $('#repass').val('');
                return;
            }
            var requestData = { account: username };
            if (type == 'password') {
                requestData.password = password;
            } else {
                requestData.payPassword = password;
            }
            requestOnce('/manage/member/reset_pwd.do', requestData, function() {
                layer.msg("修改成功");
                layer.close(openIndex);
            });
        },
        doDate: function(name) {
            this.currentPage = 1;
            this.requestData.page = 1;
            var that = this
            if (that.selectValue && that.selectValue.length > 0) {
                that.requestData[that.selectKey] = that.selectValue;
            } else {
                that.requestData[that.selectKey] = null;
            }
            // this.requestData.offset = 0;
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
        doSelect: function() {
            var that = this;
            this.requestData.userId = null;
            this.userIdArr = [];
            //TODO 查询调用
            this.currentPage = 1;
            this.requestData.page = 1;

            that.requestData.account = null;
            that.requestData.username = null;
            if (that.selectValue && that.selectValue.length > 0) {
                that.requestData[that.selectKey] = that.selectValue;
            } else {
                that.requestData[that.selectKey] = null;
            }
            that.initDate.start = $("#startTime").val();
            that.initDate.end = $("#endTime").val();
            for (var e in that.selectOptions) {
                if (that.selectOptions.hasOwnProperty(e) && that.selectOptions[e] != null) {
                    that.requestData[e] = that.selectOptions[e];
                }
            }

            // console.log(this.requestData);
            that.request();
        },
        lookShare: function(userId, memberCount) {
            console.log('准备查询')
            if (memberCount == 0) {
                return false;
            }
            this.requestData.userId = userId;
            if (this.userIdArr[this.userIdArr.length - 1] != userId) {
                this.userIdArr.push(userId);
            }

            var that = this;
            //TODO 查询调用
            this.currentPage = 1;
            this.requestData.page = 1;


            // that.initDate.start = $("#startTime").val();
            // that.initDate.end = $("#endTime").val();

            that.requestData.account = null;
            that.requestData.username = null;
            that.requestData.extensionCode = null;
            that.request();
        },
        back: function() {
            this.userIdArr.pop();
            this.requestData.userId = !this.userIdArr[this.userIdArr.length - 1] ? null : this.userIdArr[this.userIdArr.length - 1];


            var that = this;
            //TODO 查询调用
            this.currentPage = 1;
            this.requestData.page = 1;

            that.requestData.account = null;
            that.requestData.username = null;
            that.requestData.extensionCode = null;
            // that.initDate.start = $("#startTime").val();
            // that.initDate.end = $("#endTime").val();

            that.request();

        },
        clearMemberShow: function() {
            var that = this;
            for (var e in that.memberOnlyShow) {
                if (that.memberOnlyShow.hasOwnProperty(e)) {
                    if (e == 'registrationIp' || e == 'deviceId' || e == 'client' || e == 'lastLoginTime') {
                        that.memberOnlyShow[e] = null;
                    } else {
                        that.memberOnlyShow[e] = 0;
                    }
                }
            }
        },
        clearMember: function() {
            var that = this;
            for (var e in that.member) {
                if (that.member.hasOwnProperty(e)) {
                    if (e == "level") {
                        that.member[e] = -1;
                    } else {
                        that.member[e] = null;
                    }
                }
            }
            that.member.role = 1;
            // console.log(that.member);
        },
        pageNav: function(p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.requestData.page = p
            this.request();
        },
        pageCul: function(curr) {
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
        hideEditor: function() {
            this.clearMember();
            this.isShowEditor = false;
            this.action = null;
            this.clearMemberShow();
            $('#' + this.modal.id).modal('hide');
        },
        editUser: function(user, index) {
            var that = this,
                modalDiv = $('#' + that.modal.id);
            if (this.ruleLevel < 4) {
                layer.msg("没有权限修改信息");
                return false;
            }
            $("#editLabel").attr("eq", index);
            postOnce('/manage/member/user_info.do', { account: user.account }, function(e) {
                var data = e.data;
                for (var a in data) {
                    if (data.hasOwnProperty(a)) {
                        if (that.member.hasOwnProperty(a)) {
                            that.member[a] = data[a];
                        }
                    }
                }
                that.member.username = user.username;
                that.member.share = user.share;
                // that.member.QQ = data.qq;
                that.member.bankName = data.receivingBank;
                that.action = 'edit';
                modalDiv.modal();
            });
        },
        addUser: function() {
            // this.isShowEditor = true;
            this.action = 'add';
            this.clearMember();
            $("#" + this.modal.id).modal();
        },
        submitAgentMsg: function() {
            var that = this,
                url;
            var eq = $("#editLabel").attr("eq");
            if (this.action == 'add') {
                url = '/manage/member/add_user.do';
                // TODO: 验证输入
                if (!that.member.account || that.member.account.length == 0) {
                    layer.msg("新增代理帐号不能为空");
                    return false;
                }
                if (!that.member.password || !that.member.repassword || that.member.password.length == 0 || that.member.repassword.length == 0) {
                    layer.msg("密码或验证密码不能为空");
                    return false;
                }
                if (that.member.password != that.member.repassword) {
                    layer.msg("密码和验证密码不一致");
                    return false;
                }
                if (!that.member.code) {
                    layer.msg("邀请码不能为空");
                    return false;
                }
            } else {
                url = '/manage/member/update_user.do';
            }
            // console.log(that.member);
            // if(!that.member.share || that.member.share.length == 0) {
            //     layer.msg('返点数不可为空,请填写');
            //     return false;
            // }
            requestOnce(url, that.member, function() {
                // if (that.action == 'add') {
                // } else {
                //     that.users[eq].username = that.member.username;
                //     that.users[eq].share = that.member.share;
                // }
                layer.msg('操作成功');
                setTimeout(function() {
                    that.hideEditor();
                    that.request();
                }, 1200);
                // that.clearMember();
                // that.clearMemberShow();
            });
            // console.log(this.member);
        },
        showUserInfo: function(account) {
            var that = this;
            this.clearMember();
            this.clearMemberShow();
            postOnce('/manage/member/user_info.do', { account: account }, function(res) {
                // showUserInfo(res.data);
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
                        for (var ec in that.memberOnlyShow) {
                            if (that.memberOnlyShow.hasOwnProperty(ec)) {
                                if (eh == ec) {
                                    that.memberOnlyShow[ec] = _data[eh];
                                }
                            }
                        }

                    }
                }
                // that.member.QQ = _data.qq;
                that.member.bankName = _data.receivingBank;
                that.action = "show";
                $("#" + that.modal.id).modal();
            });
        },
        addsystem: function() {
            var _modal = $("#addsystemmodel");
            _modal.modal();
            this.clearSystemModal();
        },
        clearSystemModal: function() {
            var _modal = $("#addsystemmodel");
            // _modal.find("table .form-control").val("");
            // _modal.find("select").val(1);
            this.respassword = null;
            for (var e in this.systmParams) {
                if (this.systmParams.hasOwnProperty(e)) {
                    var _item = this.systmParams[e];
                    if (e == "role") {
                        this.systmParams[e] = 1;
                    } else if (e == "level") {
                        this.systmParams[e] = 1;
                    } else {
                        this.systmParams[e] = null;
                    }
                }
            }
        },
        savesystem: function() {
            var that = this;
            if (!that.systmParams.account || that.systmParams.account.length == 0) {
                layer.msg("会员帐号不能为空");
                return false;
            }
            if (!that.systmParams.password || !that.respassword || that.systmParams.password.length == 0 || that.respassword.length == 0) {
                layer.msg("密码或验证密码不能为空");
                return false;
            }
            if (trim(that.systmParams.password).length == 0 || trim(that.respassword).length == 0) {
                layer.msg('请正确输入密码');
                return false;
            }
            if (trim(that.systmParams.password).length < 6 || trim(that.respassword).length < 6) {
                layer.msg('密码不能少于6位')
                return false;
            }
            if (that.systmParams.password != that.respassword) {
                layer.msg('两次密码不一样,请重新输入');
                that.systmParams.password = '';
                that.respassword = '';
                return;
            }
            if (that.systmParams.phone && that.systmParams.phone.length > 0 && that.systmParams.phone.length !== 11) {
                layer.msg('请输入正确的手机号码')
                return false;
            }
            if (!that.systmParams.level || that.systmParams.level < 0) {
                layer.msg('请选择会员分层')
                return false;
            }
            var payee = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){2,5}$/;
            if (that.systmParams.payee && !payee.test(that.systmParams.payee)) {
                layer.msg('收款人姓名只能填2~5个中文');
                return false;
            }
            var reg = /^[0-9]+([.][0-9]{1}){0,1}$/;
            if (that.systmParams.frequentLottery < 0 || that.systmParams.frequentLottery > that.largePrize.frequentLottery) {
                layer.msg("时时彩返点必须在0.0与" + that.largePrize.frequentLottery + "之间");
                return;
            }
            if (that.systmParams.quickThree < 0 || that.systmParams.quickThree > that.largePrize.quickThree) {
                layer.msg("快3返点必须在0.0与" + that.largePrize.quickThree + "之间");
                return;
            }
            if (that.systmParams.elevenPickFive < 0 || that.systmParams.elevenPickFive > that.largePrize.elevenPickFive) {
                layer.msg("11选5返点必须在0.0与" + that.largePrize.elevenPickFive + "之间");
                return;
            }
            if (that.systmParams.three < 0 || that.systmParams.three > that.largePrize.three) {
                layer.msg("排列3返点必须在0.0与" + that.largePrize.three + "之间");
                return;
            }
            if (that.systmParams.pcEggs < 0 || that.systmParams.pcEggs > that.largePrize.pcEggs) {
                layer.msg("快乐8返点必须在0.0与" + that.largePrize.pcEggs + "之间");
                return;
            }
            if (that.systmParams.pk10 < 0 || that.systmParams.pk10 > that.largePrize.pk10) {
                layer.msg("北京赛车返点必须在0.0与" + that.largePrize.pk10 + "之间");
                return;
            }
            if (that.systmParams.sixMark < 0 || that.systmParams.sixMark > that.largePrize.sixMark) {
                layer.msg("六合彩返点必须在0.0与" + that.largePrize.sixMark + "之间");
                return;
            }
            if (!that.systmParams.frequentLottery ||that.systmParams.frequentLottery == "") {
                layer.msg("时时彩返点不能为空");
                return;
            }
            if (!that.systmParams.quickThree || that.systmParams.quickThree == "") {
                layer.msg("快3返点不能为空");
                return;
            }
            if (!that.systmParams.elevenPickFive || that.systmParams.elevenPickFive == "") {
                layer.msg("11选5返点不能为空");
                return;
            }
            if (!that.systmParams.three || that.systmParams.three == "") {
                layer.msg("排列3返点不能为空");
                return;
            }
            if (!that.systmParams.pcEggs || that.systmParams.pcEggs == "") {
                layer.msg("快乐8返点不能为空");
                return;
            }
            if (!that.systmParams.pk10 || that.systmParams.pk10 == "") {
                layer.msg("北京赛车返点不能为空");
                return;
            }
            if (!that.systmParams.sixMark || that.systmParams.sixMark == "") {
                layer.msg("六合彩返点不能为空");
                return;
            }
            if (!reg.test(that.systmParams.frequentLottery) || !reg.test(that.systmParams.quickThree) || !reg.test(that.systmParams.elevenPickFive) || !reg.test(that.systmParams.three) || !reg.test(that.systmParams.pcEggs) || !reg.test(that.systmParams.pk10) || !reg.test(that.systmParams.sixMark)) {
                layer.msg("请确认所有输入的返点数都符合要求");
                return;
            }
            requestOnce('/manage/member/add_share_user.do', that.systmParams, function(e) {
                if (e.code == 0) {
                    layer.msg('添加成功！');
                    $('#addsystemmodel').modal('hide');
                    that.request();
                }
            })
        }
    },
    created: function() {
        $(document).keyup(function(event) {
            if (event.keyCode == 13) {
                vue.doSelect();
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