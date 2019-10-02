<template>
  <PageContainer>
    <div class="personal-page bg-f0fff0-00e5ee">
      <div class="top">
        <div id="pdf-content">
          <div class="left">
            <div class="left-top">
              <div class="avatar" v-loading="loading" @click="uploadAvatar">
                <input
                  class="upload"
                  type="file"
                  ref="input"
                  accept="image/*"
                  multiple
                  @change="onUploadAvatar"
                />
                <div class="img-bg">
                  <div v-if="!data.avatar" class="img-wrap flex-center">
                    <img src="../../assets/imgs/pics/avatar.png" alt />
                  </div>
                  <div class="img-upload flex-center">
                    <img src="../../assets/imgs/pics/header-camera.png" alt />
                    <div v-if="!data.avatar">上传照片</div>
                  </div>
                  <img class="avatar-img" v-if="data.avatar" :src="data.avatar" />
                </div>
              </div>
              <div class="detail-info">
                <div class="title">
                  <div class="icon-wrap bg-eed2ee-bfefff">
                    <i class="icon-profile"></i>
                  </div>基本信息
                  <i class="el-icon-edit" @click="baseInfoDialog=true"></i>
                </div>
                <div v-if="data.baseInfo">
                  <div class="item">
                    <i class="icon-age" />
                    {{data.baseInfo.age ? `${data.baseInfo.age}岁` : ''}}
                  </div>
                  <div class="item">
                    <i class="icon-area" />
                    {{data.baseInfo.region}}
                  </div>
                  <div class="item">
                    <i class="icon-exp" />
                    {{data.baseInfo.workYears ? `${workYearsMap[data.baseInfo.workYears]}工作经验` : ''}}
                  </div>
                  <div class="item">
                    <i class="icon-phone" />
                    {{data.baseInfo.phoneNo}}
                  </div>
                  <div class="item">
                    <i class="icon-email" />
                    {{data.baseInfo.email}}
                  </div>
                </div>
              </div>
            </div>
            <div class="left-bottom">
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
                      <i class="el-icon-delete" @click="onRemoveSkills($event, 'skills', index)" />
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
                      <i
                        class="el-icon-delete"
                        @click="onRemoveSkills($event, 'newSkills', index)"
                      />
                    </div>
                    <el-slider :min="1" v-model="item.degree"></el-slider>
                  </li>
                </ul>
              </transition>
            </div>
            <div v-if="isEditSkills" class="btn-group">
              <el-button size="mini" type="primary" @click="onUpdateSkills">保存</el-button>
              <el-button size="mini" @click="onAddSkills">添加</el-button>
            </div>
          </div>
          <div class="right bg-eed2ee-bfefff">
            <div class="content">
              <div class="base-info">
                <p>{{data.baseInfo ? data.baseInfo.name : this.$store.state.userInfo.userName}}</p>
                <div
                  v-if="data.baseInfo && data.baseInfo.signature"
                  class="motto"
                >{{data.baseInfo.signature}}</div>
              </div>
              <InfoItem iconClass="icon-education" title="教育背景" @onEdit="onEdit('educationDialog')">
                <div v-if="data.education">
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
                    <div class="pro-desc mt5">
                      <div>项目描述：{{item.description}}</div>
                    </div>
                    <div class="pro-task mt5">
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
    <EditBaseInfo
      :visible="baseInfoDialog"
      :baseInfo="data.baseInfo"
      @refreshInfo="getHomePageInfo"
      @onClose="onClose('baseInfoDialog')"
    />
  </PageContainer>
</template>

<script>
import api from "@services";
import moment from "moment";
import html2canvas from "html2canvas";
import { compressImgs } from "compress-imgs";
import InfoItem from "./components/InfoItem";
import EditEducation from "./components/EditEducation";
import EditInterests from "./components/EditInterests";
import EditBaseInfo from "./components/EditBaseInfo";

export default {
  components: {
    InfoItem,
    EditEducation,
    EditInterests,
    EditBaseInfo
  },
  data() {
    return {
      workYearsMap: {
        1: "1年",
        2: "2年",
        3: "3年",
        4: "4年",
        5: "5年",
        6: "6年",
        7: "7年",
        8: "8年",
        9: "9年",
        10: "10年",
        99: "10年以上"
      },
      data: {
        avatar: '',
        baseInfo: {},
        education: {}
      },
      loading: false,
      skills: [], // 专业技能表单数据
      newSkills: [], // 编辑时新增的技能信息
      isEditSkills: false, // 技能编辑状态
      educationDialog: false,
      interestsDialog: false,
      baseInfoDialog: false
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
    dateToString(date, format = "YYYY.MM.DD") {
      return moment(date).format(format);
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
      if (this.isEditSkills) {
        this.$message({
          type: "warning",
          message: "请先完成技能编辑"
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
    },
    uploadAvatar() {
      // 点击时value重置为null，为了避免选择同样的照片时不触发onChange事件
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    onUploadAvatar(ev) {
      const files = ev.target.files;
      if (!files) return;
      this.loading = true;
      const postFiles = Array.prototype.slice.call(files);
      // 图片压缩后再上传, 第二个参数为size大于多少时需要压缩，单位KB
      compressImgs(postFiles)
        .then(compressFiles => {
          // fetch处理
          this.fetchUpload(compressFiles);
          // ajax处理
          // const option = {
          //   headers: {},
          //   withCredentials: false,
          //   files: compressFiles,
          //   filename: "avatar",
          //   action: `http://${window.location.hostname}:8081/api/avatarUpload`,
          //   onSuccess: res => {
          //     if (res.code === 0) {
          //       this.loading = false;
          //     } else {
          //       this.loading = false;
          //       this.$message.error(res.message);
          //     }
          //   },
          //   onError: err => {
          //     this.$message.error(err);
          //   }
          // };
          // this.ajaxUpload(option);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // fetch实现
    fetchUpload(files) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("avatar", file);
      });
      const options = {
        method: "post",
        body: formData
      };
      fetch(`http://${window.location.hostname}:8081/api/avatarUpload`, options)
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            return Promise.reject(`${res.status}(${res.statusText})`);
          }
        })
        .then(res => {
          if (res.code === 0) {
            this.loading = false;
            const params = {
              type: "avatar",
              data: res.data[0].path,
            };
            api.updateHomePageInfo(params).then(() => {
              this.$message({
                type: 'success',
                message: '上传头像成功'
              });
              this.data.avatar = res.data[0].path;
            });
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.err(err);
        });
    },
    // ajax实现
    // ajaxUpload(option) {
    //   if (typeof XMLHttpRequest === "undefined") {
    //     return;
    //   }
    //   const { action } = option;
    //   const xhr = new XMLHttpRequest();
    //   const formData = new FormData();
    //   option.files.forEach(file => {
    //     formData.append(option.filename, file);
    //   });
    //   xhr.onerror = function error(e) {
    //     option.onError(e);
    //   };
    //   xhr.onload = onload = () => {
    //     if (xhr.status < 200 || xhr.status >= 300) {
    //       return option.onError(getError(action, option, xhr));
    //     }
    //     option.onSuccess(getBody(xhr));
    //   };
    //   xhr.open("post", action, true);

    //   if (option.withCredentials && "withCredentials" in xhr) {
    //     xhr.withCredentials = true;
    //   }

    //   const headers = option.headers || {};
    //   for (let item in headers) {
    //     if (headers.hasOwnProperty(item) && headers[item] !== null) {
    //       xhr.setRequestHeader(item, headers[item]);
    //     }
    //   }
    //   xhr.send(formData);
    //   return xhr;

    //   function getBody(xhr) {
    //     const text = xhr.responseText || xhr.response;
    //     if (!text) {
    //       return text;
    //     }
    //     try {
    //       return JSON.parse(text);
    //     } catch (e) {
    //       return text;
    //     }
    //   }
    //   function getError(action, option, xhr) {
    //     let msg;
    //     if (xhr.response) {
    //       msg = `${xhr.response.error || xhr.response}`;
    //     } else if (xhr.responseText) {
    //       msg = `${xhr.responseText}`;
    //     } else {
    //       msg = `fail to post ${action} ${xhr.status}`;
    //     }
    //     const err = new Error(msg);
    //     err.status = xhr.status;
    //     err.method = "post";
    //     err.url = action;
    //     return err;
    //   }
    // },
  }
};
</script>

<style lang="less" scoped>
.personal-page {
  padding: 24px 32px 60px;
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
  .right {
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
        .pro-desc,
        .pro-task {
          line-height: 20px;
        }
      }
    }
  }
  .left {
    padding: 20px 30px;
    background: rgba(37, 70, 101, 0.95);
    color: white;
    width: 260px;

    .left-top,
    .left-bottom {
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
    }

    .detail-info,
    .left-bottom {
      &:hover {
        .title {
          .el-icon-edit {
            opacity: 1;
          }
        }
      }
    }

    .left-top {
      text-align: center;
      .avatar {
        .upload {
          display: none;
        }
        padding: 5px;
        margin: 0 auto;
        cursor: pointer;
        border: 1px dashed white;
        width: 118px;
        height: 148px;
        .img-bg {
          position: relative;
          height: 100%;
          .img-wrap,
          .img-upload {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 1;
          }

          .img-upload {
            flex-direction: column;
            background: rgba(0, 192, 145, 0.5);
            opacity: 0;
            z-index: 20;
          }

          &:hover {
            .img-wrap {
              opacity: 0;
            }

            .img-upload {
              opacity: 1;
            }
          }
        }

        .avatar-img {
          width: 100%;
          height: 100%;
        }
      }

      .detail-info {
        margin-top: 30px;
        text-align: left;
        .item {
          i {
            margin-right: 8px;
          }
          display: flex;
          align-items: center;
          margin-top: 18px;
        }
      }
    }

    .left-bottom {
      margin-top: 30px;
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
              background-color: linear-gradient(
                45deg,
                #eed2ee 0%,
                #bfefff 100%
              );
            }
          }
        }
      }
    }
    .btn-group {
      margin-top: 12px;
      text-align: center;
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