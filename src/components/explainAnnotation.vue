<template>
  <div id="explainAnnotation">
    <div id="imageNumber">
      <span>图片编号：{{this.imageId}}</span>
    </div>
    <div id="userInfo">
      <span>当前已登录：{{this.userAccessToken}}</span>
      <button v-on:click="logout">退出登录</button>
    </div>
    <div>
      <div id="image">
        <img v-bind:src="imageUrl" width="800px" />
        <br />
        <br />
        <button class="hbtn hb-fill-on" v-on:click="buxing">我认为这张不行</button>
        <button class="hbtn hb-fill-on" v-on:click="changeImage">我认为这张阔以</button>
        <!--button class="hbtn hb-fill-on" v-on:click="changeImage">换一张图片</button>
        <button class="hbtn hb-fill-on" v-on:click="uploadAnnotation">提交</button-->
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
        <br />
        <div v-bind:src="annotation169">
          <span>{{this.annotation169}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GLOBAL from '@/components/GlobalVar.js'
export default {
  name: 'explainAnnotation',
  data() {
    return {
      imageUrl: '',
      imageId: '',
      userAccessToken: '',
      explains: [{}],
      annotation169: ''
    }
  },
  components: {},
  mounted: async function() {
    this.userAccessToken = localStorage.getItem('userAccessToken')
    if (this.userAccessToken) await this.changeImage()
    else this.$router.push({ name: 'login' })
    this.getExplains()
  },
  computed: {},
  methods: {
    init() {
      this.imageUrl = ''
      this.imgId = ''
    },
    async changeImage() {
      var _this = this
      this.init()
      await axios
        .get(GLOBAL.backendIP + GLOBAL.getImageId, {
          params: {
            username: _this.userAccessToken,
            keyiflag: true
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
      await this.getAnnotationFrom169()
      await this.getExplains()
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
      var retEx = ''
      for (var i = 0; i < this.explains.length; i++) {
        retEx += '[' + i + ']' + this.explains[i].explainSelection
        if (i !== this.explains.length - 1) retEx += '&&'
      }
      var _this = this
      axios
        .get(GLOBAL.backendIP + GLOBAL.uploadExplainAnnotation, {
          params: {
            imgId: _this.imageId,
            explainAnnotation: encodeURI(retEx)
          }
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
      this.changeImage()
    },
    logout() {
      this.userAccessToken = ''
      localStorage.removeItem('userAccessToken')
    },
    buxing() {
      var _this = this
      axios
        .get(GLOBAL.backendIP + '/buxing', {
          params: {
            imgId: _this.imageId,
            username: _this.userAccessToken
          }
        })
        .catch(error => {
          this.tips = '查询失败，请检查网络连接'
          console.log(error)
        })
      this.changeImage()
    },
    async getAnnotationFrom169() {
      var _this = this
      await axios
        .get(GLOBAL.backendIP + '/getAnnotationFrom169', {
          params: {
            imgId: _this.imageId
          }
        })
        .then(response => {
          _this.annotation169 = response.data
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
  width: 1000px;
}
#other {
  float: left;
  width: 500px;
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
