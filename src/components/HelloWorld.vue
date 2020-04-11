<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <span>svg图标：</span>
      <svg-icon icon-class="edit" />
      <span style="padding: 5px;"></span>
      <svg-icon icon-class="form" />
    </div>
    <div style="margin-top: 15px;">
      <button @click="testSubmit">测试发送请求</button>
    </div>
    <div class="test-mixin"></div>
  </div>
</template>

<script>
import { getArticleList } from '@/api/test'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    testSubmit() {
      getArticleList().then(res => {
        alert(res.msg)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "@/styles/mixin.scss";

  .test-mixin {
    margin-top: 15px;
    @include triangle('bottom')
  }
</style>
