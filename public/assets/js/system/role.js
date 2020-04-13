var Game = {};
Game.Tree = function (config) {
    var ts = {}, that = this;
    ts.treeId = config.treeId ? config.treeId : "";
    ts.treeDiv = $("#"+ts.treeId);
    ts.items = [];
    ts.checklist = [];
    ts.treeInit = function(){
        var that = this;
        var treeData = ts.requestTree();
        var checkableTree = ts.treeDiv.treeview({
            data: treeData,
            levels: 1,
            expandIcon: 'fa fa-plus-square',
            collapseIcon: 'fa fa-minus-square',
            checkedIcon: "fa fa-check-square",
            uncheckedIcon: "fa fa-square-o",
            showIcon: false,
            showCheckbox: true,
            multiSelect: true,
            highlightSearchResults: false,
            highlightSelected: false,
            // hierarchicalCheck:true,//级联勾选

            onNodeChecked: function(event, node) { //选中节点
                // var selectNodes = getChildNodeIdArr(node); //获取所有子节点
                // if (selectNodes) { //子节点不为空，则选中所有子节点
                //   ts.treeDiv.treeview('checkNode', [selectNodes, { silent: true }]);
                // }
                // var parentNode = ts.treeDiv.treeview("getNode", node.parentId);
                // setParentNodeCheck(node, "checkNode");
            },
            onNodeUnchecked: function(event, node) { //取消选中节点
                // var selectNodes = setChildNodeUncheck(node); //获取未被选中的子节点
                // var childNodes = getChildNodeIdArr(node); //获取所有子节点
                // if (selectNodes && selectNodes.length==0) { //子节点不为空，则取消选中所有子节点
                // 	// console.log("反选");
                //   ts.treeDiv.treeview('uncheckNode', [childNodes, { silent: true }]);
                // }
                // // 取消节点 父节点取消
                // var parentNode = ts.treeDiv.treeview("getNode", node.parentId);  //获取父节点
                // var selectNodes = getChildNodeIdArr(node);
                // setParentNodeCheck(node);
            },

        });
        // that.tree = checkableTree;
    };
    var getChildNodeIdArr = function (node) {
        var ts = [];
        if (node.nodes) {
            for (x in node.nodes) {
                ts.push(node.nodes[x].nodeId);
                if (node.nodes[x].nodes) {
                    var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                    for (j in getNodeDieDai) {
                        ts.push(getNodeDieDai[j]);
                    }
                }
            }
        } else {
            ts.push(node.nodeId);
        }
        return ts;
    }
    // 取消父节点时 取消所有子节点
    var setChildNodeUncheck = function (node) {
        if (node.nodes) {
            var ts = [];    //当前节点子集中未被选中的集合
            for (x in node.nodes) {
                if (!node.nodes[x].state.checked) {
                    ts.push(node.nodes[x].nodeId);
                }
                if (node.nodes[x].nodes) {
                    var getNodeDieDai = node.nodes[x];
                    // console.log(getNodeDieDai);
                    for (j in getNodeDieDai) {
                        if (!getNodeDieDai.state.checked) {
                            ts.push(getNodeDieDai[j]);
                        }
                    }
                }
            }
        }
        return ts;
    }
    // 取消父节点时 取消所有子节点
    var setParentNodeCheck = function (node, method) {
        var parentNode = ts.treeDiv.treeview("getNode", node.parentId);
        if (parentNode.nodes) {
            var checkedCount = 0;
            for (x in parentNode.nodes) {
                if (parentNode.nodes[x].state.checked) {
                    checkedCount ++;
                } else {
                    continue;
                }
            }
            // checkedCount == parentNode.nodes.length
            if (method == "checkNode") {
                if (checkedCount == parentNode.nodes.length) {  //如果子节点全部被选 父全选
                    ts.treeDiv.treeview("checkNode", parentNode.nodeId);
                    setParentNodeCheck(parentNode);
                } else {   //如果子节点未全部被选 父未全选
                    ts.treeDiv.treeview('uncheckNode', parentNode.nodeId);
                    setParentNodeCheck(parentNode);
                }
            } else {
                if (checkedCount > 0) {  //如果子节点全部被选 父全选
                    ts.treeDiv.treeview("checkNode", parentNode.nodeId);
                    setParentNodeCheck(parentNode);
                } else {   //如果子节点未全部被选 父未全选
                    ts.treeDiv.treeview('uncheckNode', parentNode.nodeId);
                    setParentNodeCheck(parentNode);
                }
            }
        }
    }

    ts.requestTree = function(){
        var that = this;
        var dataArr = [];
        var structTreeData = function(data){
            var that = this;
            var treeData = [];
            var moreBtn = function(dict){
                var html = '';
                // if (dict.showInMenu == 1) {
                //   var statusStr = '<p class="text-success">启用</p>';
                // } else if (dict.showInMenu == 2) {
                //   var statusStr = '<p class="text-warning">禁用</p>';
                // } else if (dict.showInMenu == 9) {
                //   var statusStr = '<p class="text-danger">删除</p>';
                // } else {
                //   var statusStr = '';
                // }
                var statusStr = '';
                html += '<div class="col-xs-3 pull-right text-right">'+statusStr+'</div>'
                return html;
            }
            //TODO 一维 to 多维
            for (var i = 0; i < data.length; i++) {
                var eachData = data[i];
                if (eachData.parentId == undefined || eachData.parentId == 0) {
                    // console.log("一级权限");
                    treeData.push({
                        text: eachData.name + moreBtn(eachData),
                        href: (eachData.redirect ? eachData.redirect : 'javascript:void(0);'),
                        id: eachData.id,
                        nodes: (eachData.childrenAuthroityId != null && eachData.childrenAuthroityId != "" ? [] : null),
                        showInMenu: eachData.showInMenu,
                        state : {
                            // disabled: (eachData.showInMenu == 1 ? false : true),
                        },
                        id: (eachData.id ? eachData.id : 0),
                        parentId: (eachData.parentId ? eachData.parentId : null)
                    });
                    // treeData.sort(function(a, b){
                    //     return b.id - a.id;
                    // });
                } else {
                    var recursivePushData = function(arr, data){
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];
                            // console.log(item);
                            if (item.id == data.parentId) {
                                if(!arr[i].nodes){
                                    arr[i].nodes = [];
                                }
                            }
                            if (item.nodes) {
                                if (item.id === data.parentId) {
                                    // console.log(i+" is inx");
                                    if (!arr[i].nodes) {
                                        arr[i].nodes = [];
                                    }
                                    /*去重*/
                                    var f = true;
                                    for (var _item of arr[i].nodes) {
                                        if (_item.id == data.id) {
                                            f = false;
                                            break;
                                        }
                                    }
                                    if (f) {
                                      arr[i].nodes.push(data);
                                    }
                                    // arr.sort(function(a, b){
                                    //     return b.id - a.id;
                                    // });
                                }	else {
                                    recursivePushData(arr[i].nodes, data);
                                }
                            } else {

                            }
                        }
                    }
                    recursivePushData(treeData, {
                        text: eachData.name + moreBtn(eachData),
                        href: (eachData.redirect ? eachData.redirect : 'javascript:void(0);'),
                        id: eachData.id,
                        nodes: (eachData.childrenAuthroityId != null && eachData.childrenId != "" ? [] : null),
                        showInMenu: eachData.showInMenu,
                        state : {
                            // disabled: (eachData.showInMenu == 1 ? false : true),
                        },
                        id: (eachData.id ? eachData.id : 0),
                        parentId: (eachData.parentId ? eachData.parentId : null)
                    });
                }
            }
            return treeData;
        }
        requestSyn(" /manage/permission/permit_list.do", {}, function(res){
            // console.log(res);
            if (res.code == 0) {
                var defaultArr = res.data;
                dataArr = structTreeData(defaultArr);
                that.items = defaultArr;
            }
        });

        return dataArr;
    };
    ts.searchNodes = function(checkData){
        ts.checklist = checkData;
        for (var i = 0; i < ts.items.length; i++) {
            for (var j = 0; j < checkData.length; j++) {
                var each = checkData[j];
                if (ts.items[i].id == each.id) {
                    var obj = ts.treeDiv.treeview("search", [ts.items[i].name, {
                        ignoreCase: false,
                        exactMatch: false,
                        revealResults: false
                    }]);
                    for (var z = 0; z < obj.length; z++) {
                        if (obj[z].id == each.id) {
                            ts.treeDiv.treeview("checkNode", [obj[z], {
                                silent: true
                            }]);
                            break;
                        }
                    }
                    // ts.treeDiv.treeview("selectNode", [obj, {
                    //   silent: true
                    // }]);
                }
            }
        }
    };
    ts.clearChecked = function(){
        ts.treeDiv.treeview("uncheckAll", {silent: true});
        ts.checklist = [];
    };
    ts.getChecked = function(rolesId){
        var checkArr = ts.treeDiv.treeview('getChecked');
        var uu = JSON.parse(sessionStorage.getItem('user'));
        if (!uu && parseInt(uu.userId) <= 0) {
            return false;
        }
        arr = [];
        for (var i = 0; i < checkArr.length; i++) {
            var eid = checkArr[i].id;
            arr.push(eid);
        }
        return arr;
    };
    ts.treeInit();
    return ts;
}
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        initRequestData: {
            rolesId: null,
            rolesName: null,
            rolesStatus: null,
            rolesRemarks: null,
            auth: null,
            // page: 1,
            // pageSize: 15,
        },
        modals: {
            edit: "#editmodel",
        },
        treeId: "role-tree",
        tree : null,//树形数据
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
    },
    methods: {
        onLoad: function (e) {
            var that = this;
            //实例化 树形权限界面
            that.tree = Game.Tree({
                treeId: that.treeId,
            });
            //表格数据获取
            that.request();
        },
        request: function () {
            var that = this;
            request('/manage/permission/role_group.do', {}, function (e) {
                that.logs = e.rows;

                // 翻页导航
                // var totalRows = e.total;
                //
                // that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initinitRequestData.pageSize);
                // console.log(that.totalPages);
                // console.log(that.totalPages > 1);
                // that.isShowPageNav = that.totalPages > 1;
            });
        },

        addRole: function () {
            var that = this;
            $(that.modals.edit).modal();
            that.clearModal();
            that.initRequestData.rolesStatus = 1;
            that.tree.clearChecked();

        },
        doEdit: function() {
            var that = this,urlstr = '',data = {},_Id = that.initRequestData.rolesId;
            if (!_Id) {
                // 添加
                urlstr = '/manage/permission/add_role.do ';
            } else {
                urlstr = '/manage/permission/edit_role.do';
            }

            var uu = JSON.parse(sessionStorage.getItem('user'));
            if (!uu && parseInt(uu.userId) <= 0) {
                return false;
            } else {
                data = that.initRequestData;
                data.roleId = data.rolesId;
                data.roleName = data.rolesName;
                data.roleRemark = data.rolesRemarks;
            }
            var auth = that.tree.getChecked();
            data.permitIds = auth;

            var eq = $("#editLabel").attr("num");
            if(!data.rolesName){
                layer.msg("请输入角色名称");
                return false
            }
            request(urlstr, data, function(result){
                if (result.code == 0) {

                    // 被动dismiss
                    $(that.modals.edit).modal('hide');

                    // layer.msg(result.msg);
                    if (!_Id) {
                        that.request();
                        layer.msg("添加成功");
                    } else {
                        that.logs[eq].rolesName = data.rolesName;
                        that.logs[eq].rolesRemarks = data.rolesRemarks;
                        layer.msg("修改成功");
                    }
                    // clearAll();
                    that.clearModal();

                }
            });

        },
        changeCheckBox: function (row, eq) {
            // console.log(row);
            var that = this, rolesStatus = row.rolesStatus;
            var data = {roleId: row.rolesId};
            var _t = $(this);
            if ($(".changeCheckBox").eq(eq).prop("checked")) {
                var confirmWord = "确定启用角色？";
            } else {
                var confirmWord = "确定禁用角色？";
            }
            var lock = false; //默认未锁定
            layer.confirm(confirmWord, {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function (index, layero) {
                if(!lock) {
                    lock = true; // 锁定
                    request("/manage/permission/switch_role.do", data, function (res) {
                        if (res.code == 0) {
                            if (rolesStatus == 1) {
                                that.logs[eq].rolesStatus = 0;
                            } else {
                                that.logs[eq].rolesStatus = 1;
                            }

                            layer.msg("修改成功");
                        }
                    });
                }

            }, function (index) {
                // window.location.reload();
                console.log($(".changeCheckBox").eq(eq).prop("checked"))
                if ($(".changeCheckBox").eq(eq).prop("checked")) {
                    $(".changeCheckBox").eq(eq).prop("checked",false);
                } else {
                    $(".changeCheckBox").eq(eq).prop("checked",true);
                }
                
            });
        },
        edit: function (row, eq) {
            var that = this;
            for (var e in row) {
                if (row.hasOwnProperty(e) && that.initRequestData.hasOwnProperty(e)) {
                    that.initRequestData[e] = row[e];
                }
            }
            that.tree.clearChecked();
            $(that.modals.edit).modal();
            /**/
            $("#editLabel").attr("num",eq);
            var inx = 0, d = {};
            d.roleId = that.initRequestData.rolesId;
            request(' /manage/permission/role_permit.do', d, function (result) {
                if (result.code == 0) {
                    var checkData = result.data;
                    that.tree.searchNodes(checkData);
                }
            });
        },
        del: function (row, eq) {
            var that = this;
            var lock = false; //默认未锁定
            var dele = layer.confirm('确定要把【' + row.rolesName + '】删除掉？', {
                btn: ['确定', '取消'],
                closeBtn: 0,
            }, function (index, layero) {
                var uu = JSON.parse(sessionStorage.getItem('user'));
                var data = {'roleId': row.rolesId};
                if(!lock) {
                    lock = true; // 锁定
                    request('/manage/permission/delete_role.do', data, function (result) {
                        if (result.code == 0) {
                            that.logs.splice(eq,1);
                            layer.msg("删除成功！");
                            layer.close(index);
                        }
                    });
                }

            }, function (index) {

            });
        },
        clearModal: function(){
            var that = this;
            for (var e in that.initRequestData) {
                if (that.initRequestData.hasOwnProperty(e)) {
                    that.initRequestData[e] = null;
                }
            }
        },

        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initinitRequestData.page = p;
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
