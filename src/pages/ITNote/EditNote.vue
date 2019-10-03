<template>
  <PageContainer>
    <div class="IT-note">
      <div class="body">
        <el-upload
          class="uploader"
          :action="`http://${hostname}:8081/api/noteImgUpload`"
          name="note-image"
          accept="image/*"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
        ></el-upload>
        <div>
          <div class="note-desc">
            <label>标题：</label>
            <el-input class="el-input" v-model="noteInfo.title" :maxlength="30" size="medium" />
            <label>分类：</label>
            <el-select class="el-select" v-model="noteInfo.typeId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in noteTypes"
                :key="item._id"
                :label="item.typeName"
                :value="item._id"
              ></el-option>
            </el-select>
          </div>
          <quill-editor
            v-loading="quillUploading"
            v-model="noteInfo.content"
            ref="myQuillEditor"
            :options="editorOption"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
          <div class="preview-btn">
            <el-button type="primary" size="medium" @click="onSubmit">提交</el-button>
            <el-button size="medium" @click="isPreView = !isPreView">预览</el-button>
            <el-button size="medium" @click="onCancel">取消</el-button>
          </div>
          <div class="ql-container preview-div" v-if="isPreView">
            <div class="ql-editor" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import api from "@services";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { toolbarOptions, deleteConfirmProps } from "./const";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      hostname: location.hostname,
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".uploader input").click();
                }
              }
            }
          }
        }
      },
      maxLen: 3000, // 字符上限
      isPreView: false,
      quillUploading: false, // 上传图片加载中
      noteInfo: {} // 笔记信息
    };
  },
  mounted() {
    this.noteInfo = this.$route.params;
  },
  computed: {
    noteTypes() {
      return this.$store.state.noteTypeList;
    }
  },
  methods: {
    onEditorFocus(editor) {
      editor.enable(true); // 实现达到上限字符可删除
    },
    onEditorChange({ quill, html, text }) {
      let textLength = 0;
      if (text && text.trim() !== "") {
        textLength = text.length;
      }
      this.contentLen = textLength;
      if (textLength > this.maxLen) {
        this.surPlusLen = 0;
        this.$message.error("最多输入" + this.maxLen + "个字符");
        this.$refs.myQuillEditor.quill.enable(false);
      } else {
        this.surPlusLen = this.maxLen - Number(textLength);
      }
      // console.log("editor change!", quill, html, text);
      this.content = html;
    },
    beforeUpload() {
      this.quillUploading = true;
    },
    uploadSuccess(res, file) {
      try {
        // 获取富文本组件实例
        const quill = this.$refs.myQuillEditor.quill;
        if (res.code === 0) {
          // 获取光标所在位置
          const length = quill.getSelection().index;
          // 插入图片  res.data.path为服务器返回的图片地址
          quill.insertEmbed(length, "image", res.data.path);
          // 调整光标到最后
          quill.setSelection(length + 1);
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error("图片插入失败");
      } finally {
        this.quillUploading = false;
      }
    },
    // 富文本图片上传失败
    uploadError(e) {
      this.quillUploading = false;
      this.$message.error("图片插入失败");
    },
    async onCancel() {
      await this.$confirm("确认取消本次编辑吗？", "提示", deleteConfirmProps);
      this.$router.go(-1);
    },
    // 提交笔记
    async onSubmit() {
      if (!this.check()) {
        return;
      }
      const params = {
        typeId: this.noteInfo.typeId,
        content: this.noteInfo.content,
        title: this.noteInfo.title
      };
      if (this.noteInfo._id) {
        params.noteId = this.noteInfo._id;
        await api.updateNote(params);
      } else {
        await api.addNote(params);
      }
      this.$message.success(`${this.noteInfo._id ? "修改" : "新增"}笔记成功`);
      this.$router.go(-1);
    },
    check() {
      if (!this.noteInfo.title) {
        this.$message.warning("请填写笔记标题");
        return false;
      }
      if (!this.noteInfo.typeId) {
        this.$message.warning("请选择笔记所属分类");
        return false;
      }
      if (!this.noteInfo.content) {
        this.$message.warning("请完善笔记内容");
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
.IT-note {
  padding: 24px 32px 46px;
  display: flex;
  justify-content: center;

  .body {
    display: flex;

    .note-desc {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .el-input,
      .el-select {
        width: 200px;
        margin-right: 15px;
      }
    }

    .uploader {
      display: none;
    }

    .quill-editor {
      min-height: 300px;
      :global(.ql-container) {
        min-height: 300px;
      }
    }

    .preview-btn {
      margin: 15px;
      text-align: center;
    }

    .preview-div {
      height: auto;
      border: 1px solid #ccc;

      :global(img) {
        max-width: 100%;
      }
    }
  }
}
</style>

