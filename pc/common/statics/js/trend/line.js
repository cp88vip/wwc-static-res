//下面方法来自 @ Moda
window.canvas_util = {
    //获得一个html的dom的x，y轴的距离
    getElemPos : function ( obj ){
        var pos = {"top":0, "left":0};
        if (obj.offsetParent){
            while (obj.offsetParent){
                pos.top += obj.offsetTop;
                pos.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        }else if(obj.x){
            pos.left += obj.x;
        }else if(obj.x){
            pos.top += obj.y;
        }
        return {x:pos.left, y:pos.top};
    },
    //初始化canvas的宽高( 注： 参数是一个原声的dom，不是jquery的dom)
    initCanvas:function( canvasObj ){
        $(canvasObj).attr("width",$(canvasObj).width());
        $(canvasObj).attr("height",$(canvasObj).height());
    },
    /*功能：画直线
     *   参数说明：
     *   {
     radius: 10,  //球的半径
     color: "#960CFF",  //线的颜色
     points: Array , //一个数组，每个数组的元素是个右边格式的对象 [ {x：23，y:56} , x：34，y:5}] ，分辨表示 x， y 轴的距离,数组的每个元素代表一个点
     dom : dom   // canvas标签（注：是一个原声的dom，不是jquery的dom）
     }
     */
    modaCanvas:function( obj ){
        var statics_value = {
            radius:( obj && obj.radius )?obj.radius:0,  // 球的半径
            color:( obj && obj.color )?obj.color:"#06B96E"
        };
        if( !obj.points.length || obj.points.length < 2  )
        {
            return;
        }
        var points = obj.points;
        var canvas = obj.dom?obj.dom:document.getElementsByTagName("canvas")[0];
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = statics_value.color;
        var arrLength = points.length ;
        for( var i = 1 ; i < arrLength; i++ )
        {
            ctx.beginPath();
            ctx.moveTo( points[i-1].x, points[i-1].y );
            ctx.lineTo(points[i].x, points[i].y);
            ctx.stroke();
            ctx.lineWidth=2;
            ctx.closePath();
            if( i>=0 )
            {
                ctx.beginPath();
                ctx.clearRect(points[i-1].x-(statics_value.radius-3), points[i-1].y-(statics_value.radius-3),(statics_value.radius-3)*2,(statics_value.radius-3)*2);
                ctx.closePath();
            }
        }
        ctx.beginPath();
        ctx.clearRect(points[arrLength-1].x-(statics_value.radius-3), points[arrLength-1].y-(statics_value.radius-3),(statics_value.radius-3)*2,(statics_value.radius-3)*2);
        ctx.closePath();
    }
};
// canvas 的 dom
var canvasDom = document.getElementById("canvas_div")?document.getElementById("canvas_div"):$("#chartsTable").parent().append("<canvas id=\"canvas_div\" class=\"moda\"></canvas>").parent().find("canvas#canvas_div").get(0);
window.resizeCanvas = function()
{
    var pointsArr = [] ;
    for( var k = 0 ; k <  _canvas.lineNum ; k++ )
    {
        pointsArr.push(new Array());
    }
    var ball_row_arr = $("#chartsTable tr.ball_row");
    var eachLength = ball_row_arr.length ;
    // if (eachLength == 0) {
    //   return ;
    // }
    $("#chartsDiv>div").width($("#chartsTable").width());
    var  parentSelector = $('#iframe_div', window.parent.document);
    if (parentSelector.length) {
      if (parentSelector) {
        parentSelector.css("height", $(parentSelector.find('iframe').get(0).contentWindow.document).find("body").height()+"px");
      }
    }

    //初始化canvas的宽高
    canvas_util.initCanvas( canvasDom );
    var ball_radius = 8;  //球的半径
    var parent_position = canvas_util.getElemPos(canvasDom);
    function getPosition(  child )
    {
        var childP = canvas_util.getElemPos(child);
        return {x:childP.x +  ball_radius -  parent_position.x+2 , y:childP.y+ ball_radius -  parent_position.y+2};
    }
    for( var _a = 0 ; _a< eachLength ; _a++  )
    {
        var arr = $(ball_row_arr[_a]).find(".ball01");
        for ( var q= 0 ; q<arr.length ; q++ )
        {
            pointsArr[q][_a] = getPosition(arr[q]);
            if(q%2!=0)
                $(arr[q]).addClass("ball01_yellow");
        }
    }
    for( var _k = 0 ; _k <  _canvas.lineNum ; _k++ )
    {
        var colorArr = ["#06B96E","#EA721A"];//绿， 黄
        canvas_util.modaCanvas(
            {
                radius:ball_radius,
                color:_k%2==0?colorArr[0]:colorArr[1],
                points:pointsArr[_k] ,
                dom:canvasDom
            }
        );
    }
};
// 缩放视窗
$(function(){
    $( window ).resize(function() {
        if( 1 == _canvas.isShowLine || "1" == _canvas.isShowLine )
        {
            resizeCanvas();
        }
    });
});
