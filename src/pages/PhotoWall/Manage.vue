<template>
  <PageContainer>
    <div class="photo-wall-manage">
      <el-upload
        class="upload-demo"
        action="http://localhost:8081/api/photoUpload"
        :file-list="fileList"
        :before-upload="onBeforeUpload"
        :on-success="onSuccess"
        :on-change="onChange"
        :on-exceed="onExceed"
        :on-error="onError"
        :limit="144"
        :show-file-list="false"
        multiple
        accept="image/*"
        name="photo"
      >
        <el-button
          size="small"
          type="primary"
        >添加照片</el-button>
        <span
          slot="tip"
          class="el-upload__tip"
        >（小于500KB）</span>
      </el-upload>
      <div class="photo-list">
        <div
          class="photo-wrap bg-eed2ee-bfefff"
          v-for="(item,index) in fileList"
          :key="index"
        >
          <div
            class="btn-delete flex-center"
            @click="onRemove($event, index)"
          >
            <i class="icon-error" />
          </div>
          <img
            :src="item.url"
            alt=""
          />
        </div>
      </div>
      <div class="mt12 flex-center">
        <el-button
          type="primary"
          size="small"
          @click="onSubmit"
        >提交</el-button>
        <el-button
          type="danger"
          size="small"
          @click="onClear"
        >清空</el-button>
        <el-button
          size="small"
          @click="onBack"
        >返回</el-button>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import api from "@services";

export default {
  data() {
    return {
      fileList: []
    };
  },
  mounted() {
    this.getPhotos();
  },
  methods: {
    onChange(file, fileList) {
      // console.log(fileList);
    },
    async getPhotos() {
      const params = {
        userId: this.$store.state.userInfo._id
      };
      const res = await api.getPhotoWallInfo(params);
      this.fileList = res.photos;
    },
    async onSubmit() {
      const photos = this.fileList.map(item => ({
        name: item.name, // 原文件名
        fileName: item.fileName, // 在服务器上的文件名
        url: item.url
      }));
      const params = {
        userId: this.$store.state.userInfo._id,
        data: {
          photos
        }
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
    onClear() {
      this.$confirm(`确认清空所有照片吗？`, "提示", {
        type: "warning"
      })
        .then(async () => {
          // fileList可能由于删除操作导致照片信息不完整，因此需先查出用户的所有照片
          const res = await api.getPhotoWallInfo({
            userId: this.$store.state.userInfo._id
          });
          const delPhotos = res.photos.map(item => item.fileName);
          const params = {
            userId: this.$store.state.userInfo._id,
            delPhotos
          };
          await api.clearPhotos(params);
          this.fileList = [];
        })
        .catch(() => {});
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
      // 暂时通过延时0.7秒来进行处理
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
  .upload-demo {
    .upload-btn {
      margin-left: 12px;
    }
    .el-upload__tip {
      margin-left: 12px;
      color: red;
    }
  }
  .photo-list {
    margin-top: 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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