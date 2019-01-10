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
            :rules="rules"
            label-position="top"
          >
            <el-form-item
              label="账号："
              prop="account"
            >
              <el-input
                type="account"
                size="medium"
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
            :rules="rules"
            label-position="top"
          >
            <el-form-item
              label="账号："
              prop="account"
            >
              <el-input
                type="account"
                v-model="form2.account"
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
            <el-form-item
              label="确认密码："
              prop="confirmPwd"
            >
              <el-input
                type="password"
                v-model="form2.confirmPwd"
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
export default {
  data() {
    return {
      activeTab: "login",
      form: {},
      form2: {},
      rules: {}
    };
  },
  methods: {
    login() {
      console.log(this.form);
    },
    register() {
      console.log(this.form2);
    }
  }
};
</script>
<style lang="less">
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  .left-pane {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 500px;
    height: 500px;
    position: fixed;
    left: 10vw;
    .content {
      width: 340px;
      height: 340px;
      background: url("../assets/imgs/QR_code1.jpg") no-repeat center;
      background-size: cover;
      border-radius: 170px;
      position: relative;
      z-index: 3;
    }
  }
  .left-pane::before {
    content: "";
    background: url("../assets/imgs/pics/pic-line1.png") no-repeat;
    background-size: cover;
    display: block;
    width: 440px;
    height: 440px;
    margin: -220px 0 0 -220px;
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
    width: 500px;
    height: 500px;
    margin: -250px 0 0 -250px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    animation: backRotateMove infinite linear 8s;
  }
  .right-pane {
    position: fixed;
    width: 400px;
    top: 24vh;
    right: 10vw;
    .el-form {
      width: 100%;
      .el-form-item {
        margin-bottom: 12px;
        .el-form-item__label {
          padding: 0;
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
