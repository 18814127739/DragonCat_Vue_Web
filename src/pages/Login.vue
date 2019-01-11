<template>
  <div class="login">
    <div class="left-pane">
      <div class="content">
        <img />
      </div>
    </div>
    <div class="right-pane">
      <el-tabs
        v-model="activeTab"
        type="border-card"
      >
        <el-tab-pane
          label="登录"
          name="login"
        >
          <el-form
            :model="form"
            :rules="rules1"
            label-position="top"
          >
            <el-form-item
              label="账号："
              prop="account"
            >
              <el-input
                size="medium"
                placeholder="用户名/手机号/邮箱"
                v-model="form.account"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码："
              prop="password"
            >
              <el-input
                type="password"
                v-model="form.password"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item class="btn-item">
              <el-button
                type="primary"
                size="medium"
                @click="login"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="注册"
          name="register"
        >
          <el-form
            :model="form2"
            :rules="rules2"
            label-position="top"
          >
            <el-form-item
              label="用户名："
              prop="userName"
            >
              <el-input
                v-model="form2.userName"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号："
              prop="phone"
            >
              <el-input
                v-model="form2.phone"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱："
              prop="eMail"
            >
              <el-input
                type="eMail"
                v-model="form2.eMail"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码："
              prop="password"
            >
              <el-input
                type="password"
                v-model="form2.password"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item class="btn-item">
              <el-button
                type="primary"
                size="medium"
                @click="register"
              >注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import api from "@services";

export default {
  data() {
    return {
      activeTab: "login",
      form: {}, // 登录信息
      form2: {}, // 注册信息
      rules1: {
        account: [{ required: true, message: "请填写账号", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      },
      rules2: {
        userName: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        eMail: [{ required: true, message: "请填写邮箱", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    async login() {
      await api.login(this.form);
      this.$router.push({ name: "home" });
      this.$message({
        type: "success",
        message: "登录成功"
      });
    },
    async register() {
      const params = {};
      Object.keys(this.form2).forEach(key => {
        if (this.form2[key]) {
          params[key] = this.form2[key];
        }
      });
      if (this.isValid(params)) {
        await api.register(params);
        this.activeTab = "login";
        this.form2 = {};
        this.$message({
          type: "success",
          message: "用户已创建"
        });
      }
    },
    isValid(params) {
      let flag = true;
      if (!/^1[34578]\d{9}$/.test(params.phone)) {
        this.$message({
          type: "warning",
          message: "手机号码不符合格式要求"
        });
        flag = false;
      }
      if (
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
          params.eMail
        )
      ) {
        this.$message({
          type: "warning",
          message: "邮箱地址不符合格式要求"
        });
        flag = false;
      }
      return flag;
    }
  }
};
</script>
<style lang="less">
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  background: -webkit-gradient(
    linear,
    left 0,
    right 0,
    from(#fffafa),
    to(#f0ffff)
  );
  .left-pane {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 480px;
    height: 480px;
    position: fixed;
    left: 10vw;
    .content {
      width: 300px;
      height: 300px;
      background: url("../assets/imgs/QR_code1.jpg") no-repeat center;
      background-size: cover;
      border-radius: 150px;
      position: relative;
      z-index: 3;
    }
  }
  .left-pane::before {
    content: "";
    background: url("../assets/imgs/pics/pic-line1.png") no-repeat;
    background-size: cover;
    display: block;
    width: 400px;
    height: 400px;
    margin: -200px 0 0 -200px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    animation: rotateMove infinite linear 12s;
  }
  .left-pane::after {
    content: "";
    background: url("../assets/imgs/pics/pic-line2.png") no-repeat;
    background-size: cover;
    display: block;
    width: 480px;
    height: 480px;
    margin: -240px 0 0 -240px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    animation: backRotateMove infinite linear 8s;
  }
  .right-pane {
    position: fixed;
    width: 400px;
    top: 20vh;
    right: 10vw;
    .el-form {
      width: 100%;
      .el-form-item {
        margin-bottom: 20px;
        .el-form-item__label {
          padding: 0;
          line-height: 32px;
        }
      }
      .el-input {
        width: 100%;
      }
      .btn-item {
        margin-left: 0;
        .el-button {
          width: 100%;
        }
      }
    }
    .el-tabs__nav {
      width: 100%;
      display: flex;
      .el-tabs__item {
        flex: 1;
        text-align: center;
      }
    }
  }
}
@keyframes rotateMove {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes backRotateMove {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
