<template>
  <div class="plugins-sidebar-container">
    <section if="pluginsPopular.length > 0" class="plugins-popular">
      <header class="section-header">
        <h1 class="title">Popular</h1>
      </header>
      <factor-link
        v-for="(item, index) in pluginsPopular"
        :key="index"
        :path="`/plugin/${encodeURIComponent(item.permalink)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div class="rating">{{ excerpt(item.synopsis) }}</div>
          </div>
        </div>
      </factor-link>
    </section>

    <section v-if="pluginsTopNew.length > 0" class="plugins-top-new">
      <header class="section-header">
        <h1 class="title">Top New</h1>
      </header>
      <factor-link
        v-for="(item, index) in pluginsTopNew"
        :key="index"
        :path="`/plugin/${encodeURIComponent(item.permalink)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div class="likes">{{ excerpt(item.synopsis) }}</div>
          </div>
        </div>
      </factor-link>
    </section>

    <!-- <section if="pluginsNew.length > 0" class="plugins-new">
      <header class="section-header">
        <h1 class="title">New</h1>
      </header>
      <factor-link
        v-for="(item, index) in pluginsNew"
        :key="index"
        :path="`/plugin/${encodeURIComponent(item.permalink)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div v-if="item.createdAt" class="released">Released {{ standardDate(item.createdAt) }}</div>
          </div>
        </div>
      </factor-link>
    </section>

    <section v-if="pluginsRecentlyUpdated.length > 0" class="plugins-updated">
      <header class="section-header">
        <h1 class="title">Recently Updated</h1>
      </header>
      <factor-link
        v-for="(item, index) in pluginsRecentlyUpdated"
        :key="index"
        :path="`/plugin/${encodeURIComponent(item.permalink)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div v-if="item.updatedAt" class="released">Updated {{ standardDate(item.updatedAt) }}</div>
          </div>
        </div>
      </factor-link>
    </section>-->
  </div>
</template>

<script lang="ts">
import { standardDate } from "@factor/api"
import { factorLink } from "@factor/ui"
import { excerpt } from "@factor/api/excerpt"
export default {
  components: {
    factorLink,
  },
  props: {
    extensions: { type: Array, default: () => {} },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    pluginsPopular(this: any) {
      //Temporary Placeholder
      const getPopular = [].slice
        .call(this.extensions)
        .sort((a: any, b: any) => b.downloads - a.downloads)

      return getPopular.slice(0, 4)
    },
    pluginsTopNew(this: any) {
      //Temporary Placeholder
      const getTopNew = [].slice
        .call(this.extensions)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

      return getTopNew.slice(0, 4)
    },
    // pluginsNew(this: any) {

    //   const getLatestExtensions = [].slice
    //     .call(this.extensions)
    //     .sort(
    //       (a: any, b: any) =>
    //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //     )

    //   return getLatestExtensions.slice(0,4)
    // },
    // pluginsRecentlyUpdated(this: any) {
    //   const getRecentlyUpdated = [].slice
    //     .call(this.extensions)
    //     .sort(
    //       (a: any, b: any) =>
    //         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    //     )

    //   return getRecentlyUpdated.slice(0,4)
    // },
  },
  methods: {
    excerpt(text: string) {
      return excerpt(text, { length: 13 })
    },
    standardDate,
  },
}
</script>
<style lang="less">
.plugins-sidebar-container {
  .spinner-wrap {
    min-height: 400px;
  }

  .plugins-popular,
  .plugins-top-new,
  .plugins-new,
  .plugins-updated {
    margin-bottom: 2rem;
  }

  .section-header {
    margin-bottom: 1rem;
    .title {
      font-size: 0.9rem;
      text-transform: uppercase;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.5px;
      color: var(--color-text-secondary);
      @media (max-width: 900px) {
        font-size: 1.7em;
        line-height: 1.2;
      }
    }
  }

  .sidebar-plugin {
    display: grid;
    grid-template-columns: auto 3fr;
    grid-gap: 1rem;
    padding: 0.6rem 0;
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

    .plugin-icon {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 0.5rem;
      box-shadow: 0 2.5px 5px -1px rgba(50, 50, 93, 0.25),
        0 1.5px 3px -1.5px rgba(0, 0, 0, 0.3);
      background-color: #fff;
      img {
        width: 100%;
      }
    }
    .entry-content {
      .title {
        font-size: 1em;
        font-weight: 700;
        text-transform: capitalize;
      }
      .meta {
        opacity: 0.5;
        font-size: 0.9rem;
        .likes {
          display: inline-flex;
          align-items: center;
          img {
            margin-right: 0.3rem;
          }
        }
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
</style>
