var ballColorDic ='ballSetColorDicPc';
var ballRedColor = 'red';
var ballGreenColor = 'green';
var ballBlueColor = 'blue';
var ballGrayColor = 'grey';
var colorEntity;
// 颜色初始化 -- 存储在本地
function getBallSetColors(){
  if (!Utils.getStorage(ballColorDic)) {
    Utils.request('/front/lottery/sixmark_attribute.do',{},function(result) {
      var data = result["data"];
      Utils.saveStorage(ballColorDic, data);
    });
  }
}
// 六合彩数字对应颜色
function sixNumToText(num){
  if (num == '' || num == null) {
     return '';
  }
  if (!Utils.getStorage(ballColorDic)) {
    getBallSetColors();
    return '';
  }
  var animastr = "红|蓝|绿";
  var animaArr = animastr.split("|");
  var dic = Utils.getStorage(ballColorDic);
  var animaNumArr = [];
  for ( var i = 0; i < animaArr.length; i++) {
      animaNumArr.push(dic[animaArr[i]]);
  }
  for (var i = 0; i < animaNumArr.length; i++) {
      var numArr = animaNumArr[i];
      if (numArr.indexOf(num) > -1){
        return animaArr[i];
      }
  }
  return '';
}
// 六合彩数字对应颜色
function sixNumToColor(num){
  if (num == '' || num == null) {
     return ballRedColor;
  }
  if (num.match('波') || num.match('和局') ) {
    if (num.match('红')) {
      return ballRedColor;
    }
    if (num.match('绿')) {
      return ballGreenColor;
    }
    if (num.match('蓝')) {
      return ballBlueColor;
    }
    if (num.match('和局')) {
      return ballGrayColor;
    }
  }
  if (!Utils.getStorage(ballColorDic)) {
    getBallSetColors();
    return ballRedColor;
  }

  // 判断是否有汉字
  var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
  if(reg.test(num)){
      return '';
  }

  var colorStr = "红|绿|蓝";
  var colorArr = colorStr.split('|');
  var dic = Utils.getStorage(ballColorDic);
  var colorNumArr = [];
    for ( var i = 0; i < colorArr.length; i++) {
        colorNumArr.push(dic[colorArr[i]]);
    }
    for (var i = 0; i < 3; i++) {
        var numArr = colorNumArr[i];
        if (numArr.indexOf(parseInt(num)) > -1) {
            if (i == 0) {
                return ballRedColor;
            }
            if (i == 1) {
                return ballGreenColor;
            }
            if (i == 2) {
                return ballBlueColor;
            }
        }
    }
    return "";
}
// 六合彩数字对应生肖
function sixNumToZodiac(num){
  if (num == '' || num == null) {
     return '';
  }
  if (!Utils.getStorage(ballColorDic)) {
    getBallSetColors();
    return '';
  }
  var textstr = "鼠|牛|虎|兔|龙|蛇|马|羊|猴|鸡|狗|猪";
  var textArr = textstr.split("|");
  var dic = Utils.getStorage(ballColorDic);
  var textNumArr = [];
  for ( var i = 0; i < textArr.length; i++) {
      textNumArr.push(dic[textArr[i]]);
  }
  for (var i = 0; i < textNumArr.length; i++) {
      var numArr = textNumArr[i];
      if (numArr.indexOf(num) > -1){
        return textArr[i];
      }
  }
  return '';
}

// pc28和值对应颜色
function pcSumToColor(num){
  if (num == '' || num == null) {
     return ballRedColor;
  }
  if (num.match('波')) {
    if (num.match('红')) {
      return ballRedColor;
    }
    if (num.match('绿')) {
      return ballGreenColor;
    }
    if (num.match('蓝')) {
      return ballBlueColor;
    }
    if (num.match('和局')) {
      return ballGrayColor;
    }
  }
  // 红绿蓝灰
  var colorStr = "红|绿|蓝|灰";
  var colorNumArr = ["3|6|9|12|15|18|21|24",
                    "1|4|7|10|16|19|22|25",
                    "2|5|8|11|17|20|23|26",
                    "0|13|14|27"];
  for (var i = 0; i < colorNumArr.length; i++) {
      var numArr = colorNumArr[i].split('|');
      if (numArr.indexOf(num)>-1){
        var color = colorStr.split('|')[i];
        if (color.match('红')) {
          return ballRedColor;
        }
        if (color.match('绿')) {
          return ballGreenColor;
        }
        if (color.match('蓝')) {
          return ballBlueColor;
        }
        if (color.match('灰')) {
          return ballGrayColor;
        }
    }
  }
  return ballRedColor;
}

// 判断pcdd 显示颜色
function judgePcddColor(showStr) {
  if (showStr == '大') {
    return ballRedColor;
  }else if (showStr == '小') {
    return ballRedColor;
  }else if (showStr == '单') {
    return ballRedColor;
  }else if (showStr == '双') {
    return ballRedColor;
  }else if (showStr == '大单') {
    return ballBlueColor;
  }else if (showStr == '大双') {
    return ballBlueColor;
  }else if (showStr == '小单') {
    return ballBlueColor;
  }else if (showStr == '小双') {
    return ballBlueColor;
  }else if (showStr == '极大') {
    return ballGreenColor;
  }else if (showStr == '极小') {
    return ballGreenColor;
  }else {
    return pcSumToColor(showStr);
  }
}
