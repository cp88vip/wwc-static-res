/*
  重构布局参数
*/
var lotteryLabel = function(lotteryClassName, labelData){
  var _ts = {}, that = this;
  var lotteryType = function(className, label){
    // var _ts = algorithms;
		if (className.indexOf("FrequentLottery") > -1) { // 时时彩
			return new _ts.FrequentLotteryCalculator(label);
		} else if (className.indexOf("ElevenPickFive") > -1) {// 11选5
			return new _ts.ElevenPickFiveCalculator(label);
		} else if (className.indexOf("PK10") > -1) {// PK10
			console.log('```````````````````')
			console.log(label)
			console.log('````````````````````')

			return new _ts.PK10Calculator(label);
		} else if (className.indexOf('ThreeD') > -1 || className.indexOf('ArrangeThree') > -1
				|| className.indexOf('FrequentHappy') > -1) {// 3d 排列三 上海时时乐
			return new _ts.ThreeNumbersCalculator(label);
		} else if (className.indexOf('PCEggs') > 1 || className.indexOf('Luck28') > 1) {// PC蛋蛋系列
			return new _ts.PCEggsCalculator(label);
		} else if (className.indexOf('SixMark') > -1) {// 6合系列
			return new _ts.SixMarkCalculator(label);
		} else if (className.indexOf('QuickThree') > -1) {// 快3系列
			return new _ts.QuickThreeCalculator(label);
		} else {
			throw new Error("ClassName Error");
		}
  }
  //
  _ts.FrequentLotteryCalculator = function(data){
    var returnData = [];
    var otherPlay = data[0].playWayData[0];
    for (var i = 0; i < data.length; i++) {
      var eachData = data[i];
      var eachDict = {
        isrx: "0",
        isdefault: (i == 0 ? "1" : "0"),
        title: eachData.name,
        label: []//玩法列表
      };
      // var otherPlay = data[0].defaultPlayWay;
      var eachPlayWay = eachData.playWayData;
      // console.log(eachPlayWay);
      //TODO 分类
      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
        var playDict = {
          gtitle: gName.name,
          methodGroup: gName.methodName,
          sort: playLabel.sort,
          label: []
        }
        // eachDict.label.push(playDict);
        var lag = false;
        if (eachDict.label.length == 0) {
          eachDict.label.push(playDict);
        } else {
          for (var j = 0; j < eachDict.label.length; j++) {
            var ep = eachDict.label[j];
            if (gName.methodName == ep.methodGroup) {
              lag = true;
              break;
              // eachDict.label.push(playDict);
            }
          }
          if (!lag) {
            eachDict.label.push(playDict);
          }
        }
        if (eachDict.label.length > 1) {
          eachDict.label.sort(function(a, b){
            return b.sort - a.sort;
          });
        }
      }


      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var hasBtn = (playLabel.lotteryMethodName.indexOf('sum') == -1 && playLabel.lotteryMethodName.indexOf('Sum') == -1);
        var layoutDict = {
          selectarea: {
            type: 'digital',//数字类型为digital,文字类型为dxds，可以后面循环layout的时候判断
            layout: [],
            noBigIndex: 5,
            isButton: hasBtn
          },
          show_str: 'X,X,X,X,X',//TODO 显示格式，多少位，如何分隔？
          code_sp: '',
          methodid: playLabel.playId,//TODO 玩法id？一一对应
          // methodid: 37,
          name: playLabel.name,
          methoddesc: playLabel.simpleInfo?playLabel.simpleInfo:'', //
          methodhelp: playLabel.info?playLabel.info:'', //
          methodexample: playLabel.example?playLabel.example:'', //
          lotteryClassName: playLabel.lotteryClassName,
          lotteryMethodName: playLabel.lotteryMethodName,
          layout: playLabel,
          prize: {
            1 : '1700.00'//TODO 这个啥？赔率？
          },
          dyprize: [],
          modes: [{
            modeid: 1,
            name: '元',
            rate: 1
          },
          {
            modeid: 2,
            name: '角',
            rate: 0.1
          },
          {
            modeid: 3,
            name: '分',
            rate: 0.01
          }],
          maxcodecount: playLabel.maxSel,
          isrx: 0,
          numcount: playLabel.minSel,
          defaultposition: '00000',
          desc: playLabel.name
        }

        var showStr = "";
        for (var iii = 0; iii < playLabel.layout.length; iii++) {
          var _prizes = {};
          var layout = playLabel.layout[iii];
          var num_arr = layout.numbers.split('|');
          var num_prize = layout.prizes ? layout.prizes.split("|") : [];
          showStr += (iii == 0 ? "X" : ",X");
          if (num_prize.length > 0) {
            for (var z = 0; z < num_arr.length; z++) {
              _prizes[num_arr[z]] = num_prize[z];
            }
            layoutDict.selectarea.prizes = _prizes;
            // console.log(_prizes);
            // console.log("//much prizes");
          }
          if (!Utils.isNumber(num_arr[0]) || (num_arr[0]+'').length > 2) {
            layoutDict.selectarea.type = "dxds";
          }
          var eachLayout = {
            title: layout.ints,
            no: layout.numbers,
            place: iii,
            cols: layout.col
          };
          layoutDict.selectarea.layout.push(eachLayout);
        }
        //TODO 设置赔率
        // console.log( playLabel.minPrize + " prize is ");
        if (playLabel.minPrize == playLabel.maxPrize) {
          layoutDict.dyprize = [];
        } else {
          layoutDict.dyprize.push({
            prize: [{
              point: 0.13,
              prize: playLabel.minPrize
            }, {
              point: 0,
              prize: playLabel.maxPrize
            }]
          });
        }
        layoutDict.show_str = showStr;

        //TODO 循环上一级，push进去
        // console.log(eachDict.label);
        for (var j = 0; j < eachDict.label.length; j++) {
          var ep = eachDict.label[j];
          var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
          if (gName.methodName === ep.methodGroup) {
            ep.label.push(layoutDict);
          }
        }
      }
      returnData.push(eachDict);
    }
    return returnData;
  }
  _ts.ElevenPickFiveCalculator = function(data){
    var returnData = [];
    var otherPlay = data[0].playWayData[0];
    for (var i = 0; i < data.length; i++) {
      var eachData = data[i];
      var eachDict = {
        isrx: "0",
        isdefault: (i == 0 ? "1" : "0"),
        title: eachData.name,
        label: []//玩法列表
      };
      // var otherPlay = data[0].defaultPlayWay;
      var eachPlayWay = eachData.playWayData;
      // console.log(eachPlayWay);
      //TODO 分类
      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
        // console.log(gName);
        var playDict = {
          gtitle: gName.name,
          methodGroup: gName.methodName,
          sort: playLabel.sort,
          label: []
        }
        // eachDict.label.push(playDict);
        var lag = false;
        if (eachDict.label.length == 0) {
          eachDict.label.push(playDict);
        } else {
          for (var j = 0; j < eachDict.label.length; j++) {
            var ep = eachDict.label[j];
            if (gName.methodName == ep.methodGroup) {
              lag = true;
              break;
              // eachDict.label.push(playDict);
            }
          }
          if (!lag) {
            eachDict.label.push(playDict);
          }
        }
        if (eachDict.label.length > 1) {
          eachDict.label.sort(function(a, b){
            return b.sort - a.sort;
          });
        }
        // eachDict.label.sort()
      }

      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        // var playDict = {
        //   gtitle: playLabel.name,
        //   label: []
        // }

        var hasBtn = (playLabel.lotteryMethodName.indexOf('sum') == -1 && playLabel.lotteryMethodName.indexOf('Sum') == -1);

        var layoutDict = {
          selectarea: {
            type: 'digital',//数字类型为digital,文字类型为dxds，可以后面循环layout的时候判断
            layout: [],
            noBigIndex: 5,
            isButton: hasBtn
          },
          show_str: 'X,X,X,X,X',//TODO 显示格式，多少位，如何分隔？
          code_sp: '',
          methodid: playLabel.playId,//TODO 玩法id？一一对应
          // methodid: 37,
          name: playLabel.name,
          methoddesc: playLabel.simpleInfo, //
          methodhelp: playLabel.info, //
          methodexample: playLabel.example, //
          lotteryClassName: playLabel.lotteryClassName,
          lotteryMethodName: playLabel.lotteryMethodName,
          layout: playLabel,
          prize: {
            1 : '1700.00'//TODO 这个啥？赔率？
          },
          dyprize: [],
          modes: [{
            modeid: 1,
            name: '元',
            rate: 1
          },
          {
            modeid: 2,
            name: '角',
            rate: 0.1
          },
          {
            modeid: 3,
            name: '分',
            rate: 0.01
          }],
          maxcodecount: playLabel.maxSel,
          isrx: 0,
          numcount: playLabel.minSel,
          defaultposition: '00000',
          desc: playLabel.name
        }

        var showStr = "";
        for (var iii = 0; iii < playLabel.layout.length; iii++) {
          var layout = playLabel.layout[iii];
          var num_arr = layout.numbers.split('|');
          showStr += (iii == 0 ? "X" : ",X");

          if (!Utils.isNumber(num_arr[0])) {
            layoutDict.selectarea.type = "dxds";
          }
          var eachLayout = {
            title: layout.ints,
            no: layout.numbers,
            place: iii,
            cols: layout.col
          };
          layoutDict.selectarea.layout.push(eachLayout);
        }
        //TODO 设置赔率
        layoutDict.dyprize.push({
          prize: [{
            point: 0.13,
            prize: playLabel.minPrize
          }, {
            point: 0,
            prize: playLabel.maxPrize
          }]
        });
        layoutDict.show_str = showStr;

        //TODO 循环上一级，push进去
        // console.log(eachDict.label);
        for (var j = 0; j < eachDict.label.length; j++) {
          var ep = eachDict.label[j];
          var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
          // console.log(playLabel.lotteryMethodName);
          // console.log(layoutDict);
          if (gName.methodName === ep.methodGroup) {
            // console.log(ep);
            ep.label.push(layoutDict);
            // playDict.label.push(layoutDict);
            // console.log("//---------------------------//");
          }
        }
      }
      returnData.push(eachDict);
    }
    return returnData;
  }
  _ts.PK10Calculator = function(data){
    var returnData = [];
    var otherPlay = data[0].playWayData[0];
    for (var i = 0; i < data.length; i++) {
      var eachData = data[i];
      var eachDict = {
        isrx: "0",
        isdefault: (i == 0 ? "1" : "0"),
        title: eachData.name,
        label: []//玩法列表
      };
      // var otherPlay = data[0].defaultPlayWay;
      var eachPlayWay = eachData.playWayData;
      // console.log(eachPlayWay);
      //TODO 分类
      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
        // console.log(gName);
        var playDict = {
          gtitle: gName.name,
          methodGroup: gName.methodName,
          sort: playLabel.sort,
          label: []
        }
        // eachDict.label.push(playDict);
        var lag = false;
        if (eachDict.label.length == 0) {
          eachDict.label.push(playDict);
        } else {
          for (var j = 0; j < eachDict.label.length; j++) {
            var ep = eachDict.label[j];
            if (gName.methodName == ep.methodGroup) {
              lag = true;
              break;
              // eachDict.label.push(playDict);
            }
          }
          if (!lag) {
            eachDict.label.push(playDict);
          }
        }
        if (eachDict.label.length > 1) {
          eachDict.label.sort(function(a, b){
            return b.sort - a.sort;
          });
        }
      }

      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        // var playDict = {
        //   gtitle: playLabel.name,
        //   label: []
        // }

        var hasBtn = (playLabel.lotteryMethodName.indexOf('sum') == -1 && playLabel.lotteryMethodName.indexOf('Sum') == -1);

        var layoutDict = {
          selectarea: {
            type: 'digital',//数字类型为digital,文字类型为dxds，可以后面循环layout的时候判断
            layout: [],
            noBigIndex: 5,
            isButton: hasBtn
          },
          show_str: 'X,X,X,X,X',//TODO 显示格式，多少位，如何分隔？
          code_sp: '',
          methodid: playLabel.playId,//TODO 玩法id？一一对应
          // methodid: 37,
          name: playLabel.name,
          methoddesc: playLabel.simpleInfo, //
          methodhelp: playLabel.info, //
          methodexample: playLabel.example, //
          lotteryClassName: playLabel.lotteryClassName,
          lotteryMethodName: playLabel.lotteryMethodName,
          layout: playLabel,
          prize: {
            1 : '1700.00'//TODO 这个啥？赔率？
          },
          dyprize: [],
          modes: [{
            modeid: 1,
            name: '元',
            rate: 1
          },
          {
            modeid: 2,
            name: '角',
            rate: 0.1
          },
          {
            modeid: 3,
            name: '分',
            rate: 0.01
          }],
          maxcodecount: playLabel.maxSel,
          isrx: 0,
          numcount: playLabel.minSel,
          defaultposition: '00000',
          desc: playLabel.name
        }

        var showStr = "";
        for (var iii = 0; iii < playLabel.layout.length; iii++) {
          var layout = playLabel.layout[iii];
          var num_arr = layout.numbers.split('|');
          showStr += (iii == 0 ? "X" : ",X");

          if (!Utils.isNumber(num_arr[0])) {
            layoutDict.selectarea.type = "dxds";
          }
          var eachLayout = {
            title: layout.ints,
            no: layout.numbers,
            place: iii,
            cols: layout.col
          };
          layoutDict.selectarea.layout.push(eachLayout);
        }
        //TODO 设置赔率
        layoutDict.dyprize.push({
          prize: [{
            point: 0.13,
            prize: playLabel.minPrize
          }, {
            point: 0,
            prize: playLabel.maxPrize
          }]
        });
        layoutDict.show_str = showStr;

        //TODO 循环上一级，push进去
        // console.log(eachDict.label);
        for (var j = 0; j < eachDict.label.length; j++) {
          var ep = eachDict.label[j];
          var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
          if (gName.methodName === ep.methodGroup) {
            // console.log(ep);
            ep.label.push(layoutDict);
          }
        }
      }
      returnData.push(eachDict);
    }
    return returnData;
  }
  _ts.ThreeNumbersCalculator = function(data){
    var returnData = [];
    var otherPlay = data[0].playWayData[0];
    for (var i = 0; i < data.length; i++) {
      var eachData = data[i];
      var eachDict = {
        isrx: "0",
        isdefault: (i == 0 ? "1" : "0"),
        title: eachData.name,
        label: []//玩法列表
      };
      // var otherPlay = data[0].defaultPlayWay;
      var eachPlayWay = eachData.playWayData;
      // console.log(eachPlayWay);
      //TODO 分类
      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
        // console.log(gName);
        var playDict = {
          gtitle: gName.name,
          methodGroup: gName.methodName,
          sort: playLabel.sort,
          label: []
        }
        // eachDict.label.push(playDict);
        var lag = false;
        if (eachDict.label.length == 0) {
          eachDict.label.push(playDict);
        } else {
          for (var j = 0; j < eachDict.label.length; j++) {
            var ep = eachDict.label[j];
            if (gName.methodName == ep.methodGroup) {
              lag = true;
              break;
              // eachDict.label.push(playDict);
            }
          }
          if (!lag) {
            eachDict.label.push(playDict);
          }
        }
        if (eachDict.label.length > 1) {
          eachDict.label.sort(function(a, b){
            return b.sort - a.sort;
          });
        }
      }

      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        // var playDict = {
        //   gtitle: playLabel.name,
        //   label: []
        // }

        var hasBtn = (playLabel.lotteryMethodName.indexOf('sum') == -1 && playLabel.lotteryMethodName.indexOf('Sum') == -1);

        var layoutDict = {
          selectarea: {
            type: 'digital',//数字类型为digital,文字类型为dxds，可以后面循环layout的时候判断
            layout: [],
            noBigIndex: 5,
            isButton: hasBtn
          },
          show_str: 'X,X,X,X,X',//TODO 显示格式，多少位，如何分隔？
          code_sp: '',
          methodid: playLabel.playId,//TODO 玩法id？一一对应
          // methodid: 37,
          name: playLabel.name,
          methoddesc: playLabel.simpleInfo, //
          methodhelp: playLabel.info, //
          methodexample: playLabel.example, //
          lotteryClassName: playLabel.lotteryClassName,
          lotteryMethodName: playLabel.lotteryMethodName,
          layout: playLabel,
          prize: {
            1 : '1700.00'//TODO 这个啥？赔率？
          },
          dyprize: [],
          modes: [{
            modeid: 1,
            name: '元',
            rate: 1
          },
          {
            modeid: 2,
            name: '角',
            rate: 0.1
          },
          {
            modeid: 3,
            name: '分',
            rate: 0.01
          }],
          maxcodecount: playLabel.maxSel,
          isrx: 0,
          numcount: playLabel.minSel,
          defaultposition: '00000',
          desc: playLabel.name
        }

        var showStr = "";
        for (var iii = 0; iii < playLabel.layout.length; iii++) {
          var layout = playLabel.layout[iii];
          var num_arr = layout.numbers.split('|');
          showStr += (iii == 0 ? "X" : ",X");

          if (!Utils.isNumber(num_arr[0])) {
            layoutDict.selectarea.type = "dxds";
          }
          var eachLayout = {
            title: layout.ints,
            no: layout.numbers,
            place: iii,
            cols: layout.col
          };
          layoutDict.selectarea.layout.push(eachLayout);
        }
        //TODO 设置赔率
        layoutDict.dyprize.push({
          prize: [{
            point: 0.13,
            prize: playLabel.minPrize
          }, {
            point: 0,
            prize: playLabel.maxPrize
          }]
        });
        layoutDict.show_str = showStr;

        //TODO 循环上一级，push进去
        // console.log(eachDict.label);
        for (var j = 0; j < eachDict.label.length; j++) {
          var ep = eachDict.label[j];
          var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
          // console.log(playLabel.lotteryMethodName);
          // console.log(layoutDict);
          if (gName.methodName === ep.methodGroup) {
            // console.log(ep);
            ep.label.push(layoutDict);
            // playDict.label.push(layoutDict);
          }
        }
        // playDict.label.push(layoutDict);
        // eachDict.label.push(playDict);
      }
      returnData.push(eachDict);
    }
    return returnData;
  }
  _ts.PCEggsCalculator = function(data){

  }
  _ts.SixMarkCalculator = function(data){

  }
  _ts.QuickThreeCalculator = function(data){
    var returnData = [];
    var otherPlay = data[0].playWayData[0];
    for (var i = 0; i < data.length; i++) {
      var eachData = data[i];
      var eachDict = {
        isrx: "0",
        isdefault: (i == 0 ? "1" : "0"),
        title: eachData.name,
        label: []//玩法列表
      };
      // var otherPlay = data[0].defaultPlayWay;
      var eachPlayWay = eachData.playWayData;
      // console.log(eachPlayWay);
      //TODO 分类
      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
        var playDict = {
          gtitle: gName.name,
          methodGroup: gName.methodName,
          sort: playLabel.sort,
          label: []
        }
        // eachDict.label.push(playDict);
        var lag = false;
        if (eachDict.label.length == 0) {
          eachDict.label.push(playDict);
        } else {
          for (var j = 0; j < eachDict.label.length; j++) {
            var ep = eachDict.label[j];
            if (gName.methodName == ep.methodGroup) {
              lag = true;
              break;
              // eachDict.label.push(playDict);
            }
          }
          if (!lag) {
            eachDict.label.push(playDict);
          }
        }
        if (eachDict.label.length > 1) {
          eachDict.label.sort(function(a, b){
            return b.sort - a.sort;
          });
        }
      }

      for (var ii = 0; ii < eachPlayWay.length; ii++) {
        var playLabel = eachPlayWay[ii];
        //straight all
        // var hasBtn = (playLabel.lotteryMethodName.indexOf('all') == -1 && playLabel.lotteryMethodName.indexOf('straight') == -1 && playLabel.lotteryMethodName.indexOf('sum') == -1 && playLabel.lotteryMethodName.indexOf('Sum') == -1);
        var hasBtn = false;
        var layoutDict = {
          selectarea: {
            type: 'digital',//数字类型为digital,文字类型为dxds，可以后面循环layout的时候判断
            layout: [],
            noBigIndex: 5,
            isButton: hasBtn,
            prizes: {}
          },
          show_str: 'X,X,X,X,X',//TODO 显示格式，多少位，如何分隔？
          code_sp: '',
          methodid: playLabel.playId,//TODO 玩法id？一一对应
          // methodid: 37,
          name: playLabel.name,
          methoddesc: playLabel.simpleInfo?playLabel.simpleInfo:'', //
          methodhelp: playLabel.info?playLabel.info:'', //
          methodexample: playLabel.example?playLabel.example:'', //
          lotteryClassName: playLabel.lotteryClassName,
          lotteryMethodName: playLabel.lotteryMethodName,
          layout: playLabel,
          prize: {},
          dyprize: [],
          modes: [{
            modeid: 1,
            name: '元',
            rate: 1
          },
          {
            modeid: 2,
            name: '角',
            rate: 0.1
          },
          {
            modeid: 3,
            name: '分',
            rate: 0.01
          }],
          maxcodecount: playLabel.maxSel,
          isrx: 0,
          numcount: playLabel.minSel,
          defaultposition: '00000',
          desc: playLabel.name
        }

        var showStr = "";
        for (var iii = 0; iii < playLabel.layout.length; iii++) {
          var _prizes = {};
          var layout = playLabel.layout[iii];
          var num_arr = layout.numbers.split('|');
          var num_prize = layout.prizes ? layout.prizes.split("|") : [];
          showStr += (iii == 0 ? "X" : ",X");
          if (num_prize.length > 0) {
            for (var z = 0; z < num_arr.length; z++) {
              _prizes[num_arr[z]] = num_prize[z];
            }
            layoutDict.selectarea.prizes = _prizes;
            // console.log(_prizes);
            // console.log("//much prizes");
          }
          if (!Utils.isNumber(num_arr[0]) || (num_arr[0]+'').length > 2) {
            layoutDict.selectarea.type = "dxds";
          }
          var eachLayout = {
            title: layout.ints,
            no: layout.numbers,
            place: iii,
            cols: layout.col
          };
          layoutDict.selectarea.layout.push(eachLayout);
        }
        if (playLabel.minPrize == playLabel.maxPrize) {
          layoutDict.dyprize = [];
        } else {
          layoutDict.dyprize.push({
            prize: [{
              point: 0.13,
              prize: playLabel.minPrize
            }, {
              point: 0,
              prize: playLabel.maxPrize
            }]
          });
        }
        layoutDict.show_str = showStr;

        //TODO 循环上一级，push进去
        for (var j = 0; j < eachDict.label.length; j++) {
          var ep = eachDict.label[j];
          var gName = groupName(playLabel.name, playLabel.lotteryMethodName, eachData.name);
          if (gName.methodName === ep.methodGroup) {
            ep.label.push(layoutDict);
          }
        }
        // playDict.label.push(layoutDict);
        // eachDict.label.push(playDict);
      }
      returnData.push(eachDict);
    }
    return returnData;
  }
  return lotteryType(lotteryClassName, labelData);
}
/*
  重构注数计算
*/
var isRepeat = function(arr){
	var hash = {};
	for(var i in arr) {
		if(hash[arr[i]])
			return true;
		hash[arr[i]] = true;
	}
	return false;
}
var combination = function (arr, num, fun) {//算数组可能的排列组合
	/*这里假设num最大值为10 一般A(n,m)中的m应该不会太大 */
  if (arr.length < num || num > 30) {
      return [];
  }
  var variable = ["a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u"];
  var replaceStr = "#$#";
  var str = " var arr=arguments[0]; var fun=arguments[1];  var ret=[]; for (var a = 0; a < arr.length; a++) { "+replaceStr+" } return ret;"
  for (var i = 1; i < num; i++) {
      str = str.replace(replaceStr, " for (var " + variable[i] + " =" + variable[i - 1] + "+ 1; " + variable[i] + " < arr.length; " + variable[i] + "++) { " + replaceStr + "  }")
  }
  var temp = " var temp= []; ";
  for (var i = 0; i < num; i++) {
      temp += "temp.push(arr[" + variable[i] + "]); ";
  }
  if (fun) {
      temp += " ret.push(fun(temp)); ";
  }
  else {
      temp += " ret.push(temp); ";
  }
  str = str.replace(replaceStr, temp);
  //console.log(str);
  return (new Function(str)).apply(null, [arr, fun]);
}
var permutate = function (doubleArrays) {
	var len = doubleArrays.length;
	if (len >= 2) {
		var len1 = doubleArrays[0].length;
		var len2 = doubleArrays[1].length;
		var newlen = len1 * len2;
		var temp = new Array(newlen);
		var index = 0;
		for (var i = 0; i < len1; i++) {
			for (var j = 0; j < len2; j++) {
				temp[index] = doubleArrays[0][i] + doubleArrays[1][j];
				index++;
			}
		}
		var newArray = new Array(len - 1);
		for (var i = 2; i < len; i++) {
			newArray[i - 1] = doubleArrays[i];
		}
		newArray[0] = temp;
		return permutate(newArray);
	} else {
		// console.log(doubleArrays);
		return doubleArrays[0];
	}
}
var simplify = function(arr){//重构数组，多维变一维
	var results = [];
	var result = [];
	var doExchange = function(arr, depth){
		for (var i = 0; i < arr[depth].length; i++) {
			result[depth] = arr[depth][i];
			if (depth != arr.length - 1) {
				doExchange(arr, depth + 1)
			} else {
				// results.push(result.join('|'))
				// console.log(result);
				results.push(result.join(','));
			}
		}
	}
	doExchange(arr, 0);
	// console.log(results.length, results.join(','));
	return results;
}
var duplicate = function (arr) {//去除数组重复值
	var tmp;
	if (!arr || arr.length === 0) {
		return [];
	}
	var isObject = function(o) {
		return Object.prototype.toString.call(o) === '[object Object]';
	}
	var isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	for (var i = 0, len = arr.length; i < len; i++) {
		tmp = arr[i];
		if (isArray(tmp)) {
			for (var j = i + 1; j < len; j++) {
				if (isArray(arr[j]) && tmp.length === arr[j].length) {
					var flag = false;
					for (var k = 0; k < tmp.length; k++) {
						if (tmp[k] !== arr[j][k]) {
							flag = true;
							break;
						}
					}
					if (!flag) {
						arr.splice(j, 1);
						len--;
						j--;
					}
				}
			}
		} else if (isObject(tmp)) {
			for (var j = i + 1; j < len; j++) {
				if (isObject(arr[j])) {
					var tmpKey = [], objKey = [], flag = false;
					for (var k in tmp) {
						tmpKey.push(k);
					}
					for (var l in arr[j]) {
						objKey.push(l);
					}
					if (tmpKey.length === objKey.length) {
						for (var key in tmp) {
							if (tmp[key] !== arr[j][key]) {
								flag = true;
								break;
							}
						}
					}
					if (!flag) {
						arr.splice(j, 1);
						len--;
						j--;
					}
				}
			}
		} else {
			for (var j = i + 1; j < len; j++) {
				if (tmp === arr[j]) {
					arr.splice(j, 1);
					len--;
					j--;
				}
			}
		}
	}
	return arr;
}

/*  */
var algorithms = {
	switch:function(className){
		var _ts = algorithms;
		if (className.indexOf("FrequentLottery") > -1) { // 时时彩
			return new _ts.FrequentLotteryCalculator();
		} else if (className.indexOf("ElevenPickFive") > -1) {// 11选5
			return new _ts.ElevenPickFiveCalculator();
		} else if (className.indexOf("PK10") > -1) {// PK10
			return new _ts.PK10Calculator();
		} else if (className.indexOf('ThreeD') > -1 || className.indexOf('ArrangeThree') > -1
		|| className.indexOf('FrequentHappy') > -1) {// 3d 排列三 上海时时乐
			return new _ts.ThreeNumbersCalculator();
		} else if (className.indexOf("PCEggs") > -1  || className.indexOf("Luck") > -1 ) {// PC蛋蛋系列
			return new _ts.PCEggsCalculator();
		} else if (className.indexOf('SixMark') > -1) {// 6合系列
			return new _ts.SixMarkCalculator();
		} else if (className.indexOf('QuickThree') > -1) {// 快3系列
			return new _ts.QuickThreeCalculator();
		} else if (className.indexOf('SevenStar') > -1) {// 七星彩
			return new _ts.SevenStarCalculator();
		} else {
			throw new Error("ClassName Error");
		}
	},
	SevenStarCalculator: function() {
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
		// 大小单双
		this.attribute = function(sa) {
			return sa.length;
		}
		// 前三大小单双与后三大小单双
		this.before3attribute = this.in3attribute = this.after3attribute = function(sa) {
			console.log(sa)
			return permutate(sa).length;
		}
		// 三字现
		this.selected3 = function(sa) {
			return combination(sa, 3).length;
		}
		// 二字现
		this.selected2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 四定
		this.locationCourage4 = function(sa) {
			return permutate(sa).length;
		}
		// 三定
		this.locationCourage3 = function(sa) {
			return permutate(sa.slice(0, 3)).length + permutate(sa.slice(1)).length + permutate([sa[0],sa[1],sa[3]]).length + permutate([sa[0],sa[2],sa[3]]).length;
		}
		// 二定
		this.locationCourage2 = function(sa) {
			return permutate([sa[0],sa[1]]).length + permutate([sa[0],sa[2]]).length + permutate([sa[0],sa[3]]).length + permutate([sa[1],sa[2]]).length + permutate([sa[1],sa[3]]).length + permutate([sa[2],sa[3]]).length;
		}
		// 一定
		this.locationCourage = function(sa) {
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				for(var y=0; y<sa[i].length; y++) {
					count++;
				}
			}
			return count;
		}
	},
	FrequentLotteryCalculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
    // 龙虎
    this.dragonTiger = function (sa) {
      return sa.length;
    }
		// 定位胆
		this.locationCourage = this.locationCourageAttribute = function(sa) {
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				for(var y=0; y<sa[i].length; y++) {
					count++;
				}
			}
			return count;
		}
		// 2星直选
		this.before2directly = this.after2directly = function(sa) {
			return permutate(sa).length;
		}
		/*二星组选*/
		this.before2combination = this.after2combination = function(sa) {
			return combination(sa, 2).length;
		}
		// 2星直选和值
		this.before2directlySum = this.after2directlySum = function(sa) {
			var counts = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]];
			}
			return count;
		}
		// 2星组选和值
		this.before2combinationSum = this.after2combinationSum = function(sa) {
			var counts = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1 ];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]-1];
			}
			return count;
		}
		// 2星跨度
		this.before2span = this.after2span = function(sa) {
			var counts = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]];
			}
			return count;
		}
		// 2星组选包胆
		this.before2combinationCourage = this.after2combinationCourage = function(
				sa) {
			return sa.length * 9;
		}
		// 2星属性
		this.before2attribute = this.after2attribute = function(sa) {
			return permutate(sa).length;
		}
		// 不定位 3中1
		this.before3selected1 = this.after3selected1 = function(sa) {
			return sa.length;
		}
		// 3 in 2
		this.before3selected2 = this.after3selected2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 3星直选
		this.before3directly = this.in3directly = this.after3directly = function(sa) {
			return permutate(sa).length;
		}
		// 3星直选和值
		this.before3directlySum = this.in3directlySum = this.after3directlySum = function(sa) {
			var counts = [ 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1 ];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]];
			}
			return count;
		}
		// 3星组选和值
		this.before3combinationSum  = this.in3combinationSum= this.after3combinationSum = function(sa) {
			var counts = [ 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1 ];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]-1];
			}
			return count;
		}
		// 3星和值尾数
		this.before3sumMantissa = this.in3sumMantissa = this.after3sumMantissa = function(sa) {
			return sa.length;
		}
		// 3星跨度
		this.before3span = this.in3span = this.after3span = function(sa) {
			var counts = [ 10, 54, 96, 126, 144, 150, 144, 126, 96, 54 ];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]];
			}
			return count;
		}
		// 3星组3
		this.before3combination3 = this.in3combination3 = this.after3combination3 = function(sa) {
			return combination(sa, 2).length * 2;
		}
		// 3星组6
		this.before3combination6 = this.in3combination6 = this.after3combination6 = function(sa) {
			return combination(sa, 3).length;
		}
		// 3星特殊
		this.before3special = this.in3special = this.after3special = function(sa) {
			return sa.length;
		}
		// 3星属性
		this.before3attribute = this.in3attribute = this.after3attribute = function(sa) {
			return permutate(sa).length;
		}
		// 4星不定位 1码
		this.before4selected1 = this.after4selected1 = function(sa) {
			return sa.length;
		}
		// 4星不定位 2码
		this.before4selected2 = this.after4selected2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 5星不定位 1码
		this.notLocationSelected1 = function(sa) {
			return sa.length;
		}
		// 5星不定位 2码
		this.notLocationSelected2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 5星不定位 3码
		this.notLocationSelected3 = function(sa) {
			return combination(sa, 3).length;
		}
		// 5星直选
		this.fiveStarDirectly = function(sa) {
			return permutate(sa).length;
		}
		// 4星直选
		this.fourStarDirectly = function(sa) {
			return permutate(sa).length;
		}
    // 前4星直选
		this.before4StarDirectly = function(sa) {
			return permutate(sa).length;
		}
	},
	ElevenPickFiveCalculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}

		/**
		 * 任选胆拖 - 任选二中二
		 * @param selectedNumbers
		 * @return
		 */
		this.duplex_in_ = function(sa, count) {
			if (sa[0].length == 0) { return 0; }
			var courageNumber = sa[0];
			var pullNumbers = sa[1];
			if(courageNumber.length == (count-1)) return pullNumbers.length;
			// console.log(pullNumbers);
			// console.log(combination(pullNumbers, count-courageNumber.length));
			return combination(pullNumbers, count-courageNumber.length).length;
		}
		this.duplex2in2 = function(sa) {
			if (sa[0].length == 0) { return 0; }
			return sa[1].length;
		}
		this.duplex3in3 = function(sa) {
			if (sa[0].length == 0) { return 0; }
			var courageNumber = sa[0];
			var pullNumbers = sa[1];
			if(courageNumber.length == 2) return pullNumbers.length;
			return combination(pullNumbers, 2).length;
		}
		this.duplex4in4 = function(sa) {
			return this.duplex_in_(sa, 4);
		}
		this.duplex5in5 = function(sa) {
			return this.duplex_in_(sa, 5);
		}
		this.duplex6in5 = function(sa) {
			return this.duplex_in_(sa, 6);
		}
		this.duplex7in5 = function(sa) {
			return this.duplex_in_(sa, 7);
		}
		this.duplex8in5 = function(sa) {
			return this.duplex_in_(sa, 8);
		}
		/**
		 * 任选二中二
		 * @param selectedNumbers
		 * @return
		 */
		this.optional2in2 = function(sa) {
			return combination(sa, 2).length;
		}
		this.optional3in3 = function(sa) {
			return combination(sa, 3).length;
		}
		this.optional4in4 = function(sa) {
			return combination(sa, 4).length;
		}
		this.optional5in5 = function(sa) {
			return combination(sa, 5).length;
		}
		this.optional6in5 = function(sa) {
			return combination(sa, 6).length;
		}
		this.optional7in5 = function(sa) {
			return combination(sa, 7).length;
		}
		this.optional8in5 = function(sa) {
			return combination(sa, 8).length;
		}
		this.locationCourage = this.locationCourageAttribute = function(sa) {
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				for(var y=0; y<sa[i].length; y++) {
					count++;
				}
			}
			return count;
		}
		/*二星直选*/
		this.before2directly = this.after2directly = function(sa) {
			//不重复号码
			if (sa.length < 2) { return 0; }
			var arr = simplify(sa);//得到一维数组，去掉重复值
			for (var i = arr.length - 1; i >= 0; i--) {
				var each = arr[i];
				var n = each.split(",");
				for (var j = 0; j < n.length; j++) {
					if (n[j] == n[j+1]) {
						arr.splice(i, 1);
					}
				}
			}
			// console.log(arr);
			return arr.length;
			// return permutate(sa).length;
		}
		/*二星组选*/
		this.before2combination = this.after2combination = function(sa) {

			return combination(sa, 2).length;
		}
		/*二星胆拖*/
		this.before2duplex = this.after2duplex = function(sa) {
			if (sa[0].length == 0) { return 0; }
			return sa[1].length;
		}
		/*三星直选*/
		this.before3directly = this.middle3directly = this.after3directly = function(sa) {
			//不重复号码
			if (sa.length < 3) { return 0; }
			var arr = simplify(sa);
			for (var i = arr.length - 1; i >= 0; i--) {
				var each = arr[i];
				var n = each.split(",");
				if (isRepeat(n)){
					arr.splice(i, 1);
				}
			}
			// console.log(arr);
			return arr.length;
			// return permutate(sa).length;
		}
		/*三星组选*/
		this.before3combination = this.middle3combination = this.after3combination = function(sa) {
			return combination(sa, 3).length;
		}
		/* 不定位 */
		this.before3NotLocation = this.middle3NotLocation = this.after3NotLocation = function(sa){
			return sa.length;
		}
		/* 三码胆拖 */
		this.before3duplex = this.middle3duplex = this.after3duplex = function(sa){
			if (sa[0].length == 0) { return 0; }
			var courageNumber = sa[0];
			var pullNumbers = sa[1];
			var count = pullNumbers.length;
			if(courageNumber.length === 2) return pullNumbers.length;
			return combination(pullNumbers, 2).length;
		}
	},
	QuickThreeCalculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			// console.log(methodName+"//"+selectedArray);
			return eval("this." + methodName + '(selectedArray)');
		}
    // 大小单双
    this.attribute = function(sa) {
			return sa.length;
		}
		/**
		* 和值
		*/
		this.sum = function(sa) {
			// console.log(sa);
			return sa.length;
		}
		/**
		* 三不同号 - 胆拖
		*/
		this.notSame3duplex = function(sa) {
			if (sa[0].length == 0) { return 0; }
			var courageNumber = sa[0];
			var pullNumbers = sa[1];
			var count = pullNumbers.length;
			if(courageNumber.length === 2) return pullNumbers.length;
			return combination(pullNumbers, 2).length;
		}
		/**
		* 三不同号 - 标准
		*/
		this.notSame3 = function(sa) {
			return combination(sa, 3).length;
		}
		/**
		* 二不同号 - 胆拖
		*/
		this.notSame2duplex = function(sa) {
			if (sa[0].length == 0) { return 0; }
			return sa[1].length;
		}
		/**
		* 二不同号 - 标准 same3single
		*/
		this.notSame2 = function(sa) {
			// return sa.length;
      return combination(sa, 2).length;
		}
		/**
		 * 三同号 - 单选
		 */
		this.same3single = function(sa){
			return sa.length;
		}
		/**
		* 三同号 - 通选
		*/
		this.same3All = function(sa) {
			return sa.length;
		}
		/**
		* 二同号 - 单选
		*/
		this.same2single = function(sa) {
			return permutate(sa).length;
		}
		/**
		* 二同号 - 多选
		*/
		this.same2double = function(sa) {
			return sa.length;
		}
		/**
		* 三连号通选
		*/
		this.straight = function(sa) {
			return sa.length;
		}
	},
	PK10Calculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
    // 龙虎
    this.dragonTiger = function (sa) {
      return sa.length;
    }
    // 冠亚和值
    this.sum = function (sa) {
      var counts = [ 2, 2, 4, 4, 6, 6, 8, 8, 10, 8, 8, 6, 6, 4, 4, 2, 2 ];
			var count = 0;
			for(var i=0; i< sa.length; i++) {
				count += counts[sa[i]-3];
			}
			return count;
    }
    // 大小单双
    this.attribute = function (sa) {
      return sa.length;
    }

		/**
		 * 前一直选
		 */
		this.before1directly = function(sa) {
			return sa.length;
		}
		/**
		 * 前二直选
		 */
		this.before2directly = function(sa) {
			//TODO 组成不重复数组
			if (sa.length < 2) { return 0; }
			var arr = simplify(sa);//得到一维数组，去掉重复值
			// for (var i = 0; i < arr.length; i++) {
			// 	var each = arr[i];
			// 	var n = each.split(",");
			// 	if (n[0] == n[1]) {
			// 		arr.splice(i, 1);
			// 	}
			// }

			for (var i = arr.length - 1; i >= 0; i--) {
				var each = arr[i];
				var n = each.split(",");
				for (var j = 0; j < n.length; j++) {
					if (n[j] == n[j+1]) {
						arr.splice(i, 1);
					}
				}
			}
			// console.log(arr);
			return arr.length;
			// return permutate(sa).length;
		}
		/**
		 * 前三直选
		 */
		this.before3directly = function(sa) {
			// return permutate(sa).length;
			if (sa.length < 3) { return 0; }
			var arr = simplify(sa);
			for (var i = arr.length - 1; i >= 0; i--) {
				var each = arr[i];
				var n = each.split(",");
				if (isRepeat(n)){
					arr.splice(i, 1);
				}
			}
			// console.log(arr);
			return arr.length;
		}
		/**
		 * 定位胆
		 */
		this.locationCourage = this.locationCourageAttribute = function(sa) {
			var count = 0;
			for(var i = 0; i<sa.length; i++) {
				for(var y = 0; y<sa[i].length; y++) {
					count ++;
				}
			}
			return count;
		}
	},
	PCEggsCalculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
		//特码
		this.extraNumber = function(sa) {
			return sa.length;
		}
		//特码包3
		this.extraNumberSelected3 = function(sa) {
			if(sa.length < 3) return 0;
			return 1;
		}
		// 豹子
		this.leopard = function(sa) {
			return sa.length;
		}
		// 波色
		this.color = function(sa) {
			return sa.length;
		}
		//混合
		this.mixture = function(sa) {
			return sa.length;
		}
	},
	SixMarkCalculator:function(){
		// 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
		//大小单双
		this.attribute = function (sa) {
      return sa.length;
    }
		//七色波
		this.sevenColors = function(sa) {
			return sa.length;
		}
		// 二连肖 二连尾
		this.linkZodiac2 = this.linkTrail2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 三连肖 三连尾
		this.linkZodiac3 = this.linkTrail3 = function(sa) {
			return combination(sa, 3).length;
		}
		// 四连肖 四连尾
		this.linkZodiac4 = this.linkTrail4 = function(sa) {
			return combination(sa, 4).length;
		}
		// 五连肖 五连尾
		this.linkZodiac5 = this.linkTrail5 =function(sa) {
			return combination(sa, 5).length;
		}
		// 二合肖
		this.combineZodiac2 = function(sa) {
			return combination(sa, 2).length;
		}
		// 三合肖
		this.combineZodiac3 = function(sa) {
			return combination(sa, 3).length;
		}
		// 四合肖
		this.combineZodiac4 = function(sa) {
			return combination(sa, 4).length;
		}
		// 五合肖
		this.combineZodiac5 = function(sa) {
			return combination(sa, 5).length;
		}
		// 六合肖
		this.combineZodiac6 = function(sa) {
			return combination(sa, 6).length;
		}
		// 七合肖
		this.combineZodiac7 = function(sa) {
			return combination(sa, 7).length;
		}
		// 八合肖
		this.combineZodiac8 = function(sa) {
			return combination(sa, 8).length;
		}
		// 九合肖
		this.combineZodiac9 = function(sa) {
			return combination(sa, 9).length;
		}
		// 十合肖
		this.combineZodiac10 = function(sa) {
			return combination(sa, 10).length;
		}
		// 十一合肖
		this.combineZodiac11 = function(sa) {
			// console.log(sa);
			// console.log(combination(sa, 11));
			return combination(sa, 11).length;
		}
		// 正肖
		this.positiveZodiac = function(sa) {
			return sa.length;
		}
		// 自选不中 六不中
		this.optionalImproper6 = function(sa) {

			return combination(sa, 6).length;
		}
		// 自选不中 七不中
		this.optionalImproper7 = function(sa) {
			return combination(sa, 7).length;
		}
		// 自选不中 八不中
		this.optionalImproper8 = function(sa) {
			return combination(sa, 8).length;
		}
		// 自选不中 九不中
		this.optionalImproper9 = function(sa) {
			return combination(sa, 9).length;
		}
		// 自选不中 十不中
		this.optionalImproper10 = function(sa) {
			return combination(sa, 10).length;
		}
		// 自选不中 十一不中
		this.optionalImproper11 = function(sa) {
			// console.log(sa);
			return combination(sa, 11).length;
		}
		// 正码1-6
		this.positiveCode1 = this.positiveCode2 = this.positiveCode3 = this.positiveCode4 = this.positiveCode5 = this.positiveCode6  = function(sa) {
			return sa.length;
		}
		// 五行
		this.fiveElements = function(sa) {
			return sa.length;
		}
		// 三中二 三中三
		this.selected3in2 = this.selected3in3 = function(sa) {
			return combination(sa, 3).length;
		}
		// 二全中 二中特 二码特串
		this.selected2in2 = this.selected2inExtra = this.selected2inBunch = function(sa) {
			return combination(sa, 2).length;
		}
		// 四全中
		this.selected4in4 = function(sa) {
			return combination(sa, 4).length;
		}
		// 平特一肖 平特一尾 特肖 正码 色波 特码 头尾数
		this.selected1zodiac = this.selected1trail = this.extraZodiac = this.positiveCode =
			this.color = this.extraCode = this.headAndTrail = this.positiveCode1Extra =
			this.positiveCode2Extra = this.positiveCode3Extra = this.positiveCode4Extra =
			this.positiveCode5Extra = this.positiveCode6Extra = this.totalZodiac = function(sa) {
			return sa.length;
		}
	},
	ThreeNumbersCalculator: function() {
	   // 接口方法
		this.calculate = function(methodName, selectedArray) {
			return eval("this." + methodName + '(selectedArray)');
		}
		// 定位胆
		this.locationCourage = this.locationCourageAttribute = function(sa) {
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				for(var y=0; y<sa[i].length; y++) {
					count++;
				}
			}
			return count;
		}
		// 二码 - 大小单双
		this.before2attribute = this.after2attribute = function(sa) {
			// if (sa.length == 1)
			// 	return sa.length;
			// else
			var isArray = function(o) {
				return Object.prototype.toString.call(o) === '[object Array]';
			}
			if (isArray(sa[0]) && sa[1] && isArray(sa[1])) {
				return permutate(sa).length;
			}else{
				return sa.length;
			}

		}
		// 二码 - 直选
		this.before2directly = this.after2directly = function(sa) {
			return permutate(sa).length;
		}
		// 二码 - 组选
		this.before2combination = this.after2combination = function(sa) {
			return combination(sa, 2).length;
		}
		// 直选
		this.directly = function(sa) {
			return permutate(sa).length;
		}

		// 直选和值
		this.directlySum = function(sa) {
			var counts = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
			var count = 0;
			for(var i=0; i<sa.length; i++) {
				count += counts[sa[i]];
			}
			return count;
		}
		// 组3
		this.combination3 = function(sa) {
			return combination(sa, 2).length * 2;
		}
		// 组3和值
		this.combination3Sum = function(sa) {
			/* end */
			var counts = [];
			var min = 0, max = 9;
			for (var i = min; i <= max; i++) {

				for (var j = min; j <= max; j++) {

					for (var k = min; k <= max; k++) {

						if ( i == j && k != j) {
							counts.push(i+j+k);
						}
					}
				}
			}
			// console.log(counts);
			var count = 0;
			var arr = [];
			// arr = duplicate(counts);
			for (var i = 1; i <= 26; i++) {
				var sum = 0;
				for (var j = 0; j < counts.length; j++) {
					var e = counts[j];
					if (e == i) {
						++sum;
					}
				}
				arr.push(sum);
			}
			// console.log(arr);
			for (var i = 0; i < sa.length; i++) {
				var e = sa[i];
				count += arr[e-1];
			}
			// console.log(count);
			return count;
		}
		// 组6
		this.combination6 = function(sa) {
			return combination(sa, 3).length;
		}
		// 组6和值
		this.combination6Sum = function(sa) {
			var counts = [1, 1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 1];
			var count = 0;
			// for(var i=0; i<sa.length; i++) {
			// 	count += this.com6sum(sa[i]);
			// }
			for (var i = 0; i < sa.length; i++) {
				var e = sa[i];
				count += counts[e-3];
			}
			return count;
		}

		this.com6sum = function(number) {
			if(number == 3 || number == 4 || number == 23 || number == 24) return 1;
			else if(number == 5 || number == 22) return 2;
			else if(number == 6 || number == 21) return 3;
			else if(number == 7 || number == 20) return 4;
			else if(number == 8 || number == 19) return 5;
			else if(number == 9 || number == 18) return 7;
			else if(number == 10 || number == 17) return 8;
			else if(number == 11 || number == 16) return 9;
			else if(number == 12 || number == 13 || number == 14 || number == 15) return 10;
			return 1;
		}
		this.notLocationSelected1 = function(sa){
			return sa.length;
		}
		this.notLocationSelected2 = function(sa){
			if (sa.length < 2) { return 0; }
			return combination(sa, 2).length;
		}
	},

}
/*
  重构随机选择？
*/
var randomChoose = {
	do: function(Selected, Data, Fn) {
		var localChooseQueue = [], randomChooseIndexs = "";
		var randomNumF = function(min, max) {
			return parseInt(Math.random() * (max - min) + min);
		}
    var $active = "on";
    // console.log("random");
		if (!Data) { return ; }
		var typeLayout = Data.layout;
		var methodName = Data.lotteryMethodName;
		var chooseArrNum = $(Selected).length;
    // console.log(Data);
    // console.log(chooseArrNum);

		$(Selected).removeClass($active);
		if (Data.minSel == 1) {
			//定位胆
			if (typeLayout.length == 0) { return ; }
			var iIndex = randomNumF(0, chooseArrNum);
			// $(Selected).eq(iIndex).addClass('active');
      $(Selected).eq(iIndex).addClass($active);
		} else {
			//单行多行
			if (typeLayout.length > 1) {
				//多行
				//确定一行有多少数
				var selectNums = typeLayout[0].numbers.split('|').length;
				//胆拖？duplex indexof > -1
				if (methodName.indexOf("duplex") > -1) {
					var iStr = "";
					var one = typeLayout[0];
					var iIndex = randomNumF(0, selectNums-1);
					var $minSel = parseInt(Data.minSel);
					if ($minSel == 0) {
						$minSel = 3;
					}
					iStr += iIndex;
					$(Selected).eq(iIndex).addClass($active);

					var two = typeLayout[1];
					for (var i = 0; i < $minSel-1; i++) {
						var jIndex = 0;
						var twoIndex = function() {
							jIndex = randomNumF(selectNums, selectNums*2-1);
							var sameInx = jIndex%(selectNums);
							if (iStr.indexOf(sameInx) > -1 ) {
								twoIndex();
							}else {
								iStr += sameInx;
							}
						}
						twoIndex();
						$(Selected).eq(jIndex).addClass($active);
            // console.log(jIndex);
					}

				} else {
					//一般多行，每行数据都不一样,用数据记下每次选择的index，然后每次随机取不同
					var iStr = "";
					for (var i = 0; i < typeLayout.length; i++) {
						var row = typeLayout[i];
						var iIndex = 0
						var getDiff = function() {
							iIndex = randomNumF(i*selectNums, (i+1)*selectNums-1);
							var sameInx = iIndex%(selectNums);
							if (iStr.indexOf(sameInx) > -1 ) {
								getDiff();
							} else {
								iStr += sameInx;
							}
							// return jIndex;
						}

						getDiff();
						// console.log(iIndex);
						$(Selected).eq(iIndex).addClass($active);

					}
				}

			} else {
				//单行
				if (typeLayout.length == 0) { return ; }
				//TODO 根据minsel选择
				var min = typeLayout[0].minSel;
				if (parseInt(min) > 1) {
					var iStr = "";
					if (chooseArrNum - min <= 2) {
						$(Selected).each(function(inx){
							$(this).addClass($active);
						});
						for (var i = 0; i < (chooseArrNum - min); i++) {
							// min[i]
							var iIndex = 0;
							var getDiff = function(){
								iIndex = randomNumF(0, chooseArrNum);
								var sameInx = iIndex;
								if (iStr.indexOf(sameInx) > -1 ) {
									getDiff();
								}else {
									iStr += sameInx;
								}
							}
							getDiff();
							$(Selected).eq(iIndex).removeClass($active);
              // console.log(iIndex);
						}
					} else {
						for (var i = 0; i < min; i++) {
							// min[i]
							var iIndex = 0;
							var getDiff = function(){
								iIndex = randomNumF(0, chooseArrNum);
								var sameInx = iIndex;
								if (iStr.indexOf(sameInx) > -1 ) {
									getDiff();
								}else {
									iStr += sameInx;
								}
							}
							getDiff();
							$(Selected).eq(iIndex).addClass($active);
              // console.log(iIndex);
						}
					}

				} else if (min != 0) {
					var iIndex = randomNumF(0, chooseArrNum);
					$(Selected).eq(iIndex).addClass($active);
          // console.log(iIndex);
				}

			}
		}

		if (typeof Fn == "function") {
			Fn(Selected, Data);
		}
	},
	auto: function(Data, Fn) {
		//自动投注，方法he机选类似，但数字直接从layout里的numbers里面取
		//思路，返回有效数组
		var randomNumF = function(min, max) {
			return parseInt(Math.random() * (max - min) + min);
		}
		if (!Data) { return ; }
		// console.log(Data);
		var tLayout = Data.layout;
		//console.log(typeLayout);
		var methodName = Data.lotteryMethodName;

		if (tLayout.length == 0) { return ; }
		var result = [], price = 2.00;

		var pre = {
          playId:Data.playId,
          issue:"",
          numbers:"",
          unitFee:"",//单注价钱
          rebate:"0.00",
          odds:"0",
        }
        // var doUnit = (arr){
        // 	return (price*arr.length).toFixed(2);
        // }
		if (Data.minSel == 1) {
			//定位胆
			// var iIndex = randomNumF(0, chooseArrNum);
			// $(Selected).eq(iIndex).addClass('active');
			// 任意选中一行，任意选择一项
			if (tLayout.length == 1) {
				var rowIndex = 0;

				var numArr = tLayout[rowIndex].numbers.split("|");
				var colIndex = randomNumF(0, numArr.length-1);
				result.push(numArr[colIndex]);

				pre.numbers = result.join("|");
			}else {
				var rowIndex = randomNumF(0, tLayout.length-1);

				for (var i = 0; i < tLayout.length; i++) {
					result[i] = [];
					if (i != rowIndex) {
						result[i].push("-");
					} else {
						var numArr = tLayout[rowIndex].numbers.split("|");
						var colIndex = randomNumF(0, numArr.length-1);
						result[i].push(numArr[colIndex]);
					}

					// tLayout[i]
				}


				pre.numbers = result.join(",");
			}
			//填充空的数组

			if (parseInt(Data.maxPrize) == 0) {
				pre.odds = tLayout[rowIndex].prizes.split('|')[colIndex];
			} else {
				pre.odds = Data.maxPrize;
			}
				//pre.unitFee = doUnit(result);
			if (typeof Fn == "function") {
				Fn(pre);
			}
		} else {
			var methodName = Data.lotteryMethodName;
			var layoutMinSel = Data.minSel;
			//多行
			if (tLayout.length > 1) {
				var selectNums = tLayout[0].numbers.split('|').length;
				//胆拖？duplex indexof > -1
				if (methodName.indexOf("duplex") > -1) {
					var iStr = "";
					var one = tLayout[0];
					var iIndex = randomNumF(0, selectNums-1);
					if (layoutMinSel == 0) {
						layoutMinSel = 3;
					}
					iStr += iIndex;
					result[0] = [];
					result[0].push(one.numbers.split("|")[iIndex]);
					// $(Selected).eq(iIndex).addClass("active");
					var two = tLayout[1];
					result[1] = [];
					for (var i = 0; i < layoutMinSel-1; i++) {
						var jIndex = 0;
						var twoIndex = function(){
							jIndex = randomNumF(0, selectNums-1);
							var sameInx = jIndex%(selectNums);
							if (iStr.indexOf(sameInx) > -1 ) {
								twoIndex();
							} else {
								iStr += sameInx;
							}
						}
						twoIndex();
						result[1].push(two.numbers.split("|")[jIndex]);
						// $(Selected).eq(jIndex).addClass("active");
					}
					if (parseInt(Data.maxPrize) == 0) {
						// pre.odds = tLayout[rowIndex].prizes.split('|')[colIndex];
					} else {
						pre.odds = Data.maxPrize;
					}
					pre.numbers = result[0].join("|")+","+result[1].join("|");

				}else {
					//一般多行，每行数据都不一样,用数据记下每次选择的index，然后每次随机取不同
					var iStr = "";
					//填充空的数组
					for (var i = 0; i < tLayout.length; i++) {
						var row = tLayout[i],
							selectArr = row.numbers.split("|"),
							selectNums = selectArr.length;
						result[i] = [];
						var iIndex = 0
						var getDiff = function() {
							// iIndex = randomNumF(i*selectNums, (i+1)*selectNums-1);
							iIndex = randomNumF(0, selectNums-1);
							var sameInx = iIndex%(selectNums);
							if (iStr.indexOf(sameInx) > -1 ) {
								getDiff();
							}else {
								iStr += sameInx;
							}
						}
						getDiff();
						result[i].push(selectArr[iIndex]);
						// $(Selected).eq(iIndex).addClass("active");
						if (parseInt(Data.maxPrize) == 0) {
							var p = row.prizes.split('|')[iIndex];
							if (p > pre.odds)
								pre.odds = p;
						}
					}
					if (parseInt(Data.maxPrize) != 0) {
						pre.odds = Data.maxPrize;
					}
					for (var i = 0; i < result.length; i++) {
						var r = result[i];
						result[i] = result[i].join("|");
					}
					result = result.join(",");
					pre.numbers = result;
				}

				if (typeof Fn == "function") {
					Fn(pre);
				}
			} else {
				//TODO 根据minsel选择
				var chooseArr = tLayout[0].numbers.split('|'),
				    chooseArrNum = chooseArr.length;
				var min = tLayout[0].minSel;
				if (parseInt(min) > 1) {
					var iStr = "";
					for (var i = 0; i < min; i++) {
						// min[i]
						var iIndex = 0;
						var getDiff = function() {
							iIndex = randomNumF(0, chooseArrNum-1);
							var sameInx = iIndex;
							if (iStr.indexOf(sameInx) > -1 ) {
								getDiff();
							} else {
								iStr += sameInx;
							}
						}
						getDiff();
						result.push(chooseArr[iIndex])
						if (parseInt(Data.maxPrize) == 0) {
							var p = tLayout[0].prizes.split('|')[iIndex];
							if (p > pre.odds)
								pre.odds = p;
						}
						// $(Selected).eq(iIndex).addClass("active");
					}
				} else if (min != 0) {
					var iIndex = randomNumF(0, chooseArrNum-1);
					// $(Selected).eq(iIndex).addClass('active');
					result.push(chooseArr[iIndex]);
					if (parseInt(Data.maxPrize) == 0) {
						pre.odds = tLayout[0].prizes.split('|')[iIndex];
					}
				}
				if (parseInt(Data.maxPrize) != 0) {
					pre.odds = Data.maxPrize;
				}
				//pre.unitFee = doUnit(result);
				pre.numbers = result.join(",");
				// console.log(result);
				if (typeof Fn == "function") {
					Fn(pre);
				}
			}

		}
	}
}
