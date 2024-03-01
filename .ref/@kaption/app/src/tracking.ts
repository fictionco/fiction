declare global {
  interface Window {
    gtag: (a: string, b: string, c: Record<string, any>) => void
  }
}

function gtagReportConversion(): false {
  if (!window.gtag)
    throw new Error('gtag is missing')

  window.gtag('event', 'conversion', {
    send_to: 'AW-334392610/Ygj6CNC30tkCEKLauZ8B',
  })
  return false
}

export function trackPrimaryConversion(): void {
  gtagReportConversion()
}
