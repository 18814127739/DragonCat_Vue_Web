<template>
  <div class="title-item">
    <div class="icon-wrap bg-eed2ee-bfefff"><i :class="iconClass"></i></div>
    <div class="title-wrap bg-eed2ee-bfefff">
      <div class="title">{{title}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    iconClass: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
.title-item {
  display: flex;
  .icon-wrap {
    height: 30px;
    width: 30px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }
  .title-wrap {
    flex: 1;
    padding-bottom: 1px;
    .title {
      color: #3e3e3e;
      display: flex;
      background: white;
      height: 100%;
      z-index: 1;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
