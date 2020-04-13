/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-13 17:15:51
 * @LastEditTime: 2019-08-19 19:57:38
 * @LastEditors: Please set LastEditors
 */
var pageConfig = {
    beforePageText: '跳转至',//页数文本框前显示的汉字 
    afterPageText: '页',
    displayMsg: '共{total}条数据',
    loading: '数据正在加载...',
    pageNumber: 1,
    layout: ['list', 'first', 'prev', 'links', 'next', 'last', 'manual'],
    links: 5,
}
var currentPage = { 'pageNumber': 1, 'pageSize': 5 };
var amountConverLogGrid = null;
var bettingLogGrid = null;
// 最大转出金额
var maxMoney = 0;
var isTestUser = false;
var testUserMsg = '';
$(function () {
    // 初始时加载平台数据
    Utils.requestNoTint('changeMoney/getCanUsingList.do', {}, function (resData) {
        console.log(resData)
        if (resData.code === -1) {
            testUserMsg = resData.msg;
            _alert(resData.msg);
            isTestUser = true;
            return;
        }
        var amountList = resData.data;
        if (amountList == null) return;
        var amountLen = amountList.length;
        var optionHtml = '';
        var dlHtml = '';
        // 循环当前获取到的平台信息，将数据填充到界面
        for (var i = 0; i < amountLen; i++) {
            var amount = amountList[i];
            optionHtml += '<option data-money=' + amount.canUsingMoney + ' value="' + amount.platformCode + '" data-name=' + amount.platformName + '>' + amount.platformName + '</option>';
            dlHtml += '<dl>' +
                '<dt>' + amount.platformName + '</dt>' +
                '<dd>' +
                '<div class="menuContent">' +
                '<span data-code=' + amount.platformCode + ' class="money">' + amount.canUsingMoney + '</span>' +
                '<button data-code=' + amount.platformCode + ' class="platRefershBtn"><span>刷新</span></button>' +
                '</div>' +
                '</dd>' +
                '</dl>'
        }
        $('#amountInput').append(optionHtml);
        $('#amountOutput').append(optionHtml);
        $('#platItems').append(dlHtml);
    }, function(err){_alert(err.msg);})
    // tab切换
    $('#top_lab a').click(function () {
        if (isTestUser) {
            _alert(testUserMsg);
            return;
        }
        $('#top_lab a').removeClass('current');
        var index = $(this).index();
        $(this).addClass('current');
        $('#amountContent>div').hide()
        $('#amountContent>div').eq(index).show()
        if (index === 1) {
            if (amountConverLogGrid) {
                amountConverLogGrid.datagrid('reload')
                return;
            };
            amountConverLogGrid = initGridMethodObj._initAmountConverLog();
            amountConverLogGrid.datagrid('getPager').pagination(pageConfig)
        }
        if (index === 2) {
            if (bettingLogGrid) {
                bettingLogGrid.datagrid('reload')
                return;
            };
            var betConfig = {
                beforePageText: '跳转至',//页数文本框前显示的汉字 
                afterPageText: '页',
                displayMsg: '共{total}条数据',
                loading: '数据正在加载...',
                pageNumber: 1,
                layout: ['list', 'first', 'prev', 'links', 'next', 'last', 'manual'],
                links: 5,
                onSelectPage: function (pageNumber, pageSize) {
                    currentPage = { 'pageNumber': pageNumber, 'pageSize': pageSize };
                    bettingLogGrid.datagrid('reload')
                }
            }
            bettingLogGrid = initGridMethodObj._initBettingLog();
            // 更改选择下拉框时重新传递当前分页信息
            bettingLogGrid.datagrid('getPager').pagination(betConfig)
        }
    })
    $('#amountOutput').on('change', function () {
        maxMoney = Math.min($(this).find('option:selected').attr('data-money'), 9999999.99);
    })
    // 提交转换数据
    var queryCoverBtnStuats = false;
    $('#queryCoverBtn').click(function () {
        if (isTestUser) {
            _alert(testUserMsg, { type:"success"});
            return;
        }
        if (queryCoverBtnStuats) return
        var fromPlatVal = $('#amountOutput').val();
        var toPlatVal = $('#amountInput').val();
        var changeMoney = $('#amountVal').val();
        console.log(fromPlatVal, toPlatVal, changeMoney)
        if (fromPlatVal == -1) {
            _alert('请选择转出平台');
            return;
        }
        if (fromPlatVal == 'fanya' || toPlatVal=='fanya') {
            //Number.isInteger(changeMoney) 谷歌支持
            if ((changeMoney % 1 === 0) == false) {
                _alert('泛亚电竞不支持小数转换');
                return
            }
        }
        if (toPlatVal == -1) {
            _alert('请选择转入平台')
            return;
        }
        if (fromPlatVal === toPlatVal) {
            _alert('请选择不同的平台')
            return;
        }
        if (changeMoney <= 0) {
            _alert('请输入要转换的额度金额');
            return;
        }
        maxMoney = Math.min($('#amountOutput option:selected').attr('data-money'), 9999999.99);
        if (changeMoney > maxMoney) {
            if (maxMoney >= 9999999.99) {
                _alert('单次转账额度不能超过1千万')
                return;
            }
        //  // 钱不够的时候提醒客户使用余额宝余额
        //  let index = layer.open({
        //     title:"友情提示！",
        //     content: `<span style="font-size:16px;margin:40px 0">可用余额不足，是否启用余额宝余额？<br/><br/>启用金额：<input placeholder="  请输入启用金额" onfocus='clear1(3)' onblur='show(3)' id='inp3'/><span id='s3' style="color:red"></span></span>`,
        //     btn:['确定','取消'],
        //     area: ['520px','300px'],
        //     yes:function(){
        //         // 请求新的后台接口（直接用转出接口）
        //         let _user = Utils.getStorage("userInfo")
        //         if($('#inp3').val()){
        //          if(!show(3)){return}
        //           layer.close(index)
        //             let params={
        //                 userId:_user.userId,
        //                 amount:$.trim($('#inp3').val())
        //             }
        //             Utils.request('/interest/rate/withdrawal.do',params,function (data) {
        //                 if(data.code==0){
        //                     _alert('启用余额宝余额成功', { type: 'success' })
        //                   window.location.reload()
        //                 }else{_alert(data.msg, {type: 'warning'})}
                          
                        
        //             })
        //         }
        //         else{
        //             $('#s3').text('请输入启用金额')
        //         }
        //       },
        //     btn2:function(){
        //        _alert('超出了平台转出的额度');
        //     }     
        //     })
            
            //  + maxMoney
            return;
        }
        var params = {
            fromPlatformCode: fromPlatVal,
            toPlatformCode: toPlatVal,
            fromPlatformName: $('#amountOutput option:selected').data('name'),
            toPlatformName: $('#amountInput option:selected').data('name'),
            changeMoney: changeMoney
        }
        queryCoverBtnStuats = true;
        $.ajax({
            type: 'post',
            url: '/changeMoney/add.do',
            data: JSON.stringify(params),
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid'));
                xhr.setRequestHeader("client-version", window.clientVersion);
                xhr.setRequestHeader("x-requested-with", window.xWidth);
                var _temporary = Utils.getStorage('temporaryId') || null
                if (_temporary) {
                    xhr.setRequestHeader('temporary-sessionId', _temporary);
                }
                $.messager.progress({
                    title: '提示信息',
                    msg: '加载中...'
                });
            },
            success: function (res) {
                // 提示转换信息
                if (res.code === 0) {
                    _alert(res.msg, function () {
                        // 刷新转换平台额度
                        // res = res.data;
                        // var resultPlat = [{
                        //     code: res.fromPlatformCode,
                        //     money: res.fromCanUsingMoney
                        // }, {
                        //     code: res.toPlatformCode,
                        //     money: res.toCanUsingMoney
                        // }];
                        // var i = resultPlat.length - 1;
                        // while (i >= 0) {
                        //     $('span[data-code=' + resultPlat[i].code + ']').html(resultPlat[i].money);
                        //     $('option[value=' + resultPlat[i].code + ']').attr('data-money', resultPlat[i].money)
                        //     i--;
                        // }
                        window.location.reload()
                    });
                } else {
                    _alert(res.msg);
                }
            },
            complete: function () {
                queryCoverBtnStuats = false;
                $.messager.progress('close');
            }
        })

    })
    $('#sel')
    //平台刷新
    $('#platItems').on('click', '.platRefershBtn', function () {
        var i = 30;
        var _this = $(this);
        _this.attr('disabled', 'disabled');
        _this.find('span').html(--i + 's')
        var currentTimer = setInterval(function () {
            i--;
            _this.find('span').html(i + 's')
            if (i === -1) {
                _this.find('span').html('刷新')
                _this.removeAttr('disabled');
                clearInterval(currentTimer);
                return;
            }
        }, 1000);
        var code = $(this).data('code');
        Utils.requestNoTint('changeMoney/getCanUsing.do', { "platformCode": code }, function (res) {
            if (res.code === 0 && res.data != null)
                $('span[data-code=' + code + ']').html(res.data.canUsingMoney);
        })
    })
    // 当选择转出平台时，将转出输入框中的最大值设置为当前可用金额
    $('#amountOutput').change(function () {
        var money = $(this).find(':selected').data('money');
        $('#amountVal').attr('max', money)
    })
});
// 通用grid配置
var initGrid = {
    rownumbers: false,
    singleSelect: true,
    pagination: true,
    height: 450,
    width: '100%',
    fitColumns: false,//列自适应宽度
    pageNumber: 1,
    pageSize: 5,
    pageList: [5, 10, 20, 50, 100, 150, 200],
    loadMsg: '加载中，请稍候',
    emptyMsg: '无数据',
}
var initGridMethodObj = {
    // 初始化转换记录
    _initAmountConverLog: function () {
        // 此处需要深拷贝initGrid对象
        var copyObj = JSON.parse(JSON.stringify(initGrid))
        //ajax查询奖金派送记录列表
        copyObj.loader = function (param, success, error) {
            ajaxPostServerPage({
                url: '/changeMoney/getList.do',
                pageIndex: param.page - 1,
                pageSize: param.rows
            }, function (res) {
                if (res.code === -1) {
                    _alert(res.msg);
                    return;
                };
                if (res.code !== 0 || res.data == null) return;
                res.rows = res.data && res.data.list || [];
                res.total = res.data.count;
                success(res);
            });
        }
        copyObj.columns = [[
            { field: 'changeTime', title: '时间', width: 260, align: 'center' },
            { field: 'fromPlatformName', title: '游戏平台', width: 230, align: 'center', formatter: platFormatter },
            { field: 'changeMoney', title: '金额', width: 150, align: 'center' },
            {
                field: 'status', title: '状态', width: 146, align: 'center',
                formatter: statusFormatter
            },
        ]]
        return $('#convertable').datagrid(copyObj);
    },
    // 初始化投注记录
    _initBettingLog: function () {
        initGrid.loader = function (param, success, error) {
            ajaxPostServerPage({
                url: '/game/getGameBetRecordWithTotalRows.do',
                offset: param.page,
                count: param.rows
            }, function (res) {
                if (res.code === -1) {
                    _alert(res.msg);
                    return;
                };
                if (res.code !== 0 || res.data == null) return;
                // 获取到的数据及总条数
                res.rows = res.data.recordList || [];
                res.total = res.data.totalRows;
                success(res)
            });
        }
        initGrid.onBeforeLoad = function (param) {
            // 注意，该取值不能小于0
            param.page = Math.max((currentPage.pageNumber - 1) * currentPage.pageSize, 0);
            param.rows = currentPage.pageSize;
        }
        initGrid.columns = [[
            { field: 'gameId', title: '单号', width: 260, align: 'center' },
            { field: 'gameStartTime', title: '时间', width: 150, align: 'center' },
            { field: 'gamePlatformName', title: '游戏平台', width: 210, align: 'center' },
            { field: 'allBet', title: '投注', width: 100, align: 'center' },
            {
                field: 'profit', title: '奖金', width: 146, align: 'center',
            },
        ]]
        return $('#bettingLog').datagrid(initGrid);
    }
}
/**
 * 格式化平台信息
 * @param {number} val 当前val值
 * @param {object} row 当前行中的对象值
 */
function platFormatter(val, row) {
    return row.fromPlatformName + '  →  ' + row.toPlatformName
}
/**
 * 格式化当前转换状态 1|10:处理中 3:失败 100:成功
 * @param {number} val 状态值
 */
function statusFormatter(val) {
    return val === 1 || val === 10 ? '处理中' : val === 3 ? '失败' : val === 100 ? '成功' : '';
}
/**
 * 针对当前grid做次简单数据请求
 * @param {object} params 对象类型，必须包含参数请求地址url
 * @param {function} callback 回调函数，请求成功之后的回调，参数是请求后的返回结果
 */
function ajaxPostServerPage(params, callback) {
    if (Object.prototype.toString.call(params) !== "[object Object]") {
        return 'parmas参数需传递对象类型'
    }
    if (!params.hasOwnProperty('url')) {
        return '请传递请求url';
    }
    var url = params.url;
    delete params.url;
    if (callback && !(callback instanceof Function)) {
        return 'callback需是函数';
    }
    Utils.requestNoTint(url, params, function (res) {
        if (res.code !== 0) return;
        callback(res);
    })
}
