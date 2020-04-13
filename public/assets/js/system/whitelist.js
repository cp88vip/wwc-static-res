var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        initRequestData: {
            page: 1,
            pageSize: 15
        },
        modals: {
            edit: "#editmodel",
        },
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
    },
    methods: {
        onLoad: function (e) {
            this.request();
        },
        request: function () {
            var that = this;
            request('/manage/system_settings/whitelistList.do', that.initRequestData, function (e) {
                var logs = e.rows;

                that.logs = logs;
                // 翻页导航
                var totalRows = e.total;

                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.pageSize);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        query: function () {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.initRequestData.account = $("#account").val();
            this.request();
        },

        addIP: function () {
            var ts = this;
            $(ts.modals.edit).modal();
            $(ts.modals.edit).find("input").val("");
            ts.clearModal();
            ts.initRequestData.ipStatus = 1;
        },
        clearModal: function () {
            var ts = this;
            for (var e in ts.requestData) {
                if (ts.requestData.hasOwnProperty(e)) {
                    ts.requestData[e] = null;
                }
            }
        },
        doEdit: function () {
            var ts = this;
            var lock = false; //默认未锁定
            var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            var ipv6Regex = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
       
            if (!ts.initRequestData.ipIp || ts.initRequestData.ipIp.length == 0) {
                layer.msg("白名单不能为空。");
                return false;
            }
            if (!ipv4Regex.test(ts.initRequestData.ipIp) && !ipv6Regex.test(ts.initRequestData.ipIp)) {
                layer.msg("请输入正确的IP地址");
                return false;
            }

            var sub = layer.confirm("确定保存吗?", {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function (index, layero) {
                var urlstr = '';
                var data = {};

                urlstr = '/manage/system_settings/whitelistAdd.do';
                layerMsg = "添加成功";

                var uu = JSON.parse(sessionStorage.getItem('user'));
                if (!uu && parseInt(uu.userId) <= 0) {
                    return false;
                } else {
                    data = ts.initRequestData;
                    data.authorId = uu.userId;
                    data.authorName = uu.username;
                }

                if(!lock) {
                    lock = true; // 锁定
                    request(urlstr, data, function (result) {
                        if (result.code == 0) {
                            layer.msg(layerMsg);
                            ts.request();
                            $(ts.modals.edit).modal('hide');
                        }
                    });
                }

                layer.close(index);
            }, function (index) {

            });

        },
        changeStatus: function (row, eq) {
            var that = this;
            if (row.ipStatus == 1) {
                var tipsMsg = "确定要禁用该IP？";
                var d = {ipStatus: 0};
            } else {
                var tipsMsg = "确定要启用该IP？";
                var d = {ipStatus: 1};
            }
            var lock = false; //默认未锁定
            var check = layer.confirm(tipsMsg, {
                btn: ['确定', '取消'],
                closeBtn: 0
            }, function () {
                var uu = JSON.parse(sessionStorage.getItem('user'));
                var data = {
                    'ipId': row.ipId,
                    'ipStatus': d.ipStatus,
                    "authorId": uu.userId,
                    "authorName": uu.username
                };

                if(!lock) {
                    lock = true; // 锁定
                    request('/manage/system_settings/whitelist_update.do', data, function (result) {
                        if (result.code == 0) {
                            that.logs[eq].ipStatus = data.ipStatus;
                            layer.msg("修改成功");
                            // layer.close();
                            // $(ts.modals.view).modal('hide');
                            // $("#"+ts.tableId).bootstrapTable('refresh');
                        }
                    });
                }

            }, function () {

            });
        },
        del: function (row, eq) {
            var that = this;
            var lock = false; //默认未锁定
            var dele = layer.confirm('确定要把【' + row.ipIp + '】删除掉？', {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function () {
                var uu = JSON.parse(sessionStorage.getItem('user'));
                var data = {
                    'ipId': row.ipId,
                    'ipIp': row.ipIp,
                    "authorId": uu.userId,
                    "authorName": uu.username
                };

                if(!lock) {
                    lock = true; // 锁定
                    request('/manage/system_settings/whitelistDel.do', data, function (result) {
                        if (result.code == 0) {
                            layer.msg("删除成功！");
                            that.logs.splice(eq,1);
                            layer.closeAll();
                        }
                    });
                }

            }, function () {

            });
        },

        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.page = p;
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
    }
});

vue.onLoad();
