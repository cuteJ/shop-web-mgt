<template>
  <div class="errPage-container">
    <div class="page-back">
      <el-button icon="el-icon-arrow-left" class="back-btn" @click="back">{{$t('table.back')}}</el-button>
    </div>
    <div class="errPage-content">
      <div>
        <svg-icon
          icon-class="401_Error"
          class-name="error-icon"
        />
        <h2>{{$t('views.errorPage.msg_401')}}</h2>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/dashboard">{{$t('views.errorPage.goHome')}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Page401',
    data() {
      return {}
    },
    methods: {
      back() {
        if (this.$route.query.noGoBack) {
          this.$router.push({path: '/dashboard'})
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .errPage-container {
    position: relative;

    .back-btn {
      border: none;
    }
  }

  .page-back {
    position: absolute;
    left: 50px;
    top: 50px;
  }

  .errPage-content {
    text-align: center;
    max-width: 100%;
    padding: 100px;
    margin: 0 auto;

    .error-icon {
      width: 300px;
      height: 300px;
      font-size: 100px;
    }
  }

  .list-unstyled {
    list-style: none;
  }
</style>
