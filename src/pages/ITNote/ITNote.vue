<template>
  <PageContainer>
    <div class="IT-note">
      <div class="body">
        <div class="left">
          <div class="add-type" @click="editVisible = true; noteTypeAction = 'add'">
            新增分类
            <span>+</span>
          </div>
          <el-tree
            lazy
            class="tree"
            :data="noteTypes"
            node-key="_id"
            :render-content="renderNodeItem"
            :load="onLoadNode"
            @node-click="onNodeClick"
          ></el-tree>
        </div>
        <div class="right">
          <div class="add-note" @click="toPage('edit-note')">
            新增笔记
            <span>+</span>
          </div>
          <div class="ql-container note-content">
            <div class="ql-editor" v-html="curNote.content"></div>
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
        <el-input v-model="noteTypeName" :maxlength="20" size="medium"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAddNoteType">确 定</el-button>
      </span>
    </el-dialog>
  </PageContainer>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import api from "@services";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { deleteConfirmProps } from "./const";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      noteTypeAction: "add", // 笔记分类操作类型
      editVisible: false, // 添加分类弹窗
      noteTypeName: "",
      edittingNoteType: {}, // 正在编辑的分类
      curNote: {} // 正在查看的笔记
    };
  },
  mounted() {
    this.$store.dispatch("getNoteTypeList");
  },
  computed: {
    noteTypes() {
      return this.$store.state.noteTypeList;
    }
  },
  methods: {
    renderNodeItem(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{data.label}</span>
          <div>
            {!data.isLeaf && (
              <i
                class="el-icon-plus plus-btn"
                on-click={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.toPage("edit-note", { typeId: data._id });
                }}
              />
            )}
            <i
              class="el-icon-edit edit-btn"
              on-click={e => {
                e.stopPropagation();
                e.preventDefault();
                if (data.isLeaf) {
                  this.toPage("edit-note", data);
                } else {
                  this.onEditNoteType(data);
                }
              }}
            />
            <i
              class="el-icon-delete delete-btn"
              on-click={e => {
                e.stopPropagation();
                e.preventDefault();
                if (data.isLeaf) {
                  this.onDeleteNote(data);
                } else {
                  this.onDeleteNoteType(data);
                }
              }}
            />
          </div>
        </div>
      );
    },
    // 根据分类查询笔记
    async onLoadNode(node, resolve) {
      const params = {
        typeId: node.data._id
      };
      const res = await api.getNotes(params);
      if (res) {
        res.forEach(item => {
          item.label = item.title;
          item.isLeaf = true;
        });
        resolve(res);
      } else {
        resolve([]);
      }
    },
    onNodeClick(data) {
      if (data.isLeaf) {
        this.curNote = data;
      }
    },
    async onAddNoteType() {
      if (!this.noteTypeName) {
        this.$message.warning("请填写分类名称");
        return;
      }
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
      this.$store.dispatch("getNoteTypeList");
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
      await this.$confirm(
        `确认删除分类 ${data.label} 吗`,
        "提示",
        deleteConfirmProps
      );
      await api.deleteNoteType({ noteTypeId: data._id });
      this.$store.dispatch("getNoteTypeList");
      this.$message.success("删除分类成功!");
    },
    async onDeleteNote(data) {
      await this.$confirm(
        `确认删除笔记 ${data.title} 吗`,
        "提示",
        deleteConfirmProps
      );
      await api.deleteNote({ noteId: data._id });
      if (data._id === this.curNote._id) {
        this.curNote = {};
      }
      this.$store.dispatch("getNoteTypeList");
      this.$message.success("删除笔记成功!");
    },
    toPage(pathname, params) {
      this.$router.push({ name: pathname, params });
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

    .add-type,
    .add-note {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 8px;
      text-align: center;
      border: 1px dashed #ccc;

      span {
        margin-left: 5px;
      }
    }

    .add-type:hover,
    .add-note:hover {
      color: #9b30ff;
      border: 1px dashed #9b30ff;
    }

    .left {
      width: 260px;

      .tree {
        margin-top: 12px;

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