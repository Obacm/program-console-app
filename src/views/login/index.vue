<template>
  <div class="container">
    <div class="main">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" v-bind="layout">
        <a-form-model-item>
          <a-input
            v-model="form.mobilePhone"
            type="text"
            placeholder="请输入账号"
            autocomplete="off"
            prop="mobilePhone"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="off"
            prop="password"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" block @click="onSubmit">
            登陆
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="footer">
      Copyright©2020 Obacm
    </div>
  </div>
</template>
<script>
import { login } from '@/api'
import md5 from 'js-md5'

export default {
  name: 'login',
  data() {
    return {
      form: {
        mobilePhone: '',
        password: ''
      },
      rules: {
        mobilePhone: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 24 }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.form.password = md5(this.form.password)
          let response = await login(this.form)
          if (response.code == 200) {
            this.$router.push('/')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #f0f2f5 url(../../assets/background.a568162c.svg) no-repeat 50%;
  background-size: 100%;
  text-align: center;

  .main {
    min-width: 260px;
    width: 300px;
    margin: 0 auto;
    padding-top: 200px;
  }
  .footer {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
