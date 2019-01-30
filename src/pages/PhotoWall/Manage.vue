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
      // 点击时value重置为null，为了避免选择同样的照片时不触发onChange事件
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    onChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      if (files.length + this.fileList.length > 144) {
        this.$message({
          type: "warning",
          message: "最多上传144张照片"
        });
        return;
      }
      const postFiles = Array.prototype.slice.call(files);
      if (!this.isLimit(postFiles)) {
        this.$message({
          type: "warning",
          message: "图片不能大于500KB"
        });
        return;
      }
      const option = {
        headers: {},
        withCredentials: false,
        files: postFiles,
        filename: "photo",
        action: "http://localhost:8081/api/photoUpload",
        onSuccess: res => {
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
        },
        onError: err => {
          this.$message.error(err);
        }
      };
      this.loading = true;
      this.upload(option);
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
    upload(option) {
      if (typeof XMLHttpRequest === "undefined") {
        return;
      }
      const { action } = option;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      option.files.forEach(file => {
        formData.append(option.filename, file);
      });
      xhr.onerror = function error(e) {
        option.onError(e);
      };
      xhr.onload = onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr));
        }
        option.onSuccess(getBody(xhr));
      };
      xhr.open("post", action, true);

      if (option.withCredentials && "withCredentials" in xhr) {
        xhr.withCredentials = true;
      }

      const headers = option.headers || {};
      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item]);
        }
      }
      xhr.send(formData);
      return xhr;

      function getBody(xhr) {
        const text = xhr.responseText || xhr.response;
        if (!text) {
          return text;
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          return text;
        }
      }
      function getError(action, option, xhr) {
        let msg;
        if (xhr.response) {
          msg = `${xhr.response.error || xhr.response}`;
        } else if (xhr.responseText) {
          msg = `${xhr.responseText}`;
        } else {
          msg = `fail to post ${action} ${xhr.status}`;
        }
        const err = new Error(msg);
        err.status = xhr.status;
        err.method = "post";
        err.url = action;
        return err;
      }
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
    align-items: center;
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