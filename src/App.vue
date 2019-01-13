<template>
  <router-view></router-view>
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: "app",
  mounted() {
    const loginPath = "/login";
    if (Cookies.get("token") && window.location.pathname !== loginPath) {
      // 当cookie没有过期且不为登录页时请求用户信息
      this.$store.dispatch("getUserInfo");
    }
  }
};
</script>

<style lang="less" scoped>
</style>


