/**
 * Gets the URL if set by <link ref="canonical"> tag
 */
export function canonicalUrlFromTag(): string | null {
  const tags = document.querySelectorAll('link')
  for (let i = 0, tag; (tag = tags[i]); i++) {
    if (tag.getAttribute('rel') === 'canonical')
      return tag.getAttribute('href')
  }
  return null
}
/**
 * Return the canonical URL and remove the hash.
 */
export function getCanonicalUrl(): string {
  const { search = '' } = location
  const canonical = canonicalUrlFromTag()
  let url
  if (!canonical)
    url = window.location.href.replace(/#.*$/, '')
  else if (/\?/.test(canonical))
    url = canonical
  else
    url = canonical + search

  return url
}
