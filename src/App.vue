<template>
  <router-view></router-view>
</template>
<script>
import api from "@services";
export default {
  name: "app",
  mounted() {
    if (window.location.pathname !== "/login") {
      // 当cookie没有过期且不为登录页时请求用户信息
      api
        .getUserInfo()
        .then(res => {
          this.$store.commit("userInfoSuccess", {
            isLogin: true,
            userInfo: res.userInfo
          });
        })
        .catch(() => {
          const arr = window.location.pathname.split("/");
          let redirect = "/";
          if (arr[1]) {
            arr.splice(0, 1);
            redirect = arr.join("/");
          }
          this.$message({
            type: "warning",
            message: "登录已超时，请重新登录"
          });
          this.$router.replace({
            path: "/login",
            query: { redirect }
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>