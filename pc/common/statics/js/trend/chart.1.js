$(function () {
  var vm = new Vue({
    el: '#trend-list',
    data: {
      test: 'trend-list',
      trendList: ['全部','时时彩','11选5系列','快三','PK10','PC蛋蛋','3D系列','六合彩'],
      trendClassName: ['all', 'FrequentLottery', 'ElevenPickFive', 'QuickThree', 'PK10', 'PCEggs', 'FrequentHappy', 'SixMark'],
      active:0,
      subActive: null,
      trendItems: [],
      liveTemplate: [],
      liveTemplateData: [],
      luckNumberIcon: [
        null,
        '/pc/common/statics/img/draw/FrequentLottery.png',
        '/pc/common/statics/img/draw/ElevenPickFive.png',
        '/pc/common/statics/img/draw/QuickThree.png',
        '/pc/common/statics/img/draw/pk10.png',
        '/pc/common/statics/img/draw/PCEggs.png',
        '/pc/common/statics/img/draw/FrequentHappy.png',
        '/pc/common/statics/img/draw/SixMark.png',
        '/pc/common/statics/img/draw/Football.png'
      ],
      lotteryItems: {
        FrequentLottery: [4, 6, 45 ,12 , 11,55,61,62,63],
        ElevenPickFive: [49, 39, 5, 13, 15, 14,52],
        QuickThree: [44 ,37 ,38 ,36 ,35 ,34 ,33 ,32 ,27 ,31 ,1 ,30,50],
        PK10: [3, 8, 46, 43, 29,51,58,59,60],
        PCEggs: [7, 17, 47,54,56,57],
        FrequentHappy: [42, 40, 41, 2, 18, 10],
        SixMark: [28, 9, 48,53]
      },
      liveObject: {},
      isPk10Class: false,
      td: 'td',
      templateData: {
        QuickThree: {
          nums: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18],
          state: ['大','小','单','双'],
          shape: ['三同号','三不同号','三连号','二同号','二不同号']
        },
        FrequentHappy: {
          nums: [0,1,2,3,4,5,6,7,8,9],
          state: ['大单', '小单', '大双', '小双'],
          shape: ['和值', '跨度', '形态', '百位', '十位', '个位']
        },
        PK10: {
          nums: [1,2,3,4,5,6,7,8,9,10],
          state: ['冠军','亚军','季军','第四名','第五名','第六名','第七名','第八名','第九名','第十名'],
          shape: ['大', '小', '单', '双']
        },
        FrequentLottery: {
          nums: [0,1,2,3,4,5,6,7,8,9],
          state: ['万位', '千位', '百位', '十位', '个位', '前三', '中三', '后三']
        },
        SixMark: {
          state: ['正码一', '正码二', '正码三', '正码四', '正码五', '正码六', '特码', '色波', '五行', '头数', '尾数', '家禽野兽'],
          shape: ['总数', '大小', '单双'],
          shape2: ['单双', '大小', '合单双', '合大小', '大小尾'],
          shape3: ['总和'],
          shape4: ['特码']
        },
        PCEggs: {
          nums: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
          state: ['和值', '色波', '大小', '单双'],
          green: [1,4,7,10,16,19,22,25],
          blue: [2,5,8,11,17,20,23,26],
          red: [3,6,9,12,15,18,21,24]
        },
        ElevenPickFive: {
          nums: [01,02,03,04,05,06,07,08,09,10,11],
          state: ['第一位', '第二位', '第三位', '第四位', '第五位']
        }
      },
      dateList: [20,30,50,100],
      is115Class: false,
      liveTemplateName: '',
      missionHz: [],
      liActive: 0,
      getNumber: 20,
      title: {
        QuickThree: [
          {
            text: '号码走势',
            nums: [ 1, 2, 3, 4, 5, 6 ],
            border: true,
            symbol: 'trend'
          },
          {
            text: '和值',
            nums: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18],
            border: true,
            symbol: 'sumValue'
          },
          {
            text: '和值组合状态',
            nums: [ '大', '小', '单', '双' ],
            border: true,
            symbol: 'issue'
          },
          {
            text: '号码形态',
            nums: [ '三同号', '三不同号', '三连号', '二同号', '二不同号'],
            border: true,
            symbol: 'issue'
          },
        ],
        FrequentLottery: [],
        ElevenPickFive: [],
        PK10: [],
        PCEggs: [],
        FrequentHappy: [],
        SixMark: [], 
      },
      //走势图
      showPolyline: true,
      showHierarchy: true,
      showLose: true,
      showStatistics: true,
      showAuxiliary: true,
      issueList: [30,50,100,200,300],
      currentIssue: 0
    },
    created() {
      this.getLotteryInit()
      var urlLottery = this.GetRequest()
      console.log(urlLottery)
    },
    computed: {
      returnTrendContent() {
        var _active = this.trendClassName[this.active];
        var _trendItems = this.trendItems;
        // console.log(_trendItems)
        return _active !== 'all'
          ? _trendItems.filter(e => e.lotteryClassName.includes(_active))
          : _trendItems
      },
      returnHighList() {
        var _trendItems = this.trendItems;
        return _trendItems.filter(e => e.type === 'h')
      },
      returnLowList() {
        var _trendItems = this.trendItems;
        return _trendItems.filter(e => e.type === 'l')
      },
    },
    methods: {
      controlPolyline() {
        // 控制走势折线
        this.showPolyline = !this.showPolyline;
      },
      controlHierarchy() {
        // 控制遗漏分层
        this.showHierarchy = !this.showHierarchy;
      },
      controlLose() {
        // 控制遗漏分层
        this.showLose = !this.showLose;
      },
      controlStatistics() {
        // 控制统计
        this.showStatistics = !this.showStatistics;
      },
      controlAuxiliary() {
        // 控制统计
        this.showAuxiliary = !this.showAuxiliary;
      },
      changeIssue(index) {
        // 改变显示最近期数
        this.currentIssue = index;
      },
      GetRequest () {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
              theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
      },
      getLottery (num,index) {
        var _t = this;
        _t.liActive = index
        _t.getNumber = num
        _t.subSwitchTabs(_t.subActive, _t.liveObject)
        // console.log(num)
      },
      constitute(zuSan, zuLiu, baoZi) {
        if (zuSan) {
          return '组三'
        }
        if (zuLiu) {
          return '组六'
        }
        if (baoZi) {
          return '豹子'
        }
      },
      // 时时乐 - 大小单双
      smallBig(num) {
        if (num < 5 && num % 2 === 0) {
          return { name: '小双' , color: '#286fe3'}
        }
        if (num < 5 && num % 2 !== 0) {
          return { name: '小单' , color: '#286fe3'}
        }
        if (num > 4 && num % 2 === 0) {
          return { name: '大双' , color: '#da1c0e'}
        }
        if (num > 4 && num % 2 !== 0) {
          return { name: '大单' , color: '#da1c0e'}
        }
      },
      // 时时乐 - 跨度
      maxSpan(arr) {
        var max = Math.max.apply(null, arr)
        // console.log('max: ', max);
        var min = Math.min.apply(null, arr)
        // console.log('min: ', min);
        return max - min
      },
      returnFiveElements (val) {
        var arr = JSON.parse(localStorage.getItem('ballSetColorDicPc')).val
        // console.log(arr)
        var gold = ['04','05','18','19','26','27','34','35','48','49']
        var wood = ['01','08','09','16','17','30','31','38','39','46','47']
        var water = ['06','07','14','15','22','23','36','37','44','45']
        var fire = ['02','03','10','11','24','25','32','33','40','41']
        var soil = ['12','13','20','21','28','29','42','43']
        val = val.toString()
        if (val.length === 1) {
          val = '0' + val
        }
        for (const key in arr) {
          if (arr.hasOwnProperty(key)) {
            switch (key) {
              case '金':
                gold = arr[key]
                break;
              case '木':
                wood = arr[key]
                break;
              case '水':
                water = arr[key]
                break;
              case '火':
                fire = arr[key]
                break;
              case '土':
                soil = arr[key]
                break;
            }
          }
        }

        if (gold.includes(val)) {
          return '金'
        }
        if (wood.includes(val)) {
          return '木'
        }
        if (water.includes(val)) {
          return '水'
        }
        if (fire.includes(val)) {
          return '火'
        }
        if (soil.includes(val)) {
          return '土'
        }
        return val
      },
      returnTrendNumbPk10 (val, luck, index) {
        var newArray = val.split(',')
        var trendActive = '';
        if (Number(newArray[index]) === luck) {
          trendActive = 'trend-active-ssl'
        }
        return trendActive
      },
      // 时时乐 - 开奖高亮
      returnTrendNumbSsl(val, luck, index) {
        var newArray = val.split(',')
        var trendActive = '';
        if (newArray[index] === String(luck)) {
          trendActive = 'trend-active-ssl'
        }
        return trendActive
      },
      // 和值类最大连出
      maximums(olvNum) {
        var arConunt = 0;
        var acCount = 0;
        var _arrAy = [];
        var _acAy = [];
        var _result
        var _ac
        this.liveTemplateData.map(e => {
          if (olvNum !== e.sumValue) {
            arConunt++
            acCount = 0
          } else {
            acCount++
            arConunt = 0
          }
          _arrAy.push(arConunt)
          _acAy.push(acCount)
        })
        _result = _arrAy.length > 0 ? Math.max(..._arrAy) : 0
        _ac = _acAy.length > 0 ? Math.max(..._acAy) : 0
        // console.log({ _result, _ac })
        return { _result, _ac }
      },
      maximumSsl(olvNum, index) {
        var arConunt = 0;
        var acCount = 0;
        var _arrAy = [];
        var _acAy = [];
        var _result
        var _ac

        this.liveTemplateData.map(e => {
          if (Number(e.numberArray[index]) !== olvNum) {
            arConunt++
            acCount = 0
          } else {
            acCount++
            arConunt = 0
          }
          _arrAy.push(arConunt)
          _acAy.push(acCount)
        })
        _result = _arrAy.length > 0 ? Math.max(..._arrAy) : 0
        _ac = _acAy.length > 0 ? Math.max(..._acAy) : 0
        return { _result, _ac }
      },
      // 号码走势最大连出
      maximum(olvNum) {
        var arConunt = 0;
        var acCount = 0;
        var _arrAy = [];
        var _acAy = [];
        var _result
        var _ac
        this.liveTemplateData.map(e => {
          if (!e.numberArray.includes(String(olvNum))) {
            arConunt++
            acCount = 0
          } else {
            acCount++
            arConunt = 0
          }
          _arrAy.push(arConunt)
          _acAy.push(acCount)
        })
        _result = _arrAy.length > 0 ? Math.max(..._arrAy) : 0
        _ac = _acAy.length > 0 ? Math.max(..._acAy) : 0
        // console.log({ _result, _ac })
        return { _result, _ac }
      },
      // 和值出现次数
      occurrencesHz(olvNum) {
        var conunt = 0
        this.liveTemplateData.filter(e => {
          if (olvNum === e.sumValue) {
            conunt++
          }
        })
        return conunt
      },
      occurrencesPc(olvNum) {
        var conunt = 0;
        this.liveTemplateData.filter(e => {
          if (Number(e.sumValue) === olvNum) {
            conunt ++
          }
        })
        return conunt
      },
      // 时时乐 - 出现次数
      occurrencesSsl(olvNum, index) {
        var conunt = 0
        this.liveTemplateData.filter(e => {
          if (Number(e.numberArray[index]) === olvNum){
            conunt ++
          }
        })
        return conunt
      },
      // PK10走势平均次数
      // 走势出现次数
      occurrences (olvNum) {
        var conunt = 0
        this.liveTemplateData.filter(e => {
          e.numberArray.filter(y => {
            if (Number(y) === olvNum) {
              conunt++
            }
          })
          return conunt
        })
        // console.log(this.templateData.QuickThree.mission)
        // this.templateData.QuickThree.mission.push(conunt)
        return conunt
      },
      returnHeJi(type) {
        possarray = this.liveTemplateData.filter(e => {
          if (e.size === type || e.singleDouble === type) {
            return e.size
          }
        })
        return possarray.length
      },
      returnTongHao(type) {
        // console.log(type)
        possarray = this.liveTemplateData.filter(e => {
          // console.log(e[type])
          if (e[type]) {
            return e[type]
          }
        })
        // console.log(possarray)
        return possarray.length
      },
      returnTuoLaJi (arr) {
        this.isErTongHao = false;
        var isTlj = false;
        for (var index = 0; index < arr.length - 1; index++) {
          if (arr[index + 1] - arr[index] === 1) {
            isTlj = true
          } else {
            return false
          }
        }
        // console.log(isTlj)
        return isTlj
      },
      returnErTongHao (arr, type) {
        // 二同号
        if (type) {
          var value = this.returnLuckNumber(arr, true)
        } else {
          var value = this.returnLuckNumber(arr)
        }
        this.isErTongHao = true;
        return value.length === 2 ? true : false;
      },
      returnChampionDs (val) {
        // PK10 冠军单双
        if (val % 2 === 0) {
          return { name: '双', color: '#da1c10'}
        } else {
          return { name: '单', color: '#4777c3'}
        }
      },
      returnChampionDx (val) {
        // PK10 冠军大小
        if (val > 5) {
          return { name: '大', color: '#da1c10'}
        } else {
          return { name: '小', color: '#4777c3'}
        }
      },
      // 时时彩组合
      returnZuhe(val1, val2, val3) {
        var newSet = Array.from(new Set([val1, val2, val3]))
        if (newSet.length === 3) {
          return '组六'
        }
        if (newSet.length === 2) {
          return '组三'
        }
        if (newSet.length === 1) {
          return '豹子'
        }
      },
      // 时时彩位数
      returnWeiShuDs(val) {
        if (val > 4 && val %2 === 0) {
          return { name: '大双', color: '#da1c10'}
        }
        if (val > 4 && val %2 !== 0) {
          return { name: '大单', color: '#da1c10'}
        }
        if (val < 5 && val %2 === 0) {
          return { name: '小双', color: '#4777c3'}
        }
        if (val < 5 && val %2 !== 0) {
          return { name: '小单', color: '#4777c3'}
        }
      },
      returnChampionHzDs(val1, val2) {
        if((parseInt(val1) + parseInt(val2)) % 2 === 0) {
          return { name: '双', color: '#da1c10'}
        } else {
          return { name: '单', color: '#4777c3'}
        }
      },
      returnChampionHzDx(val1, val2) {
        if((parseInt(val1) + parseInt(val2)) > 10) {
          return { name: '大', color: '#da1c10'}
        } else {
          return { name: '小', color: '#4777c3'}
        }
      },
      returnSanTongHao (arr, type) {
        // 三同号
        if (type) {
          var value = this.returnLuckNumber(arr, true)
        } else {
          var value = this.returnLuckNumber(arr)
        }
        return value.length === 1 ? true : false;
      },
      returnSanBuTongHao (arr, type) {
        // 三不同和二不同
       if (type) {
          var value = this.returnLuckNumber(arr, true)
        } else {
          var value = this.returnLuckNumber(arr)
        }
        this.isErTongHao = false;
        return value.length === 3 ? true : false;
      },
      returnLuckNumber(luckNumber, type) {
        if (type) {
          var arr1 = luckNumber;//数组排序
        } else {
          var arr1 = luckNumber.sort();//数组排序
        }

        var dedupeArr = Array.from(new Set(arr1));
        var conut = 0;
        var conutArray = [];
        var obj = {};
        dedupeArr.forEach(i => {
          count = 0;
          arr1.forEach(j => {
            if (i === j) {
              conut++;
            }
          })
          obj[i] = conut
          conutArray.push(conut)
          conut = 0
        })
        return conutArray
      },
      returnSize (number) {
        return number > 10 ? '大' : '小'
      },
      returnSingleDouble (number) {
        return number % 2 === 0 ? '双' : '单'
      },
      returnSum (luckNumber) {
        var arr = luckNumber.split(',')
        var parcie = 0;
        arr.filter(e => {
          parcie += Number(e)
        })
        // var nu = arr.filter(e => parcie += e);
        // console.log(nu)
        return parcie
      },
      returnTrendNo (luckNumber, sub) {
        // 这里是辨别数字
        var arr = luckNumber.split(',')
        processArr = arr.filter(function(value) {
          return value == sub;
        })
        if (processArr.length > 1) {
          return processArr.length
        } else {
          return false
        }
      },
      returnTrendNumb (val, luck) {
        var newArray = val.split(',')
        var trendActive = '';
        newArray.forEach(element => {
          if (element === String(luck)) {
            trendActive = 'trend-active'
          }
        });
        return trendActive
      },
      getLotteryInit() {
        var _t = this
        Utils.request('/front/lottery/init.do', {}, function(res){
          let _array = ['Luck28']
          let _array2 = ['ThreeMinuteArrangeThree','ThreeMinuteFrequentHappy','ThreeMinuteThreeD','ArrangeThree','ThreeD','ShanghaiFrequentHappy']
          //
          res.data.filter(element => {
            if (_array.includes(element.lotteryClassName)) {
              element.lotteryClassName = '28PCEggs'
            }
            if (_array2.includes(element.lotteryClassName)) {
              element.lotteryClassName = 'FrequentHappy'
            }
          })
          _t.trendItems = res.data
        })
      },
      switchTabs(type) {
        this.active = type
        if (type === 0) {
          this.subActive = null
        } else {
          this.subActive = 0
          this.subSwitchTabs(0,this.returnTrendContent[0])
        }
      },
      subSwitchTabs(index, item) {
        layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        // console.log(item)
        this.subActive = index
        var _t = this
        var title = this.title
        var lotteryId = item.lotteryId
        var lotteryItems = this.lotteryItems
        var template = '';
        _t.liveObject = item
        this.trendClassName.slice(1).map(e => {
          lotteryItems[e].map(a => {
            if (lotteryId === a) {
              template = e
              return
            }
          })
        })
        this.liveTemplate = title[template]
        Utils.request('front/lottery/lottery_trend.do', {
          issueSum: _t.getNumber,
          lotteryId: lotteryId,
        }, function (res){
          layer.closeAll()
          var _lotteryId = '';
          Object.keys(_t.lotteryItems).forEach(key => {
            if (_t.lotteryItems[key].includes(res.data.body[0].lotteryId)) {
              _lotteryId = key
            }
          })
          res.data.body.filter((e) => {
            var price = 0;
            var _array = e.number.split(',')
            _array.filter((y) => {
              price += Number(y)
            })
            e.sumValue = price;
            e.numberArray = _array
            switch (_lotteryId) {
              case 'QuickThree':
                _t.liveTemplateName = _lotteryId;
                e.size = _t.returnSize(price);
                e.singleDouble = _t.returnSingleDouble(price);
                e.sanTongHao = _t.returnSanTongHao(_array);
                e.sanBuTongHao = _t.returnSanBuTongHao(_array);
                e.erTongHao = _t.returnErTongHao(_array);
                e.erBuTongHao = _t.returnSanBuTongHao(_array);
                e.tuoLaJi = _t.returnTuoLaJi(_array);
                _t.isPk10Class = false;
                _t.is115Class = false;
                break;
              case 'FrequentHappy':
                e.baoZi = _t.returnSanTongHao(_array, true);
                e.zuLiu = _t.returnSanBuTongHao(_array, true);
                e.zuSan = _t.returnErTongHao(_array, true);
                _t.isPk10Class = false;
                _t.is115Class = false;
                _t.liveTemplateName = _lotteryId;
                break;
              case 'PK10':
                e.gjds = _t.returnChampionDs(_array[0]);
                e.gjdx = _t.returnChampionDx(_array[0]);
                e.gjHzds = _t.returnChampionHzDs(_array[0],_array[1]);
                e.gjHzdx = _t.returnChampionHzDx(_array[0],_array[1]);
                _t.isPk10Class = true;
                _t.liveTemplateName = _lotteryId;
                break;
              case 'FrequentLottery':
                _t.isPk10Class = true;
                e.wanwei = _t.returnWeiShuDs(_array[0]);
                e.qianwei = _t.returnWeiShuDs(_array[1]);
                e.baiwei = _t.returnWeiShuDs(_array[2]);
                e.shiwei = _t.returnWeiShuDs(_array[3]);
                e.gewei = _t.returnWeiShuDs(_array[4]);
                e.qiansan = _t.returnZuhe(_array[0],_array[1], _array[2]);
                e.zhongsan = _t.returnZuhe(_array[1],_array[2], _array[3]);
                e.housan = _t.returnZuhe(_array[2],_array[3], _array[4]);
                _t.liveTemplateName = _lotteryId;
                break;
              case 'SixMark':
                e.sebo = sixNumToColor(_array[6]);
                e.wuxing = sixNumToZodiac(_array[6]);
                var jiaqin = ['鼠', '虎', '龙', '蛇', '猴', '兔']
                if (jiaqin.includes(e.wuxing)) {
                  e.wuxing = '野兽'
                } else {
                  e.wuxing = '家禽'
                }
                // console.log(e.wuxing);
                switch (e.sebo) {
                  case 'red':
                    e.seboCn = '红';
                    break;
                  case 'green':
                    e.seboCn = '绿';
                    break;
                  case 'blue':
                    e.seboCn = '蓝';
                    break;
                  case 'grey':
                    e.seboCn = '灰';
                    break;
                }
                _t.isPk10Class = false;
                _t.is115Class = false;
                _t.liveTemplateName = _lotteryId;
                break;
              case 'PCEggs':
                if (_t.templateData.PCEggs.green.includes(e.sumValue)) {
                  e.sebo = { type: '绿', color: 'green'}
                } else if (_t.templateData.PCEggs.blue.includes(e.sumValue)) {
                  e.sebo = { type: '蓝', color: 'blue'}
                } else if (_t.templateData.PCEggs.red.includes(e.sumValue)) {
                  e.sebo = { type: '红', color: 'red'}
                } else {
                  e.sebo = { type: '-', color: 'makr'}
                }
                _t.isPk10Class = false;
                _t.isPk10Class = false;
                _t.liveTemplateName = _lotteryId;
                break;
              case 'ElevenPickFive':
                _t.isPk10Class = false;
                _t.is115Class = true;
                _t.liveTemplateName = _lotteryId;
                break;
            }
          })
          _t.liveTemplateData = res.data.body
          // console.log(_t.liveTemplateData)
        })
      }
    }
  })
})