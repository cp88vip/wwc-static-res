/**
 * @ Moda
 */

$(function(){
    // 初始化显示时间
    $("#beginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#endTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#rechargeBeginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#rechargeEndTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#withdrawalBeginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#withdrawalEndTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#tradeBeginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#tradeEndTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
    $("#footBeginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#footEndTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
    $("#gameBeginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#gameEndTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });

    //投注记录，账户明细 默认请求最近三天;充值记录，提款记录 默认请求最近一周
    $("#beginTime").val(Utils.getDistanceFromToday(0)+" 00:00:00");
		$("#endTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
		$("#rechargeBeginTime").val(Utils.getDistanceFromToday(-5)+" 00:00:00");
		$("#rechargeEndTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
		$("#withdrawalBeginTime").val(Utils.getDistanceFromToday(-5)+" 00:00:00");
		$("#withdrawalEndTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
		$("#tradeBeginTime").val(Utils.getDistanceFromToday(0)+" 00:00:00");
		$("#tradeEndTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
    $("#footBeginTime").val(Utils.getDistanceFromToday(0)+" 00:00:00");
    $("#footEndTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
    $("#gameBeginTime").val(Utils.getDistanceFromToday(0)+" 00:00:00");
		$("#gameEndTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");

    //下面方法毋改顺序
    _util.initData();
    _util.init_bet();
    _util.init_getGameType();
    console.log(_util.typeConfig);
});
window._util = {
    typeConfig: [],
    type:'',
    // 分页显示配置
    setDatagridPager: function (str) {
      //获取页面分页对象
      var p = $(str).datagrid('getPager');
      if (p){
             $(p).pagination({
               beforePageText: '第',
               afterPageText: '页 共 {pages} 页',
               displayMsg: '',
               layout: ['list', 'first', 'prev', 'links', 'next', 'last', 'manual'],
             });
       }
    },
    //初始化页面的值 （静态值）
    initData:function()
    {
        //切换 lab
        $("#top_lab>div").bind("click",function(){
            $("#top_lab>div").removeClass("current");
            $(this).addClass("current");
            $(".list_div  .rec_box").css("display","none");
            $("#"+$(this).data("divid")).css("display","block");

            if($(this).data("divid")=="packet_div"){//红包不显示下拉和搜索
            	$(".rec_bt,.recordNum_area").hide()
            }else{
    	        $(".rec_bt,.recordNum_area").show()
            }

            try{
               _util[$(this).data("func")]();
            }catch(e){console.log(e);} 
        });
        // 投注记录tab
        $(".game-type").on("click",".game-list",function(){
          if ($(this).attr("class") === "game-list game-list-curr") return
          $(".game-list").removeClass("game-list-curr");
          $(this).addClass("game-list-curr");
          $(".tab-content").css("display","none");
          if($(this).data("type") === 'lottery') {
            $("#lottery-tab").css("display","block");
            _util.init_bet();
          }else{
            $("#other-tab").css("display","block");
            _util.other_game($(this).data("type"));
            _util.gameTypeSel($(this).data("type"));
            _util.type=$(this).data("type");
          }
      });
        getTypeConfig();
    },
    init_getGameType:function(){
      Utils.request('game/getGameDetailForBet.do',null,function (data) {
        let {data:list} = data;
        let html = '';
        list.forEach((e,index) => {
          index === 0 ? 
          html +=`<div class="game-list game-list-curr" data-type="${e.platformType}">${e.platformName}</div>`:
          html +=`<div class="game-list" data-type="${e.platformType}">${e.platformName}</div>`
        })
        $('.game-type').append(html)
      })
    },
    gameTypeSel:function(type){
      Utils.request('game/getGameDetailForBet.do',null,function (data) {
        let {data:list} = data;
        let li = '';
        list.forEach(e => {
          if(e.platformType === type){
            li +='<option selected="" value="">全部类型</option>'
            e.data.forEach(e => {
              if(!e.enable) return
                li += '<option value="'+e.platformCode+'">'+e.name+'</option>';
            })
            $('#gameTypeSelect').html(li);
          }
        })
        });
    },
    //投注记录 彩票
    init_bet : function(){
      $("#bet_div").css({"display":"block"});
    	$("#recharge_div").css({"display":"none"});
    	$("#withdrawal_div").css({"display":"none"});
    	$("#consume_div").css({"display":"none"});
    	$("#prize_div").css({"display":"none"});
    	$("#trade_div").css({"display":"none"});
      $("#foot_div").css({"display":"none"});
    	//ajax查询投注列表
        buyDatagrid = $('#buyCpGrid').datagrid({
    	    height: 450,
    	    width : '100%',
    	    url: '/front/bet/log_list.do',
    	    method: 'POST',//请求方式
    	    idField: 'orderNO',//主键
    	    striped: true,//行背景交换
    	    fitColumns: false,//列自适应宽度
    	    singleSelect: true,//单选
    	    pagination: true,//显示分页
    	    nowrap: false,//列内容多时自动折至第二行
    	    pageNumber:1,
          pageSize:10,
    	    pageList: [10, 20, 50, 100, 150, 200],
    	    showFooter: true,
          autoRowHeight:false,
          loadMsg:'加载中，请稍候',
          emptyMsg:'无数据',
          queryParams: {lotteryId: parseInt($("#categorySelect").find("option:selected").val()),
                       status: parseInt($("#orderSelect").find("option:selected").val()),
                       needJSON: true ,
                       startTime:$("#beginTime").val(),
                       endTime:$("#endTime").val(),
                       issue:(!Utils.kStringIsEmpty($("#orderIssue").val()))?"":$("#orderIssue").val()
                        },
          rowStyler:function(){return 'height: 40px';} ,
          onBeforeLoad : function(param){
            var rows = param.rows;
            delete param.rows;
            param.pageSize = rows;
          },
          loadFilter: function (data) {
            _util.setDatagridPager("#buyCpGrid");
            if (data.code == 0 && data.data.length != 0) {
                // 算出分页金额
                var list = data.data;totalFee = 0; winFee = 0;
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  totalFee += (item.status == 10 || item.status == 20)?0:item.totalFee;

                  winFee += (item.winFee) ? item.winFee : 0;
                }
                var totalItem = {playId:'',totalFee:totalFee,winFee:winFee};

                list.push(totalItem);
               return {'total':data.total,'rows':list};
            }else {
               return {'total':0,'rows':[]};
            }
          },
    	    columns: [[
    	        { field: 'orderId', title: '订单号', width: 171,align:'center'},
    	        { field: 'lotteryName', title: '彩种名称', width: 75,align:'center'},
    	        { field: 'betTime', title: '投注时间', width:128, align:'center'},
    	        { field: 'issue', title: '期号', width: 63, align:'center'},
    	        { field: 'groupName', title: '玩法名称', width: 90,align:'center'},
    	        { field: 'playId', title: '详情', width: 60,align:'center',formatter:buyNoFormatter},
    	        // { field: 'hiddenValue', title: '隐藏列', hidden:true,align:'center',formatter:valueFormatter},
    	        { field: 'totalFee', title: '投注金额（元）', width: 104,align:'center',formatter:moneyFormatter},
    	        { field: 'winFee', title: '中奖金额（元）', width: 110,align:'center',formatter:winMmoneyFormatter},
    	        { field: 'profit', title: '盈亏', width: 100,align:'center',formatter:profitAndLoss},
              { field: 'status',title: '状态', width: 90,align:'center',formatter:orderStatusFormatter},
    	        { field: 'oper',title: '操作', width: 90,align:'center',formatter:cancelOrderFormatter}
    		]]
    	});

    },
    //投注记录 其他游戏
    other_game: function(type){
      //ajax查询投注列表
      gameTypeTab = $('#gameTypeTab').datagrid({
        height: 450,
        width : '100%',
        url: 'game/getNewAppBettingRecord.do',
        method: 'POST',//请求方式
        idField: 'orderNO',//主键
        striped: true,//行背景交换
        fitColumns: false,//列自适应宽度
        singleSelect: true,//单选
        pagination: true,//显示分页
        nowrap: false,//列内容多时自动折至第二行
        pageNumber:1,
        pageSize:10,
        pageList: [10, 20, 50, 100, 150, 200],
        showFooter: true,
        autoRowHeight:false,
        loadMsg:'加载中，请稍候',
        emptyMsg:'无数据',
        queryParams: {
          needJSON: true ,
          platformCode: $("#gameTypeSelect").find("option:selected").val(),
          start:new Date($("#gameBeginTime").val()).getTime(),
          end:new Date($("#gameEndTime").val()).getTime(),
          platformType:type
        },
        rowStyler:function(){return 'height: 40px';} ,
        onBeforeLoad : function(param){
          param.count = param.rows;
          delete param.rows;
          param.offset = (param.page -1)*param.count;
          delete param.page;
        },
        loadFilter: function (data) {
          _util.setDatagridPager("#gameTypeTab");
          if (data.code == 0 && data.data.length != 0) {
              // 算出分页金额
              var list = data.data;totalFee = 0; winFee = 0;
              for (var i = 0; i < list.length; i++) {
                var item = list[i];
                totalFee += (item.status == 10 || item.status == 20)?0:item.totalFee;
                winFee += (item.winFee) ? item.winFee : 0;
              }
              var totalItem = {playId:'',totalFee:totalFee,winFee:winFee};
              // list.push(totalItem);
             return {'total':data.total,'rows':list};
          }else {
             return {'total':0,'rows':[]};
          }
        },
        columns: [[
          { field: 'orderId', title: '订单号', width: 268,align:'center'},
          { field: 'gameName', title: '游戏名称', width: 90,align:'center'},
          { field: 'betTime', title: '投注时间', width:147, align:'center'},
          { field: 'betFee', title: '投注金额（元）', width: 125,align:'center'},
          { field: 'newWinFee', title: '中奖金额（元）', width: 123,align:'center',formatter:gameWinning},
          { field: 'winFee', title: '盈亏', width: 140,align:'center',formatter:gameProfitAndLoss},
          { field: 'stautsStr',title: '状态', width: 100,align:'center'}
      ]]
    });
    },
    //足彩记录
    init_foot : function(){
      $("#bet_foot").css({"display":"block"});
      $("#bet_div").css({"display":"none"});
    	$("#recharge_div").css({"display":"none"});
    	$("#withdrawal_div").css({"display":"none"});
    	$("#consume_div").css({"display":"none"});
    	$("#prize_div").css({"display":"none"});
    	$("#trade_div").css({"display":"none"});

    	//ajax查询投注列表
        buyDatagrid = $('#footCpGrid').datagrid({
    	    height: 450,
    	    width : '100%',
    	    url: '/front/bet/log_list.do',
    	    method: 'POST',//请求方式
    	    idField: 'orderNO',//主键
    	    striped: true,//行背景交换
    	    fitColumns: false,//列自适应宽度
    	    singleSelect: true,//单选
    	    pagination: true,//显示分页
    	    nowrap: false,//列内容多时自动折至第二行
    	    pageNumber:1,
          pageSize:10,
    	    pageList: [10, 20, 50, 100, 150, 200],
    	    showFooter: true,
          autoRowHeight:false,
          loadMsg:'加载中，请稍候',
          emptyMsg:'无数据',
          queryParams: {lotteryId: 100001,
                       status: parseInt($("#footOrderSelect").find("option:selected").val()),
                       needJSON: true ,
                       startTime:$("#footBeginTime").val(),
                       endTime:$("#footEndTime").val()
                       // orderId:(!Utils.kStringIsEmpty($("#footOrderId").val()))?"":$("#footOrderId").val()
                        },
          rowStyler:function(){return 'height: 40px';} ,
          onBeforeLoad : function(param){
            var rows = param.rows;
            delete param.rows;
            param.pageSize = rows;
          },
          loadFilter: function (data) {
            _util.setDatagridPager("#footCpGrid");
            if (data.code == 0 && data.data.length != 0) {
                // 算出分页金额
                var list = data.data;totalFee = 0; winFee = 0;
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  totalFee += (item.status == 10 || item.status == 20)?0:item.totalFee;
                  winFee += (item.winFee) ? item.winFee : 0;
                }
                var totalItem = {playId:'',totalFee:totalFee,winFee:winFee};
                list.push(totalItem);
               return {'total':data.total,'rows':list};
            }else {
               return {'total':0,'rows':[]};
            }
          },
    	    columns: [[
    	        { field: 'orderId', title: '订单号', width: 190,align:'center'},
    	        { field: 'lotteryName', title: '彩种名称', width: 90,align:'center'},
    	        { field: 'betTime', title: '投注时间', width:140, align:'center'},
    	        { field: 'content', title: '玩法名称', width: 90,align:'center'},
    	        { field: 'playId', title: '详情', width: 60,align:'center',formatter:buyNoFormatter},
    	        { field: 'totalFee', title: '投注金额（元）', width: 110,align:'center',formatter:moneyFormatter},
    	        { field: 'winFee', title: '中奖金额（元）', width: 110,align:'center',formatter:winMmoneyFormatter},
              { field: 'status',title: '状态', width: 90,align:'center',formatter:orderStatusFormatter},
    	        { field: 'oper',title: '操作', width: 90,align:'center',formatter:ticketOrderFormatter}
    		]]
    	});
    },
    //充值记录
    init_recharge : function()
    {

        if (isSw) {
           _alert('试玩环境下不能进行此操作!');
          return;
       }

        //ajax查询充值记录列表
        var rechargeGrid = $('#rechargeGrid').datagrid({
    	    height: 450,
    	    width : '100%',
    	    url: '/capital/manage/recharge_log_list.do',
    	    method: 'POST',//请求方式
    	    idField: 'id',//主键
    	    striped: true,//行背景交换
    	    fitColumns: false,//列自适应宽度
    	    singleSelect: true,//单选
    	    pagination: true,//显示分页
    	    nowrap: false,//列内容多时自动折至第二行
    	    pageNumber:1,
            pageSize:10,
    	    pageList: [10, 20, 50, 100, 150, 200],
    	    showFooter: true,
          loadMsg:'加载中，请稍候',
          emptyMsg:'无数据',
          queryParams: { status: parseInt($("#rechargeSelect").val()),
                         needJSON: true ,
                        startTime:$("#rechargeBeginTime").val(),
                        endTime:$("#rechargeEndTime").val()},
          rowStyler:function(){return 'height: 40px';} ,
          onBeforeLoad : function(param){
            var rows = param.rows;
            delete param.rows;
            param.pageSize = rows;
          },
          loadFilter: function (data) {
            _util.setDatagridPager("#rechargeGrid");
            if (data.code == 0 && data.data.length != 0) {
              // 算出分页金额
              var list = data.data;amount = 0;
              for (var i = 0; i < list.length; i++) {
                var item = list[i];
                amount += item.amount;
              }
              var totalItem = {orderId:'',paymentPlatform:'小计',amount:amount.toFixed(3)};
              list.push(totalItem);
             return {'total':data.total,'rows':list};
            }else {
               return {'total':0,'rows':[]};
            }
          },
    	    columns: [[
    	        { field: 'orderId', title: '订单号', width: 190,align:'center'},
    	        { field: 'applyTime', title: '申请时间', width: 160,align:'center'},
    	        { field: 'depositor', title: '付款人姓名', width:100,align:'center'},
    	        { field: 'paymentPlatform', title: '支付类型', width: 140,align:'center'},
    	        { field: 'amount', title: '充值金额', width: 134,align:'center',formatter:moneyFormatter},
    	        { field: 'status', title: '充值状态', width: 110,align:'center',formatter:rechargeStatusCodeFormatter},
              { field: 'processedTime', title: '处理时间', width: 150,align:'center'},
    	        { field: 'remark', title: '备注', width: 150,align:'center'}
    		]]
    	});
    },
    //提款记录
    init_withdrawal:function()
    {
      if (isSw) {
         _alert('试玩环境下不能进行此操作!');
        return;
      }
        //ajax查询提款记录列表
        var withdrawalGrid = $('#withdrawalGrid').datagrid({
    	    height: 450,
    	    width : '100%',
    	    url: '/capital/manage/withdrawal_log_list.do',
    	    method: 'POST',//请求方式
    	    idField: 'id',//主键
    	    striped: true,//行背景交换
    	    fitColumns: false,//列自适应宽度
    	    singleSelect: true,//单选
    	    pagination: true,//显示分页
    	    nowrap: false,//列内容多时自动折至第二行
    	    pageNumber:1,
            pageSize:10,
    	    pageList: [10, 20, 50, 100, 150, 200],
    	    showFooter: true,
          loadMsg:'加载中，请稍候',
          emptyMsg:'无数据',
          queryParams: { status: parseInt($("#withdrawalSelect").val()),
                        needJSON: true,
                        startTime:$("#withdrawalBeginTime").val(),
                        endTime:$("#withdrawalEndTime").val() },
          rowStyler:function(){return 'height: 40px';},
          onBeforeLoad : function(param){
            var rows = param.rows;
            delete param.rows;
            param.pageSize = rows;
          },
          loadFilter: function (data) {
            _util.setDatagridPager("#withdrawalGrid");
            if (data.code == 0 && data.data.length != 0) {
              // 算出分页金额
              var list = data.data;amount = 0;
              for (var i = 0; i < list.length; i++) {
                var item = list[i];
                amount += item.amount;
              }
              var totalItem = {applyTime:'小计',amount:amount};
              list.push(totalItem);
             return {'total':data.total,'rows':list};
            }else {
               return {'total':0,'rows':[]};
            }
          },
    	    columns: [[
    	        { field: 'orderId', title: '订单号', width:190,align:'center'},
    	        { field: 'applyTime', title: '申请时间', width: 150,align:'center'},
    	        { field: 'amount', title: '提款金额（元）', width: 120,align:'center',formatter:moneyFormatter},
              { field: 'payee', title: '收款人', width: 120,align:'center'},
    	        { field: 'bank', title: '收款银行', width: 154,align:'center'},
    	        { field: 'collectionAccount', title: '收款账号', width: 100,align:'center',formatter:bankFormatter},
    	        { field: 'status', title: '状态', width: 100,align:'center',formatter:tipStatusCodeFormatter},
              { field: 'processedTime', title: '处理时间', width: 150,align:'center'},
    	        { field: 'remark', title: '备注', width: 150,align:'center'},
    		]]
    	});

    },

    //账户明细
    init_trade:function(){
    	//ajax查询奖金派送记录列表
        var prizeGrid = $('#tradeGrid').datagrid({
    	    height: 450,
    	    width : '100%',
    	    url: '/capital/manage/change_log.do',
    	    method: 'POST',//请求方式
    	    idField: 'id',//主键
    	    striped: true,//行背景交换
    	    fitColumns: false,//列自适应宽度
    	    singleSelect: true,//单选
    	    pagination: true,//显示分页
    	    nowrap: false,//列内容多时自动折至第二行
    	    pageNumber:1,
            pageSize:10,
    	    pageList: [10, 20, 50, 100, 150, 200],
    	    showFooter: true,
          loadMsg:'加载中，请稍候',
          emptyMsg:'无数据',
          queryParams: { 
            needJSON: true,
            startTime:$("#tradeBeginTime").val(),
            endTime:$("#tradeEndTime").val(),
            type:$("#accountType").find("option:selected").val() 
          },
          rowStyler:function(){return 'height: 40px';},
          onBeforeLoad : function(param){
            var rows = param.rows;
            delete param.rows;
            param.pageSize = rows;
          },
          loadFilter: function (data) {
            _util.setDatagridPager("#tradeGrid");
            if (data.code == 0 && data.data.length != 0) {
              // 算出分页金额
              var list = data.data;;variableAmount = 0;
              for (var i = 0; i < list.length; i++) {
                var item = list[i];
                variableAmount += item.variableAmount;
              }
              var totalItem = {afterAmount:'小计',variableAmount:variableAmount};
              list.push(totalItem);
             return {'total':data.total,'rows':list};
            }else {
               return {'total':0,'rows':[]};
            }
          },
    	    columns: [[
    	        { field: 'orderId', title: '订单号',width:181,align:'center'},
    	        { field: 'changedTime', title: '时间', width: 130,align:'center'},
    	        { field: 'beforeAmount', title: '账前金额（元）', width:130,align:'center',formatter:moneyFormatter},
              { field: 'afterAmount', title: '账后金额（元）', width: 130,align:'center',formatter:moneyFormatter},
    	        { field: 'variableAmount', title: '收支情况（元）', width: 130,align:'center',formatter:payInFormatter},
              { field: 'type', title: '类型', width: 75,align:'center',formatter:tradeTypeFormatter},
              { field: 'remark', title: '备注', width: 308,align:'center'}
    		]]
    	});
    }
};


/**
 * 给投注号码增加样式
 * @param value
 * @param row
 * @param index
 * @returns {String}
 */
function buyNoFormatter(value,row,index){
  if (value == '') {
    return '<span>小计</span>';
  }
  if (row.lotteryId == 100001) {
    return '<a href="#" onclick="showFootDetail(this)" style="color:blue;" orderId="'+row.orderId +'">查看</a>';
  }
  return '<a href="#" onclick="showDetail(this)" style="color:blue;">查看</a>';
}

/**
 * 订单状态
 */
function orderStatusFormatter(value,row,index) {
  if (value == 1) {
		return "待开奖";
	}else if(value==2){
		return "未中奖";
	}else if(value==3){
		return "已中奖";
	}else if(value==4){
		return "和局";
	}else if(value==10){
		return "已撤单";
	}else if(value==20){
		return "已撤单";
	}else if(value==30){
		return "追加中";
	}else if(value==99){
		return "订单异常";
	}else {
		return "";
	}
}
/**
 * 撤单操作
 */
function cancelOrderFormatter(value,row,index) {
  if (row.status == 1) {
    return '<a href="#" onclick="cancelOrder(this)" style="color:#fff;background:#f00;width:50px;height:35px;padding:3px 5px 3px 5px;">撤单</a>';
  }
  if (row.status == 3) {
    return '<a href="#" onclick="flauntPacket(this)" style="color:#fff;background:#f00;width:50px;height:35px;padding:3px 5px 3px 5px;">炫耀一下</a>';
  }
}
/**
 * 盈亏
 */
function profitAndLoss(value,row,index){
  let count;
  if (row.status == 3 || row.status == 2) {
    count = row.winFee - row.totalFee;
    if (count <= 0) {
      return '<span style="color:#fff;"> '+count+' </span>';
    }else {
      return '<span style="color:#f00;"> +'+count.toFixed(3)+'</span>';
    }
  }
}
/**
 * 炫耀红包
 */
function flauntPacket(c) {
  var selectRow = $('#buyCpGrid').data().datagrid.data.rows[c.parentNode.parentNode.parentNode.rowIndex];
  var msg = "<h2>点击选择发炫耀红包的房间</h2>";
  var centerStyle = "text-align:center;";
  var centerStyle2 = "text-align:center;cursor:pointer;";
  var roomId = '';
  var enableChat = true;
  var msg1 = "<h2>发炫耀红包</h2>";
  var theme = selectRow.lotteryName + '第' + selectRow.issue + '期中奖' + selectRow.winFee + '元';
  window.total = 0;
  window.number = 0;
  window.totalFn = function (element) {
    total = element.value;
  }
  window.numberFn = function (element) {
    number = element.value;
  }
  msg1 += '<div class="data"><table border=0 cellspacing=0 cellpadding=0 width=100%><tr class=hid><td width=150 style="' + centerStyle + '">总金额</td><td width=150 style="' + centerStyle + '"><input type="text" placeholder="请输入红包金额" id="redpacketamount" onchange="totalFn(this)"></input></td></tr>';
  msg1 += '<tr class=hid><td width=150 style="' + centerStyle + '">红包个数</td><td width=150 style="' + centerStyle + '"><input type="text" placeholder="请输入红包个数" id="redpacketnumber" onchange="numberFn(this)"></input></td></tr>'
  msg1 += "</table></div>";
  $.ajax({
    type: 'GET',
    url: (__entire.chatHttp || '') + '/room/list/' + Utils.getStorage('accessToken'),
    // url: $.lt_ajaxurl,
    timeout: 10000,
    dataType: 'JSON',
    // data: localStorage.getItem('accessToken'),
    contentType:'application/json',
    beforeSend : function(xhr) {
        xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid')),
        xhr.setRequestHeader("client-version", window.clientVersion),
        xhr.setRequestHeader("x-requested-with",window.xWidth)
        var _temporary = Utils.getStorage('temporaryId') || null
        if (_temporary) {
            xhr.setRequestHeader('temporary-sessionId', _temporary);
        }
    },
    success: function (data) {
      if (data.code == 0) {
        msg += '<div class="data"><table border=0 cellspacing=0 cellpadding=0 width=100%><tr class=hid><td width=150 style="' + centerStyle + '">房间名称</td></tr>', $.each(data.data, function (i, _item) {
          msg += "<tr><td class='roomclass' data-roomId='"+_item.roomId+"' data-enableChat='"+_item.enableChat+"' style=" + centerStyle2 + ">" + _item.name + "</td><tr>"
        }), msg += "</table></div>";
          $.confirm(msg, function () {
            if (enableChat == 'true') {
              $.confirm(msg1, function () {
                if (!/^\d+(?:\.\d{1,2})?$/.test(total)) {
                  _alert('红包请输入数字且只能保留两位小数');
                  return;
                }
                if (parseInt(number) != number) {
                  _alert('红包个数只能输入整数');
                  return;
                }
                if (total<2 || total>1000) {
                  _alert('红包金额范围应在2~1000之间');
                  return;
                }
                if (total > Utils.getStorage('userInfo').balance) {
                  // JSON.parse(localStorage.getItem('userInfo')).balance
                  _alert('红包金额超过可用余额，请先充值');
                  return;
                }
                if (number < 1) {
                  _alert('红包个数最低为1个');
                  return;
                }
                goFlauntPacket(roomId,total,number,theme)
              }, function () {
              }, "", 700, !0)
            } else {
              _alert("该聊天室已禁言，禁止发炫耀红包！");
              return
            }

          }, function () {
          }, "", 700, !0)
      //        $("#JS_blockPage .table").html( txtHtml );
      // $("#JS_blockPage").css( "display","block" );
      // $("#block_draghandler").text("注单详情");
          $('.roomclass').on('click',function(){
            $('.roomclass').removeClass('roomback');
            $(this).addClass('roomback');
            roomId = $(this).attr('data-roomId');
            enableChat = $(this).attr('data-enableChat');
          })
      } else if (data.code == 1312) {
        _alert("炫耀红包依赖聊天室，请在聊天室登录后再操作！");
        return
      } else {
        if (data.msg) {
          _alert(data.msg);
          return
        } else {
          _alert("炫耀红包依赖聊天室，请在聊天室登录后再操作！");
          return
        }
      }
    },
    error: function () {
      _alert('系统超时');
      return false;
    }
  });

}
function goFlauntPacket(roomId,total,number,theme) {
      var _openid = Utils.getStorage('openid')
      var message = "恭喜发财，大吉大利！";
      var type = "flauntRedPacket";
      let sendData = {
        roomId: roomId,
        amount: total,
        number: number,
        detailMsg: message,
        headMsg: theme,
        sendOpenId: _openid,
        type: 7
      }
      $.ajax({
        type: 'POST',
        url: __entire.chatHttp + '/redPacket/send',
        timeout: 10000,
        dataType: 'JSON',
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        beforeSend : function(xhr) {
            xhr.setRequestHeader('sessionid', Utils.getStorage('sessionid')),
            xhr.setRequestHeader('openId', Utils.getStorage('openid')),
            xhr.setRequestHeader("client-version", window.clientVersion),
            xhr.setRequestHeader("x-requested-with",window.xWidth)
            var _temporary = Utils.getStorage('temporaryId') || null
            if (_temporary) {
                xhr.setRequestHeader('temporary-sessionId', _temporary);
            }
        },
        success: function (data) {
          if (data.data.code == 0) {
            _alert('炫耀成功！');
          } else {
            if (data.data.msg) {
              _alert(data.data.msg);
              return
            } else {
              _alert("炫耀红包依赖聊天室，请在聊天室登录后再操作！");
              return
            }
          }
        },
        error: function () {
          _alert('系统超时');
          return false;
        }
    })

}
/**
 * 出票明细
 */
function ticketOrderFormatter(value,row,index) {
    if (row.playId == '') {
        return '';
    }
    return '<a href="#" onclick="ticketOrder(this)" style="color:#fff;background:#f00;width:50px;height:35px;padding:3px 5px 3px 5px;" orderId="'+row.orderId+'" status="'+row.status +'" betTime="'+row.betTime+'" winFee="'+row.winFee +'">出票明细</a>';

}

/**
 * 收支类型转换
 * @param value
 * @param row
 * @param index
 * @returns
 */
function payInFormatter(value,row,index){

  if (value <= 0) {
    return '<span> '+value.toFixed(3) + ' </span>';
  }else {
    return '<span style="color:#f00;"> +'+value.toFixed(3) +'</span>';
  }
}

/**
 * 金钱转换
 */
function moneyFormatter(value,row,index) {
  if (value == '小计') {
    return value;
  }
  if (value == undefined) {
    return '';
  }
  return value;
}

/**
 * 中奖金额显示
 */
function winMmoneyFormatter(value,row,index) {
  if (row.status == 3) {
    if (value <= 0) {
      return '<span style="color:#fff;"> '+value.toFixed(3)+' </span>';
    }else {
      return '<span style="color:#f00;"> +'+value.toFixed(3)+'</span>';
    }
  }else if(row.status == 2){
      return '<span style="color:#fff;">0.000</span>';
  } else {
    return '<span style="color:#fff;"></span>';
  }
}

/**
 * 交易类型转换
 * @param value
 * @param row
 * @param index
 */
function tradeTypeFormatter(value,row,index){
  console.log('ok',value)
  for (var i = 0; i < _util.typeConfig.length; i++) {
    for (var key in _util.typeConfig[i]) {
      if (value == key) {
        
        return _util.typeConfig[i][key]
      }
    }
  }
  /*
	if (value == 1) {
		return "充值";
	}else if(value==2){
		return "提现";
	}else if(value==3){
		return "购彩";
	}else if(value==4){
		return "中奖";
	}else if(value==5){
		return "返水";
	}else if(value==6){
		return "返点";
	}else if(value==7){
		return "手动加款";
	}else if(value==8){
		return "手动减款";
	}else if(value==9){
		return "充值赠送";
	}else if(value==10){
		return "注册赠送";
	}else if(value==11){
		return "撤销";
	}else if(value==12){
		return "订单回滚";
	}else if(value==13){
    return "红包";
  }else if(value==20){
		return "代理返现";
	}else if(value==21){
    return "VIP晋级";
  }else if(value==22){
    return "红包支出";
  }else if(value==23){
    return "红包收入";
  }else if(value==24){
    return "红包退回";
  }else {
		return value;
  }
  */
}

/**
 * 银行卡号显示
 * @type {[type]}
 */
function bankFormatter(value,row,index) {
  if (value) {
    var valueStr = value + "";
    return valueStr.substr(0,4)+"***"+valueStr.substr(-4);
  }
  return '';

}

/**
 * 交易状态转换
 * @param value
 * @param row
 * @param index
 */
function tipStatusCodeFormatter(value,row,index){
	if (value == 0) {
		return "等待处理";
	}else if(value==1){
		return "处理中";
	}else if(value==2){
		return "提款成功";
	}else if(value==3){
		return "提款失败";
	}else {
		return value;
	}
}
function rechargeStatusCodeFormatter(value,row,index){
	if (value == 0) {
		return "等待处理";
	}else if(value==1){
		return "处理中";
	}else if(value==2){
		return "充值成功";
	}else if(value==3){
		return "充值失败";
	}else {
		return value;
	}
}

/**
 * 展示明细
 */
function showDetail(c){

	_common.util.dialogUi();
	var selectRow = $('#buyCpGrid').data().datagrid.data.rows[c.parentNode.parentNode.parentNode.rowIndex];
  Utils.request('front/bet/log_detail.do',{'orderId':selectRow.oid},function (data) {
      if (data.code != 0) {
          _alert(data.msg);
          return ;
      }
      selectRow = data.data;

      $("#JS_blockPage").addClass("big");
      var txtHtml = '<h4>订单号：' + selectRow.orderId + '-'+selectRow.subId+'</h4>'
          + '<div class="data data-order">'
          + '<table border=0 cellspacing=0 cellpadding=0 width=100% heigth="800px">'
          + '<tr class=hid>'
          + '<td class=\"shortWidth\">彩种：</td>'
          + '<td width=100>' + selectRow.lotteryName + '</td>'
          + '<td class=\"shortWidth\">期数：</td>'
          + '<td width=100>第' + selectRow.issue + '期</td></tr>'
          + '<tr class=hid><td class=\"shortWidth\">开奖号码：</td>'
          + '<td width=100>' + openStatusFormatter(selectRow.luckNumber) + '</td>'
          + '<td class=\"shortWidth\">状态：</td>';

          if (selectRow.status == 3) {
        		txtHtml += '<td width=100>中奖金额: '+ selectRow.winFee +'元</td></tr>';
        	} else {
        		txtHtml += '<td width=100>' + orderTypeFormatter(selectRow.status) + '</td></tr>';
          }
          // console.log(selectRow);
          // console.log(selectRow.prize);
          txtHtml+= '<tr class=hid><td class=\"shortWidth\">开奖时间：</td>'
          + '<td width=100>' + Utils.kStringIsEmpty(selectRow.drawTime) + '</td>'
          + '<td class=\"shortWidth\">投注金额：</td>'
          + '<td width=100>' + Utils.toDecimal2(selectRow.totalFee) + '元</td></tr>'
          + '<tr class=hid>'
          + '<td class=\"shortWidth\">投注注数：</td>'
          + '<td width=100>' + selectRow.count + '</td>'
          + '<td class=\"shortWidth\">投注返点：</td>'
          + '<td width=100 id="dia_win">' + Utils.kStringIsEmpty(selectRow.rebate) + '</td></tr>'
          + '<tr class=hid><td class=\"shortWidth\">返点金额：</td>'
          + '<td width=100>' + Utils.toDecimal2(selectRow.rebateFee) + '元</td>'
          + '<td class=\"shortWidth\">投注赔率：</td>'
          + '<td colspan=3>' + selectRow.prize + '</td></tr>'
          + '<tr class=hid><td class=\"shortWidth\">投注时间：</td>'
          + '<td width=140>' + selectRow.betTime + '</td>'
          + '<td class=\"shortWidth\">玩法名称 ：</td>'
          + '<td width=100>' + selectRow.groupName + ' - '+ selectRow.playName +'</td></tr>'
          + '<tr class=hid><td class=\"shortWidth\">投注号码：</td>';

      $("#JS_blockPage .table").html( txtHtml );
      $("#JS_blockPage").css( "display","block" );
      $("#block_draghandler").text("注单详情");

      // 投注号码列表头部
      orderDetailListHead(selectRow.issue);
      // 投注号码列表
      orderDetailList(selectRow.oid,1,selectRow.status);
  });
}

// 显示投注号码列表头部
function orderDetailListHead(issue) {
  //头部
  var head = '<table border="0" cellspacing="0" cellpadding="0" width="100%" heigth="800px" class="orderlist">'+
                '<thead>'+
                    '<tr class="hid">'+
                        '<td class="orderList-head" id="head-lotteryIssue" issue="'+issue+'">期号</td>'+
                        '<td class="orderList-head">投注记录</td>'+
                        '<td class="orderList-head">投注金额</td>'+
                        '<td class="orderList-head">中奖情况</td>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
              '</table>';
  // 使用分页
  var page = '<div class="page_lay">'+
              '<div class="tip_page" style="display: none;">加载中请稍后</div>'+
              '<div class="page_outer">'+
                '<div class="allPageNum" style="display: block;"></div>'+
                '<div class="page" data-pageindex="1" style="padding-left:200px;">'+
                '</div>'+
              '</div>'+
            '</div>';

  $('.data-order').append(head+page);
}

// 显示投注号码列表
function orderDetailList(oid,page,winState) {

  $(".data-order  .tip_page").css("display", "block");
  $(".data-order  .tip_page").text("加载中请稍后");

  var issue = $('#head-lotteryIssue').attr('issue');
  //请求列表
  var data = {'orderId':oid,
              'page':page};
  Utils.request('front/bet/log_detail_list.do',data,function(result){
    if (result.code != '0') {
      _alert(result.msg);
      return ;
    }

    $(".data-order .page").data("pageindex",page ); //将当前页码保存于页面中
    emptyPageStyle( false );

    if (result.data.length == 0) {
      return;
    }
    if( 1 == page ||  "1" == page) {  //如果是新的查询，则初始化 分页div的样式
        pageDiv( parseInt(result.total/20)+1, result.total,oid,winState);
    }


    var htmlStr = '';
    for (var i = 0; i < result.data.length; i++) {
      var e = result.data[i];
      // console.log(e);
      var tint = Utils.kStringIsEmpty(e.log);
      var subTint = Utils.toDecimal2(e.fee/100);
      var status = '';
      var statusColor = '';
      if (winState == 10 || winState == 20 ) {
          status = "已撤单";
          statusColor = 'text-red';
      } else if (winState == 1) {
          status = "待开奖";
          statusColor = 'text-black';
      } else {
          if (typeof(e.win) == 'undefined') {
              status = "未中奖";
              statusColor = 'text-black';
          }else{
              // console.log(status)
              status = '中'+ e.win+'元';
              statusColor = 'text-red';
          }
      }
      htmlStr += '<tr  class="hid">'+
                  '<td class="orderList-list">'+issue+'</td>'+
                  '<td class="orderList-list">'+tint+'</td>'+
                  '<td class="orderList-list">'+subTint+'</td>'+
                  '<td class="orderList-list list-status '+statusColor+'">'+status+'</td>'+
                '</tr>';
    }
    $(".data-order .orderlist tbody").html(htmlStr);

  },function () {
    emptyPageStyle(true);
  });
}

/**
 * 检查列表是否为空
 */
function emptyPageStyle(isEmpty) {
  if( isEmpty )
  {
      $(".data-order .allPageNum").css("display","none");
      $(".data-order .tip_page").css("display","block");
  }
  else
  {
      $(".data-order .allPageNum").css("display","block");
      $(".data-order .tip_page").css("display","none");
  }
}

/**
 * 初始化 分页 div的样式
 */
function pageDiv(pageNum , PageAllRecordCount,oid,winState) {
  if( pageNum > 1 ){
      laypage({
          cont: $(".data-order .page"), //容器。值支持id名、原生dom对象，jquery对象,
          pages:pageNum , //总页数
          skip: false, //是否开启跳页
          skin: '#AF0000',
          groups: 4, //连续显示分页数
          layout:['prev', 'page', 'next'],
          jump: function(obj, first){ //触发分页后的回调
              if(!first){
                  if( $(".data-order .page").data("pageindex") == obj.curr )
                  { // 无需重复查询当前页的数据
                      return;
                  }
                  orderDetailList(oid,obj.curr,winState);
              }
          }
      });
      $(".data-order .allPageNum").html("（共"+pageNum+"页）");
  }

}

// 足球订单详情展示
function showFootDetail(c) {
  var index = c.parentNode.parentNode.parentNode.rowIndex;
  var selectRow = $('#buyCpGrid').data().datagrid.data.rows[index];
  var orderId = $(c).attr("orderId");
  SorcOrderPop.showOrderDetails(orderId,600,400);
}

/**
 * 开奖状态
 */
function openStatusFormatter(value) {
  if (value == undefined || value == null) {
    return "待开奖";
  }else {
    return value;
  }
}

/**
 * 订单详情状态
 */
 function orderTypeFormatter(value){
  if (value == 0) {
     return "未付款";
  }else if (value == 1) {
 		return "待开奖";
 	}else if(value==2){
 		return "未中奖";
 	}else if(value==3){
 		return "中奖";
 	}else if(value==4){
 		return "和局";
 	}else if(value==10){
 		return "已撤单";
 	}else if(value==20){
 		return "已撤单";
 	}else if(value==30){
 		return "追加中";
 	}else if(value==99){
 		return "订单异常";
 	}else {
 		return value;
 	}
 }


/**
 * 撤单操作
 */
function cancelOrder(c) {
    var index = c.parentNode.parentNode.parentNode.rowIndex;
  	var selectRow = $('#buyCpGrid').data().datagrid.data.rows[index];
  _confim("确定要撤销该投注单号码？",function(){
      var indexL = layer.load(2);
      Utils.request('front/bet/repeal.do',{'orderId':selectRow.orderId,'subId':selectRow.subId},function (data) {
          layer.close(indexL);
          if (data.code != 0) {
              _alert(data.msg);
              return ;
          }

          var reVal = session_timeout(data);
          if (reVal == false) {
              return false;
          }
          _alert("撤单成功",function(){
              //刷新当前列表
              $("#buyCpGrid").datagrid("updateRow",{
                                index:index, //行索引
                                row:{
                                    status:10 //行中的某个字段
                                }
                            });
          });

      },function () {
        layer.close(indexL);
      });

  },function(){});
}
/*
  中将金额
 */
function gameWinning(value,row){
  let notShow =['None', 'Revoke', 'Settlement', 'Cancel']
  if(notShow.includes(row.gameStatus)) return
  let val=0;
  val = row.betFee + row.winFee
  if (val <= 0) {
    return '<span style="color:#fff;">0.000</span>';
  }else {
    return '<span style="color:#f00;"> +'+val.toFixed(3) +'</span>';
  }
}
/*
  其他游戏投注盈亏
 */
function gameProfitAndLoss(value,row){
  let notShow =['None', 'Revoke', 'Settlement', 'Cancel']
  if(notShow.includes(row.gameStatus)) return
  if (row.winFee <= 0) {
    return '<span style="color:#fff;"> '+row.winFee.toFixed(3)+' </span>';
  }else {
    return '<span style="color:#f00;"> +'+row.winFee.toFixed(3)+'</span>';
  }
}
/*
  出票明细
 */
function ticketOrder(c) {
  var index = c.parentNode.parentNode.parentNode.rowIndex;
  var selectRow = $('#buyCpGrid').data().datagrid.data.rows[index];
  var orderId = $(c).attr("orderId");
  var status = $(c).attr("status");
  var betTime = $(c).attr("betTime");
  var winFee = $(c).attr("winFee");
  SorcOrderPop.showTicketList(orderId,betTime,winFee,status,600,400);
}


/**
 * 值重组
 * @param value
 * @param row
 * @param index
 * @returns
 */
function valueFormatter(value,row,index){
	var value = JSON.stringify(row);
	return value;
}

/**
 * 根据条件重载投注列表
 */
function reloadBuyCpGrid(reset){
	var cpCategoryName = $("#categorySelect").find("option:selected").val();
  var cpStatusName = $("#orderSelect").find("option:selected").val();
  var cpOrderIssue = $("#orderIssue").val();
	var startTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	if (!compareDate(startTime, endTime)) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
	}

  var param = {lotteryId: parseInt(cpCategoryName),
               status: parseInt(cpStatusName),
               type: 0,
               needJSON: true,
               startTime: startTime,
               endTime: endTime};
  if (cpOrderIssue != '') {
    param.issue = cpOrderIssue;
  }
  if (reset) {
    var options = $("#buyCpGrid" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#buyCpGrid").datagrid('getPager').pagination('select', 1);
    }
  }
  $('#buyCpGrid').datagrid({queryParams: param},"reload");
}
/**
 * 根据条件重载投注列表 其他类型游戏数据
 */
function reloadGameData(reset){
	var startTime = new Date($("#gameBeginTime").val()).getTime();
	var endTime =new Date($("#gameEndTime").val()).getTime();
	if (startTime>endTime) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
  }
  var param = {
    needJSON: true ,
    platformCode: $("#gameTypeSelect").find("option:selected").val(),
    start:startTime,
    end:endTime,
    platformType:_util.type
    };
  if (reset) {
    var options = $("#gameTypeTab" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#gameTypeTab").datagrid('getPager').pagination('select', 1);
    }
  }
  $('#gameTypeTab').datagrid({queryParams: param},"reload");
}
/**
 * 根据条件足彩投注列表
 */
function reloadFootCpGrid(reset){
	var cpCategoryName = 100001;
  var cpStatusName = $("#footOrderSelect").find("option:selected").val();
  var cpOrderId = $("#footOrderId").val();
	var startTime = $("#footBeginTime").val();
	var endTime = $("#footEndTime").val();
	if (!compareDate(startTime, endTime)) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
	}
  var param = {
              lotteryId: cpCategoryName,
               status: parseInt(cpStatusName),
               type: 1,
               needJSON: true,
               startTime: startTime,
               endTime: endTime};
  if (cpOrderId != '') {
    param.orderId = cpOrderId;
  }
  if (reset) {
    var options = $("#footCpGrid" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#footCpGrid").datagrid('getPager').pagination('select', 1);
    }
  }
  $('#footCpGrid').datagrid({queryParams: param},"reload");
}

/**
 * 根据条件重载充值记录列表
 */
function reloadRechargeGrid(reset){
	var statusCode = $("#rechargeSelect").val();
	var startTime = $("#rechargeBeginTime").val();
	var endTime = $("#rechargeEndTime").val();
	if (!compareDate(startTime, endTime)) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
	}
  var param = {status: parseInt(statusCode),
              needJSON: true,
              startTime: startTime,
              endTime: endTime};
  if (reset) {
    var options = $("#rechargeGrid" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#rechargeGrid").datagrid('getPager').pagination('select', 1);
    }
  }
	$('#rechargeGrid').datagrid({queryParams: param},"reload");
}

/**
 * 根据条件重载提款记录列表
 */
function reloadWithdrawalGrid(reset){
	var statusCode = $("#withdrawalSelect").val();
	var startTime = $("#withdrawalBeginTime").val();
	var endTime = $("#withdrawalEndTime").val();
	if (!compareDate(startTime, endTime)) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
	}
  var param = {status: parseInt(statusCode),
              needJSON: true,
              startTime: startTime,
              endTime: endTime};
  if (reset) {
    var options = $("#withdrawalGrid" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#withdrawalGrid").datagrid('getPager').pagination('select', 1);
    }
  }
	$('#withdrawalGrid').datagrid({queryParams:param},"reload");
}

/**
 * 根据条件重载交易明细列表
 */
function reloadTradeGrid(reset){
	var startTime = $("#tradeBeginTime").val();
	var endTime = $("#tradeEndTime").val();
  if (!compareDate(startTime, endTime)) {
		_alert("开始日期与结束日期不可为空,且开始日期不能大于结束日期");
		return;
	}
  var param = { needJSON: true,
                startTime: startTime,
                endTime: endTime,
                type:$("#accountType").find("option:selected").val()
              };
  if (reset) {
    var options = $("#tradeGrid" ).datagrid("getPager" ).data("pagination" ).options;
    var curr = options.pageNumber;
    if (curr != 0 && curr != 1) {
      $("#tradeGrid").datagrid('getPager').pagination('select', 1);
    }
  }
  $('#tradeGrid').datagrid({queryParams:param},"reload");
}

/**
 * 比较两日期大小，如果date1大于date2，返回false
 * @param date1
 * @param date2
 * @returns {Boolean}
 */
function compareDate(date1,date2){

	var d1 = new Date(date1.replace(/\-/g, "\/"));
	var d2 = new Date(date2.replace(/\-/g, "\/"));

	if (date1 != "" && date2 != "" && d1 >= d2) {
		return false;
	}else{
		if (date1 == "" || date1 == "") {
      return false;
    }else {
      return true;
    }
	}
}

 function getTypeConfig() {
  Utils.request('/front/homepage/get_account_type_config.do', {}, function(e) {
      if (e.code == 0) {
        _util.typeConfig = e.data;
      }
  });
}
