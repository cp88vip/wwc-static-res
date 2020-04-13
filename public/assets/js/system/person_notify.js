var vue = new Vue({
    el: '#page-wrapper',
    data: {
        initRequestData: {
            type: null,
            account: null,
            count: 15,
            offset: 0,
            start: 0,
            end: 0,
        },
        initDate: {
            start: "2017-10-01 00:00:00",
            end: ""
        },
        types: [
            {id:3,name:'个人消息'},
            {id:1,name:'晋级奖励'},
            {id:2,name:'每日加奖'}
        ],
        type: null,
        account: null,
        checkUser : '',
        checkLists: [],
        checkData : '',
        modals: {
            edit: "#editmodel",
            view: "#viewmodel",
            send: "#sendmodel"
        },
        allReceivers : [],
        allReceiverStr : '',
        requestData: { // 弹出框表单变量
            // afficheId: null,
            // title: null,
            // description: null,
            // discountoffId: null,
            // flage: 0,
            authorId: null, //发布者id
            authorName: null, //发布者姓名
            content: null,
            publishDate: null,//开始时间
            receivers: null,
            type: null
        },
        tableId: "datagrid_tb",
        logs: [],
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
        editform: "editform",
        isFromEdit : false,
    },
    filters: {
        typeFilter: function (val) {
            if (val == 1) {
                return "晋级通知";
            }
            if (val == 2) {
                return "每日加奖";
            }
            if (val == 3) {
                return "个人消息";
            }
            if (val == null) {
                return "个人消息";
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
            this.initDate.start = currentDate + " 00:00:00";
            this.initDate.end = currentDate + " 23:59:59";
            // 提取用户账号参数
            url = window.location.href;
            if (url.indexOf('#') != -1) {
                this.initRequestData.account = url.split('#')[1];
            }
            that.request();
            // that.datatable();

        },
        request: function (_offset) {
            var that = this;
            var listUrl = "/manage/system_notify/list.do",
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
            if (that.account != null && trim(that.account) == '') {
                that.account = null
            }
            that.initRequestData.start = new Date(start).getTime();
            that.initRequestData.end = new Date(end).getTime();
            that.initRequestData.account = that.account
            requestOnce(listUrl, that.initRequestData, function (e) {
               console.log(e)
               if (e.code == 0) {
                   that.logs = e.rows
                that.totalPages = Math.ceil((e.total ? e.total : 0) / that.initRequestData.count);
                that.isShowPageNav = that.totalPages > 1;
               }
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
            this.request();
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
        searchUser: function () {
            var ts  = this,
                url = '/manage/app_settings/user_info_message.do?offset=0&count=1000';
            if (typeof ts.checkUser === "string") {
                url += "&account=" + ts.checkUser;
                if (ts.checkUser.length === 0) {
                    layer.alert('请输入接收人帐号。。');
                    return false;
                }
            }
            ts.checkData = '正在查询';
            ts.checkLists = [];
            request(url, {}, function (res) {
                if (res.code == 0) {
                    ts.checkData  = '';
                    ts.checkUser  = '';
                    ts.checkLists = res.data;
                    if (ts.checkLists.length == 0) {
                    ts.checkData  = '无此用户';
                    }
                } else {
                    ts.checkData  = '查询错误';
                }
            }, function () {
                ts.checkData = '查询错误';
            });
        },
        editReceivers: function () {
            var ts = this, sendModal = $(ts.modals.send);
            ts.checkData = '当前无用户';
            ts.checkUser = '';
            sendModal.modal();
        },
        addBeforeList: function (item) {
            var ts = this;
            if (ts.allReceivers.indexOf(item.account) == -1) {
                ts.allReceivers.push(item);
            } else {
                layer.msg("该会员已被选择");
            }
            ts.checkLists = [];
            ts.checkData  = '当前无用户';
        },
        delBeforeList: function (item) {
            var ts = this;
            if (ts.allReceivers.indexOf(item) > -1) {
                var index = ts.allReceivers.indexOf(item);
                ts.allReceivers.splice(index,1);
            }
        },
        postAddReceive: function () {
            var ts = this, sendModal = $(ts.modals.send), showArr = [];
            ts.allReceiverStr = '';
            $.each(ts.allReceivers, function (i, item) {
                showArr.push(item.account);
            });
            ts.allReceiverStr = showArr.join(',');
            sendModal.modal('hide');
        },
        addMsg: function () {
            var ts = this;
            ts.receiverss = [];
            // $(ts.modals.edit).modal('toggle');
            $(ts.modals.edit).fadeIn(200);
            ts.clearMsg();
            var _user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
            if (!_user) {
                layer.msg("管理员未登录。");
                // $(ts.modals.edit).modal('toggle');
                $(ts.modals.edit).fadeOut(500);
                return false;
            }
            // 
            // obj2.setData('');
            $("#form-div").attr("afficheid", "");
            ts.requestData['authorName'] = _user.username;
            ts.requestData['authorId'] = _user.userId;
            ts.requestData.flage = ts.currentFlag;
        },
        clearMsg: function () {
            var ts = this;
            ts.isFromEdit = false;
            document.getElementById(ts.editform).reset();
            for (var e in ts.requestData) {
                if (ts.requestData.hasOwnProperty(e)) {
                    if (e == "flage") {
                        ts.requestData[e] = 0;
                    } else if (e == "isLoca" || e == "isShow") {
                        ts.requestData[e] = false;
                    } else {
                        ts.requestData[e] = null;
                    }
                }
            }
            // ts.initDate.start = "";
            // ts.initDate.end = "";
            ts.beforeSend = null;
            // if (qEditor) {
            //     qEditor.setText('');
            // }
        },
        closeMsg: function () {
            var ts = this;
            $(ts.modals.edit).hide()
        },
        doEditor: function () {
            var ts = this;
            this.requestData.receivers = []
            this.allReceivers.forEach(function(item){
                ts.requestData.receivers.push(item.account)
            })
            this.requestData.type = 3
            requestOnce('/manage/system_notify/add.do', this.requestData, function (e) {
                console.log(e)
                if (e.code == 0) {
                    ts.currentPage = 1;
                    ts.initRequestData.offset = 0;
                    layer.msg("添加成功！");
                    ts.closeMsg()
                    ts.request()
                }
             });
        },
        showNotify: function (notifyId) {
            var ts = this;
            requestOnce('/manage/system_notify/get.do', {notifyId:notifyId}, function (e) {
                console.log(e)
                if (e.code == 0) {
                    $(ts.modals.view).modal('toggle');
                    $(ts.modals.view).find('.modal-body').html('');
                    var viewHtml = '<div class="prediv-div">' + e.data.content + '</div>';
                    $(ts.modals.view).find(".modal-body").append(viewHtml);
                }
             });
        },
        delMsg: function (notifyId) {
            // requestOnce('/manage/system_notify/delete.do', {notifyId:notifyId}, function (e) {
            //     console.log(e)
            //     if (e.code == 0) {
            //         layer.msg("删除成功！");                    
            //     }
            //  });
            var ts = this;
             var lock = false,
                        dele = layer.confirm('确定删除该条信息？', {
                                  btn : ['确定', '取消'],
                                  closeBtn : 0,
                               }, function (index, layero) {
                                  var data = {'notifyId': notifyId};
                                  if(!lock) {
                                      lock = true; // 锁定
                                      request('/manage/system_notify/delete.do', data, function (result) {
                                          if (result.code == 0) {
                                                ts.currentPage = 1;
                                                 ts.initRequestData.offset = 0;
                                                 layer.close(index);
                                                 ts.request()
                                                 layer.msg("删除成功！");
                                          }
                                      });
                                  }
                              }, function (index) {});
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
// $(document).click(function () {
//     if ($(".agentList").length > 0) {
//         $(".agentList").hide();
//     }
// });