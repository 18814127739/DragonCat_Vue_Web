<template>
  <PageContainer>
    <div class="edit-project-exp">
      <div class="wrap">
        <div class="title">
          <h3>项目经验</h3>
          <el-button
            type="primary"
            size="mini"
            @click="onAdd"
          >添加</el-button>
        </div>
        <div
          class="project-item"
          v-for="(item,index) in projects"
          :key="index"
        >
          <div class="item-bar">
            <span>{{`项目${index + 1}`}}</span>
            <i
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
                <el-input
                  size="mini"
                  maxlength="20"
                  placeholder="不超过20字"
                  v-model="item.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="担任岗位">
                <el-input
                  size="mini"
                  maxlength="20"
                  placeholder="不超过20字"
                  v-model="item.position"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="参与时间">
              <el-date-picker
                v-model="item.date"
                type="daterange"
                size="mini"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="项目描述">
              <el-input
                type="textarea"
                maxlength="200"
                placeholder="不超过200字"
                v-model="item.description"
              ></el-input>
            </el-form-item>
            <el-form-item label="主要工作">
              <el-input
                type="textarea"
                maxlength="200"
                placeholder="不超过200字"
                v-model="item.task"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-form label-width="80px">
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              size="mini"
            >提交</el-button>
            <el-button
              size="mini"
              @click="goBack"
            >返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </PageContainer>
</template>
<script>
import api from "@services";

export default {
  data() {
    return {
      projects: []
    };
  },
  mounted() {
    this.getProjectExp();
  },
  watch: {},
  methods: {
    async getProjectExp() {
      const params = {
        userId: this.$store.state.userInfo._id
      };
      const res = await api.getHomePageInfo(params);
      this.projects = res.projectExp.map(item => ({
        ...item,
        date: [item.beginDate, item.endDate]
      }));
      if (this.projects.length === 0) {
        this.projects.push({});
      }
    },
    onAdd() {
      this.projects.push({});
    },
    onRemove(e, index) {
      this.projects.splice(index, 1);
    },
    async onSubmit() {
      if (!this.isValid(this.projects)) {
        return;
      }
      const projectExp = this.projects.map(item => ({
        ...item,
        beginDate: item.date[0],
        endDate: item.date[1]
      }));
      const params = {
        userId: this.$store.state.userInfo._id,
        type: "projectExp",
        data: projectExp
      };
      await api.updateHomePageInfo(params);
      this.$message({
        type: "success",
        message: "信息修改成功"
      });
      this.$router.replace({ name: "personal-page" });
    },
    isValid(projects) {
      let flag = true;
      const inValidProject = [];
      projects.forEach((item, index) => {
        if (
          !(
            item.name &&
            item.position &&
            item.description &&
            item.task &&
            item.date.length === 2
          )
        ) {
          flag = false;
          inValidProject.push(`项目${index + 1}`);
        }
      });
      if (!flag) {
        this.$message({
          type: "warning",
          message: `请完善${inValidProject.join(",")}的信息`
        });
      }
      return flag;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.edit-project-exp {
  display: flex;
  justify-content: center;
  padding: 16px 32px 46px;
  .wrap {
    width: 640px;
    .title {
      display: flex;
      align-items: center;
      h3 {
        width: 80px;
      }
    }
    .project-item {
      padding-bottom: 12px;
      .el-form-item {
        margin-bottom: 12px;
      }
      .item-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
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
