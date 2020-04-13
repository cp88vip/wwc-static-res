var vue = new Vue({
	el : '#page-wrapper',
	data : {
    items:[],
    isShowEditor : false,
    trees : null,
    level : {
      id : null,
      name : null,
      amount : null
    },
    totalPages : 0,
    totalRows : 0,
    currentPage : 1,
    isShowPageNav : false,
    action : null,
    levelOptions : {}
	},
	methods : {
		onLoad : function() {

			this.request();
		},
		request : function(){
      var that = this;
      request('/manage/member/managers_levels.do',this.requestData,function(e){
        that.items = e.data;
          // that.users = e.data.users;
          // var totalRows = e.data.total;
          // that.totalPages = Math.ceil((totalRows ? totalRows : 0) / that.requestData.count);
          // that.isShowPageNav = that.totalPages > 1;
      });
		},
    treeInit: function(){
      var that = this;
      var checkableTree = $('#treeview-checkable').treeview({
        data: defaultData,
        showIcon: false,
        showCheckbox: true,
        onNodeChecked: function(event, node) {
          $('#checkable-output').prepend('<p>' + node.text + ' was checked</p>');
        },
        onNodeUnchecked: function (event, node) {
          $('#checkable-output').prepend('<p>' + node.text + ' was unchecked</p>');
        }
      });
      that.trees = checkableTree;
    },
    // doEnabled : function(username, enabled) {
    //   var that = this;
    //   request('/manage/member/dis_enabled.do', {account:username, enabled:enabled}, function() {
    //     var count = that.users.length;
    //     for(var i=0; i< count; i++) {
    //       if(that.users[i].account == username) {
    //         that.users[i].enabled = enabled;
    //         layer.msg("操作成功");
    //         break;
    //       }
    //     }
    //   })
    // },
    addLevel : function() {
      this.isShowEditor = true;
      this.action = 'add';
      this.level.name = null;
      this.level.amount = null;
      this.level.id = null;
    },
    editLevel : function (level) {
      this.isShowEditor = true;
      this.action = 'edit';
      this.level.name = level.name;
      this.level.amount = level.amount;
      this.level.id = level.id;
    },
    delLevel: function(id) {
      var that = this;
      layer.confirm('确定删除？', {
        btn: ['确定', '取消']
      }, function(){
        request('/manage/member/delete_level.do', {}, function(){
          layer.msg(e.msg);
          that.request();
        });
      }, function(){
        layer.closeAll();
      });
    },
    submit : function() {
      var url, data;
      var that = this;
      if(this.action == 'add') {
          url = '/manage/member/edit_level.do';
          data = {
            currentId : this.level.id,
            name : this.level.name,
            amount: this.level.amount
          };
      } else if (this.action == "edit") {
          url = '/manage/member/add_level.do';
          data = {
            name : this.level.name,
            amount: this.level.amount
          };
      } else {
        return false;
      }
      request(url, data, function(){
          that.request();
          layer.msg('操作成功');
          // that.hideEditor();
      });
    }
	}
});
vue.onLoad();
