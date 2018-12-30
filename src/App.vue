<template>
  <div class="page-wrap">
    <PageBar />
    <router-view></router-view>
    <PageFooter />
  </div>
</template>
<script>
export default {
  name: "app",
  methods: {}
};
</script>

<style lang="less" scoped>
.page-wrap {
  position: relative;
  min-height: 100%;
  background: white;
}
</style>


