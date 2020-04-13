// content: 滚动条,以及页面自适应
// 2016-09-23
$(function(){
    //自适应 宽度
    var liveArr = [38,41,43,45,47,85];
    /**
     * game group
     * @param  Object options settings
     * @return Object         return this
     */
    $.fn.gameGroup = function(options) {
        var conf = {
            oldIE: (typeof(oldIE) != 'undefined')? oldIE: false,
            linkEle: ".ctl-btn-enter",       //触发事件
            groupClass: ".ele-live-group",   //连结区域
            triggerEle: [".ele-live-img"],   //触发事件元素
            baseLeft: 0,                     //定位基准左边界
            baseRight: '',                   //定位基准右边界(需要時使用)
            baseBottom: 0,                   //定位基准下边界
            baseTop: '',                     //定位基准上边界(需要時使用)
            inDelay: 300,                    //滑标hover延迟
            outDelay: 300,                   //滑标hover延迟
            showTime: 300                    //动画时间
        };
        $.extend(conf, options);
        if(conf.linkEle) {
            conf.triggerEle.push(conf.linkEle);
        }
        return this.each(function() {
            var timerIn, timerOut,
                group = $(conf.groupClass, this),
                triggerEle = conf.triggerEle.join(",");
            //设定 group位置
            if(conf.baseTop !== '') {
                group.css({top: conf.baseTop});
            }else {
                group.css({bottom: conf.baseBottom});
            }
            if(conf.baseRight !== '') {
                group.css({right: conf.baseRight});
            }else{
                group.css({left: conf.baseLeft});
            }
            group.add(triggerEle, this).hover(function() {
                clearTimeout(timerOut);
                timerIn = setTimeout(function() {
                    if(conf.oldIE) {
                        group.stop().show();
                    }else {
                        group.stop().fadeIn(conf.showTime);
                    }
                }, conf.inDelay);
            }, function() {
                clearTimeout(timerIn);
                timerOut = setTimeout(function() {
                    if(conf.oldIE) {
                        group.stop().css("display", "none");
                    }else {
                        group.stop().fadeOut(conf.showTime);
                    }
                }, conf.outDelay);
            });
        });
    };
    (function() {
        var  newLive = {
            liveData: {},
            mainItem: '',
            clickStatus: true,
            curHall: 38,
            curSub: {},
            ultimateArr: [39,44,46,48,81,83],
            keyString : "",
            groupX : "",
            groupY : "",
            resetClick: function() {
                this.curSub = '';
                this.mainItem = '';
            },
            gameShowHide: function() {
                $(function(){
                    if(newLive.curHall) {
                        // 开启/重刷页面
                        if( $.inArray(newLive.curHall, liveArr) >= 0 )
                        {
                            $('.ele-live-layout').css('display', 'none'); //#ele-live-flash,
                            $('.showhide-wrap, .showhide-' + newLive.curHall).show();
                            return false;
                        }
                        $('.showhide-wrap').css('display', 'none');
                    }
                });
            },
            scrollbarlive: function() {
                //拼屏
                $("#ele-game-wrap").mCustomScrollbar({
                    axis:"y",
                    mouseWheel:{
                        enable: true ,
                        scrollAmount: 200,
                    },
                    scrollButtons:{
                        enable:false,
                        scrollType:"continuous",
                        scrollSpeed:20,
                        scrollAmount:40
                    }
                });
            },
            accDiv : function (num1, num2){
                var t1 = 0,t2 = 0,r1,r2;
                try{t1 = num1.toString().split(".")[1].length} catch(e){}
                try{t2 = num2.toString().split(".")[1].length} catch(e){}
                r1 = Number(num1.toString().replace(".",""));
                r2 = Number(num2.toString().replace(".",""));
                return (r1 / r2) * Math.pow(10, t2 - t1);
            },
            calculateBox: function() {
                var winH = $(window).height(), //获取内容区高度
                    winW = $(window).width();
                $('#ele-game-wrap').css({width: winW, height: winH});
                if(  $('.ele-live-layout').length > 1 )
                {// 如果是够彩大厅
                    var boxWidth = $('.ele-live-layout').width() + 14,   boxNum = Math.floor(this.accDiv(winW, boxWidth));
                    $('#ele-live-wrap').css({width: boxNum * (boxWidth)});
                }
            },

            init: function() {
                // 初始页面 购彩大厅区预设动作
                this.gameShowHide();
                this.scrollbarlive();
                $(window).load(function()
                {
                    newLive.calculateBox();
                });
                // 缩放视窗
                $( window ).resize(function() {
                    newLive.calculateBox();
                });
            }
        }
        newLive.init();
    })();

});
