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
import { resolve, reject } from "q";

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
      // 图片压缩后再上传
      this.compressFiles(postFiles)
        .then(compressFiles => {
          const option = {
            headers: {},
            withCredentials: false,
            files: compressFiles,
            filename: "avatar",
            action: "http://localhost:8081/api/avatarUpload",
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
    },
    // 压缩图片文件
    compressFiles(files) {
      const ts = this;
      const arr = files.map(
        file =>
          new Promise(resolve => {
            // 小于300K则直接返回，否则进行压缩
            if (file.size < 307200) {
              resolve(file);
              return;
            }
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            const reader = new FileReader();
            const img = new Image();

            reader.onload = function(e) {
              img.src = this.result;
            };

            img.onload = function() {
              // 图片原始宽高
              const originWidth = this.width;
              const originHeight = this.height;
              // 限制最大宽高
              const maxWidth = 600;
              const maxHeight = 600;
              let targetWidth = originWidth;
              let targetHeight = originHeight;
              // 若原始宽/高超出最大宽/高， 则等比例压缩宽/高
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  targetWidth = maxWidth;
                  targetHeight = Math.round(
                    maxWidth * (originHeight / originWidth)
                  );
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(
                    maxHeight * (originWidth / originHeight)
                  );
                }
              }
              // 用canvas描绘出新的图像
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              context.clearRect(0, 0, targetWidth, targetHeight);
              context.drawImage(img, 0, 0, targetWidth, targetHeight);
              const targetImg = canvas.toDataURL(
                file.type || "image/png",
                0.92
              );
              // 将base64转换成file对象
              const targetFile = ts.dataURLtoFile(targetImg, file.name);
              resolve(targetFile);
            };
            // 读取文件内容
            reader.readAsDataURL(file);
          })
      );
      return Promise.all(arr);
    },
    //将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
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

