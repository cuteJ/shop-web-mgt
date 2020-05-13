<template>
  <div class="index-box"
       v-bind:style="{ backgroundImage: indexBg }">
    <div
      v-if="!loginPage"
      class="index-container">
      <div class="login-logo">
        <img src="@/assets/login_images/logo.png"/>
      </div>

      <div class="to-login-btn">
        <el-button
          class="login-btn shake"
          type="primary"
          @click.native.prevent="toLogin"
        >{{ $t('login.logIn') }}
        </el-button>
      </div>

    </div>
    <div v-else class="login-container">

      <div class="login-close" @click="closeLogin">
        <img src="@/assets/login_images/close.png">
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            @keyup.enter.native="handleLogin"
          />
          <div class="input-line"></div>
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input
            :type="passwordType"
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
            name="password"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
          <svg-icon :icon-class="eyeClass"/>
        </span>
          <div class="input-line"></div>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          class="login-btn shake"
          @click.native.prevent="handleLogin"
        >{{ $t('login.logIn') }}
        </el-button>

      </el-form>
    </div>
    <div class="footer">
      Copyright©2020 icutej.com. All rights reserved.
    </div>
  </div>
</template>

<script>
  import {validatorUsername, validatorPassword} from '@/utils/validatorForm'
  import LangSelect from '@/components/LangSelect'

  export default {
    name: 'Login',
    components: {LangSelect},
    data() {
      return {
        loginPage: true,
        indexBg: 'url(/static/images/login-bg.png)',
        loginForm: {
          username: 'admin',
          password: '123123'
        },
        loginRules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorUsername
            }
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorPassword
            }
          ]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        redirect: undefined,
        eyeClass: 'eye-close'
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.eyeClass = 'eye-open'
          this.passwordType = ''
        } else {
          this.eyeClass = 'eye-close'
          this.passwordType = 'password'
        }
      },
      toLogin() {
        this.loginPage = true;
        this.indexBg = 'url(/static/images/login-bg@2x.png)'
      },
      closeLogin() {
        this.loginPage = false;
        this.indexBg = 'url(/static/images/bg.png)'
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('Login', this.loginForm)
              .then(() => {
                this.$router.push(
                  {path: this.redirect || '/'},
                  () => {
                    this.loading = false
                  },
                  () => {
                    this.loading = false
                  }
                )
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */

  $bg: #fff;
  $light_gray: #F2F6FC;

  @supports (-webkit-mask: none) and (not (cater-color: $light_gray)) {
    .login-container .el-input input {
      color: $light_gray;

      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        -webkit-appearance: none;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $light_gray;
        border: none;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $light_gray !important;
        }
      }
    }

    .el-form-item {
      position: relative;
      border: none;
    }

    .el-form-item::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: #409EFF;

      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform .5s ease-out;
    }

    .el-form-item:hover::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #fff;
  $light_gree: #4cc2b0;
  $btn_bg: #409EFF;

  .footer {
    position: absolute;
    bottom: 10px;
    text-align: center;
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(244, 244, 244, 1);
    line-height: 20px;
  }

  .index-box {
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url('/static/images/bg.png')
  }

  .index-container {
    .login-logo {
      position: absolute;
      left: 46px;
      top: 54px;
      width: 25%;
      height: 35px;

      img {
        height: 48px;
      }
    }

    .to-login-btn {
      position: absolute;
      right: 111px;
      top: 54px;
      width: 120px;
    }

    .login-btn {
      border-radius: 8px;
    }
  }

  .login-container {

    .input-line {
      width: 100%;
      height: 1px;
      background-color: #979797;
    }

    .login-close {
      cursor: pointer;
      position: absolute;
      top: 35px;
      right: 46px;

      img {
        width: 28px;
        height: 28px;
      }
    }

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 450px;
      max-width: 100%;
      padding: 35px 40px 15px 40px;
      margin: 120px auto;
      border-radius: 3px;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $light_gray;
      vertical-align: middle;
      width: 50px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        background: transparent;

        width: 96px;
        height: 33px;
        font-size: 24px;
        color: rgba(245, 247, 250, 1);
        line-height: 33px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $light_gray;
      cursor: pointer;
      user-select: none;
    }

    .login-btn {
      margin-top: 30px;
      width: 100%;
      height: 45px;
      background: $btn_bg;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(245, 247, 250, 1);
      line-height: 28px;
    }
  }
</style>
