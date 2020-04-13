var Download = {
  init:function () {
    var iosDownload = "", androidDownload = "";
    var userAgent = Utils.getUserAgentType();

    Utils.request('front/homepage/get_sidebar_config.do', {}, function(res) {
      if (res.code == 0) {
        var _data = res.data;
        for (var i = 0; i < _data.length; i++) {
          var each = _data[i];
          if (each.value.length > 0) {
            if (each.remark == "ANDROID_IMG") {
              $("#img-android").parent().show();
              $("#img-android").attr('src', each.value);
              $("#img-android-float").attr('src', each.value);
              $("#img-android-footer").attr('src', each.value);
            } else if (each.remark == "IOS_IMG") {
              $("#img-apple").parent().show();
              $("#img-apple").attr('src', each.value);
              $("#img-apple-float").attr('src', each.value);
              $("#img-apple-footer").attr('src', each.value);
            } else if (each.remark == "IOS_DOWNLOAD") {
              iosDownload = each.value;
            } else if (each.remark == "ANDROID_DOWNLOAD") {
              androidDownload = each.value;
            } else {
              // console.log("nothing");
            }
          }
        }
      }
    },function () {},true);

  $(".wap-search").on("click", "a", function(e){
    window.location.href = location.protocol+"//"+location.hostname+(location.port != "" ? ":"+location.port : "")+"/mobile/";
  });

  $(".app-enter").on("click", "a", function(e){
    var appType = $(this).attr("class");
    if (appType == "ios") {
      if (iosDownload.length > 0 ) {
        window.location.href = iosDownload;
      } else {
        _alert('暂无IOS版下载')
      }
    } else if (appType == "android") {
      if (androidDownload.length > 0) {
        window.location.href = androidDownload;
      } else {
        _alert('暂无安卓版下载')
      }
    }
  });
  }
}
