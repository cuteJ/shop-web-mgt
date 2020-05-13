<template>

  <div class="errPage-container">
    <div class="errPage-content">
      <div>
        <svg-icon
          icon-class="404_Error"
          class-name="error-icon"
        />
        <h2>{{$t('views.errorPage.msg_404')}}</h2>
        <a href="" class="el-button el-button--primary return-home">{{$t('views.errorPage.goHome')}}</a>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'Page404'
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

  .return-home {
    border-radius: 28px;
  }
</style>
