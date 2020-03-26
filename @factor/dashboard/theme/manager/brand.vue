<template>
  <div class="manager-brand">
    <div class="manager-brand-pad">
      <div class="menu-grid-item menu-media">
        <factor-avatar v-if="mode == 'account'" :user="getUser()" />
        <div v-else class="app-brand" :style="brandBackground">
          <!-- <img :src="setting(`app.icon`)" /> -->
          <!-- <svg
            width="340"
            height="336"
            viewBox="0 0 340 336"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                class="icon-path"
                d="M292.66 335.466H145.832C136.313 335.466 127.353 331.811 120.633 325.167L8.63634 214.432C0.236593 206.127 -2.33933 193.614 2.25253 182.762C6.8444 171.799 17.4841 164.712 29.4677 164.712H166.552V29.0624C166.552 17.2137 173.719 6.69393 184.695 2.1538C195.559 -2.27559 208.55 0.27131 216.838 8.46568L328.835 119.2C335.555 125.955 339.251 134.703 339.251 144.116V289.289C339.363 314.758 318.419 335.466 292.66 335.466ZM151.992 285.524H288.852V150.206L217.062 79.2252V214.543H80.2022L151.992 285.524Z"
              />
            </g>
          </svg>-->
        </div>
      </div>
      <div class="menu-grid-item menu-name">
        <div class="name">{{ menuName }}</div>
        <div v-if="menuSubName" class="sub">{{ menuSubName }}</div>
      </div>
      <div class="menu-grid-item action-icon">
        <factor-icon v-if="mode == 'account'" icon="fas fa-angle-up" />
        <factor-icon v-else icon="fas fa-search" />
      </div>
    </div>
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
</style>


