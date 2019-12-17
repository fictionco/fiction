import { addFilter, setting } from "@factor/api"

export const setup = (): void => {
  const googleTagManagerId = setting("googleTagManager.googleTagManagerId")
  const developmentMode = setting("googleTagManager.developmentMode")

  // Don't load in development by default
  if ((process.env.NODE_ENV != "production" && !developmentMode) || !googleTagManagerId) {
    return
  }

  addFilter({
    key: "tagManagerScript",
    hook: "factor_head",
    callback: (_: string[]): string[] => {
      const add = `<script>
      ; (function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : ""
        j.async = true
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, "script", "dataLayer", "${googleTagManagerId}")
    </script>`

      return [..._, add]
    },
    priority: 200
  })

  addFilter({
    key: "tagManagerBodyScript",
    hook: "factor_body_start",
    callback: (_: string[]): string[] => {
      const add = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript>
  `
      return [..._, add]
    }
  })
}
setup()
