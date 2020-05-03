<template>
  <div class="el-table">
    <h1>Choose the suite that's right for you.</h1>
    <div class="table-header">
      <div class="table-row">
        <div class="col col-label" />
        <div v-for="(item, i) in header" :key="i" class="col col-header" :class="`col-${item.id}`">
          <div class="super">{{ item.super }}</div>
          <h2>{{ toLabel(item.id) }}</h2>
          <div class="sub">{{ item.sub }}</div>
          <div class="action">
            <factor-link v-if="item.id == 'community'" btn="default">Current Plan</factor-link>
            <factor-link v-else btn="primary" path="/checkout" :query="{plan: item.id}">Get Started</factor-link>
          </div>
        </div>
      </div>
    </div>
    <h2 class="area-title">Compare Benefits</h2>
    <section v-for="(group, i) in groups" :key="i" class="feature-group">
      <div class="group-header">
        <plan-icon :icon="group.icon" />
        <h2 v-formatted-text="group.title" class="group-title" />
      </div>
      <div v-for="(child, ii) in group.children" :key="ii" class="table-row feature-row">
        <div class="col col-label">
          <div class="label-wrap">
            <span v-formatted-text="child.title" class="label" />
          </div>
        </div>
        <div class="col col-icon col-community">
          <factor-icon v-if="child.level <= 0" icon="fas fa-check" />
          <factor-icon v-else icon="fas fa-minus" />
        </div>
        <div class="col col-icon col-pro">
          <factor-icon v-if="child.level <= 10" icon="fas fa-check" />
          <factor-icon v-else icon="fas fa-minus" />
        </div>
        <div class="col col-icon col-business">
          <factor-icon v-if="child.level <= 20" icon="fas fa-check" />
          <factor-icon v-else icon="fas fa-minus" />
        </div>
      </div>
    </section>
    <div class="table-header">
      <div class="table-row">
        <div class="col col-label" />
        <div v-for="(item, i) in header" :key="i" class="col col-header" :class="`col-${item.id}`">
          <div class="super">{{ item.super }}</div>
          <h2>{{ toLabel(item.id) }}</h2>
          <div class="sub">{{ item.sub }}</div>
          <div class="action">
            <factor-btn v-if="item.id == 'community'" btn="default">Current Plan</factor-btn>
            <factor-btn v-else btn="primary">Get Started</factor-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { toLabel } from "@factor/api"
import { factorIcon, factorLink } from "@factor/ui"
export default Vue.extend({
  components: { factorIcon, factorLink, planIcon: () => import("./icons.vue") },
  metaInfo() {
    return {
      title: "Choose Your Plan",
      description: "Ready to upgrade your Factor platorm?",
    }
  },
  data() {
    return {
      header: [
        {
          super: "For hobbyists",
          id: "community",
          sub: "Core and community tools",
        },
        {
          super: "For Professionals",
          id: "pro",
          sub: "Premium features and extensions",
        },
        {
          super: "For Businesses",
          id: "business",
          sub: "Pro plus business enhancements",
        },
      ],
      groups: [
        {
          title: "Extensions",
          icon: "extension",
          children: [
            {
              title: "Community extensions",
              level: 0,
            },
            {
              title: "Free extensions",
              level: 0,
            },
            {
              title: "Pro extensions",
              level: 10,
            },
            {
              title: "Additional features &amp; settings",
              level: 10,
            },
          ],
        },
        {
          title: "Features",
          icon: "assignment",
          children: [
            {
              title: "Core Framework",
              level: 0,
            },
            {
              title: "CMS Dashboard",
              level: 0,
            },
            {
              title: "Pro CMS Dashboard",
              level: 10,
            },
            {
              title: "White Label",
              level: 20,
            },
            {
              title: "Business Dashboard",
              level: 20,
            },
          ],
        },
        {
          title: "Help &amp; Support",
          icon: "supervisor",
          children: [
            {
              title: "Community support",
              level: 0,
            },
            {
              title: "Premium technical support",
              level: 10,
            },
            {
              title: "Priority support with debugging*",
              level: 20,
            },
          ],
        },
        {
          title: "Other Benefits",
          icon: "stars",
          children: [
            {
              title: "Satisfaction Guaranteed",
              level: 0,
            },
            {
              title: "Sustain ongoing development",
              level: 10,
            },
            {
              title: "Priority feature requests",
              level: 10,
            },
            {
              title: "New extensions monthly",
              level: 10,
            },
          ],
        },
      ],
    }
  },
  methods: { toLabel },
})
</script>
<style lang="less">
.el-table {
  h1 {
    padding: 0.5rem 0;
    font-size: 1.5em;
    font-weight: var(--font-weight-bold, 700);
    margin-bottom: 2rem;
  }

  .feature-group {
    padding: 1rem 0 2rem;
    border-top: 1px solid var(--color-border);
  }
  .group-header {
    padding: 1rem;
    display: grid;
    grid-template-columns: 2rem 1fr;
  }
  .group-title {
    font-size: 1.3em;
    font-weight: var(--font-weight-bold, 700);
  }
  .table-header {
    margin: 0 0 0.5rem;
  }
  .area-title {
    font-size: 1.2em;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-secondary);
    opacity: 0.6;
    padding: 1rem 0 0.5rem;
  }
  .table-row {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) repeat(3, 1fr);
    grid-gap: 1rem;
    &.feature-row {
      &:hover {
        background: var(--color-bg-contrast);
        border-radius: 8px;
        cursor: pointer;
      }

      .col-label {
        display: grid;
        grid-template-columns: 2rem 1fr;
        font-weight: var(--font-weight-bold, 700);
        .label-wrap {
          grid-column: ~"2 / 3";
          .label {
            position: relative;
          }
          .label:before {
            background-image: linear-gradient(90deg, #a6adc9 33%, transparent 0);
            background-position: bottom;
            background-repeat: repeat-x;
            background-size: 3px 1px;
            content: "";
            display: block;
            height: 1px;
            left: 0;
            position: absolute;
            top: 100%;
            width: 100%;
          }
        }
      }
    }

    .col {
      padding: 1rem;
      min-width: 0;
    }
    .col-header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--color-border);
      border-radius: 5px;
      h2 {
        font-size: 1.2em;
        font-weight: var(--font-weight-bold, 700);
      }
      .super {
        text-transform: uppercase;
        font-size: 12px;
        color: var(--color-text-secondary);
        opacity: 0.7;
      }
      .sub {
        margin-top: 0.5rem;
        font-size: 0.85em;
        line-height: 1.3;
      }
      .action {
        margin-top: 1rem;
      }
    }

    .col-icon {
      text-align: center;
      .fa-check {
        color: var(--color-primary);
      }
      .fa-minus {
        opacity: 0.1;
      }
    }
  }
}
</style>
