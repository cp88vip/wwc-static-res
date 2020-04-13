window.statusObj = {
    "turnOn": 1,
    "turnOff": 2,
    "turnDel": 3
}
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        users: [],//表格数据
        account: null,//管理员帐号，单独提出来。满多余
        requestData: {//表格获取数据参数格式
            account: null,
            remark: null,
            offset: 0,
            count: 15,
            id: 0,
            type: 'manager'
        },
        modal: {
            id: "editModal",
            role: "roleModal",
            items: [],
            roleId: null
        },
        totalPages: 0,
        totalRows: 0,
        currentPage: 1,
        isShowPageNav: false,
        isShowEditor: false,//显示编辑框控制变量
        action: null,//新增或修改
        member: {//显示每个管理员的相关信息
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
            role: 3,
            rolesName: null,
            userId: null,
            share: null,
            createdTime: null
        },
        rolesId: null,//角色Id
        levelOptions: {},//管理员等级选项
        pageNum : 1,
    },
    methods: {
        onLoad: function () {
            this.request();//表格数据获取
            this.getRole();//角色数据获取
        },
        request: function () {
            var that = this;
            request('/manage/member/user_list.do', this.requestData, function (e) {
                that.users = e.rows;
                var totalRows = e.total;
                var userIds = [];
                if (that.users.length <= 0) {
                    layer.msg("没有管理员");
                    return false;
                }
                for (var i = 0; i < that.users.length; i++) {
                    userIds.push(that.users[i].userId);
                }
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.requestData.count);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        query : function() {
            this.currentPage = 1;
            this.requestData.offset = 0;
            this.request();
        },
        getRole: function () {
            var that = this;
            request('/manage/permission/role_group.do', {}, function (res) {
                if (res.code == 0) {
                    if (res.rows.length > 0) {
                        that.modal.items = res.rows;
                    }
                }
            });
        },
        updatePass: function (username) {
            updatePassword(username);
        },
        updateUser: function (item) {
            var that = this, roleDiv = $("#" + that.modal.id);
            that.clearModal();
            roleDiv.modal();
            this.action = 'edit';
            for (var i = 0; i < that.users.length; i++) {
                if (that.users[i].account == item.account) {
                    // that.member = that.users[i];
                    that.member.account = that.users[i].account;
                    that.member.userId = that.users[i].userId;
                    that.member.username = that.users[i].username;
                    that.member.agent = that.users[i].agent;
                    that.member.phone = that.users[i].phone;
                    that.member.QQ = that.users[i].qq;
                    that.member.wechat = that.users[i].wechat;
                    that.member.level = that.users[i].level;
                    that.member.bankName = that.users[i].receivingBank;//TODO 把取现银行的字段改
                    that.member.bankAccount = that.users[i].bankAccount;
                    that.member.bankAddress = that.users[i].bankAddress;
                }
            }
            // that.modal.roleId = item.rolesId;
        },
        updateRole: function (item) {
            var that = this, roleModal = $("#" + that.modal.role);
            for (var i = 0; i < that.users.length; i++) {
                if (that.users[i].account == item.account) {
                    // that.member = that.users[i];
                    that.member.account = that.users[i].account;
                    that.member.userId = that.users[i].userId;
                    that.member.username = that.users[i].username;
                    that.member.agent = that.users[i].agent;
                    that.member.phone = that.users[i].phone;
                    that.member.QQ = that.users[i].qq;
                    that.member.wechat = that.users[i].wechat;
                    that.member.level = that.users[i].level;
                    that.member.bankName = that.users[i].receivingBank;//TODO 把取现银行的字段改
                    that.member.bankAccount = that.users[i].bankAccount;
                    that.member.bankAddress = that.users[i].bankAddress;
                }
            }
            that.modal.roleId = item.role
            roleModal.modal();
        },
        doEditRole: function () {
            var ts = this, roleDiv = $("#" + ts.modal.id);
            // console.log(ts.modal);
            // if (ts.modal.roleId) {
            var data = {};
            data = ts.member;
            data.roleId = null;
            /*
            if(trim(data.username).length==0){
                layer.msg('请正确输入姓名');
                return false;
            }
            if(trim(data.password).length == 0 || trim(data.repassword).length == 0) {
                layer.msg('请正确输入密码');
                return false;
            }
            if (trim(data.password).length < 6 || trim(data.repassword).length < 6) {
                layer.msg('密码不能少于6位')
                return false;
            }
            if(data.password != data.repassword) {
                layer.msg('两次密码不一样,请重新输入');
                ts.password = '';
                ts.repassword = '';
                return;
            }
            */
            ts.submit(data);
            // } else {
            // 	layer.msg("没有选角色。")
            // }
            return false;
        },
        doRole: function () {
            var ts = this, roleModal = $("#" + ts.modal.role);
            var uu = JSON.parse(sessionStorage.getItem('user'));
            if (ts.modal.roleId) {
                var dataRole = {
                    roleId: ts.modal.roleId,
                    userId: ts.member.userId,
                    authorId: uu.userId,
                    authorName: uu.username,
                    userRoleStatus: statusObj.turnOn//TODO 注意。管理员角色状态 1是启用,2是禁用，3是已删除
                }
                request('/manage/account/update_role.do', dataRole, function (res) {
                    console.log(res);
                    if (res.code == 0) {
                        roleModal.modal('hide');
                        ts.request();
                        layer.msg('操作成功');
                    }
                });
            }
        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.requestData.offset = (p - 1) * this.requestData.count;
            this.request();
        },
        pageCul: function (curr) {
            if (curr < 10) {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            if (curr > this.totalPages - 9) {
                var p = this.totalPages;
                return [p - 9, p - 8, p - 7, p - 6, p - 5, p - 4, p - 3, p - 2, p - 1, p];
            }
            var pageArr = [];
            for (var i = curr - 5; i < curr + 5; i++) {
                pageArr.push(i);
            }
            return pageArr;
        },
        doEnabled: function (username, enabled) {
            var that = this;
            request('/manage/member/dis_enabled.do', {account: username, enabled: enabled}, function (e) {
                var count = that.users.length;
                for (var i = 0; i < count; i++) {
                    if (that.users[i].account == username) {
                        that.users[i].enabled = enabled;
                        layer.msg("操作成功");
                        break;
                    }
                }
            })
        },
        hideEditor: function () {
            this.member.account = null;
            this.member.username = null;
            this.member.agent = null;
            this.member.password = null;
            this.member.repassword = null;
            this.member.phone = null;
            this.member.QQ = null;
            this.member.wechat = null;
            this.member.level = -1;
            this.member.bankName = null;
            this.member.bankAccount = null;
            this.member.bankAddress = null;
            this.member.remark = null;
            this.member.role = 1;
            this.member.share = null;
            this.isShowEditor = false;
            this.action = null;
        },
        editUser: function (user) {
            var that = this;
            post('/manage/member/user_info.do', {account: user.account}, function (e) {
                if (!that.member.share) {
                    layer.msg('分成不可为空,请填写');
                    return;
                }
                that.member.account = e.data.account;
                that.member.username = e.data.username;
                that.member.agent = e.data.agent;
                that.member.phone = e.data.phone;
                that.member.QQ = e.data.QQ;
                that.member.wechat = e.data.wechat;
                that.member.level = e.data.level;
                that.member.bankName = e.data.receivingBank;//TODO 把取现银行的字段改
                that.member.bankAccount = e.data.bankAccount;
                that.member.bankAddress = e.data.bankAddress;
            });

            this.isShowEditor = true;
            this.action = 'edit';
        },
        clearModal: function () {
            var that = this;
            for (var each in that.member) {
                if (that.member.hasOwnProperty(each)) {
                    if (each == "role") {
                        that.member[each] = 3;
                    } else if (each == "level") {
                        that.member[each] = -1;
                    } else {
                        that.member[each] = null;
                    }
                }
            }
            that.action = null;
            that.modal.roleId = null;
        },
        addUser: function () {
            this.clearModal();
            // this.isShowEditor = true;
            this.action = 'add';
            $("#" + this.modal.id).modal();
        },
        submit: function (data) {
            var url;
            var that = this, roleDiv = $("#" + that.modal.id);
            if (that.action == 'add') {
                url = '/manage/member/add_user.do';
                var nData = data;
            } else {
                // url = '/manage/member/update_user.do';
                url = '/manage/member/update_bank_agent_user.do';
                var nData = {
                    userId: data.userId,
                };
                $("#" + this.modal.id).find('input.form-control').each(function (e) {
                    var _t = $(this);
                    nData[_t.attr('name')] = _t.val();
                });
            }
            // data.roleId = that.modal.roleId;
            if(data.account==null || trim(data.account).length==0){
                layer.msg('登录账号不能为空');
                return ;
            }
            if(data.username==null || trim(data.username).length==0){
                layer.msg('请正确输入姓名');
                return ;
            }
            if(that.action == 'add'){
                if(data.password==null || data.repassword==null || trim(data.password).length == 0 || trim(data.repassword).length == 0) {
                    layer.msg('请正确输入密码');
                    return;
                }
                if (trim(data.password).length < 6 || trim(data.repassword).length < 6) {
                    layer.msg('密码不能少于6位')
                    return;
                }
                if(data.password != data.repassword) {
                    layer.msg('两次密码不一样,请重新输入');
                    ts.member.password = '';
                    ts.member.repassword = '';
                    return;
                }
            }
            requestOnce(url, nData, function (res) {
                if (res.code == 0) {
                    roleDiv.modal('hide');
                    var uu = JSON.parse(sessionStorage.getItem('user'));
                    that.request();
                    // ts.submit(data);
                }
            });
            return false;
        }
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
