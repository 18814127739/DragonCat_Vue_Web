<template>
  <PageContainer>
    <div class="IT-note">
      <el-button size="small" type="primary" @click="onClick">上传头像</el-button>
      <input class="upload" type="file" ref="input" accept="image/*" multiple @change="onChange">
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
      loading: false
    };
  },
  methods: {
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
          message: `最多上传144张照片，当前已上传${this.fileList.length}张`
        });
        return;
      }
      this.loading = true;
      const postFiles = Array.prototype.slice.call(files);
      // 图片压缩后再上传, 第二个参数为size大于多少时需要压缩，单位KB
      compressImgs(postFiles)
        .then(compressFiles => {
          const option = {
            headers: {},
            withCredentials: false,
            files: compressFiles,
            filename: "avatar",
            action: `http://${window.location.hostname}:8081/api/avatarUpload`,
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
          this.upload(option);
        })
        .catch(err => {
          this.$message.error(err);
        });
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
    }
  }
};
</script>

<style lang="less" scoped>
.IT-note {
  padding: 16px 32px 46px;
  text-align: center;
  .upload {
    display: none;
  }
  .photo-list {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    min-height: 70vh;
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

