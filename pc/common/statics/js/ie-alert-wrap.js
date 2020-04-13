var innerIeWrap = function(){
  var strAlert = '<div class="ie-alert-wrap" style="display: none;">'+
      '<h1>是时候升级你的浏览器了</h1>'+
      '<p>你正在使用 Internet Explorer 的早期版本（IE9以下版本 或使用该内核的浏览器）。这意味着在升级浏览器前，你将无法访问此网站。</p>'+
      '<hr>'+
      '<h2>请注意：Windows XP 及 Internet Explorer 早期版本的支持已经结束</h2>'+
      '<p>自 2016 年 1 月 12 日起，Microsoft 不再为 IE 11 以下版本提供相应支持和更新。没有关键的浏览器安全更新，您的 PC 可能易受有害病毒、间谍软件和其他恶意软件的攻击，它们可以窃取或损害您的业务数据和信息。请参阅 <a href="https://www.microsoft.com/zh-cn/WindowsForBusiness/End-of-IE-support">微软对 Internet Explorer 早期版本的支持将于 2016 年 1 月 12 日结束的说明</a> 。</p>'+
      '<hr>'+
      '<h2>更先进的浏览器</h2>'+
      '<p>推荐使用以下浏览器的最新版本。如果你的电脑已有以下浏览器的最新版本则直接使用该浏览器访问<b id="referrer"></b>即可。</p>'+
      '<ul class="browser">'+
        '<li class="browser-chrome"><a href="http://www.google.cn/chrome/browser/index.html?hl=zh-CN&standalone=1" target="_blank"> 谷歌浏览器<span>Google Chrome</span></a></li>'+
        '<li class="browser-360"><a href="http://se.360.cn/" target="_blank"> 360安全浏览器 <span>360用户推荐</span></a></li>'+
        '<li class="browser-firefox"><a href="http://www.firefox.com.cn/" target="_blank"> 火狐浏览器<span>Mozilla Firefox</span></a></li>'+
        '<li class="browser-ie"><a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_blank"> IE浏览器<span>Internet Explorer</span></a></li>'+
        '<li class="browser-qq"><a href="http://browser.qq.com/" target="_blank"> QQ浏览器9 <span>全新升级版本</span></a></li>'+
        '<div class="clean"></div>'+
      '</ul>'+
      '<hr>'+
      '<h2>为什么会出现这个页面？</h2>'+
      '<p>如果你不知道升级浏览器是什么意思，请请教一些熟练电脑操作的朋友。如果你使用的不是IE6/7/8/9/10，而是360浏览器、QQ浏览器、搜狗浏览器等，出现这个页面是因为你使用的不是该浏览器的最新版本，升级至最新即可。</p>'+
  '</div>';
  var strBg = '<div class="ie-alert-bg" style="display: none;"></div>';
  $('body').append(strAlert+strBg);
}
