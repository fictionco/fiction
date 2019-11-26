import sanitizer from "sanitize-html"

export function sanitizeHtml(html) {
  return sanitizer(html, {
    allowedTags: false,
    allowedAttributes: false,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["data", "http", "https"]
    }
  })
}
