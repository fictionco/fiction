<template>
  <div class="avatar">
    <div
      v-if="hasImage"
      :style="getStyle({ backgroundImage: `url(${src})` })"
      class="thumb thumb-src"
    />

    <div v-else-if="!hasImage" :style="getStyle()" class="thumb thumb-default">
      <svg
        class="user-blank"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
        style="enable-background:new 0 0 24 24;"
        xml:space="preserve"
      >
        <g class="st0">
          <path
            d="M12,5c1.7,0,3,1.3,3,3s-1.3,3-3,3S9,9.7,9,8S10.3,5,12,5z M12,19.2c-2.5,0-4.7-1.3-6-3.2c0-2,4-3.1,6-3.1c2,0,6,1.1,6,3.1
          C16.7,17.9,14.5,19.2,12,19.2z"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import gravatar from "gravatar"
import { stored } from "@factor/api"
import { userInitialized } from "@factor/user"
import Vue from "vue"
export default Vue.extend({
  props: {
    width: { type: String, default: "" },
    postId: { type: String, default: "" },
    url: { type: String, default: "" },
    email: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    user: { type: [Object, undefined], default: undefined }
  },
  data() {
    return {
      init: true
    }
  },
  computed: {
    hasImage(this: any) {
      return this.src ? true : false
    },

    avatar(this: any) {
      const avatarId = this.postId || this.user?.avatar

      return avatarId ? stored(avatarId) ?? {} : {}
    },
    src(this: any) {
      if (this.url) {
        return this.url
      } else if (this.avatar && this.avatar.url) {
        return this.avatar.url
      } else if (this.user) {
        return gravatar.url(this.user.email, { s: "200", d: "identicon" }) || ""
      } else {
        return ""
      }
    }
  },
  async mounted() {
    await userInitialized()

    /**
     * SSR struggles with SVGs
     */

    this.init = false
  },

  methods: {
    getStyle(this: any, more = {}) {
      const width = this.width

      const dimension = this.width ? { width, height: width } : {}

      return { ...dimension, ...more }
    }
  }
})
</script>
<style lang="less">
.avatar {
  position: relative;
  line-height: 1;
}
.thumb {
  background-position: 50%;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  &.thumb-src {
    padding: 50% 0;
  }
  .user-blank {
    opacity: 0.6;
    fill: var(--color-placeholder);
    box-shadow: var(--box-shadow-input);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  width: 100%;
}

.multi-thumb {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-wrap: wrap;
  .mthumb {
    border-radius: 50%;
    background-position: 50%;
    background-size: cover;
  }
}
</style>
