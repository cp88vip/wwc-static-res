var vue = new Vue({
    el: '#page-wrapper',
    data: {
        logs: [],
        UE: null,
        initRequestData: {
            page: 1,
            pageSize: 15,
        },
        totalPages: 0,
        currentPage: 1,
        isShowPageNav: false,
        pageNum: 1,
        lables : [],
        categories : ['新闻','技巧'],
        sources : ['原创','转载'],
        editModel: '#editmodel',
        postItem : {
            title   : '',
            summary : '',
            content : '',
            category : 1,
            lable    : -1,
            source   : 0
        }
    },
    methods: {
        onLoad: function (e) {
            var that = this
            this.UE = UE.getEditor('prefer-content')
            that.requestlables()
        },
        requestlables : function () {
            var that = this;
            that.lables = [];
            request('/manage/lottery/categories.do', {}, function(e) {
                if (e.code != 0) {
                    return layer.msg(e.msg);
                }
                that.lables = e.data;
                that.lables.push({'name':'其它','lotteryId':'-1'});
                that.request();
            });
        },
        request: function () {
            var that = this;
            request('/manage/news/get_list.do', that.initRequestData, function (e) {
                var totalRows = e.total;
                that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.pageSize);
                that.isShowPageNav = that.totalPages > 1;
                $.each(e.rows, function (i, row) {
                    $.each(that.lables, function (j, lable) {
                        if (row.lable == lable.lotteryId) {
                            row.lableName = lable.name;
                        }
                    });
                });
                that.logs = e.rows;
            });
        },
        addLink: function () {
            var that = this;
            // $("#editmodel").modal('toggle');
            that.editToggle()
            that.clearAll()
        },
        editor: function () {
            var that = this;
            if (that.postItem.title == '') {
                layer.msg('标题不能为空！');
                return;
            }
            //处理CKEDITOR的值
            // for (instance in CKEDITOR.instances) {
            //     CKEDITOR.instances[instance].updateElement();
            // }

            // var content = obj2.getData();
            var content = that.UE.getContent()
            if (content == '') {
                layer.msg('内容不能为空！');
                return;
            }
            that.postItem.content = content;
            var sub = confirm("确定提交吗?");
            if (sub == true) {
                var urlstr = '/manage/news/add_or_update.do';
                // var result = {};
                // for (var key in that.postItem) {
                //       if (key != 'lableName') {
                //           result[key] = that.postItem[key];
                //       }
                // }
                // console.log(result)
                // console.log(that.postItem)
                
                request(urlstr, that.postItem, function (result) {
                    if (result.code == 0) {
                        // 被动dismiss
                        // $('#editmodel').modal('hide');
                        that.editToggle()
                        that.request()
                        layer.msg(result.msg)
                        that.clearAll()
                    }
                })
            }
        },
        editToggle: function () {
            var formDiv = $(this.editModel)
            if (formDiv.is(":hidden")) {
                formDiv.fadeIn()
            } else {
                formDiv.fadeOut(500)
            }
        },
        clearAll: function () {
            var that = this, formDiv = document.getElementById('form-div');
            formDiv.setAttribute('newId','');
            $('#form-div').attr('newId','');
            that.postItem.title   = '';
            that.postItem.summary = '';
            that.postItem.content = '';
            that.postItem.category = 1;
            that.postItem.lable    = -1;
            that.postItem.source   = 0;
            that.postItem.lableName = '';
            that.postItem.id = null;
            // obj2.setData('');
            that.UE.setContent('')
        },
        edit: function (row, index) {
            var that = this;
            // $("#editmodel").modal('toggle');
            that.editToggle()
            that.postItem = that.deepCopy(row);
            var formDiv = document.getElementById('form-div');
            formDiv.setAttribute('newId', row.id);
            request('/manage/news/get_detail.do', {'id': row.id}, function (result) {
                if (result.code == 0) {
                    // obj2.setData(result.data.content);
                    that.UE.setContent(result.data.content)
                }
            });
        },
        deepCopy : function(source) {
            var result = {};
            for (var key in source) {
                  result[key] = source[key];
            }
           return result;
        },
        del: function (row, index) {
            var that = this;
            var dele = confirm('确定要把【' + row.title + '】删除掉？');
            if (dele == true) {
                request('/manage/news/delete.do', {'id': row.id}, function (result) {
                    if (result.code == 0) {
                        that.logs.splice(index,1)
                        layer.msg("删除成功！")
                    }
                });
            }
        },
        preScan: function (row, index) {
            request('/manage/news/get_detail.do', {'id': row.id}, function (result) {
                if (result.code == 0) {
                    $('#editmodel1 .modal-body').html(result.data.content);
                    $("#editmodel1").modal();
                }
            });
        },

        pageNav: function (p) {
            var that = this;
            if (p < 1 || p > that.totalPages) return;
            that.currentPage = p;
            that.initRequestData.page = p;
            that.request();
        },
        pageCul: function (curr) {
            var that = this, curr = parseInt(curr);
            if (curr > that.totalPages - 9) {
                var p = that.totalPages;
                return [p - 9, p - 8, p - 7, p - 6, p - 5, p - 4, p - 3, p - 2, p - 1, p];
            } else if (curr < 10) {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            } else {
                return [curr - 5, curr - 4, curr - 3, curr - 2, curr - 1, curr, curr + 1, curr + 2, curr + 3, curr + 4]
            }

        },
    }
})

$(function() {
    vue.onLoad()

    // close
    $("#editmodel").find('button.close, button.btn-close').on('click', function(){
        $("#editmodel").fadeOut(500)
    });
    // qEditor.container.firstChild.innerHTML
    $("#editmodel").off('click').on('click', function(e) {
        $(this).fadeOut(500)
    })
    $("#editmodel").find('.modal-dialog').off('click').on('click', function(e) {
        e.stopPropagation()
    })
})
