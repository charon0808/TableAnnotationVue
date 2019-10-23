<template>
  <div>
    <div class="login">
      <div class="input">
        <input type="text" v-model="name" />
        <span v-if="error.name" class="err-msg">{{error.name}}</span>
      </div>
      <div class="input">
        <button @click="login">提交</button>
      </div>
    </div>
    <div class="hli">
      <span>在标注前你应该仔细阅读：</span>
      <ol>
        <li>
          首先确认当前的图片是否是我们能够标注的图片，不是的类型你应该点击换一张图片
          <ul>
            <li>需要我们标注的图片是能够转化为表格表示的</li>
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
      <span>阅读完成后在上面输入你的名字开始吧</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GLOBAL from '@/components/GlobalVar.js'
export default {
  data() {
    return {
      name: '',
      error: {
        name: ''
      }
    }
  },

  methods: {
    async check(name) {
      if (!name) {
        this.error.name = '请输入姓名'
        return false
      }
      var ret
      await axios
        .get(GLOBAL.backendIP + GLOBAL.checkUsername, {
          params: {
            username: name
          }
        })
        .then(response => {
          console.log(response)
          ret = response.data
        })
        .catch(error => {
          this.tips = '请检查网络连接'
          console.log(error)
          return false
        })
      return ret
    },
    async login() {
      var checkRet = await this.check(this.name)
      console.log('hah: ' + checkRet)
      if (checkRet === true) {
        localStorage.setItem('userAccessToken', this.name)
        this.$router.push({ name: 'imageMain' })
      } else {
        this.error.name = '你还没有注册，联系管理员'
      }
    }
  }
}
</script>

<style>
.login {
  width: 300px;
  margin: 10% auto;
}
.hli {
  text-align: center;
  text-align: left;
}
</style>
