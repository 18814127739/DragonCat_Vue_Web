<template>
  <PageContainer>
    <div class="personal-page">
      <div class="left">
        <div class="skills">
          <p>专业技能</p>
          <ul>
            <li
              v-for="item in data.skills"
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
      data: {
        skills: []
      },
      skills: [
        { name: "javascript", degree: 83 },
        { name: "http", degree: 77 },
        { name: "es6", degree: 74 },
        { name: "css", degree: 74 },
        { name: "react", degree: 74 },
        { name: "vue", degree: 69 },
        { name: "node.js", degree: 69 },
        { name: "mongodb", degree: 69 },
        { name: "webpack", degree: 69 },
        { name: "java", degree: 58 }
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
      this.data = res;
    }
  }
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 16px 32px 46px;
  display: flex;
  color: #3e3e3e;
  .left {
    padding: 8px;
    border-radius: 15px;
    // background: #bfefff;
    background: rgba(191, 239, 255, 0.9);
    .skills {
      z-index: 1;
      background: white;
      p {
        margin-top: 0;
        font-size: 16px;
        font-weight: bold;
      }
      width: 280px;
      // border: 1px solid #3e3e3e;
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
                from(#eed2ee),
                to(#ee82ee)
              );
              // background: #bfefff;s
            }
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

