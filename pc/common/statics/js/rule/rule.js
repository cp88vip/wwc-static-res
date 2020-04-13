var vue = new Vue({
    el: '#wrap',
    data: {
        list :null,
        lottery: "",
        iconUrl: "",
        pageText: "",
        listh: [],
        listl: [],
    },
    methods: {
        onload(){
            that = this;
            var id = decodeURI(location.href).split("?")[1];
            webStorageTool.getLotteryList(function (list) {
              that.handleData(list,id);
            },function (msg) {
              _alert(msg);
            });
        },
        handleData (list,id) {
          that.list = list;
          var item = null;
          $.each(list, function(i, val){
              if (!id && i == 0) {
                  item = val;
                  return false;
              }
             if (val.lotteryId == id) {
                  item = val;
                  return false;
             }
          });
          that.select(item);
          for (var i = 0;i < list.length;i++) {
              if (list[i].type == "h") {
                  that.listh.push(list[i]);
              }
              if (list[i].type == "l") {
                  that.listl.push(list[i]);
              }
          }
        },
        locationHref(l){
            return "__openWin('home', '/pc/rule/index.html?"+l+"')"
        },
        select(item){
            // console.log(item, '')
            that = this
            var id = item.lotteryId;
            var name = item.name;
            that.lottery = name;
            that.iconUrl = _home_menu.getLotteryIconUrl(id);
            // console.log(item)
            if (item.lotteryClassName.indexOf("SevenStar") > -1) {
                that.pageText =`
                <p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p>
                <br>
                <div data-v-062258f5="" class="right_top">
        <div data-v-062258f5="" class="right_top_top">
            <span data-v-062258f5="" class="right_top_icon"></span>
            <span data-v-062258f5="" class="right_top_title"></span>
        </div>
    <div data-v-4d13681b="" data-v-062258f5="" class="agent_thatw">
      <div data-v-4d13681b="" class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-default ivu-table-border">
          <!---->
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 749px;">
              <colgroup>
                <col width="84">
                <col width="84">
                <col width="84">
                <col width="496">
                <!---->
              </colgroup>
              <thead>
                <tr>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">玩法群</span>
                      <!---->
                      <!---->
                    </div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">玩法组</span>
                      <!---->
                      <!---->
                    </div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">玩法</span>
                      <!---->
                      <!---->
                    </div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">玩法说明</span>
                      <!---->
                      <!---->
                    </div>
                  </th>
                  <!---->
                </tr>
              </thead>
            </table>
          </div>
          <div class="ivu-table-body" style="">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 749px;">
              <colgroup>
                <col width="84">
                <col width="84">
                <col width="84">
                <col width="496">
              </colgroup>
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>一定位</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>一定位</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>一定位</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从千位、百位、十位、个位位置上至少选择1个或1个以上号码，每注由1个号码组成，所选号码与相同位置上的开奖号码一致，即为中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>二定复式</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>二定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>二定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从千、百、十、个至少两位上各选1个号码组成一注，所选号码与开奖号码在指定位置上的号码相同，且顺序一致，即中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>三定复式</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>三定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>三定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从千、百、十、个至少三位上各选1个号码组成一注，所选号码与开奖号码在指定位置上的号码相同，且顺序一致，即中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>四定复式</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>四定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>四定复式</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从千、百、十、个四位，每个位置至少选择1个号码进行投注，所选号码与开奖号码在指定位置上的号码相同，且顺序一致，即中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>二字现</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>二字现</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>二字现</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从0-9个号码中任选2个或2个以上的号码进行投注，每注由2个不同的号码组成，当期开奖结果包含所选号码，即为中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>三字现</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>三字现</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>三字现</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从0-9个号码中任选3个或3个以上的号码进行投注，每注由3个不同的号码组成，当期开奖结果包含所选号码，即为中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>和值组选</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>和值组选</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>和值组选</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>和值即开奖四个号码的相加之和。和值组合大小单双属性： 0-17为小、18-36为大、和值奇数为单、和值偶数为双。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>前三</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>前三</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>前三大小单双</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从千、百、十位中的 大(56789)、小(01234)、单(13579)、双(02468) 中至少各选一个号码组成一注，所选号码的位置、形态与开奖号码的位置、形态形同，即为中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
                <tr class="ivu-table-row">
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!----> <span>后三</span>
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>后三</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>后三大小单双</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <!---->
                      <ul>
                        <li>从百、十、个位中的 大(56789)、小(01234)、单(13579)、双(02468) 中至少各选一个号码组成一注，所选号码的位置、形态与开奖号码的位置、形态形同，即为中奖。</li>
                      </ul>
                      <!---->
                    </div>
                  </td>
                </tr>
                <!---->
              </tbody>
            </table>
          </div>
          <div class="ivu-table-tip" style="display: none;">
            <table cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td style="width: 749px;"><span>暂无筛选结果</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!---->
          <!---->
          <!---->
          <!---->
        </div>
        <!----><object tabindex="-1" type="text/html" data="about:blank"
          style="display: block; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: none; padding: 0px; margin: 0px; opacity: 0; z-index: -1000; pointer-events: none;"></object>
      </div>
      <!---->
    </div>
  </div>
                
                `
            }
            if (item.lotteryClassName.indexOf("Football") > -1) {
                that.pageText = `<p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p>
                <b>
                <p id="f1" class="ff">
                    一.玩法说明
                </p>
                </b>
                <p>
                    目前，竞彩足球（也简称竞彩）推出5种玩法，分别为"<strong style="color:#333">胜平负</strong>"、"<strong style="color:#333">让球胜平负</strong>"、"<strong style="color:#333">比分</strong>、"<strong style="color:#333">总进球</strong>"和"<strong style="color:#333">半全场</strong>"，竞猜的比赛由国家体育总局体育彩票管理中心选定并向社会公布。竞彩足球的比赛对阵主队在前，客队在后。
                </p>
                <table border="0" cellspacing="0" cellpadding="0" width="100%" class="xl_ta">
                <tr>
                    <td>
                        <strong>玩法</strong>
                    </td>
                    <td>
                        <strong>规则</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                        胜平负
                    </td>
                    <td>
                        竞猜两支球队，在90分钟内（含伤停补时）的胜平负结果。
                    </td>
                </tr>
                <tr>
                    <td>
                        让球胜平负
                    </td>
                    <td>
                        竞猜两支球队，在90分钟内（含伤停补时）让球后的胜平负结果。
                    </td>
                </tr>
                <tr>
                    <td>
                        比分
                    </td>
                    <td>
                        竞猜两支球队，在90分钟内（含伤停补时）的比分。
                    </td>
                </tr>
                <tr>
                    <td>
                        总进球
                    </td>
                    <td>
                        竞猜两支球队，在90分钟内（含伤停补时）的总进球数量。
                    </td>
                </tr>
                <tr>
                    <td>
                        半全场
                    </td>
                    <td>
                        竞猜两支球队，在90分钟内（含伤停补时）上半场和全场的胜平负结果。该玩法不计算让球。
                    </td>
                </tr>
                </table>
                <p>
                    注：<br>
                    1、 让球胜平负<br>
                    “-”表示主队让客队，主队的净胜球大于让球数才算主胜；“+”表示客队让主队，客队的净胜球大于让球数才算主负。<br>
                    2、竞彩足球混投<br>
                    该玩法是指多场比赛之间不同玩法进行组合投注。同一场比赛的各种玩法不能组合成一注投注。<br>
                </p>
                <b>
                <p id="f2" class="ff">
                    二、过关方式
                </p>
                </b>
                <p>
                    选择1场比赛进行投注的为单场投注；选择2场或2场以上比赛进行串联投注的为过关投注。<br>
                    在过关投注中，所选比赛的结果全部竞猜正确才能中奖。<br>
                    1、胜平负玩法：串关最高上限为8串1。<br>
                    2、让球胜平负玩法：串关最高上限为8串1。<br>
                    3、比分玩法：串关最高上限为4串1。<br>
                    4、总进球玩法：串关最高上限为6串1。<br>
                    5、半全场玩法：串关最高上限为4串1。<br>
                </p>
                <b>
                <p id="f3" class="ff">
                    三、奖金计算
                </p>
                </b>
                <p>
                    1、 竞彩足球的过关投注奖金是根据用户出票时的赔率来计算奖金的，不受投注完成后的调整变化所影响，投注页面赔率也仅供参考。<br>
                    2、 过关奖金=单注奖金*倍数；单注奖金=2*所选比赛赔率连乘（只取小数点2位）<br>
                    例如：用户购买2场比赛2串1过关且中奖，出票时的赔率奖金分别是2.65和2.48，倍数为2倍，单注奖金=2×2.65×2.48=13.14，方案总奖金=13.14×2倍=26.28。<br>
                    3、 最高奖金<br>
                    单场投注，单注最高奖金限额10万元。<br>
                    2场或3场过关投注，单注最高奖金限额20万元。<br>
                    4场或5场过关投注，单注最高奖金限额50万元。<br>
                    6场及6场以上过关投注，单注最高奖金限额100万元。<br>
                </p>
                <b>
                <p id="f4" class="ff">
                    四、无效比赛的处理
                </p>
                </b>
                <p>
                    由于比赛取消、延期（比赛时间推迟且超过原定时间36小时或无法获知具体推迟时间）等原因，导致某场比赛被官方认定为无效场次，涉及该场次的投注结果均视为正确，赔率按1计算。
                </p>
                <b>
                <p id="f5" class="ff">
                    五、注意事项
                </p>
                </b>
                <p>
                    根据投注额、突发事件等因素，官方销售系统可能会拒绝某些大额投注，暂停或提前截止针对某场比赛的某些特定过关组合、特定结果选项的投注（也就是限号），暂停或提前截止针对某场比赛的所有投注（比赛延期等情况会提前截止）。
                </p>`
                return
            }
            issue = getIssueItem(id).issueNum
            frequency = getIssueItem(id).frequency
            if (item.lotteryClassName.indexOf('QuickThree') > -1) {
                var area = "";
                if(id == 1)  {time = "08:40至22:00"; issue = "40期";}
                if(id == 27) {time = "00:00至23:59"}
                if(id == 44) {time = "00:00至23:59"}
                if(id == 36) {time = "08:38至22:18"; issue = "41期"; area = "上海省"}
                if(id == 37) {time = "09:30至22:20"; issue = "39期"; area = "贵州省"}
                if(id == 32) {time = "09:00至22:00"; issue = "39期"; area = "湖北省"}
                if(id == 33) {time = "09:00至23:40"; issue = "44期"; area = "北京市"}
                if(id == 38) {time = "08:20至22:00"; issue = "41期"; area = "吉林省"}
                if(id == 35) {time = "09:59至21:59"; issue = "36期"; area = "甘肃省"}
                if(id == 34) {time = "08:50至22:10"; issue = "41期"; area = "河北省"}
                if(id == 31) {time = "08:30至22:10"; issue = "41期"; area = "江苏省";}
                if(id == 30) {time = "09:10至22:30"; issue = "40期"; area = "广西省";}
                if(id == 50) {time = "00:00至23:59"; issue = "288期";}
                that.pageText= `<h2><a href="#f1">一、游戏规则</a></h2>
                <h2><a href="#f2">二、中奖规则</a></h2>
                <h2><a href="#f3">三、玩法介绍</a></h2>
                <br>
                <p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p>
                <br>
                <b>
                <p id="f1"class="ff">
                    一、游戏规则
                </p>
                </b>
                <p>
                    （一）总则
                </p>
                1.根据《彩票管理条例》等有关规定，制定本规则。<br>
                2.中国福利彩票` + name + `游戏（以下简称“快三”）由中国福利彩票发行管理中心和组织销售，` + area + `福利彩票销售机构辖区域内承销。<br>
                3.快三采用计算机网络系统发行，在福彩机构设置的销售网点销售，定期开奖。<br>
                4.快三实行自愿购买，凡购买该彩票均被视为同意并遵守本规则。<br>
                5.不得向未成年人出售彩票或兑付奖金。
                <p>
                    （二）开奖与购买方式
                </p>
                1.本站` + name + `游戏每天进行` + issue + `，开奖时间为` + time +`，每隔` + frequency + `钟开奖一次。快三采用专用电子开奖设备开奖，每期随机生成3个号码，作为当期中奖号码。<br>
                2.每期开奖后，相关福彩机构应向社会公布开奖号码、将当期销售总额、开各奖级中奖情况及奖池资金余额等信息，并通过视频方式将开奖结果通知销售网点。<br>
                3.购买者可在对其选定的投注号码选择返点投注，返点越高投注赔率则低。购买者也可以进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号可分为连续追号和间隔追号，连续追号指追号的期数是连续的，间隔追号指追号的期数不连续。
                4.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>
                5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。
                <p>
                    （三）兑奖
                </p>
                1.无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。
                <p>
                    （四）玩法说明
                </p>
                1.快三投注是指以3个号码组合为一注彩票进行单式投注，每个投注号码为1-6共六个自然数中的任意一个，一组3个号码的组合称为一注。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.k3.p1.gif"/>
                </div>
                <br>
                2.三号码组合共设置“和值”、“三同号”、“二同号”、“三不同号”、“二不同号”、“三连号通选”投注方式，具体规定如下：<br>
                （一）和值投注是指对3个号码的和值进行投注。<br>
                （二）三同号投注是指对3个相同的号码进行投注，具体分为：<br>
                &nbsp;&nbsp;&nbsp;&nbsp;1.三同号通选：是指对所有相同的3个号码进行投注；<br>
                &nbsp;&nbsp;&nbsp;&nbsp;2.三同号单选：是指从所有相同的3个号码中任意选择一组号码进行投注。<br>
                （三）二同号投注是指对2个指定的相同号码进行投注，具体分为：<br>
                &nbsp;&nbsp;&nbsp;&nbsp;1.二同号复选：是指对3个号码中2个指定的相同号码和一个任意号码进行投注；<br>
                &nbsp;&nbsp;&nbsp;&nbsp;2.二同号单选：是指对3个号码中2个指定的相同号码和一个指定的不同号码进行投注。<br>
                （四）三不同号投注：是指对3个各不相同的号码进行投注。<br>
                （五）二不同号投注：是指对3个号码中2个指定的不同号码和一个任意号码进行投注。<br>
                （六）三连号通选投注：是指对所有3个相连的号码进行投注。<br>
                游戏号码组合参考列表：
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center"class="cu">
                    <td height="25"bgcolor="#efefef"class="td">
                        投注方法
                    </td>
                    <td width="400"height="25"bgcolor="#efefef"class="td">
                        号码组合（号码不排序）
                    </td>
                    <td height="25"bgcolor="#efefef"class="td">
                        投注号数
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值大
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        11,12,13,14,15,16,17,18
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值小
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        3,4,5,6,7,8,9,10
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值单
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        3,5,7,9,11,13,15,17
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值双
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        4,6,8,10,12,14,16,18
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值3
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        111
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        三同号单选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值4
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        112
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值5
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        113,122
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值6
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        114,123,222
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值7
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        115,124,133,223
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值8
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        116,125,134,224,233
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值9
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        126,135,144,225,234,333
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值10
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        136,145,226,235,244,334
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值11
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        146,155,236,245,335,344
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值12
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        156,246,255,336,345,444
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值13
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        166,256,346,355,445
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值14
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        266,356,446,455
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值15
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        366,456,555
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值16
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        466,556
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值17
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        566
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值18
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        666
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        三同号单选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        三同号通选
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        111,222,333,444,555,666
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        三同号单选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选一个
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        二同号复选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        11,22,33,44,55,66
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选一个
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        二同号单选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        112,113,114,115,116,122,223,224,225,226,133,<br>
                        233,334,335,336,144,244,344,445,446,155,<br>
                        255,355,455,556,166,266,366,466,566
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选一个
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        三不同号
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        123,124,125,126,134,135,136,145,146,156,<br>
                        234,235,236,245,246,256,345,346,356,456
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选一个
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        二不同号
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        12*,13*,14*,15*,16*,23*,24*,25*,<br>
                        26*,34*,35*,36*,45*,46*,56*
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选一个
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        三连号通选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        123,234,345,456
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        全选
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                <br>
                <b>
                <p id="f2"class="ff">
                    二、中奖规则
                </p>
                </b>
                <p>
                    （一）设奖
                </p>
                1.奖金计算说明列表请浏览本站主页“开奖公告”页面，点` + name + `查阅。<br>
                2.快三按不同单式投注方式设奖，均为固定奖。奖金规定如下：
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"colspan="2"class="td cu">
                        玩法
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        开奖示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        投注示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖规则
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu"colspan="2">
                        固定奖金
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="8"colspan="2">
                        和值
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="8">
                        112
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="8">
                        和值4
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="8">
                        对三个号码的和值进行投注,与开奖号和值相同
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        和值3或18
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        190.08元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值4或17
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        63.36元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值5或16
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        31.68元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值6或15
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        19.008元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值7或14
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        12.672元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值8或13
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        9.055元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值9或12
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        7.603元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值10或11
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        7.040元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        三同号
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        通选
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        333
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        三同号通选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对所有相同的三个号码（111、222、…、666）进行全包投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        31.68元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        单选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        333
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        从所有相同的三个号码（111、…、666）中任意选择一组号码进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        190.08元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        二同号
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        复选
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        223
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        22
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对三个号码中两个指定的相同号码和一个任意号码进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        11.88元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        单选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        同号22,不同号3
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对三个号码中两个指定的相同号码和一个指定的不同号码进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        63.36元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        三不同号
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        123
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        123
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对三个各不相同的号码进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        31.68元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        二不同号
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        13
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对三个号码中两个指定的不同号码和一个任意号码进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        6.336元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        三连号通选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        三连号通选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        对所有三个相连的号码（123、234、345、456）进行投注,与开奖号相同
                    </td>
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        7.92元
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                3.当期每注投注号码按其投注方式只有一次中奖机会，不能兼中兼得，特别设奖除外。<br>
                <br>
                <b>
                <p id="f3"class="ff">
                    三、玩法介绍
                </p>
                </b>
                <p>
                    （一）投注方式
                </p>
                1.和值：至少选择1个号码，与开奖的3个号码相加之和相同即中奖，单注最高奖金190.08元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：112
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：4
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                2.三同号通选：当开奖号码为三同号(111，222，333，444，555，666)中的任一组即中奖，单注奖金31.68元，1/36中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：666
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：三同号通选
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                3.三同号单选：至少选1组号码，所选号码与开奖号码相同即中奖，单注奖金190.08元，1/216中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：111
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：111
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                4.三不同号：至少选择3个号码，与开奖号码全相同即中奖，单注奖金31.68元，1/36的中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：124
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：124
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                5.三连号通选：当开奖号码为三连号(123，234，345，456)中的任一组即中奖，单注奖金7.92元，1/9中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：123
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：三连号通选
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                6.二同号复选：至少选1个对子投注，开奖号包含此对子即中奖，单注奖金11.88元，1/13.5中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：112
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：114
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                7.二同号单选：至少选1个对子和1个不同号投注，与开奖号码全相同即中奖，单注奖金63.36元，1/72中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：112
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：112
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                8.二不同号玩法：至少选择2个号码，与开奖的任意2个号码相同即中奖，单注奖金6.336元，1/7.2的中奖机会。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：123
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：12
                    </td>
                </tr>
                </tbody>
                </table>
                <p>
                    （二）玩法特点
                </p>
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.k3.jpg"/>
                </div>`
            }
            if (item.lotteryClassName.indexOf("ElevenPickFive") > -1) {
                time ="09:10至23:00"
                var jiange = 20;
                console.log(item)
                if(id == 5) {time="09:10至23:10"}
                if(id == 13) {time="09:10至23:10"}
                if(id == 15) {time="09:00至00:00"}
                if(id == 14) {time="08:41至23:01";issue="43期"}
                if(id == 39) {time="00:00至23:59";jiange=3}
                if(id == 49) {time="00:00至23:59";jiange=1}
                if(id == 52) {time="00:00至23:59";issue="288期";jiange=5}
                that.pageText= `<h2><a href="#f1">一、游戏规则</a></h2>
                <h2><a href="#f2">二、中奖规则</a></h2>
                <h2><a href="#f3">三、玩法介绍</a></h2>
                <br>
                <h2 style="color: #f00; ">购彩需知：</h2>
                <p style="color: #f00; ">
                    1.同一期定位胆购买不能超过6个号码。<br/>2.同一期组选购买不能超过7个号码。<br/><br/>以下数据仅供参考，详情请咨询客服人员
                </p>
                <br>
                <b>
                <p id="f1"class="ff">
                    一、游戏规则
                </p>
                </b>
                <p>
                    一、玩法类型及承销
                </p>
                11选5是一种在线即开型彩票玩法，属于基诺型彩票范畴，由省体育彩票管理中心负责承销。
                <p>
                    二、开奖与购买方式
                </p>
                1.本站` + name + `游戏每天进行` + issue + `，开奖时间为` + time + `，每隔` + jiange + `分钟开奖一次。开奖号码通过电脑体育彩票每期开奖结果通过随机数码生成器，从01-11共11个号码中按顺序自动生成5个不同号码作为当期中奖号码。<br>
                2.购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。每注金额人民币2元。<br>
                3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>
                4.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>
                5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。
                <p>
                    三、兑奖
                </p>
                1.返奖：无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。
                <p>
                    四、玩法说明
                </p>
                11选5投注区号码范围为01～11，每期开出5个号码作为中奖号码。11选5玩法即是竞猜5位开奖号码的全部或部分号码。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.eleven.p1.gif"/>
                </div>
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center"class="cu">
                    <td height="25"bgcolor="#efefef"class="td"colspan="2">
                        玩法
                    </td>
                    <td width="514"height="25"bgcolor="#efefef"class="td">
                        规则
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="8">
                        任选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任选一
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜第1位开奖号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选二
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码中的任意2位。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选三
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码中的任意3位。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选四
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码中的任意4位。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选五
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        选择5个号码，竞猜全部5位开奖号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选六
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        选择6个号码，竞猜全部5位开奖号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选七
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        选择7个号码，竞猜全部5位开奖号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选八
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        选择8个号码，竞猜全部5位开奖号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        二星
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选(复式)
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码前/后2位，且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选(单式)
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码前/后2位，顺序不限。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        三星
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选(复式)
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码前/后3位，且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选(单式)
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜开奖号码前/后3位，顺序不限。
                    </td>
                </tr>
                </tbody>
                </table>
                注：<1>直选：将投注号码以唯一的排列方式进行投注。<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<2>组选：将投注号码的所有排列方式作为一注投注号码进行投注。示例：前三组选01 02 03，排列方式有01 02 03、01 03 02、02 01 03、02 03 01、03 01 02、03 02 01，共计6种。<br>
                <br>
                <b>
                <p id="f2"class="ff">
                    二、中奖规则
                </p>
                </b>
                <p>
                    五、设奖
                </p>
                奖金计算说明列表请浏览本站主页“开奖公告”页面，点击` + name + `查阅。
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"colspan="2"class="td cu">
                        奖级
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖条件
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖号码示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        单注最高赔率
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="8">
                        任选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任选一
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任意中1码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:2.1
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选二
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任意中2码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02，01 03
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:5.3
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选三
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任意中3码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03，01 02 04
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:16
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选四
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任意中4码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03 04，01 02 03 05
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:64
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选五
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中5码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03 04 05
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:438
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选六
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中5码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03 04 05 X
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:75
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选七
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中5码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03 04 05 X X
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:21
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选八
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中5码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03 04 05 X X X
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:8
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        三码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        定位中前/中/后3码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:970
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中前/中/后3码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03，03 02 01
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:161
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        二码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        定位中前/后2码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02 03
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:107
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中前/后2码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        01 02，01 02
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:54
                    </td>
                </tr>
                </tbody>
                </table>
                注：<1>、假设当期的开奖号码为01 02 03 04 05。<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<2>、2码和3码：2码指开奖号码的前/后2位号码，3码指开奖号码的前/中/后3位号码，示例：开奖号码为01 02 03 04 05，前1码为01，前2码为01 02，前3码为01 02 03。<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<3>、定位和不定位：定位指投注号码与开奖号码按位一致，不定位指投注号码与开奖号码一致，顺序不限。示例：开奖号码为01 02 03 04 05，01 02则定位中前2码，01 02或02 01则为不定位中前2码。<br>
                <br>
                <b>
                <p id="f3"class="ff">
                    三、玩法介绍
                </p>
                </b>
                <p>
                    六、投注方式
                </p>
                <p>
                    1、任选一
                </p>
                从01～11中任选1个或多个号码为一注，投注号码与开奖号码任意1位一致即为中奖，单注最高奖金4.2元
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：04 05 02 09 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：05
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意一位号码，顺序不限，单注最高奖金4.2元
                <p>
                    2、任选二：
                </p>
                从01～11中至少选择2个号码投注，选号与开奖号码任意2位。投注时可选择1个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：04 11 02 09 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：11 04
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意两位号码，顺序不限，单注最高奖金10.6元
                <p>
                    3、任选三
                </p>
                从01～11中任选3个号码为一注，选择3个以上号码为复式投注，投注号码与开奖号码中任意3个号码相同即为中奖。投注时可选择1～2个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：04 05 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：04 08 07
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意三位号码，顺序不限，单注最高奖金32元
                <p>
                    4、任选四
                </p>
                从01～11中任选4个号码为一注，选择4个以上号码为复式投注，投注号码与开奖号码中任意4个号码相同即为中奖。投注时可选择1～3个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 02 03 04 05
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：01 03 04 05
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意四位号码，顺序不限，单注最高奖金128元
                <p>
                    5、任选五
                </p>
                从01～11中任选5个号码为一注，选择5个以上号码为复式投注，投注号码与开奖号码全部相同即为中奖。投注时可选择1～4个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：03 01 08 07 10
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意五位号码，顺序不限，单注最高奖金876元
                <p>
                    6、任选六
                </p>
                从01～11中任选6个号码为一注，选择6个以上号码为复式投注，投注号码中任意5个号码与5位开奖号码相同即为中奖。投注时可选择1～5个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：03 01 08 07 10 02
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意六位号码，顺序不限，单注最高奖金150元
                <p>
                    7、任选七
                </p>
                从01～11中任选7个号码为一注，选择7个以上号码即为复式投注，投注号码中任意5个号码与5位开奖号码相同即为中奖。投注时可选择1～6个号码作为每注都有的胆码，再补充其它号码作为拖码进行投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：03 01 08 07 10 02 04
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意七位号码，顺序不限，单注最高奖金42元
                <p>
                    8、任选八
                </p>
                从01～11中任选8个号码为一注，选择8个以上号码为复式投注，投注号码中任意5个号码与5位开奖号码相同即为中奖。投注时可选择1～7个号码作为每注都有的胆码，再补充其它号码作为拖码投注。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：03 01 08 07 10 02 04 05
                    </td>
                </tr>
                </tbody>
                </table>
                -命中任意八位号码，顺序不限，单注最高奖金16元9、二码直选对前/后2位各选1个号码为一注，某一位或两位选择2个以上号码为复式投注，投注号码与开奖号码前/后2位按位一致即为中奖。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：万位01千位03
                    </td>
                </tr>
                </tbody>
                </table>
                -命中开奖号码的前两位号码，且顺序一致，单注最高奖金214元
                <p>
                    10、二码组选
                </p>
                从01～11中任选2个号码为一注，选择2个以上号码为复式投注，投注号码与开奖号码前/后2位一致，顺序不限即为中奖。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：01 03
                    </td>
                </tr>
                </tbody>
                </table>
                -命中开奖号码的前两位，顺序不限，单注最高奖金214元
                <p>
                    11、三码直选
                </p>
                对前/中/后3位各选1个号码为一注，某一位或几位选择2个以上号码为复式投注，投注号码与开奖号码前/中/后3位按位一致即为中奖，单注最高奖金1940元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：万位01千位03百位08
                    </td>
                </tr>
                </tbody>
                </table>
                -命中开奖号码的前三位号码，且顺序一致，单注最高奖金214元
                <p>
                    12、三码组选
                </p>
                从01～11中任选3个号码为一注，选择3个以上号码为复式投注，投注号码与开奖号码前/中/后3位一致，顺序不限，即为中奖。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 03 08 10 07
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：01 03 08
                    </td>
                </tr>
                </tbody>
                </table>
                -命中开奖号码的前三位，顺序不限，单注最高奖金322元
                <p>
                    七、玩法特点
                </p>
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.eleven.jpg"/>
                </div>`
            }
            if (item.lotteryClassName.indexOf("FrequentLottery") > -1) {
                text = "10:10至次日02:00"
                if(id == 4) {text = "白天07:10至23:50，每隔20分钟开奖一次；夜场00:10至凌晨03:10"}
                if(id == 6 || id == 45) {text = "00:00至23:59"}
                if(id == 12) {text = "10:00至次日02:00"}
                if(id == 11) {text = "09:20至23:00"}
                if(id == 55) {text = "00:00至23:59";issue ='288期'}
                if(id == 61) {text = "00:00至23:59:59";issue ='1440期'}
                if(id == 62) {text = "00:00至23:59:59";issue ='480期'}
                if(id == 63) {text = "00:00至23:59:59";issue ='280期'}
                that.pageText = `<h2><a href="#f1">一、玩法类型及承销</a></h2>
                <h2><a href="#f2">二、开奖与购买方式</a></h2>
                <h2><a href="#f3">三、兑奖</a></h2>
                <h2><a href="#f4">四、玩法说明</a></h2>
                <h2><a href="#f5">五、设奖及中奖</a></h2>
                <h2><a href="#f6">六、投注方式</a></h2>
                <h2><a href="#f7">七、玩法特点</a></h2>
                <br>
                <h2 style="color: #f00; ">购彩需知：</h2>
                <p style="color: #f00; ">
                    1.同一期定位胆购买不能超过6个号码。<br/>2.同一期组选购买不能超过7个号码。<br/><br/>以下数据仅供参考，详情请咨询客服人员
                </p>
                <br>
                <b>
                <p id="f1"class="ff">
                    一、玩法类型及承销
                </p>
                </b>` + name + `是一种在线即开型彩票玩法，属于基诺型彩票，由市福利彩票发行管理中心负责承销。
                <p>
                    &nbsp;
                </p>
                <b>
                <p id="f2"class="ff">
                    二、开奖与购买方式
                </p>
                </b>1.本站` + name + `游戏每天进行仅` + issue + `，开奖时间为` + text + `，每` + frequency + `钟开奖一次。购买者可在对其选定的投注号码进行投注，返点越高则投注赔率越低。<br>
                2.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>
                3.购买者还可进行追号投注。追号投注是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>
                4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。<br>
                <br>
                <b>
                <p id="f3"class="ff">
                    三、兑奖
                </p>
                </b>1.返奖：无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。<br>
                <br>
                <b>
                <p id="f4"class="ff">
                    四、玩法说明
                </p>
                </b>1.时时彩投注区分为万位、千位、百位、十位和个位，各位号码范围为0～9。每期从各位上开出1个号码作为中奖号码，即开奖号码为5位数。时时彩玩法即是竞猜5位开奖号码的全部号码、部分号码或部分号码特征。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.ssc.p1.gif"/>
                </div>
                <br>
                2.时时彩包括星彩玩、定位胆、不定位、大小单双、龙虎等玩法。星彩玩法分为二星、前后三星、前后四星、五星四种玩法如下：<br>
                <table width="100%"border="0"cellpadding="0"cellspacing="1"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center"class="cu">
                    <td width="50"height="25"bgcolor="#efefef"class="td"colspan="2">
                        玩法
                    </td>
                    <td width="514"height="25"bgcolor="#efefef"class="td">
                        规则
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        五星
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜全部5位号码，即万位、千位、百位、十位和个位，且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        前四/后四
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜前/后四码，即(万、千、百、十)位；或(千、百、十、个)且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        前三/中三/后三
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜前/中/后三码，即(万、千、百)位；或(千、百、十)位；或(百、十、个)位，且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选三
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜前/中/后三码，即(万、千、百)位；或(千、百、十)位；或(百、十、个)位，顺序不限，且投注时三位号码有两位相同。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选六
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜前/中/后三码，即(万、千、百)位；或(千、百、十)位；或(百、十、个)位，顺序不限，且投注时三位号码各不相同。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        前二
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜前两码，即万位和千位，且顺序一致。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜前两码，即万位和千位，顺序不限。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        定位胆
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜万位、千位、百位、十位、个位任意位置上任意1个或1个以上号码。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        不定位
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜对应三星、四星、五星玩法位置上任意1个或1个以上号码，且顺序不限。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        大小单双
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜万位、千位中的“大、小、单、双”中至少各选一个组成一注。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        龙虎
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竟猜万位、千位、百位、十位、个位任意位置上两两号码比对的大小。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        任选
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        任选二
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜万位、千位、百位、十位、个位任意位置上任意2个号码或者2个号码和值。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选三
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜万位、千位、百位、十位、个位任意位置上任意3个号码或者3个号码和值。
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        任选四
                    </td>
                    <td width="514"height="25"bgcolor="#ffffff">
                        竞猜万位、千位、百位、十位、个位任意位置上任意4个号码或者4个号码和值。
                    </td>
                </tr>
                </tbody>
                </table>
                注：<1>直选：将投注号码以惟一的排列方式进行投注。<br>
                <2>组选：将投注号码的所有排列方式作为一注投注号码进行投注。示例：123，排列方式有123、132、213、231、312、321，共计6种。<br>
                <3>组选三：在三星组选中，如果一注组选号码的3个数字有两个数字相同，则有3种不同的排列方式，因而就有3个中奖机会，这种组选投注方式简称组选三。示例：112，排列方式有112、121、211。<br>
                <4>组选六：在三星组选中，如果一注组选号码的3个数字各不相同，则有6种不同的排列方式，因而就有6个中奖机会，这种组选投注方式简称组选六。示例：123，排列方式有123、132、213、231、312、321，共计6种。<br>
                <5>大小单双：即把10个自然数按“大”“小”，或者“单”，“双”性质分为两组，0-4为小号，5-9为大号。0，2，4，6，8为双号。1，3，5，7，9为单号。<br>
                <br>
                <b>
                <p id="f5"class="ff">
                    五、设奖及中奖
                </p>
                </b>奖金计算说明列表请浏览本站主页“开奖公告”页面，点击` + name + `查阅。<br>
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"colspan="2"class="td cu">
                        玩法
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        开奖号码
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        投注号码示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖概率
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        单注最高赔率
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="7">
                        三星
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选(复式)
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        678
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        678
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        定位中三码
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        1/1000
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="3">
                        1:950
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        直选(单式)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        678
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        直选和值
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        13
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        13
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选(组三)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        113
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        113
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="4">
                        不定位中三码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/90
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:316.666
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选(组六)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        123
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        123
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/120
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:158.333
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选和值(组三)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        5(113)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        5(113)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/90
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:316.666
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选和值(组六)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        6(123)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        6(123)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/120
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:158.333
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        二星
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选(前/后二)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        78
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        78
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        定位中三码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/100
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:95
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        组选(前/后二)
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        78
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        78
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        不定位中三码
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/45
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:47.5
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        大小单双
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        678
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        大单
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        大小
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/16
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:3.8
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        龙虎
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        78
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        个位
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        大小
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1/2.2
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        1:1.96
                    </td>
                </tr>
                </tbody>
                </table>
                注：<1>、假设当期的开奖号码为45678则组选三不中奖（后三组选适用开奖号码为45668）。<br>
                <2>、前三码和后三码：前三码指开奖号码的前三位号码，后三码指开奖号码的后三位号码。示例：开奖号码为45678，前三码为456，后三码为678。<br>
                <3>、前两码和后两码：前两码指开奖号码的前两位号码，后两码指开奖号码的后两位号码。示例：开奖号码为45678，前两码为45，后两码为78。<br>
                <4>、定位胆：所选号码与相同位置上和开奖号码一致。示例：开奖号码为45678，万位4即中定位胆万位。<br>
                <5>、定位和不定位：定位指投注号码与开奖号码按位一致，不定位指投注号码与开奖号码一致，顺序不限。示例：开奖号码为45678，78则定位中后两码，78或87则为不定位中后两码。<br>
                <6>、任选和值：所选号码与开奖号码的和值相同。示例：开奖号码为45678，位置选万位、百位，和值号码即10。<br>
                <br>
                <b>
                <p id="f6"class="ff">
                    六、投注方式
                </p>
                </b>
                <p>
                    1、五星直选
                </p>
                对万位、千位、百位、十位和个位各选1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
                <p>
                    &nbsp;
                </p>
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.ssc.p2.gif"/>
                </div>
                <p>
                    2、四星直选
                </p>
                对千位、百位、十位和个位各选1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
                <p>
                    3、三星直选
                </p>
                对百位、十位和个位各选1个号码为一注，每位号码最多可0～9全选，投注号码与开奖号码后三位按位一致即为中奖。
                <p>
                    4、三星和值
                </p>
                和值指号码各位数相加之和，如号码001，和值为1。三星和值投注指用某一个三星和值对应的所有号码进行投注，所选和值与开奖号码后三位和值一致即为中奖，单注最高奖金980元。示例：选择三星和值1投注，即用和值1所对应的号码（001、010、100）投注，如开奖号码后三位和值为1即中奖。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.ssc.p3.gif"/>
                </div>
                <p>
                    5、组三组选
                </p>
                组三包号指用所选号码的所有组三排列方式进行组选三投注，如开奖号码为组三号且包含在所选号码中即为中奖，单注最高奖金326.666元元。示例：组三包号12，共2注（112、122），如开奖号码后三位为112、121、211、122、212、221皆为中奖。包号速算表如下：
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        包号个数（10选n）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        2
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        3
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        4
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        5
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        6
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        7
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        8
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        9
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        投注金额（2元）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        4
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        12
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        24
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        40
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        60
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        84
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        112
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        144
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        180
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖奖金（元）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        653.332
                    </td>
                </tr>
                </tbody>
                </table>
                <p>
                    6、组六组选
                </p>
                组六包号指用所选号码的所有组六排列方式进行组选六投注，如开奖号码为组六号且包含在所选号码中即为中奖，单注最高奖金163.333元。示例：组六包号123，共1注，如开奖号码后三位为123、132、213、231、312、321皆为中奖。包号速算表如下：
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        包号个数（10选n）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        4
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        5
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        6
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        7
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        8
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        9
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        投注金额（2元）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        8
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        20
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        40
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        74
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        112
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        168
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        240
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖奖金（元）
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                    <td height="25"bgcolor="#ffffff"class="td cu">
                        326.666
                    </td>
                </tr>
                </tbody>
                </table>
                <p>
                    7、二星直选
                </p>
                对万位和千位各选1个号码为一注，每位号码最多可0～9全选，投注号码与开奖号码后两位按位一致即为中奖。
                <p>
                    8、二星和值
                </p>
                和值指号码各位数相加之和，如号码01，和值为1。二星和值投注指用某一个二星和值对应的所有号码进行投注，所选和值与开奖号码前两位和值一致即为中奖，单注最高奖金98元。示例：选择二星和值1投注，即用和值1所对应的号码（01、10）投注，如开奖号码前两位和值为1即中奖。
                <p>
                    9、二星组选
                </p>
                从号码0—9中任选两个数字对万位和千位进行投注，最多可0～9全选。所选号码与开奖号码前两位一致，顺序不限，即为中奖。示例：选择12，共1注，如开奖号码前两位为12或21即中奖。
                <p>
                    10、大小单双
                </p>
                对万位和千位的大小单双4种特征中各选一种特征为一注，最多可4种特征全选，所选特征与开奖号码后两位号码特征一致即中奖。示例：开奖号码后两位为78，则大大、大双、单双、单大为中奖。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.ssc.p4.gif"/>
                </div>
                <p>
                    11、龙虎
                </p>
                对任意两两位置的大小进行投注，投注的位置若为大数，即为中奖；两数相等为平局，平局视为未中奖。
                <br>
                <br>
                <b>
                <p id="f7"class="ff">
                    七、玩法特点
                </p>
                </b>
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.ssc.jpg"/>
                </div>`
            }
            if (item.lotteryClassName.indexOf("PK10") > -1) {
                text  = `1.根据财政部颁发的《彩票发行与销售暂行管理规定》（财综[2002]13号）及中国福利彩票发行中心颁发的《中国福利彩票发行规则》等管理规定，结合计算机网络技术，制定本细则。<br>2.中国福利彩票"` + name + `"游戏，简称"PK拾"，由中国福利彩票发行管理中心（以下简称“中福彩中心”）统一发行，由北京市福利彩票发行中心承销。<br>3."` + name + `"采用计算机网络系统发行销售，定期开奖。<br>4."` + name + `"实行自愿购买，凡购买者均被视为同意遵守本细则。`
                text1 = `1."` + name + `"的发行权属中国福利彩票发行管理中心，主要包括：中国福利彩票名称及标识的专有权，发行额度的分配权和调控权、各项资金比例的确定和调整权，投注单和彩票专用纸的监制权等。<br>2.北京市福利彩票发行中心通过电脑彩票销售系统发行"PK拾"游戏，接受中彩中心的监控。<br>3.北京市福利彩票发行中心在承销区域内设置投注站，并核发销售许可证。投注站由北京市福利彩票发行中心管理，展示销售许可证。<br>4.本站` + name + `游戏每天进行44期，开奖时间为09:10至23:50，每隔20分钟开奖一次，销售期号以开奖日界定，按日历年度编排。<br>5.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>6.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>7.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                if(id == 8) {
                    text  = `1.`+name+`是一种在线即开型彩票玩法，由本站管理中心负责承销。<br>2.`+name+`采用计算机网络系统发行销售，定期开奖。<br>3.`+name+`实行自愿购买，凡购买者均被视为同意遵守本细则。`
                    text1 = `1.本站`+name+`每天进行480期，开奖时间为00:00至23:59，每隔3分钟开奖一次。<br>2.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                }
                if (id == 43 || id == 59) {
                    text  = `1.`+name+`是一种在线即开型彩票玩法，由本站管理中心负责承销。<br>2.`+name+`采用计算机网络系统发行销售，定期开奖。<br>3.`+name+`实行自愿购买，凡购买者均被视为同意遵守本细则。`
                    text1 = `1.本站`+name+`每天进行480期，开奖时间为00:00至23:59，每隔3分钟开奖一次。<br>2.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                }
                if (id == 29) {
                    text  = `1.`+name+`是一种在线即开型彩票玩法，由本站管理中心负责承销。<br>2.`+name+`采用计算机网络系统发行销售，定期开奖。<br>3.`+name+`实行自愿购买，凡购买者均被视为同意遵守本细则。`
                    text1 = `1.本站`+name+`每天进行180期，开奖时间为13:04至04:04，每隔5分钟开奖一次。<br>2.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                }
                if (id == 46 || id == 58) {
                    text  = `1.`+name+`是一种在线即开型彩票玩法，由本站管理中心负责承销。<br>2.`+name+`采用计算机网络系统发行销售，定期开奖。<br>3.`+name+`实行自愿购买，凡购买者均被视为同意遵守本细则。`
                    text1 = `1.本站`+name+`每天进行1440期，开奖时间为00:00至23:59，每隔1分钟开奖一次。<br>2.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                }
                console.log(id)
                if (id == 51 || id == 60) {
                    text  = `1.`+name+`是一种在线即开型彩票玩法，由本站管理中心负责承销。<br>2.`+name+`采用计算机网络系统发行销售，定期开奖。<br>3.`+name+`实行自愿购买，凡购买者均被视为同意遵守本细则。`
                    text1 = `1.本站`+name+`每天进行288期，开奖时间为00:00至23:59，每隔5分钟开奖一次。<br>2.购买者可在对其选定的投注号码选择返点投注，返点越高则投注赔率越低。购买者也可进行追号投注，追号是指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。`
                }

                that.pageText = `<h2><a href="#f1">一、游戏规则</a></h2>
                <h2><a href="#f2">二、中奖规则</a></h2>
                <h2><a href="#f3">三、玩法介绍</a></h2>
                <br>
                <h2 style="color: #f00; ">购彩需知：</h2>
                <p style="color: #f00; ">
                    1.同一期定位胆购买不能超过6个号码。<br/>2.同一期组选购买不能超过7个号码。<br/><br/>以下数据仅供参考，详情请咨询客服人员
                </p>
                <br>
                <b>
                <p id="f1"class="ff">
                    一、游戏规则
                </p>
                </b>
                <p>
                    （一）总则
                </p>
                ` + text + `
                <p>
                    （二）开奖与购买方式
                </p>
                ` + text1 + `
                <p>
                    （三）兑奖
                </p>
                1.根据投注者所选玩法及投注号码与中奖号码按位置顺序和对应的数字相符的个数多少确定相应的中奖奖级。<br>
                2.无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。
                <p>
                    （四）玩法说明
                </p>
                ` + name + `采用按位置顺序选择投注号码、固定设奖的玩法。投注者首先根据不同玩法确定选择最少1个、最多10个位置进行投注，然后按照从左到右、从1号到10号投注位置的顺序，从1号位置开始，在每个位置上从编号为1至10的号码中任意选择1个号码，且不能与其它位置上已经选择的号码相同，按照从1到10号位置的顺序排序组成一组号码，每一组选定的按位置排序的号码称为一注投注号码。
                <div align="center">
                    <img src="/pc/common/statics/img/rule/rule.twpk10.png"/>
                </div>
                <br>
                <b>
                <p id="f2"class="ff">
                    二、中奖规则
                </p>
                </b>
                <p>
                    （一）设奖
                </p>
                1.` + name + `采用专用的摇奖计算机系统进行摇奖，中奖号码从数字1到10总共10个数字中随机产生。每次摇奖时按照从左至右、从1号位置到10号位置的顺序进行，第一个摇出的数字对应1号位置，第二个摇出的数字对应2号位置，依次类推，直到摇出对应10号位置的第十个数字为止，这10个位置和对应的数字组成当期中奖号码。<br>
                2.` + name + `按不同投注方式设奖，均为固定奖。奖金规定如下：
                <table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#eFeFeF"class="td cu"colspan="2">
                        玩法
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        开奖号码示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        投注号码示例
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        中奖规则
                    </td>
                    <td height="25"bgcolor="#eFeFeF"class="td cu">
                        单注最高赔率
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        前一
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选复式
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        05 06...
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        05
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选号与开奖号按位猜中1位即中奖
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        9.8元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        前二
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选复式
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        05 06 07...
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        05 06
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        选号与开奖号按位猜中2位即中奖
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        88.2元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        直选单式
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        前三
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        直选复式
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        05 06 07 08...
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        05 06 07
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        选号与开奖号按位猜中3位即中奖
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        705.6元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        直选单式
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        定位胆
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        05 06...
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        冠军：05
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        选号与开奖号按位猜中1位或1位以上即中奖
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        9.8元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"colspan="2">
                        龙虎
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        05 06...
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        万位 vs 千位
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        竟猜万位、千位、百位、十位、个位任意位置上两两号码比对的大小
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        3.96元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        冠亚和
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        大小单双
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        05 06 07 08...
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        11
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="1">
                        把冠军车号和亚军车号相加的值；3-11为小；12-19为大；4、6、~18为双；3、5、~19为单 ；
                    </td>
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        45元
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        和值
                    </td>
<td height="25"bgcolor="#ffffff"rowspan="1">
                        选号与开奖号码前两位之和相同即为中奖
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                <b>
                <p id="f3"class="ff">
                    三、玩法介绍
                </p>
                </b>
                <p>
                    （一）投注方式
                </p>
                1.前一：从第一名中至少选择1个号码组成一注，选号和开奖号码猜对一位即中奖，单注奖金最高9.8元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 02 03 04 05 06 07 08 09 10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：冠军01
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                2.前二直选：从第一名、第二名中各至少选择1个号码组成一注，选号和开奖号码猜对2位即中奖，单注奖金最高88.2元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 02 03 04 05 06 07 08 09 10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：冠军01，亚军02
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                3.前三直选：从第一名、第二名、第三名中至少选择1个号码组成一注，选号和开奖号码猜对3位即中奖，单注奖金最高705.6元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 02 03 04 05 06 07 08 09 10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：冠军01，亚军02，季军03
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                4.定位胆：从第一名到第十名任意位置上选择1个或1个以上号码，所选号码与相同位置上的开奖号码一致，即位中奖，单注奖金最高9.8元。
                <table width="300"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table">
                <tbody>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff"rowspan="2">
                        例：
                    </td>
                    <td height="25"bgcolor="#ffffff">
                        开奖：01 02 03 04 05 06 07 08 09 10
                    </td>
                </tr>
                <tr align="center">
                    <td height="25"bgcolor="#ffffff">
                        选号：冠军01
                    </td>
                </tr>
                </tbody>
                </table>
                <br>
                5.前二和值: <br>
                冠亚和、大小单双：以冠军车号和亚军车号之和大小来判断胜负，"冠亚和"大于11为大，小于或等于11为小。（把11归为小、单）<br>
                6.龙虎玩法: <br>
                冠军 龙/虎："第一名"之车号大于"第十名"之车号视为「龙」中奖、反之小于视为「虎」中奖，其余情况视为不中奖。<br>
亚军 龙/虎："第二名"之车号大于"第九名"之车号视为「龙」中奖、反之小于视为「虎」中奖，其余情况视为不中奖。<br>
季军 龙/虎："第三名"之车号大于"第八名"之车号视为「龙」中奖、反之小于视为「虎」中奖，其余情况视为不中奖。<br>
第四名 龙/虎："第四名"之车号大于"第七名"之车号视为「龙」中奖、反之小于视为「虎」中奖，其余情况视为不中奖。<br>
第五名 龙/虎："第五名"之车号大于"第六名"之车号视为「龙」中奖、反之小于视为「虎」中奖，其余情况视为不中奖。<br>
假如投注组合符合中奖结果，视为中奖，其余情形视为不中奖。`
            }
            if (item.lotteryClassName.indexOf("SixMark") > -1) {

                var firstTint = ''
                if (item.lotteryId == 28 || item.lotteryId == 48 ) {
                    firstTint = name + "是从1至49个号码中选出六个为中奖号码的奖券, " +((item.lotteryId == 28) ? "每天进行480期，开奖时间为00:00至23:59，每隔3分钟开奖一次。" : "每天进行1440期，开奖时间为00:00至23:59，每隔1分钟开奖一次。")
                } else {
                    firstTint = name + "是从1至49个号码中选出六个为中奖号码的奖券，由香港赛马会的附属公司「香港马会奖券有限公司」经办 。" + name
                    + "每星期搅珠三次，通常于星期二、星期四及非赛马日之星期六或日晚上举行，并由电视台现场直播。";
                }
                if (item.lotteryId == 53) {
                    firstTint = name + "是从1至49个号码中选出六个为中奖号码的奖券, " +((item.lotteryId == 53) ? "每天进行288期，开奖时间为00:00至23:59，每隔5分钟开奖一次。" : "每天进行1440期，开奖时间为00:00至23:59，每隔1分钟开奖一次。")
                }

                // var firstTint = (item.lotteryId == 28 || item.lotteryId == 48) ? name + "是从1至49个号码中选出六个为中奖号码的奖券, " +((item.lotteryId == 28) ? "每天进行480期，开奖时间为00:00至23:59，每隔3分钟开奖一次。" : "每天进行1440期，开奖时间为00:00至23:59，每隔1分钟开奖一次。")    : name + "是从1至49个号码中选出六个为中奖号码的奖券，由香港赛马会的附属公司「香港马会奖券有限公司」经办 。" + name
                // + "每星期搅珠三次，通常于星期二、星期四及非赛马日之星期六或日晚上举行，并由电视台现场直播。";
                that.pageText = `<h2>
                <a href="#f1">
                    一、重要声明
                </a>
            </h2>
            <h2>
                <a href="#f2">
                    二、开奖与购买方式
                </a>
            </h2>
            <h2>
                <a href="#f3">
                    三、兑奖
                </a>
            </h2>
            <h2>
                <a href="#f4">
                    四、` + name + `玩法说明
                </a>
            </h2>
            <br>
            <h2 style="color:#f00">
                购彩需知：
            </h2>
            <p style="color:#f00">
                <!--1.` + name + `特码同一期最多只能选36个号码。<br/>-->
                <br/>以下数据仅供参考，详情请咨询客服人员
            </p>
            <br>
            <b>
                <p id="f1" class="ff">
                    一、重要声明
                </p>
            </b>
            1. 如果客户怀疑自己的资料被盗用，应立即通知本站，并更改详细数据，以前的使用者名称及密码将全部无效。
            <br>
            2. 客户有责任确保自己的账户及登录资料的保密性。以使用者名称及密码进行的任何网上投注将被视为有效。
            <br>
            3. 公布赔率时出现的任何打字错误或非故意人为失误，本公司保留改正错误和按正确赔率结算投注的权力。
            <br>
            4. 每次登录时客户都应该核对自己的账户结余额。如对余额有任何疑问，请在第一时间内通知本站客服人员。
            <br>
            5. 一旦投注被接受，则不得取消或修改。
            <br>
            6. 所有号码赔率将不时浮动，派彩时的赔率将以确认投注时之赔率为准。
            <br>
            7. 所有投注都必须在开奖前时间内进行否则投注无效。
            <b>
                <p id="f2" class="ff">
                    二、开奖与购买方式
                </p>
            </b>
            1. ` + firstTint + `
            <br>
            2. ` + name + `注项单位每注金额最低2元。选择投注项时，购买者可预设金额，然后对其选定的投注号码进行投注。
            <br>
            3. 如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。
            <b>
                <p id="f3" class="ff">
                    三、兑奖
                </p>
            </b>
            1. 无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。
            <b>
                <p id="f4" class="ff">
                    四、` + name + `玩法说明
                </p>
            </b>
            <div align="center">
                <img src="/pc/common/statics/img/rule/rule.six.p1.png?20170201">
            </div>
            <p>
                （一）特码
            </p>
            <p>
                1. 特码
            </p>
            ` + name + `公司当期开出的最后一码为特码
            <table width="300" cellspacing="1" cellpadding="0" border="0" bgcolor="#CCCCCC"
            class="s-table">
                <tbody>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff" rowspan="2">
                            例：
                        </td>
                        <td height="25" bgcolor="#ffffff">
                            开奖号码：30 40 34 08 25 15 + 42
                        </td>
                    </tr>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            投注特码：42
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                2. 特码大小
            </p>
            <table width="300" cellspacing="1" cellpadding="0" border="0" bgcolor="#CCCCCC"
            class="s-table">
                <tbody>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特小：开出的特码，(01~24)小于或等于24
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm1.gif">
                        </td>
                    </tr>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特大：开出的特码，(25~49)大于或等于25
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm2.gif">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                3. 特码单双
            </p>
            <table width="300" cellspacing="1" cellpadding="0" border="0" bgcolor="#CCCCCC"
            class="s-table">
                <tbody>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特双：特码为双数
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm3.gif">
                        </td>
                    </tr>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特单：特码为单数
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm6.gif">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                4. 特码合数单双
            </p>
            <table width="300" cellspacing="1" cellpadding="0" border="0" bgcolor="#CCCCCC"
            class="s-table">
                <tbody>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特双：指开出的特码，个位加上十位之和为‘双数’
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm5.gif">
                        </td>
                    </tr>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            特单：指开出的特码，个位加上十位之和为‘单数’
                            <br>
                            <img src="/pc/common/statics/img/rule/rule.six.tm6.png">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                5. 特码尾数大小
            </p>
            特尾大：5尾~9尾为大，如：05、18、49
            <br>
            特尾小：0尾~4尾为小，如：10、31、44
            <p>
                6. 特码半特
            </p>
            以特码大小与特码单双游戏为一个投注组合；当期特码开出符合投注组合，即视为中奖；
            <br>
            大单：25、27、29、31、33、35、37、39，41、43、45、47、49
            <br>
            大双：26、28、30、32、34、36、38、40，42、44、46、48
            <br>
            小单：01、03、05、07、09、11、13、15，17、19、21、23
            <br>
            小双：02、04、06、08、10、12、14、16，18、20、22、24
            <p>
                7. 特码合数大小
            </p>
            以特码个位和十位数字之和值来判断胜负，和值大于6为合数大，如07、17、26、36、49；和值小于7为合数小，如01、12、23、32、42；
            <p>
                8. 半波
            </p>
            以特码色波和特单，特双，特大，特小为一个投注组合，当期特码开出符合投注组合，即视为中奖；
            <p>
                9. 半半波
            </p>
            以特码色波和特单双及特大小等游戏为一个投注组合，当期特码开出符合投注组合，即视为中奖；
            <p>
                10. 特码色波
            </p>
            ` + name + `49个号码球分别有红、蓝、绿三种颜色，以特码开出的颜色和投注的颜色相同视为中奖，颜色代表如下:
            <br>
            红波：01 ,02 ,07 ,08 ,12 ,13 ,18 ,19 ,23 ,24 ,29 ,30 ,34 ,35 ,40 ,45 ,46
            <br>
            蓝波：03 ,04 ,09 ,10 ,14 ,15 ,20 ,25 ,26 ,31 ,36 ,37 ,41 ,42 ,47 ,48
            <br>
            绿波：05 ,06 ,11 ,16 ,17 ,21 ,22 ,27 ,28 ,32 ,33 ,38 ,39 ,43 ,44 ,49
            <p>
                11. 特码头数
            </p>
            特码头数：是指特码属头数的号码
            <br>
            "0"头：01、02、03、04、05、06、07、08、09
            <br>
            "1"头：10、11、12、13、14、15、16、17、18、19
            <br>
            "2"头：20、21、22、23、24、25、26、27、28、29
            <br>
            "3"头：30、31、32、33、34、35、36、37、38、39
            <br>
            "4"头：40、41、42、43、44、45、46、47、48、49
            <br>
            例如：开奖结果特别号码为21则2头为中奖，其他头数都不中奖。
            <p>
                12. 特码尾数
            </p>
            特码尾数：是指特码属尾数的号码。
            <br>
            "0"尾：10、20、30、40
            <br>
            "1"尾：01、11、21、31、41
            <br>
            "2"尾：02、12、22、32、42
            <br>
            "3"尾：03、13、23、33、43
            <br>
            "4"尾：04、14、24、34、44
            <br>
            "5"尾：05、15、25、35、45
            <br>
            "6"尾：06、16、26、36、46
            <br>
            "7"尾：07、17、27、37、47
            <br>
            "8"尾：08、18、28、38、48
            <br>
            "9"尾：09、19、29、39、49
            <br>
            例如：开奖结果特别号码为21则1尾数为中奖，其他尾数都不中奖。
            <p>
            13.大小单双<br>
            特码 大 小：特码为1-24为特码小，特码为25-49为特码大。 <br>
            特码 单 双：特码为单数叫特单，如1、3...49；特码为双数叫特双，如2、4...48。 <br>
            特码小单、大单：特码1、3...23为小单；特码25、27...49为大单。 <br>
            特码小双、大双：特码2、4...24为小双；特码26、28...48为大双。 <br>
            特码和数大小：以特码个位和十位数字相加来判断大小，小于或等于6为小，大于或等于7为大（49号为合大）。 <br>
            特码和数单双：以特码个位和十位数字相加来判断单双，如01，12，49为和单，02，11，33为和双。<br>
            特码尾数大小：以特别号尾数若0尾~4尾为小、5尾~9尾为大；如01、12、44为特尾小；如05、18、49为特尾大。 <br>
            特码家禽、野兽：家禽；牛、马、羊、鸡、狗、猪 野兽；鼠、虎、兔、龙、蛇、猴 <br>
                （二）正码
            </p>
            ` + name + `公司每期开出的前面六个号码为正码，下注号码如在六个正码号码里中奖。
            <table width="300" cellspacing="1" cellpadding="0" border="0" bgcolor="#CCCCCC"
            class="s-table">
                <tbody>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff" rowspan="2">
                            例：
                        </td>
                        <td height="25" bgcolor="#ffffff">
                            开奖号码：30 40 34 08 25 15 + 42
                        </td>
                    </tr>
                    <tr align="center">
                        <td height="25" bgcolor="#ffffff">
                            投注正码：30 40 34 08 25 15
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                1. 总和大小
            </p>
            总和大：以七个开奖号码的分数总和大于或等于175。
            <br>
            总和小：以有七个开奖号码的分数总和小于或等于174。
            <p>
                2. 总和单双
            </p>
            总和单：以七个开奖号码的分数总和是‘单数’，如分数总和是133、197。
            <br>
            总和双：以七个开奖号码的分数总和是‘双数’，如分数总和是120、188。
            <p>
                3. 正码特
            </p>
            当期开奖的前面6个号码，按开奖出来的先后顺序依次分为：正1特、正2特、正3特、正4特、正5特、正6特。其下注的正码特号与现场摇珠开出之正码其开奖顺序及开奖号码相同，视为中奖。
            <br>
            如：19,47,22,12,40,36+X 投注，正1特-19、正2特-47、正3特-22、正4特-12、正5特-40、正6特-36 当中的任意一项都中奖，投注正码特，其它号码如，正1特-47、正4特-36
            不中奖。
            <p>
                4. 正码1-6
            </p>
            ` + name + `公司当期开出之前6个号码叫正码。第一时间出来的叫正码1，依次为正码2、正码3┅┅ 正码6(并不以号码大小排序)。正码1、正码2、正码3、正码4、正码5、正码6的大小单双合单双和特别号码的大小单双规则相同，如正码1为31，则正码1为大，为单，为合双，为合小；正码2为08，则正码2为小，为双，为合双，为合大；号码为49则为和。假如投注组合符合中奖结果，视为中奖。正码1-6色波下注开奖之球色与下注之颜色相同时，视为中奖。其余情形视为不中奖。
            <p>
                5. 尾数
            </p>
            含有所属尾数的一个或多个号码，但派彩只派一次，即不论同尾数号码出现一个或多个号码都只派彩一次。
            <br>
            "0"尾：10、20、30、40
            <br>
            "1"尾：01、11、21、31、41
            <br>
            "2"尾：02、12、22、32、42
            <br>
            "3"尾：03、13、23、33、43
            <br>
            "4"尾：04、14、24、34、44
            <br>
            "5"尾：05、15、25、35、45
            <br>
            "6"尾：06、16、26、36、46
            <br>
            "7"尾：07、17、27、37、47
            <br>
            "8"尾：08、18、28、38、48
            <br>
            "9"尾：09、19、29、39、49
            <br>
            例如：开奖结果正码号码为11、31、42、44、35、32特别号码为21则1尾2尾4尾5尾都为中奖，其他尾数都不中奖。。
            <p>
                （三）连码
            </p>
            1. 三中二：所投注的每三个号码为一组合，若其中2个是开奖号码中的正码，即为三中二，视为中奖；若3个都是开奖号码中的正码，即为三中二之中三，其余情形视为不中奖，如06、07、08
            为一组合，开奖号码中有06、07两个正码，没有08，即为三中二，按三中二赔付；如开奖号码中有06、07、08三个正码，即为三中二之中三，按中三赔付；如出现1个或没有，视为不中奖
            。
            <br>
            2. 四全中：选择投注号码每四个为一组（四个或四个以上），兑奖号为正码，如四个号码都在开奖号码的正码里面，视为中奖，其他情形都视为不中奖 。
            <br>
            3. 三全中：所投注的每三个号码为一组合，若三个号码都是开奖号码之正码，视为中奖，其余情形视为不中奖。如06、07、08三个都是开奖号码之正码，视为中奖，如两个正码加上一个特别号码视为不中奖
            。
            <br>
            4. 二全中：所投注的每二个号码为一组合，二个号码都是开奖号码之正码，视为中奖，其余情形视为不中奖（含一个正码加一个特别号码之情形）。
            <br>
            5. 二中特：所投注的每二个号码为一组合，二个号码都是开奖号码之正码，叫二中特之中二；若其中一个是正码，一个是特别号码，叫二中特之中特；其余情形视为不中奖
            。
            <br>
            6. 特串：所投注的每二个号码为一组合，其中一个是正码，一个是特别号码，视为中奖，其余情形视为不中奖（含二个号码都是正码之情形） 。
            <p>
                （四）生肖
            </p>
            <p>
                1. 特码生肖
            </p>
            天肖：兔马猴猪牛龙。
            <br>
            地肖：鼠虎蛇羊鸡狗。
            <br>
            家肖：羊马牛猪狗鸡。
            <br>
            野肖：猴蛇龙兔虎鼠。
            <br>
            前肖：鼠牛虎兔龙蛇。
            <br>
            后肖：马羊猴鸡狗猪。
            <p>
                2. 特码生肖
            </p>
            生肖顺序为 鼠 >牛 >虎 >兔 >龙 >蛇 >马 >羊 >猴 >鸡 >狗 >猪 。
            <br>
            如今年是鼠年，就以鼠为开始，依顺序将49个号码分为12个生肖 『如下』
            <br>
            猪：02、14、26、38
            <br>
            狗：03、15、27、39
            <br>
            鸡：04、16、28、40
            <br>
            猴：05、17、29、41
            <br>
            羊：06、18、30、42
            <br>
            马：07、19、31、43
            <br>
            蛇：08、20、32、44
            <br>
            龙：09、21、33、45
            <br>
            兔：10、22、34、46
            <br>
            虎：11、23、35、47
            <br>
            牛：12、24、36、48
            <br>
            鼠：01、13、25、37、49
            <br>
            若当期特别号，落在下注生肖范围内，视为中奖 。
            <br>
            例如：开奖：XXXXXX+18 为特码-龙，投注特码-龙即中奖，投注特码其它生肖不中奖。
            <p>
                3. 正肖
            </p>
            当期开奖的前6个号码(不含特码，不分先后顺序)，其中有一个球号在投注的生肖范围即算中奖。如果有多个球号开在投注生肖范围内，派彩金额将自动倍增。
            <p>
                4. 一肖
            </p>
            当期开奖的全部号码(前6个号码和特码)，其中只要有一个球号在投注的生肖范围则中奖；没有一个球号在投注的生肖范围内，则不中奖；多个球号在投注生肖范围内，则中奖；但奖金不倍增，派彩只派一次，即不论同生肖号码出现一个或多个号码都只派一次。
            <p>
                （四）对碰
            </p>
            1. 生肖（尾数）所对应的号码和特码生肖（尾数）项目的一样；一个生肖（尾数）对应多个号码，不论同生肖（尾数）的号码出现一个或多个，派彩只派一次。每个生肖（尾数）都有自己的赔率，下注组合的总赔率，取该组合生肖（尾数）的最低赔率为总赔率。
            <br>
            2. 二连尾:选择二个尾数为一投注组合进行下注。该注的二个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。
            <br>
            3. 三连尾:选择三个尾数为一投注组合进行下注。该注的三个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。
            <br>
            4. 四连尾:选择四个尾数为一投注组合进行下注。该注的四个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。
            <br>
            5. 五连尾:选择五个尾数为一投注组合进行下注。该注的五个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。
            <br>
            6. 二连肖:选择二个生肖为一投注组合进行下注。该注的二个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。
            <br>
            7. 三连肖:选择三个生肖为一投注组合进行下注。该注的三个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。
            <br>
            8. 四连肖:选择四个生肖为一投注组合进行下注。该注的四个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。
            <br>
            9. 五连肖:选择五个生肖为一投注组合进行下注。该注的五个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。
            <p>
                （五）合肖
            </p>
            挑选2-11个生肖『排列如同生肖』为一个组合，开奖号码的对应生肖是否在此组合内，即视为中奖。
            <p>
                （六）自选不中
            </p>
            <p>
                挑选最少6个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖。每个号码都有自己的赔率，下注组合的总赔率，取该组合号码的最低赔率为总赔率。如下注组合为1-2-3-4-5-13，开奖号码为6，7，8，9，10，11，12，即为中奖，如果开奖号码为5，6，7，8，9，10，11，则为不中奖。
            </p>
            <p>
                （七）总肖
            </p>
            当期号码(所有正码与最后开出的特码)开出的不同生肖总数，与所投注之预计开出之生肖总和数(不用指定特定生肖)，则视为中奖，其余情形视为不中奖。例如：如果当期号码为19、24、12、34、40、39
            特别号：49，总计六个生肖，若选总肖【6】则为中奖。
            <p>
                （八）总肖单双
            </p>
            当期号码（正码和特码）开出的不同生肖总数若为单数则为单，若为双数则为双。
            <p>
                （九）七色波
            </p>
            以开出的7个色波，那种颜色最多为中奖。 开出的6个正码各以1个色波计，特别号以1.5个色波计。而以下3种结果视为和局。
            <br>
            1： 6个正码开出3蓝3绿，而特别码是1.5红
            <br>
            2： 6个正码开出3蓝3红，而特别码是1.5绿
            <br>
            3： 6个正码开出3绿3红，而特别码是1.5蓝
            <p>
                （十）五行
            </p>
            挑选一个五行选项为一个组合，若开奖号码的特码在此组合内，即视为中奖；若开奖号码的特码不在此组合内，即视为不中奖；
            <br>
            金：06、07、20、21、28、29、36、37
            <br>
            木：02、03、10、11、18、19、32、33、40、41、48、49
            <br>
            水：08、09、16、17、24、25、38、39、46、47
            <br>
            火：04、05、12、13、26、27、34、35、42、43
            <br>
            土：01、14、15、22、23、30、31、44、45`
            }
            if (item.lotteryClassName == 'PCEggs' || item.lotteryClassName == 'Luck28' || item.lotteryClassName == 'FiveMinutePCEggs') {
                var openTime = (item.lotteryId == 17) ? "3分钟一期，全天480期不停开奖（00:00至23:59）。" : "5分钟一期，共179期（北京时间早上9：05至23:55）。";
                if (item.lotteryId == 54) {
                    openTime = "5分钟一期，全天288期不停开奖（00:00至23:59）。"
                }
                // var openTime = (item.lotteryId == 54) ? "5分钟一期，全天288期不停开奖（00:00至23:59）。"
                that.pageText= `<h2><a href="#f1">一、玩法类型</a></h2><h2><a href="#f2">二、开奖与购买方式</a></h2><h2><a href="#f3">三、兑奖</a></h2><h2><a href="#f4">四、玩法说明</a></h2><h2><a href="#f5">五、中奖说明</a></h2><h2><a href="#f6">六、玩法特点</a></h2><br><p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p><br><b><p id="f1"class="ff">一、玩法类型</p></b><p>` + name + `是一种在线数字竞猜游戏。共28个投注号码，押中即可获得奖励。</p><br><b><p id="f2"class="ff">二、开奖与购买方式</p></b><p>1.` + name + `，` + openTime + `<br><p>2.购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。</p><p>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。</p><p>4.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。</p><p>5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，退还购买者投注金额。</p><b><p id="f3"class="ff">三、兑奖</p></b><p>用户一旦中奖，无论奖金大小，系统将自动返还至用户账户中。用户可继续投注或提款，永无弃奖。</p><br><b><p id="f4"class="ff">四、玩法说明</p></b><p>` + name + `投注号码竞猜的范围为0-27，共28个号码。以下为各个玩法的规则：</p><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th>规则</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">从0-27中选取一个以上的数字，投注号码与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">从0-27中任选3个号码组成1注，任意一个选号与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">数字14-27为大；<br>数字0-13为小；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">数字1，3，5，~27为单；<br>数字0，2，4，~26为双；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">从大双,小单,大单,小双中至少选一注，当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">数字0，1，2，3，4，5为极小；<br>数字22，23，24，25，26，27为极大；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波1，4，7，10，16，19，22，25；<br>蓝波2，5，8，11，17，20，23，26；<br>红波3，6，9，12，15，18，21，24；<br>当期开奖号码和值，符合投注组合，即中奖<br><b style="color:#f00;">开奖号码0,13,14,27为不中奖</b></td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">当期开奖号码三个数字相同即中奖</td></tr></tbody></table><br><b><p id="f5"class="ff">五、中奖说明</p></b><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th width="80">投注号码示例</th><th width="150">开奖号码示例</th><th>中奖条件</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">5</td><td bgcolor="#ffffff">0 0 5（顺序不限）<br>0 1 4（顺序不限）<br>0 2 3（顺序不限）<br>1 1 3（顺序不限）<br>1 2 2（顺序不限）</td><td bgcolor="#ffffff">所选特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">5 6 7</td><td bgcolor="#ffffff">3 1 1<br>2 2 2<br>5 0 2<br></td><td bgcolor="#ffffff">投选三个特码，任意一个特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">大<br>小<br></td><td bgcolor="#ffffff">1 6 7<br>1 6 6<br></td><td bgcolor="#ffffff">对特码大（14~27），小（0~13）形态进行投注，所选号码的形态与开奖号码的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">单<br>双</td><td bgcolor="#ffffff">2 1 2<br>2 1 3<br></td><td bgcolor="#ffffff">对特码单（1，3，5~27），双（0，2，4~26）形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">大单<br>大双<br>小单<br>小双</td><td bgcolor="#ffffff">7 7 1<br>7 7 2<br>2 7 2<br>2 7 1<br></td><td bgcolor="#ffffff">对特码大单（15，17，19，21，23，25，27），<br>小单（1，3，5，7，9，11，13），<br>大双（14，16，18，20，22，24，26），<br>小双（0，2，4，6，8.10，12）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">极小<br>极大</td><td bgcolor="#ffffff">1 0 0<br>9 8 5<br></td><td bgcolor="#ffffff">对特码极大（22，23，24，25，26，27），<br>极小（0，1，2，3，4，5）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波<br>蓝波<br>红波</td><td bgcolor="#ffffff">1 2 4<br>1 2 5<br>1 2 3</td><td bgcolor="#ffffff">对绿波（1，4，7，10，16，19，22，25），<br>蓝波（2，5，8，11，17，20，23，26），<br>红波（3，6，9，12，15，18，21，24）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">豹子<br></td><td bgcolor="#ffffff">0 0 0<br>1 1 1<br>2 2 2<br>3 3 3<br>4 4 4<br>5 5 5<br>6 6 6<br>7 7 7<br>8 8 8<br>9 9 9</td><td bgcolor="#ffffff">对所有的豹子（000，111，222，333，444，555，666，777，888，999）进行投注。当开奖号码为任意1个豹子时，即中奖。</td></tr></tbody></table><br><b><p id="f6"class="ff">六、玩法特点</p></b><p>1、即投、即开、即兑<br>每${openTime}，在线即投、即开、即兑，极大的提高了玩法的刺激性。</p><p>2、玩法简单多样<br>` + name + `是个简单又变化无穷的游戏，运气与技术的完美结合。</p><p>3、开奖频率高，赔率大<br>投注可大可小，赔率也可大可小，游戏开奖频率高，赔率大，引人入胜。</p>`
            }
            if (item.lotteryClassName == 'OneMinutePCEggs') {
                var openTime = "1分钟一期，全天1440期不停开奖（00:00至23:59）。";
                that.pageText= `<h2><a href="#f1">一、玩法类型</a></h2><h2><a href="#f2">二、开奖与购买方式</a></h2><h2><a href="#f3">三、兑奖</a></h2><h2><a href="#f4">四、玩法说明</a></h2><h2><a href="#f5">五、中奖说明</a></h2><h2><a href="#f6">六、玩法特点</a></h2><br><p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p><br><b><p id="f1"class="ff">一、玩法类型</p></b><p>` + name + `是一种在线数字竞猜游戏。共28个投注号码，押中即可获得奖励。</p><br><b><p id="f2"class="ff">二、开奖与购买方式</p></b><p>1.` + name + `，` + openTime + `<br><p>2.购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。</p><p>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。</p><p>4.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。</p><p>5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，退还购买者投注金额。</p><b><p id="f3"class="ff">三、兑奖</p></b><p>用户一旦中奖，无论奖金大小，系统将自动返还至用户账户中。用户可继续投注或提款，永无弃奖。</p><br><b><p id="f4"class="ff">四、玩法说明</p></b><p>` + name + `投注号码竞猜的范围为0-27，共28个号码。以下为各个玩法的规则：</p><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th>规则</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">从0-27中选取一个以上的数字，投注号码与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">从0-27中任选3个号码组成1注，任意一个选号与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">数字14-27为大；<br>数字0-13为小；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">数字1，3，5，~27为单；<br>数字0，2，4，~26为双；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">从大双,小单,大单,小双中至少选一注，当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">数字0，1，2，3，4，5为极小；<br>数字22，23，24，25，26，27为极大；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波1，4，7，10，16，19，22，25；<br>蓝波2，5，8，11，17，20，23，26；<br>红波3，6，9，12，15，18，21，24；<br>当期开奖号码和值，符合投注组合，即中奖<br><b style="color:#f00;">开奖号码0,13,14,27为不中奖</b></td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">当期开奖号码三个数字相同即中奖</td></tr></tbody></table><br><b><p id="f5"class="ff">五、中奖说明</p></b><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th width="80">投注号码示例</th><th width="150">开奖号码示例</th><th>中奖条件</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">5</td><td bgcolor="#ffffff">0 0 5（顺序不限）<br>0 1 4（顺序不限）<br>0 2 3（顺序不限）<br>1 1 3（顺序不限）<br>1 2 2（顺序不限）</td><td bgcolor="#ffffff">所选特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">5 6 7</td><td bgcolor="#ffffff">3 1 1<br>2 2 2<br>5 0 2<br></td><td bgcolor="#ffffff">投选三个特码，任意一个特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">大<br>小<br></td><td bgcolor="#ffffff">1 6 7<br>1 6 6<br></td><td bgcolor="#ffffff">对特码大（14~27），小（0~13）形态进行投注，所选号码的形态与开奖号码的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">单<br>双</td><td bgcolor="#ffffff">2 1 2<br>2 1 3<br></td><td bgcolor="#ffffff">对特码单（1，3，5~27），双（0，2，4~26）形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">大单<br>大双<br>小单<br>小双</td><td bgcolor="#ffffff">7 7 1<br>7 7 2<br>2 7 2<br>2 7 1<br></td><td bgcolor="#ffffff">对特码大单（15，17，19，21，23，25，27），<br>小单（1，3，5，7，9，11，13），<br>大双（14，16，18，20，22，24，26），<br>小双（0，2，4，6，8.10，12）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">极小<br>极大</td><td bgcolor="#ffffff">1 0 0<br>9 8 5<br></td><td bgcolor="#ffffff">对特码极大（22，23，24，25，26，27），<br>极小（0，1，2，3，4，5）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波<br>蓝波<br>红波</td><td bgcolor="#ffffff">1 2 4<br>1 2 5<br>1 2 3</td><td bgcolor="#ffffff">对绿波（1，4，7，10，16，19，22，25），<br>蓝波（2，5，8，11，17，20，23，26），<br>红波（3，6，9，12，15，18，21，24）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">豹子<br></td><td bgcolor="#ffffff">0 0 0<br>1 1 1<br>2 2 2<br>3 3 3<br>4 4 4<br>5 5 5<br>6 6 6<br>7 7 7<br>8 8 8<br>9 9 9</td><td bgcolor="#ffffff">对所有的豹子（000，111，222，333，444，555，666，777，888，999）进行投注。当开奖号码为任意1个豹子时，即中奖。</td></tr></tbody></table><br><b><p id="f6"class="ff">六、玩法特点</p></b><p>1、即投、即开、即兑<br>每${openTime}，在线即投、即开、即兑，极大的提高了玩法的刺激性。</p><p>2、玩法简单多样<br>` + name + `是个简单又变化无穷的游戏，运气与技术的完美结合。</p><p>3、开奖频率高，赔率大<br>投注可大可小，赔率也可大可小，游戏开奖频率高，赔率大，引人入胜。</p>`
            }
            if (item.lotteryClassName == 'CanadaPCEggs') {
                var openTime = "3分40秒一期，每日期数不固定。";
                that.pageText= `<h2><a href="#f1">一、玩法类型</a></h2><h2><a href="#f2">二、开奖与购买方式</a></h2><h2><a href="#f3">三、兑奖</a></h2><h2><a href="#f4">四、玩法说明</a></h2><h2><a href="#f5">五、中奖说明</a></h2><h2><a href="#f6">六、玩法特点</a></h2><br><p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p><br><b><p id="f1"class="ff">一、玩法类型</p></b><p>` + name + `是一种在线数字竞猜游戏。共28个投注号码，押中即可获得奖励。</p><br><b><p id="f2"class="ff">二、开奖与购买方式</p></b><p>1.` + name + `，` + openTime + `<br><p>2.购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。</p><p>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。</p><p>4.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。</p><p>5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，退还购买者投注金额。</p><b><p id="f3"class="ff">三、兑奖</p></b><p>用户一旦中奖，无论奖金大小，系统将自动返还至用户账户中。用户可继续投注或提款，永无弃奖。</p><br><b><p id="f4"class="ff">四、玩法说明</p></b><p>` + name + `投注号码竞猜的范围为0-27，共28个号码。以下为各个玩法的规则：</p><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th>规则</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">从0-27中选取一个以上的数字，投注号码与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">从0-27中任选3个号码组成1注，任意一个选号与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">数字14-27为大；<br>数字0-13为小；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">数字1，3，5，~27为单；<br>数字0，2，4，~26为双；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">从大双,小单,大单,小双中至少选一注，当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">数字0，1，2，3，4，5为极小；<br>数字22，23，24，25，26，27为极大；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波1，4，7，10，16，19，22，25；<br>蓝波2，5，8，11，17，20，23，26；<br>红波3，6，9，12，15，18，21，24；<br>当期开奖号码和值，符合投注组合，即中奖<br><b style="color:#f00;">开奖号码0,13,14,27为不中奖</b></td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">当期开奖号码三个数字相同即中奖</td></tr></tbody></table><br><b><p id="f5"class="ff">五、中奖说明</p></b><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th width="80">投注号码示例</th><th width="150">开奖号码示例</th><th>中奖条件</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">5</td><td bgcolor="#ffffff">0 0 5（顺序不限）<br>0 1 4（顺序不限）<br>0 2 3（顺序不限）<br>1 1 3（顺序不限）<br>1 2 2（顺序不限）</td><td bgcolor="#ffffff">所选特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">5 6 7</td><td bgcolor="#ffffff">3 1 1<br>2 2 2<br>5 0 2<br></td><td bgcolor="#ffffff">投选三个特码，任意一个特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">大<br>小<br></td><td bgcolor="#ffffff">1 6 7<br>1 6 6<br></td><td bgcolor="#ffffff">对特码大（14~27），小（0~13）形态进行投注，所选号码的形态与开奖号码的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">单<br>双</td><td bgcolor="#ffffff">2 1 2<br>2 1 3<br></td><td bgcolor="#ffffff">对特码单（1，3，5~27），双（0，2，4~26）形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">大单<br>大双<br>小单<br>小双</td><td bgcolor="#ffffff">7 7 1<br>7 7 2<br>2 7 2<br>2 7 1<br></td><td bgcolor="#ffffff">对特码大单（15，17，19，21，23，25，27），<br>小单（1，3，5，7，9，11，13），<br>大双（14，16，18，20，22，24，26），<br>小双（0，2，4，6，8.10，12）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">极小<br>极大</td><td bgcolor="#ffffff">1 0 0<br>9 8 5<br></td><td bgcolor="#ffffff">对特码极大（22，23，24，25，26，27），<br>极小（0，1，2，3，4，5）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波<br>蓝波<br>红波</td><td bgcolor="#ffffff">1 2 4<br>1 2 5<br>1 2 3</td><td bgcolor="#ffffff">对绿波（1，4，7，10，16，19，22，25），<br>蓝波（2，5，8，11，17，20，23，26），<br>红波（3，6，9，12，15，18，21，24）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">豹子<br></td><td bgcolor="#ffffff">0 0 0<br>1 1 1<br>2 2 2<br>3 3 3<br>4 4 4<br>5 5 5<br>6 6 6<br>7 7 7<br>8 8 8<br>9 9 9</td><td bgcolor="#ffffff">对所有的豹子（000，111，222，333，444，555，666，777，888，999）进行投注。当开奖号码为任意1个豹子时，即中奖。</td></tr></tbody></table><br><b><p id="f6"class="ff">六、玩法特点</p></b><p>1、即投、即开、即兑<br>每${openTime}，在线即投、即开、即兑，极大的提高了玩法的刺激性。</p><p>2、玩法简单多样<br>` + name + `是个简单又变化无穷的游戏，运气与技术的完美结合。</p><p>3、开奖频率高，赔率大<br>投注可大可小，赔率也可大可小，游戏开奖频率高，赔率大，引人入胜。</p>`
            }
            if (item.lotteryClassName == 'SingaporePCEggs') {
                var openTime = "2分钟一期，全天720期不停开奖（00:00至23:59:59）。";
                that.pageText= `<h2><a href="#f1">一、玩法类型</a></h2><h2><a href="#f2">二、开奖与购买方式</a></h2><h2><a href="#f3">三、兑奖</a></h2><h2><a href="#f4">四、玩法说明</a></h2><h2><a href="#f5">五、中奖说明</a></h2><h2><a href="#f6">六、玩法特点</a></h2><br><p style="color: #f00;">以下数据仅供参考，详情请咨询客服人员</p><br><b><p id="f1"class="ff">一、玩法类型</p></b><p>` + name + `是一种在线数字竞猜游戏。共28个投注号码，押中即可获得奖励。</p><br><b><p id="f2"class="ff">二、开奖与购买方式</p></b><p>1.` + name + `，` + openTime + `<br><p>2.购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。</p><p>3.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。</p><p>4.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。</p><p>5.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，退还购买者投注金额。</p><b><p id="f3"class="ff">三、兑奖</p></b><p>用户一旦中奖，无论奖金大小，系统将自动返还至用户账户中。用户可继续投注或提款，永无弃奖。</p><br><b><p id="f4"class="ff">四、玩法说明</p></b><p>` + name + `投注号码竞猜的范围为0-27，共28个号码。以下为各个玩法的规则：</p><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th>规则</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">从0-27中选取一个以上的数字，投注号码与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">从0-27中任选3个号码组成1注，任意一个选号与开奖号码和值相同，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">数字14-27为大；<br>数字0-13为小；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">数字1，3，5，~27为单；<br>数字0，2，4，~26为双；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">从大双,小单,大单,小双中至少选一注，当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">数字0，1，2，3，4，5为极小；<br>数字22，23，24，25，26，27为极大；<br>当期开奖号码和值，符合投注组合，即中奖</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波1，4，7，10，16，19，22，25；<br>蓝波2，5，8，11，17，20，23，26；<br>红波3，6，9，12，15，18，21，24；<br>当期开奖号码和值，符合投注组合，即中奖<br><b style="color:#f00;">开奖号码0,13,14,27为不中奖</b></td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">当期开奖号码三个数字相同即中奖</td></tr></tbody></table><br><b><p id="f5"class="ff">五、中奖说明</p></b><table width="600"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr style="color: #666;"><th width="80">玩法</th><th width="80">投注号码示例</th><th width="150">开奖号码示例</th><th>中奖条件</th></tr><tr><td height="25"bgcolor="#ffffff">特码</td><td height="25"bgcolor="#ffffff">5</td><td bgcolor="#ffffff">0 0 5（顺序不限）<br>0 1 4（顺序不限）<br>0 2 3（顺序不限）<br>1 1 3（顺序不限）<br>1 2 2（顺序不限）</td><td bgcolor="#ffffff">所选特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">特码包三</td><td height="25"bgcolor="#ffffff">5 6 7</td><td bgcolor="#ffffff">3 1 1<br>2 2 2<br>5 0 2<br></td><td bgcolor="#ffffff">投选三个特码，任意一个特码与开奖的3个号码相加之和相同，即中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">大小玩法</td><td height="25"bgcolor="#ffffff">大<br>小<br></td><td bgcolor="#ffffff">1 6 7<br>1 6 6<br></td><td bgcolor="#ffffff">对特码大（14~27），小（0~13）形态进行投注，所选号码的形态与开奖号码的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">单双玩法</td><td height="25"bgcolor="#ffffff">单<br>双</td><td bgcolor="#ffffff">2 1 2<br>2 1 3<br></td><td bgcolor="#ffffff">对特码单（1，3，5~27），双（0，2，4~26）形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">组合玩法</td><td height="25"bgcolor="#ffffff">大单<br>大双<br>小单<br>小双</td><td bgcolor="#ffffff">7 7 1<br>7 7 2<br>2 7 2<br>2 7 1<br></td><td bgcolor="#ffffff">对特码大单（15，17，19，21，23，25，27），<br>小单（1，3，5，7，9，11，13），<br>大双（14，16，18，20，22，24，26），<br>小双（0，2，4，6，8.10，12）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">极值玩法</td><td height="25"bgcolor="#ffffff">极小<br>极大</td><td bgcolor="#ffffff">1 0 0<br>9 8 5<br></td><td bgcolor="#ffffff">对特码极大（22，23，24，25，26，27），<br>极小（0，1，2，3，4，5）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">波色玩法</td><td height="25"bgcolor="#ffffff">绿波<br>蓝波<br>红波</td><td bgcolor="#ffffff">1 2 4<br>1 2 5<br>1 2 3</td><td bgcolor="#ffffff">对绿波（1，4，7，10，16，19，22，25），<br>蓝波（2，5，8，11，17，20，23，26），<br>红波（3，6，9，12，15，18，21，24）<br>形态进行投注，所选号码的形态与开奖号码相加之和的形态相同，即为中奖。</td></tr><tr><td height="25"bgcolor="#ffffff">豹子玩法</td><td height="25"bgcolor="#ffffff">豹子<br></td><td bgcolor="#ffffff">0 0 0<br>1 1 1<br>2 2 2<br>3 3 3<br>4 4 4<br>5 5 5<br>6 6 6<br>7 7 7<br>8 8 8<br>9 9 9</td><td bgcolor="#ffffff">对所有的豹子（000，111，222，333，444，555，666，777，888，999）进行投注。当开奖号码为任意1个豹子时，即中奖。</td></tr></tbody></table><br><b><p id="f6"class="ff">六、玩法特点</p></b><p>1、即投、即开、即兑<br>每${openTime}，在线即投、即开、即兑，极大的提高了玩法的刺激性。</p><p>2、玩法简单多样<br>` + name + `是个简单又变化无穷的游戏，运气与技术的完美结合。</p><p>3、开奖频率高，赔率大<br>投注可大可小，赔率也可大可小，游戏开奖频率高，赔率大，引人入胜。</p>`
            }

            if (item.lotteryClassName == 'ThreeD' || item.lotteryClassName == 'ArrangeThree' || item.lotteryClassName == 'ShanghaiFrequentHappy' || item.lotteryClassName == 'ThreeMinuteFrequentHappy' || item.lotteryClassName == 'ThreeMinuteThreeD' || item.lotteryClassName == 'ThreeMinuteArrangeThree') {
                time = "20:30现场开奖"
                if(id == 10) {time = "10:30至21:30开奖，每30分钟开奖一次"}
                if(id == 2) {time = "20:30现场开奖"}
                if(id == 18) {time = "21:15现场开奖"}
                that.pageText = `<h2><a href="#f1">一、玩法类型及承销</a></h2><h2><a href="#f2">二、开奖与购买方式</a></h2><h2><a href="#f3">三、兑奖</a></h2><h2><a href="#f4">四、玩法说明</a></h2><h2><a href="#f5">五、设奖及中奖</a></h2><h2><a href="#f6">六、投注方式</a></h2><h2><a href="#f7">七、玩法特点</a></h2><br><h2 style="color: #f00; ">购彩需知：</h2><p style="color: #f00; ">1.同一期定位胆购买不能超过6个号码。<br/>2.同一期组选购买不能超过7个号码。<br/><br/>以下数据仅供参考，详情请咨询客服人员</p><br><b><p id="f1"class="ff">一、玩法类型及承销</p></b>` + name + `是一种小盘玩法游戏，属数字型彩票范畴，由中国福利彩票发行管理中心统一组织发行，在全国范围内销售。<br><br><b><p id="f2"class="ff">二、开奖与购买方式</p></b>1.本站` + name + `游戏每天进行` + issue + `，每晚` + time + `，开奖号码通过摇奖方式产生，中央广播电台中国之声对开奖进行现场直播。购买者可透过本站进行投注，在对其选定的投注号码进行投注；或返点投注，返点越高投注赔率则低。每注金额人民币2元。<br>2.购买者可选择机选号码投注、自选号码投注。机选号码投注是指由系统随机产生投注号码进行投注，自选号码投注是指购买者选定的号码进行投注。<br>3.购买者还可进行多倍投注、追号投注。多倍投注是指同样的投注号码进行翻倍数额购买的投注。追号投注指将一注或一组号码进行两期或两期以上的投注。追号为连续追号，连续追号指追号的期数是连续的。<br>4.如果用户投注成功后，若因销售终端故障、通讯线路故障和投注站信用额度受限等原因造成当期无法开奖的，应退还购买者投注金额。<br><br><b><p id="f3"class="ff">三、兑奖</p></b>1.返奖：无论大小奖均返还至用户在本站的账户中，一旦用户中奖，系统将自动返还中奖金额。可继续投注或提款，永无弃奖。<br><br><b><p id="f4"class="ff">四、玩法说明</p></b>1．` + name + `投注区分为百位、十位和个位，以一个3位自然数为投注号码的彩种玩法，投注者从000到999的范围内选择一个3位数进行投注，` + name + `玩法即是竞猜3位开奖号码。<div align="center"><img src="/pc/common/statics/img/rule/rule.pls.p1.gif"/></div><br>2.在本站中，` + name + `支持的玩法有“` + name + `分直选”、“组选三”、和“组选六”三种玩法如下：<br><table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr align="center"class="cu"><td width="79"height="25"bgcolor="#efefef"class="td">玩法</td><td width="514"height="25"bgcolor="#efefef"class="td">规则</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">直选</td><td width="514"height="25"bgcolor="#FFFFFF">竟猜三位开奖号码，即百位、十位和个位，且顺序一致。</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选三</td><td width="514"height="25"bgcolor="#FFFFFF">竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码有且只有两位相同。</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选六</td><td width="514"height="25"bgcolor="#FFFFFF">竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码各不相同。</td></tr></tbody></table>注：<1>直选：将投注号码以唯一的排列方式进行投注。<br>&nbsp;&nbsp;&nbsp;&nbsp;<2>组选：将投注号码的所有排列方式作为一注投注号码进行投注。示例：123，排列方式有123、132、213、231、312、321，共计6种。<br>&nbsp;&nbsp;&nbsp;&nbsp;<3>组选三：在组选中，如果一注组选号码的3个数字有两个数字相同，则有3种不同的排列方式，因而就有3个中奖机会，这种组选投注方式简称组选三。示例：112，排列方式有112、121、211。<br>&nbsp;&nbsp;&nbsp;&nbsp;<4>组选六：在组选中，如果一注组选号码的3个数字各不相同，则有6种不同的排列方式，因而就有6个中奖机会，这种组选投注方式简称组选六。示例：123，排列方式有123、132、213、231、312、321，共计6种。<br><br><b><p id="f5"class="ff">五、设奖及中奖</p></b>奖金计算说明列表请浏览本站主页“开奖公告”页面，点击` + name + `查阅。<br><table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu"colspan="2">玩法</td><td height="25"bgcolor="#eFeFeF"class="td cu">开奖号码</td><td height="25"bgcolor="#eFeFeF"class="td cu">投注号码示例</td><td height="25"bgcolor="#eFeFeF"class="td cu"></td><td height="25"bgcolor="#eFeFeF"class="td cu">中奖概率</td><td height="25"bgcolor="#eFeFeF"class="td cu">单注最高赔率</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF"rowspan="7">三星</td><td height="25"bgcolor="#FFFFFF">直选(复式)</td><td height="25"bgcolor="#FFFFFF"rowspan="2">678</td><td height="25"bgcolor="#FFFFFF">678</td><td height="25"bgcolor="#FFFFFF"rowspan="3">定位中三码</td><td height="25"bgcolor="#FFFFFF"rowspan="3">1/1000</td><td height="25"bgcolor="#FFFFFF"rowspan="3">1:950</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">直选(单式)</td><td height="25"bgcolor="#FFFFFF">678</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">直选和值</td><td height="25"bgcolor="#FFFFFF">13</td><td height="25"bgcolor="#FFFFFF">13</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选(组三)</td><td height="25"bgcolor="#FFFFFF">113</td><td height="25"bgcolor="#FFFFFF">113</td><td height="25"bgcolor="#FFFFFF"rowspan="4">不定位中三码</td><td height="25"bgcolor="#FFFFFF">1/90</td><td height="25"bgcolor="#FFFFFF">1:316.666</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选(组六)</td><td height="25"bgcolor="#FFFFFF">123</td><td height="25"bgcolor="#FFFFFF">123</td><td height="25"bgcolor="#FFFFFF">1/120</td><td height="25"bgcolor="#FFFFFF">1:158.333</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选和值(组三)</td><td height="25"bgcolor="#FFFFFF">5(113)</td><td height="25"bgcolor="#FFFFFF">5(113)</td><td height="25"bgcolor="#FFFFFF">1/90</td><td height="25"bgcolor="#FFFFFF">1:316.666</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选和值(组六)</td><td height="25"bgcolor="#FFFFFF">6(123)</td><td height="25"bgcolor="#FFFFFF">6(123)</td><td height="25"bgcolor="#FFFFFF">1/120</td><td height="25"bgcolor="#FFFFFF">1:158.333</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF"rowspan="2">二星</td><td height="25"bgcolor="#FFFFFF">直选(前/后二)</td><td height="25"bgcolor="#FFFFFF">78</td><td height="25"bgcolor="#FFFFFF">78</td><td height="25"bgcolor="#FFFFFF">定位中三码</td><td height="25"bgcolor="#FFFFFF">1/100</td><td height="25"bgcolor="#FFFFFF">1:95</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF">组选(前/后二)</td><td height="25"bgcolor="#FFFFFF">78</td><td height="25"bgcolor="#FFFFFF">78</td><td height="25"bgcolor="#FFFFFF">不定位中三码</td><td height="25"bgcolor="#FFFFFF">1/45</td><td height="25"bgcolor="#FFFFFF">1:47.5</td></tr><tr align="center"><td height="25"bgcolor="#FFFFFF"colspan="2">大小单双</td><td height="25"bgcolor="#FFFFFF">678</td><td height="25"bgcolor="#FFFFFF">大单</td><td height="25"bgcolor="#FFFFFF">大小</td><td height="25"bgcolor="#FFFFFF">1/16</td><td height="25"bgcolor="#FFFFFF">1:3.8</td></tr></tbody></table>注：<1>、假设当期的开奖号码为678组选三不中奖（组选三适用开奖号码为668）。<br>&nbsp;&nbsp;&nbsp;&nbsp;<2>、定位和不定位：定位指投注号码与开奖号码按位一致，不定位指投注号码与开奖号码一致，顺序不限。示例：开奖号码为678，678则定位中三码，768或867则为不定位中三码。<b><p id="f6"class="ff">六、投注方式</p></b>1、直选标准<br>对百位、十位和个位各选1个号码为一注，每位号码最多可0～9全选，投注号码与开奖号码顺序一致即为中奖。（每位号码可以同时选择多个进行复式投注）<div align="center"><img src="/pc/common/statics/img/rule/rule.pls.p2.gif"/></div><br>2、组三组选<br>组三组选指用所选号码的所有组三排列方式进行组选三投注，如开奖号码为组三号且包含在所选号码中即为中奖。示例：组三组选12，共2注（112、122），如开奖号码为112、121、211、122、212、221皆为中奖。<br>包号速算表如下：<table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">包号个数（10选n）</td><td height="25"bgcolor="#FFFFFF"class="td cu">2</td><td height="25"bgcolor="#FFFFFF"class="td cu">3</td><td height="25"bgcolor="#FFFFFF"class="td cu">4</td><td height="25"bgcolor="#FFFFFF"class="td cu">5</td><td height="25"bgcolor="#FFFFFF"class="td cu">6</td><td height="25"bgcolor="#FFFFFF"class="td cu">7</td><td height="25"bgcolor="#FFFFFF"class="td cu">8</td><td height="25"bgcolor="#FFFFFF"class="td cu">9</td><td height="25"bgcolor="#FFFFFF"class="td cu">10</td></tr><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">投注金额（2元）</td><td height="25"bgcolor="#FFFFFF"class="td cu">4</td><td height="25"bgcolor="#FFFFFF"class="td cu">12</td><td height="25"bgcolor="#FFFFFF"class="td cu">24</td><td height="25"bgcolor="#FFFFFF"class="td cu">40</td><td height="25"bgcolor="#FFFFFF"class="td cu">60</td><td height="25"bgcolor="#FFFFFF"class="td cu">84</td><td height="25"bgcolor="#FFFFFF"class="td cu">112</td><td height="25"bgcolor="#FFFFFF"class="td cu">144</td><td height="25"bgcolor="#FFFFFF"class="td cu">180</td></tr><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">中奖奖金（元）</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">633.332</td></tr></tbody></table>3、组三和值<br>和值指号码各位数相加之和，如号码001，和值为1。组三和值投注指用某一组选三和值对应的所有号码进行组三投注，所选和值与开奖号码和值一致，且开奖号为组三号即为中奖。示例：选择组三和值2投注，即用组三和值2所对应的号码（011、002）投注，如开奖号码为组三号且和值为2即中奖。<div align="center"><img src="/pc/common/statics/img/rule/rule.pls.p3.gif"/></div><br>4、组六组选<br>组六组选指用所选号码的所有组六排列方式进行组选六投注，如开奖号码为组六号且包含在所选号码中即为中奖。示例：组六组选123，共1注，如开奖号码后三位为123、132、213、231、312、321皆为中奖。包号速算表如下：<br><table width="100%"cellspacing="1"cellpadding="0"border="0"bgcolor="#CCCCCC"class="s-table"><tbody><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">包号个数（10选n）</td><td height="25"bgcolor="#FFFFFF"class="td cu">4</td><td height="25"bgcolor="#FFFFFF"class="td cu">5</td><td height="25"bgcolor="#FFFFFF"class="td cu">6</td><td height="25"bgcolor="#FFFFFF"class="td cu">7</td><td height="25"bgcolor="#FFFFFF"class="td cu">8</td><td height="25"bgcolor="#FFFFFF"class="td cu">9</td><td height="25"bgcolor="#FFFFFF"class="td cu">10</td></tr><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">投注金额（2元）</td><td height="25"bgcolor="#FFFFFF"class="td cu">8</td><td height="25"bgcolor="#FFFFFF"class="td cu">20</td><td height="25"bgcolor="#FFFFFF"class="td cu">40</td><td height="25"bgcolor="#FFFFFF"class="td cu">70</td><td height="25"bgcolor="#FFFFFF"class="td cu">112</td><td height="25"bgcolor="#FFFFFF"class="td cu">168</td><td height="25"bgcolor="#FFFFFF"class="td cu">240</td></tr><tr align="center"><td height="25"bgcolor="#eFeFeF"class="td cu">中奖奖金（元）</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.333</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.333</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.332</td><td height="25"bgcolor="#FFFFFF"class="td cu">158.332</td></tr></tbody></table>5、组六和值<br>和值指号码各位数相加之和，如号码123，和值为6。和值投注指用某一组六和值对应的所有号码进行组六投注，所选和值与开奖号码和值一致，且开奖号为组六号即为中奖。<br>示例：选择组六和值6投注，即用组六和值6所对应的号码（123、015、024）投注，如开奖号码为组六号且和值为6即中奖。<br>6、单式上传<br>将固定格式的单式号码统一上传给系统进行投注。此投注方式对于将过滤软件过滤出的单式号码统一投注十分方便。<div align="center"><img src="/pc/common/statics/img/rule/rule.pls.p4.gif"/></div><br><br><b><p id="f7"class="ff">七、玩法特点</p></b><div align="center"><img src="/pc/common/statics/img/rule/rule.fcsd.jpg"/></div>`
            }
        }
    }
})
vue.onload();
