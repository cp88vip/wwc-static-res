var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        playType: [
            {
                value: null,
                text: "全部环境"
            },
            {
                value: 1,
                text: "正式环境"
            },
            {
                value: 0,
                text: "试玩环境"
            }
        ],
        initRequestData: {
            account: null,
            count: 15,
            playType: null,
            offset: 0,
            start: 0,
            end: 0,
        },
        currentPage: 1,
        initDate: {
            start: null,
            end: null
        },
        isShowPageNav: false,
        action: "show",
        totalPages: 0,
        account: '',
        searchAgent: "",
        levelOptions: {},
        levels: [],
        shareList: [],
        totalAmountOfSendRedRecords: 0,
        totalAmountOfBackRedRecords: 0,
        totalRows: 0,
        subTotalSend: 0,
        subTotalBack: 0,
        pageNum: 1,
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
            this.initDate.start = currentDate + " 00:00:00";
            this.initDate.end = currentDate + " 23:59:59";
            // 提取用户账号参数
            url = window.location.href;
            if (url.indexOf('#') != -1) {
                this.initRequestData.account = url.split('#')[1];
            }
            that.getLevelOptions();
            that.request();
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
            var listUrl = "/manage/finance/get_redrecord.do",
                _realRequest = {};
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
            if (_offset != undefined) {
                that.initRequestData.offset = _offset;
            }
            that.totalAmountOfSendRedRecords = 0
            that.totalAmountOfBackRedRecords = 0
            requestOnce(listUrl, that.initRequestData, function (e) {
                console.log(e)
                var logs = e.data.redRecords;
                that.logs = logs;
                // 翻页导航
                if (e.data.totalAmountOfSendRedRecords) {
                    that.totalAmountOfSendRedRecords = e.data.totalAmountOfSendRedRecords;
                }
                if (e.data.totalAmountOfBackRedRecords) {
                    that.totalAmountOfBackRedRecords = e.data.totalAmountOfBackRedRecords;
                }
                var totalRows = e.data.totalRowsOfRedRecords;
                that.totalRows = totalRows;
                that.subTotalSend = 0;
                that.subTotalBack = 0;
                that.logs.forEach(function (item) {
                    that.subTotalSend += Math.abs(item.variableAmount)
                    if (item.backAmount) {
                        that.subTotalBack += Math.abs(item.backAmount)
                    }
                })

                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);

                that.isShowPageNav = that.totalPages > 1;
            });
        },
        query: function (userId) {
            var that = this;
            this.currentPage = 1;
            this.initRequestData.offset = 0;
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
            this.query();
        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.offset = this.initRequestData.count * (p - 1);
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
        // 查看
        detail: function (row) {
            var that = this;
            // $('#save').hide();
            $('.show-div').show();
            that.action = 'show';
            that.account = row.account;
            $("#editmodel").find("table label[name]").html("");
            postOnce('/manage/member/user_info.do', {
                account: row.account
            }, function (result) {
                if (result.code == 0) {
                    that.setParam(result.data, true, false, false);
                }
            });
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
                        if (_name == "client") {
                            _t.html(getSystem(row[_name]) + "  " + getBrowser(row[_name]));
                            return true;
                        }
                        if (_name == "account") {
                            that.account = row[_name]
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
                        _t.val(row[_name]);
                    }
                });
            }
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
    },
    created: function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                vue.query();
            }
        });
    },
    filters:{
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
    },
});
vue.onLoad();
$(document).click(function () {
    if ($(".agentList").length > 0) {
        $(".agentList").hide();
    }
});