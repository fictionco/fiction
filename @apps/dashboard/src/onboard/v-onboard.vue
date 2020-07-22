<template>
  <dashboard-wrapper class="onboard-view" :menu="menu" ppp="1">
    <template #head>
      <div class="darwin-logo">
        <logo scheme="standard" />
      </div>
    </template>
    <template #nav>
      <div class="onboard-menu">
        <div class="title">Get Started</div>
      </div>
    </template>
  </dashboard-wrapper>
</template>
<script lang="ts">
import { MenuGroup } from "@factor/ui/dashboard/types"
import dashboardWrapper from "@factor/ui/dashboard/wrapper.vue"

export default {
  components: { dashboardWrapper, logo: () => import("../el/logo.vue") },

  data() {
    return {
      menu: [
        {
          group: "Get Started",
          menu: [
            { name: "Welcome", query: { step: 1 } },
            { name: "Add Website", query: { step: 2 } },
            { name: "Tracking Script", query: { step: 3 } },
            { name: "Invite Team", query: { step: 4 } },
          ],
        },
      ] as MenuGroup[],
    }
  },
}
</script>
<style lang="postcss">
.onboard-view {
  .manager-header {
    .darwin-logo {
      text-align: center;
      svg {
        width: 120px;
        margin-right: 0.75rem;
      }
    }
  }
  .onboard-menu {
    padding: 1rem;
    .title {
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.85em;
      letter-spacing: 0.02em;
    }
  }
}
</style>
