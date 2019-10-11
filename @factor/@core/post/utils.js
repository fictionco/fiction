export default Factor => {
  return new (class {
    excerpt(content, { length = 30 } = {}) {
      if (!content) {
        return ""
      }
      let splitContent = Factor.$markdown
        .strip(content)
        .replace(/\n|\r/g, " ")
        .split(" ")

      let excerpt

      if (splitContent.length > length) {
        splitContent = splitContent.slice(0, length)
        excerpt = splitContent.join(" ") + "..."
      } else {
        excerpt = splitContent.join(" ")
      }

      return excerpt
    }
  })()
}
