<template>
  <el-dialog
    class="edit-interests"
    title="兴趣爱好"
    :visible="visible"
    width="50%"
    @close="onClose"
  >
    <div class="row">
      <div>兴趣</div>
      <div>喜欢指数</div>
      <i class="el-icon-plus" />
    </div>
    <el-form
      v-for="(item,index) in data"
      :key="index"
      :model="item"
      label-width="60px"
    >
      <div class="row">
        <el-form-item
          label=""
          prop="major"
        >
          <el-input
            size="mini"
            maxlength="30"
            placeholder="不超过20字"
            v-model="item.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            size="mini"
            v-model="item.degree"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="onClose"
      >取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="onConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from "@services";

export default {
  props: {
    visible: Boolean,
    interests: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      data: []
    };
  },
  watch: {
    interests: function(value) {
      this.data = value.map(item => ({ ...item }));
    }
  },
  methods: {
    async onConfirm() {
      if (!this.isValid(this.data)) {
        return;
      }
      const params = {
        userId: this.$store.state.userInfo._id,
        type: "interests",
        data: this.data
      };
      await api.updateHomePageInfo(params);
      this.$message({
        type: "success",
        message: "信息修改成功"
      });
      this.$emit("refreshInfo");
      this.$emit("onClose");
    },
    isValid(data) {
      if (!(data.university && data.major && data.beginDate && data.endDate)) {
        this.$message({
          type: "warning",
          message: "请完善必填信息"
        });
        return false;
      }
      if (Date.parse(data.beginDate) > Date.parse(data.endDate)) {
        this.$message({
          type: "warning",
          message: "入学时间不得早于毕业时间"
        });
        return false;
      }
      return true;
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>
<style lang="less">
.edit-interests {
  .el-dialog {
    margin-top: 12vh !important;
  }
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 430px;
    overflow: auto;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form-item {
      flex: 1;
    }
  }
}
</style>
