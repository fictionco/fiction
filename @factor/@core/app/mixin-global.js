import Factor from "vue"

const serverTitleMixin = {
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
}

export default (Factor.FACTOR_SSR === "server" ? serverTitleMixin : {})
