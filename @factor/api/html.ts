import sanitizer from "sanitize-html"

export const sanitizeHtml = (html: string): string => {
  return sanitizer(html, {
    allowedTags: false,
    allowedAttributes: false,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["data", "http", "https"],
    },
  })
}
