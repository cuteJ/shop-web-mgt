<template>
  <div class="app-container">
    <div class="page_blank">
      <div class="page_img">
        <svg-icon
          icon-class="404_Error"
          class-name="error-icon"
        />
      </div>
      <div class="page_desc">
        {{$t('views.errorPage.msg_blank_404')}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'blank'
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/mixins/shadow";

  .page_blank {
    padding-top: 100px;
    height: 500px;
    margin: 0 auto;
    text-align: center;
  }

  .page_desc {
    line-height: 48px;
    color: $text-color;
  }

  .error-icon {
    width: 300px;
    height: 300px;
    font-size: 100px;
  }
</style>
