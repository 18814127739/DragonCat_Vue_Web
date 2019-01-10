<template>
  <div class="page-container">
    <PageBar />
    <main>
      <slot></slot>
    </main>
    <PageFooter />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.page-container {
  position: relative;
  min-height: 100%;
  background: white;
}
</style>
