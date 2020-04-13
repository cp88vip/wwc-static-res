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
            offset: 0,
            count: 15,
            endTime: 0,
            startTime: 0,
            lotteryId: 100001,
            status: -1,
            single : true,
            hot : true,
        },
        initDate: {
            start: null,
            end: null
        },

        totalPages: 0,
        totalRows: 0,
        currentPage: 1,
        isShowPageNav: false,
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
            this.request();
        },
        request: function () {
            var that = this;
            this.initRequestData.startTime = this.initDate.start;
            this.initRequestData.endTime = this.initDate.end;
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
            var types = $("#types").val();
            if(types == 'single'){
                this.initRequestData.single = true;
                this.initRequestData.hot = null;
            }else if(types == 'hot'){
                this.initRequestData.hot = true;
                this.initRequestData.single = null;
            }else{
                this.initRequestData.hot = null;
                this.initRequestData.single = null;
            }
            request('/manage/foot_ball/football_match.do', this.initRequestData, function (e) {
                that.logs = e.data.orders;
                // 翻页导航
                var totalRows = e.data.total;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        query: function () {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.request();
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
        lookScore : function (item) {
            var scoreH = item.scoreH.split(":"),scoreF = item.scoreF.split(":");
            var html = ' <table class="table table-bordered table-striped">' +
                '<thead>' +
                '   <tr>\n' +
                '      <th>主客</th>\n' +
                '      <th>半场比分</th>\n' +
                '      <th>全场比分</th>\n' +
                '   </tr>\n' +
                '</thead>\n' +
                '<tbody>\n' +
                '   <tr>\n'+
                '      <td>'+ item.teamHome +'</td>\n' +
                '      <td>' + scoreH[0] + '</td>\n' +
                '      <td>' + scoreF[0] + '</td>\n' +
                '   </tr>\n' +
                '   <tr>\n' +
                '      <td>'+ item.teamAway +'</td>\n' +
                '      <td>' + scoreH[1] + '</td>\n' +
                '      <td>' + scoreF[1] + '</td>\n' +
                '   </tr>\n' +
                '</tbody>\n' +
                '</table>';
            layer.open({
                type: 1,
                title : '比分信息',
                shadeClose: true,
                skin: 'layui-layer-rim', //加上边框
                area: ['420px', '200px'], //宽高
                content: html
            });

        },
        doStatus: function (item) {
            switch (item.status){
                case 'normal':
                    return '<a class="btn btn-sm btn-info" style="margin: 0px 5px 5px 0px;">已开售</a>'
                case 'finished':
                    return '<a class="btn btn-sm btn-primary" style="margin: 0px 5px 5px 0px;cursor: pointer" onclick="vue.lookScore(' + JSON.stringify(item).replace(/\"/g,"'") +')">已结束</a>'
                case 'playing':
                    return '<a class="btn btn-sm btn-success" style="margin: 0px 5px 5px 0px;">进行中</a>'
                case 'pending':
                    return '<a class="btn btn-sm btn-warning" style="margin: 0px 5px 5px 0px;">待定</a>'
                case 'cancelled':
                    return '<a class="btn btn-sm btn-danger" style="margin: 0px 5px 5px 0px;">取消</a>'
                case 'interrupted':
                    return '<a class="btn btn-sm btn-danger" style="margin: 0px 5px 5px 0px;">中断</a>'
                case 'delayed':
                    return '<a class="btn btn-sm btn-danger" style="margin: 0px 5px 5px 0px;">延期</a>'
            }
        },
        redetermination : function (item) {
            var html = ' <table id="redetermination" key="'+ item.key +'" class="table table-bordered table-striped">' ;

            html += '<thead>' +
                '                        <tr>\n' +
                '                            <th>主客</th>\n' +
                '                            <th>半场比分</th>\n' +
                '                            <th>全场比分</th>\n' +
                '                        </tr>\n' +
                '                        </thead>\n' +
                '                        <tbody>\n' +
                '                        <tr>\n'+
                '                            <td>'+ item.teamHome +'</td>\n' +
                '                            <td><input type="text" onkeyup="this.value=this.value.replace(/\\D/g,\'\');" id="scoreHZD" class="form-control form_datetime_start" style="width: 60px;margin: 0 auto;"></td>\n' +
                '                            <td><input type="text" onkeyup="this.value=this.value.replace(/\\D/g,\'\');" id="scoreFZD" class="form-control form_datetime_start" style="width: 60px;margin: 0 auto;"></td>\n' +
                '                        </tr>\n' +
                '                        <tr>\n' +
                '                            <td>'+ item.teamAway +'</td>\n' +
                '                            <td><input type="text" onkeyup="this.value=this.value.replace(/\\D/g,\'\');" id="scoreHKD" class="form-control form_datetime_start" style="width: 60px;margin: 0 auto;"></td>\n' +
                '                            <td><input type="text" onkeyup="this.value=this.value.replace(/\\D/g,\'\');" id="scoreFKD" class="form-control form_datetime_start" style="width: 60px;margin: 0 auto;"></td>\n' +
                '                        </tr>\n' +
                '                        </tbody>\n' +
                '                    </table>';
            layer.confirm(html, {
                btn: ['确定','取消'], //按钮
                title : '重定比分',
                type : 1,
                shadeClose: true,
                area: ['420px', '290px'],
            }, function(){
                var scoreHZD = $("#scoreHZD").val();
                var scoreHKD = $("#scoreHKD").val();
                var scoreFZD = $("#scoreFZD").val();
                var scoreFKD = $("#scoreFKD").val();
                var data = {
                    key : $("#redetermination").attr("key"),
                    scoreH : scoreHZD + ':' + scoreHKD,
                    scoreF : scoreFZD + ':' + scoreFKD,
                };
                if(scoreHZD == '' || scoreHKD == '' || scoreFZD == '' || scoreFKD == ''){
                    var index = layer.msg('输入框不能为空');
                    return false;
                }else{
                    request('/manage/foot_ball/add_football_result.do', data, function (e) {

                        layer.msg('操作成功',function () {
                            layer.closeAll();
                        })
                    })
                }


            });
        },
        toggleStatus : function (item,eq,name) {
            // console.log(name);
            var str = '',single = null,hot = null,that = this;
            if(name == 'single'){
                str = item.single ? '禁用单关？' : '启用单关';
                single = item.single ? false : true;
            }else{
                str = item.hot ? '禁用热门？' : '启用热门';
                hot = item.hot ? false : true;
            }
            var data = {
                key : item.key,
                single : single,
                hot : hot,
            };
            layer.confirm(str, {
                btn: ['确定','取消'] //按钮
            }, function(){
                request('/manage/foot_ball/update_football_match.do', data, function (e) {
                    if(name == 'single'){
                        that.logs[eq].single = single;
                    }else{
                        that.logs[eq].hot = hot;
                    }

                    layer.msg(e.msg,{anim: 0,},function () {
                        layer.closeAll();
                    })
                })
            });
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
vue.$watch('lotteryCode', function (newVal, oldVal) {
    vue.lottertyNums = vue.lotterys[newVal];
},{deep:true});
