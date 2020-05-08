<template>
  <div class="list-item">
    <div v-if="avatar" class="post-media">
      <factor-link :path="editPath" class="post-avatar">
        <img :src="avatar" alt="Avatar" />
      </factor-link>
    </div>
    <div class="text-header">
      <div class="title">
        <factor-link :path="editPath">{{ title }}</factor-link>
      </div>
      <div class="description">{{ subTitle }}</div>
    </div>
    <div class="meta-information">
      <div v-for="(dataItem, index) in meta" :key="index" class="data-item">
        <div v-if="dataItem.tag" class="tag">{{ dataItem.tag }}</div>
        <factor-link v-else-if="dataItem.path" :path="dataItem.path">{{ dataItem.label }}</factor-link>
        <template v-else>
          <div v-if="dataItem.label" class="label">{{ dataItem.label }}:</div>
          <div class="value">{{ dataItem.value }}</div>
        </template>
      </div>
      <div class="data-item">
        <div class="toggle-additional-information value" @click="toggle = !toggle">
          <span v-if="toggle">{{ toggleText.hide }} &uarr;</span>
          <span v-else>{{ toggleText.show }} &darr;</span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="toggle" class="additional-information">
        <div class="additional-items">
          <div v-for="(dataItem, index) in additional" :key="index" class="data-item">
            <div class="label">{{ dataItem.label }}:</div>
            <div class="value">{{ dataItem.value }}</div>
          </div>
          <div v-if="$slots.actions" class="actions data-item">
            <div class="label">Actions</div>
            <div class="value actions-items">
              <slot name="actions" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { standardDate, toLabel } from "@factor/api"
import { factorLink } from "@factor/ui"
export default Vue.extend({
  name: "DashboardListItem",
  components: { factorLink },
  props: {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    avatar: { type: String, default: "" },
    meta: { type: Array, default: () => [] },
    additional: { type: Array, default: () => [] },
    editPath: { type: String, default: "" },
    clickEvent: { type: [Function, Boolean], default: false },
  },
  data() {
    return {
      toggle: false,
      toggleText: { show: "More", hide: "Less" },
    }
  },
  computed: {},
  methods: {
    standardDate,
    toLabel,
  },
})
</script>
<style lang="less">
.data-item {
  .additional-information .actions .factor-btn {
    margin-right: 1rem;
  }
}
</style>
<style lang="less" scoped>
.list-item {
  .fade-enter-active {
    transition: opacity 0.2s;
  }
  .fade-enter {
    opacity: 0;
  }

  border-bottom: 1px solid var(--color-border);
  padding: 1.5rem 0;
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1400px) {
    padding: 1rem 0;
  }

  .text-header {
    margin-bottom: 0.5rem;
    .title {
      font-size: 1.2em;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 0.25rem;
      a {
        color: inherit;
        &:hover {
          color: var(--color-primary);
        }
      }
    }
    .description {
      color: var(--color-text-secondary);
    }
  }

  .meta-information {
    font-size: 0.9em;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.7;
    overflow-x: scroll;
    align-items: center;
    .data-item {
      margin-right: 1rem;
      display: inline-block;
      white-space: nowrap;
      .value,
      .label {
        display: inline-block;
      }
      .label {
        color: var(--color-text-secondary);
      }
      // .tag {
      //   background: var(--color-bg-contrast);
      //   border-radius: 5px;
      //   font-size: 0.85em;
      //   padding: 0 0.5rem;
      //   color: var(--color-text-secondary);
      //   font-weight: var(--font-weight-bold, 700);
      // }
    }
  }

  .tag,
  .toggle-additional-information {
    background: var(--color-bg-contrast);
    border-radius: 5px;
    font-size: 0.85em;
    padding: 0 0.5rem;
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-bold, 700);
  }
  .toggle-additional-information {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
      background: var(--color-bg-highlight);
    }
  }
  .additional-information {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 3px solid var(--color-border);
    .data-item {
      margin: 1rem 0;
      .label {
        font-weight: var(--font-weight-bold, 700);
        text-transform: uppercase;
        font-size: 0.8em;
        opacity: 0.4;
        margin-bottom: 0.5rem;
      }
    }
    .actions {
      .factor-btn {
        margin-right: 1rem;
      }
    }
  }
}
</style>
