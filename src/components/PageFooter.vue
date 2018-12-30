<template>
  <div class="page-footer">
    <div class="footer-main">
      <span>您好！现在是{{ momentStr }}</span>
      <span>开发者：dragon_cat</span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      moment: moment()
    };
  },
  mounted() {
    this.getcurrTime();
  },
  computed: {
    momentStr() {
      return this.moment.format("YYYY年MM月DD日 dddd HH:mm:ss");
    }
  },
  methods: {
    getcurrTime() {
      this.timer = window.setInterval(() => {
        this.moment = moment();
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.page-footer {
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 0;
  right: 0;
  height: 30px;
  background: rgba(94, 94, 94, 0.8);
  color: #fff;
  .footer-main {
    font-size: 12px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
  }
}
</style>

