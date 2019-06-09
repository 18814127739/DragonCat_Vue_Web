<template>
  <el-dialog
    class="edit-base-info"
    title="基本信息"
    :close-on-click-modal="false"
    :visible="visible"
    width="50%"
    @close="onClose"
  >
    <el-form :model="data" :rules="rules" label-width="80px">
      <div class="row">
        <el-form-item label="姓名" prop="name">
          <el-input size="mini" maxlength="10" v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            size="mini"
            v-model="data.age"
            controls-position="right"
            :min="1"
            :max="200"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="驻地" prop="region">
          <el-input size="mini" maxlength="10" v-model="data.region" placeholder="北京"></el-input>
        </el-form-item>
        <el-form-item label="工作年限" prop="workYears">
          <el-select size="mini" v-model="data.workYears" placeholder="请选择">
            <el-option
              v-for="item in workYearsData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="联系方式" prop="phoneNo">
          <el-input v-model="data.phoneNo" size="mini" maxlength="11" placeholder="11位手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="data.email" size="mini"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="个性签名">
        <el-input
          type="textarea"
          rows="3"
          maxlength="100"
          placeholder="1-100字"
          v-model="data.signature"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="onClose">取 消</el-button>
      <el-button type="primary" size="mini" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "@services";

export default {
  props: {
    visible: Boolean,
    baseInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    baseInfo: function(value) {
      this.data = { ...value };
    }
  },
  mounted() {
    this.getWorkYearsData();
  },
  data() {
    return {
      workYearsData: [],
      data: {},
      rules: {
        name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        age: [
          {
            required: true,
            message: "请填写年龄",
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: "请填写驻地",
            trigger: "blur"
          }
        ],
        workYears: [
          {
            required: true
          }
        ],
        phoneNo: [
          {
            required: true,
            message: "请填写联系方式",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请填写邮箱",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getWorkYearsData() {
      const res = await api.getWorkYearsData();
      this.workYearsData = res;
    },
    async onConfirm() {
      if (!this.isValid(this.data)) {
        return;
      }
      const params = {
        type: "baseInfo",
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
      if (
        !(
          data.name &&
          data.age &&
          data.region &&
          data.workYears &&
          data.phoneNo &&
          data.email
        )
      ) {
        this.$message({
          type: "warning",
          message: "请完善必填信息"
        });
        return false;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(data.phoneNo)) {
        this.$message({
          type: "warning",
          message: "请填写正确的手机号"
        });
        return false;
      }
      const emailReg = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
      if (!emailReg.test(data.email)) {
        this.$message({
          type: "warning",
          message: "邮箱地址格式不正确"
        });
        return false;
      }
      return true;
    },
    onClose: function() {
      (this.data = { ...this.baseInfo }), this.$emit("onClose");
    }
  }
};
</script>

<style lang="less">
.edit-base-info {
  .el-dialog {
    margin-top: 12vh !important;
  }
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 430px;
    overflow: auto;

    .el-select {
      width: 100%;
    }

    .el-input-number {
      width: 100%;
      .el-input__inner {
        text-align: left;
      }
    }
  }
  .row {
    display: flex;
    .el-form-item {
      flex: 1;
    }
  }
}
</style>