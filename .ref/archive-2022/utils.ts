import { activeProject } from '@kaption/core/utils'
import { activeUser } from '@factor/api'

let __loops: 1
let __timer: NodeJS.Timeout
export async function checkIfSiteActiveLoop(reset = false): Promise<void> {
  if (__timer)
    clearTimeout(__timer)
  if (reset)
    __loops = 1

  // if active site is changed
  if (
    !activeUser.value
    || !activeProject.value
    || activeProject.value?.trackingStatus === 'active'
  )
    return

  const project = await endpointsMap.RefreshTrackingStatus.request({
    projectId: activeProject.value.projectId,
  })

  if (project.trackingStatus === 'active')
    return

  __timer = setTimeout(async () => {
    __loops++
    await checkIfSiteActiveLoop()
  }, 10_000 + 3000 * __loops)
}

// const RGB_COLOR_PRIMARY = "84,53,255"
// const RGB_COLOR_SECONDARY = "255,138,0"
// const RGB_COLOR_CONTRAST = "247,246,255"
// export enum StandardColor {
//   "primary",
//   "secondary",
//   "contrast",
//   "border",
//   "text",
// }

// export const getColorRGB = (color: StandardColor): string => {
//   if (color === StandardColor.primary) {
//     return RGB_COLOR_PRIMARY
//   } else if (color === StandardColor.contrast) {
//     return RGB_COLOR_CONTRAST
//   } else {
//     return RGB_COLOR_SECONDARY
//   }
// }

// export const rgba = ({
//   color,
//   rgb = RGB_COLOR_PRIMARY,
//   opacity = 1,
// }: {
//   color?: StandardColor
//   rgb?: string
//   opacity?: number
// }): string => {
//   rgb = color ? getColorRGB(color) : rgb
//   return `rgba(${rgb}, ${opacity})`
// }
