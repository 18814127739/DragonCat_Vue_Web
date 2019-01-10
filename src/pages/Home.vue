<template>
  <PageContainer class="home-page">
    <Periodictable v-if="index === 0" />
    <SkyBox v-if="index === 1" />
    <ThreeEarth v-if="index === 2" />
  </PageContainer>
</template>
<script>
import Periodictable from "@components/Periodictable";
import SkyBox from "@components/SkyBox";
import ThreeEarth from "@components/ThreeEarth";

export default {
  name: "home",
  components: {
    Periodictable,
    SkyBox,
    ThreeEarth
  },
  data() {
    return {
      index: 0
    };
  },
  mounted() {
    this.initNum();
  },
  methods: {
    initNum() {
      this.index = parseInt(Math.random() * 3);
    }
  }
};
</script>

