<template>
  <PageContainer>
    <div class="personal-page">
      <div class="left">
        <div class="baseInfo">
          <p>{{this.$store.state.userInfo.userName}}</p>
          <div class="motto">座右铭：以积极的心态面对困难，用坚定的决心迎接挑战。</div>
        </div>
        <div class="info-item">
          <div class="title-item">
            <div class="icon-wrap"><i class="icon-education"></i></div>
            <div class="title-wrap">
              <div class="title">教育背景</div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="title-item">
            <div class="icon-wrap"><i class="icon-project-exp"></i></div>
            <div class="title-wrap">
              <div class="title">项目经验</div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="title-item">
            <div class="icon-wrap"><i class="icon-award"></i></div>
            <div class="title-wrap">
              <div class="title">获奖情况</div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="title-item">
            <div class="icon-wrap"><i class="icon-interest"></i></div>
            <div class="title-wrap">
              <div class="title">兴趣爱好</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
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
    </div>
  </PageContainer>
</template>

<script>
import api from "@services";

export default {
  data() {
    return {
      data: {
        skills: [],
        education: {}
      }
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
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 16px 32px 46px;
  display: flex;
  justify-content: center;
  color: #3e3e3e;
  .left {
    padding: 12px 20px;
    width: 560px;
    margin-right: 50px;
    .baseInfo {
      p {
        margin-top: 8px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .info-item {
      margin-top: 30px;
      .title-item {
        display: flex;
        .icon-wrap {
          height: 30px;
          width: 30px;
          border-radius: 15px;
          background: -webkit-gradient(
            linear,
            left 0,
            right 0,
            from(#eed2ee),
            to(#bfefff)
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .title-wrap {
          flex: 1;
          margin-left: 8px;
          padding-bottom: 1px;
          background: -webkit-gradient(
            linear,
            left 0,
            right 0,
            from(#eed2ee),
            to(#bfefff)
          );
          .title {
            display: flex;
            background: white;
            height: 100%;
            z-index: 1;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .right {
    padding: 8px;
    border-radius: 15px;
    background: -webkit-gradient(
      linear,
      left 0,
      right 0,
      to(#eed2ee),
      from(#bfefff)
    );
    .skills {
      z-index: 1;
      background: white;
      width: 280px;
      border-radius: 12px;
      padding: 12px 20px 20px;
      p {
        margin-top: 0;
        font-size: 16px;
        font-weight: bold;
      }
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
                to(#bfefff)
              );
              // background: #bfefff;
            }
          }
        }
      }
    }
  }
}
</style>