export default Factor => {
  return new (class {
    constructor() {
      this.metatags = []
      this.routeClass = []

      Factor.$filters.callback("ssr-matched-components", _ => this.ssrRouteClass(_))

      Factor.$filters.add("factor_head", _ => {
        _.push(this.getMetatagHtml(this.getMetatags()))
        return _
      })

      Factor.$filters.add("before-app", () => {
        if (Factor.FACTOR_SSR == "server") {
          this.serverMetatags()
        } else {
          this.clientTitleTag()
        }
      })

      // Factor.$filters.add("site-mixins", _ => {
      //   _.push(this.siteMixin())
      //   return _
      // })
    }

    // siteMixin() {
    //   const _this = this
    //   return {
    //     metatags() {
    //       return {
    //         ..._this.defaultMetatags(),
    //         priority: 20
    //       }
    //     }
    //   }
    // }

    serverMetatags() {
      const _this = this
      Factor.mixin({
        async created() {
          _this.setMetatags(this)
        }
      })
    }

    getMetatagHtml(metatags) {
      const { title, description, canonical, image } = metatags

      const list = []

      if (title) {
        list.push(`<title>${title}</title>`)
      }

      if (description) {
        list.push(`<meta name="description" content="${description}" />`)
      }

      if (canonical) {
        list.push(`<link rel="canonical" href="${canonical}" />`)
        list.push(`<meta property="og:url" content="${canonical}" />`)
      }

      if (image && !image.includes("base64")) {
        list.push(`<meta property="og:image" content="${image}" />`)
      }

      return list.join("")
    }

    async ssrRouteClass(components) {
      components.forEach(_ => this.setRouteClass(_))
    }

    setMetatags(context) {
      const { metatags } = context.$options
      if (metatags) {
        let metatagsObject =
          typeof metatags === "function" ? metatags.call(context) : metatags

        Factor.$globals.metatags.push(metatagsObject)
      }
    }

    setRouteClass(options) {
      if (!options) {
        return
      }
      const { routeClass } = options
      if (routeClass) {
        let routeClassArray =
          typeof routeClass === "function" ? routeClass.call(this) : routeClass

        if (typeof routeClassArray == "string") {
          routeClassArray = [routeClassArray]
        } else if (!routeClassArray) {
          return
        }

        Factor.$globals.routeClass.push(...routeClassArray)
      }
    }

    clientTitleTag() {
      const _this = this

      Factor.$filters.callback("client-route-after", ({ to, from, next }) => {
        Factor.$globals.routeClass = []
        Factor.$globals.metatags = []
      })

      Factor.mixin({
        created() {
          _this.setRouteClass(this.$options)
          _this.setMetatags(this)
        },
        watch: {
          $route: {
            handler: function() {
              _this.setMetatags(this)

              _this.setRouteClass(this.$options)
            }
          },
          immediate: true
        }
      })

      Factor.$filters.add("client-route-after", () => {
        // Wait for all components to load
        setTimeout(() => {
          const { title, titleSuffix } = {
            ...this.defaultMetatags(),
            ...this.getMetatags()
          }

          document.title = `${title} ${titleSuffix}`
        }, 70)
      })
    }

    getMetatags() {
      return Factor.$lodash.pickBy(Factor.$utils.sortMerge(Factor.$globals.metatags))
    }

    defaultMetatags(meta = {}) {
      const metatagSettings = Factor.$config.setting("metatags") || {}
      const currentPath = Factor.$router.currentRoute.path

      return {
        title: Factor.$utils.toLabel(currentPath.split("/").pop()),
        description: "",
        image: "",
        titleSuffix: "",
        priority: 20,
        ...metatagSettings
      }
    }

    titleTag(_id) {
      const { titleTag, title } = Factor.$store.val(_id) || {}
      return titleTag || title || ""
    }

    descriptionTag(_id) {
      const { descriptionTag, subTitle, content } = Factor.$store.val(_id) || {}
      return descriptionTag || subTitle || Factor.$utils.excerpt(content) || ""
    }

    shareImage(_id) {
      const { shareImage, avatar } = Factor.$store.val(_id) || {}
      const imageId = shareImage ? shareImage : avatar
      const { url } = Factor.$store.val(imageId) || {}
      return url ? url : ""
    }
  })()
}
