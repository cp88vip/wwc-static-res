var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],//存款类型
        initRequestData: {//请求recharge_policy.do接口传给后台的data
            depositType: "",
            startDate: "",
            endDate: "",
            page: 1,
            pageSize: 15,
            presentMethod: "",
            presentType: "",

        },
        givingWay: "FIXED",//赠送方式
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
    },
    methods: {
        onLoad: function (e) {
            var that = this;

            that.setDatetimePicker();
            that.getlevels();
            that.request();
            $("#presentMethod").on('change', function() {
              var _val = $(this).val();
              if (_val == "FIXED") {
                $("#editmodel .giftValue").removeClass("hidden");
                $("#editmodel .rollBackRate").addClass("hidden");
              } else if (_val == "FLOATING") {
                $("#editmodel .giftValue").addClass("hidden");
                $("#editmodel .rollBackRate").removeClass("hidden");
              }
            });
        },
        formData: function () {
            var that = this;
            var beginTime = $("#begin").val(), endTime = $("#end").val();
            // 兼容Safari浏览器 它不支持 yyyy-mm-dd 格式,只支持 yyyy/mm/dd 格式
            // that.initRequestData.startDate = that.initRequestData.startDate.replace(/-/g, "/");
            // that.initRequestData.endDate = that.initRequestData.endDate.replace(/-/g, "/");

            that.initRequestData.startDate = beginTime;
            that.initRequestData.endDate = endTime;
            that.initRequestData.depositType = $("#type").val();
            that.initRequestData.presentMethod = $("#giftType").val();
            that.initRequestData.presentType = $("#valueType").val();
        },
        query : function() {
            this.currentPage = 1;
            this.initRequestData.page = 1;
            this.request();
        },
        request: function () {
            var that = this;
            that.formData();
            request('/manage/discountoff/get_discountoff_policy_list.do', that.initRequestData, function (e) {
                that.logs = e.rows;

                // 翻页导航
                var totalRows = e.total;

                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.pageSize);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        // 获取分层
        getlevels: function () {
            request('/manage/member/user_levels.do', {}, function (result) {
                if (result.code == 0) {
                    var html = '', levels = result.data;
                    if (levels.length > 0) {
                        $.each(levels, function (k, v) {
                            html += '<label class="checkbox-inline"><input type="checkbox" name="groupLevelId" value="' + v.id + '">' + v.name + '</label>';
                        });
                    }
                    $("#layerConfig").html(html);
                }
            });
        },
        // 增加活动
        add: function () {
            var that = this;
            that.clearAll();
            window.action = "add";
            $("#editmodel").modal('toggle');
        },
        // 保存
        save: function () {
            var that = this;
            var data = {};
            var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if (window.action == "edit") {
                data.id = window.id;
            }
            var inputs = $("#editmodel .form-control");
            inputs.each(function (e) {
                var _t = $(this);
                data[_t.attr('name')] = _t.val();
            });
            if (data.presentMethod == "FIXED") {
                if ($("#FIXED").val() == "") {
                    layer.msg("请输入赠送额度");
                    return false;
                } else {
                    data.presentAmount = parseFloat($("#FIXED").val());
                    data.presentLimit = 0;
                }


            } else if (data.presentMethod == "FLOATING") {
                if ($("#FLOATING").val() == "") {
                    layer.msg("请输入赠送比例");
                    return false;
                } else {
                    data.presentAmount = parseFloat($("#FLOATING").val());
                }
                if ($("#presentLimit").val() == "") {
                    layer.msg("请输入赠送上限");
                    return false;
                } else {
                    data.presentLimit = parseFloat($("#presentLimit").val());
                }
                // 开始时间小于结束时间
                var startTime = new Date(Date.parse(data.startDate)),
                    endTime = new Date(Date.parse(data.endDate));
                if (startTime >= endTime) {
                    layer.msg("结束日期必须大于开始时间");
                    return false;
                }

            }
            if (data.depositMin == "") {
                layer.msg("请输入最小充值金额");
                return false;
            } else {
                data.depositMin = parseFloat(data.depositMin);
            }
            if (data.depositMax == "") {
                layer.msg("请输入最大充值金额");
                return false;
            } else {
                data.depositMax = parseFloat(data.depositMax);
            }
            if (data.ratio == "") {
                layer.msg("请输入流水倍数");
                return false;
            } else {
                data.ratio = parseInt(data.ratio);
            }
            if (data.startDate == "") {
                layer.msg("请输入开始日期");
                return false;
            }
            if (data.endDate == "") {
                layer.msg("请输入结束日期");
                return false;
            }
            if(Date.parse(data.startDate)>Date.parse(data.endDate)){
                layer.msg("开始时间不能大于结束时间！");
                return false;
            }
            if(!reg.test(data.startDate) || !reg.test(data.endDate)) {
                layer.msg('请输入正确的时间！');
                return false;
            }
            var levelsInputs = $("#layerConfig input:checked");
            if (levelsInputs.length > 0) {
                var layerConfig = [];
                levelsInputs.each(function (e) {
                    var _t = $(this);
                    layerConfig.push(_t.val());
                });
                layerConfig = layerConfig.join(",");
                data.layerConfig = layerConfig;
            } else {
                layer.msg("请选择会员等级");
                return false;
            }

            request('/manage/discountoff/add_or_update_discountoff_policy.do', data, function (result) {
                if (result.code == 0) {
                    that.request();
                    layer.msg("修改成功");
                    $('#editmodel').modal('hide');
                }
            });

        },
        // 禁用
        forbid: function (row, index) {
            var that = this;
            if (row.enable == true) {
                var enable = false;
            } else {
                var enable = true;
            }

            request('/manage/discountoff/enable_discountoff_policy.do', {
                id: row.id,
                enable: enable
            }, function (result) {
                if (result.code == 0) {
                    that.logs[index].enable = enable;
                    layer.msg("操作成功");
                    that.request();
                } else {
                    layer.msg("操作失败");
                }
            });
        },
        // 修改
        edit: function (row, index) {
            var that = this;
            window.action = "edit";
            window.id = row.id;
            that.givingWay =  row.presentMethod;
            that.assignment(row);
            $("#editmodel").modal('toggle');
        },
        // 删除
        del: function (row, index) {
            var that = this;
            var dele = confirm('确定要删除该条数据吗？');
            if (dele == true) {
                var data = {'id': row.id};
                request('/manage/discountoff/delete_discountoff_policy.do', data, function (result) {
                    if (result.code == 0) {
                        layer.msg("删除成功！");
                        that.logs.splice(index,1);
                    }
                });
            }
        },

        // 清空显示
        clearAll: function () {

            $('#depositType').val('ONLINE');
            $('#presentMethod').val('FIXED');
            $('#presentType').val('REWARD');
            $('#presentFrequency').val('EVERYTIME');
            $('#FIXED').val('');
            $('#FLOATING').val('');
            $('#presentLimit').val('');
            $('#depositMin').val('0');
            $('#depositMax').val('10000000');
            $('#ratio').val('');
            $("#startDate").val("");
            $("#endDate").val("");
            $("#remark").val("");

            $("#editmodel .giftValue").removeClass("hidden");
            $("#editmodel .rollBackRate").addClass("hidden");
            var inputs = $("#layerConfig input");
            $.each(inputs, function (k1, v1) {
                $("#layerConfig input").eq(k1).removeAttr("checked");
            })


        },
        // 时间插件
        setDatetimePicker: function () {
            // var curDate = new Date();
            var options = {
                language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                // clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                format: "yyyy-mm-dd"
            };
            $('#begin').datepicker(options);
            $('#startDate').datepicker(options);
            options.format = "yyyy-mm-dd";
            $('#end').datepicker(options);
            $('#endDate').datepicker(options);
        },
        // 修改时弹窗赋值
        assignment: function (row) {
            $('#depositType').val(row.depositType);
            $('#presentType').val(row.presentType);
            $('#presentFrequency').val(row.presentFrequency);
            if (row.presentMethod == "FIXED") {
                $("#editmodel .giftValue").removeClass("hidden");
                $("#editmodel .rollBackRate").addClass("hidden");
                $('#FIXED').val(row.presentAmount);
            } else if (row.presentMethod == "FLOATING") {
                $("#editmodel .giftValue").addClass("hidden");
                $("#editmodel .rollBackRate").removeClass("hidden");
                $('#FLOATING').val(row.presentAmount);
            }

            $('#presentLimit').val(row.presentLimit);
            $('#depositMin').val(row.depositMin);
            $('#depositMax').val(row.depositMax);
            // console.log(row);
            var inputs = $("#layerConfig input");
            $.each(inputs, function (k1, v1) {
                // console.log(k1);
                $("#layerConfig input").eq(k1).removeAttr("checked");
            })
            if (row.layerConfig) {
                var ratio = row.layerConfig.split(",");
                var inputss = $("#layerConfig input");
                $.each(inputss, function (k1, v1) {
                    $.each(ratio, function (k2, v2) {
                        if (v1.value == v2) {

                            $("#layerConfig input").eq(k1).prop("checked", true);

                        }
                    });

                });
            }

            $('#ratio').val(row.ratio);
            $("#startDate").val(row.startDate);
            $("#endDate").val(row.endDate);
            $("#remark").val(row.remark);
        },
        // 时间按钮
        doDate: function (name) {
            this.currentPage = 1;
            this.initRequestData.page = 1;
            switch (name) {
                case "toDay":
                    var currentDate = getCurrentDate();
                    this.initRequestData.startDate = currentDate;
                    this.initRequestData.endDate = currentDate;
                    break;
                case "thisWeek":
                    this.initRequestData.startDate = getWeekStartDate();
                    this.initRequestData.endDate = getCurrentDate();
                    break;
                case "thisMonth":
                    this.initRequestData.startDate = getMonthStartDate();
                    this.initRequestData.endDate = getCurrentDate();
                    break;
                case "yesterday":
                    var yesterday = getYesterdayDate();
                    this.initRequestData.startDate = yesterday;
                    this.initRequestData.endDate = yesterday;
                    break;
                case "lastWeek":
                    this.initRequestData.startDate = getLastWeekStartDate();
                    this.initRequestData.endDate = getLastWeekEndDate();
                    break;
                case "lastMonth":
                    this.initRequestData.startDate = getLastMonthStartDate();
                    this.initRequestData.endDate = getLastMonthEndDate();
                    break;
                default:
                    break;
            }
            $('#begin').val(this.initRequestData.startDate);
            $('#end').val(this.initRequestData.endDate);
            this.request();
        },
        // 存款类型
        dtFormatter: function (value) {
            if (!value) {
                return "-";
            }
            switch (value) {
                case "ONLINE":
                    return "第三方支付";
                case "QUICK":
                    return "快速入款";
                case "COMMON":
                    return "银行入款";
                case "MANUAL":
                    return "手动加款";
            }
        },
        // 赠送方式
        gtFormatter: function (value) {
            if (!value) {
                return "-";
            }
            switch (value) {
                case "FLOATING":
                    return "浮动比例";
                case "FIXED":
                    return "固定额度";
            }
        },
        // 赠送类型
        vtFormatter: function (value) {
            if (!value) {
                return "-";
            }
            switch (value) {
                case "REWARD":
                    return "彩金";
            }
        },
        // 赠送频率
        dcFormatter: function (value) {
            if (!value) {
                return "-";
            }
            switch (value) {
                case "EVERYTIME":
                    return "每次充值";
                case "FIRST":
                    return "首充";
                case "FIRST_OF_DAY":
                    return "每日首充";
                case "SECOND":
                    return "第二次充值";
                case "THIRD":
                    return "第三次充值";
            }
        },
        // 赠送额度
        giftValueFormatter: function (row, index) {
            if (!row.presentAmount) {
                return "-";
            }
            if (row.presentMethod == "FLOATING") {
                return row.presentAmount + "%";
            } else {
                return row.presentAmount + "元";
            }
        },
        // 赠送上限
        limitFormatter: function (row, index) {
            if (row.presentMethod == "FLOATING") {
                if (row.presentLimit == 0) {
                    return "无上限";
                }
                var un = "元";
                if (row.presentType == 2) {
                    un = "积分";
                }
                return "最大赠送" + row.presentLimit + un;
            }
            return "-";
        },
        // 存款金额
        comMoneyFormatter: function (row, index) {
            var min = row.depositMin, max = row.depositMax;
            if (!min && !max) {
                return "不限制";
            }
            var un = "元";
            if (row.valueType == 2) {
                un = "积分";
            }
            if (!min && max) {
                return "小于等于" + max + un;
            }
            if (min && !max) {
                return "大于" + min + un;
            }
            return "大于" + min + un + "<br/>且小于等于" + max + un;
        },
        // 时间
        dateFormatterStart: function (val, index) {
            if (val.length > 0) {
                return val + " 00:00:00";
            } else {
                return "-";
            }

        },
        dateFormatterEnd: function (val, index) {
            if (val.length > 0) {
                return val + " 23:59:59";
            } else {
                return "-";
            }

        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = parseInt(p);
            this.initRequestData.page = parseInt(p);
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
    },
    created : function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13 || event.keyCode == 32) {
                vue.query();
            }
        });
    },
});
vue.onLoad();
