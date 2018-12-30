<template>
  <el-dialog
    class="check-poem-dialog"
    width="450px"
    :title="poem.title"
    :visible="visible"
    :show-close="false"
    @close="onClose"
  >
    <div class="content">
      <div class="author">{{poem.author}}</div>
      <div class="word">
        <p
          v-for="(item,index) in poem.content"
          :key="index"
        >{{item}}</p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div class="date">{{date}}</div>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    poem: Object
  },
  computed: {
    date() {
      return moment(this.poem.date).format("YYYY-MM-DD");
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>

<style lang="less">
.check-poem-dialog {
  .el-dialog {
    border-radius: 5px;
    background: -webkit-gradient(
      linear,
      left 0,
      right 0,
      from(#bfefff),
      to(#fff0f5)
    );
    .el-dialog__header {
      text-align: center;
      padding-top: 24px;
    }
    .el-dialog__body {
      padding: 2px 20px 12px;
    }

    .author {
      margin-bottom: 12px;
    }

    .content {
      text-align: center;
      .title {
        color: #6f6f6f;
        margin-bottom: 12px;
        font-size: 18px;
      }
      .word {
        font-size: 16px;
        min-height: 200px;
        max-height: 420px;
        overflow-x: hidden;
        overflow-y: auto;
        p {
          margin-bottom: 12px;
          margin-top: 0;
        }
      }
    }

    .date {
      text-align: right;
      margin-top: 12px;
    }
  }
}
</style>
