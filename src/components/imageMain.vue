<template>
  <div id="imageMain" class="img_box">
    <img v-bind:src="imageUrl" width="800px" @click="touchstart" />
    <br />
    <button v-on:click="changeImage">换一张图片</button>
  </div>
</template>

<script>
import axios from 'axios'
import GLOBAL from '@/components/GlobalVar.js'
export default {
  name: 'imageMain',
  data() {
    return { imageUrl: '', imageId: '' }
  },
  components: {},
  mounted: function() {
    this.changeImage()
  },
  computed: {
    imageClick1() {
      console.log('click!')
      return 'hah'
    }
  },
  methods: {
    changeImage() {
      var _this = this
      axios
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
    },
    updateImage(x, y) {
      this.imageUrl =
        GLOBAL.backendIP +
        GLOBAL.updateImage +
        'imgId=' +
        this.imageId +
        '&x=' +
        x +
        '&y=' +
        y
    },
    // 当鼠标点击时触发，类似onclick事件
    touchstart(e) {
      console.log('touchstart')
      var x = e.offsetX
      // 获取y 坐标
      var y = e.offsetY
      console.log('x: ' + x + ', y: ' + y)
      // 创建对象
      var img = new Image()
      // 改变图片的src
      img.src = this.imageUrl
      // 打印
      var _this = this
      img.onload = function() {
        var xFloat = parseFloat(x)
        var yFloat = parseFloat(y)
        _this.updateImage(
          (img.width * xFloat) / 800,
          (yFloat * img.width) / 800
        )
        // alert('width:' + img.width + ',height:' + img.height)
      }
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
  background-color: #23241f;
}
</style>
