<template>
  <el-dialog
    class="check-photo-dialog"
    title=""
    :visible="visible"
    :show-close="false"
    @close="onClose"
  >
    <div class="content">
      <div
        @click="checkLeft"
        class="left-arrow"
      >
        <i class="icon-left-arrow"></i>
      </div>
      <div
        @click="checkRight"
        class="right-arrow"
      >
        <i class="icon-right-arrow"></i>
      </div>
      <img
        :src="photos[curIndex].path"
        alt=""
      />
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
      if (this.curIndex >= 1) {
        --this.curIndex;
      } else {
        this.curIndex = this.photos.length - 1;
      }
    },
    checkRight() {
      if (this.curIndex < this.photos.length - 1) {
        ++this.curIndex;
      } else {
        this.curIndex = 0;
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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 570px;
      overflow: hidden;
      img {
        height: auto;
        width: 100%;
      }
      .left-arrow,
      .right-arrow {
        cursor: pointer;
        position: absolute;
        height: 40px;
        width: 40px;
        background: rgba(66, 66, 66, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
      }
      .left-arrow {
        left: 10px;
      }
      .right-arrow {
        right: 10px;
      }
    }
  }
}
</style>
