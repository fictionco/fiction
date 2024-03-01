/**
 * Throttle a function to run only every period
 */
export function throttle(cb: (...args: any[]) => any, period: number): ((...args: any) => any) {
  let inThrottle = false
  let lastArgs: any[] | null = null

  return function (this: any, ...args: any[]): any {
    if (inThrottle) {
      // Save the last args passed in while throttling
      lastArgs = args
    }
    else {
      inThrottle = true
      cb.apply(this, args)
      setTimeout(() => {
        inThrottle = false
        // If there were calls during throttling, call with lastArgs
        if (lastArgs) {
          cb.apply(this, lastArgs)
          lastArgs = null // Reset lastArgs
        }
      }, period)
    }
  }
}
