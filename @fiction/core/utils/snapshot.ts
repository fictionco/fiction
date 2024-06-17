export async function snapshotHtml(html: string, options: { hideTags?: string[], maskIds?: boolean }) {
  const prettier = await import('prettier')
  const { hideTags = [], maskIds } = options

  let modifiedHtml = hideTags.reduce((accHtml, el) => {
    const regex = new RegExp(`<${el}\\b[^>]*>([\\s\\S]*?)<\\/${el}>`, 'gi')
    return accHtml.replace(regex, `[HIDDEN_${el.toUpperCase()}]`)
  }, html)

  if (maskIds) {
    const idRegex = /id="([^\d"]*\d[^"]*)"/g
    modifiedHtml = modifiedHtml.replace(idRegex, (match, p1) => `id="${p1.replace(/\d/g, '*')}"`)
  }

  // Format with Prettier
  const prettyHtml = prettier.format(modifiedHtml, { parser: 'html', singleQuote: false, printWidth: 180 })

  return prettyHtml
}
