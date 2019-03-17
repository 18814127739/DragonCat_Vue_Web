<template>
  <el-dialog
    class="check-photo-dialog"
    title
    :visible="visible"
    :show-close="false"
    @close="onClose"
  >
    <div class="content">
      <div class="left-wrap" v-if="curIndex > 0">
        <div @click="checkLeft" class="left-arrow">
          <i class="icon-left-arrow"></i>
        </div>
      </div>
      <div class="right-wrap" v-if="curIndex < photos.length - 1">
        <div @click="checkRight" class="right-arrow">
          <i class="icon-right-arrow"></i>
        </div>
      </div>
      <img v-if="photos[curIndex]" :src="photos[curIndex].url" alt>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      curIndex: 0
    };
  },
  watch: {
    index: function(val) {
      this.curIndex = val;
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    photos: {
      type: Array,
      default: function() {
        return [];
      }
    },
    index: Number
  },
  methods: {
    checkLeft() {
      if (this.curIndex > 0) {
        if (this.curIndex === 1) {
          this.$message({
            type: "warning",
            message: "这是第一张图片了"
          });
        }
        --this.curIndex;
        // 同步更新父组件的curIndex, 否则下次点击同一张照片时由于父组件的curIndex没有改变
        // 不会触发watch事件，导致弹窗的照片显示不正确
        this.$emit("updateIndex", -1); 
      }
    },
    checkRight() {
      if (this.curIndex < this.photos.length - 1) {
        if (this.curIndex === this.photos.length - 2) {
          this.$message({
            type: "warning",
            message: "这是最后一张图片了"
          });
        }
        ++this.curIndex;
        this.$emit("updateIndex", 1);
      }
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>

<style lang="less">
.check-photo-dialog {
  .el-dialog {
    margin-top: 10vh !important;
    border-radius: 5px;
    background: white;
    .el-dialog__header {
      height: 0;
      padding: 0;
    }
    .el-dialog__body {
      padding: 4px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: auto;
      height: 570px;
      .left-wrap {
        position: fixed;
        align-self: flex-start;
        padding-left: 10px;
      }
      .right-wrap {
        position: fixed;
        align-self: flex-end;
        padding-right: 10px;
      }
      .left-arrow,
      .right-arrow {
        cursor: pointer;
        height: 40px;
        width: 40px;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        &:hover {
          background: rgba(255, 255, 255, 0.8);
        }
      }
      img {
        height: auto;
        width: 100%;
      }
    }
  }
}
</style>
