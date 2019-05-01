<template>
  <dashboard-page>
    <dashboard-pane>
      <div class="four04">
        <div class="pad">
          <div class="title">Not Found (404)</div>
          <dashboard-link path="/dashboard" btn="primary">Go to Dashboard</dashboard-link>
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
    font-weight: 600;
    margin-bottom: 1em;
  }
}
</style>
