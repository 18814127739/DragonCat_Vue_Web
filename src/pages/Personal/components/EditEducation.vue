<template>
  <el-dialog
    class="edit-education"
    title="教育背景"
    :visible="visible"
    width="50%"
    @close="onClose"
  >
    <el-form
      :model="data"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item
        label="大学名称"
        prop="university"
      >
        <el-input
          size="mini"
          maxlength="30"
          placeholder="不超过30字"
          v-model="data.university"
        ></el-input>
      </el-form-item>
      <div class="row">
        <el-form-item
          label="就读专业"
          prop="major"
        >
          <el-input
            size="mini"
            maxlength="30"
            placeholder="不超过30字"
            v-model="data.major"
          ></el-input>
        </el-form-item>
        <el-form-item label="GPA">
          <el-input
            size="mini"
            v-model="data.GPA"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item
          label="入学时间"
          prop="beginDate"
        >
          <el-date-picker
            v-model="data.beginDate"
            size="mini"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="毕业时间"
          prop="endDate"
        >
          <el-date-picker
            v-model="data.endDate"
            size="mini"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="主修课程">
        <el-input
          type="textarea"
          rows="3"
          maxlength="200"
          placeholder="不超过200字"
          v-model="data.courses"
        ></el-input>
      </el-form-item>
      <el-form-item label="校内实践">
        <el-input
          type="textarea"
          rows="3"
          maxlength="200"
          placeholder="不超过200字"
          v-model="data.pratice"
        ></el-input>
      </el-form-item>
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
    education: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    education: function(value) {
      this.data = { ...value };
    }
  },
  data() {
    return {
      data: {},
      rules: {
        university: [
          { required: true, message: "请填写大学名称", trigger: "blur" }
        ],
        major: [
          {
            type: "string",
            required: true,
            message: "请填写就读专业",
            trigger: "blur"
          }
        ],
        beginDate: [
          {
            type: "date",
            required: true,
            message: "请填写入学时间",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请填写毕业时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async onConfirm() {
      if (!this.isValid(this.data)) {
        return;
      }
      const params = {
        userId: this.$store.state.userInfo._id,
        type: "education",
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
      let flag = true;
      if (!(data.university && data.major && data.beginDate && data.endDate)) {
        flag = false;
        this.$message({
          type: "warning",
          message: "请完善必填信息"
        });
      }
      return flag;
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>
<style lang="less">
.edit-education {
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
    .el-form-item {
      flex: 1;
    }
  }
}
</style>
