<template>
  <div class="page-bar bg-f0fff0-00e5ee">
    <div class="pull-left">
      <img
        @click="jump('home')"
        src="../assets/imgs/head.jpg"
      />
      <label @click="jump('home')">{{userName}}</label>
    </div>
    <div class="pull-right">
      <router-link
        v-for="item in menus"
        :key="item.id"
        :to="{ name: item.pathname }"
        :class="curMenu === item.id ? 'active' : null"
      >
        {{item.name}}
      </router-link>
    </div>
  </div>
</template>

<script>
const menuRouteMap = {
  "personal-page": 0,
  "poems-with-future": 1,
  "new-poem": 1,
  "edit-poem": 1,
  "IT-note": 2,
  "photo-wall": 3
};

export default {
  data() {
    return {
      curMenu: 0,
      menus: [
        { id: 0, name: "个人主页", pathname: "personal-page" },
        { id: 1, name: "诗与远方", pathname: "poems-with-future" },
        { id: 2, name: "技术笔记", pathname: "IT-note" },
        { id: 3, name: "照片墙", pathname: "photo-wall" }
      ]
    };
  },
  mounted() {
    this.curMenu = menuRouteMap[this.$router.currentRoute.name];
  },
  computed: {
    userName() {
      return this.$store.state.userInfo.userName || "";
    }
  },
  methods: {
    jump(pathname) {
      this.$router.push({ name: pathname });
    }
  }
};
</script>

<style lang="less" scoped>
.page-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 32px;
  .pull-left {
    display: flex;
    align-items: center;
    img {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      -webkit-box-shadow: 0 0px 10px rgba(0, 0, 0, 0.15);
      box-shadow: 0 0px 10px rgba(0, 0, 0, 0.15);
      cursor: pointer;
    }
    label {
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      margin-left: 8px;
      color: #9b30ff;
    }
  }
  .pull-right {
    display: flex;
    align-items: center;
    .active {
      color: #9b30ff;
    }
    a {
      font-size: 14px;
      margin-left: 24px;
      color: #6f6f6f;
      text-decoration: none;
      padding: 12px 0;
    }
    a:hover {
      color: #9b30ff;
    }
    .selected {
      color: #9b30ff;
    }
  }
}
</style>
