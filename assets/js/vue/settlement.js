
var vue = new Vue({
    el: '#page-wrapper',
    data: {
        Settlement: [],
        userInfo: [],
        requestData: {
            offset: 0,
            count: 15,
            settlement: null,
            userId: null,
            account: null,
        },
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        userId: null,
        pageNum:1,
        requestDataInfo :{
            offset: 0,
            count: 5,
            userId: null,
        },
        infoTotalPages: 0,
        currentPageInfo: 1,
        isShowPageNavInfo: false,
    },
    methods: {
        onLoad: function () {
            this.request();
        },
        request: function () {
            var that = this;
            if($("#settlement").val() == 1){
                that.requestData.settlement= true;
            }else if($("#settlement").val() == 2){
                that.requestData.settlement= false;
            }else{
                that.requestData.settlement= null;
            }
            that.requestData.userId = null;
            that.requestData.account=$("#account").val()==""?null:$("#account").val();
            requestOnce('/manage/report_forms/get_settlements.do', that.requestData, function (e) {
                that.Settlement = e.data.data;
                var totalRows = e.data.total;

                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.requestData.count);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        query : function() {
            this.currentPage = 1;
            this.requestData.offset = 0;
            this.request();
        },
        lookInfor : function (item) {

            var that = this;
            that.currentPageInfo = 1;
            that.infoTotalPages = 0;
            that.isShowPageNavInfo = false;
            that.requestDataInfo.userId=item.userId;
            that.requestDataInfo.offset=0;
            that.infoPageRequest();
        },
        infoPageRequest : function () {
            var that = this;
            // that.requestData.userId=that.userId;
            that.requestData.settlement= null;
            requestOnce('/manage/report_forms/get_agent_settlements.do', that.requestDataInfo, function (e) {
                that.userInfo = e.data.data;
                $("#infor").modal();
                var totalRows = e.data.rowCount;
                that.infoTotalPages = Math.ceil((totalRows ? totalRows : 0) / that.requestDataInfo.count);
                that.isShowPageNavInfo = that.infoTotalPages > 1;
            });
        },
        toSettlement : function (item,index) {
            var that = this;
            that.requestData.userId=item.userId;
            that.requestData.settlement= null;
            // console.log(index);
            // console.log(that.Settlement[index].settlement);
            requestOnce('/manage/report_forms/do_settlement.do', that.requestData, function (e) {
                if (e.code == 0) {
                    that.Settlement[index].settlement=true;
                    layer.msg(e.msg);
                }
            });
        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.requestData.offset = (p - 1) * this.requestData.count;
            this.request();
        },
        pageCul : function(curr) {
            var curr=parseInt(curr);
            if(curr > this.totalPages - 9) {
                var p = this.totalPages;
                return [p-9,p-8,p-7,p-6,p-5,p-4,p-3,p-2,p-1, p];
            }else if(curr < 10) {
                return [1,2,3,4,5,6,7,8,9,10];
            }else{
                return [curr-5,curr-4,curr-3,curr-2,curr-1,curr,curr+1,curr+2,curr+3,curr+4]
            }

        },
        pageNavInfo: function (p) {
            if (p < 1 || p > this.infoTotalPages) return;
            this.currentPageInfo = p;
            this.requestDataInfo.offset = (p - 1) * this.requestDataInfo.count;
            this.infoPageRequest();
        },
        pageCulInfo:  function(curr) {
            var curr=parseInt(curr);
            if(curr > this.infoTotalPages - 9) {
                var p = this.infoTotalPages;
                return [p-9,p-8,p-7,p-6,p-5,p-4,p-3,p-2,p-1, p];
            }else if(curr < 10) {
                return [1,2,3,4,5,6,7,8,9,10];
            }else{
                return [curr-5,curr-4,curr-3,curr-2,curr-1,curr,curr+1,curr+2,curr+3,curr+4]
            }

        },

    },
    created : function () {
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                vue.query();
            }
        });
    },
});
vue.onLoad();
