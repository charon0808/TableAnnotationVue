<template>
  <div class="login">
    <div class="input">
      <input type="text" v-model="name" />
      <span v-if="error.name" class="err-msg">{{error.name}}</span>
    </div>
    <div class="input">
      <button @click="login">提交</button>
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
        // 设置Vuex登录标志为true，默认userLogin为false
        this.$store.dispatch('userLogin', true)
        // Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
        // 我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
        localStorage.setItem('Flag', 'isLogin')
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
</style>
