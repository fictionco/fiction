<template>
  <div class="el-table">
    <h1>Choose the suite that's right for you.</h1>
    <div class="table-header">
      <div class="table-row">
        <div class="col col-label" />
        <div v-for="(item, i) in header" :key="i" class="col col-header" :class="`col-${item.id}`">
          <div class="super">{{ item.super }}</div>
          <h2>{{ toLabel(item.id) }}</h2>
          <div v-formatted-text="item.sub" class="sub" />
          <div class="action">
            <factor-link v-if="item.id == 'community'" btn="default" disabled>Free Forever</factor-link>
            <factor-link
              v-else
              btn="primary"
              path="/checkout"
              :query="{product: item.id}"
            >Upgrade &rarr;</factor-link>
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
          <div v-if="child.community" v-formatted-text="child.community" class="col-value" />
          <div v-else-if="child.level <= 0" class="col-value mobile-label">
            <factor-icon icon="fas fa-check" />
            <span>Community</span>
          </div>
          <factor-icon v-else icon="fas fa-minus" />
        </div>
        <div class="col col-icon col-pro">
          <div v-if="child.pro" v-formatted-text="child.pro" class="col-value" />
          <div v-else-if="child.level <= 10" class="col-value mobile-label">
            <factor-icon icon="fas fa-check" />
            <span>Pro</span>
          </div>

          <factor-icon v-else icon="fas fa-minus" />
        </div>
        <div class="col col-icon col-business">
          <div v-if="child.business" v-formatted-text="child.business" class="col-value" />
          <div v-else-if="child.level <= 20" class="col-value mobile-label">
            <factor-icon icon="fas fa-check" />
            <span>Business</span>
          </div>
          <factor-icon v-else icon="fas fa-minus" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { toLabel } from "@factor/api"
import { factorIcon, factorLink } from "@factor/ui"
export default {
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
          sub: "Premium features, extensions, &amp; support",
        },
        {
          super: "For Businesses",
          id: "business",
          sub: "Pro plus business enhancements",
        },
      ],
      groups: [
        {
          title: "Basics",
          icon: "description",
          children: [
            {
              title: "Price",
              community: "Free",
              pro: "$29/mo <span class='add'>Paid Yearly</span>",
              business: "$59/mo <span class='add'>Paid Yearly</span>",
            },
            {
              title: "Unlimited Domains (You Own)",
              level: 0,
            },
            {
              title: "Money-Back Guarantee",
              level: 10,
            },
          ],
        },
        {
          title: "Extensions",
          icon: "extension",
          children: [
            {
              title: "Community Extensions",
              level: 0,
            },
            {
              title: "Free Extensions",
              level: 0,
            },
            {
              title: "Pro Extensions",
              level: 10,
            },
            {
              title: "Pro Features &amp; Settings",
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
              title: "Community Support",
              level: 0,
            },
            {
              title: "Premium Technical Support",
              level: 10,
            },
            {
              title: "Priority Support with Debugging*",
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
              title: "Sustain Ongoing Development",
              level: 10,
            },
            {
              title: "Priority Feature Requests",
              level: 10,
            },
            {
              title: "New Extensions Monthly",
              level: 10,
            },
          ],
        },
      ],
    }
  },
  methods: { toLabel },
}
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

    .group-title {
      text-transform: uppercase;
      font-size: 1.2em;
      font-weight: var(--font-weight-bold, 700);
    }
    @media (max-width: 900px) {
      display: flex;
      justify-content: center;
      align-items: center;
      .group-title {
        margin-left: 0.5rem;
      }
    }
  }

  .table-header {
    margin: 0 0 0.5rem;
  }
  .area-title {
    font-size: 1em;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-secondary);
    opacity: 0.6;
    padding: 1rem 0 0.5rem;

    text-transform: uppercase;
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
      .mobile-label {
        font-size: 0.8em;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: var(--font-weight-bold, 700);
      }
      .col-value {
        .fa-check {
          opacity: 0.5;
          margin-right: 0.25rem;
        }
        .add {
          display: block;
          font-size: 11px;
          opacity: 0.3;
          text-transform: uppercase;
        }
      }
    }
    @media (max-width: 900px) {
      grid-gap: 0.5rem;
      grid-template-columns: 1fr;
      &.feature-row {
        grid-template-columns: repeat(3, 1fr);
        .col-label {
          text-align: center;
          display: block;
          padding: 1.5rem 0 0;
          grid-column: ~"1 / 4";
        }
        .mobile-label {
          display: block;
        }
      }
      .col {
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        .factor-icon {
          display: none;
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
      box-shadow: 0 1px 1px rgba(50, 50, 93, 0.11), 0px 5px 5px rgba(50, 50, 93, 0.05),
        0px 5px 15px rgba(50, 50, 93, 0.11);
      border-radius: 5px;
      padding: 2rem;
      h2 {
        //font-size: 1.2em;
        font-size: 1.6em;
        font-weight: var(--font-weight-bold, 700);
      }
      .super {
        text-transform: uppercase;
        font-size: 13px;
        color: var(--color-text-secondary);
        //opacity: 0.7;
      }
      .sub {
        margin-top: 0.5rem;
        //font-size: 0.85em;
        font-size: 1rem;
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
