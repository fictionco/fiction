import { inIFrame } from '@factor/api/utils/utils'
import { log } from '@factor/api/plugin-log'

/**
 * Establish if we should be tracking this browser
 */
export function shouldTrack(): boolean | void {
  if (inIFrame())
    return log.error('shouldTrack', 'in iFrame')

  if (navigator.doNotTrack === '1')
    return log.error('shouldTrack', 'doNotTrack is 1')

  return true
}
