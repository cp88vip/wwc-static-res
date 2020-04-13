var vue = new Vue({
  el: '#page-wrapper',
  data: {
    title: null,
    groupNum: 0,
    uptitle: '',
    updescrip: '',
    groupIdName: '',
    picList: [],
    preUrl: '',
    showPreImg: false,
    groupList: [],
    curIndex: null,
    picIds: [],
    isCheckedAll: false,
    groupListSelect: [],
    curPicId: null,
    showInfo: false,
    infoText: ''
  },
  methods: {
    onLoad: function (e) {
      var that = this;
      this.getAllImageList();
      this.getGroup();
    },
    changeModalFlag: function () {
      console.log(this.groupNum)
    },
    edit: function (item) {
      $("#editmodel").fadeIn(200);
      console.log(111)
      var _ts = this;
      _ts.curPicId = item.id;
      _ts.groupNum = item.groupId;
      _ts.uptitle = item.name;
      _ts.updescrip = item.subhead;
      // $(ts.modals.edit).fadeIn(200);
    },
    cancel: function () {
      var _ts = this;
      _ts.uptitle = '';
      _ts.updescrip = '';
      _ts.groupNum = 0;
      $("#editmodel").fadeOut(200);
    },
    uploadPic: function () {
      $("#editmodel2").fadeIn(200);
    },
    cancel2: function () {
      var _ts = this;
      _ts.curPicId = null;
            _ts.uptitle = '';
            _ts.updescrip = '';
            _ts.groupNum = 0;
            $("#editmodel2").fadeOut(200);
    },
    getAllImageList: function () {
      var _ts = this;
      this.picIds = [];
      _ts.curIndex = null;
      var reqData = {
        name: _ts.title
      }
      request('/manage/image/getImageList.do', reqData, function (e) {
        console.log(e)
        if (e.code == 0) {
          _ts.picList = e.data;
          _ts.title = '';
          if (e.data.length == 0) {
            _ts.showInfo = true;
            _ts.infoText = '温馨提示：暂无相关图片资源';
          } else {
            _ts.showInfo = false;
            _ts.infoText = '';
          }
        } else {
          _ts.title = '';
          layer.msg(e.msg);
        }
      })
    },
    previewPic: function (url) {
      this.showPreImg = true;
      this.preUrl = url;
    },
    disShowPreImg: function() {
      this.showPreImg = false;
    },
    addGroup: function () {
      var _ts = this;
      var reqData = {
        groupName: _ts.groupIdName
      }
      if (_ts.groupIdName.trim() == "") {
        layer.msg("分组名称不能为空");
        return;
      }
      layer.confirm('确定添加分组吗？', function (index) {
        request('/manage/image/addGroup.do', reqData, function (e) {
          if (e.code == 0) {
            layer.msg("添加成功");
            _ts.groupIdName = '';
            _ts.getGroup();
          } else {
            _ts.groupIdName = '';
            layer.msg(e.msg);
          }

        })
        layer.close(index);
      });
    },
    delGroup: function (id) {
      var _ts = this;
      var reqData = {
        groupId: id
      }
      if (_ts.picList.length > 0) {
        layer.msg("该分组不是空分组，请删除分组内图片后再删除分组");
        return;
      }
      layer.confirm('确定删除分组吗？', function (index) {
        request('/manage/image/deleteGroup.do', reqData, function (e) {
          if (e.code == 0) {
            layer.msg("删除成功");
            _ts.getGroup();
          } else {
            layer.msg(e.msg);
          }

        })
        layer.close(index);
      });
    },
    deleteImg: function (item) {
      var _ts = this;
      var reqData = {
        ids: [item.id]
      }
      layer.confirm('确定删除该图片吗？', function (index) {
        request('/manage/image/deleteImage.do', reqData, function (e) {
          if (e.code == 0) {
            layer.msg("删除成功");
            if (_ts.curIndex === null) {
              _ts.getAllImageList();
            } else {
              _ts.getImageByGroup(item.groupId, _ts.curIndex)
            }
          } else {
            layer.msg(e.msg);
          }
        })
        layer.close(index);
      });
    },
    updateImage: function () {
      var _ts = this;
      var reqData = {
        id: _ts.curPicId,
        name: _ts.uptitle,
        subhead: _ts.updescrip,
        groupId: _ts.groupNum
      };
      layer.confirm('确定修改该图片吗？', function (index) {
        request('/manage/image/updateImage.do', reqData, function (e) {
          if (e.code == 0) {
            layer.msg("修改成功");
            _ts.cancel();
            // _ts.getAllImageList();
            var inx = 0;
            for (var i = 0; i < _ts.groupListSelect.length; i++) {
              console.log(_ts.groupListSelect[i].groupId);
              if (_ts.groupListSelect[i].groupId == reqData.groupId) {
                inx = i;
              }
            }
            _ts.getImageByGroup(reqData.groupId, inx);
            
          } else {
            layer.msg(e.msg);
            
          }
        })
        layer.close(index);
      });
    },
    uploadFile: function () {
      var _ts = this;
      var formData = new FormData();
      var file = $("#file")[0].files[0];
      if (file.size > 614400){
        layer.alert("图片最大可上传600KB")
        return false;
      }
      if (!['image/jpeg','image/png'].includes(file.type)){
        layer.alert('请上传png或者jpg格式的图片 ');
        return false
      }
      formData.append("file", $("#file")[0].files[0]);
      formData.append("name", _ts.uptitle);
      formData.append("subhead", _ts.updescrip);
      formData.append("groupId", _ts.groupNum);
      if (_ts.uptitle == '') {
        layer.alert("标题不能为空")
				return false
      }
      // if (_ts.updescrip == '') {
      //   layer.alert("标题描述不能为空")
			// 	return false
      // }
      if ($("#file")[0].files[0] == undefined) {
        layer.alert("图片文件不能为空")
				return false
      }
			formData.forEach(function(d){
				console.log(d);
			})
			if ($("#file")[0].files[0].name.slice(-3).toLowerCase() == "png" || $("#file")[0].files[0].name.slice(-3).toLowerCase() == "jpg"){
				
			$.ajax({
        type : "POST",
        url : "/manage/image/addImage.do",
        dataType: "json",
				cache: false,//上传文件无需缓存
				processData: false,//用于对data参数进行序列化处理 这里必须false
				contentType: false, //必须
        data : formData,
        beforeSend : function(xhr) {
            if (!isRequst) {
                isRequst += "1";
            } else {
                return ;
            }
            var _inx = layer.load(2, {
                shade: [0.2, "#000"],
                shadeClose: false
            });
            xhr.setRequestHeader('sessionid', {
                toString : function() {
                    return $.cookie("sessionid");
                }
            });
            xhr.setRequestHeader('temporary-sessionId', {
              toString : function() {
                return $.cookie("temporaryId");
              }
            });
            xhr.setRequestHeader('playType', sessionStorage.getItem('playType'));
        },
        success : function(e) {
          isRequst = "";
          layer.closeAll();

          if (e.code >= 300 && e.code < 400) {
              layer.msg(e.msg);
              var redirectUrl;
              if(location.pathname.startsWith("/manage")) {
                  redirectUrl = "/manage/account/login.do?redirect="+location.href;
              } else {
                  redirectUrl = "/agent/manage/login.do?redirect="+location.href;
              }
              setTimeout(
                  location=redirectUrl,
                  1500);
              return;
          } else if (!(e.code == 0 || e.code == 101)) {
              layer.msg(e.msg);
              return;
          } else {
              // fun(e);
              // layer.msg(e.msg);
              layer.msg("上传成功");
              $("#file")[0].files[0] = undefined;
              
              if (_ts.groupNum == 0) {
                _ts.getAllImageList();
                _ts.cancel2();
              } else {
                var inx = 0;
                for (var i = 0; i < _ts.groupListSelect.length; i++) {
                  console.log(_ts.groupListSelect[i].groupId);
                  if (_ts.groupListSelect[i].groupId == _ts.groupNum) {
                    inx = i;
                  }
                }
                _ts.getImageByGroup(_ts.groupNum, inx);
                _ts.cancel2();
              }
              return;
          }
      },
      error : function(message) {
          isRequst = "";
          layer.closeAll();
          console.log(message)
      }
  });
} else {
  layer.alert("请提交png或者jpg格式的图片文件")
				return false
			
}
  },
    checkedOne: function(id) {
      var  idIndex = this.picIds.indexOf(id)
        if (idIndex >= 0) {
          // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
          this.picIds.splice(idIndex, 1)
        } else {
          // 选中该checkbox
          this.picIds.push(id)
        }
    },
    checkedAll () {
      var _ts = this;
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        // 全选时
        _ts.picIds = []
        _ts.picList.forEach(function (pic) {
          _ts.picIds.push(pic.id)
        })
      } else {
        _ts.picIds = []
      }
    },
    getImageByGroup: function(id, index) {
      this.picIds = [];
      var _ts = this;
      _ts.curIndex = index;
      var reqData = {
        groupId: id
      }
      request('/manage/image/getImageListByGroupId.do', reqData, function (e) {
        if (e.code == 0) {
          _ts.picList = e.data;
          if (e.data.length == 0) {
            _ts.showInfo = true;
            _ts.infoText = '温馨提示：暂无相关图片资源。';
          } else {
            _ts.showInfo = false;
            _ts.infoText = '';
          }
        } else {
          layer.msg(e.msg);
        }
      })
    },
    getGroup: function() {
      var _ts = this;
      var reqData = {
      };
      request('/manage/image/getGroupList.do', reqData, function (e) {
        console.log(e)
        if (e.code == 0) {
          _ts.groupList = e.data;
          _ts.groupListSelect = [].concat(_ts.groupList);
          _ts.groupListSelect.unshift({groupId: 0, groupName: '未分组'});
          _ts.groupList = _ts.groupListSelect;
        } else {
          layer.msg(e.msg);
        }
      })
    },
    delAll() {
      if (this.picIds.length == 0) {
        layer.msg("请勾选要删除的图片");
        return;
      } else {
        var _ts = this;
      var reqData = {
        ids: _ts.picIds
      }
      layer.confirm('确定删除勾选的图片吗？', function (index) {
        request('/manage/image/deleteImage.do', reqData, function (e) {
          if (e.code == 0) {
            layer.msg("删除成功");
            _ts.getAllImageList();
          } else {
            layer.msg(e.msg);
          }
        })
      });
      }      
    },
  copy(str,idinput) {
  var apdDom = idinput ? $(idinput) : $("body");
  function beforeCopy(copyStr) {
      if( typeof(copyStr) == "number" ) {
          copyStr = copyStr+"";
      }
      if( typeof(copyStr) != "string" ) {
        layer.msg("复制参数错误");
          return;
      }
      try {
          //创建选择区域
          var jDom = $("#__copy_temp_data").length > 0 ? $("#__copy_temp_data"):$("<input id='__copy_temp_data' style='position:absolute;top:0;left:0;z-index:-50;opacity:0;border:0;' readonly>");
          apdDom.append(jDom);
          jDom.val(copyStr);
          var strLen = copyStr.length;
          //创建选择区域
          if(jDom.get(0).createTextRange) {//IE浏览器
              var range = jDom.get(0).createTextRange();
              range.moveStart("character", 0);
              range.moveEnd("character",strLen);
              range.select();
          } else {//非IE浏览器
              jDom.get(0).setSelectionRange(0,strLen);
              jDom.get(0).focus();
          }
          return true;
      }
      catch(e) {//不支持h5黏贴 或 不支持选中功能
          return false;
      }
  }
  var res = beforeCopy( str );
  var isOk = false;
  if( res ) {//支持h5
      var isCopyOk = document.execCommand('copy');//h5复制成功
      if(isCopyOk) {
          isOk = true;
      }
  }
  if(!isOk) {
    layer.msg("当前浏览器版本过低，复制失败，建议使用谷歌浏览器");
  } else {
    layer.msg("复制成功");
  }
  $("#__copy_temp_data").remove();
}
  },
  created: function () {
    // $(document).keyup(function (event) {
    //   if (event.keyCode == 13 || event.keyCode == 32) {
    //     vue.query();
    //   }
    // });
  },
});
vue.onLoad();