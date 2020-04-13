var LotteryType = function () {
  var ts = this;
  var types = {
    FrequentLottery: [],
    ElevenPickFive: [],
    PCEggs: [],
    QuickThree: [],
    SixMark: [],
    Three: [],
    PK10: []
  }
  // 传入全部彩种，然后分类
  this.setLotteryType = function (categories) {
    for (var inx = 0; inx < categories.length; inx++) {
      var each = categories[inx];
      for (var key in types) {
        if (types.hasOwnProperty(key)) {
          // const element = types[key];
          if (key === 'Three') {
            if (each.flag.indexOf('ThreeD') > -1 || each.flag.indexOf('ArrangeThree') > -1 || each.flag.indexOf('FrequentHappy') > -1) {
              types[key].push(each.lotteryId);
            }
          } else if (key === 'PCEggs' && (each.flag.indexOf('PCEggs') > -1 || each.flag.indexOf('Luck') > -1)) {
            types[key].push(each.lotteryId);
          } else if (each.flag.indexOf(key) > -1) {
            types[key].push(each.lotteryId);
          }
        }
      }
    }
    return ts.getLotteryType();
  }
  this.getLotteryType = function () {
    return types;
  }
  return this;
}
