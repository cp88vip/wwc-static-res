var vue = new Vue({
    el : '#page-wrapper',
    data : {
        logs : [],
        initRequestData : {
            offset: 0,
            count: 10
        },
        modals: {
            edit: "#editmodel",
            view: "#viewmodel",
            send: "#sendmodel"
        },
        isShowPreview:0,
        modal : {
            id : "logModal"
        },
        totalPages : 0,
        totalRows : 0,
        currentPage : 1,
        pageNum:1,
        isShowPageNav : false,
    },
    methods : {
        onLoad : function(e) {
            var that = this;
            this.request();
        },
        request : function() {
            var that = this;
            request('/upstream/affiche/get_affiche_list.do', this.initRequestData, function(e) {
                that.logs = e.data.affiches;

                // 翻页导航
                var totalRows = e.data.total.totalRows;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.count);
                that.isShowPageNav = that.totalPages > 1;
            });
        },
        preScan : function(index) {
            $(this.modals.view).modal('toggle');
            $(this.modals.view).find('.modal-body').html('');
            var viewHtml = '<div class="prediv-div">'+this.logs[index].content+'</div>';
            $(this.modals.view).find(".modal-body").append(viewHtml);
        },
        clearAll : function () {
            $(this.modals.view).modal('toggle');
        },

        query : function() {
            this.currentPage = 1;
            this.initRequestData.offset = 0;
            this.request();
        },
        countChange: function(){
            this.initRequestData.count = parseInt(this.initRequestData.count);
            this.request();
        },
        pageNav : function(p) {
            if(p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initRequestData.offset = (p - 1) * this.initRequestData.count;
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
                return[curr-5,curr-4,curr-3,curr-2,curr-1,curr,curr+1,curr+2,curr+3,curr+4]
            }

        },

    }
});

vue.onLoad();