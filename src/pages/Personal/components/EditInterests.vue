<template>
  <el-dialog
    class="edit-project-exp"
    title="项目经验"
    :visible="visible"
    width="50%"
    @close="onClose"
  >
    <div
      class="project-item"
      v-for="(item,index) in projects"
      :key="index"
    >
      <div class="title">
        <span>{{`项目${index + 1}`}}</span>
        <i
          v-if="index !== 0"
          class="el-icon-delete"
          @click="onRemove($event, index)"
        ></i>
      </div>
      <el-form
        :model="item"
        label-width="80px"
      >
        <div class="row">
          <el-form-item label="项目名称">
            <div class="row">
              <el-input
                size="mini"
                v-model="item.name"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="担任岗位">

            <el-input
              size="mini"
              v-model="item.position"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="参与时间">
          <el-date-picker
            v-model="item.date"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            type="textarea"
            v-model="item.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="主要工作">
          <el-input
            type="textarea"
            v-model="item.task"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="onAdd"
      >添加</el-button>
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
const initProjectInfo = {
  name: "",
  position: "",
  description: "",
  task: "",
  beginDate: "",
  endDate: ""
};

export default {
  props: {
    visible: Boolean,
    projectExp: {
      type: Array,
      default: function() {
        return [initProjectInfo];
      }
    }
  },
  data() {
    return {
      projects: this.projectExp.map(item => ({
        ...item,
        date: [item.beginDate, item.endDate]
      }))
    };
  },
  methods: {
    onAdd() {
      this.projects.push(initProjectInfo);
    },
    onRemove(e, index) {
      this.projects.splice(index, 1);
    },
    onConfirm() {
      console.log(this.projects);
      this.$emit("onClose");
    },
    onClose() {
      this.$emit("onClose");
    }
  }
};
</script>
<style lang="less">
.edit-project-exp {
  .el-dialog {
    margin-top: 10vh !important;
    .el-dialog__body {
      padding: 10px 20px;
      max-height: 460px;
      overflow: auto;
    }
    .project-item {
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 12px;
      }
      .title {
        display: flex;
        justify-content: space-between;
        span {
          color: #3e3e3e;
          font-size: 14px;
          font-weight: bold;
          line-height: 24px;
        }
        .el-icon-delete {
          cursor: pointer;
        }
      }
      .row {
        display: flex;
        .el-form-item {
          flex: 1;
        }
      }
    }
  }
}
</style>
