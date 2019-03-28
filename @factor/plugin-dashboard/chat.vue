<template>
  <dashboard-pane class="dashboard-chat">
    <div class="content">
      <div v-formatted-text="title" class="title" />
      <div v-formatted-text="subTitle" class="sub-title" />
      <el-link
        btn="primary"
        path="https://fiction.page.link/discord"
        target="_blank"
      >Join the Fiction Chat Server</el-link>
    </div>
  </dashboard-pane>
</template>


<script>
export default {
  props: {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    btnpath: { type: String, default: "" }
  }
}
</script>

<style lang="less">
.dashboard-pane.dashboard-chat {
  overflow: hidden;
  font-weight: 500;
  line-height: 16px;

  background-image: url(./resource/chat.png);
  background-size: contain;
  background-position: center right;
  background-repeat: no-repeat;
  height: 100%;

  > .cont {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 1024px) {
    background: #fff;
    > .cont {
      grid-template-columns: 1fr;
    }
  }

  .content {
    padding: 3em 2.5em;
    line-height: 1.4;

    .title {
      font-size: 1.65em;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .sub-title {
      font-size: 1.2em;
      opacity: 0.5;
      margin-bottom: 0.5em;
      max-width: 70%;
      @media (max-width: 767px) {
        max-width: initial;
      }
    }
  }
}
</style>