<template>
  <div class="content-layout">
    <div class="mast">
      <fiction-pin class="icon" />
      <h1>{{ siteName }}</h1>
      <h4>{{ description }}</h4>
      <div class="action">
        <app-btn>Visit Docs</app-btn>
      </div>
    </div>
  </div>
</template>
<style src="./css/style.less" lang="less"></style>
<script>
import { name, description } from "../package"
export default {
  components: {
    "fiction-pin": () => import("./el/pin"),
    "app-btn": () => import("./el/btn")
  },
  computed: {
    siteName() {
      return this.$utils.toLabel(name)
    },
    description() {
      return description
    }
  }
}
</script>

<style lang="less">
.content-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .mast {
    text-align: center;
    .icon {
      margin-bottom: 1em;
    }
    h1,
    h4 {
      letter-spacing: -0.02em;
    }
    h1 {
      font-size: 3em;
    }

    h4 {
      font-size: 1.5em;
      opacity: 0.4;
    }
    .action {
      margin-top: 3em;
    }
  }
}
</style>