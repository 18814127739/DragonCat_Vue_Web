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
            :model="loginInfo"
            :rules="loginRules"
            label-position="top"
          >
            <el-form-item
              label="账号："
              prop="account"
            >
              <el-input
                size="medium"
                placeholder="用户名/手机号/邮箱"
                v-model="loginInfo.account"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码："
              prop="password"
            >
              <el-input
                type="password"
                v-model="loginInfo.password"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="btn-item"
              v-loading="loginLoading"
            >
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
            :model="registerInfo"
            :rules="registerRules"
            label-position="top"
          >
            <el-form-item
              label="用户名："
              prop="userName"
            >
              <el-input
                v-model="registerInfo.userName"
                maxlength="20"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号："
              prop="phone"
            >
              <el-input
                v-model="registerInfo.phone"
                maxlength="11"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱："
              prop="eMail"
            >
              <el-input
                type="eMail"
                v-model="registerInfo.eMail"
                maxlength="40"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码："
              prop="password"
            >
              <el-input
                type="password"
                v-model="registerInfo.password"
                autocomplete="off"
                maxlength="20"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="btn-item"
              v-loading="registerLoading"
            >
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
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      activeTab: "login",
      loginInfo: {}, // 登录信息
      registerInfo: {}, // 注册信息
      loginRules: {
        account: [{ required: true, message: "请填写账号", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      },
      registerRules: {
        userName: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        eMail: [{ required: true, message: "请填写邮箱", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      },
      loginLoading: false,
      registerLoading: false
    };
  },
  mounted() {
    const account = localStorage.getItem("account");
    if (account) {
      this.$set(this.loginInfo, "account", account);
    }
  },
  methods: {
    login() {
      const params = {
        account: this.loginInfo.account || "",
        password: this.loginInfo.password || ""
      };
      this.loginLoading = true;
      api
        .login(params)
        .then(res => {
          localStorage.setItem("account", this.loginInfo.account);
          this.loginLoading = false;
          const toPath = this.$route.query.redirect;
          this.$router.replace({ path: toPath || "/" });
          this.$store.commit("userInfoSuccess", {
            isLogin: true,
            userInfo: res.userInfo
          });
        })
        .catch(() => {
          this.loginLoading = false;
        });
    },
    register() {
      const params = {};
      Object.keys(this.registerInfo).forEach(key => {
        if (this.registerInfo[key]) {
          params[key] = this.registerInfo[key];
        }
      });
      if (this.isValid(params)) {
        this.registerLoading = true;
        api
          .register(params)
          .then(res => {
            this.registerLoading = false;
            this.activeTab = "login";
            this.registerInfo = {};
            this.$message({
              type: "success",
              message: "用户已创建"
            });
          })
          .catch(() => {
            this.registerLoading = false;
          });
      }
    },
    isValid(params) {
      let flag = true;
      if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(params.eMail)) {
        this.$message({
          type: "warning",
          message: "邮箱地址不符合格式要求"
        });
        flag = false;
      }
      if (!/^1[34578]\d{9}$/.test(params.phone)) {
        this.$message({
          type: "warning",
          message: "手机号码不符合格式要求"
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
