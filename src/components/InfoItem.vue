<template>
  <div class="info-item">
    <div class="title-item">
      <div class="icon-wrap bg-eed2ee-bfefff"><i :class="iconClass"></i></div>
      <div class="title-wrap bg-eed2ee-bfefff">
        <div class="title">
          {{title}}
          <i class="el-icon-edit"></i>
        </div>
      </div>
    </div>
    <div class="content-item">
      <slot></slot>
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
.info-item {
  margin-top: 30px;
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
        position: relative;
        background: white;
        height: 100%;
        z-index: 1;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        .el-icon-edit {
          position: absolute;
          cursor: pointer;
          right: 0;
          opacity: 0;
          transition: opacity 0.7s;
          &:hover {
            // color: #9b30ff;
          }
        }
      }
    }
  }
  &:hover {
    .title-item {
      .title-wrap {
        .el-icon-edit {
          opacity: 1;
        }
      }
    }
  }
}
</style>
