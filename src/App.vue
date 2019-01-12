<template>
  <router-view></router-view>
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: "app",
  mounted() {
    if (Cookies.get("token")) {
      this.$store.dispatch("getUserInfo");
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>


