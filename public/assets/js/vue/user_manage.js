var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        levels: [],
        levelsType: [
            {
                type: 0,
                name: '会员'
            },
            {
                type: 1,
                name: '代理'
            }
        ],
        levelMenus: [],
        useridMenus: [],
        accountMenus: [],
        operation: 1,
        initRequestData: {
            type: "user",
            agent: null,
            // account: null,
            count: 15,
            sortOrder: "desc",
            offset: 0,
            start: 0,
            end: 0,
        },
        initDate: {
            start: "2017-10-01 00:00:00",
            end: ""
        },
        member: {
            userId: null,
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
            code: null,
            levelId: null
        },
        systmParams: {
            role: null,
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
            account: null,
            levelType: null
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
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
        balance: 0,
        searchAgent: "",
        typeArr: [{
                value: "account",
                text: "会员账户"
            },
            {
                value: "ip",
                text: "IP地址"
            },
            {
                value: "username",
                text: "会员姓名"
            },
            {
                value: "bankAccount",
                text: "会员银行卡"
            },
            {
                value: "phone",
                text: "电话"
            },
            {
                value: "qq",
                text: "QQ"
            },
            {
                value: "wechart",
                text: "微信"
            },
            {
                value: "code",
                text: "邀请码"
            },
        ],
        typeSelected: {
            key: "account",
            val: null
        },
        userId: null,
        action: "show",
        levelOptions: {},
        ruleLevel: 0, //0为无权限，1为可新增，4为可修改可显示，9为全权限
        shareList: [],
        levelModel: [], // 层级路径
        rebateModel: [], // 返点显示
        entryLevel: null
    },
    filters: {
        newName: function (val) {
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
    },
    methods: {
        onLoad: function (e) {
            var that = this;
            $(".form_datetime_start").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function (ev) {
                that.initDate.start = ev.target.value
            });
            $(".form_datetime_end").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function (ev) {
                that.initDate.end = ev.target.value
            });
            var currentDate = getCurrentDate();
            // this.initDate.start = currentDate + " 00:00:00";
            this.initDate.end = currentDate + " 23:59:59";
            // 提取用户账号参数
            url = window.location.href;
            if (url.indexOf('#') != -1) {
                this.initRequestData.account = url.split('#')[1];
            }
            that.getLevelOptions();
            that.request();
        },
        lookShare2: function (userId, memberCount, name, account) {
            // console.log('准备查询')
            if (memberCount == 0) {
                return false;
            }
            this.initRequestData.offset = 0;
            this.currentPage = 1;
            this.userId = userId;
            console.log(userId);
            this.typeSelected.val = null;
            this.levelMenus.push(name);
            this.useridMenus.push(userId);
            this.accountMenus.push(account)
            //TODO 查询调用
            var that = this;
            // that.request();
            _realRequest = {};
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // for (var each in that.initRequestData) {
            //     if (that.initRequestData.hasOwnProperty(each)) {
            //         var _e = that.initRequestData[each];
            //         if (each != "type" && each != "count" && each != "sortOrder" && each != "offset") {
            //             _e = null;
            //         }
            //     }
            // }
            var start = that.initDate.start.replace(/-/g, "/");
            var end = that.initDate.end.replace(/-/g, "/");
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
            if (!(strDateTime(start) && strDateTime(end))) {
                layer.msg("请检查查询的时间格式");
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();

            // that.initRequestData.startTime = that.initDate.start;
            // that.initRequestData.endTime = that.initDate.end;
            // var agent = $("#agent").val();
            // if (agent.length > 0) {
            //     that.initRequestData.agent = agent;
            // } else {
            //     that.initRequestData.agent = null;
            // }
            // var options = $("#type option");
            // $.each(options, function (k, v) {
            //     var val = $('#type option:nth-child(' + (k + 1) + ')').val();
            //     if (that.initRequestData[val]) {
            //         that.initRequestData[val] = "";
            //     }
            // });
            // var saccount = $("#saccount").val();
            // var type = $("#type").val();
            // if (saccount.length > 0) {
            //     that.initRequestData[type] = saccount;
            // } else {
            //     that.initRequestData[type] = null;
            // }


            var listUrl = '/manage/member/user_list.do';
            // listUrl = ' http://192.168.3.16:8010/manage/member/user_list.do'

            _realRequest[that.typeSelected.key] = that.typeSelected.val;
            if (_realRequest[that.typeSelected.key] == "") {
                _realRequest[that.typeSelected.key] = null;
            }
            for (var _e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(_e)) {
                    _realRequest[_e] = that.initRequestData[_e];
                }
            }
            _realRequest.userId = that.userId;
            _realRequest.entryLevel = that.entryLevel;
            requestOnce(listUrl, _realRequest, function (e) {
                var logs = e.rows;
                // TODO: 不知道这是什么。。先留着
                // $.each(logs, function (k, v) {
                //     logs[k].changeType = that.changeType(v.type);
                // });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;
                if (e.other) {
                    //可修改权限，根据有没有other来判断
                    that.ruleLevel = 4;
                    e.other.forEach(function (item) {
                        that.accountMenus.push(item.account);
                    });
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
                if (that.GetQueryString("type") == "isOnline") {
                that.operation = 0;
                }
            });
        },
        userManage: function (item, index) {
            console.log(item)
            var that = this;
            this.initRequestData.offset = 0;
            this.currentPage = 1;
            this.useridMenus.splice(index, that.useridMenus.length);
            this.levelMenus.splice(index, that.levelMenus.length);
            this.accountMenus.splice(index, that.accountMenus.length)
            console.log(this.useridMenus);
            this.userId = this.useridMenus[index - 1];
            that.typeSelected.val = null;
            // var that = this;
            // that.request();
            var listUrl = "",
            _realRequest = {};
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // for (var each in that.initRequestData) {
            //     if (that.initRequestData.hasOwnProperty(each)) {
            //         var _e = that.initRequestData[each];
            //         if (each != "type" && each != "count" && each != "sortOrder" && each != "offset") {
            //             _e = null;
            //         }
            //     }
            // }
            var start = that.initDate.start.replace(/-/g, "/");
            var end = that.initDate.end.replace(/-/g, "/");
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
            if (!(strDateTime(start) && strDateTime(end))) {
                layer.msg("请检查查询的时间格式");
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();

            // that.initRequestData.startTime = that.initDate.start;
            // that.initRequestData.endTime = that.initDate.end;
            // var agent = $("#agent").val();
            // if (agent.length > 0) {
            //     that.initRequestData.agent = agent;
            // } else {
            //     that.initRequestData.agent = null;
            // }
            // var options = $("#type option");
            // $.each(options, function (k, v) {
            //     var val = $('#type option:nth-child(' + (k + 1) + ')').val();
            //     if (that.initRequestData[val]) {
            //         that.initRequestData[val] = "";
            //     }
            // });
            // var saccount = $("#saccount").val();
            // var type = $("#type").val();
            // if (saccount.length > 0) {
            //     that.initRequestData[type] = saccount;
            // } else {
            //     that.initRequestData[type] = null;
            // }

            if (that.GetQueryString("type") == "isOnline" && that.accountMenus.length == 0) {
                listUrl = "/manage/member/get_on_line.do";
                that.initRequestData.start = null;
                that.initRequestData.end = null;
                $("#form-inline").hide();
            } else {
                listUrl = '/manage/member/user_list.do';
                // listUrl = ' http://192.168.3.16:8010/manage/member/user_list.do'
            }
            // var listUrl = '/manage/member/user_list.do';
            // listUrl = ' http://192.168.3.16:8010/manage/member/user_list.do'

            _realRequest[that.typeSelected.key] = that.typeSelected.val;
            if (_realRequest[that.typeSelected.key] == "") {
                _realRequest[that.typeSelected.key] = null;
            }
            for (var _e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(_e)) {
                    _realRequest[_e] = that.initRequestData[_e];
                }
            }
            _realRequest.userId = that.userId;
            _realRequest.entryLevel = that.entryLevel;
            _realRequest.account = item;
            requestOnce(listUrl, _realRequest, function (e) {
                var logs = e.rows;
                // TODO: 不知道这是什么。。先留着
                // $.each(logs, function (k, v) {
                //     logs[k].changeType = that.changeType(v.type);
                // });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;
                if (e.other) {
                    //可修改权限，根据有没有other来判断
                    that.accountMenus = [];
                    that.ruleLevel = 4;
                    e.other.forEach(function (item) {
                        that.accountMenus.push(item.account);
                    });
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
                if (that.GetQueryString("type") == "isOnline") {
                that.operation = 0;
                }
            });
        },
        openShareList: function ($event) {
            var that = this;
            var _element = $event.currentTarget;
            console.log(_element.innerText);
            if (!_element.innerText || _element.innerText == "") {
                return false;
            }
            // requestOnce('/agent/lottery_share/share_list.do', {
            requestOnce('/manage/member/share_list.do', {
                id: _element.innerText
            }, function (data) {
                that.shareList = data.data;
                $("#shareModal").modal();
            });
        },
        request: function (_offset) {
            var that = this;
            var listUrl = "",
                _realRequest = {};
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // for (var each in that.initRequestData) {
            //     if (that.initRequestData.hasOwnProperty(each)) {
            //         var _e = that.initRequestData[each];
            //         if (each != "type" && each != "count" && each != "sortOrder" && each != "offset") {
            //             _e = null;
            //         }
            //     }
            // }
            var start = that.initDate.start.replace(/-/g, "/");
            var end = that.initDate.end.replace(/-/g, "/");
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
            if (!(strDateTime(start) && strDateTime(end))) {
                layer.msg("请检查查询的时间格式");
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();

            // that.initRequestData.startTime = that.initDate.start;
            // that.initRequestData.endTime = that.initDate.end;
            // var agent = $("#agent").val();
            // if (agent.length > 0) {
            //     that.initRequestData.agent = agent;
            // } else {
            //     that.initRequestData.agent = null;
            // }
            // var options = $("#type option");
            // $.each(options, function (k, v) {
            //     var val = $('#type option:nth-child(' + (k + 1) + ')').val();
            //     if (that.initRequestData[val]) {
            //         that.initRequestData[val] = "";
            //     }
            // });
            // var saccount = $("#saccount").val();
            // var type = $("#type").val();
            // if (saccount.length > 0) {
            //     that.initRequestData[type] = saccount;
            // } else {
            //     that.initRequestData[type] = null;
            // }

            if (that.GetQueryString("type") == "isOnline") {
                listUrl = "/manage/member/get_on_line.do";
                that.initRequestData.start = null;
                that.initRequestData.end = null;
                $("#form-inline").hide();
            } else {
                listUrl = '/manage/member/user_list.do';
                // listUrl = ' http://192.168.3.16:8010/manage/member/user_list.do'
            }
            _realRequest[that.typeSelected.key] = that.typeSelected.val;
            if (_realRequest[that.typeSelected.key] == "") {
                _realRequest[that.typeSelected.key] = null;
            }
            for (var _e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(_e)) {
                    _realRequest[_e] = that.initRequestData[_e];
                }
            }
            if(that.GetQueryString("entryLevel")){
                that.entryLevel =parseInt(that.GetQueryString("entryLevel"))
                _realRequest.entryLevel = that.entryLevel;
            }
            _realRequest.entryLevel = that.entryLevel;
            _realRequest.userId = that.userId;
            if (_offset != undefined) {
                _realRequest.offset = _offset;
            }
            requestOnce(listUrl, _realRequest, function (e) {
                var logs = e.rows;
                // TODO: 不知道这是什么。。先留着
                // $.each(logs, function (k, v) {
                //     logs[k].changeType = that.changeType(v.type);
                // });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;
                if (e.other) {
                    //可修改权限，根据有没有other来判断
                    that.ruleLevel = 4;
                    e.other.forEach(function (item) {
                        that.accountMenus.push(item.account);
                    });
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
                if (listUrl == "/manage/member/get_on_line.do") {
                    that.operation = 0;
                }
            });
        },
        request2: function (_offset) {
            var that = this;
            var listUrl = "",
                _realRequest = {};
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // for (var each in that.initRequestData) {
            //     if (that.initRequestData.hasOwnProperty(each)) {
            //         var _e = that.initRequestData[each];
            //         if (each != "type" && each != "count" && each != "sortOrder" && each != "offset") {
            //             _e = null;
            //         }
            //     }
            // }
            if (that.typeSelected.key == 'code') {
                if (!/^(\d{8})?$/g.test(that.typeSelected.val)) {
                    layer.msg('请输入八位数字的邀请码');
                    return false;
                }
            }
            var start = that.initDate.start.replace(/-/g, "/");
            var end = that.initDate.end.replace(/-/g, "/");
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
            if (!(strDateTime(start) && strDateTime(end))) {
                layer.msg("请检查查询的时间格式");
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();

            // that.initRequestData.startTime = that.initDate.start;
            // that.initRequestData.endTime = that.initDate.end;
            // var agent = $("#agent").val();
            // if (agent.length > 0) {
            //     that.initRequestData.agent = agent;
            // } else {
            //     that.initRequestData.agent = null;
            // }
            // var options = $("#type option");
            // $.each(options, function (k, v) {
            //     var val = $('#type option:nth-child(' + (k + 1) + ')').val();
            //     if (that.initRequestData[val]) {
            //         that.initRequestData[val] = "";
            //     }
            // });
            // var saccount = $("#saccount").val();
            // var type = $("#type").val();
            // if (saccount.length > 0) {
            //     that.initRequestData[type] = saccount;
            // } else {
            //     that.initRequestData[type] = null;
            // }

            if (that.GetQueryString("type") == "isOnline") {
                listUrl = "/manage/member/get_on_line.do";that.initRequestData.start = null;
                that.initRequestData.end = null;

                $("#form-inline").hide();
            } else {
                listUrl = '/manage/member/user_list.do';
                // listUrl = ' http://192.168.3.16:8010/manage/member/user_list.do'
            }
            _realRequest[that.typeSelected.key] = that.typeSelected.val;
            if (_realRequest[that.typeSelected.key] == "") {
                _realRequest[that.typeSelected.key] = null;
            }
            for (var _e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(_e)) {
                    _realRequest[_e] = that.initRequestData[_e];
                }
            }
            _realRequest.userId = that.userId;
            _realRequest.entryLevel = that.entryLevel;
            if (_offset != undefined) {
                _realRequest.offset = _offset;
            }
            requestOnce(listUrl, _realRequest, function (e) {
                var logs = e.rows;
                // TODO: 不知道这是什么。。先留着
                // $.each(logs, function (k, v) {
                //     logs[k].changeType = that.changeType(v.type);
                // });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;
                if (e.other) {
                    //可修改权限，根据有没有other来判断
                    that.ruleLevel = 4;
                    e.other.forEach(function (item) {
                        that.accountMenus.push(item.account);
                    });
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
                if (listUrl == "/manage/member/get_on_line.do") {
                    that.operation = 0;
                }
            });
        },
        request3: function (_offset) {
            var that = this;
            var listUrl = "/manage/member/user_list.do",
                _realRequest = {};
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // for (var each in that.initRequestData) {
            //     if (that.initRequestData.hasOwnProperty(each)) {
            //         var _e = that.initRequestData[each];
            //         if (each != "type" && each != "count" && each != "sortOrder" && each != "offset") {
            //             _e = null;
            //         }
            //     }
            // }
            var start = that.initDate.start.replace(/-/g, "/");
            var end = that.initDate.end.replace(/-/g, "/");
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
            if (!(strDateTime(start) && strDateTime(end))) {
                layer.msg("请检查查询的时间格式");
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();

            // that.initRequestData.startTime = that.initDate.start;
            // that.initRequestData.endTime = that.initDate.end;
            // var agent = $("#agent").val();
            // if (agent.length > 0) {
            //     that.initRequestData.agent = agent;
            // } else {
            //     that.initRequestData.agent = null;
            // }
            // var options = $("#type option");
            // $.each(options, function (k, v) {
            //     var val = $('#type option:nth-child(' + (k + 1) + ')').val();
            //     if (that.initRequestData[val]) {
            //         that.initRequestData[val] = "";
            //     }
            // });
            // var saccount = $("#saccount").val();
            // var type = $("#type").val();
            // if (saccount.length > 0) {
            //     that.initRequestData[type] = saccount;
            // } else {
            //     that.initRequestData[type] = null;
            // }


            _realRequest[that.typeSelected.key] = that.typeSelected.val;
            if (_realRequest[that.typeSelected.key] == "") {
                _realRequest[that.typeSelected.key] = null;
            }
            for (var _e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(_e)) {
                    _realRequest[_e] = that.initRequestData[_e];
                }
            }
            _realRequest.userId = that.userId;
            _realRequest.entryLevel = that.entryLevel;
            if (_offset != undefined) {
                _realRequest.offset = _offset;
            }
            requestOnce(listUrl, _realRequest, function (e) {
                var logs = e.rows;
                // TODO: 不知道这是什么。。先留着
                // $.each(logs, function (k, v) {
                //     logs[k].changeType = that.changeType(v.type);
                // });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;
                if (e.other) {
                    //可修改权限，根据有没有other来判断
                    that.ruleLevel = 4;
                    e.other.forEach(function (item) {
                        that.accountMenus.push(item.account);
                    });
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
                if (listUrl == "/manage/member/get_on_line.do") {
                    that.operation = 0;
                }
            });
        },
        // changeType: function (value) {
        //     var str = "";
        //     switch (value) {
        //         case 1:
        //             str = "存款";
        //             break;
        //         case 2:
        //             str = "人工增加";
        //             break;
        //         case 3:
        //             str = "人工扣除";
        //             break;
        //         case 4:
        //             str = "赠送彩金";
        //             break;
        //         case 5:
        //             str = "注册彩金";
        //             break;
        //         case 6:
        //             str = "彩票投注";
        //             break;
        //         case 7:
        //             str = "六合彩投注";
        //             break;
        //         default:
        //
        //     }
        //     return str;
        // },
        query: function (userId) {
            var that = this;
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            // this.account=userId;
            this.userId = null;
            this.levelMenus = [];
            this.useridMenus = [];
            this.accountMenus = [];
            this.request2();
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
            this.typeSelected.val = '';
            this.userId = null;
            this.levelMenus = [];
            this.useridMenus = [];
            this.request2();
        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.offset = this.initRequestData.count * (p - 1);
            if(this.accountMenus.length == 0) {
                this.request();
            } else {
                this.request3();
            }
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
        // 会员等级
        getLevelOptions: function () {
            var that = this;
            request('/manage/member/common_levels.do', {}, function (e) {
                // that.levelOptions = e.data;
                var options = {};
                that.levels = e.data;
                for (var i = 0; i < e.data.length; i++) {
                    options['s' + e.data[i].id] = e.data[i].name;
                }
                that.levelOptions = options;
                // console.log(that.levelOptions);
                // var col = '<option value="-1" disabled>请选择</option>';
                // var j = e.data;
                // for (var i in j) {
                //     col += '<option value="' + j[i].id + '" id="' + j[i].id + '">' + j[i].name + '</option>';
                // }
                // $('#m-level').html(col);
            });

        },
        lookShare: function (code) {
            var that = this;
            var _modal = $('#rebateModel');
            requestOnce('/manage/member/user_share.do', {
                code: code
            }, function (res) {
                for (let i = 0; i < res.data.length; i++) {
                    var _ClassName = res.data[i].lotteryClassName;
                    switch (_ClassName) {
                        case 'FrequentLottery':
                            res.data[i].classNameCn = '时时彩';
                            break;
                        case 'ElevenPickFive':
                            res.data[i].classNameCn = '11选5';
                            break;
                        case 'PCEggs':
                            res.data[i].classNameCn = '快乐8';
                            break;
                        case 'QuickThree':
                            res.data[i].classNameCn = '快3';
                            break;
                        case 'SixMark':
                            res.data[i].classNameCn = '六合彩';
                            break;
                        case 'Three':
                            res.data[i].classNameCn = '排列3';
                            break;
                        case 'PK10':
                            res.data[i].classNameCn = '北京赛车';
                            break;
                    }
                }
                that.rebateModel = res.data;
                _modal.modal()
            })
        },
        lookShareLevel: function (userId) {
            var that = this;
            var _modal = $('#levelModel');
            requestOnce('/manage/member/user_path.do', {
                userId: userId
            }, function (res) {
                that.levelModel = res.data.reverse();
                console.log(that.levelModel.length)
                if (that.levelModel.length == 0) {
                    layer.msg('该用户没有层级');
                    return
                } else {
                    _modal.modal();
                }
            })
            // requestOnce('/manage/member/user_share.do', {userId: userId}, function (res) {
            //     console.log('查询成功')
            //     console.log(res)
            // })
            // console.log('准备查询')
            // if (memberCount == 0) {
            //     return false;
            // }
            // this.requestData.userId = userId;
            // if (this.userIdArr[this.userIdArr.length - 1] != userId) {
            //     this.userIdArr.push(userId);
            // }

            // var that = this;
            // //TODO 查询调用
            // this.currentPage = 1;
            // this.requestData.page = 1;


            // // // that.initDate.start = $("#startTime").val();
            // // // that.initDate.end = $("#endTime").val();

            // that.requestData.account = null;
            // that.requestData.username = null;
            // that.requestData.extensionCode = null;
            // that.request();
        },
        // 强制下线
        offline: function (row, index) {
            var that = this;
            requestOnce('/manage/member/destroy.do', {
                userId: row.userId
            }, function (result) {
                if (result.code == 0) {
                    layer.msg("操作成功");
                    // that.logs[index].isOnline = false;
                    that.$set(that.logs[index], "isOnline", false);
                } else {
                    layer.msg("操作失败");
                }
            });
        },
        // 禁用
        forbid: function (row, index) {
            var that = this;
            if (row.enabled == true) {
                var enabled = false;
                // if (row.isOnline) {
                //     that.offline(row, index);
                // }
            } else {
                var enabled = true;
            }
            requestOnce('/manage/member/dis_enabled.do', {
                account: row.account,
                enabled: enabled
            }, function (result) {
                if (result.code == 0) {
                    layer.msg("操作成功");
                    that.logs[index].enabled = enabled;
                } else {
                    layer.msg("操作失败");
                }
            });
        },
        // 查看
        detail: function (row) {
            var that = this;
            // $('#save').hide();
            $('.show-div').show();
            that.action = 'show';
            $("#editmodel").find("table label[name]").html("");
            postOnce('/manage/member/user_info.do', {
                account: row.account
            }, function (result) {
                if (result.code == 0) {
                    that.setParam(result.data, true, false, false);
                    // that.member.account = result.data.account;
                    // that.member = result.data;
                    // $("#agent_opt").removeClass("hidden");
                    // $("#general_opt").removeClass("hidden");
                    // $("#member_opt").removeClass("hidden");
                    // $("#parentNames_tr").removeClass("hidden");
                    // if ("off" == result.multiAgent) {
                    //     $(".multiData").addClass("hidden");
                    // } else if ("on" == result.multiAgent) {
                    //     $("#rebateNum").val();
                    //     $("#rebateNum").attr("disabled", "disabled");
                    //     $("#rebateNum").val(row.gameShare);
                    //     $(".multiData").removeClass("hidden");
                    //     $(".rebateNum_tr").removeClass("hidden");
                    //     $("#balance").html(member.balance ? member.balance : "0");
                    // }
                }
            });
        },
        // 修改
        edit: function (row, index) {
            var that = this;
            if (this.ruleLevel < 4) {
                layer.msg("没有权限修改会员");
                return false;
            }
            that.clearModal();
            // $('#save').show();
            $('.show-div').hide();
            that.action = 'edit';
            window.index = index;
            post('/manage/member/user_info.do', {
                account: row.account
            }, function (result) {
                if (result.code == 0) {
                    that.member.userId = result.data.userId;
                    that.setParam(result.data, false, false, true);
                    $("#m-code").attr("disabled", "disabled");
                }
            });
        },
        // 保存
        save: function () {
            var that = this;
            var data = {};
            var isRequest = true;
            // console.log(action);
            var action = that.action,
                _modal = $("#editmodel");
            if (action == "add") {
                submitUrl = "/manage/member/add_user.do";
                resMsg = "添加成功";
                // data["bankName"] = $("#editmodel").find("input[name=receivingBank]").val();
                var _account = _modal.find("input[name=account]").val();
                if (!_account || _account.length == 0) {
                    layer.msg("会员帐号不能为空");
                    return false;
                }
                // TODO: 密码验证
                var _password = _modal.find("input[name=password]").val();
                var _repassword = _modal.find("input[name=repassword]").val();
                if (!_password || !_repassword || _password.length == 0 || _repassword.length == 0) {
                    layer.msg("密码或验证密码不能为空");
                    return false;
                }
                if (_password != _repassword) {
                    layer.msg("密码与验证密码不一致");
                    return false;
                }
                // 邀请码验证
                var _code = _modal.find("input[name=code]").val();
                if (!_code) {
                    layer.msg("邀请码不能为空");
                    return false;
                }
            } else if (action == "edit") {
                submitUrl = "/manage/member/update_user.do";
                resMsg = "修改成功";
                // data['userId'] = $("#m-userId").val();
                data["userId"] = that.member.userId;
                // data["bankName"] = $("#editmodel").find("input[name=receivingBank]").val();
            }

            var _inputs = $("#editmodel").find(".form-control");
            _inputs.each(function (e) {
                var _t = $(this);
                if (that.action == "edit") {
                    if (_t.attr('name') == "password" || _t.attr('name') == "repassword") {
                        return true;
                    }
                }

                data[_t.attr('name')] = _t.val();
            });
            data["code"] = $("#editmodel").find("input[name=code]").val();
            //是否启用
            // if (data.enabled == 1) {
            //     data.enabled == true;
            // } else {
            //     data.enabled == false;
            // }
            if (data.phone.length > 0 && data.phone.length !== 11) {
                layer.msg('请输入正确的手机号码')
                return isRequest = false;
            }
            if (!data.level) {
                layer.msg('请选择会员等级')
                return isRequest = false;
            }
            var payee = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[·]){2,15}$/;
            if (data.payee.length > 0 && !payee.test($("#m-payee").val())) {
                layer.msg('收款人姓名只能填2~15个中文')
                return isRequest = false;
            }
            (data.userId == "") && (data.userId = null);
            if (isRequest) {
                requestOnce(submitUrl, data, function (res) {
                    if (res.code == 0) {
                        layer.msg(resMsg);
                        // search();
                        if (action == "edit") {
                            that.$set(that.logs[window.index], "agent", data.agent);
                            that.$set(that.logs[window.index], "username", data.username);
                            that.$set(that.logs[window.index], "level", data.level);
                            that.$set(that.logs[window.index], "code", data.code);
                        }
                        _inputs.each(function (e) {
                            $(this).val('');
                        });
                        $('#editmodel').modal('hide');
                        that.request();
                    }
                });
            }

        },
        submit: function (that) {
            // TODO: 很容易就会到导致id重名
            var username = $(that).attr('data-username');
            var userId = $(that).attr("data-userId");
            var password = $('#pwd').val();
            var repassword = $('#repass').val();
            var type = $('input:radio[name="passType"]:checked').val();
            if (trim(password).length == 0 || trim(repassword).length == 0) {
                layer.msg('请正确输入密码');
                return false;
            }
            if (trim(password).length < 6 || trim(repassword).length < 6) {
                layer.msg('密码不能少于6位')
                return false;
            }
            if (password != repassword) {
                layer.msg('两次密码不一样,请重新输入');
                var password = $('#pwd').val('');
                var repassword = $('#repass').val('');
                return;
            }
            var _requestData = {
                account: username,
                userId: userId
            };
            if (type == 'password') {
                _requestData.password = password;
            } else {
                _requestData.payPassword = password;
            }
            requestOnce('/manage/member/reset_pwd.do', _requestData, function () {
                layer.msg("修改成功");
                layer.close(openIndex);
            });
        },
        // 修改密码
        editPassword: function (row) {
            console.log(row)
            openIndex = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['500px', '400px'], //宽高
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                title: '修改密码',
                content: '<div class="table-responsive" style="margin:15px;">' +
                    '<table class="table table-striped table-bordered table-hover">' +
                    '<tbody>' +
                    '<tr><td>用户名</td><td>' + row.userName + '</td></tr>' +
                    '<tr><td>密码类型</td><td><div class="form-group form-inline" style="margin-bottom:0"><div class="radio"><label>' +
                    '<input type="radio" name="passType" value="password" checked="">登录密码</label></div>' +
                    ' <div class="radio"><label>' +
                    '<input type="radio" name="passType" value="paypassword">支付密码</label></div></div></td></tr>' +
                    '<tr><td>新密码</td><td><input id="pwd" class="form-control" maxLength="12" type="password"></td></tr>' +
                    '<tr><td>确认密码</td><td><input id="repass" class="form-control" maxLength="12" type="password"></td></tr>' +
                    '<tr><td colspan="2"><button onclick="layer.close(openIndex)" class="btn btn-xs btn-default">关闭</button> <button data-userId="' + row.userId + '" data-username="' + row.account + '" onclick="vue.submit(this)" type="button" class="btn btn-xs btn-success">保存</button></td></tr>' +
                    '</tbody></div></div>'
            });
        },
        // 备注
        markDown: function (row, index) {
            var text = "";
            var textId = row.userId;
            if (row.remark) {
                text = row.remark;
            } else {
                text = "";
            }

            var infoIndex = layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['40%', '35%'], //宽高
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                title: '修改备注',
                content: '<div id="' + textId + '" class="table-responsive" style="margin:15px;"><table class="table table-striped table-bordered table-hover"><tbody>' +
                    '<tr><td style="text-align: right;font-weight:bold;">备注</td><td colspan="3" style="text-align: left;"><textarea class="form-control" style="min-height:100px;" name="remark">' + text + '</textarea></td></tr>' +
                    '<tr><td colspan="4"><button class="btn btn-xs btn-info btn-edit" onclick="vue.updateUser(' + textId + ',' + index + ')">修改</button><button onclick="layer.closeAll()" class="btn btn-xs btn-default" style="margin-left:15px;">关闭</button></td></tr>' +
                    '</tbody></div></div>'
                //'<tr><td colspan="4"><button onclick="layer.close(infoIndex)" class="btn btn-xs btn-default">关闭</button></td></tr>'+
            });

        },
        updateUser: function (textId, index) {
            var that = this;
            var _table = $("#" + textId + " table"),
                _textarea = _table.find('textarea');
            if (trim(_textarea.val()).length == 0) {
                layer.msg('备注不能为空');
                return false;
            }
            if (trim(_textarea.val()).length > 100) {
                layer.msg('备注不能超过100个字符');
                return false;
            }
            var data = {
                userId: textId,
                remark: trim(_textarea.val()),
            }

            requestOnce('/manage/member/update_user_remark.do', data, function (e) {
                //备忘修改
                if (e.code == 0) {
                    that.$set(that.logs[index], "remark", data.remark);
                    layer.msg('备注修改成功', {
                        time: 500
                    }, function () {
                        layer.closeAll();
                    });
                }
            });
            // });
        },
        // 切换排序
        toggleSort: function (type, sort) {
            // if ($("#sortable .fa").hasClass("gray")) {
            //     $("#sortable .fa").removeClass("gray")
            // }
            var that = this;
            // var sort = $("#sortable .fa").hasClass("fa-caret-down");
            var _balance = $("#balance");
            if (sort === 'asc') {
                // $("#sortable .fa").removeClass("fa-caret-down").addClass("fa-caret-up");
                _balance.find('.fa-caret-up').css('opacity', '1');
                _balance.find('.fa-caret-down').css('opacity', '0.35');
                that.initRequestData.sortOrder = "asc";
                that.initRequestData.sortName = type;
            } else if (sort === 'desc') {
                // $("#sortable .fa").removeClass("fa-caret-up").addClass("fa-caret-down");
                _balance.find('.fa-caret-down').css('opacity', '1');
                _balance.find('.fa-caret-up').css('opacity', '0.35');
                that.initRequestData.sortOrder = "desc";
                that.initRequestData.sortName = type;
            }
            that.request();
        },
        // 增加
        add: function () {
            var that = this,
                _modal = $("#editmodel");
            // $('#save').show();
            $('.show-div').hide();
            that.action = 'add';
            that.clearModal();
            that.setParam({}, false, true, false);
            $("#m-code").attr("disabled", false);
        },
        clearModal: function () {
            var _modal = $("#editmodel");
            _modal.find("table .form-control").val("");
            _modal.find("select").val(1);
        },
        clearSystemModal: function () {
            var _modal = $("#addsystemmodel");
            // _modal.find("table .form-control").val("");
            // _modal.find("select").val(1);
            this.respassword = null;
            for (var e in this.systmParams) {
                if (this.systmParams.hasOwnProperty(e)) {
                    var _item = this.systmParams[e];
                    if (e == "role") {
                        this.systmParams[e] = 0;
                    } else if (e == "level") {
                        this.systmParams[e] = 1;
                    } else {
                        this.systmParams[e] = null;
                    }
                }
            }
        },
        // 显示数据
        setParam: function (row) {
            var that = this;
            var _modal = $("#editmodel");
            _modal.modal();
            if (that.action == "show") {
                var _doms = _modal.find("table label[name]");
                _modal.find("table .form-control").hide();
                _modal.find("table label[name]").show();
                _doms.each(function (e, item, inx) {
                    var _t = $(this),
                        _name = _t.attr("name");
                    if (_name && row.hasOwnProperty(_name)) {
                        // if (_name == "agent") {
                        //   _t.html(row[_name].length>0?row[_name]:"-");
                        //   return true;
                        // }
                        if (row[_name].length == 0) {
                            _t.html("-");
                            return true;
                        }
                        if (_name == "level") {
                            _t.html(that.levelOptions['s' + row[_name]]);
                            return true;
                        }
                        if (_name == "enabled") {
                            _t.html(row[_name] == true ? "启用" : "禁用");
                            return true;
                        }
                        if (_name == "rechargeNum" && row[_name] == 0) {
                            _modal.find("table label[name=rechargeTotal]").html("0");
                        }
                        if (_name == "withdrawalNum" && row[_name] == 0) {
                            _modal.find("table label[name=withdrawalTotal]").html("0");
                        }
                        if (_name == "rechargeTotal") {
                            _t.html(row[_name].toFixed(2))
                            // console.log(row[_name])
                            // console.log('存款总数')
                            return true
                        }
                        if (_name == "withdrawalTotal") {
                            _t.html(row[_name].toFixed(2))
                            // console.log(row[_name])
                            // console.log('提款总数')
                            return true
                        }
                        if (_name == "client") {
                            _t.html(getSystem(row[_name]) + "  " + getBrowser(row[_name]));
                            return true;
                        }
                        if (_name == "account") {
                            that.member.account = row[_name]
                        }
                        if (_name == "levelId") {
                            _t.html('VIP' + row[_name]);
                            return true;
                        }
                        _t.html(row[_name] + "");
                    }
                });
            } else {
                var _doms = _modal.find("table .form-control");
                _modal.find("table .form-control").show();
                _modal.find("table label[name]").hide();
                _doms.each(function (e, item, inx) {
                    var _t = $(this),
                        _name = _t.attr("name");
                    if (_name && row.hasOwnProperty(_name)) {
                        console.log(e)
                        console.log(item)
                        console.log(inx)
                        _t.val(row[_name]);
                    }
                });
            }

            // $("#m-userId").val(row.userId ? row.userId : '');
            // $("#m-account").val(row.account && row.account.length>0 ? row.account : "" );
            // $("#m-agent").val(row.agent ? row.agent : '');
            //
            // $("#m-username").val(row.username ? row.username : '');
            // $("#m-phone").val(row.phone ? row.phone : '');
            // $("#m-QQ").val(row.qq ? row.qq : '');
            // $("#m-wechat").val(row.wechat ? row.wechat : '');
            // $("#m-level").val(row.level ? row.level : -1);
            // $("#m-enabled").val(row.enabled ? '启用' : '禁用');
            // $("#m-bankAccount").val(row.bankAccount ? row.bankAccount : '');
            // $("#m-bankName").val(row.receivingBank ? row.receivingBank : '');//TODO 注意，没有bankName，只有receivingBank
            // $("#m-bankAddress").val(row.bankAddress ? row.bankAddress : '');
            // $("#m-client").html(row.client ? row.client : '');
            // $("#m-registrationIp").html(row.registrationIp ? row.registrationIp : '');
            // $("#m-deviceId").html(row.deviceId ? row.deviceId : '');
            // $("#m-lastLoginTime").html(row.lastLoginTime ? row.lastLoginTime : '');
            // $("#m-rechargeNum").html(row.rechargeNum ? row.rechargeNum : '0');
            // $("#m-withdrawalNum").html(row.withdrawalNum ? row.withdrawalNum : '0');
            // $("#m-rechargeTotal").html(row.rechargeTotal ? row.rechargeTotal : '0');
            // $("#m-withdrawalTotal").html(row.withdrawalTotal ? row.withdrawalTotal : '0');
            // $("#m-remark").html(row.remark ? row.remark : '');
            // $("#m-payee").val(row.payee ? row.payee : '');
            //
            // // label
            // $("#m-account-l").html(row.account ? row.account : '');
            // $("#m-agent-l").html(row.agent ? row.agent : '-');
            // $("#m-username-l").html(row.username ? row.username : '');
            // $("#m-phone-l").html(row.phone ? row.phone : '');
            // $("#m-QQ-l").html(row.qq ? row.qq : '');
            // $("#m-wechat-l").html(row.wechat ? row.wechat : '');
            // $("#m-level-l").html(that.levelOptions['s' + row.level]);
            // $("#m-enabled-l").html(row.enabled ? '启用' : '禁用');
            // $("#m-bankAccount-l").html(row.bankAccount ? row.bankAccount : '');
            // $("#m-bankName-l").html(row.receivingBank ? row.receivingBank : '');
            // $("#m-bankAddress-l").html(row.bankAddress ? row.bankAddress : '');
            // $("#m-payee-l").html(row.payee ? row.payee : '');
            // $("#balance").html(row.balance ? row.balance : "0");
            //
            // if (isShow) {
            //     $("#newpwd").val("");
            //     $("#newrpwd").val("");
            //     $(".newpwd_tr").addClass("hidden");
            //     $(".userinfo_tr").removeClass("hidden");
            //
            //     $("#m-account").hide();
            //     $("#m-agent").hide();
            //     $("#m-username").hide();
            //     $("#m-phone").hide();
            //     $("#m-QQ").hide();
            //     $("#m-wechat").hide();
            //     $("#m-level").hide();
            //     $("#m-enabled").hide();
            //     $("#m-bankAccount").hide();
            //     $("#m-bankName").hide();
            //     $("#m-bankAddress").hide();
            //     $("#m-lastLoginIp").hide();
            //     $("#m-ladtLoginAddress").hide();
            //     $("#m-payee").hide();
            //
            //     $("#m-account-l").show();
            //     $("#m-agent-l").show();
            //     $("#m-username-l").show();
            //     $("#m-phone-l").show();
            //     $("#m-QQ-l").show();
            //     $("#m-wechat-l").show();
            //     $("#m-level-l").show();
            //     $("#m-enabled-l").show();
            //     $("#m-bankAccount-l").show();
            //     $("#m-bankName-l").show();
            //     $("#m-bankAddress-l").show();
            //     $("#m-lastLoginIp-l").show();
            //     $("#m-ladtLoginAddress-l").show();
            //     $("#m-payee-l").show();
            // }
            //
            // if (isEdit || isAdd) {
            //     $("#newpwd").val("");
            //     $("#newrpwd").val("");
            //     $(".newpwd_tr").addClass("hidden");
            //     $(".userinfo_tr").removeClass("hidden");
            //     if (isAdd) {
            //         $(".newpwd_tr").removeClass("hidden");
            //         $("#m-account").removeAttr("readonly");
            //         // $(".newpwd_tr").show();
            //     } else {
            //         $("#m-account").attr("readonly", "readonly");
            //     }
            //
            //
            //     $("#m-account").show();
            //     $("#m-agent").show();
            //     $("#m-username").show();
            //     $("#m-phone").show();
            //     $("#m-QQ").show();
            //     $("#m-wechat").show();
            //     $("#m-level").show();
            //     $("#m-enabled").show();
            //     $("#m-bankAccount").show();
            //     $("#m-bankName").show();
            //     $("#m-bankAddress").show();
            //     $("#m-lastLoginIp").show();
            //     $("#m-ladtLoginAddress").show();
            //     $("#m-payee").show();
            //
            //     $("#m-account-l").hide();
            //     $("#m-agent-l").hide();
            //     $("#m-username-l").hide();
            //     $("#m-phone-l").hide();
            //     $("#m-QQ-l").hide();
            //     $("#m-wechat-l").hide();
            //     $("#m-level-l").hide();
            //     $("#m-enabled-l").hide();
            //     $("#m-bankAccount-l").hide();
            //     $("#m-bankName-l").hide();
            //     $("#m-bankAddress-l").hide();
            //     $("#m-lastLoginIp-l").hide();
            //     $("#m-ladtLoginAddress-l").hide();
            //     $("#m-payee-l").hide();
            // }
        },
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        // 获取代理列表
        getAgent: function () {
            var that = this;
            var data = {
                // account: $("#m-agent").val()
                account: that.searchAgent
            };
            request('/manage/member/get_agent_account_list.do', data, function (e) {
                // request('/manage/member/common_levels.do' ,{}, function (e) {
                $(".agentList").show();
                // var levelOptions = e.data;
                that.$set(that.levelOptions, "result", e.data);
            });
        },
        getVal: function (item) {
            // $("#m-agent").val(item);
            this.searchAgent = item;
            $(".agentList").hide();
        },
        addsystem: function () {
            var _modal = $("#addsystemmodel");
            _modal.modal();
            this.clearSystemModal();
        },
        savesystem: function () {
            var that = this;
            if (!that.systmParams.account || that.systmParams.account.length == 0) {
                layer.msg("会员帐号不能为空");
                return false;
            }
            if (that.systmParams.account.length < 4) {
                layer.msg("会员帐号不能少于4位");
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
            // if (!that.systmParams.role || !that.systmParams.role < 0) {
            //     layer.msg('请选择会员类型')
            //     return false;
            // }
            var payee = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){2,15}$/;
            if (that.systmParams.payee && !payee.test(that.systmParams.payee)) {
                layer.msg('收款人姓名只能填2~15个中文');
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
            if (!that.systmParams.frequentLottery || that.systmParams.frequentLottery == "") {
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
            requestOnce('/manage/member/add_share_user.do', that.systmParams, function (e) {
                if (e.code == 0) {
                    layer.msg('添加成功！');
                    $('#addsystemmodel').modal('hide');
                    that.request();
                }
            })
        }

    },
    created: function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                vue.query();
            }
        });
    },
});
vue.onLoad();
$(document).click(function () {
    if ($(".agentList").length > 0) {
        $(".agentList").hide();
    }
});