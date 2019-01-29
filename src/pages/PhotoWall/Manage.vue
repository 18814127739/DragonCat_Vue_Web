<template>
  <PageContainer>
    <div class="photo-wall-manage">
      <div class="space-between">
        <div class="left flex-center">
          <el-upload
            class="upload-demo"
            action="http://localhost:8081/api/photoUpload"
            :file-list="fileList"
            :before-upload="onBeforeUpload"
            :on-success="onSuccess"
            :on-exceed="onExceed"
            :on-error="onError"
            :limit="144"
            :show-file-list="false"
            multiple
            accept="image/*"
            name="photo"
          >
            <el-button size="small" type="primary">添加照片</el-button>
          </el-upload>
          <el-checkbox v-model="isNeedPwd">设置访问密码</el-checkbox>
          <el-input v-if="isNeedPwd" v-model="password" placeholder="访问密码" size="small"/>
        </div>
        <div class="right">
          <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
          <el-button size="small" @click="onBack">返回</el-button>
        </div>
      </div>
      <div class="photo-list">
        <div class="photo-wrap bg-eed2ee-bfefff" v-for="(item,index) in fileList" :key="index">
          <div class="btn-delete flex-center" @click="onRemove($event, index)">
            <i class="icon-error"/>
          </div>
          <img :src="item.url" alt>
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
      fileList: [],
      isNeedPwd: false,
      password: ""
    };
  },
  mounted() {
    // 不能通过输入url直接访问
    if (this.$route.params.action !== "manage") {
      this.$router.replace("/");
      return;
    }
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      const res = await api.getPhotoWallInfo({ action: "manage" });
      this.fileList = res.photos;
      this.isNeedPwd = res.isNeedPwd;
      this.password = res.password;
    },
    async onSubmit() {
      if (this.isNeedPwd) {
        if (!this.password) {
          this.$message({
            type: "warning",
            message: "请填写访问密码"
          });
          return;
        } else {
          // 重设访问密码后，清空localStorage
          localStorage.removeItem("isPassVerify");
        }
      }
      const photos = this.fileList.map(item => ({
        name: item.name, // 原文件名
        fileName: item.fileName, // 在服务器上的文件名
        url: item.url
      }));
      const params = {
        isNeedPwd: this.isNeedPwd,
        password: this.isNeedPwd ? this.password : "",
        photos
      };
      await api.updatePhotoWallInfo(params);
      this.$message({
        type: "success",
        message: "照片墙已更新"
      });
      this.$router.push({ name: "photo-wall" });
    },
    // 移除照片
    async onRemove(e, index) {
      this.fileList.splice(index, 1);
    },
    onBack() {
      this.$router.go(-1);
    },
    onBeforeUpload(file) {
      const isLimit = file.size <= 512000;
      if (!isLimit) {
        this.$message({
          type: "warning",
          message: "图片不能大于500KB"
        });
      }
      const isJpgOrPng = ["png", "jpg", "jpeg"].includes(
        file.type.split("/")[1]
      );
      if (!isJpgOrPng) {
        this.$message({
          type: "warning",
          message: "不支持该格式图片"
        });
      }
      return isLimit && isJpgOrPng;
    },
    onSuccess(res, file, fileList) {
      const num = fileList.length;
      let delay = 500;
      if (101 < num && num <= 144) {
        delay = 1500;
      } else if (80 < num && num <= 100) {
        delay = 1000;
      } else if (60 < num && num <= 80) {
        delay = 800;
      } else if (40 < num && num <= 60) {
        delay = 700;
      } else if (num <= 40) {
        delay = 600;
      }
      // 一次上传多张照片时，由于异步原因导致onSuccess回调中的状态存在异常状况
      // 暂时通过延时0.x秒来进行处理
      setTimeout(() => {
        if (Number(res.code) === 0 && res.data) {
          this.fileList.push({
            ...file,
            url: res.data.path,
            fileName: res.data.filename
          });
        } else {
          this.$message.error(res.message);
        }
      }, delay);
    },
    onExceed() {
      this.$message.warning("最多上传144张照片");
    },
    onError(err) {
      this.$message.error(err);
    }
  }
};
</script>
<style lang="less" scoped>
.photo-wall-manage {
  padding: 16px 32px 46px;
  text-align: center;
  .left {
    .upload-demo {
      .upload-btn {
        margin-left: 12px;
      }
      .el-upload__tip {
        margin-left: 8px;
        color: red;
      }
    }
    .el-checkbox {
      margin: 0 12px;
    }
  }
  .photo-list {
    margin-top: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
    overflow-y: auto;
    .photo-wrap {
      width: 140px;
      height: 160px;
      display: flex;
      overflow: hidden;
      justify-content: center;
      margin: 6px;
      position: relative;
      img {
        width: auto;
        height: 100%;
      }
      .btn-delete {
        position: absolute;
        top: 4px;
        right: 4px;
        background: #ee6363;
        height: 18px;
        width: 18px;
        border-radius: 9px;
        opacity: 0;
        transition: opacity 0.4s;
        cursor: pointer;
      }
      &:hover {
        .btn-delete {
          opacity: 1;
        }
      }
    }
  }
}
</style>