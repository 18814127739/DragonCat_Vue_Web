<template>
  <PageContainer>
    <div class="personal-page bg-f0fff0-00e5ee">
      <div class="top">
        <div id="pdf-content">
          <div class="left bg-eed2ee-bfefff">
            <div class="content">
              <div class="base-info">
                <p>{{this.$store.state.userInfo.userName}}</p>
                <div class="motto">座右铭：以积极的心态面对困难，用坚定的决心迎接挑战。</div>
              </div>
              <InfoItem iconClass="icon-education" title="教育背景" @onEdit="onEdit('educationDialog')">
                <div v-if="data.education && data.education.university">
                  <div class="space-between">
                    <div
                      class="date"
                    >{{`${dateToString(data.education.beginDate)}-${dateToString(data.education.endDate)}`}}</div>
                    <div class="name">{{data.education.university}}</div>
                  </div>
                  <div class="space-between" :style="{marginTop:'5px'}">
                    <div>GPA：{{data.education.GPA}}</div>
                    <div>{{data.education.major}}</div>
                  </div>
                  <div class="mt5" v-if="data.education.courses">
                    <div>主修课程：{{data.education.courses}}</div>
                  </div>
                  <div class="mt5" v-if="data.education.pratice">
                    <div>校内实践：{{data.education.pratice}}</div>
                  </div>
                </div>
              </InfoItem>
              <InfoItem
                iconClass="icon-project-exp"
                title="项目经验"
                @onEdit="onEdit('projectExp', 'edit-project-exp')"
              >
                <div v-if="data.projectExp">
                  <div v-for="item in data.projectExp" :key="item._id">
                    <div class="space-between mt5">
                      <div
                        class="date"
                      >{{`${dateToString(item.beginDate,'YYYY.MM')}-${dateToString(item.endDate,'YYYY.MM')}`}}</div>
                      <div class="name">{{item.name}}</div>
                      <div class="date">{{item.position}}</div>
                    </div>
                    <div class="mt5">
                      <div>项目描述：{{item.description}}</div>
                    </div>
                    <div class="mt5">
                      <div></div>
                      项目职责：{{item.task}}
                    </div>
                  </div>
                </div>
              </InfoItem>
              <InfoItem
                iconClass="icon-award"
                title="获奖情况"
                @onEdit="onEdit('awards', 'edit-awards')"
              >
                <div v-if="data.awards">
                  <div v-for="(item,index) in data.awards" :key="index">
                    <div class="space-between mt5">
                      <div class="date">{{dateToString(item.date)}}</div>
                      <div class="name">{{item.name}}</div>
                    </div>
                    <div v-if="item.reason" class="reason mt5">获奖理由：{{item.reason}}</div>
                  </div>
                </div>
              </InfoItem>
              <InfoItem iconClass="icon-interest" title="兴趣爱好" @onEdit="onEdit('interestsDialog')">
                <ve-pie
                  v-if="data.interests && data.interests.length > 0"
                  height="320px"
                  :data="chartData"
                ></ve-pie>
              </InfoItem>
            </div>
          </div>
          <div class="right">
            <div class="title">
              <div class="icon-wrap bg-eed2ee-bfefff">
                <i class="icon-skill"></i>
              </div>专业技能
              <i class="el-icon-edit" v-if="!isEditSkills" @click="isEditSkills = true"></i>
              <i v-if="isEditSkills" class="el-icon-close" @click="onCancelEditSkills"></i>
            </div>
            <transition name="el-zoom-in-center">
              <ul v-show="!isEditSkills">
                <li v-for="item in data.skills" :key="item._id">
                  <div class="name">{{item.name}}</div>
                  <div class="line-wrap bg-eed2ee-bfefff">
                    <div class="line">
                      <div class="cover bg-eed2ee-bfefff" :style="{width:`${item.degree + 2}%`}"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </transition>
            <transition name="el-zoom-in-center">
              <ul v-show="isEditSkills">
                <li v-for="(item, index) in skills" :key="index">
                  <div class="name">
                    <span>{{item.name}}</span>
                    <i class="el-icon-delete" @click="onRemoveSkills($event, 'skills', index)"/>
                  </div>
                  <el-slider :min="1" v-model="item.degree"></el-slider>
                </li>
                <li v-for="(item, index) in newSkills" :key="index">
                  <div class="name">
                    <el-input
                      v-model="item.name"
                      maxlength="20"
                      placeholder="技能名称(1-20字)"
                      size="mini"
                    />
                    <i class="el-icon-delete" @click="onRemoveSkills($event, 'newSkills', index)"/>
                  </div>
                  <el-slider :min="1" v-model="item.degree"></el-slider>
                </li>
              </ul>
            </transition>
            <div v-if="isEditSkills" class="btn-group">
              <el-button size="mini" type="primary" @click="onUpdateSkills">保存</el-button>
              <el-button size="mini" @click="onAddSkills">添加</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <el-button type="primary" size="medium" class="btn-save-pdf" @click="onSavePdf">保存为pdf</el-button>
      </div>
    </div>
    <EditEducation
      :visible="educationDialog"
      :education="data.education"
      @refreshInfo="getHomePageInfo"
      @onClose="onClose('educationDialog')"
    />
    <EditInterests
      :visible="interestsDialog"
      :interests="data.interests"
      @refreshInfo="getHomePageInfo"
      @onClose="onClose('interestsDialog')"
    />
  </PageContainer>
</template>

<script>
import api from "@services";
import moment from "moment";
import html2canvas from "html2canvas";
// import jsPDF from "@assets/libs/jsPDF/main";
import InfoItem from "./components/InfoItem";
import EditEducation from "./components/EditEducation";
import EditInterests from "./components/EditInterests";

export default {
  components: {
    InfoItem,
    EditEducation,
    EditInterests
  },
  data() {
    return {
      data: {},
      skills: [], // 专业技能表单数据
      newSkills: [], // 编辑时新增的技能信息
      isEditSkills: false, // 技能编辑状态
      educationDialog: false,
      interestsDialog: false
    };
  },
  mounted() {
    this.getHomePageInfo();
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
  },
  methods: {
    async getHomePageInfo() {
      const res = await api.getHomePageInfo();
      this.data = res;
      this.data.skills.sort((a, b) => b.degree - a.degree);
      this.skills = this.data.skills.map(item => ({ ...item }));
    },
    dateToString(date, format) {
      return moment(date).format(format || "YYYY.MM.DD");
    },
    onEdit(infoType, pathName) {
      if (["projectExp", "awards"].includes(infoType)) {
        this.$router.push({ name: pathName });
      } else {
        this[infoType] = true;
      }
    },
    onClose(infoType) {
      this[infoType] = false;
    },
    onAddSkills() {
      this.newSkills.push({});
    },
    onCancelEditSkills() {
      this.isEditSkills = false;
      this.newSkills = [];
      this.skills = this.data.skills.map(item => ({ ...item }));
    },
    // 编辑时根据type判断移除的是已有技能 还是 新增技能
    onRemoveSkills(e, type, index) {
      this[type].splice(index, 1);
    },
    async onUpdateSkills() {
      const skills = [...this.skills, ...this.newSkills];
      if (!this.isSkillsValid(skills)) {
        return;
      }
      const params = {
        type: "skills",
        data: skills
      };
      await api.updateHomePageInfo(params);
      this.isEditSkills = false;
      this.newSkills = [];
      this.$message({
        type: "success",
        message: "信息修改成功"
      });
      this.getHomePageInfo();
    },
    isSkillsValid(skills) {
      const flag = skills.every(item => item.name);
      if (!flag) {
        this.$message({
          type: "warning",
          message: "请完善技能信息"
        });
      }
      return flag;
    },
    onSavePdf() {
      if(this.isEditSkills) {
        this.$message({
          type: 'warning',
          message: '请先完成技能编辑'
        });
        return;
      }
      const pdfEle = document.getElementById("pdf-content");
      html2canvas(pdfEle).then(canvas => {
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        const pageHeight = (contentWidth / 592.28) * 841.89;
        //未生成pdf的html页面高度
        let leftHeight = contentHeight;
        //页面偏移
        let position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 595.28;
        const imgHeight = (592.28 / contentWidth) * contentHeight;
        const pageData = canvas.toDataURL("image/jpeg", 1);
        const pdf = new jsPDF("", "pt", "a4");
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          // 分页
          while (leftHeight > 0) {
            pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save("我的简历.pdf");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 16px 32px 60px;
  background: white;
  .top {
    display: flex;
    justify-content: center;
  }
  .bottom {
    text-align: center;
    margin-top: 16px;
  }
  #pdf-content {
    display: flex;
  }
  .left,
  .right {
    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
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
        .space-between {
          margin-top: 14px;
          .date,
          .position,
          .name {
            font-weight: bold;
          }
        }
        .ve-pie {
          margin-top: 12px;
        }
      }
    }
  }
  .right {
    padding: 20px 30px;
    background: rgba(37, 70, 101, 0.95);
    color: white;
    width: 260px;
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      .el-icon-edit,
      .el-icon-close {
        position: absolute;
        right: 0;
        cursor: pointer;
      }
      .el-icon-edit {
        opacity: 0;
        transition: opacity 0.7s;
      }
    }
    ul {
      li {
        margin-top: 12px;
        .name {
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: 2px;
          .el-input {
            width: 150px;
          }
          .el-icon-delete {
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.7s;
          }
        }
        .line-wrap {
          margin-top: 6px;
          height: 12px;
          padding: 1px;
          overflow: hidden;
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
        &:hover {
          .name {
            .el-icon-delete {
              opacity: 1;
            }
          }
        }

        .el-slider {
          .el-slider__bar {
            background-color: linear-gradient(45deg, #eed2ee 0%, #bfefff 100%);
          }
        }
      }
    }
    .btn-group {
      margin-top: 12px;
      text-align: center;
    }
    &:hover {
      .title {
        .el-icon-edit {
          opacity: 1;
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