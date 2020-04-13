var Game = {};
Game.Table = function (cfg) {
    var defCfg = {
        method: 'post',
        cache: false,
        striped: true,
        pagination: true,
        pageList: [15],
        contentType: "application/json; charset=utf-8",
        ajaxOptions: {
            headers: {
                "sessionid": $.cookie("sessionid"),
                'temporary-sessionId': $.cookie("temporaryId")
            },
        },
        pageSize: 15,
        pageNumber: 1,
        queryParamsType: null,
        sidePagination: 'server',
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        undefinedText:'-',
        minimumCountColumns: 2,
        onLoadSuccess: function (e) {
            if (e.code != 0) {
                if (e.code >= 300 && e.code < 400) {
                    layer.msg(e.msg);
                } else if (!(e.code == 0 || e.code == 101)) {
                    layer.msg(e.msg);
                } else {
                    layer.msg(e.msg);
                }
            }
        },
        onLoadError: function () {
            // layer.msg("加载数据失败");
        }
    }
    for (var key in defCfg) {
        if (cfg[key] === undefined) {
            cfg[key] = defCfg[key];
        }
    }
    return $('#' + cfg.id).bootstrapTable(cfg);
};
// 跳转 方法 筛选
// 补齐 wwc://platformapi/wwc/***
var WWCBase = 'wwc://platformapi/wwc/';
var WWCLinks = [
    /* 客服 */
    // {key: '', title: '客服', disabled: 1},
    // {key: 'onlineService', title: '系统客服'},
    {key: 'thirdService', title: '第三方客服'},
    {key: 'QQService', title: 'QQ客服'},
    /* 聊天室与投注 */
    // {key: '', title: '竞彩足球与聊天室', disabled: 1},
    {key: 'football', title: '竞彩足球'},
    {key: 'betChatRoom?position=1', title: '聊天室'},
    // 优惠活动
    // {key: '', title: '优惠活动', disabled: 1},
    {key: 'activity', title: '优惠活动'},
    // {key: 'betting', title: '彩种投注'},
    // {key: 'chatRoom', title: '聊天室'},
    // {key: 'redPacket?rid=', title: '红包跳转'},
    // {key: 'privateChat?receiver=', title: '私聊跳转'},
    /* 个人中心 */
    // {key: '', title: '个人中心', disabled: 1},
    // {key: 'orders', title: '我的注单'},
    // {key: 'accountDetail', title: '账户明细'},
    // {key: 'rechargeRecord', title: '充值记录'},
    // {key: 'withdrawRecord', title: '提款记录'},
    // {key: 'messages', title: '个人消息'},
    // {key: 'securityCenter', title: '安全中心'},
    // {key: 'playRules', title: '玩法规则'},
    // {key: 'aboutUs', title: '关于我们'},
    // {key: 'profitLoss', title: '今日盈亏'},
    // {key: 'followList', title: '关注列表'},
    // {key: 'friendList', title: '好友列表'},
]
var SelfSetLink = 'customLinkUrl?url=';
var wwcSelects = function (tips) {
    var str = '';
    for (var i = 0; i < WWCLinks.length; i++) {
        var t = WWCLinks[i];
        if (tips) {
            if (tips === 'no-service' && t.title.indexOf('客服') > -1) {
                continue;
            }
            if (tips === 'only-service' && t.title.indexOf('客服') == -1) {
                continue;
            }
        }
        str += '<option value="' + t.key + '"'  +
            (t.disabled === 1?' disabled="disabled" style="background: #eee; color: #111;"':'') +
            '>' + t.title + '</option>';
    }
    return str;
}
var wwcFilter = function (url) {
    if (url.indexOf('customLinkUrl') > -1) {
        // let _customRule = /href="([a-zA-Z0-9\:\/\_\?\=\.]+)"/
        var _u = url.split('url=')[1]
        // let _replace = str.match(_customRule) && str.match(_customRule)[1] ? str.match(_customRule)[1] : url
        // str = str.replace(url, _u)
        return _u
    } else {
        var _t = url.split('/platformapi/wwc/')[1]
        if (_t) {
            return _t
        } else {
            return url
        }
    }
}
// 验证图片大小
function validImg (imageUrl, fn) {
    // 验证图片分辨率
    var _valid = true
    var imgLoad = function (url, callback) {
        var img = new Image()
        img.src = url
        if (img.complete) {
            callback(img.width, img.height)
        } else {
            img.onload = function () {
                callback(img.width, img.height)
                img.onload = null
            }
        }
    }
    if (!/.*(http|https):\/\/\S+?\//g.test(imageUrl)) {
        alert('图片链接不正确')
        return false
    }
    imgLoad(imageUrl, function(width, height) {
        if (width == 0 || height == 0) {
            alert('图片链接不正确')
            _valid = false
        }
        if (width > 720 || height > 800) {
            alert('图片不能超过720*800')
            _valid = false
        }
        if (typeof fn === 'function') {
            fn(_valid)
        }
    })
    return _valid
}

// 
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        isLoad: null,
        logs: [],
        subType: {
            admin: 0,
            maintain: 1,
            ordinary: 2,
            warning: 3,
            station: 4,
            activity: 5,
            frontWeb: 6
        },
        group: {
            title: [0, 1, 2, 5],
            headimg: [0, 1, 2, 5],
            startTime: [0, 1, 2, 5, 6],
            endTime: [0, 1, 2, 5, 6],
            lockMobile: [1],
            receive: [3, 4],
            descript: [0, 1, 2, 5]
        },
        modals: {
            edit: "#editmodel",
            view: "#viewmodel",
            send: "#sendmodel"
        },
        editform: "editform",
        modalData: {
            title: "#sub-title",
            sender: "#sub-sender",
            description: "#sub-description",
            type: "input[name='sub-type']"
        },
        receiverss: [],
        requestAffReceive: {
            affId: 0,
            lis: [],
            fl: 0,
        },
        table: null,
        tableId: "datagrid_tb",
        ckTextArea: "",
        requestData: { // 弹出框表单变量
            afficheId: null,
            title: null,
            description: null,
            discountoffId: null,
            flage: 0,
            authorId: null, //发布者id
            authorName: null, //发布者姓名
            isLoca: false, //是否锁定
            activeTime: null, //有效时间
            content: null,
            publishDate: null,//开始时间
            redirectUrl: null,
            coverUrl: null,
            receivers: null,
            imageUrl: null,
            linkUrl: null
        },
        initDate: {
            start: null,
            end: null
        },
        flags : [{'title' : '维护公告', 'flag' : 1},
                 {'title' : '普通公告', 'flag' : 2},
                //  {'title' : '个人消息', 'flag' : 4},
                 {'title' : '小喇叭',   'flag' : 6},
                 {'title' : '推广公告',   'flag' : 5}],
        currentFlag : 2,
        modalflags : [{'title' : '维护公告', 'flag' : 1},
                      {'title' : '普通公告--面向全部用户', 'flag' : 2},
                    //   {'title' : '个人消息--面向单人用户', 'flag' : 4},
                      {'title' : '小喇叭',   'flag' : 6},
                      {'title' : '推广公告',   'flag' : 5}],
        checkUser : '',
        checkLists: [],
        checkData : '',
        allReceivers : [],
        allReceiverStr : '',
        isFromEdit : false,
        page : 1,
    },
    methods: {
        onLoad: function (e) {
            var ts = this;
            ts.timeBind();
            ts.datatable();
            ts.refreshTableShow();
        },
        timeBind: function () {
            var ts = this;
            $("#beginDateInp").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function (ev) {
                ts.initDate.start = ev.target.value;
            });
            $("#endDateInp").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss'
            }).on('changeDate', function (ev) {
                ts.initDate.end = ev.target.value;
            });
        },
        changeFlag : function () {
            var ts = this;
            ts.allReceivers = [];
            ts.isLoad = layer.load(2, {
                shade: [0.3, '#000']
            })
            $("#" + ts.tableId).bootstrapTable('selectPage', 1);
            ts.refreshTableShow();
        },
        changeModalFlag : function () {
            var ts = this;
            ts.allReceivers = [];
            ts.timeBind();
        },
        refreshTableShow : function () {
            var ts = this;
            var titleArr = ['flage','title','content','authorName','publishDate','activeTime','receivers','islock'];
            var showArr = [];
            if (ts.currentFlag == 1) {
                showArr = [true,false,true,true,true,true,false,true];
            } else if (ts.currentFlag == 2) {
                showArr = [true,false,true,true,true,true,false,false];
            } else if (ts.currentFlag == 4) {
                showArr = [true,false,true,true,true,false,true,false];
            } else if (ts.currentFlag == 6) {
                showArr = [true,false,true,true,true,true,false,false];
            } else if (ts.currentFlag == 5) {
                showArr = [true,false,false,true,true,true,false,false];
                // titleArr = ['flage','title','content','authorName','publishDate','coverUrl','description','islock','redirectUrl'];
            }
            $.each(titleArr, function (i, title) {
                var tint = showArr[i] ? 'showColumn' : 'hideColumn';
                $("#" + ts.tableId).bootstrapTable(tint, title);
            });
            $("#" + ts.tableId).bootstrapTable('refresh');
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
            // $("#form-div").attr("afficheid", "");
            ts.requestData.afficheId = null
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
            ts.initDate.start = "";
            ts.initDate.end = "";
            ts.beforeSend = null;
            if (qEditor) {
                qEditor.setText('');
            }
        },
        datatable: function () {
            var ts = this;
            // var formatDate = function (date) {
            //     var year = date.getFullYear(), month = date.getMonth() + 1, weekday = date.getDate(),
            //         h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
            //     if (month < 10) {
            //         month = "0" + month;
            //     }
            //     if (weekday < 10) {
            //         weekday = "0" + weekday;
            //     }
            //     if (h < 10) {
            //         h += "0";
            //     }
            //     if (m < 10) {
            //         m += "0";
            //     }
            //     if (s < 10) {
            //         s += "0";
            //     }
            //     return (year + "-" + month + "-" + weekday + " " + h + ":" + m + ":" + s);
            // }
            var operateEvents = {
                'click .edit': function (e, value, row, index) {
                    ts.isFromEdit = true;
                    // $(ts.modals.edit).modal('toggle');
                    $(ts.modals.edit).fadeIn(200);
                    for (var e in row) {
                        if (row.hasOwnProperty(e) && ts.requestData.hasOwnProperty(e)) {
                            ts.requestData[e] = row[e];
                        }
                    }
                    ts.receiverss = row.receivers;
                    var receivesStr = "";
                    $.each(ts.receiverss, function (k, v) {
                        receivesStr += (v.userAccount + ",");
                    });
                    // $("#form-div").attr("afficheId", row.afficheId);
                    ts.requestData.afficheId = row.afficheId

                    var _user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
                    if (!_user) {
                        layer.msg("管理员未登录。");
                        // $(ts.modals.edit).modal('hide');
                        $(ts.modals.edit).fadeOut(500);
                        return false;
                    }
                    
                    // ts.requestData.content = obj2.getData();
                    // if (ts.requestData.flage == 5) {
                    //     obj2.setData(ts.requestData.content);
                    // }
                    // if (ts.requestData.flage == 1 || ts.requestData.flage == 5) {
                    //     // qEditor.setText(ts.requestData.content);
                    // }
                    if (ts.requestData.flage !== 6 && ts.requestData.flage !== 5) {
                        // quill content 赋值
                        // 先把span后面带的br去掉，包含在span里的不用管
                        ts.requestData.content = ts.requestData.content.replace(/\<\/span\>\<br\>/g, '</span>')
                        $(qEditor.root).html(ts.requestData.content);
                    }
                    if (ts.requestData.flage === 5) {
                        // 推广公告
                        // $(extendEditor.root).html(ts.requestData.content);
                        var $edit = $(ts.modals.edit)
                        var $inputLink = $edit.find('input[name=linkUrl]')
                        var $selectLink = $edit.find('select[name=linkUrl]')
                        // 新字段转义
                        if (ts.requestData.linkUrl) {
                            if (ts.requestData.linkUrl.indexOf('customLinkUrl') > -1) {
                                $inputLink.val(wwcFilter(ts.requestData.linkUrl))
                            } else {
                                $selectLink.val(wwcFilter(ts.requestData.linkUrl))
                            }
                        }
                    }
                    
                    ts.requestData['authorName'] = _user.username;
                    ts.requestData['authorId'] = _user.userId;
                    ts.initDate.start = row.publishDate;
                    ts.initDate.end = row.activeTime;
                },
                'click .del': function (e, value, row, index) {
                    var lock = false,
                        dele = layer.confirm('确定删除该条信息？', {
                                  btn : ['确定', '取消'],
                                  closeBtn : 0,
                               }, function (index, layero) {
                                  var data = {'afficheId': row.afficheId};
                                  if(!lock) {
                                      lock = true; // 锁定
                                      request('/manage/system_affiche/delete.do', data, function (result) {
                                          if (result.code == 0) {
                                              layer.msg("删除成功！");
                                              layer.close(index);
                                              $("#" + ts.tableId).bootstrapTable('refresh');
                                          }
                                      });
                                  }
                              }, function (index) {});
                },
                'click .preScan': function (e, value, row, index) {
                    var data = {'afficheId': row.afficheId};
                    request('/manage/system_affiche/get.do', data, function (result) {
                        if (result.code == 0) {
                            $(ts.modals.view).modal('toggle');
                            $(ts.modals.view).find('.modal-body').html('');
                            var viewHtml = '<div class="prediv-div">' + result.data.content + '</div>';
                            $(ts.modals.view).find(".modal-body").append(viewHtml);
                        }
                    });
                },
                'click .forbid': function (e, value, row, index) {
                    var data = row;
                    data.isLoca = 0;
                    data['activeTime'] = data['publishDate'];
                    layer.confirm('确定要禁用该公告吗', {
                        btn : ['确定', '取消'],
                        closeBtn : 0,
                    }, function (index, layero) {
                        layer.load(2);
                        request('/manage/system_affiche/update.do', data, function (result) {
                            layer.close(index);
                            if (result.code == 0) {
                                layer.msg('禁用成功');
                                ts.clearMsg();
                                $("#" + ts.tableId).bootstrapTable('refresh');
                            } else {
                                layer.msg(result.msg);
                            }
                        });
                    }, function (index) {});
                }
            }
            var operateFormatter = function (value, row, index) {
                var arr = [ '<a class="edit" href="javascript:void(0)" style="margin-right:5px;" title="修改">',
                            '<i class="glyphicon glyphicon-pencil"></i>',
                            '修改</a>',
                            '<a class="del" href="javascript:void(0)" style="margin-right:5px;" title="删除">',
                            '<i class="glyphicon glyphicon-remove"></i>',
                            '删除</a>',
                            '<a class="preScan" href="javascript:void(0)" style="margin-right:5px;" title="预览">',
                            '<i class="glyphicon glyphicon-search"></i>',
                            '预览</a>',
                            '<a class="forbid" href="javascript:void(0)" title="禁用">',
                            '<i class="glyphicon glyphicon glyphicon-remove-circle"></i>',
                            '禁用</a>'];
                
                if (vue.currentFlag == 1) {
                    if(row.publishDate == row.activeTime){
                        return arr.splice(0,9).join('');
                    } else {
                        return arr.join('');
                    }
                } else if (vue.currentFlag == 4) {
                    return arr.splice(3,6).join('');
                } else if (vue.currentFlag === 5) {
                    return arr.splice(0,6).join(''); // 不要预览
                } else {
                    return arr.splice(0,9).join('');
                }
            }
            var titleFormatter = function (value, row, index) {
                if (value == undefined) {
                   return '-';
                }
                if (value.length > 10) {
                    var str = value.substring(0,9)+'...';
                    return '<span title="'+value+'">'+str+'</span>';
                } else {
                    return '<span>'+value+'</span>';
                }
            }
            var contentFormatter = function (value, row, index) {
                if (value == undefined) {
                   return '-';
                }
                // if (value.length > 100) {
                //     var str = value.substring(0,99)+'...';
                //     return '<div title="'+value+'">'+str+'</div>';
                // } else {
                //     return '<div>'+value+'</div>';
                // }
                return '<div>' + value + '</div>';
            }
            var operateFlage = function (value, row, index) {
                switch (value) {
                    case 0: return "后台公告";
                    case 1: return "维护公告";
                    case 2: return "普通公告";
                    case 3: return "警告公告";
                    case 4: return "个人消息";
                    // case 5: return "活动公告";
                    case 5: return "推广公告";
                    case 6: return "小喇叭";
                    default: return "公告未定义";
                }
            }
            var receiverFormatter = function (value, row, index) {
                if (row.receivers.length == 0) {
                    return '-';
                }
                var arr = [];
                $.each(row.receivers, function (i, item) {
                    arr.push(item.userAccount);
                });
                return arr.join(', ');
            }
            var operateCheckBox = function (value, row, index) {
                if (row.flage == ts.subType.maintain) {
                    return '<input type="checkbox" class="mgc-switch changeCheckBox" ' + (row.isLoca == 1 ? 'checked' : '') + ' value="" />';
                } else {
                    return "不需要锁定";
                }
            }
            var checkBoxEvent = {
                'click .changeCheckBox': function (e, value, row, index) {
                    var data = {
                        'afficheId': row.afficheId,
                        'title': row.title,
                        'description': row.description,
                        'content': row.content,
                        'flage': row.flage,
                        'authorName': row.authorName,
                        'authorId': row.authorId,
                        'activeTime': row.activeTime,
                        'publishDate': row.publishDate
                    };
                    var _t = $(this);
                    if (_t.prop("checked")) {
                        var confirmWord = "确定锁定手机？";
                    } else {
                        var confirmWord = "确定解锁手机？";
                    }
                    var lock = false; //默认未锁定
                    layer.confirm(confirmWord, {
                        btn: ['确定', '取消'],
                        closeBtn: 0,
                    }, function (index, layero) {
                        var urlstr = '';
                        // 判断是否有discountoffId有值
                        data['isLoca'] = (_t.prop("checked") == true ? 1 : 0);
                        if(!lock) {
                            lock = true; // 锁定
                            request("/manage/system_affiche/update.do", data, function (res) {
                                if (res.code == 0) {
                                    layer.msg("修改成功");
                                    $("#" + ts.tableId).bootstrapTable('refresh');
                                }
                            });
                        }
                        layer.close(index);
                    }, function (index) {
                        if (_t.prop("checked")) {
                            _t.prop("checked", false);
                        } else {
                            _t.prop("checked", true);
                        }
                    });
                }
            }
            var queryParams = function (params) {
              return "{page:" + params.pageNumber + ",flage:" + vue.currentFlag + "}";
            }

            ts.table = Game.Table({
                id: ts.tableId,
                url: '/manage/system_affiche/list.do',
                queryParams: queryParams,
                toolbar: $('#toolbar'),
                columns: [{
                    field: 'flage',
                    title: '公告类型',
                    align: 'center',
                    width: '110',
                    formatter: operateFlage
                }, {
                    field: 'title',
                    title: '标题',
                    width: '120',
                    align: 'center',
                    formatter: titleFormatter
                },{
                    field: 'content',
                    title: '内容',
                    width: '250',
                    align: 'center',
                    formatter: contentFormatter
                }, {
                    field: 'authorName',
                    title: '发布者',
                    width: '100',
                    align: 'center',
                }, {
                    field: 'publishDate',
                    title: '发布时间',
                    width: '175',
                    align: 'center',
                }, {
                    field: 'activeTime',
                    title: '结束时间',
                    width: '175',
                    align: 'center',
                }, {
                    field: 'receivers',
                    title: '接收者',
                    align: 'center',
                    width: '200',
                    formatter: receiverFormatter
                }, {
                    field: 'islock',
                    title: '是否锁定手机',
                    align: 'center',
                    width: '100',
                    events: checkBoxEvent,
                    formatter: operateCheckBox
                }, {
                    title: '操作',
                    align: 'center',
                    width: '200',
                    events: operateEvents,
                    formatter: operateFormatter
                }],
                onLoadSuccess: function (data) {
                    // console.log(data);
                    // if (ts.isLoad) {
                    //     layer.close(ts.isLoad)
                    // }
                    setTimeout(function() {
                        layer.closeAll();
                    }, 1300);
                }
            });
            $("#" + ts.tableId).on('page-change.bs.table', function (e, number, size) {
                $("#" + ts.tableId).bootstrapTable('scrollTo', 0);
            });
        },
        doEditor: function () {
            var ts = this;
            ts.isFromEdit = false;
            var $edit = $(ts.modals.edit)
            var reg = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]|[0-9][1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;


            // 为了回调也能用。抽一下方法。其实很不优雅
            var _doing = function () {
                if (!ts.requestData.authorName) {
                    layer.msg("管理员未登录。");
                    return false;
                }
                var lock = false;
                var sub = layer.confirm("确定提交吗?", {
                    btn: ['确定', '取消'],
                    closeBtn: 0,
                }, function (index, layero) {
                    var urlstr = '',
                        data = {},
                        // _afficheId = $("#form-div").attr("afficheId"),
                        _resMsg = "添加成功",
                        urlstr = '';
                    var _afficheId = ts.requestData.afficheId
                    if (_afficheId == '' || _afficheId == undefined) {
                        urlstr = '/manage/system_affiche/add.do';
                        ts.requestData.afficheId = 0;
                        _resMsg = "添加成功";
                    } else {
                        urlstr = '/manage/system_affiche/update.do';
                        _resMsg = "修改成功";
                    }
                    for (var v in ts.requestData) {
                        if (ts.requestData.hasOwnProperty(v) && ts.requestData[v] != null) {
                            if (v == 'isLoca') {
                                data[v] = (ts.requestData[v] == true ? 1 : 0);
                            } else {
                                data[v] = ts.requestData[v];
                            }
                        }
                    }
                    data['activeTime'] = ts.initDate.end;
                    data['publishDate'] = ts.initDate.start;
                    // // 自定断点，检查提交数据
                    // if (ts.requestData.flage == 5) {
                    //     console.log(data);
                    //     return false;
                    // }
                    if (!lock) {
                        lock = true;
                        request(urlstr, data, function (result) {
                            if (result.code == 0) {
                                layer.msg(_resMsg);
                                ts.clearMsg();
                                // $(ts.modals.edit).modal('hide');
                                $(ts.modals.edit).fadeOut(500);
                                $("#" + ts.tableId).bootstrapTable('refresh');
                            }
                        });
                    }
                }, function (index) {});
            }

            if (ts.requestData.flage == 3 || ts.requestData.flage == 4) {
                this.requestJG(ts);
            } else {
                if ((!ts.initDate.start || trim(ts.initDate.start).length == 0) && (!ts.initDate.end || trim(ts.initDate.end).length == 0)) {
                  	layer.msg('开始时间，结束时间不能为空！');
                    return false;
                }
                if (!reg.test(trim(ts.initDate.start)) || !reg.test(trim(ts.initDate.end))) {
                    layer.msg('请输入正确的时间！');
                    return false;
                }
                if (Date.parse(trim(ts.initDate.start)) > Date.parse(trim(ts.initDate.end))) {
                    layer.msg('开始时间不能大于结束时间！');
                    return false;
                }

                if (ts.requestData.flage !== 6 && ts.requestData.flage !== 5) {
                    // 检查content是否为空
                    if (!trim(qEditor.getText()).length === 0) {
                        layer.msg('活动正文不能为空！');
                        return false;
                    }
                    var _textEditor = $("#quill-editor")
                    _textEditor.find('p,h1,h2,h3,h4,h5,h6,ul,li,ol').each(function () {
                        var _t = $(this)
                        var _align = ''
                        var _caArr = _t.attr('class') ? _t.attr('class').split(' ') : []
                        for (var i = 0; i < _caArr.length; i++) {
                            var item = _caArr[i];
                            var _h = item.match(/ql-align-([^'" ]+)/)
                            if (_h) {
                                _align = _h[1]
                                break
                            }
                        }
                        if (_align) {
                            _t.css({'text-align': _align})
                        }
                    })
                    _textEditor.find('p').each(function () {
                        var _t = $(this)
                        _t.css({'font-size': '14px'})
                    })

                    // 富文本编辑器转换并赋值到content
                    ts.requestData.content = qEditor.deltaToHtml()
                    // 先再p标签后加上<br> 换行
                    ts.requestData.content = ts.requestData.content.replace(/\<\/p\>/g, '</p><br>')
                    // 把p标签全部改成span标签
                    ts.requestData.content = ts.requestData.content.replace(/\<p /g, '<span ').replace(/\<\/p\>/g, '</span>').replace(/\<br ?\>$/, '')
                    
                } else if (ts.requestData.flage === 5) {
                    // 验证推广公告
                    // 检查content是否为空
                    // if (!trim(extendEditor.getText()).length === 0) {
                    //     layer.msg('活动正文不能为空！');
                    //     return false;
                    // }
                    // // 富文本编辑器转换并赋值到content
                    // // 自定义。给标签加上font-size和图片自适应样式
                    // ts.requestData.content = extendEditor.container.firstChild.innerHTML
                    if (!ts.requestData.imageUrl || ts.requestData.imageUrl.length === 0) {
                        alert('推广图片链接不能为空~')
                        return
                    }
                    if (!ts.requestData.imageUrl.match(/(http|https):\/\//)) {
                            alert('请填写正确的跳转链接(带http)')
                            return false
                        }
                    var href = '';
                    var $inputLink = $edit.find('input[name=linkUrl]')
                    var $selectLink = $edit.find('select[name=linkUrl]')
                    var $inputVal = $inputLink.val()
                    var $selectVal = $selectLink.val()
                    if (!$inputVal && !$selectVal) {
                        // alert('跳转页面请选择或自填。');
                        // return false;
                    } else if (trim($inputVal).length > 0 && trim($selectVal).length > 0) {
                        alert('选择跳转和自填跳转只能选一种。');
                        return false;
                    } else if (trim($inputVal).length > 0) {
                        if (!$inputVal.match(/(http|https):\/\//)) {
                            alert('请填写正确的跳转链接(带http)')
                            return false
                        }
                        href = WWCBase + SelfSetLink + $inputVal;
                    } else if (trim($selectVal).length > 0) {
                        href = WWCBase + $selectVal;
                    }
                    /*  */
                    ts.requestData.linkUrl = href;

                    // 验证图片分辨率
                    validImg(ts.requestData.imageUrl, function(status){
                        if (!status) {
                            return
                        }
                        _doing()
                    })
                    // if (!validImg(ts.requestData.imageUrl)) {
                    // }
                    return false
                } else {
                    if (!ts.requestData.content || ts.requestData.content.length == 0) {
                        layer.msg('活动正文不能为空！')
                        return false;
                    }
                }

                // // 推广公告才使用
                // if (ts.requestData.flage == 5 || ts.requestData.flage == 1) {
                // } else if (!ts.requestData.content ||  ts.requestData.content.length == 0) {
                //     layer.msg('活动正文不能为空！');
                //     return false;
                // }
                
                _doing()
            }
        },
        editReceivers: function () {
            var ts = this, sendModal = $(ts.modals.send);
            ts.checkData = '当前无用户';
            ts.checkUser = '';
            sendModal.modal();
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
                } else {
                    ts.checkData  = '查询错误';
                }
            }, function () {
                ts.checkData = '查询错误';
            });
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
        requestJG: function () {
            var ts = this, msg = "", flage = 0;
            if (ts.requestData.afficheId == '' || ts.requestData.afficheId == undefined) {
                urlstr = '/manage/system_affiche/add.do';
                urlst  = '/manage/system_affiche/add_affiche_user.do';
                ts.requestData.afficheId = 0;
                ts.requestData.isLoca = 0;
                msg = "添加成功";
                flage = 0;
            } else {
                urlstr = '/manage/system_affiche/update.do';
                urlst = '/manage/system_affiche/update_affiche_user.do';
                msg = "修改成功";
                flage = 1;
            }
            var data = {};
            for (var v in ts.requestData) {
                if (ts.requestData.hasOwnProperty(v)) {
                    if (ts.requestData[v] != null || ts.requestData[v] != "isLocal" || ts.requestData[v] != "isShow") {
                        data[v] = ts.requestData[v];
                    }
                }
            }
            if (ts.allReceiverStr.length == 0) {
                layer.msg("请选择接收会员");
                return ;
            }
            if(!data.content || data.content.length == 0) {
                layer.msg("请输入正文内容");
                return ;
            }
            if (ts.allReceiverStr && ts.allReceiverStr.length > 0) {
                data.receivers = ts.allReceiverStr.split(',');
            }
            request (urlstr, data, function (res) {
                if (res.code == 0) {
                    var dat = {};
                        dat       = ts.requestAffReceive;
                        dat.affId = res.data;
                        dat.fl    = flage;
                    $.each(ts.allReceivers, function (k, v) {
                        ts.allReceivers[k].systemAfficheId = res.data;
                    })
                    var lis  = JSON.stringify(ts.allReceivers),
                        lis1 = lis.replace(/account/g, "userAccount"),
                        lis2 = lis1.replace(/username/g, "userName"),
                        lis3 = lis2.split(",");
                    dat.lis  = JSON.parse(lis3);
                    request(urlst, dat, function (rest) {
                        if (rest.code == 0) {
                            ts.allReceivers = [];
                            ts.allReceiverStr = '';
                            layer.msg(msg);
                            ts.clearMsg();
                            // $("#editmodel").modal('toggle');
                            $(ts.modals.edit).fadeOut(500);
                            $("#" + ts.tableId).bootstrapTable('refresh');
                        }
                    });
                }
            });
        },
        // 修改一下推广公告
        linkSelectHtml: function () {
            var str = '<select class="link-select form-control" name="linkUrl"><option value="">不选择</option>'
            str += wwcSelects('no-service')
            str += '</select>'
            // console.log(str)
            return str
        }
    }
});
$(function () {
    vue.onLoad();
    
    // quill handler
    var quillLink = function (value) {
        if (value) {
            var _ts = this;
            var href = '';
            var linkHtml = ''+
            '<div id="quillLink" class="quill-link">'+
                '<nav class="quill-menu">'+
                    '<a class="active" href="javascript: void(0);">已选文本</a><a href="javascript: void(0);">新增文本链接</a>'+
                '</nav>'+
                '<div class="quill-box active">'+
                    '<h5 class="link-tips">(先选择文本，再选择跳转；选择跳转和自填链接只能选一种。)</h5>'+
                    '<h4 class="link-title">选择跳转页面</h4>'+
                    '<div class="form-group"><select class="link-select form-control" name="choose">'+
                        '<option value="">不选择</option>'+
                        (vue.requestData.flage == 1 ? wwcSelects('only-service') : wwcSelects('no-service'))+
                    '</select></div>'+
                    '<h4 class="link-title" name="chooseTitle">填写跳转链接</h4>'+
                    '<div>'+
                        '<input class="form-control" type="text" val="" name="direct" placeholder="填写链接" />'+
                    '</div>'+
                '</div>'+
                '<div class="quill-box">'+
                    '<h5 class="link-tips">(在光标处添加链接文本；选择跳转和自填链接只能选一种。)</h5>'+
                    '<div class="form-group"><input class="form-control" type="text" name="words" placeholder="填写文本" /></div>'+
                    '<h4 class="link-title">选择跳转页面</h4>'+
                    '<div class="form-group"><select class="link-select form-control" name="choose">'+
                        '<option value="">不选择</option>'+
                        (vue.requestData.flage == 1 ? wwcSelects('only-service') : wwcSelects('no-service'))+
                    '</select></div>'+
                    '<h4 class="link-title" name="chooseTitle">填写跳转链接</h4>'+
                    '<div>'+
                        '<input class="form-control" type="text" val="" name="direct" placeholder="填写链接" />'+
                    '</div>'+
                '</div>'+
            '</div>';
            var pageInx = layer.confirm(linkHtml, {
                title: '公告跳转链接选择',
                offset: '15%',
                area: ['40%', '380px'],
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                var _qlink = $("#quillLink");
                var _content = _qlink.find('.quill-box.active');
                var _art = '';
                if (_content.find('input[name=words]').length > 0) {
                    var _words = _content.find('input[name=words]');
                    if (trim(_words.val()).length === 0) {
                        alert('新增的文本不能为空。');
                        return false;
                    }
                    // TODO 输入的文本记录进quill里。
                    _art = _words.val();
                }
                // 选择跳转
                var _select = _content.find('select[name=choose]')
                // 自填跳转
                var _direct = _content.find('input[name=direct]')
                var _selectVal = _select.val()
                var _directVal = _direct.val()

                if (!_selectVal && !trim(_directVal)) {
                    alert('跳转页面请选择或自填。');
                    return false;
                } else if (_selectVal !== 'QQService' && _selectVal !== 'thirdService' && (_selectVal !== '' && trim(_directVal).length > 0)) {
                    alert('选择跳转和自填跳转只能选一种。');
                    return false;
                } else if (_selectVal !== '') {
                    if (_selectVal === 'QQService') {
                        // 选择QQ客服之后，根据输入的QQ号进行数据处理
                        if (!_directVal || _directVal.length === 0) {
                            alert('QQ号码不能为空')
                            return false
                        }
                        if (!(/^[1-9][0-9]{4,9}$/.test(_directVal))) {
                            alert('请输入正确的QQ号码。')
                            return false
                        }
                        href = "{QQ:" + _directVal + "}"
                    } else if (_selectVal === 'thirdService') {
                        // 选择三方客服，链接必填
                        if (!_directVal || _directVal.length === 0) {
                            alert('三方客服链接不能为空')
                            return false
                        }
                        href = _directVal
                    } else {
                        href = WWCBase + _selectVal;
                    }
                } else if (trim(_directVal).length > 0) {
                    if (!_directVal.match(/(http|https):\/\//)) {
                        alert('请填写正确的跳转链接(带http)')
                        return
                    }
                    href = WWCBase + SelfSetLink + _directVal;
                }
                // console.log(href);
                if (_content.find('input[name=words]').length > 0) {
                    var _offset = qEditor.selection.savedRange; // 看了半天的api终于找到你
                    // var _delta = qEditor.setText(_art);
                    qEditor.insertText(_offset.index, _art);
                    qEditor.setSelection(_offset.index, _art.length);
                    
                    qEditor.format('link', href);
                } else {
                    qEditor.format('link', href);
                }
                layer.close(index);
            }, function (index) {
                layer.close(index);
            });
            // control
            if (pageInx && $("#quillLink").length > 0) {
                var _quill = $("#quillLink");
                var _nav = _quill.find('nav a');
                var _content = _quill.find('.quill-box');
                // 切换
                _nav.off('click').on('click', function(e) {
                    $(this).addClass('active').siblings('a').removeClass('active');
                    _content.eq($(this).index()).addClass('active').siblings('div').removeClass('active');
                });
                // qq or 三方
                _content.find('select[name=choose]').off('change').on('change', function(e) {
                    var _val = $(this).val()
                    var _title = $(this).parent().parent().find('h4[name=chooseTitle]')
                    if (_val === 'QQService') {
                        _title.text('输入QQ号码')
                    } else if (_val === 'thirdService') {
                        _title.text('输入三方客服链接')
                    } else {
                        _title.text('填写跳转链接')
                    }
                })
            }
            // this.quill.blur();
        } else {
            // this.quill.format('link', false);
            qEditor.format('link', false);
        }
    }

    var quillImg = function (value) {
        if (value) {
            var pic = ''
            var imageHtml = ''
            imageHtml += '<div id="quillImg" class="quill-link">'+
                '<div class="quill-box active">'+
                    '<h4 class="link-title">填写图片链接(图片最好不要超过300*300，超过就自适应)</h4>'+
                    '<div class="form-group">'+
                        '<input class="form-control" type="text" val="" name="imageSrc" placeholder="填写链接" />'+
                    '</div>'+
                    '<div class="btn-group"><button type="button" class="btn btn-info btn-sm" id="previewImg">预览</button></div>'+
                '</div>'+
                '<div style="display: none;" id="hidePic"></div>'+
            '</div>';
            var pageInx = layer.confirm(imageHtml, {
                title: '添加图片',
                offset: '15%',
                area: ['40%', '380px'],
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                var _qlink = $("#quillImg")
                var _content = _qlink.find('.quill-box.active')
                var _src = _content.find('input[name=imageSrc]')
                pic = _src.val()
                // console.log(pic)
                if (!pic || pic.length === 0) {
                    alert('图片链接不能为空。')
                    return
                }
                var _offset = qEditor.selection.savedRange;
                qEditor.insertEmbed(_offset, 'image', pic)
                layer.close(index)
            }, function (index) {
                layer.close(index)
            })

            // preview control
            if (pageInx && $('#quillImg').length > 0) {
                var _quill = $("#quillImg")
                var _content = _quill.find('.quill-box')
                var _preview = $('#previewImg')
                var _hide = $("#hidePic")
                _preview.off('click').on('click', function (e) {
                    var _img = _content.find('input[name=imageSrc]')
                    if (!_img.val()) {
                        alert('图片链接不能为空。')
                        return
                    }
                    _hide.html('<p><img src="'+_img.val()+'" ></p>')
                    var l = layer.load(2)
                    setTimeout(function () {
                        layer.close(l)
                        layer.open({
                            type: 1,
                            title: '图片预览',
                            area: ['auto', 'auto'],
                            shadeClose: true,
                            content: _hide.html()
                        })
                    }, 1000);
                })
            }
        } else {
            qEditor.format('image', false)
        }
    }

    var toolbarOptions = [
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown 'normal', 
        // [{ 'header': [1, 2, 3, 4, 5, false] }], // , 'normal'

        // ['bold', 'italic', 'underline'],        // toggled buttons
        
        // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      
        [ 'link', { 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      
        // ['clean']                                         // remove formatting button
    ];

    // 通用公告
    window.qEditor = new Quill('#quill-editor', {
        // modules: { toolbar: '#edit-toolbar' },
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    });
    // 监听handler事件
    var toolbar = qEditor.getModule('toolbar');
    toolbar.addHandler('link', function (value) {
        quillLink(value);
    });
    toolbar.addHandler('image', function (value) {
        quillImg(value);
    });

    // 推广公告
    // window.extendEditor = new Quill('#quill-extend', {
    //     modules: {
    //         toolbar: [
    //             ['image']
    //         ]
    //     },
    //     theme: 'snow'
    // })
    // // , 'clean'
    // extendEditor.enable(false)
    // var toolbar = extendEditor.getModule('toolbar')
    // toolbar.addHandler('image', function (value) {
    //     // console.log(value)
    //     if (value) {
    //         var pic = ''
    //         var href = ''
    //         var imageHtml = ''+
    //         '<div id="quillImg" class="quill-link">'+
    //             '<div class="quill-box active">'+
    //                 '<h4 class="link-title">填写图片链接</h4>'+
    //                 '<div class="form-group">'+
    //                     '<input class="form-control" type="text" val="" name="imageSrc" placeholder="填写链接" />'+
    //                 '</div>'+
    //                 '<div class="form-group btn-group"><button type="button" class="btn btn-info btn-sm" id="previewImg">预览</button></div>'+
    //                 '<h4 class="link-title">选择跳转页面</h4>'+
    //                 '<div class="form-group"><select class="link-select form-control" name="choose">'+
    //                     '<option value="">不选择</option>'+
    //                     wwcSelects('no-service')+
    //                 '</select></div>'+
    //                 '<h4 class="link-title" name="chooseTitle">填写跳转链接</h4>'+
    //                 '<div>'+
    //                     '<input class="form-control" type="text" val="" name="direct" placeholder="填写链接" />'+
    //                 '</div>'+
    //             '</div>'+
    //             '<div style="display: none;" id="hidePic"></div>'+
    //         '</div>';
    //         var pageInx = layer.confirm(imageHtml, {
    //             title: '添加图片',
    //             offset: '15%',
    //             area: ['40%', '380px'],
    //             btn: ['确定', '取消'] // 按钮
    //         }, function (index) {
    //             var _qlink = $("#quillImg")
    //             var _extend = $("#quill-extend")
    //             var _content = _qlink.find('.quill-box.active')

    //             var _src = _content.find('input[name=imageSrc]')
    //             var _direct = _content.find('input[name=direct]')
    //             var _directVal = _direct.val()
    //             var _select = _content.find('select[name=choose]')
    //             var _selectVal = _select.val()

    //             pic = _src.val()
    //             // console.log(pic)
    //             if (!pic || pic.length === 0) {
    //                 alert('图片链接不能为空。')
    //                 return
    //             }
    //             // 验证图片分辨率
    //             var imgLoad = function (url, callback) {
    //                 var img = new Image()
    //                 img.src = url
    //                 if (img.complete) {
    //                     callback(img.width, img.height)
    //                 } else {
    //                     img.onload = function () {
    //                         callback(img.width, img.height)
    //                         img.onload = null
    //                     }
    //                 }
    //             }
    //             var _valid = true
    //             imgLoad(pic, function(width, height) {
    //                 if (width > 720 || height > 800) {
    //                     alert('上传图片不能超过720*800')
    //                     _valid = false
    //                 }
    //             })
    //             if (!_valid) {
    //                 return
    //             }

    //             // 清楚内容，只留一张图片
    //             extendEditor.deleteText( 0, extendEditor.getLength() )

    //             var _offset = extendEditor.getLength() - 1
    //             extendEditor.insertEmbed(_offset, 'image', pic)

    //             if (!_selectVal && !trim(_directVal)) {
    //                 alert('跳转页面请选择或自填。');
    //                 return false;
    //             } else if (_selectVal !== '' && trim(_directVal).length > 0) {
    //                 alert('选择跳转和自填跳转只能选一种。');
    //                 return false;
    //             } else if (_selectVal !== '') {
    //                 href = WWCBase + _selectVal;
    //             } else if (trim(_directVal).length > 0) {
    //                 // direct
    //                 if (!_directVal.match(/(http|https):\/\//)) {
    //                     alert('请填写正确的跳转链接(带http)')
    //                     return
    //                 }
    //                 href = WWCBase + SelfSetLink + _directVal;
    //             }
    //             extendEditor.setSelection(_offset, _offset + 1)
    //             extendEditor.format('link', href)

    //             _extend.find('img').each(function () {
    //                 $(this).css({'max-width': '100%', 'height': 'auto'})
    //             })
    //             _extend.find('p').each(function () {
    //                 $(this).css({'font-size': '0px', 'margin': '0', 'padding': '0', 'text-align': 'center'})
    //             })

    //             layer.close(index)
    //         }, function (index) {
    //             layer.close(index)
    //         })
    //         // preview control
    //         if (pageInx && $('#quillImg').length > 0) {
    //             var _quill = $("#quillImg")
    //             var _content = _quill.find('.quill-box')
    //             var _preview = $('#previewImg')
    //             var _hide = $("#hidePic")
    //             _preview.off('click').on('click', function (e) {
    //                 var _img = _content.find('input[name=imageSrc]')
    //                 if (!_img.val()) {
    //                     alert('图片链接不能为空。')
    //                     return
    //                 }
    //                 _hide.html('<p><img src="'+_img.val()+'" ></p>')
    //                 var l = layer.load(2)
    //                 setTimeout(function () {
    //                     layer.close(l)
    //                     layer.open({
    //                         type: 1,
    //                         title: '图片预览',
    //                         area: ['auto', 'auto'],
    //                         shadeClose: true,
    //                         content: _hide.html()
    //                     })
    //                 }, 1000);
    //             })
    //         }
    //     } else {
    //         extendEditor.format('image', false)
    //     }
    // })
    // toolbar.addHandler('clean', function (value) {
    //     // console.log('clean ' + value)
    //     extendEditor.deleteText( 0, extendEditor.getLength() )
    // })
    var _preview = $('#previewImg')
    var _hide = $("#hidePic")
    _preview.off('click').on('click', function (e) {
        var _img = $("#editmodel").find('input[name=imageUrl]')
        if (!_img.val()) {
            alert('图片链接不能为空。')
            return
        }
        validImg(_img.val(), function (status) {
            if (!status) {
                return
            }
            _hide.html('<p><img src="'+_img.val()+'" ></p>')
            var l = layer.load(2)
            setTimeout(function () {
                layer.close(l)
                layer.open({
                    type: 1,
                    title: '图片预览',
                    area: ['auto', 'auto'],
                    shadeClose: true,
                    content: _hide.html()
                })
            }, 1000);
        })
        // if ( !validImg( _img.val() ) ) {
        //     return
        // }
    })

    // close
    $("#editmodel").find('button.close, button.btn-close').on('click', function(){
        $("#editmodel").fadeOut(500)
    });
    // qEditor.container.firstChild.innerHTML
    $("#editmodel").off('click').on('click', function(e) {
        $(this).fadeOut(500)
    })
    $("#editmodel").find('.modal-dialog').off('click').on('click', function(e) {
        e.stopPropagation()
    })
});
