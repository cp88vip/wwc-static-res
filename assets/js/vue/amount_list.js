var vue = new Vue({
    el : '#page-wrapper',
    data : {
        logs : [],
        initRequestData : {
            account : "",
            type : 0,
            page : 1,
            pageSize : 15,
            startTime : "",
            endTime : "",
        },
        initDate : {
            start:"",
            end : ""
        },
        totalPages : 0,
        currentPage : 1,
        isShowPageNav : false,
        pageNum : 1,
    },
    methods : {
        onLoad : function(e) {
            var that = this;
            $(".form_datetime_start").datetimepicker({
                format : 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
            }).on('changeDate', function(ev) {
                that.initDate.start = ev.target.value
            });
            $(".form_datetime_end").datetimepicker({
                format : 'yyyy-mm-dd hh:ii:ss',
				startDate:new Date(new Date()-1000 * 60 * 60 * 24 * 60),
    		endDate : new Date()
            }).on('changeDate', function(ev) {
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
            this.request();
        },
        request : function() {
            var that = this;
            that.initRequestData.startTime = that.initDate.start;
            that.initRequestData.endTime = that.initDate.end;
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
            requestOnce('/manage/finance/get_betnum_record_list.do', that.initRequestData, function(e) {
                var logs = e.rows;
                $.each(logs,function (k,v) {
                    logs[k].changeType = that.changeType(v.type);
                });
                // console.log(logs);
                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;

                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.pageSize);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        changeType : function (value) {
            var str = "";
            switch (value) {
                case 1:
                    str = "存款";
                    break;
                case 2:
                    str = "人工增加";
                    break;
                case 3:
                    str = "人工扣除";
                    break;
                case 4:
                    str = "赠送彩金";
                    break;
                case 5:
                    str = "注册彩金";
                    break;
                case 6:
                    str = "彩票投注";
                    break;
                case 7:
                    str = "六合彩投注";
                    break;
                case 8:
                    str = "红包";
                    break;
                case 9:
                    str = "游戏投注";
                    break;
                default:

            }
            return str;
        },
        query : function() {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.initRequestData.page = 1;
            // this.initRequestData.account = $("#account").val();
            this.request();
        },
        doDate : function(name) {
            this.currentPage = 1;
            this.initRequestData.page = 1;
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
        pageNav : function(p) {
            if(p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.page = p;
            this.request();
        },
        pageCul : function(curr) {
            var curr=parseInt(curr);
            if(curr > this.totalPages - 9) {
                var p = this.totalPages;
                return [p-9,p-8,p-7,p-6,p-5,p-4,p-3,p-2,p-1, p];
            }else if(curr < 10) {
                return [1,2,3,4,5,6,7,8,9,10];
            }else{
                return[curr-5,curr-4,curr-3,curr-2,curr-1,curr,curr+1,curr+2,curr+3,curr+4]
            }

        },
    },
    created : function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                vue.query();
            }
        });
    },
});

vue.onLoad();
