<template>
  <div class="plugins-sidebar-container">
    <section if="pluginsPopular.length > 0" class="mb-8">
      <header class="mb-4">
        <h1 class="font-bold text-md uppercase text-color-500 tracking-wide">
          Popular
        </h1>
      </header>
      <router-link
        v-for="(item, index) in pluginsPopular"
        :key="index"
        :to="`/plugin/${encodeURIComponent(item.path)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div class="rating">{{ excerpt(item.description) }}</div>
          </div>
        </div>
      </router-link>
    </section>

    <section class="mb-8">
      <header class="mb-4">
        <h1 class="font-bold text-md uppercase text-color-500 tracking-wide">
          Top New
        </h1>
      </header>
      <router-link
        v-for="(item, index) in pluginsTopNew"
        :key="index"
        :to="`/plugin/${encodeURIComponent(item.path)}`"
        class="sidebar-plugin"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />

        <div class="entry-content">
          <h3 class="title">{{ item.title }}</h3>
          <div class="meta">
            <div class="likes">{{ excerpt(item.description) }}</div>
          </div>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
import { excerpt } from "@factor/api/excerpt"
import { computed } from "vue"

export default {
  components: {},
  props: {
    extensions: { type: Array, default: () => {} },
  },
  setup(props) {
    const pluginsPopular = computed(() => {
      //Temporary Placeholder
      const getPopular = Array.prototype.slice
        .call(props.extensions)
        .sort((a: any, b: any) => b.downloads - a.downloads)

      return getPopular.slice(0, 4)
    })

    const pluginsTopNew = computed(() => {
      //Temporary Placeholder
      const getTopNew = Array.prototype.slice
        .call(props.extensions)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

      return getTopNew.slice(0, 4)
    })

    return { pluginsPopular, pluginsTopNew, excerpt }
  },
}
</script>
<style lang="less">
.plugins-sidebar-container {
  // .plugins-popular,
  // .plugins-top-new,
  // .plugins-new,
  // .plugins-updated {
  //   margin-bottom: 2rem;
  // }

  // .mb-4 {
  //   margin-bottom: 1rem;
  //   .title {
  //     font-size: 0.9rem;
  //     text-transform: uppercase;
  //     font-weight: 700;
  //     line-height: 1.1;
  //     letter-spacing: 0.5px;
  //     color: var(--color-text-secondary);
  //     @media (max-width: 900px) {
  //       font-size: 1.7em;
  //       line-height: 1.2;
  //     }
  //   }
  // }

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
