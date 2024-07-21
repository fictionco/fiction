/**
 * Throttle a function to run only every period
 */
export function throttle(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let lastTime = 0
  let timeout: NodeJS.Timeout | null = null

  return function (...args: any[]) {
    const now = Date.now()
    const remaining = wait - (now - lastTime)
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastTime = now
      func(...args)
    }
    else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }
}

/**
 * multiple sequential calls to a function into a single call
 */
export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    if (timeoutId !== null)
      clearTimeout(timeoutId)

    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Parse a simple handlebars template
 */
export function simpleHandlebarsParser(template: string, context: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match: string, key: string): string => {
    return Object.prototype.hasOwnProperty.call(context, key) ? context[key] : match
  })
}
