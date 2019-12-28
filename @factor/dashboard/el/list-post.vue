<template>
  <div class="post-item">
    <div class="post-item-grid">
      <div class="selector">
        <input v-model="checked" type="checkbox" class="checkbox" />
      </div>
      <div class="post-info">
        <div class="text-header">
          <factor-link :path="itemPath" class="title">{{ itemTitle }}</factor-link>
          <factor-link v-if="itemSubTitle" class="sub-title">{{ itemSubTitle }}</factor-link>
        </div>

        <div class="meta-information">
          <div v-for="(dataItem, index) in itemMeta" :key="index" class="data-item">
            <div v-if="dataItem.label" class="label">{{ dataItem.label }}</div>
            <div v-if="dataItem.value" class="value">{{ dataItem.value }}</div>
          </div>
          <div class="data-item">
            <div
              class="toggle-additional-information value"
              @click="moreInfoToggle = !moreInfoToggle"
            >
              <span v-if="moreInfoToggle">Less &uarr;</span>
              <span v-else>More &darr;</span>
            </div>
          </div>
        </div>
        <div v-if="moreInfoToggle" class="additional-information">
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
import { toLabel, postLink, stored, standardDate } from "@factor/api"
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
    value: { type: Array, default: () => [] }
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
      return `${this.$route.path}/edit?_id=${this.post._id}`
    },
    itemSubTitle(this: any): string {
      return this.subTitle || this.post.permalink
    },
    itemMeta(this: any): PostListDataItem[] {
      return this.meta && this.meta.length > 0
        ? this.meta
        : [
            { value: toLabel(this.post.status) },
            {
              label: "by",
              value: this.getAuthorNames(this.post.author)
            },
            {
              label: "on",
              value: standardDate(this.post.date)
            }
          ]
    },
    itemAdditional(this: any): PostListDataItem[] {
      const additional =
        this.additional && this.additional.length > 0
          ? this.additional
          : [
              { label: "synopsis", value: this.post.synopsis },
              {
                label: "tags",
                value: ""
              },
              {
                label: "updated",
                value: standardDate(this.post.updatedAt)
              },
              {
                label: "created",
                value: standardDate(this.post.createdAt)
              }
            ]

      return additional.filter((_: PostListDataItem) => _.value)
    }
  },
  methods: {
    toLabel,
    postLink,
    getAuthorNames(authorIds: string[]) {
      return authorIds
        .map(_id => {
          return stored(_id) || {}
        })
        .map(_ => _.displayName)
        .join(", ")
    }
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
  }
  .text-header {
    margin-bottom: 0.5rem;
    .title,
    .sub-title {
      display: block;
      color: inherit;
      &:hover {
        color: var(--color-primary);
      }
    }
    .title {
      font-weight: 600;
      font-size: 1.2em;
      margin-bottom: 0.25rem;
    }
    .sub-title {
      opacity: 0.6;
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
