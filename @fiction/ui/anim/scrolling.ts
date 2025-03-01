export async function smoothScrollToView(args: {
  element: HTMLElement
  container?: HTMLElement
  duration?: number
  onlyIfNeeded?: boolean
  containerClass?: string
}): Promise<boolean> {
  const {
    element,
    duration = 400,
    onlyIfNeeded = true,
    containerClass = 'scroll-container',
  } = args

  // Find or use provided container
  const container = args.container || getScrollContainer(element, containerClass)
  if (!container)
    return false

  // Check if element is already visible
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const isVisible = (
    elementRect.top >= containerRect.top
    && elementRect.bottom <= containerRect.bottom
  )

  // Skip if already visible and onlyIfNeeded is true
  if (isVisible && onlyIfNeeded)
    return false

  // Calculate target position (center element in container)
  const elementTop = element.offsetTop
  const containerHeight = container.clientHeight
  const elementHeight = element.offsetHeight
  const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2)

  const startScroll = container.scrollTop
  const distance = targetScroll - startScroll

  // Skip small movements
  if (Math.abs(distance) < 20)
    return false

  const startTime = performance.now()

  // Cubic-bezier(0.25,1,0.33,1) easing function
  function easing(t: number): number {
    return 3 * t - 3 * t * t + t * t * t
  }

  return new Promise<boolean>((resolve) => {
    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const t = Math.min(elapsed / duration, 1)
      const p = easing(t)

      if (!container)
        return resolve(false)

      container.scrollTop = startScroll + p * distance

      if (t < 1) {
        requestAnimationFrame(step)
      }
      else {
        resolve(true)
      }
    }

    requestAnimationFrame(step)
  })
}

/**
 * Gets the scrollable parent container of an element
 */
function getScrollContainer(element: HTMLElement, extraClass = 'scroll-container'): HTMLElement | null {
  if (!element)
    return null

  let parent = element.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    if ((style.overflowY === 'scroll' || style.overflowY === 'auto'
      || parent.classList.contains('overflow-y-scroll')
      || parent.classList.contains(extraClass))
    && parent.scrollHeight > parent.clientHeight) {
      return parent
    }
    parent = parent.parentElement
  }
  return null
}
