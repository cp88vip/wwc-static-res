$(function(){
    // 初始化显示时间
        $("#beginTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
		$("#endTime").datetimepicker({timeFormat: "HH:mm:ss",dateFormat: "yy-mm-dd"  });
	

    //投注记录，账户明细 默认请求最近三天;充值记录，提款记录 默认请求最近一周
    $("#beginTime").val(Utils.getDistanceFromToday(0)+" 00:00:00");
		$("#endTime").val(Utils.getDistanceFromToday(0)+" 23:59:59");
	



});