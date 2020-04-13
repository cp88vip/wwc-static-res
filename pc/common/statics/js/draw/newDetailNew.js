$(function () {
  var vm = new Vue({
    el: '#luckNumberList',
    data: {
      test: 'sadfhjk',
      luckNumberList: [],
      luckNumberTabel: [],
      luckNumberTop: ['全部', "快三", " PC蛋蛋", "时时彩", "PK10", "六合彩", "11选5", "七星彩", "3D系列", "竞技彩"],
      luckNumberName: ['all', 'QuickThree', 'PCEggs', 'FrequentLottery', 'pk10', 'SixMark', 'ElevenPickFive','Seven', 'FrequentHappy', 'Football'],
      luckNumberIcon: [
        null,
        '/pc/common/statics/img/draw/QuickThree.png',
        '/pc/common/statics/img/draw/PCEggs.png',
        '/pc/common/statics/img/draw/FrequentLottery.png',
        '/pc/common/statics/img/draw/pk10.png',
        '/pc/common/statics/img/draw/SixMark.png',
        '/pc/common/statics/img/draw/ElevenPickFive.png',
        "/pc/common/statics/img/draw/SevenStar.png",
        '/pc/common/statics/img/draw/FrequentHappy.png',
        '/pc/common/statics/img/draw/Football.png'
      ],
      liveLuckNumber: null,
      luckTemplate: {},
      lotteryItems: {
        FrequentLottery: [4, 6, 45, 12, 11, 55, 61, 62, 63],
        ElevenPickFive: [49, 39, 5, 13, 15, 14, 52],
        QuickThree: [44, 37, 38, 36, 35, 34, 33, 32, 27, 31, 1, 30, 44, 50],
        pk10: [3, 8, 46, 43, 29, 51, 58, 59, 60],
        PCEggs: [7, 17, 47, 54, 56, 57],
        FrequentHappy: [42, 40, 41, 2, 18, 10],
        SixMark: [28, 9, 48, 53],
        Football: [10001],
        Seven: [64,65,66]
      },
      footballData: [],
      date: Utils.getDistanceFromToday(0),
      dateIndex: 0,
      dataArray: ['今天', '昨天', '前天'],
      dataNumber: [Utils.getDistanceFromToday(0), Utils.getDistanceFromToday(-1), Utils.getDistanceFromToday(-2)],
      luckNumberTitle: '最新彩票开奖结果',
      activeTop: 0,
      activeTopSub: null,
      isZc: false,
      iskjgg: false
    },
    created() {
      var _this = this;
      Utils.request('front/lottery/init.do',{},function (res) {
        _this.luckNumberList = res.data
        var _array = ['Luck28']
        var _array2 = ['ThreeMinuteArrangeThree','ThreeMinuteFrequentHappy','ThreeMinuteThreeD','ArrangeThree','ThreeD','ShanghaiFrequentHappy']
        res.data.filter(element => {
          if (_array.includes(element.lotteryClassName)) {
            element.lotteryClassName = '28PCEggs'
          }
          if (_array2.includes(element.lotteryClassName)) {
            element.lotteryClassName = 'FrequentHappy'
          }
        })
      })
      // console.log(this.date)
      var urlLoottery = this.GetRequest()
      if (urlLoottery.lotteryId) {
        var param = {
          date: this.date,
          lotteryId: urlLoottery.lotteryId
        }
        this.getLuckNumberList(param)
      } else {
        this.getLuckNumber()
      }
    },
    mounted() {
      var _t = this;
      this.$nextTick(function () {
        window.laydate.render({
          elem: '#dates',
          value: _t.date,
          min:-30,
          max:0,
          done:function (value) {
            _t.date = value
            // console.log('_t.date: ', _t.date);
            // console.log('value: ', value);
            var param = {
              date: _t.date,
            }
            if (_t.activeTop === 9) {
              param.lotteryId = 10001
              _t.getMatchResults()
            } else {
              param.lotteryId = _t.liveLuckNumber.lotteryId
              _t.getLuckNumberList(param)
            }

          },
          trigger: 'click'
        })
      })
    },
    computed: {
      luckNumberLists () {
        var _active = this.luckNumberName[this.activeTop];
        var _luckNumberItems = this.luckNumberList;
        if (_active !== 'all') {
          _luckNumberItems.filter(e => {
            if (e.lotteryClassName.includes('PK10')) {
              e.lotteryClassName = e.lotteryClassName.toLowerCase()
            }
          })
        }
        return _active !== 'all'
          ? _luckNumberItems.filter(e => e.lotteryClassName.includes(_active))
          : _luckNumberItems
      },
    },
    methods: {
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
      dateClick (index) {
        // console.log(index)
        var param = {
          date: Utils.getDistanceFromToday(0)
        }
        // console.log(Utils.getDistanceFromToday(0))
        if (this.activeTop === 9) {
          param.lotteryId = 10001
        } else {
          param.lotteryId = this.liveLuckNumber.lotteryId
        }
        if (index === 1) {
          param.date = Utils.getDistanceFromToday(-1)
          this.date = Utils.getDistanceFromToday(-1)
        }
        if (index === 2) {
          param.date = Utils.getDistanceFromToday(-2)
          this.date = Utils.getDistanceFromToday(-2)
        }
        layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        this.date = this.dataNumber[index]
        if (this.activeTop === 9) {
          this.getMatchResults()
        } else {
          this.getLuckNumberList(param)
        }
      },
      effectiveSixMark (num) {
        var textstr = "鼠|牛|虎|兔|龙|蛇|马|羊|猴|鸡|狗|猪";
        var textArr = textstr.split("|");
        var dic = Utils.getStorage('ballSetColorDicPc');
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
      },
      colorSixMark (number) {
        var colors = JSON.parse(localStorage.getItem('ballSetColorDicPc')).val
        var colorClassName = ''
        if (colors['红'].includes(Number(number))) {
          colorClassName = 'red'
        }
        if (colors['绿'].includes(Number(number))) {
          colorClassName = 'green'
        }
        if (colors['蓝'].includes(Number(number))) {
          colorClassName = 'blue'
        }
        return colorClassName
      },
      returnBoSe(val1, val2, val3) {
        var _number = Number(val1) + Number(val2) + Number(val3)
        var obj = {
          color:'',
          name:''
        }
        switch (_number) {
          case 3:case 6:case 9:case 12:case 15:case 18:case 21:case 24:
            obj.name = '红'
            obj.color = 'red'
            break;
          case 2:case 5:case 8:case 11:case 17:case 20:case 23:case 26:
            obj.name = '蓝'
            obj.color = 'blue'
            break;
          case 1:case 4:case 7:case 10:case 16:case 19:case 22:case 25:
            obj.name = '绿'
            obj.color = 'green'
            break;
          default:
            obj.name = '无'
            obj.color = 'huise'
            break;
        }
        return obj
      },
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
      switchTabs(index) {
        console.log(index, '')
        this.activeTop = index
        layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        if (index === 0) {
          this.activeTopSub = null
          this.getLuckNumber()
        } else if (index === 9) {
          this.activeTopSub = 0
          this.getMatchResults()
        } else {
          this.activeTopSub = 0
          // console.log(this.date)
          var param = {
            date: this.date,
            lotteryId: this.luckNumberLists[0].lotteryId
          }
          this.getLuckNumberList(param)
        }
        this.liveLuckNumber = null;
        if (!this.liveLuckNumber) {
          this.luckNumberTitle = '最新彩票开奖结果'
        }
      },
      switchTabsSub(index,item) {
        this.activeTopSub = index
        layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        var param = {
          date: this.date,
          lotteryId: item.lotteryId
        }
        this.getLuckNumberList(param)
      },
      openWin (name,lotteryId) {
        __openWin(name,lotteryId)
      },
      getMatchResults () {
        var _this = this
        var param = {
          date: _this.date,
          lotteryId: 10001
        }
        Utils.request('front/football/pc_match_results.do', param , function (res) {
          layer.closeAll()
          _this.footballData = res.data
        })
      },
      getLuckNumberList (param) {
        var _this = this;
        Utils.request('pc/front/lottery/get_luck_number_list.do', param , function (res) {
          layer.closeAll()
          if (res.data.list && res.data.list.length > 0) {
            _this.luckNumberTabel = res.data.list
            _this.liveLuckNumber = res.data.data
            _this.luckNumberTitle = res.data.data.name + '开奖公告'
            for (let i = 0; i < _this.luckNumberTabel.length; i++) {
              _this.luckNumberTabel[i].number = _this.luckNumberTabel[i].number.split(',')
              _this.luckNumberTabel[i].hezhi = _this.luckNumberTabel[i].number.reduce(function (prev, cur) {
                return Number(prev) + Number(cur)
              });
              _this.luckNumberTabel[i].name = res.data.data.name
              _this.luckNumberTabel[i].type = res.data.data.type
              _this.luckNumberTabel[i].frequency = res.data.data.frequency
              _this.luckNumberName.slice(1).map(e => {
                _this.lotteryItems[e].map(a => {
                  if (_this.luckNumberTabel[i].lotteryId === a) {
                    _this.luckNumberTabel[i].classNama = e
                  }
                })
              })
            }
            _this.luckTemplate = _this.luckNumberTabel[0]
            _this.luckTemplate.issueNum = _this.liveLuckNumber.issueNum
            _this.activeTopSub = _this.luckTemplate.lotteryId
            // console.log(_this.luckNumberTabel)
            // console.log(_this.luckTemplate)
            // console.log(_this.liveLuckNumber)
          } else {
            _this.luckNumberTabel = []
            _this.luckNumberTitle = res.data.data.name + '开奖公告'
            _this.liveLuckNumber = res.data.data
          }
        })
      },
      getLuckNumber (param) {
        var _this = this
        Utils.request('pc/front/lottery/luck_number.do', {} , function (res) {
          _this.luckNumberTabel = res.data
          layer.closeAll()
          // console.log(_this.lotteryItems)
          for (var i = 0; i < _this.luckNumberTabel.length; i++) {
            // console.log(_this.luckNumberTabel[i])
            _this.luckNumberTabel[i].number = _this.luckNumberTabel[i].number.split(',')
            //计算和值
            _this.luckNumberTabel[i].hezhi = _this.luckNumberTabel[i].number.reduce(function (prev, cur) {
              return Number(prev) + Number(cur)
            });
            // 赋值lotteryNama
            _this.luckNumberName.slice(1).map(e => {
              _this.lotteryItems[e].map(a => {
                if (_this.luckNumberTabel[i].lotteryId === a) {
                  _this.luckNumberTabel[i].classNama = e
                }
              })
            })
          }
        })
      }
    },
  })
})