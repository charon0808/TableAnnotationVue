<template>
  <div id="imageMain">
    <div id="imageNumber">
      <span>图片编号：{{this.imageId}}</span>
    </div>
    <div id="userInfo">
      <span>当前已登录：{{this.userAccessToken}}</span>
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
        <select name="select" v-model="currentRegion">
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
            <input type="text" v-model="ex.explainSelection" />
          </li>
        </ol>
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
      regionItems: [
        { id: '0', name: '原点' },
        { id: '1', name: 'x轴' },
        { id: '2', name: 'y轴' },
        { id: '3', name: '有效点1' },
        { id: '4', name: '有效点2' },
        { id: '5', name: '有效点3' },
        { id: '6', name: '有效点4' }
      ],
      tableNo: '1',
      xKd: '1',
      yKd: '1',
      xZero: '0',
      yZero: '0',
      xMeaning: '',
      yMeaning: ''
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
    },
    async changeImage() {
      var _this = this
      this.init()
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getImageId)
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
            imgId: encodeURI(_this.imageId),
            username: encodeURI(_this.userAccessToken),
            es: encodeURI(retEx),
            xMeaning: encodeURI(_this.xMeaning),
            yMeaning: encodeURI(_this.yMeaning)
          }
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
    },
    done() {
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
</style>
