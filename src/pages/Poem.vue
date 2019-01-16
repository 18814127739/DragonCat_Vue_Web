<template>
  <PageContainer class="poem-page">
    <div class="query-bar">
      <div class="input-group">
        <label>标题：</label>
        <el-input
          v-model="form.title"
          size="mini"
          @keyup.enter.native="onChange"
        ></el-input>
      </div>
      <div class="input-group">
        <label>类型：</label>
        <el-select
          v-model="form.type"
          size="mini"
          placeholder="请选择"
          @change="onChange"
        >
          <el-option
            v-for="item in typeList"
            :key="item._id"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label>主题：</label>
        <el-select
          v-model="form.theme"
          size="mini"
          placeholder="请选择"
          @change="onChange"
        >
          <el-option
            v-for="item in themeList"
            :key="item._id"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label>排序：</label>
        <el-select
          v-model="form.sortWay"
          size="mini"
          placeholder="请选择"
          @change="onChange"
        >
          <el-option
            v-for="item in sortWayList"
            :key="item._id"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button
        class="btn"
        type="primary"
        size="mini"
        plain
        @click="toPage('new-poem')"
      >为你写诗</el-button>
    </div>
    <div class="content">
      <ul>
        <li
          v-for="item in poemList"
          :key="item._id"
          @click="onCheckPoem(item)"
        >
          <i
            class="el-icon-edit edit-btn"
            @click.stop="toPage('edit-poem', {title:item.title, poem:item})"
          ></i>
          <i
            class="el-icon-delete delete-btn"
            @click.stop="onDeletePoem(item._id, item.title)"
          ></i>
          <h3>{{item.title}}</h3>
          <div
            class="word"
            v-for="(word,index) in item.content"
            :key="index"
          >{{word}}</div>
        </li>
      </ul>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="this.total"
        :page-size="8"
        :current-page="this.curPage"
        @current-change="onPageChange"
      >
      </el-pagination>
    </div>
    <CheckPoemDialog
      :poem="curPoem"
      :visible="visible"
      @onClose="onClose"
    />
  </PageContainer>
</template>

<script>
import api from "@services";
import CheckPoemDialog from "@components/CheckPoemDialog";

export default {
  name: "poem",
  components: {
    CheckPoemDialog
  },
  data() {
    return {
      sortWayList: [
        { value: "asc", name: "按时间升序" },
        { value: "desc", name: "按时间倒叙" }
      ],
      poemList: [],
      curPoem: {},
      form: {
        title: "",
        theme: "", // 主题
        type: "", // 文体类型
        sortWay: "desc"
      },
      curPage: 1,
      total: 0,
      visible: false
    };
  },
  mounted() {
    this.getPoemList();
    this.$store.dispatch("getThemeList");
    this.$store.dispatch("getTypeList");
  },
  computed: {
    themeList() {
      return [{ value: "", name: "全部" }].concat(this.$store.state.themeList);
    },
    typeList() {
      return [{ value: "", name: "全部" }].concat(this.$store.state.typeList);
    }
  },
  methods: {
    async getPoemList() {
      const params = {
        pageSize: 8,
        curPage: this.curPage,
        userId: this.$store.state.userInfo._id
      };
      Object.keys(this.form).forEach(key => {
        if (this.form[key]) {
          params[key] = this.form[key];
        }
      });
      const res = await api.getPoemList(params);
      this.poemList = res.list;
      this.total = res.total;
    },
    // 改变过滤条件
    onChange() {
      this.curPage = 1;
      this.getPoemList();
    },
    onPageChange(curPage) {
      this.curPage = curPage;
      this.getPoemList();
    },
    onCheckPoem(curPoem) {
      this.curPoem = curPoem;
      this.visible = true;
    },
    onDeletePoem(id, title) {
      this.$confirm(`确认删除《${title}》吗？`, "提示", { type: "warning" })
        .then(async () => {
          await api.deletePoem({ id });
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getPoemList();
        })
        .catch(() => {});
    },
    onClose() {
      this.visible = false;
    },
    toPage(pathname, params) {
      this.$router.push({ name: pathname, params });
    }
  }
};
</script>

<style lang="less" scoped>
.poem-page {
  .query-bar {
    padding: 0 32px;
    margin-top: 16px;
    .el-input,
    .el-select {
      width: 150px;
    }
    .input-group {
      display: inline-block;
      margin-right: 24px;
      height: 32px;
    }
    .btn {
      float: right;
    }
  }
  .content {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 1200px;
      li {
        width: 284px;
        height: 260px;
        border-radius: 5px;
        margin: 0 8px 16px;
        background: -webkit-gradient(
          linear,
          left 0,
          right 0,
          from(#bfefff),
          to(#fff0f5)
        );
        position: relative;
        vertical-align: middle;
        cursor: pointer;
        text-align: center;
        padding: 24px 0;
        overflow-x: hidden;
        overflow-y: auto;
        h3 {
          color: #3e3e3e;
          margin-top: 10px;
        }
        .word {
          padding: 0 10px;
          margin-top: 14px;
          font-size: 15px;
        }
        .edit-btn,
        .delete-btn {
          position: absolute;
          right: 30px;
          top: 8px;
          opacity: 0;
          transition: opacity 0.7s;
        }
        .delete-btn {
          right: 8px;
        }
      }
      li:hover {
        -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        .edit-btn,
        .delete-btn {
          opacity: 1;
        }
        .edit-btn:hover,
        .delete-btn:hover {
          color: #9b30ff;
        }
      } //滚动条样式
      li::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      li::-webkit-scrollbar-button {
        display: none;
      }
      li::-webkit-scrollbar-track {
        display: none;
      }
      li::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 4px;
      }
    }
  }
  .pagination {
    padding: 0 32px;
    padding-bottom: 46px;
    text-align: right;
  }
}
</style>

