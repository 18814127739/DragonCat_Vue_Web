<template>
  <PageContainer>
    <div class="edit-awards">
      <div class="wrap">
        <div class="title">
          <h3>奖项情况</h3>
          <el-button
            type="primary"
            size="mini"
            @click="onAdd"
          >添加</el-button>
        </div>
        <div
          class="award-item"
          v-for="(item,index) in awards"
          :key="index"
        >
          <div class="item-bar">
            <span>{{`奖项${index + 1}`}}</span>
            <i
              class="el-icon-delete"
              @click="onRemove($event, index)"
            ></i>
          </div>
          <el-form
            :model="item"
            label-width="80px"
          >
            <el-form-item label="奖项名称">
              <el-input
                size="mini"
                maxlength="20"
                placeholder="不超过20字"
                v-model="item.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="获奖时间">
              <el-date-picker
                v-model="item.date"
                type="daterange"
                size="mini"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <el-checkbox v-model="checked">时间段</el-checkbox>
            </el-form-item>
            <el-form-item label="获奖理由">
              <el-input
                type="textarea"
                maxlength="200"
                placeholder="不超过200字"
                v-model="item.description"
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
      awards: []
    };
  },
  mounted() {
    this.getAwards();
  },
  watch: {},
  methods: {
    async getAwards() {
      const params = {
        userId: this.$store.state.userInfo._id
      };
      const res = await api.getHomePageInfo(params);
      this.awards = res.awards;
      if (this.awards.length === 0) {
        this.awards.push({});
      }
    },
    onAdd() {
      this.awards.push({});
    },
    onRemove(e, index) {
      this.awards.splice(index, 1);
    },
    async onSubmit() {
      if (!this.isValid(this.awards)) {
        return;
      }
      const params = {
        userId: this.$store.state.userInfo._id,
        type: "awards",
        data: this.awards
      };
      await api.updateHomePageInfo(params);
      this.$message({
        type: "success",
        message: "信息修改成功"
      });
      this.$router.replace({ name: "personal-page" });
    },
    isValid(awards) {
      let flag = true;
      const inValidAward = [];
      awards.forEach((item, index) => {
        if (!(item.name && item.date && item.date.length > 0)) {
          flag = false;
          inValidAward.push(`奖项${index + 1}`);
        }
      });
      if (!flag) {
        this.$message({
          type: "warning",
          message: `请完善${inValidAward.join(",")}的信息`
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
.edit-awards {
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
    .award-item {
      padding-bottom: 12px;
      .el-form-item {
        margin-bottom: 12px;
        .el-input {
          width: 250px;
        }
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
          opacity: 0;
          transition: opacity 0.7s;
        }
      }
      &:hover {
        .item-bar {
          .el-icon-delete {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
