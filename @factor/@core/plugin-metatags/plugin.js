export default Factor => {
  return new class {
    constructor() {
      this.metatags = []

      Factor.$filters.addFilter("mixins", _ => {
        _.metatags = Factor.FACTOR_SSR == "server" ? this.serverMetatags() : this.clientTitleTag()
        return _
      })
    }
    serverMetatags() {
      return () => {
        Factor.mixin({
          async created() {
            const mtOpt = this.$options.metatags
            let mt = false

            if (mtOpt) {
              mt = typeof mtOpt === "function" ? mtOpt.call(this) : mtOpt
            }

            if (mt) {
              const titleSuffix = mt.titleSuffix || this.$ssrContext.metatags.titleSuffix

              if (titleSuffix && (!mt.title || mt.title.indexOf(titleSuffix) === -1)) {
                mt.title = mt.title + titleSuffix
              }

              if (mt.image && mt.image.indexOf("//") === -1) {
                mt.image = Factor.$config.setting("url") + mt.image
              }

              mt = this.$lodash.pickBy(mt, this.$lodash.identity)

              const existingMetatags = this.$ssrContext.metatags || {}
              this.$ssrContext.metatags = { ...existingMetatags, ...mt }
            }
          }
        })
      }
    }

    clientTitleTag() {
      const that = this
      console.log("CLIENT TITLE")
      Factor.mixin({
        watch: {
          $route: {
            handler: function() {
              const { metatags } = this.$options

              if (metatags) {
                const mt = typeof metatags === "function" ? metatags.call(this) : metatags

                that.metatags.push(mt)
              }
            },
            immediate: true
          }
        }
      })

      Factor.$filters.add("client-route-loaded", () => {
        setTimeout(() => {
          let finalMeta = {}

          const sorted = Factor.$utils.sortPriority(this.metatags)

          sorted.forEach(mt => {
            finalMeta = { ...finalMeta, ...mt }
          })

          const { title = "", titleSuffix = "" } = finalMeta

          document.title = `${title} ${titleSuffix}`
        }, 70)
      })
    }
  }()
}
