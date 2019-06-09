<template>
  <el-form
    :model="loginForm"
    :rules="rules"
    ref="loginForm"
    label-width="0px"
    class="login-container"
    status-icon
  >
    <h3 class="title">Sign in</h3>
    <el-form-item prop="username">
      <el-input
        v-model.number="loginForm.username"
        type="text"
        placeholder="username"
        :auto-complete="on"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        auto-complete="off"
        placeholder="password"
      ></el-input>
    </el-form-item>
    <el-checkbox v-model="remember" disabled class="remember">
      remember password
    </el-checkbox>
    <el-form-item style="width: 100%;">
      <el-button
        type="primary"
        native-type="submit"
        plain
        :loading="loading"
        style="width: 100%;"
        @click="login"
        >Sign in</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import md5 from 'js-md5';
import { requestLogin } from '@/utils';

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'please input username', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'please input password', trigger: 'blur' },
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
          const params = {
            user: this.loginForm.username,
            password: md5(`${this.loginForm.username}#${this.loginForm.password}`),
          };
          requestLogin(params).then((data) => {
            const { token, userinfo } = data;
            this.loading = false;
            this.$store.commit('setToken', token);
            this.$store.commit('setUserinfo', userinfo);
            this.$router.push({ path: '/home' });
            this.$message.success('login successfully');
          }).catch((err) => {
            this.loading = false;
            this.$message.error(err);
            console.log(err);
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
  background: whitesmoke;
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
