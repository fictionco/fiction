// based on SimpleHeat library
// https://github.com/mourner/simpleheat

const defaultRadius = 7
const defaultBlur = 15
const defaultMax = 1
const gradientStops: Record<number, string> = {
  0.1: 'blue',
  0.3: 'cyan',
  0.7: 'lime',
  0.8: 'yellow',
  1: 'red',
}
const minPointOpacity = 0.2

export interface HeatmapDataPoint { x: number, y: number, val?: number }

function colorize(imageData: ImageData, gradient: Uint8ClampedArray): ImageData {
  const pixels = imageData.data
  for (let i = 0, len = pixels.length, j; i < len; i += 4) {
    j = pixels[i + 3] * 4 // get gradient color from opacity value

    if (j) {
      imageData.data[i] = gradient[j]
      imageData.data[i + 1] = gradient[j + 1]
      imageData.data[i + 2] = gradient[j + 2]
    }
  }

  return imageData
}

function heatRadius(r = defaultRadius, blur = defaultBlur): { circle: HTMLCanvasElement, fullRadius: number } {
  const circle = document.createElement('canvas')
  const ctx = circle.getContext('2d')
  const fullRadius = r + blur

  circle.width = circle.height = fullRadius * 2

  if (!ctx)
    throw new Error('no 2d context')

  ctx.shadowOffsetX = ctx.shadowOffsetY = fullRadius * 2
  ctx.shadowBlur = blur
  ctx.shadowColor = 'black'

  ctx.beginPath()
  ctx.arc(-fullRadius, -fullRadius, r, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()

  return { circle, fullRadius }
}

function heatGradient(): Uint8ClampedArray {
  // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx)
    throw new Error('no 2d context')

  const gradient = ctx.createLinearGradient(0, 0, 0, 256)

  canvas.width = 1
  canvas.height = 256

  for (const i in gradientStops)
    gradient.addColorStop(+i, gradientStops[i])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)

  const gradientArray = ctx.getImageData(0, 0, 1, 256).data

  return gradientArray
}

export function drawHeatmap(heatmapCanvas: HTMLCanvasElement, data: HeatmapDataPoint[]): HTMLCanvasElement {
  const { circle, fullRadius } = heatRadius()
  const grad = heatGradient()
  const ctx = heatmapCanvas.getContext('2d')

  if (!ctx)
    throw new Error('no 2d context')

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // draw a gray scale heatmap by putting a blurred circle at each data point
  for (let i = 0, len = data.length, p: HeatmapDataPoint; i < len; i++) {
    p = data[i]
    const val = p.val || 1
    const x = p.x
    const y = p.y
    ctx.globalAlpha = Math.min(Math.max(val / defaultMax, minPointOpacity), 1)

    ctx.drawImage(circle, x - fullRadius, y - fullRadius)
  }

  // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
  const colored = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.putImageData(colorize(colored, grad), 0, 0)

  return heatmapCanvas
}
