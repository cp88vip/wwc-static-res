(function(e){var c=false;var g=null;var i={};var l={};var k={};var m;var j;var h;var a;var b="JS_blockPage";var f={};var d=false;e.getMousePosition=function(o){var n=0;var p=0;if(!o){var o=window.event}if(o.pageX||o.pageY){n=o.pageX;p=o.pageY}else{if(o.clientX||o.clientY){n=o.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;p=o.clientY+document.body.scrollTop+document.documentElement.scrollTop}}return{x:n,y:p}};e.updatePosition=function(r){var u=e.getMousePosition(r);var s=(u.x-m);var q=(u.y-j);var p=h+q;if(p<-5){p=-5}var n=e(window).height()-e("#"+b).height()+5;if(p>n){p=n}var t=a+s;if(t<-5){t=-5}var o=e(window).width()-e("#"+b).width()+5;if(t>o){t=o}e(g).css("top",p);e(g).css("left",t)};e(document).mousemove(function(n){if(c&&f[g.id]!="false"){e.updatePosition(n);if(l[g.id]!=undefined){l[g.id](n,g)}return false}});e(document).mouseup(function(n){if(c&&f[g.id]!="false"){c=false;if(i[g.id]!=undefined){i[g.id](n,g)}return false}});e.fn.ondrag=function(n){return this.each(function(){l[this.id]=n})};e.fn.ondrop=function(n){return this.each(function(){i[this.id]=n})};e.fn.dragOff=function(){return this.each(function(){f[this.id]="off"})};e.fn.dragOn=function(){return this.each(function(){f[this.id]="on"})};e.fn.setHandler=function(n){return this.each(function(){var o=this;k[this.id]=true;e(o).css("cursor","");f[o.id]="handler";e("#"+n).css("cursor","move");e("#"+n).mousedown(function(p){d=true});e("#"+n).mouseup(function(p){d=false})})};e.fn.easydrag=function(n){return this.each(function(){if(undefined==this.id||!this.id.length){this.id="easydrag"+(new Date().getTime())}k[this.id]=n?true:false;f[this.id]="on";e(this).css("cursor","move");e(this).mousedown(function(o){if((f[this.id]=="off")||(f[this.id]=="handler"&&!d)){return k[this.id]}e(this).css("z-index",parseInt(new Date().getTime()/1000));c=true;g=this;var p=e.getMousePosition(o);m=p.x;j=p.y;h=this.offsetTop;a=this.offsetLeft;e.updatePosition(o);return k[this.id]})})}})(jQuery);