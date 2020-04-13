/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 17:14:34
 * @LastEditTime: 2019-08-19 20:48:51
 * @LastEditors: Please set LastEditors
 */
 function shiftTo() {

    Utils.request('passport/check_status.do', {}, function(data) {
        if(data.code==0){
            let index = layer.open({
                title:"转入余额宝",
                content: `<span style="font-size:16px;margin:40px 0">系统余额：${data.data.balance.toFixed(2)}元<br/><br/>转入额度：<input placeholder=" 请输入金额" id='inp1' onfocus='clear1(1)' onblur='show(1)'/><span id='s1' style="color:red"></span></span>`,
                btn:['确定','取消'],
                area: ['500px','300px'],
                yes:function(){
                  //   请求转入接口
                  if($('#inp1').val()){
                    if(show(1)){
                      layer.close(index)
                      let params={
                          userId:data.data.userId,
                          amount:$.trim($('#inp1').val())
                      }
                      Utils.request('interest/rate/deposit.do',params,function (data) {
                          if(data.code==0){
                              layer.open({
                                  title:"转入余额宝",
                                content: `<img src='/pc/common/statics/img/userCenter/success.jpg' style="width:60px;vertical-align:middle"/><span style='font-size:16px'>${data.msg}</span>`,
                                  time:3000,
                                  area: ['520px','160px'],
                                  btn:['确认']
                                 })
                                 window.gitDetails()
                                }else{
                              _alert(data.msg)
                          }
                      })
                    }  
                  }
                  else{
                      
                    $('#s1').text('请输入转入金额')
                  }
                   
                }
             }) 
        }})
    

    } 
         
              
                 
            
   