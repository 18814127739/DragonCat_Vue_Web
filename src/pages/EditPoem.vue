<template>
  <div id="edit-poem">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item
        label="标题"
        prop="title"
      >
        <el-input
          v-model="form.title"
          size="small"
        ></el-input>
      </el-form-item>
      <div class="row">
        <el-form-item label="作者">
          <el-input
            v-model="form.author"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="创作时间"
          prop="date"
        >
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
      <el-form-item
        label="主题"
        prop="theme"
      >
        <el-checkbox-group v-model="form.theme">
          <el-checkbox
            v-for="item in themeList"
            :key="item._id"
            :label="item.value"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="内容">
        <el-button
          size="small"
          type="primary"
          @click="onAddRow"
        >添加</el-button>
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
          size="small"
        ></el-input>
        <i
          v-if="index > 2"
          class="el-icon-delete"
          @click="onDelRow(index)"
        ></i>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          size="small"
        >提交</el-button>
        <el-button
          size="small"
          @click="goBack"
        >返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@services";

export default {
  name: "edit-poem",
  data() {
    return {
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
    if (this.$route.params.title) {
      const poemInfo = {
        ...this.$route.params.poem,
        date: new Date(this.$route.params.poem.date)
      };
      this.form = Object.assign({}, this.form, poemInfo);
    }
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
      if (this.form._id) {
        await api.editPoem(this.form);
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
#edit-poem {
  display: flex;
  justify-content: center;
  padding: 16px;
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
}
</style>
