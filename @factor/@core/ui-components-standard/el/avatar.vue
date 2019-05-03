<template>
  <div class="avatar">
    <factor-loading-ring v-if="loading" :width="width" />
    <div v-else-if="src" :style="getStyle({backgroundImage: `url(${src})`})" class="thumb" />
    <div v-else :style="getStyle()" class="thumb">
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
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    width: { type: String, default: "32px" },
    uid: { type: String, default: "" },
    url: { type: String, default: "" }
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    uuid() {
      return this.uid && this.uid != "" ? this.uid : this.$uid
    },
    user() {
      return this.$store.getters["getItem"](this.uuid) || {}
    },
    src() {
      return this.url
        ? this.url
        : this.user.photoURL
        ? this.user.photoURL
        : false
    }
  },

  mounted() {
    if (this.uid) {
      this.doRequest(this.uid)
    } else {
      this.$user.init(() => {
        if (this.$uid) {
          this.doRequest(this.$uid)
        } else {
          this.loading = false
        }
      })
    }
  },

  methods: {
    async doRequest(uid) {
      await this.$user.request(uid)

      this.loading = false
    },
    getStyle(more = {}) {
      const width = this.width
      return { width, height: width, ...more }
    }
  }
}
</script>
<style lang="less" >
.avatar {
  position: relative;
  line-height: 1;
}
.thumb {
  background-position: 50%;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  .user-blank {
    fill: rgba(38, 67, 89, 0.3);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  // &:after {
  //   border: 1px solid rgba(0, 0, 0, 0.08);
  //   bottom: 0;
  //   content: "";
  //   left: 0;
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   border-radius: 50%;
  // }
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
