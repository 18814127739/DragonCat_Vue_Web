<template>
  <el-dialog
    class="verify-dialog"
    width="400px"
    title="身份校验"
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
  >
    <div class="input-group">
      <label>请输入密码：</label>
      <el-input v-model="password" size="small" type="password" @keyup.enter.native="onConfirm"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="onCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "@services";

export default {
  data() {
    return {
      password: ""
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async onConfirm() {
      await api.checkPhotoVerify({ pwd: this.password });
      localStorage.setItem("isPassVerify", "Y");
      this.visible = false;
    },
    onCancel() {
      this.$router.go(-1);
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>

<style lang="less">
.verify-dialog {
  .el-dialog {
    .input-group {
      display: flex;
      align-items: center;
      .el-input {
        margin-left: 5px;
        width: 270px !important;
      }
    }
  }
}
</style>
