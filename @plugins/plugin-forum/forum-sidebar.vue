<template>
  <div class="forum-sidebar">
    <div class="new-discussion">
      <factor-link
        btn="primary"
        :path="`${setting('forum.indexRoute')}/add-new`"
      >{{ setting("forum.text.newTopic") }}</factor-link>
    </div>
    <div class="forum-nav">
      <factor-input-select
        class="show-mobile"
        :list="categories"
        :value="$route.query.category || ''"
        @input="navigate($event)"
      />
      <div v-for="(item, index) in categories" :key="index" class="nav-item show-desktop">
        <factor-link
          class="menu-item-link"
          :path="setting(`forum.indexRoute`)"
          :query="{ category: !item.value ? null : item.value }"
        >
          <span class="item-text">{{ toLabel(item.name || item.value) }}</span>
        </factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { toLabel, parseList } from "@factor/api/utils"
import { setting } from "@factor/api/settings"
import { factorLink, factorInputSelect } from "@factor/ui"

interface NavItem {
  value: string
  name?: string
  path?: string
  home?: boolean
}
export default {
  components: {
    factorLink,

    factorInputSelect,
  },
  data() {
    return {
      selectNav: "",
    }
  },
  computed: {
    categories() {
      const categories = setting<NavItem[]>("forum.categories") ?? []

      const parsedCategories = parseList(categories)

      return [
        {
          name: setting("forum.text.listAll"),
          value: "",
        },
        ...parsedCategories,
      ]
    },
  },
  methods: {
    setting,
    toLabel,
    navigate(this: any, category: string | null) {
      const path = setting(`forum.indexRoute`)
      const query = { ...this.$route.query, category }

      // remove category from url if no val
      if (!category) delete query.category

      this.$router.push({ path, query })
    },
  },
}
</script>

<style lang="less">
.forum-sidebar {
  .new-discussion {
    .factor-link {
      display: block;
    }
    .factor-btn {
      font-size: 1.1em;
      width: 100%;
      display: block;
    }

    @media (max-width: 900px) {
      .factor-link,
      .factor-btn {
        width: 100%;
        max-width: 100%;
      }
    }
  }

  @media (max-width: 900px) {
    padding: 0 1rem;
  }

  .forum-nav {
    margin: 2rem 0;
    @media (max-width: 900px) {
      margin: 1rem 0;

      .select-standard {
        width: 100%;
      }
    }
    .show-mobile {
      display: none;
      @media (max-width: 900px) {
        display: block;
      }
    }

    .show-desktop {
      display: block;
      @media (max-width: 900px) {
        display: none;
      }
    }
  }
  .nav-item {
    letter-spacing: -0.02em;
    font-size: 1.2em;
    display: grid;
    margin-bottom: 0.3px;

    .menu-item-link {
      line-height: 1.2;

      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      color: inherit;
      display: block;
      &.router-link-exact-active,
      &:hover {
        background-color: var(--color-bg-contrast);
      }

      .item-icon {
        grid-area: icon;
        text-align: center;
        svg {
          width: 1.5em;
          display: block;
        }
      }
    }

    .item-text {
      grid-area: primary;
    }

    .sub-menu {
      display: grid;
      grid-template-areas: ". sub";
      .sub-menu-links {
        grid-area: sub;
        opacity: 0.6;
      }
    }
  }
}
</style>
