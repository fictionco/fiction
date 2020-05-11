<template>
  <dashboard-page title="Developer" class="api-panel">
    <dashboard-panel title="API Keys">
      <div class="details">
        <h2 class="title">Plugins API Key</h2>
        <div class="sub-title">
          Add to your app's environmental variables as
          <strong>FACTOR_API_KEY</strong>
        </div>
      </div>
      <dashboard-input v-model="key" input="factor-input-text" class="api-key-text" readonly />
    </dashboard-panel>
  </dashboard-page>
</template>
<script lang="ts">
import { dashboardPage, dashboardPanel, dashboardInput } from "@factor/ui"
import { userInitialized } from "@factor/api"

export default {
  components: { dashboardPage, dashboardPanel, dashboardInput },
  data() {
    return { key: "", sending: false }
  },
  async mounted() {
    const user = await userInitialized()

    if (user && user.developer) {
      this.key = user.developer.apiKey
    }
  },
}
</script>

<style lang="less">
.api-panel .dashboard-panel {
  .cont {
    padding: 5rem 2rem 7rem;
  }
  .details {
    .title {
      font-size: 1.5em;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .sub-title {
      font-size: 1.1em;
      opacity: 0.4;
    }
  }

  .api-key-text input {
    margin-top: 1rem;
    font-size: 1.3em;
    width: 700px;
  }

  .example {
    font-size: 12px;
    .slug {
      font-weight: 700;
      color: var(--color-primary);
    }
  }
}
</style>
