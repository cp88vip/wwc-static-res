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
        editModel: '#editmodel'
    },
    methods: {
        onLoad: function (e) {
            var that = this
            var ue = UE.getEditor('prefer-content')
            this.UE = ue

            that.request()
        },
        request: function () {
            var that = this;
            request('/manage/discountoff/list.do', that.initRequestData, function (e) {
                that.logs = e.rows;
                // 翻页导航
                // var totalRows = e.total;
                //
                // that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.initRequestData.pageSize);
                // that.isShowPageNav = that.totalPages > 1;
            });
        },
        //添加推广链接地址
        addLink: function () {
            var that = this
            that.editToggle()
            // $("#editmodel").modal('toggle');
            that.clearAll()
        },
        //添加或编辑的优惠活动
        editor: function () {
            var that = this;
            var formDiv = $("#form-div")
            // var title = document.getElementById('sub-title').value;
            // var coverUrl = document.getElementById('sub-coverUrl').value;
            var title = formDiv.find('input[name="sub-title"]').val()
            var coverUrl = formDiv.find('input[name="sub-coverUrl"]').val()
            if (title == '' || coverUrl == '') {
                layer.msg('标题、封面Url不能为空！');
                return;
            }
            var sub = confirm("确定提交吗?");
            if (sub == true) {
                var urlstr = '';
                // 判断是否有discountoffId有值
                // var formDiv = document.getElementById('form-div');
                // var discountoffId = formDiv.getAttribute('discountoffId');

                var discountoffId = formDiv.attr('discountoffId')
                var data = {
                    title: title,
                    coverUrl: coverUrl,
                    content: that.UE.getContent()
                }
                if (discountoffId == '' || discountoffId == undefined) {
                    // 添加
                    urlstr = '/manage/discountoff/add.do';
                } else {
                    urlstr = '/manage/discountoff/update.do';
                    data['discountoffId'] = discountoffId;
                }
                //处理CKEDITOR的值
                // for (instance in CKEDITOR.instances)
                //     CKEDITOR.instances[instance].updateElement();

                // var content = obj1.getData();
                // var description = $('#sub-description').val();
                // data['title'] = title;
                // data['coverUrl'] = $.trim(coverUrl);
                // // data['description'] = description;
                // data['content'] = content;

                // var eq = $("#editLabel").attr('num');
                // data['coverUrl'].replace(/ /g, '')
                console.log(data)

                request(urlstr, data, function (result) {
                    // coverUrl.replace(/ /g, '')
                    if (result.code == 0) {
                        that.request()
                        // if (discountoffId == '' || discountoffId == undefined) {
                        //     that.request();
                        // } else {
                        //     that.logs[eq].title = data.title;
                        //     that.logs[eq].coverUrl = data.coverUrl;
                        //     that.logs[eq].description = data.description;
                        // }
                        layer.msg(result.msg)
                        that.clearAll()
                        // $('#editmodel').modal('hide');
                        that.editToggle()
                    }
                });
            }
        },
        edit: function (row, eq) {
            // $(this.editModel).fadeIn()
            var that = this
            var formDiv = $('#form-div')
            that.editToggle()
            formDiv.attr('discountoffId', row.discountoffId)
            formDiv.find('input[name="sub-title"]').val(row.title)
            formDiv.find('input[name="sub-coverUrl"]').val(row.coverUrl)
            // $("#editmodel").modal('toggle');
            // $("#editLabel").attr('num', eq);
            // $("#sub-title").val(row.title);
            // $('#sub-coverUrl').val(row.coverUrl);
            // $('#sub-description').val(row.description);
            // var formDiv = document.getElementById('form-div');
            // formDiv.setAttribute('discountoffId', row.discountoffId);
            
            var data = {'discountoffId': row.discountoffId};
            request('/manage/discountoff/get.do', data, function (result) {
                if (result.code == 0) {
                    // obj1.setData(result.data.content);
                    that.UE.setContent(result.data.content)
                }
            });
        },
        // edit1:function(row,eq){
        //     $("#editmodel").modal('toggle');
        //     $("#editLabel").attr('num', eq);
        //     $("#sub-title").val(row.title);
        //     $('#sub-coverUrl').val(row.coverUrl);
        //     $('#sub-description').val(row.description);
        //     $('#sub-title').attr("disabled","disabled");
        //     $('#cke_TextArea1').hide();
        //     var formDiv = document.getElementById('form-div');
        //     formDiv.setAttribute('discountoffId', row.discountoffId);
        //     var data = {'discountoffId': row.discountoffId};
        //     request('/manage/discountoff/get.do', data, function (result) {
        //         if (result.code == 0) {
        //             obj1.setData(result.data.content);
        //         }
        //     });
        // },
        //删除
        del: function (row,eq) {
            var that = this;
            var dele = confirm('确定要把【' + row.title + '】删除掉？');
            if (dele == true) {
                var data = {'discountoffId': row.discountoffId};
                request('/manage/discountoff/delete.do', data, function (result) {
                    if (result.code == 0) {
                        that.logs.splice(eq,1);
                        layer.msg("删除成功！");
                    }
                });
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
        preScan: function (row, eq) {
            var that = this;
            var data = {'discountoffId': row.discountoffId};
            request('/manage/discountoff/get.do', data, function (result) {
                if (result.code == 0) {
                    that.preScanInfo(row, result.data.content);
                }
            });
        },
        // 预览
        preScanInfo: function (row, content) {
            $("#editmodel1").modal('toggle');
            document.querySelector('#editmodel1 .modal-body').innerHTML = '';
            //1、创建元素
            var div = document.createElement('div');
            div.setAttribute("class", "prediv-div");
            div.innerHTML = '';
            div.innerHTML = content;
            document.querySelector('#editmodel1 .modal-body').appendChild(div);
        },
        clearAll: function () {
            var formDiv = $('#form-div')
            formDiv.attr('discountoffId', '')
            formDiv.find('input').each(function(){
                $(this).val('')
            })
            this.UE.setContent('')
            // var formDiv = document.getElementById('form-div');
            // formDiv.setAttribute('discountoffId', '');
            // document.getElementById('sub-title').value = '';
            // document.getElementById('sub-coverUrl').value = '';
            // obj1.setData('');
        },
        pageNav: function (p) {
            if (p < 1 || p > this.totalPages) return;
            this.currentPage = p;
            this.initinitRequestData.page = p;
            this.request();
        },
        pageCul: function (curr) {
            var curr = parseInt(curr);
            if (curr > this.totalPages - 9) {
                var p = this.totalPages;
                return [p - 9, p - 8, p - 7, p - 6, p - 5, p - 4, p - 3, p - 2, p - 1, p];
            } else if (curr < 10) {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            } else {
                return [curr - 5, curr - 4, curr - 3, curr - 2, curr - 1, curr, curr + 1, curr + 2, curr + 3, curr + 4]
            }
        },
        changeSort : function (item,i) {
            var ts = this;
            layer.prompt({
                title : '输入排序号,数值越大,越靠前',
                formType : 0,
                maxlength : 4
            }, function(sort, index) {
                var isNoPass = false;
                $.each(ts.logs, function (j, log) {
                    if (!isInteger(sort)) {
                      layer.msg('请输入数字！',{time : 1000});
                      isNoPass = true;
                    } else {
                      if (parseInt(sort) <= 0) {
                        layer.msg('请输入正确的排序数字',{time : 1000});
                        isNoPass = true;
                      } else if (log.sort == parseInt(sort)) {
                        layer.msg('请输入与其它排序不同的数字！',{time : 1000});
                        isNoPass = true;
                      }
                    }
                });
                if (!isNoPass) {
                    request('/manage/discountoff/update_sort.do', {
                        discountoffId : item.discountoffId,
                        sort : sort,
                    }, function(e) {
                        layer.close(index);
                        if (e.code == 0) {
                            ts.$set(item,'sort',sort);
                            ts.request();
                            layer.msg('修改成功');
                        } else {
                            layer.msg(e.msg);
                        }
                    });
                }
            });
        }
    }
});

// 初始化
$(function(){

    vue.onLoad();

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
