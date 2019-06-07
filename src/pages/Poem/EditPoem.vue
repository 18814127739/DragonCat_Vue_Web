<template>
  <PageContainer>
    <div class="edit-poem">
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" size="small" maxlength="20" placeholder="1-20字"></el-input>
            </el-form-item>
            <div class="row">
              <el-form-item label="作者">
                <el-input v-model="form.author" size="small" maxlength="10" placeholder="1-10字"></el-input>
              </el-form-item>
              <el-form-item label="创作时间" prop="date">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.date"
                    size="small"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </div>
            <el-form-item label="类型">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="item in typeList"
                  :label="item.value"
                  :key="item.value"
                >{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="主题" prop="theme">
              <el-checkbox-group v-model="form.theme">
                <el-checkbox
                  v-for="item in themeList"
                  :key="item._id"
                  :label="item.value"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="内容">
              <el-button size="small" type="primary" @click="onAddRow">添加</el-button>
              <span class="tips">（不少于3句）</span>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in form.content"
              :label="`第${index + 1}句`"
              :key="index"
            >
              <el-input
                class="content-input"
                v-model="form.content[index]"
                placeholder="1-100字"
                size="small"
                maxlength="100"
              ></el-input>
              <i v-if="index > 2" class="el-icon-delete" @click="onDelRow(index)"></i>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">提交</el-button>
              <el-button size="small" @click="goBack">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="9">
          <el-upload
            class="upload-demo"
            :action="`http://${hostname}:8081/api/poemImgUpload`"
            :file-list="fileList"
            :before-upload="onBeforeUpload"
            :on-success="onSuccess"
            :on-remove="onRemove"
            :on-error="onError"
            :limit="5"
            list-type="picture"
            accept="image/*"
            name="poem-image"
          >
            <p>意境配图</p>
            <el-button
              class="upload-btn"
              size="small"
              type="primary"
              :disabled="fileList.length >= 5"
            >点击上传</el-button>
            <span slot="tip" class="el-upload__tip">（只能上传jpg / jpeg / png文件，且不大于5M）</span>
          </el-upload>
        </el-col>
      </el-row>
    </div>
  </PageContainer>
</template>

<script>
import api from "@services";

export default {
  name: "edit-poem",
  data() {
    return {
      hostname: location.hostname,
      fileList: [],
      pickerOptions: {
        // 日期选择器禁用日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        title: "",
        author: "",
        theme: [],
        type: 1,
        content: ["", "", "", ""],
        imgs: [],
        desc: "",
        date: new Date()
      },
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        theme: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个主题",
            trigger: "change"
          }
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "创作时间不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.$store.dispatch("getThemeList");
    // 初始化数据
    if (this.$route.params.title) {
      const poemInfo = {
        ...this.$route.params.poem,
        date: new Date(this.$route.params.poem.date)
      };
      this.form = Object.assign({}, this.form, poemInfo);
    }
    this.fileList = this.$route.params.poem ? this.$route.params.poem.imgs : [];
  },
  computed: {
    themeList() {
      return this.$store.state.themeList;
    },
    typeList() {
      return this.$store.state.typeList;
    }
  },
  methods: {
    onAddRow() {
      this.form.content.push("");
    },
    onDelRow(index) {
      this.form.content.splice(index, 1);
    },
    onBeforeUpload(file) {
      const isLimit = file.size <= 5242880; // 5M
      if (!isLimit) {
        this.$message({
          type: "warning",
          message: "图片不能大于5M"
        });
      }
      const isJpgOrPng = ["png", "jpg", "jpeg"].includes(
        file.type.split("/")[1]
      );
      if (!isJpgOrPng) {
        this.$message({
          type: "warning",
          message: "请上传jpg / jpeg / png格式的图片"
        });
      }
      return isLimit && isJpgOrPng;
    },
    onSuccess(res, file, fileList) {
      if (Number(res.code) === 0 && res.data) {
        this.fileList.push({ ...file, url: res.data.path });
      } else {
        this.$message.error(res.message);
      }
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    onError(err) {
      this.$message.error(err);
    },
    async onSubmit() {
      const { title, content, theme, type, date } = this.form;
      const messageObj = {
        message: " 请完善诗词信息",
        type: "warning"
      };
      if (!title || !date || !theme.length || !type) {
        this.$message(messageObj);
        return;
      }
      let flag = true;
      content.forEach(item => {
        if (!item) {
          flag = false;
        }
      });
      if (!flag) {
        this.$message(messageObj);
        return;
      }
      this.form.imgs = this.fileList.map(item => ({
        name: item.name,
        url: item.url
      }));
      if (this.form._id) {
        await api.updatePoem(this.form);
      } else {
        await api.addPoem(this.form);
      }
      this.$message({
        message: `${!this.form._id ? "新增" : "编辑"}诗篇成功`,
        type: "success"
      });
      this.$router.replace({ name: "poems-with-future" });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.edit-poem {
  display: flex;
  justify-content: center;
  padding: 16px;
  .el-row {
    width: 90%;
  }
  .el-form {
    width: auto;
    .row {
      display: flex;
    }
    .content-input {
      width: 95%;
    }
    .el-icon-delete {
      margin-left: 10px;
      cursor: pointer;
    }
    .tips {
      margin-left: 12px;
    }
  }
  .el-input {
    width: 240px;
  }
  .imgList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .img-item {
      width: 80px;
      height: 80px;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.2);
      margin-left: 8px;
      margin-bottom: 8px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .upload-demo {
    p {
      margin-top: 0px;
      line-height: 40px;
    }
    .upload-btn {
      margin-left: 12px;
    }
    .el-upload__tip {
      margin-left: 12px;
      color: red;
    }
  }
}
</style>
