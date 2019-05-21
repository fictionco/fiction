<template>
  <factor-modal :vis.sync="vis">
    <div v-if="title" class="head">
      <div class="title">{{ title }}</div>
      <div class="sub-title">{{ subTitle }}</div>
    </div>
    <el-signin v-if="mode != 'confirmation'" :redirect="redirect" @done="done($event)" />
  </factor-modal>
</template>
<script>
export default {
  components: {
    "el-signin": () => import("./signin")
  },
  data: function() {
    return {
      vis: false,
      redirect: "",
      title: "",
      subTitle: "",
      mode: ""
    }
  },
  watch: {
    $route(to, from) {
      if (to.query.signInView) {
        this.vis = true
      }
    }
  },
  mounted() {
    if (this.$route.query.signInView) {
      this.vis = true
    } else {
      this.$events.$on("signin-modal", (args = {}) => {
        const {
          redirect = "",
          title = "",
          subTitle = "",
          mode = "default",
          callback = false
        } = args

        this.title = title
        this.subTitle = subTitle
        this.mode = mode
        this.redirect = redirect
        this.callback = callback

        this.vis = true
      })

      // If shown erroneously because its triggered before USER is initialized

      this.$user.init(u => {
        if (u) {
          this.done()
        }
      })
    }
  },
  methods: {
    getCredentialInfo(cred) {
      const {
        user: { uid },
        additionalUserInfo: { isNewUser, providerId }
      } = cred

      return { uid, isNewUser, providerId }
    },
    done(credential) {
      console.log("modal done")
      if (this.callback && credential) {
        this.callback.call(this, this.getCredentialInfo(credential))
      }
      if (this.redirect != "") {
        this.$router.push({ path: this.redirect })
        this.redirect = ""
      }

      this.vis = false
    }
  }
}
</script>
