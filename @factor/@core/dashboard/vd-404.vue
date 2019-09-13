<template>
  <dashboard-page>
    <dashboard-pane>
      <div class="four04">
        <div class="pad">
          <div class="title">Not Found (404)</div>
          <factor-link path="/dashboard" btn="primary">Go to Dashboard</factor-link>
        </div>
      </div>
    </dashboard-pane>
  </dashboard-page>
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="less">
.four04 {
  height: 60vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 2em;
    font-weight: var(--font-weight-bold);
    margin-bottom: 1em;
  }
}
</style>
