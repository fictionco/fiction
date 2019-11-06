<template>
  <div class="plugins-sidebar">
    <div class="sidebar-inner">
      <section class="plugins-popular">
        <header class="section-header">
          <h1 class="title">Popular</h1>
        </header>
        <factor-link
          v-for="(item, index) in pluginsPopular"
          :key="index"
          :path="extensionPermalink({name: item._id})"
          class="sidebar-plugin"
        >
          <div class="sidebar-plugin-image">
            <img :src="extensionIcon(item)" :alt="item.name" />
          </div>

          <div class="entry-content">
            <h3 class="title">{{ titleFromPackage(item) }}</h3>
            <div class="meta">
              <div
                v-if="item.downloads"
                class="downloads"
              >{{ formatDownloads(item.downloads) }} downloads</div>
            </div>
          </div>
        </factor-link>
      </section>

      <section class="plugins-new">
        <header class="section-header">
          <h1 class="title">New</h1>
        </header>
        <factor-link
          v-for="(item, index) in pluginsNew"
          :key="index"
          :path="extensionPermalink({name: item._id})"
          class="sidebar-plugin"
        >
          <div class="sidebar-plugin-image">
            <img :src="extensionIcon(item)" :alt="item.name" />
          </div>

          <div class="entry-content">
            <h3 class="title">{{ titleFromPackage(item) }}</h3>
            <div class="meta">
              <div v-if="item.time.created" class="released">
                Released
                {{ standardDate(item.time.created) }}
              </div>
            </div>
          </div>
        </factor-link>
      </section>

      <section class="plugins-updated">
        <header class="section-header">
          <h1 class="title">Recently Updated</h1>
        </header>
        <factor-link
          v-for="(item, i) in pluginsRecentlyUpdated"
          :key="i"
          :path="extensionPermalink({name: item._id})"
          class="sidebar-plugin"
        >
          <div class="sidebar-plugin-image">
            <img :src="extensionIcon(item)" :alt="item.name" />
          </div>
          <div class="entry-content">
            <h3 class="title">{{ titleFromPackage(item) }}</h3>
            <div class="meta">
              <div v-if="item.time.created" class="released">
                Updated
                {{ standardDate(item.time.modified) }}
              </div>
            </div>
          </div>
        </factor-link>
      </section>
    </div>
  </div>
</template>
<script>
import {
  titleFromPackage,
  formatDownloads,
  extensionPermalink,
  extensionIcon
} from "./util"

import { standardDate } from "@factor/tools"
export default {
  props: {
    indexData: { type: Array, required: true }
  },
  data() {
    return {
      num: 8
    }
  },
  computed: {
    pluginsPopular: function() {
      let getPopular = [].slice.call(this.indexData).sort(function(a, b) {
        return b.downloads - a.downloads
      })

      return getPopular.slice(0, this.num)
    },
    pluginsNew: function() {
      let getNew = [].slice.call(this.indexData).sort(function(a, b) {
        return new Date(b.time.created) - new Date(a.time.created)
      })

      return getNew.slice(0, this.num)
    },
    pluginsRecentlyUpdated: function() {
      let getRecentlyUpdated = [].slice.call(this.indexData).sort(function(a, b) {
        return new Date(b.time.modified) - new Date(a.time.modified)
      })

      return getRecentlyUpdated.slice(0, this.num)
    }
  },
  methods: {
    titleFromPackage,
    formatDownloads,
    extensionPermalink,
    extensionIcon,
    standardDate
  }
}
</script>

<style lang="less">
// Plugins Sidebar
.plugins-sidebar {
  padding: 0;

  .section-header {
    .title {
      font-size: 1.6em;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;

      @media (max-width: 900px) {
        font-size: 1.7em;
        line-height: 1.2;
      }
    }
  }

  // POPULAR, NEW, AND RECENTLY UPDATED PLUGINS
  .plugins-popular .section-header {
    margin: 0 0 1rem;
  }

  .plugins-new,
  .plugins-updated {
    .section-header {
      margin: 2rem 0 1rem;
    }
  }

  .plugins-popular,
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
          font-weight: 500;
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
