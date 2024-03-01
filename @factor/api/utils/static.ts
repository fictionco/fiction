export function staticImageUrl(url: URL): string {
  return url.href.replace('file://', '/@fs')
}
