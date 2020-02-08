<template>
  <factor-modal :vis.sync="vis" @close="close('modal')">
    <factor-signin
      :redirect="redirect"
      format="modal"
      @done="done($event)"
      @close="close('signin')"
    />
  </factor-modal>
</template>
<script lang="ts">
import { FactorUserCredential } from "@factor/user/types"
import { factorModal } from "@factor/ui"
import { onEvent, runCallbacks } from "@factor/api"
import Vue from "vue"
import { Route } from "vue-router"
import { notifySignedIn } from "."
interface ModalArguments {
  redirect?: string
  view?: string | null
  callback?: Function
  user?: FactorUserCredential
}
export default Vue.extend({
  components: {
    factorModal,
    factorSignin: () => import("./sign-in.vue")
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
  computed: {
    view(this: any) {
      return this.$route.query.view || ""
    }
  },
  watch: {
    $route(this: any, to: Route) {
      if (to.query.signInView) {
        this.vis = true
      }
    }
  },
  mounted() {
    if (this.$route.query.signInView) {
      this.vis = true
    } else {
      onEvent("sign-in-modal", (args: ModalArguments = {}) => {
        const { redirect = "", view = null, user } = args
        this.user = user
        this.redirect = redirect
        if (view && this.view != view) {
          this.setView(view)
        }

        this.vis = true
      })

      /**
       * Allow modules to wait for loading before triggering this modal with an event
       */
      runCallbacks("sign-in-modal-loaded")
    }
  },
  methods: {
    setView(this: any, view?: string | null) {
      const query = { ...this.$route.query, view }

      if (!view) {
        delete query.view
      }

      if (query != this.$route.query) {
        this.$router.replace({ query })
      }
    },
    close(this: any) {
      this.vis = false

      if (this.view) {
        this.setView(null)
      }

      notifySignedIn()
    },
    done(this: any) {
      if (this.redirect != "") {
        this.$router.push({ path: this.redirect })
        this.redirect = ""
      }

      this.close()
    }
  }
})
</script>
