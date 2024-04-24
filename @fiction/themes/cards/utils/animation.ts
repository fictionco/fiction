import type { vue } from '@fiction/core'
import { waitFor } from '@fiction/core'

export async function useElementVisible(args: { selector: string, tracker: vue.Ref }): Promise<void> {
  await waitFor(30)
  const { selector, tracker } = args
  if (typeof IntersectionObserver === 'undefined')
    console.warn('IntersectionObserver is not supported here.')

  const observer = new IntersectionObserver((entries, observer) => {
    const [entry] = entries
    if (entry.isIntersecting) {
      tracker.value = true
      observer.disconnect() // Disconnect after the element is visible
    }
  }, {
    threshold: 0.1, // Customize the threshold as needed
  })

  // Ensure the element is present in the DOM
  const element = document.querySelector(selector)
  if (element)
    observer.observe(element)
  else
    console.warn(`Element with selector ${selector} not found at the time of observer setup.`)
}
