<template>
  <PageContainer>
    <div class="personal-page">
      <div class="left bg-eed2ee-bfefff">
        <div class="content">
          <div class="base-info">
            <p>{{this.$store.state.userInfo.userName}}</p>
            <div class="motto">座右铭：以积极的心态面对困难，用坚定的决心迎接挑战。</div>
          </div>
          <div class="info-item education">
            <TitleItem
              iconClass="icon-education"
              title="教育背景"
            />
            <div class="content-item">
              <div class="space-between">
                <div class="date">2013.09 - 2017.07</div>
                <div class="name">{{data.education.university}}</div>
              </div>
              <div
                class="space-between"
                :style="{marginTop:'5px'}"
              >
                <div>GPA：{{data.education.GPA}}</div>
                <div>{{data.education.major}}</div>
              </div>
              <div
                class="mt5"
                v-if="data.education.courses.length > 0"
              >
                <div>主修课程：{{data.education.courses.join(',')}}</div>
              </div>
              <div
                class="mt5"
                v-if="data.education.pratice"
              >
                <div>校内实践：{{data.education.pratice}}</div>
              </div>
            </div>
          </div>
          <div class="info-item projectExp">
            <TitleItem
              iconClass="icon-project-exp"
              title="项目经验"
            />
            <div class="content-item">
            </div>
          </div>
          <div class="info-item awards">
            <TitleItem
              iconClass="icon-award"
              title="获奖情况"
            />
            <div class="content-item">
              <div
                v-for="(item,index) in data.awards"
                :key="index"
              >
                <div class="space-between mt5">
                  <div class="date">{{item.date}}</div>
                  <div class="name">{{item.name}}</div>
                </div>
                <div
                  v-if="item.reason"
                  class="reason mt5"
                >获奖理由：{{item.reason}}</div>
              </div>
            </div>
          </div>
          <div class="info-item interests">
            <TitleItem
              iconClass="icon-interest"
              title="兴趣爱好"
            />
            <div class="content-item">
              <ve-pie
                height="320px"
                :data="chartData"
              ></ve-pie>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="skills">
          <div class="title">
            <div class="icon-wrap bg-eed2ee-bfefff">
              <i class="icon-skill"></i>
            </div>
            专业技能
          </div>
          <ul>
            <li
              v-for="item in data.skills"
              :key="item._id"
            >
              <div class="name">
                {{item.name}}
              </div>
              <div class="line-wrap bg-eed2ee-bfefff">
                <div class="line">
                  <div
                    class="cover bg-eed2ee-bfefff"
                    :style="{width:`${item.degree}%`}"
                  ></div>
                </div>
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
import TitleItem from "@components/TitleItem";

export default {
  components: {
    TitleItem
  },
  data() {
    return {
      data: {
        skills: [],
        education: {
          courses: []
        },
        awards: [],
        interests: []
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
  computed: {
    chartData() {
      return {
        columns: ["兴趣", "喜欢指数"],
        rows: this.data.interests.map(item => ({
          兴趣: item.name,
          喜欢指数: item.degree
        }))
      };
    }
  }
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 16px 32px 80px;
  display: flex;
  justify-content: center;
  background: -webkit-gradient(
    linear,
    left 0,
    right 0,
    from(#f0fff0),
    to(#00e5ee)
  );
  .left {
    padding: 2px;
    .content {
      padding: 12px 30px;
      width: 540px;
      background: white;
      z-index: 1;
      .base-info {
        p {
          color: #3e3e3e;
          margin-top: 8px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .info-item {
        margin-top: 30px;
        .content-item {
          .space-between {
            margin-top: 12px;
            .date,
            .name {
              font-weight: bold;
            }
          }
        }
      }
      .interests {
        .content-item {
          margin-top: 12px;
        }
      }
    }
  }
  .right {
    padding: 8px;
    background: rgba(37, 70, 101, 0.95);
    .skills {
      color: white;
      z-index: 1;
      width: 300px;
      padding: 12px 20px 20px;
      .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
      }
      ul {
        li {
          margin-top: 12px;
          .name {
            color: white;
            margin-left: 2px;
          }
          .line-wrap {
            margin-top: 4px;
            height: 12px;
            padding: 1px;
            .line {
              height: 100%;
              background: rgba(37, 70, 101, 0.95);
              z-index: 1;
              .cover {
                height: 100%;
                width: 60%;
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
              }
            }
          }
        }
      }
    }
  }
  .icon-wrap {
    height: 30px;
    width: 30px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }
}
</style>