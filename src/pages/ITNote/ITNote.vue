<template>
  <PageContainer>
    <div class="IT-note">
      <div class="body">
        <div class="left">
          <div class="edit-type" @click="editVisible = true; noteTypeAction = 'add'">
            新增分类
            <span>+</span>
          </div>
          <el-tree
            lazy
            class="tree"
            :data="noteTypes"
            node-key="_id"
            :render-content="renderNodeItem"
            @node-click="onClickNode"
          ></el-tree>
        </div>
        <div class="right">
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
          <quill-editor
            v-loading="quillUploading"
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
          <div class="preview-btn">
            <el-button type="primary" size="medium" @click="onTogglePreView">预览</el-button>
          </div>
          <div class="ql-container preview-div" v-if="isPreView">
            <div class="ql-editor" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="noteTypeAction === 'add' ? '添加笔记分类' : '编辑笔记分类'"
      :visible="editVisible"
      width="30%"
      @close="editVisible = false"
    >
      <div class="dialog-content">
        <label>分类名称：</label>
        <el-input v-model="noteTypeName" :maxlength="20"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAddNoteType">确 定</el-button>
      </span>
    </el-dialog>
  </PageContainer>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { compressImgs } from "compress-imgs";
import api from "@services";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import toolbarOptions from "./const";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      noteTypes: [],
      noteTypeAction: "add", // 笔记分类操作类型
      hostname: location.hostname,
      content: "", // 文本编辑器内容
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
      maxLen: 2000, // 字符上限
      isPreView: false,
      quillUploading: false, // 上传图片加载中
      editVisible: false, // 添加分类弹窗
      noteTypeName: "",
      edittingNoteType: {} // 正在编辑的分类
    };
  },
  mounted() {
    this.getNoteTypes();
  },
  methods: {
    async getNoteTypes() {
      const res = await api.getNoteTypes();
      if (res) {
        this.noteTypes = res.map(item => ({
          ...item,
          label: item.typeName,
          children: [],
          isLeaf: false
        }));
      }
    },
    renderNodeItem(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{data.label}</span>
          <div>
            <i
              class="el-icon-plus plus-btn"
              on-click={() => this.onAddNote(data)}
            />
            <i
              class="el-icon-edit edit-btn"
              on-click={() => this.onEditNoteType(data)}
            />
            <i
              class="el-icon-delete delete-btn"
              on-click={() => this.onDeleteNoteType(data)}
            />
          </div>
        </div>
      );
    },
    onClickNode(e) {
      console.log(e);
    },
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
    onTogglePreView() {
      this.isPreView = !this.isPreView;
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
    onToggleVisible() {
      this.editVisible = !this.editVisible;
    },
    async onAddNoteType() {
      if (this.noteTypes.some(item => item.typeName === this.noteTypeName)) {
        this.$message.warning("该分类已存在，请勿重复添加");
        return;
      }
      const params = {
        typeName: this.noteTypeName,
        level: 1
      };
      if (this.noteTypeAction === "edit") {
        params.noteTypeId = this.edittingNoteType._id;
        await api.updateNoteType(params);
      } else {
        await api.addNoteType(params);
      }
      this.getNoteTypes();
      this.$message.success(
        `${this.noteTypeAction === "add" ? "新增" : "编辑"}分类成功`
      );
      this.noteTypeName = "";
      this.editVisible = false;
    },
    onEditNoteType(data) {
      this.noteTypeAction = "edit";
      this.edittingNoteType = data;
      this.noteTypeName = data.label;
      this.editVisible = true;
    },
    async onDeleteNoteType(data) {
      await this.$confirm(`确认删除分类 ${data.label} 吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      await api.deleteNoteType({ noteTypeId: data._id });
      this.getNoteTypes();
      this.$message.success("删除分类成功!");
    },
    onAddNote() {}
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

    .left {
      width: 260px;

      .edit-type {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 8px;
        text-align: center;
        border: 1px dashed #ddd;

        span {
          margin-left: 5px;
        }
      }

      .edit-type:hover {
        color: #9b30ff;
        border: 1px dashed #9b30ff;
      }

      .tree {
        margin-top: 15px;

        :global(.custom-tree-node) {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          :global(.plus-btn),
          :global(.edit-btn),
          :global(.delete-btn) {
            opacity: 0;
            transition: opacity 0.7s;
            margin-right: 10px;
          }

          :global(.plus-btn),
          :global(.edit-btn) {
            margin-right: 8px;
          }

          &:hover {
            :global(.plus-btn),
            :global(.edit-btn),
            :global(.delete-btn) {
              opacity: 1;
            }

            :global(.plus-btn:hover),
            :global(.edit-btn:hover),
            :global(.delete-btn:hover) {
              color: #9b30ff;
            }
          }
        }
      }
    }

    .right {
      width: 800px;
      margin-left: 20px;

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

        :global(img) {
          max-width: 100%;
        }
      }
    }
  }
}
.dialog-content {
  display: flex;
  align-items: center;

  label {
    width: 100px;
  }
}
</style>

