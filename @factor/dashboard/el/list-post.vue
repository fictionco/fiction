<template>
  <div class="post-item">
    <div class="post-item-grid">
      <div class="selector">
        <input v-model="checked" type="checkbox" class="checkbox" />
      </div>
      <div class="post-info">
        <div v-if="itemAvatar" class="post-media">
          <factor-link :path="itemPath" class="post-avatar">
            <img :src="itemAvatar" alt="Avatar" />
          </factor-link>
        </div>
        <div class="text-header">
          <div v-if="clickEvent" class="title click-title" @click="clickEvent(post)">{{ itemTitle }}</div>
          <factor-link v-else :path="itemPath" class="title">{{ itemTitle }}</factor-link>
          <div v-if="itemSubTitle" class="sub-title">{{ itemSubTitle }}</div>
        </div>

        <div class="meta-information">
          <div v-for="(dataItem, index) in itemMeta" :key="index" class="data-item">
            <div v-if="dataItem.label" class="label">{{ dataItem.label }}</div>
            <div v-if="dataItem.value" class="value">{{ dataItem.value }}</div>
          </div>
          <div v-if="itemAdditional.length > 0" class="data-item">
            <div
              class="toggle-additional-information value"
              @click="moreInfoToggle = !moreInfoToggle"
            >
              <span v-if="moreInfoToggle">{{ toggle.hide }} &uarr;</span>
              <span v-else>{{ toggle.show }} &darr;</span>
            </div>
          </div>
        </div>
        <div v-if="moreInfoToggle && itemAdditional" class="additional-information">
          <div class="additional-items">
            <div v-for="(dataItem, i) in itemAdditional" :key="i" class="data-item">
              <div v-if="dataItem.label" class="label">{{ toLabel(dataItem.label) }}</div>
              <div v-if="dataItem.value" class="value">{{ dataItem.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { factorLink } from "@factor/ui"
import { toLabel, postLink, stored } from "@factor/api"

import { PostListDataItem } from "../types"
export default Vue.extend({
  components: { factorLink },
  //model: { prop: "checked", event: "change" },
  props: {
    post: { type: Object, default: () => {} },
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    meta: { type: Array, default: () => [] },
    additional: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    toggle: { type: Object, default: () => ({ show: "More", hide: "Less" }) },
    editPath: { type: [String, Boolean], default: true },
    clickEvent: { type: [Function, Boolean], default: false }
  },
  data() {
    return {
      moreInfoToggle: false
    }
  },
  computed: {
    checked: {
      get(this: any): boolean {
        return this.value.includes(this.post._id)
      },
      set(this: any, localValue: boolean) {
        let newValue = this.value
        const index = newValue.indexOf(this.post._id)

        if (!localValue && index != -1) {
          newValue.splice(index, 1)
        } else if (index == -1) {
          newValue = [...this.value, this.post._id]
        }

        this.$emit("input", newValue)
      }
    },

    itemTitle(this: any): string {
      return this.title || this.post.title
    },
    itemPath(this: any): string {
      let p = ""
      if (this.editPath === true) {
        p = `${this.$route.path}/edit?_id=${this.post._id}`
      } else if (this.editPath) {
        p = this.editPath
      }
      return p
    },
    itemSubTitle(this: any): string {
      return this.subTitle || this.post.permalink
    },
    itemMeta(this: any): PostListDataItem[] {
      return this.meta && this.meta.length > 0 ? this.meta : []
    },
    itemAdditional(this: any): PostListDataItem[] {
      const additional =
        this.additional && this.additional.length > 0 ? this.additional : []

      return additional.filter((_: PostListDataItem) => _.value)
    },
    itemAvatar(this: any) {
      const avatar = stored(this.post.avatar)

      return avatar && avatar.url ? avatar.url : ""
    }
  },
  methods: {
    toLabel,
    postLink
  }
})
</script>
<style lang="less">
.post-item {
  border-bottom: 1px solid rgba(136, 152, 170, 0.2);
  &:last-child {
    border-bottom: none;
  }

  padding: 1.5rem 0;
  .post-item-grid {
    display: grid;
    grid-template-columns: 2rem 1fr;
    .selector {
      padding-top: 2px;
    }
    .post-info {
      min-width: 0;
    }
    .post-media {
      float: right;
      text-align: right;
      .post-avatar {
        display: inline-block;
      }
      img {
        display: inline-block;
        max-width: 100%;
        border-radius: 7px;
        max-height: 64px;
      }
    }
    @media (max-width: 700px) {
      .post-media {
        float: none;
        text-align: left;
        margin-bottom: 0.5rem;
      }
    }
  }
  .text-header {
    margin-bottom: 0.5rem;
    .title,
    .sub-title {
      display: block;
      color: inherit;
    }
    .title {
      white-space: pre-wrap;
      font-weight: 600;
      font-size: 1.2em;
      margin-bottom: 0.25rem;
    }
    a:hover,
    .title.click-title:hover {
      cursor: pointer;
      color: var(--color-primary);
    }
    .sub-title {
      opacity: 0.6;
    }
    @media (max-width: 900px) {
      .title {
        font-size: 1.1em;
      }
    }
  }
  .data-item {
    .label {
      opacity: 0.7;
    }
    .value {
      font-weight: 600;
    }
  }
  .meta-information {
    display: flex;
    flex-wrap: wrap;
    line-height: 1.7;
    overflow-x: scroll;
    .data-item {
      margin-right: 1rem;
      display: inline-block;
      white-space: nowrap;
      .value,
      .label {
        display: inline-block;
      }
    }
  }
  .additional-information {
    padding: 0.5rem 0;

    .data-item {
      margin-top: 0.5rem;
    }
  }
  .toggle-additional-information {
    opacity: 0.8;
    color: var(--color-primary);
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--color-secondary);
      opacity: 1;
    }
  }
}
</style>
