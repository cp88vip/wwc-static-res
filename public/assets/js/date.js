var now = new Date();
var nowDayOfWeek = now.getDay() == 0 ? 7 : now.getDay();; //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;
var oneDay = 1000*60*60*24;
function formatDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var weekday = date.getDate();

	if(month < 10){
		month = "0" + month;
	}
	if(weekday < 10){
		weekday = "0" + weekday;
	}
	return (year+"-"+month + "-" + weekday);
}
function getCurrentDate() {
    // var year = now.getFullYear();       //年
    // var month = now.getMonth() + 1;     //月
    // var day = now.getDate();            //日
    // var clock = year + "-";
    // if(month < 10) clock += "0";
    // clock += month + "-";
    // if(day < 10) clock += "0";
    // clock += day;
    // return(clock);
		return formatDate(now);
}
function getYesterdayDate() {
    var yesterday = new Date(now.getTime() - oneDay);
    return formatDate(yesterday);
}
//获得某月的天数
function getMonthDays(myMonth){
	var monthStartDate = new Date(nowYear, myMonth, 1);
	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
	return days;
}
//获得本周的开始日期
function getWeekStartDate() {
	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
	return formatDate(weekStartDate);
}
//获得本周的结束日期
function getWeekEndDate() {
	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
	return formatDate(weekEndDate);
}
//获得上周的开始日期
function getLastWeekStartDate() {
    var weekStartDate = new Date(now.getTime() - (nowDayOfWeek + 6) * oneDay);
    return formatDate(weekStartDate);
}
//获得上周的结束日期
function getLastWeekEndDate() {
    var weekEndDate = new Date(now.getTime() - nowDayOfWeek * oneDay);
    return formatDate(weekEndDate);
}
//获得本月的开始日期
function getMonthStartDate(){
	var monthStartDate = new Date(nowYear, nowMonth, 1);
	return formatDate(monthStartDate);
}
//获得本月的结束日期
function getMonthEndDate(){
	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
	return formatDate(monthEndDate);
}
//获得上月开始时间
function getLastMonthStartDate(){
  if (nowMonth == 0) {
    var m = 12 - 1;
	} else if (nowMonth == 1) {
		var m = 12;
  } else {
    var m = nowMonth - 1;
  }
  var d = getMonthDays(m);
  var s = new Date(nowYear, nowMonth, 1);
  var lastMonthStartDate = new Date(s.getTime() - d * oneDay);
	return formatDate(lastMonthStartDate);
}
//获得上月结束时间
function getLastMonthEndDate(){
  var s = new Date(nowYear, nowMonth, 1);
  var lastMonthEndDate = new Date(s.getTime() - oneDay);
	return formatDate(lastMonthEndDate);
}
