<template>
  <div class="flame-wrap">
    <factor-btn
      size="large"
      class="btn-flame"
      :class="added ? 'added': 'not-added'"
      @click="addFlame"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.82 54.27">
        <path
          class="a"
          d="M23.3,54.27a23.27,23.27,0,0,1-14-4.6C2.74,44.88-.46,38.28.05,30.58A24.78,24.78,0,0,1,4.13,19.09a2.42,2.42,0,0,1,1.55-1L6.35,18l.61.43a2.74,2.74,0,0,1,1,1.71A16.77,16.77,0,0,0,9.42,25.2,11.35,11.35,0,0,0,12.32,29a29.39,29.39,0,0,1,.46-14.34A22.8,22.8,0,0,1,22.09,2.38c1-.66,2-1.24,3-1.79L25.6.3a2.28,2.28,0,0,1,2.29,0,2.29,2.29,0,0,1,.9,2.14C28,8.05,29.2,13.7,32.56,20.22A19.8,19.8,0,0,1,36.66,12a2.14,2.14,0,0,1,2.12-.85,2,2,0,0,1,1.55,1.52,18.94,18.94,0,0,0,2.29,4.85c.43.73.86,1.46,1.26,2.21a24.37,24.37,0,0,1,.76,21.71C42,47.7,37.15,51.71,30.24,53.4A29.44,29.44,0,0,1,23.3,54.27ZM5.43,22.86a19.5,19.5,0,0,0-2.38,7.92C2.6,37.49,5.3,43,11.06,47.25c5.27,3.85,11.48,4.94,18.46,3.23C35.47,49,39.62,45.61,41.88,40.3a21.47,21.47,0,0,0-.66-19.14c-.37-.7-.78-1.39-1.18-2.08a28.78,28.78,0,0,1-2-3.82,14,14,0,0,0-2.6,6c-.12.86-.18,1.74-.24,2.68,0,.46-.06.93-.1,1.41l-.41,4.95-3.13-5.66C31,23.68,30.5,22.76,30,21.82c-3.42-6.56-4.83-12.35-4.37-18.1-.65.37-1.27.74-1.86,1.14a19.62,19.62,0,0,0-8.13,10.72c-1.24,4-1.32,8.28-.27,13.47.11.56.24,1.11.37,1.72l.84,3.78-3-1.26-.54-.24a13.52,13.52,0,0,1-6.33-6.54A17.92,17.92,0,0,1,5.43,22.86ZM25.82,2V2Z"
        />
      </svg>
    </factor-btn>
    <span class="btn-flame-counter">{{ count }} Flames</span>
  </div>
</template>

<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  data() {
    return {
      count: null,
      added: false,
      addKey: ""
    }
  },
  mounted() {
    this.$user.init(async () => {
      if (this.$userId) {
        this.addKey = this.$userId
      } else {
        this.addKey = await this.userIp()
      }

      const { count, added } = await this.$posts.flameStatus({
        key: this.addKey,
        id: this.postId
      })

      this.count = count
      this.added = added
    })
  },
  methods: {
    addFlame() {
      if (this.added && this.count > 0) {
        this.count--
        this.added = false
        this.$posts.flame({
          action: "remove",
          key: this.addKey,
          id: this.postId
        })
      } else {
        this.added = true
        this.count++
        this.$posts.flame({ action: "add", key: this.addKey, id: this.postId })
      }
    },
    async userIp() {
      const r = await this.$http.get(`https://api.ipify.org`)
      return r.data
    }
  }
}
</script>
<style lang="less">
.flame-wrap {
  .btn-flame {
    border-radius: 50%;
    height: 60px;
    width: 60px;
    padding: 0;
    svg {
      width: 33px;
      height: 33px;
      line-height: 33px;
      path {
        fill: #506677;
        transition: fill 0.1s ease-in-out;
      }
    }
    &.added svg path,
    &:hover svg path {
      fill: #0496ff;
    }
  }
  .btn-flame-counter {
    font-weight: 600;
    margin-left: 15px;
  }
}
</style>