/*
简易bootstrap 模拟块
*/
var doc = document;
var easyModal = {
  modalType: {
    table: 0,
    display: 1,
  },
  htmls: function(type, data){
    var that = this, _ts = {};
    var buildTable = function(dict) {
      var str = '';
      var columnStr = function(colArr, colData){
        var str = '', lineFlag = 0;
        for (var i = 0; i < colArr.length; i++) {
          var eCol = colArr[i];
          if (lineFlag == 0) {
            str += '<div class="form-group">';//创建一行
          }
          lineFlag += parseInt(eCol.col);
          if (lineFlag <= 12) {//若多个col都在同一行，继续添加元素
            if (eCol.type) {
              if (eCol.type == 'textarea') {
                var _input = '<textarea type="textarea" class="form-control" name="'+(eCol.name?eCol.name:'')+'"></textarea>';
              } else {
                var _input = '<input type="'+(eCol.type?eCol.type:'text')+'" class="form-control" name="'+(eCol.name?eCol.name:'')+'" placeholder="" '+(eCol.disabled?''eCol.disabled : ')'+' />';
              }
            } else {
              var _input = '<input type="'+(eCol.type?eCol.type:'text')+'" class="form-control" name="'+(eCol.name?eCol.name:'')+'" placeholder="" />';
            }
            str += '<label class="col-sm-2 control-label">'+(eCol.title?eCol.title:'')+'</label>'+
                  '<div class="col-sm-'+(parseInt(eCol.col)-2)+'">'+_input+'</div>';

          } else {//该换行了
            lineFlag = 0;
            str += '</div>';
            i--;
          }
        }

        return str;
      };
      str += '<div class="modal fade" id="'+dict.id+'" tabindex="-1" role="dialog" aria-hidden="true">';
      str += '<div class="modal-dialog"><div class="modal-content">';
      str += '<div class="modal-header"><button type="button" class="close btn-cancel" data-dismiss="modal" aria-hidden="true" >&times;</button><h4 class="modal-title" id="'+dict.id+'Label">'+dict.head+'</h4></div>';
      str += '<div class="modal-body"><form class="form form-horizontal" id="'+dict.id+'Form">';
      str += columnStr(dict.columns, dict.data);
      str += '</form></div>';
      str += '<div class="modal-footer"><button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary btn-submit">提交</button></div>';
      str += '</div></div>';
      str += '</div>';
      return str;
    }
    switch (type) {
      case that.modalType.table:
        _ts.html = buildTable(data);
        break;
      //
      default:

    }
    return _ts;
  },
  constructor: function(config) {
    var _ts = {}, that = this;
    _ts.el = config.el ? config.el : "editModal";
    _ts.data = [];
    _ts.head = config.head ? config.head : "";
    _ts.type = config.type ? config.type : that.modalType.table;
    _ts.columns = config.columns ? config.columns : [];
    // if (typeof config.submit === "function") {
    //   _ts.submit = config.submit;
    //   _ts.init();
    // } else {
    //
    // }
    var obtain = function(fn){
      request(config.url, (config.data? config.data : {}), function(res){
        console.log(res);
        if (typeof fn === "function") {
          fn(res);
        }
      })
    }
    _ts.init = function() {
      if (config.url) {
        obtain(function(res){
          _ts.data = res.data;
          var modalWeb = that.htmls(_ts.type, {id: _ts.el, head: _ts.head, data: _ts.data, columns: _ts.columns});
          $("body").append(modalWeb.html);
        });
      } else {
        _ts.data = config.staticData ? config.staticData : [];
        var modalWeb = that.htmls(_ts.type, {id: _ts.el, head: _ts.head, data: _ts.data, columns: _ts.columns});
        $("body").append(modalWeb.html);
      }

      _ts.modal = $('#'+_ts.el);
      if (_ts.modal.length > 0) {
        control();
      }
    }
    var control = function(){

    }
    _ts.init();
    return _ts;
  }
};

/**
var a = easyModal.constructor({
  el: 'testModal',

  type: easyModal.modalType.display,
  head: "会员详细信息",
  // url: "/manage/member/user_info.do",
  // data: {
  //
  // },
  staticData: {
    // {'account': 'aa', 'agent': 'no', 'password': '123456', 'repassword': '123456'},
    'account': 'aa', 'password': '123456', 'repassword': '123456'
  },
  columns: [
    {'title': '登录账号', 'name': 'account', 'col': 6, 'type': 'text'},//col为行宽，值取4~12，必填
    {'title': '所属代理', 'name': 'agent', 'col': 6, 'type': 'text'},
    {'title': '密码', 'name': 'password', 'col': 6, 'type': 'password', 'disabled': true},
    {'title': '确定密码', 'name': 'repassword', 'col': 6, 'type': 'password', 'disabled': true},
    {'title': '会员姓名', 'name': 'username', 'col': 6, 'type': 'text'},
    {'title': '电话', 'name': 'phone', 'col': 6, 'type': 'text'},
    {'title': '会员等级', 'name': 'phone', 'col': 9, 'type': 'select', 'options': [
      {value: 0, text: "超级会员"}
    ]},
    {'title': '备注', 'name': 'remarks', 'col': 12, 'type': 'textarea'},
  ],
  // submit: function(url, res) {
  //   console.log(res);
  // }
});
**/
