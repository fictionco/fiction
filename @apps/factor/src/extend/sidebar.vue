<template>
  <div class="plugins-sidebar">
    <div v-if="extensionIndex.length > 0" class="sidebar-inner">
      <section class="plugins-new">
        <header class="section-header">
          <h1 class="title">New</h1>
        </header>
        <factor-link
          v-for="(item, index) in pluginsNew"
          :key="index"
          :path="extensionPermalink({ name: item._id })"
          class="sidebar-plugin"
        >
          <div class="sidebar-plugin-image">
            <img :src="extensionImage(item)" :alt="item.name" />
          </div>

          <div class="entry-content">
            <h3 class="title">{{ titleFromPackage(item) }}</h3>
            <div class="meta">
              <div v-if="item.time.created" class="released">{{ standardDate(item.time.created) }}</div>
            </div>
          </div>
        </factor-link>
      </section>

      <section class="plugins-updated">
        <header class="section-header">
          <h1 class="title">Updated</h1>
        </header>
        <factor-link
          v-for="(item, i) in pluginsRecentlyUpdated"
          :key="i"
          :path="extensionPermalink({ name: item._id })"
          class="sidebar-plugin"
        >
          <div class="sidebar-plugin-image">
            <img :src="extensionImage(item)" :alt="item.name" />
          </div>
          <div class="entry-content">
            <h3 class="title">{{ titleFromPackage(item) }}</h3>
            <div class="meta">
              <div v-if="item.time.created" class="released">{{ standardDate(item.time.modified) }}</div>
            </div>
          </div>
        </factor-link>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import { standardDate } from "@factor/api"
import { factorLink } from "@factor/ui"

import { getIndexCache } from "./request"
import { titleFromPackage, extensionPermalink, extensionImage } from "./util"
export default {
  components: { factorLink },
  data() {
    return {
      num: 5,
    }
  },
  computed: {
    extensionIndex() {
      return getIndexCache("plugin") || []
    },
    pluginsNew(this: any) {
      const getNew = [].slice
        .call(this.extensionIndex)
        .sort((a, b) => b.time.created - a.time.created)

      return getNew.slice(0, this.num)
    },
    pluginsRecentlyUpdated(this: any) {
      const getRecentlyUpdated = [].slice
        .call(this.extensionIndex)
        .sort((a, b) => b.time.modified - a.time.modified)

      return getRecentlyUpdated.slice(0, this.num)
    },
  },
  methods: {
    titleFromPackage,
    extensionPermalink,
    extensionImage,
    standardDate,
  },
}
</script>

<style lang="less">
.plugins-sidebar {
  padding: 0;

  .section-header {
    .title {
      font-size: 1em;
      text-transform: uppercase;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.5px;
      opacity: 0.5;
      @media (max-width: 900px) {
        font-size: 1.7em;
        line-height: 1.2;
      }
    }
  }

  .plugins-new .section-header {
    margin: 0 0 1rem;
  }

  .plugins-updated .section-header {
    margin: 2rem 0 1rem;
  }

  .plugins-new,
  .plugins-updated {
    .sidebar-plugin {
      display: grid;
      grid-template-columns: auto 3fr;
      grid-gap: 1rem;
      padding: 0.5rem 0;
      border-radius: 6px;
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      position: relative;
      color: var(--color-text);
      &:hover {
        background: #f6f9fc;
        .entry-content .title {
          color: var(--color-primary);
        }
      }

      .sidebar-plugin-image {
        display: flex;
        justify-content: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transform-origin: right top;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .entry-content {
        .title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          font-size: 0.8rem;
        }
      }

      @media (max-width: 900px) {
        .sidebar-plugin-image {
          height: 50px;
          width: 50px;
        }
        .entry-content {
          .title {
            font-size: 1.3em;
          }
          .meta {
            font-size: 1em;
          }
        }
      }
    }
  }
}
</style>
