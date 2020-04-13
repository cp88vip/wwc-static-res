$(function(){
  var vm = new Vue({
    el: "#gamecontent",
    data:{
      platformList: [],
      currentPlatform: {},
      platformType: null,
      gameName: null,
      gameType: null,
      curPlatIndex: 0,
      offset: 0,
      count: 15,
      platformDetail: [],
      totolPage: 1,
      currentPage: 1,
      subNavList: [],
      curSubNav: -1,
      allSubCode: null,
      type: null,
      code: null
    },
    methods:{
     getQueryVariable: function(variable){
              var query = window.location.search.substring(1);
              var vars = query.split("&");
              for (var i=0;i<vars.length;i++) {
                      var pair = vars[i].split("=");
                      if(pair[0] == variable){return pair[1];}
              }
              return(false);
        },
      getPlatform: function(){
        this.type = this.getQueryVariable('type');
        this.code = this.getQueryVariable('code');
        this.curSubNav = -1;
        this.gameType = this.type;
        var that = this;
        Utils.requestNoTint('game/getPlatform_pc.do', {platformType: this.type}, function (res) {
          console.log(res)
          if (res.code == 0) {
            that.platformList = res.data.data;
            that.currentPlatform = that.platformList[0];
            that.platformType = res.data.platformType;
            that.allSubCode = that.currentPlatform.platformCode;
            that.subNavList = that.currentPlatform.subPlatform ? that.currentPlatform.subPlatform : [];
            that.platformList.forEach(function(item, index){
              if (item.platformCode == that.code) {
                that.curPlatIndex = index
                that.currentPlatform = that.platformList[index];
                that.allSubCode = that.currentPlatform.platformCode;
                that.subNavList = that.currentPlatform.subPlatform ? that.currentPlatform.subPlatform : [];
              }else if (item.subPlatform) {
                item.subPlatform.forEach(function(it, idx){
                  if (it.platformCode == that.code) {
                    that.curPlatIndex = index;
                    that.curSubNav = idx;
                    that.currentPlatform = that.platformList[index];
                    that.allSubCode = that.currentPlatform.platformCode;
                    that.subNavList = that.currentPlatform.subPlatform ? that.currentPlatform.subPlatform : [];
                  }
                })
              }
            })
            that.getGameDetails()
          } else {
            _alert(res.msg);
          }
        })
      },
      changeSubNav: function(item, index){
        this.currentPlatform.platformCode =item.platformCode;
        this.curSubNav = index;
        this.code = null;
        this.getGameDetails();
      },
      getSearchGameDetails: function() {
        this.code = null;
        this.offset = 0;
        this.getGameDetails();
      },
      getGameDetails: function(){
        var reqData = {
          platformCode: this.code ? this.code : this.currentPlatform.platformCode,
          platformType: this.platformType,
          offset: this.offset,
          count: this.count,
          gameName: this.gameName
        }
        var that = this;
        Utils.requestNoTint('game/getGameDetails.do', reqData, function (res) {
          console.log(res.data)
          if (res.code == 0) {
            that.platformDetail = res.data;
            that.totolPage =Math.ceil(res.total / that.count)
            if (res.data.length == 0) {
              _alert('暂无数据');
            }
          }
        })
      },
      getCurDetails: function(item, index){
        this.curPlatIndex = index;
        this.currentPlatform = item;
        this.offset = 0;
        this.currentPage = 1;
        this.curSubNav = -1;
        this.code = null;
        this.allSubCode = this.currentPlatform.platformCode;
        this.subNavList = this.currentPlatform.subPlatform ? this.currentPlatform.subPlatform : [];
        this.getGameDetails();
      },
      getAllDetails: function(){
        this.curSubNav = -1;
        this.offset = 0;
        this.currentPage = 1;
        this.currentPlatform.platformCode = this.allSubCode;
        this.getGameDetails();
      },
      toPage: function(page){
        var that = this;
        if (page < 1) {
          that.currentPage = 1;
        } else if (page > that.totolPage) {
          that.currentPage = that.totolPage
        } else {
          that.currentPage = page
        }
        that.offset = (that.currentPage - 1) * that.count;
        that.getGameDetails();
      },
      loginGame:debounce(function(item){
        // var fastClick = false;
        // console.log('fastClick')
        // if (fastClick) {
        //   return;
        // };
        // fastClick = true;
        // var code = item.platformCode;
        // var kindId = item.gameKindId;
        // var gameCode = item.gameCode;

        var pp = {
          code: item.platformCode,
          kindId: item.gameKindId,
          gameCode: item.gameCode
        }

        Utils.request('/changeMoney/transfer.do', { transferStatus: 2 }, function (data) {
            Utils.request('/changeMoney/transfer.do', {
                transferStatus: 1,
                gameCode: pp.code
            }, function (res) {
                if (res.code !== 0) {
                  _alert(res.msg);
                  return;
                }
                if (res.code == 0) {
                    Utils.requestNoTint('game/loginGame.do',
                        { "gameCode": pp.gameCode, "platformCode": pp.code, "gameKindId": pp.kindId },
                        function(rds) {
                          fastClick = false;
                          if (rds.code !== 0) {
                            _alert(rds.msg);
                            return;
                          }
                          if (rds.code === 0) {
                            __openWin('single_game', rds.data, '-1');
                            return;
                          }
                          Utils.requestNeedTint('passport/check_status.do', {}, function (data) {
                            if (data.code == 0) {
                              UserTool.saveUserInfo(data.data);
                            }
                          });
                            // __openWin('single_game', rds.data);
                        }, function (rds) {
                          _alert(rds.msg);
                          fastClick = false;
                          return false
                        }, function () {
                          fastClick = false;
                        })
                        setTimeout(() => {
                          if (fastClick) {
                            fastClick = false;
                          }
                        }, 15000);
                }
            })
        });
      },2000),
      goNext: function(){
        var that = this;
        if (that.curPlatIndex < that.platformList.length - 1) {
          that.curPlatIndex = that.curPlatIndex + 1;
          that.getCurDetails(that.platformList[that.curPlatIndex],that.curPlatIndex);
        } else {
          that.curPlatIndex = 0;
          that.getCurDetails(that.platformList[that.curPlatIndex],0);
        }
      },
      goPrevious:function(){
        var that = this;
        if(that.curPlatIndex > 0) {
          that.curPlatIndex = that.curPlatIndex - 1;
          that.getCurDetails(that.platformList[that.curPlatIndex],that.curPlatIndex);
        } else {
          that.curPlatIndex = that.platformList.length - 1;
          that.getCurDetails(that.platformList[that.curPlatIndex],that.platformList.length - 1);
        }
      }
    },
    created(){
      this.getPlatform()
    }
  })
})