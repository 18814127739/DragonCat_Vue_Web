<template>
  <el-dialog
    class="check-photo-dialog"
    title=""
    :visible="visible"
    :show-close="false"
    @close="onClose"
  >
    <div class="content">
      <div class="left-wrap">
        <div
          @click="checkLeft"
          class="left-arrow"
        >
          <i class="icon-left-arrow"></i>
        </div>
      </div>
      <div class="right-wrap">
        <div
          @click="checkRight"
          class="right-arrow"
        >
          <i class="icon-right-arrow"></i>
        </div>
      </div>
      <img
        v-if="photos[curIndex]"
        :src="photos[curIndex].url"
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
