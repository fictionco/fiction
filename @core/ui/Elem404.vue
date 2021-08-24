<template>
  <div class="fallback-page">
    <div class="fallback-page-pad">
      <div class="title">{{ title }}</div>
      <div class="sub-title">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

export default {
  name: "Four04",
  metaInfo() {
    return {
      title: `${this.errorText} Error`,
      description: `Looks like you've hit a ${this.errorText} error.`,
      meta: [{ name: "robots", content: "noindex" }],
    }
  },
  setup() {
    const route = useRoute()

    const errorText = computed(() => {
      return route.meta.error || 404
    })

    const details = computed(() => {
      let out

      out =
        route.meta.error == 403
          ? {
              title: "403 Error",
              subTitle: "You don't have permissions to access this page",
            }
          : {
              title: "404 Error",
              subTitle: "This page doesn't exist.",
            }

      return out
    })
    /**
     * Error Title
     */
    const title = computed(() => {
      return details.value.title
    })
    /**
     * Error Subtitle
     */
    const subTitle = computed(() => {
      return details.value.subTitle
    })

    if (process) {
      process.env.factorServerStatus = "404"
    }

    return { errorText, title, subTitle }
  },
}
</script>

<style lang="less">
.fallback-page {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .fallback-page-pad {
    max-width: 450px;
    margin: 0 auto;
    line-height: 1;
    text-align: center;
    padding: 1em;
  }
  .title {
    font-size: 3em;
  }
  .sub-title {
    font-size: 1.5em;
    opacity: 0.3;
    margin: 0.5em 0 1.5em;
  }
  .description {
    font-weight: 500;
    font-size: 1.2em;
    margin: 1em 0 2em;
  }
}
</style>
