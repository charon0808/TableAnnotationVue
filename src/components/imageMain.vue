<template>
  <div id="imageMain">
    <div id="imageNumber">
      <span>图片编号：{{this.imageId}}</span>
    </div>
    <div id="userInfo">
      <span>当前已登录：{{this.userAccessToken}}</span>
      <span>你已经标记了{{this.count}}张图片</span>
      <button v-on:click="logout">退出登录</button>
    </div>
    <div>
      <div id="image">
        <img v-bind:src="imageUrl" width="800px" @click="touchstart" />
        <br />
        <br />
        <br />
        <span>x轴是否有具体的数字刻度:</span>
        <select v-model="xKd">
          <option value="1">是</option>
          <option value="0">否</option>
        </select>
        <br />
        <span>y轴是否有具体的数字刻度:</span>
        <select v-model="yKd">
          <option value="1">是</option>
          <option value="0">否</option>
        </select>
        <br />
        <span>当前标记的点类型:</span>
        <select name="select" v-model="currentRegion" @change="regionChange">
          <option :value="item.id" v-for="item in regionItems" :key="item">{{item.name}}</option>
        </select>
        <div>
          x轴原点值：
          <input type="text" v-model="xZero" />
        </div>
        <div>
          y轴原点值：
          <input type="text" v-model="yZero" />
        </div>
        <div>
          图片标题（如果有的话）：
          <input type="text" v-model="tableName" />
        </div>
        <div>
          x轴物理含义：
          <input type="text" v-model="xMeaning" />
        </div>
        <div>
          y轴物理含义：
          <input type="text" v-model="yMeaning" />
        </div>
        <br />
        <br />
        <br />
        <br />
        <button class="hbtn hb-fill-on" v-on:click="changeImage">换一张图片</button>
        <button class="hbtn hb-fill-on" v-on:click="dotRevert">撤销</button>
        <button class="hbtn hb-fill-on" v-on:click="done">提交</button>
      </div>
      <div id="other">
        <br />
        <ol>
          <li style="color:#000;font-size:14px;" v-for="ex in this.explains" :key="ex">
            {{ ex.explain }}
            <br />
            <textarea
              rows="3"
              cols="75"
              type="hahtext"
              v-model="ex.explainSelection"
              width="600px"
            />
            <br />
            <br />
          </li>
        </ol>
        <ul>
          <li>
            <div>
              如果上面的解析没有解题需要能够描述图片的文字，那写一段在下面：
              <br />
              <textarea rows="3" cols="75" type="hahtext" v-model="extra" width="600px" />
              <br />
              <br />
            </div>
          </li>
        </ul>
        <div>
          <span>如何标注：</span>
          <ol>
            <li>
              首先确认当前的图片是否是我们能够标注的图片，不是的类型你应该点击换一张图片
              <ul>
                <li>需要我们标注的图片是能够转化为表格表示的曲线图（包括折线图）和柱状图</li>
                <ul>
                  <li>曲线图（折线图）</li>
                  <li>柱状图</li>
                </ul>
                <li>几种属于上面的图片分类但是无法标注的情况</li>
                <ul>
                  <li>
                    <b>同一张图中有多个x轴或y轴</b>
                  </li>
                </ul>
              </ul>
            </li>
            <li>
              然后开始标注
              <ol>
                <li>观察x轴和y轴是否有具体的刻度，然后在右侧的选项中选择具体的选项，如果x轴没有刻度，那么只需要标注x轴上最右边的点，y轴同理</li>
                <li>然后最先开始标注原点，在右侧的&lt;当前标记的点类型&gt;下拉框中选择原点，然后在图中原点处点击一下就好了</li>
                <li>然后依次标注x轴和y轴，如果你选择了x轴或y轴有具体刻度，在这里会让你输入对应的刻度，注意输入的刻度应为纯数字（即不包含单位），单位应该在x，y轴物理含义里面表明</li>
                <li>接下来就要标注图中的曲线部分了，你应该在&lt;当前标记的点类型&gt;中选择曲线1~4中的一个，然后在图片上点击曲线上的点，每一个选项对应图中的一条曲线，你应该标注完某一条曲线之后才去标注下一条曲线。在你选中一个曲线选项时，会让你输入当前曲线的含义，如果没有的话，留空就好</li>
                <li>这些都标注完成之后填好右侧剩余的框框</li>
                <li>左侧上方的文字可能包含对曲线的描述，你应该把直接描述曲线（不包含任何的推理）的文字复制到下面的输入框中</li>
              </ol>
            </li>
            <li>
              注意事项：
              <ul>
                <li>填写x轴和y轴的物理含义时，把他们的单位也带上，应该这样写： 物理含义（单位）</li>
                <li>填写x轴和y轴对应的坐标值时，填写纯数字，他们的单位已经包括在xy轴物理含义里面了</li>
                <li>对于形式为折线图的类型，尽量选中折线上的每个点，如果点的数量多的话，选出重要的点。注意标记这样的图时尽量每条曲线标记相同的点个数</li>
                <li>在标注每条曲线时，最好按照曲线的变化趋势标，对于非函数的曲线，就必须按照趋势标注了</li>
                <li>
                  撤销按钮能够在你标错的时候撤销掉图中
                  <b>当前标记的点类型</b>中的最后一个点
                </li>
                <li>
                  最好在你确定当前图片不属于需要标注的类型或者当前图片无法标注时使用
                  <b>换一张图片</b>这个按钮，为了避免遗漏，我们会review所有被换掉的图片
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GLOBAL from '@/components/GlobalVar.js'
export default {
  name: 'imageMain',
  data() {
    return {
      imageUrl: '',
      imageId: '',
      userAccessToken: '',
      currentRegion: '0',
      revertCount: 0,
      explains: [{}],
      curveMeaning: ['', '', '', '', ''],
      regionItems: [
        { id: '0', name: '原点' },
        { id: '1', name: 'x轴' },
        { id: '2', name: 'y轴' },
        { id: '3', name: '曲线1' },
        { id: '4', name: '曲线2' },
        { id: '5', name: '曲线3' },
        { id: '6', name: '曲线4' },
        { id: '7', name: '曲线5' }
      ],
      tableNo: '1',
      xKd: '1',
      yKd: '1',
      xZero: '0',
      yZero: '0',
      xMeaning: '',
      yMeaning: '',
      tableName: '',
      tableCode: [],
      extra: '',
      count: ''
    }
  },
  components: {},
  mounted: async function() {
    this.userAccessToken = localStorage.getItem('userAccessToken')
    if (this.userAccessToken) await this.changeImage()
    else this.$router.push({ name: 'login' })
    this.getExplains()
  },
  computed: {
    imageClick1() {
      console.log('click!')
      return 'hah'
    }
  },
  methods: {
    init() {
      this.imageUrl = ''
      this.imgId = ''
      this.currentRegion = '0'
      this.revertCount = 0
      this.tableNo = '1'
      this.xKd = '1'
      this.yKd = '1'
      this.xZero = '0'
      this.yZero = '0'
      this.tableName = ''
      this.xMeaning = ''
      this.yMeaning = ''
      this.curveMeaning = ['', '', '', '', '']
      this.tableCode = []
      this.extra = ''
    },
    async changeImage() {
      var _this = this
      this.init()
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getImageId, {
          params: {
            username: _this.userAccessToken,
            keyiflag: false
          }
        })
        .then(response => {
          console.log(this)
          _this.imageUrl =
            GLOBAL.backendIP + GLOBAL.getImageById + response.data
          _this.imageId = response.data
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
      await this.getExplains()
      this.count = await this.getUserCount()
    },
    getZb() {
      var zb = prompt('坐标值', '')
      while (!this.isNumber(zb)) {
        zb = prompt('请输入合法的数字', '')
      }
      return zb
    },
    updateImage(x, y) {
      var zb = '-1'
      if (x !== -1 && y !== -1) {
        if (
          (this.yKd === '1' && this.currentRegion === '2') ||
          (this.xKd === '1' && this.currentRegion === '1')
        ) {
          zb = this.getZb()
        }
      }
      this.imageUrl =
        GLOBAL.backendIP +
        GLOBAL.updateImage +
        'imgId=' +
        this.imageId +
        '&x=' +
        x +
        '&y=' +
        y +
        '&userAccessToken=' +
        this.userAccessToken +
        '&region=' +
        this.currentRegion +
        '&zb=' +
        zb +
        '&tableNo=' +
        this.tableNo
    },
    touchstart(e) {
      console.log('touchstart')
      var x = e.offsetX
      var y = e.offsetY
      console.log('x: ' + x + ', y: ' + y)
      var img = new Image()
      img.src = this.imageUrl
      var _this = this
      img.onload = function() {
        var xFloat = parseFloat(x)
        var yFloat = parseFloat(y)
        _this.updateImage(
          (img.width * xFloat) / 800,
          (yFloat * img.width) / 800
        )
      }
    },
    dotRevert() {
      this.revertCount = this.revertCount - 1
      this.updateImage(-1, this.revertCount)
    },
    async getExplains() {
      var _this = this
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getExplainsById, {
          params: {
            imgId: _this.imageId
          }
        })
        .then(response => {
          console.log(this)
          _this.explains = response.data
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
    },
    getCruveMeaning() {
      var ret = ''
      for (var i = 0; i < 5; i++) {
        ret += '[' + i + ']' + this.curveMeaning[i]
        if (i !== 4) {
          ret += '&&'
        }
      }
      return ret
    },
    uploadAnnotation() {
      var _this = this
      var retEx = ''
      for (var i = 0; i < this.explains.length; i++) {
        retEx += '[' + i + ']' + this.explains[i].explainSelection
        if (i !== this.explains.length - 1) retEx += '&&'
      }
      axios
        .get(GLOBAL.backendIP + GLOBAL.getExplainSelection, {
          params: {
            imgId: _this.imageId,
            username: encodeURI(_this.userAccessToken),
            es: encodeURI(retEx),
            xMeaning: encodeURI(_this.xMeaning),
            yMeaning: encodeURI(_this.yMeaning),
            tableName: encodeURI(_this.tableName),
            curveMeaning: encodeURI(_this.getCruveMeaning()),
            extra: encodeURI(_this.extra)
          }
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
    },
    async done() {
      if (!this.localCheckBeforeSubmit()) {
        return
      }
      var tmp = await this.checkBeforeSubmit()
      console.log('test' + tmp)
      if (tmp === 'f') {
        alert('你漏掉了标记点（原点，x轴点，y轴点，有效点都至少标记一个）')
        return
      }
      this.uploadAnnotation()
      this.changeImage()
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true
      } else {
        return false
      }
    },
    logout() {
      this.userAccessToken = ''
      localStorage.removeItem('userAccessToken')
    },
    async checkBeforeSubmit() {
      var _this = this
      var ret
      await axios
        .get(GLOBAL.backendIP + GLOBAL.checkBeforeSubmit, {
          params: {
            imgId: _this.imageId
          }
        })
        .then(response => {
          ret = response.data
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
      return ret
    },
    async getUserCount() {
      var _this = this
      var ret
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getUserAnnotationCount, {
          params: {
            username: _this.userAccessToken
          }
        })
        .then(response => {
          _this.count = response.data
          ret = response.data
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
      return ret
    },
    localCheckBeforeSubmit() {
      if (this.xMeaning === '' || this.yMeaning === '') {
        alert('你忘记填x轴或y轴表示的物理意义了')
        return false
      }
      var ex
      var flag = true
      for (ex = 0; ex < this.explains.length; ex++) {
        console.log(ex)
        if (this.explains[ex].explainSelection === '') {
          flag = false
        }
      }
      if (!flag) {
        alert(
          '你忘记填图片对应的解析了，如果解析中没有直接描述图片的句子，那可以归纳一下解析中用到了的图片中的信息'
        )
      }
      return flag
    },
    regionChange() {
      if (this.currentRegion - '0' >= 3) {
        if (this.curveMeaning[this.currentRegion - '3'] === '') {
          this.curveMeaning[this.currentRegion - '3'] = prompt(
            '你当前标记的这条曲线的含义：',
            ''
          )
        }
      }
    },
    async getTableCode() {
      var _this = this
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getTableCode, {
          params: {
            imgId: _this.imageId
          }
        })
        .then(response => {
          _this.tableCode = response.data
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
    }
  }
}
</script>

<style>
.img_box {
  padding: 200px;
  font-size: 3em;
  color: #a6e22e;
  text-align: center;
  background-color: #011f27;
}
#image {
  float: right;
  width: 1200px;
}
#other {
  float: left;
  width: 600px;
  text-align: justify;
}
#userInfo {
  text-align: right;
}
#imageNumber {
  text-align: left;
}
input[type='hahtext'] {
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
  padding: 0;
  width: 600px;
  height: 50px;
}
.hli {
  text-align: center;
  text-align: left;
}
</style>
