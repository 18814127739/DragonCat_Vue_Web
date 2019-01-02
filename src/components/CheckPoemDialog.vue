<template>
  <el-dialog
    class="check-poem-dialog"
    width="500px"
    :title="poem.title"
    :visible="visible"
    :show-close="false"
    @close="onClose"
  >
    <div class="content">
      <div class="author">
        <span>{{poem.author}}</span>
        <span class="date">{{date}}</span>
      </div>
      <div class="word">
        <p
          v-for="(item,index) in poem.content"
          :key="index"
        >{{item}}</p>
      </div>
      <div class="imgs">
        <div
          class="img-wrap"
          v-for="(img,index) in poem.imgs"
          :key="index"
        >
          <img :src="img.url" />
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >

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
    margin-top: 12vh !important;
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
      span {
        margin: 0 6px;
      }
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
        max-height: 350px;
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: 20px;
        p {
          margin-bottom: 12px;
          margin-top: 0;
        }
      }
    }

    .imgs {
      display: flex;
      justify-content: center;
      .img-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.15);
        margin: 0 6px;
        width: 80px;
        height: 80px;
        overflow: hidden;
        img {
          width: auto;
          height: 100%;
        }
      }
    }
  }
}
</style>
