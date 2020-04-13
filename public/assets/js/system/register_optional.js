window.statusObj = {
	"turnOn": 1,
	"turnOff": 0
}
var vue = new Vue({
	el : '#page-wrapper',
	data : {
		account : null,
		listData : {
			account : null,
			remark : null,
			offset : 0,
			count : 20,
			// id : 0,
			// type : 'manager'
		},
		// modal:{
		// 	id: "editModal",
		// 	items: [],
		// 	roleId: null
		// },
    totalPages : 0,
    totalRows : 0,
    // currentPage : 1,
    // isShowPageNav : false,
    // isShowEditor : false,
    // action : null,
    one : {},
    options : []
	},
	methods : {
		onLoad : function() {
			this.request();
      // this.setTable();
		},
    // setTable: function(){
    //   // options = [{
    //   //   title: "真实姓名",
    //   //   isShow: true,
    //   //   isHaveto: true
    //   // }, {
    //   //   title: "QQ",
    //   //   isShow: true,
    //   //   isHaveto: true
    //   // }, {
    //   //   title: "手机",
    //   //   isShow: true,
    //   //   isHaveto: true
    //   // }, {
    //   //   title: "邮箱",
    //   //   isShow: false,
    //   //   isHaveto: false
    //   // }, {
    //   //   title: "微信号",
    //   //   isShow: false,
    //   //   isHaveto: false
    //   // }，{
    //   //   title: "银行卡号",
    //   //   isShow: false,
    //   //   isHaveto: false
    //   // }, {
    //   //   title: "推广码",
    //   //   isShow: false,
    //   //   isHaveto: false
    //   // }]
    // },
		request : function(){
			var that = this;
            request('/manage/registrable_options/list.do', {}, function(e){
			// request('/manage/registrable_options/list.do', {}, function(e){
                  if (e.code == 0) {
                      console.log(e);
                      // for(var i = 0 ; i<e.data.size ; i ++ ){
                      //   // e.data[i].
                      // }
                      that.options = e.data;
                  }
			});
		},
    doUpdate: function(e, option){
      var data = option; var element = e.currentTarget;
			var lis = $("input[name="+$(element).attr('name')+"]:checked");
      var otherelename = $(element).parent().siblings("td").find("input").attr('name');
      var otherlis = $("input[name="+otherelename+"]:checked");
      var elename =$(element).attr('name');
      
      if((elename == "required")){
        if ($(element).prop("checked")) {
          // if($("input[name='show']:checked").length==2 && !($(element).parent().siblings("td").find("input[name='show']").prop("checked")) ){
          //   layer.msg("注册选项不能超过两项");
          //   $(element).prop("checked", false);
          //   return false;
          // }
          $(element).parent().siblings("td").find("input[name='show']").prop("checked", true);
          data['show'] = ($(element).prop('checked') ? 1 : 0);
        }else{
          $(element).parent().siblings("td").find("input[name='show']").prop("checked", false);
          data['show'] = ($(element).prop('checked') ? 1 : 0);
        }
      }

      if((elename == "show")){
        if(!$(element).prop("checked")){
          $(element).parent().siblings("td").find("input[name='required']").prop("checked", false);
          data['required'] = ($(element).prop('checked') ? 1 : 0);
        }
      }
      
			// if (lis.length > 2 || otherlis.length >2) {
			// 	layer.msg("注册选项不能超过两项");
			// 	if ($(element).prop("checked")) {
			// 		$(element).prop("checked", false);
			// 	} else {
			// 		$(element).prop("checked", true);
			// 	}
			// 	return false;
			// }
      // console.log($(element).prop('checked'));
      data[$(element).attr('name')] = ($(element).prop('checked') ? 1 : 0);
      // console.log(data);
      var _regitopationts = this;
        var lock = false; //默认未锁定
      layer.confirm('确定修改？', {
        btn: ['确定', '取消'],
        closeBtn: 0,
      }, function(index, layero){
          if(!lock) {
              lock = true; // 锁定
              request('/manage/registrable_options/update.do', data, function(res){
                  // that.users = e.data.users;
                  // var totalRows = e.data.total;
                  if (res.code == 0) {
                      // console.log(res);
                      _regitopationts.request();
                      layer.closeAll();
                  }
              });
          }

      }, function(){
        if ($(element).prop('checked')) {
          $(element).prop('checked', false);
        } else {
          $(element).prop('checked', true);
        }
      });

    },

	}
});
vue.onLoad();
