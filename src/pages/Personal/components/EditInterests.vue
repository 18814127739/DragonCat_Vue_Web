<template>
  <el-dialog
    class="edit-interests"
    title="兴趣爱好"
    :visible="visible"
    width="30%"
    @close="onClose"
  >
    <div class="row">
      <div class="name">兴趣</div>
      <div class="degree">喜欢指数</div>
      <i
        class="el-icon-plus"
        @click="onAdd"
      />
    </div>
    <div
      class="row"
      v-for="(item,index) in data"
      :key="index"
    >
      <div class="name">
        <el-input
          size="mini"
          maxlength="30"
          placeholder="1-20字"
          v-model="item.name"
        ></el-input>
      </div>
      <div class="degree">
        <el-slider
          :min="10"
          v-model="item.degree"
        ></el-slider>
      </div>
      <i
        class="el-icon-delete"
        @click="onRemove($event, index)"
      />
    </div>
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
    onAdd() {
      this.data.push({});
    },
    onRemove(e, index) {
      this.data.splice(index, 1);
    },
    async onConfirm() {
      if (!this.isValid()) {
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
    isValid() {
      let flag = true;
      this.data.forEach(item => {
        if (!item.name || !item.degree) {
          this.$message({
            type: "warning",
            message: "请完善兴趣信息"
          });
          flag = false;
        } else if (!/^[1-9][0-9]{0,2}$/.test(item.degree)) {
          this.$message({
            type: "warning",
            message: "请输入1~999的正整数"
          });
          flag = false;
        }
      });
      return flag;
    },
    onClose() {
      // 重新初始化数据
      this.data = this.interests.map(item => ({ ...item }));
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
    padding: 6px;
    .name {
      flex: 4;
    }
    .degree {
      margin-left: 12px;
      flex: 4;
    }
    .el-icon-plus,
    .el-icon-delete {
      flex: 1;
      text-align: right;
      cursor: pointer;
    }
    .el-icon-delete {
      opacity: 0;
      transition: opacity 0.7s;
    }
    &:hover {
      .el-icon-delete {
        opacity: 1;
      }
    }
  }
}
</style>
