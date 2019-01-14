<template>
  <PageContainer>
    <div class="personal-page">
      <div class="skills">
        <p>专业技能</p>
        <ul>
          <li
            v-for="item in skills"
            :key="item._id"
          >
            <div class="name">
              {{item.name}}
            </div>
            <div class="line">
              <div
                class="cover"
                :style="{width:`${item.degree}%`}"
              ></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="introduction">
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import api from "@services";

export default {
  data() {
    return {
      skills: [
        { _id: 0, name: "javascript", degree: 82 },
        { _id: 1, name: "http", degree: 76 },
        { _id: 2, name: "es6", degree: 73 },
        { _id: 3, name: "css", degree: 73 },
        { _id: 4, name: "react", degree: 73 },
        { _id: 5, name: "vue", degree: 68 },
        { _id: 6, name: "node.js", degree: 68 },
        { _id: 7, name: "mongodb", degree: 68 },
        { _id: 8, name: "webpack", degree: 68 },
        { _id: 9, name: "java", degree: 58 }
      ]
    };
  },
  mounted() {
    this.getHomePageInfo();
  },
  methods: {
    async getHomePageInfo() {
      const params = {
        userId: this.$store.state.userInfo._id
      };
      const res = await api.getHomePageInfo(params);
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 16px 32px 46px;
  display: flex;
  color: #3e3e3e;
  .skills {
    p {
      margin-top: 0;
      font-size: 16px;
      font-weight: bold;
    }
    width: 280px;
    border: 1px solid #3e3e3e;
    border-radius: 12px;
    padding: 12px 20px 20px;
    ul {
      li {
        margin-top: 12px;
        .name {
          color: #3e3e3e;
          margin-left: 2px;
        }
        .line {
          margin-top: 4px;
          height: 14px;
          background: rgba(94, 94, 94, 0.8);
          .cover {
            height: 100%;
            width: 60%;
            background: -webkit-gradient(
              linear,
              left 0,
              right 0,
              from(#fff0f5),
              to(#bfefff)
            );
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    .introduction {
      // background: url("../assets/imgs/pics/bg1.png") no-repeat center center /
      //   cover;
      width: 800px;
      height: 80vh;
      border-radius: 12px;
      .name {
      }
    }
  }
}
</style>

