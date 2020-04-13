/* 菜单权限 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        items: [],//数据
        isShowEditor: false,
        trees: null,
        treeId: "treeview-checkable",
        output: "checkable-output",
        moreBtnTag: "btn-more",
        /* modal */
        modal: {
            id: "editmodel",
            type: "",
            inputs: {
                name: "sub-name"
            },
            value: {
                authorityId: null,
                nodeId: null,
                authorityName: null,
                authorityUrl: null,
                authorityStatus: null,
                authorityRemarks: null,
                // authorityId : null,
                // type: null,
                // roleId: null,
                grouParent: null,
                childrenAuthroityId: null
            }
        },
        /*  */
        totalPages: 0,
        totalRows: 0,
        currentPage: 1,
        isShowPageNav: false,
        action: null,
        levelOptions: {}
    },
    methods: {
        onLoad: function () {
            this.requestTree();
        },
        requestTree: function () {
            var that = this;
            var data = {};
            request("/manage/authroity/get_authroity_log.do", {}, function (res) {
                if (res.code == 0) {
                    var defaultArr = res.data;
                    if (res.data.length > 0) {
                        data = that.structTreeData(defaultArr);
                    }
                    that.items = defaultArr;
                    that.treeInit(data);
                    // that.treeControl();
                }
            });

            return data;
        },
        treeInit: function (treeData) {
            var that = this;
            var treeData = treeData;
            var checkableTree = $('#' + that.treeId).treeview({
                data: treeData,
                levels: 1,
                expandIcon: 'fa fa-plus-square',
                collapseIcon: 'fa fa-minus-square',
                checkedIcon: "fa fa-check-square",
                uncheckedIcon: "fa fa-square-o",
                showIcon: false,
                highlightSelected: false,
            });
            that.trees = checkableTree;
            that.treeControl();
        },
        treeControl: function () {
            var that = this, treeDiv = $("#" + that.treeId), modalDiv = $("#" + that.modal.id);
            treeDiv.on("click", '.list-group-item .btn-add', function (e) {
                var _t = $(this);
                // console.log(_t);
                that.clearMsg();
                that.modal.type = "add";
                modalDiv.modal();
                that.modal.value.nodeId = parseInt(_t.parent().attr('data-nodeid'));
                that.modal.value.authorityId = 0;
                that.modal.value.authorityStatus = 1;
                that.modal.value.childrenAuthroityId = null;
                that.modal.value.authorityRemarks = null;
                that.modal.value.grouParent = parseInt(_t.attr('authorityid'));

                e.stopPropagation();
            });
            treeDiv.on("click", ".list-group-item .btn-edit", function (e) {
                var _t = $(this);
                that.modal.type = "edit";
                modalDiv.modal();
                // console.log(_t.attr("authorityId"));
                that.modal.value.nodeId = parseInt(_t.attr('nodeId'));
                var dataId = _t.attr('authorityid');
                var data = {}, inx = 0;
                for (var i = 0; i < that.items.length; i++) {
                    var each = that.items[i];
                    if (dataId == each.authorityId) {
                        inx = i;
                        data = each;
                    }
                }
                // console.log(data);
                that.modal.value = data;

                e.stopPropagation();
            });
            treeDiv.on("click", ".list-group-item .btn-del", function (e) {
                var _t = $(this);
                var lock = false; //默认未锁定
                var dele = layer.confirm('确定要删除权限？', {
                    btn: ['确定', '取消'],
                    closeBtn: 0,
                }, function (index, layero) {
                    var delId = _t.attr('authorityId');
                    var nodeId = _t.attr('nodeId');
                    var data = {}, inx = 0;
                    for (var i = 0; i < that.items.length; i++) {
                        var each = that.items[i];
                        if (delId == each.authorityId) {
                            inx = i;
                            data = each;
                        }
                    }
                    data.status = 9;
                    // that.modal.value = data;
                    if (!lock) {
                        lock = true; // 锁定
                        request("/manage/authroity/update_authroity.do", data, function (res) {
                            if (res.code == 0) {
                                layer.msg("删除成功");
                                that.items[inx].authorityStatus = 9;
                                // that.treeInit();
                                that.requestTree();
                            }
                        });
                        layer.close(index);
                    }

                }, function (index) {

                });
                e.stopPropagation();
            });
        },
        structTreeData: function (data) {
            var that = this;
            var treeData = [];
            var moreBtn = function (dict) {
                // console.log(dict);
                var html = '';
                if (dict.status != 9) {
                    html += '<a href="javascript:void(0)" authorityId=' + dict.authorityId + ' class="btn btn-xs btn-danger pull-right btn-del" style="margin-top: -1px;"><i class="fa fa-remove fa-fw"></i>删除</a>';
                    html += '<a href="javascript:void(0)" authorityId=' + dict.authorityId + ' class="btn btn-xs btn-warning pull-right btn-edit" style="margin-top: -1px; margin-right: 5px;"><i class="fa fa-pencil fa-fw"></i>修改</a>';
                    html += '<a href="javascript:void(0)" authorityId=' + dict.authorityId + ' class="btn btn-xs btn-primary pull-right btn-add" style="margin-top: -1px; margin-right: 5px;"><i class="fa fa-plus fa-fw"></i>添加</a>';
                }
                if (dict.authorityStatus == 1) {
                    var statusStr = '<p class="text-success">启用</p>';
                } else if (dict.authorityStatus == 2) {
                    var statusStr = '<p class="text-warning">禁用</p>';
                } else if (dict.authorityStatus == 9) {
                    var statusStr = '<p class="text-danger">删除</p>';
                } else {
                    var statusStr = '';
                }
                html += '<div class="col-xs-2 pull-right text-right">' + statusStr + '</div>'
                html += '<span class="text-info">' + dict.authorityUrl + '</span>';
                return html;
            }
            //TODO 一维 to 多维
            for (var i = 0; i < data.length; i++) {
                var eachData = data[i];
                if (eachData.grouParent == undefined || eachData.grouParent == 0) {
                    treeData.push({
                        text: eachData.authorityName + moreBtn(eachData),
                        href: (eachData.authorityUrl ? eachData.authorityUrl : 'javascript:void(0);'),
                        id: eachData.authorityId,
                        nodes: (eachData.childrenAuthroityId != null && eachData.childrenAuthroityId != "" ? [] : null),
                        status: eachData.authorityStatus,
                        authorityId: (eachData.authorityId ? eachData.authorityId : 0),
                        authorityRemarks: (eachData.authorityRemarks ? eachData.authorityRemarks : 0),
                        grouParent: (eachData.grouParent ? eachData.grouParent : null)
                    });
                    treeData.sort(function (a, b) {
                        return b.authorityId - a.authorityId;
                    });
                } else {
                    var recursivePushData = function (arr, data) {
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];
                            // console.log(item);
                            if (item.id == data.grouParent) {
                                if (!arr[i].nodes) {
                                    arr[i].nodes = [];
                                }
                            }
                            if (item.nodes) {
                                if (item.id === data.grouParent) {
                                    // console.log(i+" is inx");
                                    if (!arr[i].nodes) {
                                        arr[i].nodes = [];
                                    }
                                    arr[i].nodes.push(data);
                                    arr.sort(function (a, b) {
                                        return b.authorityId - a.authorityId;
                                    });
                                } else {
                                    recursivePushData(arr[i].nodes, data);
                                }
                            } else {

                            }
                        }
                    }
                    // console.log(treeData);
                    recursivePushData(treeData, {
                        text: eachData.authorityName + moreBtn(eachData),
                        href: (eachData.authorityUrl ? eachData.authorityUrl : 'javascript:void(0);'),
                        id: eachData.authorityId,
                        nodes: (eachData.childrenAuthroityId != null && eachData.childrenAuthroityId != "" ? [] : null),
                        status: eachData.authorityStatus,
                        authorityId: (eachData.authorityId ? eachData.authorityId : 0),
                        authorityRemarks: (eachData.authorityRemarks ? eachData.authorityRemarks : 0),
                        grouParent: (eachData.grouParent ? eachData.grouParent : null)
                    });
                }
            }
            // console.log(treeData);
            return treeData;
        },
        addNode: function () {
            var that = this, treeDiv = $("#" + that.treeId), modalDiv = $("#" + that.modal.id);
            that.clearMsg();
            that.modal.type = "add";
            modalDiv.modal();
            //TODO 无父级
            that.modal.value.nodeId = -1;
            that.modal.value.authorityId = 0;
            that.modal.value.authorityStatus = 1;
            // that.modal.value.roleId = 0;
            that.modal.value.grouParent = 0;
            that.modal.value.childrenAuthroityId = null;
            that.modal.value.authorityRemarks = null;

            return false;
        },
        clearMsg: function () {
            var that = this;
            for (var e in that.modal.value) {
                if (that.modal.value.hasOwnProperty(e)) {
                    that.modal.value[e] = null;
                }
            }
        },
        doEdit: function () {
            var that = this;
            var lock = false; //默认未锁定
            var sub = layer.confirm("确定提交吗?", {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function (index, layero) {
                var urlstr = '';
                var data = {};
                // 判断是否有discountoffId有值
                if (that.modal.type == "add") {
                    urlstr = '/manage/authroity/add_authroity.do';
                } else if (that.modal.type == "edit") {
                    urlstr = '/manage/authroity/update_authroity.do';
                } else {
                    layer.msg("提交类型不正确");
                    return false;
                }
                var nodeId = that.modal.value.nodeId;

                data = that.modal.value;
                data.status = parseInt(data.status);
                // console.log(data);
                if(!lock) {
                    lock = true; // 锁定
                    request(urlstr, data, function (res) {
                        if (res.code == 0) {
                            // 被动dismiss
                            $("#" + that.modal.id).modal('hide');

                            // layer.msg(result.msg);
                            if (that.modal.type == "add") {
                                layer.msg("添加成功");
                            } else {
                                layer.msg("修改成功");
                            }
                            that.requestTree();
                            that.clearMsg();
                        }
                    });
                    layer.close(index);
                }

            }, function (index) {

            });
        }

    }
});

$(function () {
    vue.onLoad();
});
