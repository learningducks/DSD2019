<template>
  <el-form
    :model="loginForm"
    :rules="rules"
    ref="loginForm"
    label-position="right"
    label-width="0px"
    class="login-container"
  >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        type="text"
        placeholder="用户名"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        auto-complete="off"
        placeholder="密码"
      ></el-input>
    </el-form-item>
    <el-checkbox v-model="remember" disabled class="remember">
      记住密码
    </el-checkbox>
    <el-form-item style="width: 100%;">
      <el-button
        type="primary"
        plain
        :loading="loading"
        style="width: 100%;"
        @click="lgoin"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { requestLogin } from '@/api/api';
import md5 from 'js-md5';

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
        ],
      },
      remember: false,
      loading: false,
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const loginParams = { UID: this.loginForm.username, password: md5(`${this.loginForm.password}helloworld`) };
          requestLogin(loginParams).then((data) => {
            this.loading = false;
            const { status, msg, userinfo } = data;
            // eslint-disable-next-line eqeqeq
            if (status != 0) {
              this.$message({
                message: msg,
                type: 'error',
              });
            } else {
              sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
              this.$router.push('Home');
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
