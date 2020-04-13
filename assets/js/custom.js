
/*=============================================================
    Authour URI: #
    License: Commons Attribution 3.0

    http://creativecommons.org/licenses/by/3.0/

    100% To use For Personal And Commercial Use.
    IN EXCHANGE JUST GIVE US CREDITS AND TELL YOUR FRIENDS ABOUT US

    ========================================================  */

(function ($) {
    "use strict";
    var filterMenuId = [1, 10, 12, 29]; // 试玩环境，只显示的导航列表
    var mainApp = {

        metisMenu: function () {

            /*====================================
            METIS MENU
            ======================================*/

            $('#main-menu').metisMenu();

        },


        loadMenu: function () {

            /*====================================
            LOAD APPROPRIATE MENU BAR
         ======================================*/

            $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });
        },
        slide_show: function () {

            /*====================================
           SLIDESHOW SCRIPTS
        ======================================*/

            $('#carousel-example').carousel({
                interval: 3000 // THIS TIME IS IN MILLI SECONDS
            })
        },
        reviews_fun: function () {
            /*====================================
         REWIEW SLIDE SCRIPTS
      ======================================*/
            $('#reviews').carousel({
                interval: 2000 //TIME IN MILLI SECONDS
            })
        },
        wizard_fun: function () {
            /*====================================
            //horizontal wizrd code section
             ======================================*/
            // $(function () {
            //     $("#wizard").steps({
            //         headerTag: "h2",
            //         bodyTag: "section",
            //         transitionEffect: "slideLeft"
            //     });
            // });
            /*====================================
            //vertical wizrd  code section
            ======================================*/
            // $(function () {
            //     $("#wizardV").steps({
            //         headerTag: "h2",
            //         bodyTag: "section",
            //         transitionEffect: "slideLeft",
            //         stepsOrientation: "vertical"
            //     });
            // });
        },
        menu_authority: function(){
            var user = JSON.parse(sessionStorage.getItem("user"));
            request("/passport/check_status.do", {}, function(res){
    			// console.log(res);
                user = res.data;
                sessionStorage.setItem("user", JSON.stringify(res.data));
    		});
          var iconList = [{
              icon: "glyphicon glyphicon-usd",
              name: "财务管理"
          }, {
              icon: "fa fa-yelp",
              name: "彩票记录"
          }, {
              icon: "fa fa-group",
              name: "会员管理"
          }, {
              icon: "fa fa-bar-chart",
              name: "报表管理"
          }, {
              icon: "fa fa-anchor",
              name: "彩种管理"
          }, {
              icon: "fa fa-apple",
              name: "IOS"
          }, {
              icon: "fa fa-android",
              name: "Android"
          }, {
              icon: "fa fa-user",
              name: "管理员管理"
          },{
              icon: "glyphicon glyphicon-bullhorn",
              name: "信息公告"
          },{
              icon: "glyphicon glyphicon-log-in",
              name: "推送管理"
          },{
              icon: "glyphicon glyphicon-fire",
              name: "活动管理"
          }, {
              icon: "fa fa-cogs",
              name: "系统设置"
          }];
          /* menu */

          var menuList = function(data) {
              var menuDiv = $("#main-menu");
              var menus = '', m = 'mainMenu';
              var menuInx = sessionStorage.getItem(m);

              //根据菜单主键id生成菜单列表html
              //id：菜单主键id
              //arry：菜单数组信息
              var GetData = function (id, arry, parent) {
                  if (id === undefined) { return false; }
                  if (parent) {
                      if (parent.parentId != 0) { //第三层返回
                          return false;
                      }
                  }
                  var childArry = GetParentArry(id, arry);
                  if (childArry.length > 0) {
                      if (id == 0) {
                          var ulAttr = '';//第一层
                          var floor = 1;
                          var arrow = '<span class="fa arrow"></span>';
                          var icon = '';

                      } else {
                          if (parent) {
                              var ulAttr = 'class="nav nav-second-level"';
                              var floor = 2;
                              var arrow = '';
                              var icon = '';
                              menus += '<ul '+ulAttr+'>';
                          } else {
                              return false;
                          }
                      }
                      /* ** */
                      for (var i = 0; i < childArry.length; i++) {
                          var liAttr = "", aAttr = "";
                          if (floor && floor == 1) {
                              liAttr = 'class="ls" ';
                              aAttr = 'href="javascript:void(0)" data-authorityId="'+childArry[i].id+'"';
                              var cn = 'glyphicon glyphicon-usd';
                              for (var j = 0; j < iconList.length; j++) {
                                  var ic = iconList[j];
                                  if (ic.name.indexOf(childArry[i].name) > -1) {
                                      cn = ic.icon;
                                      break;
                                  }
                              }
                              icon = '<i class="'+cn+'"></i>';
                          } else if (floor && floor == 2) {
                              liAttr = '';
                              aAttr = 'href="' + (childArry[i].redirect ? childArry[i].redirect : 'javascript:void(0)') + '" data-authorityId="'+childArry[i].id+'"';
                              icon = '<i class="fa fa-flask"></i>';
                          } else {
                              return false;
                          }
                          //'+aAttr+'  + arrow
                          menus += '<li ' + liAttr + '><a ' + aAttr + '>' + icon + childArry[i].name + arrow + '</a>';
                          GetData(childArry[i].id, arry, childArry[i]);
                          menus += '</li>';
                      }
                      /* ** */
                      if (id != 0) {
                          menus += '</ul>';
                      }
                  }
              }
              //根据菜单主键id获取下级菜单
              //id：菜单主键id
              //arry：菜单数组信息
              var GetParentArry = function (id, arry) {
                  var newArry = [];
                  for (var i in arry) {
                      if (arry[i].parentId == id) //只到第二层
                          newArry.push(arry[i]);
                  }
                  return newArry;
              }

              GetData(0, data, null);
              menuDiv.append(menus);
              if (menuInx) {
                // console.log(menuInx);
                menuDiv.find('.ls').find('a[data-authorityId='+menuInx+']').parent().addClass('active');
                menuDiv.find('.ls').find('a[data-authorityId='+menuInx+']').siblings('.collapse').addClass('in');
              }
              menuDiv.on("click", ".ls", function(e){
                var t = $(this);//, a = t.siblings('a');
                if (t.hasClass('active')) {
                  // sessionStorage.setItem(m, a.attr("authorityId"));
                  sessionStorage.setItem(m, t.find('a').attr("data-authorityId"));
                }
              });
          }
            //  增加条件，切换试玩和正式环境，要重新获取一次导航列表
            var _playType = sessionStorage.getItem('playType');
            if (_playType != 0 && _playType != 1) {
                _playType == 0
            }
            if (sessionStorage.getItem("menu")) {
                var _menus = JSON.parse(sessionStorage.getItem("menu"));
                if (_playType == 0) {
                    var _list = []; // 筛选出试玩的导航列表
                    for (var i = 0; i < _menus.length; i++) {
                        var _each = _menus[i];
                        if (filterMenuId.indexOf(_each.id) > -1 || filterMenuId.indexOf(_each.parentId) > -1) {
                            _list.push(_each)
                        }
                    }
                    _menus = _list
                }
                menuList(_menus);
            } else {
                requestSyn(" /manage/permission/init_menu.do", {}, function(res) {
                    if (res.code == 0) {
                        res.data.sort(function(a, b){ return a.id - b.id; });
                        var _menus = res.data;
                        sessionStorage.setItem("menu", JSON.stringify(_menus));
                        if (_playType == 0) {
                            var _list = []; // 筛选出试玩的导航列表
                            for (var i = 0; i < _menus.length; i++) {
                                var _each = _menus[i];
                                if (filterMenuId.indexOf(_each.id) > -1 || filterMenuId.indexOf(_each.parentId) > -1) {
                                    _list.push(_each)
                                }
                            }
                            _menus = _list
                        }
                        menuList(_menus);
                    }
                });
            }
      }

    };
    $(document).ready(function () {
        var _path = location.pathname;
        // console.log( !_path.match('/agent') );
        if (!_path.match('/agent')) {
          mainApp.menu_authority();
        }
        mainApp.metisMenu();
        mainApp.loadMenu();
        mainApp.slide_show();
        mainApp.reviews_fun();
        mainApp.wizard_fun();

    });
}(jQuery));
