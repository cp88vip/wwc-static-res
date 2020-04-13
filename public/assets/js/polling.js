var isLogined = $.cookie('isLogined');
var rechargeAudio = new Audio("/assets/mp3/rech.mp3");
var withdrawalAudio = new Audio("/assets/mp3/with.mp3");
/*
layui.use('layim', function(layim) {
    var user = JSON.parse(sessionStorage.getItem("user"));
    layim.config({
        brief: false,
        init: {
            mine: {
                username: user.username,
                id: user.userId,
                status: 'online',
                avatar: 'https://tp1.sinaimg.cn/1571889140/180/40030060651/1'
            }
        },
        title: "彩票吧客服系统",
        copyright: true,
        voice : 'newMessage.MP3',

    });

    layim.on('sendMessage', function(res) {
        var toUser = {
            name: res.to.username,
            userId: res.to.fromid,
            flag: res.to.id,
            headImg: res.to.avatar
        };
        var mine = {
            name: user.username,
            userId: user.userId,
            flag: null,
            headImg: user.headImg
        };
        var messageObj = {};
        messageObj.textContent = res.mine.content;
        messageObj.msgTimestamp = new Date().getTime();
        messageObj.receiver = toUser;
        messageObj.sender = mine;

        request('/im/customer_service/message.do', messageObj, function(e) {
            console.log(e)
        });
    });

    request('/manage/polling/service.do', {}, function(res) {
        if (res.data.messages) {
            for (var i = 0; i < res.data.messages.length; i++) {
                var msg = res.data.messages[i];
                if (!msg.textContent || msg.thumbImgUrl) {
                    msg.textContent = "img[" + msg.originalImgUrl + "]";
                }
                layim.getMessage({
                    username: msg.sender.name,
                    avatar: "https://tp1.sinaimg.cn/1571889140/180/40030060651/1",
                    id: msg.sender.flag,
                    type: "friend",
                    content: msg.textContent,
                    cid: 0,
                    mine: false,
                    fromid: msg.sender.userId,
                    timestamp: msg.msgTimestamp
                })
            }
        }

        if (res.data.recharge.length > 0) {
            rechargeAudio.play();
            $('#recharge-numbers').text(res.data.recharge.length);
        }

        if (res.data.withdrawal.length > 0) {
            withdrawalAudio.play();
            $('#withdrawal-numbers').text(res.data.withdrawal.length);
        }
        $('#online-numbers').text(res.data.onlineCustomerNumber);
    });

    if (isLogined) {
        setInterval(function() {
            request('/manage/polling/service.do', {}, function(res) {

                if (res.data.recharge.length > 0) {
                    rechargeAudio.play();
                    $('#recharge-numbers').text(res.data.recharge.length);
                }

                if (res.data.withdrawal.length > 0) {
                    withdrawalAudio.play();
                    $('#withdrawal-numbers').text(res.data.withdrawal.length);
                }
                $('#online-numbers').text(res.data.onlineCustomerNumber);
            });
        },
        3000);
    }
})
*/
request('/manage/polling/service.do', {}, function(res) {
        if (res.data.recharge.length > 0) {
            rechargeAudio.play();
            $('#recharge-numbers').text(res.data.recharge.length);
        }

        if (res.data.withdrawal.length > 0) {
            withdrawalAudio.play();
            $('#withdrawal-numbers').text(res.data.withdrawal.length);
        }
        $('#online-numbers').text(res.data.onlineCustomerNumber);
    });
if (isLogined) {
        setInterval(function() {
            request('/manage/polling/service.do', {}, function(res) {

                if (res.data.recharge.length > 0) {
                    rechargeAudio.play();
                    $('#recharge-numbers').text(res.data.recharge.length);
                }

                if (res.data.withdrawal.length > 0) {
                    withdrawalAudio.play();
                    $('#withdrawal-numbers').text(res.data.withdrawal.length);
                }
                $('#online-numbers').text(res.data.onlineCustomerNumber);
            });
        },
        3000);
    }