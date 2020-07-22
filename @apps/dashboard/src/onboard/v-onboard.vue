<template>
  <dashboard-wrapper class="onboard-view">
    <template #head>
      <div class="darwin-logo">
        <logo scheme="standard" />
      </div>
    </template>
    <template #nav>
      <div class="onboard-menu">
        <div class="title">Getting You Started</div>
        <div class="menu-items">
          <div v-for="(item, i) in menu" :key="i" class="item">
            <div class="icon">
              <div class="icon-wrap">
                <factor-icon icon="fas fa-check" />
              </div>
            </div>
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </template>
    <dashboard-page title="Welcome to Darwin Analytics">
      <dashboard-panel>
        <p>The Darwin team would like to welcome you and give you a tour of the product.</p>
        <p>
          We are doing our best to fit Darwin to your needs, so we welcome your feedback and suggestions. Send us an email at
          <a
            href="mailto:hello@darwin.dev"
          >hello@darwin.dev</a>
        </p>
      </dashboard-panel>
    </dashboard-page>
  </dashboard-wrapper>
</template>
<script lang="ts">
import { factorIcon, dashboardPage, dashboardPanel } from "@factor/ui"
import dashboardWrapper from "@factor/ui/dashboard/wrapper.vue"

export default {
  components: {
    factorIcon,
    dashboardWrapper,
    dashboardPage,
    dashboardPanel,
    logo: () => import("../el/logo.vue"),
  },

  data() {
    return {
      menu: [
        { name: "Welcome", query: { step: 1 } },
        { name: "Add Website", query: { step: 2 } },
        { name: "Tracking Script", query: { step: 3 } },
        { name: "Invite Team", query: { step: 4 } },
      ],
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
    .menu-items {
      margin: 1rem 0;

      .item {
        padding: 0.5rem;
        display: grid;
        grid-template-columns: 2rem 1fr;
        grid-gap: 0.5rem;
        .icon-wrap {
          background-color: var(--color-primary);
          color: #fff;
          border-radius: 2rem;
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          text-align: center;
          line-height: 1.5rem;
          .factor-icon {
            font-size: 0.8em;
          }
        }
        .text {
          font-size: 1.1em;
        }
      }
    }
  }
}
</style>
