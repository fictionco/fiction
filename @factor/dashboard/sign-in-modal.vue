<template>
  <factor-modal :vis.sync="vis">
    <div v-if="title" class="signin-head">
      <div class="title">{{ title }}</div>
      <div class="sub-title">{{ subTitle }}</div>
    </div>
    <el-signin v-if="mode != 'confirmation'" :redirect="redirect" @done="done($event)" />
  </factor-modal>
</template>
<script lang="ts">
import { factorModal } from "@factor/ui"
import { onEvent, runCallbacks } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorModal,
    "el-signin": () => import("./sign-in.vue")
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
    $route(to) {
      if (to.query.signInView) {
        this.vis = true
      }
    }
  },
  mounted() {
    if (this.$route.query.signInView) {
      this.vis = true
    } else {
      onEvent("sign-in-modal", (args = {}) => {
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

      runCallbacks("sign-in-modal-loaded")

      // If shown erroneously because its triggered before USER is initialized
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
})
</script>
<style lang="less">
.signin-head {
  line-height: 1.5;
  .title {
    font-size: 1.3em;
  }
}
</style>
