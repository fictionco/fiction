<template>
  <factor-modal :vis.sync="vis">
    <div v-if="title" class="signin-head">
      <div class="title">{{ title }}</div>
      <div class="sub-title">{{ subTitle }}</div>
    </div>
    <el-signin v-if="mode != 'confirmation'" :redirect="redirect" @done="done($event)" />
  </factor-modal>
</template>
<script>
import { onEvent, runCallbacks } from "@factor/tools"
export default {
  components: {
    "el-signin": () => import("./signin.vue")
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
      onEvent("signin-modal", (args = {}) => {
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

      runCallbacks("signin-modal-loaded")

      // If shown erroneously because its triggered before USER is initialized

      // this.$user.init(u => {
      //   if (u) {
      //     this.done()
      //   }
      // })
    }
  },
  methods: {
    done(credential) {
      if (this.callback && credential) {
        this.callback(credential)
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
<style lang="less">
.signin-head {
  line-height: 1.5;
  .title {
    font-size: 1.3em;
  }
}
</style>
