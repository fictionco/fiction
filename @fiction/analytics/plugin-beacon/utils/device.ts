import { UAParser } from 'ua-parser-js'
import type { FictionEvent, TrackingScreen } from '../../tracking.js'

export function getDeviceTypeByWidth(screen: Partial<TrackingScreen>): 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'unknown' | 'largeDesktop' {
  const width = screen.width

  if (!width)
    return 'unknown'
  else if (width < 600)
    return 'mobile'
  else if (width < 950)
    return 'tablet'
  else if (width <= 1550)
    return 'laptop'
  else if (width > 2100)
    return 'desktop'
  else return 'desktop'
}

export function parseUa(event: FictionEvent): { os: string, browser: string, deviceType: string } {
  const { context: { userAgent, screen = {} } = {} } = event
  const parsed = new UAParser(userAgent).getResult()
  const { os, browser, device } = parsed

  const deviceType
    = !device.type || device.type === 'console'
      ? getDeviceTypeByWidth(screen)
      : device.type ?? 'unknown'

  return { os: os.name as string, browser: browser.name as string, deviceType }
}
