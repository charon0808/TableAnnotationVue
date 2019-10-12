<template>
  <div id="imageMain">
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
        <button class="hbtn hb-fill-on" v-on:click="currentRegion = '0'">原点</button>
        <button class="hbtn hb-fill-on" v-on:click="currentRegion = '1'">x轴</button>
        <button class="hbtn hb-fill-on" v-on:click="currentRegion = '2'">y轴</button>
        <button class="hbtn hb-fill-on" v-on:click="currentRegion = '3'">有效点</button>
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
      explains: [{}]
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
    async changeImage() {
      var _this = this
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
    updateImage(x, y) {
      var zb = ''
      if (x !== -1 && y !== -1) {
        if (this.currentRegion === '1' || this.currentRegion === '2') {
          zb = prompt('坐标值', '')
          while (!this.isNumber(zb)) {
            zb = prompt('请输入合法的数字', '')
          }
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
        zb
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
    uploadExplainSelection() {
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
            es: encodeURI(retEx)
          }
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
    },
    done() {
      this.uploadExplainSelection()
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
    getXY() {
      
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
</style>
