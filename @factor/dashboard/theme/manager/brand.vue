<template>
  <div class="manager-brand">
    <div class="manager-brand-pad" @click="active = !active">
      <div class="menu-grid-item menu-media">
        <factor-avatar v-if="mode == 'account'" :user="getUser()" />
        <div v-else class="app-brand" :style="brandBackground" />
      </div>
      <div class="menu-grid-item menu-name">
        <div class="name">{{ menuName }}</div>
        <div v-if="menuSubName" class="sub">{{ menuSubName }}</div>
      </div>
      <div class="menu-grid-item action-icon">
        <factor-icon v-if="mode == 'account'" :icon="`fas fa-angle-${active ? 'down': 'up'}`" />
        <factor-icon v-else icon="fas fa-search" />
      </div>
    </div>

    <div v-if="active" class="slide-menu">SLIDew</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { factorAvatar, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import { currentUser } from "@factor/user"
export default Vue.extend({
  components: {
    factorAvatar,
    factorIcon
  },
  props: {
    mode: { type: String, default: "brand" }
  },
  data() {
    return { active: false }
  },
  computed: {
    currentUser,
    brandBackground(this: any) {
      return {
        backgroundImage: `url(${setting(`app.icon`)})`
      }
    },
    menuName(this: any) {
      if (this.mode == "brand") {
        return setting("app.name") || "Factor"
      } else {
        return this.getUser("displayName")
      }
    },
    menuSubName(this: any) {
      if (this.mode == "account") {
        return this.getUser("role")
      } else {
        return ""
      }
    }
  },
  methods: {
    setting,
    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    }
  }
})
</script>
<style lang="less">
.manager-brand {
  position: relative;
  --panel-movement: cubic-bezier(0.52, 0.01, 0.16, 1);

  .slide-menu {
    position: absolute;
    bottom: 100%;
    width: 100%;

    padding: 2rem;
    will-change: margin;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.25), 0 1px 3px -1px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
  .manager-brand-pad {
    cursor: pointer;

    border-radius: 5px;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 2rem 1fr 1rem;
    padding: 0.4rem 0.5rem;
    align-items: center;

    .menu-grid-item {
      min-width: 0;
    }
    .action-icon {
      text-align: right;
      opacity: 0.4;
    }
    &:hover {
      background-color: var(--color-bg-contrast);
      .action-icon {
        opacity: 1;
      }
    }
    .menu-name {
      .name {
        font-size: 1em;
        font-weight: var(--font-weight-bold);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .sub {
        opacity: 0.5;
        font-size: 0.84em;
      }
    }
    .menu-media {
      .avatar {
        width: 2.25rem;
        .thumb {
          border-radius: 5px;
        }
      }
      .app-brand {
        background-color: #fff;
        background-size: cover;
        background-position: 50%;
        box-shadow: var(--box-shadow-input);
        border-radius: 5px;
        width: 2.25rem;
        height: 2.25rem;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          display: block;
          width: 1.3rem;
          height: 1.3rem;
          margin: -0.1rem 0 0 -0.1rem;
          .icon-path {
            fill: var(--color-text);
          }
        }
      }
    }
  }
}
</style>


