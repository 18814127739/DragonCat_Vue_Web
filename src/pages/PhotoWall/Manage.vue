<template>
  <PageContainer>
    <div class="photo-wall-manage">
      <div class="space-between">
        <div class="left flex-center">
          <el-button size="small" type="primary" @click="onClick">添加照片</el-button>
          <input
            class="upload-input"
            type="file"
            ref="input"
            accept="image/*"
            multiple
            @change="onChange"
          >
          <el-checkbox v-model="isNeedPwd">设置访问密码</el-checkbox>
          <el-input v-if="isNeedPwd" v-model="password" placeholder="访问密码" size="small"/>
        </div>
        <div class="right">
          <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
          <el-button size="small" @click="onBack">返回</el-button>
        </div>
      </div>
      <div class="photo-list" v-loading="loading">
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
import { compressImgs } from "compress-imgs";

export default {
  data() {
    return {
      fileList: [],
      isNeedPwd: false,
      password: "",
      loading: false
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
    onClick() {
      // 点击时value重置为null，避免选择同样的照片时不触发onChange事件
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    onChange(e) {
      const files = e.target.files;
      if (!files) return;
      if(files.length.length > 20) {
         this.$message({
          type: "warning",
          message: "一次上传不能超过20张照片"
        });
        return;
      }
        if (files.length + this.fileList.length > 144) {
        this.$message({
          type: "warning",
          message: "最多上传144张照片"
        });
        return;
      }
      this.loading = true;
      const postFiles = Array.prototype.slice.call(files);
      // 压缩图片， 第2个参数为多少KB以上需要进行压缩，第3、4个参数为压缩后图片的最大宽高
      compressImgs(postFiles, 300, 800, 800)
        .then(compressFiles => {
          this.upload(compressFiles);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    upload(files) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("photo", file);
      });
      const options = {
        method: "post",
        body: formData
      };
      fetch(`http://${window.location.hostname}:8081/api/photoUpload`, options)
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
            res.data.forEach(item => {
              this.fileList.push({
                ...item,
                url: item.path,
                fileName: item.filename
              });
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
    isLimit(files) {
      let flag = true;
      files.forEach(file => {
        if (file.size > 512000) {
          flag = false;
        }
      });
      return flag;
    },
    onRemove(e, index) {
      this.fileList.splice(index, 1);
    },
    async onSubmit() {
      if (this.isNeedPwd && !this.password) {
        this.$message({
          type: "warning",
          message: "请填写访问密码"
        });
        return;
      }
      const photos = this.fileList.map(item => ({
        name: item.originalname, // 原文件名
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
    onBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.photo-wall-manage {
  padding: 16px 32px 46px;
  text-align: center;
  .left {
    .upload-input {
      display: none;
    }
    .el-checkbox {
      margin: 0 12px;
    }
  }
  .photo-list {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    min-height: 70vh;
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